import React from 'react'
import ReactDOM from 'react-dom'
import {Cell} from 'fixed-data-table'
import {Checkbox,Glyphicon, Row, Col, Button, Modal, FormGroup, ControlLabel, HelpBlock, FormControl} from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange, progressbargeneral} from 'containers/Infrastructure/styles.css'
import AttributeConstants from 'constants/AttributeConstants'
import {blueBtn, btnPrimary,selectStyle, modalCloseBtnStyle,} from 'sharedStyles/styles.css'
import {modalContainer,remediationDialogClass,suppressDialogClass, modal, customHrRemediation, modalCloseStyle} from './styles.css'
import Select from 'react-select'
import closeButtonImg from 'assets/close_Button.png'
import {suppressRules} from 'helpers/reports'

class SuppressRule extends React.Component {
	constructor(props) {
    super(props);
    
    this.closeSuppressModal = this.closeSuppressModal.bind(this)
    this.handleSuppressOption = this.handleSuppressOption.bind(this)
    this.handleSuppressReason = this.handleSuppressReason.bind(this)
    this.saveSuppression = this.saveSuppression.bind(this)
    
    this.state = {
     	showSuppressModal: this.props.showSuppressModal,
      suppressOption: 'deviceOnly',
      suppressReason: ''
    }
  }

  closeSuppressModal(){
    this.setState({showSuppressModal: false})
    this.props.closeSuppressModal();
  }

  handleSuppressOption(option){
    this.setState({suppressOption: option.target.value})
  } 

  handleSuppressReason(e){
    this.setState({suppressReason: e.target.value})
  }

  saveSuppression(){

    let suppressParam = {}
    let pp = 'root.'
    
    suppressParam['wid'] = parseInt(this.props.worklogId)
    suppressParam['ppname'] = pp.concat(this.props.pp)
    
    if(this.props.suppressRule)
    {
      suppressParam['suppressed'] = true
      suppressParam['reason'] = this.state.suppressReason
    }
    else
    {
      suppressParam['suppressed'] = false
    }
    suppressParam['polresid'] = parseInt(this.props.policyResultId)

    if (this.props.reportType && this.props.reportType === 'deviceCompliance')
    {
       if (this.state.suppressOption === 'deviceOnly')
        suppressParam['asgroup'] = false
      else 
        suppressParam['asgroup'] = true
    } else if (this.props.reportType && this.props.reportType === 'cloud'){
       suppressParam['asgroup'] = true
    }
    console.log('suppressRules ',suppressParam)
    
    suppressRules(suppressParam)
    .then((response) =>{
      this.setState({showSuppressModal: false})
      this.props.closeSuppressModal();
      this.props.refresh()
    })
    .catch((suppressError)=>console.log('error in suppression',suppressError))

  }

