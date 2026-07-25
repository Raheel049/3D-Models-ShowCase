import React, { useState } from "react";
import styles from "./changePassword.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || searchParams.get("q");

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const changeHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      return toast.error("Invalid or missing reset token. Please request a new link.");
    }
    if (!password || !confirmPassword) {
      return toast.error("All fields are required");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (!validatePassword(password)) {
      return toast.error("Password must include: Uppercase, Lowercase, Number & Special Char (Min 8)");
    }

    setLoading(true);
    try {
      // Backend ko password, confirmPassword aur token teeno bhejein
      const res = await api.post('/auth/change-password', { password, confirmPassword, token });
      toast.success(res.data.message || "Password changed successfully!");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.changeContainer}>
      <div className={styles.glassBox}>
        <h2 className={styles.title}>Secure Reset</h2>
        <p className={styles.subtitle}>Enter your new credentials below</p>

        <form onSubmit={changeHandler} className={styles.form}>
          {/* New Password Field */}
          <div className={styles.field}>
            <input
              type="password"
              required
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.glassInput}
            />
          </div>

          {/* Confirm Password Field (Added) */}
          <div className={styles.field}>
            <input
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.glassInput}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;