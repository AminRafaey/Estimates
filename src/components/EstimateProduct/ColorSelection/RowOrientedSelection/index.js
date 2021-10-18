import React from 'react';
import { Checkbox } from '../../../UI';
import { default as Menufacturar } from '../AutoComplete';
import { default as ColorSelect } from '../AutoComplete';
import Pallete from '../Pallete';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import { useColorState } from '../../../../Context/Color';
import { useAppState } from '../../../../Context/AppContext';

import {
  StyledTableCellWithBorder,
  StyledTableCellForColorRow,
  StyledChip,
  ChipWrapper,
} from '../../Surface/Table/ProductSelection';

import { TableRow, Box, styled } from '@material-ui/core';

const NameWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});
export default function RowOrientedSelection(props) {
  const {
    handleCheckboxChange,
    getCheckboxStaus,
    productWithCoats,
    commonProps,
    surface_id,
    actionNameRequired,
  } = props;

  const {
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    actionId,
    action,
    dimensionKey,
  } = commonProps;

  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const appState = useAppState();
  const colorState = useColorState();

  return (
    <TableRow>
      <StyledTableCellWithBorder align="left">
        <NameWrapper>
          <Checkbox
            onChange={(e) => handleCheckboxChange(e)}
            checked={getCheckboxStaus()}
          />
          {!actionNameRequired && (
            <Box>{appState[parentRoomId]['bedrooms'][roomId]['name']}</Box>
          )}
        </NameWrapper>
      </StyledTableCellWithBorder>

      {Object.keys(
        surfaceProductionRatesState[surface_id]['surface_fields']
      ).map((fieldKey) => (
        <StyledTableCellWithBorder align="left" key={fieldKey}>
          {
            action['dimensions'][dimensionKey][
              surfaceProductionRatesState[surface_id]['surface_fields'][
                fieldKey
              ]['name']
            ]
          }
        </StyledTableCellWithBorder>
      ))}
      <StyledTableCellForColorRow align="left">
        {Object.entries(productWithCoats).length > 0 &&
          productWithCoats['name']}
      </StyledTableCellForColorRow>
      <StyledTableCellForColorRow align="left">
        {(Object.entries(productWithCoats).length > 0 &&
          productWithCoats['component'] &&
          productWithCoats['component']['name']) ||
          ''}
      </StyledTableCellForColorRow>
      <StyledTableCellForColorRow align="left">
        {(Object.entries(productWithCoats).length > 0 &&
          productWithCoats['sheen'] &&
          productWithCoats['sheen']['name']) ||
          ''}
      </StyledTableCellForColorRow>
      <StyledTableCellForColorRow align="left">
        {Object.entries(productWithCoats).length > 0 &&
          (surfaceId
            ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
                dimensionKey
              ]['no_of_coats']
            : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions'][actionId]['dimensions'][dimensionKey][
                'no_of_coats'
              ])}
      </StyledTableCellForColorRow>
      <StyledTableCellForColorRow align="left">
        <Menufacturar
          options={Object.keys(colorState).map((m) => ({
            name: colorState[m].name,
            id: colorState[m].name,
          }))}
          selected={
            productWithCoats['colorManufacturer']
              ? productWithCoats['colorManufacturer'].id
              : undefined
          }
          type={'colorManufacturer'}
          productId={
            Object.entries(productWithCoats).length > 0
              ? productWithCoats.id
              : undefined
          }
          {...commonProps}
        />
      </StyledTableCellForColorRow>
      <StyledTableCellForColorRow align="left">
        <Box display="flex">
          <Pallete
            backgroundColor={
              productWithCoats['colorManufacturer'] &&
              productWithCoats['colorManufacturer']['color'] &&
              productWithCoats['colorManufacturer']['color']['id']
                ? productWithCoats['colorManufacturer']['color']['hex_code']
                : undefined
            }
          />

          <ColorSelect
            options={
              productWithCoats['colorManufacturer']
                ? Object.keys(
                    colorState[productWithCoats['colorManufacturer']['id']][
                      'colors'
                    ]
                  ).map((cId) => ({
                    colorManufacturer: {
                      id: productWithCoats['colorManufacturer']['id'],
                      name: productWithCoats['colorManufacturer']['id'],
                    },
                    name:
                      colorState[productWithCoats['colorManufacturer']['id']][
                        'colors'
                      ][cId]['color_name'],
                    ...colorState[productWithCoats['colorManufacturer']['id']][
                      'colors'
                    ][cId],
                  }))
                : Object.keys(colorState)
                    .map((m) =>
                      Object.keys(colorState[m]['colors']).map((cId) => ({
                        colorManufacturer: { id: m, name: m },
                        name: colorState[m]['colors'][cId]['color_name'],
                        ...colorState[m]['colors'][cId],
                      }))
                    )
                    .flat()
            }
            selected={
              productWithCoats['colorManufacturer']
                ? productWithCoats['colorManufacturer']['color']
                  ? productWithCoats['colorManufacturer']['color']['id']
                  : undefined
                : undefined
            }
            type={'color'}
            productId={
              Object.entries(productWithCoats).length > 1
                ? productWithCoats.id
                : undefined
            }
            {...commonProps}
          />
        </Box>
      </StyledTableCellForColorRow>
    </TableRow>
  );
}
