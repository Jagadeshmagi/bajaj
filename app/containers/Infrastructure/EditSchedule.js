import React, {PropTypes} from 'react'
import { modalContainer, CreateGroupDialogClass, scheduleDialogClass, CredentialsDialogClass, modalCloseStyle, closeButtonClass} from './styles.css'
import { blueBtn, btnPrimary,deleteDialogClass,modalDialogClass,selectStyleTime,footerBtn} from 'sharedStyles/styles.css'
import {Popover,Tooltip,Table, Modal,ButtonToolbar,ButtonGroup,Label,
        Button , SplitButton , MenuItem,Col, FormControl, FormGroup,ControlLabel, HelpBlock,
        OverlayTrigger ,Checkbox, Radio,fieldset,legend,Glyphicon} from 'react-bootstrap'
import {dotted,fileGlyph,ulStyle,liStyle,italic1,infoCircle} from './styles.css'
import Joi from 'joi-browser'
import {selectStyle} from 'sharedStyles/styles.css'
import DatePicker from 'react-bootstrap-date-picker'
import {Emailboxtext} from 'containers/MultiStepWizard/Emailbox'
import CustomScheduleComponent from 'containers/MultiStepWizard/CustomScheduleComponent'
import {getScanSchedules,putScanSchedule,getScanSchedulesByLabel,
        updateScheduleTemplateByLabel} from 'helpers/schedules'
import ReactDOM from 'react-dom'
import {getAllIntegrations} from 'helpers/integration'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'

