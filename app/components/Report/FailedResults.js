import React, { PropTypes } from 'react'
import {Modal,ControlLabel} from 'react-bootstrap'
import {modalContainer,failedDialogClass,infoCircle, modal} from './styles.css'
import {modalCloseBtnStyle } from 'sharedStyles/styles.css'
import {customModal} from 'sharedStyles/customCSS.css'
import {getFailedResults} from 'helpers/reports'
import {getRuleDetailsForDocker} from 'helpers/docker'
import {SpinnyLogo} from 'containers'

 export const FailedResults = React.createClass({
  getInitialState() {
    return {
      show: false,
      loadingdiv: true,
      policyResultId: 0,
      noData: true,
      actualResult: '',
      expectedResult: ''
    };
  },
  componenetDidMount(){
    console.log('I am called inside FailedResults',this.props.policyResultId)

  },
  componentWillReceiveProps(nextProps,nextState){
   
  },
  closeModal() {
    this.setState({showModal: false});
  },
  openModal(){
      getFailedResults(this.props.policyResultId)
      .then((result)=>{
        this.setState({showModal: true,
                      loadingdiv: false})
        if(result.data[0].expectedvalue && result.data[0].actualvalue && result.data[0].expectedvalue!='' && result.data[0].actualvalue!=''){
          this.setState({noData: false,
                        expectedResult: result.data[0].expectedvalue,
                        actualResult: result.data[0].actualvalue,
                        whatfailed: result.data[0].whatfailed},function(){
                          let newArray = [];
                          if(this.state.whatfailed[0].indexOf('</a>')>0)
                          {
                            /* Contains hrefs*/
                            for(let i=0; i< this.state.whatfailed.length; i++)
                            {
                              if(this.state.whatfailed[i].indexOf('</a>')>0)
                              {
                                
                                let index1 = this.state.whatfailed[i].indexOf('<a')
                                // console.log('GGGGGG', index1)
                                let index2 = this.state.whatfailed[i].indexOf('</a>')
                                let result ='&nbsp'+ this.state.whatfailed[i].slice(index1,index2) + '&nbsp';
                                newArray.push(result)
                                // newArray.append('\n')
                              }
                              else
                              {
                                console.log('exclude from list')
                              }
                                console.log('newArray ',newArray)
                              this.setState({whatfailed:newArray})
                            }
                          }else{
                            /* No Hrefs */
                            if(this.state.whatfailed.length == 1){
                              newArray.push(this.state.whatfailed[i])
                            }else{
                            for(let i=0; i< this.state.whatfailed.length; i++)
                            {
                              newArray.push(this.state.whatfailed[i])
                              newArray.push('\n')
                            }
                            this.setState({whatfailed:newArray})
                          }}
                      })

        }
        else{
          this.setState({noData: true})
        }
      })
      .catch((error)=>{console.log('Error in fetching failesResults',error)})
  },
  render() {
    return (
    <span className={modalContainer} >
      <a href='JavaScript: void(0)' style={{color:this.props.colorAttr,marginRight:'20px',textDecoration:'none'}} onClick={this.openModal}>
        &nbsp;&nbsp;
      Fail
      </a>
      <Modal
        show={this.state.showModal}
        onHide={this.closeDelete}
        aria-labelledby="contained-modal-title"
        className="modal fade right"
        dialogClassName={failedDialogClass}
        >
        <form style={{border: '1px solid Navy'}}>
        <Modal.Header style={{marginRight:5,borderBottom:0}}>
         <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseBtnStyle} onClick={this.closeModal}>X</a>
            <br/>
          <Modal.Title id="contained-modal-title"
                style={{fontSize: 15, fontWeight:'bold', color: '#454855'}}>{'Failed Policy'}</Modal.Title>

        </Modal.Header>
        <Modal.Body>
        {this.state.loadingdiv?
          <div style={{marginTop: 20,paddingTop:'100px',width:'100%'}}>
            <div style={{width:'90px',height:'90px',marginLeft:'240px'}}>
              <SpinnyLogo />
            </div>
          </div>
        :
        <div style={{marginLeft:'15px',marginRight:'15px'}}>
            <table style={{width:'100%'}}>
            <tbody>
             <tr style={{display:'flex'}}>
                <td style={{whiteSpace:'nowrap'}}><strong>Policy Name:</strong></td>
                <td>&nbsp;{this.props.policyName}</td>
              </tr>
              <br/>
              <tr style={{display:'flex'}}>
                <td style={{whiteSpace:'nowrap'}}><strong>Actual Result:</strong></td>
                <td>&nbsp;{this.state.actualResult}</td>
              </tr>
              <br/>
              <tr style={{display:'flex'}}>
                <td style={{whiteSpace:'nowrap'}}><strong>Expected Result:</strong></td>
                <td>&nbsp;{this.state.expectedResult}</td>
              </tr>
              <br/>
              <tr style={{display:'flex'}}>
                <td style={{whiteSpace:'nowrap'}}><strong>References:</strong></td>
                <td>
                <div  style={{display:'flex', width:350, 'flexWrap':'wrap'}}dangerouslySetInnerHTML={{__html: this.state.whatfailed}}></div><br/>
                </td>
              </tr>
             
             </tbody>
            </table><br/>
            
            <br/>
          
        </div>}
        </Modal.Body>
        </form>
      </Modal>
    </span>
    );
  },
 })
