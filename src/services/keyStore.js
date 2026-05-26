// Key is stored in localStorage so it never leaves the user's browser
const STORAGE_KEY = "idea_keeper_ai_key"

export const saveKey = (key) => localStorage.setItem(STORAGE_KEY, key.trim())
export const getKey = () => localStorage.getItem(STORAGE_KEY) || ""
export const clearKey = () => localStorage.removeItem(STORAGE_KEY)
