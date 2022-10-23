import axios from 'axios';
import * as Constants from '../constants';

export const getYearlyData = () => {
  const request = axios.get(Constants.YEARLY_URL);
  return request.then((response) => response.data);
};
