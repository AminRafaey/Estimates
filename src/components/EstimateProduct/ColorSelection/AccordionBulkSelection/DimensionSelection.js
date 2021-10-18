import React, { useEffect, useState } from 'react';
import {
  TextField,
  withStyles,
  styled,
  Box,
  Typography,
  Chip,
} from '@material-ui/core';
import { Checkbox } from '../../../UI';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {
  useAppState,
  useAppDispatch,
  addManufacturer,
  removeManufacturer,
} from '../../../../Context/AppContext';

import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
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
    width: '35%',
    '& .MuiFormControl-root': {},
    '& .MuiInputBase-root': {
      background: '#ffff',
    },
  },
})(Autocomplete);

export default function DimensionSelection(props) {
  const { bulkSelectionArr, selected, commonColor, bulkType } = props;

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [textFieldVal, setTextFieldVal] = useState('');

  const appState = useAppState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    let arr = [{ default: true, name: 'Default' }];
    bulkSelectionArr.map((b) => {
      const surface_id = b.surfaceId
        ? appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['surface_id']
        : appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surface_id'];

      const action = b.surfaceId
        ? appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][b.actionId]
        : appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][b.actionId];

      arr.push({
        name: Object.keys(
          surfaceProductionRatesState[surface_id]['surface_fields']
        ).reduce(
          (accumaltor, fieldKey, i) =>
            accumaltor +
            ((i !== 0 ? ', ' : '') +
              surfaceProductionRatesState[surface_id]['surface_fields'][
                fieldKey
              ]['name']
                .charAt(0)
                .toUpperCase() +
              ' : ' +
              action['dimensions'][b.dimensionKey][
                surfaceProductionRatesState[surface_id]['surface_fields'][
                  fieldKey
                ]['name']
              ]),
          ''
        ),
        ...b,
      });
    });
    setOptions(arr);
  }, [selected, commonColor]);

  const handleOnChange = (option, checkedStatus) => {
    if (!checkedStatus) {
      const products = option.surfaceId
        ? appState[option.parentRoomId]['bedrooms'][option.roomId]['surfaces'][
            option.parentSurfaceId
          ]['surfaces'][option.surfaceId]['actions'][option.actionId][
            'dimensions'
          ][option.dimensionKey]['products']
        : appState[option.parentRoomId]['bedrooms'][option.roomId]['surfaces'][
            option.parentSurfaceId
          ]['actions'][option.actionId]['dimensions'][option.dimensionKey][
            'products'
          ];

      removeManufacturer(appDispatch, {
        parentRoomId: option.parentRoomId,
        roomId: option.roomId,
        parentSurfaceId: option.parentSurfaceId,
        surfaceId: option.surfaceId,
        actionId: option.actionId,
        dimensionKey: option.dimensionKey,
        productId: Object.keys(products).find(
          (productId) => products[productId]['has_coats']
        ),
      });
    } else {
      const { rooms, ...rest } = commonColor;
      const products = option.surfaceId
        ? appState[option.parentRoomId]['bedrooms'][option.roomId]['surfaces'][
            option.parentSurfaceId
          ]['surfaces'][option.surfaceId]['actions'][option.actionId][
            'dimensions'
          ][option.dimensionKey]['products']
        : appState[option.parentRoomId]['bedrooms'][option.roomId]['surfaces'][
            option.parentSurfaceId
          ]['actions'][option.actionId]['dimensions'][option.dimensionKey][
            'products'
          ];

      addManufacturer(appDispatch, {
        parentRoomId: option.parentRoomId,
        roomId: option.roomId,
        parentSurfaceId: option.parentSurfaceId,
        surfaceId: option.surfaceId,
        actionId: option.actionId,
        dimensionKey: option.dimensionKey,
        productId: Object.keys(products).find(
          (productId) => products[productId]['has_coats']
        ),
        prodFeatureId: rest.id,
        prodFeatureVal: rest,
      });
    }
  };

  const handleBulkSelectionClick = (status) => {
    options.map((o) => {
      if (!o.default) {
        handleOnChange(o, status);
      }
    });
  };

  const getCheckboxState = (option) => {
    let found = false;
    Object.keys(commonColor['rooms']).map((roomId) => {
      Object.keys(commonColor['rooms'][roomId]['dimensions']).map(
        (dimensionId) => {
          const dimension =
            commonColor['rooms'][roomId]['dimensions'][dimensionId];
          if (
            dimension.parentRoomId === option.parentRoomId &&
            dimension.roomId === option.roomId &&
            dimension.parentSurfaceId === option.parentSurfaceId &&
            dimension.surfaceId === option.surfaceId &&
            dimension.dimensionKey === option.dimensionKey
          ) {
            found = true;
          }
        }
      );
    });
    if (found) {
      return 'checked';
    } else {
      return 'unchecked';
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
          const status = getCheckboxState(selectedOption);

          handleOnChange(selectedOption, status === 'unchecked');
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
      value={options.filter((o) =>
        o.default ? false : getCheckboxState(o) !== 'unchecked'
      )}
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

        const status = getCheckboxState(option);

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              color="primary"
              checked={status === 'checked'}
              indeterminate={status === 'indeterminate'}
              onChange={(e) => {
                handleOnChange(
                  option,
                  status === 'indeterminate' ? false : e.target.checked
                );
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
      renderTags={() => (
        <Chip
          style={{ maxWidth: '75%', height: 24 }}
          label={
            options.filter((o) => getCheckboxState(o) !== 'unchecked').length +
            ' Meas. selected'
          }
        />
      )}
      renderInput={(params, val) => {
        return (
          <TextField
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
