import React, { useState } from 'react';
import { default as CI } from './icon.svg';
import PropTypes from 'prop-types';
import { HighlightColor } from '../../components/constants/theme';

function CopyIcon(props) {
  const [color, setColor] = useState(props.color);
  return (
    <CI
      color={color}
      onMouseDown={() => setColor(HighlightColor)}
      onMouseLeave={() => setColor(props.color)}
      onMouseUp={() => setColor(props.color)}
    />
  );
}
CopyIcon.defaultProps = {
  color: '#CCCCCC',
};

CopyIcon.propTypes = {
  color: PropTypes.string,
};

export default CopyIcon;
