import React, { useState, useEffect } from 'react';
import SurfacePanel from './SurfacePanel';
import { Checkbox } from '../UI';
import DeleteIcon from '../../resources/Deleteicon';
import { useWidth } from '../Assets';
import {
  Grid,
  styled,
  Box,
  Typography,
  TextField,
  Tabs,
  Tab,
  OutlinedInput,
  FormControl,
  CircularProgress,
} from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab';
import {
  useAppState,
  useAppDispatch,
  insertFields,
  addDefaultActionsAgainstSurfaces,
} from '../../Context/AppContext';
import {
  useProductState,
  useProductDispatch,
  loadProducts,
} from '../../Context/ProductContext';
import BulkSelect from './BulkSelect';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { getSurfaceProductionRates } from '../../api/estimateSurface';
import { getProducts } from '../../api/estimateProduct';
import { getLinkings } from '../../api/estimateLinking';
import {
  useSurfaceProductionRatesState,
  useSurfaceProductionRatesDispatch,
  loadSurfaceProductionRatesContext,
} from '../../Context/SurfaceProductionRates';
import { useSessionState, useSessionDispatch } from '../../Context/Session';
import {
  isRoomHasAnyIncludedSurface,
  idsNotExistInPRContext,
  handleAllSUrfacesChange,
  isAnyRoomHasIncludedSurface,
} from './utility';
import AllRoomsPanel from './AllRoomsPanel';
import {
  useLinkingState,
  useLinkingDispatch,
  loadLinkingContext,
} from '../../Context/LinkingContext';
import { countIncluded } from '../EstimateSurface/utility';
import {
  calculateRoomCost,
  getRoomTotalHours,
} from '../EstimateSummary/utility';
const RoomWrapper = styled(Box)({});
export const headingStyling = {
  fontSize: '14px',
};

const textFieldSize = {
  background: '#F7FAFC',
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

const TimeWrapper = styled(Box)({
  marginBottom: 5,
});

const Heading = styled(Typography)({
  ...headingStyling,
  color: 'black',
});

const LabelTyp = styled(Typography)({
  paddingBottom: 15,
  display: 'flex',
  fontSize: 14,
});

const IconWrapper = styled(Box)({
  textAlign: 'right',
});

const TimeTyp = styled(Typography)({
  fontSize: 14,
  marginBottom: 25,
});

const CostWrapper = styled(Box)({
  marginLeft: 40,
});

const LinkTextTyp = styled(Typography)({
  ...headingStyling,
  color: '#1887fa',
  display: 'flex',
  justifyContent: 'flex-end',
});

const BulkSelectionWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  background: '#151b26',
  width: 'fit-content',
  borderRadius: 25,
  padding: '5px 30px 5px 30px',
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
  left: '30vw',
  width: '40vw',
});
const LoadingWrapper = styled(Box)({
  minHeight: window.innerHeight - 270,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
const BulkSelectionTyp = styled(Typography)({
  color: '#ffff',
  fontSize: 12,
  display: 'flex',
  alignItems: 'center',
});
const AllSurfacesParentWrapper = styled(Box)({
  display: 'flex',
  marginLeft: -11,
  paddingTop: 10,
});
const AllSurfacesWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});
const AllSurfacesLabelTyp = styled(Typography)({
  paddingBottom: 1,
  display: 'flex',
  fontSize: 14,
});
const Alert = styled(MuiAlert)({
  margin: '50px auto auto',
  maxWidth: 800,
});

