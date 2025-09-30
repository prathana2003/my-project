import React, { useState } from "react";

const initialPatients = [
  { id: 1, name: "Riya", disease: "Flu" },
  { id: 2, name: "Vikas", disease: "Diabetes" },
  { id: 3, name: "Ali", disease: "Asthma" },
];

const Patient = () => {
  const [patients, setPatients] = useState(initialPatients);

  const removePatient = (id) => {
    setPatients(patients.filter((patient) => patient.id !== id));
  };

  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {patients.map((patient) => (
        <div
          key={patient.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            minWidth: "180px",
            boxShadow: "2px 2px 8px #eee",
          }}
        >
          <h3>{patient.name}</h3>
          <p>
            <strong>Disease:</strong> {patient.disease}
          </p>
          <button onClick={() => removePatient(patient.id)}>Remove</button>
        </div>
      ))}
      {patients.length === 0 && <p>No patients.</p>}
    </div>
  );
};

export default Patient;