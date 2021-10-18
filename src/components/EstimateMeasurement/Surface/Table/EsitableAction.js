import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  OutlinedInput,
  withStyles,
  Chip,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import { useProductState } from '../../../../Context/ProductContext';
import {
  useAppState,
  useAppDispatch,
  addDimensions,
  removeDimension,
  addAction,
  addActionOfParentLessNode,
} from '../../../../Context/AppContext';
const StyledChip = withStyles({
  root: {
    height: 22,
  },
  label: {
    fontSize: 12,
  },
})(Chip);
const StyledAutoComplete = withStyles({
  root: {
    minWidth: 284,
    '& .MuiFormControl-root': {},
    '& .MuiInputBase-root': {
      background: '#ffff',
    },
  },
})(Autocomplete);
export default function EditableAction(props) {
  const {
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    actions,
    actionId,
    dimensionKey,
    surface_id,
  } = props;
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const appState = useAppState();
  const appDispatch = useAppDispatch();
  const productState = useProductState();
  const [editable, setEditable] = useState(false);

  const [inputValue, setInputValue] = React.useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setInputValue(actions[actionId]['name']);
    setSelected(
      surfaceProductionRatesState[surface_id]['surface_actions'].find(
        (a) => a.id == actionId
      )
    );
  }, [actionId]);

  useEffect(() => {
    if (selected && actionId != selected.id) {
      if (surfaceId) {
        !appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
          parentSurfaceId
        ]['surfaces'][surfaceId]['actions'][selected.id] &&
          addAction(appDispatch, {
            parentRoomId,
            roomId,
            parentSurfaceId,
            surfaceId,
            newAction: {
              id: selected.id,
              name: selected.name,
              no_of_coats:
                surfaceProductionRatesState[surface_id][
                  'surface_production_rates'
                ][selected.id]['no_of_coats'],
            },
          });

        addDimensions(appDispatch, {
          parentRoomId,
          roomId,
          parentSurfaceId,
          surfaceId,
          newAction: {
            id: selected.id,
          },
          dimension: {
            ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
              dimensionKey
            ],

            products: {},
          },
          surfaceProductionRatesState,
          products: productState,
        });
      } else {
        !appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
          parentSurfaceId
        ]['actions'][selected.id] &&
          addActionOfParentLessNode(appDispatch, {
            parentRoomId,
            roomId,
            parentSurfaceId,
            newAction: {
              id: selected.id,
              name: selected.name,
              no_of_coats:
                surfaceProductionRatesState[surface_id][
                  'surface_production_rates'
                ][selected.id]['no_of_coats'],
            },
          });

        addDimensions(appDispatch, {
          parentRoomId,
          roomId,
          parentSurfaceId,
          surfaceId,
          newAction: {
            id: selected.id,
          },
          dimension: {
            ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][actionId]['dimensions'][dimensionKey],

            products: {},
          },
          surfaceProductionRatesState,
          products: productState,
        });
      }

      removeDimension(appDispatch, {
        parentRoomId,
        roomId,
        parentSurfaceId,
        surfaceId,
        newAction: {
          id: actionId,
        },
        dimensionKey: dimensionKey,
      });
    }
  }, [editable]);

  return (
    <Box
      minWidth="73px"
      minHeight="50px"
      display="flex"
      alignItems="center"
      onClick={() => setEditable(true)}
    >
      {editable ? (
        <StyledAutoComplete
          size="small"
          closeIcon={false}
          autoHighlight
          openOnFocus
          disableCloseOnSelect
          onClose={() => {
            setEditable(false);
          }}
          getOptionLabel={(option) => option.name}
          options={surfaceProductionRatesState[surface_id]['surface_actions']}
          blurOnSelect={false}
          value={selected}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          onChange={(e, newValue) => {
            setSelected(newValue);
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
                {...params}
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                }}
              />
            );
          }}
        />
      ) : (
        <StyledChip label={actions[actionId]['name']} />
      )}
    </Box>
  );
}
