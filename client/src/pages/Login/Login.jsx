import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, setIsAuthenticated, loading } = useAuth();

  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password.length < 7) {
      toast.error("Password must be at least 7 characters");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        setIsAuthenticated(true);
        toast.dismiss(toastId);
        toast.success(res.data.message);
        navigate("/", { replace: true });
      } else {
        throw new Error("No access token received");
      }
    } catch (err) {
      toast.dismiss(toastId);
      const message = err.response?.data?.message || "Failed to log in";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.titleContainer}>
          <FaMapMarkedAlt className={styles.logo} />
          <p className={styles.title}>Login to Your Account</p>
          <span className={styles.subtitle}>
            Welcome to MapVerse App! Please login to your account to continue.
          </span>
        </div>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.inputLabel} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.inputField}
              value={email}
              placeholder="name@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              className={styles.inputField}
              placeholder="Minimum 7 characters"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className={styles.showPasswordCheckbox}>
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                disabled={isLoading}
              />
              <label
                className={styles.showPasswordLabel}
                htmlFor="showPassword"
              >
                Show Password
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            Login
          </button>

          <span className={styles.signupText}>
            Don't have an account? <Link to="/signup">Sign up</Link>{" "}
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
