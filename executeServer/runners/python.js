const { runInDocker } = require("../utils/docker");
module.exports = (code) => runInDocker({
  image: "python:3-alpine",
  filename: "index.py",
  code,
  cmd: ["python", "index.py"],
});