const CapSolver = require('node-capsolver')
const fs = require('fs')

const solver = new CapSolver("YOUR_API_KEY")

solver.solve({
  type: "ImageToTextTask",
  body: fs.readFileSync('captcha.png')
})