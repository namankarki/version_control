import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState(false);
const navigate = useNavigate();

const handleRegister = async(e) => {
    e.preventDefault();
    try{
        const response= await fetch("http://localhost:3000/auth/register",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();

        if (response.ok) {
        setSuccess(true);
        alert(data.message); // Show success message
        navigate("/login"); // Redirect to login page
    } else {
        setError(data.error); // Show error message from backend
    }
    } catch (err) {
    setError("Something went wrong. Please try again.");
    }
    
};

return (
    <div className="flex justify-center items-center h-screen">
    <form onSubmit={handleRegister} className="w-1/3 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
        <label className="block text-gray-700">Username</label>
        <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        </div>
        <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        </div>
        <div className="mb-6">
        <label className="block text-gray-700">Password</label>
        <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Register
        </button>
    </form>
    </div>
);
};

export default Register;
