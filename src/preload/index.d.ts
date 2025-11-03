import { ElectronAPI } from '@electron-toolkit/preload';

interface SerialPortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  productId?: string;
  vendorId?: string;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: unknown;
    serialport: {
      listPorts: () => Promise<SerialPortInfo[]>;
      openPort: (path: string, baudRate?: number) => Promise<{ success: boolean; path: string }>;
      write: (
        path: string,
        baudRate: number,
        data: Buffer<ArrayBufferLike>
      ) => Promise<{ success: boolean }>;
    };
    dll: {
      loadDll: (dllPath: string) => Promise<{ success: boolean; message: string }>;
      callMessageBox: (
        text: string,
        caption: string
      ) => Promise<{ success: boolean; result: number }>;
      getSystemMetrics: (metric: number) => Promise<{ success: boolean; result: number }>;
    };
    baeminDll: {
      loadDll: (dllPath: string) => Promise<{ success: boolean; message: string }>;
      isBaeminInstalled: () => Promise<{ success: boolean; result: boolean }>;
      isBaeminRunning: () => Promise<{ success: boolean; result: boolean }>;
      registerNewDeliveryFunction: () => Promise<{ success: boolean; result: boolean }>;
      registerStatusChangedFunction: () => Promise<{ success: boolean; result: boolean }>;
      registerDisconnectedFunction: () => Promise<{ success: boolean; result: boolean }>;
      updateDeliveryStatus: (
        orderNo: string,
        status: number,
        riderKey: string,
        riderName: string,
        estimatedTime: number
      ) => Promise<{ success: boolean; result: boolean }>;
      initializeService: (signKey: string) => Promise<{ success: boolean; result: number }>;
      finalizeService: () => Promise<{ success: boolean; result: number }>;
    };
    mainToRenderer: {
      onNewDelivery: (
        callback: (deliveryData: {
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
          timestamp: string;
        }) => void
      ) => void;
      onStatusChanged: (
        callback: (statusData: { orderNo: string; status: number }) => void
      ) => void;
      onDisconnected: (callback: () => void) => void;
    };
  }
}
