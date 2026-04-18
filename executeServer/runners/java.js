const { runInDocker } = require("../utils/docker");
module.exports = (code) =>
  runInDocker({
    image: "openjdk:21-slim",
    filename: "Main.java",
    code,
    cmd: ["sh", "-c", "javac Main.java && java Main"],
  });
