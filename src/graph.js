import React from 'react';
import * as d3 from 'd3';
import { evaluate } from 'mathjs';


const D3Chart = ({ functionInput = 'x^2' }) => {
    const domain = [-10, 10];
    const range = [0, 100];

    const lastChar = functionInput[functionInput.length - 1];
    if (isNaN(lastChar) || lastChar === ' ') {
        functionInput = '1';
    }


    let func;
    try {
        func = (x) => evaluate(functionInput, { x });
    } catch (error) {
        console.error('Error in function evaluation:', error.message);
        func = () => 0;
    }

    const drawChart = (func) => {
        d3.select("#my_dataviz").select("svg").remove();

        const margin = { top: 20, right: 30, bottom: 30, left: 40 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        const svg = d3.select("#my_dataviz").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().domain(domain).range([0, width]);
        const y = d3.scaleLinear().domain(range).range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        const data = [];
        for (let i = domain[0]; i <= domain[1]; i += 0.1) {
            data.push({ x: i, y: func(i) });
        }

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.x))
                .y(d => y(d.y))
            );
    };

    drawChart(func);

    return <div id="my_dataviz" />;


};

export default D3Chart;
