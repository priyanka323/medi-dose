import { useState } from 'react';

export default function PatientProfileCard({ onProfileChange }) {
  const [profile, setProfile] = useState({
    weight: '',
    height: '',
    age: '',
    renalFunction: 'normal',
    hepaticFunction: 'normal',
    allergies: [],
    conditions: [],
    geneticMarkers: []
  });

  const updateProfile = (key, value) => {
    const newProfile = { ...profile, [key]: value };
    setProfile(newProfile);
    onProfileChange?.(newProfile);
  };

  const toggleItem = (list, item) => {
    const newList = list.includes(item)
      ? list.filter(x => x !== item)
      : [...list, item];
    return newList;
  };

  const calculateBMI = () => {
    if (profile.weight && profile.height) {
      const bmi = profile.weight / ((profile.height / 100) ** 2);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const bmi = calculateBMI();

  return (
    <div className="profile-card">
      <h3>Patient Profile</h3>
      
      <div className="profile-grid">
        <div className="field">
          <label>Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={profile.weight}
            onChange={(e) => updateProfile('weight', e.target.value)}
            placeholder="e.g., 70"
          />
        </div>
        
        <div className="field">
          <label>Height (cm)</label>
          <input
            type="number"
            step="1"
            min="0"
            value={profile.height}
            onChange={(e) => updateProfile('height', e.target.value)}
            placeholder="e.g., 170"
          />
        </div>
      </div>

      {bmi && (
        <div className={`bmi-indicator ${getBMICategory(bmi).toLowerCase()}`}>
          <strong>BMI: {bmi}</strong>
          <span>{getBMICategory(bmi)}</span>
        </div>
      )}

      <div className="field">
        <label>Age (years)</label>
        <input
          type="number"
          min="0"
          max="120"
          value={profile.age}
          onChange={(e) => updateProfile('age', e.target.value)}
          placeholder="e.g., 45"
        />
      </div>

      <div className="clinical-factors">
        <div className="field">
          <label>Renal Function</label>
          <select 
            value={profile.renalFunction}
            onChange={(e) => updateProfile('renalFunction', e.target.value)}
          >
            <option value="normal">Normal (eGFR {'>'} 90)</option>
            <option value="mild">Mild Impairment (eGFR 60-89)</option>
            <option value="moderate">Moderate Impairment (eGFR 30-59)</option>
            <option value="severe">Severe Impairment (eGFR {'<'} 30)</option>
          </select>
        </div>

        <div className="field">
          <label>Hepatic Function</label>
          <select
            value={profile.hepaticFunction}
            onChange={(e) => updateProfile('hepaticFunction', e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="mild">Mild Impairment</option>
            <option value="moderate">Moderate Impairment</option>
            <option value="severe">Severe Impairment</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>Conditions</label>
        <div className="chip-group">
          {['renal impairment', 'hepatic impairment', 'diabetes', 'hypertension', 'asthma'].map(condition => (
            <button
              key={condition}
              className={`chip ${profile.conditions.includes(condition) ? 'active' : ''}`}
              onClick={() => {
                const newConditions = toggleItem(profile.conditions, condition);
                updateProfile('conditions', newConditions);
              }}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Allergies</label>
        <div className="chip-group">
          {['penicillin', 'sulfa', 'aspirin', 'ibuprofen'].map(allergy => (
            <button
              key={allergy}
              className={`chip ${profile.allergies.includes(allergy) ? 'active' : ''}`}
              onClick={() => {
                const newAllergies = toggleItem(profile.allergies, allergy);
                updateProfile('allergies', newAllergies);
              }}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Genetic Markers</label>
        <div className="chip-group">
          {['CYP2D6 poor', 'CYP2C19 variant', 'HLA-B*5701'].map(marker => (
            <button
              key={marker}
              className={`chip ${profile.geneticMarkers.includes(marker) ? 'active' : ''}`}
              onClick={() => {
                const newMarkers = toggleItem(profile.geneticMarkers, marker);
                updateProfile('geneticMarkers', newMarkers);
              }}
            >
              {marker}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}