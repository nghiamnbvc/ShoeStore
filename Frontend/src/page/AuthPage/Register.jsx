import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
  });
  console.log("Sending formData:", JSON.stringify(formData));

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5235/api/AuthApi/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
      } else {
        if (data.errors) {
          const fieldErrors = Object.entries(data.errors)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join("\n");
          setMessage(fieldErrors);
        } else {
          setMessage(data.message || "Registration failed.");
        }
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 shadow-md rounded w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        {message && (
          <p className="text-center text-sm mb-4 text-red-500">{message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
