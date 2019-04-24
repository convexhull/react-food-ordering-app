import React , { Component } from 'react';
import Button from '../../../components/UI/Button/Button'; 
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm : {
            name: {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'Your name'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            street: {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'Street'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            zipCode: {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'ZIP Code'
                },
                value : '',
                validation : {
                    required : true,
                    minlength : 5,
                    maxlength : 5
                },
                valid : false,
                touched : false
            },
            country: {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'Country'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            email: {
                elementType : 'input',
                elementConfig : {
                    type : 'email',
                    placeholder : 'Your E-Mail'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            deliveryMethod: {
                elementType : 'select',
                elementConfig : {
                    options : [
                        { value : 'fastest', displayValue : 'Fastest' },
                        { value : 'cheapest', displayValue : 'Cheapest' }
                    ]
                },
                value : '',
                valid : true,
                validation : {}
            }
        },
        formIsValid : false,
        loading : false
    }

    checkValidity = (value, rules) => {
        let isValid = true;
        if(!rules) {
            return true;
        }
        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.minlength) {
            isValid = value.length >= rules.minlength && isValid;
        }
        if(rules.maxlength) {
            isValid = value.length <= rules.maxlength && isValid;
        }
        return isValid;
    }

    orderHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for( let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        console.log(formData)
        this.setState( { loading: true } );
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData : formData
        }
        axios.post( '/orders.json', order )
            .then( response => {
                this.setState( { loading: false} );
                this.props.history.push('/');
            } )
            .catch( error => {
                this.setState( { loading: false } );
            } );
    }

    inputChangedHandler = (event,inputIdentifier) => {
        //CONVECTIONAL WAY
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = { ...updatedOrderForm[inputIdentifier] };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value , updatedFormElement.validation)
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        console.log(updatedFormElement);
        let formIsValid = true;
        for( let inputIdentifier in updatedOrderForm ) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
        }
        console.log(formIsValid);
        this.setState({
            orderForm : updatedOrderForm,
            formIsValid : formIsValid
        })

        //WORKS LIKE CHARM
        // const updateOrderForm = JSON.parse(JSON.stringify(this.state.orderForm));
        // updateOrderForm[inputIdentifier]["value"] = event.target.value;
        // this.setState({
        //     orderForm : updateOrderForm
        // });

        // BELOW IS IMPROPER BUT STILL WORKS
        // const updatedOrderForm = {
        //     ...this.state.orderForm
        // }
        // updatedOrderForm[inputIdentifier]["value"] = event.target.value;
        // this.setState({
        //     orderForm : updatedOrderForm
        // });  

        // WRONG : GIVES WARNING DON'T MUTATE STATE DIRECTLY
        // this.state.orderForm[inputIdentifier]["value"] = event.target.value;

        
    }

    render() {
        const formElementsArray = [];
        for(let key in this.state.orderForm) {
            formElementsArray.push({
                id : key,
                config : this.state.orderForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map( formElement => (
                    <Input
                        touched={formElement.config.touched}
                        shouldValidate={formElement.config.validation}
                        invalid={!formElement.config.valid }
                        changed={(event) => this.inputChangedHandler(event,formElement.id)}
                        key={formElement.id}
                        elementType={formElement.config.elementType} 
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value} />
                ))}
                <Button disabled={!this.state.formIsValid} btnType="Success">ORDER</Button>
            </form>
        )
        if(this.state.loading) {
            form  = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter Your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;