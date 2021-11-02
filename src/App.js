import React, { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/questions')
    .then(response => response.json())
    .then(data => setData(data._embedded))
    .catch(err => console.error(err))
  }, [])

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
