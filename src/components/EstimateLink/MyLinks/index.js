import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Chip,
  styled,
  Box,
  Typography,
  TableRow,
  Table,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  withStyles,
  CircularProgress,
} from '@material-ui/core';
import { getSurfaceMyLinks } from '../../../api/estimateSurfaceLink';
import { deleteSurfaceLinks } from '../../../api/estimateSurfaceLink';
import { CopyIcon, DeleteIcon } from '../../../resources';
import { getAllLinksIdsOfGroup } from '../utility';
import { useSessionState, useSessionDispatch } from '../../../Context/Session';

const ActionWrapper = styled(Box)({
  display: 'flex',
  height: '100%',
});
const IconWrapper = styled(Box)({
  padding: '5px 5px 5px 0px',
  cursor: 'pointer',
});
const MyLinksWrapper = styled(Box)({
  maxWidth: '65vw',
  margin: 'auto',
  paddingTop: '70px',
});

const ChipWrapper = styled(Box)({
  display: 'inline',
  padding: '0px 4px',
});

const SurfaceNameTyp = styled(Typography)({
  fontSize: '15px',
  color: 'black',
  display: 'inline-block',
  fontFamily: 'Medium',
  paddingLeft: 4,
});

const SurfaceWrapper = styled(Box)({
  padding: '10px 0px',
});

const NoLinkToShow = styled(Typography)({
  textAlign: 'center',
  color: '#9a9a9d',
});

const LoadingWrapper = styled(Box)({
  minHeight: window.innerHeight - 270,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const StyledChip = withStyles({
  root: {
    height: 22,
    fontSize: 'fit-content',
  },
  label: {
    padding: '5px 10px',
    lineHeight: 1,
  },
})(Chip);
export default function MyLinks(props) {
  const { setFieldIds, setEditGroupId, setLinkPageOption } = props;
  const classes = useStyles();
  const [selectedLinkGroup, setSelectedLinkGroup] = useState(null);
  const [surfaceLinks, setSurfaceLinks] = useState(undefined);
  const sessionDispatch = useSessionDispatch();
  const sessionState = useSessionState();
  useEffect(() => {
    surfaceLinks !== undefined && setSurfaceLinks(undefined);
    getSurfaceMyLinks(sessionDispatch).then((res) => {
      setSurfaceLinks(res);
    });
  }, [sessionState.expired]);

  useEffect(() => {
    setFieldIds([]);
    setEditGroupId(null);
  }, []);

  const returnSelectionAccordian = (groupId, surfaceFields) => {
    return (
      <TableRow>
        <TableCell align="left">
          {surfaceLinks[groupId]['group_name']}
        </TableCell>
        <TableCell align="left">
          {Object.keys(surfaceFields).map((pKey) => (
            <SurfaceWrapper key={pKey}>
              <SurfaceNameTyp>
                {surfaceFields[pKey]['surface_name']}
              </SurfaceNameTyp>
              <React.Fragment>
                {Object.keys(surfaceFields[pKey]['fields']).map((fKey) => (
                  <ChipWrapper key={fKey}>
                    <StyledChip
                      label={surfaceFields[pKey]['fields'][fKey]['field_name']}
                    />
                  </ChipWrapper>
                ))}
              </React.Fragment>
            </SurfaceWrapper>
          ))}
        </TableCell>
        <TableCell align="left">
          {' '}
          <ActionWrapper>
            <IconWrapper
              onClick={() => {
                setFieldIds(getAllLinksIdsOfGroup(surfaceLinks, groupId));
                setEditGroupId(groupId);
                setLinkPageOption('newLink');
              }}
            >
              <CopyIcon />
            </IconWrapper>
            <IconWrapper
              onClick={() => {
                setSelectedLinkGroup(groupId);
                deleteSurfaceLinks(sessionDispatch, groupId).then(() => {
                  getSurfaceMyLinks()
                    .then((res) => {
                      setSurfaceLinks(res);
                    })
                    .catch((err) => alert(err));
                  setSelectedLinkGroup(null);
                });
              }}
            >
              {groupId == selectedLinkGroup ? (
                <CircularProgress color="primary" size={25} />
              ) : (
                <DeleteIcon />
              )}
            </IconWrapper>
          </ActionWrapper>
        </TableCell>
      </TableRow>
    );
  };

  if (surfaceLinks == undefined) {
    return (
      <LoadingWrapper>
        <CircularProgress color="primary" />
      </LoadingWrapper>
    );
  }

  return (
    <MyLinksWrapper>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Groups</TableCell>
              <TableCell align="left">Surfaces</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(surfaceLinks).length == 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  <NoLinkToShow>No links to show</NoLinkToShow>
                </TableCell>
              </TableRow>
            )}
            {Object.keys(surfaceLinks).map((groupId, index) => (
              <React.Fragment key={groupId}>
                {returnSelectionAccordian(
                  groupId,
                  surfaceLinks[groupId]['surface_fields']
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MyLinksWrapper>
  );
}