const css={
  contentWrapper:{backgroundColor:'#f9fafc', alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column'},
  heading:{
    backgroundColor:'#00d284',
    padding:'21px 0',
    textAlign:'center',
    color:'#fff',
    margin:0,
    fontSize:20,
  },
  editStyle:{
      height: 40,
      border: '1px solid #737684',
      textAlign: 'center',
      padding: '7px 0',
      cursor:'pointer'
  },
  timeSelectStyle:{
    width:50,
    height:36,
    backgroundColor:'#fff',
    padding:'7px 2px 7px 7px',
    border:'1px solid #4C58A4',
    marginRight:10,
    paddingTop:4
  },

}


function findElement(arr, propName, propValue) {
  let obj  = null;
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      obj = arr[i];
  return obj
}


  function getFormatterDate(date)
{
  if(date!=undefined)
  {
    var fullDate = new Date(date);
  }
  else{
    var fullDate = new Date()
  }
  var twoDigitMonth = (fullDate.getMonth()+1) + "";
  if (twoDigitMonth.length == 1)
      twoDigitMonth = "0" + twoDigitMonth;
  var twoDigitDate = fullDate.getDate() + "";
  if (twoDigitDate.length == 1)
      twoDigitDate = "0" + twoDigitDate;
  var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + fullDate.getFullYear(); console.log(currentDate);
  return currentDate
}


class EditSchedule extends React.Component {

 constructor(props) {
    super(props);
    var value = new Date().toISOString();
    this.state = {
      dateChange:true,

      saving:false,
      showModal: false,
      showEmailBox:true,

      showCustomSchedule:false,
      templateName:'',
      enableInput:true,

      customScheduleDesc:'',
      valueStart: '',
      startTimeHour:'12',
      startTimeMin:'0',
      startTimePrime:'am',
      recurrence:'day',
      valueEnd:'',
      dayModifier:1,
      weekModifiers:[],
      endCount:'',
      custom:0,

      notifyTestBegin:false,
      notifyTestEnd:false,
      notifyTestFailed:false,
      notifyTestAborted:false,

      notifyByEmail:false,
      emailBorderColor:'1px solid #4C58A4',
      notifyByPagerDuty:false,
      notifyBySlack:false,

      emails:[],
      currentEmailTxtValue:"",

      customNotifications:false,
      integrationsList:[],
      pdIntegrated:false,
      slackIntegrated:false,
      pagerDutyId:0,
      slackID:0,

      bordercolg:'1px solid #4C58A4',
      atHour:[
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
        { value: 6, label: "6" },
        { value: 7, label: "7" },
        { value: 8, label: "8" },
        { value: 9, label: "9" },
        { value: 10, label: "10" },
        { value: 11, label: "11" },
        { value: 0, label: "12" }],
      atMinute:[
        { value: 0, label: "00" },
        { value: 15, label: "15" },
        { value: 30, label: "30" },
        { value: 45, label: "45" }
      ],

      atTimePrime:[
        { value: "am", label: "AM" },
        { value: "pm", label: "PM" }
      ],
      assesmentRecurrence:[
        { value: "day", label: "Daily" },
        { value: "week", label: "Weekly" },
        { value: "month", label: "Monthly" },
        { value: "custom", label: "Custom" }
      ],

      showAddModal: false,
      showConfimrationModal:false,
      doneButton:'Save',
      reportType:'Pdf',

      showReportTypeRadio:false,

      beforeTodayFrom: false,
      showDateError: false,
      displayStartError:false,
      displayEndError:false

    };
  }

  saveCustomScheduleInfo(customScheduleInfo){
    this.setState({
      customScheduleDesc:customScheduleInfo.description,
      recurrence:customScheduleInfo.recurrence,
      valueStart:customScheduleInfo.valueStart,
      valueEnd:customScheduleInfo.valueEnd,
      dayModifier:customScheduleInfo.dayModifier,
      weekModifiers:customScheduleInfo.weekModifiers,
      endCount:customScheduleInfo.endCount,
      custom:1
    })

  }

   saveScheduling(e){
     if((this.state.notifyByEmail && this.state.emails.length<1)||this.state.currentEmailTxtValue!="")
      {
        this.setState({emailBorderColor:'1px solid red'})
        e.preventDefault();
      }else if(this.state.displayStartError || this.state.displayEndError){
        e.preventDefault();
      }
    else
    {
      let scheduleObj = {};

      let selectedStartTime = new Date(this.state.valueStart);
      let startTime = new Date(selectedStartTime.getUTCFullYear(),selectedStartTime.getUTCMonth(),selectedStartTime.getUTCDate())


      let hours = this.state.startTimeHour
      let minutes = this.state.startTimeMin
      if(this.state.startTimePrime === "pm")
        hours = parseInt(hours) + 12
      startTime.setHours(hours)
      startTime.setMinutes(minutes)

     let endTime= null;
      if(this.state.valueEnd!=null){
        let selectedEndTime = new Date(this.state.valueEnd);
        endTime = new Date(selectedEndTime.getUTCFullYear(),selectedEndTime.getUTCMonth(),selectedEndTime.getUTCDate())
        endTime.setHours(hours)
        endTime.setMinutes(minutes)
      }

      scheduleObj["templateName"] = this.state.templateName
      scheduleObj["startTime"]= startTime
      scheduleObj["endTime"]= endTime
      scheduleObj["recurrence"] = this.state.recurrence
      scheduleObj["dayModifier"] = this.state.dayModifier
      scheduleObj["weekModifier"] = this.state.weekModifiers.join("")
      scheduleObj["endCount"] = this.state.endCount
      scheduleObj["notifyTestBegin"] = this.state.notifyTestBegin
      scheduleObj["notifyTestEnd"] = this.state.notifyTestEnd
      scheduleObj["notifyTestAbort"] = this.state.notifyTestAborted
      scheduleObj["notifyTestFail"] = this.state.notifyTestFailed
      let notifyList = [];
      if(this.state.notifyByPagerDuty){
        let pdObj={}
        pdObj["type"] = "pagerduty"
        pdObj["id"] = this.state.pagerDutyId
        notifyList.push(pdObj);
      }
      if(this.state.notifyBySlack){
        let slackObj={}
        slackObj["type"] = "slack"
        slackObj["id"] = this.state.slackId
        notifyList.push(slackObj);
      }
      scheduleObj["notify"] = notifyList
      scheduleObj["notifyBySlack"] = this.state.notifyBySlack
      scheduleObj["notifyByPagerduty"] = this.state.notifyByPagerDuty
      scheduleObj["emails"] = this.state.showEmailBox?this.state.emails:[]
      scheduleObj["reportingPref"] = this.state.reportType

      scheduleObj["custom"] = this.state.custom

      console.log(JSON.stringify(scheduleObj));

      updateScheduleTemplateByLabel(scheduleObj)
      .then((response)=>{
        this.setState({showAddModal:false},function(){
          this.props.refreshTemplatesList();
          this.props.removeFromSelected(this.state.templateName);
        })
      })
      .catch((error) => {
        console.log("error in save schedule:"+error)
      })
    }
  }

  openModal(){
     let selectedTemplate={};
    if(this.props.groupsAssigned===true){
      this.setState({showConfimrationModal:true})}
    else{
      getScanSchedulesByLabel(this.props.selectedTemplateName)
    .then((response)=>{
        selectedTemplate=response.data
        this.getIntegrationsList();
       this.setTemplateData(selectedTemplate)
       this.setState({showAddModal:true})
    })
    .catch((getScanSchedulesByLabelError)=>console.log("error in fetching templete details "+getScanSchedulesByLabelError))

    }
  }

  openEditTemplateModal(){
    let selectedTemplate={};
    getScanSchedulesByLabel(this.props.selectedTemplateName)
    .then((response)=>{
      console.log("response in openEditTemplateModal"+response.data)
        this.getIntegrationsList();
        selectedTemplate=response.data
        this.setTemplateData(selectedTemplate)
        this.setState({showConfimrationModal:false,
                      showAddModal:true})
    })
    .catch((getScanSchedulesByLabelError)=>console.log("error in fetching templete details "+getScanSchedulesByLabelError))

  }

   getIntegrationsList(){
    let isSlack=false
    let isPd =  false
    let pdId = 0
    let slackId = 0
      getAllIntegrations()
      .then(
        (integrations) =>  {
          this.setState({integrationsList:integrations.output,
            loadingDiv:false}, function()
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
                 this.setState({pdIntegrated:isPd,pagerDutyId:pdId,
                                slackIntegrated:isSlack,slackId:slackId})
               }
              else{
                //++++++++++++ Empty List ++++++++++++
                  this.setState({pdIntegrated:false,
                                 slackIntegrated:false
                  })
               }
            });//setState
      })
      .catch((error) => console.log("Error in getIntegrationsList in container:" + error))
    }


  handleCancel(){
    this.setState({showAddModal:false})
  }

  closeAddModal(){
    this.setState({showAddModal:false})
  }
  closeConfimrationModal(){
    this.setState({showConfimrationModal:false})
  }

