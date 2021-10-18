import React, { useState, useEffect, useRef } from 'react';
import { Box, withStyles, Button } from '@material-ui/core';
import SelectRow from './SelectRow';
import { getUniqueColors } from '../../../utility';
import { useAppState } from '../../../../../Context/AppContext';

const StyledButton = withStyles({
  root: {
    textTransform: 'none',
  },
})(Button);

export default function HeaderBulkSelection(props) {
  const { bulkSelectionArr, bulkType } = props;
  const [rows, setRows] = useState([{}]);
  const [showEmptyRow, setShowEmptyRow] = useState(false);
  const appState = useAppState();
  const AccordionCommonColorsCountRef = useRef(0);

  const commonProps = {
    bulkSelectionArr,
    bulkType,
  };

  useEffect(() => {
    const commonColors = getUniqueColors(bulkSelectionArr, appState);
    if (Object.keys(commonColors).length < 1) {
      rows.length === 0 && setRows([{}]);
      setShowEmptyRow(true);
    } else {
      setShowEmptyRow(false);
      if (
        Object.entries(commonColors).length >
          AccordionCommonColorsCountRef.current &&
        rows.length > 0
      ) {
        const arr = [...rows];
        arr.length === 1 && Object.entries(arr[0]).length === 0 && arr.pop();
        setRows(
          arr.filter(
            (r) =>
              !Object.keys(commonColors).find((p) =>
                !commonColors[p].color && !r.color
                  ? commonColors[p].id == r.id
                  : commonColors[p].color &&
                    r.color &&
                    commonColors[p].color.id == r.color.id
              )
          )
        );
      } else {
        setRows(
          rows.filter(
            (r) =>
              !Object.keys(commonColors).find((p) =>
                !commonColors[p].color && !r.color
                  ? commonColors[p].id == r.id
                  : commonColors[p].color &&
                    r.color &&
                    commonColors[p].color.id == r.color.id
              )
          )
        );
      }
    }
    AccordionCommonColorsCountRef.current = Object.entries(commonColors).length;
  }, [appState]);
  return (
    <>
      {rows.map((r, i) => (
        <Box width="100%" key={i} mb={1}>
          <SelectRow
            bulkType={'accordion'}
            showEmptyRow={showEmptyRow}
            {...commonProps}
            rows={rows}
            setRows={setRows}
            selectedColor={r}
            setSelectedColor={(color) =>
              setRows(rows.map((s, index) => (index === i ? color : s)))
            }
            index={i}
          />
        </Box>
      ))}
      <StyledButton
        variant="text"
        color="primary"
        size="small"
        onClick={() => {
          setRows([...rows, {}]);
        }}
      >
        Add
      </StyledButton>
    </>
  );
}
