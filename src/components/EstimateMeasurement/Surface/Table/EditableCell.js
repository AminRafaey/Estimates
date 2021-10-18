import React, { useState } from 'react';
import { Box, FormControl, OutlinedInput } from '@material-ui/core';
export default function EditableCell(props) {
  const [editable, setEditable] = useState(false);
  const { value, onChange } = props;
  return (
    <Box
      minWidth="73px"
      minHeight="50px"
      display="flex"
      alignItems="center"
      onClick={() => setEditable(true)}
    >
      {editable ? (
        <FormControl size="small" variant="outlined">
          <OutlinedInput
            style={{ background: '#ffff', width: 73 }}
            variant="outlined"
            type="number"
            autoFocus={true}
            onBlur={() => setEditable(false)}
            value={value}
            onChange={onChange}
          />
        </FormControl>
      ) : (
        <Box minWidth={73}>{value}</Box>
      )}
    </Box>
  );
}
