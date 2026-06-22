export function getAppId() {
  return import.meta.env.VITE_EWELINK_APP_ID
}

export function getAppSecret() {
  return import.meta.env.VITE_EWELINK_APP_SECRET
}

export function getNonce() {
  return import.meta.env.VITE_EWELINK_NONCE
}
