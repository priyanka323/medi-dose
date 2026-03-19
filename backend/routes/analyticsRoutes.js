const express = require('express');
const router = express.Router();

// Store anonymous analytics (in production, use a real database)
const analytics = {
  calculations: [],
  searches: [],
  interactions: []
};

// Track calculation
router.post('/track-calculation', (req, res) => {
  const { medicine_id, patient_age, patient_weight, timestamp } = req.body;
  analytics.calculations.push({
    medicine_id,
    patient_age,
    patient_weight,
    timestamp: timestamp || new Date().toISOString()
  });
  res.json({ success: true });
});

// Get analytics summary
router.get('/summary', (req, res) => {
  res.json({
    total_calculations: analytics.calculations.length,
    total_searches: analytics.searches.length,
    total_interactions_checked: analytics.interactions.length,
    popular_medicines: getPopularMedicines(),
    age_distribution: getAgeDistribution()
  });
});

function getPopularMedicines() {
  const counts = {};
  analytics.calculations.forEach(c => {
    counts[c.medicine_id] = (counts[c.medicine_id] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ id, count }));
}

function getAgeDistribution() {
  const distribution = { pediatric: 0, adult: 0, geriatric: 0 };
  analytics.calculations.forEach(c => {
    if (c.patient_age < 18) distribution.pediatric++;
    else if (c.patient_age < 65) distribution.adult++;
    else distribution.geriatric++;
  });
  return distribution;
}

module.exports = router;