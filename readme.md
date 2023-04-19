# CapSolver

Example usage

```
const CapSolver = require('node-capsolver')
const fs = require('fs')

const solver = new CapSolver("YOUR_API_KEY")

solver.solve({
  type: "ImageToTextTask",
  body: fs.readFileSync('captcha.png') // The library will automatically convert buffers into base64 strings for you
}).then((task) => {
  console.log(task.solution.text)
})
```

# API

In general, the `CapSolver.solve()` function is all you need. It combines createTask() and getTaskResult() into one, meaning you don't need to worry about

`async CapSolver.solve(task)`

`async CapSolver.createTask(task)`

`async CapSolver.getTaskResult(taskId)`

`async CapSolver.getBalance()`

When using an IDE that supports JSDoc, you will get suggestions of properties the task supports. To get the best suggestions, specify the `type` first
