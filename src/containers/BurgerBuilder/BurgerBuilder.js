import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-order';
import Aux from '../../hoc/_Aux/_Aux'
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
// import * as actionTypes from '../../store/actions/actionTypes';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // purchasable: false,
      purchasing: false,
      // loading: false,
      // error: false
    }
  }

  componentDidMount () {
    // console.log(this.props);
    this.props.onInitIngredients();
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
      return sum + el;
      }, 0);
    return sum > 0;
  };

  // addIngredientHandler = (type) => {
  //   const oldCount = this.state.ingredients[type];
  //   const updatedCount = oldCount + 1;
  //   const updatedIngredients = {
  //     ...this.state.ingredients
  //   };
  //   updatedIngredients[type] = updatedCount;
  //
  //   const priceAddition = INGREDIENT_PRICES[type];
  //   const updatedPrice = this.state.totalPrice + priceAddition;
  //   this.setState({
  //     totalPrice: updatedPrice,
  //     ingredients: updatedIngredients
  //   });
  //   this.updatePurchaseState(updatedIngredients);
  // };
  //
  // removeIngredientHandler = (type) => {
  //   const oldCount = this.state.ingredients[type];
  //   if (oldCount <= 0) {
  //     return;
  //   }
  //   const updatedCount = oldCount - 1;
  //   const updatedIngredients = {
  //     ...this.state.ingredients
  //   };
  //   updatedIngredients[type] = updatedCount;
  //
  //   const priceReduction = INGREDIENT_PRICES[type];
  //   const updatedPrice = this.state.totalPrice - priceReduction;
  //   this.setState({
  //     total: updatedPrice,
  //     ingredients: updatedIngredients
  //   });
  //   this.updatePurchaseState(updatedIngredients);
  // };

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({purchasing: true});
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
    }

  };

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  };

  // // handler in react
  // purchaseContinueHandler = () => {
  //   // alert('You continue!');
  //
  //   const queryParams = [];
  //   for (let i in this.state.ingredients) {
  //     queryParams
  //       .push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
  //   }
  //
  //   queryParams.push("price=" + this.state.totalPrice);
  //
  //   const queryString = queryParams.join('&');
  //
  //   this.props.history.push({
  //     pathname: '/checkout',
  //     search: '?' + queryString
  //   });
  // };

  // handler in redux
  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  };


  render () {
    const disableInfo = {
      ...this.props.ings
    };

    for (let key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients = {this.props.ings}/>
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disableInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            price={this.props.price}
            isAuth={this.props.isAuthenticated}
            ordered={this.purchaseHandler}
          />
        </Aux>
      );
      orderSummary = <OrderSummary
        price={this.props.price}
        ingredients={this.props.ings}
        purchaseCanceled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}/>;
    }

    // if (this.state.loading) {
    //   orderSummary = <Spinner />;
    // }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}
const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));