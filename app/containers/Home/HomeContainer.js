import React from 'react'
import { Home } from 'components'

const HomeContainer = React.createClass({
	getInitialState () {
    return {showLogin: false}
  },
  handleclick () {
    this.setState({showLogin: true})
  },
  render () {
    return (
      <Home handleclick = {this.handleclick} showLogin = {this.state.showLogin} />
    )
  },
})
export default HomeContainer
