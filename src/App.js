import React, { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://kyselybackend.herokuapp.com/quizRest')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setData((data))
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="App">
      {data.map((item) => (
        <div key={item.id}>
          <h1>{item.name}</h1>
          <ul>
            {item.questions.map((i) => (
              <li key={i.id}>{i.content}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
