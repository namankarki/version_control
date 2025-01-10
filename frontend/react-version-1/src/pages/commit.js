import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CommitPage = () => {
  const { id: branchId } = useParams(); // Get branch ID from the URL
  const [commits, setCommits] = useState([]);
  const [newCommitMessage, setNewCommitMessage] = useState("");
  const [folderStructure, setFolderStructure] = useState([
    {
      name: "root",
      path: "root",
      files: [],
      subfolders: [],
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCommits();
  }, []);

  // Fetch commits for the branch
  const fetchCommits = async () => {
    try {
      const response = await fetch(`http://localhost:3000/commit/${branchId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setCommits(data.commit ? [data.commit] : []);
      } else {
        setError(data.error || "Failed to fetch commits.");
      }
    } catch (err) {
      console.error("Error fetching commits:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a file to a folder from the local PC
  const handleAddFile = (folderIndex) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const updatedFolderStructure = [...folderStructure];
        updatedFolderStructure[folderIndex].files.push({
          name: file.name,
          type: file.type,
          path: `${updatedFolderStructure[folderIndex].path}/${file.name}`,
        });
        setFolderStructure(updatedFolderStructure);
      }
    };
    input.click();
  };

  // Handle adding a folder from the local PC
  const handleAddFolder = (folderIndex) => {
    const input = document.createElement("input");
    input.type = "file";
    input.webkitdirectory = true; // Enable folder selection
    input.onchange = (event) => {
      const files = Array.from(event.target.files);
      const updatedFolderStructure = [...folderStructure];
      const parentFolder = updatedFolderStructure[folderIndex];

      // Process folder and its files
      files.forEach((file) => {
        const relativePath = file.webkitRelativePath.split("/"); // Get folder structure
        const folderName = relativePath[0]; // Top-level folder name

        // Check if folder already exists
        let folder = parentFolder.subfolders.find((f) => f.name === folderName);
        if (!folder) {
          folder = {
            name: folderName,
            path: `${parentFolder.path}/${folderName}`,
            files: [],
            subfolders: [],
          };
          parentFolder.subfolders.push(folder);
        }

        // Add files to the folder
        folder.files.push({
          name: file.name,
          type: file.type,
          path: `${folder.path}/${file.name}`,
        });
      });

      setFolderStructure(updatedFolderStructure);
    };
    input.click();
  };

  // Handle creating a new commit
  const handleCreateCommit = async () => {
    if (!newCommitMessage.trim()) {
      alert("Commit message cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: newCommitMessage,
          branchId, // Pass branch ID
          folderStructure,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Commit created successfully!");
        setCommits((prev) => [...prev, data.commit]);
        setNewCommitMessage("");
      } else {
        alert(data.error || "Failed to create commit.");
      }
    } catch (err) {
      console.error("Error creating commit:", err);
      alert("Server error. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Commits for Branch {branchId}</h1>

      {/* Create Commit */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Create a Commit</h2>
        <input
          type="text"
          placeholder="Commit message"
          value={newCommitMessage}
          onChange={(e) => setNewCommitMessage(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-2 w-full"
        />
        <button
          onClick={handleCreateCommit}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Commit
        </button>
      </div>

      {/* Folder Structure */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Folder Structure</h2>
        {folderStructure.map((folder, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded mb-4">
            <h3 className="font-bold">{folder.name}</h3>
            <button
              onClick={() => handleAddFile(index)}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              Add File
            </button>
            <button
              onClick={() => handleAddFolder(index)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Add Folder
            </button>
            <div className="mt-2">
              {folder.files.map((file, fileIndex) => (
                <p key={fileIndex} className="text-gray-600">
                  File: {file.name}
                </p>
              ))}
              {folder.subfolders.map((subfolder, subfolderIndex) => (
                <div key={subfolderIndex} className="ml-4">
                  <h4 className="font-semibold">Subfolder: {subfolder.name}</h4>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* List Existing Commits */}
      <div>
        <h2 className="text-xl font-bold mb-4">Existing Commits</h2>
        {commits.length > 0 ? (
          <ul className="space-y-2">
            {commits.map((commit) => (
              <li key={commit.id} className="p-4 bg-white rounded shadow">
                <p>
                  <strong>Message:</strong> {commit.message}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(commit.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No commits found for this branch.</p>
        )}
      </div>
    </div>
  );
};

export default CommitPage;
