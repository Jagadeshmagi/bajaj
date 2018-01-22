import React, { PropTypes } from 'react'
import Joi from 'joi-browser'
import {Button, Grid, Row, Col, Form, Radio, FormGroup,dropdown,ControlLabel,FormControl} from 'react-bootstrap'
import {tree, arrow} from './styles.css'
import {blueBtn, btnPrimary} from 'sharedStyles/styles.css'
import {Header} from 'components'
import {selectStyle} from 'sharedStyles/styles.css'

function Tree ({values}) {
  return (
    <ul className={tree}>
      {values.map(function(value, index) {
          return <li key={index} >{value}</li>;
        })}
    </ul>
  )
}

const IntroText = React.createClass({
  render: function () {
    return (
      <table style={{width: '100%', marginTop:80, fontSize: 24}} >
        <tbody>
          <tr ><td style={{textAlign: 'center',  fontWeight: 'bold', color: '#454855', paddingBottom: 10}}>
                    READY TO SELECT POLICY PACKS?
          </td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>If you are not familiar with Policy Packs, a quick glance </td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>at their general structure might be helpful. </td></tr>


        </tbody>
      </table>
    )
  }
})


function PolicyStructure() {
  const tdTopStyle = {paddingTop: 10 }
  const tdTopStyle2 = {paddingTop: 5, color:'#00C484'}
  return (
    <div style={{marginTop: 80, marginBottom: 15, marginLeft: 15,
                  marginRight: 15, padding: 20, backgroundColor: 'white'}}>
         <table style={{ marginLeft: 'auto', marginRight: 'auto'}}><tbody><tr>
            <td>
              <Tree values={['POLICY PACKS']}/>
            </td>
            <td style={tdTopStyle2}>{'---'}</td>
            <td style={tdTopStyle}><div className={arrow}></div></td>
            <td style={tdTopStyle2}>{'---'}</td>
            <td>
              <Tree values={['PROFILE 1','PROFILE 2']}/>
            </td>
            <td style={tdTopStyle2}>{'---'}</td>
            <td style={tdTopStyle}><div className={arrow}></div></td>
            <td style={tdTopStyle2}>{'---'}</td>

            <td>
              <Tree values={['CONTROL FAMILY A','CONTROL FAMILY B', 'CONTROL FAMILY C']}/>
            </td>
            {/*<td style={tdTopStyle2}>{'---'}</td>
            <td style={tdTopStyle}><div className={arrow}></div></td>
            <td style={tdTopStyle2}>{'---'}</td>
            <td>
              <Tree values={['CONTROL A1','CONTROL B1','CONTROL C1']}/>
            </td>
            <td style={tdTopStyle2}>{'---'}</td>
            <td style={tdTopStyle}><div className={arrow}></div></td>
            <td style={tdTopStyle2}>{'---'}</td>
            <td>
              <Tree values={['POLICY A1.1','POLICY B1.1','POLICY C1.1']}/>
            </td>*/}
            <td style={tdTopStyle2}>{'---'}</td>
            <td style={tdTopStyle}><div className={arrow}></div></td>
            <td style={tdTopStyle2}>{'---'}</td>
            <td>
              <Tree values={['RULE A1','RULE B1','RULE C1']}/>
            </td>
         </tr></tbody></table>
      </div>
    )
}

