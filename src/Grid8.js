import { useState } from 'react'; // to modify elements of the page from click handlers 
import Cell from './Cell';
import './App.css';

// helper

const init_grid = () => {
    /* for a single button

    {
        selected: true/false
        tiles: [15,16]
    }

    */
    let start_state_array = [];
    for (let i = 0; i< 8; i++){
        let row = [];
        for (let j = 0; j< 8; j++){
            row[j] = {
                        selected: false,
                        tiles: [null,null]
                     };    
        }
        start_state_array[i] = row;
    }
    return start_state_array;
}

const NextButtonsBox = ({next_buttons}) => {
    return (<>
            <b>Next buttons:</b>
            <div className="n_buttons_container">
                <div className="nextbuttons">{next_buttons[0]}</div>
                <div className="nextbuttons">{next_buttons[1]}</div>
            </div>
    </>)
}

const Grid8 = () => {

    const [grid_state, set_grid_state] = useState(init_grid());
    const [old_grid_state, set_old_grid_state] = useState(null);
    const [cols_lab, set_cols_lab] = useState(Array(8).fill("-"));
    const [rows_lab, set_rows_lab] = useState(Array(8).fill("-"));
    const [nothing_happened, set_nothing] = useState(null);
    const [next_but, set_next] = useState([1,2]);
    const [finished, set_finished] = useState(false);
    //const [recover_from_nothing, set_recover_from_nothing] = useState(false);
    //const [all_buttons, set_buttons] = useState(Array(16).fill(false));
    // set_grid_state(1); // infinite loop error for some reasons idk

    function button_handler(coords){
        if(coords) {

            //console.log(old_grid_state[0][0]) // error
            //console.log(grid_state[0][0]) false

            set_old_grid_state(grid_state);  // save old state
            //let new_state = [...grid_state]; // copy the old state  shallow copy
            let new_state = JSON.parse(JSON.stringify(grid_state));  // deep copy
            new_state.forEach((row,i) => {
                                 row.forEach((element,j) => {
                                     if(i===coords[0] && j===coords[1]){
                                        element.selected = !element.selected;
                                     }
                                 });
                             });
            set_grid_state(new_state); // switch state
            console.log([...grid_state][0][0]);
        }
        else { // nothing happened
            set_nothing(true);
        }
    }

    function submit_handler(){
        let count = 0;
        if(!finished){
            let recover_from_nothing = false;
            let new_rl = JSON.parse(JSON.stringify(rows_lab));//[...rows_lab];
            let new_cl = JSON.parse(JSON.stringify(cols_lab));

            // if nothing happened shift buttons do the telescopic thing 
            if(nothing_happened){
                set_nothing(false);
            }
            else{
                //// check if there are some buttons missing (from nothing_happened situations) 
                //for(let i=1; i <= next_but[1]; i++)
                //{
               //    if(all_buttons[i]==false){
                //        let newnext = [...next_but];
                //        newnext[0] = i;
                //        set_next(newnext);
                //        return;
                //    }
                //}

                // get the last changed cell
                let changed = null;
                grid_state.forEach((row,i,grid_state) => {
                                     row.forEach((element,j,row) => {
                                         if(element.selected !== old_grid_state[i][j].selected)
                                         {
                                            console.log("found changed cell since last submit: ",i,j);
                                            changed = [i,j]; 
                                         }
                                     })
                                 });

                // update old and current state
                set_old_grid_state(grid_state);  // save old state
                let new_state = JSON.parse(JSON.stringify(grid_state));  // deep copy
                new_state.forEach((row,i,new_state) => {
                                     row.forEach((element,j,row) => {
                                         if(i === changed[0] && j === changed[1]){
                                            element.tiles = next_but;
                                         }
                                     });
                                 });
                console.log("tiles of the changed cell: ",new_state[changed[0]][changed[1]].tiles);
                //set_grid_state(new_state); // switch state

                // check if there is any other already known cell in the same row or col
                grid_state[changed[0]].forEach((element,i) => { // same row
                    // if so and that specific row or col is not mapped yet map it otherwise ignore
                    if(element.selected && element !== grid_state[changed[0]][changed[1]]){
                        new_rl = JSON.parse(JSON.stringify(rows_lab));//[...rows_lab];
                        // find common button that was pressed
                        let common = (element.tiles[0] === next_but[0]) ? next_but[0] : 
                                     (element.tiles[0] === next_but[1]) ? next_but[1] :
                                     (element.tiles[1] === next_but[0]) ? next_but[0] : 
                                     next_but[1];
                        new_rl[changed[0]] = common;
                        console.log("common: ", common);
                        new_cl = JSON.parse(JSON.stringify(cols_lab));
                        new_cl[i]= (element.tiles[0] !== common) ? element.tiles[0] : element.tiles[1];
                        new_cl[changed[1]]= (next_but[0] !== common) ? next_but[0] : next_but[1];
                        
                        set_rows_lab(new_rl);
                        set_cols_lab(new_cl);
                    }
                });

                grid_state.forEach((row,i) => { // same col
                    // if so and that specific row or col is not mapped yet map it otherwise ignore
                    console.log("changed: ",changed, " searching for same col at index ", i);
                    if(i === 5 || i === 7){
                        console.log(row[changed[1]].selected,"-",row[changed[1]] !== grid_state[changed[0]][changed[1]]);
                    }

                    if(row[changed[1]].selected && row[changed[1]] !== grid_state[changed[0]][changed[1]]){
                        new_cl = JSON.parse(JSON.stringify(cols_lab));
                        // find common button that was pressed
                        let common = (row[changed[1]].tiles[0] === next_but[0]) ? next_but[0] : 
                                     (row[changed[1]].tiles[0] === next_but[1]) ? next_but[1] :
                                     (row[changed[1]].tiles[1] === next_but[0]) ? next_but[0] : 
                                     next_but[1];
                        console.log("found common : ",common);
                        new_cl[changed[1]] = common;
                        console.log("common: ", common);
                        new_rl = JSON.parse(JSON.stringify(rows_lab));
                        new_rl[i] = (row[changed[1]].tiles[1] !== common) ? row[changed[1]].tiles[1] : row[changed[1]].tiles[0];
                        new_rl[changed[0]]= (next_but[1] !== common) ? next_but[1] : next_but[0];

                        set_rows_lab(new_rl);
                        set_cols_lab(new_cl);
                    }
                    });
                 
                set_grid_state(new_state); // switch state

            }

            if(next_but[1]-next_but[0] > 1){
                recover_from_nothing = true;
            }

            // check how many unknown button left
            count = 0;
            for(let i = 0; i<8; i++){
                if (new_rl[i] === "-" || new_cl[i] === "-"){
                    count += 1;
                }
            }
            if(count === 1)
            {
                for(let i = 0; i<8; i++){
                    if(new_rl[i] === "-"){
                        if(new_cl.includes(15) || new_rl.includes(15)){
                            new_rl[i] = 16;
                        }else{
                            new_rl[i] = 15;
                        }
                    }
                    if(new_cl[i] === "-"){
                        if(new_cl.includes(15) || new_rl.includes(15)){
                            new_cl[i] = 16;
                        }else{
                            new_cl[i] = 15;
                        }
                    }
                }
                set_next(["X","X"]);
                set_finished(true);
                return;
            }

            if(new_rl.includes("-") && new_cl.includes("-")){
                // set increment according to recover situation
                if(nothing_happened){
                    set_next([next_but[0],next_but[1]+1]);
                }
                if(!nothing_happened && recover_from_nothing && count !== 1){
                    set_next([next_but[0]+1,next_but[1]]);
                }
                else if(!nothing_happened && !recover_from_nothing){
                    set_next([next_but[0]+1,next_but[1]+1]);
                }

            }else{
                if(new_rl.includes("-")){
                // if all cols are mapped
                    if(recover_from_nothing){
                        set_next([next_but[0]+1,Math.max(...new_cl)]);
                    }else{
                        set_next([Math.max(...new_cl),next_but[1]+1]);
                    }
                }else{
                // if all rows are mapped
                    if(recover_from_nothing){
                        set_next([next_but[0]+1,Math.max(...new_rl)]);
                    }else{
                        set_next([Math.max(...new_rl),next_but[1]+1]);
                    }
                }
            }
        }
    }

    // display grid using divs
    //return (
    //        <div>
    //        {grid_state.map((row, r_ind) => {
    //                return (<div key={r_ind}> 
    //                            {row.map((element,c_ind) => {
    //                                return <Cell 
    //                                            selected   = {element.selected} 
    //                                            class_name = {element.selected ? "s_button_clicked" : "s_button"}
    //                                            handler    = {button_handler}
    //                                            coords     = {[r_ind,c_ind]}
    //                                            key        = {r_ind*8+c_ind}
    //                                       />
    //                            })}
    //                        </div>
    //                       )
    //        })}
    //        {/*<div>
    //        {[1,2,3,4,5,6,7,8,"X"].map((el) => {
    //            return(<button className="grid_label">{el}</button>)
    //        })}
    //        </div>*/}
    //        </div>
    //       ) 
    
    // display grid using table
    return (
            <>
            <div className="gridnextcontainer">
                <div className="grid8container">
                    <div>
                        <Cell 
                             selected   = {nothing_happened ? true : false} 
                             class_name = {nothing_happened ? "s_button_clicked" : "s_button"}
                             handler    = {button_handler}
                             coords     = {null}
                        />
                    </div>
                    <br></br>
                    <table>
                    <tbody>
                    {grid_state.map((row, r_ind) => {
                            return (<tr key={r_ind}> 
                                        {row.map((element,c_ind) => {
                                            return <td key={r_ind*8+c_ind}>
                                                   <Cell 
                                                        selected   = {element.selected} 
                                                        class_name = {element.selected ? "s_button_clicked" : "s_button"}
                                                        handler    = {button_handler}
                                                        coords     = {[r_ind,c_ind]}
                                                   />
                                                   </td>
                                        })}
                                        <th>{rows_lab[r_ind]}</th>
                                    </tr>
                                   )
                    })}
                     <tr>
                        {cols_lab.map((element,i) => {return <th key={i}>{element}</th>})}
                        <th style={{fontSize: 15, border: "none"}}>north</th>
                     </tr>
                    </tbody>
                    </table>
                    <p>
                    <button 
                        className = "submit_button"
                        onClick = {submit_handler} > 
                            submit
                    </button>
                    </p>
                </div>
                <div>
                    <NextButtonsBox
                        next_buttons={[next_but[0],next_but[1]]} 
                    />
                </div>
            </div>
            </>
           ) 
}

/*
TODO
stato di partenza
edit delle lable
tasto undo
*/

export default Grid8;
