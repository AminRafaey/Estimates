import React, { useEffect, useState } from 'react';

import { styled, Box, Typography } from '@material-ui/core';
import MultiSelect from '../MultiSelect';
export const headingStyling = {
  fontSize: '14px',
  fontFamily: 'Medium',
};

const RoomLeftHeaderWrapper = styled(Box)({
  paddingLeft: 16,
  height: 35,
});

const RoomNameTyp = styled(Typography)({
  ...headingStyling,
  fontSize: 16,
  color: 'black',
});

export default function EditableName(props) {
  const { name, options, setOptions, type, label, index, selected } = props;

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    editMode && setEditMode(false);
  }, [selected]);

  return (
    <RoomLeftHeaderWrapper>
      {editMode ? (
        <MultiSelect
          options={options}
          setOptions={setOptions}
          optionsFetchRequire={false}
          type={type}
          label={label}
          index={index}
          selected={selected}
        />
      ) : (
        <RoomNameTyp onClick={() => setEditMode(true)}>{name}</RoomNameTyp>
      )}
    </RoomLeftHeaderWrapper>
  );
}
