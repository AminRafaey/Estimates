import React, { createRef, useEffect, useState } from 'react';

import { TextField, withStyles, Checkbox } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { useAppState } from '../../../../Context/AppContext';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import optionsApi from './optionsApi';
import {
  useReportState,
  useReportDispatch,
  addReportAttribute,
  addOptions,
} from '../../../../Context/Report';

const StyledAutoComplete = withStyles({
  root: {
    width: 200,
    '& .MuiFormControl-root': {},
    '& .MuiInputBase-root': {
      background: '#ffff',
    },
  },
})(Autocomplete);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function MultiSelect(props) {
  const { options, selected, type, label, multiple = false, index } = props;
  const [open, setOpen] = useState(false);
  const multiSelectTextRef = createRef();
  const appState = useAppState();
  const reportDispatch = useReportDispatch();
  const report = useReportState();

  useEffect(() => {
    report[index]['options'].length == 0 &&
      addOptions(reportDispatch, {
        index,
        options: optionsApi(type, { appState }),
      });
  }, []);
  const handleChange = (value) => {
    addReportAttribute(reportDispatch, { index: index, selected: value });
  };

  return (
    <StyledAutoComplete
      multiple={multiple}
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
      value={selected ? options.find((o) => o.id == selected.id) : null}
      onChange={(e, allValues, type, value) => {
        const selectedOption = value.option;
        handleChange(selectedOption);
      }}
      renderOption={(option, { selected, inputValue }) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);

        return (
          <div>
            {multiple && (
              <Checkbox
                icon={icon}
                color="primary"
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
            )}
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
            label={`Select ${label}`}
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
