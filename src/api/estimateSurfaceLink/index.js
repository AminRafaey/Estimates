import config from '../../config.json';
import { default as axios } from '../AxiosConfig';
const endPointApi = `${config.baseUrl}api/estimates/surfaces/surfaces_with_surface_fields`;
const endPointApiForMylinks = `${config.baseUrl}api/estimates/surface_links/index`;
const endPointApiForEdit = `${config.baseUrl}api/estimates/surface_links/save`;
const endPointApiForDelete = `${config.baseUrl}api/estimates/surface_links/delete?id=`;

export async function getSurfaceMyLinks(sessionDispatch) {
  return axios(sessionDispatch, endPointApiForMylinks, 'get').then((res) =>
    res ? res : {}
  );
}

export async function getSurfaceLinks(sessionDispatch) {
  return axios(sessionDispatch, endPointApi, 'get').then((res) =>
    res ? res : {}
  );
}

export async function editSurfaceLinks(sessionDispatch, data) {
  return axios(sessionDispatch, endPointApiForEdit, 'post', data).then((res) =>
    res ? res : {}
  );
}

export async function deleteSurfaceLinks(sessionDispatch, data) {
  return axios(
    sessionDispatch,
    endPointApiForDelete + data,
    'delete'
  ).then((res) => (res ? res : {}));
}
