class LocalStorage {
  private readonly storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  public setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  public getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  public removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  public clear(): void {
    this.storage.clear();
  }
}

export const localStorage = new LocalStorage();
