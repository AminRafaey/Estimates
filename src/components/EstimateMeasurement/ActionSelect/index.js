import React, { createRef, useState } from 'react';

import { TextField, withStyles, Checkbox } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {
  useSurfaceProductionRatesState,
  useSurfaceProductionRatesDispatch,
} from '../../../Context/SurfaceProductionRates';
import {
  useAppState,
  useAppDispatch,
  addAction,
  removeAction,
  addActionOfParentLessNode,
  removeActionOfParentLessNode,
} from '../../../Context/AppContext';
const StyledAutoComplete = withStyles({
  root: {
    '& .MuiFormControl-root': {},
    '& .MuiInputBase-root': {
      background: '#ffff',
    },
  },
})(Autocomplete);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function ActionSelect(props) {
  const {
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    surface_id,
    fieldsLinkingList,
    setFieldsLinkingList,
  } = props;
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const [open, setOpen] = useState(false);
  const multiSelectTextRef = createRef();
  const appState = useAppState();
  const appDispatch = useAppDispatch();

  const handleChange = (actionKey, actionName, selected) => {
    if (surfaceId) {
      selected
        ? addAction(appDispatch, {
            parentRoomId,
            roomId,
            parentSurfaceId,
            surfaceId,
            newAction: {
              id: actionKey,
              name: actionName,
              no_of_coats:
                surfaceProductionRatesState[surface_id][
                  'surface_production_rates'
                ][actionKey]['no_of_coats'],
            },
          })
        : removeAction(appDispatch, {
            parentRoomId,
            roomId,
            parentSurfaceId,
            surfaceId,
            newAction: {
              id: actionKey,
            },
          });
    } else {
      selected
        ? addActionOfParentLessNode(appDispatch, {
            parentRoomId,
            roomId,
            parentSurfaceId,
            newAction: {
              id: actionKey,
              name: actionName,
              no_of_coats:
                surfaceProductionRatesState[surface_id][
                  'surface_production_rates'
                ][actionKey]['no_of_coats'],
            },
          })
        : removeActionOfParentLessNode(appDispatch, {
            parentRoomId,
            roomId,
            parentSurfaceId,
            newAction: {
              id: actionKey,
            },
          });
    }
  };

  return (
    <StyledAutoComplete
      multiple
      size="small"
      closeIcon={false}
      autoHighlight
      openOnFocus
      disableCloseOnSelect
      open={open}
      onOpen={() => {
        fieldsLinkingList.length > 0 && setFieldsLinkingList([]);
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={(option) => option.name}
      options={surfaceProductionRatesState[surface_id]['surface_actions']}
      blurOnSelect={false}
      value={surfaceProductionRatesState[surface_id]['surface_actions'].filter(
        (o) => {
          if (surfaceId) {
            const allActionIds = Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions']
            ).filter(
              (actionId) =>
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions'][actionId]['selected']
            );
            return allActionIds.find((aId) => aId == o.id);
          }
          const allActionIds = Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions']
          ).filter(
            (actionId) =>
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions'][actionId]['selected']
          );
          return allActionIds.find((aId) => aId == o.id);
        }
      )}
      onChange={(e, allValues, type, value) => {
        const selectedAction = value.option;

        let selected = true;
        surfaceId
          ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][selectedAction.id] &&
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][selectedAction.id][
              'selected'
            ] &&
            (selected = false)
          : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][selectedAction.id] &&
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][selectedAction.id]['selected'] &&
            (selected = false);

        handleChange(selectedAction.id, selectedAction.name, selected);
      }}
      renderOption={(option, { selected, inputValue }) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);
        let checkedStatus = false;
        if (
          surfaceId &&
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][option.id] &&
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][option.id]['selected']
        ) {
          checkedStatus = true;
        } else if (
          surfaceId === null &&
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][option.id] &&
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][option.id]['selected']
        ) {
          checkedStatus = true;
        }

        return (
          <div>
            <Checkbox
              icon={icon}
              color="primary"
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={checkedStatus}
              onChange={(e) => {
                handleChange(option.id, option.name, e.target.checked);
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
