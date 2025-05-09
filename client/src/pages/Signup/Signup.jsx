import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaMapMarkedAlt } from "react-icons/fa";
import axiosInstance from "../../api/axios";
import styles from "./Signup.module.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
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
    const toastId = toast.loading("Signing up...");

    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password
      });

      if (res.status >= 200 && res.status < 300) {
        toast.dismiss(toastId);
        toast.success(res.data.message);
        setIsLoading(false);
        navigate("/login", { replace: true });
      } else {
        throw new Error("Signup failed");
      }
    } catch (err) {
      toast.dismiss(toastId);
      const message = err.response?.data?.message || 'Failed to sign up';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.titleContainer}>
          <FaMapMarkedAlt className={styles.logo} />
          <p className={styles.title}>Create an Account</p>
          <span className={styles.subtitle}>
            Join MapVerse to start logging your journeys!
          </span>
        </div>

        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.inputLabel}>
              Name
            </label>
            <input
              id="name"
              type="text"
              className={styles.inputField}
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.inputLabel}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.inputField}
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.inputLabel}>
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={styles.inputField}
              placeholder="Minimum 7 characters"
              value={password}
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
              />
              <label
                className={styles.showPasswordLabel}
                htmlFor="showPassword"
              >
                Show Password
              </label>
            </div>
          </div>

          <button className={styles.signupButton} type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>

          <p className={styles.signupText}>
          Already have an account? <Link className={styles.signupLink} to="/login">Login</Link>
        </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
