import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState(null); // File input
    const [age, setAge] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (age && age < 0) {
        alert("Age must be a non-negative number");
        return;
    }

        // Create FormData object
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("photo", photo); // Append file
        formData.append("age", age);
        formData.append("description", description);

        try {
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                body: formData, // Send FormData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful!");
                navigate("/login");
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.error("Error:", err);
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
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Photo</label>
                    <input
                        type="file"
                        className="w-full"
                        onChange={(e) => setPhoto(e.target.files[0])} // Save file
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Age</label>
                    <input
                        type="number"
                        min="0" // Prevent negative values
                        className="w-full p-2 border border-gray-300 rounded"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        />
                    </div>

                <div className="mb-6">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
