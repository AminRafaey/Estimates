import React, { createRef, useState } from 'react';

import { TextField, withStyles } from '@material-ui/core';
import { default as MuiAutocomplete } from '@material-ui/lab/Autocomplete';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {
  useAppDispatch,
  addProduct,
  removeProduct,
  addProductInParentLessNode,
  addComponent,
  addSheen,
  removeComponent,
  removeSheen,
} from '../../../Context/AppContext';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
import { useProductState } from '../../../Context/ProductContext';
const StyledAutoComplete = withStyles({
  root: {
    '& .MuiFormControl-root': {
      minWidth: 100,
    },
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
    action,
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    actionId,
    productId,
    dimensionKey,
    products,
    setProducts,
    index,
  } = props;
  const [open, setOpen] = useState(false);
  const multiSelectTextRef = createRef();
  const appDispatch = useAppDispatch();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const productState = useProductState();

  const handleOnProductChange = (selectedProduct) => {
    if (!selectedProduct) {
      setProducts(products.map((p, i) => (i === index ? {} : p)));
      removeProduct(appDispatch, {
        parentRoomId,
        roomId,
        parentSurfaceId,
        surfaceId,
        actionId,
        dimensionKey,
        newProductId: selected,
      });
    } else {
      let position = 0;

      selected
        ? (position =
            action['dimensions'][dimensionKey]['products'][selected][
              'position'
            ])
        : (position =
            Object.entries(action['dimensions'][dimensionKey]['products'])
              .length > 0
              ? Math.max(
                  ...Object.keys(
                    action['dimensions'][dimensionKey]['products']
                  ).map(
                    (productId) =>
                      action['dimensions'][dimensionKey]['products'][productId][
                        'position'
                      ]
                  )
                ) + 1
              : 0);

      selected &&
        removeProduct(appDispatch, {
          parentRoomId,
          roomId,
          parentSurfaceId,
          surfaceId,
          actionId,
          dimensionKey,
          newProductId: selected,
        });
      const { components, sheens, ...rest } = productState[actionId][
        selectedProduct.id
      ];

      if (surfaceId) {
        addProduct(appDispatch, {
          parentRoomId,
          roomId,
          parentSurfaceId,
          surfaceId,
          actionId,
          dimensionKey,
          newProductId: selectedProduct.id,
          surfaceProductionRatesState,
          newProduct: {
            ...rest,
            position,
          },
        });
      } else {
        addProductInParentLessNode(appDispatch, {
          parentRoomId,
          roomId,
          parentSurfaceId,
          actionId,
          dimensionKey,
          newProductId: selectedProduct.id,
          surfaceProductionRatesState,
          newProduct: {
            ...rest,
            position,
          },
        });
      }
      setProducts(
        products.map((p, i) =>
          i === index
            ? {
                id: selectedProduct.id,
                name: selectedProduct.name,
                position,
              }
            : { ...p }
        )
      );
    }
  };

  const handleOnComponentChange = (selectedComponent) => {
    if (!selectedComponent) {
      setProducts(
        products.map((p, i) => {
          if (i === index) {
            delete p['component'];
            return p;
          }
          return p;
        })
      );
      removeComponent(appDispatch, {
        parentRoomId,
        roomId,
        parentSurfaceId,
        surfaceId,
        actionId,
        dimensionKey,
        newProductId: productId,
      });
    } else {
      setProducts(
        products.map((p, i) =>
          i === index
            ? {
                ...p,
                component: {
                  id: selectedComponent.id,
                  name: selectedComponent.name,
                },
              }
            : { ...p }
        )
      );

      addComponent(appDispatch, {
        parentRoomId,
        roomId,
        parentSurfaceId,
        surfaceId,
        actionId,
        dimensionKey,
        newProductId: productId,
        prodFeatureId: selectedComponent.id,
        prodFeatureName: selectedComponent.name,
      });
    }
  };
  const handleOnSheenChange = (selectedSheen) => {
    if (!selectedSheen) {
      setProducts(
        products.map((p, i) => {
          if (i === index) {
            delete p['sheen'];
            return p;
          }
          return p;
        })
      );
      removeSheen(appDispatch, {
        parentRoomId,
        roomId,
        parentSurfaceId,
        surfaceId,
        actionId,
        dimensionKey,
        newProductId: productId,
      });
    } else {
      setProducts(
        products.map((p, i) =>
          i === index
            ? {
                ...p,
                sheen: {
                  id: selectedSheen.id,
                  name: selectedSheen.name,
                },
              }
            : { ...p }
        )
      );

      addSheen(appDispatch, {
        parentRoomId,
        roomId,
        parentSurfaceId,
        surfaceId,
        actionId,
        dimensionKey,
        newProductId: productId,
        prodFeatureId: selectedSheen.id,
        prodFeatureName: selectedSheen.name,
      });
    }
  };
  return (
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
        if (type === 'component') {
          handleOnComponentChange(value);
        } else if (type === 'sheen') {
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
  );
}
