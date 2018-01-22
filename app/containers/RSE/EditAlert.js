import React, { Component } from 'react'
import {Popover, FormControl, FormGroup,ControlLabel, Checkbox, Button, Modal} from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import {selectStyle} from 'sharedStyles/styles.css'
import {footerBtn,modalCloseBtnStyle,modalDialogClass } from 'sharedStyles/styles.css'
import {deleteDialogClass} from './styles.css'
import {updateAlertRules, getMetrics, getAcountNames,getLambdaFunctions,getSecurityGroups} from 'helpers/alerts'
import {Emailboxtext} from '../MultiStepWizard/Emailbox'
import {modalCloseStyle} from './styles.css'
import Select from 'react-select'
import {getRegionList} from 'helpers/assetGroups'
import OverLayCustom from 'components/Common/OverLayCustom'
import {findElement} from 'javascripts/util.js'
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

class EditAlert extends React.Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
     showModal:false,
      value: '',
      bordercolg:'1px solid #4C58A4',
      notificationOpen:true,
      metricName:[],
      accountName:[],
      Severity:[
        // {label:'Select Severity',value:''},
        {label: 'Low', value:'low'},
        {label: 'Medium', value:'medium'},
        {label: 'High', value:'high'}
      ],
      configuration:[
        // { value: "selectConfig", label: "Select Configuration" },
        { value: "threshold", label: "Threshold" },
        // { value: "AWSLambda", label:"AWS Lambda" }
        // { value: "volatility", label:"Volatility" }
      ],
      ConditionsData:[
        // { value: "selectCondition", label: "Select Condition" },
        { value: "below", label: "Less than" },
        { value: "above", label: "Greater than" }
      ],
      thresholdData:['Select Threshold',15, 30, 60, 120],
      timeData:[
        // { value: "", label: "Select Time" },
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
      securityGroupToolTip:'Select security group',
      lambdaToolTip:'Select lambda function',
      metricNameToolTip:'Select an event',
      typeToolTip: 'Select type',
      conditionToolTip:'Select condition',
      thresholdToolTip: 'Type a threshold number. Number should be greater than 0 if condition is "less than".',
      timeToolTip: 'Select time',
      //*** Notification States ***//
      emails:[],
      showEmailBox:false,
      notifyByEmail:false,
      notifyByPagerDuty:this.props.selectedAlerts[0].pagerDuty,
      pagerDutyIntegrated:false,
      notifyByServiceNow:false,
      ServiceNowIntegrates:false,
      notifyByDashboard:false,
      DashboardIntegrated:false,
      notifyByslack:this.props.selectedAlerts[0].slack,
      slackIntegrated:false,

      //*** Settings States ***//
      stopsAfterRepeatCheck:false,
      doNotDisplay:false,
      afterFrequencyCheck:false,
      disable:false,
      alertCreated:false,
      selectedAlerts:this.props.selectedAlerts,

      alertId:this.props.selectedAlerts[0].id,
      newAlertName:this.props.selectedAlerts[0].name,
      newSeverity:this.props.selectedAlerts[0].severity,
     // newRational:this.props.selectedAlerts[0].rationale,
      newDescription:this.props.selectedAlerts[0].description,
      newMetricName:this.props.selectedAlerts[0].metricName,
      multiValueSelected:this.props.selectedAlerts[0].accountName,
      newType:this.props.selectedAlerts[0].type,
      newConditions:this.props.selectedAlerts[0].condition,
      thresholdValue:this.props.selectedAlerts[0].threshold,
      selectedTime:this.props.selectedAlerts[0].duration,
      newEmails:this.props.selectedAlerts[0].email,
      newStopsAfterRepeat:this.props.selectedAlerts[0].stopsAfterRepeat,
      newStopsAfterRepeatCheck:false,
      newDoNotDisplay:this.props.selectedAlerts[0].doNotDisplay,
      newalertFrequency:this.props.selectedAlerts[0].reduceAfterFrequency,
      newDisable:!this.props.selectedAlerts[0].active,
      type:this.props.selectedAlerts[0].type,
      newalertFrequencyCheck:false,
      accountResponce:[],
      currentAccountId:'',
      accountSelected:[],      
      multiValue: [],
      multi:true,
      multiValueChange:false,
      accountOption:[],
      securityGroupValue:[],
      securityGroup:[],
      lambdaValue:[],
      lambda:[],
      regionValue:[],
      regionList:[],
      regionloading:false,
      grouploading:false,
      lambdaloading:false,
      nameOfAccount:this.props.selectedAlerts[0].accountName[0],
      doneButtonDisability:false,
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
    


    if(this.state.newStopsAfterRepeat !=''){
      this.setState({newStopsAfterRepeatCheck:false})
    }

    if(this.state.newalertFrequency !=''){
      this.setState({newalertFrequencyCheck:false})
    }

    if(this.props.selectedAlerts[0].email.length>0){
      this.setState({showEmailBox:true, notifyByEmail:true},function(){
       // this.validateDoneButton();
      })
    }


    
    
    
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
        /*Account Selected Value*/
        let accounttype;
        this.setState({accountOptionFinal:resultArray}, function(){
          let selectedAccount = []
          for(var i=0; i<this.state.multiValueSelected.length; i++){
            this.state.accountOptionFinal.map((val,key)=>{
              if(val.label === this.state.multiValueSelected[i]){
                
                 accounttype=findElement(this.state.accountOption,"id",val.value);
                
                this.setState({groupaccountType:accounttype.monitoringtype},function(){
                     if(this.state.groupaccountType=="ASSETGROUP"){
                          this.setState({configuration:[/*{ value: "", label: "Select Metric" },*/
                                          { value: "threshold", label: "Threshold" }] })

                    }
                    else{
                       this.setState({configuration:[/*{ value: "", label: "Select Metric" },*/
                                          { value: "threshold", label: "Threshold" },
                                         // { value: "AWSLambda", label:"AWS Lambda" }
                                         ] })

                    }

                       getMetrics(this.props.selectedAlerts[0].type,this.state.groupaccountType)
                        .then((metres)=>{
                          let metricArray=[];
                            metres.map((val,key)=>{
                               let metricObj = {}
                                metricObj.label= val
                                metricObj.value = val
                                metricArray.push(metricObj)
                            })
                            // console.log('metricArray', metricArray)
                            this.setState({metricName:metricArray})


                         })
                        .catch((meterr)=>{

                         })



                })
                selectedAccount.push(this.state.accountOptionFinal[key])
              }
            })
          this.setState({multiValue:selectedAccount})
          }
          console.log('Inside function ', this.state.multiValueSelected, this.state.accountOptionFinal)
        })
      })
      /*console.log('I am in sucess of get Accounts '+ JSON.stringify(responce))
      this.setState({accountName:responce})
      this.setState({accountResponce:responce})
      let accountList = []
      responce.map((val, key)=>{
        accountList.push(val.cloudtrailaccount)        
      })*/
    })
    .catch((error) => console.log("Error in get Metric:" + JSON.stringify(error)))
    let accountedit=[];
    if(this.state.accountOption!=null||this.state.accountOption!=""){
        this.state.accountOption.map(function(x){
          accountedit.push(x);
        })
    }
    this.setState({accountSelected:accountedit});


    if(this.props.selectedAlerts[0].type!=="threshold"){

        let populatedregion=[];     

         getRegionList(this.props.selectedAlerts[0].accountName[0])
          .then((region)=>{
            region.regions.map(function(x){
              let key = Object.keys(x)[0];
              let value = x[key]
                populatedregion.push({value:value,label:key});
              
               })
            //populatedregion.push({value:"All Regions",label:"All Regions"});
              this.setState({regionList:populatedregion,
                      regionloading:false},function(){
                        this.setState({regionValue:this.props.selectedAlerts[0].lambdaFunctionRegion},function(){
                          let  securityArray=[]
                       
                        this.setState({grouploading:true})
                         getSecurityGroups(this.state.multiValueSelected,this.state.regionValue)
                         .then((responces)=>{
                          
                          console.log('I am in sucess of Metric '+ JSON.stringify(responces))
                          if(responces.securitygroups != null)
                          {
                           let securityObj1 = {label:'',value:''}
                            securityArray.push(securityObj1)          
                          }
                          responces.securitygroups.map((grp)=>{
                              let securityObj = {}
                              securityObj.label= grp.groupName
                              securityObj.value = grp.groupId+":"+grp.groupName
                              securityArray.push(securityObj)
                          })
                          // console.log('metricArray', metricArray)
                          this.setState({securityGroup:securityArray,grouploading:false},function(){
                            if(this.props.selectedAlerts[0].securityGroupId!=""&& this.props.selectedAlerts[0].securityGroupName!=""){
                              this.setState({securityGroupValue:this.props.selectedAlerts[0].securityGroupId+":"+this.props.selectedAlerts[0].securityGroupName})
                            }
                          })

                        })
                        .catch((error) => console.log("Error in get Metric:" + JSON.stringify(error)))

                        let  lambdaArray=[]
                        this.setState({lambdaloading:true})

                        getLambdaFunctions(this.state.multiValueSelected,this.state.regionValue)
                        .then((lambdaresponces)=>{
                         
                          console.log('I am in sucess of Metric '+ JSON.stringify(lambdaresponces))
                          if(lambdaresponces.securitygroups != null)
                          {
                           let lambdaObj1 = {label:'',value:''}
                            lambdaArray.push(lambdaObj1)          
                          }
                          lambdaresponces.lambdaFunctions.map((func)=>{
                              let lambdaObj = {}
                              lambdaObj.label= func
                              lambdaObj.value = func
                              lambdaArray.push(lambdaObj)
                          })
                          // console.log('metricArray', metricArray)
                          this.setState({lambda:lambdaArray,lambdaloading:false},function(){
                            if(this.props.selectedAlerts[0].lambdaFunctionName!=""){
                              this.setState({lambdaValue:this.props.selectedAlerts[0].lambdaFunctionName})
                            }
                          })

                        })
                        .catch((error) => console.log("Error in get Metric:" + JSON.stringify(error)))
                  })
             
              })

            })
          .catch((error)=>{
            this.setState({regionList:[],regionValue:[]});
           
            console.log("region error"+error);
          })

      }


  }
  componentWillMount(){
    this.getIntegrationsList();
    console.log(this.state.selectedAlerts, this.state.selectedAlerts)

  }
  // componentDidUpdate(){
  //  // alert('i am in did update')
  //  if(this.state.newStopsAfterRepeat !=''){
  //    this.setState({newStopsAfterRepeatCheck:true})
  //  }
  // }
  openModal(){
    // alert(this.state.newAlertName);
    // alert(this.state.newSeverity);

    if(!this.state.showModal)
   this.setState({showModal:true})
  else
   this.setState({showModal:false})
   }

  validateDoneButton(){

    let emailReq = false;
    if (this.state.notifyByEmail === false){
    
      emailReq = true;
    } else if (this.state.notifyByEmail === true){
      if (this.state.newEmails.length > 0){
       
        emailReq = true;
      } else {
        
        emailReq = false;
      }
    }
  
    let thresholdDataNum = parseInt(this.state.thresholdValue)
    let durationNum = parseInt(this.state.selectedTime)
    if(this.state.newType=="threshold" && emailReq && this.state.multiValue.length>0 && this.state.newAlertName != ''&& this.state.newSeverity !==''&&this.state.newMetricName!=''&&this.state.newType!=''&&this.state.newConditions!=''&&  durationNum && (this.state.newDescription==""||this.state.newDescription.length<=2000) /*&&(this.state.newRational==""||this.state.newRational.length<=2000) */){
    
      if(thresholdDataNum !==0 && this.state.thresholdValue !=="")
        {
               
          this.setState({doneButtonDisability:false}) 
        }

       else if(thresholdDataNum ===0 && this.state.newConditions=='above')
        this.setState({doneButtonDisability:false})
       else{
           this.setState({doneButtonDisability:true}) 
        }

      
    }
    else if(this.state.newType=="AWSLambda" && emailReq && this.state.multiValue.length>0 && this.state.newAlertName  != ''&& this.state.newSeverity !==''&&this.state.metricNameValue!=''&&this.state.newType!=''&& this.state.securityGroupValue!=""&&this.state.lambdaValue!=""&this.state.regionValue!="" && (this.state.newDescription==""||this.state.newDescription.length<=2000)/*&&(this.state.newRational==""||this.state.newRational.length<=2000)*/){
     
      this.setState({doneButtonDisability:false}) 
    }
    else{
    
      this.setState({doneButtonDisability:true}) 
    }
  }

  handleAccountName(e){
    this.state.responce.map((val,key)=>{      
      if(e.target.value == val.cloudtrailaccount){
          this.setState({currentAccountId:val.id})
        }
    })
  }

  handleUpdate(a){
    /*var accountArray
    if(this.state.multiValueChange){
      accountArray = JSON.parse("[" + this.state.multiValue + "]")
    }else{
      let newAccountArray = []
      this.state.multiValue.map((val,key)=>{
        newAccountArray.push(parseInt(val.value))
      })
      accountArray = newAccountArray
    }*/

    var accountArray
    if(this.state.multiValueChange){
      // accountArray = JSON.parse("[" + this.state.multiValue + "]")
      var accountArrayVal = []
      accountArrayVal.push(this.state.multiValue)
      accountArray = JSON.parse("[" + accountArrayVal + "]")
    }else{
      let newAccountArray = []
      this.state.multiValue.map((val,key)=>{
        newAccountArray.push(parseInt(val.value))
      })
      accountArray = newAccountArray
    }

    let thresholdDataNum =0;
    let durationNum="";
    var securityGroupId ="";
    var securityGroupName ="";
    var lambdaFunctionName = "";
    var lambdaFunctionRegion =""






   if(this.state.newType==="AWSLambda"){

     securityGroupId = this.state.securityGroupValue.substring(0,this.state.securityGroupValue.indexOf(":"));
     securityGroupName = this.state.securityGroupValue.substring(this.state.securityGroupValue.indexOf(":")+1,this.state.securityGroupValue.length);
     lambdaFunctionName = this.state.lambdaValue
  
     lambdaFunctionRegion = this.state.regionValue;
     thresholdDataNum=0;
     durationNum="";
     this.setState({newConditions:""})

   }
   else{

     securityGroupId ="";
     securityGroupName ="";
     lambdaFunctionName = "";
     lambdaFunctionRegion =""
   
     thresholdDataNum = parseInt(thresholdData.value)
    
     durationNum = parseInt(this.state.selectedTime)

   }



    let stopsAfterRepeatNum = parseInt(stopsAfterRepeat.value)
    let reduceAfterFrequencyNum = parseInt(alertFrequency.value)
    
    updateAlertRules(this.state.alertId, alertName.value, this.state.newSeverity, description.value,  this.state.newMetricName, this.state.newType, this.state.newConditions, thresholdDataNum, durationNum, accountArray, this.state.newEmails, stopsAfterRepeatNum, this.state.newDoNotDisplay, reduceAfterFrequencyNum, !this.state.newDisable,securityGroupId,securityGroupName,lambdaFunctionName,lambdaFunctionRegion,this.state.notifyByslack,this.state.notifyByPagerDuty)
      .then((responce) =>  {
          console.log('I am in sucess'+ JSON.stringify(responce))

          this.props.refreshList();
          this.props.removeFromSelected(this.state.alertId);
          this.openModal()
        }
       )
      .catch((error) => console.log("Error in Edit Alert Rules in RSE:" + error))

      // {this.openModal()}
      let resultPath = 'rse/allalerts'
      this.context.router.push(resultPath);

      this.setState({alertCreated:true})
  }

  handleCancle(){
    // console.log('Cancel', this.state.alertId, alertName.value, this.state.newSeverity, description.value, rationale.value, metricName.value, configuration.value, conditions.value, thresholdDataNum, duration.value, accountArray, this.state.newEmails, stopsAfterRepeatNum, this.state.newDoNotDisplay, alertFrequency.value, !this.state.newDisable)
    console.log('Cancel', accountArray)
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
      this.setState({newStopsAfterRepeatCheck:false})
    else
      this.setState({newStopsAfterRepeatCheck:false})    
  }

  handleDoNotDisplay(e){
    if(this.state.newDoNotDisplay)
      this.setState({newDoNotDisplay:false})
    else
      this.setState({newDoNotDisplay:true})
  }

  afterFrequencyCheck(e){
    if(e.target.checked)
      this.setState({newalertFrequencyCheck:false})
    else
      this.setState({newalertFrequencyCheck:false})
  }

  handleDisable(e){
    if(e.target.checked)
      this.setState({newDisable:true})
    else
      this.setState({newDisable:false})
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
    this.setState({newEmails:emailsList},function(){
       this.validateDoneButton();
    });
  }

  handleAlertName(e){
    this.setState({newAlertName:e.target.value},function(){
      this.validateDoneButton()
    })
  }
  handleSeverity(e){
    this.setState({newSeverity:e},function(){
      this.validateDoneButton()
    })
  }
  handleDescription(e){
    this.setState({newDescription:e.target.value},function(){
      this.validateDoneButton()
    })
  }
 /* handleRational(e){
    this.setState({newRational:e.target.value},function(){
      this.validateDoneButton()
    })
  }*/
  handleMetricName(e){
    this.setState({newMetricName:e},function(){
      this.validateDoneButton()
    })
  }
  handleType(e){
    this.setState({newType:e},function(){
      /*API Call to fill the Metric namesSelection field*/
      if(this.state.multiValue.length>0){
        let metricObj = {label:'',value:''}, metricArray=[]
        getMetrics(this.state.newType,this.state.groupaccountType)
        .then((responce)=>{
          console.log('I am in sucess of Metric '+ JSON.stringify(responce))
          /*if(responce != null)
          {
            metricObj = {label:'Select Metric',value:'selectMetric'}
            metricArray.push(metricObj)          
          }*/
          responce.map((val,key)=>{
              metricObj = {label:'',value:''}
              metricObj.label= val
              metricObj.value = val
              metricArray.push(metricObj)
          })
          // console.log('metricArray', metricArray)
          this.setState({metricName:metricArray})

        })
        .catch((error) => console.log("Error in get Metric:" + JSON.stringify(error)))

      }
      if(this.state.newType!=="threshold"){
        let populatedregion=[];       

         getRegionList(this.state.nameOfAccount)
          .then((region)=>{
            region.regions.map(function(x){
              let key = Object.keys(x)[0];
              let value = x[key]
                populatedregion.push({value:value,label:key});
              
               })
            //populatedregion.push({value:"All Regions",label:"All Regions"});
              this.setState({regionList:populatedregion,
                      regionloading:false},function(){
                        //this.setState({regionValue:populatedregion[0].value})
                      });
             
          })
          .catch((error)=>{
            this.setState({regionList:[],regionValue:[]});
           
            console.log("region error"+error);
          })

        } 


    })
  }
  handleConditions(e){
    this.setState({newConditions:e},function(){
      this.validateDoneButton()
    })
  }
  handleThreshold(e){
    this.setState({newThreshold:e.target.value},function(){
      this.validateDoneButton()
    })
  }
  handleDuration(e){
    this.setState({selectedTime:e},function(){
      this.validateDoneButton()
    })
  }
  handleAccountName(e){
    this.setState({newAccountName:e.target.value},function(){
      this.validateDoneButton()
    })
  }
  handleStopAfter(e){
    this.setState({newStopsAfterRepeat:e.target.value})
  }
  handleAlertFrequency(e){
    this.setState({newalertFrequency:e.target.value})
  }
  handleMultiAccount(value){
    this.setState({newType:'',newMetricName:'',metricName:[]})
   let accountlabel="",monitortype="";
    this.setState({multiValueChange:true})
    const { multi } = this.state;
    if (multi) {
      this.setState({ multiValue: value },function(){
      this.validateDoneButton()
    });



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
                  this.setState({configuration:[/*{ value: "", label: "Select Metric" },*/
                                  { value: "threshold", label: "Threshold" }] })

            }
            else{
               this.setState({configuration:[/*{ value: "", label: "Select Metric" },*/
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
                                        this.setState({regionValue:populatedregion[0].value})
                                      });
                             
                          })
                          .catch((error)=>{
                            this.setState({regionList:[],regionValue:[]});
                           
                            console.log("region error"+error);
                          })
                     }

                     if(this.state.newType!=""){

                          let metricObj = {label:'',value:''}, metricArray=[]
                          getMetrics(this.state.newType,this.state.groupaccountType)
                          .then((responce)=>{
                            console.log('I am in sucess of Metric '+ JSON.stringify(responce))
                            if(responce != null)
                            {
                             /* metricObj = {label:'Select an event',value:''}
                              metricArray.push(metricObj)    */      
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
          })
       
     
    }
  }
   handleSecurityGroup(e){

    if(e ===''|| e == 'Select Security Group to Monitor'){
      this.setState({securityGroupValue :e})
    }else{
      //this.validateDoneButton()
      this.setState({securityGroupValue :e},function(){
        this.validateDoneButton()
      })
    }
    // else{ this.setState({doneButtonDisability:false})}    
  }
  handleLambda(e){
    if(e ===''|| e == 'Select Lambda function to remediate'){
      this.setState({lambdaValue :e})
    }else{
      //this.validateDoneButton()
      this.setState({lambdaValue :e},function(){
       this.validateDoneButton()
      })
    }
    // else{ this.setState({doneButtonDisability:false})}    
  }
   handleRegion(e){
    if(e===""){
       this.setState({regionValue :e})

    }else{
       this.setState({regionValue :e,securityGroupValue:"",lambdaValue:"",securityGroup:[],lambda:[]},function(){
          this.validateDoneButton();
          let  securityArray=[]
          this.setState({grouploading:true})
           getSecurityGroups(this.state.nameOfAccount,this.state.regionValue)
           .then((responces)=>{
            
            console.log('I am in sucess of Metric '+ JSON.stringify(responces))
            if(responces.securitygroups != null)
            {
             let securityObj1 = {label:'',value:''}
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
            if(lambdaresponces.securitygroups != null)
            {
             let lambdaObj1 = {label:'',value:''}
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


       })
    }

  }

  inputValidate(e){
    const re = /^[0-9\b]+$/;
    if (e.target.value == '' || re.test(e.target.value)) {
       this.setState({thresholdValue: e.target.value},function(){this.validateDoneButton()})
    }

    if(e.target.value === 10000000 || e.target.value >=10000000){
      this.setState({thresholdValue: 10000000})
    }
  }

  render() {
    console.log('REnder ', this.props.selectedAlerts[0])

    const tooltipalertName = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:50, paddingTop:4}}>Enter name </Popover> )
    const tooltipCloudType = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:50, paddingTop:4}}>{this.state.CloudType_error}</Popover> )
    const metricNameToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:160,height:50, paddingTop:4}}>{this.state.metricNameToolTip}</Popover> )
    const regionToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:180,height:50, paddingTop:4}}>{this.state.regionToolTip}</Popover> )
    const securityGroupToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:50, paddingTop:4}}>{this.state.securityGroupToolTip}</Popover> )
    const lambdaToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:210,height:50, paddingTop:4}}>{this.state.lambdaToolTip}</Popover> )
    const typeToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:220,height:50, paddingTop:4}}>{this.state.typeToolTip}</Popover> )
    const conditionToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:190,height:50, paddingTop:4}}>{this.state.conditionToolTip}</Popover> )
    const thresholdToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:190,height:100, paddingTop:4, display:(this.state.thresholdValue ==''||(this.state.newConditions=="below" && this.state.thresholdValue==0)) ? 'block': 'none' }}>{this.state.thresholdToolTip}</Popover> )
    const timeToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:160,height:50, paddingTop:4}}>{this.state.timeToolTip}</Popover> )
    const AccountNameToolTip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:50, paddingTop:4, display: this.state.multiValue.length !=1 ? 'block': 'none'}}>{this.state.AccountNameToolTip}</Popover> )
    const desriptiontooltip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:60, paddingTop:4, display: this.state.descerror ==false ? 'none': 'block'}}>Maximum of 2000 characters allowed.</Popover> )
    const ratinaletooltip = ( <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:60, paddingTop:4, display: this.state.rationerror==false ? 'none': 'block'}}>Maximum of 2000 characters allowed.</Popover> )

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

    if(this.state.showEmailBox)
    {      
      var EmailBox = 
        <div>
          <div style={{marginLeft:20}}>
            <Emailboxtext emails={this.state.newEmails} updateEmails={this.updateEmails.bind(this)}/>
          </div>
        </div>
    }
    return(
      <span>
      <a href='JavaScript: void(0)' onClick={this.openModal.bind(this)}>
            Edit
          </a>
          <Modal 
            show={this.state.showModal} 
            onHide={this.closeModal}
            aria-labelledby="contained-modal-title"
            dialogClassName={deleteDialogClass}
            backdrop='static'
            keyboard={false}
            >
            <Modal.Body style={{padding:0}}>
              <div style={css.wrapper}>
                <h4 style={css.heading}>Edit Alert Rule</h4>    
                 <a style={{textDecoration:'none', top:9, right:37}} href="javascript:void(0)" className={modalCloseStyle} onClick={this.openModal.bind(this)}  onHide={this.openModal.bind(this)} >
                  x
                  </a>  
                {/*<span style={css.close} onClick={this.openModal.bind(this)}>&#x274C;</span>  */}

                {/******** Alert Details *******/}
                <div style={css.contentWrapper}>  
                  <div className="col-lg-5 col-md-5 col-sm-5">
                    <h3 style={{fontSize:'15px'}}><strong>ALERT DETAILS</strong></h3>
                      <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
                        <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Alert Name</ControlLabel>
                         {/* <OverLayCustom ref="alertName" placement="right" overlay={tooltipalertName}>*/}
                          <FormControl
                            id='alertName'
                            type="text"
                            defaultValue={this.state.value}
                            value={this.state.newAlertName}
                            placeholder="Provide alert name"
                            onChange={this.handleAlertName.bind(this)}
                            style={{width:326,height:40,border:this.state.bordercolg,borderRadius:0}}
                          />
                         {/* </OverLayCustom>*/}
                      </FormGroup>

                      <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
                        <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Severity</ControlLabel>
                        <br/>
                        <Select id="severity" className="dropdownForm"
                          placeholder={<i>Select severity</i>}
                          name=""
                          value={this.state.newSeverity}
                          options={this.state.Severity}
                          searchable={true}
                          multi={false}
                          clearable={false}
                          allowCreate={false}
                          onChange={this.handleSeverity.bind(this)}/>
                          {/*<select className={selectStyle} onChange={this.handleSeverity.bind(this)} value={this.state.newSeverity} id="severity" placeholder= "Select Severity" style={{width:326,height:40, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                            {
                              this.state.Severity.map((item) =>
                                { return <option key={item.value} name={item} value={item}>{item}</option> }
                              )
                            }
                          </select>*/}
                      </FormGroup>

                      <FormGroup> 
                        <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Description</ControlLabel>
                        <FormControl
                          id="description"
                          type="text"
                          defaultValue={this.state.newDescription}
                          onChange={this.handleDescription.bind(this)}
                          placeholder="Enter the description"
                          style={{width:326,height:45,border:this.state.bordercolg,borderRadius:0,}}
                        />
                      </FormGroup>

                      {/*<FormGroup>                         
                        <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Rationale</ControlLabel><br/>
                        <textarea
                          id="rationale"
                          type="text"
                          defaultValue={this.state.value}
                          value={this.state.newRational}
                          onChange={this.handleRational.bind(this)}
                          placeholder="When an alert is sent, it includes a message entered here. This can contain a problem statement and  certain ways to remediate the problem"
                          style={{width:326,height:100,border:this.state.bordercolg,borderRadius:0,}}
                        />
                      </FormGroup>*/}
                    </div>
                </div>

                <div style={{backgroundColor:'#f9fafc',alignItems:'center', justifyContent:'center', display:'flex', padding:'10px 0'}}>
                  <div className="col-lg-5 col-md-5 col-sm-5">
                    <h3 style={{fontSize:'15px'}}><strong>ASSIGN TO GROUPS OR CLOUD ACCOUNTS</strong></h3>
                    <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
                     {/* <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Account Name</ControlLabel><br/><br/>*/}
                       <br />
                        <Select
                          placeholder={<i>Select cloud account/group</i>}
                          id='multiSelectLocation'
                          className="dropdownForm"
                          // multi={this.state.multi}
                          options={this.state.accountOptionFinal}
                          onChange={this.handleMultiAccount.bind(this)}
                          // value={this.state.multi ? this.state.multiValue : this.state.valueAccount}
                          value={this.state.multiValue}
                        />
                    </FormGroup>
                  </div>
                </div>


                {/******** Add Metric Section *******/}
                <div style={{backgroundColor:'#f5f8fa',alignItems:'center', justifyContent:'center', display:'flex', padding:'15px 0'}}>  
                  <div className="col-lg-5 col-md-5 col-sm-5">
                    <h3 style={{fontSize:'15px'}}><strong>ADD ALERT RULE</strong></h3><br/>
                    
                    <FormGroup
                      controlId="formBasicText"
                      validationState={this.getValidationState()}
                    >
                    <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Metric</ControlLabel>
                    <br/>
                      <Select id="configuration" className="dropdownForm"
                        placeholder={<i>Select metric</i>}
                        name=""
                        value={this.state.newType}
                        options={this.state.configuration}
                        searchable={true}
                        multi={false}
                        clearable={false}
                        allowCreate={false}
                        onChange={this.handleType.bind(this)}/>

                      {/*<select className={selectStyle} onChange={this.`handleType`.bind(this)} value={this.state.newType} id="configuration" placeholder= "Enter Cloud Type" style={{width:326,height:40, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                      {
                        this.state.configuration.map((item) =>
                          { return <option key={item.value} name={item.value} value={item.value} disabled = {item.value == 'volatility' ? true : false} style={(item.value == 'volatility')?{color:'hsl(310, 12%, 68%)'}:{}}>{item.label}</option> }
                        )
                      }
                      </select>*/}
                    <br/>

                    <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Event</ControlLabel>
                    <br/>
                      <Select id="Metric" className="dropdownForm"
                        placeholder={<i>Select an event</i>}
                        name=""
                        value={this.state.newMetricName}
                        options={this.state.metricName}
                        searchable={true}
                        multi={false}
                        clearable={false}
                        allowCreate={false}
                        onChange={this.handleMetricName.bind(this)}/>
                      {/*<select className={selectStyle} onChange={this.handleMetricName.bind(this)} value={this.state.newMetricName} id="metricName" style={{width:326,height:40, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                        <option value="" disabled selected>Select Metric Type</option>
                        {
                          this.state.metricName.map((item) =>
                            { return <option key={item.value} name={item} value={item.value}>{item}</option> }
                          )
                        }                      
                      </select>*/}
                    <br/>


                  {this.state.newType=="AWSLambda"?
                  <div>
                    <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Region</ControlLabel>
                    <br/>
                   
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
                   

                    <br/>
                    <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Security Group Name</ControlLabel>
                      <br/>
                     
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
                     

                      <br/>

                      <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Lambda</ControlLabel>
                      <br/>
                    
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
                      <br/>

                      </div>

                      :
                    
                      <div>

                      <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Condition</ControlLabel>
                      <br/>
                        <Select id="conditions" className="dropdownForm"
                          placeholder={<i>Select condition</i>}
                          name=""
                          value={this.state.newConditions}
                          options={this.state.ConditionsData}
                          searchable={true}
                          multi={false}
                          clearable={false}
                          allowCreate={false}
                          onChange={this.handleConditions.bind(this)}/>

                        {/*<select className={selectStyle} value={this.state.newConditions} onChange={this.handleConditions.bind(this)} id="conditions" placeholder= "Enter Cloud Type" style={{width:326,height:40, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                        {
                          this.state.ConditionsData.map((item) =>
                          { return <option key={item.value} name={item.value} value={item.value}>{item.label}</option> }
                          )
                        }
                        </select>*/}
                      <br/>

                    {/***** Threshold *****/}
                      <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Threshold</ControlLabel>
                      <br/>
                      <input id="thresholdData" type="text" value={this.state.thresholdValue} onChange={this.inputValidate.bind(this)} style={{width:326,height:40,border:this.state.bordercolg,borderRadius:0, paddingLeft: 12,fontSize: 18}}/>
                      <br/><br/>


                    {/***** Time *****/}

                      <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Time</ControlLabel>
                      <br/>
                      <Select id="duration" className="dropdownForm"
                        placeholder={<i>Select time</i>}
                        name=""
                        value={this.state.selectedTime}
                        options={this.state.timeData}
                        searchable={true}
                        multi={false}
                        clearable={false}
                        allowCreate={false}
                        onChange={this.handleDuration.bind(this)}/>


                        {/*<select className={selectStyle} id="duration" placeholder= "Select Time" style={{width:326,height:40, backgroundColor:'#fff', backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                          {
                            this.state.timeData.map((item) =>
                              { 
                              var selected = false;
                              if(this.state.selectedTime === item.value){selected = true;}

                                return <option key={item.value} name={item.value} value={item.value}  selected={selected}>{item.label}</option> }
                            )
                          }
                        </select>*/}

                      {/*

                      <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Threshold</ControlLabel>
                      <br/>
                        <select className={selectStyle} value={this.state.newThreshold} onChange={this.handleThreshold.bind(this)} id="thresholdData" placeholder= "Enter Cloud Type" style={{width:326,height:40, backgroundColor:'#fff', backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                        {
                          this.state.thresholdData.map((item) =>
                            { return <option key={item.value} name={item} value={item.value}>{item}</option> }
                          )
                        }
                        </select>
                      <br/><br/>

                      <<OverlayTrigger placement="right" overlay={thresholdToolTip}>

                      </OverlayTrigger>

                      ControlLabel style={{fontSize:'15px',fontWeight:500}}>Time</ControlLabel>
                      <br/>
                        <select className={selectStyle} value={this.state.newDuration} onChange={this.handleDuration.bind(this)} id="duration" placeholder= "Enter Cloud Type" style={{width:326,height:40, backgroundColor:'#fff', backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                        {
                          this.state.timeData.map((item) =>
                            { return <option key={item.value} name={item.value} value={item.value}>{item.label}</option> }
                          )
                        }
                        </select>*/}
                      </div>
                    }
                    </FormGroup>
                  </div>
                </div>  

                {/******** Notification Section ********/}
                <div style={{backgroundColor:'#f3f5f9',alignItems:'center', justifyContent:'center', display:'flex', padding:'20px 0'}}>  
                  <div className="col-lg-5 col-md-5 col-sm-5">
                    <h3 style={{fontSize:'15px'}}><strong>NOTIFICATION (optional)</strong></h3>
                    <div>
                      <div id="notifyBy" style={noticiationsStyle}>

                        <div style={checkboxStyle} id="byEmail">
                         {/* <ReactTooltip  id='byServiceNow' place="top" type="info" effect="float"
                            getContent={() => { return this.state.pagerDutyIntegrated ? null: <span>Coming soon...</span> }} />
                          <p data-tip data-for="byServiceNow">*/}
                          <label htmlFor="notifyByEmail" style={{fontWeight:'500'}}>
                            Email<br/>
                            <input type="checkbox" checked={this.state.notifyByEmail}  id="notifyByEmail"  
                              name="notifyByEmail" onChange={this.handleEmailCheck.bind(this)}/>
                            <label htmlFor="notifyByEmail" style={{fontWeight:'500', marginLeft:10, marginTop:8}}></label>
                            <br/><br/>
                          </label>
                         {/* </p>*/}
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


                        <div style={checkboxStyle} id="byslack">
                          <ReactTooltip  id='byslacktool' place="top" type="info" effect="float"
                            getContent={() => { return this.state.slackIntegrated ? null: <span>Enable Slack at RSE</span> }} />   
                          <p data-tip data-for="byslacktool">
                            <label htmlFor="notifyByslack" style={{fontWeight:'500'}}>
                              Slack<br/>                     
                              <input type="checkbox" checked={this.state.notifyByslack} 
                                id="notifyByslack" disabled={this.state.slackIntegrated?false:true}
                                name="notifyByslack" onChange={this.handleSlackCheck.bind(this)}/>                   
                              <label htmlFor="notifyByslack" style={{fontWeight:'500', marginLeft:10, marginTop:8}}></label>
                              <br/><br/>
                            </label>
                          </p>     
                        </div>


                        {/*<div style={checkboxStyle} id="byServiceNow">
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
                            getContent={() => { return this.state.DashboardIntegrated ? null: <span>Comming soon...</span> }} />   
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
                  <div className="col-lg-5 col-md-5 col-sm-5">
                    <h3 style={{fontSize:'15px'}}><strong>ASSIGN TO Accounts</strong></h3>
                    <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
                          <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Account Name</ControlLabel><br/><br/>
                          <select className={selectStyle} id="accountName" value={this.state.newAccountName} style={{width:326,height:40, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} onChange={this.handleAccountName.bind(this)}>
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
                  <div className="col-lg-5 col-md-5 col-sm-5">
                    <h3 style={{fontSize:'15px'}}><strong>ADVANCED SETTINGS</strong></h3>
                    
                    <FormGroup>            
                      <div style={{marginTop:'10px'}}>
                      <ReactTooltip  id='advanceSettingPop' place="top" type="info" effect="float"
                          getContent={() => { return this.state.advanceSetting ? <span>Coming soon...</span>: <span>Coming soon...</span> }} />
                      <p data-tip data-for="advanceSettingPop">
                        <input type="checkbox" disabled='true' id="stopsAfterRepeatCheck" checked={this.state.newStopsAfterRepeatCheck} onChange={this.stopsAfterRepeatCheck.bind(this)}/>
                        <label htmlFor='stopsAfterRepeatCheck' style={{fontWeight:'500'}}> &nbsp; Stop alert after 
                            
                        <select className={selectStyle} value={this.state.newStopsAfterRepeat}  disabled='true' onChange={this.handleStopAfter.bind(this)} id="stopsAfterRepeat" placeholder= "Enter Cloud Type" style={{width:70,height:30, fontSize:11,margin:'0 5px', backgroundColor:'#fff', backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                          {
                            this.state.alertInterval.map((item) =>
                              { return <option key={item.value} name={item.value} value={item.value}>{item.label}</option> }
                            )
                          }
                        </select> repetition</label><br/><br/>

                        <input type="checkbox" id='doNotDisplay'  disabled='true' checked={this.state.newDoNotDisplay} onChange={this.handleDoNotDisplay.bind(this)}/>
                        <label htmlFor='doNotDisplay' style={{fontWeight:'500'}}> &nbsp; Do not display Alert at Dashboard menu</label><br/><br/>

                        <input type="checkbox" id='afterFrequencyCheck'  disabled='true' checked={this.state.newalertFrequencyCheck} onChange={this.afterFrequencyCheck.bind(this)}/>
                        <label htmlFor='afterFrequencyCheck' style={{fontWeight:'500'}}> &nbsp; Reduce Alert frequency to
                          
                        <select className={selectStyle}  disabled='true' value={this.state.newalertFrequency} onChange={this.handleAlertFrequency} id="alertFrequency" placeholder= "Enter Cloud Type" style={{width:70,height:30, fontSize:11,margin:'0 5px', backgroundColor:'#fff', backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                        {
                          this.state.alertFrequency.map((item) =>
                            { return <option key={item.value} name={item.value} value={item.value}>{item.label}</option> }
                          )
                        }
                        </select> per hour</label><br/><br/>
                        </p> 
                        <input type="checkbox" id='active' checked={this.state.newDisable? true : false} onChange={this.handleDisable.bind(this)}/>
                        <label htmlFor='active' style={{fontWeight:'500'}}> &nbsp; Disable</label><br/><br/>
                      
                      </div>
                    </FormGroup>
                  </div>
                </div>

                {/******** Footer ********/}
                <div style={{width:'100%', height:100, backgroundColor:'#4c58a4'}}>
                  <div style={{display:'flex',justifyContent: 'flex-end', padding:'25px 50px 0 0'}}>
                  <Button className={footerBtn} style={{width:100}} onClick={this.openModal.bind(this)}>Cancel </Button>
                  <Button className={footerBtn} style={{width:100}} onClick={this.handleUpdate.bind(this)} disabled={this.state.doneButtonDisability}>Update </Button>
                  </div>
                </div>
              </div>





            </Modal.Body>
          </Modal>

      </span>
    )   
  }
}

export default EditAlert

EditAlert.contextTypes = {
  router: React.PropTypes.func.isRequired
};