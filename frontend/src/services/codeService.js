import API from "./api";

/**
 * Execute code on the remote execution server via the backend proxy.
 *
 * @param {string} language — e.g. "python", "javascript", "cpp"
 * @param {string} code     — source code to execute
 * @returns {Promise<{ success: boolean, output: string, error: string|null }>}
 */
export const executeCode = async (language, code) => {
    try {
        const { data } = await API.post("/code/execute", { language, code });
        return data;
    } catch (err) {
        // Extract the server error message if available, otherwise use a generic one
        const serverMsg =
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Something went wrong while executing the code.";

        return {
            success: false,
            output: "",
            error: serverMsg,
        };
    }
};
