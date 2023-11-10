import "./App.css";
import React from "react";
import Grid8 from "./Grid8";

function Instructions() {
  return (
    <>
      <h1 className="instructions-title">How to use the solver:</h1>
      <ol className="instructions-list">
        <li>
          Go outside the chateau and press both the two buttons in the pillars
          indicated under "next buttons", (if you dont know what buttons the
          numbers refers to look at{" "}
          <i>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://wiki.bfee.co/images/e/ef/ChateauTopView.jpg"
              className="referenced-picture-link"
              alt="referenced-picture-link"
            >
              this picture
            </a>
          </i>
          )
        </li>
        <li>
          After you press the buttons check the floor in the chateau, if a light
          changes state click the corresponding square in the grid, otherwise if
          nothing happens click the "X" button
        </li>
        <li>Click submit, the "next buttons" will change</li>
        <li>Repeat</li>
        <li>
          Keep doing this, after some iterations you will notice the boxes
          outside the grid populating themself with numbers, these numbers are
          the buttons you need to press in order to control every light in that
          row/column
        </li>
        <li>
          If you find yourself in the very bad situation of having multiple
          lights on and no idea about what buttons controls them just reload
          this page, switch on "set manually" and click every cell you see
          glowing in the floor, then switch "set manually" off and repeat from
          step 1
        </li>
        <li>
          Every light is supposed to change ONLY AFTER PRESSING BOTH the "next
          buttons", if you notice any change after pressing only one of them it
          means there has been a problem (maybe you thought you pressed a button
          but the server didnt record it), and probably the mappings you got are
          totally wrong resume from step 6
        </li>
      </ol>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <header>
        <h2 className="webpage-title">BF1 Dancefloor Solver</h2>
      </header>
      <main>
        <div className="left-column">
          <Instructions />
        </div>
        <div className="right-column">
          <Grid8 />
        </div>
      </main>
    </div>
  );
}

export default App;
