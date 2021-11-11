import React, { useState, useEffect } from 'react';

import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

//Slide aukeavalle näytölle
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Questions() {

    const [data, setData] = useState([]);
    const [open, setOpen] = React.useState(false);

    //hakee datan
    useEffect(() => {
        fetch('https://kyselybackend.herokuapp.com/quizRest')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setData((data))
        })
        .catch(err => console.error(err))
    }, [])

    //avaa valitun kyselyn kysymykset
    const openQuestions = () => {
        setOpen(true);
    };

    //sulkee kyseisen kyslyn kysymykset
    const closeQuestions = () => {
        setOpen(false);
    }
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
                        <Button autoFocus color="inherit" onClick={closeQuestions}>
                            submit
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <List>
                        {data.map((item) => (
                                    <div key={item.id}>
                                    <ul>
                                        {item.questions.map((i) => (
                                        <li key={i.id}>{i.content}</li>
                                        ))}
                                    </ul>
                                    </div>
                        ))}
                    </List>
                </Dialog>
};

export default Questions;