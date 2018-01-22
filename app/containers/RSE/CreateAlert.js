import React, { Component } from 'react'
import {Popover, FormControl, FormGroup,ControlLabel, OverlayTrigger, Checkbox, Button, Modal} from 'react-bootstrap'
import {footerBtn,blueBtn, modalCloseBtnStyle,modalDialogClass } from 'sharedStyles/styles.css'
import {modalCloseStyle} from './styles.css'
// import {input} from './styles.css'
import Joi from 'joi-browser'
import {selectStyle} from 'sharedStyles/styles.css'
import {getRegionList} from 'helpers/assetGroups'
import {createAlertRules, getMetrics, getAcountNames,getSecurityGroups,getLambdaFunctions} from 'helpers/alerts'
import {Emailboxtext} from '../MultiStepWizard/Emailbox'
import ReactTooltip from 'react-tooltip'
import AlertComponent from 'components/Common/AlertComponent'
import NumericInput from 'react-numeric-input'
import Select from 'react-select';
import OverLayCustom from 'components/Common/OverLayCustom'
import {getAllIntegrations} from 'helpers/integration'

const css={
  wrapper:{
    display:'flex',
      flexDirection:'column'
  },
  contentWrapper:{backgroundColor:'#f9fafc', alignItems:'center', justifyContent:'center', display:'flex', paddingBottom:15},
  heading:{
    backgroundColor:'#00d284',
    padding:'21px 0',
    textAlign:'center',
    color:'#fff',
    margin:0,
    fontSize:22,
  },
  close:{
    color:'#fff',
    fontSize:30,
    position:'absolute',
    top:14,
    right:32,
    cursor:'pointer'
  },
  closeNotify:{
    display:'inline-block',
    width:'20%',
    fontSize:24,
    position:'absolute',
    top:0,
    right:-18,
    cursor:'pointer'
  },
  notifWrapper:{position:'relative'}
}

class CreateAlert extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '',
      bordercolg:'1px solid #4C58A4',
      notificationOpen:true,
