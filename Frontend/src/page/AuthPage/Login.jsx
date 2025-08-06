import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = () => {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5235/api/AuthApi/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // ✅ Lưu token vào localStorage
      localStorage.setItem("token", data.token);

      // ✅ Điều hướng về trang chủ
      history.push("/");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <form
        className="bg-white p-8 shadow-md rounded w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {errorMsg && (
          <div className="text-red-500 text-sm mb-3 text-center">
            {errorMsg}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-3">
          Login
        </button>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => history.push("/register")}
            >
              Register
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
