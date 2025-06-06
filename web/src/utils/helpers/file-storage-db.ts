// file-storage.ts
// A utility for storing files using IndexedDB

// IndexedDB helper for storing files
const fileStorageDB = {
  db: null as IDBDatabase | null,

  // Check if database is already initialized
  isInitialized: () => {
    return Promise.resolve(fileStorageDB.db !== null);
  },

  // Initialize the database
  init: () => {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("FormFilesDB", 1);

      request.onerror = (event) => {
        console.error("IndexedDB error:", event);
        reject("Could not open IndexedDB");
      };

      request.onsuccess = (event) => {
        fileStorageDB.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Create an object store for form files
        if (!db.objectStoreNames.contains("formFiles")) {
          db.createObjectStore("formFiles");
        }
      };
    });
  },

  // Store a file
  storeFile: (key: string, file: File) => {
    return new Promise<void>((resolve, reject) => {
      if (!fileStorageDB.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = fileStorageDB.db.transaction(["formFiles"], "readwrite");
      const store = transaction.objectStore("formFiles");
      const request = store.put(file, key);

      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error("Error storing file:", event);
        reject("Failed to store file");
      };
    });
  },

  // Retrieve a file
  getFile: (key: string) => {
    return new Promise<File | null>((resolve, reject) => {
      if (!fileStorageDB.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = fileStorageDB.db.transaction(["formFiles"], "readonly");
      const store = transaction.objectStore("formFiles");
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = (event) => {
        console.error("Error retrieving file:", event);
        reject("Failed to retrieve file");
      };
    });
  },

  // Get all file keys
  getAllKeys: () => {
    return new Promise<string[]>((resolve, reject) => {
      if (!fileStorageDB.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = fileStorageDB.db.transaction(["formFiles"], "readonly");
      const store = transaction.objectStore("formFiles");
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = (event) => {
        console.error("Error getting keys:", event);
        reject("Failed to get keys");
      };
    });
  },

  // Get all files
  getAllFiles: () => {
    return new Promise<Record<string, File>>((resolve, reject) => {
      if (!fileStorageDB.db) {
        reject("Database not initialized");
        return;
      }

      fileStorageDB
        .getAllKeys()
        .then((keys) => {
          const files: Record<string, File> = {};
          const promises: Promise<void>[] = [];

          keys.forEach((key) => {
            const promise = fileStorageDB.getFile(key as string).then((file) => {
              if (file) files[key as string] = file;
            });
            promises.push(promise);
          });

          Promise.all(promises).then(() => resolve(files));
        })
        .catch(reject);
    });
  },

  // Clear all files
  clearAll: () => {
    return new Promise<void>((resolve, reject) => {
      if (!fileStorageDB.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = fileStorageDB.db.transaction(["formFiles"], "readwrite");
      const store = transaction.objectStore("formFiles");
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error("Error clearing store:", event);
        reject("Failed to clear store");
      };
    });
  },
};

export { fileStorageDB };
