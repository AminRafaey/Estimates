import React, { useState } from 'react';
import { default as DI } from './icon.svg';
import PropTypes from 'prop-types';
import { HighlightColor } from '../../components/constants/theme';

function DeleteIcon(props) {
  const [color, setColor] = useState(props.color);
  return (
    <DI
      color={color}
      {...(props.width && { width: props.width, height: props.height })}
      onMouseDown={() => setColor(HighlightColor)}
      onMouseLeave={() => setColor(props.color)}
      onMouseUp={() => setColor(props.color)}
    />
  );
}

DeleteIcon.defaultProps = {
  color: '#FC1450',
};

DeleteIcon.propTypes = {
  color: PropTypes.string,
};

export default DeleteIcon;
