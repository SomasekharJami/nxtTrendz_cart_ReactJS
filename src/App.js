import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const filteredData = cartList.filter(eachData => eachData.id !== id)
    this.setState({cartList: filteredData})
  }

  incrementCartItemQuantity = id => {
    const {cartList} = this.state
    const chosen = cartList.filter(eachItem => eachItem.id === id)
    const incItem = chosen[0]
    const incList = cartList.filter(eachInc => eachInc.id !== id)
    const newItem = {...incItem, quantity: incItem.quantity + 1}
    const newIncList = [...incList, newItem]
    this.setState({cartList: newIncList})
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state
    const cartThing = cartList.filter(eachCart => eachCart.id === id)
    if (cartThing[0].quantity > 1) {
      const decList = cartList.map(eachItem => {
        if (eachItem.id === id) {
          return {...eachItem, quantity: eachItem.quantity - 1}
        }
        return eachItem
      })
      this.setState({cartList: decList})
    } else {
      this.removeCartItem(id)
    }
  }

  addCartItem = product => {
    const {id, quantity} = product
    const {cartList} = this.state
    const filteredList = cartList.filter(eachThing => eachThing.id === id)
    if (filteredList.length > 0) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachVal => {
          if (eachVal.id === id) {
            return {...eachVal, quantity: eachVal.quantity + quantity}
          }
          return eachVal
        }),
      }))
    } else {
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    }
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
