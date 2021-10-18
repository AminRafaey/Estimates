import React from 'react';

const ReportStateContext = React.createContext(null);
const ReportDispatchContext = React.createContext(null);

function ReportReducer(state, action) {
  const {
    options,
    selected,
    index,
    newIndex,
    oldIndex,
    report,
  } = action.payload;
  switch (action.type) {
    case 'LOAD_Report_CONTEXT':
      return [...action.payload.report];
    case 'ADD_REPORT':
      return [...state, action.payload.report];
    case 'ADD_REPORT_ATTRIBUTE':
      state[index] = { ...state[index], selected };
      return [...state];
    case 'MOVE_UP':
      if (index !== 0) {
        let temp = state[index - 1];
        state[index - 1] = state[index];
        state[index] = temp;
      }
      return [...state];
    case 'MOVE_DOWN':
      if (index !== state.length - 1) {
        let temp = state[index + 1];
        state[index + 1] = state[index];
        state[index] = temp;
      }
      return [...state];
    case 'DELETE_REPORT':
      state.splice(index - 1, 1);
      return [...state];
    case 'UPDATE_POSITION':
      state.splice(newIndex, 0, state.splice(oldIndex, 1)[0]);
      return [...state];
    case 'ADD_OPTIONS':
      state[index] = { ...state[index], options };
      return [...state];
    case 'ADD_REPORT_AT_POSITION':
      state.splice(index, 0, report);
      return [...state];
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function ReportProvider({ children, report }) {
  const [state, dispatch] = React.useReducer(
    ReportReducer,
    report ? [...report] : []
  );
  return (
    <ReportStateContext.Provider value={state}>
      <ReportDispatchContext.Provider value={dispatch}>
        {children}
      </ReportDispatchContext.Provider>
    </ReportStateContext.Provider>
  );
}

function useReportState() {
  const context = React.useContext(ReportStateContext);
  if (context === undefined) {
    throw new Error('useReportState must be used inside a ReportProvider');
  }
  return context;
}

function useReportDispatch() {
  const context = React.useContext(ReportDispatchContext);
  if (context === undefined) {
    throw new Error('useReportDispatch must be used inside a ReportProvider');
  }
  return context;
}

function loadReportContext(dispatch, data) {
  dispatch({
    type: 'LOAD_REPORT_CONTEXT',
    payload: data,
  });
}

function addReport(dispatch, data) {
  dispatch({
    type: 'ADD_REPORT',
    payload: data,
  });
}

function addReportAttribute(dispatch, data) {
  dispatch({
    type: 'ADD_REPORT_ATTRIBUTE',
    payload: data,
  });
}

function moveUp(dispatch, data) {
  dispatch({
    type: 'MOVE_UP',
    payload: data,
  });
}
function moveDown(dispatch, data) {
  dispatch({
    type: 'MOVE_DOWN',
    payload: data,
  });
}
function deleteReport(dispatch, data) {
  dispatch({
    type: 'DELETE_REPORT',
    payload: data,
  });
}

function updatePosition(dispatch, data) {
  dispatch({
    type: 'UPDATE_POSITION',
    payload: data,
  });
}
function addOptions(dispatch, data) {
  dispatch({
    type: 'ADD_OPTIONS',
    payload: data,
  });
}
function addReportAtPosition(dispatch, data) {
  dispatch({
    type: 'ADD_REPORT_AT_POSITION',
    payload: data,
  });
}
export {
  ReportProvider,
  useReportState,
  useReportDispatch,
  loadReportContext,
  addReport,
  addReportAttribute,
  moveUp,
  moveDown,
  deleteReport,
  updatePosition,
  addOptions,
  addReportAtPosition,
};
