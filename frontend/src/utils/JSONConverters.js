import * as Constants from '../constants';
import * as utils from '../utils/OriginConverters';

let usedRandomXYs = [];

const getUniqueRandomPosition = () => {
  const getRandomDistance = () => Math.random() * 200;
  const assignRandomSign = (number) => {
    const sign = Math.round(Math.random()) * 2 - 1;
    return sign * number;
  };
  let x = 0;
  let y = 0;
  while (true) {
    x = assignRandomSign(getRandomDistance());
    y = assignRandomSign(getRandomDistance());
    if (!usedRandomXYs.includes({ x, y })) {
      break;
    }
  }
  return { x, y };
};

const getOriginElement = () => {
  const origin_element = {
    id: '0',
    data: {
      label: 'origin',
    },
    position: {
      x: Constants.graph_origin_x,
      y: Constants.graph_origin_y,
    },
  };
  return origin_element;
};

export const generateElementFromProductArray = (products) => {
  // {
  //     'profit': 123213
  //     'products':                 {
  //             "prodID": "prod_1".
  //             "cnt": 14
  //         },
  //         {
  //             "prodID": "prod_1".
  //             "cnt": 14
  //         },
  // }

  // ! endResult is {iproducstd: '1', data}
  // const elements = [
  // { id: "1", data: { label: "Parent" }, position: { x: 500, y: 150 } },
  // { id: "2", data: { label: "First child" }, position: { x: 400, y: 250 } },
  // { id: "e1-2", source: "1", target: "2", animated: true }

  const origin_id = '0';
  let elements = [getOriginElement()];
  let id = 1;
  for (let prod in products) {
    // * getting random x and y values for the position of the node
    const label = prod.prodID;

    // * putting the data in the node
    const element = {
      id: id.toString(),
      data: { label },
      position: utils.toFlowPoints(getUniqueRandomPosition()),
      style: Constants.NODE_STYLE,
    };
    const edgeFromOrigin = {
      id: 'e0-' + id,
      source: origin_id,
      target: element.id,
      animated: true,
      style: Constants.NODE_STYLE,
    };

    elements.push(element, edgeFromOrigin);

    id += 1;
  }

  return elements;
};

export const generateElementsFromForMonths = () => {
  // const elements = [
  // { id: "1", data: { label: "Parent" }, position: { x: 500, y: 150 } },
  // { id: "2", data: { label: "First child" }, position: { x: 400, y: 250 } },
  // { id: "e1-2", source: "1", target: "2", animated: true }

  const getMonthFromNumber = (n) => {
    const date = new Date();
    date.setMonth(n - 1);

    return date.toLocaleString('en-US', {
      month: 'long',
    });
  };
  const origin_id = '0';
  let elements = [getOriginElement()];
  for (let i = 1; i <= 12; i++) {
    const element = {
      id: i.toString(),
      data: {
        label: getMonthFromNumber(i),
      },
      position: utils.toFlowPoints(getUniqueRandomPosition()),
      style: Constants.NODE_STYLE,
    };
    const edgeFromOrigin = {
      id: 'e0-' + i,
      source: origin_id,
      target: element.id,
      animated: true,
      style: Constants.NODE_STYLE,
    };
    elements.push(element, edgeFromOrigin);
  }
  return elements;
};

export const generateElementsForYears = (years) => {
  // ! {"2021", "2022", "2023"}
  const origin_id = '0';
  let elements = [getOriginElement()];
  for (let i = 1; i <= years.length; i++) {
    const element = {
      id: i.toString(),
      data: {
        label: years[i - 1].toString(),
      },
      position: utils.toFlowPoints(getUniqueRandomPosition()),
      style: Constants.NODE_STYLE,
    };
    const edgeFromOrigin = {
      id: 'e0-' + i,
      source: origin_id,
      target: element.id,
      animated: true,
      style: Constants.NODE_STYLE,
    };
    elements.push(element, edgeFromOrigin);
  }
  return elements;
};
