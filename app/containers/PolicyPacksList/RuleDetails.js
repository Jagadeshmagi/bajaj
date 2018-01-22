import React, { PropTypes } from 'react'
import {Modal,ControlLabel} from 'react-bootstrap'
import {modalContainer,deleteDialogClass,infoCircle, modal} from './styles.css'
import {modalCloseBtnStyle } from 'sharedStyles/styles.css'
import {customModal} from 'sharedStyles/customCSS.css'
import {getRuleDetails} from 'helpers/policies'
import {getRuleDetailsForDocker} from 'helpers/docker'
import {SpinnyLogo} from 'containers'

 export const RuleDetails = React.createClass({
  getInitialState() {
    return {
      show: false,
      loadingdiv: true,
      rule: {}
    };
  },
  getRuleDetails(){
    if(this.props.ruleId){
       if(this.props.type!=null&&this.props.type!=""&&this.props.type==="CVE"){
        getRuleDetailsForDocker(this.props.ruleId)
        .then((ruleObj) => {
          this.setState({rule:ruleObj,
                        loadingdiv:false,
                        showModal:true})
        })
        .catch((error) => console.log("Error in getting rule details:" + error))
      }
      else{
        getRuleDetails(this.props.ruleId)
        .then((ruleObj) => {
          this.setState({loadingdiv:false,
                        rule:ruleObj,
                        showModal: true})
        })
        .catch((error) => console.log("Error in getting rule details:" + error))
      }

    }else if(this.props.rule){
      this.setState({loadingdiv:false,
                    rule:this.props.rule,
                    showModal: true })
    }
  },
  closeModal() {
    this.setState({showModal: false});
  },
  openModal(){
    this.getRuleDetails();
    //this.setState({showModal: true });
  },
  render() {

    let constructedCCEID
    let cveCceExists =  false;
    let rule = this.state.rule;
    let padding = this.props.padding || "30px"
    let cceid="";
    let isCceid=false;
    var dict = []; // create an empty array for storing id and construct href
    
    if(rule.cceid && rule.cceid.length>0){
        if(rule.cceid[0].startsWith('CVE')){
          isCceid = true;
          cveCceExists = true;
          for(let i=0;i<rule.cceid.length;i++){            
            dict.push({
                key: rule.cceid[i],
                value:"https://nvd.nist.gov/vuln/detail/"+rule.cceid[i]
            });        
          }
        }else if(rule.cceid[0].startsWith('CCE')){ 
          cveCceExists = true;
          cceid=rule.cceid.join();
        }else{
          cceid='-';
          cveCceExists = false;
        }
    }else{
      cveCceExists = false;
      cceid='-';
    }

    let dictLength = dict.length
   
    constructedCCEID = dict.map(function(cve, index) {
        return <div style={{display:'inline-block'}}>
                  <a href={cve.value} target='_blank'>{cve.key}</a>
                  {index==dictLength-1?'':<span>,</span>}
              </div>
    }.bind(this));
    
    let weight = rule.weight
    if(weight === null || weight === "null" || weight=== undefined)
      weight = '-';

    let severity = rule.severity
    if(severity === null || severity === "null" || severity=== undefined)
      severity = '-';

    let description = rule.description
    if(description === null || description === "null" || description=== undefined)
      description = '-';

    let rationale = rule.rationale
    if(rationale === null || rationale === "null" || rationale=== undefined)
      rationale = '-';

    let audit = rule.audit
    if(audit === null || audit === "null" || audit=== undefined)
      audit = '-';

    let remediation = rule.remediation
    if(remediation === null || remediation === "null" || remediation=== undefined)
      remediation = '-';

    let benchmark = rule.benchmark
    if(benchmark === null || benchmark === "null" || benchmark=== undefined)
      benchmark = '-';

    let externalRefID = rule.externalRefID
    if(externalRefID === null || externalRefID === "null" || externalRefID=== undefined)
      externalRefID = '-';    



    return (
    <span className={modalContainer} >
      <a href='JavaScript: void(0)' style={{paddingRight:padding,textDecoration:'none'}} onClick={this.openModal}>
        &nbsp;&nbsp;
        <ControlLabel className={infoCircle} style={{color:'#4C58A4',fontWeight: '700'}} >
            <i style={{paddingRight:'0.25em'}}>i</i>
        </ControlLabel>
      </a>
      <Modal
        show={this.state.showModal}
        onHide={this.closeDelete}
        aria-labelledby="contained-modal-title"
        className="modal fade right"
        dialogClassName={deleteDialogClass}
        >
        <form style={{border: '1px solid Navy'}}>
        <Modal.Header style={{marginRight:5,borderBottom:0}}>
         <a style={{textDecoration:'none'}} href="javascript:void(0)" className={modalCloseBtnStyle} onClick={this.closeModal}>X</a>
            <br/>
          <Modal.Title id="contained-modal-title"
                style={{fontSize: 15, fontWeight:'bold', color: '#454855'}}>{rule.title}</Modal.Title>

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
            <table style={{width:'30%'}}>
            <tbody>
              <tr>
                <td><strong>Weight:</strong></td>
                <td>&nbsp;{weight}</td>
              </tr>
              <tr>
                <td><strong>Severity:</strong></td>
                <td>&nbsp;{severity}</td>
              </tr>
              {cveCceExists?
               <tr>
                <td><strong>CVE/CCE:</strong></td>
                <td id="ccid">{isCceid?constructedCCEID:cceid}</td>
              </tr>
              :<div></div>}
             </tbody>
            </table><br/>
            <div><strong>Description:</strong></div>
            <div  dangerouslySetInnerHTML={{__html: description}}></div><br/>

            <div><strong>Rationale:</strong></div>
            <div dangerouslySetInnerHTML={{__html: rationale}}></div><br/>

            <div><strong>Audit:</strong></div>
            <div dangerouslySetInnerHTML={{__html: audit}}></div><br/>

            <div><strong>Remediation:</strong></div>
            <div dangerouslySetInnerHTML={{__html: remediation}}></div>
            <br/>
            <table style={{width:'100%'}}>
              <tbody>
                <tr>
                  <td><strong>Benchmark:</strong></td>
                  <td style={{width:'400px',wordBreak: 'break-all'}}>&nbsp;{benchmark}</td>
                </tr>
                <tr>
                  <td><strong>ReferenceID:</strong></td>
                  <td style={{width:'400px',wordBreak: 'break-all'}}>&nbsp;{externalRefID}</td>
                </tr>
              </tbody>
            </table>
            <br/>
        </div>}
        </Modal.Body>
        </form>
      </Modal>
    </span>
    );
  },
 })
