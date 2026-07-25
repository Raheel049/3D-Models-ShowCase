import React, { useState, useEffect } from "react";
import styles from "./otp.module.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const OtpVerify = () => {
  const API = import.meta.env.VITE_API_URL;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/");
    }
  }, [location, navigate]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const verifyOtpHandler = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return toast.error("Please enter 6 digit OTP");
    }

    setLoading(true);
    try {
      
      const body = {
        otp,
        email: location.state.email,
      };

      const res = await api.post("/auth/verify-otp", body);
      toast.success(res.data.message || "OTP Verified Successfully");
      
      // Agar forgot password se aaya hai to reset page par bhejo
      if(location.state.from === "forgotPassword") {
          navigate(`/change-password?q=${otp}`); // Ya jo tumhara route hai
      } else {
          navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP or Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.otpContainer}>
      <div className={styles.glassBox}>
        <h2 className={styles.title}>OTP Verification</h2>
        
        <p className={styles.subtitle}>
          Enter the 6 digit code sent to: <br />
          <span className={styles.emailText}>{location?.state?.email}</span>
        </p>

        <form onSubmit={verifyOtpHandler} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="0 0 0 0 0 0"
              className={styles.otpInput}
            />

            <div className={styles.timerBox}>
              {timer > 0 ? (
                <span>Resend code in <b className={styles.timerColor}>{timer}s</b></span>
              ) : (
                <Link to="/otpReset" className={styles.resendLink}>
                  Resend OTP
                </Link>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>

        <div className={styles.footerLink}>
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;