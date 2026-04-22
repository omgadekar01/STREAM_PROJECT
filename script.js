// ============================================
// STREAM - Water Quality Monitoring Website
// JavaScript Logic
// ============================================

// ============ DATA MANAGEMENT ============
let waterQualityData = {
    timestamps: [],
    pH: [7.2, 7.1, 7.3, 7.2, 7.4, 7.2, 7.1],
    turbidity: [2.1, 2.3, 2.0, 2.2, 2.4, 2.1, 2.0],
    temperature: [22, 22.5, 21.8, 23, 22.2, 22.1, 22.3],
    tds: [450, 455, 448, 460, 452, 449, 451]
};

let pollutionReports = [];
let charts = {};
let map = null;
let markers = [];

// Sample monitoring locations
const monitoringLocations = [
    {
        name: 'River Station A',
        lat: 28.6139,
        lng: 77.2090,
        pH: 7.2,
        turbidity: 2.1,
        temperature: 22,
        tds: 450,
        status: 'Safe'
    },
    {
        name: 'Lake Station B',
        lat: 28.5244,
        lng: 77.1855,
        pH: 7.8,
        turbidity: 4.5,
        temperature: 24,
        tds: 520,
        status: 'Moderate'
    },
    {
        name: 'Pond Station C',
        lat: 28.6292,
        lng: 77.2206,
        pH: 8.2,
        turbidity: 6.5,
        temperature: 25,
        tds: 580,
        status: 'Polluted'
    },
    {
        name: 'Stream Station D',
        lat: 28.5456,
        lng: 77.1964,
        pH: 6.9,
        turbidity: 1.8,
        temperature: 21,
        tds: 420,
        status: 'Safe'
    }
];

// Initialize timestamps for the past 7 days
function initializeTimestamps() {
    waterQualityData.timestamps = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        waterQualityData.timestamps.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
}

// ============ POLLUTION DETECTION ============
function detectPollution() {
    const latest = {
        pH: waterQualityData.pH[waterQualityData.pH.length - 1],
        turbidity: waterQualityData.turbidity[waterQualityData.turbidity.length - 1],
        temperature: waterQualityData.temperature[waterQualityData.temperature.length - 1],
        tds: waterQualityData.tds[waterQualityData.tds.length - 1]
    };

    let status = 'Safe';
    let pollutionScore = 0;

    // pH check (optimal: 6.5 - 8.5)
    if (latest.pH < 6.5 || latest.pH > 8.5) {
        pollutionScore += 2;
        updateParameterStatus('pH', 'danger');
    } else if (latest.pH < 6.8 || latest.pH > 8.2) {
        pollutionScore += 1;
        updateParameterStatus('pH', 'warning');
    } else {
        updateParameterStatus('pH', 'success');
    }

    // Turbidity check (optimal: 0 - 5 NTU)
    if (latest.turbidity > 10) {
        pollutionScore += 3;
        updateParameterStatus('turbidity', 'danger');
    } else if (latest.turbidity > 5) {
        pollutionScore += 2;
        updateParameterStatus('turbidity', 'warning');
    } else {
        updateParameterStatus('turbidity', 'success');
    }

    // Temperature check (optimal: 20 - 30°C)
    if (latest.temperature < 15 || latest.temperature > 35) {
        pollutionScore += 2;
        updateParameterStatus('temperature', 'danger');
    } else if (latest.temperature < 18 || latest.temperature > 32) {
        pollutionScore += 1;
        updateParameterStatus('temperature', 'warning');
    } else {
        updateParameterStatus('temperature', 'success');
    }

    // TDS check (optimal: 300 - 600 ppm)
    if (latest.tds < 200 || latest.tds > 800) {
        pollutionScore += 3;
        updateParameterStatus('tds', 'danger');
    } else if (latest.tds < 250 || latest.tds > 700) {
        pollutionScore += 2;
        updateParameterStatus('tds', 'warning');
    } else {
        updateParameterStatus('tds', 'success');
    }

    // Determine overall status
    if (pollutionScore >= 5) {
        status = 'Polluted';
    } else if (pollutionScore >= 2) {
        status = 'Moderate';
    }

    updateStatus(status);
    updateRemediationSuggestions(latest, status);
    return { status, latest };
}

