import React from 'react';
import { styled, Box } from '@material-ui/core';
import Surface from '../Surface';
import { useAppState } from '../../../../Context/AppContext';
import ParentSurface from '../ParentSurface';

const SelectionWrapper = styled(Box)({
  margin: 'auto',
  paddingTop: '35px',
});

export default function SurfacePanel(props) {
  const {
    bulkSelectionArr,
    setBulkSelectionArr,
    uniqueSurfaces,
    selectedActionId,
    commonProducts,
    selectedToggle,
  } = props;

  return (
    <SelectionWrapper>
      {Object.keys(uniqueSurfaces).map((parentSurfaceId, index) => {
        if (
          Object.entries(uniqueSurfaces[parentSurfaceId]['surfaces']).length < 1
        ) {
          return (
            <Surface
              key={parentSurfaceId}
              selectedActionId={selectedActionId}
              uniqueSurfaces={uniqueSurfaces}
              parentSurfaceId={parentSurfaceId}
              bulkSelectionArr={bulkSelectionArr}
              setBulkSelectionArr={setBulkSelectionArr}
              commonProducts={commonProducts}
              selectedToggle={selectedToggle}
            />
          );
        }
      })}

      {Object.keys(uniqueSurfaces).map((parentSurfaceId, index) => {
        if (
          Object.entries(uniqueSurfaces[parentSurfaceId]['surfaces']).length > 0
        ) {
          if (
            Object.keys(uniqueSurfaces[parentSurfaceId]['surfaces']).find(
              (sId) =>
                uniqueSurfaces[parentSurfaceId]['surfaces'][sId]['actions'][
                  selectedActionId
                ]
            )
          )
            return (
              <ParentSurface
                key={index}
                uniqueSurfaces={uniqueSurfaces}
                selectedActionId={selectedActionId}
                parentSurfaceId={parentSurfaceId}
                bulkSelectionArr={bulkSelectionArr}
                setBulkSelectionArr={setBulkSelectionArr}
                commonProducts={commonProducts}
                index={index}
                selectedToggle={selectedToggle}
              />
            );
        }
      })}
    </SelectionWrapper>
  );
}
