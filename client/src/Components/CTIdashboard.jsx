import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, subDays } from 'date-fns';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie,
  Cell, LineChart, Line, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';
import Papa from 'papaparse';
import Header from './Header';
import '../styles/main.css';
import '../styles/tables.css';

// Updated color palette - indigo, amber, red, emerald, violet, pink
const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];

const CTIDashboard = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [valueFilter, setValueFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [darkMode, setDarkMode] = useState(false);
  const [activePieIndex, setActivePieIndex] = useState(null);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    document.body.style.backgroundColor = darkMode ? '#0f172a' : '#f8fafc';
  }, [darkMode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://otx.alienvault.com/api/v1/pulses/subscribed', {
        headers: { 'X-OTX-API-KEY': import.meta.env.VITE_OTX_API_KEY }
      });
      
      setLoading(false); // ✅ Immediately allow UI to transition out of loading
  
      const all = res.data.results.flatMap(pulse => 
        pulse.indicators.map(ind => ({
          id: ind.id,
          indicator_type: ind.type,
          indicator_value: ind.indicator,
          indicator_description: ind.description || 'No description',
          pulse_name: pulse.name,
          pulse_id: pulse.id,
          created_at: ind.created
        }))
      );
  
      setData(all);
      setTypes([...new Set(all.map(i => i.indicator_type))].map(t => ({ value: t, label: t })));
    } catch (e) {
      console.error('Failed to fetch OTX data:', e);
      setLoading(false);
    }
  };
  
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const f = data.filter(item => {
      const byType = selectedTypes.length === 0 || selectedTypes.some(t => t.value === item.indicator_type);
      const byValue = item.indicator_value.toLowerCase().includes(valueFilter.toLowerCase());
      const byDate = !dateFilter || format(new Date(item.created_at), 'yyyy-MM-dd') === format(dateFilter, 'yyyy-MM-dd');
      return byType && byValue && byDate;
    });
    setFiltered(f);
  }, [data, selectedTypes, valueFilter, dateFilter]);

  const { typeChart, timeChart, topPulses, severityData } = useMemo(() => {
    const typeData = Object.entries(filtered.reduce((acc, curr) => {
      acc[curr.indicator_type] = (acc[curr.indicator_type] || 0) + 1;
      return acc;
    }, {})).map(([type, count]) => ({ type, count }));
    
    const total = typeData.reduce((sum, item) => sum + item.count, 0);
    const typeChartWithPercentage = typeData.map(item => ({
      ...item,
      percentage: ((item.count / total) * 100).toFixed(1)
    }));

    const timeChart = Object.entries(filtered.reduce((acc, curr) => {
      const d = format(new Date(curr.created_at), 'yyyy-MM-dd');
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {})).map(([date, count]) => ({ date, count })).slice(-30);

    const topPulses = Object.entries(filtered.reduce((acc, curr) => {
      if (curr.pulse_name) acc[curr.pulse_name] = (acc[curr.pulse_name] || 0) + 1;
      return acc;
    }, {}))
      .map(([pulse, count]) => ({ pulse, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const severityData = filtered.reduce((acc, curr) => {
      const severity = curr.indicator_description.includes('malicious') ? 'High' : 
                     curr.indicator_description.includes('suspicious') ? 'Medium' : 'Low';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {});

    return {
      typeChart: typeChartWithPercentage,
      timeChart,
      topPulses,
      severityData: Object.entries(severityData).map(([severity, count]) => ({ severity, count }))
    };
  }, [filtered]);

  const downloadCSV = () => {
    const csv = Papa.unparse(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'cti_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading Threat Intelligence Data...</div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Only one Header component */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="controls-container">
        <div className="filter-group">
          <div className="filter-item">
            <Select
              isMulti
              options={types}
              onChange={setSelectedTypes}
              placeholder="Filter by Type"
              classNamePrefix="select"
              className="filter-select"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  borderColor: darkMode ? '#334155' : '#e2e8f0',
                  color: darkMode ? '#f1f5f9' : '#1e293b',
                  minHeight: '44px'
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff'
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused 
                    ? darkMode ? '#334155' : '#e2e8f0' 
                    : 'transparent',
                  color: darkMode ? '#f1f5f9' : '#1e293b'
                })
              }}
            />
          </div>
          
          <div className="filter-item">
          <div className="filter-select">
  <input
    type="text"
    placeholder="Search Indicator Value"
    value={valueFilter}
    onChange={(e) => setValueFilter(e.target.value)}
    style={{
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      border: `1px solid ${darkMode ? '#334155' : '#ccc'}`,
      color: darkMode ? '#f1f5f9' : '#1e293b',
      height: '44px',
      padding: '0 12px',
      borderRadius: '8px',
      width: '100%',
      fontSize: '0.9rem',
      fontFamily: 'var(--font-primary)',
      boxShadow: 'none',
      outline: 'none'
    }}
  />
</div>
</div>

          
          <div className="filter-item">
          <div className="filter-select">
            <DatePicker
              selected={dateFilter}
              onChange={(d) => setDateFilter(d)}
              placeholderText="Filter by Date"
              className="filter-datepicker"
              maxDate={new Date()}
              minDate={subDays(new Date(), 365)}
            />
          </div>
          </div>
          
          <button className="export-button" onClick={downloadCSV}>
            <span className="button-icon">⬇️</span> Export CSV
          </button>
        </div>
      </div>

      <div className="grid-container">
        <div className="card chart-card">
          <h3 className="card-title">Indicator Types</h3>
          <p className="card-subtitle">Distribution of threat indicators</p>
          <div className="chart-container">
            <ResponsiveContainer width="60%" height={300}>
              <PieChart>
                <Pie
                  data={typeChart}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={60}
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                  onMouseLeave={() => setActivePieIndex(null)}
                  activeIndex={activePieIndex}
                  activeShape={{
                    outerRadius: 90,
                    innerRadius: 50
                  }}
                >
                  {typeChart.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke={darkMode ? '#1e293b' : '#ffffff'}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} (${props.payload.percentage}%)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="summary-table-container">
              <div className="summary-table-wrapper">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Count</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeChart.map((item, index) => (
                      <tr 
                        key={index}
                        className={index === activePieIndex ? 'active-row' : ''}
                        onMouseEnter={() => setActivePieIndex(index)}
                        onMouseLeave={() => setActivePieIndex(null)}
                      >
                        <td>
                          <span 
                            className="color-indicator" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          {item.type}
                        </td>
                        <td>{item.count}</td>
                        <td>{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="card chart-card">
          <h3 className="card-title">Threat Activity</h3>
          <p className="card-subtitle">Last 30 days timeline</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeChart}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="date" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#ec4899"  // Pink color
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-container">
        <div className="card chart-card">
          <h3 className="card-title">Indicator Types (Bar)</h3>
          <p className="card-subtitle">Count by category</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeChart}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="type" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip />
              <Bar dataKey="count">
                {typeChart.map((entry, index) => (
                  <Cell 
                    key={`bar-cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke={darkMode ? '#1e293b' : '#ffffff'}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h3 className="card-title">Threat Severity</h3>
          <p className="card-subtitle">Classification by severity level</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="severity" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} /> {/* Blue color */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card table-card">
        <h3 className="card-title">Top Threat Pulses</h3>
        <p className="card-subtitle">Most active campaigns</p>
        <div className="pulses-container">
          <div className="pulses-grid">
            {topPulses.map((pulse, index) => (
              <div key={index} className="pulse-item">
                <div className="pulse-bar-container">
                  <div 
                    className="pulse-bar" 
                    style={{
                      width: `${(pulse.count / (topPulses[0]?.count || 1)) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                      backgroundImage: `linear-gradient(to right, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 2) % COLORS.length]})`
                    }}
                  />
                </div>
                <div className="pulse-info">
                  <div className="pulse-name">{pulse.pulse}</div>
                  <div className="pulse-count">{pulse.count} indicators</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card table-card">
        <div className="table-header">
          <h3 className="card-title">Threat Indicators</h3>
          <div className="table-info">
            Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} indicators
          </div>
        </div>
        <div className="table-container">
          <table className="threat-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Value</th>
                <th>Description</th>
                <th>Pulse</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, visibleCount).map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td className="type-cell">{item.indicator_type}</td>
                  <td className="value-cell">{item.indicator_value}</td>
                  <td className="description-cell">{item.indicator_description}</td>
                  <td className="pulse-cell">{item.pulse_name}</td>
                  <td className="date-cell">{format(new Date(item.created_at), 'yyyy-MM-dd HH:mm')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visibleCount < filtered.length && (
          <button 
            className="load-more-button"
            onClick={() => setVisibleCount(prev => prev + 10)}
          >
            Load More Indicators
          </button>
        )}
      </div>
    </div>
  );
};

export default CTIDashboard;