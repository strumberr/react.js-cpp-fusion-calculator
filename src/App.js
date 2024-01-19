import React, { useState, useEffect } from "react";
import createModule from "./square.mjs";


function App() {
  const [square, setSquare] = useState();
  const [currentValue, setCurrentValue] = useState();

  useEffect(
    () => {
    createModule().then((Module) => {
    setSquare(() => Module.cwrap("square", "number", ["number", "number"]));
    });
  }, []);


  
  
  if (!square) {
    return "Loading webassembly...";
  }
  return (
    <div className="App">
      <p>Let's do some basic squareition:</p>
      <div>4 = {square(2)}</div>

      <input value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
      <button onClick={() => alert(square(currentValue))}>Square it!</button>
      
    </div>
  );
}
export default App;