import React from 'react';
import { Box, styled } from '@material-ui/core';

import { useColorState } from '../../../../../Context/Color';
import { DeleteIcon } from '../../../../../resources';
import { default as Menufacturar } from './AutoComplete';
import { default as ColorSelect } from './AutoComplete';
import RoomSelection from './RoomSelection';
import DimensionSelection from './DimensionSelection';
import SurfaceSelection from './SurfaceSelection';
import Pallete from '../../Pallete';
const AutoCompleteGroupWrapper = styled(Box)({
  display: 'flex',
});
const PalleteReplacementWrapper = styled(Box)({
  height: 20,
  width: 20,
  marginRight: 10,
});

const IconWrapper = styled(Box)({
  padding: '5px',
  cursor: 'pointer',
});
export default function SelectRow(props) {
  const {
    bulkSelectionArr,
    setBulkSelectionArr,
    bulkType,
    globalBulkSelectionArr,
    setGlobalBulkSelectionArr,
    setSelectedColor,
    selectedColor,
    rows,
    setRows,
    index,
    showEmptyRow,
  } = props;
  const colorState = useColorState();

  const commonProps = {
    selectedColor,
    bulkSelectionArr,
    setSelectedColor,
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
        selected={selectedColor.id || undefined}
        type={'colorManufacturer'}
        {...commonProps}
      />
      {selectedColor['id'] && selectedColor['color'] ? (
        <Pallete backgroundColor={selectedColor['color']['hex_code']} />
      ) : (
        <PalleteReplacementWrapper />
      )}
      <ColorSelect
        options={Object.keys(colorState)
          .map((m) =>
            Object.keys(colorState[m]['colors']).map((cId) => ({
              colorManufacturer: { id: m, name: m },
              name: colorState[m]['colors'][cId]['color_name'],
              ...colorState[m]['colors'][cId],
            }))
          )
          .flat()}
        selected={selectedColor.color ? selectedColor.color.id : undefined}
        type={'color'}
        {...commonProps}
      />
      {!selectedColor.id && (index !== 0 || (index === 0 && !showEmptyRow)) && (
        <IconWrapper
          onClick={() => {
            rows.splice(index, 1);
            setRows([...rows]);
          }}
        >
          <DeleteIcon />
        </IconWrapper>
      )}
      {selectedColor.id && bulkType === 'accordion' && (
        <RoomSelection
          selected={{}}
          commonColor={selectedColor}
          {...commonProps}
        />
      )}
      {bulkType === 'actionBar' && selectedColor.id && (
        <SurfaceSelection
          selected={{}}
          commonColor={selectedColor}
          {...commonProps}
        />
      )}
      {bulkType === 'room-specific-accordion' && selectedColor.id && (
        <DimensionSelection
          selected={{}}
          commonColor={selectedColor}
          {...commonProps}
        />
      )}
    </AutoCompleteGroupWrapper>
  );
}
