export const TAX_CONSTANTS = {
  IEE_RATE: 0.0511269632,
  IVA_RATE: 0.21,
  SOCIAL_BONUS_RATES: {
    NONE: 1.0,
    VULNERABLE: 0.575,
    SEVERE: 0.425,
  },
} as const

export const STORAGE_KEYS = {
  APPLIANCES_V1: 'appliances_v1',
  CONFIG_V1: 'config_v1',
  PVPC_CACHE_V1: 'pvpc_cache_v1',
  STORAGE_VERSION: 'storage_version',
} as const

export const STORAGE_VERSION = 1
