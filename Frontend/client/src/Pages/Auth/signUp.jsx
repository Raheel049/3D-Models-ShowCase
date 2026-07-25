import React, { useState } from "react";
import styles from "./signUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";


const SignUp = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlePasswordChange = (val) => {
    setPassword(val);
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!val) {
      setPasswordError("");
    } else if (!passwordRegex.test(val)) {
      setPasswordError("8+ chars, Uppercase, Lowercase, Number & Special Character");
    } else {
      setPasswordError("");
    }
  };

  const SignUpHandler = async () => {
    if (passwordError || !password) {
      toast.error("Please enter a valid password first!");
      return;
    }

    const API = import.meta.env.VITE_API_URL;
    setLoading(true);

    const userObj = { name, phoneNumber, email, password };
    

    try {
      const res = await api.post("/auth/signup", userObj);
      toast.success(res.data.message || "SignUp Successful!");

      if(res.data.status === true){
        navigate("/otp", { state: { email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "SignUp failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.glassBox}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Join our 3D Models system</p>

        <div className={styles.form}>
          <div className={styles.field}>
            <input
              type="text"
              required
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className={styles.glassInput}
            />
          </div>

          <div className={styles.field}>
            <input
              type="text"
              required
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
              className={styles.glassInput}
            />
          </div>

          <div className={styles.field}>
            <input
              type="email"
              required
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className={styles.glassInput}
            />
          </div>

          <div className={styles.field}>
            <input
              type="password"
              required
              placeholder="Password"
              onChange={(e) => handlePasswordChange(e.target.value)}
              value={password}
              className={`${styles.glassInput} ${passwordError ? styles.inputError : ""}`}
            />
            {passwordError && <p className={styles.errorText}>{passwordError}</p>}
          </div>

          <Link to={"/login"} className={styles.loginLink}>
            Already have an account? <span>Login</span>
          </Link>

          <button 
            onClick={SignUpHandler} 
            disabled={loading || passwordError}
            className={styles.submitBtn}
          >
            {loading ? "Creating..." : "SignUp"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;