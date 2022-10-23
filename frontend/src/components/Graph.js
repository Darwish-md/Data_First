import { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

export const Graph = () => {
  const svgRef = useRef();

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = d3
    .select(svgRef.current)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  d3.json(
    'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json',
    function (data) {
      // Initialize the links
      var link = svg
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .style('stroke', '#aaa');

      // Initialize the nodes
      var node = svg
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('r', 20)
        .style('fill', '#69b3a2');

      // Let's list the force we wanna apply on the network
      var simulation = d3
        .forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
        .force(
          'link',
          d3
            .forceLink() // This force provides links between nodes
            .id(function (d) {
              return d.id;
            }) // This provide  the id of a node
            .links(data.links) // and this the list of links
        )
        .force('charge', d3.forceManyBody().strength(-400)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force('center', d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
        .on('end', ticked);

      // This function is run at each iteration of the force algorithm, updating the nodes position.
      function ticked() {
        link
          .attr('x1', function (d) {
            return d.source.x;
          })
          .attr('y1', function (d) {
            return d.source.y;
          })
          .attr('x2', function (d) {
            return d.target.x;
          })
          .attr('y2', function (d) {
            return d.target.y;
          });

        node
          .attr('cx', function (d) {
            return d.x + 6;
          })
          .attr('cy', function (d) {
            return d.y - 6;
          });
      }
    }
  );
  return (
    <div className='App'>
      <header className='App-header'>
        <svg id='chart' ref={svgRef} viewBox='0 0 500 150'>
          <path d='' fill='none' stroke='white' strokeWidth='5' />
        </svg>
        <p>
          <button type='button'>Click to refresh expenses data</button>
        </p>
      </header>
    </div>
  );
};
// export function Graph() {
//  1] Setup Initial data and settings ------------//
//   const treeData = {
//     name: 'parent',
//     value: 5,
//     children: [
//       { name: 'child_1', value: 10 },
//       { name: 'child_2', value: 15 },
//       { name: 'child_3', value: 20 },
//     ],
//   };

//   const width = 500;
//   const height = 150;
//   const padding = 20;
//   const maxValue = 20; // Maximum data value

//   const [chartdata, setChartdata] = useState(initialData);

//   const svgRef = useRef();

//   //  2] Setup random data generator and SVG canvas -//
//   const newData = () =>
//     chartdata.map(function (d) {
//       d.value = Math.floor(Math.random() * (maxValue + 1));
//       return d;
//     });

//   useEffect(() => {
//     //  3] Setup functions for Scales ------------------//

//     //xscales
//     const xScale = d3
//       .scalePoint()
//       .domain(chartdata.map((d) => d.name))
//       .range([0 + padding, width - padding]);
//     console.log('Start - End', xScale('Car'), xScale('Cinema'));

//     //Yscales
//     const yScale = d3
//       .scaleLinear()
//       .domain([
//         0,
//         d3.max(chartdata, function (d) {
//           return d.value;
//         }),
//       ])
//       .range([height - padding, 0 + padding]);

//     console.log('Start - End', yScale(0), yScale(10));

//     //  4] Setup functions to draw Lines ---------------//

//     const line = d3
//       .line()
//       .x((d) => xScale(d.name))
//       .y((d) => yScale(d.value))
//       .curve(d3.curveMonotoneX);

//     console.log('chart draw commands', line(chartdata));

//     //  5] Draw line        ---------------------------//
//     d3.select(svgRef.current)
//       .select('path')
//       .attr('d', (value) => line(chartdata))
//       .attr('fill', 'none')
//       .attr('stroke', 'white');

//     //  6] Setup functions to draw X and Y Axes --------//
//     const xAxis = d3.axisBottom(xScale);
//     const yAxis = d3.axisLeft(yScale);

//     //  7] Draw x and y Axes   -------------------------//
//     d3.select('#xaxis').remove();
//     d3.select(svgRef.current)
//       .append('g')
//       .attr('transform', `translate(0,${height - padding})`)
//       .attr('id', 'xaxis')
//       .call(xAxis);

//     d3.select('#yaxis').remove();
//     d3.select(svgRef.current)
//       .append('g')
//       .attr('transform', `translate(${padding},0)`)
//       .attr('id', 'yaxis')
//       .call(yAxis);
//   }, [chartdata]);

//   return (
//   );
// }

// import React, { useState, useEffect, useCallback } from 'react';
// import ReactFlow, {
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   MiniMap,
//   Controls,
// } from 'reactflow';
// import 'reactflow/dist/style.css';

// import './index.css';

// const initBgColor = '#1A192B';

// const connectionLineStyle = { stroke: '#fff' };
// const snapGrid = [20, 20];

// const CustomNodeFlow = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [bgColor, setBgColor] = useState(initBgColor);

//   useEffect(() => {
//     const onChange = (event) => {
//       setNodes((nds) =>
//         nds.map((node) => {
//           if (node.id !== '2') {
//             return node;
//           }

//           const color = event.target.value;

//           setBgColor(color);

//           return {
//             ...node,
//             data: {
//               ...node.data,
//               color,
//             },
//           };
//         })
//       );
//     };

//     setNodes([
//       {
//         id: '1',
//         type: 'input',
//         data: { label: 'An input node' },
//         position: { x: 0, y: 50 },
//         sourcePosition: 'right',
//       },
//       {
//         id: '2',
//         type: 'selectorNode',
//         data: { onChange: onChange, color: initBgColor },
//         style: { border: '1px solid #777', padding: 10 },
//         position: { x: 300, y: 50 },
//       },
//       {
//         id: '3',
//         type: 'output',
//         data: { label: 'Output A' },
//         position: { x: 650, y: 25 },
//         targetPosition: 'left',
//       },
//       {
//         id: '4',
//         type: 'output',
//         data: { label: 'Output B' },
//         position: { x: 650, y: 100 },
//         targetPosition: 'left',
//       },
//     ]);

//     setEdges([
//       {
//         id: 'e1-2',
//         source: '1',
//         target: '2',
//         animated: true,
//         style: { stroke: '#fff' },
//       },
//       {
//         id: 'e2a-3',
//         source: '2',
//         target: '3',
//         sourceHandle: 'a',
//         animated: true,
//         style: { stroke: '#fff' },
//       },
//       {
//         id: 'e2b-4',
//         source: '2',
//         target: '4',
//         sourceHandle: 'b',
//         animated: true,
//         style: { stroke: '#fff' },
//       },
//     ]);
//   }, []);

//   const onConnect = useCallback(
//     (params) =>
//       setEdges((eds) =>
//         addEdge({ ...params, animated: true, style: { stroke: '#fff' } }, eds)
//       ),
//     []
//   );
//   return (
//     <ReactFlow
//       nodes={nodes}
//       edges={edges}
//       onNodesChange={onNodesChange}
//       onEdgesChange={onEdgesChange}
//       onConnect={onConnect}
//       style={{ background: bgColor }}
//       nodeTypes={nodeTypes}
//       connectionLineStyle={connectionLineStyle}
//       snapToGrid={true}
//       snapGrid={snapGrid}
//       defaultZoom={1.5}
//       fitView
//       attributionPosition='bottom-left'
//     >
//       <MiniMap
//         nodeStrokeColor={(n) => {
//           if (n.type === 'input') return '#0041d0';
//           if (n.type === 'selectorNode') return bgColor;
//           if (n.type === 'output') return '#ff0072';
//         }}
//         nodeColor={(n) => {
//           if (n.type === 'selectorNode') return bgColor;
//           return '#fff';
//         }}
//       />
//       <Controls />
//     </ReactFlow>
//   );
// };

// export default CustomNodeFlow;
