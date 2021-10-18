import React from 'react';

const LinkingStateContext = React.createContext(null);
const LinkingDispatchContext = React.createContext(null);

function LinkingReducer(state, action) {
  switch (action.type) {
    case 'LOAD_Linking_CONTEXT':
      return {
        ...action.payload.linking,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function LinkingProvider({ children, linking }) {
  const [state, dispatch] = React.useReducer(
    LinkingReducer,
    linking ? { ...linking } : {}
  );
  return (
    <LinkingStateContext.Provider value={state}>
      <LinkingDispatchContext.Provider value={dispatch}>
        {children}
      </LinkingDispatchContext.Provider>
    </LinkingStateContext.Provider>
  );
}

function useLinkingState() {
  const context = React.useContext(LinkingStateContext);
  if (context === undefined) {
    throw new Error('useLinkingState must be used inside a LinkingProvider');
  }
  return context;
}

function useLinkingDispatch() {
  const context = React.useContext(LinkingDispatchContext);
  if (context === undefined) {
    throw new Error('useLinkingDispatch must be used inside a LinkingProvider');
  }
  return context;
}

export {
  LinkingProvider,
  useLinkingState,
  useLinkingDispatch,
  loadLinkingContext,
};

function loadLinkingContext(dispatch, data) {
  dispatch({
    type: 'LOAD_Linking_CONTEXT',
    payload: data,
  });
}
