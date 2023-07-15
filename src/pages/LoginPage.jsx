import React, { useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { user } = useAuth;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <h1>Login</h1>
    </div>
  );
};

export default LoginPage;
