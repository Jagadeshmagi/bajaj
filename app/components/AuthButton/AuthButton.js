import React, { PropTypes } from 'react'
import {Button} from 'react-bootstrap'
import {btnPrimary} from './styles.css'

AuthButton.propTypes = {
  onAuth: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
}

export default function AuthButton ({onAuth, isFetching}) {
  return (
    <Button bsStyle='primary' className={btnPrimary} bsSize='large' style={{borderRadius: 0}} onClick={onAuth} >
      {isFetching === true
        ? 'Signing in'
        : 'Sign In'}
    </Button>
  )
}
