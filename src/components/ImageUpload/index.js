import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import Header from './Header';
import Tile from './Tile';
import SingleFileDropZone from './SingleFileDropZone';
import { Box, CircularProgress, Grid } from '@material-ui/core';
import { styled } from '@material-ui/styles';
import { useSessionState, useSessionDispatch } from '../../Context/Session';
import {
  getEstimate,
  createNewEstimate,
  getAllEstimates,
} from '../../api/estimate';
import { getImages } from '../../api/gallery';

const ImageUploadWrapper = styled(Box)({
  paddingRight: 80,
  paddingLeft: 56,
  paddingBottom: 80,
});

const LoadingWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '50vh',
});

function ImageUpload() {
  const search = useLocation().search;
  const estimate_id = new URLSearchParams(search).get('estimate_id');
  const newEstimate = new URLSearchParams(search).get('newEstimate');
  const job_id = new URLSearchParams(search).get('job_id');

  const [imageFiles, setImageFiles] = useState([]);
  const [mediaHeight, setMediaHeight] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [imagesFilterLoader, setImagesFilterLoader] = useState(false);
  const [loader, setLoader] = useState(true);
  const [getImageLoader, setGetImageLoader] = useState(true);
  const [getEstimatesLoader, setGetEstimatesLoader] = useState(true);
  const [estimates, setEstimates] = useState([]);
  const sessionState = useSessionState();
  const sessionDispatch = useSessionDispatch();
  const token = new URLSearchParams(search).get('token');
  const [selected, setSelected] = React.useState(null);
  const currentJob = useRef(null);
  token &&
    window.localStorage.getItem('AUTH_TOKEN') !== token &&
    window.localStorage.setItem('AUTH_TOKEN', token);
  useLayoutEffect(() => {
    mediaHeight === 0 &&
      document.getElementsByClassName('SingleImageUploader')[0] &&
      setMediaHeight(
        document.getElementsByClassName('SingleImageUploader')[0].parentElement
          .clientWidth - 26
      );
  }, [loader]);

  useEffect(() => {
    if (estimate_id) {
      window.localStorage.setItem('ESTIMATE_ID', estimate_id);
    }
    if (window.localStorage.getItem('ESTIMATE_ID') && !newEstimate) {
      getEstimate(sessionDispatch).then((res) => {
        if (res) {
          setLoader(false);
          currentJob.current = res.contact;
        } else {
          createNewEstimate(sessionDispatch).then((res) => {
            res && (currentJob.current = res.contact);
            res && setLoader(false);
          });
        }
      });
    } else {
      createNewEstimate(sessionDispatch, job_id).then((res) => {
        res && (currentJob.current = res.contact);
        res && setLoader(false);
      });
    }
  }, [sessionState.expired]);

  useEffect(() => {
    if (window.localStorage.getItem('ESTIMATE_ID') && !getEstimatesLoader) {
      getImages(sessionDispatch).then((res) => {
        setGetImageLoader(false);
        res && setImageFiles(res);
      });
      !estimates.find(
        (e) => e.id == window.localStorage.getItem('ESTIMATE_ID')
      ) &&
        setEstimates([
          ...estimates,
          {
            id: window.localStorage.getItem('ESTIMATE_ID'),
            title: `${window.localStorage.getItem('ESTIMATE_ID')}: ${
              currentJob.current.first_name
            } ${currentJob.current.last_name}`,
          },
        ]);
    }
  }, [getEstimatesLoader]);

  useEffect(() => {
    if (
      window.localStorage.getItem('ESTIMATE_ID') &&
      selected &&
      selected.id != window.localStorage.getItem('ESTIMATE_ID')
    ) {
      window.localStorage.setItem('ESTIMATE_ID', selected.id);
      setGetImageLoader(true);
      getImages(sessionDispatch).then((res) => {
        setGetImageLoader(false);
        res && setImageFiles(res);
      });
    }
  }, [selected]);

  useEffect(() => {
    if (getEstimatesLoader && !loader) {
      getAllEstimates(sessionDispatch).then((res) => {
        setEstimates(
          res.map((r) => ({ ...r, title: `${r.id}: ${r.contactName}` }))
        );
        setGetEstimatesLoader(false);
      });
    }
  }, [loader, sessionState.expired]);

  useEffect(() => {
    setImagesFilterLoader(true);
    setTimeout(() => setImagesFilterLoader(false), 2000);
  }, [searchValue]);

  return (
    <div>
      <Header
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        estimates={estimates}
        getEstimatesLoader={getEstimatesLoader}
        selected={selected}
        setSelected={setSelected}
      />
      <ImageUploadWrapper>
        {imagesFilterLoader ? (
          <LoadingWrapper>
            <CircularProgress color="primary" />
          </LoadingWrapper>
        ) : (
          <Grid container>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              {' '}
              <SingleFileDropZone
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                mediaHeight={mediaHeight}
              />
            </Grid>
            {loader || getImageLoader || getEstimatesLoader ? (
              <Grid item xs={12} sm={false} md={7} lg={8}>
                <LoadingWrapper style={{ minHeight: '100vh' }}>
                  <CircularProgress color="primary" />
                </LoadingWrapper>
              </Grid>
            ) : (
              <>
                {imageFiles
                  .filter((file) =>
                    searchValue
                      ? (file.image_name ? file.image_name : file.name)
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      : true
                  )
                  .map((file, index) => (
                    <Grid item xs={12} sm={6} md={3} lg={2} key={index}>
                      <Tile
                        file={file}
                        mediaHeight={mediaHeight}
                        setImageFiles={setImageFiles}
                      />
                    </Grid>
                  ))}
              </>
            )}
          </Grid>
        )}
      </ImageUploadWrapper>
    </div>
  );
}
export default ImageUpload;
