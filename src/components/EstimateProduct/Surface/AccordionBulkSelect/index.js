import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { useAppState } from '../../../../Context/AppContext';
import SelectRow from '../../BulkSelect/SelectRow';
import { getUniqueProducts } from '../../utility';

export default function AccordionBulkSelect(props) {
  const {
    bulkSelectionArr,
    commonProducts,
    setCommonProducts,
    bulkType,
  } = props;
  const appState = useAppState();

  const commonProps = {
    commonProducts,
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
    setCommonProducts({
      ...getUniqueProducts(bulkSelectionArr, appState),
    });
  }, [appState, bulkSelectionArr]);
  return (
    <Box width="100%">
      {bulkSelectionArr.length > 0 &&
        Object.keys(commonProducts)
          .sort(
            (a, b) =>
              commonProducts[a]['timeStamp'] - commonProducts[b]['timeStamp']
          )
          .map(
            (p, i) =>
              commonProducts[p] && (
                <SelectRow
                  bulkType={bulkType}
                  key={i}
                  index={i}
                  objectKey={p}
                  commonProduct={commonProducts[p]}
                  {...commonProps}
                />
              )
          )}
    </Box>
  );
}
