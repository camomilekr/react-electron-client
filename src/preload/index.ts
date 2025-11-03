import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

// Custom APIs for renderer
const api = {};

// Serial port API
const serialportAPI = {
  listPorts: () => ipcRenderer.invoke('serial-list-ports'),
  write: (path: string, baudRate: number, data: Buffer<ArrayBufferLike>) =>
    ipcRenderer.invoke('serial-write', path, baudRate, data),
};

// 커스텀 DLL API (네이티브 애드온 사용)
const baeminDllAPI = {
  loadDll: (dllPath: string) => ipcRenderer.invoke('baemin-dll-load', dllPath),
  isBaeminInstalled: () => ipcRenderer.invoke('baemin-dll-is-baemin-installed'),
  isBaeminRunning: () => ipcRenderer.invoke('baemin-dll-is-baemin-running'),
  registerNewDeliveryFunction: () =>
    ipcRenderer.invoke('baemin-dll-register-new-delivery-function'),
  registerStatusChangedFunction: () =>
    ipcRenderer.invoke('baemin-dll-register-status-changed-function'),
  registerDisconnectedFunction: () =>
    ipcRenderer.invoke('baemin-dll-register-disconnected-function'),
  updateDeliveryStatus: (
    orderNo: string,
    status: number,
    riderKey: string,
    riderName: string,
    estimatedTime: number
  ) =>
    ipcRenderer.invoke(
      'baemin-dll-update-delivery-status',
      orderNo,
      status,
      riderKey,
      riderName,
      estimatedTime
    ),
  initializeService: (signKey: string) =>
    ipcRenderer.invoke('baemin-dll-initialize-service', signKey),
  finalizeService: () => ipcRenderer.invoke('baemin-dll-finalize-service'),
};

// Main process에서 오는 데이터를 받는 API
const mainToRendererAPI = {
  // New delivery data from main process
  onNewDelivery: (callback: (deliveryData: any) => void) => {
    ipcRenderer.on('new-delivery', (_event, deliveryData) => callback(deliveryData));
  },
  onStatusChanged: (callback: (statusData: any) => void) => {
    ipcRenderer.on('status-changed', (_event, statusData) => callback(statusData));
  },
  onDisconnected: (callback: () => void) => {
    ipcRenderer.on('disconnected', () => callback());
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('serialport', serialportAPI);
    contextBridge.exposeInMainWorld('baeminDll', baeminDllAPI);
    contextBridge.exposeInMainWorld('mainToRenderer', mainToRendererAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
  // @ts-ignore (define in dts)
  window.serialport = serialportAPI;
  // @ts-ignore (define in dts)
  window.baeminDll = baeminDllAPI;
  // @ts-ignore (define in dts)
  window.mainToRenderer = mainToRendererAPI;
}
