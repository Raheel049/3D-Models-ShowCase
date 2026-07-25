import React, { useState } from "react";
import styles from "./forgotPassword.module.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const ForgotPassword = () => {
  

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const forgotHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    setLoading(true);
    try {
      
      const res = await api.post('/auth/forget', { email });

      toast.success(res.data.message || "OTP sent to your email");
      
      // Agar aapne OTP page par redirect karna hai:
      // navigate("/otp", { state: { email, from: "forgotPassword" } });

    } catch (err) {
      toast.error(err.response?.data?.message || "Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotContainer}>
      <div className={styles.glassBox}>
        <h2 className={styles.title}>Recovery</h2>
        <p className={styles.subtitle}>Enter your email to receive a password reset OTP</p>

        <form onSubmit={forgotHandler} className={styles.form}>
          <div className={styles.field}>
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.glassInput}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <div className={styles.footerLink}>
            <Link to="/login">
              Back to <span className={styles.boldUnderline}>Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;