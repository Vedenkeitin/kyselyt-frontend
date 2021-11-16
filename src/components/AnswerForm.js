import React, { useState } from 'react'

const AnswerForm = (question) => {
    const [answer, setAnswer] = useState('');

    //vastauksen lähetys
    const submitAnswer = (event) => {
        event.preventDefault()
        
        let postUrl = `https://kyselybackend.herokuapp.com/rest/answers/${question.question.id}/save`
    
        let request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: answer })
        };
        fetch(postUrl, request)
            .then(response => response.json())
            .then(data => console.log(data));
        setAnswer('')
    }

    return (
        <div>
            <p>{question.content}</p>
            <form onSubmit={(e) => submitAnswer(e)}>
                <textarea 
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                >
                </textarea>
                <button type='submit'>submit</button>
            </form>
        </div>
    )
}

export default AnswerForm;