import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  styled,
  Box,
  Grid,
  Typography,
  Button,
  withStyles,
  CircularProgress,
} from '@material-ui/core';

import { Alert as MuiAlert } from '@material-ui/lab';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
} from '../../UI';

import AccordionArrow from '../../../resources/AccordionArrowIcon';
import {
  getSurfaceLinks,
  editSurfaceLinks,
} from '../../../api/estimateSurfaceLink/index';
import { useSessionState, useSessionDispatch } from '../../../Context/Session';
const Alert = styled(MuiAlert)({
  margin: '50px auto auto',
  maxWidth: 800,
});

const paperStyles = {
  boxShadow: 'none',
  borderRadius: 0,
  height: '50px',
  display: 'flex',
  alignItems: 'center',
};

const HeadStyle = {
  fontFamily: 'Regular',
  color: 'black',
};

const NewLinkWrapper = styled(Box)({
  maxWidth: '65vw',
  margin: 'auto',
  paddingTop: '70px',
});

const SurfaceNameWrapper = styled(Box)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
});

const FieldWrapper = styled(Box)({
  ...paperStyles,
  paddingLeft: 12,
  background: '#f7fafc',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
  width: '100%',
});

const SummaryInnerWrapper = styled(Box)({
  ...paperStyles,
  padding: '0px 16px',
  background: '#ffff',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
  width: '100%',
});

const SurfaceNameTyp = styled(Typography)({
  fontSize: '15px',
  color: 'black',
  display: 'inline-block',
  fontFamily: 'Medium',
  paddingLeft: 4,
});

const FieldTyp = styled(Typography)({
  ...HeadStyle,

  fontSize: '15px',
});

const CheckboxWrapper = styled(Box)({
  background: '#f7fafc',
  borderBottom: '1px solid #E3E8EE',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 7,
});

const ButtonWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '40px 0px',
});
const CollapseBtnWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
});
const LoadingWrapper = styled(Box)({
  minHeight: window.innerHeight - 270,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
const StyledButton = withStyles({
  root: {
    textTransform: 'none',
  },
})(Button);
function NewLink(props) {
  const {
    fieldIds,
    setFieldIds,
    editGroupId,
    setEditGroupId,
    setLinkPageOption,
  } = props;
  const [surfaceLinks, setSurfaceLinks] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const sessionDispatch = useSessionDispatch();
  const sessionState = useSessionState();
  useEffect(() => {
    getSurfaceLinks(sessionDispatch).then((res) => {
      setSurfaceLinks(res);
    });
  }, [sessionState.expired]);

  const handleChecboxChange = (e, fieldId) => {
    if (e.target.checked) {
      setFieldIds([...fieldIds, fieldId]);
    } else {
      setFieldIds(fieldIds.filter((l) => l !== fieldId));
    }
  };

  const returnSelectionAccordian = (surfaceName, index, surfaceId) => {
    const myRef = createRef();
    return (
      <Accordion headerStatusRef={myRef}>
        <AccordionSummary>
          <SummaryInnerWrapper
            style={{
              ...(index === 0 && {
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
              }),
            }}
          >
            <Grid container spacing={0}>
              <Grid item xs={11}>
                <SurfaceNameWrapper>
                  <SurfaceNameTyp>{surfaceName}</SurfaceNameTyp>
                </SurfaceNameWrapper>
              </Grid>
              <Grid item xs={1}>
                <CollapseBtnWrapper ref={myRef}>
                  <AccordionArrow />
                </CollapseBtnWrapper>
              </Grid>
            </Grid>
          </SummaryInnerWrapper>
        </AccordionSummary>
        {Object.keys(surfaceLinks[surfaceId]['fields']).map((pKey) => {
          return (
            <AccordionDetails key={pKey}>
              <CheckboxWrapper>
                <Checkbox
                  onChange={(e) => handleChecboxChange(e, pKey)}
                  checked={fieldIds.find((l) => l === pKey) ? true : false}
                />
              </CheckboxWrapper>
              <FieldWrapper>
                <FieldTyp>
                  {surfaceLinks[surfaceId]['fields'][pKey].field_name}
                </FieldTyp>
              </FieldWrapper>
            </AccordionDetails>
          );
        })}
      </Accordion>
    );
  };

  if (surfaceLinks == undefined || loading) {
    return (
      <LoadingWrapper>
        <CircularProgress color="primary" />
      </LoadingWrapper>
    );
  }
  return (
    <NewLinkWrapper>
      {Object.keys(surfaceLinks).map((surfaceId, index) => {
        return (
          <React.Fragment key={surfaceId}>
            {returnSelectionAccordian(
              surfaceLinks[surfaceId]['surface_name'],
              index,
              surfaceId
            )}
          </React.Fragment>
        );
      })}
      {Object.keys(surfaceLinks).length == 0 && (
        <Alert severity="warning">No Surfaces to show</Alert>
      )}
      {Object.keys(surfaceLinks).length > 0 && (
        <ButtonWrapper>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => {
              if (fieldIds.length > 0) {
                setLoading(true);
                editSurfaceLinks(sessionDispatch, {
                  groupId: editGroupId,
                  fieldIds: fieldIds,
                }).then((res) => {
                  setEditGroupId(null);
                  setFieldIds([]);
                  setLoading(false);
                  setLinkPageOption('myLinks');
                });
              }
            }}
          >
            Proceed
          </StyledButton>
        </ButtonWrapper>
      )}
    </NewLinkWrapper>
  );
}
NewLink.defaultProps = {};
NewLink.propTypes = {};
export default NewLink;
