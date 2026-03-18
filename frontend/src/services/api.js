const BASE_URL = "http://localhost:3001/api";

export const api = {
  // Search medicines by name/category
  searchMedicines: async (query = "") => {
    const url = query ? `${BASE_URL}/medicines?q=${query}` : `${BASE_URL}/medicines`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch medicines");
    return res.json();
  },

  // Get single medicine by ID
  getMedicine: async (id) => {
    const res = await fetch(`${BASE_URL}/medicines/${id}`);
    if (!res.ok) throw new Error("Medicine not found");
    return res.json();
  },

  // Calculate dose
  calculateDose: async ({ medicine_id, weight_kg, age_months, conditions }) => {
    const res = await fetch(`${BASE_URL}/calculate-dose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ medicine_id, weight_kg, age_months, conditions }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Calculation failed");
    return data;
  },

  // Check drug interactions
  checkInteractions: async (medicine_ids) => {
    const res = await fetch(`${BASE_URL}/check-interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ medicine_ids }),
    });
    if (!res.ok) throw new Error("Interaction check failed");
    return res.json();
  },
};