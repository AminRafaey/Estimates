import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '../../UI';
import { useSessionDispatch } from '../../../Context/Session';
import { deleteImage } from '../../../api/gallery';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import {
  Card,
  CardMedia,
  styled,
  Box,
  Typography,
  CircularProgress,
} from '@material-ui/core';

const NameWrapper = styled(Box)({
  marginLeft: 24,
});
const NameTyp = styled(Typography)({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  paddingTop: 8,
  paddingLeft: 2,
});
const LoadingWrapper = styled(Box)({
  position: 'absolute',
  left: '42%',
  top: '50%',
});

const DeleteIconWrapper = styled(Box)({
  position: 'absolute',
  right: '2%',
  top: '2%',
  '&:hover': {
    cursor: 'pointer',
  },
});

const IconBgWrapper = styled(Box)({
  width: 28,
  height: 28,
  background: 'black',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 5,
});

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 80,
    marginLeft: 24,
    position: 'relative',
  },
  media: {
    paddingTop: '56.25%',
  },
}));

export default function Tile(props) {
  const { file, mediaHeight, setImageFiles } = props;
  const [mouseHover, setMouseHover] = useState(false);
  const sessionDispatch = useSessionDispatch();

  const classes = useStyles();

  useEffect(() => {
    mouseHover && setMouseHover(false);
  }, [file.uploading]);

  const handleDelete = () => {
    setImageFiles((prevState) =>
      prevState.map((p) => (p.id == file.id ? { ...p, uploading: true } : p))
    );
    !file.uploading &&
      deleteImage(sessionDispatch, file).then((res) => {
        res && res.success
          ? setImageFiles((prevState) =>
              prevState.filter((p) => p.id !== file.id)
            )
          : setImageFiles((prevState) =>
              prevState.map((p) =>
                p.id == file.id ? { ...p, uploading: false } : p
              )
            );
      });
  };
  return (
    <>
      <Card
        className={classes.root}
        onMouseEnter={() => !file.uploading && setMouseHover(true)}
        onMouseLeave={() => setMouseHover(false)}
      >
        <CardMedia
          style={{
            height: mediaHeight,
            ...(file.uploading && { opacity: 0.5 }),
          }}
          className={classes.media}
          {...(file.id
            ? { image: file.image_url, title: file.image_name }
            : { image: URL.createObjectURL(file), title: file.name })}
        />
        {file.uploading && (
          <LoadingWrapper>
            <CircularProgress color="primary" size={28} />
          </LoadingWrapper>
        )}
        {mouseHover && (
          <DeleteIconWrapper onClick={handleDelete}>
            <IconBgWrapper>
              <CloseRoundedIcon style={{ color: '#ffff' }} />
            </IconBgWrapper>
          </DeleteIconWrapper>
        )}
      </Card>
      <NameWrapper>
        <Tooltip title={file.id ? file.image_name : file.name}>
          <NameTyp>{file.id ? file.image_name : file.name}</NameTyp>
        </Tooltip>
      </NameWrapper>
    </>
  );
}
