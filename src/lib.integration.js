
const CaughtPromise = require('./lib')

CaughtPromise.from(
    resolve => {
        console.log('hello')
        console.notAFunction1()
        resolve()
    },
    e => console.error(e)
)
.then(() => {
    console.log('world')
    console.notAFunction2()
})
.then(() => console.notAFunction3())
.then(() => console.notAFunction4())
.then(() => console.notAFunction5())
.then(() => console.notAFunction6())

process.on('unhandledRejection', () => {
    throw new Error('CaughtPromise threw an unhandledRejection')
})
