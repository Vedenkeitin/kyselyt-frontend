import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';

import AnswerForm from './AnswerForm'


//Slide aukeavalle näytölle
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Quiz() {

  const [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [answerData, setAnswerData] = useState({id: '', content: ''})
  const [ aDataList, setADataList] = useState([answerData])

/*  Moodle esimerkki **/
  const [answers, setAnswers] = useState([]);
  const updateAnswers = (item, index) => {
    let newArr = [...answers];
    newArr[index] = item;
    setAnswers(newArr);
  }

  //hakee datan Heroku-palvelimelta halutusta endpointista
  useEffect(() => {
    fetch('https://hhkyselybackend.herokuapp.com/rest/quizzes')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setData((data))
      })
      .catch(err => console.error(err))
  }, [])

  //avaa valitun kyselyn kysymykset ja tallennetaan keselyn kysymykset questions-stateen
  const openQuestions = (questions) => {
    console.log(questions);
    let newArr = [...answers];
    questions.map(q => {
      console.log(q) 
      newArr.push({id: q.id, content: ""})
      setAnswerData({id: "2", content: "aa"})
    })
    console.log(newArr)
    setADataList([...aDataList, answerData])

    console.log('answers', aDataList)
    setOpen(true);
    setQuestions(questions);
    console.log('questions', questions)
  };

  //sulkee kyseisen kyselyn kysymykset
  const closeQuestions = () => {
      setOpen(false);
  }

  //lähtetään vastatukset
  const submitAnswers = () => {
    let request = {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers) // JSON.parse() mahdollisesti toimisi paremmin ja ilman virheitä
    };
    fetch(`http://hhkyselybackend.herokuapp.com/rest/quizzes/1/save`, request)
      .then(response => response.json())
      .then(data => setAnswer({}));
    setOpen(false);
  }

  const handleAnswerChange = (e) => {
    e.preventDefault()
    updateAnswers({qid: e.target.name, content: e.target.value}, e.target.id)  
  }

  return (
    //Taulukko, jossa näkyy kaikki kyselyt
    <div className="App">
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{fontWeight: 'bold'}}>Otsikko</TableCell>
            <TableCell style={{fontWeight: 'bold'}}>Katso kysymykset</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell component="th" scope="row">
                  <Button onClick={() => openQuestions(row.questions)}>
                      Vastaa
                  </Button>

                  {/* Dialogin avaaminen, missä näkyy kyselyn kysymykset */}
                  <Dialog
                    fullScreen
                    open={open}
                    onClose={closeQuestions}
                    TransitionComponent={Transition}
                  >
                    <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                          edge="start"
                          color="inherit"
                          onClick={closeQuestions}
                          aria-label="close"
                        >
                        <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div"> 
                        </Typography>
                        <Button autoFocus color="inherit" onClick={submitAnswers}>
                            lähetä
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <List>
                        {questions.map((question, index) => {
                          return (
                            <div key={question.id}>
                              <p>{question.content}</p>
                              {/* AnswerForm-komponentin lisääminen */}
                              {/*<AnswerForm question={question} /> */}
                              <textarea 
                              onChange={e => handleAnswerChange(e)} 
                              id={index} 
                              name={question.id}
                              style={{width: '80%', height: '30px'}}
                              ></textarea>
                            </div>
                          )
                        })}
                    </List>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      
    </div>
  );
}

export default Quiz;
