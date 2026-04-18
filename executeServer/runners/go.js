const {runInDocker} = require("../utils/docker");
module.exports = (code) => runInDocker({
    image: "golang:1.22-alpine",
    filename: "main.go",
    code,
    cmd: ["go", "run", "main.go"],
});