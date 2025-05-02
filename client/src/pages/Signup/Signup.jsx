import React, { useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axiosInstance from "../../api/axios";
import styles from "./Signup.module.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password
      });

      if (res.status === 200) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Error signing up", err);
      alert("Signup failed. Try again.");
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

          <button type="submit" className={styles.signupButton}>
            Signup
          </button>

          <p className={styles.signupText}>
            Already have an account?{" "}
            <a href="/login" className={styles.signupLink}>
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
