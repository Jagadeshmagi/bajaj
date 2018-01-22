import React, { PropTypes } from 'react'
import { default as ReactModal } from 'react-modal'
import {
  newModalTop, pointer, newModalInputContainer,
  newModalInput, submitModalBtn, darkBtn } from './styles.css'

const modalStyles = {
  content: {
    width: 350,
    margin: '0px auto',
    height: 220,
    borderRadius: 5,
    background: '#EBEBEB',
    padding: 0,
  },
}

const { object, string, func, bool } = PropTypes
Modal.PropTypes = {
  text: string.isRequired,
  isOpen: bool.isRequired,
  user: object.isRequired,
  isSubmitDisabled: bool.isRequired,
  openModal: func.isRequired,
  closeModal: func.isRequired,
  updateText: func.isRequired,
}

export default function Modal (props) {
  function submitFeedback () {
    console.log('Feedback', props.text)
    console.log('user', props.user)
    props.closeModal()
  }
  return (
    <span
      //className = {darkBtn}
      onClick={props.openModal} >
      {'Feedback'}
      <ReactModal style={modalStyles} isOpen={props.isOpen} onRequestClose={props.closeModal}>
        <div className = { newModalTop}>
          <span>{'Feedback'}</span>
          <span onClick={props.closeModal} className={pointer}>{'X'}</span>
        </div>
        <div className = {newModalInputContainer}>
          <textarea
            onChange = {(e) => props.updateText(e.target.value)}
            value ={props.text}
            maxlength = {140}
            type='text'
            className={newModalInput}
            placeHolder="What's on your mind?" />
        </div>
        <button
          className={submitModalBtn}
          disabled = {props.isSubmitDisabled}
          onClick={submitFeedback} >
          {'Submit'}
        </button>
      </ReactModal>
    </span>
  )
}