// API_KEY 相关方法 存  取  删
const API_KEY = 'USER_API_KEY'

function setApiKey(apiKey: string) {
  localStorage.setItem(API_KEY, apiKey)
}
function getApiKey() {
  return localStorage.getItem(API_KEY)
}
function removeApiKey() {
  localStorage.removeItem(API_KEY)
}

export {setApiKey, getApiKey, removeApiKey}
