
const {stub} = require('sinon')

const CaughtPromise = require('./lib')

const printError = (logger, error) => {
    if (error == null) {
        return
    }
    const msg = error.stack || error.message || error
    logger.error(msg)
    return msg
}

describe('CaughtPromise', () => {
    const logger = {
        error: stub(),
        log: stub(),
    }

    it('should not throw an unhandledRejection when an error happens in the handler', function(done) {
        CaughtPromise.from(resolve => {
                logger.log('hello')
                logger.asdf() // intentional error
                resolve()
            },
            printError
        )
        .then(done)
        
        process.on('unhandledRejection', () => done(new Error('CaughtPromise threw an unhandledRejection')))
    })

    it('should not throw an unhandledRejection even when the Promise is explicitly rejected in the handler', function(done) {
        CaughtPromise.from(
            (resolve, reject) => reject(new Error('oh boy')),
            printError
        )
        .then(done)
        
        process.on('unhandledRejection', () => done(new Error('CaughtPromise threw an unhandledRejection')))
    })

    it('should not throw an unhandledRejection when an error happens in any subsequent then block', function(done) {
        CaughtPromise.from(
            resolve => {
                logger.log('hello')
                resolve()
            },
            printError
        )
        .then(() => {
            logger.log('world')
            logger.asdf()
        })
        .then(logger.asdf) // intentional error
        .then(logger.asdf) // intentional error
        .then(logger.asdf) // intentional error
        .then(logger.asdf) // intentional error
        .then(done)
        
        process.on('unhandledRejection', () => done(new Error('CaughtPromise threw an unhandledRejection')))
    })

    it('should run the catchHandler for each error', function(done) {
        let ctr = 0
        const errorHandler = () => ctr++
        CaughtPromise.from(
            resolve => {
                logger.log('hello')
                logger.asdf()
                resolve()
            },
            errorHandler,
        )
        .then(() => {
            logger.log('world')
            logger.asdf()
        })
        .then(logger.asdf) // intentional error
        .then(logger.asdf) // intentional error
        .then(logger.asdf) // intentional error
        .then(logger.asdf) // intentional error
        .then(() => {
            done()
        })

        process.on('unhandledRejection', () => done(new Error('CaughtPromise threw an unhandledRejection')))
    })
})
