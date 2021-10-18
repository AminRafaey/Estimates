import config from '../../config.json';
import { default as axios } from '../AxiosConfig';
const endPointApi = `${config.baseUrl}api/estimates/actions`;

export async function getActions(sessionDispatch) {
  return axios(
    sessionDispatch,
    endPointApi + '/fetch_actions_at_the_go',
    'get'
  ).then((res) => (res ? res : []));
}

export async function saveSurfaceProductionRate(
  sessionDispatch,
  productionRates
) {
  return axios(
    sessionDispatch,
    endPointApi + '/save_surface_production_rate',
    'post',
    { surface_production_rates: productionRates }
  ).then((res) => res);
}
