
import { bindActionCreators } from 'redux'
import { Modal } from 'components'
import { connect } from 'react-redux'
import * as modalActionCreators from 'redux/modules/modal'

// Note: this component does not have any state or life cycle events
// hence no need to create a react component

function mapStateToProps ({modal, users}, props) {
  const textLength = modal.text.length
  return {
    user: users[users.authedId] ? users[users.authedId].info : {},
    text: modal.text,
    isOpen: modal.isOpen,
    isSubmitDisabled: textLength <= 0 || textLength > 140,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(modalActionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal)