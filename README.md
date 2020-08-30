# caught-promise
This Promise will never throw an Unhandled Rejection (hopefully)

```js

const CaughtPromise = require('./lib')

CaughtPromise.from({
    handler: resolve => {
        console.log('hello')
        console.notAFunction1()
        resolve()
    },
    errorHandler: e => console.error(e),
})
.then(() => {
    console.log('world')
    console.notAFunction2()

    new Promise(() => {
        console.log('hi1')
        console.asdfasdfasdfasdf()

        new Promise(() => {
            console.log('hi2')
            console.asdfasdfasdfasdf()
        }).then(() => {
            console.log('hi3')
            console.asdfasdfasdfasdf()
        })()
    }).then(() => {
        console.log('hi4')
        console.asdfasdfasdfasdf()
    })
    
    return new Promise(() => {
        console.log('hi5')
        console.asdfasdfasdfasdf()
    }).then(() => {
        console.log('hi6')
        console.asdfasdfasdfasdf()
    })
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
    at handler (/Users/chris/cx/caught-promise/src/lib.integration.js:7:17)
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
    at /Users/chris/cx/caught-promise/src/lib.integration.js:34:21
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
TypeError: console.notAFunction4 is not a function
    at /Users/chris/cx/caught-promise/src/lib.integration.js:35:21
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
TypeError: console.notAFunction5 is not a function
    at /Users/chris/cx/caught-promise/src/lib.integration.js:36:21
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
TypeError: console.notAFunction6 is not a function
    at /Users/chris/cx/caught-promise/src/lib.integration.js:37:21
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
```

Notice that we have lots of errors printed, but none of them are unhandled rejections.
The idea is that you pass CaughtPromise a typical promise function called handler:
`(resolve reject) => ...`
And then you pass it a function catchHandler you want to run whenever there is an error:
`error => console.error(error)`

And anytime there is an error, in any of the `then` blocks, it's caught and handled by the catchHandler.

I think eventually Node plans on exiting the process 
