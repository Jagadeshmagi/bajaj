import React, {PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { logoutAndUnauthWithError } from 'redux/modules/users'

const SessionTimeoutContainer = React.createClass({

  componentDidMount() {
    if(this.props.isAuthed){
      this.props.logoutAndUnauthWithError("You have been logged out due to a long period of inactivity. If you wish to continue using the product, please log in again.");
    }  
  },
  render () {
    return (
      <div>Session timeout</div>
    )
  },
})

export default connect(
  ({users}) => ({users: users,isAuthed: users.isAuthed, error: users.error}),
  (dispatch) => bindActionCreators({logoutAndUnauthWithError}, dispatch)
)(SessionTimeoutContainer)