import React, { Component, PropTypes } from 'react'
import {ResourceCredentials} from './ResourceCredentials'
import {Glyphicon,Popover,Tooltip, Table, ButtonToolbar,ButtonGroup, Button , SplitButton , MenuItem,Col, FormControl, FormGroup,ControlLabel, HelpBlock, OverlayTrigger ,Checkbox, Radio} from 'react-bootstrap'
import { navbar,footerBtn } from 'sharedStyles/styles.css'
import {PolicyPacks} from './PolicyPacks'
import {emailb,italic1,divContainer,footerDivContainer,customHrBefore,toDoCircle,inProgressOuterCircle,inProgressInnerCircle,completedInnerCheckMark,completedOuterCircle} from './styles.css'
import Joi from 'joi-browser'
import ReactDOM from 'react-dom'
import {spanstyle,divstyle,inputclass} from './styles.css'

const Emailboxtext = React.createClass ({
  getInitialState() {
    return {
    spanshow:false,
    emailList:[],
    textareawidth:'626px',
    Email_error:'',
    Email_validation:'',
    tooltipEmailText:'Email is required. ',
    tooltipEmailBorder:'black',
    emailBorderColor:'1px solid #4C58A4',
    emailToolTipTrigger:['hover','focus'],
    emailCheckboxChecked:true,
    textboxWidth:50,
    divWidth:80,
    
  }
},

componentDidMount(){
  this.setState({emailList:this.props.emails,
                emailBorderColor:this.props.emailBorderColor,
                emailCheckboxChecked:this.props.emailCheckboxChecked});
},

componentWillReceiveProps(nextProps,nextState){
  if(nextProps.emailBorderColor!= this.props.emailBorderColor){
    this.setState({emailBorderColor:nextProps.emailBorderColor},function(){
      if(this.state.emailBorderColor == '1px solid red'){
        this.setState({tooltipEmailText:'Email is required'})
        this.setState({emailToolTipTrigger:['hover','focus']})
        this.refs.toolTipEmail.show();
      }
    })
  }

  if (nextProps.emails != this.props.emails){
    this.setState({emailList:nextProps.emails,
                  notifyByEmail:this.props.notifyByEmail});
  }
},

validateemail(email){
  if(this.state.emailList.length==0||(this.state.emailList.length>0&&email!="")){

    let Email_schema = {
      Emailtext: Joi.string().regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    };
    let result = Joi.validate({Emailtext: email}, Email_schema)
    if (result.error) {
      this.setState({Email_error : result.error.details[0].message,
                    Email_validation: 'error',
                    tooltipEmailText:'Invalid Email',
                    emailBorderColor:'1px solid red'},function(){
                      this.setState({emailToolTipTrigger:['hover','focus']})
                      this.refs.toolTipEmail.show();
                    })
      return false
    } else {
      this.setState({Email_error: 'Valid Key',
                    Email_validation : 'success',
                    emailToolTipTrigger:'manual',
                    emailBorderColor:'1px solid #4C58A4'
        })
      this.refs.toolTipEmail.hide();
      return true
    }
  }
},

handleKeyUp(e){
  let separators = [',', ';', 'Enter','\n','\r',' '];
  if (separators.indexOf(e.key) > -1) {
    let newList = this.state.emailList.slice();
    let eList = e.target.value.split(new RegExp(separators.join('|'), 'g'));

    eList.map((email) => {
      let index = this.state.emailList.indexOf(email)
      if(index === -1 && this.validateemail(email)){
        newList.push(email);
      }
    })
    this.setState({emailList:newList});
    e.target.value = "";
    this.props.updateEmails(newList,"");
  }
},

/*handleInput(e){
  if(e.target.value==''){
    this.refs.toolTipEmail.show();
    this.setState({emailBorderColor:'1px solid red',
                  emailToolTipTrigger:['hover','focus']})
  }else{
    this.refs.toolTipEmail.hide();
    this.setState({emailBorderColor:'1px solid #4C58A4',
                  emailToolTipTrigger:'manual'})
  }
},
*/
removeEmail(e){
  let emailVal = e.target.id;
  let index = this.state.emailList.indexOf(emailVal)
  let newList = this.state.emailList.slice();
  if (index > -1)
  {
    newList.splice(index,1);
  }
  this.setState({emailList: newList})
  this.props.updateEmails(newList,"");
},
handleBlur(e){
  console.log(e.target.value)
  let newList = this.state.emailList.slice();
  let eList = e.target.value
  this.setState({divWidth:((e.target.value.length+1)*8)+30,textboxWidth:(e.target.value.length+1)*8})

  let index = this.state.emailList.indexOf(eList)
  if(index === -1 && this.validateemail(eList)){
    newList.push(eList);
    e.target.value = "";   
  }
  else{
    this.refs.toolTipEmail.hide();
    if(e.target.value==""){
      if(this.state.emailList.length>0)
       this.setState({emailBorderColor:'1px solid #4C58A4',
                  emailToolTipTrigger:false})
      else
        this.setState({emailBorderColor:'1px solid red',
                    emailToolTipTrigger:false})
     }
   }


  this.setState({emailList:newList});
  //e.target.value = "";
  this.props.updateEmails(newList,e.target.value);
},


onChangeEmail(indexOfnewEmail,e){   
  var myId = e.target.id
  let newText=e.target.textContent.substring(0,e.target.textContent.length-2)
  let newList = this.state.emailList.slice();  
  let eList1 = newText.trim()
  let eList = eList1.replace(/\n/g, ''); 
  let index = this.state.emailList.indexOf(eList)

  if(index === -1 && this.validateemail(eList)){     
      newList[indexOfnewEmail]=eList;
      this.setState({emailList:newList})
      this.props.updateEmails(newList,"");
  
  }
  else{
    e.preventDefault()
     if(e.target.value==""){
       this.refs.toolTipEmail.hide();
       if(this.state.emailList.length>0)
        this.setState({emailBorderColor:'1px solid #4C58A4',
                   emailToolTipTrigger:false})
       else
         this.setState({emailBorderColor:'1px solid red',
                     emailToolTipTrigger:false})
       
      }
     /*if(index >= 0){
       this.refs.toolTipEmail.show();
       this.setState({tooltipEmailText:"Already entered.",
                      emailBorderColor:'1px solid red',
                      emailToolTipTrigger:true})

     }*/

     //code when we press only enter
       eList=eList+' '  
       newList[indexOfnewEmail]=eList;
       this.setState({emailList:newList},function(){
        eList=eList.trim();
      
       newList[indexOfnewEmail]=eList;
       let unique = newList.filter((set => f => !set.has(f) && set.add(f))(new Set));
       this.setState({emailList:unique})
       this.props.updateEmails(unique,"");

     });
    //code when we press only enter
     
  
  } 
    document.getElementById(myId).style.backgroundColor = '#EDF2F8'
    document.getElementById(myId).style.border = '1px solid gray'
    document.getElementById(myId).getElementsByTagName("a")[0].style.display='inline-block'
  
  /* this.setState({
     emailList : { ...this.state.emailList, [indexOfnewEmail]: e.target.value }
    });*/

},

onEnterKey(indexOfnewEmail,e){
  var myId = e.target.id
  var anchorid=document.getElementById(myId);
    if (e.charCode === 13) {
      document.getElementById(myId).style.backgroundColor = '#EDF2F8'
      document.getElementById(myId).style.border = '1px solid gray'
      anchorid.getElementsByTagName("a")[0].style.display='inline-block'        
      this.onChangeEmail(indexOfnewEmail,e)
    }
    else{
    document.getElementById(myId).style.backgroundColor = 'white'
    document.getElementById(myId).style.border = 'none'
    anchorid.getElementsByTagName("a")[0].style.display='none'
   }   

},
myFunction(e){ 
  var myId = e.target.id 
  var anchorid=document.getElementById(myId);
   document.getElementById(myId).style.backgroundColor = "white";
   document.getElementById(myId).style.border = 'none'  
   anchorid.getElementsByTagName("a")[0].style.display='none'

},

render() {
  const textdata =(
    this.state.emailList.map(function(data,index)
    {
      return (
        <div onKeyPress={(e)=>this.onEnterKey(index,e)}  onClick={this.myFunction} onBlur={(e)=>this.onChangeEmail(index,e)} contentEditable='true' style={{display:'inline-block',padding:'3px',margin:'5px',borderRadius:'3px',border:'1px solid gray',height:'30px',backgroundColor:"#EDF2F8",}} id={data} key={data} >
          {data}&nbsp;  <a href="javascript:void(0)" id={data} onClick={this.removeEmail}  style={{cursor:'pointer',color:'gray'}}>x</a>
        </div>
      )
    }.bind(this))
  );

  const tooltipEmailPopover = (
      <Popover style={{height:40,color:'black',borderWidth: 2,
                      borderRadius:0,width:150}}>
        {this.state.tooltipEmailText}
      </Popover>
  );

  return (
    <div><div>Email(s):</div>
      <OverlayTrigger ref="toolTipEmail" trigger={this.state.emailToolTipTrigger} placement="right" overlay={tooltipEmailPopover}>
        <div style={{padding:'3px',marginBottom:'10px',float:'left',width:'326px',height:'85px',border:this.state.emailBorderColor,overflowY:'auto', backgroundColor:'#fff'}}>
          {textdata}
          <input type="text" onKeyUp={this.handleKeyUp} onBlur={this.handleBlur} style={{padding:'5px',height:'30px',border:'0px'}}/>
        </div>
      </OverlayTrigger>
    </div>
    );
  }
})

export {Emailboxtext}
