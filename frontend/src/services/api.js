// //const BASE_URL = "http://localhost:3001/api";
// const BASE_URL = "https://medi-dose.onrender.com/api"

// export const api = {
//   // Search medicines by name/category
//   searchMedicines: async (query = "") => {
//     const url = query ? `${BASE_URL}/medicines?q=${query}` : `${BASE_URL}/medicines`;
//     const res = await fetch(url);
//     if (!res.ok) throw new Error("Failed to fetch medicines");
//     return res.json();
//   },

//   // Get single medicine by ID
//   getMedicine: async (id) => {
//     const res = await fetch(`${BASE_URL}/medicines/${id}`);
//     if (!res.ok) throw new Error("Medicine not found");
//     return res.json();
//   },

//   // Calculate dose
//   calculateDose: async ({ medicine_id, weight_kg, age_months, conditions }) => {
//     const res = await fetch(`${BASE_URL}/calculate-dose`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ medicine_id, weight_kg, age_months, conditions }),
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.error || "Calculation failed");
//     return data;
//   },

//   // Check drug interactions
//   checkInteractions: async (medicine_ids) => {
//     const res = await fetch(`${BASE_URL}/check-interactions`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ medicine_ids }),
//     });
//     if (!res.ok) throw new Error("Interaction check failed");
//     return res.json();
//   },
// };
// // Use environment variable for API URL
// const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// export const api = {
//   // Search medicines by name/category
//   searchMedicines: async (query = "") => {
//     const url = query ? `${BASE_URL}/medicines?q=${encodeURIComponent(query)}` : `${BASE_URL}/medicines`;
//     try {
//       const res = await fetch(url);
//       if (!res.ok) throw new Error("Failed to fetch medicines");
//       return res.json();
//     } catch (error) {
//       console.error("API Error:", error);
//       throw error;
//     }
//   },

//   // Get single medicine by ID
//   getMedicine: async (id) => {
//     try {
//       const res = await fetch(`${BASE_URL}/medicines/${id}`);
//       if (!res.ok) throw new Error("Medicine not found");
//       return res.json();
//     } catch (error) {
//       console.error("API Error:", error);
//       throw error;
//     }
//   },

//   // Calculate dose
//   calculateDose: async ({ medicine_id, weight_kg, age_months, conditions }) => {
//     try {
//       const res = await fetch(`${BASE_URL}/calculate-dose`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ medicine_id, weight_kg, age_months, conditions }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Calculation failed");
//       return data;
//     } catch (error) {
//       console.error("API Error:", error);
//       throw error;
//     }
//   },

//   // Check drug interactions
//   checkInteractions: async (medicine_ids) => {
//     try {
//       const res = await fetch(`${BASE_URL}/check-interactions`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ medicine_ids }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Interaction check failed");
//       return data;
//     } catch (error) {
//       console.error("API Error:", error);
//       throw error;
//     }
//   },

//   // AI Chat
//   aiChat: async (query, patientContext) => {
//     try {
//       const res = await fetch(`${BASE_URL}/ai/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ query, patient: patientContext }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "AI chat failed");
//       return data;
//     } catch (error) {
//       console.error("AI Error:", error);
//       throw error;
//     }
//   },

//   // Predict dose
//   predictDose: async (patient, symptoms, medicineHint) => {
//     try {
//       const res = await fetch(`${BASE_URL}/ai/predict-dose`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ patient, symptoms, medicine_hint: medicineHint }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Prediction failed");
//       return data;
//     } catch (error) {
//       console.error("Prediction Error:", error);
//       throw error;
//     }
//   },

//   // Process voice input
//   processVoice: async (audioText) => {
//     try {
//       const res = await fetch(`${BASE_URL}/ai/process-voice`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ audio_text: audioText }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Voice processing failed");
//       return data;
//     } catch (error) {
//       console.error("Voice Error:", error);
//       throw error;
//     }
//   }
// };
const BASE_URL = process.env.REACT_APP_API_URL || "https://medi-dose.onrender.com/api";

export const api = {
  // Test connection first
  testConnection: async () => {
    try {
      const res = await fetch(BASE_URL.replace('/api', '') + '/health');
      return res.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },

  // Search medicines
  searchMedicines: async (query = "") => {
    try {
      console.log('Fetching from:', BASE_URL); // Debug log
      
      const url = query 
        ? `${BASE_URL}/medicines?q=${encodeURIComponent(query)}` 
        : `${BASE_URL}/medicines`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Received data:', data.length, 'medicines');
      return data;
    } catch (error) {
      console.error("API Error in searchMedicines:", error);
      throw error;
    }
  },

  // AI Chat
  aiChat: async (query, patientContext) => {
    try {
      console.log('Sending chat query:', query);
      
      const res = await fetch(`${BASE_URL}/ai/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        mode: 'cors',
        body: JSON.stringify({ 
          query, 
          patient: patientContext || {} 
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("AI Chat Error:", error);
      // Return a friendly error message
      return { 
        message: "I'm having trouble connecting to the AI service. Please check if the backend is running at: https://medi-dose.onrender.com/api/medicines" 
      };
    }
  },

  // Calculate dose
  calculateDose: async ({ medicine_id, weight_kg, age_months, conditions }) => {
    try {
      const res = await fetch(`${BASE_URL}/calculate-dose`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        mode: 'cors',
        body: JSON.stringify({ medicine_id, weight_kg, age_months, conditions }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Calculation failed");
      return data;
    } catch (error) {
      console.error("API Error in calculateDose:", error);
      throw error;
    }
  },

  // Check interactions
  checkInteractions: async (medicine_ids) => {
    try {
      const res = await fetch(`${BASE_URL}/check-interactions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        mode: 'cors',
        body: JSON.stringify({ medicine_ids }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Interaction check failed");
      return data;
    } catch (error) {
      console.error("API Error in checkInteractions:", error);
      throw error;
    }
  }
};

// Test connection on load
api.testConnection().then(isConnected => {
  console.log('Backend connection:', isConnected ? '✅ OK' : '❌ Failed');
});