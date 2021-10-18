import React from 'react';
import {
  withStyles,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  styled,
  Grid,
} from '@material-ui/core';

export const headingStyling = {
  fontSize: '14px',
  fontFamily: 'Medium',
};

const ProductContentTyp = styled(Typography)({
  fontSize: 14,
});

const RoomLeftHeaderWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end',
  paddingLeft: 16,
});

const SIIWrapper = styled(Box)({});

const RoomNameTyp = styled(Typography)({
  ...headingStyling,
  fontSize: 16,
  color: 'black',
});

const StyledTableContainer = withStyles({
  root: {
    marginTop: '22px',
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
      '&:nth-child(odd)': {
        backgroundColor: '#F7FAFC',
      },
      '&:nth-child(even)': {},
    },
  },
})(TableContainer);

export default function Table(props) {
  const { rows, columns } = props;
  return (
    <StyledTableContainer>
      <MuiTable aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((c, i) => (
              <TableCell key={i}>{c.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col, index) =>
                row[col.key] ? (
                  ['string', 'undefined'].includes(
                    typeof row[col.key].value
                  ) ? (
                    <TableCell
                      key={index}
                      style={{
                        ...(row[col.key].beginWith && {
                          display: 'flex',
                          alignItems: 'center',
                        }),
                      }}
                    >
                      {row[col.key].beginWith &&
                        String(row[col.key].beginWith['$$typeof']) ===
                          'Symbol(react.element)' &&
                        React.cloneElement(row[col.key].beginWith, {})}
                      {`${row[col.key].value || ''}${row[col.key].end || ''}`}
                    </TableCell>
                  ) : (
                    <TableCell key={index}>
                      {row[col.key].value.map((val, index) => (
                        <ProductContentTyp key={index}>{val}</ProductContentTyp>
                      ))}
                    </TableCell>
                  )
                ) : (
                  <TableCell key={index} />
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </StyledTableContainer>
  );
}
