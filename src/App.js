import './App.css';
import React from 'react';
import Grid8 from './Grid8';

function Instructions(){
    return (<ol style={{fontSize: 17}}>
                <li>go outside the chateau and press both the two buttons in the pillars indicated under "next buttons", (if you dont know what buttons the numbers refers to look at <i><a target="_blank" rel="noreferrer" href="https://wiki.bfee.co/images/e/ef/ChateauTopView.jpg">this picture</a></i>)</li>
                <li>after you press the buttons check the floor in the chateau, if a light changes state click the corresponding square in the grid, otherwise if nothing happens click the "X" button</li>
                <li>click submit, the "next buttons" will change</li>
                <li>repeat</li>
                <li>keep doing this, after some iterations you will notice the boxes outside the grid populating themself with numbers, these numbers are the buttons you need to press in order to control every light in that row/column</li>
                <li>if you find yourself in the very bad situation of having multiple lights on and no idea about what buttons controls them just reload this page, switch on "set manually" and click every cell you see glowing in the floor, then switch "set manually" off and repeat from step 1</li>
                <li>every light is supposed to change ONLY AFTER PRESSING BOTH the "next buttons", if you notice any change after pressing only one of them it means there has been a problem (maybe you thought you pressed a button but the server didnt record it), and probably the mappings you got are totally wrong resume from step 6</li>
            </ol>)
}


function App() {
  return (
    <div className="App">
        <h2>BF1 dancefloor solver</h2>
        <div className="container">
            <div className="left-column">
                How to use the solver:
                <Instructions />
            </div>
            <main>
                <Grid8 />
            </main>
        </div>
    </div>
  );
}

export default App;
