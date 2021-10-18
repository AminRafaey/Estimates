import React, { createRef, useState, useEffect } from 'react';

import { TextField, withStyles, Checkbox } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {
  useAppState,
  useAppDispatch,
  addAction,
  removeAction,
  addActionOfParentLessNode,
  removeActionOfParentLessNode,
} from '../../../Context/AppContext';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
import { cloneState } from '../../EstimateProduct/stateClone';
const StyledAutoComplete = withStyles({
  root: {
    width: '70%',
    padding: '0px 10px',
    '& .MuiFormControl-root': {},
    '& .MuiInputBase-root': {
      background: '#ffff',
    },
  },
})(Autocomplete);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function BulkSelect(props) {
  const { bulkSelectionArr } = props;
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedActionIds, setSelectedActionIds] = useState([]);
  const multiSelectTextRef = createRef();
  const appState = useAppState();
  const appDispatch = useAppDispatch();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();

  useEffect(() => {
    if (options.length < 1) return undefined;
    let clone = [...selectedActionIds];
    options.map((opt) => {
      let count = 0;
      bulkSelectionArr.map((b) => {
        b.surfaceId !== null &&
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][opt.id] &&
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][opt.id]['selected'] &&
          count++;
        b.surfaceId == null &&
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][opt.id] &&
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][opt.id]['selected'] &&
          count++;
      });
      count === bulkSelectionArr.length
        ? (clone = [...clone, opt.id])
        : (clone = clone.filter((s) => s !== opt.id));
    });
    setSelectedActionIds([...clone]);
  }, [bulkSelectionArr, options, appState]);

  useEffect(() => {
    let ActionsArr = [];
    bulkSelectionArr.map((b, index) => {
      if (index === 0) {
        ActionsArr = cloneState(
          surfaceProductionRatesState[b.surface_id]['surface_actions']
        );
        return;
      }
      ActionsArr = ActionsArr.filter((item1) =>
        surfaceProductionRatesState[b.surface_id]['surface_actions'].find(
          (item2) => item1.id == item2.id
        )
      );
    });
    setOptions([...ActionsArr]);
  }, [bulkSelectionArr]);

  const handleChange = (
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    surface_id,
    actionKey,
    actionName,
    selected
  ) => {
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
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={(option) => option.name}
      options={options}
      blurOnSelect={false}
      value={
        bulkSelectionArr.length > 0
          ? options.filter((o) => selectedActionIds.find((s) => s == o.id))
          : []
      }
      onChange={(e, allValues, type, value) => {
        const selectedAction = value.option;
        let selected = true;
        selectedActionIds.find((s) => s == selectedAction.id) &&
          (selected = false);
        bulkSelectionArr.map((b) => {
          handleChange(
            b.parentRoomId,
            b.roomId,
            b.parentSurfaceId,
            b.surfaceId,
            !b.surfaceId
              ? appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
                  b.parentSurfaceId
                ]['surface_id']
              : appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
                  b.parentSurfaceId
                ]['surfaces'][b.surfaceId]['surface_id'],
            selectedAction.id,
            selectedAction.name,
            selected
          );
        });
      }}
      renderOption={(option, { selected, inputValue }) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);
        let checkedStatus = false;
        selectedActionIds.find((s) => s == option.id) && (checkedStatus = true);
        return (
          <div>
            <Checkbox
              icon={icon}
              color="primary"
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={checkedStatus}
              onChange={(e) => {
                bulkSelectionArr.map((b) => {
                  handleChange(
                    b.parentRoomId,
                    b.roomId,
                    b.parentSurfaceId,
                    b.surfaceId,
                    option.id,
                    option.name,
                    e.target.checked
                  );
                });
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
