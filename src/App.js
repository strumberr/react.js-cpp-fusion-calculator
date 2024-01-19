import React, { useState, useEffect } from "react";
import createModule from "./square.mjs";
import "./App.css";

// calculator
function App() {
  const [square, setSquare] = useState();
  const [currentInputValue, setCurrentInputValue] = useState();

  useEffect(
    () => {
    createModule().then((Module) => {
    setSquare(() => Module.cwrap("square", "number", ["number", "number"]));
    });
  }, []);

  const handleButtonClick = (value) => {
    setCurrentInputValue(prev => prev + value);
  };
  
  
  if (!square) {
    return "Loading webassembly...";
  }
  return (
    <div className="App">
      <div className="innerWindow">
        <div className="innerWindowSplitLeft">
          <div className="innerWindowSplitLeftFunctionWrapper">
            <label className="functionLabel">Function</label>
            <input
              type="text"
              value={currentInputValue}
              onChange={(e) => setCurrentInputValue(e.target.value)}
              className="innerWindowSplitLeftFunctionWrapperInput"
              placeholder="Equations here!!"
            />
          </div>
          <div className="innerWindowSplitLeftButtons">
            <div className="eachIndButton" onClick={() => handleButtonClick('x')}>
              <svg className="iconButtonsBasics" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
              </svg>
            </div>
            <div className="eachIndButton">
              <svg className="iconButtonsBasics" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
              </svg>
            </div>
            <div className="eachIndButton">
              <svg className="iconButtonsBasics" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
              </svg>
            </div>
            <div className="eachIndButton">
              <svg className="iconButtonsBasics" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M272 96a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 320a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM400 288c17.7 0 32-14.3 32-32s-14.3-32-32-32H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H400z"/>
              </svg>
            </div>

            <div className="eachIndButtonSplitHalfSeparate">
              <div className="eachIndButtonSplitHalf">
              
              </div>
              <div className="eachIndButtonSplitHalf">
              
              </div>
            </div>
            <div className="eachIndButtonSplitHalfSeparate">
              <div className="eachIndButtonSplitHalf">
              
              </div>
              <div className="eachIndButtonSplitHalf">
              
              </div>
            </div>
            <div className="eachIndButtonSplitHalfSeparate">
              <div className="eachIndButtonSplitHalf">
              
              </div>
              <div className="eachIndButtonSplitHalf">
              
              </div>
            </div>

            <div className="eachIndButtonSplitHalfSeparate">
              <div className="eachIndButtonSplitHalf">
              
              </div>
              <div className="eachIndButtonSplitHalf">
              
              </div>
            </div>

            <div className="eachIndButton" style={{ backgroundColor: "#0AD1DC" }}>
              <svg className="iconButtonsBasics" fill="#00484C" style={{ width: "30%", height: "30%" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M169.7 .9c-22.8-1.6-41.9 14-47.5 34.7L110.4 80c.5 0 1.1 0 1.6 0c176.7 0 320 143.3 320 320c0 .5 0 1.1 0 1.6l44.4-11.8c20.8-5.5 36.3-24.7 34.7-47.5C498.5 159.5 352.5 13.5 169.7 .9zM399.8 410.2c.1-3.4 .2-6.8 .2-10.2c0-159.1-128.9-288-288-288c-3.4 0-6.8 .1-10.2 .2L.5 491.9c-1.5 5.5 .1 11.4 4.1 15.4s9.9 5.6 15.4 4.1L399.8 410.2zM176 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm64 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM96 384a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="innerWindowSplitRight">
          <div className="innerWindowSplitRightTop">
            <label className="resultLabel">Result</label>
              <div className="resultText">{square(currentInputValue)}</div>
            </div>
          <div className="innerWindowSplitRightMiddle">
        
          </div>
          <div className="innerWindowSplitRightBottom">
        
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;