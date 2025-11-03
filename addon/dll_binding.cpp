#include <napi.h>
#include <windows.h>
#include <string>
#include <thread>

// string to wstring helper function
std::wstring StringToWString(const std::string& str) {
  if (str.empty()) return std::wstring();
  int size_needed = MultiByteToWideChar(CP_UTF8, 0, &str[0], (int)str.size(), NULL, 0);
  std::wstring wstrTo(size_needed, 0);
  MultiByteToWideChar(CP_UTF8, 0, &str[0], (int)str.size(), &wstrTo[0], size_needed);
  return wstrTo;
}

typedef bool (*IsBaeminInstalled)();
typedef bool (*IsBaeminRunning)();

// Delivery callback function type
typedef bool (*NewDeliveryCallback)(const WCHAR*, const WCHAR*, const WCHAR*, 
                                const WCHAR*, const WCHAR*, const WCHAR*, 
                                const WCHAR*, const WCHAR*, int, int, int, const WCHAR*);
typedef bool (*RegisterNewDeliveryFunction)(NewDeliveryCallback);

typedef void (*StatusChangedCallback)(const WCHAR*, int);
typedef bool (*RegisterStatusChangedFunction)(StatusChangedCallback);

typedef void (*DisconnectedCallback)();
typedef bool (*RegisterDisconnectedFunction)(DisconnectedCallback);

typedef int (*InitializeService)(const WCHAR*);
typedef int (*FinalizeService)();

typedef int (*UpdateDeliveryStatus)(const WCHAR*, int, const WCHAR*, const WCHAR*, int);

// global ThreadSafeFunction declaration
Napi::ThreadSafeFunction* gNewDeliveryCallback = nullptr;
Napi::ThreadSafeFunction* gStatusChangedCallback = nullptr;
Napi::ThreadSafeFunction* gDisconnectedCallback = nullptr;

// C styled callback function for delivery
bool delivery_callback(const WCHAR* orderNo, const WCHAR* roadNameAddress, 
                      const WCHAR* address, const WCHAR* addressDetail,
                      const WCHAR* phoneNo, const WCHAR* latitude, 
                      const WCHAR* longitude, const WCHAR* title,
                      int quantity, int amount, int paymentType, const WCHAR* memo) {
  if (gNewDeliveryCallback) {
    gNewDeliveryCallback->BlockingCall([orderNo, roadNameAddress, address, addressDetail,
      phoneNo, latitude, longitude, title,
      quantity, amount, paymentType, memo](Napi::Env env, Napi::Function jsCallback) {

      Napi::Object deliveryData = Napi::Object::New(env);
      deliveryData.Set("orderNo", Napi::String::New(env, (const char16_t*)orderNo));
      deliveryData.Set("roadNameAddress", Napi::String::New(env, (const char16_t*)roadNameAddress));
      deliveryData.Set("address", Napi::String::New(env, (const char16_t*)address));
      deliveryData.Set("addressDetail", Napi::String::New(env, (const char16_t*)addressDetail));
      deliveryData.Set("phoneNo", Napi::String::New(env, (const char16_t*)phoneNo));
      deliveryData.Set("latitude", Napi::String::New(env, (const char16_t*)latitude));
      deliveryData.Set("longitude", Napi::String::New(env, (const char16_t*)longitude));
      deliveryData.Set("title", Napi::String::New(env, (const char16_t*)title));
      deliveryData.Set("quantity", Napi::Number::New(env, quantity));
      deliveryData.Set("amount", Napi::Number::New(env, amount));
      deliveryData.Set("paymentType", Napi::Number::New(env, paymentType));
      deliveryData.Set("memo", Napi::String::New(env, (const char16_t*)memo));
      
      jsCallback.Call({deliveryData});
    });
  }
  return true;
}

void status_changed_callback(const WCHAR* orderNo, int status) {
  if (gStatusChangedCallback) {
    gStatusChangedCallback->BlockingCall([orderNo, status](Napi::Env env, Napi::Function jsCallback) {
      Napi::Object statusData = Napi::Object::New(env);
      statusData.Set("orderNo", Napi::String::New(env, (const char16_t*)orderNo));
      statusData.Set("status", Napi::Number::New(env, status));

      jsCallback.Call({statusData});
    });
  }
}

void disconnected_callback() {
  if (gDisconnectedCallback) {
    gDisconnectedCallback->BlockingCall([](Napi::Env env, Napi::Function jsCallback) {
      jsCallback.Call({});
    });
  }
}

