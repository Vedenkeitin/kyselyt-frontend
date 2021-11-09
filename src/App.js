import React, { useState, useEffect } from 'react';

const OpenQuestions = (quiz) => {
  return(
  <div>
    <ul>
      <li>
          {quiz.id}
        </li>
      </ul>
  </div>
  )
}

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
      <h1>Quiz</h1>
      {data.map((item) => (
        <div key={item.id}>
          <div>{item.name}<a href="/questions"> Answer</a></div>
          <ul>
            {item.questions.map((i) => (
              <li key={i.id}>{i.content}</li>
    
              ))}
          </ul>
          
          <OpenQuestions quiz={item} />
        </div>
      ))}
    </div>
  );
}

export default App;
