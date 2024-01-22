import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { evaluate } from 'mathjs';
import "./Graph.css";

const D3Chart = ({ functionInput = 'x^2' }) => {
    const ref = useRef();


    useEffect(() => {
        const drawChart = (func) => {
            if (ref.current) {
                const computedStyle = getComputedStyle(ref.current);
                const width = parseInt(computedStyle.width, 10) - 80; 
                const height = parseInt(computedStyle.height, 10) - 60; 
                const margin = { top: 20, right: 30, bottom: 30, left: 40 };

                d3.select(ref.current).select("svg").remove();

                const svg = d3.select(ref.current).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

                const domain = [-10, 10];
                const range = func(Math.max(...domain)) > 10 ? [-10, func(Math.max(...domain))] : [-10, 10];
                const x = d3.scaleLinear().domain(domain).range([0, width]);
                const y = d3.scaleLinear().domain(range).range([height, 0]);

                svg.append("g")
                    .attr("transform", `translate(0,${height})`)
                    .attr("class", "Xaxis")
                    .call(d3.axisBottom(x));

                svg.append("g")
                .attr("class", "Yaxis")
                .call(d3.axisLeft(y));

    

                const data = [];
                for (let i = domain[0]; i <= domain[1]; i += 0.1) {
                    let yValue = func(i);
                    // Handling very large values
                    yValue = yValue > range[1] ? range[1] : yValue;
                    data.push({ x: i, y: yValue });
                }

                svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", "#77A4A6")
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(d => x(d.x))
                        .y(d => y(d.y))
                    );
            }
        };


        const regex = /\(\s*\)/g;
        const nonEmptyParenthesesRegex = /\([^()]*\)/g;
        const lastChar = functionInput[functionInput.length - 1];

        if (!functionInput.includes("(")) {
                
            if (lastChar === ' ') {
                functionInput = '1';
            } else if (regex.test(functionInput)) {

                functionInput = '2';
            
            } else if (isNaN(lastChar) && lastChar !== ')') {
                functionInput = '4';

            } else {
                functionInput = functionInput;
            }
        } else {
            if (lastChar === ' ') {
                functionInput = '5';
            } else if (regex.test(functionInput)) {
                functionInput = '6';
            } else if (!nonEmptyParenthesesRegex.test(functionInput)) {
                functionInput = '7';
            } else if (isNaN(lastChar) && lastChar !== ')') {
                functionInput = '8';
            } else {
                functionInput = functionInput;
            }
        }


        let openParenthesisCount = 0;
		let closeParenthesisCount = 0;
		for (let i = 0; i < functionInput.length; i++) {
			if (functionInput[i] === '(') {
				openParenthesisCount++;
			}
			if (functionInput[i] === ')') {
				closeParenthesisCount++;
			}
		}
		if (openParenthesisCount !== closeParenthesisCount) {
			functionInput = '1';
		}


        if (functionInput.includes('sin')) {
            functionInput = functionInput.replace('sin', 'sin');
        }
        if (functionInput.includes('cos')) {
            functionInput = functionInput.replace('cos', 'cos');
        }
        if (functionInput.includes('exp')) {
            functionInput = functionInput.replace("exp", 'exp');
        }

        console.log("functionInput", functionInput);

        let evaluatedFunction;

        try {
            evaluatedFunction = (x) => evaluate(functionInput, { x });
        } catch (error) {
            console.error('Error in function evaluation:', error.message);
            evaluatedFunction = () => 0;
        }

        drawChart(evaluatedFunction);

    }, [functionInput]);

    return <div className="my-dataviz-container" ref={ref} />;
};

export default D3Chart;
