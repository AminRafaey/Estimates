import React from 'react';
import {
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  styled,
} from '@material-ui/core';

const ColorPallete = styled(Box)({
  height: 14,
  width: 14,
  marginRight: 6,
});
const StyledTableContainer = withStyles({
  root: {
    marginTop: '-22px',
    '& .MuiTableCell-root': {},
    '& .MuiTableHead-root .MuiTableCell-root': {
      fontSize: '13px',
      color: '#9a9a9d',
      paddingTop: 2,
      paddingBottom: 2,
      borderWidth: '0px 0px 0px 0px',
    },
    '& .MuiTableBody-root .MuiTableCell-root': {
      fontSize: '14px',
      borderWidth: '0px 0px 0px 0px',
      paddingTop: 2,
      paddingBottom: 2,
      verticalAlign: 'text-top',
    },
    '& .MuiTableBody-root .MuiTableRow-root': {
      '&:nth-child(odd)': {},
      '&:nth-child(even)': {},
    },
    '& .MuiTableBody-root': {},
  },
})(TableContainer);

export default function SummaryTable(props) {
  const { commonProducts, productCategoryId } = props;

  return (
    <StyledTableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Component</TableCell>
            <TableCell>Sheen</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Color Manufacturer</TableCell>
            <TableCell>Color Code</TableCell>
            <TableCell>Color Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commonProducts[productCategoryId].map((product, i) => {
            return (
              <TableRow key={i}>
                <TableCell>{product['name']}</TableCell>
                <TableCell>
                  {product.component ? product.component.name : ''}
                </TableCell>
                <TableCell>{product.sheen ? product.sheen.name : ''}</TableCell>
                <TableCell>{`${product.quantity} ${product.unit_symbol}`}</TableCell>
                <TableCell>
                  {product.colorManufacturer
                    ? product.colorManufacturer.name
                    : ''}
                </TableCell>
                <TableCell style={{ display: 'flex', alignItems: 'center' }}>
                  <ColorPallete
                    style={{
                      ...(product.colorManufacturer &&
                        product.colorManufacturer.color && {
                          background: product.colorManufacturer.color.hex_code,
                        }),
                    }}
                  />
                  {product.colorManufacturer && product.colorManufacturer.color
                    ? product.colorManufacturer.color.color_code
                    : ''}
                </TableCell>
                <TableCell>
                  {product.colorManufacturer && product.colorManufacturer.color
                    ? product.colorManufacturer.color.name
                    : ''}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
