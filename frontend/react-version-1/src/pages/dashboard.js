import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newRepo, setNewRepo] = useState("");
  const navigate = useNavigate();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/getUser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser({ ...data, repositories: data.repositories || [] });
        } else {
          setError(data.error || "Failed to fetch user details");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Server error. Please try again.");
      } finally {
        setLoading(false);
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

      localStorage.removeItem("token");

      if (response.ok) {
        navigate("/login");
      } else {
        setError("Failed to log out. Please try again.");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      setError("Server error. Please try again.");
    }
  };

  // Create a repository
  const handleCreateRepository = async () => {
    if (!newRepo.trim()) {
      alert("Repository name cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/repo/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: newRepo }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Repository created successfully!");
        setUser((prev) => ({
          ...prev,
          repositories: [...prev.repositories, data.repo],
        }));
        setNewRepo("");
      } else {
        alert(data.error || "Failed to create repository.");
      }
    } catch (err) {
      console.error("Error creating repository:", err);
      alert("Server error. Please try again.");
    }
  };

  // Navigate to the Commit Page with repository ID
  const handleRepositoryClick = (repoId) => {
    navigate(`/repositories/${repoId}/commits`);
  };

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
          {/* Create Repository */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="New repository name"
              value={newRepo}
              onChange={(e) => setNewRepo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <button
              onClick={handleCreateRepository}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create Repository
            </button>
          </div>
          {/* List Repositories */}
          {user?.repositories && user.repositories.length > 0 ? (
            <ul className="space-y-2">
              {user.repositories.map((repo) => (
                <li
                  key={repo.id}
                  className="p-4 bg-white rounded shadow cursor-pointer"
                  onClick={() => handleRepositoryClick(repo.id)}
                >
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
