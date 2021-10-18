import React from 'react';
import { styled, Box } from '@material-ui/core';

import PanelHeader from './PanelHeader';

const SelectionWrapper = styled(Box)({
  margin: 'auto',
  width: '100%',
});

const ParentLessNodeWrapper = styled(Box)({
  marginTop: -2,
});

const Header = ({
  uniqueSurfaces,

  surfaceId,
  parentSurfaceId,
  surface,
  surface_id,
}) => {
  return (
    <SelectionWrapper>
      <PanelHeader
        uniqueSurfaces={uniqueSurfaces}
        parentSurfaceId={parentSurfaceId}
        surfaceId={surfaceId}
        surface={surface}
        surface_id={surface_id}
      />
    </SelectionWrapper>
  );
};
export default function Surface(props) {
  const { parentSurfaceId, uniqueSurfaces } = props;

  if (Object.entries(uniqueSurfaces[parentSurfaceId]['surfaces']).length < 1) {
    return (
      <ParentLessNodeWrapper>
        <Header
          parentSurfaceId={parentSurfaceId}
          surfaceId={null}
          surface={uniqueSurfaces[parentSurfaceId]}
          surface_id={uniqueSurfaces[parentSurfaceId]['surface_id']}
          uniqueSurfaces={uniqueSurfaces}
        />
      </ParentLessNodeWrapper>
    );
  }
  return (
    <SelectionWrapper>
      {Object.keys(uniqueSurfaces[parentSurfaceId]['surfaces']).map(
        (surfaceId) => {
          if (
            !uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]['included']
          )
            return;
          return (
            <Header
              key={surfaceId}
              parentSurfaceId={parentSurfaceId}
              surfaceId={surfaceId}
              surface={uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]}
              surface_id={
                uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                  'surface_id'
                ]
              }
              uniqueSurfaces={uniqueSurfaces}
            />
          );
        }
      )}
    </SelectionWrapper>
  );
}
