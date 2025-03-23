import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MedicationPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userPets, setUserPets] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://192.168.8.200:8000/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserPets = async (userId) => {
    try {
      const response = await axios.get(`http://192.168.8.200:8000/${userId}/pets`);
      setUserPets(response.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    fetchUserPets(userId);
  };

  return (
    <div>
      <h1>Medication Page</h1>

      {/* Display list of users */}
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => handleUserClick(user.id)}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>

      {/* Display pets of selected user */}
      {selectedUserId && (
        <>
          <h2>Pets for User ID: {selectedUserId}</h2>
          <ul>
            {userPets.length > 0 ? (
              userPets.map((pet) => (
                <li key={pet._id}>
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
        </>
      )}
    </div>
  );
}

export default MedicationPage;