function EstimateMeasurement(props) {
  const { hourlyRate, setHourlyRate } = props;
  const [selectedRoom, setSelectedRoom] = useState({ id: -1 });
  const [bulkSelectionArr, setBulkSelectionArr] = useState([]);
  const [fieldsLinkingList, setFieldsLinkingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [linkingLoading, setLinkingLoading] = useState(false);
  const appState = useAppState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const SurfaceProductionRatesDispatch = useSurfaceProductionRatesDispatch();
  const appDispatch = useAppDispatch();
  const linkingState = useLinkingState();
  const linkingDispatch = useLinkingDispatch();
  const sessionDispatch = useSessionDispatch();
  const sessionState = useSessionState();
  const productState = useProductState();
  const productDispatch = useProductDispatch();
  const screenWidth = useWidth();
  useEffect(() => {
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
          loadSurfaceProductionRatesContext(SurfaceProductionRatesDispatch, {
            surfaceProductionRates: res,
          });
          insertFields(appDispatch, {
            surfaceProductionRates: res,
          });
          const surfaceDefaultActions = {};
          ids.map((id) => {
            surfaceDefaultActions[id] = getSurfaceDefaultActions(id, {
              ...surfaceProductionRatesState,
              ...res,
            });
          });

          addDefaultActionsAgainstSurfaces(appDispatch, {
            surfaceIds: ids,
            surfaceDefaultActions: surfaceDefaultActions,
          });
          setLoading(false);
        })
        .catch((err) => {});
    } else {
      setLoading(false);
    }
  }, [sessionState.expired]);

  useEffect(() => {
    if (Object.entries(productState).length < 1) {
      setProductsLoading(true);
      getProducts(sessionDispatch).then((res) => {
        loadProducts(productDispatch, { products: res });
        setProductsLoading(false);
      });
    }
  }, [sessionState.expired]);

  useEffect(() => {
    if (Object.entries(linkingState).length < 1) {
      setLinkingLoading(true);
      getLinkings().then((res) => {
        loadLinkingContext(linkingDispatch, { linking: res });
        setLinkingLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (Object.entries(appState).length > 0)
      setSelectedRoom({ id: -2, parent_id: null });
  }, []);

  useEffect(() => {
    setBulkSelectionArr([]);
    setFieldsLinkingList([]);
  }, [selectedRoom]);

  const getSurfaceDefaultActions = (id, surfaceProductionRates) => {
    const defaultActions = {};

    Object.keys(surfaceProductionRates[id]['default_actions']).map(
      (actionId) => {
        const action = surfaceProductionRates[id]['default_actions'][actionId];

        defaultActions[actionId] = {
          name: action.name,
          selected: true,
          ...(surfaceProductionRates[id]['surface_production_rates'][actionId][
            'no_of_coats'
          ] && {
            no_of_coats:
              surfaceProductionRates[id]['surface_production_rates'][actionId][
                'no_of_coats'
              ],
          }),
          dimensions: {},
        };
      }
    );

    return defaultActions;
  };

  const handleChange = (parentRoomId, roomId) => {
    setSelectedRoom({ parent_id: parentRoomId, id: roomId });
  };

  if (countIncluded(appState) === 0) {
    return (
      <Alert severity="warning">Please include rooms to continue...</Alert>
    );
  }

  if (!isAnyRoomHasIncludedSurface(appState))
    return (
      <Alert severity="warning">
        Please select Surfaces Against Rooms to continue...
      </Alert>
    );

  if (
    loading ||
    linkingLoading ||
    productsLoading ||
    idsNotExistInPRContext(appState, Object.keys(surfaceProductionRatesState))
      .length > 0
  ) {
    return (
      <LoadingWrapper>
        <CircularProgress color="primary" />
      </LoadingWrapper>
    );
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
              <AllRoomsPanel selectedRoom={selectedRoom} />
            ) : selectedRoom.id == -1 ||
              isRoomHasAnyIncludedSurface(
                selectedRoom.parent_id,
                selectedRoom.id,
                appState
              ) ? (
              <React.Fragment>
                <Grid container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item>
                      <Heading>Room Details</Heading>
                    </Grid>
                    <Grid item>
                      <Grid item>
                        <LabelTyp>Room Name</LabelTyp>
                      </Grid>

                      <TextField
                        value={
                          selectedRoom.id !== -1
                            ? appState[selectedRoom.parent_id]['bedrooms'][
                                selectedRoom.id
                              ]['name']
                            : ''
                        }
                        style={textFieldSize}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid item>
                      <IconWrapper>
                        <DeleteIcon />
                      </IconWrapper>
                    </Grid>
                    <Grid container item>
                      <CostWrapper>
                        <TimeWrapper>
                          <TimeTyp>hourly rate</TimeTyp>
                        </TimeWrapper>
                        <FormControl fullWidth size="small" variant="outlined">
                          <OutlinedInput
                            style={{ background: '#ffff', width: 73 }}
                            variant="outlined"
                            type={'number'}
                            defaultValue={window.localStorage.getItem(
                              'hourlyRate'
                            )}
                            onChange={(e) => {
                              setHourlyRate(e.target.value);
                              window.localStorage.setItem(
                                'hourlyRate',
                                e.target.value
                              );
                            }}
                          />
                        </FormControl>
                      </CostWrapper>

                      <CostWrapper>
                        <TimeTyp>Room Hours</TimeTyp>
                        <LinkTextTyp>
                          {selectedRoom.parent_id
                            ? `${getRoomTotalHours(
                                appState,
                                surfaceProductionRatesState,
                                selectedRoom.parent_id,
                                selectedRoom.id
                              ).toFixed(2)}`
                            : 0}
                        </LinkTextTyp>
                      </CostWrapper>

                      <CostWrapper>
                        <TimeTyp>Room Cost</TimeTyp>
                        <LinkTextTyp>
                          {selectedRoom.parent_id
                            ? `$${calculateRoomCost(
                                appState,
                                productState,
                                surfaceProductionRatesState,
                                selectedRoom.parent_id,
                                selectedRoom.id
                              ).toFixed(2)}`
                            : 0}
                        </LinkTextTyp>
                      </CostWrapper>
                    </Grid>
                  </Grid>
                </Grid>
                <AllSurfacesParentWrapper>
                  <AllSurfacesWrapper>
                    <Checkbox
                      checked={
                        selectedRoom.parent_id &&
                        handleAllSUrfacesChange(
                          { target: { checked: true } },
                          appState,
                          selectedRoom.id,
                          selectedRoom.parent_id
                        ).length === bulkSelectionArr.length
                      }
                      onChange={(e) => {
                        setFieldsLinkingList([]);
                        setBulkSelectionArr(
                          handleAllSUrfacesChange(
                            e,
                            appState,
                            selectedRoom.id,
                            selectedRoom.parent_id
                          )
                        );
                      }}
                    />
                  </AllSurfacesWrapper>
                  <AllSurfacesWrapper>
                    <AllSurfacesLabelTyp>All Surfaces</AllSurfacesLabelTyp>
                  </AllSurfacesWrapper>
                </AllSurfacesParentWrapper>
                <Grid item xs={12}>
                  {selectedRoom.id !== -1 && selectedRoom.parent_id && (
                    <SurfacePanel
                      selectedRoom={selectedRoom}
                      bulkSelectionArr={bulkSelectionArr}
                      setBulkSelectionArr={setBulkSelectionArr}
                      hourlyRate={hourlyRate}
                      fieldsLinkingList={fieldsLinkingList}
                      setFieldsLinkingList={setFieldsLinkingList}
                    />
                  )}
                </Grid>
              </React.Fragment>
            ) : (
              <Alert severity="warning">
                {'Please select Surfaces Against ' +
                  appState[selectedRoom.parent_id]['bedrooms'][selectedRoom.id][
                    'name'
                  ] +
                  ' to continue...'}
              </Alert>
            )}
          </TabPanelWrapper>
        </Grid>
      </Grid>

      <Slide
        direction="up"
        in={bulkSelectionArr.length > 0}
        mountOnEnter
        unmountOnExit
      >
        <BulkSelectionParentWrapper
          style={{
            ...(screenWidth === 'sm' && { width: '62vw', left: '19vw' }),
          }}
        >
          <BulkSelectionWrapper>
            <BulkSelectionTyp>
              {bulkSelectionArr.length} surfaces selected
            </BulkSelectionTyp>
            <BulkSelect bulkSelectionArr={bulkSelectionArr} />
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
        </BulkSelectionParentWrapper>
      </Slide>
    </RoomWrapper>
  );
}

EstimateMeasurement.defaultProps = {};

EstimateMeasurement.propTypes = {};
export default EstimateMeasurement;