 render() {
  // ++++++ Used for displaying radio options (disaplyed only for device compliance report) +++++++++++ //
    console.log('this.props.reportType ', this.props.reportType)
    let displaySuppressOptions = 'none'
    if (this.props.reportType && this.props.reportType === 'cloud'){
      displaySuppressOptions = 'none'
    } else if (this.props.reportType && this.props.reportType === 'deviceCompliance'){
      displaySuppressOptions = 'block'
    }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
 	
  let disableSave = this.state.suppressReason == '' ? true : false

  return(
 		<div>
    {this.props.suppressRule?
 		 <Modal
          dialogClassName={suppressDialogClass}
          show={this.state.showSuppressModal}
          backdrop='static'
          aria-labelledby="contained-modal-title">
          <form style={{border: '1px solid Navy'}}>
          <div style={{marginTop:'25px',paddingLeft:'15px'}}>
            <Modal.Header  style={{marginLeft:15,marginRight:25,padding: '0 0 0 15px',borderBottom:0}}>
                <a style={{position:'absolute', top:8, right:41,textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} onClick={this.closeSuppressModal}>
                  <img style={{width:13,height:18}} src={closeButtonImg} alt='close_btn'/>
                </a>
                <Modal.Title id="contained-modal-title"
                  style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'SUPPRESS POLICY'}
                </Modal.Title>
            </Modal.Header>
             <Modal.Body>
             <div style={{marginLeft:'15px',marginRight:'15px'}}>
             Suppress this policy result, and remove it from the score and state.
             <table style={{width:'100%', marginTop:'20px'}}>
            <tbody>
              <tr style={{display:'flex'}}>
                <td style={{whiteSpace:'nowrap'}}><strong>Policy name:</strong></td>
                <td>&nbsp;{this.props.policyName}</td>
              </tr>
              <br />
              {this.props.reportType === 'deviceCompliance'?
              <tr style={{display:'flex'}}>
                <td style={{whiteSpace:'nowrap'}}><strong>Device name:</strong></td>
                <td>&nbsp;{this.props.deviceName}</td>
              </tr>:''}    
             </tbody>
            </table><br/>
            Reason:
            <br/>
            <br/>
            <FormGroup controlId="formGroupDesc">
                <FormControl componentClass="textarea" style={{width:400,height:100,marginLeft:15,padding:'12px',borderRadius:0,border:this.state.groupDesc_border}}
                 onChange={this.handleSuppressReason} placeholder="Enter Reason"/>
                <Col xs={12}><HelpBlock>{this.state.groupDesc_error}</HelpBlock></Col>
            </FormGroup>
            <div style={{display: displaySuppressOptions}}>
             <label style={{fontWeight:'500'}}>
                <input type="radio" id='assetGroupSuppression'  name="suppressOption" value="deviceOnly" checked={this.state.suppressOption === 'deviceOnly'?true:false} onChange={this.handleSuppressOption}/>
                &nbsp;&nbsp; Suppress for this device only
              </label><br/>
              <label style={{fontWeight:'500'}}>
                <input type="radio" id='assetGroupSuppression' name="suppressOption" value="assetGroup" checked={this.state.suppressOption === 'assetGroup'?true:false} onChange={this.handleSuppressOption}/>
                  &nbsp;&nbsp; Suppress for entire Asset group
              </label><br/><br/>
              </div>
             </div>
            </Modal.Body>
             <Modal.Footer style={{marginRight:30,marginBottom:15,borderTop:0}}>
                <Button className={blueBtn} onClick={this.closeSuppressModal}>Cancel</Button>&nbsp;&nbsp;&nbsp;
                <Button
                  disabled={disableSave}
                  onClick={this.saveSuppression}
                  bsStyle='primary' 
                  className={btnPrimary} 
                  style={{borderRadius: 0}}>
                  Suppress
                </Button>
            </Modal.Footer>
            </div>
          </form>
        </Modal>
        :<div>
        <Modal
          dialogClassName={suppressDialogClass}
          show={this.state.showSuppressModal}
          backdrop='static'
          aria-labelledby="contained-modal-title">
          <form style={{border: '1px solid Navy'}}>
          <div style={{marginTop:'25px',paddingLeft:'15px'}}>
            <Modal.Header  style={{marginLeft:15,marginRight:25,padding: '0 0 0 15px',borderBottom:0}}>
                <a style={{position:'absolute', top:8, right:41,textDecoration:'none'}} href="javascript:void(0)" className={modalCloseStyle} onClick={this.closeSuppressModal}>
                  <img style={{width:13,height:18}} src={closeButtonImg} alt='close_btn'/>
                </a>
                <Modal.Title id="contained-modal-title"
                  style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'UNSUPPRESS POLICY'}
                </Modal.Title>
            </Modal.Header>
             <Modal.Body>
             <div style={{marginLeft:'15px',marginRight:'15px'}}>
             Unsuppress this policy result and recalculate the score.
             <table style={{width:'100%', marginTop:'20px'}}>
            <tbody>
              <tr style={{display:'flex'}}>
                <td style={{whiteSpace:'nowrap'}}><strong>Policy name:</strong></td>
                <td>&nbsp;{this.props.policyName}</td>
              </tr>
              <br />
              {this.props.reportType === 'deviceCompliance'?
              <tr style={{display:'flex'}}>
                <td style={{whiteSpace:'nowrap'}}><strong>Device name:</strong></td>
                <td>&nbsp;{this.props.deviceName}</td>
              </tr>:''}    
             </tbody>
            </table><br/>
          
            <div style={{display: displaySuppressOptions}}>
             <label style={{fontWeight:'500'}}>
                <input type="radio" id='assetGroupSuppression'  name="suppressOption" value="deviceOnly" checked={this.state.suppressOption === 'deviceOnly'?true:false} onChange={this.handleSuppressOption}/>
                &nbsp;&nbsp; Unsuppress for this device only
              </label><br/>
              <label style={{fontWeight:'500'}}>
                <input type="radio" id='assetGroupSuppression' name="suppressOption" value="assetGroup" checked={this.state.suppressOption === 'assetGroup'?true:false} onChange={this.handleSuppressOption}/>
                  &nbsp;&nbsp; Unsuppress for entire Asset group
              </label><br/><br/>
              </div>
             </div>
            </Modal.Body>
             <Modal.Footer style={{marginRight:30,marginBottom:15,borderTop:0}}>
                <Button className={blueBtn} onClick={this.closeSuppressModal}>Cancel</Button>&nbsp;&nbsp;&nbsp;
                <Button
                  onClick={this.saveSuppression}
                  bsStyle='primary' 
                  className={btnPrimary} 
                  style={{borderRadius: 0}}>
                  Unsuppress
                </Button>
            </Modal.Footer>
            </div>
          </form>
        </Modal>
        </div>
      }
    }
 		</div>
 	)
 }
}

export default SuppressRule