const PolicyStart = React.createClass({
  getInitialState() {
   return { 
    policypacksOption :'selectPolicyPacks',
    industryType_validation:'',
    isSelectedType:false,
    isDataCenterType:false,
    isApplicationType:false,
    RecommendPolicyButtonDisability: true,
    selectedAppType:''
    }},

     handleOptionChange: function (changeEvent) {
     this.setState
     ({
     policypacksOption: changeEvent.target.value
      });
    }, 

    handleSelectIndustryTypeChanges(e)
    {
      this.state.selectedIndusType=e.target.value
      this.setState({selectedIndusType:e.target.value});
      console.log("Type is "+this.state.selectedIndusType);
     if(this.state.selectedIndusType == ''){
      this.setState({ isSelectedType:false});
    }
    else(this.state.selectedIndusType == 'healthcare' ||this.state.selectedIndusType == 'creditCardInformation'||this.state.selectedIndusType == 'serviceOrganization'||this.state.selectedIndusType == 'government'|| this.state.selectedIndusType == 'other' )
    {
      this.setState({ isSelectedType:true});
    }
    
    //Dropdown Type Validation
    let IndustryType_schema = {
      industryType: Joi.string().required(),
    };
   
    let result = Joi.validate({industryType: e.target.value}, IndustryType_schema)
    
    if(result.error)
    { 
      console.log("error is "+result.error.details[0].message)
      this.setState({
        industryType_validation: 'error',
        RecommendPolicyButtonDisability:true,
        isSelectedType:false,
     })
      this.state.industryTypeBorderColor='1.5px solid #FF444D'
    }else 
    {
      this.setState({industryType_validation : 'success',
        dataCenterType_validation: 'success',
        isSelectedType:true
      })
      this.state.industryTypeBorderColor='1.5px solid #00C484'
      console.log("RecommendPolicyButtonDisability state is "+this.state.RecommendPolicyButtonDisability)
      if(this.state.isSelectedType && this.state.isDataCenterType && this.state.isApplicationType){
        console.log("Enabling Recommend Policy Packs for me button")
        this.setState({RecommendPolicyButtonDisability:false})
        console.log("RecommendPolicyButtonDisability state is "+this.state.RecommendPolicyButtonDisability)
      }
    }
  },


   handleDataCenterType(dataCenterType){
    this.state.selectedDataCenterType=dataCenterType.target.value
    this.setState({selectedDataCenterType:dataCenterType.target.value});
    console.log("Data center is "+this.state.selectedDataCenterType)

     if(this.state.selectedDataCenterType == ''){
      this.setState({isDataCenterType:false,
            RecommendPolicyButtonDisability:true});
    }
    
    else(this.state.selectedDataCenterType =='On-prem' ||this.state.selectedDataCenterType=='hybrid' ||this.state.selectedDataCenterType== 'cloud'||this.state.selectedDataCenterType=='other')
    {
       this.setState({isDataCenterType:true});
    }
    
    //Dropdown Type Validation
 
    let DataCenterType_schema ={
       dataCenterType: Joi.string().required(),
    };
    let result = Joi.validate({dataCenterType: dataCenterType.target.value}, DataCenterType_schema)
    if(result.error)
    { 
      console.log("error is "+result.error.details[0].message)
      this.setState({
        dataCenterType_validation: 'error',
        RecommendPolicyButtonDisability:true,
        isDataCenterType:false
     })
      this.state.dataCenterTypeBorderColor= '1.5px solid #FF444D'
    }
    else 
    {
      this.state.isDataCenterType=true
      this.setState({dataCenterType_validation: 'success',
      isDataCenterType:true
      })
      this.state.dataCenterTypeBorderColor='1.5px solid #00C484'
      console.log("RecommendPolicyButtonDisability state is "+this.state.RecommendPolicyButtonDisability)
      console.log("dataCenterType is "+this.state.isDataCenterType)
      console.log("indus type "+this.state.isSelectedType)
      if(this.state.isSelectedType && this.state.isDataCenterType && this.state.isApplicationType){
        console.log("Enabling Recommend Policy Packs for me button")
        this.setState({RecommendPolicyButtonDisability:false})
        console.log("RecommendPolicyButtonDisability state is "+this.state.RecommendPolicyButtonDisability)
      }
    }
  },


handleApplicationType(applicationType){
    this.state.selectedAppType=applicationType.target.value
    this.setState({selectedAppType:applicationType.target.value});
    console.log("App Type is "+this.state.selectedAppType)

     if(this.state.selectedAppType == ''){
      this.setState({isApplicationType:false,
            RecommendPolicyButtonDisability:true});
    }
    
    else(this.state.selectedAppType =='multi-tiered' ||this.state.selectedAppType=='microservice' ||this.state.selectedAppType== 'dockerized'||this.state.selectedAppType=='database' || this.state.selectedAppType=='other')
    {
       this.setState({isApplicationType:true});
    }
    
    //Dropdown Type Validation
 
    let AppType_schema ={
       appType: Joi.string().required(),
    };
    let result = Joi.validate({appType: applicationType.target.value}, AppType_schema)
    if(result.error)
    { 
      console.log("error is "+result.error.details[0].message)
      this.setState({
        appType_validation: 'error',
        RecommendPolicyButtonDisability:true,
        isApplicationType:false
     })
      this.state.appTypeBorderColor= '1.5px solid #FF444D'
    }
    else 
    {
      this.state.isApplicationType=true
      this.setState({appType_validation: 'success',
      isApplicationType:true
      })
      this.state.appTypeBorderColor='1.5px solid #00C484'
      console.log("RecommendPolicyButtonDisability state is "+this.state.RecommendPolicyButtonDisability)
      console.log("dataCenterType is "+this.state.isDataCenterType)
      console.log("indus type "+this.state.isSelectedType)
      if(this.state.isSelectedType && this.state.isDataCenterType && this.state.isApplicationType){
        console.log("Enabling Recommend Policy Packs for me button")
        this.setState({RecommendPolicyButtonDisability:false})
        console.log("RecommendPolicyButtonDisability state is "+this.state.RecommendPolicyButtonDisability)
      }
    }
  },





  render: function () {
    return (
      <div >
      <Header name='Policy Pack'/>
      <IntroText />
      <PolicyStructure />
      <div style={{ paddingTop: 40, paddingLeft: 50}}>
        <Col xsOffset={4}>
          <Form >
            <FormGroup style={{fontSize: 18}}>
              {/*}
              <input type="radio" name="policyPacksSelection" id="polId1" value="selectPolicyPacks"  checked={this.state.policypacksOption === 'selectPolicyPacks'?true:false} onChange={this.handleOptionChange}/>
                <strong>&nbsp;&nbsp; I know which Policy Packs to select </strong>
              <br/> 
              */} 
               {this.state.policypacksOption==='selectPolicyPacks'?
              <div style={{paddingLeft:'20px'}}>
                  <Button href="#/policyPacksInfo" bsStyle='primary' className={btnPrimary} bsSize='large' style={{width:'300px',borderRadius: 0, marginTop: 15}}>Browse Policy Packs</Button>
              </div>
              :<div></div>
              }
              <br/>
              {/*
              <input type="radio" disabled="true" name="policyPacksSelection" id="polId2" value="recommendPolicyPacks" checked={this.state.policypacksOption === 'recommendPolicyPacks'?true:false} onChange={this.handleOptionChange}/>
                <strong style={{color: '#999999'}}>&nbsp;&nbsp; Recommend Policy Packs based on my Industry </strong>
              */}
            </FormGroup>
               {
            this.state.policypacksOption === 'recommendPolicyPacks'?
            <div style={{marginLeft: 20}}>
              <FormGroup style={{fontSize: 18}}>
                <label>Industry </label>
                <div>
                  <select className={selectStyle} style={{width:'300'}} placeholder="Select industries of interest" onChange={this.handleSelectIndustryTypeChanges} style={{width:335,height:45,border:this.state.industryTypeBorderColor,borderRadius:0}} validationState={this.state.industryType_validation}>
                      <option value="">Select industries of interest</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="creditCardInformation">Handling Credit Card Information</option>
                      <option value="serviceOrganization">Service Organization</option>
                      <option value="government">Government</option>
                      <option value="other">Other</option>
                  </select>
                </div>
              </FormGroup>
              <FormGroup style={{fontSize: 18}}>
                <label>Datacenter Type</label>
                <div>
                  <select className={selectStyle} style={{width:'300'}} placeholder="Select Datacenter Type" onChange={this.handleDataCenterType} style={{width:335,height:45,border:this.state.dataCenterTypeBorderColor,borderRadius:0}} validationState={this.state.dataCenterType_validation}>
                      <option value="">Select Datacenter Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                      <option value="On-prem">On-prem</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="cloud">Cloud</option>
                      <option value="other">Other</option>
                  </select>
                </div>  
              </FormGroup>
              <FormGroup style={{fontSize: 18}}>
                <label>Application Type</label>
                <div>
                  <select className={selectStyle} style={{width:'300'}} placeholder="Select Application Type" onChange={this.handleApplicationType} style={{width:335,height:45,border:this.state.appTypeBorderColor,borderRadius:0}} validationState={this.state.appType_validation}>
                      <option value="">Select Application Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                      <option value="multi-tiered">Multi-tiered</option>
                      <option value="microservice">Microservice</option>
                      <option value="dockerized">Dockerized</option>
                      <option value="database">Database</option>
                      <option value="other">Other</option>
                  </select>
                </div>
              </FormGroup>
             
              <Button href="#/policyPacksInfo" bsStyle='primary' disabled={this.state.RecommendPolicyButtonDisability} className={btnPrimary} bsSize='large' style={{width:'300',borderRadius: 0, marginTop: 15}}>Recommend Policy Packs for me</Button>
            </div>
 
            :<div></div>
            }
          </Form>
        </Col>
      </div>
    </div>
    )
  }
})

export default PolicyStart

