import React, { useState, useEffect } from 'react';
import { useAppState } from '../../../../Context/AppContext';
import { getCommonColor } from '../../utility';
import SelectRow from './SelectionRow';

export default function BulkSelect(props) {
  const {
    bulkSelectionArr,
    setBulkSelectionArr,
    bulkType,
    globalBulkSelectionArr,
    setGlobalBulkSelectionArr,
  } = props;
  const appState = useAppState();
  const [commonColor, setCommonColor] = useState({});

  const commonProps = {
    commonColor,
    bulkSelectionArr,
    setCommonColor,
    bulkType,
    globalBulkSelectionArr,
    setGlobalBulkSelectionArr,
    setBulkSelectionArr,
  };

  useEffect(() => {
    const commonColors = { ...getCommonColor(bulkSelectionArr, appState) };
    Object.entries(commonColors).length > 0
      ? setCommonColor(commonColors)
      : Object.entries(commonColor).length !== 0 &&
        setCommonColor(commonColors);
  }, [appState, bulkSelectionArr]);

  return <SelectRow {...commonProps} />;
}
