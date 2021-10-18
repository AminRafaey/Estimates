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

export default function SurfaceSelection(props) {
  const { bulkSelectionArr, selected, commonProduct, removeRow } = props;

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
      const surface_id = b.surfaceId
        ? appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['surface_id']
        : appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surface_id'];

      if (
        !arr.find(
          (a) =>
            a.parentSurfaceId == b.parentSurfaceId && a.surfaceId == b.surfaceId
        ) &&
        surfaceProductionRatesState[surface_id][
          'surface_products_production_rates'
        ].find(
          (p) => p.action_id == b.actionId && p.product_id == commonProduct.id
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
  }, [selected, commonProduct]);

  const handleOnChange = (parentSurfaceId, surfaceId, checkedStatus) => {
    bulkSelectionArr.map((b) => {
      if (b.parentSurfaceId == parentSurfaceId && b.surfaceId == surfaceId) {
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

        const { components, sheens, ...rest } = productState[b.actionId][
          commonProduct.id
        ];
        if (b.surfaceId) {
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
              position: position,

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
        } else {
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

              position: position,
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
            selectedOption.surfaceId,
            true
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
                handleOnChange(option.parentSurfaceId, option.surfaceId, true);
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
