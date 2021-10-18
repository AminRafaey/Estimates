import React, { useEffect, useState } from 'react';

import { TextField, withStyles, Checkbox, Popper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import {
  useAppState,
  useAppDispatch,
  addActionAndRemoveAllOther,
} from '../../../../Context/AppContext';
import { getCommonActions } from '../../utility';
const StyledAutoComplete = withStyles({
  root: {
    '& .MuiFormControl-root': {},
    '& .MuiInputBase-root': {
      background: '#ffff',
    },
  },
})(Autocomplete);

const CustomizePopper = function (props) {
  return (
    <Popper
      {...props}
      placement="top"
      modifiers={{
        flip: {
          enabled: false,
        },
      }}
    />
  );
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function ActionSelect(props) {
  const { parentSurfaceId, surfaceId, surface_id, options, setOptions } = props;
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const appState = useAppState();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    setOptions(
      options.map((o) =>
        getCommonActions(appState, parentSurfaceId, surfaceId).find(
          (c) => c.id == o.id
        )
          ? { ...o, selected: true }
          : o
      )
    );
  }, []);

  const handleContextChange = (
    parentRoomId,
    roomId,
    actionKey,
    actionName,
    selected
  ) => {
    let nonRemovableActions = [];
    nonRemovableActions = options.filter((o) => o.selected).map((o) => o.id);
    if (selected) {
      nonRemovableActions.push(actionKey);
    } else {
      nonRemovableActions = nonRemovableActions.filter(
        (id) => id !== actionKey
      );
    }

    addActionAndRemoveAllOther(appDispatch, {
      parentRoomId,
      roomId,
      parentSurfaceId,
      surfaceId,
      nonRemovableActions: nonRemovableActions,
      newAction: {
        id: selected ? actionKey : null,
        name: actionName,
        ...(selected && {
          no_of_coats:
            surfaceProductionRatesState[surface_id]['surface_production_rates'][
              actionKey
            ]['no_of_coats'],
        }),
      },
    });
  };

  const handleChange = (actionKey, actionName, selected) => {
    Object.keys(appState).map((parentRoomId) => {
      Object.keys(appState[parentRoomId]['bedrooms']).map((roomId) => {
        if (
          !appState[parentRoomId]['bedrooms'][roomId]['surfaces'] ||
          !appState[parentRoomId]['bedrooms'][roomId]['included']
        )
          return;
        Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
          (PSId) => {
            if (
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                  'surfaces'
                ]
              ).length < 1
            ) {
              if (
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                  'included'
                ] &&
                PSId === parentSurfaceId
              ) {
                handleContextChange(
                  parentRoomId,
                  roomId,
                  actionKey,
                  actionName,
                  selected
                );
              }
              return;
            }
            Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                'surfaces'
              ]
            ).map((SId) => {
              if (
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                  'surfaces'
                ][SId]['included'] &&
                SId == surfaceId
              ) {
                handleContextChange(
                  parentRoomId,
                  roomId,
                  actionKey,
                  actionName,
                  selected
                );
              }
            });
          }
        );
      });
    });
  };

  return (
    <StyledAutoComplete
      multiple
      size="small"
      closeIcon={false}
      PopperComponent={CustomizePopper}
      autoHighlight
      openOnFocus
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      options={options}
      blurOnSelect={false}
      value={options.filter((o) => o.selected)}
      onChange={(e, allValues, type, value) => {
        const selectedAction = value.option;
        setOptions(
          options.map((o) =>
            o.id == selectedAction.id
              ? {
                  ...o,
                  ...(selectedAction.selected
                    ? { selected: false }
                    : { selected: true }),
                }
              : o
          )
        );
        handleChange(
          selectedAction.id,
          selectedAction.name,
          selectedAction.selected ? false : true
        );
      }}
      renderOption={(option, { selected, inputValue }) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);
        return (
          <div>
            <Checkbox
              icon={icon}
              color="primary"
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={
                options.find((c) => c.id == option.id && c.selected)
                  ? true
                  : false
              }
              onChange={(e) => {
                setOptions(
                  options.map((o) =>
                    o.id == option.id
                      ? {
                          ...o,
                          selected: e.target.checked,
                        }
                      : o
                  )
                );
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
