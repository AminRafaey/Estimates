import React, { createRef, useState } from 'react';

import { TextField, withStyles, styled, Box } from '@material-ui/core';

import { default as MuiAutocomplete } from '@material-ui/lab/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {
  useAppDispatch,
  addManufacturer,
  addColor,
  removeColor,
  removeManufacturer,
} from '../../../../Context/AppContext';
const Pallete = styled(Box)({
  height: 14,
  width: 14,
  borderRadius: 4,
  alignSelf: 'center',
  marginRight: 10,
});
const StyledAutoComplete = withStyles({
  root: {
    '& .MuiFormControl-root': {},
    '& .MuiInputBase-root': {
      background: '#ffff',
    },
  },
})(MuiAutocomplete);

const StyledAutoCompleteForColor = withStyles({
  root: {
    '& .MuiFormControl-root': {},
    '& .MuiInputBase-root': {
      background: '#ffff',
    },
  },
  paper: {
    width: '200px',
  },
})(MuiAutocomplete);
const filterOptions = createFilterOptions({
  matchFrom: 'any',
  limit: 100,
});

export default function AutoComplete(props) {
  const {
    options,
    selected,
    type,
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    actionId,
    productId,
    dimensionKey,
    bulkSelectionArr,
    setBulkSelectionArr,
  } = props;
  const TagName =
    type === 'color' ? StyledAutoCompleteForColor : StyledAutoComplete;
  const [open, setOpen] = useState(false);
  const multiSelectTextRef = createRef();
  const appDispatch = useAppDispatch();

  const handleOnManufacturerChange = (selectedManufacturer) => {
    addManufacturer(appDispatch, {
      parentRoomId,
      roomId,
      parentSurfaceId,
      surfaceId,
      actionId,
      dimensionKey,
      productId,
      prodFeatureId: selectedManufacturer.id,
      prodFeatureVal: selectedManufacturer,
    });
  };

  const handleOnColorChange = (selectedColor) => {
    const colorManufacturer = selectedColor['colorManufacturer'];
    delete selectedColor['colorManufacturer'];
    addColor(appDispatch, {
      parentRoomId,
      roomId,
      parentSurfaceId,
      surfaceId,
      actionId,
      dimensionKey,
      productId,
      prodFeatureId: selectedColor.id,
      prodFeatureVal: {
        color: { ...selectedColor },
        id: colorManufacturer.id,
        name: colorManufacturer.name,
      },
    });
  };

  const handleClear = () => {
    if (type === 'colorManufacturer') {
      removeManufacturer(appDispatch, {
        parentRoomId,
        roomId,
        parentSurfaceId,
        surfaceId,
        actionId,
        dimensionKey,
        productId,
      });
    } else if (type === 'color') {
      removeColor(appDispatch, {
        parentRoomId,
        roomId,
        parentSurfaceId,
        surfaceId,
        actionId,
        dimensionKey,
        productId,
      });
    }
  };
  return (
    <TagName
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
      filterOptions={filterOptions}
      blurOnSelect={false}
      onChange={(e, value) => {
        if (value === null) {
          handleClear();
        } else if (type === 'colorManufacturer') {
          handleOnManufacturerChange(value);
        } else if (type === 'color') {
          handleOnColorChange(value);
        }
      }}
      value={
        options.find((o) => o.id === selected)
          ? options.find((o) => o.id === selected)
          : null
      }
      {...(type === 'colorManufacturer' && {
        renderOption: (option, { selected, inputValue }) => {
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
        },
      })}
      {...(type === 'color' && {
        renderOption: (option, { selected, inputValue }) => {
          const matches = match(option.name, inputValue);
          const parts = parse(option.name, matches);
          return (
            <div>
              <Box display="flex">
                <Pallete style={{ background: option['hex_code'] }} />
                {option.color_code + ':'}
              </Box>
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
        },
      })}
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
  );
}
