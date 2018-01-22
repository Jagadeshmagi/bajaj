import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Joi from 'joi-browser'
import {Popover, FormControl, FormGroup,ControlLabel, OverlayTrigger, Checkbox, Radio, Glyphicon,Button,Modal,MenuItem,Dropdown} from 'react-bootstrap'
import {divContainer,customHrBefore,toDoCircle,inProgressOuterCircle,inProgressInnerCircle,completedInnerCheckMark,completedOuterCircle} from './styles.css'
import { navbar,footerBtn,modal,selectStyle,selectStyleTime,modalDialogClass,blueBtn, spacer} from 'sharedStyles/styles.css'
import {italic1,shcover,myDIV,cover,modalCloseStyle, assementTime,menuList} from './styles.css'
import AlertComponent from 'components/Common/AlertComponent'
import ErrorMessages from 'constants/ErrorMessages'
import DatePicker from 'react-bootstrap-date-picker'
import {WizHeader} from './WizardHeader'
import {Emailboxtext} from './Emailbox'
import CustomScheduleComponent from './CustomScheduleComponent';
import {getAllIntegrations} from 'helpers/integration'
import {getScanSchedules,putScanSchedule} from 'helpers/schedules'
import {updateAssetGroupScheduleInfo,addScheduleTemplateToGroup,addNotificationToGroup} from 'helpers/assetGroups'
import {addScheduleTemplateToDocker,addNotificationToDocker} from 'helpers/docker'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'
import Select from 'react-select'
import { connect } from 'react-redux'

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

