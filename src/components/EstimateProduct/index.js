import React, { useState, useEffect, useLayoutEffect } from 'react';
import SurfacePanel from './SurfacePanel';
import { useWidth } from '../Assets';
import { Checkbox } from '../UI';
import {
  Grid,
  styled,
  Box,
  Typography,
  Tabs,
  Tab,
  withStyles,
  CircularProgress,
} from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab';
import { useAppState } from '../../Context/AppContext';
import AccordionBulkSelect from './Surface/AccordionBulkSelect';
import HeaderBulkSelection from './HeaderBulkSelection';
import { default as AccordionBulkColorSelection } from './ColorSelection/AccordionBulkSelection';
import { default as HeaderBulkColorSelection } from './ColorSelection/AccordionBulkSelection/HeaderBulkSelection';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { useSessionState, useSessionDispatch } from '../../Context/Session';
import {
  isRoomHasAnyIncludedSurface,
  isAnyRoomIsIncluded,
  handleRoomAllSurfacesCheckboxChange,
  getAllActionAgainstRoom,
} from './utility';
import {
  idsNotExistInPRContext,
  isAnyRoomHasIncludedSurface,
} from '../EstimateMeasurement/utility';
import AllRoomsPanel from './AllRoomsPanel';
import { HighlightColor } from '../constants/theme';
import { default as ToggleButtons } from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { getColors } from '../../api/estimateProduct';
import {
  useSurfaceProductionRatesState,
  useSurfaceProductionRatesDispatch,
  loadSurfaceProductionRatesContext,
} from '../../Context/SurfaceProductionRates';
import { useAppDispatch, insertFields } from '../../Context/AppContext';
import { getSurfaceProductionRates } from '../../api/estimateSurface';
import {
  useSurfaceSelectionState,
  useSurfaceSelectionDispatch,
  loadSurfaceContext,
} from '../../Context/SurfaceSelectionContext';
import { getSurfaces } from '../../api/estimateSurface';
import {
  useColorState,
  useColorDispatch,
  loadColorContext,
} from '../../Context/Color';
export const StyledToggleButton = withStyles((theme) => ({
  root: {
    padding: '08px 30px 08px 30px',
    marginLeft: '0px!important',
    border: '1px solid #E3E8EE',
    background: 'white',
    color: 'black',
    '&:hover': {
      background: 'white',
    },
  },
  label: {
    fontSize: '14px',
    textTransform: 'capitalize',
  },
  selected: {
    background: 'white!important',
    '& .MuiToggleButton-label': {
      color: HighlightColor,
      fontFamily: 'Medium',
    },
  },
}))(ToggleButtons);

const RoomWrapper = styled(Box)({});
export const headingStyling = {
  fontSize: '14px',
};

const TabWrapper = styled(Box)({
  background: '#F7FAFC',
});

const TabPanelWrapper = styled(Box)({
  background: '#ffffff',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
  padding: '60px 25px',
  minHeight: '80vh',
});

const Heading = styled(Typography)({
  fontFamily: 'Medium',
  fontSize: 16,
  color: 'black',
  display: 'flex',
  alignItems: 'center',
});

const LabelTyp = styled(Typography)({
  paddingBottom: 1,
  display: 'flex',
  fontSize: 14,
});

const BulkSelectionWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  background: '#151b26',
  width: 'fit-content',
  borderRadius: 25,
  padding: '15px 30px 15px 30px',
  width: '100%',
});
const CloseIconWrapper = styled(Box)({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
});
const CloseIconInnerWrapper = styled(Box)({
  display: 'flex',
  '&:hover': {
    background: '#424242',
  },
});
const BulkSelectionParentWrapper = styled(Box)({
  position: 'fixed',
  bottom: 20,
  left: '26vw',
  width: '48vw',
  zIndex: 1,
});
const BulkSelectionParentWrapperForColor = styled(Box)({
  position: 'fixed',
  bottom: 20,
  left: '25vw',
  width: '50vw',
  zIndex: 1,
});
const LoadingWrapper = styled(Box)({
  minHeight: window.innerHeight - 270,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
const AllSurfacesWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});
const HeadingWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
});

