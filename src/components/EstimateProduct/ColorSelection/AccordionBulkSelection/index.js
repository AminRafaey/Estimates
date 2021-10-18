import React, { useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { useAppState } from '../../../../Context/AppContext';
import SelectRow from './SelectionRow';
import { getUniqueColors } from '../../utility';

export default function AccordionBulkSelect(props) {
  const { bulkSelectionArr, bulkType } = props;
  const appState = useAppState();
  const [commonColors, setCommonColors] = useState({});

  const commonProps = {
    commonColors,
    bulkSelectionArr,
    ...(bulkSelectionArr.length > 0 && {
      surface_id: bulkSelectionArr[0]['surfaceId']
        ? appState[bulkSelectionArr[0].parentRoomId]['bedrooms'][
            bulkSelectionArr[0].roomId
          ]['surfaces'][bulkSelectionArr[0].parentSurfaceId]['surfaces'][
            bulkSelectionArr[0].surfaceId
          ]['surface_id']
        : appState[bulkSelectionArr[0].parentRoomId]['bedrooms'][
            bulkSelectionArr[0].roomId
          ]['surfaces'][bulkSelectionArr[0].parentSurfaceId]['surface_id'],
      actionId: bulkSelectionArr[0]['actionId'],
    }),
  };

  useEffect(() => {
    setCommonColors({
      ...getUniqueColors(bulkSelectionArr, appState),
    });
  }, [appState, bulkSelectionArr]);
  return (
    <Box width="100%">
      {bulkSelectionArr.length > 0 &&
        Object.keys(commonColors).map(
          (p, i) =>
            commonColors[p] && (
              <SelectRow
                bulkType={bulkType}
                key={i}
                index={i}
                commonColor={commonColors[p]}
                {...commonProps}
              />
            )
        )}
    </Box>
  );
}
