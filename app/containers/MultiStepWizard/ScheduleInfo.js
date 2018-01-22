import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import {Popover, FormControl, FormGroup,ControlLabel, OverlayTrigger, Checkbox, Radio, Glyphicon,Button,Modal} from 'react-bootstrap'
import {divContainer,customHrBefore,toDoCircle,inProgressOuterCircle,inProgressInnerCircle,completedInnerCheckMark,completedOuterCircle} from './styles.css'
import { navbar,footerBtn,modal,selectStyle,modalDialogClass,blueBtn, spacer} from 'sharedStyles/styles.css'
import {italic1,shcover,myDIV,cover,modalCloseStyle, assementTime} from './styles.css'
import AlertComponent from 'components/Common/AlertComponent'
import ErrorMessages from 'constants/ErrorMessages'
import DatePicker from 'react-bootstrap-date-picker'
import {WizHeader} from './WizardHeader'
import {Emailboxtext} from './Emailbox'
import CustomScheduleComponent from './CustomScheduleComponent';


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
	selectStyle:{
		width:38,
		height:37,
		backgroundColor:'#fff',
		padding:'7px 2px',
		border:'1.5px solid #4C58A4'
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
                <li style={{marginLeft:'-40px'}}> ASSESSMENTS</li>
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

class ScheduleInfo extends React.Component {
	constructor(props) {
		super(props);
		var value = new Date().toISOString();
		this.state = {
			startAssessmentButtonText:'Run Assessment',
			doneButtonText:'Done',
			saving:false,
			showCustomSchedule:false,
			showTemplateList:true,
			templateSelected:false,
			templateName:'',

			customScheduleDesc:'',
			valueStart: '',
			startTimeHour:'12',
			startTimeMin:'0',
			startTimePrime:'am',
			recurrence:'',
			valueEnd:'',

			notifyTestBegin:false,
			notifyTestEnd:false,
			reportType:"",
			emails:[],
			generateReportName:'auto',
			reportName:'',

			bordercolg:'1.5px solid #4C58A4',
			atHour:[1,2,3,4,5,6,7,8,9,10,11,12],
			atMinute:[0,5,10,15,20,25,30,35,40,45,50,55,60],

			atTimePrime:[
			  { value: "am", label: "AM" },
			  { value: "pm", label: "PM" }
			],
			assesmentRecurrence:[
			  { value: "once", label: "Only once" },
			  { value: "day", label: "Daily" },
			  { value: "Week", label: "Weekly" },
			  { value: "month", label: "Monthly" },
			  { value: "custom", label: "Custom" }
			],
			templatesList:[
				{
					label:"Template 1",
					startTime:"2017-02-24T07:52:04.757Z",
					recurrence:"month",
					modifier:0,
					emails:["user1@cav.com","user2@cav.com"],
					notifyTestBegin:true,
					notifyTestEnd:false,
					reportingPref:"pdf",
					endCount:0,
					endTime:"2017-02-23T07:52:04.757Z"
				},
				{
					label:"Template 2",
					startTime:"2017-02-25T07:50:04.757Z",
					recurrence:"day",
					modifier:1,
					emails:["user1@cav.com","user3@cav.com"],
					notifyTestBegin:false,
					notifyTestEnd:true,
					reportingPref:"html",
					endCount:0,
					endTime:"2017-03-25T07:52:04.757Z"
				},
				{
					label:"Template 3",
					startTime:"2017-02-23T07:52:04.757Z",
					recurrence:"week",
					modifier:3,
					emails:["user2@cav.com","user3@cav.com"],
					notifyTestBegin:true,
					notifyTestEnd:true,
					reportingPref:"excel",
					endCount:0,
					endTime:"2017-02-27T07:52:04.757Z"
				}
			],

		};
	}

	handleChangeStart(value, formattedValue){
		this.setState({
      		valueStart: value
    	});
	}

	handleChangeEnd(value, formattedValue){
		this.setState({
      		valueEnd: value
    	});
	}

    handleStartHour(e){
		this.setState({startTimeHour:e.target.value})
    }

    handleStartMin(e){
		this.setState({startTimeMin:e.target.value})
    }

    handleStartPrime(e){
		this.setState({startTimePrime:e.target.value})
    }

	handleRecurrence(e){
		this.setState({recurrence:e.target.value})
		if(e.target.value === "custom"){
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

	handleReportType(changeEvent){
	  this.setState({
	    reportType: changeEvent.target.value
	  });
	}

 	updateEmails(emailsList){
    	this.setState({emails:emailsList});
  	}

	handleReportNameOption(changeEvent) {
	  this.setState({
	    generateReportName: changeEvent.target.value
	  });
	}

	handleSelecteExistingButton(){
		this.setState({showTemplateList:true})
	}

	handleAddNewButton(){
		this.setState({showTemplateList:false})
		this.clearInputFieldsForAdd();
	}

	clearInputFieldsForAdd(){
		this.setState({templateName:''});
		this.setState({valueStart:''});
		this.setState({valueEnd:''});
		this.setState({startTimeHour:'12'});
		this.setState({startTimeMin:'0'});
		this.setState({startTimePrime:'am'});
		this.setState({recurrence:''});
		this.setState({notifyTestBegin:false});
		this.setState({notifyTestEnd:false});
		this.setState({emails:[]});
		this.setState({reportType:''});
	}

	handleTemplateInput(e){
		this.setState({templateName:e.target.value})
	}

	handleTemplateSelected(e){
	    if(e.target.value != "Select a template"){
	      this.setState({templateSelected:true})
	    }else{
	      this.setState({templateSelected:false})
	    }

		let selectedTemplate = findElement(this.state.templatesList,"label",e.target.value)
		if(selectedTemplate != null)
	    	this.setTemplateData(selectedTemplate)
  	}

	setTemplateData(templateInfo){

		let startTime = templateInfo.startTime
		let endTime = templateInfo.endTime

		let startDate = new Date(startTime)
		let hours = startDate.getHours();
		let minutes = startDate.getMinutes();
		let timePrime = 'am'
		if( hours > 12) {
			hours = hours - 12
			timePrime = 'pm'
		}

		this.setState({templateName:templateInfo.label});
		this.setState({valueStart:startTime});
		this.setState({valueEnd:endTime});
		this.setState({startTimeHour:hours});
		this.setState({startTimeMin:minutes});
		this.setState({startTimePrime:timePrime});
		this.setState({recurrence:templateInfo.recurrence});
		this.setState({notifyTestBegin:templateInfo.notifyTestBegin});
		this.setState({notifyTestEnd:templateInfo.notifyTestEnd});
		this.setState({emails:templateInfo.emails});
		this.setState({reportType:templateInfo.reportingPref});
	}

	saveCustomScheduleInfo(customScheduleInfo){
		//alert(JSON.stringify(customScheduleInfo))
		this.setState({customScheduleDesc:customScheduleInfo.description})
	}

  	saveAssetGroupScheduling(){
  		let obj = {};

  		let startTime = new Date(this.state.valueStart);
  		let hours = this.state.startTimeHour
  		let minutes = this.state.startTimeMin
  		if(this.state.startTimePrime === "PM")
  			hours = hours + 12
		startTime.setHours(hours)
  		startTime.setMinutes(minutes)

  		let endTime = new Date(this.state.valueEnd);
		endTime.setHours(0)
  		endTime.setMinutes(0)

  		obj["label"] = this.state.templateName
  		obj["startTime"]= startTime
  		obj["endTime"]= endTime
  		obj["recurrence"] = this.state.recurrence
  		obj["notifyTestBegin"] = this.state.notifyTestBegin
  		obj["notifyTestEnd"] = this.state.notifyTestEnd
  		obj["emails"] = this.state.emails
  		obj["reportingPref"]= this.state.reportType

  		let newTemplatesList = this.state.templatesList
  		newTemplatesList.concat(obj);
  		this.setState({templatesList:newTemplatesList});

  	}

    doneFunction(ev)
    {
	    let _this = this;
	    function saveCompleteCallback(error){
	      _this.setState({saving:false,doneButtonText: "Done"});
	    }
	    //this.setState({saving:true,doneButtonText:"Saving..."});
	    this.saveAssetGroupScheduling(saveCompleteCallback)
    }

  	render() {

 		let disableSave = !(!this.state.saving)

        const ScheduleTestsFooter=(
        	<div className={divContainer}>
      		<br/><br/>
      		<div>
      		<div className="col-lg-7"> </div>
        	<div className="col-lg-5">

        	<Button disabled={disableSave} onClick={this.startAssessment} href='#infrastructure/mygroups' className={footerBtn} >{this.state.startAssessmentButtonText}</Button>
         	{'        '}
         	<Button disabled={disableSave} onClick={this.doneFunction.bind(this)} className={footerBtn} >{this.state.doneButtonText}</Button>
         	<AlertComponent ref={(a) => global.Alert = a}/>

	        <Modal
	          show={this.state.showModal}
	          dialogClassName={modalDialogClass}
	          onHide={this.close}
	          aria-labelledby="contained-modal-title"
	          backdrop='static'>
	          <form style={{border: '1px solid Navy'}}>
	            <div style={{marginTop:'25px',paddingLeft:'15px'}}>
	              <Modal.Header  style={{marginRight:15,borderBottom:0}}>
	                <a style={{textDecoration:'none'}} href="#/infrastructure/mygroups" className={modalCloseStyle} onClick={this.close} show={this.state.showModal} onHide={this.close} backdrop='static'>
	                  X
	                </a>
	                <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
	                  {'CONGRATULATIONS.'}
	                </Modal.Title>
	              </Modal.Header>
	              <Modal.Body>
	                  <p>You have successfully completed the set-up process.</p>
	                  <p>We will test your system for compliance against Policy Packs you selected.We will send you PDF and Excel reports for this test.</p>
	              </Modal.Body>
	            </div>
	          </form>
	        </Modal>

        	</div>
      		</div>
    		</div>
        );
				// routeParams={this.props.routeParams}
  		return(
  			<div>
	      	<WizHeader
						name="Discover Resources & Assess for Risk, Security and Compliance"
						/>
       		<ScheduleTestsHeader/>
	      	<div id="contentWrapper"  style={css.contentWrapper}>
				<div style={{backgroundColor:'#f9fafc', width:'100%', padding:'5% 0'}}>
		      		<div className="col-lg-4 col-xs-4 col-md-4 col-sm-4"></div>
		      		<div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
					<ControlLabel style={{fontSize:'16px',fontWeight:600, color:'#474856'}}>TEMPLATE NAME</ControlLabel>

						{this.state.showTemplateList?
						<div style={{display:'flex', justifyContent:'space-between'}}>
						<div style={{width:'50%'}}>
							<select className={selectStyle} id="templateNameSelect" value={this.state.templateName} placeholder= "Select a template" onChange={this.handleTemplateSelected.bind(this)} style={{width:240,height:34, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
								{
									this.state.templatesList.map((item) =>
									{
								  	return <option key={item.label} name={item.label} value={item.label}>{item.label}</option>
									}
								)}
							</select>
						</div>
				        <div style={{width:'50%', display:'flex', justifyContent:'flex-end'}}>
				            <Button style={{ marginRight:12}} onClick={this.handleAddNewButton.bind(this)} bsSize='medium'  className={blueBtn} >Add New</Button>
				            <Button bsSize='medium'  className={blueBtn} >Edit</Button>
				        </div>
				        </div>
				        :
				        <div style={{display:'flex', justifyContent:'space-between'}}>
						<div style={{width:'70%'}}>
				            <FormGroup  controlId="templateNameInput">
	      			            <FormControl type="text"
				                name="templateNameInput"
				                value={this.state.templateName}
				                placeholder="Enter template name"
				                onBlur={this.handleTemplateInput}  />
				            </FormGroup>
						</div>
				        <div style={{width:'30%'}}>
				        	<Button onClick={this.handleSelecteExistingButton.bind(this)} bsSize='medium'  className={blueBtn}>Select Existing</Button>
				        </div>
				        </div>
				    	}

		      		<ControlLabel style={{fontSize:'16px',fontWeight:600, color:'#474856', marginTop:50}}>SCHEDULING</ControlLabel>
		      		<div style={{display:'flex', justifyContent:'space-between'}}>
						<div style={{width:'55%'}}>
				            <FormGroup controlId="valueStart" className="datePick">
				              <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Assessment starts</ControlLabel>
				              {' '}
				              <DatePicker value={this.state.valueStart} onChange={this.handleChangeStart.bind(this)}/>
				            </FormGroup>
						</div>
				        <div style={{width:'45%'}}>
							<ControlLabel style={{fontSize:'15px',fontWeight:500}}>at</ControlLabel>
							<div className="assementTime" style={{display:'flex', justifyContent:'space-between', paddingRight: 28}}>
								<div>
									<select className={selectStyle} id="atHour" value={this.state.startTimeHour}  onChange={this.handleStartHour.bind(this)}
										placeholder= "select hour" style={css.selectStyle} >
									  {
										this.state.atHour.map((item) =>
										  {
										    return <option key={item} name={item} value={item}>{item}</option>
										  }
									    )}
									</select>
								</div>
								<div>
									<select className={selectStyle} id="atMinute" value={this.state.startTimeMin} onChange={this.handleStartMin.bind(this)} style={css.selectStyle} >
									  {
										this.state.atMinute.map((item) =>
										  {
										    return <option key={item} name={item} value={item}>{item}</option>
										  }
									    )}
									</select>
								</div>
								<div>
									<select className={selectStyle} id="atTimePrime" value={this.state.startTimePrime}  onChange={this.handleStartPrime.bind(this)} style={css.selectStyle} >
									  {
										this.state.atTimePrime.map((item) =>
										  {
										    return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
										  }
									    )}
									</select>
								</div>
							</div>
				        </div>
		      		</div>

		      		<div style={{display:'flex', justifyContent:'space-between'}}>
						<div style={{width:'55%'}}>
							<ControlLabel style={{fontSize:'15px',fontWeight:500}}>Assessment recurrence</ControlLabel>
							<select className={selectStyle} id="recurrence" value={this.state.recurrence} onChange={this.handleRecurrence.bind(this)}
							 style={{width:155,height:37, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
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
				            <FormGroup controlId="valueEnd" className="datePick">
				              <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Assessment Ends</ControlLabel>
				              {' '}
				              <DatePicker value={this.state.valueEnd} onChange={this.handleChangeEnd.bind(this)}/>
				            </FormGroup>
				            :
				            <div>{this.state.customScheduleDesc}</div>
				        	}
				        </div>
		      		</div>
		      		<CustomScheduleComponent showCustomSchedule={this.state.showCustomSchedule} saveCustomScheduleInfo={this.saveCustomScheduleInfo.bind(this)}/>
	      			<div className="col-lg-4 col-xs-4 col-md-4 col-sm-4"></div>
	      			</div>
	      		</div>
	      		{/*Notification Section*/}

				<div style={{ padding:'5% 0',width:'100%', backgroundColor:'#f5f7fa'}}>
		      		<div className="col-lg-4 col-xs-4 col-md-4 col-sm-4"></div>
		      		<div className="col-lg-8 col-xs-8 col-md-8 col-sm-8">
		      		<ControlLabel style={{fontSize:'16px',fontWeight:600, color:'#474856'}}>NOTIFICATION</ControlLabel><br/><br/>

		      		<input type="checkbox" checked={this.state.notifyTestBegin} id="notifyTestBegin" name="notifyTestBegin" onChange={this.handleTestBeginCheck.bind(this)}/>
		      		<label htmlFor="notifyTestBegin" style={{fontWeight:'500'}}> &nbsp; Send notification when test begins</label><br/><br/>

					<input type="checkbox" checked={this.state.notifyTestEnd} id="notifyTestEnd" name="notifyTestEnd" onChange={this.handleTestEndCheck.bind(this)}/>
		            <label htmlFor="notifyTestEnd" style={{fontWeight:'500'}}> &nbsp; Send notification when test ends</label><br/><br/>

					<input type="checkbox" id="shareReport" name="shareReport" />
		            <label style={{fontWeight:'500'}}> &nbsp; Share test report as</label>

					<FormGroup style={{paddingLeft:'8%'}}>
						<label style={{fontWeight:'500'}}><input type="radio" id="pdf" value="pdf" checked={this.state.reportType === 'pdf'?true:false} onChange={this.handleReportType.bind(this)}/>&nbsp;&nbsp; PDF</label><br/>
						<label style={{fontWeight:'500'}}><input type="radio" id="excel" value="excel" checked={this.state.reportType === 'excel'?true:false} onChange={this.handleReportType.bind(this)}/>&nbsp;&nbsp; Excel</label><br/>
						<label style={{fontWeight:'500'}}><input type="radio" id="html" value="html" checked={this.state.reportType === 'html'?true:false} onChange={this.handleReportType.bind(this)}/>&nbsp;&nbsp; HTML</label><br/><br/>
            	 	</FormGroup>

		            <input type="checkbox" id="sendEmails" name="sendEmails"/>
		            <label style={{fontWeight:'500'}}> &nbsp; Send notification to</label><br/><br/>
					<Emailboxtext emails={this.state.emails} updateEmails={this.updateEmails} /><br/>
					</div>
				</div>

	      		{/*Report Name Section*/}

				<div style={{ width:'100%',backgroundColor:'#edf2f8', padding:'5% 0'}}>
					<div className="col-lg-4 col-xs-4 col-md-4 col-sm-4"></div>
		      		<div className="col-lg-8 col-xs-8 col-md-8 col-sm-8">
					<ControlLabel style={{fontSize:'16px',fontWeight:600, color:'#474856'}}>REPORT NAME</ControlLabel><br/><br/>
					<FormGroup>
						<label style={{fontWeight:'500'}}><input type="radio" id="generateReportName" value="auto" checked={this.state.generateReportName === 'auto'?true:false} onChange={this.handleReportNameOption.bind(this)}/>&nbsp;&nbsp; Automaticaly generate report name</label><br/><br/>
						<label style={{fontWeight:'500'}}><input type="radio" id="generateReportName" value="custom" checked={this.state.generateReportName === 'custom'?true:false} onChange={this.handleReportNameOption.bind(this)}/>&nbsp;&nbsp; Create custom report name (need to be unique)</label><br/><br/>
	        	 		<FormControl
				            type="text"
				            placeholder="Report name"
				            style={{width:326,height:40,border:this.state.bordercolg,borderRadius:0, backgroundColor:'#fff'}}
				        />
	        	 	</FormGroup>
	        	 	</div>
				</div>


			</div>
	      	 {ScheduleTestsFooter}
	    </div>
  		)
  	}
}

export default  ScheduleInfo
