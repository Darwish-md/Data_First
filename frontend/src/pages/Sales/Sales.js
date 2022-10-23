// ! sales page has :
// * Upper levet container component
// * Menu component
// * graph component
// * charts component

import React from 'react';
import { useState, useEffect } from 'react';
import * as Constants from '../../constants';
import * as utils from '../../utils/JSONConverters';
import { Graph } from '../../components/Graph';
import { Chart } from '../../components/Chart';

function Sales(props) {
  console.log(props.data[0]);
  const data = props.data;
  const years = [2021];
  const clickedYear = 2021;
  const yearsElements = utils.generateElementsForYears(years);
  const [elementsToShow, setElementsToShow] = useState(yearsElements);

  const yearNodeClickHandler = (e) => {
    const monthElements = utils.generateElementsFromForMonths();
    // TODO try to get node label instead of clickedYear
    // TODO visualize the months
  };
  const monthNodeClickHandler = (e) => {
    const productsElements = utils.generateElementFromProductArray();
    // TODO visualize the products
  };
  const productNodeClickHandler = (e) => {};
  return (
    <>
      <Chart
        data={data}
        type='years'
        elements={elementsToShow}
        clickHandler={yearNodeClickHandler}
      ></Chart>
    </>
  );
}

export default Sales;
