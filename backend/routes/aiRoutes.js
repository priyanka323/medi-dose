// const express = require('express');
// const router = express.Router();
// const Natural = require('natural');
// //const cache = require('node-cache')({ stdTTL: 600 }); // 10 minute cache
// const cache = new NodeCache({ stdTTL: 600 });
// // Simple NLP for chat responses
// const tokenizer = new Natural.WordTokenizer();
// const classifier = new Natural.BayesClassifier();

// // Train basic classifier
// classifier.addDocument('fever headache pain', 'analgesic');
// classifier.addDocument('infection bacterial', 'antibiotic');
// classifier.addDocument('cough wheezing', 'bronchodilator');
// classifier.train();

// // AI Chat endpoint
// router.post('/chat', async (req, res) => {
//   try {
//     const { query, patient } = req.body;
    
//     // Check cache
//     const cacheKey = `${query}-${JSON.stringify(patient)}`;
//     const cached = cache.get(cacheKey);
//     if (cached) {
//       return res.json(cached);
//     }

//     // Tokenize query
//     const tokens = tokenizer.tokenize(query.toLowerCase());
    
//     // Classify intent
//     const category = classifier.classify(query);
    
//     // Generate response
//     let response = {
//       message: '',
//       suggestions: [],
//       dose_recommendation: null
//     };

//     if (query.includes('dose') || query.includes('how much')) {
//       response.message = "I can help with dosing. Please select a medicine and provide patient details.";
//       response.suggestions = ['paracetamol', 'ibuprofen', 'amoxicillin'];
//     } else if (query.includes('safe') || query.includes('contraindication')) {
//       response.message = "Safety is our priority. I'll check contraindications based on patient conditions.";
//     } else if (query.includes('interaction')) {
//       response.message = "I can check drug interactions. Select multiple medicines to analyze.";
//     } else {
//       response.message = "I'm your AI medical assistant. How can I help with dosing today?";
//     }

//     // Cache response
//     cache.set(cacheKey, response);

//     res.json(response);
//   } catch (error) {
//     console.error('AI Chat error:', error);
//     res.status(500).json({ error: 'AI service error' });
//   }
// });

// // Predict dose endpoint
// router.post('/predict-dose', (req, res) => {
//   try {
//     const { patient, symptoms, medicine_hint } = req.body;
    
//     // Simple prediction logic (replace with ML model)
//     let predicted_dose = null;
//     let confidence = 0;

//     if (patient && patient.weight) {
//       // Basic weight-based prediction
//       if (symptoms.includes('fever') || symptoms.includes('pain')) {
//         predicted_dose = patient.weight * 15; // Paracetamol approximation
//         confidence = 0.7;
//       } else if (symptoms.includes('infection')) {
//         predicted_dose = patient.weight * 25; // Amoxicillin approximation
//         confidence = 0.6;
//       }
//     }

//     res.json({
//       predicted_dose,
//       confidence,
//       reasoning: "Based on weight and symptoms",
//       alternative_medicines: ['paracetamol', 'ibuprofen']
//     });
//   } catch (error) {
//     console.error('Prediction error:', error);
//     res.status(500).json({ error: 'Prediction failed' });
//   }
// });

// // Voice processing endpoint
// router.post('/process-voice', (req, res) => {
//   try {
//     const { audio_text } = req.body;
    
//     // Process voice input
//     const tokens = tokenizer.tokenize(audio_text.toLowerCase());
    
//     // Extract medical entities
//     const medicines = tokens.filter(t => 
//       ['paracetamol', 'ibuprofen', 'amoxicillin'].includes(t)
//     );
    
//     const numbers = tokens.filter(t => !isNaN(parseFloat(t)));
    
//     res.json({
//       recognized_text: audio_text,
//       medicines_found: medicines,
//       numbers_found: numbers,
//       action: 'process_dose'
//     });
//   } catch (error) {
//     console.error('Voice processing error:', error);
//     res.status(500).json({ error: 'Voice processing failed' });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Natural = require('natural');
const NodeCache = require('node-cache');

// Initialize cache with new keyword
const cache = new NodeCache({ stdTTL: 600 }); // 10 minute cache

// Simple NLP for chat responses
const tokenizer = new Natural.WordTokenizer();
const classifier = new Natural.BayesClassifier();

