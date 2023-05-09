export const logger = (message: any) => {
    if (process.env.NODE_ENV !== 'local') {
        // Sentry.captureException(JSON.stringify(message))
    }
    console.log(JSON.stringify(message)) // eslint-disable-line
}