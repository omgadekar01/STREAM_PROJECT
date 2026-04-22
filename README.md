# STREAM - Systematic Tracking and Remediation of Environmental Aquatic Media

A modern, responsive web application for monitoring water quality in real-time, detecting pollution, and providing remediation suggestions.

## 🌊 Features

### Dashboard
- **Real-time Water Quality Parameters**
  - pH Level (optimal: 6.5-8.5)
  - Turbidity (optimal: 0-5 NTU)
  - Temperature (optimal: 20-30°C)
  - Total Dissolved Solids/TDS (optimal: 300-600 ppm)

- **Live Charts** using Chart.js
  - 7-day trend visualization for each parameter
  - Interactive data points with hover details
  - Responsive charts that update in real-time

- **Water Quality Status Indicator**
  - Safe (green) - All parameters within acceptable range
  - Moderate (orange) - Some parameters approaching limits
  - Polluted (red) - One or more parameters exceed safe limits

### Pollution Detection
- Automatic detection based on parameter thresholds
- Severity scoring system
- Real-time status updates
- Customizable parameter ranges

### Remediation Suggestions
- Context-aware recommendations based on water quality data
- Specific action items for each parameter issue
- Treatment and management suggestions
- Best practices for water quality maintenance

### Interactive Map
- 4 sample monitoring locations with real data
- Color-coded markers (Green=Safe, Orange=Moderate, Red=Polluted)
- Click markers to view detailed location information
- Built with Leaflet.js and OpenStreetMap

### Report Pollution Form
- Easy-to-use pollution incident reporting
- Fields for:
  - Reporter name and email
  - Location (coordinates or description)
  - Pollution type (chemical, plastic, algae, oil, industrial, other)
  - Severity level (low, medium, high, critical)
  - Detailed description
  - Optional image upload
- Report history with recent submissions

### Report Generation
- Export water quality data as PDF/TXT
- 7-day averages and current readings
- Pollution incident summary
- Downloadable for archival and sharing

### Navigation & UI
- Sticky navigation bar with smooth scrolling
- Responsive hamburger menu for mobile
- Beautiful gradient design with modern aesthetics
- Cards and glass-morphism effects
- Smooth animations and transitions
- Full responsive design (desktop, tablet, mobile)

## 📁 Project Structure

```
stream/
├── index.html      # Main HTML file with all sections
├── style.css       # Modern responsive CSS styling
├── script.js       # JavaScript logic and interactivity
└── README.md       # This file
```

## 🚀 Getting Started

### Requirements
- No installation or server needed
- Works in any modern web browser
- Internet connection for map tiles and libraries

### Setup
1. Extract the files to a folder
2. Open `index.html` in your web browser
3. The website will load with demo data

### Usage

**Dashboard:**
- View real-time water quality parameters
- Watch live charts update
- Click "Update Data" to simulate new measurements
- Click "Generate Report" to download current data

**Map:**
- Navigate to the Map section
- Click on any marker to see location details
- Zoom and pan to explore different areas

**Remediation:**
- Check automatic remediation suggestions
- Suggestions update based on current parameter values
- Follow recommendations for water treatment

**Report Pollution:**
- Fill out the form with pollution incident details
- Submit to add to the recent reports list
- View all submitted reports below the form

## 🔧 Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with gradients, animations, and flexbox/grid
- **JavaScript (Vanilla)** - No frameworks, pure JavaScript
- **Chart.js** - Beautiful data visualization
- **Leaflet.js** - Interactive mapping
- **Font Awesome** - Icon library
- **OpenStreetMap** - Map tiles

## 📊 Water Quality Parameters

| Parameter | Optimal Range | Unit | Status Indicator |
|-----------|---------------|------|-----------------|
| pH | 6.5 - 8.5 | - | Color-coded |
| Turbidity | 0 - 5 | NTU | Color-coded |
| Temperature | 20 - 30 | °C | Color-coded |
| TDS | 300 - 600 | ppm | Color-coded |

## 🎨 Color Scheme

- **Primary:** #0099ff (Water Blue)
- **Secondary:** #00d4ff (Cyan)
- **Success:** #44dd44 (Safe Green)
- **Warning:** #ffaa00 (Caution Orange)
- **Danger:** #ff4444 (Polluted Red)

## 📱 Responsive Breakpoints

- **Desktop:** 1200px and above
- **Tablet:** 768px - 1199px
- **Mobile:** Below 768px

## ✨ Key Features Highlighted

### Smart Pollution Detection
The system automatically analyzes all parameters and assigns a pollution score:
- Low scores = Safe water
- Medium scores = Moderate pollution
- High scores = Severe pollution

### Real-time Data Updates
Every 30 seconds, new data is simulated (can be connected to real sensors):
- Charts update automatically
- Status refreshes
- Remediation suggestions adjust dynamically

### Mobile-First Design
- Touch-friendly interface
- Hamburger menu for navigation
- Optimized images and layouts
- Fast loading times

## 🔐 Data Storage

Currently uses browser localStorage for:
- Pollution reports
- User preferences
- Session data

*Can be extended to use a backend database*

## 🌍 Future Enhancements

- Real sensor integration
- Multiple language support
- User accounts and saved locations
- Advanced analytics and predictions
- Email notifications for alerts
- API integration with government agencies
- AI-powered remediation suggestions
- Video documentation of pollution sites

## 💡 Tips

1. **Demo Mode:** The site comes with sample data. Click "Update Data" to see charts change.

2. **Add Real Data:** Modify the `waterQualityData` object in `script.js` to connect real sensor data.

3. **Customize Parameters:** Edit the threshold values in `detectPollution()` function to match your region's standards.

4. **Add Locations:** Add more monitoring locations to the `monitoringLocations` array.

5. **Integrate Backend:** Replace demo data functions with API calls to your backend server.

## 📞 Support

For questions or improvements, refer to the code comments in:
- `script.js` - Logic and algorithms
- `style.css` - Styling guidelines
- `index.html` - HTML structure

## 📄 License

This project is free to use and modify for educational and commercial purposes.

---

**STREAM** - Protecting Earth's Water Resources 💧
