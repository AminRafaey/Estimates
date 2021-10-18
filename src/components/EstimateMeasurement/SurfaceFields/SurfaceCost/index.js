import React, { useState, useEffect } from 'react';
import {
  styled,
  Box,
  Typography,
  withStyles,
  Tooltip,
  Grid,
} from '@material-ui/core';
import { useAppState } from '../../../../Context/AppContext';

import { getLaborCost } from '../../utility';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import { useProductState } from '../../../../Context/ProductContext';
import { collectiveLaborCostAgainstSurface } from '../../../EstimateSummary/utility';
import { getTotalProductCost } from '../../../EstimateProduct/utility';
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
  paddingTop: 4,
});

const ContentWrapper = styled(Box)({
  display: 'flex',
  paddingTop: 4,
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
    maxWidth: 300,
  },
}))(Tooltip);
export default function SurfaceCost(props) {
  const {
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    surface_id,
    hourlyRate,
  } = props;

  const [formula, setFormula] = useState('');

  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const productState = useProductState();
  const appState = useAppState();

  useEffect(() => {
    let surface_formula = surfaceProductionRatesState[surface_id][
      'surface_formula'
    ].trim();
    Object.keys(surfaceProductionRatesState[surface_id]['surface_fields']).map(
      (key, index) => {
        surface_formula = surface_formula.replaceAll(
          surfaceProductionRatesState[surface_id]['surface_fields'][key][
            'name'
          ],
          `(surfaceId?appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId]['surfaces'][surfaceId][surfaceProductionRatesState[surface_id]['surface_fields'][${key}][
            'name'
          ]]:
appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][surfaceProductionRatesState[surface_id]['surface_fields'][${key}][
            'name'
          ]])`
        );
      }
    );
    setFormula(surface_formula);
  }, [surface_id]);

  const lineItemsTotalCost = () => {
    const actions = surfaceId
      ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['actions']
      : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'actions'
        ];

    return collectiveLaborCostAgainstSurface(
      surfaceProductionRatesState,
      appState,
      parentRoomId,
      roomId,
      parentSurfaceId,
      surfaceId,
      actions,
      surface_id
    );
  };

  const getCurrentItemProductCost = () => {
    let result = 0;

    surfaceProductionRatesState[surface_id]['surface_actions'].map((a) => {
      if (surfaceId) {
        if (
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][a.id] &&
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][a.id]['selected']
        ) {
          const productionRate = surfaceProductionRatesState[surface_id][
            'surface_products_production_rates'
          ].find((pr) => pr.action_id == a.id && pr.default_product);

          if (productionRate) {
            const defaultProdId = productionRate['product_id'];
            result =
              result +
              parseFloat(eval(formula) / productionRate['pupo']) *
                productState[a.id][defaultProdId]['cost_after_markup'];
          }
        }
      } else {
        if (
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][a.id] &&
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][a.id]['selected']
        ) {
          const productionRate = surfaceProductionRatesState[surface_id][
            'surface_products_production_rates'
          ].find((pr) => pr.action_id == a.id && pr.default_product);

          if (productionRate) {
            const defaultProdId = productionRate['product_id'];
            result =
              result +
              parseFloat(eval(formula) / productionRate['pupo']) *
                productState[a.id][defaultProdId]['cost_after_markup'];
          }
        }
      }
    });

    return isNaN(result) ? 0 : result;
  };
  return (
    <OtherFieldWrapper>
      <DisableTyp fontFamily="Medium">
        {`$${(
          lineItemsTotalCost() +
          getTotalProductCost(
            surfaceProductionRatesState,
            productState,
            appState,
            parentRoomId,
            roomId,
            parentSurfaceId,
            surfaceId
          )
        ).toFixed(2)}`}
      </DisableTyp>
      <HtmlTooltip
        title={
          <Grid container>
            <Grid item xs={6}>
              <LabelWrapper>
                <ContentTyp>Current item cost:</ContentTyp>
              </LabelWrapper>
            </Grid>

            <Grid item xs={6}>
              <ContentWrapper>
                <ContentTyp>
                  {` $${(
                    getLaborCost(
                      surfaceProductionRatesState,
                      formula,
                      surface_id,
                      appState,
                      parentRoomId,
                      roomId,
                      parentSurfaceId,
                      surfaceId,
                      hourlyRate
                    ) + getCurrentItemProductCost()
                  ).toFixed(2)}`}
                </ContentTyp>
              </ContentWrapper>
            </Grid>

            <Grid item xs={6}>
              <LabelWrapper>
                <ContentTyp>Product Cost:</ContentTyp>
              </LabelWrapper>
            </Grid>
            <Grid item xs={6}>
              <ContentWrapper>
                <ContentTyp>
                  {` $${getTotalProductCost(
                    surfaceProductionRatesState,
                    productState,
                    appState,
                    parentRoomId,
                    roomId,
                    parentSurfaceId,
                    surfaceId
                  ).toFixed(2)}`}
                </ContentTyp>
              </ContentWrapper>
            </Grid>
            <Grid item xs={6}>
              <LabelWrapper>
                <ContentTyp>Labor Cost:</ContentTyp>
              </LabelWrapper>
            </Grid>
            <Grid item xs={6}>
              <ContentWrapper>
                <ContentTyp>
                  {` $${lineItemsTotalCost().toFixed(2)}`}
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
