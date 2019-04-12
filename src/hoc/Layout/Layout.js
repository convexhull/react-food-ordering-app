import React , {Component} from 'react';

import Aux from '../Aux/Aux';
import classes from './Layout.module.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class  Layout extends Component{

    state = {
        showSideDrawer : false
    }

    sideDrawerClosedHandler = () => {
        this.setState({
            showSideDrawer : false
        })
    }

    sideDrawerToggleHandler = () => {
        // Recommended Async way
        this.setState( (prevState, props)=> {
            return {showSideDrawer : !prevState.showSideDrawer};
        })

        // Faulty way
        // this.setState({
        //     showSideDrawer : !this.state.showSideDrawer
        // })
    }
    render() {
        return (
            <Aux>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler} />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
} 

export default Layout;