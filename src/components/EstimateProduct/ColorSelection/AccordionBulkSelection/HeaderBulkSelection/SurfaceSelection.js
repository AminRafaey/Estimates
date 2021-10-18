import React, { createRef, useEffect, useState } from 'react';
import {
  TextField,
  withStyles,
  styled,
  Box,
  Typography,
} from '@material-ui/core';
import { Checkbox } from '../../../../UI';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {
  useAppState,
  useAppDispatch,
  addManufacturer,
} from '../../../../../Context/AppContext';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
const BulkSelectionOptWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});
const BulkSelectionOptTyp = styled(Typography)({
  fontSize: 12,
  color: '#1488FC',
  '&:hover': {
    textDecoration: 'underline',
  },
});
const StyledAutoComplete = withStyles({
  root: {
    width: '24%',
    '& .MuiFormControl-root': {},
    '& .MuiInputBase-root': {
      background: '#ffff',
    },
  },
})(Autocomplete);

export default function SurfaceSelection(props) {
  const { bulkSelectionArr, selected, commonColor } = props;

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [textFieldVal, setTextFieldVal] = useState('');

  const appState = useAppState();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    let arr = [{ default: true, name: 'Default' }];
    bulkSelectionArr.map((b) => {
      if (
        !arr.find(
          (a) =>
            a.parentSurfaceId == b.parentSurfaceId && a.surfaceId == b.surfaceId
        )
      ) {
        arr.push({
          ...(b.surfaceId
            ? {
                ...appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
                  b.parentSurfaceId
                ]['surfaces'][b.surfaceId],
              }
            : {
                ...appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
                  b.parentSurfaceId
                ],
              }),
          parentSurfaceId: b.parentSurfaceId,
          surfaceId: b.surfaceId,
        });
      }
    });

    setOptions(arr);
  }, [selected, commonColor]);

  const handleOnChange = (parentSurfaceId, surfaceId) => {
    bulkSelectionArr.map((b) => {
      if (b.parentSurfaceId == parentSurfaceId && b.surfaceId == surfaceId) {
        const { rooms, ...rest } = commonColor;
        const products = b.surfaceId
          ? appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
              b.dimensionKey
            ]['products']
          : appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products'];

        addManufacturer(appDispatch, {
          parentRoomId: b.parentRoomId,
          roomId: b.roomId,
          parentSurfaceId: b.parentSurfaceId,
          surfaceId: b.surfaceId,
          actionId: b.actionId,
          dimensionKey: b.dimensionKey,
          productId: Object.keys(products).find(
            (productId) => products[productId]['has_coats']
          ),
          prodFeatureId: rest.id,
          prodFeatureVal: rest,
        });
      }
    });
  };
  const handleBulkSelectionClick = (status) => {
    if (status) {
      options.map((o) => {
        if (!o.default) {
          handleOnChange(o.parentSurfaceId, o.surfaceId, status);
        }
      });
    }
  };
  return (
    <StyledAutoComplete
      multiple
      closeIcon={false}
      autoHighlight
      openOnFocus
      size="small"
      disableCloseOnSelect
      onChange={(e, allValues, type, value) => {
        const selectedOption = value.option;
        if (!selectedOption.default) {
          handleOnChange(
            selectedOption.parentSurfaceId,
            selectedOption.surfaceId
          );
        }
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => {
        return option.selected;
      }}
      getOptionLabel={(option) => option.name}
      options={options}
      blurOnSelect={false}
      value={[]}
      filterOptions={(options, { inputValue, selected }) => {
        if (inputValue != '') {
          options = options.filter((option) =>
            option.name.toLowerCase().includes(inputValue.toLowerCase())
          );
          return options;
        } else return options;
      }}
      renderOption={(option, { selected, inputValue }) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);

        if (option.default) {
          return (
            <BulkSelectionOptWrapper>
              <BulkSelectionOptTyp
                onClick={() => handleBulkSelectionClick(true)}
              >
                Select All
              </BulkSelectionOptTyp>
              <BulkSelectionOptTyp
                onClick={() => handleBulkSelectionClick(false)}
              >
                UnSelect All
              </BulkSelectionOptTyp>
            </BulkSelectionOptWrapper>
          );
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              color="primary"
              checked={status === 'checked'}
              indeterminate={status === 'indeterminate'}
              onChange={(e) => {
                handleOnChange(option.parentSurfaceId, option.surfaceId);
              }}
            />
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
      inputValue={textFieldVal}
      onInputChange={(event, newInputValue, reason) => {
        setTextFieldVal(reason === 'input' ? newInputValue : textFieldVal);
      }}
      renderTags={() => {}}
      renderInput={(params, val) => {
        return (
          <TextField
            {...params}
            variant="outlined"
            label="Select Surfaces"
            InputProps={{
              ...params.InputProps,
            }}
          />
        );
      }}
    />
  );
}
