import React, {PropTypes} from 'react'
import {Cell} from 'fixed-data-table'
import {Button,Popover, Modal } from 'react-bootstrap'
import {CreateGroup} from 'containers'

export class IPSettingsConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      show:this.props.openModal
    }
  }


  render() {
    let close = () => this.setState({ show: false});

    return(
      <div className="modal-container" style={{display: 'inline-block'}}>

        <Modal
          show={this.state.show}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <a style={{textDecoration:'none', float: 'right', fontSize: 21, fontWeight: 700, lineHeight: 1,color: '#4C58A4', marginRight: 15, marginTop:15}} href="javascript:void(0)" onClick={close}>X</a>
          <Modal.Header style={{borderStyle:'none'}}></Modal.Header>
          <Modal.Body>
            <h4 style={{marginTop:-20}}>IPConfig settings are saved</h4>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

