import React, { useEffect, useState } from 'react';
import {
  TextField,
  withStyles,
  Chip,
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
  removeProduct,
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

export default function SurfaceSelection(props) {
  const { bulkSelectionArr, selected, commonProduct } = props;

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
          (p) =>
            p.action_id == b.actionId && p.product_id == commonProduct.productId
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
    if (!checkedStatus) {
      bulkSelectionArr.map((b) => {
        if (b.parentSurfaceId == parentSurfaceId && b.surfaceId == surfaceId) {
          removeProduct(appDispatch, {
            parentRoomId: b.parentRoomId,
            roomId: b.roomId,
            parentSurfaceId: b.parentSurfaceId,
            surfaceId: b.surfaceId,
            actionId: b.actionId,
            dimensionKey: b['dimensionKey'],
            newProductId: commonProduct.productId,
          });
        }
      });
    } else {
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
                      action['dimensions'][b.dimensionKey]['products'][
                        productId
                      ]['position']
                  )
                ) + 1
              : 0;

          const { components, sheens, ...rest } = productState[b.actionId][
            commonProduct.productId
          ];
          if (b.surfaceId) {
            addProduct(appDispatch, {
              parentRoomId: b.parentRoomId,
              roomId: b.roomId,
              parentSurfaceId: b.parentSurfaceId,
              surfaceId: b.surfaceId,
              actionId: b.actionId,
              dimensionKey: b.dimensionKey,
              newProductId: commonProduct.productId,
              surfaceProductionRatesState,
              newProduct: {
                ...rest,
                position: position,

                ...(commonProduct.componentId && {
                  component: {
                    id: commonProduct.componentId,
                    name: commonProduct.componentName,
                  },
                }),
                ...(commonProduct.sheenId && {
                  sheen: {
                    id: commonProduct.sheenId,
                    name: commonProduct.sheenName,
                  },
                }),
              },
            });

            updateDimension(appDispatch, {
              parentRoomId: b.parentRoomId,
              roomId: b.roomId,
              parentSurfaceId: b.parentSurfaceId,
              surfaceId: b.surfaceId,

              newAction: {
                id: b.actionId,
              },
              dimensionKey: b.dimensionKey,
              fieldName: 'no_of_coats',
              fieldValue: commonProduct.no_of_coats,
            });
          } else {
            addProductInParentLessNode(appDispatch, {
              parentRoomId: b.parentRoomId,
              roomId: b.roomId,
              parentSurfaceId: b.parentSurfaceId,
              actionId: b.actionId,
              dimensionKey: b.dimensionKey,
              newProductId: commonProduct.productId,
              surfaceProductionRatesState,
              newProduct: {
                ...rest,

                position: position,
                ...(commonProduct.componentId && {
                  component: {
                    id: commonProduct.componentId,
                    name: commonProduct.componentName,
                  },
                }),
                ...(commonProduct.sheenId && {
                  sheen: {
                    id: commonProduct.sheenId,
                    name: commonProduct.sheenName,
                  },
                }),
              },
            });

            updateDimension(appDispatch, {
              parentRoomId: b.parentRoomId,
              roomId: b.roomId,
              parentSurfaceId: b.parentSurfaceId,
              surfaceId: b.surfaceId,

              newAction: {
                id: b.actionId,
              },
              dimensionKey: b.dimensionKey,
              fieldName: 'no_of_coats',
              fieldValue: commonProduct.no_of_coats,
            });
          }
        }
      });
    }
  };
  const handleBulkSelectionClick = (status) => {
    options.map((o) => {
      if (!o.default) {
        handleOnChange(o.parentSurfaceId, o.surfaceId, status);
      }
    });
  };
  const getCheckboxState = (option) => {
    const actualDimensions = bulkSelectionArr.filter(
      (b) =>
        b.parentSurfaceId == option.parentSurfaceId &&
        b.surfaceId == option.surfaceId
    ).length;

    let availableDimensions = 0;

    Object.keys(commonProduct['rooms']).map((roomId) => {
      Object.keys(commonProduct['rooms'][roomId]['dimensions']).map((dId) => {
        if (
          commonProduct['rooms'][roomId]['dimensions'][dId][
            'parentSurfaceId'
          ] == option.parentSurfaceId &&
          commonProduct['rooms'][roomId]['dimensions'][dId]['surfaceId'] ==
            option.surfaceId
        ) {
          availableDimensions += 1;
        }
      });
    });
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
            selectedOption.parentSurfaceId,
            selectedOption.surfaceId,
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
                  option.parentSurfaceId,
                  option.surfaceId,
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
          style={{ maxWidth: '70%', height: 24 }}
          label={
            options.filter((o) => getCheckboxState(o) !== 'unchecked').length +
            ' Surface(s) selected'
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
