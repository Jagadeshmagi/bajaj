import React, { PropTypes } from 'react'
import {browserHistory} from 'react-router';
import { Navbar,Glyphicon,Modal,Button} from 'react-bootstrap'
import {headerContainer,modal,modalCloseStyle} from './styles.css'
import { blueBtn, btnPrimary,modalDialogClass} from 'sharedStyles/styles.css'
import {InfrastructureMainContainer} from 'containers'
import { Connector } from 'components'
import {InfrastructureHeader} from 'containers/Infrastructure/InfrastructureMainContainer'
import {deleteAssetGroup} from '../../helpers/assetGroups'
import {deleteDockerImageByLabel} from '../../helpers/docker'


const CrossLink = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState() {
    return {
      showExitWizardModal:false,
    };
  },

  openExitWizardConfirmation(){
    this.setState({ showExitWizardModal: true });
  },

  closeExit() {
    this.setState({
      showExitWizardModal: false,
    });
  },

  deleteAssetGroup() {

   
      if(this.props.routeParams.assetgroupId&&this.props.assettype=="cloudOnprem"){
        deleteAssetGroup(this.props.routeParams.assetgroupId)
        .then((response)=>{
          /*  browserHistory.push('/#/infrastructure/mygroups');
          window.location.reload()
          console.log("Successful deletion of Asset Group ")*/
           this.context.router.replace('/infrastructure/mygroups');

        })
        .catch((error)=>{        
          /*browserHistory.push('/#/infrastructure/mygroups');
          window.location.reload()
          console.log("Error in deletion of Asset Group", error)*/
          this.context.router.replace('/infrastructure/mygroups');
        })
      } else if((this.props.routeParams.imageId||this.props.routeParams.assetgroupId)&&this.props.assettype=="Image"){
         
          let id;
          if(this.props.routeParams.assetgroupId)
            id=this.props.routeParams.assetgroupId;
          else if(this.props.routeParams.imageId)
            id=this.props.routeParams.imageId
        
          deleteDockerImageByLabel(id)
           .then((res)=>{
           
             this.context.router.replace('/infrastructure/mygroups');

          })
          .catch((err)=>{        
          
            this.context.router.replace('/infrastructure/mygroups');
          })

      }
        else {
      //browserHistory.push('/#/infrastructure/mygroups');
      // window.location.reload()      
        this.context.router.replace('/infrastructure/mygroups');
      }
  },

  render() {
    console.log("Im saved! =D ", parseInt(this.props.routeParams.assetgroupId))
    let glyphStyle = {'text-decoration':'none',fontSize: 18, color: '#FFFFFF',width:'24.7px',height:'24.7px',top:'10px',right:'20px', position:'absolute',fontSize:'130%',cursor: 'pointer',marginTop:'-20px'}
    return (
      <div>
        <a {...this.props} >
         <a style={glyphStyle} onClick={this.openExitWizardConfirmation}>
            &#10005;
         </a>

        <Modal
          show={this.state.showExitWizardModal}
          dialogClassName={modalDialogClass}
          onHide={this.closeExit}
          keyboard={false}
          aria-labelledby="contained-modal-title"
          backdrop='static'>
          <form style={{border: '1px solid Navy'}}>
            <div style={{marginTop:'5px',paddingLeft:'15px'}}>
              <Modal.Header  style={{marginRight:5,borderBottom:0}}>
                <a style={{textDecoration:'none', top:9, right:37}} href="javascript:void(0)" className={modalCloseStyle} onClick={this.closeExit} show={this.state.showExitWizardModal} onHide={this.closeExit} backdrop='static'>
                  x
                </a>
                <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                  {'EXIT WIZARD'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-15px'}}>
                  <p>Do you wish to cancel Discover and Assess Wizard. All information will be lost.</p>
              </Modal.Body>
              <Modal.Footer style={{marginRight:20,marginBottom:10,borderTop:0}}>
                <Button className={blueBtn} onClick={this.closeExit}>
                  No
                </Button>&nbsp;&nbsp;&nbsp;
                <Button onClick={this.deleteAssetGroup} bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}} >
                  Yes
                </Button>
              </Modal.Footer>
            </div>
          </form>
        </Modal>
      </a>
      </div>
    );
  },
});


const WizardHeader = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    routeParams: PropTypes.string.isRequired
  },


  render() {
    let pstyle = { fontSize: 18, color: 'white',marginBottom:'10px',marginTop:'-10px'}
    return (
    <div className={headerContainer}>
      <br/>
      <div style={{position:'relative'}}>
        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
           <p style={pstyle}>{this.props.name}</p>
        </div>
        <span style={{position:'absolute', top:0, right:0}}>
           <CrossLink
             routeParams={this.props.routeParams}
             assettype={this.props.assettype}
              />
        </span>
      </div>
    </div>
    );
  },
});

WizHeader.propTypes = {
  name: PropTypes.string.isRequired,
}
export function WizHeader ({name, routeParams,assettype}) {
  return (
     <WizardHeader
       name={name}
       routeParams={routeParams}
       assettype={assettype}
        />
  )
}
export {CrossLink}
