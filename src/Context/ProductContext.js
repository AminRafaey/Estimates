import React from 'react';

const ProductStateContext = React.createContext(null);
const ProductDispatchContext = React.createContext(null);

function ProductReducer(state, action) {
  switch (action.type) {
    case 'LOAD_PRODUCTS':
      return {
        ...action.payload.products,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function ProductProvider({ children, product }) {
  const [state, dispatch] = React.useReducer(
    ProductReducer,
    product ? { ...product } : {}
  );
  return (
    <ProductStateContext.Provider value={state}>
      <ProductDispatchContext.Provider value={dispatch}>
        {children}
      </ProductDispatchContext.Provider>
    </ProductStateContext.Provider>
  );
}

function useProductState() {
  const context = React.useContext(ProductStateContext);
  if (context === undefined) {
    throw new Error('useProductState must be used inside a ProductProvider');
  }
  return context;
}

function useProductDispatch() {
  const context = React.useContext(ProductDispatchContext);
  if (context === undefined) {
    throw new Error('useProductDispatch must be used inside a ProductProvider');
  }
  return context;
}

export { ProductProvider, useProductState, useProductDispatch, loadProducts };

function loadProducts(dispatch, data) {
  dispatch({
    type: 'LOAD_PRODUCTS',
    payload: data,
  });
}