setTemplateData(templateInfo){
    console.log('setTemplateData called '+templateInfo.weekModifier)
    let startDateISO = ''
    let startTime = templateInfo.starttime
    if(startTime){
      let str = startTime.replace(/ /g,'T')
      let startDate = new Date(str+'Z')
      let utcStartDate = new Date(Date.UTC(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()))
      let startDateISO = utcStartDate.toISOString()


      let hours = startDate.getHours();
      let minutes = startDate.getMinutes();
      let timePrime = 'am'
      if( hours >= 12) {
        hours = hours - 12
        timePrime = 'pm'
      }
      this.setState({
        valueStart:startDateISO,
        startTimeHour:hours,
        startTimeMin:minutes,
        startTimePrime:timePrime,
      });
    }
    let endDateISO = ''
    let endTime = templateInfo.endtime
    if(endTime!==null && endTime!==undefined){
      let str = endTime.replace(/ /g,'T')
      let endDate = new Date(str+'Z')
      let utcEndDate = new Date(Date.UTC(endDate.getFullYear(),endDate.getMonth(),endDate.getDate()))
      endDateISO = endDate.toISOString()
      this.setState({
        valueEnd:endDateISO
      });
    }

    let weekModifiers = []
    if(templateInfo.weekModifier !== ''){
      weekModifiers = templateInfo.weekModifier.match(/.{1,3}/g)
      this.setState({weekModifiers:weekModifiers})
    }
    this.setState({templateName:templateInfo.label})
    if(templateInfo.recurrence){
      this.setState({recurrence:templateInfo.recurrence})
    }
    if(templateInfo.endCount){
      this.setState({endCount:templateInfo.endCount})
    }
    if(templateInfo.dayModifier){
      this.setState({dayModifier:templateInfo.dayModifier})
    }
    if(templateInfo.notifyTestBegin){
      this.setState({notifyTestBegin:templateInfo.notifyTestBegin})
    }
    if(templateInfo.notifyTestEnd)
      {this.setState({notifyTestEnd:templateInfo.notifyTestEnd})}

    if(templateInfo.notifytestabort)
      {
        this.setState({notifyTestAborted:templateInfo.notifytestabort})
      }

    if(templateInfo.notifytestfail){
      this.setState({notifyTestFailed:templateInfo.notifytestfail})
    }
    /*
    if(templateInfo.notifyslack){
      this.setState({notifyBySlack:templateInfo.notifyslack})
    }

    if(templateInfo.notifypagerduty){
      this.setState({notifyByPagerduty:templateInfo.notifypagerduty})
    }
    */
    if(templateInfo.notify != null && templateInfo.notify.length>0){
      templateInfo.notify.map((notifyObj) => {
        if(notifyObj.type === "pagerduty"){
          this.setState({notifyByPagerduty:true})
        }else if(notifyObj.type === "slack"){
          this.setState({notifyBySlack:true})
        }
      })
    }

    if(templateInfo.emails.length>0){
      this.setState({emails:templateInfo.emails,
                    showEmailBox:true,
                    notifyByEmail:true})
    }
    if(templateInfo.emails && templateInfo.emails.length<1){
      this.setState({notifyByEmail:false,
                    showEmailBox:false})
    }
    if(templateInfo.reportingPref){
      this.setState({reportType:templateInfo.reportingPref})
    }

    this.setState({
      templateName:templateInfo.label
    });
    this.setState({customScheduleDesc:this.getCustomDescription(templateInfo)});
  }

   getCustomDescription(templateInfo){
    let desc = "";
    if(templateInfo.custom === 1){
      desc = "Every ";
      if(templateInfo.recurrence === 'day'){
        desc = "Every "
        desc = desc + templateInfo.dayModifier + " days"
      }else if(templateInfo.recurrence === 'week'){
        let weekModifiers = []
        if(templateInfo.weekModifier !== ''){
          weekModifiers = templateInfo.weekModifier.match(/.{1,3}/g)
          desc = "Weekly on "
          desc = desc + weekModifiers.join(", ")
        }
      }

      if(templateInfo.endCount > 0){
        desc = desc+ " until " + templateInfo.endCount + " occurences"
      }else if(templateInfo.endtime !== ""){
        if( templateInfo.endtime != '' && templateInfo.endtime!=null){
          let str = templateInfo.endtime.replace(/ /g,'T')
          let endDate = new Date(str);
          let  endDateStr = (endDate.getMonth() + 1) + "/" + endDate.getDate() + "/" + endDate.getFullYear();
          desc = desc+ " until " + endDateStr
        }
      }
    }
    return desc
  }


  handleTemplateInput(e){
    this.setState({templateName:e.target.value})
  }

  //################################//

  handleChangeFrom(value) {
    if(getFormatterDate()==getFormatterDate(value))
    {
      var hours = new Date().getHours()-12
      var tprime = "am"
      if(new Date().getHours()>=12){tprime="pm"}
      this.setState({startTimeHour:hours,startTimePrime:tprime,dateChange:true})

    }
    else
    {
      this.setState({startTimeHour:1,startTimePrime:"am",dateChange:true})
    }
    console.log("does this call when delete??", value)
    // value is an ISO String.
    var today = moment().startOf('day')
    var beforeToday = moment(value).isBefore(today)
    let from_schema = {from: Joi.string().required()}
    let result = Joi.validate({from: value}, from_schema)

    this.setState({
      beforeTodayFrom: beforeToday,
      displayStartError : beforeToday ? true : false
    })

    if (!value || result.error) {
      this.setState({
        valueStart: value
      }, ()=>{console.log("this.state.fromValidthis.state.fromValid =P", this.state.fromValid); this.checkDateValid(true)});
    } else {
      this.setState({
        valueStart: value,
        fromValid:true
      }, ()=>{console.log("this.state.fromValidthis.state.fromValid", this.state.fromValid); this.checkDateValid(true)});
    }
  }
  //////////////////////////////////////
  handleChangeTo(value) {
    var today = moment().startOf('day')
    var beforeToday = moment(value).isBefore(today)
    // value is an ISO String.
    let to_schema = {to: Joi.string().required()}
    let result = Joi.validate({to: value}, to_schema)

    this.setState({
      beforeTodayTo: beforeToday,
      displayEndError : beforeToday ? true : false
    })

    if (!value || result.error) {
      this.setState({
        valueEnd: value
      }, ()=>{this.checkDateValid(false)});
    } else {
      this.setState({
        valueEnd: value
      }, ()=>{this.checkDateValid(false)});
    }
  }

  checkDateValid(isStartInput){
      if(this.state.valueStart === null)
      { console.log('inside valueStartNull')
        this.setState({
          displayStartError : true,
          displayEndError : false
        });
        return;
      }
      if(this.state.valueEnd === null || this.state.valueEnd === ''){

        this.setState({
          dateValid:true,
          displayStartError : this.state.beforeTodayFrom ? true : false,
          displayEndError : false
          });
      }
      else if(this.state.valueStart <= this.state.valueEnd){
        console.log('inside valueStart <= valueEnd')
        this.setState({
          dateValid:true,
          showDateError:false,
          displayEndError:this.state.beforeTodayTo ? true: false,
          displayStartError : this.state.beforeTodayFrom ? true : false
        });
      } else {
        console.log('inside else')
        this.setState({
          showDateError:true,
          displayStartError:isStartInput?true:false,
          displayEndError:isStartInput?false:true
        });
      }
    }


  handleStartHour(e){
    if(getFormatterDate()==getFormatterDate(this.state.valueStart))
    {

      var hours = new Date().getHours()-12
      var tprime = "am"
      if(new Date().getHours()>=12){tprime="pm"}
      this.setState({startTimePrime:tprime})

    }
    else
    {
      this.setState({startTimePrime:"am"})
    }
    this.setState({startTimeHour:e.target.value,dateChange:false})
  }

  handleStartMin(e){
    if(getFormatterDate()==getFormatterDate(this.state.valueStart))
    {
      var hours = new Date().getHours()-12
      var tprime = "am"
      if(new Date().getHours()>=12){tprime="pm"}
      this.setState({startTimePrime:tprime})

    }
    else
    {
      this.setState({startTimePrime:"am"})
    }
    this.setState({startTimeMin:e.target.value,dateChange:false})
  }

  handleStartPrime(e){
    if(getFormatterDate()==getFormatterDate(this.state.valueStart))
    {
      var hours = new Date().getHours()-12
      var tprime = "am"
      if(new Date().getHours()>=12){tprime="pm"}
      this.setState({startTimePrime:tprime})

    }
    else
    {
      this.setState({startTimePrime:"am"})
    }
    this.setState({startTimePrime:e.target.value,dateChange:false})
  }

  handleRecurrence(e){
    this.setState({recurrence:e.target.value},function(){
      if(this.state.recurrence === "custom"){
        this.setState({showCustomSchedule:true})
      }else{
        this.setState({showCustomSchedule:false})
      }
    })
  }


  handleTestBeginCheck(e){
    if(e.target.checked === true)
      this.setState({notifyTestBegin:true})
    else
      this.setState({notifyTestBegin:false})
  }

  handleTestEndCheck(e){
    if(e.target.checked === true)
      this.setState({notifyTestEnd:true})
    else
      this.setState({notifyTestEnd:false})
  }

  handleTestFailedCheck(e){
    if(e.target.checked === true)
      this.setState({notifyTestFailed:true})
    else
      this.setState({notifyTestFailed:false})
  }

  handleTestAbortedCheck(e){
    if(e.target.checked === true)
      this.setState({notifyTestAborted:true})
    else
      this.setState({notifyTestAborted:false})
  }

  handleEmailCheck(e){
    if(e.target.checked === true){
      this.setState({showEmailBox:true,
                     notifyByEmail:true})
    }else
    this.setState({showEmailBox:false,
                  notifyByEmail:false})
  }

  handleSlackCheck(e){
    if(e.target.checked === true)
      this.setState({notifyBySlack:true})
    else
      this.setState({notifyBySlack:false})
  }

  handlePagerDytyCheck(e){
    if(e.target.checked)
      this.setState({notifyByPagerDuty:true})
    else
      this.setState({notifyByPagerDuty:false})
  }

  handleCustomNotifications(e){
    if(e.target.checked)
      this.setState({customNotifications:true})
    else
      this.setState({customNotifications:false})
  }

  handlePDFAttachmentCheck(e){
      this.setState({reportType:e.target.value})
  }

  handleReportType(changeEvent){
    this.setState({
      reportType: changeEvent.target.value,
      showEmailBox: true
    });
  }

  handleShareReport(changeEvent){
    if(changeEvent.target.checked){
      this.setState({
        showReportTypeRadio:true,
        showEmailBox:true
      })
    }else{
      this.setState({
        showReportTypeRadio:false,
        //reportType:''
        //showEmailBox:true
      })
    }
  }

  updateEmails(emailsList,currenttextboxValue){
    if(currenttextboxValue!=""){
      this.setState({currentEmailTxtValue:currenttextboxValue})
    }
    else{
       this.setState({currentEmailTxtValue:""})

    }
      this.setState({emails:emailsList}, function(){
        if(this.state.emails.length>0){
          this.setState({emailBorderColor:'1px solid #4C58A4'})
        }else{
          this.setState({emailBorderColor:'1px solid red'})
        }
      });
  }

  saveCustomScheduleInfo(customScheduleInfo){
    this.setState({
      customScheduleDesc:customScheduleInfo.description,
      recurrence:customScheduleInfo.recurrence,
      valueStart:customScheduleInfo.valueStart,
      valueEnd:customScheduleInfo.valueEnd,
      dayModifier:customScheduleInfo.dayModifier,
      weekModifiers:customScheduleInfo.weekModifiers,
      endCount:customScheduleInfo.endCount,
      custom:1
    })
  }
  closeCustomPopup(){
    this.setState({showCustomSchedule:false})
  }

  handleEdit(e){
    console.log(this.state.showCustomSchedule);
    if(this.state.showCustomSchedule===false){
      this.setState({showCustomSchedule:true})
    }
    console.log(this.state.showCustomSchedule);

  }

  render() {

    let startErrorMsg,endErrorMsg;
    if(this.state.displayStartError)
    {
      startErrorMsg = (this.state.beforeTodayFrom)? "Start date cannot be lesser than today" : "Start date should be earlier than end date";
      startErrorMsg = this.state.valueStart === null ? "Start date cannot be empty" : startErrorMsg;
      startErrorMsg = (<span style={{color:"red",}}>{startErrorMsg}</span>)
    }
    if(this.state.displayEndError)
    {
      endErrorMsg = this.state.beforeTodayTo ? "End date cannot be less than current date" :"End date should be later than Start date";
      endErrorMsg = (<span style={{color:"red",}}>{endErrorMsg}</span>)
    }

    let close = () => this.setState({ show: false});

    let checkboxStyle ={
      display:'inline-block',
      width:'25%',
      textAlign: 'center'
    }

    let noticiationsStyle = {
      width:'100%',
      padding:'0 50px 0 15px',
      marginLeft:'-50px',
      marginTop:'10px'
   }

    let style = {
        ...this.props.style,
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid Navy',
        borderRadius: 0,
        marginTop: 100,
        width:800,
    }


    let editConfirmMessage;

      if(this.props.groupsAssigned===true){
        editConfirmMessage="You are about to edit '"+this.props.selectedTemplateName+"'. This will affect one or more Asset Groups. Do you want to continue?"
      }/*else{
      editConfirmMessage="Are you sure you want to delete template '"+this.props.selectedTemplateName+"' ?"}*/
      let disableSave=true;
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
      console.log('this.state.templateName!="" && this.state.templateName.length<=32 && this.state.doneButton==="Add" && this.state.valueStart!=null && emailReq', this.state.templateName!="", this.state.templateName.length<=32, this.state.doneButton==="Add", this.state.valueStart!=null, emailReq)
      disableSave=this.state.templateName!="" && this.state.templateName.length<=32 && this.state.valueStart!=null && emailReq?false:true

  return (

    <span className={modalContainer}>

      <a href='JavaScript: void(0)' onClick={this.openModal.bind(this)}>
        Edit
      </a>
      <Modal
          show={this.state.showConfimrationModal}
          onHide={this.closeConfimrationModal.bind(this)}
          aria-labelledby="contained-modal-title"
          dialogClassName={deleteDialogClass}
          keyboard={false}
          backdrop='static'>
          <form style={{border: '1px solid Navy'}}>
            <a className={modalCloseStyle} onClick={this.closeConfimrationModal.bind(this)}>
              x
            </a>
            <div style={{marginTop:'5px',paddingLeft:'15px'}}>
              <Modal.Header  style={{marginRight:5,borderBottom:0}}>
                <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                  {'EDIT TEMPLATE CONFIRMATION'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{paddingBottom:'0px',paddingTop:'0px',marginBottom:'-5px'}}>
                  <p>{editConfirmMessage}</p>
              </Modal.Body>
              <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
                <Button className={blueBtn} onClick={this.closeConfimrationModal.bind(this)}>
                  No
                </Button>&nbsp;&nbsp;&nbsp;
                <Button bsStyle='primary' className={btnPrimary} style={{borderRadius: 0}}
                   onClick={this.openEditTemplateModal.bind(this)}>
                 Yes
                </Button>
              </Modal.Footer>
            </div>
          </form>
        </Modal>
      <Modal
          show={this.state.showAddModal}
          onHide={this.closeAddModal.bind(this)}
          aria-labelledby="contained-modal-title"
          dialogClassName={scheduleDialogClass}
          keyboard={false}
          backdrop='static'>
           <form style={{border: '1px solid Navy'}}>
            <a className={modalCloseStyle} onClick={this.closeAddModal.bind(this)}>
              x
            </a>
            <div style={{marginTop:'25px'}}>
              <Modal.Header  style={{marginLeft:15,marginRight:25,borderBottom:0}}>
                <Modal.Title id="contained-modal-title"
                  style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'SCHEDULE AND NOTIFICATION TEMPLATE'}
                </Modal.Title>
              </Modal.Header>

              <Modal.Body style={{padding:'0px'}}>

              {/*Template name Section*/}
              <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#f9fafc',paddingLeft:'110px'}}>
                {/*<div className="col-lg-3 col-xs-3 col-md-3 col-sm-3"></div> */}
                <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12">
                  <br />
                  <div style={{display:'flex', justifyContent:'space-between',height:34}}>
                    <div style={{width:'70%'}}>
                      <FormGroup  controlId="templateNameInput">
                        <FormControl type="text"
                          name="templateNameInput"
                          disabled="true"
                          value={this.state.templateName}
                          placeholder="Enter template name"
                          onChange={this.handleTemplateInput.bind(this)}
                          style={{ width: 240, height: 34, backgroundColor:'#eee', borderRadius: 0,border:this.state.bordercolg}}
                          onBlur={this.handleTemplateInput.bind(this)}  />
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>

               {/*Scheduling Section*/}
              <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#f9fafc',paddingLeft:'110px'}}>
                {/*<div className="col-lg-3 col-xs-3 col-md-3 col-sm-3"></div> */}
                <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12">

                <ControlLabel style={{fontSize:'16px',fontWeight:600, color:'#474856', marginTop:40}}>SCHEDULING</ControlLabel>
                <div style={{display:'flex', justifyContent:'space-between', marginTop:15}}>
                <div style={{width:'55%'}}>
                  <FormGroup controlId="valueStart" className="datePick">
                    <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Assessment starts</ControlLabel>
                    {' '}
                    <DatePicker
                      dateFormat="MM/DD/YYYY"
                      disabled={this.state.showCustomSchedule?true:false}
                      value={this.state.valueStart}
                      onChange={this.handleChangeFrom.bind(this)}/>
                  </FormGroup>
                  {this.state.displayStartError?startErrorMsg:''}
                </div>
                <div style={{width:'45%'}}>
                  <ControlLabel style={{fontSize:'15px',fontWeight:500}}>at</ControlLabel>
                  <div className="assementTime" style={{display:'flex', justifyContent:'flex-start', padding:'4px 28px 0 0'}}>
                    <div>
                       <select className={selectStyleTime} id="atHour" value={this.state.startTimeHour}  onChange={this.handleStartHour.bind(this)}
                        placeholder= "select hour" style={css.timeSelectStyle} >
                        {
                        this.state.atHour.map((item) =>
                        {
                           if(this.state.startTimeHour>=item.value && this.state.dateChange)
                          {
                            return <option key={item.value} name={item.value} disabled value={item.value}>{item.label}</option>
                          }
                          else
                          {
                            return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
                          }

                        }
                        )}
                      </select>
                    </div>
                    <div>
                      <select  className={selectStyleTime} id="atMinute" value={this.state.startTimeMin} onChange={this.handleStartMin.bind(this)} style={css.timeSelectStyle} >
                        {
                        this.state.atMinute.map((item) =>
                          {
                              if(this.state.startTimeMin>=item.value && this.state.dateChange)
                            {
                               return <option key={item.value} name={item.value} disabled value={item.value}>{item.label}</option>
                            }
                            else
                            {
                                return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
                            }
                          }
                          )}
                      </select>
                    </div>
                    <div>
                      <select className={selectStyleTime} id="atTimePrime" value={this.state.startTimePrime}  onChange={this.handleStartPrime.bind(this)} style={css.timeSelectStyle} >
                        {
                        this.state.atTimePrime.map((item) =>
                          {
                             if(this.state.startTimePrime=="pm" && this.state.dateChange)
                            {
                              if(item.value=='am')
                              {
                                return <option key={item.value} name={item.value} disabled value={item.value}>{item.label}</option>
                              }
                              else
                              {
                                return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
                              }

                            }
                            else
                            {
                              if(this.state.startTimePrime=="am"){
                                return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
                              }
                              else
                              {
                                if(this.state.startTimePrime==item.value){
                                  return <option key={item.value} name={item.value}  value={item.value}>{item.label}</option>
                                }
                                else
                                {
                                  return <option key={item.value} name={item.value} disabled value={item.value}>{item.label}</option>
                                }

                              }

                            }
                          }
                          )}
                      </select>
                    </div>
                  </div>
                </div>
                </div>

                <br/>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                <div style={{width:'55%'}}>
                <ControlLabel style={{fontSize:'15px',fontWeight:500, paddingBottom:4}}>Assessment recurrence</ControlLabel>
                <select className={selectStyle} id="recurrence" value={this.state.recurrence} onChange={this.handleRecurrence.bind(this)}
                 style={{display:'block',width:155,height:36, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                  {
                  this.state.assesmentRecurrence.map((item) =>
                    {
                      return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
                    }
                    )}
                </select>
                </div>
                <div style={{width:'45%'}}>
                    {(this.state.customScheduleDesc === '')?
                    <div>
                      <FormGroup controlId="valueEnd" className="datePick">
                        <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Assessment Ends</ControlLabel>
                        {' '}
                        <DatePicker
                          dateFormat="MM/DD/YYYY"
                          value={this.state.valueEnd}
                          disabled={this.state.showCustomSchedule?true:false}
                          onChange={this.handleChangeTo.bind(this)}/>
                      </FormGroup>
                       {this.state.displayEndError?endErrorMsg:''}</div>
                      :
                      <div>
                        <div style={{marginTop:30, margintop: 34,width: '70%',float: 'left'}}>{this.state.customScheduleDesc}</div>
                        {
                          (this.state.enableInput && this.state.recurrence!=='now')?
                          <div style={{width:'30%', float:'left',marginTop:27}}><Button onClick={this.handleEdit.bind(this)} className={footerBtn}>Edit</Button></div>
                          :''
                        }
                      </div>
                    }
                </div>
              </div>

              <CustomScheduleComponent
                showCustomSchedule={this.state.showCustomSchedule}
                saveCustomScheduleInfo={this.saveCustomScheduleInfo.bind(this)}
                closeCustomPopup={this.closeCustomPopup.bind(this)}
                valueStart={this.state.valueStart}
                valueEnd={this.state.valueEnd}
                recurrence={this.state.recurrence}
                endCount={this.state.endCount}
                dayModifier={this.state.dayModifier}
                weekModifiers={this.state.weekModifiers}
              />

              </div>
              </div>


              {/*Notification Section*/}



              {/*Notification Section*/}
              <div className="row " style={{margin:'0px',width:'100%',
                  backgroundColor:'#edf2f8',paddingLeft:'110px'}}>
                {/*<div className="col-lg-3 col-xs-3 col-md-3 col-sm-3"></div> */}
                <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12">
                <br />

                <ControlLabel style={{fontSize:'16px',
                                fontWeight:600, color:'#474856',
                                marginBottom:'15px'}}>
                  NOTIFICATION
                </ControlLabel>

                <div>
                  Send notification when test
                  <div id="notifyWhen" style={noticiationsStyle}>

                    <div id="testBegins" style={checkboxStyle} >
                      <label htmlFor="notifyTestBegin" style={{fontWeight:'500'}}>
                      Begins<br/>
                      <input type="checkbox" checked={this.state.notifyTestBegin} id="notifyTestBegin"
                        name="notifyTestBegin" onChange={this.handleTestBeginCheck.bind(this)}/>
                      <label htmlFor="notifyTestBegin" style={{fontWeight:'500', marginLeft:10}}></label><br/><br/></label>
                    </div>

                    <div id="testEnds" style={checkboxStyle} >
                      <label htmlFor="notifyTestEnd" style={{fontWeight:'500'}}>
                      Ends<br/>
                      <input type="checkbox" checked={this.state.notifyTestEnd} id="notifyTestEnd"  name="notifyTestEnd" onChange={this.handleTestEndCheck.bind(this)}/>
                      <label htmlFor="notifyTestEnd" style={{fontWeight:'500', marginLeft:10}}></label><br/><br/></label>
                    </div>

                    <div id="testFailed" style={checkboxStyle} >
                      <label htmlFor="notifyTestFailed" style={{fontWeight:'500'}}>
                      Failed<br/>
                      <input type="checkbox" checked={this.state.notifyTestFailed} id="notifyTestFailed"  name="notifyTestFailed" onChange={this.handleTestFailedCheck.bind(this)}/>
                      <label htmlFor="notifyTestFailed" style={{fontWeight:'500', marginLeft:10}}></label><br/><br/></label>
                    </div>

                    <div id="testAborted" style={checkboxStyle} >
                      <label htmlFor="notifyTestAborted" style={{fontWeight:'500'}}>
                      Aborted<br/>
                      <input type="checkbox" checked={this.state.notifyTestAborted} id="notifyTestAborted"  name="notifyTestAborted" onChange={this.handleTestAbortedCheck.bind(this)}/>
                      <label htmlFor="notifyTestAborted" style={{fontWeight:'500', marginLeft:10}}></label><br/><br/></label>
                    </div>

                  </div>

                </div>
                <div>
                 and notify by
                  <div id="notifyBy" style={noticiationsStyle}>

                    <div style={checkboxStyle} id="byEmail">
                      <label htmlFor="notifyByEmail" style={{fontWeight:'500'}}>
                        Email<br/>
                        <input type="checkbox" checked={this.state.notifyByEmail} id="notifyByEmail"
                          name="notifyByEmail" onChange={this.handleEmailCheck.bind(this)}/>
                        <label htmlFor="notifyByEmail" style={{fontWeight:'500', marginLeft:10}}></label>
                        <br/><br/>
                      </label>
                    </div>

                    <div style={checkboxStyle} id="bySlack">
                      <ReactTooltip  id='SlackToolTip' place="top" type="info" effect="float"
                        getContent={() => { return this.state.slackIntegrated ? null: <span>Enable Slack at RSE</span> }} />
                      <p data-tip data-for="SlackToolTip">
                        <label htmlFor="notifyBySlack" style={{fontWeight:'500'}}>
                          Slack<br/>
                          <input type="checkbox" checked={this.state.notifyBySlack}
                            id="notifyBySlack" disabled={this.state.slackIntegrated?false:true}
                            name="notifyBySlack" onChange={this.handleSlackCheck.bind(this)}/>
                          <label htmlFor="notifyBySlack" style={{fontWeight:'500', marginLeft:10}}></label>
                          <br/><br/>
                        </label>
                      </p>
                    </div>

                    <div style={checkboxStyle} id="byPagerDuty">
                      <ReactTooltip  id='PagerDutyToolTip' place="top" type="info" effect="float"
                        getContent={() => { return this.state.pdIntegrated ? null: <span>Enable PagerDuty at RSE</span> }} />
                      <p data-tip data-for="PagerDutyToolTip">
                        <label htmlFor="notifyByPagerDuty" style={{fontWeight:'500'}}>
                          PagerDuty<br/>
                          <input type="checkbox" checked={this.state.notifyByPagerduty}
                          id="notifyByPagerDuty" disabled={this.state.pdIntegrated?false:true}
                            name="notifyByPagerDuty" onChange={this.handlePagerDytyCheck.bind(this)}/>
                          <label htmlFor="notifyByPagerDuty" style={{fontWeight:'500', marginLeft:10}}></label>
                          <br/><br/>
                        </label>
                      </p>
                    </div>

                    {/*<div style={checkboxStyle} id="customNotifications">
                      <label htmlFor="customNotify" style={{fontWeight:'500'}}>
                        Custom<br/>
                        <input type="checkbox" checked={this.state.customNotifications} id="customNotify"
                          name="customNotify" onChange={this.handleCustomNotifications.bind(this)}/>
                        <label htmlFor="customNotify" style={{fontWeight:'500', marginLeft:10}}></label>
                        <br/><br/>
                      </label>
                    </div>*/}
                  </div>
                </div>

             {this.state.showEmailBox ?
                <div>
                  <div>
                   Attach reports
                    <div id="attachReports" style={{width:'100%',
                                          padding:'0 50px 0 15px',
                                          marginLeft:'-10px'}}>

                      <div style={checkboxStyle} id="byPDF">
                        <label htmlFor="attachPDF" style={{fontWeight:'500'}}>
                          <input type="radio" checked={this.state.reportType === 'Pdf'?true:false} id="attachPDF"
                            name="attachPDF" value="Pdf" onChange={this.handlePDFAttachmentCheck.bind(this)}/>
                            &nbsp;&nbsp;PDF&nbsp;&nbsp;
                          <label htmlFor="attachPDF" style={{fontWeight:'500', marginLeft:10}}></label>
                          <br/><br/>
                        </label>
                      </div>

                      <div style={checkboxStyle} id="byEXCEL">
                        <label htmlFor="attachExcel" style={{fontWeight:'500'}}>
                          <input type="radio" checked={this.state.reportType === 'Excel'?true:false} id="attachExcel"
                            name="attachExcel" value="Excel" onChange={this.handlePDFAttachmentCheck.bind(this)}/>
                          &nbsp;&nbsp;Excel&nbsp;&nbsp;
                          <label htmlFor="attachExcel" style={{fontWeight:'500', marginLeft:10}}></label>
                          <br/><br/>
                        </label>
                      </div>
                    </div>
                  </div>
                  <Emailboxtext emails={this.state.emails}
                    updateEmails={this.updateEmails.bind(this)}
                    emailBorderColor={this.state.emailBorderColor}
                    emailCheckboxChecked={this.state.notifyByEmail}/>
               </div>
               :
               <div></div>
              }
                </div>
              </div>
              </Modal.Body>
              <Modal.Footer style={{marginRight:50, paddingRight:0, marginBottom:15,borderTop:0}}>
                <Button className={blueBtn} onClick={this.closeAddModal.bind(this)}>Cancel</Button>
                &nbsp;&nbsp;&nbsp;
                <Button bsStyle='primary' disabled={disableSave} className={btnPrimary} style={{borderRadius: 0}}
                  onClick={this.saveScheduling.bind(this)}>
                  {this.state.doneButton}
                </Button>

              </Modal.Footer>
            </div>
          </form>
        </Modal>
      </span>
    );
  }
}

export default EditSchedule
