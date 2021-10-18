import React, { createRef, useState } from 'react';

import {
  TextField,
  withStyles,
  styled,
  Box,
  Typography,
} from '@material-ui/core';
import { default as MuiAutocomplete } from '@material-ui/lab/Autocomplete';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {
  useAppState,
  useAppDispatch,
  addProduct,
  removeProduct,
  addProductInParentLessNode,
  addComponent,
  addSheen,
  removeSheen,
  removeComponent,
} from '../../../Context/AppContext';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
import { useProductState } from '../../../Context/ProductContext';
const AutoCompleteNameTyp = styled(Typography)({
  fontSize: 14,
  color: '#ffff',
  paddingBottom: 5,
});
const AutoCompleteWrapper = styled(Box)({
  paddingRight: 15,
  width: '22%',
});
const StyledAutoComplete = withStyles({
  root: {
    '& .MuiInputBase-root': {
      background: '#ffff',
    },
  },
})(MuiAutocomplete);

export default function AutoComplete(props) {
  const {
    options,
    selected,
    type,
    productId,
    bulkSelectionArr,
    bulkType,
    setSelectedProduct,
    selectedProduct,
  } = props;
  const [open, setOpen] = useState(false);
  const multiSelectTextRef = createRef();
  const appDispatch = useAppDispatch();
  const appState = useAppState();
  const productState = useProductState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const [inputValue, setInputValue] = useState('');
  const handleOnProductChange = (selectedProduct) => {
    if (!selectedProduct) {
      setSelectedProduct({});
    } else {
      const { components, sheens, ...rest } = productState[
        bulkSelectionArr[0]['actionId']
      ][selectedProduct.id];
      setSelectedProduct(rest);
    }
  };
  const handleOnComponentChange = (selectedComponent) => {
    if (!selectedComponent) {
      const selectedProductTemp = { ...selectedProduct };
      delete selectedProductTemp['component'];
      setSelectedProduct(selectedProductTemp);
    } else {
      const selectedProductTemp = { ...selectedProduct };
      selectedProductTemp['component'] = selectedComponent;
      setSelectedProduct(selectedProductTemp);
    }
  };
  const handleOnSheenChange = (selectedSheen) => {
    if (!selectedSheen) {
      const selectedProductTemp = { ...selectedProduct };
      delete selectedProductTemp['sheen'];
      setSelectedProduct(selectedProductTemp);
    } else {
      const selectedProductTemp = { ...selectedProduct };
      selectedProductTemp['sheen'] = selectedSheen;
      setSelectedProduct(selectedProductTemp);
    }
  };
  return (
    <AutoCompleteWrapper>
      <AutoCompleteNameTyp
        style={{
          ...((bulkType === 'all-room-accordion' ||
            bulkType === 'room-specific-accordion' ||
            bulkType === 'accordion') && {
            color: 'rgba(0,0,0,0.85)',
            paddingLeft: 4,
          }),
        }}
      >{`Select ${type}`}</AutoCompleteNameTyp>
      <StyledAutoComplete
        size="small"
        autoHighlight
        openOnFocus
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        getOptionLabel={(option) => option.name}
        options={options ? options : []}
        blurOnSelect={false}
        onChange={(e, value) => {
          if (type === 'Component') {
            handleOnComponentChange(value);
          } else if (type === 'Sheen') {
            handleOnSheenChange(value);
          } else {
            handleOnProductChange(value);
          }
        }}
        value={
          options.find((o) => o.id == selected)
            ? options.find((o) => o.id == selected)
            : null
        }
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderOption={(option, { selected, inputValue }) => {
          const matches = match(option.name, inputValue);
          const parts = parse(option.name, matches);
          return (
            <div>
              {parts.map((part, index) => {
                return (
                  <span
                    key={index}
                    style={{ ...(part.highlight && { color: '#1488FC' }) }}
                  >
                    {part.text}
                  </span>
                );
              })}
            </div>
          );
        }}
        renderInput={(params, val) => {
          return (
            <TextField
              ref={multiSelectTextRef}
              {...params}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
              }}
            />
          );
        }}
      />
    </AutoCompleteWrapper>
  );
}
