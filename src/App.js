import './App.css';
import React from 'react';
import Grid8 from './Grid8';

function Instructions(){
    return (<ol style={{fontSize: 20}}>
        <li>go outside the chateau and press both the two buttons in the pillars indicated under "next buttons", (if you dont know what buttons the numbers refers to look at <i><a target="_blank" rel="noreferrer" href="https://wiki.bfee.co/images/e/ef/ChateauTopView.jpg">this picture</a></i>)</li>
        <li>after you press the buttons check the floor in the chateau, if a light turns on click the corresponding square in the grid, otherwise if nothing happens click "X" button</li>
        <li>click submit, the "next buttons" will change</li>
        <li>repeat</li>
        <li>keep doing this, after some iterations you will notice the boxes outside the grid populating themself with numbers, these numbers are the buttons you need to press in order to control every light in that row/column</li>
    </ol>)
}


function App() {
  return (
    <div className="App">
        <h2>BF1 dancefloor solver</h2>
        <div className="container">
            <div className="left-column">
            <div>
                How to use the solver:
                <br></br>
                <Instructions />
            </div>
            </div>
            <main>
                <Grid8 />
            </main>
        </div>
    </div>
  );
}

export default App;
