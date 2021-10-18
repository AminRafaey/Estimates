import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Accordion as MuiAccordion } from '@material-ui/core';
import ReactDOMServer from 'react-dom/server';
import AccordionArrow from '../../../../resources/AccordionArrowIcon';
const StyledMuiAccordion = withStyles({
  root: {
    position: 'static',
    background: '#e9eef5',
    boxShadow: 'none',
    '&.Mui-expanded': {
      margin: 0,
    },
  },
  expanded: {
    margin: 0,
  },
})(MuiAccordion);

const handleChange = (isExpanded, headerStatusRef) => {
  if (headerStatusRef) {
    isExpanded
      ? (headerStatusRef.current.innerHTML = ReactDOMServer.renderToStaticMarkup(
          <AccordionArrow iconType={'Less'} />
        ))
      : (headerStatusRef.current.innerHTML = ReactDOMServer.renderToStaticMarkup(
          <AccordionArrow iconType={'More'} />
        ));
  }
};

export const Accordion = (props) => {
  const { children, setExpandIcon, headerStatusRef, type, ...other } = props;
  return (
    <StyledMuiAccordion
      {...other}
      {...(type === 'controlled'
        ? {}
        : {
            onChange: (event, isExpanded) =>
              handleChange(isExpanded, headerStatusRef),
          })}
    >
      {children}
    </StyledMuiAccordion>
  );
};
