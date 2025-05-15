# 🛡️ Cyber Threat Intelligence (CTI) Dashboard

A visually engaging and interactive web dashboard for analyzing threat indicators from the **AlienVault OTX (Open Threat Exchange)** API. Built using **React**, **Vite**, **Recharts**, and **react-datepicker**, this application helps you monitor, visualize, and filter real-time threat intelligence data.

![CTI Dashboard Screenshot](./assets/dashboard-screenshot.png) <!-- You can update this with your actual image path -->

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

> [https://cti-dashboard.vercel.app](https://cti-dashboard.vercel.app) (replace this with your Vercel link)

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
├── public/                 # Static assets
├── src/
│   ├── components/
│   ├── styles/
│   │   ├── main.css
│   │   └── tables.css
│   └── CTIdashboard.jsx    # Main dashboard logic
├── .env                    # API key (excluded from repo)
├── vite.config.js
└── README.md
```

---

## 📄 License

MIT © 2025 [Abhijnya K G](https://github.com/Abhijnya002)

---

## 📬 Contact

For feedback or questions, reach out on [GitHub](https://github.com/Abhijnya002) or email.