class DllBinding : public Napi::ObjectWrap<DllBinding> {
public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports) {
    Napi::Function func = DefineClass(env, "DllBinding", {
      InstanceMethod("loadDll", &DllBinding::LoadDll),
      // Baemin DLL functions
      InstanceMethod("isBaeminInstalled", &DllBinding::IsBaeminInstalled),
      InstanceMethod("isBaeminRunning", &DllBinding::IsBaeminRunning),
      InstanceMethod("registerNewDeliveryFunction", &DllBinding::RegisterNewDeliveryFunction),
      InstanceMethod("registerStatusChangedFunction", &DllBinding::RegisterStatusChangedFunction),
      InstanceMethod("registerDisconnectedFunction", &DllBinding::RegisterDisconnectedFunction),
      InstanceMethod("initializeService", &DllBinding::InitializeService),
      InstanceMethod("finalizeService", &DllBinding::FinalizeService),
      InstanceMethod("updateDeliveryStatus", &DllBinding::UpdateDeliveryStatus)
    });

    exports.Set("DllBinding", func);
    return exports;
  }

  DllBinding(const Napi::CallbackInfo& info) : Napi::ObjectWrap<DllBinding>(info) {
    hModule = nullptr;
  }

private:
  HMODULE hModule;

  Napi::Value LoadDll(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1) {
      Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
      return env.Null();
    }

    std::string dllPath = info[0].As<Napi::String>();
    hModule = LoadLibraryA(dllPath.c_str());
    
    if (hModule == nullptr) {
      return Napi::Boolean::New(env, false);
    }
    
    return Napi::Boolean::New(env, true);
  }  

  Napi::Value IsBaeminInstalled(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (hModule == nullptr) {
      Napi::Error::New(env, "DLL not loaded").ThrowAsJavaScriptException();
      return env.Null();
    }

    ::IsBaeminInstalled baeminInstalled = (::IsBaeminInstalled)GetProcAddress(hModule, "IsBaeminInstalled");
    if (baeminInstalled == nullptr) {
      Napi::Error::New(env, "IsBaeminInstalled function not found in DLL").ThrowAsJavaScriptException();
      return env.Null();
    }

    bool result = baeminInstalled();
    return Napi::Boolean::New(env, result);
  }  

  Napi::Value IsBaeminRunning(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (hModule == nullptr) {
      Napi::Error::New(env, "DLL not loaded").ThrowAsJavaScriptException();
      return env.Null();
    }

    ::IsBaeminRunning baeminRunning = (::IsBaeminRunning)GetProcAddress(hModule, "IsBaeminRunning");
    if (baeminRunning == nullptr) {
      Napi::Error::New(env, "IsBaeminRunning function not found in DLL").ThrowAsJavaScriptException();
      return env.Null();
    }

    bool result = baeminRunning();
    return Napi::Boolean::New(env, result);
  }

  Napi::Value RegisterNewDeliveryFunction(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (hModule == nullptr) {
      Napi::Error::New(env, "DLL not loaded").ThrowAsJavaScriptException();
      return env.Null();
    }

    ::RegisterNewDeliveryFunction registerNewDeliveryFunction = (::RegisterNewDeliveryFunction)GetProcAddress(hModule, "RegisterNewDeliveryFunction");
    if (registerNewDeliveryFunction == nullptr) {
      Napi::Error::New(env, "RegisterNewDeliveryFunction function not found in DLL").ThrowAsJavaScriptException();
      return env.Null();
    }

    // Wrap JavaScript callback function with ThreadSafeFunction
    Napi::Function callback = info[0].As<Napi::Function>();
    
    // Release existing ThreadSafeFunction if exists
    if (gNewDeliveryCallback) {
      gNewDeliveryCallback->Release();
      delete gNewDeliveryCallback;
    }
    
    // Create new ThreadSafeFunction
    gNewDeliveryCallback = new Napi::ThreadSafeFunction(
      Napi::ThreadSafeFunction::New(env, callback, "DeliveryCallback", 0, 1)
    );

    // Pass C++ callback function to DLL
    bool result = registerNewDeliveryFunction(delivery_callback);
    return Napi::Boolean::New(env, result);
  }

  Napi::Value RegisterStatusChangedFunction(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (hModule == nullptr) {
      Napi::Error::New(env, "DLL not loaded").ThrowAsJavaScriptException();
      return env.Null();
    }

    ::RegisterStatusChangedFunction registerStatusChangedFunction = (::RegisterStatusChangedFunction)GetProcAddress(hModule, "RegisterStatusChangedFunction");

    if (registerStatusChangedFunction == nullptr) {
      Napi::Error::New(env, "RegisterStatusChangedFunction function not found in DLL").ThrowAsJavaScriptException();
      return env.Null();
    }

    // Wrap JavaScript callback function with ThreadSafeFunction
    Napi::Function callback = info[0].As<Napi::Function>();

    // Release existing ThreadSafeFunction if exists
    if (gStatusChangedCallback) {
      gStatusChangedCallback->Release();
      delete gStatusChangedCallback;
    }

    // Create new ThreadSafeFunction
    gStatusChangedCallback = new Napi::ThreadSafeFunction(
      Napi::ThreadSafeFunction::New(env, callback, "StatusChangedCallback", 0, 1)
    );

    bool result = registerStatusChangedFunction(status_changed_callback);
    return Napi::Boolean::New(env, result);
  }

  Napi::Value RegisterDisconnectedFunction(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (hModule == nullptr) {
      Napi::Error::New(env, "DLL not loaded").ThrowAsJavaScriptException();
      return env.Null();
    }
    
    ::RegisterDisconnectedFunction registerDisconnectedFunction = (::RegisterDisconnectedFunction)GetProcAddress(hModule, "RegisterDisconnectedFunction");
    if (registerDisconnectedFunction == nullptr) {
      Napi::Error::New(env, "RegisterDisconnectedFunction function not found in DLL").ThrowAsJavaScriptException();
      return env.Null();
    }

    // Wrap JavaScript callback function with ThreadSafeFunction
    Napi::Function callback = info[0].As<Napi::Function>();

    // Release existing ThreadSafeFunction if exists

    if (gDisconnectedCallback) {
      gDisconnectedCallback->Release();
      delete gDisconnectedCallback;
    }

    // Create new ThreadSafeFunction
    gDisconnectedCallback = new Napi::ThreadSafeFunction(
      Napi::ThreadSafeFunction::New(env, callback, "DisconnectedCallback", 0, 1)
    );

    bool result = registerDisconnectedFunction(disconnected_callback);
    return Napi::Boolean::New(env, result);
  }

  Napi::Value InitializeService(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (hModule == nullptr) {
      Napi::Error::New(env, "DLL not loaded").ThrowAsJavaScriptException();
      return env.Null();
    }

    ::InitializeService initializeService = (::InitializeService)GetProcAddress(hModule, "InitializeService");
    if (initializeService == nullptr) {
      Napi::Error::New(env, "InitializeService function not found in DLL").ThrowAsJavaScriptException();
      return env.Null();
    }

    std::string signKey = info[0].As<Napi::String>();
    std::wstring wSignKey = StringToWString(signKey);

    int result = initializeService(wSignKey.c_str());
    return Napi::Number::New(env, result);
  }

  Napi::Value FinalizeService(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (hModule == nullptr) {
      Napi::Error::New(env, "DLL not loaded").ThrowAsJavaScriptException();
      return env.Null();
    }

    ::FinalizeService finalizeService = (::FinalizeService)GetProcAddress(hModule, "FinalizeService");
    if (finalizeService == nullptr) {
      Napi::Error::New(env, "FinalizeService function not found in DLL").ThrowAsJavaScriptException();
      return env.Null();
    }

    int result = finalizeService();
    return Napi::Number::New(env, result);
  }

  Napi::Value UpdateDeliveryStatus(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (hModule == nullptr) {
      Napi::Error::New(env, "DLL not loaded").ThrowAsJavaScriptException();
      return env.Null();
    }

    ::UpdateDeliveryStatus updateDeliveryStatus = (::UpdateDeliveryStatus)GetProcAddress(hModule, "UpdateDeliveryStatus");
    if (updateDeliveryStatus == nullptr) {
      Napi::Error::New(env, "UpdateDeliveryStatus function not found in DLL").ThrowAsJavaScriptException();
      return env.Null();
    }

    std::string orderNo = info[0].As<Napi::String>();
    std::wstring wOrderNo = StringToWString(orderNo);

    int deliveryStatus = info[1].As<Napi::Number>();

    std::string riderKey = info[2].As<Napi::String>();
    std::wstring wRiderKey = StringToWString(riderKey);

    std::string riderName = info[3].As<Napi::String>();
    std::wstring wRiderName = StringToWString(riderName);

    int estimatedTime = info[4].As<Napi::Number>();

    bool result = updateDeliveryStatus(wOrderNo.c_str(), deliveryStatus, wRiderKey.c_str(), wRiderName.c_str(), estimatedTime);
    return Napi::Boolean::New(env, result);
  }
};

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  return DllBinding::Init(env, exports);
}

NODE_API_MODULE(dll_binding, Init) 