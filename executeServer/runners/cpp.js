const { runInDocker } = require("../utils/docker");
module.exports = (code) =>
  runInDocker({
    image: "gcc:13",
    filename: "main.cpp",
    code,
    cmd: ["sh", "-c", "g++ -o /tmp/out main.cpp && /tmp/out"],
  });
