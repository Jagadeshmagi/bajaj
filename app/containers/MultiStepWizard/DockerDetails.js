import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import {Popover,Tooltip,Button,FormControl,FormGroup,ControlLabel,OverlayTrigger} from 'react-bootstrap'
import {footerBtn} from 'sharedStyles/styles.css'
import {footerDivContainer} from './styles.css'
import Joi from 'joi-browser'
import putDockerImage from 'helpers/docker'
import AlertComponent from 'components/Common/AlertComponent'


const DockerDetails = React.createClass ({
getInitialState() {
   return {
	saving:false,
	loadmsgnextstep:"Next Step",
	loadingmsgdiscovery:"Discover Image",
	imageId: -1,
	imagelabel:"",
	registryUrl:"",
	usernameValidateState:'',
	passwordValidateState:'',
	borderusername:'1px solid #4C58A4',
	borderpassword:'1px solid #4C58A4',
  passType:"password",
  showPwdDescription:"Show characters",
	validations:{

		imageName:{
			valid:false,
			validationState:'',
			error:'Provide a name for this image. The image name is a unique name used to differentiate  from one another.',
			border:'1px solid #4C58A4',
			height:135,
			showTooltip:'hover',
			schema:{"Image Name":Joi.string().required()}
		},


	}

   }
},
contextTypes: {
    router: React.PropTypes.object.isRequired
  },
componentDidMount(){
	this.hideInfoPopup();

},

charecterShowHide(){
 if(this.state.passType==="password")
 {
   this.setState({passType:"text"});
   this.setState({showPwdDescription:"Hide characters"});
 }
 else
 {
   this.setState({passType:"password"});
   this.setState({showPwdDescription:"Show characters"});
 }
},

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
},



validateNameofImage:  function(){
  	let result = Joi.validate({"Image Name":imagename.value}, this.state.validations.imageName.schema);

  	if (result.error) {
		let imageNameValidation = this.getValidationStateObj("imageName",false,result.error.details[0].message)
		imageNameValidation.height = 80
		this.setState({validations:{...this.state.validations,imageName:imageNameValidation}},()=>this.refs.toolipname.show())
 	 }else{
		let imageNameValidation = this.getValidationStateObj("imageName",true,'')
		this.setState({validations:{...this.state.validations,imageName:imageNameValidation}},()=>this.refs.toolipname.hide())
  	}
},

getValidationStateObjForPrivate(key,valid){

	let validationObj = Object.assign({},this.state.validations[key])
	validationObj.valid=valid

	return validationObj
},


handleRegistryUrl:function (changeEvent){
	/*
	if(changeEvent.target.value!=""){

		if(username.value==""||passwordfeild.value==""){

			let validationObj = this.getValidationStateObjForPrivate("userName",false);
			let validationObjPassWord = this.getValidationStateObjForPrivate("passwordFeild",false)
			this.setState({validations:{...this.state.validations,userName:validationObj,passwordFeild:validationObjPassWord}})

		}


	}
	else{

		let validationObj = Object.assign({},this.state.validations["userName"])
		validationObj.valid=true;
		this.setState({validations:{...this.state.validations,userName:validationObj}},function(){

			let validationObjPassWord = Object.assign({},this.state.validations["passwordFeild"])
			validationObjPassWord.valid=true;
			this.setState({validations:{...this.state.validations,passwordFeild:validationObjPassWord}})

		});

	}*/

},

isFormValid(){
	let validations = this.state.validations;
	return (validations.imageName.valid)
},

  showAlert(msg){
    Alert.show(msg);
  },



saveAsset(saveCompleteCallback){

	putDockerImage(imagename.value,username.value,passwordfield.value)
	.then((response) => {
		console.log("added image")
		console.log(JSON.stringify(response))
		let assetID=parseInt(response.id , 10 );
		let name=imagename.value;

		this.setState({imageId:response.id,imagelabel:name},function(){
			return saveCompleteCallback(null)
		})
	})
	.catch((error) => {


		return saveCompleteCallback(error)
	})

},

nextstepfunction(ev){
	let _this = this;
	function saveCompleteCallback(error){
		_this.setState({saving:false,loadmsgnextstep:"Next Step"});
		if(error === null){
			_this.props.loadDockerPolicyPacks(_this.state.imageId);

		}
		else{
			if(error.data && error.data.status != null && error.data.status==400){
				if(error.data && error.data.message.indexOf("Invalid credentials")!=-1){
					/*let imageNameValidation = this.getValidationStateObj("imageName",false,'Duplicate name')
					imageNameValidation.height = 55
					this.setState({validations:{...this.state.validations,imageName:imageNameValidation}},()=>this.refs.toolipname.show())
					*/
					_this.refs.userinfo.show()
   					_this.refs.passwordinfo.show()
   					_this.setState({usernameValidateState:'error',passwordValidateState:'error',borderusername:'1px solid #FF444D',borderpassword:'1px solid #FF444D'})
					//_this.showAlert("Invalid Credentials")

				}
				if(error.data && error.data.message.indexOf("Image does not exist")!=-1){
					let imageNameValidation = _this.getValidationStateObj("imageName",false,error.data.message)
					imageNameValidation.height = 80
					_this.setState({validations:{..._this.state.validations,imageName:imageNameValidation}},()=>_this.refs.toolipname.show())


					//_this.showAlert("Image does not exist")

				}
		  }
		}
	}
	if (!this.isFormValid())
	{
		this.state.loadmsgnextstep="Next Step";
		ev.preventDefault();
		return false;
	}else
	{
		this.setState({saving:true,loadmsgnextstep:"Saving ..."});
		this.saveAsset(saveCompleteCallback)
	}
},
hideInfoPopup(){
   this.refs.userinfo.hide()
   this.refs.passwordinfo.hide()
},
usernameChange(e){
   if(e.target.value==""){
   	this.refs.userinfo.hide()
	   //this.refs.passwordinfo.hide()
	this.setState({usernameValidateState:'',borderusername:'1px solid #4C58A4'})

   }else{
	   this.refs.userinfo.hide()
	   //this.refs.passwordinfo.hide()
	   this.setState({usernameValidateState:'success',borderusername:'1px solid #00C484'})
   }
},
passwordOnchange(ev){
   if(ev.target.value==""){
	   	this.refs.passwordinfo.hide()
		   //this.refs.passwordinfo.hide()
		this.setState({passwordValidateState:'',borderpassword:'1px solid #4C58A4'})

   }else{
   		//this.refs.userinfo.hide()
	   this.refs.passwordinfo.hide()
	   this.setState({passwordValidateState:'success',borderpassword:'1px solid #00C484'})
	}
},

render(){

    let validations = this.state.validations;
    let enableNextStep =!(!this.state.saving&&(validations.imageName.valid));
	let enableDiscovery =!(!this.state.saving&&(validations.imageName.valid));

    const tooltipImageName = (
      <Popover   style={{height:validations.imageName.height,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{validations.imageName.error}</Popover>
    );
    const tooltipUserwarning = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:65}}> Invalid Username</Popover>
    );
    const tooltipPasswordwarning = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:65}}> Invalid Password</Popover>
    );


	const CloudMultiStepFooter=(

     <div className={footerDivContainer}>
      <br/>
      <br/>
      <div>
      <div className="col-lg-8"> </div>
        <div className="col-lg-4">

          <Button disabled={enableNextStep} onClick={this.nextstepfunction} href='javaScript: void(0)' className={footerBtn} >{this.state.loadmsgnextstep}</Button>
           <AlertComponent ref={(a) => global.Alert = a}/>
        </div>
        </div>
    </div>
    );
    return(
	<div>
    <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#F9FAFC'}}>
     <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
     </div>
     <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
       <form >

        <FormGroup  controlId="imagename" validationState={validations.imageName.validationState}>
          <ControlLabel  className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Image Name: </ControlLabel>
          <OverlayTrigger ref="toolipname"  trigger={validations.imageName.showTooltip} placement="right" overlay={tooltipImageName}>
            <input id="imagename" type="text" placeholder="Provide image name" style={{padding:'12px',width:326,height:40,borderRadius:0,border:validations.imageName.border}}  onBlur={this.validateNameofImage}/>
          </OverlayTrigger>
        </FormGroup>
       </form>

     </div>
    </div>

     <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#EDF2F8'}}>
       <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4"> </div>

       <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">

        <br />
        <form>

        <FormGroup controlId="Credentials">
          <ControlLabel style={{fontSize:'15px'}} >CREDENTIALS</ControlLabel>
        </FormGroup>


        <FormGroup  controlId="username" validationState={this.state.usernameValidateState}>
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>User Name: </ControlLabel>
           <OverlayTrigger ref="userinfo" trigger=""  placement="right" overlay={tooltipUserwarning}>
              <input id="username" type="text" placeholder="User Name" style={{padding:'12px',width:326,height:40,borderRadius:0,border:this.state.borderusername}}  onChange={this.usernameChange}/>

    		</OverlayTrigger>
        </FormGroup>


        <FormGroup  controlId="passwordfield" validationState={this.state.passwordValidateState}>
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Password: </ControlLabel>

     	   <OverlayTrigger ref="passwordinfo" trigger=""  placement="right" overlay={tooltipPasswordwarning}>
             <input id="passwordfield" type={this.state.passType} placeholder="Password" style={{padding:'12px',width:326,height:40,borderRadius:0,border:this.state.borderpassword}} onChange={this.passwordOnchange}/>
      		</OverlayTrigger>
          <div  style={{width:'326px',marginLeft:15, marginBottom:15,textAlign:'right', }}>
            <a style={{cursor: "pointer",fontFamily:"Source Sans Pro",fontSize:'15px', paddingRight:"15px"}} onClick={this.charecterShowHide}>{this.state.showPwdDescription}</a>
          </div>
        </FormGroup>



       {/* <FormGroup  controlId="email">
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Email: </ControlLabel>
          <input id="email" type="text" placeholder="Enter Email" style={{padding:'12px',width:326,height:40,border:'1.5px solid #4C58A4',borderRadius:0}}/>
        </FormGroup>*/}

       </form>
      </div>
     </div>

    {CloudMultiStepFooter}
	</div>
    )
}
});

export default DockerDetails
