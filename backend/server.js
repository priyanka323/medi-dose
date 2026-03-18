const express = require('express');
const cors = require('cors');
const medicines = require('./medicines.json');

const app = express();
app.use(cors());
app.use(express.json());

// GET all medicines (for search)
app.get('/api/medicines', (req, res) => {
  const { q } = req.query;
  if (q) {
    const filtered = medicines.filter(m =>
      m.name.toLowerCase().includes(q.toLowerCase()) ||
      m.category.toLowerCase().includes(q.toLowerCase())
    );
    return res.json(filtered);
  }
  res.json(medicines);
});

// GET single medicine
app.get('/api/medicines/:id', (req, res) => {
  const med = medicines.find(m => m.id === req.params.id);
  if (!med) return res.status(404).json({ error: 'Medicine not found' });
  res.json(med);
});

// POST calculate dose
app.post('/api/calculate-dose', (req, res) => {
  const { medicine_id, weight_kg, age_months, conditions = [] } = req.body;

  if (!medicine_id || !weight_kg || age_months === undefined) {
    return res.status(400).json({ error: 'medicine_id, weight_kg, and age_months are required' });
  }

  const med = medicines.find(m => m.id === medicine_id);
  if (!med) return res.status(404).json({ error: 'Medicine not found' });

  const warnings = [];
  const isAdult = age_months >= 216; // 18 years

  // Age check
  if (age_months < med.min_age_months) {
    return res.status(400).json({
      error: `${med.name} is not recommended for patients under ${Math.floor(med.min_age_months / 12)} years old.`,
      safe: false
    });
  }

  // Contraindication check
  const matched_contra = conditions.filter(c =>
    med.contraindications.some(contra => contra.toLowerCase().includes(c.toLowerCase()))
  );
  if (matched_contra.length > 0) {
    warnings.push(`⚠️ CONTRAINDICATED: Patient condition "${matched_contra.join(', ')}" conflicts with this medication.`);
  }

  // Calculate raw dose
  let calculated_mg = parseFloat((med.dose_per_kg * weight_kg).toFixed(2));

  // Apply max single dose cap
  const max_single = isAdult ? med.max_single_dose_mg : med.pediatric_max_single_dose_mg;
  let final_dose_mg = Math.min(calculated_mg, max_single);
  let capped = final_dose_mg < calculated_mg;

  if (capped) {
    warnings.push(`ℹ️ Dose capped at maximum single dose of ${max_single}mg.`);
  }

  // Frequency
  const doses_per_day = med.frequency_hours > 0 ? Math.floor(24 / med.frequency_hours) : 1;
  const daily_dose_mg = parseFloat((final_dose_mg * doses_per_day).toFixed(2));

  if (daily_dose_mg > med.max_daily_dose_mg) {
    warnings.push(`⚠️ WARNING: Total daily dose (${daily_dose_mg}mg) exceeds maximum daily dose (${med.max_daily_dose_mg}mg). Reduce frequency.`);
  }

  res.json({
    medicine: med.name,
    category: med.category,
    route: med.route,
    patient: {
      weight_kg,
      age_months,
      age_years: parseFloat((age_months / 12).toFixed(1)),
      patient_type: isAdult ? 'Adult' : 'Pediatric'
    },
    dosing: {
      calculated_mg,
      final_dose_mg,
      frequency: `Every ${med.frequency_hours} hours`,
      doses_per_day,
      daily_dose_mg,
      max_single_dose_mg: max_single,
      max_daily_dose_mg: med.max_daily_dose_mg,
      dose_per_kg_used: med.dose_per_kg
    },
    safe: warnings.filter(w => w.includes('CONTRAINDICATED') || w.includes('WARNING')).length === 0,
    warnings,
    notes: med.notes,
    interactions: med.interactions
  });
});

// POST check drug interactions
app.post('/api/check-interactions', (req, res) => {
  const { medicine_ids } = req.body;
  if (!medicine_ids || medicine_ids.length < 2) {
    return res.status(400).json({ error: 'Provide at least 2 medicine_ids' });
  }

  const selected = medicines.filter(m => medicine_ids.includes(m.id));
  const flagged = [];

  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const a = selected[i];
      const b = selected[j];
      const aInteractsWithB = a.interactions.some(x =>
        b.name.toLowerCase().includes(x.toLowerCase())
      );
      const bInteractsWithA = b.interactions.some(x =>
        a.name.toLowerCase().includes(x.toLowerCase())
      );
      if (aInteractsWithB || bInteractsWithA) {
        flagged.push({
          drug_a: a.name,
          drug_b: b.name,
          severity: 'moderate',
          message: `Potential interaction between ${a.name} and ${b.name}. Monitor closely.`
        });
      }
    }
  }

  res.json({
    total_checked: selected.length,
    interactions_found: flagged.length,
    interactions: flagged
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ MediDose API running on http://localhost:${PORT}`);
});