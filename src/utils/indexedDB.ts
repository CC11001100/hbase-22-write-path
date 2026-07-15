/**
 * IndexedDB 工具函数
 * 用于缓存播放速度设置等用户偏好
 * 改造自 leetcode-visualizer，DB 名称按仓库参数化
 */

const DB_NAME = 'hbase-visualizer'
const DB_VERSION = 1
const STORE_NAME = 'settings'

interface CacheEntry<T> {
  value: T
  timestamp: number
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
  })

  return dbPromise
}

export async function getCachedValue<T>(key: string): Promise<CacheEntry<T> | null> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const result = request.result
        if (result) {
          resolve({ value: result.value, timestamp: result.timestamp })
        } else {
          resolve(null)
        }
      }
    })
  } catch {
    return null
  }
}

export async function setCachedValue<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put({
        key,
        value,
        timestamp: Date.now(),
      })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch {
    // 静默失败
  }
}

// 播放速度缓存
const PLAYBACK_RATE_KEY = 'playback-rate'

export async function getPlaybackRate(): Promise<number | null> {
  const cached = await getCachedValue<number>(PLAYBACK_RATE_KEY)
  return cached?.value ?? null
}

export async function savePlaybackRate(rate: number): Promise<void> {
  await setCachedValue(PLAYBACK_RATE_KEY, rate)
}
