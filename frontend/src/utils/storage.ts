import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS, STORAGE_VERSION } from './constants'

export async function migrateStorageIfNeeded() {
  const currentVersion = await AsyncStorage.getItem(STORAGE_KEYS.STORAGE_VERSION)
  
  if (!currentVersion) {
    await AsyncStorage.setItem(
      STORAGE_KEYS.STORAGE_VERSION,
      String(STORAGE_VERSION)
    )
    return
  }

  const version = parseInt(currentVersion)
  if (version < STORAGE_VERSION) {
    // Ejecutar migraciones necesarias
    console.log(`Migrando de v${version} a v${STORAGE_VERSION}`)
    // ... lógica de migración ...
    await AsyncStorage.setItem(
      STORAGE_KEYS.STORAGE_VERSION,
      String(STORAGE_VERSION)
    )
  }
}

export async function saveAppliances(appliances: any[]) {
  await AsyncStorage.setItem(
    STORAGE_KEYS.APPLIANCES_V1,
    JSON.stringify(appliances)
  )
}

export async function loadAppliances() {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.APPLIANCES_V1)
  return data ? JSON.parse(data) : []
}