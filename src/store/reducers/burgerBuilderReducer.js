import * as actionTypes from '../actions/actionTypes';

const initialState = {
  // ingredients: {
  //   salad: 0,
  //   meat: 0,
  //   cheese: 0,
  //   bacon: 0
  // },
  ingredients: null,
  totalPrice: 4,
  error: false
};

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  bacon: 0.7,
  meat: 1.3
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENTS: return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENTS: return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFail(state, action);
    default: return state;
  }
};

const addIngredient = (state, action) => {
  return {
    ...state,
    ingredients: {
      ...state.ingredients,
      [action.payload] : state.ingredients[action.payload] + 1
    },
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.payload]
  };
};

const removeIngredient = (state, action) => {
  return {
    ...state,
    ingredients: {
      ...state.ingredients,
      [action.payload] : state.ingredients[action.payload] - 1
    },
    totalPrice: state.totalPrice - INGREDIENT_PRICES[action.payload]
  };
};

const setIngredients = (state, action) => {
  return {
    ...state,
    ingredients: {
      salad: action.payload.salad,
      bacon: action.payload.bacon,
      cheese: action.payload.cheese,
      meat: action.payload.meat
    },
    totalPrice: 4,
    error: false
  };
};

const fetchIngredientsFail = (state, action) => {
  return {
    ...state,
    error: true
  };
};

export default reducer;