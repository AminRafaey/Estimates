import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box } from '@material-ui/core';
import { styled } from '@material-ui/styles';
import { uploadImage } from '../../../api/gallery';
import { useSessionDispatch } from '../../../Context/Session';
import { maxSizeValidator } from '../utility';
import Toast from '../../Toast';
const ImageUploadWrapper = styled(Box)({
  textAlign: 'center',
  padding: 20,
  border: '3px dashed #eeeeee',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  marginTop: 80,
  marginLeft: 26,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    cursor: 'pointer',
    borderColor: '#1488FC',
  },
});

export default function SingleFileDropZone(props) {
  const { imageFiles, setImageFiles, mediaHeight } = props;
  const [onDragEnterState, setOnDragEnterState] = useState(false);
  const sessionDispatch = useSessionDispatch();
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    maxFiles: 1,
    multiple: false,
    accept: 'image/*',
    onDragEnter: () => setOnDragEnterState(true),
    onDragLeave: () => setOnDragEnterState(false),
    onDrop: () => setOnDragEnterState(false),
    validator: maxSizeValidator,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      acceptedFiles[0]['uploading'] = true;
      const currentLen = imageFiles.length + 1;
      setImageFiles((prevState) => [acceptedFiles[0], ...prevState]);
      uploadImage(sessionDispatch, acceptedFiles[0], currentLen)
        .then((res) => {
          setImageFiles((prevState) => {
            const newState = [...prevState];
            newState[newState.length - res.currentLen] = { ...res.image };
            return newState;
          });
        })
        .catch((err) => {
          setImageFiles((prevState) => {
            const newState = [...prevState];
            newState.splice(
              newState.length - err.currentLen,
              newState.length - err.currentLen + 1
            );
            return newState;
          });
        });
    }
    if (fileRejections.length > 0) {
      fileRejections.map((f) => {
        Toast(f.errors[0].code, f.errors[0].message, 'error');
      });
    }
  }, [acceptedFiles, fileRejections]);

  return (
    <ImageUploadWrapper
      style={{
        height: mediaHeight,
        ...(onDragEnterState && { borderColor: '#1488FC' }),
      }}
      {...getRootProps()}
      className="SingleImageUploader"
    >
      <input {...getInputProps()} accept="image/*" />
      {!onDragEnterState ? (
        <>
          <p>Drag 'n' drop image here, or click to select image</p>
          <em>(One file at once)</em>
        </>
      ) : (
        <p>Drop to upload</p>
      )}
    </ImageUploadWrapper>
  );
}
