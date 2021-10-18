import React from 'react';
import { styled, Box } from '@material-ui/core';

import { useAppDispatch, useAppState } from '../../../../Context/AppContext';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import { useColorState } from '../../../../Context/Color';
import { default as Menufacturar } from './AutoComplete';
import { default as ColorSelect } from './AutoComplete';
import Pallete from '../Pallete';
import RoomSelection from './RoomSelection';
import SurfaceSelection from './SurfaceSelection';
import DimensionSelection from './DimensionSelection';
const AutoCompleteGroupWrapper = styled(Box)({
  paddingBottom: 10,
});
const AutoCompleteGroupInnerWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end',
});

const PalleteReplacementWrapper = styled(Box)({
  height: 20,
  width: 20,
  marginRight: 10,
});
export default function SelectRow(props) {
  const {
    bulkSelectionArr,
    commonColor,
    commonColors,
    bulkType,
    surface_id,
    actionId,
  } = props;
  const appState = useAppState();
  const appDispatch = useAppDispatch();

  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const commonProps = {
    bulkSelectionArr,
    commonColors,
    commonColor,
    bulkType,
  };
  const colorState = useColorState();

  return (
    <AutoCompleteGroupWrapper>
      <AutoCompleteGroupInnerWrapper>
        <Menufacturar
          options={Object.keys(colorState).map((m) => ({
            name: colorState[m].name,
            id: colorState[m].name,
          }))}
          selected={commonColor['id'] ? commonColor.id : undefined}
          type={'colorManufacturer'}
          {...commonProps}
        />

        {commonColor['id'] && commonColor['colorId'] ? (
          <Pallete backgroundColor={commonColor['color']['hex_code']} />
        ) : (
          <PalleteReplacementWrapper />
        )}

        <ColorSelect
          options={
            commonColor['id']
              ? Object.keys(colorState[commonColor['id']]['colors']).map(
                  (cId) => ({
                    colorManufacturer: {
                      id: commonColor['id'],
                      name: commonColor['id'],
                    },
                    name:
                      colorState[commonColor['id']]['colors'][cId][
                        'color_name'
                      ],
                    ...colorState[commonColor['id']]['colors'][cId],
                  })
                )
              : Object.keys(colorState)
                  .map((m) =>
                    Object.keys(colorState[m]['colors']).map((cId) => ({
                      colorManufacturer: { id: m, name: m },
                      name: colorState[m]['colors'][cId]['color_name'],
                      ...colorState[m]['colors'][cId],
                    }))
                  )
                  .flat()
          }
          selected={
            commonColor
              ? commonColor['color']
                ? commonColor['color']['id']
                : undefined
              : undefined
          }
          type={'color'}
          {...commonProps}
        />
        {bulkType === 'actionBar' && (
          <SurfaceSelection
            bulkSelectionArr={bulkSelectionArr}
            selected={commonColor.rooms}
            commonColor={commonColor}
            {...commonProps}
          />
        )}

        {bulkType === 'accordion' && (
          <RoomSelection
            bulkSelectionArr={bulkSelectionArr}
            selected={commonColor.rooms}
            commonColor={commonColor}
            {...commonProps}
          />
        )}
        {bulkType === 'room-specific-accordion' && (
          <DimensionSelection
            bulkSelectionArr={bulkSelectionArr}
            selected={commonColor.rooms}
            commonColor={commonColor}
            {...commonProps}
          />
        )}
      </AutoCompleteGroupInnerWrapper>
    </AutoCompleteGroupWrapper>
  );
}
