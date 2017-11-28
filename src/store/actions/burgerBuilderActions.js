import * as actionTypes from './actionTypes';
import axios from '../../axios-order';

export const addIngredient = (name) => {
  return {
    type: actionTypes.ADD_INGREDIENTS,
    payload: name
  }
};

export const removeIngredient = (name) => {
  return {
    type: actionTypes.REMOVE_INGREDIENTS,
    payload: name
  }
};

export const initIngredients = () => {
  return dispatch => {
    axios.get('https://react-my-burger-97a1b.firebaseio.com/ingredients.json')
      .then(response => {
        dispatch(setIngredients(response.data));
      }).catch(err => {
        dispatch(fetchIngredientsFailed());
    })
  }
};

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    payload: ingredients
  }
};

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  }
};