import { openDB } from "idb";

const DB_NAME = "StoryAppDB";
const STORE_NAME = "stories";
const DB_VERSION = 1;

class IndexedDBService {
  constructor() {
    this._dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      },
    });
  }

  async addStory(story) {
    const db = await this._dbPromise;
    return db.put(STORE_NAME, story);
  }

  async getAllStories() {
    const db = await this._dbPromise;
    return db.getAll(STORE_NAME);
  }

  async getStoryById(id) {
    const db = await this._dbPromise;
    return db.get(STORE_NAME, id);
  }

  async deleteStory(id) {
    const db = await this._dbPromise;
    return db.delete(STORE_NAME, id);
  }
}

export default new IndexedDBService();
