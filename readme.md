# 🤖 CapSolver ✔️

## An API wrapper for CapSolver.com written in Node.js

## Table of Contents

- [Installing](#installing)
- [Examples](#examples)
- [API](#api)

## Installing

### Package manager

Using npm:

```bash
npm install node-capsolver
```

Using yarn:

```bash
yarn add node-capsolver
```

## Examples

### [ImageToTextTask](https://docs.capsolver.com/guide/recognition/ImageToTextTask.html)

```js
const CapSolver = require('node-capsolver')
const fs = require('fs')

const solver = new CapSolver("CAI-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", {
    verbose: true, // Optional
    verboseIdentifier: "[Image Solve]"  // Optional & not required when verbose: true
})

solver.getBalance().then(data => {
    if (data?.balance > 0) {
        solver.solve({
            type: "ImageToTextTask",
            body: fs.readFileSync('captcha.png') // The library will automatically convert buffers into base64 strings for you
        }).then((task) => {
            console.log(task.solution.text)
        })
    } else {
        console.log("Insufficient balance.")
    }
})
```

### [ReCaptchaV2TaskProxyLess](https://docs.capsolver.com/en/guide/captcha/ReCaptchaV2/)

```js
const CapSolver = require('node-capsolver')
const axios = require("axios").default;
const { JSDOM } = require('jsdom');

(async () => {
    let demoURL = "https://www.google.com/recaptcha/api2/demo";
    let resp = await axios({
        method: "GET",
        url: demoURL,
    })

    const dom = new JSDOM(resp.data)
    const siteKey = dom.window.document.querySelector('#recaptcha-demo').getAttribute('data-sitekey');

    const handler = new CapSolver('CAI-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', {
        verbose: true // Optional
    })
    let b = await handler.getBalance();
    if (b.balance > 0) {
        let CapResponse = await handler.solve({
            type: 'ReCaptchaV2TaskProxyLess',
            websiteURL: demoURL,
            websiteKey: `${siteKey}`,
        })

        console.log(CapResponse)
    } else {
        console.log("Insufficient balance.")
    }
})();
```

## API

In general, the `CapSolver.solve()` function is all you need. It combines createTask() and getTaskResult() into one, meaning you don't need to worry about anything else.

`async CapSolver.solve(task)`

`async CapSolver.createTask(task)`

`async CapSolver.getTaskResult(taskId)`

`async CapSolver.feedbackTask(taskId, result)`

`async CapSolver.getBalance()`

When using an IDE that supports JSDoc, you will get suggestions of properties the task supports. To get the best suggestions, specify the `type` first.
For the general API, check the [CapSolver.com documentation](https://docs.capsolver.com/).
