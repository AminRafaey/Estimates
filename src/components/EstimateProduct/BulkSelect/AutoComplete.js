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
import { useProductState } from '../../../Context/ProductContext';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
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
  const { options, selected, type, productId, bulkType, commonProduct } = props;
  const [open, setOpen] = useState(false);
  const multiSelectTextRef = createRef();
  const appDispatch = useAppDispatch();
  const appState = useAppState();
  const productState = useProductState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const handleOnProductChange = (selectedProduct) => {
    if (!selectedProduct) {
      Object.keys(commonProduct.rooms).map((roomId) => {
        Object.keys(commonProduct.rooms[roomId]['dimensions']).map((dim) => {
          const dimension = commonProduct.rooms[roomId]['dimensions'][dim];
          removeProduct(appDispatch, {
            parentRoomId: dimension.parentRoomId,
            roomId: dimension.roomId,
            parentSurfaceId: dimension.parentSurfaceId,
            surfaceId: dimension.surfaceId,
            actionId: dimension.actionId,
            dimensionKey: dimension['dimensionKey'],
            newProductId: selected,
          });
        });
      });
    } else {
      Object.keys(commonProduct.rooms).map((roomId) => {
        Object.keys(commonProduct.rooms[roomId]['dimensions']).map((dim) => {
          const dimension = commonProduct.rooms[roomId]['dimensions'][dim];
          let action;
          dimension.surfaceId
            ? (action =
                appState[commonProduct.rooms[roomId].parentRoomId]['bedrooms'][
                  roomId
                ]['surfaces'][dimension.parentSurfaceId]['surfaces'][
                  dimension.surfaceId
                ]['actions'][dimension.actionId])
            : (action =
                appState[commonProduct.rooms[roomId].parentRoomId]['bedrooms'][
                  roomId
                ]['surfaces'][dimension.parentSurfaceId]['actions'][
                  dimension.actionId
                ]);

          let position = 0;
          selected
            ? (position =
                action['dimensions'][
                  commonProduct.rooms[roomId]['dimensions'][dim]['dimensionKey']
                ]['products'][selected]['position'])
            : (position =
                Object.entries(
                  action['dimensions'][
                    commonProduct.rooms[roomId]['dimensions'][dim][
                      'dimensionKey'
                    ]
                  ]['products']
                ).length > 0
                  ? Math.max(
                      ...Object.keys(
                        action['dimensions'][
                          commonProduct.rooms[roomId]['dimensions'][dim][
                            'dimensionKey'
                          ]
                        ]['products']
                      ).map(
                        (productId) =>
                          action['dimensions'][
                            commonProduct.rooms[roomId]['dimensions'][dim][
                              'dimensionKey'
                            ]
                          ]['products'][productId]['position']
                      )
                    ) + 1
                  : 0);

          selected &&
            removeProduct(appDispatch, {
              parentRoomId: dimension.parentRoomId,
              roomId: dimension.roomId,
              parentSurfaceId: dimension.parentSurfaceId,
              surfaceId: dimension.surfaceId,
              actionId: dimension.actionId,
              dimensionKey: dimension['dimensionKey'],
              newProductId: selected,
            });
          const { components, sheens, ...rest } = productState[
            dimension.actionId
          ][selectedProduct.id];
          if (dimension.surfaceId) {
            addProduct(appDispatch, {
              parentRoomId: dimension.parentRoomId,
              roomId: dimension.roomId,
              parentSurfaceId: dimension.parentSurfaceId,
              surfaceId: dimension.surfaceId,
              actionId: dimension.actionId,
              dimensionKey: dimension['dimensionKey'],
              newProductId: selectedProduct.id,
              surfaceProductionRatesState,
              newProduct: {
                timeStamp: commonProduct.timeStamp,
                ...rest,
                position,
              },
            });
          } else {
            addProductInParentLessNode(appDispatch, {
              parentRoomId: dimension.parentRoomId,
              roomId: dimension.roomId,
              parentSurfaceId: dimension.parentSurfaceId,
              surfaceId: dimension.surfaceId,
              actionId: dimension.actionId,
              dimensionKey: dimension['dimensionKey'],
              newProductId: selectedProduct.id,
              surfaceProductionRatesState,
              newProduct: {
                timeStamp: commonProduct.timeStamp,
                ...rest,
                position,
              },
            });
          }
        });
      });
    }
  };
  const handleOnComponentChange = (selectedComponent) => {
    if (!selectedComponent) {
      Object.keys(commonProduct.rooms).map((roomId) => {
        Object.keys(commonProduct.rooms[roomId]['dimensions']).map((dim) => {
          const dimension = commonProduct.rooms[roomId]['dimensions'][dim];
          removeComponent(appDispatch, {
            parentRoomId: dimension.parentRoomId,
            roomId: dimension.roomId,
            parentSurfaceId: dimension.parentSurfaceId,
            surfaceId: dimension.surfaceId,
            actionId: dimension.actionId,
            dimensionKey: dimension['dimensionKey'],
            newProductId: productId,
          });
        });
      });
    } else {
      Object.keys(commonProduct.rooms).map((roomId) => {
        Object.keys(commonProduct.rooms[roomId]['dimensions']).map((dim) => {
          const dimension = commonProduct.rooms[roomId]['dimensions'][dim];
          addComponent(appDispatch, {
            parentRoomId: dimension.parentRoomId,
            roomId: dimension.roomId,
            parentSurfaceId: dimension.parentSurfaceId,
            surfaceId: dimension.surfaceId,
            actionId: dimension.actionId,
            dimensionKey: dimension['dimensionKey'],
            newProductId: productId,
            prodFeatureId: selectedComponent.id,
            prodFeatureName: selectedComponent.name,
          });
        });
      });
    }
  };
  const handleOnSheenChange = (selectedSheen) => {
    if (!selectedSheen) {
      Object.keys(commonProduct.rooms).map((roomId) => {
        Object.keys(commonProduct.rooms[roomId]['dimensions']).map((dim) => {
          const dimension = commonProduct.rooms[roomId]['dimensions'][dim];
          removeSheen(appDispatch, {
            parentRoomId: dimension.parentRoomId,
            roomId: dimension.roomId,
            parentSurfaceId: dimension.parentSurfaceId,
            surfaceId: dimension.surfaceId,
            actionId: dimension.actionId,
            dimensionKey: dimension['dimensionKey'],
            newProductId: productId,
          });
        });
      });
    } else {
      Object.keys(commonProduct.rooms).map((roomId) => {
        Object.keys(commonProduct.rooms[roomId]['dimensions']).map((dim) => {
          const dimension = commonProduct.rooms[roomId]['dimensions'][dim];
          addSheen(appDispatch, {
            parentRoomId: dimension.parentRoomId,
            roomId: dimension.roomId,
            parentSurfaceId: dimension.parentSurfaceId,
            surfaceId: dimension.surfaceId,
            actionId: dimension.actionId,
            dimensionKey: dimension['dimensionKey'],
            newProductId: productId,
            prodFeatureId: selectedSheen.id,
            prodFeatureName: selectedSheen.name,
          });
        });
      });
    }
  };
  return (
    <AutoCompleteWrapper>
      <AutoCompleteNameTyp
        style={{
          ...((bulkType === 'all-room-accordion' ||
            bulkType === 'room-specific-accordion') && {
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
          options.find((o) => o.id === selected)
            ? options.find((o) => o.id === selected)
            : null
        }
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
