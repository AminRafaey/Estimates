import config from '../../config.json';
import { default as axiosConfig } from '../AxiosConfig';
import axios from 'axios';
const endPointApi = `${config.baseUrl}api/estimates/estimate_image`;
import { fileChecksum } from '../../components/ImageUpload/utility';
import Toast from '../../components/Toast';

async function createPresignedUrl(sessionDispatch, file, byte_size, checksum) {
  const res = await axiosConfig(
    sessionDispatch,
    endPointApi + '/image_upload_url',
    'post',
    {
      file: {
        filename: file.name,
        byte_size: byte_size,
        checksum: checksum,
        content_type: file.type,
        metadata: {
          message: 'Image for uploading on S3',
        },
      },
    }
  );
  if (!res) {
    throw 'Error';
  }
  return res;
}

export async function uploadImage(sessionDispatch, image, currentLen) {
  try {
    const checksum = await fileChecksum(image);
    const presignedFileParams = await createPresignedUrl(
      sessionDispatch,
      image,
      image.size,
      checksum
    );
    delete axios.defaults.headers.common['Authorization'];
    const awsRes = await axios.put(
      presignedFileParams.direct_upload.url,
      image,
      {
        headers: presignedFileParams.direct_upload.headers,
      }
    );

    const saveImageRes = await saveImage(sessionDispatch, {
      imageName: image.name,
      imageType: image.type,
      imageUrl: presignedFileParams.public_url,
    });
    return { currentLen, image: saveImageRes };
  } catch (err) {
    Toast('', 'S3: Server Error!', 'error');
    throw { currentLen };
  }
}

export async function saveImage(sessionDispatch, data) {
  const res = await axiosConfig(sessionDispatch, endPointApi, 'post', {
    estimate_id: window.localStorage.getItem('ESTIMATE_ID'),
    image_url: data.imageUrl,
    image_type: data.imageType,
    image_name: data.imageName,
  });
  if (!res) {
    throw 'Error';
  }
  return res;
}

export async function getImages(sessionDispatch) {
  return await axiosConfig(sessionDispatch, endPointApi, 'get').then((res) =>
    res ? res : []
  );
}

export async function deleteImage(sessionDispatch, image) {
  return await axiosConfig(
    sessionDispatch,
    `${endPointApi}/${image.id}?key=${image.image_url
      .split('estimates')[1]
      .replace('/', '')}`,
    'delete'
  ).then((res) => res);
}
