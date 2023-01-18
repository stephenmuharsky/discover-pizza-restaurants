import { createContext, useReducer } from "react";

export const StoreContext = createContext();

export const ACTION_TYPES = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_PIZZA_RESTAURANTS: "SET_PIZZA_RESTAURANTS",
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return { ...state, latLong: action.payload.latLong };
    }
    case ACTION_TYPES.SET_PIZZA_RESTAURANTS: {
      return { ...state, pizzaRestaurants: action.payload.pizzaRestaurants };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: "",
    pizzaRestaurants: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
