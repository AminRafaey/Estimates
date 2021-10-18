import React from 'react';
import { Box, styled } from '@material-ui/core';

import { useColorState } from '../../../../Context/Color';
import { default as Menufacturar } from './AutoComplete';
import { default as ColorSelect } from './AutoComplete';
import Pallete from '../Pallete';
const AutoCompleteGroupWrapper = styled(Box)({
  width: '100%',
  display: 'flex',
});

const PalleteReplacementWrapper = styled(Box)({
  height: 20,
  width: 20,
  marginRight: 10,
});
export default function SelectRow(props) {
  const {
    bulkSelectionArr,
    setBulkSelectionArr,
    bulkType,
    globalBulkSelectionArr,
    setGlobalBulkSelectionArr,
    setCommonColor,
    commonColor,
  } = props;
  const colorState = useColorState();

  const commonProps = {
    commonColor,
    bulkSelectionArr,
    setCommonColor,
    bulkType,
    globalBulkSelectionArr,
    setGlobalBulkSelectionArr,
    setBulkSelectionArr,
  };

  return (
    <AutoCompleteGroupWrapper>
      <Menufacturar
        options={Object.keys(colorState).map((m) => ({
          name: colorState[m].name,
          id: colorState[m].name,
        }))}
        selected={
          commonColor['colorManufacturer']
            ? commonColor['colorManufacturer'].id
            : undefined
        }
        type={'colorManufacturer'}
        {...commonProps}
      />

      {commonColor['colorManufacturer'] &&
      commonColor['colorManufacturer']['color'] &&
      commonColor['colorManufacturer']['color']['id'] ? (
        <Pallete
          backgroundColor={
            commonColor['colorManufacturer']['color']['hex_code']
          }
        />
      ) : (
        <PalleteReplacementWrapper />
      )}

      <ColorSelect
        options={
          commonColor['colorManufacturer']
            ? Object.keys(
                colorState[commonColor['colorManufacturer']['id']]['colors']
              ).map((cId) => ({
                colorManufacturer: {
                  id: commonColor['colorManufacturer']['id'],
                  name: commonColor['colorManufacturer']['id'],
                },
                name:
                  colorState[commonColor['colorManufacturer']['id']]['colors'][
                    cId
                  ]['color_name'],
                ...colorState[commonColor['colorManufacturer']['id']]['colors'][
                  cId
                ],
              }))
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
          commonColor['colorManufacturer']
            ? commonColor['colorManufacturer']['color']
              ? commonColor['colorManufacturer']['color']['id']
              : undefined
            : undefined
        }
        type={'color'}
        {...commonProps}
      />
    </AutoCompleteGroupWrapper>
  );
}
