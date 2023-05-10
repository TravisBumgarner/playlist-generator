type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>
type Exactly<T, K extends keyof T> = Pick<T, K>

const logger = (message: any) => {
    console.log(JSON.stringify(message)) // eslint-disable-line
}

enum ELocalStorageItems {
    AccessToken = 'accessToken'
}

const getLocalStorage = (key: ELocalStorageItems) => {
    const result = localStorage.getItem(key)
    return result ? JSON.parse(result) : ''
}

const setLocalStorage = (key: ELocalStorageItems, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
}

export {
    logger,
    AtLeast,
    Exactly,
    getLocalStorage,
    setLocalStorage,
    ELocalStorageItems
}