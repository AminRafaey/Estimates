import React from 'react';
import AccordionArrowIcon from './icon.svg';
import PropTypes from 'prop-types';
import { styled, Box } from '@material-ui/core';

const iconParentStyle = {
  height: '37px',
  width: '47px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const IconWrpper = styled(Box)({
  '&:hover': {
    backgroundColor: '#eeeeee',
  },

  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const AccordionArrow = (props) => {
  const { color, iconType } = props;
  return (
    <div
      style={{
        ...(iconType === 'Less'
          ? { transform: 'rotate(180deg)', paddingLeft: '10px' }
          : { paddingRight: '10px' }),
        ...iconParentStyle,
      }}
    >
      <IconWrpper borderRadius="50%">
        <AccordionArrowIcon color={color} />
      </IconWrpper>
    </div>
  );
};

AccordionArrow.defaultProps = {
  color: '#CCCCCC',
};

AccordionArrow.propTypes = {
  color: PropTypes.string,
};

export default AccordionArrow;
