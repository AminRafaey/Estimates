import React from 'react';
import { Breadcrumbs, styled, Box, withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import EstimateSelection from './EstimateSelection';
import { HighlightColor } from '../../../constants/theme';
const HeaderWrapper = styled(Box)({
  width: 'max-content',
});

const GalleryTyp = styled(Typography)({
  fontSize: 15,
  color: HighlightColor,
  fontFamily: 'medium',
});

const StyledBreadcrumbs = withStyles({
  separator: {
    marginInline: 0,
  },
})(Breadcrumbs);
export default function EstimateNumSel(props) {
  const { estimates, getEstimatesLoader, selected, setSelected } = props;
  return (
    <HeaderWrapper>
      <StyledBreadcrumbs
        separator={
          <NavigateNextIcon
            style={{ fill: '#9A9A9D', height: 20, width: 20 }}
          />
        }
        aria-label="breadcrumb"
      >
        <EstimateSelection
          estimates={estimates}
          getEstimatesLoader={getEstimatesLoader}
          selected={selected}
          setSelected={setSelected}
        />
        <GalleryTyp color="textPrimary">Image Gallery</GalleryTyp>
      </StyledBreadcrumbs>
    </HeaderWrapper>
  );
}
