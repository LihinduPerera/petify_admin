import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MedicationPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPets, setUserPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null); 
  const [medicals, setMedicals] = useState([]);
  const [newMedical, setNewMedical] = useState({
    date: '',
    medication: '',
    notes: '',
    status: 'Active',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://192.168.8.200:8000/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserPets = async (userId) => {
    try {
      const response = await axios.get(`http://192.168.8.200:8000/${userId}/pets`);
      setUserPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchPetMedicals = async (petId) => {
    try {
      const response = await axios.get(`http://192.168.8.200:8000/${petId}/medicals`);
      setMedicals(response.data);
    } catch (error) {
      console.error('Error fetching medicals:', error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserPets(user.id);
  };

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
    fetchPetMedicals(pet._id);
  };

  const handleNewMedicalChange = (e) => {
    const { name, value } = e.target;
    setNewMedical((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedical = async () => {
    if (!selectedPet) return;

    try {
      const response = await axios.post(
        `http://192.168.8.200:8000/${selectedPet._id}/medicals`,
        newMedical
      );
      setMedicals((prev) => [...prev, response.data]);
      setNewMedical({ date: '', medication: '', notes: '', status: 'Active' });
    } catch (error) {
      console.error('Error adding medical:', error);
    }
  };

  const handleUpdateMedical = async (medicalId) => {
    const updatedData = {
      ...newMedical,
      date: newMedical.date || new Date().toISOString(),
    };

    try {
      const response = await axios.put(
        `http://192.168.8.200:8000/medicals/${medicalId}`,
        updatedData
      );
      setMedicals((prev) =>
        prev.map((medical) =>
          medical.id === medicalId ? { ...medical, ...response.data } : medical
        )
      );
    } catch (error) {
      console.error('Error updating medical:', error);
    }
  };

  const handleDeleteMedical = async (medicalId) => {
    try {
      await axios.delete(`http://192.168.8.200:8000/medicals/${medicalId}`);
      setMedicals((prev) => prev.filter((medical) => medical.id !== medicalId));
    } catch (error) {
      console.error('Error deleting medical:', error);
    }
  };

  return (
    <div className="medication-page">
      <h1 className="page-title">Medication Page</h1>

      <div className="main-layout">
        <section className="user-list">
          <h2 className="section-title">Users</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className="user-item"
                onClick={() => handleUserClick(user)}
              >
                <span>{user.name}</span> <span>({user.email})</span>
              </li>
            ))}
          </ul>
        </section>

        {selectedUser && (
          <section className="pet-list">
            <h2 className="section-title">Pets for User: {selectedUser.name}</h2>
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
            <h2 className="section-title">Medical Records for Pet: {selectedPet.name}</h2>
            <ul>
              {medicals.length > 0 ? (
                medicals.map((medical) => (
                  <li key={medical.id} className="medical-item">
                    <strong>Medication:</strong> {medical.medication} <br />
                    <strong>Date:</strong> {new Date(medical.date).toLocaleDateString()} <br />
                    <strong>Status:</strong> {medical.status} <br />
                    <button
                      className="update-btn"
                      onClick={() => handleUpdateMedical(medical.id)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteMedical(medical.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p>No medical records found for this pet.</p>
              )}
            </ul>

            <h3 className="form-title">Add a New Medical Record</h3>
            <form
              className="medical-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddMedical();
              }}
            >
              <label>
                Date:
                <input
                  className="form-input"
                  type="datetime-local"
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
              <button className="submit-btn" type="submit">Add Medical Record</button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

export default MedicationPage;