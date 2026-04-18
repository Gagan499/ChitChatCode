const { runInDocker } = require("../utils/docker");
module.exports = (code) => runInDocker({
  image: "node:20-alpine",
  filename: "index.js",
  code,
  cmd: ["node", "index.js"],
});