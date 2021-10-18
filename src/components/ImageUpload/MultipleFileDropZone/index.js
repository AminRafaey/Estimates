import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button } from '@material-ui/core';
import { styled, withStyles } from '@material-ui/styles';
import { uploadImage } from '../../../api/gallery';
import { useSessionDispatch } from '../../../Context/Session';
import { maxSizeValidator } from '../utility';
import Toast from '../../Toast';

const ImageUploadWrapper = styled(Box)({
  textAlign: 'center',
  padding: 20,
  borderBlock: '3px dashed #CCC',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  minHeight: 260,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledButton = withStyles({
  root: {
    textTransform: 'none',
    marginTop: 24,
  },
})(Button);

export default function MultipleFileDropZone(props) {
  const { imageFiles, setImageFiles, handleClose } = props;
  const sessionDispatch = useSessionDispatch();
  const [onDragEnterState, setOnDragEnterState] = useState(false);
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: 'image/*',
    onDragEnter: () => setOnDragEnterState(true),
    onDragLeave: () => setOnDragEnterState(false),
    onDrop: () => setOnDragEnterState(false),
    validator: maxSizeValidator,
  });

  useEffect(() => {
    if (acceptedFiles.length > 10) {
      handleClose();
      Toast(
        'Too-many-images',
        'Maximum 10 images can be uploaded at once',
        'error'
      );
      return;
    }
    if (acceptedFiles.length > 0) {
      handleClose();
      for (let c1 = 0; c1 < acceptedFiles.length; c1++) {
        acceptedFiles[c1]['uploading'] = true;
      }
      const currentLen = imageFiles.length + acceptedFiles.length;
      setImageFiles((prevState) => [...acceptedFiles, ...prevState]);
      (async function (currentLen) {
        for (let c1 = 0; c1 < acceptedFiles.length; c1++) {
          const image = acceptedFiles[c1];
          try {
            const res = await uploadImage(sessionDispatch, image, currentLen);
            setImageFiles((prevState) => {
              const newState = [...prevState];
              newState[newState.length - res.currentLen + c1] = {
                ...res.image,
              };
              return newState;
            });
          } catch (err) {
            setImageFiles((prevState) => {
              const newState = [...prevState];
              newState.splice(
                newState.length - err.currentLen + c1,
                newState.length - err.currentLen + c1 + 1
              );
              return newState;
            });
          }
        }
      })(currentLen);
    }
    if (fileRejections.length > 0) {
      handleClose();
      fileRejections.map((f) => {
        Toast(f.errors[0].code, f.errors[0].message, 'error');
      });
    }
  }, [acceptedFiles]);

  return (
    <ImageUploadWrapper
      {...getRootProps()}
      style={{
        ...(onDragEnterState && { borderColor: '#1488FC' }),
      }}
    >
      <input {...getInputProps()} accept="image/*" />
      {!onDragEnterState ? (
        <p>Drag 'n' drop some files here, or click to select files</p>
      ) : (
        <p>Drop to upload</p>
      )}
      <StyledButton variant="contained" color="primary">
        Browse files
      </StyledButton>
    </ImageUploadWrapper>
  );
}
