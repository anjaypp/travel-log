import React from "react";
import { useState } from "react";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className={styles.loginContainer}>
      <form className="p-4 rounded shadow bg-light">
        <h3 className="text-center mb-4">Login</h3>

        <div className="mb-3">
          <input
          type="email" 
          className="form-control" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3 position-relative">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Password(Min 7 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="showPasswordCheckbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="showPasswordCheckbox">
            Show Password
          </label>
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
