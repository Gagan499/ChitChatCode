/**
 * Code Execution Controller
 * Forwards code to an external execution server and returns the result.
 */

const EXEC_SERVER_URL = process.env.EXEC_SERVER_URL;

/**
 * POST /api/code/execute
 * Body: { language: string, code: string }
 * Response: { success: boolean, output: string, error: string | null }
 */
const executeCode = async (req, res) => {
    const { language, code } = req.body;

    // ── Validate input ──────────────────────────────────────────────────
    if (!language || typeof language !== "string") {
        return res.status(400).json({
            success: false,
            output: "",
            error: "Language is required.",
        });
    }

    if (!code || typeof code !== "string") {
        return res.status(400).json({
            success: false,
            output: "",
            error: "Code is required.",
        });
    }

    if (!EXEC_SERVER_URL) {
        return res.status(503).json({
            success: false,
            output: "",
            error: "Execution server is not configured. Please set EXEC_SERVER_URL in your environment.",
        });
    }

    try {
        // ── Forward to the execution server ─────────────────────────────
        const execResponse = await fetch(`${EXEC_SERVER_URL}/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language, code }),
            signal: AbortSignal.timeout(60000), // 60 second timeout
        });

        const result = await execResponse.json();

        // Exec server returns: { status, stdout, stderr, timedOut, executionTimeMs }
        const isSuccess = result.status === "success" && !result.timedOut;
        const output = result.stdout ?? result.output ?? "";
        const error = result.timedOut
            ? "Execution timed out on the server."
            : (result.stderr || null);

        return res.status(200).json({
            success: isSuccess,
            output,
            error,
        });
    } catch (err) {
        console.error("Code execution error:", err.message);

        // Differentiate between timeout and other errors
        if (err.name === "TimeoutError" || err.name === "AbortError") {
            return res.status(504).json({
                success: false,
                output: "",
                error: "Execution timed out (30s limit).",
            });
        }

        return res.status(502).json({
            success: false,
            output: "",
            error: "Failed to reach the execution server. It may be offline.",
        });
    }
};

module.exports = { executeCode };
