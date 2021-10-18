import React from 'react';
import { styled, Box } from '@material-ui/core';
import AutoComplete from './AutoComplete';
import { DeleteIcon } from '../../../resources';
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
const IconWrapper = styled(Box)({
  padding: '5px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
});

export default function SelectRow(props) {
  const {
    bulkSelectionArr,
    estimateProductState,
    index,
    bulkType,
    setRows,
    rows,
    showEmptyRow,
    selectedProduct,
    setSelectedProduct,
    removeRow,
  } = props;
  const commonProps = {
    bulkSelectionArr,
    bulkType,
    index,
    setSelectedProduct,
    selectedProduct,
    removeRow,
  };
  return (
    <React.Fragment>
      <AutoCompleteGroupWrapper>
        <AutoCompleteGroupInnerWrapper>
          <AutoComplete
            type={'Product'}
            options={Object.keys(estimateProductState).map((productId) => ({
              id: productId,
              name: estimateProductState[productId]['name'],
            }))}
            selected={selectedProduct.id || undefined}
            {...commonProps}
          />
          <AutoComplete
            type={'Component'}
            options={
              selectedProduct.id
                ? estimateProductState[selectedProduct.id]['components']
                : []
            }
            selected={
              selectedProduct.component
                ? selectedProduct.component.id
                : undefined
            }
            productId={selectedProduct.id || undefined}
            {...commonProps}
          />
          <AutoComplete
            type={'Sheen'}
            options={
              selectedProduct.id
                ? estimateProductState[selectedProduct.id]['sheens']
                : []
            }
            selected={
              selectedProduct.sheen ? selectedProduct.sheen.id : undefined
            }
            productId={selectedProduct.id || undefined}
            {...commonProps}
          />
          {selectedProduct.id && <Box pr={2} width="10%" />}
          {bulkType === 'accordion' && selectedProduct.id && (
            <RoomSelection
              selected={{}}
              commonProduct={selectedProduct}
              {...commonProps}
            />
          )}
          {bulkType === 'actionBar' && selectedProduct.id && (
            <SurfaceSelection
              selected={{}}
              commonProduct={selectedProduct}
              {...commonProps}
            />
          )}
          {bulkType === 'room-specific-accordion' && selectedProduct.id && (
            <DimensionSelection
              selected={{}}
              commonProduct={selectedProduct}
              {...commonProps}
            />
          )}

          {!selectedProduct.id &&
            (index !== 0 || (index === 0 && !showEmptyRow)) && (
              <IconWrapper
                onClick={() => {
                  rows.splice(index, 1);
                  setRows([...rows]);
                }}
              >
                <DeleteIcon />
              </IconWrapper>
            )}
        </AutoCompleteGroupInnerWrapper>
      </AutoCompleteGroupWrapper>
    </React.Fragment>
  );
}
