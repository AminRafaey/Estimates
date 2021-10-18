import React from 'react';

const ColorStateContext = React.createContext(null);
const ColorDispatchContext = React.createContext(null);

function ColorReducer(state, action) {
  switch (action.type) {
    case 'LOAD_COLOR_CONTEXT':
      return {
        ...action.payload.colors,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function ColorProvider({ children, color }) {
  const [state, dispatch] = React.useReducer(
    ColorReducer,
    color ? { ...color } : {}
  );
  return (
    <ColorStateContext.Provider value={state}>
      <ColorDispatchContext.Provider value={dispatch}>
        {children}
      </ColorDispatchContext.Provider>
    </ColorStateContext.Provider>
  );
}

function useColorState() {
  const context = React.useContext(ColorStateContext);
  if (context === undefined) {
    throw new Error('useColorState must be used inside a ColorProvider');
  }
  return context;
}

function useColorDispatch() {
  const context = React.useContext(ColorDispatchContext);
  if (context === undefined) {
    throw new Error('useColorDispatch must be used inside a ColorProvider');
  }
  return context;
}

export { ColorProvider, useColorState, useColorDispatch, loadColorContext };
function loadColorContext(dispatch, data) {
  dispatch({
    type: 'LOAD_COLOR_CONTEXT',
    payload: data,
  });
}
