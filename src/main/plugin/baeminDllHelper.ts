import { BrowserWindow, IpcMain } from 'electron';

const onNewDelivery = (payload: {
  orderNo: string;
  roadNameAddress: string;
  address: string;
  addressDetail: string;
  phoneNo: string;
  latitude: string;
  longitude: string;
  title: string;
  quantity: number;
  amount: number;
  paymentType: number;
  memo: string;
}): void => {
  // Send to all renderer windows
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send('new-delivery', payload);
  });
};

const onStatusChanged = (payload: { orderNo: string; status: number }): void => {
  // Send to all renderer windows
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send('status-changed', payload);
  });
};

const onDisconnected = (): void => {
  // Send to all renderer windows
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send('disconnected');
  });
};

// 네이티브 애드온 로드
let dllBinding: unknown = null;
if (process.platform === 'win32') {
  try {
    // eslint-disable-next-line
    dllBinding = require('../../addon/build/Release/dll_binding.node');
  } catch (error) {
    console.warn('네이티브 애드온 로드 실패:', error);
  }
}

export const initializeBaeminDll = (ipcMain: IpcMain): void => {
  ipcMain.handle('baemin-dll-is-baemin-installed', () => {
    try {
      if (!dllBinding) {
        throw new Error('네이티브 애드온이 로드되지 않았습니다');
      }

      const binding = new (dllBinding as any).DllBinding();
      binding.loadDll('dlls/BMOrderRelayx64.dll');

      const result = binding.isBaeminInstalled();

      return { result };
    } catch (error) {
      console.error('IsBaeminInstalled 호출 오류:', error);
      throw error;
    }
  });

  ipcMain.handle('baemin-dll-is-baemin-running', () => {
    try {
      if (!dllBinding) {
        throw new Error('네이티브 애드온이 로드되지 않았습니다');
      }

      const binding = new (dllBinding as any).DllBinding();
      binding.loadDll('dlls/BMOrderRelayx64.dll');
      const result = binding.isBaeminRunning();

      return { result };
    } catch (error) {
      console.error('IsBaeminRunning 호출 오류:', error);
      throw error;
    }
  });

  ipcMain.handle('baemin-dll-register-new-delivery-function', () => {
    try {
      if (!dllBinding) {
        throw new Error('네이티브 애드온이 로드되지 않았습니다');
      }

      const binding = new (dllBinding as any).DllBinding();
      binding.loadDll('dlls/BMOrderRelayx64.dll');
      const result = binding.registerNewDeliveryFunction(onNewDelivery);

      return { success: true, result };
    } catch (error) {
      console.error('RegisterNewDeliveryFunction 호출 오류:', error);
      throw error;
    }
  });

  ipcMain.handle('baemin-dll-register-status-changed-function', () => {
    try {
      if (!dllBinding) {
        throw new Error('네이티브 애드온이 로드되지 않았습니다');
      }

      const binding = new (dllBinding as any).DllBinding();
      binding.loadDll('dlls/BMOrderRelayx64.dll');
      const result = binding.registerStatusChangedFunction(onStatusChanged);
      return { success: true, result };
    } catch (error) {
      console.error('RegisterStatusChangedFunction 호출 오류:', error);
      throw error;
    }
  });

  ipcMain.handle('baemin-dll-register-disconnected-function', () => {
    try {
      if (!dllBinding) {
        throw new Error('네이티브 애드온이 로드되지 않았습니다');
      }

      const binding = new (dllBinding as any).DllBinding();
      binding.loadDll('dlls/BMOrderRelayx64.dll');
      const result = binding.registerDisconnectedFunction(onDisconnected);
      return { success: true, result };
    } catch (error) {
      console.error('RegisterDisconnectedFunction 호출 오류:', error);
      throw error;
    }
  });

  ipcMain.handle('baemin-dll-initialize-service', (_, signKey: string) => {
    try {
      if (!dllBinding) {
        throw new Error('네이티브 애드온이 로드되지 않았습니다');
      }

      const binding = new (dllBinding as any).DllBinding();
      binding.loadDll('dlls/BMOrderRelayx64.dll');
      const result = binding.initializeService(signKey);
      return { result };
    } catch (error) {
      console.error('InitializeService 호출 오류:', error);
      throw error;
    }
  });

  ipcMain.handle('baemin-dll-finalize-service', () => {
    try {
      if (!dllBinding) {
        throw new Error('네이티브 애드온이 로드되지 않았습니다');
      }

      const binding = new (dllBinding as any).DllBinding();
      binding.loadDll('dlls/BMOrderRelayx64.dll');
      const result = binding.finalizeService();
      return { result };
    } catch (error) {
      console.error('FinalizeService 호출 오류:', error);
      throw error;
    }
  });

  ipcMain.handle(
    'baemin-dll-update-delivery-status',
    async (
      _,
      orderNo: string,
      status: number,
      riderKey: string,
      riderName: string,
      estimatedTime: number
    ) => {
      try {
        if (!dllBinding) {
          throw new Error('네이티브 애드온이 로드되지 않았습니다');
        }

        const binding = new (dllBinding as any).DllBinding();
        binding.loadDll('dlls/BMOrderRelayx64.dll');
        const result = binding.updateDeliveryStatus(
          orderNo,
          status,
          riderKey,
          riderName,
          estimatedTime
        );
        return { result };
      } catch (error) {
        console.error('UpdateDeliveryStatus 호출 오류:', error);
        throw error;
      }
    }
  );
};
