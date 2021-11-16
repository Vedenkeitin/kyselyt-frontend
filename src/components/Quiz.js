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

import TextareaAutosize from '@mui/material/TextareaAutosize';

//Slide aukeavalle näytölle
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Quiz() {

  const [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState([]);

  //hakee datan
  useEffect(() => {
    fetch('https://kyselybackend.herokuapp.com/rest/quizzes')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setData((data))
      })
      .catch(err => console.error(err))
  }, [])

  //avaa valitun kyselyn kysymykset
  const openQuestions = (questions) => {
    console.log(questions);
    setOpen(true);
    setQuestions(questions);
  };

  //sulkee kyseisen kyselyn kysymykset
  const closeQuestions = () => {
      setOpen(false);
  }

  //lähtetään vastatukset
  const submitQuestions = () => {
    setOpen(false);
  }

  return (
    <div className="App">
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{fontWeight: 'bold'}}>Title</TableCell>
            <TableCell style={{fontWeight: 'bold'}}>Watch Questions</TableCell>
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
                      Answer
                  </Button>

                  {/* Tästä alkaa dialogin avaaminen */}
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
                        <Button autoFocus color="inherit" onClick={submitQuestions}>
                            submit
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <List>
                        {questions.map(question => {
                          return (
                            <div key={question.id}>
                              <p>{question.content}</p>
                              <TextareaAutosize
                                aria-label="minimum height"
                                minRows={3}
                                style={{ width: 500 }}
                              />
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