//       metricName:[
//         "Failed Console Logins",
//         "Launched Instances",
//         "API Authorization Error",
//         "ACL Change with all allowed to ingress",
//         "Modification of VPCs"
//       ],
      metricNameValue:'',
      metricName:[],
      severityValue:'',
      Severity:[
        //{label:'Select Severity',value:''},
        {label: 'Low', value:'low'},
        {label: 'Medium', value:'medium'},
        {label: 'High', value:'high'}
      ],
      configurationValue:'',
      configuration:[
       // { value: "", label: "Select metric" },
        { value: "threshold", label: "Threshold" },
        //{ value: "AWSLambda", label:"AWS Lambda" }
        // { value: "volatility", label:"Volatility" }
        
      ],
      conditionValue:'',
      ConditionsData:[
        //{ value: "", label: "Select Condition" },
        { value: "below", label: "Less than" },
        { value: "above", label: "Greater than" }
      ],
      thresholdData:['Select Threshold', 1, 15, 30, 60, 120],
      timeValue:'',
      timeData:[
        //{value:'',  label:"Select time"},
        { value: "1", label:"1 hour" },
        { value: "4", label:"4 hour" },
        { value: "8", label:"8 hour" },
        { value: "16", label:"16 hour" },
        { value: "24", label:"1 day" },
      ],
      alertInterval:[
        {value:'15', label: "15"},
        {value:'30', label: "30"},
        {value:'45', label: "45"},
        {value:'60', label: "60"},
      ],
      alertFrequency:[
        {value:'3', label: "3"},
        {value:'10', label: "10"},
        {value:'15', label: "15"},
        {value:'20', label: "20"},
        ],
      CloudType_error: 'Select severity',
      typeToolTip:'Select metric',
      securityGroupToolTip:'Select security group',
      lambdaToolTip:'Select lambda function',
      metricNameToolTip: 'Select an event',
      conditionToolTip:'Select condition',
      thresholdToolTip: 'Type a threshold number. Number should be greater than 0 if condition is "less than".',
      AccountNameToolTip: 'Select a cloud account/group',
      timeToolTip: 'Select time',
      regionToolTip:'Select a region',
      accountName:[],
      //*** Notification States ***//
      emails:[],
      showEmailBox:false,
      notifyByEmail:false,
      notifyByPagerDuty:false,
      notifyByslack:false,
      pagerDutyIntegrated:false,
      notifyByServiceNow:false,
      ServiceNowIntegrates:false,
      notifyByDashboard:false,
      DashboardIntegrated:false,
      slackIntegrated:false,

      //*** Settings States ***//
      stopsAfterRepeatCheck:false,
      doNotDisplay:false,
      afterFrequencyCheck:false,
      disable:false,
      alertCreated:false,
      accountResponce:[],
      currentAccountId:'',
      duration:0,
      thresholdValue:0,
      multi: true,
      doneButtonDisability:true,
      multiValue: [],
      valueAccount:'',
      accountOption:[],
      accountOptionFinal:[],
      advanceSetting:false,
      securityGroupValue:[],
      securityGroup:[],
      lambdaValue:[],
      lambda:[],
      regionValue:[],
      regionList:[],
      regionloading:false,
      grouploading:false,
      lambdaloading:false,
      nameOfAccount:"",
      descerror:true,
      rationerror:true,
      groupaccountType:'aws',
      integrationsList:[],
      pagerDutyId:0,
      slackId:0

    };
  }

  getIntegrationsList(){
    let isSlack=false
    let isPd =  false
    let pdId = 0
    let slackId = 0
      getAllIntegrations()
      .then(
        (integrations) =>  {
          this.setState({integrationsList:integrations.output}, function()
            {
              if(this.state.integrationsList.length>0)
               {
                 this.state.integrationsList.map((integration) =>
                  {
                   if(integration.name==='pagerduty' && integration.status==='Active')
                    {
                      isPd = true
                      pdId = integration.id
                    }else if(integration.name==='slack' && integration.status==='Active'){
                      isSlack = true
                      slackId = integration.id
                    }
                  })//map
                 this.setState({pagerDutyIntegrated:isPd,pagerDutyId:pdId,
                                slackIntegrated:isSlack,slackId:slackId})
               }
              else{
                //++++++++++++ Empty List ++++++++++++
                  this.setState({pagerDutyIntegrated:false,
                                 slackIntegrated:false
                  })
               }
            });//setState
      })
      .catch((error) => console.log("Error in getIntegrationsList in container:" + error))
    }


  componentDidMount(){
    this.getIntegrationsList();

    /*API Call to fill the Metric namesSelection field*/
    
    
    /*API Call to fill the Account field*/
    getAcountNames()
    .then((responce)=>{
      let label, value, resultArray=[]
      console.log('I am in sucess of get Accounts '+ JSON.stringify(responce))
      this.setState({accountName:responce})
      this.setState({accountOption:responce}, function(){
        this.state.accountOption.map((val, key)=>{
          var singleObj = {}
          singleObj.label = val.cloudtrailaccount
          singleObj.value = val.id
          resultArray.push(singleObj)
        })
        this.setState({accountOptionFinal:resultArray})
      })
      
      // this.setState({accountResponce:responce})
      // let accountList = []
      // responce.map((val, key)=>{
      //   accountList.push(val.cloudtrailaccount)        
      // })
    })
    .catch((error) => console.log("Error in get Metric:" + JSON.stringify(error)))

   }

  handleAccountName(e){
    this.state.accountName.map((val,key)=>{      
      if(e.target.value == val.cloudtrailaccount){
          this.setState({currentAccountId:val.id}, function(){
            if(accountName.value !== '' || accountName.value !== undefined){
              this.setState({doneButtonDisability:false})
            }
          })
        }
    })
  }

  handleDone(a){
   
    // var accountArray = JSON.parse("[" + this.state.multiValue + "]")
    var securityGroupId="";
    var securityGroupName = "";
    var lambdaFunctionName ="";
    var lambdaFunctionRegion ="";
    let regionselect=this.state.regionValue;
     let thresholdDataNum=0, durationNum=0;




    if(this.state.configurationValue==="AWSLambda"){

       securityGroupId = this.state.securityGroupValue.substring(0,this.state.securityGroupValue.indexOf(":"));
       securityGroupName = this.state.securityGroupValue.substring(this.state.securityGroupValue.indexOf(":")+1,this.state.securityGroupValue.length);
       lambdaFunctionName = this.state.lambdaValue
       lambdaFunctionRegion =regionselect;      
       thresholdDataNum=0
       durationNum='';
       this.setState({conditionValue:""})

    }
    else{
        thresholdDataNum = parseInt(thresholdData.value)
         durationNum = parseInt(this.state.timeValue)
         securityGroupId="";
         securityGroupName = "";
         lambdaFunctionName ="";
         lambdaFunctionRegion ="";

    }
   
    
    var accountArrayVal = []
    accountArrayVal.push(this.state.multiValue)
    var accountArray = JSON.parse("[" + accountArrayVal + "]")
    
   
    let stopsAfterRepeatNum = parseInt(stopsAfterRepeat.value)
    let reduceAfterFrequencyNum = parseInt(alertFrequency.value)
  //  console.log('Done ', alertName.value, this.state.severityValue,description.value, rationale.value, this.state.metricNameValue, this.state.configurationValue, this.state.conditionValue, thresholdDataNum, durationNum, this.state.emails, accountArray, stopsAfterRepeatNum, this.state.doNotDisplay, reduceAfterFrequencyNum, !this.state.disable)
    console.log('Leeeee ', accountArray.length)
    // let accountNameAsID = parseInt(accountName.value)
      // alert(groupName.value)
    // if(alertName.value != ''&& severity.value != ''&& description.value!=''&& rationale.value!=''&&this.state.metricNameValue!=''&&this.state.configurationValue!=''&&this.state.conditionValue!=''&&!isNaN(thresholdDataNum)&&groupName.value!=''){
   // if(alertName.value != ''&& this.state.severityValue !==''&&this.state.metricNameValue!=''&&this.state.configurationValue!=''&&this.state.conditionValue!=''&&!isNaN(thresholdDataNum&& durationNum !== 0 )){
      // createAlertRules(alertName.value, severity.value,description.value, rationale.value, this.state.metricNameValue, this.state.configurationValue, this.state.conditionValue, thresholdDataNum, durationNum, this.state.emails, accountArray, stopsAfterRepeatNum, this.state.doNotDisplay, reduceAfterFrequencyNum, !this.state.disable)
      //rationale.value,
      createAlertRules(alertName.value, this.state.severityValue,description.value, this.state.metricNameValue, this.state.configurationValue, this.state.conditionValue, thresholdDataNum, durationNum, this.state.emails, accountArray, stopsAfterRepeatNum, false, reduceAfterFrequencyNum, !this.state.disable,securityGroupId,securityGroupName,lambdaFunctionName,lambdaFunctionRegion,this.state.notifyByslack,this.state.notifyByPagerDuty)
      .then((responce) =>  {
          console.log('I am in sucess'+ JSON.stringify(responce))
        }
       )
      .catch((error) => console.log("Error in Edit Alert Rules in RSE:" + error))

      // let resultPath = 'rse/allalerts'
      // this.context.router.push(resultPath);
      this.setState({alertCreated:true})
    //}
  }

  handleCancle(){
   /* var accountArrayVal = []
    accountArrayVal.push(this.state.multiValue)
    var accountArray = JSON.parse("[" + accountArrayVal + "]")
    let thresholdDataNum = parseInt(thresholdData.value)
    let stopsAfterRepeatNum = parseInt(stopsAfterRepeat.value)
    let durationNum = parseInt(this.state.timeValue)
    let reduceAfterFrequencyNum = parseInt(alertFrequency.value)

    console.log('VAlue', thresholdDataNum, this.state.timeValue, accountArray, rationale.value)
    console.log('Done ', alertName.value, this.state.severityValue,description.value, rationale.value, this.state.metricNameValue, this.state.configurationValue, this.state.conditionValue, thresholdDataNum, durationNum, this.state.emails, accountArray, stopsAfterRepeatNum, this.state.doNotDisplay, reduceAfterFrequencyNum, !this.state.disable)*/
    let resultPath = 'rse/allalerts'
    this.context.router.push(resultPath);
  }

  getValidationState() {
    const length = this.state.value.length;
    if (length > 10){return 'success'}
    else if (length > 5) { return 'warning'}
    else if (length > 0) { return 'error' }
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleNotiClose(e){
    // console.log(e.target.closest('#notificationSection').style.display, e.target.closest('#notificationSection'));
    this.setState({notificationOpen:false});
    e.target.closest('#notificationSection').style.display = 'none';
  }

  stopsAfterRepeatCheck(e){
    if(e.target.checked)
      this.setState({stopsAfterRepeatCheck:true})
    else
      this.setState({stopsAfterRepeatCheck:false})
  }

  handleDoNotDisplay(e){
    if(e.target.checked)
      this.setState({doNotDisplay:true})
    else
      this.setState({doNotDisplay:false})
  }

  afterFrequencyCheck(e){
    if(e.target.checked)
      this.setState({afterFrequencyCheck:true})
    else
      this.setState({afterFrequencyCheck:false})
  }

  handleDisable(e){
    if(e.target.checked)
      this.setState({disable:true})
    else
      this.setState({disable:false})
  }

  handleEmailCheck(e){
    if(e.target.checked === true){
      this.setState({showEmailBox:true, notifyByEmail:true},function(){
          this.validateDoneButton();
      })
    }else
    this.setState({showEmailBox:false, notifyByEmail:false},function(){
          this.validateDoneButton();
    })
  }

  handlePagerDutyCheck(e){
    if(e.target.checked === true)
      this.setState({notifyByPagerDuty:true})
    else
      this.setState({notifyByPagerDuty:false})
  }
  handleSlackCheck(e){
    if(e.target.checked === true)
      this.setState({notifyByslack:true})
    else
      this.setState({notifyByslack:false})
  }

  updateEmails(emailsList){
    this.setState({emails:emailsList},function(){
      this.validateDoneButton();
    });
  }

  handleDuration(e){
    this.setState({duration:e})
  }

  handleMultiAccount(value){
    this.setState({configurationValue:'',metricNameValue:'',metricName:[]})
    let accountlabel="",monitortype="";

    const { multi } = this.state;
    if (multi) {
      this.setState({ multiValue: value },function(){
        if(this.state.multiValue.length > 0){
          /*this.setState({doneButtonDisability:false})*/
           this.validateDoneButton();
        }else{ /*this.setState({doneButtonDisability:true})*/
         this.validateDoneButton(); }

         this.state.accountName.map((val,key)=>{  
           console.log(val,key)    
              if(value== val.id){
                accountlabel= val.cloudtrailaccount
                monitortype= val.monitoringtype
                this.setState({nameOfAccount:accountlabel})
            
            }
          })
        this.setState({groupaccountType:monitortype},function(){
                    if(this.state.groupaccountType=="ASSETGROUP"){
                          this.setState({configuration:[/*{ value: "", label: "Select metric" },*/
                                          { value: "threshold", label: "Threshold" }] })

                    }
                    else{
                       this.setState({configuration:[/*{ value: "", label: "Select metric" },*/
                                          { value: "threshold", label: "Threshold" },
                                         // { value: "AWSLambda", label:"AWS Lambda" }
                                         ] })

                    }
               
             if(value!=""){
                 let populatedregion=[];       
                  if(this.state.groupaccountType !="ASSETGROUP")
                   {
                       getRegionList(accountlabel)
                                   .then((region)=>{
                                     region.regions.map(function(x){
                                       let key = Object.keys(x)[0];
                                       let value = x[key]
                                         populatedregion.push({value:value,label:key});
                                       
                                        })
                                     //populatedregion.push({value:"All Regions",label:"All Regions"});
                                       this.setState({regionList:populatedregion,
                                               regionloading:false},function(){
                                                // this.setState({regionValue:populatedregion[0].value})
                                               });
                                      
                                   })
                                   .catch((error)=>{
                                     this.setState({regionList:[],regionValue:[]});
                                    
                                     console.log("region error"+error);
                                   })
                  }

                 if(this.state.configurationValue!=""){

                      let metricObj = {label:'',value:''}, metricArray=[]
                      getMetrics(this.state.configurationValue,this.state.groupaccountType)
                      .then((responce)=>{
                        console.log('I am in sucess of Metric '+ JSON.stringify(responce))
                        if(responce != null)
                        {
                          /*metricObj = {label:'Select an event',value:''}
                          metricArray.push(metricObj)      */    
                        responce.map((val,key)=>{
                            metricObj = {label:'',value:''}
                            metricObj.label= val
                            metricObj.value = val
                            metricArray.push(metricObj)
                        })
                         console.log('metricArray', metricArray)
                        this.setState({metricName:metricArray})
                        }

                      })
                      .catch((error) => console.log("Error in get Metric:" + JSON.stringify(error)))


                  }
                

                    
                }
            });




      });
    }


  }
  descOnchange(e){
   
    /*const schema = {"Description":Joi.string().max(2000).min(0)}

    let result = Joi.validate({"Description":e.target.value}, schema)
    if (result.error) {
       alert(" error")
       this.setState({descerror:true,doneButtonDisability:true})
    } else {
      alert("no error")

      this.setState({descerror:false})
      this.validateDoneButton();
     
    }*/


    if(e.target.value.length>2000){
      this.setState({descerror:true,doneButtonDisability:true})
    }
    else{
     
      this.setState({descerror:false})
      this.validateDoneButton();
    }


  }
  rationOnchange(e){

   /*const schema = {"Ratinale":Joi.string().max(2000)}

    let result = Joi.validate({"Ratinale":e.target.value}, schema)
    if (result.error) {
       this.setState({rationerror:true,doneButtonDisability:true})
    } else {
      this.setState({rationerror:false})
      this.validateDoneButton();
     
    }*/
     if(e.target.value.length>2000){
      this.setState({rationerror:true,doneButtonDisability:true})
    }
    else{
       this.setState({rationerror:false})
        this.validateDoneButton();
     }

  }

  inputValidate(e){
    const re = /^[0-9\b]+$/;
    if (e.target.value == '' || re.test(e.target.value)) {
       this.setState({thresholdValue: e.target.value})
    }

    if(e.target.value === 10000000 || e.target.value >=10000000){
      this.setState({thresholdValue: 10000000})
    }
    
    if( e.target.value === ''){
      this.setState({doneButtonDisability:true})
    }
    else if (e.target.value == 0 && this.state.conditionValue=="below"){ //&& this.state.conditionValue=="below"
       this.setState({doneButtonDisability:true})
    }else{this.validateDoneButton()}
  }

  validateDoneButton(){

    let emailReq = false;
    if (this.state.notifyByEmail === false){
      emailReq = true;
    } else if (this.state.notifyByEmail === true){
      if (this.state.emails.length > 0){
        emailReq = true;
      } else {
        emailReq = false;
      }
    }
   
    let thresholdDataNum = parseInt(this.state.thresholdValue)
    let durationNum = parseInt(this.state.timeValue)
    if(this.state.configurationValue=="threshold" && emailReq && this.state.multiValue.length>0 && alertName.value != ''&& this.state.severityValue !==''&&this.state.metricNameValue!=''&&this.state.configurationValue!=''&&this.state.conditionValue!=''&&  durationNum && (description.value==""||description.value.length<=2000) /*&& (rationale.value==""||rationale.value.length<=2000)*/ ){
     
      if(thresholdDataNum !==0)
        this.setState({doneButtonDisability:false}) 
      else if(thresholdDataNum ===0 && this.state.conditionValue=='above')
        this.setState({doneButtonDisability:false})
      else{
           this.setState({doneButtonDisability:true}) 
        }

      
    }
    else if(this.state.configurationValue=="AWSLambda" && emailReq && this.state.multiValue.length>0 && alertName.value != ''&& this.state.severityValue !==''&&this.state.metricNameValue!=''&&this.state.configurationValue!=''&& this.state.securityGroupValue!=""&&this.state.lambdaValue!=""&this.state.regionValue!="" && (description.value==""||description.value.length<=2000) /*&& (rationale.value==""||rationale.value.length<=2000)*/){
      this.setState({doneButtonDisability:false}) 
    }
    else{
     
      this.setState({doneButtonDisability:true}) 
    }
  }
  handleAlertName(e){
    if(e.target.value ===''){ this.setState({doneButtonDisability:true}) }
    else{this.validateDoneButton()}
    // else{ this.setState({doneButtonDisability:false}) }
  }
  handleSeverity(e){
    if(e ===''){ this.setState({severityValue:'', doneButtonDisability:true}) }
    else{

      this.setState({severityValue:e},function(){
         this.validateDoneButton()
      })
    }
    // else{ this.setState({doneButtonDisability:false}) }
  }
  handleConfig(e){
     if( e == ''){
      this.setState({configurationValue :e,doneButtonDisability:true})
    }else{
      
      this.setState({configurationValue :e},function(){
        if(this.state.multiValue.length>0){

          let metricObj = {label:'',value:''}, metricArray=[]
          getMetrics(this.state.configurationValue,this.state.groupaccountType)
          .then((responce)=>{
            console.log('I am in sucess of Metric '+ JSON.stringify(responce))
            if(responce != null)
            {
             /* metricObj = {label:'Select an event',value:''}
              metricArray.push(metricObj) */         
            responce.map((val,key)=>{
                metricObj = {label:'',value:''}
                metricObj.label= val
                metricObj.value = val
                metricArray.push(metricObj)
            })
             console.log('metricArray', metricArray)
            this.setState({metricName:metricArray})
            }

          })
          .catch((error) => console.log("Error in get Metric:" + JSON.stringify(error)))

        }
          if(this.state.configurationValue=="threshold"){
           
            this.setState({metricNameValue:'',
                            conditionValue:'',
                            thresholdValue:0,
                            timeValue:''

            },function(){this.validateDoneButton()})

          }else{
            
            this.setState({metricNameValue:'',
                            regionValue:'',
                            securityGroupValue:'',
                            lambdaValue:''

            },function(){this.validateDoneButton()})
          }
         
      })
    }

  

    // if(e ===''){ this.setState({configurationValue :e,doneButtonDisability:true}) }
    // else{this.validateDoneButton()
    //   this.setState({configurationValue :e})}
    // else{ this.setState({doneButtonDisability:false})}
  }
  handleMetric(e){
     if( e == ''){
      this.setState({metricNameValue :e,doneButtonDisability:true})
    }else{
      
      this.setState({metricNameValue :e},function(){

      this.validateDoneButton()
      })
    }
    // else{ this.setState({doneButtonDisability:false})}    
  }
  handleSecurityGroup(e){
  if( e == ''){
      this.setState({securityGroupValue :e,doneButtonDisability:true})
    }else{
      
      this.setState({securityGroupValue :e},function(){
         this.validateDoneButton()
      })
    }
    // else{ this.setState({doneButtonDisability:false})}    
  }
  handleLambda(e){
    if( e == ''){
      this.setState({lambdaValue :e,doneButtonDisability:true})
    }else{
      
      this.setState({lambdaValue :e},function(){
         this.validateDoneButton()
      })
    }
    // else{ this.setState({doneButtonDisability:false})}    
  }
  handleRegion(e){
  this.setState({securityGroup:[],lambda:[],lambdaValue:'',securityGroupValue:''},function(){
    if(e==''){
       this.setState({regionValue :"",doneButtonDisability:true})

    }else{

         let  securityArray=[]
          this.setState({grouploading:true})
      
          this.setState({regionValue :e},function(){

             getSecurityGroups(this.state.nameOfAccount,this.state.regionValue)
                 .then((responces)=>{
                  
                  console.log('I am in sucess of Metric '+ JSON.stringify(responces))
                  if(responces.securitygroups != null)
                  {
                   let securityObj1 = {label:'Select Security Group to Monitor',value:''}
                    securityArray.push(securityObj1)          
                  }
                  responces.securitygroups.map((grp)=>{
                      let securityObj = {}
                      securityObj.label= grp.groupName
                      securityObj.value = grp.groupId+":"+grp.groupName
                      securityArray.push(securityObj)
                  })
                  // console.log('metricArray', metricArray)
                  this.setState({securityGroup:securityArray,grouploading:false})

                })
                .catch((error) => console.log("Error in get Metric:" + JSON.stringify(error)))

                let  lambdaArray=[]
                this.setState({lambdaloading:true})

                getLambdaFunctions(this.state.nameOfAccount,this.state.regionValue)
                .then((lambdaresponces)=>{
                 
                  console.log('I am in sucess of Metric '+ JSON.stringify(lambdaresponces))
                  if(lambdaresponces.lambdaFunctions != null)
                  {
                   let lambdaObj1 = {label:'Select Lambda function to remediate',value:''}
                    lambdaArray.push(lambdaObj1)          
                  }
                  lambdaresponces.lambdaFunctions.map((func)=>{
                      let lambdaObj = {}
                      lambdaObj.label= func
                      lambdaObj.value = func
                      lambdaArray.push(lambdaObj)
                  })
                  // console.log('metricArray', metricArray)
                  this.setState({lambda:lambdaArray,lambdaloading:false})

                })
                .catch((error) => console.log("Error in get Metric:" + JSON.stringify(error)))



         this.validateDoneButton()
      })
    }
   })

  }
  handleCondition(e){
    if(e=='below'&& this.state.thresholdValue=="0"){
      this.setState({conditionValue :e,doneButtonDisability:true})
    }
     if( e == ''){
      this.setState({conditionValue :e,doneButtonDisability:true})
    }
    else{
      
      this.setState({conditionValue :e},function(){
         this.validateDoneButton()
      })
    }
    // else{ this.setState({doneButtonDisability:false})}    
  }
  handleTime(e){
    if( e == ''){
      this.setState({timeValue :'',doneButtonDisability:true})
    }
    else{
    
      this.setState({timeValue :e},function(){
         this.validateDoneButton()
      })
    }
    
    // if(e.target.value ===''){ this.setState({doneButtonDisability:true}) }
    // else{this.validateDoneButton()}
    // else{ this.setState({doneButtonDisability:false})}    
  }
  render() {
    let checkboxStyle ={
      display:'inline-block',
      width:'25%',
      textAlign: 'center'
    }

    let noticiationsStyle = {
      width:'100%',
      marginTop:20,
      height:70
    }
    var controlLabelStyle = {fontSize:'15px',fontWeight:500}
    if(this.state.showEmailBox)
    {
      var EmailBox =
        <div>
          <div style={{marginLeft:20}}>
            <Emailboxtext emails={this.state.emails} updateEmails={this.updateEmails.bind(this)}/>
          </div>
        </div>
    }
    const tooltipCloudType = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:50, paddingTop:4}}>{this.state.CloudType_error}</Popover> )
    const metricNameToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:160,height:50, paddingTop:4}}>{this.state.metricNameToolTip}</Popover> )
    const regionToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:50, paddingTop:4}}>{this.state.regionToolTip}</Popover> )
    const securityGroupToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:50, paddingTop:4}}>{this.state.securityGroupToolTip}</Popover> )
    const lambdaToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:210,height:50, paddingTop:4}}>{this.state.lambdaToolTip}</Popover> )
    const typeToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:220,height:50, paddingTop:4}}>{this.state.typeToolTip}</Popover> )
    const conditionToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:190,height:50, paddingTop:4}}>{this.state.conditionToolTip}</Popover> )
    const thresholdToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:190,height:100, paddingTop:4, display:(this.state.thresholdValue ==''||(this.state.conditionValue=="below" && this.state.thresholdValue==0)) ? 'block': 'none' }}>{this.state.thresholdToolTip}</Popover> )
    const timeToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:160,height:50, paddingTop:4}}>{this.state.timeToolTip}</Popover> )
    const AccountNameToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:50, paddingTop:4, display: this.state.multiValue.length !=1 ? 'block': 'none'}}>{this.state.AccountNameToolTip}</Popover> )
    const desriptiontooltip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:60, paddingTop:4, display: this.state.descerror ==false ? 'none': 'block'}}>Maximum of 2000 characters allowed.</Popover> )
    const ratinaletooltip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:60, paddingTop:4, display: this.state.rationerror==false ? 'none': 'block'}}>Maximum of 2000 characters allowed.</Popover> )

    let NumericInputStyle = {
      input: {color: 'red', border:'thin solid Navy', borderRadius:0, color:'#87768f'},
      focus: {boxShadow:'none'}
    }

    return (
    <div style={css.wrapper}>
      <h4 style={css.heading}>Add Alert Rule</h4>
      <a style={{textDecoration:'none', top:9, right:37}} href="javascript:void(0)" className={modalCloseStyle} onClick={this.handleCancle.bind(this)}  onHide={this.handleCancle.bind(this)} >
                  x
      </a>
     

      {/******** Alert Details *******/}
      <div style={css.contentWrapper}>
        <div className="col-lg-4 col-md-4 col-sm-4">
          <h3 style={{fontSize:'15px'}}><strong>ALERT DETAILS</strong></h3>
            <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
              <ControlLabel style={controlLabelStyle}>Alert Name</ControlLabel>
                <FormControl
                  id='alertName'
                  type="text"
                  onChange={this.handleAlertName.bind(this)}
                  defaultValue={this.state.value}
                  placeholder="Provide alert name"
                  style={{width:326,height:40,border:this.state.bordercolg,borderRadius:0}}
                />
            </FormGroup>

            <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
              <ControlLabel style={controlLabelStyle}>Severity</ControlLabel>
              <br/>
              <OverLayCustom ref="severity" placement="right" overlay={tooltipCloudType}>
                <Select id="severity" className="dropdownForm"
                  placeholder={<i>Select severity</i>}
                  name=""
                  value={this.state.severityValue}
                  options={this.state.Severity}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.handleSeverity.bind(this)}/>
              </OverLayCustom>
              {/*<OverlayTrigger   placement="right" overlay={tooltipCloudType}>
                <select className={selectStyle} onChange={this.handleSeverity.bind(this)} id="severity" placeholder= "Select Severity" style={{width:326,height:40, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                  {
                    this.state.Severity.map((item) =>
                      { return <option key={item.value} name={item} value={item}>{item}</option> }
                    )
                  }
                </select>
              </OverlayTrigger>*/}
            </FormGroup>

            <FormGroup>
              <ControlLabel style={controlLabelStyle}>Description</ControlLabel>
              <OverLayCustom placement="right" overlay={desriptiontooltip}>
              <FormControl
                id="description"
                type="text"
                defaultValue={this.state.value}
                onChange={this.descOnchange.bind(this)}
                placeholder="Enter the description"
                style={{width:326,height:45,border:this.state.bordercolg,borderRadius:0,}}
              />
              </OverLayCustom>
            </FormGroup>

            {/*<FormGroup>
              <ControlLabel style={controlLabelStyle}>Rationale</ControlLabel>
              <FormControl
                id="rationale"
                type="text"
                defaultValue={this.state.value}
                placeholder="When alerts are sent, they 'll include message entered here. This can contain problem statement and certain ways to remidiate the issues."
                style={{width:326,height:100,border:this.state.bordercolg,borderRadius:0,}}
              />
            </FormGroup>*/}

            {/*<FormGroup>
              <ControlLabel style={controlLabelStyle}>Rationale</ControlLabel><br/>
               <OverLayCustom placement="right" overlay={ratinaletooltip}>
              <textarea
                id="rationale"
                type="text"
                defaultValue={this.state.value}
                onChange={this.rationOnchange.bind(this)}
                placeholder="When an alert is sent, it includes a message entered here. This can contain a problem statement and  certain ways to remediate the problem"
                style={{width:326,height:100, padding:10,border:this.state.bordercolg,borderRadius:0,}}
              />
              </OverLayCustom>
            </FormGroup>*/}

          </div>
      </div>


      <div style={{backgroundColor:'#f9fafc',alignItems:'center', justifyContent:'center', display:'flex', padding:'10px 0'}}>
        <div className="col-lg-4 col-md-4 col-sm-4">
          <h3 style={{fontSize:'15px'}}><strong>ASSIGN TO GROUPS OR CLOUD ACCOUNTS</strong></h3>
          <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
           {/* <ControlLabel style={controlLabelStyle}>Account Name</ControlLabel><br/><br/>*/}
               <br/>
               <OverLayCustom placement="right" overlay={AccountNameToolTip}>

              <Select
                id='multiSelectLocation'
                className="dropdownForm"
                placeholder="Select cloud account/group"
                // multi={this.state.multi}
                options={this.state.accountOptionFinal}
                onChange={this.handleMultiAccount.bind(this)}
                // value={this.state.multi ? this.state.multiValue : this.state.valueAccount}
                value={this.state.multiValue}
              />
              </OverLayCustom>
          </FormGroup>
        </div>
      </div>


      {/******** Add Metric Section *******/}
      <div style={{backgroundColor:'#f5f8fa',alignItems:'center', justifyContent:'center', display:'flex', padding:'5px 0'}}>
        <div className="col-lg-4 col-md-4 col-sm-4">
          <h3 style={{fontSize:'15px'}}><strong>ADD ALERT RULE</strong></h3><br/>

          
          <ControlLabel style={controlLabelStyle}>Metric</ControlLabel>
          <br/>
          <OverLayCustom placement="right" overlay={typeToolTip}>
            <Select  className="dropdownForm"
                  placeholder={<i>Select metric</i>}
                  name=""
                  inputProps={{"id":"configuration"}}
                  value={this.state.configurationValue}
                  options={this.state.configuration}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.handleConfig.bind(this)}/>
          </OverLayCustom>
         
          <br/>

          <ControlLabel style={controlLabelStyle}>Event</ControlLabel>
          <br/>
          <OverLayCustom placement="right" overlay={metricNameToolTip}>
            <Select  className="dropdownForm"
              placeholder={<i>Select an event</i>}
              name=""
              inputProps={{"id":"Metric"}}
              value={this.state.metricNameValue}
              options={this.state.metricName}
              searchable={true}
              multi={false}
              clearable={false}
              allowCreate={false}
              onChange={this.handleMetric.bind(this)}/>
          </OverLayCustom>

          <br/>


          {this.state.configurationValue=="AWSLambda"?
          <div>
          <ControlLabel style={controlLabelStyle}>Region</ControlLabel>
          <br/>
          <OverLayCustom placement="right" overlay={regionToolTip}>
            <Select  className="dropdownForm"
              placeholder={<i>Select region</i>}
              name=""
              inputProps={{"id":"Region"}}
              value={this.state.regionValue}
              options={this.state.regionList}
              searchable={true}
              multi={false}
              clearable={false}
              allowCreate={false}
              isLoading={this.state.regionloading}
              onChange={this.handleRegion.bind(this)}/>
          </OverLayCustom>

          <br/>


          <ControlLabel style={controlLabelStyle}>Security Group Name</ControlLabel>
          <br/>
          <OverLayCustom placement="right" overlay={securityGroupToolTip}>
            <Select  className="dropdownForm"
              placeholder={<i>Select security group to monitor</i>}
              name=""
              inputProps={{"id":"securityGroup"}}
              value={this.state.securityGroupValue}
              options={this.state.securityGroup}
              searchable={true}
              multi={false}
              clearable={false}
              allowCreate={false}
              isLoading={this.state.grouploading}
              onChange={this.handleSecurityGroup.bind(this)}/>
          </OverLayCustom>

          <br/>

          <ControlLabel style={controlLabelStyle}>Lambda</ControlLabel>
          <br/>
          <OverLayCustom placement="right" overlay={lambdaToolTip}>
            <Select  className="dropdownForm"
              placeholder={<i>Select lambda function to remediate</i>}
              name=""
              inputProps={{"id":"lambda"}}
              value={this.state.lambdaValue}
              options={this.state.lambda}
              searchable={true}
              multi={false}
              clearable={false}
              allowCreate={false}
              isLoading={this.state.lambdaloading}
              onChange={this.handleLambda.bind(this)}/>
          </OverLayCustom>

          <br/>
          </div>
          :
          <div>
          <ControlLabel style={controlLabelStyle}>Condition</ControlLabel>
          <br/>
          <OverLayCustom placement="right" overlay={conditionToolTip}>
            <Select id="conditions" className="dropdownForm"
              placeholder={<i>Select condition</i>}
              name=""
              value={this.state.conditionValue}
              options={this.state.ConditionsData}
              searchable={true}
              multi={false}
              clearable={false}
              allowCreate={false}
              onChange={this.handleCondition.bind(this)}/>
          </OverLayCustom>

          <br/>

          <ControlLabel style={controlLabelStyle}>Threshold</ControlLabel>
          <br/>
          <OverlayTrigger placement="right" overlay={thresholdToolTip}>
            <input id="thresholdData" type="text" value={this.state.thresholdValue} onChange={this.inputValidate.bind(this)} style={{width:326,height:40,border:this.state.bordercolg,borderRadius:0, paddingLeft: 12,fontSize: 18}}/>
          </OverlayTrigger>
          <br/>

         
          <br />
          <ControlLabel style={controlLabelStyle}>Time</ControlLabel>
          <br/>
          <OverLayCustom placement="right" overlay={timeToolTip}>
            <Select id="duration" className="dropdownForm"
             placeholder={<i>Select time</i>}
              name=""
              value={this.state.timeValue}
              options={this.state.timeData}
              searchable={true}
              multi={false}
              clearable={false}
              allowCreate={false}
              onChange={this.handleTime.bind(this)}/>
          </OverLayCustom>
          <br />
          </div>

        }

        </div>
      </div>

      {/******** Notification Section ********/}
      <div style={{backgroundColor:'#f3f5f9',alignItems:'center', justifyContent:'center', display:'flex', padding:'5px 0'}}>
        <div className="col-lg-4 col-md-4 col-sm-4">
          <h3 style={{fontSize:'15px'}}><strong>NOTIFICATION (optional)</strong></h3>
          <div>
            <div id="notifyBy" style={noticiationsStyle}>

              <div style={checkboxStyle} id="byEmail">
               {/* <ReactTooltip  id='byServiceNow' place="top" type="info" effect="float"
                  getContent={() => { return this.state.pagerDutyIntegrated ? null: <span>Coming soon...</span> }} />
                <p data-tip data-for="byServiceNow"> */}
                <label htmlFor="notifyByEmail" style={{fontWeight:'500'}}>
                  Email<br/>
                  <input type="checkbox" checked={this.state.notifyByEmail}  id="notifyByEmail"
                    name="notifyByEmail" onChange={this.handleEmailCheck.bind(this)}/>
                  <label htmlFor="notifyByEmail" style={{fontWeight:'500', marginLeft:10, marginTop:8}}></label>
                  <br/><br/>
                </label>
                {/*</p>*/}
              </div>

              <div style={checkboxStyle} id="byPagerDuty">
                <ReactTooltip  id='PagerToolTip' place="top" type="info" effect="float"
                  getContent={() => { return this.state.pagerDutyIntegrated ? null: <span>Enable PagerDuty at RSE</span> }} />
                
                <p data-tip data-for="PagerToolTip">
                  <label htmlFor="notifyByPagerDuty" style={{fontWeight:'500'}}>
                    Pager Duty<br/>
                    <input type="checkbox" checked={this.state.notifyByPagerDuty}
                      id="notifyByPagerDuty" disabled={this.state.pagerDutyIntegrated?false:true}
                      name="notifyByPagerDuty" onChange={this.handlePagerDutyCheck.bind(this)}/>
                    <label htmlFor="notifyByPagerDuty" style={{fontWeight:'500', marginLeft:10, marginTop:8}}></label>
                    <br/><br/>
                  </label>
                </p>
              </div>

              <div style={checkboxStyle} id="bySlack">
                <ReactTooltip  id='byslacktool' place="top" type="info" effect="float"
                  getContent={() => { return this.state.slackIntegrated ? null: <span>Enable Slack at RSE</span> }} />
                <p data-tip data-for="byslacktool">
                  <label htmlFor="notifyByslack" style={{fontWeight:'500'}}>
                    Slack<br/>
                    <input type="checkbox" checked={this.state.notifyBySlack}
                      id="notifyByslack" disabled={this.state.slackIntegrated?false:true}
                      name="notifyByslack"  onChange={this.handleSlackCheck.bind(this)}/>
                    <label htmlFor="notifyByslack" style={{fontWeight:'500', marginLeft:10, marginTop:8}}></label>
                    <br/><br/>
                  </label>
               </p>
              </div>


             {/* <div style={checkboxStyle} id="byServiceNow">
                <ReactTooltip  id='byServiceNow' place="top" type="info" effect="float"
                  getContent={() => { return this.state.pagerDutyIntegrated ? null: <span>Coming soon...</span> }} />
                <p data-tip data-for="byServiceNow">
                  <label htmlFor="notifyByServiceNowy" style={{fontWeight:'500'}}>
                    ServiceNow<br/>
                    <input type="checkbox" checked={this.state.notifyByServiceNow}
                      id="notifyByServiceNow" disabled={this.state.serviceNowIntegrated?false:true}
                      name="notifyByServiceNow"/>
                    <label htmlFor="notifyByServiceNow" style={{fontWeight:'500', marginLeft:10, marginTop:8}}></label>
                    <br/><br/>
                  </label>
                </p>
              </div>

              <div style={checkboxStyle} id="byDashboard">
                <ReactTooltip  id='byDashboard' place="top" type="info" effect="float"
                  getContent={() => { return this.state.DashboardIntegrated ? null: <span>Coming soon...</span> }} />
                <p data-tip data-for="byDashboard">
                  <label htmlFor="notifyByDashboard" style={{fontWeight:'500'}}>
                    Dashboard<br/>
                    <input type="checkbox" checked={this.state.notifyByDashboard}
                      id="notifyByDashboard" disabled={this.state.dashboardIntegrated?false:true}
                      name="notifyByDashboard"/>
                    <label htmlFor="notifyByDashboard" style={{fontWeight:'500', marginLeft:10, marginTop:8}}></label>
                    <br/><br/>
                  </label>
                </p>
              </div>*/}
            </div>

            {EmailBox}

          </div>
        </div>
      </div>

      {/******** Assign to Grop Section ********/}

      


      {/*<div style={{backgroundColor:'#f9fafc',alignItems:'center', justifyContent:'center', display:'flex', padding:'10px 0'}}>
        <div className="col-lg-4 col-md-4 col-sm-4">
          <h3 style={{fontSize:'15px'}}><strong>ASSIGN TO Accounts</strong></h3>
          <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
            <ControlLabel style={controlLabelStyle}>Account Name</ControlLabel><br/><br/>
              <select className={selectStyle} id="accountName" style={{width:326,height:40, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} onChange={this.handleAccountName.bind(this)}>
                <option value="" disabled selected>Select Account</option>
                {
                  this.state.accountName.map((item) =>
                    { return <option key={item.id} name={item.cloudtrailaccount} value={item.id}>{item.cloudtrailaccount}</option> }
                  )
                }
              </select>
          </FormGroup>
        </div>
      </div>*/}

      {/******** Advanced Settings ********/}
      <div style={{backgroundColor:'#f3f5f9',alignItems:'center', justifyContent:'center', display:'flex'}}>
        <div className="col-lg-4 col-md-4 col-sm-4">
          <h3 style={{fontSize:'15px'}}><strong>ADVANCED SETTINGS</strong></h3>

          <FormGroup>
            <div style={{marginTop:'10px'}}>
              <ReactTooltip  id='advanceSettingPop' place="top" type="info" effect="float"
                  getContent={() => { return this.state.advanceSetting ? <span>Coming soon...</span>: <span>Coming soon...</span> }} />
              <p data-tip data-for="advanceSettingPop">  
              <input type="checkbox" id="stopsAfterRepeatCheck" disabled='true' checked={this.state.stopsAfterRepeatCheck} onChange={this.stopsAfterRepeatCheck.bind(this)}/>
              <label htmlFor='stopsAfterRepeatCheck' style={{fontWeight:'500'}}> &nbsp; Stop alert after

              <select className={selectStyle} id="stopsAfterRepeat" disabled='true' placeholder= "Enter Cloud Type" style={{width:70,height:30, fontSize:11,margin:'0 5px', backgroundColor:'#fff', backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                {
                  this.state.alertInterval.map((item) =>
                    { return <option key={item.value} name={item.value} value={item.value}>{item.label}</option> }
                  )
                }
              </select> repetition</label><br/><br/>
              

              <input type="checkbox" id='doNotDisplay' disabled='true' checked={this.state.doNotDisplay} onChange={this.handleDoNotDisplay.bind(this)}/>
              <label htmlFor='doNotDisplay' style={{fontWeight:'500'}}> &nbsp; Do not display Alert at Dashboard menu</label><br/><br/>

              <input type="checkbox" id='afterFrequencyCheck' disabled='true' checked={this.state.afterFrequencyCheck} onChange={this.afterFrequencyCheck.bind(this)}/>
              <label htmlFor='afterFrequencyCheck' style={{fontWeight:'500'}}> &nbsp; Reduce Alert frequency to

              <select className={selectStyle} id="alertFrequency" placeholder= "Enter Cloud Type" disabled='true' style={{width:70,height:30, fontSize:11,margin:'0 5px', backgroundColor:'#fff', backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
              {
                this.state.alertFrequency.map((item) =>
                  { return <option key={item.value} name={item.value} value={item.value}>{item.label}</option> }
                )
              }
              </select> per hour</label><br/><br/>
              </p>
              <input type="checkbox" id='active' checked={this.state.disable} onChange={this.handleDisable.bind(this)}/>
              <label htmlFor='active' style={{fontWeight:'500'}}> &nbsp; Disable</label><br/><br/>
              
            </div>
          </FormGroup>
        </div>
      </div>

      {/******** Footer ********/}
      <div style={{width:'100%', height:100, backgroundColor:'#4c58a4'}}>
        <div style={{display:'flex',justifyContent: 'flex-end', padding:'25px 50px 0 0'}}>
        <Button className={footerBtn} style={{width:100}} onClick={this.handleCancle.bind(this)}>Cancel </Button>
        <Button className={footerBtn} style={{width:100}} onClick={this.handleDone.bind(this)} disabled={this.state.doneButtonDisability}>Done </Button>
        </div>
      </div>
      {this.state.alertCreated ? <Modal
            show={this.state.alertCreated}
            dialogClassName={modalDialogClass}
            onHide={this.close}
            keyboard={false}
            // aria-labelledby="contained-modal-title"
            backdrop='static'>
            <form style={{border: '1px solid Navy'}}>
              <div style={{marginTop:'10px',paddingLeft:'15px'}}>
                <Modal.Header  style={{marginRight:15,borderBottom:0}}>
                  <a href="#/rse/allalerts" className={modalCloseBtnStyle} onClick={this.close} show={this.state.showModal} onHide={this.close} backdrop='static'>
                    x
                  </a>
                  <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                    {'CONGRATULATIONS.'}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding:'0 15px 15px'}}>
                    <p>You have successfully created a new Alert.</p>
                </Modal.Body>
              </div>
            </form>
          </Modal>
    : ""}

    </div>
    );
  }
}

export default  CreateAlert

CreateAlert.contextTypes = {
  router: React.PropTypes.func.isRequired
};