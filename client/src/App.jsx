import React, { useState, useEffect } from 'react';
import Header from './Components/Header';
import CTIDashboard from './Components/CTIdashboard';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="container">
      {/* <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} /> */}
      <CTIDashboard />
    </div>
  );
};

export default App;
