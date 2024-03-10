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
