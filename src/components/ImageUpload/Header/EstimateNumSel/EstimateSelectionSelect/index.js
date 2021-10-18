import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
export default function EstimateSelectionSelect(props) {
  const {
    selected,
    setSelected,
    getEstimatesLoader,
    options,
    setCurrentSelection,
  } = props;

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!getEstimatesLoader) {
      setSelected(
        options.find((o) => o.id == window.localStorage.getItem('ESTIMATE_ID'))
      );
      setInputValue(
        options.find((o) => o.id == window.localStorage.getItem('ESTIMATE_ID'))
          .title
      );
    }
  }, [getEstimatesLoader]);

  return (
    <div>
      <Autocomplete
        value={selected}
        closeIcon={false}
        onChange={(event, newValue) => {
          setCurrentSelection(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={options}
        getOptionLabel={(option) => option.title}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} variant="outlined" />}
      />
    </div>
  );
}
