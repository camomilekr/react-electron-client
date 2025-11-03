import { IpcMain } from 'electron';
import { SerialPort } from 'serialport';

export const initializeSerialPort = (ipcMain: IpcMain): void => {
  // Serial port IPC handlers
  ipcMain.handle('serial-list-ports', async () => {
    try {
      const ports = await SerialPort.list();
      return ports;
    } catch (error) {
      console.error('Error listing serial ports:', error);
      throw error;
    }
  });

  ipcMain.handle('serial-write', async (_, path: string, baudRate: number, data: Buffer<ArrayBufferLike>) => {
    try {
      const port = new SerialPort({
        path,
        baudRate,
        autoOpen: false,
      });

      return new Promise((resolve, reject) => {
        port.open((err) => {
          if (err) {
            console.error('Error opening serial port:', err);
            reject(err);
          } else {
            port.write(data, (err) => {
              if (err) {
                reject(err);
              } else {
                port.close();
                resolve({ success: true });
              }
            });
          }
        });
      });
    } catch (error) {
      console.error('Error writing to serial port:', error);
      throw error;
    }
  });
};
