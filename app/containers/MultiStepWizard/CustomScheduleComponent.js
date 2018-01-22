import React from 'react';
import ReactDOM from 'react-dom';
import {ControlLabel, FormGroup, FormControl, Button} from 'react-bootstrap';
import {footerBtn,selectStyle,selectStyleTime,footerBtnCancel} from 'sharedStyles/styles.css'
import {divContainer} from './styles.css'
import DatePicker from 'react-bootstrap-date-picker';
import moment from 'moment'
import Joi from 'joi-browser'
import Select from 'react-select'

const css={
  wrapperPop:{
    border:'1px solid #4C58A4',
    width:450,
   
    paddingTop:"30px",
    backgroundColor:'#f9fafc'
  },
  rowStyle:{
    padding:'21px 0 0 5px'
  },
  doneButton:{
    backgroundColor:'#fff',
    color:'#4C58A4',
    width: 63,
    textAlign: 'center',
    padding: 5,    
    margin: '30px 10px 0 0',
    height:30,
    fontSize:14,
    cursor:'pointer'
  },
  cancelButton:{
    backgroundColor:'#4C58A4',
    color:'#fff',
    border:'1px solid #fff',
    width: 63,
    textAlign: 'center',
    padding: 5,
    height:28,  
    margin: '30px 10px 0 0',
    fontSize:14,
    cursor:'pointer'
  },
  col1Style:{
    display:'flex',
    flexDirection:'column',
    textAlign:'right',
    width:'35%',
    float:'left',
    paddingRight:10
  },
  col2Style:{
    display:'flex',
    flexDirection:'column',
    width:'65%'
  }
}
class CustomScheduleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state={      
      visible: false,
      repeatFreq:'day', 
      dayModifier:1,
      weekModifiers:[],
      valueStart:'',
      repeatEndsOption:'never',
      endCount:'',
      valueEnd:'',
      description:'',
      repeatFreqOptions:[
        { value: "day", label: "Daily" },
        { value: "week", label: "Weekly" }
      ],
      dayModifierOptions:[1,2,3,4,5,6],
      dateChange:true,
      beforeTodayFrom: false,
      showDateError: false,
      displayStartError:false,
      displayEndError:false,
      valueEndDisable:true,
      disableAfter:true
    }
  }

  componentDidMount(){

    this.setState({
      visible: this.props.showCustomSchedule,
      valueStart: this.props.valueStart,
      valueEnd: this.props.valueEnd,
      repeatFreq: this.props.recurrence,
      endCount: this.props.endCount,
      dayModifier: this.props.dayModifier,
      weekModifiers: this.props.weekModifiers
    }) 

  }

  componentWillReceiveProps(nextProps,nextState){
    if (nextProps.showCustomSchedule != this.props.showCustomSchedule){

      if(this.props.endCount > 0){
        this.setState({repeatEndsOption:'after',
                      valueEndDisable:true,
                      displayEndError:false,
                      disableAfter:false})
      }else if(this.props.valueEnd != ''){
        this.setState({repeatEndsOption:'ondate',
                      disableAfter:true,
                      valueEndDisable:false})
      }else{
        this.setState({repeatEndsOption:'never',
                      disableAfter:true,
                      valueEndDisable:true,
                      displayEndError:false})
      }

      let repeatFreq = this.props.recurrence
      if(this.props.recurrence === '' || this.props.recurrence === 'custom' ||  this.props.recurrence === 'now'){
        repeatFreq = 'day'
      }

      this.setState({
        visible: nextProps.showCustomSchedule,
        valueStart: this.props.valueStart,
        valueEnd: this.props.valueEnd,
        repeatFreq: repeatFreq,
        endCount: this.props.endCount,
        dayModifier: this.props.dayModifier,
        weekModifiers: this.props.weekModifiers
      }) 
    }

  }

  handleRepeatFreq(e){
    this.setState({repeatFreq:e})
  }

  handleChangeDayModifier(e){
    this.setState({dayModifier:e.target.value})
  }

  handleChangeWeekModifier(e) {

    let chkVal = e.target.value;
    const index = this.state.weekModifiers.indexOf(chkVal)
    let newList = this.state.weekModifiers.slice();
    if (index === -1)
    {
      newList = newList.concat(chkVal)
    } else {
      newList.splice(index,1);
    }
    this.setState({weekModifiers: newList})
  }

 /* handleChangeStart(value, formattedValue){
    this.setState({valueStart: value});
  }

  handleChangeEnd(value, formattedValue){
    this.setState({valueEnd: value});
  }
*/

  //################################//

  handleChangeFrom(value) {
   /* if(getFormatterDate()==getFormatterDate(value))
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
    console.log("does this call when delete??", value)*/
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
          displayEndError:this.state.beforeTodayTo ? true: false,
          displayStartError : this.state.beforeTodayFrom ? true : false
        });
      } else {
        this.setState({
          displayStartError:isStartInput?true:false,
          displayEndError:isStartInput?false:true
        });
      }
    }
    
  //###############################################//

  handleChangeEndOption(changeEvent) {
    console.log(this.props.reportEndsValue)
    this.setState({
      repeatEndsOption: changeEvent.target.value,
      endCount: '',
      valueEnd: ''
    },()=>{
      if(this.state.repeatEndsOption == 'never'){
        this.setState({disableAfter:true,
                      valueEndDisable:true,
                      displayEndError:false})
      }else if(this.state.repeatEndsOption == 'after'){
        this.setState({valueEndDisable:true,
          displayEndError:false,
          disableAfter:false})
      }else if(this.state.repeatEndsOption == 'ondate'){
        this.setState({disableAfter:true,
          valueEndDisable:false})
      }
    });
  }

  handleEndCount(e){
    this.setState({endCount:e.target.value})
  }

  doneFunction(e){
    if(this.state.displayStartError || this.state.displayEndError){
        e.preventDefault();
    }else{
      if(this.state.repeatEndsOption==="never"){
        this.setState({endCount:'',
          valueEnd:null})
        }
      else if(this.state.repeatEndsOption==="ondate"){
        this.setState({endCount:''})
      }else if (this.state.repeatEndsOption==="after"){
        this.setState({valueEnd:null})
      }
      let customScheduleInfo = {};

      customScheduleInfo["recurrence"] = this.state.repeatFreq, 
      customScheduleInfo["dayModifier"] = this.state.dayModifier,
      customScheduleInfo["weekModifiers"] = this.state.weekModifiers,
      customScheduleInfo["valueStart"] = this.state.valueStart,
      customScheduleInfo["endCount"] = this.state.endCount,
      customScheduleInfo["valueEnd"] = this.state.valueEnd,
      customScheduleInfo["repeatEndsOption"] = this.state.repeatEndsOption,
      customScheduleInfo["description"] = this.setDescription()
      
      this.props.saveCustomScheduleInfo(customScheduleInfo);
      this.props.closeCustomPopup();
      this.close();
    }
  }

  setDescription(){

    let desc = "Every ";

    if(this.state.repeatFreq === 'day'){
      desc = "Every "
      desc = desc + this.state.dayModifier + " days"
    }else if(this.state.repeatFreq === 'week'){
      desc = "Weekly on "
      desc = desc + this.state.weekModifiers.join(", ")
    }

    if(this.state.repeatEndsOption === "after"){
      desc = desc+ " until " + this.state.endCount + " occurences"
    }else if(this.state.repeatEndsOption === "ondate"){
      if( this.state.valueEnd != '' && this.state.valueEnd!=null){
        let str = this.state.valueEnd.replace(/ /g,'T')
        let endDate = new Date(str)
        //let endDate = new Date(this.state.valueEnd);
        let  endDateStr = (endDate.getMonth() + 1) + "/" + endDate.getDate() + "/" + endDate.getFullYear();
        desc = desc+ " until " + endDateStr
      }
    }

    return desc
  }

  close(){
    this.setState({visible:false});
    this.props.closeCustomPopup();
  }

  render(){
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
      return(
        <div>
          <div style={{position:'relative'}} >
            <div style={{position:'absolute', top:10, marginLeft: -245, left: '47%', zIndex:99}} >

      {this.state.visible ?
      <div className="popup">
         <div style={css.wrapperPop}>

        <div style={css.col1Style}>
          <ControlLabel style={{fontSize:'15px',fontWeight:500, margin: '21px 0px'}}>Repeats: </ControlLabel>
          <ControlLabel style={{fontSize:'15px',fontWeight:500, margin: '21px 0px'}}>Repeat every: </ControlLabel>
          <ControlLabel style={{fontSize:'15px',fontWeight:500, margin: '21px 0px'}}>Starts on: </ControlLabel>
          <ControlLabel style={{fontSize:'15px',fontWeight:500, margin: '21px 0px'}}>Ends: </ControlLabel>
        </div>

        <div style={css.col2Style}>
          <div style={{padding:'14px 0 0 5px'}}>
            {/*<select className={selectStyle} id="repeatFreq" value={this.state.repeatFreq} onChange={this.handleRepeatFreq.bind(this)} 
             style={{width:150,height:37, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
              { this.state.repeatFreqOptions.map((item) => {
                  return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
                }
              )}
            </select>*/}
            <Select className="dropdownTimeZone"
              style={{width:150,height:37, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}}
              value={this.state.repeatFreq}
              options={this.state.repeatFreqOptions}
              searchable={true}
              multi={false}
              clearable={false}
              allowCreate={false}
              onChange={this.handleRepeatFreq.bind(this)}/>
          </div>

          <div style={{padding:'28px 0 0 5px', fontSize:13}}>
          { (this.state.repeatFreq === "day")?
              <div>
                <select className={selectStyleTime} id="dayModifier" value={this.state.dayModifier} onChange={this.handleChangeDayModifier.bind(this)} 
                  style={{width:50,height:37, padding:'1px 0 0 5px', backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}} >
                  {
                    this.state.dayModifierOptions.map((item) =>{return <option key={item} name={item} value={item}>{item}</option>}
                  )}
                </select> &nbsp;&nbsp; days
              </div>
            : 
              <div style={{margin: '5px 0 7px 0'}}>
                <input type="checkbox" id="SUN" checked={this.state.weekModifiers.indexOf('SUN')>-1?true:false} value="SUN" onChange={this.handleChangeWeekModifier.bind(this)} />
                <label htmlFor="SUN" style={{fontWeight:'500', marginRight:5}}> S </label>                
                
                <input type="checkbox" id="MON" checked={this.state.weekModifiers.indexOf('MON')>-1?true:false} value="MON" onChange={this.handleChangeWeekModifier.bind(this)} />
                <label htmlFor="MON" style={{fontWeight:'500', marginRight:5}}> M </label>
                
                <input type="checkbox" id="TUE" checked={this.state.weekModifiers.indexOf('TUE')>-1?true:false} value="TUE" onChange={this.handleChangeWeekModifier.bind(this)} />
                <label htmlFor="TUE" style={{fontWeight:'500', marginRight:5}}> T </label>                
                
                <input type="checkbox" id="WED" checked={this.state.weekModifiers.indexOf('WED')>-1?true:false} value="WED" onChange={this.handleChangeWeekModifier.bind(this)} />
                <label htmlFor="WED" style={{fontWeight:'500', marginRight:5}}> W </label>
                
                <input type="checkbox" id="THU" checked={this.state.weekModifiers.indexOf('THU')>-1?true:false} value="THU" onChange={this.handleChangeWeekModifier.bind(this)} />
                <label htmlFor="THU" style={{fontWeight:'500', marginRight:5}}> T </label>                
                
                <input type="checkbox" id="FRI" checked={this.state.weekModifiers.indexOf('FRI')>-1?true:false} value="FRI" onChange={this.handleChangeWeekModifier.bind(this)} />
                <label htmlFor="FRI" style={{fontWeight:'500', marginRight:5}}> F </label>                
                
                <input type="checkbox" id="SAT" checked={this.state.weekModifiers.indexOf('SAT')>-1?true:false} value="SAT" onChange={this.handleChangeWeekModifier.bind(this)} />
                <label htmlFor="SAT" style={{fontWeight:'500', marginRight:5}}> S </label>
              </div>
          }
          </div>

          <div style={{padding:'21px 0 0 5px'}}>
              <FormGroup controlId="valueStart" className="datePick">
                <DatePicker 
                  dateFormat="MM/DD/YYYY" 
                  value={this.state.valueStart}
                  // minDate={new Date().toISOString()}
                  onChange={this.handleChangeFrom.bind(this)}/>
              </FormGroup>
              {this.state.displayStartError?startErrorMsg:''} 
          </div>

          <div style={{padding:'19px 0 0 5px'}}>

              <input type="radio" id="never" value="never" checked={this.state.repeatEndsOption === 'never'?true:false} onChange={this.handleChangeEndOption.bind(this)}/>
              <label htmlFor="never" style={{fontWeight:'500'}}>&nbsp;&nbsp; Never</label><br/>
              
              <div>

                <input type="radio" id="after" value="after" checked={this.state.repeatEndsOption === 'after'?true:false} onChange={this.handleChangeEndOption.bind(this)}/>
                <label htmlFor="after" style={{fontWeight:'500'}}>&nbsp;&nbsp; After </label>&nbsp;&nbsp;
                  <input 
                  type="number"
                  min="1"
                  id="endCount"
                  value={this.state.endCount} 
                  onChange ={ this.handleEndCount.bind(this) }
                  onBlur={ this.handleEndCount.bind(this) } 
                  disabled={this.state.disableAfter}
                  style={{width:'40px',fontWeight:'500'}}/>&nbsp; occurence <br/>

              </div>

              <div style={{marginTop:10}}>
 
                <input type="radio" id="ondate" value="ondate" checked={this.state.repeatEndsOption === 'ondate'?true:false} onChange={this.handleChangeEndOption.bind(this)} style={{float:'left'}}/>
                <label htmlFor="ondate" style={{fontWeight:'500', float:'left'}}><span style={{float:'left'}}>&nbsp;&nbsp; On</span> </label>
                <FormGroup controlId="valueEnd" className="datePick" style={{margin:'-6px 0 15px 56px'}}>
                  <DatePicker
                    dateFormat="MM/DD/YYYY"
                    value={this.state.valueEnd}
                    disabled={this.state.valueEndDisable}
                    //minDate={this.state.valueStart}
                    onChange={this.handleChangeTo.bind(this)}/>
                </FormGroup>
                {this.state.displayEndError?endErrorMsg:''}
              </div>
          </div>

        </div>         

        <div style={{backgroundColor:'#4C58A4', height:'55px',display:'flex', flexDirection:'row-reverse', padding:'6px 9px 6px 0'}}>

          <Button onClick={this.doneFunction.bind(this)} className={footerBtn}>Done</Button>
          {'        '}
          <Button onClick={this.close.bind(this)} className={footerBtn}>Cancel</Button>
        </div>
       </div>
      </div>
      :
      ''
    }
            </div> 
          </div>
        </div>
      );
    }  
 }

export default  CustomScheduleComponent