import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }

    setPasswordMatchError("");

    try {
      const response = await axios.post(
        "http://192.168.8.200:8000/auth/admin-register",
        {
          email,
          password,
        }
      );
      if (response.data.message === "Registration successful") {
        navigate("/home");
      }
    } catch (err) {
      setError("Error ".err);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form className="signup-form" onSubmit={handleSignup}>
        <div>
          <label htmlFor="signup-email">Email:</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="signup-password">Password:</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="signup-confirm-password">Confirm Password:</label>
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signup-btn">
          Signup
        </button>
      </form>

      {passwordMatchError && (
        <p className="signup-password-match-error">{passwordMatchError}</p>
      )}
      {error && <p className="signup-error">{error}</p>}

      <p className="signup-link">
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
