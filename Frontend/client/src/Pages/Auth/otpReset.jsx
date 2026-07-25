import React, { useState } from "react";
import styles from "./otpReset.module.css";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const OtpReset = () => {
  

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOtpHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    setLoading(true);
    try {
      
      const res = await api.post('/auth/resend-otp', { email });

      toast.success(res.data.message || "OTP sent successfully!");

      // 1.5s delay taake user toast dekh sakay, phir wapas OTP verify page par
      setTimeout(() => {
        navigate("/otp", {
          state: { email }
        });
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetContainer}>
      <div className={styles.glassBox}>
        <h2 className={styles.title}>Resend OTP</h2>
        <p className={styles.subtitle}>Enter your registered email to receive a new code</p>

        <form onSubmit={sendOtpHandler} className={styles.form}>
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
              Remembered code? <span className={styles.boldUnderline}>Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpReset;