const Cell = ({selected, coords, handler, class_name}) => {
    return (<button 
                onClick={() => {handler(coords ? coords : null)}}
                className={class_name}>
                        {coords ? " " : "X"}
            </button>) 
}

export default Cell;
