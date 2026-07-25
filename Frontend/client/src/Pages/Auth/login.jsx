import React, { useState } from "react";
import styles from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const Login = () => {
  const API = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("isAuthenticated", "true");

      toast.success(res.data.message || "Welcome back!");

    
      console.log(res,"res");
     
      navigate("/Dashboard");



      
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.glassBox}>
        <h2 className={styles.title}>3D Models</h2>
        <p className={styles.subtitle}>Sign in to access your dashboard</p>

        <form onSubmit={loginHandler} className={styles.form}>
          <div className={styles.field}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email Address"
              className={styles.glassInput}
            />
          </div>

          <div className={styles.field}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className={styles.glassInput}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? "Verifying..." : "Login"}
          </button>

          <div className={styles.authLinks}>
            <Link to="/signUp" className={styles.link}>
              New here? <span>Create Account</span>
            </Link>
            <Link to="/forgotPassword" className={styles.link}>
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;