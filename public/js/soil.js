async function loadSoilData() {
    try {
        // Call your backend route
        const response = await fetch('/api/soil/user-soil'); // adjust route if needed
        const data = await response.json();

        if (!data.success) throw new Error(data.message);

        const soilMetrics = data.soilMetrics;

        // Update pH
        const ph = parseFloat(soilMetrics.ph);
        document.getElementById('ph-bar').style.width = `${Math.min(ph * 15, 100)}%`; // scale to 0-100
        document.getElementById('ph-value').textContent = ph.toFixed(2);

        // Update Organic Carbon
        const organic = parseFloat(soilMetrics.organic_carbon);
        document.getElementById('organic-bar').style.width = `${Math.min(organic * 5, 100)}%`; // adjust scale
        document.getElementById('organic-value').textContent = organic.toFixed(2);

        // Update Soil Fertility
        const fertility = parseFloat(soilMetrics.soil_fertility);
        document.getElementById('fertility-bar').style.width = `${Math.min(fertility, 100)}%`;
        document.getElementById('fertility-value').textContent = fertility.toFixed(2);

    } catch (err) {
        console.error("❌ Failed to load soil data:", err);
    }
}

// Load soil data on page load
window.addEventListener('DOMContentLoaded', loadSoilData);