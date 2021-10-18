import React, { useState, useEffect, useRef } from 'react';
import { Box, withStyles, Button } from '@material-ui/core';
import { useAppState } from '../../../Context/AppContext';
import SelectRow from './SelectRow';
import { useProductState } from '../../../Context/ProductContext';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
import { cloneState } from '../stateClone';

const StyledButton = withStyles({
  root: {
    textTransform: 'none',
  },
})(Button);

export default function HeaderBulkSelection(props) {
  const { bulkSelectionArr, bulkType, AccordionCommonProducts } = props;
  const appState = useAppState();

  const [estimateProductState, setEstimateProductState] = useState({});
  const [rows, setRows] = useState([]);
  const [showEmptyRow, setShowEmptyRow] = useState(false);

  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const AccordionCommonProductsCountRef = useRef(0);
  const commonProps = {
    bulkSelectionArr,
    bulkType,
    estimateProductState,
  };
  const productState = useProductState();
  useEffect(() => {
    if (Object.keys(AccordionCommonProducts).length < 1) {
      rows.length === 0 && setRows([{}]);
      setShowEmptyRow(true);
    } else {
      setShowEmptyRow(false);
      if (
        Object.entries(AccordionCommonProducts).length >
          AccordionCommonProductsCountRef.current &&
        rows.length > 0
      ) {
        const arr = [...rows];
        arr.length === 1 && Object.entries(arr[0]).length === 0 && arr.pop();
        setRows(
          arr.filter(
            (r) =>
              !Object.keys(AccordionCommonProducts).find(
                (p) =>
                  AccordionCommonProducts[p].id == r.id &&
                  (AccordionCommonProducts[p].component && r.component
                    ? AccordionCommonProducts[p].component.id == r.component.id
                    : !AccordionCommonProducts[p].component && !r.component) &&
                  (AccordionCommonProducts[p].sheen && r.sheen
                    ? AccordionCommonProducts[p].sheen.id == r.sheen.id
                    : !AccordionCommonProducts[p].sheen && !r.sheen)
              )
          )
        );
      } else {
        setRows(
          rows.filter(
            (r) =>
              !Object.keys(AccordionCommonProducts).find(
                (p) =>
                  AccordionCommonProducts[p].id == r.id &&
                  (AccordionCommonProducts[p].component && r.component
                    ? AccordionCommonProducts[p].component.id == r.component.id
                    : !AccordionCommonProducts[p].component && !r.component) &&
                  (AccordionCommonProducts[p].sheen && r.sheen
                    ? AccordionCommonProducts[p].sheen.id == r.sheen.id
                    : !AccordionCommonProducts[p].sheen && !r.sheen)
              )
          )
        );
      }
    }
    AccordionCommonProductsCountRef.current = Object.entries(
      AccordionCommonProducts
    ).length;
  }, [AccordionCommonProducts]);

  useEffect(() => {
    let estimateProduct = {};
    bulkSelectionArr.map((b, index) => {
      if (index === 0) {
        estimateProduct = cloneState(productState[b.actionId]);
      }

      const surface_id = b.surfaceId
        ? appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['surface_id']
        : appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surface_id'];

      Object.keys(estimateProduct).map((prodId) => {
        surfaceProductionRatesState[surface_id][
          'surface_products_production_rates'
        ].find((p) => p.action_id == b.actionId && p.product_id == prodId)
          ? ''
          : delete estimateProduct[prodId];
      });
    });
    setEstimateProductState({ ...estimateProduct });
  }, [appState, bulkSelectionArr]);
  return (
    <>
      {rows.map((r, i) => (
        <Box width="100%" key={i}>
          {(r.id ? estimateProductState[r.id] : true) && (
            <SelectRow
              bulkType={'accordion'}
              {...commonProps}
              showEmptyRow={showEmptyRow}
              index={i}
              setRows={setRows}
              rows={rows}
              selectedProduct={r}
              setSelectedProduct={(prod) =>
                setRows(rows.map((s, index) => (index === i ? prod : s)))
              }
              removeRow={() => rows.filter((s, index) => i !== index)}
            />
          )}
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
