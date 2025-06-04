interface PaymentData {
  id?: number;
  package: string;
  payment_amount: number;
  payment_file: File;
  timestamp: number;
  status: 'pending' | 'submitted' | 'failed';
}

class IndexedDBStorage {
  private dbName = 'joinmun_payments';
  private version = 1;
  private storeName = 'payments';

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }
      };
    });
  }

  async storePayment(paymentData: Omit<PaymentData, 'id'>): Promise<number> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(paymentData);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as number);
    });
  }

  async updatePaymentStatus(id: number, status: PaymentData['status']): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const payment = getRequest.result;
        if (payment) {
          payment.status = status;
          const putRequest = store.put(payment);
          putRequest.onerror = () => reject(putRequest.error);
          putRequest.onsuccess = () => resolve();
        } else {
          reject(new Error('Payment not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }
}

export const paymentStorage = new IndexedDBStorage();
export type { PaymentData };
