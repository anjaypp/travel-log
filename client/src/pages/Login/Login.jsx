import React, { useState } from "react";
import axiosInstance from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      if (res.status === 200) {
        localStorage.setItem("accessToken", res.data.accessToken);
        navigate("/");
      }
    } catch (err) {
      console.error("Error logging in", err);
      alert("Invalid credentials");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.titleContainer}>
        <FaMapMarkedAlt className={styles.logo} />
        <p className={styles.title}>Login to Your Account</p>
        <span className={styles.subtitle}>Welcome to MapVerse App! Please login to your account to continue.</span>
        </div>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.inputLabel} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={styles.inputField}
              value={email}
              placeholder="name@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel} htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              className={styles.inputField}
              placeholder="Minimum 7 characters"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className={styles.showPasswordCheckbox}>
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label className={styles.showPasswordLabel} htmlFor="showPassword">Show Password</label>
            </div>
          </div>

          <button type="submit" className={styles.loginButton}>Login</button>

          <span className={styles.signupText}>Don't have an account?{" "}<Link to="/signup">Sign up</Link> </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
