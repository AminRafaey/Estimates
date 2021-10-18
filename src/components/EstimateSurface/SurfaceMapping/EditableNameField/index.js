import React, { useState } from 'react';
import { styled, Typography, TextField } from '@material-ui/core';
import {
  useSurfaceSelectionDispatch,
  updateSurfaceName,
} from '../../../../Context/SurfaceSelectionContext';
import {
  useAppDispatch,
  updateSurfaceNameForAllRooms,
} from '../../../../Context/AppContext';

const textFieldStyle = {
  background: '#ffff',
  width: 120,
};

const SurfaceNameTyp = styled(Typography)({
  cursor: 'pointer',
  fontSize: '15px',
  color: 'black',
});
export default function EditableNameField(props) {
  const { childSurface, rowsPadding } = props;

  const appDispatch = useAppDispatch();
  const surfaceSelectionDispatch = useSurfaceSelectionDispatch();
  const [showEditableField, setShowEditableField] = useState(false);

  const handleOnBlur = (e) => {
    updateSurfaceName(surfaceSelectionDispatch, {
      surfaceId: childSurface.id,
      surfaceName: e.target.value,
    });
    setShowEditableField(false);
    updateSurfaceNameForAllRooms(appDispatch, {
      surfaceId: childSurface.id,
      surfaceName: e.target.value,
    });
  };
  return (
    <React.Fragment>
      {showEditableField ? (
        <TextField
          autoFocus={true}
          style={{ ...textFieldStyle, marginLeft: `${rowsPadding}px` }}
          size="small"
          variant="outlined"
          defaultValue={childSurface.name}
          onBlur={handleOnBlur}
          onKeyUp={(e) => e.key === 'Enter' && handleOnBlur(e)}
        />
      ) : (
        <SurfaceNameTyp
          style={{ paddingLeft: `${rowsPadding}px` }}
          onClick={() => setShowEditableField(true)}
        >
          {childSurface.name}
        </SurfaceNameTyp>
      )}
    </React.Fragment>
  );
}
