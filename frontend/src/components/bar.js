import React from 'react';
import { select, event } from 'd3-selection';
import { transition } from 'd3-transition';

class Bar extends React.Component {
  constructor() {
    super();
    this.ref = React.createRef();
  }
  componentDidMount() {
    this.init();
  }
  componentDidUpdate() {}
  init() {
    const { xScale, yScale, data, height } = this.props;
    const node = this.ref.current;

    // prepare initial data from where transition starts.
    const initialData = data.map((obj) => ({
      name: obj[0],
      value: obj[3],
    }));

    // prepare the field
    const bar = select(node).selectAll('.bar').data(initialData);

    // add rect to svg
    bar
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d[1]))
      .attr('y', height)
      .attr('width', xScale.bandwidth());
  }
  render() {
    return <g className='bar-group' ref={this.ref} />;
  }
}

export default Bar;
