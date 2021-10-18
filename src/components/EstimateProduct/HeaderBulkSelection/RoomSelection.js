import React, { useEffect, useState } from 'react';
import {
  TextField,
  withStyles,
  styled,
  Box,
  Typography,
} from '@material-ui/core';
import { Checkbox } from '../../UI';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {
  useAppState,
  useAppDispatch,
  addProduct,
  addProductInParentLessNode,
  updateDimension,
} from '../../../Context/AppContext';
import { useProductState } from '../../../Context/ProductContext';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
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

export default function RoomSelection(props) {
  const {
    bulkSelectionArr,
    selected,
    commonProduct,
    bulkType,
    removeRow,
  } = props;

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [textFieldVal, setTextFieldVal] = useState('');
  const productState = useProductState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();

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
  }, [selected, commonProduct]);

  const handleOnChange = (parentRoomId, roomId, checkedStatus) => {
    bulkSelectionArr.map((b) => {
      if (b.roomId != roomId) {
        return;
      }
      let action;
      b.surfaceId
        ? (action =
            appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['surfaces'][b.surfaceId]['actions'][b.actionId])
        : (action =
            appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['actions'][b.actionId]);

      let position =
        Object.entries(action['dimensions'][b.dimensionKey]['products'])
          .length > 0
          ? Math.max(
              ...Object.keys(
                action['dimensions'][b.dimensionKey]['products']
              ).map(
                (productId) =>
                  action['dimensions'][b.dimensionKey]['products'][productId][
                    'position'
                  ]
              )
            ) + 1
          : 0;

      const surface_id = b.surfaceId
        ? appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['surface_id']
        : appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surface_id'];

      const { components, sheens, ...rest } = productState[b.actionId][
        commonProduct.id
      ];

      if (b.surfaceId) {
        if (
          surfaceProductionRatesState[surface_id][
            'surface_products_production_rates'
          ].find(
            (p) => p.action_id == b.actionId && p.product_id == commonProduct.id
          )
        ) {
          addProduct(appDispatch, {
            parentRoomId: b.parentRoomId,
            roomId: b.roomId,
            parentSurfaceId: b.parentSurfaceId,
            surfaceId: b.surfaceId,
            actionId: b.actionId,
            dimensionKey: b.dimensionKey,
            newProductId: commonProduct.id,
            surfaceProductionRatesState,
            newProduct: {
              ...rest,
              position,

              ...(commonProduct.component && {
                component: {
                  ...commonProduct.component,
                },
              }),
              ...(commonProduct.sheen && {
                sheen: {
                  ...commonProduct.sheen,
                },
              }),
            },
          });
        }
      } else {
        if (
          surfaceProductionRatesState[surface_id][
            'surface_products_production_rates'
          ].find(
            (p) => p.action_id == b.actionId && p.product_id == commonProduct.id
          )
        ) {
          addProductInParentLessNode(appDispatch, {
            parentRoomId: b.parentRoomId,
            roomId: b.roomId,
            parentSurfaceId: b.parentSurfaceId,
            actionId: b.actionId,
            dimensionKey: b.dimensionKey,
            newProductId: commonProduct.id,
            surfaceProductionRatesState,
            newProduct: {
              ...rest,
              position,
              ...(commonProduct.component && {
                component: {
                  ...commonProduct.component,
                },
              }),
              ...(commonProduct.sheen && {
                sheen: {
                  ...commonProduct.sheen,
                },
              }),
            },
          });
        }
      }
    });
    removeRow();
  };
  const handleBulkSelectionClick = (status) => {
    if (status) {
      options.map((o) => {
        if (!o.default) {
          handleOnChange(o.parent_id, o.id, status);
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
          handleOnChange(selectedOption.parent_id, selectedOption.id, true);
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
                handleOnChange(option.parent_id, option.id, true);
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
            label="Select Rooms"
            InputProps={{
              ...params.InputProps,
            }}
          />
        );
      }}
    />
  );
}
