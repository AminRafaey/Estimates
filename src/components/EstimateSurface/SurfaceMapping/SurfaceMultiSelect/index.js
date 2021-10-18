import React, { useState, useEffect, createRef } from 'react';
import { Box, styled, withStyles, TextField, Popper } from '@material-ui/core';
import { Checkbox as MUICheckbox } from '../../../UI';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { cloneState } from '../../../EstimateProduct/stateClone';
import { getUpdatedSurfaces } from '../../index';

import {
  useSurfaceSelectionState,
  useSurfaceSelectionDispatch,
  updateSurfaces,
} from '../../../../Context/SurfaceSelectionContext';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const StyledAutoComplete = withStyles({
  root: {
    '& .MuiInputBase-root': {
      background: '#ffff',
    },
    '& .MuiFormControl-root': {
      width: 300,
    },
  },
  listbox: {
    maxHeight: '40vh',
  },
})(Autocomplete);

const StyledAutoCompleteWithSurfaces = withStyles({
  root: {
    '& .MuiInputBase-root': {
      background: '#F5F6F8',
    },
    '& .MuiFormControl-root': {
      width: 356,
    },
  },
  listbox: {
    maxHeight: '40vh',
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

export default function SurfaceMultiSelect(props) {
  const { type } = props;
  const estimateSurface = useSurfaceSelectionState();
  const surfaceSelectionDispatch = useSurfaceSelectionDispatch();

  const [options, setoptions] = useState([]);
  const [textFieldVal, setTextFieldVal] = useState('');
  const [open, setOpen] = useState(false);
  const multiSelectTextRef = createRef();

  useEffect(() => {
    setoptions(
      estimateSurface.map((surface) => ({ ...surface, numOfParent: 0 }))
    );
  }, [estimateSurface]);
  const TagName =
    type && type === 'Header'
      ? StyledAutoComplete
      : StyledAutoCompleteWithSurfaces;

  return (
    <TagName
      multiple
      closeIcon={false}
      openOnFocus
      {...(type && type === 'Header'
        ? {}
        : {
            PopperComponent: CustomizePopper,
          })}
      disableCloseOnSelect
      onChange={(e, allValues, type, value) => {
        const selectedOption = value.option;
        let selectedValue = false;
        if (!selectedOption['selected']) selectedValue = true;

        const highestPosition = Math.max(
          ...estimateSurface
            .filter((surface) => surface.position >= 0)
            .map((surface) => surface.position)
        );
        const position = selectedValue
          ? highestPosition >= 0
            ? highestPosition + 1
            : 0
          : undefined;
        const updatedSurfaces = getUpdatedSurfaces(
          'selected',
          selectedValue,
          selectedOption.id,
          cloneState(estimateSurface),
          position
        ).obj;
        updateSurfaces(surfaceSelectionDispatch, updatedSurfaces);
        multiSelectTextRef.current.childNodes[1].children[0].select();
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      options={options}
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option, value) => {
        return option.selected || option.indeterminate;
      }}
      blurOnSelect={false}
      value={options.filter((o) => o.selected)}
      renderOption={(option, { selected, inputValue }) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);

        return (
          <div>
            <MUICheckbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={option.selected || option.indeterminate ? true : false}
              onChange={(e) => {
                option.indeterminate && (e.target.checked = false);
                const highestPosition = Math.max(
                  ...estimateSurface
                    .filter((surface) => surface.position >= 0)
                    .map((surface) => surface.position)
                );
                const position = e.target.checked
                  ? highestPosition >= 0
                    ? highestPosition + 1
                    : 0
                  : undefined;
                const updatedSurfaces = getUpdatedSurfaces(
                  'selected',
                  e.target.checked,
                  option.id,
                  cloneState(estimateSurface),
                  position
                ).obj;
                updateSurfaces(surfaceSelectionDispatch, updatedSurfaces);
              }}
            />
            {parts.map((part, index) => (
              <span
                key={index}
                style={{ ...(part.highlight && { color: '#1488FC' }) }}
              >
                {part.text}
              </span>
            ))}
          </div>
        );
      }}
      inputValue={textFieldVal}
      onInputChange={(event, newInputValue, reason) => {
        setTextFieldVal(reason === 'input' ? newInputValue : textFieldVal);
      }}
      renderTags={() => {}}
      renderInput={(params) => (
        <TextField
          ref={multiSelectTextRef}
          {...params}
          variant="outlined"
          label="Select Surfaces"
          InputProps={{
            ...params.InputProps,
          }}
        />
      )}
    />
  );
}
