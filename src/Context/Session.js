import React from 'react';

const SessionStateContext = React.createContext(null);
const SessionDispatchContext = React.createContext(null);

function SessionReducer(state, action) {
  const { expired } = action.payload;
  switch (action.type) {
    case 'UPDATE_SESSION_EXPIRED':
      state['expired'] = expired;
      return {
        ...state,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function SessionProvider({ children, session }) {
  const [state, dispatch] = React.useReducer(
    SessionReducer,
    session ? { ...session } : {}
  );
  return (
    <SessionStateContext.Provider value={state}>
      <SessionDispatchContext.Provider value={dispatch}>
        {children}
      </SessionDispatchContext.Provider>
    </SessionStateContext.Provider>
  );
}

function useSessionState() {
  const context = React.useContext(SessionStateContext);
  if (context === undefined) {
    throw new Error('useSessionState must be used inside a SessionProvider');
  }
  return context;
}

function useSessionDispatch() {
  const context = React.useContext(SessionDispatchContext);
  if (context === undefined) {
    throw new Error('useSessionDispatch must be used inside a SessionProvider');
  }
  return context;
}

export {
  SessionProvider,
  useSessionState,
  useSessionDispatch,
  updateSessionExpired,
};
function updateSessionExpired(dispatch, data) {
  dispatch({
    type: 'UPDATE_SESSION_EXPIRED',
    payload: data,
  });
}
