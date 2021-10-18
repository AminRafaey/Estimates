import React from 'react';
import {
  styled,
  Box,
  Typography,
  Tooltip,
  withStyles,
  Grid,
} from '@material-ui/core';
import { useAppState } from '../../../Context/AppContext';
import { useProductState } from '../../../Context/ProductContext';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
import { calculateProductCost, getProductCost } from '../utility';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const OtherFieldWrapper = styled(Box)({
  display: 'flex',

  height: '100%',

  alignItems: 'center',
  paddingTop: 4,
});
const DisableTyp = styled(Typography)({
  fontSize: 14,
  paddingRight: 4,
  wordBreak: 'break-word',
  fontFamily: 'Medium',
});

const LabelWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingBlock: 4,
});

const ContentWrapper = styled(Box)({
  display: 'flex',
  paddingBlock: 4,
});

const ContentTyp = styled(Typography)({
  fontSize: 14,
  paddingLeft: 8,
});
const StyledInfoOutlinedIcon = withStyles({
  root: {
    fill: '#1488FC',
    height: 16,
    width: 16,
  },
})(InfoOutlinedIcon);
const HtmlTooltip = withStyles(() => ({
  tooltip: {
    minWidth: 225,
  },
}))(Tooltip);
export default function TotalProductCost(props) {
  const {
    selectedActionId,
    uniqueSurfaces,
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
  } = props;
  const appState = useAppState();
  const productState = useProductState();

  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  let totalCost = 0;
  let rooms;
  if (uniqueSurfaces) {
    surfaceId
      ? (rooms =
          uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]['actions'][
            selectedActionId
          ]['room'])
      : (rooms =
          uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId]['room']);

    Object.keys(rooms).map((roomId) => {
      let dimensions = surfaceId
        ? appState[rooms[roomId]['parentRoomId']]['bedrooms'][roomId][
            'surfaces'
          ][parentSurfaceId]['surfaces'][surfaceId]['actions'][
            selectedActionId
          ]['dimensions']
        : appState[rooms[roomId]['parentRoomId']]['bedrooms'][roomId][
            'surfaces'
          ][parentSurfaceId]['actions'][selectedActionId]['dimensions'];

      Object.keys(dimensions).map((dimensionKey) => {
        let products = surfaceId
          ? appState[rooms[roomId]['parentRoomId']]['bedrooms'][roomId][
              'surfaces'
            ][parentSurfaceId]['surfaces'][surfaceId]['actions'][
              selectedActionId
            ]['dimensions'][dimensionKey]['products']
          : appState[rooms[roomId]['parentRoomId']]['bedrooms'][roomId][
              'surfaces'
            ][parentSurfaceId]['actions'][selectedActionId]['dimensions'][
              dimensionKey
            ]['products'];

        Object.keys(products).map((productId) => {
          const surface_id = surfaceId
            ? appState[rooms[roomId]['parentRoomId']]['bedrooms'][roomId][
                'surfaces'
              ][parentSurfaceId]['surfaces'][surfaceId]['surface_id']
            : appState[rooms[roomId]['parentRoomId']]['bedrooms'][roomId][
                'surfaces'
              ][parentSurfaceId]['surface_id'];
          totalCost += calculateProductCost(
            appState,
            productState,
            rooms[roomId]['parentRoomId'],
            roomId,
            parentSurfaceId,
            surfaceId,
            surface_id,
            selectedActionId,
            surfaceProductionRatesState,
            productId,
            dimensionKey,
            productState[selectedActionId][productId]['product_category_id'] ==
              surfaceProductionRatesState[surface_id][
                'surface_production_rates'
              ][selectedActionId]['product_category_id'] &&
              productState[selectedActionId][productId]['has_coats'],

            surfaceId
              ? appState[rooms[roomId]['parentRoomId']]['bedrooms'][roomId][
                  'surfaces'
                ][parentSurfaceId]['surfaces'][surfaceId]['actions'][
                  selectedActionId
                ]['dimensions'][dimensionKey]['no_of_coats']
              : appState[rooms[roomId]['parentRoomId']]['bedrooms'][roomId][
                  'surfaces'
                ][parentSurfaceId]['actions'][selectedActionId]['dimensions'][
                  dimensionKey
                ]['no_of_coats']
          );
        });
      });
    });
  } else {
    totalCost = getProductCost(
      surfaceProductionRatesState,
      productState,
      appState,
      parentRoomId,
      roomId,
      parentSurfaceId,
      surfaceId,
      selectedActionId
    );
  }

  return (
    <OtherFieldWrapper>
      <DisableTyp fontFamily="Medium">
        {`$${isNaN(totalCost) ? '0.00' : totalCost.toFixed(2)}`}
      </DisableTyp>
      <HtmlTooltip
        title={
          <Grid container>
            <Grid item xs={6}>
              <LabelWrapper>
                <ContentTyp>Product cost:</ContentTyp>
              </LabelWrapper>
            </Grid>

            <Grid item xs={6}>
              <ContentWrapper>
                <ContentTyp>
                  {`$${isNaN(totalCost) ? '0.00' : totalCost.toFixed(2)}`}
                </ContentTyp>
              </ContentWrapper>
            </Grid>
          </Grid>
        }
      >
        <StyledInfoOutlinedIcon />
      </HtmlTooltip>
    </OtherFieldWrapper>
  );
}
