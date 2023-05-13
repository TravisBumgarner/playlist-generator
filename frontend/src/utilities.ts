import { type Action } from 'context'

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>
type Exactly<T, K extends keyof T> = Pick<T, K>

const logger = (message: any) => {
  console.log(JSON.stringify(message)) // eslint-disable-line
}

enum ELocalStorageItems {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
  ExpiresAt = 'expiresAt'
}

const getLocalStorage = (key: ELocalStorageItems) => {
  const result = localStorage.getItem(key)
  return result ? JSON.parse(result) : null
}

const setLocalStorage = (key: ELocalStorageItems, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const deleteLocalStorage = (key: ELocalStorageItems) => {
  localStorage.removeItem(key)
}

const logout = (dispatch: (value: Action) => void) => {
  deleteLocalStorage(ELocalStorageItems.AccessToken)
  deleteLocalStorage(ELocalStorageItems.ExpiresAt)
  deleteLocalStorage(ELocalStorageItems.RefreshToken)
  dispatch({ type: 'LOGOUT' })
}

export {
  logger,
  type AtLeast,
  type Exactly,
  getLocalStorage,
  setLocalStorage,
  deleteLocalStorage,
  ELocalStorageItems,
  logout
}
