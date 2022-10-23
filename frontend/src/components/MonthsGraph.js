import React, { useState, MouseEvent } from 'react';

import ReactDOM from 'react-dom';

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  OnLoadParams,
  FlowElement,
  EdgeTypesType,
  //Elements,
  Connection,
  Edge,
  ArrowHeadType,
  Node,
} from 'react-flow-renderer';

const onLoad = (reactFlowInstance) => reactFlowInstance.fitView();
const onNodeDragStop = (_, node) => console.log('drag stop', node);
const onElementClick = (_, element) => console.log('click', element);