function updateParameterStatus(param, level) {
    const statusElement = document.getElementById(param + 'Status');
    if (!statusElement) return;

    statusElement.classList.remove('warning', 'danger');
    if (level === 'warning') {
        statusElement.classList.add('warning');
        statusElement.textContent = '⚠ Warning';
    } else if (level === 'danger') {
        statusElement.classList.add('danger');
        statusElement.textContent = '✗ Dangerous';
    } else {
        statusElement.textContent = '✓ Healthy';
    }
}

function updateStatus(status) {
    const badge = document.getElementById('statusBadge');
    if (!badge) return;

    badge.classList.remove('safe', 'moderate', 'polluted');

    if (status === 'Safe') {
        badge.classList.add('safe');
        badge.innerHTML = '<i class="fas fa-check-circle"></i> Safe';
    } else if (status === 'Moderate') {
        badge.classList.add('moderate');
        badge.innerHTML = '<i class="fas fa-exclamation-circle"></i> Moderate';
    } else {
        badge.classList.add('polluted');
        badge.innerHTML = '<i class="fas fa-times-circle"></i> Polluted';
    }
}

// ============ REMEDIATION SUGGESTIONS ============
function updateRemediationSuggestions(latest, status) {
    const suggestions = [];

    // pH suggestions
    if (latest.pH < 6.5) {
        suggestions.push({
            title: 'pH Too Low',
            description: 'pH is below 6.5. Add alkaline substances like limestone to increase pH.',
            icon: 'fa-flask-vial'
        });
    } else if (latest.pH > 8.5) {
        suggestions.push({
            title: 'pH Too High',
            description: 'pH is above 8.5. Use acidic treatments like sulfuric acid to lower pH.',
            icon: 'fa-flask-vial'
        });
    }

    // Turbidity suggestions
    if (latest.turbidity > 5) {
        suggestions.push({
            title: 'High Turbidity',
            description: 'Turbidity exceeds 5 NTU. Install or improve filtration systems and sedimentation tanks.',
            icon: 'fa-eye-slash'
        });
    }

    // Temperature suggestions
    if (latest.temperature > 30) {
        suggestions.push({
            title: 'High Temperature',
            description: 'Temperature above 30°C. Increase aeration and provide shade to cool water.',
            icon: 'fa-thermometer-half'
        });
    } else if (latest.temperature < 15) {
        suggestions.push({
            title: 'Low Temperature',
            description: 'Temperature below 15°C. Check for spring water inputs or improve circulation.',
            icon: 'fa-thermometer-half'
        });
    }

    // TDS suggestions
    if (latest.tds > 600) {
        suggestions.push({
            title: 'High TDS',
            description: 'TDS above 600 ppm indicates high mineral content. Use reverse osmosis or dilution.',
            icon: 'fa-droplet'
        });
    } else if (latest.tds < 300) {
        suggestions.push({
            title: 'Low TDS',
            description: 'TDS below 300 ppm. Water lacks essential minerals. Add mineral supplements.',
            icon: 'fa-droplet'
        });
    }

    // If no specific issues, show maintenance suggestions
    if (suggestions.length === 0) {
        suggestions.push({
            title: 'Water Quality Optimal',
            description: 'All parameters are within safe ranges. Continue regular monitoring and maintenance.',
            icon: 'fa-leaf'
        });
    }

    renderRemediationCards(suggestions);
}

function renderRemediationCards(suggestions) {
    const container = document.getElementById('remediationCards');
    if (!container) return;

    container.innerHTML = suggestions.map(suggestion => `
        <div class="remediation-card">
            <div class="remediation-icon">
                <i class="fas ${suggestion.icon}"></i>
            </div>
            <h3>${suggestion.title}</h3>
            <p>${suggestion.description}</p>
        </div>
    `).join('');
}

