
class CaughtPromise extends Promise {}

CaughtPromise.from = CaughtPromise.of = CaughtPromise.create = (...args) => {
    if (args == null) {
        throw new Error('args is required')
    }
    const [handler, errorHandler] = args
    if (handler == null) {
        throw new Error('handler is required')
    } else if (errorHandler == null) {
        throw new Error('errorHandler is required')
    }
    
    const promise = new Promise(handler).catch(errorHandler)
    const then = promise.then.bind(promise)
    promise.then = (...args) => {
        const newPromise = then(...args).catch(errorHandler)
        newPromise.then = promise.then.bind(newPromise)
        return newPromise
    }
    return promise
}

module.exports = CaughtPromise
