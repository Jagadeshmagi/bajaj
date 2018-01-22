import React from 'react'
import {getProjects,getIAMRoleStatus} from 'helpers/assetGroups'
import {Popover, Button ,Col, FormControl, FormGroup,ControlLabel, OverlayTrigger , Radio} from 'react-bootstrap'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import Joi from 'joi-browser'
import {footerBtn,selectStyle} from 'sharedStyles/styles.css'
import {getAccountListCloud} from 'helpers/assetGroups'

const AWSCloudDetails = React.createClass({
getInitialState() {
   return {
   		projectloading:false,
		zonesloading:false,
		projects : [],
		project :[],
		zoness : [],
		projectselected:[],
		zonesselected:[],

   		accessKeyInputType:"password",
		secretKeyInputType:"password",

		instanceCredential:false,
		IAMRoleStatus:false,
		IAMRoleRadioOption:'',
		IAMRoleName:"",
		accesstKeyFontFamily :'Source Sans Pro',
		secretKeyFontFamily :'Source Sans Pro',
	    CloudTypeOptions:[
	      { value: "Aws", label: "AWS" },
	      { value: "Google", label:"Google Cloud" },
	      { value: "Azure", label:"Microsoft Azure" }
	    ],
	    // projects:[],
	    zones:[],
			projectId:[],
			zones: [],
	    accountselected:'',
			projectObj: {},
			projectList:[]
   }
},


newGetProject(accountselected){
	let populatedproject=[];
	let populatedprojectValue=[];
	getProjects(accountselected)
	.then((project)=>{
			this.setState({
				projectObj:project,
				projectList:project.projects
			})
			// populatedproject.push({value:"Select Project",label:"Select Project"});
			project.projects.map(function(x){
				let key = Object.keys(x)[0];
				let value = x[key]
					populatedproject.push({value:value,label:value});
					populatedprojectValue.push(value);
				 })
			// populatedproject.push({value:"All Projects",label:"All Projects"});
				this.setState({projects:populatedproject, ProjectList:project.projects,
								projectloading:false},function(){
									// this.setState({projectselected:populatedproject[0].value},function (){
									// 	this.getallzoness(accountselected);
									// })
								});
				this.setState({project:populatedprojectValue});
		//  this.props.setInputData("projects",populatedproject);
		//  this.props.setInputData("projectselected",populatedproject[0].value);
		//  this.props.setInputData("project",populatedprojectValue);
	})
	.catch((project)=>{
			this.setState({
				projectObj:project,
				projectList:project.projects
			})
			// populatedproject.push({value:"Select Project",label:"Select Project"});
			project.projects.map(function(x){
				let key = Object.keys(x)[0];
				let value = x[key]
					populatedproject.push({value:value,label:value});
					populatedprojectValue.push(value);
				 })
			// populatedproject.push({value:"All Projects",label:"All Projects"});
				this.setState({projects:populatedproject, ProjectList:project.projects,
								projectloading:false},function(){
									// this.setState({projectselected:populatedproject[0].value},function (){
									// 	this.getallzoness(accountselected);
									// })
								});
				this.setState({project:populatedprojectValue});
		 this.props.setInputData("projects",populatedproject);
		 this.props.setInputData("projectselected",populatedproject[0].value);
		 this.props.setInputData("project",populatedprojectValue);
	})
},

 componentWillReceiveProps(nextProps){
    //++++Updating score when route params changes +++++++++++
    if(nextProps.accountSelected != this.props.accountSelected){
      this.setState({accountselected:nextProps.accountSelected})
      this.newGetProject(nextProps.accountSelected)
 	}
  },

componentWillMount(){

},

getallzoness(accountselected){
	var projecttobesent=this.state.projectselected;
	let selectedZone = [];
    this.setState({zonesselected:[]});
    this.props.setInputData("zonesselected",selectedZone);

    /*if(this.state.projectselected==null||this.state.projectselected==""){
    	this.setState({projectselected:"All Projects"});
    	this.props.setInputData("projectselected","All Projects");
    }*/
    if(this.state.projectselected!=""){
		this.setState({zonesloading:true});

		if(this.state.projectselected=="All Projects"){
			projecttobesent = this.state.project;
		}
		// getZones(accountselected,projecttobesent)
		// .then(
		//   (response) => {
		// 	let populatedzones=[];
		// 	response.map(function(x){
		// 	  populatedzones.push({value:x,label:x});
		// 	})
		// 	this.setState({zoness:populatedzones});
		// 	this.setState({zonesloading:false});
		//   })
		// .catch((error) => {
		// 	this.setState({zoness:[]});
		// 	this.setState({zonesloading:false});
		// })
    }
},

formattedZone(zones){
	let zonesNew = []
  zonesNew.push({value:"All Zones",label:"All Zones"});
	zones.map(function(item){
		zonesNew.push({label: item, value: item})
	})
	return zonesNew
},

handleproject(value){
	let projectselected = []
	projectselected.push(value)
	this.setState({
		projectselected:value
	})
	this.props.setInputData("projectId",value);

	let projectList = this.state.projectList;
	projectList.filter(function(item){
		if(value === item.project){
      this.setState({zones:item.zones})
			let formattedZones = this.formattedZone(item.zones)
			this.setState({
				zoness:formattedZones
			})
		}
	}.bind(this))
	// const valueData = value.toString().split(',');
	// var flag=0;
	// if(valueData!=null||valueData!=""){
	// 	for(let i=0;i<valueData.length;i++){
	// 		if(valueData[i]==="All Projects"){
	// 			flag=1;
	// 			break;
	//
	// 		}
	// 	}
	//
	// }
	// if(flag===1){
	// 	value=[];
	// 	this.refs.projectinfo.show();
	// 	value.push("All Projects")
	// }
	// else{
	// 	this.refs.projectinfo.hide();
	// }
	//
  // 	this.setState({projectselected:value},function(){
	//
	//     this.props.setInputData("projectselected",value);
	// 	/*if(this.state.projectselected==null ||this.state.projectselected=="")
	// 	{
	// 		value=[];
	// 		value.push("All Projects")
	// 		this.props.setInputData("projectselected",value);
	// 	} */
	//   	if(this.state.projectselected==""){
	//      	this.setState({zoness:[]});
	//      	this.setState({zonesselected:[]});
	//      	this.props.setInputData("zonesselected",[]);
	//      	this.getallzoness(this.state.accountselected);
	//  	}
	//   	if(this.state.IAMRoleStatus==true&&this.state.projectselected!=""){
	// 	    if(this.state.IAMRoleRadioOption=='accessrole'){
	// 	      this.getallzoness(this.state.accountselected);
	// 	    }
	// 	    else{
	// 	      console.log("dont no should we call getzoness");
	// 	    }
	//   	}
	// 	else if(this.state.IAMRoleStatus==false&&this.state.projectselected!=""){
	//      	this.getallzoness(this.state.accountselected);
	//  	}
  // 	});

},

handlezones(value){
  	//this.state.zonesselected=value;
    let valueArray

    if(value =="All Zones"){
      this.setState({zonesselected:value.split(",")});
      valueArray= this.state.zones
    } else {
      valueArray= value.split(",")
      this.setState({zonesselected:valueArray});
    }
    this.props.setInputData("zonesselected",valueArray);
},

awsTagEnable:function (changeEvent) {
   	if(changeEvent.target.checked===true){
       	//this.setState({awTagValue:true},() => console.log("this.state.awTagValue"+this.state.awTagValue));
       	this.props.setInputData("awTagValue",true);
    }
   	else{
       	//this.setState({awTagValue:false},() => console.log("this.state.awTagValue"+this.state.awTagValue));
       	this.props.setInputData("awTagValue",false);
    }
},

handleRolename(){
	this.props.setInputData("roleName",rolename.value);
},

hideInfoPopup(){
   this.refs.projectinfo.hide()
},

render() {

	let validations = this.props.validations;
	let inputStyle = {width:326,height:40,borderRadius:0}
	let toolTipStyle = {color: 'black',borderWidth: 2,borderRadius:0,width:200}

    const tooltipProjectwarning = (
      <Popover style={{...toolTipStyle,height:135}}><div className="pull-right"><a href="javascript:void(0)" style={{fontSize:'18px'}} onClick={this.hideInfoPopup}>x</a></div><span style={{color:'red'}}>Warning !</span><br />Selecting "All projects" will result in longer discovery time. Please avoid using this option unless its required.  </Popover>
    );
	return(
    <div className="row " style={{margin:'0px', width:'100%',backgroundColor:'#F9FAFC'}}>
     <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
     </div>
     <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">

     	 <FormGroup controlId="cloudProjectSelect" style={{display:'inline-block'}}>
              <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Project List </ControlLabel>

               <OverlayTrigger ref="projectinfo" trigger="hover"  placement="right" overlay={tooltipProjectwarning}>

                 <Select  id="cloudProjectSelect"  placeholder={<i>Select Project</i>}
	                name=""
	                value={this.state.projectselected}
	                options={this.state.projects}
	                clearable={true}
	                searchable={true}
	                allowCreate={true}
	                isLoading={this.state.projectloading}
	                onChange={this.handleproject}/>
	             </OverlayTrigger>
            </FormGroup>

            <FormGroup controlId="zonesselect">
              <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Zones</ControlLabel>
              <Select id="zonesselect"  placeholder={<i>Select Zones</i>}
                name=""
                value={this.state.zonesselected}
                options={this.state.zoness}
                multi={true}
                clearable={true}
                searchable={true}
                allowCreate={true}
                isLoading={this.state.zonesloading}
                onChange={this.handlezones}/>
            </FormGroup>
    </div>
  </div>
    )
}

})

export default AWSCloudDetails
