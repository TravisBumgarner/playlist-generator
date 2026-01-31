export const logger = (message: any) => {
  if (process.env.NODE_ENV !== 'local') {
    // Sentry.captureException(JSON.stringify(message))
  }
  console.log(JSON.stringify(message)) // eslint-disable-line
}
export const shuffle = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}
