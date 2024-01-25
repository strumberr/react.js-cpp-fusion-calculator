import React, { useState, useEffect, useRef } from "react";
import createModule from "./math.mjs";
import "./App.css";
import D3Chart from "./graph.js";
import { evaluate, derivative, simplify, parse, i } from 'mathjs';
import createGradientModule from "./dist/gradient.mjs"

// calculator

function App() {
  const [gradientModule, setGradientModule] = useState()

  const [gradialDescentFunction, setGradialDescentFunction] = useState();

	
  const [currentInputValue, setCurrentInputValue] = useState("");
	const [bigGraph, setBigGraph] = useState(false);
	const [initialValue, setInitialValue] = useState(0);
	const [stepSize, setStepSize] = useState(0);
	const [tolerance, setTolerance] = useState(0);
	const [maxIterations, setMaxIterations] = useState(0);
	const [derivativeValue, setDerivativeValue] = useState(0);
  const [equalButton, setEqualButton] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const [result, setResult] = useState(null);
  const [functionCaller, setFunctionCaller] = useState(null);


	const inputRefFunction = useRef(null);
  
  useEffect(
		() => {
      createModule().then((Module) => {
			setGradialDescentFunction(() => Module.cwrap("gradient_descent", "number", ["string", "string", "number", "number", "number", "number"]));
		});

   
	}, []);

 

 

	const handleButtonClick = (value) => {
		setCurrentInputValue(prev => prev + value);

		if (inputRefFunction.current) {
			inputRefFunction.current.focus();
		}

		if (value === 'sin()') {
			// Handle sin() button click
		}
	};

  const data = [];
  for (let x = -10; x <= 10; x += 0.5) {
    data.push({ x: x, y: x * x });
  }

  function formatMathExpression(input) {

    if (!input || typeof input !== 'string') {
      return '';
    }

    let formattedInput = input
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/√/g, 'sqrt')
      .replace(/∛/g, 'cbrt')
      .replace(/∞/g, 'Infinity')
			.replace("**", '^')


		while (formattedInput.includes("**")) {
			formattedInput = formattedInput.replace("**", "^");
		}

    return formattedInput;
  }

	// (x-2)**2+y**2-2*x+3

  function evaluateSymbolic(expression) {

    try {
      const parsedExpression = parse(expression);

      // if (expression.includes("derivative")) {
      //   return derivative(parsedExpression, 'X').toString().replace(/\*/g, '');
      // }
			// const simplifiedExpression = simplify(parsedExpression).toString().replace(/\*/g, '');
			
			const derivativeCalc = derivative(parsedExpression, "x").toString();


      return { value: expression, derivative: derivativeCalc };
			
    } catch (error) {
      console.error('Error in symbolic evaluation:', error.message);
      return { value: 0, derivative: 0 }
    }
		
  }

  function evaluateExpression(expression) {

    try {
      const parsedExpression = parse(expression);

      // if (expression.includes("derivative")) {
      //   return derivative(parsedExpression, 'X').toString().replace(/\*/g, '');
      // }

			const simplifiedExpression = simplify(parsedExpression).toString().replace(/\*/g, '');
			
			const derivativeCalc = derivative(simplifiedExpression, "x").toString();


      return derivativeCalc
			
    } catch (error) {
      console.error('Error in symbolic evaluation:', error.message);
      return 0
    }
		
  }


	function calculateDerivative(expression) {
		try {
      const derivativeCalc = derivative(expression, "x");
			return derivativeCalc.toString();
    } catch (error) {
      console.error('Error in symbolic evaluation:', error.message);
      return 0;
    }
	}
  

  useEffect(() => {

    if (maxIterations.toString().length >= 6 || stepSize.toString().length >= 8) {
      setEqualButton(true);
      setShowResult(false);
    } else {
      setEqualButton(false);
    }
  }, [maxIterations, stepSize]);


  const equalButtonClick = () => {
    setLoadingAnimation(true);
    console.log("equal button clicked");
    setShowResult(true);

    setLoadingAnimation(false);
  };

 

  useEffect(() => {
    const initializeModule = async () => {
        const Module = await createModule();
        setFunctionCaller(() => Module.cwrap("gradient_descent", "number", ["string", "string", "number", "number", "number", "number"]));
    };

    initializeModule();
  }, []);


  useEffect(() => {
    
    if (!equalButton || showResult) {
      setLoadingAnimation(true);
      if (maxIterations.toString().length >= 6) {
        if (equalButton) {
          if (functionCaller) {
            const evaluatedValue = evaluateSymbolic(currentInputValue).value;
            const evaluatedDerivative = evaluateSymbolic(currentInputValue).derivative;
            const result = functionCaller(evaluatedValue, evaluatedDerivative, initialValue, stepSize, tolerance, maxIterations);
            console.log("use effect result", result);
            console.log("loading", loadingAnimation);
            setLoadingAnimation(false);
            setResult(result);
          } else {
            console.log("function caller not defined");
          }
        }
      } else {
        if (functionCaller) {
            const evaluatedValue = evaluateSymbolic(currentInputValue).value;
            const evaluatedDerivative = evaluateSymbolic(currentInputValue).derivative;
            const result = functionCaller(evaluatedValue, evaluatedDerivative, initialValue, stepSize, tolerance, maxIterations);
            console.log("use effect result", result);
            setLoadingAnimation(false);
            setResult(result);
        } else {
          console.log("function caller not defined");
        }
      }
    }
    
    setLoadingAnimation(false);
  }, [equalButton, showResult, currentInputValue, initialValue, stepSize, tolerance, maxIterations, functionCaller]);





  if (!gradialDescentFunction) {
    return "Loading webassembly...";
  }

	// print gradient_descent("x**2+y**2-2*x+3", "x", 0, 0.1, 0.0001, 1000);
	console.log("gradiente", gradialDescentFunction("x^2", "2*x", 1, 0.1, 0.0001, 1000));
  console.log(evaluateSymbolic(currentInputValue).derivative)
  console.log("gradiente dinamico", gradialDescentFunction(currentInputValue, evaluateSymbolic(currentInputValue).derivative, initialValue, stepSize, tolerance, maxIterations));
  return (
    <div className="App">
      <div className="innerWindow">
        <div className="innerWindowSplitLeft">
          <div className="innerWindowSplitLeftFunctionWrapper">
            <label className="functionLabel">Function</label>
            <input
              type="text"
              value={formatMathExpression(currentInputValue)}
              onChange={(e) => setCurrentInputValue(e.target.value)}
              className="innerWindowSplitLeftFunctionWrapperInput"
              placeholder="Equation here!!"
							ref={inputRefFunction}
            />

						<div className="splitWrapperInput">
							<div style={{ marginRight: 10, width: "100%" }}>
								<label className="functionLabel2">Initial Value</label>
								<input
									type="text"
									value={formatMathExpression(initialValue)}
									onChange={(e) => setInitialValue(e.target.value)}
									className="innerWindowSplitLeftFunctionWrapperInputSmaller"
									placeholder="Initial Value"
								/>
							</div>

							<div style={{ marginLeft: 10, width: "100%" }}>
								<label className="functionLabel2">Step Size</label>
								<input
									type="text"
									value={formatMathExpression(stepSize)}
									onChange={(e) => setStepSize(e.target.value)}
									className="innerWindowSplitLeftFunctionWrapperInputSmaller"
									placeholder="Step Size"
								/>
							</div>
						</div>

						<div className="splitWrapperInput">
							<div style={{ marginRight: 10, width: "100%" }}>
								<label className="functionLabel2">Tolerance</label>
								<input
									type="text"
									value={formatMathExpression(tolerance)}
									onChange={(e) => setTolerance(e.target.value)}
									className="innerWindowSplitLeftFunctionWrapperInputSmaller"
									placeholder="Tolerance Value"
								/>
							</div>

							<div style={{ marginLeft: 10, width: "100%" }}>
								<label className="functionLabel2">N* Iterations</label>
								<input
									type="text"
									value={formatMathExpression(maxIterations)}
									onChange={(e) => setMaxIterations(e.target.value)}
									className="innerWindowSplitLeftFunctionWrapperInputSmaller"
									placeholder="Maximum Iterations"
                  maxLength={12}
								/>
							</div>
						</div>

          </div>
          <div className="innerWindowSplitLeftButtons">
            <div className="eachIndButton" onClick={() => handleButtonClick('*')}>
              <svg className="iconButtonsBasics" fill="#C3F0F2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </div>
            <div className="eachIndButton" onClick={() => handleButtonClick('+')}>
              <svg className="iconButtonsBasics" fill="#C3F0F2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
              </svg>
            </div>
            <div className="eachIndButton" onClick={() => handleButtonClick('-')}>
              <svg className="iconButtonsBasics" fill="#C3F0F2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
              </svg>
            </div>
            <div className="eachIndButton" onClick={() => handleButtonClick('/')}>
              <svg className="iconButtonsBasics" fill="#C3F0F2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M272 96a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 320a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM400 288c17.7 0 32-14.3 32-32s-14.3-32-32-32H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H400z" />
              </svg>
            </div>

            <div className="eachIndButtonSplitHalfSeparate">
              <div className="eachIndButtonSplitHalf" onClick={() => handleButtonClick('^')}>
                <svg className="iconButtonsBasics" style={{ fill: "#C3F0F2" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M480 32c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16c-15.8 7.9-22.2 27.1-14.3 42.9C393 73.5 404.3 80 416 80v80c-17.7 0-32 14.3-32 32s14.3 32 32 32h32 32c17.7 0 32-14.3 32-32s-14.3-32-32-32V32zM32 64C14.3 64 0 78.3 0 96s14.3 32 32 32H47.3l89.6 128L47.3 384H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H64c10.4 0 20.2-5.1 26.2-13.6L176 311.8l85.8 122.6c6 8.6 15.8 13.6 26.2 13.6h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H304.7L215.1 256l89.6-128H320c17.7 0 32-14.3 32-32s-14.3-32-32-32H288c-10.4 0-20.2 5.1-26.2 13.6L176 200.2 90.2 77.6C84.2 69.1 74.4 64 64 64H32z" />
                </svg>
              </div>
              <div className="eachIndButtonSplitHalf" onClick={() => handleButtonClick('sin()')}>
								<div className="textInsideButtons">sin(x)</div>
              </div>
            </div>
            <div className="eachIndButtonSplitHalfSeparate">
              <div className="eachIndButtonSplitHalf" onClick={() => handleButtonClick('cos()')}>
								<div className="textInsideButtons">cos(x)</div>
              </div>
              <div className="eachIndButtonSplitHalf" onClick={() => handleButtonClick('exp()')}>
								<div className="textInsideButtons">exp(x)</div>
              </div>
            </div>
            <div className="eachIndButtonSplitHalfSeparate">
              <div className="eachIndButtonSplitHalf"  onClick={() => handleButtonClick('tan()')}>
								<div className="textInsideButtons">tan(x)</div>
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

            <div className="eachIndButtonEqual" style={{ backgroundColor: "#0AD1DC", opacity: equalButton === undefined || !equalButton ? 0.5 : 1}} disabled={equalButton === undefined || !equalButton} onClick={() => equalButtonClick()}>
              <div style={{ width: "80%", height: "80%", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "poppins", fontWeight: 600, color: "#00484C" }}>For larger computations</div>
            </div>
          </div>
        </div>
        <div className="innerWindowSplitRight">
          <div className="innerWindowSplitRightTop">
            <label className="resultLabel">Result</label>
            {/* gradial descent using all variables */}
              {!equalButton && !loadingAnimation && <div className="resultText">{result}</div>}
              {showResult && !loadingAnimation && <div className="resultText">{result}</div>}
              {loadingAnimation && <div className="loadingAnimation">loading</div>}
            </div>
            {/* <label className="resultLabel">Result2</label>
            <div >{evaluateExpression(currentInputValue)}</div> */}
          <div className="innerWindowSplitRightMiddle">
    
          </div>
  				<div className="innerWindowSplitRightBottom" onClick={() => setBigGraph(!bigGraph)}>
						<D3Chart functionInput={currentInputValue} />
          </div>
					{bigGraph && (
						<div className="modalGraphContainer">
							<div className="modalGraph" onClick={() => setBigGraph(!bigGraph)}>
								<D3Chart functionInput={currentInputValue} />
							</div>
							<div className="modalGraphOverlay"></div>
						</div>
					)}
        </div>
      </div>
    </div>
  );
}
export default App;