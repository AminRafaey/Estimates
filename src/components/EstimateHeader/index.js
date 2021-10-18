import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Navlink from './NavLink';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  styled,
  Grid,
  CircularProgress,
  withStyles,
} from '@material-ui/core';
import { useWidth } from '../Assets';
import {
  BedroomIcon,
  SurfaceIcon,
  MeasurementIcon,
  ProductIcon,
  SummaryIcon,
} from '../../resources';
import { useAppState } from '../../Context/AppContext';
import { useRoomsState } from '../../Context/RoomSelectionContext';
import { useSurfaceProductionRatesState } from '../../Context/SurfaceProductionRates';
import { useProductState } from '../../Context/ProductContext';
import { getTotalCostOfSurface } from '../EstimateSummary/utility';
import { HighlightColor } from '../constants/theme';
import { getFilteredRooms } from '../EstimateRoom/utility';
import Settings from '../EstimateHeader/Settings';

const HeaderContainer = styled(Box)({
  display: 'flex',
  height: '100%',
});

const CalculationContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});
const SavedStatusContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  paddingLeft: 15,
});

const CalculationInnerContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});
const StyledHeader = styled(Box)({
  boxShadow: 'none',
  borderBottom: '1px solid #eff2f5',
  width: '100%',
  zIndex: 1100,
  background: '#ffff',
  display: 'flex',
});

const ContentWrapper = styled(Box)({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-around',
});

const SaveEstimateLinkTyp = styled(Typography)({
  fontSize: 14,
  color: HighlightColor,
  lineHeight: 1.167,
  '&:hover': {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
});

const EstimateHeader = ({
  headerSteps,
  savedChangesStatus,
  setSavedChangesStatus,
  globalLoader,
  setSaveEstimateLoader,
  saveEstimateLoader,
  leadName,
  hourlyRate,
}) => {
  const location = useLocation();
  const currentPath = location.pathname.replace('/estimates/', '');
  const width = useWidth();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const productState = useProductState();
  const estimateRooms = useRoomsState();
  const search = useLocation().search;
  const token = new URLSearchParams(search).get('token');
  token &&
    window.localStorage.getItem('AUTH_TOKEN') !== token &&
    window.localStorage.setItem('AUTH_TOKEN', token);

  const prevAppState = useRef(null);
  const prevRoomState = useRef(null);
  const appState = useAppState();
  useEffect(() => {
    if (currentPath === 'rooms') {
      const filteredRooms = getFilteredRooms(estimateRooms);
      if (
        Object.entries(filteredRooms).length > 0 &&
        JSON.stringify(filteredRooms) !== prevRoomState.current
      ) {
        prevRoomState.current && setSavedChangesStatus('Unsaved Changes');
        prevRoomState.current = JSON.stringify(filteredRooms);
      }
    } else {
      if (
        Object.entries(appState).length > 0 &&
        JSON.stringify(appState) !== prevAppState.current
      ) {
        prevAppState.current && setSavedChangesStatus('Unsaved Changes');
        prevAppState.current = JSON.stringify(appState);
      }
    }
  }, [appState, estimateRooms]);
  const calculateEstimateCost = () => {
    if (globalLoader) {
      return 0;
    }
    let total = 0;
    Object.keys(appState).map((parentRoomId) => {
      Object.keys(appState[parentRoomId]['bedrooms']).map((roomId) => {
        if (
          !appState[parentRoomId]['bedrooms'][roomId]['surfaces'] ||
          !appState[parentRoomId]['bedrooms'][roomId]['included']
        )
          return;
        Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
          (parentSurfaceId) => {
            if (
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces']
              ).length < 1
            ) {
              if (
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['included']
              ) {
                total += getTotalCostOfSurface(
                  surfaceProductionRatesState,
                  productState,
                  appState,
                  parentRoomId,
                  roomId,
                  parentSurfaceId,
                  undefined,
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surface_id'],
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions'],
                  hourlyRate
                );
              }
              return;
            }
            Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces']
            ).map((surfaceId) => {
              if (
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['included']
              ) {
                total += getTotalCostOfSurface(
                  surfaceProductionRatesState,
                  productState,
                  appState,
                  parentRoomId,
                  roomId,
                  parentSurfaceId,
                  surfaceId,
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['surface_id'],
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions'],
                  hourlyRate
                );
              }
            });
          }
        );
      });
    });
    return isNaN(total) ? 0 : total;
  };
  return (
    <StyledHeader position="fixed" color="secondary">
      <HeaderContainer>
        {headerSteps.map((headerStep, index) => {
          return <Navlink step={headerStep} width={width} key={index} />;
        })}
      </HeaderContainer>

      <ContentWrapper>
        <SavedStatusContainer>
          <CalculationInnerContainer>
            <Typography variant="subtitle1">{savedChangesStatus}</Typography>

            <Box minWidth={128}>
              {saveEstimateLoader ? (
                <Box width="100%" display="flex" justifyContent="center">
                  <CircularProgress size={16} color="primary" />
                </Box>
              ) : (
                savedChangesStatus !== 'All changes saved' && (
                  <SaveEstimateLinkTyp
                    onClick={() => setSaveEstimateLoader(true)}
                  >
                    Save Estimate
                  </SaveEstimateLinkTyp>
                )
              )}
            </Box>
          </CalculationInnerContainer>
        </SavedStatusContainer>

        <SavedStatusContainer>
          <CalculationInnerContainer>
            <Typography variant="h1">{leadName || ''}</Typography>

            <Box display="flex" justifyContent="center">
              <Typography variant="subtitle1">Job Name</Typography>
            </Box>
          </CalculationInnerContainer>
        </SavedStatusContainer>

        <CalculationContainer>
          <CalculationInnerContainer>
            <Typography variant="h1">{`$ ${calculateEstimateCost().toFixed(
              2
            )}`}</Typography>
            {width !== 'xs' && width !== 'sm' && width !== 'md' && (
              <Typography variant="subtitle1">Estimate Cost</Typography>
            )}
          </CalculationInnerContainer>
        </CalculationContainer>

        <CalculationContainer>
          <CalculationInnerContainer>
            <Settings />
          </CalculationInnerContainer>
        </CalculationContainer>
      </ContentWrapper>
    </StyledHeader>
  );
};

EstimateHeader.defaultProps = {
  headerSteps: [
    {
      name: 'rooms',
      title: 'Rooms',
      icon: <BedroomIcon />,
    },
    {
      name: 'surfaces',
      title: 'Surfaces',
      icon: <SurfaceIcon />,
    },
    {
      name: 'measurements',
      title: 'Measurements',
      icon: <MeasurementIcon />,
    },
    {
      name: 'products',
      title: 'Products',
      icon: <ProductIcon />,
    },
    {
      name: 'summary',
      title: 'Summary',
      icon: <SummaryIcon />,
    },
  ],
};

EstimateHeader.propTypes = {
  headerSteps: PropTypes.array,
};

export default EstimateHeader;
