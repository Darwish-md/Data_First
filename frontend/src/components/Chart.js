import React, { Component } from 'react';
import { render } from 'react-dom';
import { scaleBand, scaleLinear } from 'd3-scale';
import XYAxis from '../components/xy-axis';
import Grid from '../components/grid';
import Bar from '../components/bar';
import * as utils from '../utils/d3Utils';
import { transition } from 'd3-transition';
import * as d3 from 'd3';

export const Chart = ({ data }) => {
  const parentWidth = 1000;
  const margin = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 40,
  };
  const ticks = 6;
  const t = transition().duration(1000);

  const width = parentWidth - margin.left - margin.right;
  const height = parentWidth * 0.5 - margin.top - margin.bottom;

  const xScale = scaleBand()
    .domain(data.map((d) => d[0]))
    .range([0, width]);

  const yScale = scaleLinear()
    .domain([
      0,
      Math.max(
        ...data.map((d) => {
          return d[3];
        })
      ),
    ])
    .range([height, 0])
    .nice();
  console.log(xScale);
  console.log(yScale);

  return (
    <div>
      <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <XYAxis {...{ xScale, yScale, height, ticks, t }} />
          <Grid {...{ xScale, yScale, width, ticks, t }} />
          <Bar
            {...{
              xScale,
              yScale,
              data,
              height,
              t,
            }}
          />
        </g>
      </svg>
    </div>
  );
};
