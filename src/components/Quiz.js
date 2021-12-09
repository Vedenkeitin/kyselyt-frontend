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

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';

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
  const [quizId, setQuizId] = useState([]);
  const [answerData, setAnswerData] = useState({ id: '', content: '' })
  const [aDataList, setADataList] = useState([answerData])

  /*  Moodle esimerkki **/
  const [answers, setAnswers] = useState([]);
  const updateAnswers = (item, index) => {
    let newArr = [...answers];
    newArr[index] = item;
    setAnswers(newArr);
  }

  //hakee datan Heroku-palvelimelta halutusta endpointista
  useEffect(() => {
    //fetch('https://hhkyselybackend.herokuapp.com/rest/quizzes')
    fetch('http://localhost:8080/rest/quizzes')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setData((data))
      })
      .catch(err => console.error(err))
  }, [])

  //avaa valitun kyselyn kysymykset ja tallennetaan keselyn kysymykset questions-stateen
  const openQuestions = (row) => {
    console.log(row.questions);

    setOpen(true);
    setQuizId(row.id)
    setQuestions(row.questions);
    console.log('questions', row.questions)
  };

  //sulkee kyseisen kyselyn kysymykset
  const closeQuestions = () => {
    setAnswers([])
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
    //fetch(`https://hhkyselybackend.herokuapp.com/rest/quizzes/${quizId}/save`, request)
    fetch(`http://localhost:8080/rest/quizzes/${quizId}/save`, request)
      .then(response => response.json())
      .then(data => setAnswer({}));
    setAnswers([])
    setOpen(false);
  }
  // tallentaa {qid, content}
  const handleAnswerChange = (e) => {
    e.preventDefault()
    updateAnswers({ qid: e.target.name, content: e.target.value }, e.target.id)
  }
  // en saanut e.target.id toimmaan material uin kanssa, niin tämmönen ratkasu. Tallentaa {qid, content}
  const handleRadioChange = (e, index) => {
    e.preventDefault()
    updateAnswers({ qid: e.target.name, content: e.target.value }, index)
  }
  // checkbox handler, Tallentaa listan [ {qid, content}, null, null {qid, content} ]
  const handleCheckboxChange = (e, index, i) => {
    let checkArr = []
    if (answers[index] !== undefined) {
      checkArr = [...answers[index]];
    }
    if (e.target.checked) {
      checkArr[i] = { qid: e.target.name, content: e.target.value };
    } else {
      checkArr[i] = null
    }
    updateAnswers(checkArr, index)
  }

  return (
    //Taulukko, jossa näkyy kaikki kyselyt
    <div className="App">
      <TableContainer component={Paper} sx={{ maxWidth: '60%', minWidth: '650px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Otsikko</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Katso kysymykset</TableCell>
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
                  <Button onClick={() => openQuestions(row)}>
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
                          <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        </Typography>
                        <Button autoFocus color="inherit" onClick={submitAnswers}>
                          lähetä
                        </Button>
                      </Toolbar>
                    </AppBar>
                    <List sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      {/* KYSYMYSLISTA */}
                      {questions.map((question, index) => {
                        return (
                          <div style={{ width: '60%', minWidth: '500px' }} key={question.id}>
                            <p>{question.content}</p>
                            {question.type === null &&
                              <textarea
                                onChange={e => handleAnswerChange(e)}
                                id={index}
                                name={question.id}
                                style={{ width: '100%', height: '60px' }}
                              ></textarea>
                            }
                            {question.type === 'text' &&
                              <textarea
                                onChange={e => handleAnswerChange(e)}
                                id={index}
                                name={question.id}
                                style={{ width: '100%', height: '60px' }}
                              ></textarea>
                            }
                            {question.type === 'radiobutton' &&
                              <FormControl component="fieldset" name={question.id.toString()} id={index}>
                                <RadioGroup
                                  aria-label={question.content}
                                  name={question.id.toString()}
                                  id={index} // MUI ID NOT WORKING FOR e.target.id
                                  onChange={e => handleRadioChange(e, index)}
                                >
                                  {question.options.map((option, i) => {
                                    return <FormControlLabel key={i} value={option} control={<Radio />} label={option} id='2' />
                                  })}

                                </RadioGroup>
                              </FormControl>
                            }
                            {question.type === 'checkbox' &&
                              <FormControl component="fieldset" name={question.id.toString()} id={index}>
                                <FormGroup name={question.id.toString()}>
                                  {question.options.map((option, i) => {
                                    return <FormControlLabel
                                      key={i}
                                      onChange={(e) => handleCheckboxChange(e, index, i)}
                                      control={<Checkbox />}
                                      label={option}
                                      value={option}
                                      name={question.id.toString()}
                                      id={index} />
                                  })}
                                </FormGroup>
                              </FormControl>
                            }

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
