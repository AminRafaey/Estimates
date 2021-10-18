import React from 'react';
import { cloneState } from '../components/EstimateProduct/stateClone';

const SurfaceProductionRatesStateContext = React.createContext(null);
const SurfaceProductionRatesDispatchContext = React.createContext(null);

function SurfaceProductionRatesReducer(state, action) {
  const stateClone = cloneState(state);
  switch (action.type) {
    case 'LOAD_SURFACE_PRODUCTION_RATES':
      return {
        ...stateClone,
        ...action.payload.surfaceProductionRates,
      };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function SurfaceProductionRatesProvider({ children, surfaceProductionRates }) {
  const [state, dispatch] = React.useReducer(
    SurfaceProductionRatesReducer,
    surfaceProductionRates ? { ...surfaceProductionRates } : {}
  );
  return (
    <SurfaceProductionRatesStateContext.Provider value={state}>
      <SurfaceProductionRatesDispatchContext.Provider value={dispatch}>
        {children}
      </SurfaceProductionRatesDispatchContext.Provider>
    </SurfaceProductionRatesStateContext.Provider>
  );
}

function useSurfaceProductionRatesState() {
  const context = React.useContext(SurfaceProductionRatesStateContext);
  if (context === undefined) {
    throw new Error(
      'useSurfaceProductionRatesState must be used inside a SurfaceProductionRatesProvider'
    );
  }
  return context;
}

function useSurfaceProductionRatesDispatch() {
  const context = React.useContext(SurfaceProductionRatesDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useSurfaceProductionRatesDispatch must be used inside a SurfaceProductionRatesProvider'
    );
  }
  return context;
}

export {
  SurfaceProductionRatesProvider,
  useSurfaceProductionRatesState,
  useSurfaceProductionRatesDispatch,
  loadSurfaceProductionRatesContext,
};

function loadSurfaceProductionRatesContext(dispatch, data) {
  dispatch({
    type: 'LOAD_SURFACE_PRODUCTION_RATES',
    payload: data,
  });
}
