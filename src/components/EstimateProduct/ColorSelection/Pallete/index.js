import React, { useState } from 'react';
import { Box, styled, Popover } from '@material-ui/core';

const PalleteWrapper = styled(Box)({
  height: 20,
  width: 20,
  borderRadius: 4,
  alignSelf: 'center',
});

export default function Pallete(props) {
  const { backgroundColor } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      {backgroundColor ? (
        <PalleteWrapper
          style={{
            background: backgroundColor,
            marginRight: 10,
            cursor: 'pointer',
          }}
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={(event) => setAnchorEl(event.currentTarget)}
          onMouseLeave={() => setAnchorEl(null)}
        />
      ) : (
        <PalleteWrapper
          style={{
            marginRight: 10,
          }}
        />
      )}

      <Popover
        id="mouse-over-popover"
        style={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        onClose={() => setAnchorEl(null)}
        disableRestoreFocus
      >
        <PalleteWrapper
          style={{
            ...(backgroundColor && {
              background: backgroundColor,
            }),
            width: 34,
            height: 34,
          }}
        />
      </Popover>
    </React.Fragment>
  );
}
