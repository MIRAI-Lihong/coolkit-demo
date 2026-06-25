function createStorage<T extends string>(key: string) {
  return {
    set: (value: T) => localStorage.setItem(key, value),
    get: () => localStorage.getItem(key),
    remove: () => localStorage.removeItem(key)
  }
}

export const accessTokenStorage = createStorage('ACCESS_TOKEN')
export const refreshTokenStorage = createStorage('REFRESH_TOKEN')
export const apiKeyStorage = createStorage('USER_API_KEY')
export const regionStorage = createStorage('USER_REGION')
