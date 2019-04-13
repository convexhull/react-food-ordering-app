import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


const INGREDIENT_PRICES = {
    salad : 0.5,
    meat : 1.3,
    bacon : 0.7,
    cheese : 0.4
}

class BurgerBuilder extends Component {
    
    state = {
        ingredients : {
            salad : 0,
            bacon : 0,
            cheese : 0,
            meat : 0
        },
        totalPrice : 4,
        purchasable : false,
        purchasing : false,
        loading : false
    }

    updatePurchaseStatus(ingredients) {
        const sum = Object.keys(ingredients)
            .map( igKey => ingredients[igKey])
            .reduce( (sum,el) => sum+el,0);
        this.setState({purchasable : sum > 0 })
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];  
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice : newPrice, ingredients : updatedIngredients});
        this.updatePurchaseStatus(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];  
        if(oldCount <= 0) {
            return ;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice : newPrice, ingredients : updatedIngredients});
        this.updatePurchaseStatus(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing : true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing : false});
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
        this.setState({loading : true});
        const order = {
            ingredients : this.state.ingredients,
            price : this.state.totalPrice,
            customer : {
                name : 'Yash',
                address : {
                    street : 'TestStreet 1',
                    zipCode : '400006',
                    country : 'India'
                },
                email : 'test@test.com'
            },
            deliveryMethod : 'fastest'
        }
        axios.post('/orders',order)
            .then ( response => {
                this.setState({loading : false, purchasing : false});
            })
            .catch( e => {
                this.setState({loading : false, purchasing : false});
            })
            
    }
    render() {
        let orderSummary = <OrderSummary 
        price={this.state.totalPrice}
        ingredients={this.state.ingredients}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler} />


        if(this.state.loading) {
            orderSummary = <Spinner />
        }
        const disabledInfo = {
            ...this.state.ingredients
        }
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key]<=0
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modelClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}
                    price={this.state.totalPrice}
                    ordered={this.purchaseHandler} />
            </Aux>
        )
    }
}


export default withErrorHandler(BurgerBuilder, axios);