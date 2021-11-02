import React, { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/questionsRest')
    .then(response => response.json())
    .then(data => {console.log(data)
      setData((data))
    })
    .catch(err => console.error(err))
  }, [])

  return (
    <div className="App">
      <ul>
          {data.map((item) => (
            <li key={item.id}>
              {item.content}
            </li>
          ))}
        </ul>
    </div>
  );
}

export default App;