// ============ CHART INITIALIZATION ============
function initializeCharts() {
    const chartConfig = {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };

    // pH Chart
    const phCtx = document.getElementById('phChart');
    if (phCtx) {
        charts.ph = new Chart(phCtx, {
            ...chartConfig,
            data: {
                labels: waterQualityData.timestamps,
                datasets: [{
                    label: 'pH Level',
                    data: waterQualityData.pH,
                    borderColor: '#0099ff',
                    backgroundColor: 'rgba(0, 153, 255, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#0099ff',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            }
        });
    }

    // Turbidity Chart
    const turbidityCtx = document.getElementById('turbidityChart');
    if (turbidityCtx) {
        charts.turbidity = new Chart(turbidityCtx, {
            ...chartConfig,
            data: {
                labels: waterQualityData.timestamps,
                datasets: [{
                    label: 'Turbidity (NTU)',
                    data: waterQualityData.turbidity,
                    borderColor: '#ff9900',
                    backgroundColor: 'rgba(255, 153, 0, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ff9900',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            }
        });
    }

    // Temperature Chart
    const temperatureCtx = document.getElementById('temperatureChart');
    if (temperatureCtx) {
        charts.temperature = new Chart(temperatureCtx, {
            ...chartConfig,
            data: {
                labels: waterQualityData.timestamps,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: waterQualityData.temperature,
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ff6b6b',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            }
        });
    }

    // TDS Chart
    const tdsCtx = document.getElementById('tdsChart');
    if (tdsCtx) {
        charts.tds = new Chart(tdsCtx, {
            ...chartConfig,
            data: {
                labels: waterQualityData.timestamps,
                datasets: [{
                    label: 'TDS (ppm)',
                    data: waterQualityData.tds,
                    borderColor: '#44dd44',
                    backgroundColor: 'rgba(68, 221, 68, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#44dd44',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            }
        });
    }
}

function updateCharts() {
    if (charts.ph) charts.ph.data.datasets[0].data = waterQualityData.pH;
    if (charts.turbidity) charts.turbidity.data.datasets[0].data = waterQualityData.turbidity;
    if (charts.temperature) charts.temperature.data.datasets[0].data = waterQualityData.temperature;
    if (charts.tds) charts.tds.data.datasets[0].data = waterQualityData.tds;

    Object.values(charts).forEach(chart => chart.update());
}

// ============ pH CALCULATOR ============
function calculatePHFromConcentration() {
    const hydrogenConc = parseFloat(document.getElementById('hydrogenConc').value);
    const resultBox = document.getElementById('phResult');
    
    if (!hydrogenConc || hydrogenConc <= 0) {
        resultBox.innerHTML = '<div class="result-label empty">Enter a valid H+ concentration</div>';
        return;
    }
    
    const ph = -Math.log10(hydrogenConc);
    let status = '';
    
    if (ph < 6.5) {
        status = '<span class="result-status danger">Acidic - Treatment Needed</span>';
    } else if (ph > 8.5) {
        status = '<span class="result-status danger">Alkaline - Treatment Needed</span>';
    } else {
        status = '<span class="result-status">Neutral - Safe Range</span>';
    }
    
    resultBox.innerHTML = `
        <div>
            <div class="result-value">${ph.toFixed(2)}</div>
            <div class="result-label">pH Value</div>
            ${status}
        </div>
    `;
}

function calculateConcentrationFromPH() {
    const phValue = parseFloat(document.getElementById('phValue').value);
    const resultBox = document.getElementById('concentrationResult');
    
    if (isNaN(phValue) || phValue < 0 || phValue > 14) {
        resultBox.innerHTML = '<div class="result-label empty">Enter a valid pH value (0-14)</div>';
        return;
    }
    
    const hydrogenConc = Math.pow(10, -phValue);
    let status = '';
    
    if (phValue < 6.5) {
        status = '<span class="result-status danger">Acidic</span>';
    } else if (phValue > 8.5) {
        status = '<span class="result-status danger">Alkaline</span>';
    } else {
        status = '<span class="result-status">Neutral</span>';
    }
    
    resultBox.innerHTML = `
        <div>
            <div class="result-value">${hydrogenConc.toExponential(2)}</div>
            <div class="result-label">H+ Concentration (mol/L)</div>
            ${status}
        </div>
    `;
}

function analyzePH() {
    const phValue = parseFloat(document.getElementById('phAnalysis').value);
    const resultBox = document.getElementById('phAnalysisResult');
    
    if (isNaN(phValue) || phValue < 0 || phValue > 14) {
        resultBox.innerHTML = '<div class="result-label empty">Enter a valid pH value (0-14)</div>';
        return;
    }
    
    let analysis = '';
    let acidity = '';
    let recommendation = '';
    
    if (phValue < 3) {
        acidity = 'Highly Acidic';
        recommendation = 'Add alkaline substances like limestone or soda ash';
    } else if (phValue < 6.5) {
        acidity = 'Acidic';
        recommendation = 'Add limestone (CaCO₃) to increase pH to 6.5-8.5';
    } else if (phValue <= 8.5) {
        acidity = 'Neutral (Optimal)';
        recommendation = 'Water quality is good, maintain current levels';
    } else if (phValue < 11) {
        acidity = 'Alkaline';
        recommendation = 'Add acid solutions or increase CO₂ to lower pH';
    } else {
        acidity = 'Highly Alkaline';
        recommendation = 'Neutralize with sulfuric acid or other acids';
    }
    
    resultBox.innerHTML = `
        <div style="text-align: left;">
            <p><strong>pH Status:</strong> ${acidity}</p>
            <p><strong>H+ Concentration:</strong> ${Math.pow(10, -phValue).toExponential(2)} mol/L</p>
            <p><strong>Recommendation:</strong> ${recommendation}</p>
        </div>
    `;
}

// ============ ENERGY CALCULATOR ============
function calculateFiltrationEnergy() {
    const turbidity = parseFloat(document.getElementById('turbidityEnergy').value);
    const volume = parseFloat(document.getElementById('waterVolume').value);
    const resultBox = document.getElementById('filtrationResult');
    
    if (!turbidity || turbidity < 0 || !volume || volume <= 0) {
        resultBox.innerHTML = '<div class="result-label empty">Enter valid turbidity and volume values</div>';
        return;
    }
    
    // Energy formula: Base energy + (turbidity factor * volume)
    // Base energy: 0.5 kWh, Turbidity factor: 0.01 kWh per NTU per 100L
    const baseEnergy = 0.5;
    const turbidityFactor = (turbidity / 100) * (volume / 100) * 0.01;
    const totalEnergy = baseEnergy + turbidityFactor;
    
    let status = '';
    if (turbidity <= 2) {
        status = '<span class="result-status">Low Energy Required</span>';
    } else if (turbidity <= 5) {
        status = '<span class="result-status">Moderate Energy</span>';
    } else {
        status = '<span class="result-status warning">High Energy Required</span>';
    }
    
    resultBox.innerHTML = `
        <div>
            <div class="result-value">${totalEnergy.toFixed(2)}</div>
            <div class="result-label">Energy Required (kWh)</div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem; color: #666;">
                For ${volume}L at ${turbidity} NTU
            </div>
            ${status}
        </div>
    `;
}

function calculateTemperatureEnergy() {
    const currentTemp = parseFloat(document.getElementById('currentTemp').value);
    const targetTemp = parseFloat(document.getElementById('targetTemp').value);
    const volume = parseFloat(document.getElementById('tempVolume').value);
    const resultBox = document.getElementById('temperatureEnergyResult');
    
    if (isNaN(currentTemp) || isNaN(targetTemp) || !volume || volume <= 0) {
        resultBox.innerHTML = '<div class="result-label empty">Enter valid temperature and volume values</div>';
        return;
    }
    
    const tempDiff = Math.abs(targetTemp - currentTemp);
    // Energy formula: 4.18 J/(g·°C) * mass * temp difference
    // Assuming density of water = 1 kg/L = 1000 g/L
    // 1 kWh = 3,600,000 J
    const mass = volume * 1000; // grams
    const energyJoules = 4.18 * mass * tempDiff;
    const energyKWh = energyJoules / 3600000;
    
    let status = '';
    if (tempDiff <= 1) {
        status = '<span class="result-status">Minimal Energy</span>';
    } else if (tempDiff <= 5) {
        status = '<span class="result-status">Moderate Energy</span>';
    } else {
        status = '<span class="result-status warning">High Energy Required</span>';
    }
    
    resultBox.innerHTML = `
        <div>
            <div class="result-value">${energyKWh.toFixed(3)}</div>
            <div class="result-label">Energy Required (kWh)</div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem; color: #666;">
                ${currentTemp}°C → ${targetTemp}°C for ${volume}L
            </div>
            ${status}
        </div>
    `;
}

function calculateTotalEnergy() {
    const tds = parseFloat(document.getElementById('tdsEnergy').value);
    const volume = parseFloat(document.getElementById('totalVolume').value);
    const resultBox = document.getElementById('totalEnergyResult');
    
    if (!tds || tds < 0 || !volume || volume <= 0) {
        resultBox.innerHTML = '<div class="result-label empty">Enter valid TDS and volume values</div>';
        return;
    }
    
    // Energy for TDS reduction: Base + (TDS factor)
    // Lower TDS = less energy for dilution
    // Higher TDS = more energy for desalination/treatment
    const optimalTDS = 450;
    const tdsDifference = Math.abs(tds - optimalTDS);
    const tdsEnergy = 0.3 + (tdsDifference / 1000) * (volume / 100) * 0.05;
    
    let status = '';
    if (tds >= 300 && tds <= 600) {
        status = '<span class="result-status">Optimal Range</span>';
    } else if ((tds > 200 && tds < 300) || (tds > 600 && tds < 800)) {
        status = '<span class="result-status warning">Adjustment Needed</span>';
    } else {
        status = '<span class="result-status danger">Heavy Treatment Required</span>';
    }
    
    resultBox.innerHTML = `
        <div>
            <div class="result-value">${tdsEnergy.toFixed(2)}</div>
            <div class="result-label">Treatment Energy (kWh)</div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem; color: #666;">
                For ${volume}L at ${tds} ppm TDS
            </div>
            ${status}
        </div>
    `;
}

// ============ DATA UPDATE ============
function updateData() {
    // Simulate new data points
    const newPH = 7.2 + (Math.random() - 0.5) * 0.5;
    const newTurbidity = 2.1 + (Math.random() - 0.5) * 1.5;
    const newTemp = 22 + (Math.random() - 0.5) * 2;
    const newTDS = 450 + (Math.random() - 0.5) * 50;

    waterQualityData.pH.push(newPH);
    waterQualityData.turbidity.push(newTurbidity);
    waterQualityData.temperature.push(newTemp);
    waterQualityData.tds.push(newTDS);

    // Keep only last 7 data points
    if (waterQualityData.pH.length > 7) {
        waterQualityData.pH.shift();
        waterQualityData.turbidity.shift();
        waterQualityData.temperature.shift();
        waterQualityData.tds.shift();
    }

    // Update display values
    document.getElementById('phValue').textContent = newPH.toFixed(1);
    document.getElementById('turbidityValue').textContent = newTurbidity.toFixed(1);
    document.getElementById('temperatureValue').textContent = Math.round(newTemp);
    document.getElementById('tdsValue').textContent = Math.round(newTDS);

    // Update charts and detection
    updateCharts();
    detectPollution();

    showNotification(`Temperature updated: ${Math.round(newTemp)}°C`);
}

// ============ MAP INITIALIZATION ============
function initializeMap() {
    // Initialize map centered on India
    map = L.map('mapContainer').setView([28.6139, 77.2090], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map);

    // Add markers for monitoring locations
    monitoringLocations.forEach((location, index) => {
        const color = location.status === 'Safe' ? '#44dd44' : 
                     location.status === 'Moderate' ? '#ffaa00' : '#ff4444';

        const marker = L.circleMarker([location.lat, location.lng], {
            radius: 10,
            fillColor: color,
            color: color,
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.7
        }).addTo(map);

        marker.bindPopup(`
            <div style="width: 200px;">
                <h4 style="margin: 0 0 10px 0;">${location.name}</h4>
                <p><strong>Status:</strong> <span style="color: ${color};">${location.status}</span></p>
                <p><strong>pH:</strong> ${location.pH}</p>
                <p><strong>Turbidity:</strong> ${location.turbidity} NTU</p>
                <p><strong>Temp:</strong> ${location.temperature}°C</p>
                <p><strong>TDS:</strong> ${location.tds} ppm</p>
            </div>
        `);

        marker.on('click', function() {
            displayLocationInfo(location);
        });

        markers.push(marker);
    });
}

function displayLocationInfo(location) {
    const infoDiv = document.getElementById('locationInfo');
    if (!infoDiv) return;

    const statusColor = location.status === 'Safe' ? '#44dd44' : 
                       location.status === 'Moderate' ? '#ffaa00' : '#ff4444';

    infoDiv.innerHTML = `
        <h3>${location.name}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
            <div>
                <p><strong>Water Quality Status:</strong><br>
                   <span style="color: ${statusColor}; font-size: 1.2rem; font-weight: bold;">${location.status}</span>
                </p>
            </div>
            <div>
                <p><strong>Coordinates:</strong><br>Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}</p>
            </div>
            <div>
                <p><strong>pH Level:</strong> ${location.pH}<br>
                   <em style="color: #666;">(Optimal: 6.5-8.5)</em></p>
            </div>
            <div>
                <p><strong>Turbidity:</strong> ${location.turbidity} NTU<br>
                   <em style="color: #666;">(Optimal: 0-5)</em></p>
            </div>
            <div>
                <p><strong>Temperature:</strong> ${location.temperature}°C<br>
                   <em style="color: #666;">(Optimal: 20-30)</em></p>
            </div>
            <div>
                <p><strong>TDS:</strong> ${location.tds} ppm<br>
                   <em style="color: #666;">(Optimal: 300-600)</em></p>
            </div>
        </div>
    `;
}

// ============ FORM HANDLING ============
function submitReport(event) {
    event.preventDefault();

    const report = {
        id: Date.now(),
        name: document.getElementById('reporterName').value,
        email: document.getElementById('reporterEmail').value,
        location: document.getElementById('location').value,
        type: document.getElementById('pollutionType').value,
        severity: document.getElementById('severity').value,
        description: document.getElementById('description').value,
        timestamp: new Date().toLocaleString()
    };

    pollutionReports.push(report);
    displayReports();

    // Reset form
    document.getElementById('pollutionForm').reset();
    showNotification('Thank you! Your pollution report has been submitted.');
}

function displayReports() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;

    if (pollutionReports.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No reports yet.</p>';
        return;
    }

    container.innerHTML = pollutionReports
        .sort((a, b) => b.id - a.id)
        .map(report => `
            <div class="report-item ${report.severity}">
                <div class="report-header">
                    <span class="report-type">${report.type}</span>
                    <span class="report-severity ${report.severity}">${report.severity.toUpperCase()}</span>
                </div>
                <p class="report-location"><strong>Location:</strong> ${report.location}</p>
                <p><strong>Reported by:</strong> ${report.name} (${report.email})</p>
                <p><strong>Description:</strong> ${report.description}</p>
                <p class="report-time">${report.timestamp}</p>
            </div>
        `).join('');
}

// ============ NOTIFICATIONS ============
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #0099ff, #00d4ff);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0, 153, 255, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============ NAVIGATION ============
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ============ REPORT GENERATION ============
function generateReport() {
    const latest = waterQualityData;
    const lastIndex = latest.pH.length - 1;

    const reportContent = `
WATER QUALITY MONITORING REPORT
================================
Generated: ${new Date().toLocaleString()}

CURRENT PARAMETERS:
- pH Level: ${latest.pH[lastIndex].toFixed(2)} (Optimal: 6.5-8.5)
- Turbidity: ${latest.turbidity[lastIndex].toFixed(2)} NTU (Optimal: 0-5)
- Temperature: ${latest.temperature[lastIndex].toFixed(2)}°C (Optimal: 20-30)
- TDS: ${latest.tds[lastIndex].toFixed(2)} ppm (Optimal: 300-600)

POLLUTION INCIDENTS REPORTED: ${pollutionReports.length}

7-DAY AVERAGE:
- pH: ${(latest.pH.reduce((a, b) => a + b) / latest.pH.length).toFixed(2)}
- Turbidity: ${(latest.turbidity.reduce((a, b) => a + b) / latest.turbidity.length).toFixed(2)} NTU
- Temperature: ${(latest.temperature.reduce((a, b) => a + b) / latest.temperature.length).toFixed(2)}°C
- TDS: ${(latest.tds.reduce((a, b) => a + b) / latest.tds.length).toFixed(2)} ppm

STATUS: ${document.getElementById('statusBadge').textContent}

================================
For detailed information, visit STREAM Dashboard
    `;

    // Create and download text file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
    element.setAttribute('download', `water-quality-report-${new Date().getTime()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showNotification('Report generated and downloaded!');
}

// ============ INITIALIZATION ============
function initialize() {
    initializeTimestamps();
    initializeCharts();
    detectPollution();
    initializeMap();
    displayReports();
    setupNavigation();

    // Update data every 30 seconds for demo
    setInterval(() => {
        updateData();
    }, 30000);
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