const AllSurfacesParentWrapper = styled(Box)({
  display: 'flex',
  marginLeft: -11,
});
const Alert = styled(MuiAlert)({
  margin: '50px auto auto',
  maxWidth: 800,
});
const ActionsWrapper = styled(Box)({
  display: 'flex',
  marginLeft: -11,
  marginRight: 22,
});
function EstimateMeasurement(props) {
  const [selectedRoom, setSelectedRoom] = useState({ id: -1 });
  const [commonProducts, setCommonProducts] = useState([]);
  const [bulkSelectionArr, setBulkSelectionArr] = useState([]);
  const appState = useAppState();
  const sessionDispatch = useSessionDispatch();
  const sessionState = useSessionState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const surfaceProductionRatesDispatch = useSurfaceProductionRatesDispatch();
  const appDispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const surfaceSelectionDispatch = useSurfaceSelectionDispatch();
  const estimateSurface = useSurfaceSelectionState();
  const [selectedToggle, setSelectedToggle] = useState('paint');
  const colorState = useColorState();
  const colorDispatch = useColorDispatch();
  const [colorLoading, setColorLoading] = useState(false);
  const screenWidth = useWidth();
  const [showActionBar, setShowActionBar] = useState(false);
  const [allIncludedActions, setAllIncludedActions] = useState([]);
  const [selectedActionId, setSelectedActionId] = useState(null);

  useLayoutEffect(() => {
    if (Object.entries(appState).length > 0)
      setSelectedRoom({ id: -2, parent_id: null });
  }, []);

  useEffect(() => {
    selectedRoom.id !== -2 &&
      selectedRoom.id !== -1 &&
      setAllIncludedActions(
        getAllActionAgainstRoom(
          appState,
          selectedRoom.parent_id,
          selectedRoom.id
        )
      );
  }, [selectedRoom.id]);

  useEffect(() => {
    if (allIncludedActions.length > 0)
      setSelectedActionId(allIncludedActions[0]['actionId']);
  }, [allIncludedActions]);

  useEffect(() => {
    setShowActionBar(false);
  }, [selectedRoom]);
  useEffect(() => {
    if (Object.entries(colorState).length < 1) {
      setColorLoading(true);
      getColors(sessionDispatch).then((res) => {
        setColorLoading(false);
        loadColorContext(colorDispatch, { colors: res });
      });
    }
  }, [sessionState.expired]);

  useEffect(() => {
    setBulkSelectionArr([]);
  }, [selectedRoom, selectedToggle]);

  const handleChange = (parentRoomId, roomId) => {
    setSelectedRoom({ parent_id: parentRoomId, id: roomId });
  };

  useEffect(() => {
    if (Object.entries(appState).length > 0 && loading === true) {
      const ids = idsNotExistInPRContext(
        appState,
        Object.keys(surfaceProductionRatesState)
      );
      if (ids.length > 0) {
        getSurfaceProductionRates(sessionDispatch, ids)
          .then((res) => {
            if (res && res.data) {
              return res.data;
            }
            throw new Erorr("Api didn't return any  data");
          })
          .then((res) => {
            loadSurfaceProductionRatesContext(surfaceProductionRatesDispatch, {
              surfaceProductionRates: res,
            });
            insertFields(appDispatch, {
              surfaceProductionRates: res,
            });
          })
          .catch((err) => {});
      } else {
        setLoading(false);
      }
    }
  }, [sessionState.expired, appState]);

  useEffect(() => {
    if (Object.entries(estimateSurface).length < 1) {
      getSurfaces(sessionDispatch).then((res) => {
        loadSurfaceContext(surfaceSelectionDispatch, { surfaces: res });
      });
    }
  }, [sessionState.expired]);

  if (!isAnyRoomIsIncluded(appState))
    return <Alert severity="warning">Please select Rooms to continue...</Alert>;

  if (!isAnyRoomHasIncludedSurface(appState))
    return (
      <Alert severity="warning">
        Please select Surfaces Against Rooms to continue...
      </Alert>
    );

  if (loading || colorLoading) {
    return (
      <LoadingWrapper>
        <CircularProgress color="primary" />
      </LoadingWrapper>
    );
  }

  if (Object.entries(estimateSurface).length < 1) {
    return <Alert severity="warning">No Surface is available to show...</Alert>;
  }

  return (
    <RoomWrapper>
      <Grid container spacing={0}>
        <Grid item xs={2}>
          <TabWrapper>
            <Tabs
              orientation="vertical"
              value={selectedRoom.id}
              aria-label="Vertical tabs example"
            >
              {selectedRoom.id === -1 ? (
                <Tab value={-1} label={'Home'} />
              ) : (
                <Tab
                  value={-2}
                  label={'All Rooms'}
                  onClick={(e) => handleChange(null, -2)}
                />
              )}
              {Object.keys(appState).map((Pkey) => {
                return Object.keys(appState[Pkey]['bedrooms']).map((key) => {
                  if (!appState[Pkey]['bedrooms'][key]['included']) return;
                  return (
                    appState[Pkey]['bedrooms'][key]['surfaces'] && (
                      <Tab
                        key={key}
                        value={key}
                        label={appState[Pkey]['bedrooms'][key]['name']}
                        onClick={(e) => handleChange(Pkey, key)}
                      />
                    )
                  );
                });
              })}
            </Tabs>
          </TabWrapper>
        </Grid>
        <Grid item xs={10}>
          <TabPanelWrapper>
            {selectedRoom.id == -2 ? (
              <AllRoomsPanel
                commonProducts={commonProducts}
                bulkSelectionArr={bulkSelectionArr}
                setBulkSelectionArr={setBulkSelectionArr}
                selectedToggle={selectedToggle}
                setSelectedToggle={setSelectedToggle}
                showActionBar={showActionBar}
                setShowActionBar={setShowActionBar}
              />
            ) : selectedRoom.id == -1 ||
              isRoomHasAnyIncludedSurface(
                selectedRoom.parent_id,
                selectedRoom.id,
                appState
              ) ? (
              allIncludedActions.length > 0 ? (
                <React.Fragment>
                  <HeadingWrapper>
                    <Heading>Add Room Products</Heading>

                    <ToggleButtonGroup value={selectedToggle}>
                      {[
                        { label: 'Paint', value: 'paint' },
                        { label: 'Colors', value: 'colors' },
                      ].map((t) => {
                        return (
                          <StyledToggleButton
                            disableRipple={true}
                            onClick={() => setSelectedToggle(t.value)}
                            value={t.value}
                            key={t.value}
                          >
                            {t.label}
                          </StyledToggleButton>
                        );
                      })}
                    </ToggleButtonGroup>
                  </HeadingWrapper>
                  <Box display="flex">
                    {allIncludedActions.map((action, index) => (
                      <ActionsWrapper key={index}>
                        <AllSurfacesWrapper>
                          <Checkbox
                            checked={selectedActionId == action.actionId}
                            onChange={(e) =>
                              setSelectedActionId(action.actionId)
                            }
                          />
                        </AllSurfacesWrapper>
                        <AllSurfacesWrapper>
                          <LabelTyp>{action['name']}</LabelTyp>
                        </AllSurfacesWrapper>
                      </ActionsWrapper>
                    ))}
                  </Box>
                  <AllSurfacesParentWrapper>
                    <AllSurfacesWrapper>
                      <Checkbox
                        checked={
                          bulkSelectionArr.length !== 0 &&
                          handleRoomAllSurfacesCheckboxChange(
                            { target: { checked: true } },
                            appState,
                            selectedRoom.parent_id,
                            selectedRoom.id,
                            selectedActionId,
                            selectedToggle
                          ).length === bulkSelectionArr.length
                        }
                        onChange={(e) =>
                          setBulkSelectionArr(
                            handleRoomAllSurfacesCheckboxChange(
                              e,
                              appState,
                              selectedRoom.parent_id,
                              selectedRoom.id,
                              selectedActionId,
                              selectedToggle
                            )
                          )
                        }
                      />
                    </AllSurfacesWrapper>
                    <AllSurfacesWrapper>
                      <LabelTyp>All Surfaces</LabelTyp>
                    </AllSurfacesWrapper>
                  </AllSurfacesParentWrapper>

                  <Grid item xs={12}>
                    {selectedActionId &&
                      selectedRoom.id !== -1 &&
                      selectedRoom.parent_id && (
                        <SurfacePanel
                          selectedRoom={selectedRoom}
                          selectedActionId={selectedActionId}
                          bulkSelectionArr={bulkSelectionArr}
                          setBulkSelectionArr={setBulkSelectionArr}
                          commonProducts={commonProducts}
                          selectedToggle={selectedToggle}
                          showActionBar={showActionBar}
                          setShowActionBar={setShowActionBar}
                        />
                      )}
                  </Grid>
                </React.Fragment>
              ) : (
                <Alert severity="warning">
                  Please select Actions to continue...
                </Alert>
              )
            ) : (
              <Alert severity="warning">
                Please select Surfaces Against
                {' ' +
                  appState[selectedRoom.parent_id]['bedrooms'][selectedRoom.id][
                    'name'
                  ] +
                  ' '}
                to continue...
              </Alert>
            )}
          </TabPanelWrapper>
        </Grid>
      </Grid>

      <Slide
        direction="up"
        in={showActionBar && selectedToggle === 'paint'}
        mountOnEnter
        unmountOnExit
      >
        <BulkSelectionParentWrapper
          style={{
            ...(screenWidth === 'sm' && { width: '80vw', left: '10vw' }),
            ...(screenWidth === 'md' && { width: '62vw', left: '19vw' }),
          }}
        >
          <BulkSelectionWrapper>
            <Box width="100%">
              <AccordionBulkSelect
                bulkSelectionArr={bulkSelectionArr}
                commonProducts={commonProducts}
                setCommonProducts={setCommonProducts}
                bulkType={'actionBar'}
              />
              <HeaderBulkSelection
                AccordionCommonProducts={commonProducts}
                bulkType={'actionBar'}
                bulkSelectionArr={bulkSelectionArr}
              />
            </Box>
            <CloseIconWrapper
              onClick={() => {
                setBulkSelectionArr([]);
              }}
            >
              <CloseIconInnerWrapper>
                <CloseIcon
                  style={{
                    color: '#ffff',
                  }}
                />
              </CloseIconInnerWrapper>
            </CloseIconWrapper>
          </BulkSelectionWrapper>
        </BulkSelectionParentWrapper>
      </Slide>

      <Slide
        direction="up"
        in={showActionBar && selectedToggle === 'colors'}
        mountOnEnter
        unmountOnExit
      >
        <BulkSelectionParentWrapperForColor
          style={{
            ...(screenWidth === 'sm' && { width: '70vw', left: '15vw' }),
            ...(screenWidth === 'md' && { width: '50vw', left: '25vw' }),
          }}
        >
          <BulkSelectionWrapper>
            <Box width="100%">
              <AccordionBulkColorSelection
                bulkSelectionArr={bulkSelectionArr}
                bulkType={'actionBar'}
              />
              <HeaderBulkColorSelection
                bulkSelectionArr={bulkSelectionArr}
                bulkType={'actionBar'}
              />
            </Box>
            <CloseIconWrapper onClick={() => setBulkSelectionArr([])}>
              <CloseIconInnerWrapper>
                <CloseIcon
                  style={{
                    color: '#ffff',
                  }}
                />
              </CloseIconInnerWrapper>
            </CloseIconWrapper>
          </BulkSelectionWrapper>
        </BulkSelectionParentWrapperForColor>
      </Slide>
    </RoomWrapper>
  );
}

EstimateMeasurement.defaultProps = {};

EstimateMeasurement.propTypes = {};
export default EstimateMeasurement;
