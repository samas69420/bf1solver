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

const NextButtonsBox = ({next_buttons,change_label,setting_start}) => {
    return (<>
            <b>Next buttons:</b>
            <div className="n_buttons_container">
                <div className="nextbuttons" onBlur={e => change_label(0,"nb",e.nativeEvent.srcElement.innerText)} suppressContentEditableWarning={true} contentEditable={setting_start ? "true" : "false"}>{next_buttons[0]}</div>
                <div className="nextbuttons" onBlur={e => change_label(1,"nb",e.nativeEvent.srcElement.innerText)} suppressContentEditableWarning={true} contentEditable={setting_start ? "true" : "false"}>{next_buttons[1]}</div>
            </div>
    </>)
}

const Grid8 = () => {

    const [grid_state, set_grid_state] = useState(init_grid());
    const [old_grid_state, set_old_grid_state] = useState(null);
    const [cols_lab, set_cols_lab] = useState(Array(8).fill("-"));
    const [rows_lab, set_rows_lab] = useState(Array(8).fill("-"));
    const [next_but, set_next] = useState([1,2]);
    const [finished, set_finished] = useState(false);

    const [nothing_happened, set_nothing] = useState(null);
    const [last_before_submit, set_last] = useState(null);
    function button_handler(coords){
        if(coords) {
            let new_state = JSON.parse(JSON.stringify(grid_state));  // deep copy
            let new_old_state = old_grid_state ? JSON.parse(JSON.stringify(old_grid_state)) : grid_state;  // deep copy
            new_state.forEach((row,i) => {
                                 row.forEach((element,j) => {
                                     if(i===coords[0] && j===coords[1]){
                                        element.selected = !element.selected;
                                        if(!finished && setting_start === false){
                                            if(element.selected){
                                                if(last_before_submit && last_before_submit !== "nothing"){
                                                    new_state[last_before_submit[0]][last_before_submit[1]].selected = false;
                                                    new_old_state[last_before_submit[0]][last_before_submit[1]].selected = false;
                                                }else if(last_before_submit && last_before_submit === "nothing"){
                                                    set_nothing(false);
                                                }
                                                set_last([i,j]);
                                            }else{
                                                set_last(null);
                                            }
                                        }
                                     }
                                 });
                             });
            set_grid_state(new_state); // switch state
            set_old_grid_state(new_old_state);  // save old state
        }
        else { // nothing happened
            if(last_before_submit && last_before_submit !== "nothing"){
                let new_state = JSON.parse(JSON.stringify(grid_state));  // deep copy
                new_state[last_before_submit[0]][last_before_submit[1]].selected = false;
                set_grid_state(new_state); // switch state
            }
            set_last("nothing");
            set_nothing(!nothing_happened);
        }
    }

    function submit_handler(){
        set_last(null);
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
                    console.log("changed: ",changed, " searching in same row at index ", i);
                    // if so and that specific row or col is not mapped yet map it otherwise ignore
                    if(element.tiles[0] && element !== grid_state[changed[0]][changed[1]]){
                        new_rl = JSON.parse(JSON.stringify(rows_lab));//[...rows_lab];
                        // find common button that was pressed
                        let common = (element.tiles[0] === next_but[0]) ? next_but[0] : 
                                     (element.tiles[0] === next_but[1]) ? next_but[1] :
                                     (element.tiles[1] === next_but[0]) ? next_but[0] : 
                                     next_but[1];
                        new_rl[changed[0]] = common;
                        console.log("common: ", common, "nextbut: ", next_but);
                        new_cl = JSON.parse(JSON.stringify(cols_lab));
                        new_cl[i]= (element.tiles[0] !== common) ? element.tiles[0] : element.tiles[1];
                        new_cl[changed[1]]= (next_but[0] !== common) ? next_but[0] : next_but[1];
                        
                        set_rows_lab(new_rl);
                        set_cols_lab(new_cl);
                    }
                });

                grid_state.forEach((row,i) => { // same col
                    // if so and that specific row or col is not mapped yet map it otherwise ignore
                    console.log("changed: ",changed, " searching in same col at index ", i);
                    if(i === 5 || i === 7){
                        console.log(row[changed[1]].selected,"-",row[changed[1]] !== grid_state[changed[0]][changed[1]]);
                    }

                    if(row[changed[1]].tiles[0] && row[changed[1]] !== grid_state[changed[0]][changed[1]]){
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
            console.log(count, "still unknown");
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

    const [setting_start, set_start] = useState(false);
    function start_state_switch_handler(){
        if(setting_start){
            set_start(false);
            let new_state = JSON.parse(JSON.stringify(grid_state));

            // save known tiles into selected cells
            new_state.forEach((row,i,grid_state) => {
                                 row.forEach((element,j,row) => {
                                     if(element.selected && rows_lab[i] !== "-" && cols_lab[j] !== "-"){
                                         new_state[i][j].tiles = [rows_lab[i], cols_lab[j]];
                                         console.log("coords: ",i,j,"tiles",rows_lab[i], cols_lab[j]);
                                     }
                                 })
                             });

            set_old_grid_state(new_state);
            set_grid_state(new_state);
            console.log("finished setting with state", new_state);
        }else{
            set_start(true);
            console.log("setting");
        }
    }

    function change_label(i,type, val){
        if(!val.includes("-")){
            val = val.replace(/\D/g, ''); // remove everything but numbers
        }else{
            val = "-";
        }
        console.log("changed ", type, i, "val: ", val);
        if(type === "row"){
            let new_rl = [...rows_lab];
            new_rl[i]=(val === "-") ? "-" : Number(val);
            set_rows_lab(new_rl);
        }else if(type === "col"){
            let new_cl = [...cols_lab];
            new_cl[i]=(val === "-") ? "-" : Number(val);
            set_cols_lab(new_cl);
        }else if(type === "nb"){
            let new_next = [...next_but];
            new_next[i] = Number(val);
            set_next(new_next);
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
                                        <th suppressContentEditableWarning={true} contentEditable={setting_start ? "true" : "false"} onBlur={e => change_label(r_ind,"row",e.nativeEvent.srcElement.innerText)}>
                                            {rows_lab[r_ind]}
                                        </th>
                                    </tr>
                                   )
                    })}
                     <tr>
                        {cols_lab.map((element,i) => {return <th onBlur={e => change_label(i,"col",e.nativeEvent.srcElement.innerText)} suppressContentEditableWarning={true} contentEditable={setting_start ? "true" : "false"} key={i}>{element}</th>})}
                        <th style={{fontSize: 15, border: "none"}}>north</th>
                     </tr>
                    </tbody>
                    </table>
                    <div className="downbuttons">
                        <div className="startstate">
                            set manually   
                            <label className="switch" htmlFor="checkbox">
                              <input type="checkbox" id="checkbox" onClick={start_state_switch_handler}/>
                              <div className="slider round"></div>
                            </label>
                        </div>
                        <div>
                            <button 
                                className = "submit_button"
                                onClick = {submit_handler} > 
                                    submit
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <NextButtonsBox
                        next_buttons={[next_but[0],next_but[1]]} 
                        change_label={change_label}
                        setting_start={setting_start}
                    />
                </div>
            </div>
            </>
           ) 
}

/*
TODO
some refactoring
error detection (& recovery)
better css w vertical screen compatibility
*/

export default Grid8;
