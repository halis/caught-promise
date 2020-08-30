# caught-promise
This Promise will never throw an Unhandled Rejection (hopefully)

```js
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

/* Output:
hello
TypeError: console.notAFunction1 is not a function
    at /Users/chris/cx/caught-promise/src/lib.integration.js:7:17
    at new Promise (<anonymous>)
    at Function.CaughtPromise.from.CaughtPromise.of.CaughtPromise.create (/Users/chris/cx/caught-promise/src/lib.js:15:21)
    at Object.<anonymous> (/Users/chris/cx/caught-promise/src/lib.integration.js:4:15)
    at Module._compile (internal/modules/cjs/loader.js:1133:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1153:10)
    at Module.load (internal/modules/cjs/loader.js:977:32)
    at Function.Module._load (internal/modules/cjs/loader.js:877:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:74:12)
    at internal/main/run_main_module.js:18:47
world
TypeError: console.notAFunction2 is not a function
    at /Users/chris/cx/caught-promise/src/lib.integration.js:14:13
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
TypeError: console.notAFunction3 is not a function
    at /Users/chris/cx/caught-promise/src/lib.integration.js:16:21
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
TypeError: console.notAFunction4 is not a function
    at /Users/chris/cx/caught-promise/src/lib.integration.js:17:21
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
TypeError: console.notAFunction5 is not a function
    at /Users/chris/cx/caught-promise/src/lib.integration.js:18:21
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
TypeError: console.notAFunction6 is not a function
    at /Users/chris/cx/caught-promise/src/lib.integration.js:19:21
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
```

Notice that we have lots of errors printed, but none of them are unhandled rejections.
The idea is that you pass CaughtPromise a typical promise function:
`(resolve reject) => ...`

And then you pass it a function that you want to run whenever there is an error:
`error => console.error(error)`

And anytime there is an error, in any of the `then` blocks, it's caught and handled.

I think eventually Node plans on exiting the process if a Promise has an unhandled rejection, so use this when you don't want unhandled rejections.

Say you're processing a message from a queue and if there's an error you just want to log and continue processing. Perfect scenario.
