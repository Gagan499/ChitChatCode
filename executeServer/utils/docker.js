const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { randomUUID } = require("crypto");

const TIMEOUT_MS = 10000; // 10 seconds max

const runInDocker = ({ image, filename, code, cmd }) => {
  return new Promise((resolve) => {
    const dir = path.join(os.tmpdir(), randomUUID());
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), code);

    const start = Date.now();

    const args = [
      "run", "--rm",
      "--memory=128m",
      "--cpus=0.5",
      "--network=none",
      "--read-only",
      "--tmpfs=/tmp:size=10m",
      "-v", `${dir}:/code:ro`,
      "--workdir=/code",
      image,
      ...cmd,
    ];

    const proc = execFile("docker", args, { timeout: TIMEOUT_MS }, (err, stdout, stderr) => {
      fs.rmSync(dir, { recursive: true, force: true }); // cleanup

      resolve({
        stdout: stdout || "",
        stderr: stderr || (err && !stdout ? err.message : ""),
        exitCode: err?.code ?? 0,
        timedOut: err?.killed ?? false,
        executionTimeMs: Date.now() - start,
      });
    });
  });
};

module.exports = { runInDocker };