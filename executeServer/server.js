require("dotenv").config();
const express = require("express");
const { execute, supportedLanguages } = require("./router");

const app = express();
app.use(express.json());

app.post("/execute", async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "language and code are required" });
  }

  try {
    const result = await execute(language.toLowerCase(), code);

    res.json({
      status:           result.exitCode === 0 ? "success" : "error",
      stdout:           result.stdout,
      stderr:           result.stderr,
      timedOut:         result.timedOut,
      executionTimeMs:  result.executionTimeMs,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/languages", (_, res) => res.json({ languages: supportedLanguages }));
app.get("/health",    (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log(`Execution server running on port ${PORT}`));