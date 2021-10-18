import config from '../../config.json';
import { default as axios } from '../AxiosConfig';
const endPointApi = `${config.baseUrl}api/estimates/surfaces`;

export async function getRooms(sessionDispatch) {
  return axios(sessionDispatch, endPointApi, 'get').then((res) =>
    res ? res : {}
  );
}

export async function getSurfaces(sessionDispatch) {
  return axios(sessionDispatch, endPointApi, 'get').then((res) =>
    res ? res : []
  );
}

export async function getSurfaceProductionRates(sessionDispatch, surfaceIds) {
  return axios(
    sessionDispatch,
    `${endPointApi}/details?ids=[${surfaceIds}]`,
    'get'
  ).then((res) => (res ? res : {}));
}

export async function saveSurfaceContext(sessionDispatch, surfaces) {
  return axios(
    sessionDispatch,
    `${config.baseUrl}api/estimates/surfaces/save_surfaces_context`,
    'post',
    { surfaces: surfaces }
  ).then((res) => (res ? res : []));
}

export async function saveSurfaceAtTheGo(sessionDispatch, surface) {
  return axios(
    sessionDispatch,
    `${config.baseUrl}api/estimates/surfaces/save_surface_at_the_go`,
    'post',
    surface
  ).then((res) => (res ? res : []));
}