// Train basic classifier
classifier.addDocument('fever headache pain', 'analgesic');
classifier.addDocument('infection bacterial', 'antibiotic');
classifier.addDocument('cough wheezing', 'bronchodilator');
classifier.train();

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { query, patient } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('AI Chat request:', { query, patient }); // Debug log
    
    // Check cache
    const cacheKey = `${query}-${JSON.stringify(patient || {})}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Returning cached response');
      return res.json(cached);
    }

    // Tokenize query
    const tokens = tokenizer.tokenize(query.toLowerCase());
    console.log('Tokens:', tokens); // Debug log
    
    // Classify intent
    let category = 'general';
    try {
      category = classifier.classify(query);
    } catch (e) {
      console.log('Classification error:', e);
    }
    
    // Generate response based on query
    let response = {
      message: '',
      category: category
    };

    // Check for specific keywords
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('paracetamol') || lowercaseQuery.includes('acetaminophen')) {
      if (lowercaseQuery.includes('20kg') || lowercaseQuery.includes('20 kg')) {
        response.message = "For a 5-year-old child weighing 20kg, the standard paracetamol dose is 15mg/kg = 300mg per dose, every 6 hours. Maximum 4 doses per day (1200mg/24h).";
        response.dose_recommendation = {
          medicine: 'paracetamol',
          dose_mg: 300,
          frequency: 'Every 6 hours',
          max_daily: 1200
        };
      } else {
        response.message = "Paracetamol (acetaminophen) dosing: 15mg/kg per dose, every 6 hours. Maximum 4 doses per day. Reduce dose in hepatic impairment.";
      }
    } 
    else if (lowercaseQuery.includes('ibuprofen')) {
      if (lowercaseQuery.includes('asthma')) {
        response.message = "⚠️ CAUTION: Ibuprofen and other NSAIDs should be used with caution in patients with asthma as they can trigger bronchospasm. Consider paracetamol as an alternative.";
      } else {
        response.message = "Ibuprofen dosing: 10mg/kg per dose, every 8 hours. Maximum daily dose varies by age. Take with food to reduce GI effects.";
      }
    }
    else if (lowercaseQuery.includes('amoxicillin')) {
      response.message = "Amoxicillin dosing: 25-30mg/kg per dose, every 8-12 hours depending on infection severity. Complete the full course as prescribed.";
    }
    else if (lowercaseQuery.includes('dose') || lowercaseQuery.includes('how much')) {
      response.message = "To calculate a precise dose, I need: 1) Medicine name, 2) Patient weight in kg, 3) Patient age. Please provide these details.";
    } 
    else if (lowercaseQuery.includes('interaction')) {
      response.message = "To check drug interactions, please specify which medicines you'd like me to check. You can also use our Interaction Checker page.";
    }
    else if (lowercaseQuery.includes('safe') || lowercaseQuery.includes('contraindication')) {
      response.message = "Safety considerations depend on the specific medicine and patient factors like age, weight, renal/hepatic function, and allergies. Which medicine are you interested in?";
    }
    else {
      response.message = "I'm your AI medical assistant. I can help with:\n• Dosing calculations (e.g., 'paracetamol dose for 20kg child')\n• Safety checks (e.g., 'ibuprofen safe with asthma?')\n• Drug interactions\n• General medicine information\n\nHow can I assist you today?";
    }

    // Cache response
    cache.set(cacheKey, response);

    res.json(response);
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ 
      message: "I'm having trouble processing your request. Please try again.",
      error: error.message 
    });
  }
});

// Predict dose endpoint
router.post('/predict-dose', (req, res) => {
  try {
    const { patient, symptoms, medicine_hint } = req.body;
    
    if (!patient || !patient.weight) {
      return res.status(400).json({ error: 'Patient weight is required' });
    }

    console.log('Predict dose request:', { patient, symptoms, medicine_hint }); // Debug log
    
    // Simple prediction logic (replace with ML model)
    let predicted_dose = null;
    let confidence = 0;
    let medicine = medicine_hint || 'unknown';
    let reasoning = [];

    // Check symptoms
    const symptomString = (symptoms || '').toLowerCase();
    
    if (symptomString.includes('fever') || symptomString.includes('pain')) {
      medicine = 'paracetamol';
      predicted_dose = patient.weight * 15;
      confidence = 0.7;
      reasoning.push('Based on fever/pain symptoms suggesting analgesic');
    } else if (symptomString.includes('infection') || symptomString.includes('bacterial')) {
      medicine = 'amoxicillin';
      predicted_dose = patient.weight * 25;
      confidence = 0.6;
      reasoning.push('Based on infection symptoms suggesting antibiotic');
    } else if (medicine_hint) {
      // Use hint if provided
      medicine = medicine_hint;
      if (medicine_hint === 'paracetamol') predicted_dose = patient.weight * 15;
      else if (medicine_hint === 'ibuprofen') predicted_dose = patient.weight * 10;
      else if (medicine_hint === 'amoxicillin') predicted_dose = patient.weight * 25;
      confidence = 0.5;
      reasoning.push(`Based on requested medicine: ${medicine_hint}`);
    }

    res.json({
      medicine,
      predicted_dose: predicted_dose ? Math.round(predicted_dose) : null,
      confidence: Math.round(confidence * 100),
      reasoning: reasoning.join('. '),
      alternative_medicines: medicine === 'paracetamol' ? ['ibuprofen'] : ['paracetamol'],
      disclaimer: "This is an AI prediction. Always verify with clinical guidelines and patient factors."
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

// Voice processing endpoint
router.post('/process-voice', (req, res) => {
  try {
    const { audio_text } = req.body;
    
    if (!audio_text) {
      return res.status(400).json({ error: 'Audio text is required' });
    }

    console.log('Voice processing request:', audio_text); // Debug log
    
    // Process voice input
    const tokens = tokenizer.tokenize(audio_text.toLowerCase());
    
    // Extract medical entities
    const medicineKeywords = ['paracetamol', 'acetaminophen', 'ibuprofen', 'amoxicillin', 'aspirin'];
    const medicines = tokens.filter(t => medicineKeywords.includes(t));
    
    const numbers = tokens.filter(t => !isNaN(parseFloat(t)) && isFinite(t));
    
    // Determine action
    let action = 'unknown';
    if (audio_text.includes('dose') || audio_text.includes('how much')) {
      action = 'calculate_dose';
    } else if (audio_text.includes('interaction')) {
      action = 'check_interaction';
    } else if (audio_text.includes('safe')) {
      action = 'safety_check';
    }

    res.json({
      recognized_text: audio_text,
      medicines_found: medicines,
      numbers_found: numbers,
      action: action,
      confidence: medicines.length > 0 ? 0.8 : 0.3
    });
  } catch (error) {
    console.error('Voice processing error:', error);
    res.status(500).json({ error: 'Voice processing failed' });
  }
});

module.exports = router;