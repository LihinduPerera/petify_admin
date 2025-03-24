import React, { useState, useEffect } from "react";
import axios from "axios";

function MedicationPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPets, setUserPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [medicals, setMedicals] = useState([]);
  const [newMedical, setNewMedical] = useState({
    date: "",
    medication: "",
    notes: "",
    status: "Active",
  });
  const [editingMedical, setEditingMedical] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://192.168.8.200:8000/auth/users/search/?query=${searchQuery}`
        );
        setUsers(response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (searchQuery === "") {
      const fetchAllUsers = async () => {
        try {
          const response = await axios.get("http://192.168.8.200:8000/auth/users");
          setUsers(response.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchAllUsers();
    } else {
      fetchUsers();
    }
  }, [searchQuery]);

  const fetchUserPets = async (userId) => {
    try {
      const response = await axios.get(
        `http://192.168.8.200:8000/${userId}/pets`
      );
      setUserPets(response.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const fetchPetMedicals = async (petId) => {
    try {
      const response = await axios.get(
        `http://192.168.8.200:8000/${petId}/medicals`
      );
      setMedicals(response.data);
    } catch (error) {
      console.error("Error fetching medicals:", error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSelectedPet(null);
    setUserPets([]);
    fetchUserPets(user.id);
  };

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
    setMedicals([]);
    fetchPetMedicals(pet._id);
  };

  const handleNewMedicalChange = (e) => {
    const { name, value } = e.target;
    setNewMedical((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedical = async () => {
    if (!selectedPet) return;

    const medicalData = {
      ...newMedical,
      date: newMedical.date
        ? new Date(newMedical.date).toISOString().split("T")[0]
        : "", // Format date as YYYY-MM-DD
    };

    try {
      const response = await axios.post(
        `http://192.168.8.200:8000/${selectedPet._id}/medicals`,
        medicalData
      );
      setMedicals((prev) => [...prev, response.data]);
      setNewMedical({ date: "", medication: "", notes: "", status: "Active" });
    } catch (error) {
      console.error("Error adding medical:", error);
    }
  };

  const handleUpdateMedical = async () => {
    if (!editingMedical) return;

    // Ensure that the date is correctly formatted as 'YYYY-MM-DD'
    const updatedData = {
      ...newMedical,
      date: newMedical.date ? new Date(newMedical.date).toISOString().split("T")[0] : "",
    };

    if (!updatedData.date) {
      console.error("Date is required and cannot be empty.");
      return;
    }

    try {
      const response = await axios.put(
        `http://192.168.8.200:8000/medicals/${editingMedical._id}`,
        updatedData
      );

      setMedicals((prev) =>
        prev.map((medical) =>
          medical._id === editingMedical._id ? { ...medical, ...response.data } : medical
        )
      );

      setEditingMedical(null);
      setNewMedical({ date: "", medication: "", notes: "", status: "Active" });
    } catch (error) {
      console.error("Error updating medical:", error);
    }
  };

  const handleDeleteMedical = async (medicalId) => {
    try {
      await axios.delete(`http://192.168.8.200:8000/medicals/${medicalId}`);

      setMedicals([]);
      if (selectedPet) {
        fetchPetMedicals(selectedPet._id);
      }
    } catch (error) {
      console.error("Error deleting medical:", error);
    }
  };

  const handleEditMedical = (medical) => {
    setEditingMedical(medical);
    setNewMedical({
      date: medical.date,
      medication: medical.medication,
      notes: medical.notes,
      status: medical.status,
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="medication-page">
      <h1 className="page-title">Medication Page</h1>
      <section className="user-search">
          <input
            type="text"
            placeholder="Search by email"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </section>
      <div className="main-layout">
        <section className="user-list">
          <h2 className="section-title">Users</h2>
          <ul>
            {users.length > 0 ? (
              users.map((user) => (
                <li
                  key={user.id}
                  className="user-item"
                  onClick={() => handleUserClick(user)}
                >
                  <span>{user.name}</span> <span>({user.email})</span>
                </li>
              ))
            ) : (
              <p>No users found. Try a different search or clear the search to view all users.</p>
            )}
          </ul>
        </section>

        {selectedUser && (
          <section className="pet-list">
            <h2 className="section-title">
              Pets for User: {selectedUser.name}
            </h2>
            <ul>
              {userPets.length > 0 ? (
                userPets.map((pet) => (
                  <li
                    key={pet._id}
                    className="pet-item"
                    onClick={() => handlePetClick(pet)}
                  >
                    <strong>Name:</strong> {pet.name} <br />
                    <strong>Species:</strong> {pet.species} <br />
                    <strong>Breed:</strong> {pet.breed} <br />
                    <strong>Age:</strong> {pet.age} <br />
                    <strong>Gender:</strong> {pet.gender} <br />
                  </li>
                ))
              ) : (
                <p>No pets found for this user.</p>
              )}
            </ul>
          </section>
        )}

        {selectedPet && (
          <section className="medical-records">
            <h2 className="section-title">
              Medical Records for Pet: {selectedPet.name}
            </h2>
            <ul>
              {medicals.length > 0 ? (
                medicals.map((medical) => (
                  <li key={medical._id} className="medical-item">
                    <strong>Medication:</strong> {medical.medication} <br />
                    <strong>Date:</strong>{" "}
                    {new Date(medical.date).toLocaleDateString()} <br />
                    <strong>Status:</strong> {medical.status} <br />
                    <button
                      className="update-btn"
                      onClick={() => handleEditMedical(medical)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteMedical(medical._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p>No medical records found for this pet.</p>
              )}
            </ul>

            <h3 className="form-title">{editingMedical ? "Update Medical Record" : "Add a New Medical Record"}</h3>
            <form
              className="medical-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (editingMedical) {
                  handleUpdateMedical();
                } else {
                  handleAddMedical();
                }
              }}
            >
              <label>
                Date:
                <input
                  className="form-input"
                  type="date"
                  name="date"
                  value={newMedical.date}
                  onChange={handleNewMedicalChange}
                />
              </label>
              <label>
                Medication:
                <input
                  className="form-input"
                  type="text"
                  name="medication"
                  value={newMedical.medication}
                  onChange={handleNewMedicalChange}
                />
              </label>
              <label>
                Notes:
                <textarea
                  className="form-input"
                  name="notes"
                  value={newMedical.notes}
                  onChange={handleNewMedicalChange}
                />
              </label>
              <label>
                Status:
                <select
                  className="form-input"
                  name="status"
                  value={newMedical.status}
                  onChange={handleNewMedicalChange}
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </label>
              <button className="submit-btn" type="submit">
                {editingMedical ? "Update Medical Record" : "Add Medical Record"}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

export default MedicationPage;
