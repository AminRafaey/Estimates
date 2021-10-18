import React from 'react';
import { cloneState } from '../components/EstimateProduct/stateClone';

const SurfaceSelectionStateContext = React.createContext(null);
const SurfaceSelectionDispatchContext = React.createContext(null);

function SurfaceSelectionReducer(state, action) {
  const { surfaceId, surfaceName, surface } = action.payload;
  const stateClone = cloneState(state);
  switch (action.type) {
    case 'UPDATE_SURFACES':
      return [...action.payload];
    case 'LOAD_SURFACE_CONTEXT':
      return [...action.payload.surfaces];
    case 'UPDATE_SURFACE_NAME':
      function countTrueAndFalseOnes(surface) {
        for (let c1 = 0; c1 < surface.length; c1++) {
          if (surface[c1]['id'] === surfaceId) {
            surface[c1]['name'] = surfaceName;
            return true;
          }
          if (surface[c1].surfaces && surface[c1].surfaces.length > 0) {
            if (countTrueAndFalseOnes(surface[c1].surfaces)) return;
          }
        }
      }
      countTrueAndFalseOnes(stateClone);
      return [...stateClone];
    case 'ADD_SURFACE':
      return [...stateClone, surface];
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function SurfaceSelectionProvider({ children, surfaces }) {
  const [state, dispatch] = React.useReducer(
    SurfaceSelectionReducer,
    surfaces ? [...surfaces] : []
  );
  return (
    <SurfaceSelectionStateContext.Provider value={state}>
      <SurfaceSelectionDispatchContext.Provider value={dispatch}>
        {children}
      </SurfaceSelectionDispatchContext.Provider>
    </SurfaceSelectionStateContext.Provider>
  );
}

function useSurfaceSelectionState() {
  const context = React.useContext(SurfaceSelectionStateContext);
  if (context === undefined) {
    throw new Error(
      'useSurfaceSelectionState must be used inside a SurfaceSelectionProvider'
    );
  }
  return context;
}

function useSurfaceSelectionDispatch() {
  const context = React.useContext(SurfaceSelectionDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useSurfaceSelectionDispatch must be used inside a SurfaceSelectionProvider'
    );
  }
  return context;
}

export {
  SurfaceSelectionProvider,
  useSurfaceSelectionState,
  useSurfaceSelectionDispatch,
  updateSurfaces,
  loadSurfaceContext,
  updateSurfaceName,
  addSurface,
};

function updateSurfaces(dispatch, data) {
  dispatch({
    type: 'UPDATE_SURFACES',
    payload: data,
  });
}

function loadSurfaceContext(dispatch, data) {
  dispatch({
    type: 'LOAD_SURFACE_CONTEXT',
    payload: data,
  });
}

function updateSurfaceName(dispatch, data) {
  dispatch({
    type: 'UPDATE_SURFACE_NAME',
    payload: data,
  });
}

function addSurface(dispatch, data) {
  dispatch({
    type: 'ADD_SURFACE',
    payload: data,
  });
}
