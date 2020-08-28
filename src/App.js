import React, { useState, useCallback, useRef } from "react"
import produce from "immer"
import "./App.css"
import Button from '@material-ui/core/Button';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';



const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    typography: {
  
        fontSize: 10,
      },
  },
  
}));

const theme = createMuiTheme({
    palette: {
      primary: {main: blueGrey[500]},
    },
  });

const operations = [
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [1, 0],
    [-1, -1],
    [-1, 1],
    [-1, 0]

]


export default function App() {
    const classes = useStyles();


    const [numRows, setRows] = useState(20);
    const [numCols, setCols] = useState(20);
    
    const [grid, setGrid] = useState(() => {
        const rows = [];
            for (let i = 0; i < numRows; i++){
                rows.push(Array.from(Array(numCols), () => 0))
            };
            return rows
    });

    const [running, setRunning] = useState(false);

    const runningRef = useRef(running);
    runningRef.current = running;

    const generateEmptyGrid = () => {
        const rows = [];
            for (let i = 0; i < numRows; i++){
                rows.push(Array.from(Array(numCols), () => 0))
            };
            return rows
    }

 

    const runSimulation = useCallback(() => {
        if (!runningRef.current) {
            return;
        }
        setGrid((g) => {
            return produce(g, gridCopy => {
                for (let i = 0; i < numRows; i++) {
                    for (let k = 0; k < numCols; k++) {
                        let neighbors = 0;
                        operations.forEach(([x,y]) => {
                            const newI = i + x;
                            const newK = k + y;
                            if (newI >= 0 && newI <  numRows && newK >= 0 && newK < numCols){
                                neighbors += g[newI][newK]
                            }
                        })
                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][k] = 0;
                        } else if (g[i][k] === 0 && neighbors === 3) {
                            gridCopy[i][k] = 1;
                        }
                    }
                }
            })
        })
        
        setTimeout(runSimulation, 100)
    }, [])

    return (
        <div id="main">
            <div id="left">
            <h1>Game Of Life</h1>
            <p>The game of life was created by John Conway in 1970. It depicts a cellular automaton, and each cell has two states (alive or dead). To interact with the game, you can create an initial configuration and observe how it evolves over time. A cell can live or die based on its neighbors, such as through underpopulation, overpopulation, or reproduction.</p>
            <p>Conway aimed to define an interesting and unpredictable cell automaton, with some configurations lasting a long time before dying and others going on forever. The game illustrates how complex patterns can emerge from simple rules. </p>
            <div className={classes.root} style= {{
               display: "flex",
               flexDirection: "row",
               alignItems: "center",
               justifyContent: "center",
               fontSize: "0.8em"
           }}>
                <Button size="small" variant="contained"  color="primary" onClick = {() => {
                    setRunning(!running);
                    if(!running){
                        runningRef.current = true;
                        runSimulation()
                    }
                    
                }}> {running ? "stop" : "start"} </Button>
        
                 <ThemeProvider theme={theme}>

                    <Button size="small" variant="contained"  color="primary" onClick = {() => {
                        setGrid(generateEmptyGrid());
                        setRunning(false)
                    }}> clear </Button>
                </ThemeProvider>

        
                <Button size="small" variant="contained"  color="primary" onClick = {() => {
                    const rows = [];
                    for (let i = 0; i < numRows; i++){
                        rows.push(Array.from(Array(numCols), () => Math.random() > 0.5 ? 1 : 0))
                    };
                    setGrid(rows)
        
                }}> seed </Button>
           </div>
            </div>
            <div id="game">
           
           
            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${numCols}, 25px)`,
                margin: "5%",
                justifyContent: "center",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
            }}>
                {grid.map((rows, i) => 
                    rows.map((col, k) => (
                        <div   
                            key= {`${i}-${k}`}
                            onClick = {() => {
                                const newGrid = produce(grid, gridCopy => {
                                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                                })
                                setGrid(newGrid);
                            }}
                            style = {{ 
                                width: 25, 
                                height: 25, 
                                backgroundColor: grid[i][k] ? '#37474f' : undefined, 
                                border: "solid 1px #37474f" 
                                }}
                        />
                    ))
                    )}
            </div>
            </div>
        </div>
    )
}

