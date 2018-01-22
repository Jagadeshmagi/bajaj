import React, { PropTypes } from 'react'
import { centeredContainer, errorMsg } from 'sharedStyles/styles.css'
import { AuthButton } from 'components'

Authenticate.propTypes = {
  error: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  onAuth: PropTypes.func.isRequired,
}

export default function Authenticate ({onAuth, isFetching, error}) {
  return (
    <div className={centeredContainer}>
       <AuthButton isFetching={isFetching} onAuth={onAuth} />

    </div>
  )
}
