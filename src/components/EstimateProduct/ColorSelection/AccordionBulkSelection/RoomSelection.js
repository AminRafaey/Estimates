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

export default function RoomSelection(props) {
  const { bulkSelectionArr, selected, commonColor, bulkType } = props;

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [textFieldVal, setTextFieldVal] = useState('');

  const appState = useAppState();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    let arr = [{ default: true, name: 'Default' }];
    bulkSelectionArr.map((b) => {
      if (!arr.find((a) => a.parent_id == b.parentRoomId && a.id == b.roomId)) {
        arr.push({
          ...appState[b.parentRoomId]['bedrooms'][b.roomId],
          ...(appState[b.parentRoomId]['name'] !== 'No Room Category' && {
            parent_name: appState[b.parentRoomId]['name'],
          }),
          parent_id: b.parentRoomId,
          id: b.roomId,
        });
      }
    });

    setOptions(arr);
  }, [selected, commonColor]);

  const handleOnChange = (parentRoomId, roomId, checkedStatus) => {
    if (!checkedStatus) {
      if (!commonColor.rooms[roomId]) return;
      Object.keys(commonColor.rooms[roomId]['dimensions']).map((dim) => {
        const dimension = commonColor.rooms[roomId]['dimensions'][dim];

        const products = dimension.surfaceId
          ? appState[dimension.parentRoomId]['bedrooms'][dimension.roomId][
              'surfaces'
            ][dimension.parentSurfaceId]['surfaces'][dimension.surfaceId][
              'actions'
            ][dimension.actionId]['dimensions'][dimension.dimensionKey][
              'products'
            ]
          : appState[dimension.parentRoomId]['bedrooms'][dimension.roomId][
              'surfaces'
            ][dimension.parentSurfaceId]['actions'][dimension.actionId][
              'dimensions'
            ][dimension.dimensionKey]['products'];

        removeManufacturer(appDispatch, {
          parentRoomId: dimension.parentRoomId,
          roomId: dimension.roomId,
          parentSurfaceId: dimension.parentSurfaceId,
          surfaceId: dimension.surfaceId,
          actionId: dimension.actionId,
          dimensionKey: dimension.dimensionKey,
          productId: Object.keys(products).find(
            (productId) => products[productId]['has_coats']
          ),
        });
      });
    } else {
      bulkSelectionArr.map((dimension) => {
        if (dimension.roomId != roomId) {
          return;
        }

        const { rooms, ...rest } = commonColor;
        const products = dimension.surfaceId
          ? appState[dimension.parentRoomId]['bedrooms'][dimension.roomId][
              'surfaces'
            ][dimension.parentSurfaceId]['surfaces'][dimension.surfaceId][
              'actions'
            ][dimension.actionId]['dimensions'][dimension.dimensionKey][
              'products'
            ]
          : appState[dimension.parentRoomId]['bedrooms'][dimension.roomId][
              'surfaces'
            ][dimension.parentSurfaceId]['actions'][dimension.actionId][
              'dimensions'
            ][dimension.dimensionKey]['products'];

        addManufacturer(appDispatch, {
          parentRoomId: dimension.parentRoomId,
          roomId: dimension.roomId,
          parentSurfaceId: dimension.parentSurfaceId,
          surfaceId: dimension.surfaceId,
          actionId: dimension.actionId,
          dimensionKey: dimension.dimensionKey,
          productId: Object.keys(products).find(
            (productId) => products[productId]['has_coats']
          ),
          prodFeatureId: rest.id,
          prodFeatureVal: rest,
        });
      });
    }
  };

  const handleBulkSelectionClick = (status) => {
    options.map((o) => {
      if (!o.default) {
        handleOnChange(o.parent_id, o.id, status);
      }
    });
  };

  const getCheckboxState = (option) => {
    let actualDimensions = 0;
    if (bulkType === 'actionBar') {
      actualDimensions = bulkSelectionArr.filter((b) => b.roomId == option.id)
        .length;
    } else {
      commonColor['rooms'][option.id] &&
        (actualDimensions =
          commonColor['rooms'][option.id]['actualDimensions']);
    }

    const availableDimensions = commonColor['rooms'][option.id]
      ? Object.entries(commonColor['rooms'][option.id]['dimensions']).length
      : 0;

    if (availableDimensions > 0 && actualDimensions === availableDimensions) {
      return 'checked';
    } else if (
      actualDimensions !== availableDimensions &&
      availableDimensions > 0
    ) {
      return 'indeterminate';
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

          handleOnChange(
            selectedOption.parent_id,
            selectedOption.id,
            status === 'unchecked'
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
                  option.parent_id,
                  option.id,
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
            ' Room(s) selected'
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
