# Cyber Threat Intelligence (CTI) Dashboard

A visually engaging and interactive web dashboard for analyzing threat indicators from the **AlienVault OTX (Open Threat Exchange)** API. Built using **React**, **Vite**, **Recharts**, and **react-datepicker**, this application helps you monitor, visualize, and filter real-time threat intelligence data.



---

## 🚀 Features

- 🔍 **Multi-Filter Controls**: Filter indicators by type, value keyword, and creation date.
- 📊 **Interactive Charts**:
  - Pie chart for indicator type distribution
  - Line chart for activity over time
  - Bar charts for indicator categories and severity levels
- 📋 **Top Pulses**: Visual bars showing most active threat campaigns.
- 🌗 **Dark/Light Mode**: Toggle theme to your preference.
- ⬇️ **Export CSV**: Download the filtered data for offline analysis.

---

## 🛠️ Tech Stack

- **Frontend**: [React.js](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Date Handling**: [react-datepicker](https://www.npmjs.com/package/react-datepicker), [date-fns](https://date-fns.org/)
- **API Source**: [AlienVault OTX API](https://otx.alienvault.com/)
- **Styling**: Custom CSS with CSS variables, dark mode support

---

## 🌐 Demo

> https://abhijnya002.github.io/CTI-Dashboard/

---
## 📡 Data Sources & APIs

This dashboard retrieves real-time threat intelligence data from the following public API:

### 🌐 [AlienVault OTX (Open Threat Exchange) API](https://otx.alienvault.com/)

- **Endpoint Used**: `/api/v1/pulses/subscribed`
- **Purpose**: Fetches subscribed threat intelligence pulses, including indicator types, values, and metadata.
- **Authentication**: Requires an API key passed via the `X-OTX-API-KEY` HTTP header.
- **Format**: JSON response containing a list of `pulses`, each with nested `indicators`.

> To use this API, sign up for a free account at [AlienVault OTX](https://otx.alienvault.com/) and generate an API key under your profile.

---
## 🔐 Environment Setup

To run this project locally, set up your `.env` file:

```env
VITE_OTX_API_KEY=your_otx_api_key_here
```

---

## 🧑‍💻 Installation & Usage

```bash
# Clone the repository
git clone https://github.com/Abhijnya002/CTI-Dashboard.git
cd CTI-Dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Build for Production

```bash
npm run build
```

Deploy the contents of the `dist` folder to your preferred static hosting (like **Vercel**).

---

## 📁 Project Structure

```
CTI-Dashboard/
│
├── public/                      # Static assets (favicon, etc.)
├── src/
│   ├── Components/              # React components
│   │   ├── CTIdashboard.jsx     # Main dashboard component
│   │   └── Header.jsx           # Header with dark mode toggle
│   ├── styles/                  # Custom CSS styles
│   │   ├── main.css
│   │   └── tables.css
│   ├── App.jsx                  # App wrapper
│   ├── App.css
│   ├── index.css
│   └── main.jsx                 # React entry point
│
├── .env                         # Environment variables (not committed)
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── vite.config.js
└── eslint.config.js
```



---

Autor: Abhijnya Konanduru Gurumurthy
