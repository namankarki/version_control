import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/getUser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass token for authentication
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data); // Set user and repositories
        } else {
          setError(data.error || "Failed to fetch user details");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Server error. Please try again.");
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchUserDetails();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.removeItem("token"); // Remove token from localStorage regardless of response

      if (response.ok) {
        navigate("/login"); // Redirect to login page
      } else {
        setError("Failed to log out. Please try again.");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      setError("Server error. Please try again.");
    }
  };

  // Render loading state or error
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#profile" className="hover:text-gray-400">
                Profile
              </a>
            </li>
            <li className="mb-4">
              <a href="#repositories" className="hover:text-gray-400">
                Repositories
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="hover:text-gray-400 bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Profile Section */}
        <section id="profile" className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <div className="flex items-center space-x-4">
            <img
              src={`http://localhost:3000/uploads/${user?.photo}`}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <div>
              <p className="text-lg font-bold">{user?.username}</p>
              <p>Age: {user?.age}</p>
              <p>{user?.description}</p>
            </div>
          </div>
        </section>

        {/* Repository Section */}
        <section id="repositories" className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Repositories</h1>
          {user?.repositories && user.repositories.length > 0 ? (
            <ul className="space-y-2">
              {user.repositories.map((repo) => (
                <li key={repo.id} className="p-4 bg-white rounded shadow">
                  {repo.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No repositories found. Create one!</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
