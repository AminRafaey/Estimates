import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HighlightColor } from '../../../components/constants/theme';
import { Box, Typography, styled } from '@material-ui/core';

const NavLinkContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRight: '1px solid #eff2f5',
  height: '100%',
});

const NavLinkInnerContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});
const SVGContainer = styled(Box)({
  float: 'left',
  display: 'flex',
  alignItems: 'center',
});

const ContentTyp = styled(Typography)({
  paddingLeft: 10,
});

const Highlighter = styled(Box)({
  width: '100%',
  height: '3px',
  marginTop: '1px',
});

const Navlink = ({ step, width }) => {
  const { pathname } = useLocation();
  const currentStep = pathname.split('/')[2];

  const iconComponent = () => {
    let Component = step.icon;
    return React.cloneElement(Component, {
      color: currentStep === step.name ? HighlightColor : undefined,
    });
  };

  return (
    <Link to={{ pathname: `/estimates/${step.name}`, prevPath: currentStep }}>
      <NavLinkContainer
        style={{
          ...((width === 'sm' || width === 'xs') && {
            padding: '13px 15px 13px',
          }),
          ...(width === 'md' && { padding: '13px 30px 13px' }),
          ...((width === 'lg' || width === 'xl') && {
            padding: '13px 45px 13px',
          }),
        }}
      >
        <NavLinkInnerContainer>
          <SVGContainer>{iconComponent()}</SVGContainer>
          <ContentTyp
            variant={'h2'}
            style={{
              ...(currentStep === step.name && { color: HighlightColor }),
            }}
          >
            {step.title}
          </ContentTyp>
        </NavLinkInnerContainer>
      </NavLinkContainer>
      <Highlighter
        style={{
          ...(currentStep === step.name && { backgroundColor: HighlightColor }),
        }}
      />
    </Link>
  );
};

Navlink.propTypes = {
  step: PropTypes.object.isRequired,
};

export default Navlink;
