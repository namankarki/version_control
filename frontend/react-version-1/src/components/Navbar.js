import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between">
    <h1 className="text-lg font-bold">AuthApp</h1>
    <div>
        <Link to="/login" className="mr-4">Login</Link>
        <Link to="/register">Register</Link>
    </div>
    </nav>
);
};

export default Navbar;
