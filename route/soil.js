const express = require('express');
const router = express.Router();
const { PythonShell } = require('python-shell');

// GET soil data for logged-in user
router.get('/user-soil', async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const farm = user.farmDetails || {};
    const requiredFields = ['district', 'latitude', 'longitude', 'N', 'P', 'K', 'clay', 'silt', 'sand'];

    // Check for missing fields
    for (const field of requiredFields) {
      if (farm[field] === undefined) {
        return res.status(400).json({ success: false, message: `Missing field: ${field}` });
      }
    }

    let args = requiredFields.map(field => farm[field]);

    let options = {
      mode: 'json',
      pythonPath: 'python', // or your python path
      scriptPath: './soil_model',
      args: args
    };

    PythonShell.run('predict_soil.py', options, (err, results) => {
      if (err) {
        console.error("❌ Soil prediction error:", err);
        return res.status(500).json({ success: false, message: "Prediction failed", error: err.message });
      }
      return res.status(200).json({ success: true, soilMetrics: results[0] });
    });
  } catch (err) {
    console.error("❌ Soil route error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
