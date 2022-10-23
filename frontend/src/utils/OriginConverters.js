import * as Constants from '../constants';

export const toFlowPoints = ({ x, y }) => {
  return {
    x: Constants.graph_width / 2 + x,
    y: Constants.graph_height / 2 - y,
  };
};
