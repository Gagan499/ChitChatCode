import {useState} from 'react'
function Loginform() {
  const [form,setform] = useState({
    email:"",
    password:""
  });
  const [loading,setloading] = useState(false);
  const [error,seterror] = useState("");
  const handleChange =(e)=>{
    setform({
        ...form,
        [e.target.name]:e.target.value
    })
  }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    setloading(true);
    seterror("");
    try {
        const res = await loginUser(form);
        console.log("Login Successful",res.data);
        // if backend send token, save it to localStorage or context
        localStorage.setItem("token",res.data.token);
        window.location.href = "/dashboard"; // redirect to dashboard
    } catch (err) {
        seterror(err.response?.data?.message || "Login failed. Please try again.");
    }
    finally{
        setloading(false);
    }

}
return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don’t have an account?{" "}
          <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#111"
  },
  card: {
    background: "#1e1e1e",
    padding: "30px",
    borderRadius: "8px",
    width: "350px",
    color: "#fff"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "none"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  error: {
    color: "red"
  }
};
export default Loginform