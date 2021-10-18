import config from '../../config.json';
import { default as axios } from '../AxiosConfig';
const endPointApi = `${config.baseUrl}api/estimates/rooms`;

export async function getRooms(sessionDispatch) {
  return axios(sessionDispatch, endPointApi, 'get').then((res) =>
    res ? res : {}
  );
}

export async function saveRoomContext(sessionDispatch, estimateRooms) {
  return axios(
    sessionDispatch,
    `${config.baseUrl}api/estimates/rooms/save_room_context`,
    'post',
    { room_groups: estimateRooms }
  ).then((res) => (res ? res : {}));
}
