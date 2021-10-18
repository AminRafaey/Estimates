import React from 'react';
import PropTypes from 'prop-types';
import { HighlightColor } from '../../../../components/constants/theme';
import { Box, styled } from '@material-ui/core';
import EstimateNumSel from '../EstimateNumSel';

const NavLinkContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRight: '1px solid #eff2f5',
  height: '100%',
});

const Highlighter = styled(Box)({
  width: '100%',
  height: '3px',
  marginTop: '1px',
});

const Navlink = ({ estimates, getEstimatesLoader, selected, setSelected }) => {
  return (
    <div>
      <NavLinkContainer
        style={{
          padding: '13px 45px 13px',
        }}
      >
        <EstimateNumSel
          estimates={estimates}
          getEstimatesLoader={getEstimatesLoader}
          selected={selected}
          setSelected={setSelected}
        />
      </NavLinkContainer>
      <Highlighter
        style={{
          backgroundColor: HighlightColor,
        }}
      />
    </div>
  );
};

Navlink.propTypes = {
  step: PropTypes.object.isRequired,
};

export default Navlink;
