import React from 'react';
import { styled, Box } from '@material-ui/core';
import Surface from '../Surface';
import ParentSurface from '../ParentSurface';

const SelectionWrapper = styled(Box)({
  margin: 'auto',
  paddingTop: '35px',
});

export default function SurfacePanel(props) {
  const { uniqueSurfaces, selectedRoom } = props;

  return (
    <SelectionWrapper>
      {Object.keys(uniqueSurfaces).map((parentSurfaceId) => {
        if (
          Object.entries(uniqueSurfaces[parentSurfaceId]['surfaces']).length < 1
        ) {
          return (
            <Surface
              key={parentSurfaceId}
              parentSurfaceId={parentSurfaceId}
              uniqueSurfaces={uniqueSurfaces}
            />
          );
        }
      })}

      {Object.keys(uniqueSurfaces).map((parentSurfaceId, index) => {
        if (
          Object.entries(uniqueSurfaces[parentSurfaceId]['surfaces']).length > 0
        ) {
          return (
            <ParentSurface
              key={index}
              uniqueSurfaces={uniqueSurfaces}
              parentSurfaceId={parentSurfaceId}
              selectedRoom={selectedRoom}
            />
          );
        }
      })}
    </SelectionWrapper>
  );
}