function  ScheduleTestsHeader(){
 let DiscoverLabelStyle={color:"white"}
  return (
  <div className={divContainer}>
    <br/>
    <table className="col-lg-12 col-sm-12 col-md-12 col-xs-12" style={{width: '100%',fontSize: 15,marginLeft:-15}} >
      <tbody>
       <tr>
        <td style={{textAlign: 'right',width:'25%'}}>
         <span className={completedOuterCircle}>
          <h1  className={completedInnerCheckMark}></h1>
         </span>
        </td>
        <td style={{textAlign: 'left',width:'26%'}}>
         <hr className={customHrBefore}></hr>
        </td>

        <td style={{textAlign: 'left',width:'18%'}}>
         <span className={completedOuterCircle}>
          <h1  className={completedInnerCheckMark}></h1>
         </span>
         <hr className={customHrBefore}></hr>
        </td>
        <td style={{textAlign: 'left'}}>
         <hr className={customHrBefore}></hr>
        </td>
        <td style={{textAlign: 'left',width:'25%'}}>
          <span  className={inProgressOuterCircle}>
           <span  className={inProgressInnerCircle}>
           </span>
          </span>
        </td>
       </tr>
       <tr>
        <td style={{textAlign: 'right',color:'white'}}>
            <ul style={{listStyleType:'none',color:'white'}}>
                <li >DISCOVER</li>
                <li style={{marginRight:'-7px'}}> RESOURCES</li>
            </ul>
        </td>
        <td >
        </td>
        <td style={{textAlign: 'left'}}>
            <ul style={{listStyleType:'none',color:'white'}}>
                <li style={{marginLeft:'-95px'}}>SELECT POLICY</li>
                <li style={{marginLeft:'-79px'}}> PACKS</li>
            </ul>
        </td>
        <td >
        </td>
        <td style={{textAlign: 'left'}}>
            <ul style={{listStyleType:'none',color:'white'}}>
                <li style={{marginLeft:'-55px'}}>SCHEDULE</li>
                <li style={{marginLeft:'-65px'}}> ASSESSMENTS</li>
            </ul>
        </td>
       </tr>
      </tbody>
    </table>
  </div>
    )
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
class ScheduleInfo extends React.Component {
  constructor(props) {
    super(props);
    var value = new Date().toISOString();
    this.state = {
      TimeErr:'',
      samedate:true,
      currentHour:1,
      dateChange:true,
      startAssessmentButtonText:'Done',
      saveButtonText:'Save',
      saving:false,
      showModal: false,
      showEmailBox:false,
      scheduleOption:'now',

      showCustomSchedule:false,
      templateSelected:false,
      templateName:'',
      enableInput:true,
      showEdit:false,

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
      customNotifications:false,
      integrationsList:[],
      pdIntegrated:false,
      slackIntegrated:false,
      pagerDutyId:0,
      slackID:0,

      reportType:"Pdf",
      attachPDF:false,
      attachExcel:false,

      emails:[],
      currentEmailTxtValue:"",
      generateReportName:'auto',
      reportName:'',

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
        { value: 12, label: "12" }],
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
      templatesList:[],

      beforeTodayFrom: false,
      showDateError: false,
      displayStartError:false,
      displayEndError:false,

      validations:{

        reportName:{
          valid:true,
          validationState:'',
          error:'Provide a name for the report.',
          border:'1px solid #4C58A4',
          height:60,
          showTooltip:'',
          schema:{"Report Name":Joi.string().max(32).required()}

        }

      },
      errorForTemplate:"Provide a name for the template."
    };
  }

  componentWillMount(){
    getScanSchedules()
    .then((responseData) => {
      this.setState({templatesList:responseData.scanschedules})
    })
    .catch((error) => console.log("error in getting the templates list"))
  }

  componentDidMount(){

      let assetGroupId = parseInt(this.props.routeParams.assetgroupId);
      this.setState({assetGroupId: assetGroupId});
      this.setCurrentTimeInStart()
      ReactTooltip.rebuild()
      this.getIntegrationsList()
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

  setCurrentTimeInStart(){
    var now = new Date();
    let utcDate = new Date(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()))
    var currentDate = utcDate.toISOString();
    var hours = now.getHours();
    var minutes = now.getMinutes();

    var quarterHours = Math.ceil(minutes/15);
    if (quarterHours == 4)
    {
        hours = hours + 1;
    }
    minutes = (quarterHours*15)%60;

    let timePrime = 'am'

    if( hours > 12) {
      hours = hours - 12
      timePrime = 'pm'
    }
     if(hours==12)
    {
      timePrime = 'pm'
    }
    if(hours==0)
    {
      hours = 12;
      timePrime = 'am'
    }

    this.setState({
      valueStart:currentDate,
      currentHour:hours,
      startTimeHour:hours,
      startTimeMin:minutes,
      startTimePrime:timePrime
    })

  }

  handleChangeStart(value, formattedValue){
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
    this.setState({
          valueStart: value
      },function(){
        if(this.state.valueStart===null){
          this.refs.toolstart.show()
        }
        else{
          this.refs.toolstart.hide()
        }
      });
  }

  handleChangeEnd(value, formattedValue){
    this.setState({
          valueEnd: value
      });
  }


  //################################//

  handleChangeFrom(value) {
    if(getFormatterDate()==getFormatterDate(value))
    {
      if(new Date().getHours()>=12){
      var hours = new Date().getHours()-12
      }
      else
      {
        var hours = new Date().getHours();
      }
      var tprime = "am"
      if(new Date().getHours()>=12){tprime="pm"}
      this.setState({startTimeHour:hours,startTimePrime:tprime,dateChange:true,TimeErr:''})

    }
    else
    {
      this.setState({startTimeHour:1,startTimePrime:"am",dateChange:true,TimeErr:''})
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
      }, ()=>{this.checkDateValid(true)});
    } else {
      this.setState({
        valueStart: value,
        fromValid:true
      }, ()=>{this.checkDateValid(true)});
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
      {
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
        this.setState({
          dateValid:true,
          showDateError:false,
          displayEndError:this.state.beforeTodayTo ? true: false,
          displayStartError : this.state.beforeTodayFrom ? true : false
        });
      } else {
        this.setState({
          showDateError:true,
          displayStartError:isStartInput?true:false,
          displayEndError:isStartInput?false:true
        });
      }
    }

  //###############################################//


  handleStartHour(e){
    if(getFormatterDate()==getFormatterDate(this.state.valueStart))
    {

      if(new Date().getHours()>=12)
      {
      var hours = new Date().getHours()-12
      }
      else
      {
      var hours = new Date().getHours();
      }
      if(this.state.startTimePrime=='pm')
      {
        var tprime = "pm"
        if(new Date().getHours()>=12)
        {
          var hours = new Date().getHours()-12
        }
        else
        {
        var hours = new Date().getHours();
        }
      }
      else
      {
      var tprime = "am"
      if(new Date().getHours()>=12){tprime="pm"}
    }

      this.setState({startTimePrime:tprime})
      this.setState({samedate:true})

    }
    else
    {
      this.setState({samedate:false})
    }
    this.setState({startTimeHour:e.target.value,dateChange:false,currentHour:hours,TimeErr:''})
  }

  handleStartMin(e){
    if(getFormatterDate()==getFormatterDate(this.state.valueStart))
    {
      var hours = new Date().getHours()-12
      var tprime = "am"
      if(new Date().getHours()>=12){tprime="pm"}
      this.setState({startTimePrime:tprime})
    this.setState({samedate:true})

    }
    else
    {
      this.setState({samedate:false})
      this.setState({startTimePrime:"am"})
    }
    this.setState({startTimeMin:e.target.value,dateChange:false,TimeErr:''})
  }

  handleStartPrime(e){
    if(getFormatterDate()==getFormatterDate(this.state.valueStart))
    {
      var hours = new Date().getHours()-12
      var tprime = "am"
      if(new Date().getHours()>=12){tprime="pm"}
      this.setState({startTimePrime:tprime})
      if(e.target.value=='pm')
      {
        if(this.state.startTimeHour>=12)
        {
          var hours = new Date().getHours()-12
        }
        else
        {
          var hours = new Date().getHours();
        }
      }
      this.setState({samedate:true})

    }
    else
    {
      this.setState({samedate:false})
      this.setState({startTimePrime:"am"})
    }
    this.setState({startTimePrime:e.target.value,dateChange:false,currentHour:hours,TimeErr:''})
  }


  handleScheduleOption(e){
    this.setState({scheduleOption:e},function(){
      if(this.state.scheduleOption === "now"){
        this.setState({customScheduleDesc:'',
                      templateName:'',
                      showEdit:false,
                      notifyTestBegin:false,
                      notifyTestEnd:false,
                      notifyTestFailed:false,
                      notifyTestAborted:false,
                      notifyByPagerDuty:false,
                      notifyBySlack:false,
                      notifyByEmail:false,
                      emails:[],})
        this.refs.tooltemplate.hide()
      }
    })
  }

  handleRecurrence(e){
    this.setState({recurrence:e},function(){
      if(this.state.recurrence === "custom"){
        this.setState({showCustomSchedule:true})
      }else{
        this.setState({showCustomSchedule:false})
      }
    })
  }

  handleEdit(e){
    if(this.state.showCustomSchedule===false){
      this.setState({showCustomSchedule:true})
    }
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


  handlePDFAttachmentCheck(e){
      this.setState({reportType:e.target.value})
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

  handleReportNameOption(changeEvent) {
    this.setState({
      generateReportName: changeEvent.target.value
    },function(){
      if(this.state.generateReportName==='auto'){
        reportid.value=""
        let validationObj = Object.assign({},this.state.validations["reportName"])
        validationObj.valid=true
        validationObj.error='Provide a name for the report.'
        validationObj.showTooltip=false
        validationObj.border='1px solid #4C58A4'
        validationObj.validationState=''
        this.setState({validations:{...this.state.validations,reportName:validationObj}},()=>this.refs.toolreport.hide())
      }
      else{
        if(this.state.validations.reportName.validationState==='success'){
          let validationObj = Object.assign({},this.state.validations["reportName"])
          validationObj.valid=true
          validationObj.error=''
          validationObj.showTooltip= "false"
          this.setState({validations:{...this.state.validations,reportName:validationObj}},()=>this.refs.toolreport.hide())

        }
        else{
          let validationObj = Object.assign({},this.state.validations["reportName"])
          validationObj.valid=false
          validationObj.error='Provide a name for the report.'
          validationObj.showTooltip= "hover",
          validationObj.height = 60
          this.setState({validations:{...this.state.validations,reportName:validationObj}},()=>this.refs.toolreport.show())


        }
      }
    });

  }

  enableSelectedTemplateEdit(){
    if(getFormatterDate()>=getFormatterDate(this.state.valueStart))
    {
      this.setCurrentTimeInStart();
    }
    this.setState({templateSelected:false,enableInput:true,templateName:''});

  }

  handleAddNewButton(){
    this.setState({templateSelected:false,
      showEdit:false,
      enableInput:true})
    this.clearInputFieldsForAdd();
    this.refs.tooltemplate.show()
  }

  clearInputFieldsForAdd(){
    this.setState({
      templateName:'',
      valueEnd:'',
      recurrence:'day',
      endCount:'',
      dayModifier:1,
      weekModifiers: [],
      customScheduleDesc:'',
      notifyTestBegin:false,
      notifyTestEnd:false,
      notifyTestFailed:false,
      notifyTestAborted:false,
      notifyByPagerDuty:false,
      notifyBySlack:false,
      notifyByEmail:false,
      emails:[],
      reportType:'Pdf'
    });
    // set current time to start time
    this.setCurrentTimeInStart()
  }

  handleReportNameInput(e){
    this.setState({reportName:e.target.value})
     let result = Joi.validate({"Report Name":reportid.value}, this.state.validations.reportName.schema);
    if (result.error) {
    let validationObj = this.state.validations;
    let errorMessage = result.error.details[0].message
    if(result.error.details[0].message.indexOf("empty")!=-1){
      validationObj.reportName.height = 60
      errorMessage = "Report name must not be empty."
    }
    else
      {
       validationObj.reportName.height = 60
       errorMessage = "Report name must not exceed 32 characters."
      }

    let reportNameValidation = this.getValidationStateObj("reportName",false,errorMessage)
    this.setState({validations:{validationObj,reportName:reportNameValidation}},()=>this.refs.toolreport.show())
    }else{
    let reportNameValidation = this.getValidationStateObj("reportName",true,"")
    this.setState({validations:{...this.state.validations,reportName:reportNameValidation}},()=>this.refs.toolreport.hide())
    }

  }

  setTemplateData(templateInfo){

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
      if(hours==0)
      {
        hours = 12
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
    }

    let pdNotify = false;
    let slackNotify = false;
    if(templateInfo.notify != null && templateInfo.notify.length>0){
      templateInfo.notify.map((notifyObj) => {
        if(notifyObj.type === "pagerduty"){
          pdNotify = true
        }else if(notifyObj.type === "slack"){
          slackNotify = true
        }
      })
    }
    this.setState({
      showEdit:true,
      templateName:templateInfo.label,
      recurrence:templateInfo.recurrence,
      endCount:templateInfo.endCount,
      dayModifier:templateInfo.dayModifier,
      weekModifiers:weekModifiers,
      notifyTestBegin:templateInfo.notifyTestBegin,
      notifyTestEnd:templateInfo.notifyTestEnd,
      notifyTestAborted:templateInfo.notifytestabort,
      notifyTestFailed:templateInfo.notifytestfail,
      notifyByPagerDuty:pdNotify,
      notifyBySlack:slackNotify,

      reportType:templateInfo.reportingPref,
      emails:templateInfo.emails,
    },function(){
      if(templateInfo.emails.length>0){
        this.setState({notifyByEmail:true,
                      showEmailBox:true})
      }
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
        if( templateInfo.endtime != ''&& templateInfo.endTime!=null){
          let str = templateInfo.endTime.replace(/ /g,'T')
          let endDate = new Date(str);
          let  endDateStr = (endDate.getMonth() + 1) + "/" + endDate.getDate() + "/" + endDate.getFullYear();
          desc = desc+ " until " + endDateStr
        }
      }
    }
    return desc
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

  focusNext() {
    const input = ReactDOM.findDOMNode(this.refs.d);

    if (input) {
      input.focus();
    }
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


  onChange(e){
     this.setState({errorForTemplate:"Provide a name for template"})
    this.setState({templateName: e.target.value },function(){
      if(this.state.templateName!=="" || this.state.scheduleOption === "now"){
        this.refs.tooltemplate.hide()
      }else{
        this.refs.tooltemplate.show()
      }
    })
  }

  selectKey(e){

    this.setState({errorForTemplate:"Provide a name for template"})
    ReactDOM.findDOMNode(this.refs.test).querySelector('input').click();
    if(e.target.id === ''){
      this.handleAddNewButton()
       this.refs.tooltemplate.show()
    }else{
      this.setState({templateSelected:true, enableInput:false, scheduleOption:'later'})
      let selectedTemplate = findElement(this.state.templatesList,"label",e.target.id)
      if(selectedTemplate != null)
        this.setTemplateData(selectedTemplate)
       this.refs.tooltemplate.hide()
    }
  }

  saveAssetGroupScheduling(saveCompleteCallback){
    let typedocker = this.props.location.query.type


      let scheduleObj = {};

      let selectedStartTime = new Date(this.state.valueStart);
      let startTime = new Date(selectedStartTime.getUTCFullYear(),selectedStartTime.getUTCMonth(),selectedStartTime.getUTCDate())


      let hours = this.state.startTimeHour
      let minutes = this.state.startTimeMin
      if(hours == 12){
        hours = 0
      }
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

      scheduleObj["scannedBy"] = this.props.loginName
      scheduleObj["templateName"] = this.state.templateName
      scheduleObj["startTime"]= startTime
      scheduleObj["endTime"]= endTime
      scheduleObj["recurrence"] = this.state.recurrence
      scheduleObj["dayModifier"] = this.state.dayModifier
      scheduleObj["weekModifier"] = this.state.weekModifiers.join("")
      scheduleObj["endCount"] = this.state.endCount
      scheduleObj["notifyTestBegin"] = this.state.notifyTestBegin
      scheduleObj["notifyTestEnd"] = this.state.notifyTestEnd
      scheduleObj["emails"] = this.state.emails
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
      scheduleObj["reportingPref"] = this.state.reportType
      scheduleObj["custom"] = this.state.custom

      console.log(JSON.stringify(scheduleObj));

      let beforeConversionId=this.props.routeParams.assetgroupId;
      let newAssetGroupId=parseInt(beforeConversionId);

      if(!this.state.templateSelected) {
        putScanSchedule(scheduleObj)
        .then((response) => {
          if(!typedocker){
            addScheduleTemplateToGroup(newAssetGroupId,this.state.templateName,this.state.reportName, this.props.loginName)
            .then((saveGroupResponse) => {
              saveCompleteCallback(null)
            })
            .catch((error) => {
              console.log("error in adding schedule template to group:"+JSON.stringify(error))
            })
          }else{
              addScheduleTemplateToDocker(newAssetGroupId,this.state.templateName,this.state.reportName, this.props.loginName)
              .then((saveresponse) => {
                saveCompleteCallback(null)
              })
              .catch((errorres) => {
                console.log("error in adding schedule template to group:"+JSON.stringify(error))
              })
            }
        })
        .catch((error) => {

          if(error.data.status===409 &&error.data.message=="ScanSchedule exists with label"){
            window.scrollTo(0, 0);
            this.setState({errorForTemplate:"Template name already exists"},function(){
               this.refs.tooltemplate.show()
            })

          }
          console.log("error in save schedule:"+JSON.stringify(error))
          this.setState({saving:false,startAssessmentButtonText:"Done"});
        })
      }else{
        if(!typedocker){
          addScheduleTemplateToGroup(newAssetGroupId,this.state.templateName,this.props.reportName, this.props.loginName)
          .then((saveGroupResponse) => {
            saveCompleteCallback(null)
          })
          .catch((error) => {
            console.log("error in adding schedule template to group:"+JSON.stringify(error))
          })
        }else{
          addScheduleTemplateToDocker(newAssetGroupId,this.state.templateName,this.state.reportName, this.props.loginName)
              .then((saveresponse) => {
                saveCompleteCallback(null)
              })
              .catch((errorres) => {
                console.log("error in adding schedule template to group:"+JSON.stringify(error))
              })

         }
      }

  }

  saveAssetGroupNotificationForRunNow(saveCompleteCallback){

    let typedocker = this.props.location.query.type

    let beforeConversionId=this.props.routeParams.assetgroupId;
    let newAssetGroupId=parseInt(beforeConversionId);

    let notificationObj = {};
    notificationObj["scannedBy"] = this.props.loginName
    notificationObj["notifyTestBegin"] = this.state.notifyTestBegin
    notificationObj["notifyTestEnd"] = this.state.notifyTestEnd
    notificationObj["notifyTestFailed"] = this.state.notifyTestFailed
    notificationObj["notifyTestAborted"] = this.state.notifyTestAborted

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
    notificationObj["notify"] = notifyList
    notificationObj["notifyByPagerDuty"] = this.state.notifyByPagerDuty
    notificationObj["notifyBySlack"] = this.state.notifyBySlack
    notificationObj["emails"] = this.state.emails
    notificationObj["reportingPref"] = this.state.reportType

    if(!typedocker){

      addNotificationToGroup(newAssetGroupId,this.state.reportName,notificationObj)
      .then((response) => {
        saveCompleteCallback(null)
      })
      .catch((error) => {
        console.log("error in save schedule:"+JSON.stringify(error))
      })
    }else{
      addNotificationToDocker(newAssetGroupId,this.state.reportName,notificationObj)
      .then((response) => {
        saveCompleteCallback(null)
      })
      .catch((error) => {
        console.log("error in save schedule:"+JSON.stringify(error))
      })

    }

  }


getValidationStateObj(key,valid,errorMsg){

  let validationObj = Object.assign({},this.state.validations[key])
  validationObj.valid=valid
  validationObj.error=errorMsg

  if(valid){
    validationObj.validationState='success',
    validationObj.border='1px solid #00C484',
    validationObj.showTooltip= "false"
  }else{
    validationObj.validationState='error',
    validationObj.border='1px solid #FF444D',
    validationObj.showTooltip= "hover"
  }

  return validationObj
}


startAssessment(e){

    var err = false;
      if(getFormatterDate()==getFormatterDate(this.state.valueStart))
      {
        var startTime = parseInt(this.state.startTimeHour)
        if(this.state.startTimePrime=='pm')
        {
        var startTime_hrs = startTime + 12;
        }
        else
        {
        var startTime_hrs = startTime;
        }
        var hours = new Date().getHours();
        var mins = new Date().getMinutes();
        this.setState({TimeErr:''})

       // var hours_current = new Date().getHours()
        if(new Date().getHours()>=12)
          {
            if(this.state.startTimePrime=='am')
            {
               err = true
             }
          }
          if(hours>this.state.startTimeHour && this.state.startTimePrime=='am')
          {
           err = true
          }
          if(hours>startTime_hrs && this.state.startTimePrime=='pm')
          {
            err = true
          }
          if(hours==startTime_hrs && mins>this.state.startTimeMin)
          {
           err = true
          }
      }

      if((this.state.notifyByEmail && this.state.emails.length<1)||this.state.currentEmailTxtValue!="")
      {
        this.setState({emailBorderColor:'1px solid red'})
        e.preventDefault();
      }
      else if(this.state.displayStartError || this.state.displayEndError){
        e.preventDefault();
      }
      else if(err==true){
        this.setState({TimeErr:<span style={{color: 'red'}}>Time Should be greater</span>})
        e.preventDefault();
      }
      else{
        let _this = this;
        function saveCompleteCallback(error){
          if(error === null){
           _this.setState({ showModal: true })
          }
        }

        this.setState({saving:true,startAssessmentButtonText:"Saving..."});

        if(this.state.scheduleOption === "now"){
          this.saveAssetGroupNotificationForRunNow(saveCompleteCallback)
        }else{
          this.saveAssetGroupScheduling(saveCompleteCallback)
        }
     }
  }

  saveFunction(ev)
    {
      let _this = this;
      function saveCompleteCallback(error){
        _this.setState({saving:false,saveButtonText: "Save"});
      }
      this.setState({saving:true,saveButtonText:"Saving..."});
      this.saveAssetGroupScheduling(saveCompleteCallback)
  }

  hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  onClickInputTemp(){
    let elem = document.getElementsByClassName('dropdown btn-group')[0];

    if(this.hasClass(elem, 'open')){
      elem.classList.remove("open");
    }else{
      elem.className += " open";
    }
  }

  wrapperHandleClick(){
    let elem = document.getElementsByClassName('dropdown btn-group')[0];

    if(this.hasClass(elem, 'open')){
      elem.classList.remove("open");
    }
  }

  render() {
    let checkboxStyle ={
    display:'inline-block',
    width:'25%',
    textAlign: 'center'
   }
   let noticiationsStyle = {
    width:'100%',
    padding:'0 50px 0 15px',
    marginLeft:'-30px',
    marginTop:'10px'
   }
   //... Start and end date error fix ...//
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

    var typeOfGroup=this.props.location.query.type;
    let hreflink="#/infrastructure/mygroups"
    if(typeOfGroup=="Image"){
      hreflink="#/infrastructure/dockerTab"
    }


    let validations = this.state.validations;
    let disableReport=this.state.generateReportName=='auto'?true:false;
    let startdisabled=(this.state.scheduleOption!='now'&&this.state.valueStart==null)?false:true;
    let templateNameValid = true;
    if(this.state.scheduleOption != "now" && this.state.templateName==="")
      templateNameValid = false;

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
    let disableSave = !(!this.state.saving&&((templateNameValid)&&validations.reportName.valid&&startdisabled&&emailReq))

    const successMsg = (this.state.scheduleOption === "now")?
                        "We will evaluate your infrastructure against Policy Packs you selected. Your compliance assessment results can be found at Report section after the test is completed."
                        : "We will start your Infrastructure evaluation according to the created schedule. Your compliance assessment results can be found at Report section after the test is completed."
    const ScheduleTestsFooter=(
    <div className={divContainer}>
      <br/><br/>
      <div>
        <div className="col-lg-7"> </div>
        <div className="col-lg-5" style={{marginTop:-9}}>
          <Button disabled={disableSave} id='saveAssessment' onClick={this.startAssessment.bind(this)} className={footerBtn} >{this.state.startAssessmentButtonText}</Button>
          <AlertComponent ref={(a) => global.Alert = a}/>

          <Modal
            show={this.state.showModal}
            dialogClassName={modalDialogClass}
            onHide={this.close}
            aria-labelledby="contained-modal-title"
            backdrop='static'>
            <form style={{border: '1px solid Navy'}}>
              <div style={{marginTop:'10px',paddingLeft:'15px'}}>
                <Modal.Header  style={{marginRight:15,borderBottom:0}}>
                  <a href={hreflink} className={modalCloseStyle} onClick={this.close} show={this.state.showModal} onHide={this.close} backdrop='static'>
                    x
                  </a>
                  <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                    {'CONGRATULATIONS.'}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{"padding-bottom":"0px","padding-top":"0px"}}>
                    <p>You have successfully completed the set up process.</p>
                    <p>{successMsg}</p>

                </Modal.Body>
                 <Modal.Footer  style={{"border-top":"0px","padding-top":"0px"}}>
                  <a class="button" id='confirmation' onClick={this.close} show={this.state.showModal} onHide={this.close} backdrop='static' href={hreflink}><Button style={{float: "right"}} onClick={this.close} className={footerBtn} >{"OK"}</Button></a>
                </Modal.Footer>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
    );

    const tooltiptemplateName = (
      <Popover   style={{height:60,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.errorForTemplate}</Popover>
    );

    const tooltipReportName = (
      <Popover   style={{height:this.state.validations.reportName.height,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{validations.reportName.error}</Popover>
    );

    const tooltipstart = (
      <Popover   style={{height:40,color: 'black',borderWidth: 2,borderRadius:0,width:250}}>Select Assessment Start date.</Popover>
    );

    const tooltipEmail = (
      <Popover   style={{height:40,color: 'black',borderWidth: 2,borderRadius:0,width:250}}>Email is required.</Popover>
    );

    let containerStyle={paddingRight: 0,paddingLeft: 0,marginRight: 0,marginLeft:0,width:'100%',fontFamily: 'Source Sans Pro'}

    const liTemplateNames = []

    this.state.templatesList.map(function(obj)
    {
      liTemplateNames.push(<MenuItem id={obj.label} onClick={this.selectKey.bind(this)} className={menuList} style={{paddingLeft:'12px',lineHeight:'20px'}}>{obj.label}</MenuItem>)
    }.bind(this))


    const filteredTemplateNames = React.Children.toArray(liTemplateNames).filter(child => (
        !this.state.templateName.trim() || child.props.children.indexOf(this.state.templateName) === 0
      ))
    var assettype="cloudOnprem";
    if(this.props.location.query.type=="Image")
      assettype="Image"
    return(
      <div>
        <WizHeader name="Discover Resources & Assess for Risk, Security and Compliance"
          routeParams={this.props.routeParams}
          assettype={assettype}
          />
        <ScheduleTestsHeader/>
        <div style={containerStyle} className="col-lg-12 col-xs-12 col-md-12 col-sm-12">
        <div id="contentWrapper" onClick={this.wrapperHandleClick.bind(this)} style={css.contentWrapper}>
          <div style={{backgroundColor:'#f9fafc', width:'100%', padding:'65px 0 30px 0'}}>
            <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4"></div>
            <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
            <ControlLabel style={{fontSize:'16px',fontWeight:600, color:'#474856', marginBottom:15}}>SCHEDULE AND NOTIFICATION TEMPLATE</ControlLabel><br/>




            <ControlLabel style={{fontSize:'16px',fontWeight:600, color:'#474856', marginTop:70}}>SCHEDULING</ControlLabel>

            <div style={{display:'flex', justifyContent:'space-between', marginTop:15}}>
              <div style={{marginBottom:15}}>
                {/*<select className={selectStyle} id="scheduleOption" value={this.state.scheduleOption} onChange={this.handleScheduleOption.bind(this)}
                 style={{display:'block',width:289,height:36, backgroundColor:'#fff',border:this.state.bordercolg,borderRadius:0}} >
                  <option key="now" name="now" value="now">Run Test Now</option>
                  <option key="later" name="later" value="later">Schedule Test Later</option>
                </select>*/}
                <Select className="dropdownForm" placeholder="Select Credential Type"
                  style={{marginLeft:25}}
                  value={this.state.scheduleOption}
                  options={[
                    { value: 'now', label: "Run Test Now" },
                    { value: 'later', label: "Schedule Test Later" },
                    ]}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.handleScheduleOption.bind(this)}/>
              </div>
            </div>

            {(this.state.scheduleOption === "now")?'':
            <div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:15}}>
              <div style={{width:'55%'}}>
                <FormGroup controlId="valueStart" className="datePick" >
                  <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Assessment starts</ControlLabel>
                  {' '}
                  <OverlayTrigger ref="toolstart" trigger="manual" placement="top" overlay={tooltipstart}>
                   <DatePicker
                      dateFormat="MM/DD/YYYY"
                      disabled={!(this.state.enableInput) || this.state.showCustomSchedule}
                      value={this.state.valueStart}
                      onChange={this.handleChangeFrom.bind(this)}/>
                  </OverlayTrigger>
                </FormGroup>
                {this.state.displayStartError?startErrorMsg:''}
              </div>
              <div style={{width:'45%'}}>
                <ControlLabel style={{fontSize:'15px',fontWeight:500}}>at</ControlLabel>
                <div className="assementTime" style={{display:'flex', justifyContent:'flex-start', padding:'4px 28px 0 0'}}>
                  <div>
                    <select disabled={!(this.state.enableInput)} className={selectStyleTime} id="atHour" value={this.state.startTimeHour}  onChange={this.handleStartHour.bind(this)}
                      placeholder= "select hour" style={css.timeSelectStyle} >
                      {
                      this.state.atHour.map((item) =>
                        {
                          if(this.state.dateChange){

                             if(this.state.startTimeHour>=item.value)
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

                          if(this.state.currentHour>=item.value)
                              {
                                return <option key={item.value} name={item.value} disabled value={item.value}>{item.label}</option>
                              }
                              else
                              {
                                return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
                              }
                          }
                        }
                        )}
                    </select>
                  </div>
                  <div>
                    <select disabled={!(this.state.enableInput)} className={selectStyleTime} id="atMinute" value={this.state.startTimeMin} onChange={this.handleStartMin.bind(this)} style={css.timeSelectStyle} >
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
                    <select disabled={!(this.state.enableInput)} className={selectStyleTime} id="atTimePrime" value={this.state.startTimePrime}  onChange={this.handleStartPrime.bind(this)} style={css.timeSelectStyle} >
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
                                  if(this.state.samedate)
                                  {
                                    return <option key={item.value} name={item.value} disabled value={item.value}>{item.label}</option>
                                  }
                                  else
                                  {
                                    return <option key={item.value} name={item.value}  value={item.value}>{item.label}</option>
                                  }

                                }

                              }

                            }
                        }
                        )}
                    </select>
                  </div>
                </div>
                 {this.state.TimeErr}
              </div>
            </div>

            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div style={{width:'55%'}}>
              <ControlLabel style={{fontSize:'15px',fontWeight:500, paddingBottom:4}}>Assessment recurrence</ControlLabel>
              {/*<select className={selectStyle} disabled={!this.state.enableInput} id="recurrence" value={this.state.recurrence} onChange={this.handleRecurrence.bind(this)}
               style={{display:'block',width:155,height:36, backgroundColor:'#fff',border:this.state.bordercolg,borderRadius:0}} >
                {
                this.state.assesmentRecurrence.map((item) =>
                  {
                    return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
                  }
                  )}
              </select>*/}
              <Select className="dropdownST" placeholder="Select Assessment recurrence"
                  value={this.state.recurrence}
                  options={this.state.assesmentRecurrence}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.handleRecurrence.bind(this)}/>

              </div>
              <div style={{width:'45%'}}>
                {(this.state.customScheduleDesc === '')?
                  <div>
                  <FormGroup controlId="valueEnd" className="datePick">
                    <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Assessment Ends</ControlLabel>
                    {' '}
                    <DatePicker
                      dateFormat="MM/DD/YYYY"
                      style={{color:'#737684', fontSize: 15}}
                      value={this.state.valueEnd}
                      disabled={!(this.state.enableInput) || this.state.showCustomSchedule} onChange={this.handleChangeTo.bind(this)}/>
                  </FormGroup>
                  {this.state.displayEndError?endErrorMsg:''} </div>
                  :
                  <div>
                    <div style={{marginTop:30, margintop: 34,width: '70%',float: 'left'}}>{this.state.customScheduleDesc}</div>
                    {
                      (this.state.enableInput)?
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
            }
            </div>
            <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4"></div>
          </div>
          {/*Notification Section*/}

      <div style={{ padding:'20px 0',width:'100%', backgroundColor:'#f5f7fa'}}>
            <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4"></div>
            <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
            <ControlLabel style={{fontSize:'16px',fontWeight:600, color:'#474856'}}>NOTIFICATION</ControlLabel><br/><br/>

              <div>
                  Send notification when assessment
                  <div id="notifyWhen" style={noticiationsStyle}>

                    <div id="testBegins" style={checkboxStyle} >
                      <label htmlFor="notifyTestBegin" style={{fontWeight:'500'}}>
                      Begins<br/>
                      <input type="checkbox" checked={this.state.notifyTestBegin} id="notifyTestBegin"  name="notifyTestBegin" onChange={this.handleTestBeginCheck.bind(this)}/>
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
                          <input type="checkbox" checked={this.state.notifyByPagerDuty}
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
                                emailBorderColor={this.state.emailBorderColor}
                                updateEmails={this.updateEmails.bind(this)}
                                emailCheckboxChecked={this.state.notifyByEmail}/>
               </div>
               :
               <div></div>
              }
        </div>
      </div>

          {/*Report Name Section*/}

      <div style={{ width:'100%',backgroundColor:'#edf2f8', padding:'20px 0'}}>
        <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4"></div>
            <div className="col-lg-8 col-xs-8 col-md-8 col-sm-8">
        <ControlLabel style={{fontSize:'16px',fontWeight:600, color:'#474856'}}>REPORT NAME</ControlLabel><br/><br/>

          <label style={{fontWeight:'500'}}><input type="radio" id="generateReportName" value="auto" checked={this.state.generateReportName === 'auto'?true:false} onChange={this.handleReportNameOption.bind(this)}/>&nbsp;&nbsp; Automatically generate report name</label><br/><br/>
          <label style={{fontWeight:'500'}}><input type="radio" id="generateReportName" value="custom" checked={this.state.generateReportName === 'custom'?true:false} onChange={this.handleReportNameOption.bind(this)}/>&nbsp;&nbsp; Create custom report name (need to be unique)</label><br/><br/>
            <FormGroup  controlId="reportNameInput" validationState={validations.reportName.validationState}>
             <OverlayTrigger ref="toolreport" trigger={validations.reportName.showTooltip} placement="right" overlay={tooltipReportName}>
              <FormControl
                id="reportid"
                type="text"
                placeholder="Report name"
                style={{width:326,height:40,border:validations.reportName.border,borderRadius:0, backgroundColor:'#fff'}}
                onChange={this.handleReportNameInput.bind(this)}
                onBlur={this.handleReportNameInput.bind(this)}
                disabled={disableReport}
              />
             </OverlayTrigger>
            </FormGroup>
            </div>
      </div>


      <div id="footer" style={{width:'100%', height:100, overflowY:'hidden'}}>{ScheduleTestsFooter}</div>
    </div>

    <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{position:'absolute', top:100}}>
      <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4" onClick={this.wrapperHandleClick.bind(this)} style={{height:34}}></div>
      <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4" style={{width:400}}>
        <div style={{display:'flex', justifyContent:'space-between',height:34}}>
          <div style={{width:'82%', marginLeft:-5}}>
            <OverlayTrigger ref="tooltemplate" trigger="manual" placement="right" overlay={tooltiptemplateName}>
            <div style={{ width: 325, height: 36, backgroundColor:'#fff', borderRadius: 0,border:this.state.bordercolg,position:'relative',borderRight: 'aliceblue', marginTop:1}}>
            <Dropdown id="dropdown-custom-menu2"  ref="test">
              <FormControl
                style={{ width: 324, height: 35, fontSize:15, color:'#7b7e87', border:this.state.bordercolg,backgroundColor:'#fff', borderRadius: 0,borderTop:0,borderLeft:0}}
                ref={(d)=> { this.input = d; }}
                type="text"
                placeholder="Template name..."
                readOnly={!this.state.enableInput}
                onChange={this.onChange.bind(this)}
                value={this.state.templateName}
                // bsRole="toggle"
                onClick={this.onClickInputTemp.bind(this)}
              />

              {(filteredTemplateNames.length > 0)?
                <div className="dropdown-menu" bsRole="menu" style={{width: 291,maxHeight:200,overflow:'auto',marginTop:-2,marginLeft:-1,borderRadius: 0,border:this.state.bordercolg}}>
                 <ul className="list-unstyled" id="drop2">
                  {filteredTemplateNames}
                 </ul>
                 </div>
              :
                <div bsRole="menu"></div>
              }
            </Dropdown>
            <div onClick={this.handleAddNewButton.bind(this)} className={modalCloseStyle} style={{fontSize:17, top:3, right:12}}>x</div>
            </div>
          </OverlayTrigger>
          </div>
          {this.state.showEdit?
            <div style={{width:'18%', paddingLeft:10}}>
              <Button bsSize='medium' className={blueBtn} onClick={this.enableSelectedTemplateEdit.bind(this)}>Edit</Button>
            </div>
            :''
          }
        </div>
      </div>
      <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4" onClick={this.wrapperHandleClick.bind(this)} style={{height:34}}></div>
    </div>

    </div>
    </div>
    )
  }
}

export default connect(
 ({users}) => ({loginName: users.login}),
)(ScheduleInfo)
