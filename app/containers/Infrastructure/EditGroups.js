import React, {PropTypes} from 'react'
import { Col,modalContainer,headerContainerForEdit,backgroundSet,infoCircle,footerDivContainer,modalCloseStyle1} from './styles.css'
import {selectStyle,blueBtn, btnPrimary} from 'sharedStyles/styles.css'
import getCredentialsList from 'helpers/credentials'
import Joi from 'joi-browser'
import ReactDOM from 'react-dom'
import {Button, ButtonToolbar, Modal, FormGroup,FormControl, ControlLabel,OverlayTrigger,Popover } from 'react-bootstrap'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import {getassetforedit,getAssetGroup,assetupdate,updateOnPremAsset,assetgroupupdate,addScheduleTemplateToGroup,removeScheduleTemplateFromGroup} from '../../../app/helpers/assetGroups';
import {getRegions,getIAMRoleStatus,getVpcs} from '../../../app/helpers/assetGroups'
import loadingImage from 'assets/Loading_icon.gif'
import {WizHeader} from 'containers/MultiStepWizard/WizardHeader'
import {Tags} from 'containers/MultiStepWizard/tags'
import {ResourceCredentialsListEdit} from 'containers/MultiStepWizard/ResourceCredentialsListEdit'
import {getScanSchedules} from 'helpers/schedules'
import {SpinnyLogo} from 'containers'
import { connect } from 'react-redux'
import {getMonitorAccountDetails} from 'helpers/alerts'
import {getAccountListCloud,getRegionList,getProjects,updateMonitorAcountForGroup} from 'helpers/assetGroups'

const EditGroups = React.createClass({
 getInitialState() {
    return {
      validations:{
          groupName:{
            valid:false,
            validationState:'',
            error:'Provide a name for this group. The group name is a unique name used to differentiate resource groups from one another.',
            border:'1px solid #4C58A4',
            height:135,
            showTooltip:'hover',
            schema:{"Group Name":Joi.string().max(32).required()}
          },
          cloudType:{
            valid:true,
            validationState:'',
            error:'Select your cloud provider. Please note, only one cloud type can be selected for each group.',
            border:'1px solid #4C58A4',
            showTooltip:'hover',
            schema:{"Cloud Type":Joi.string().required()}
          },
          accessKey:{
            valid:false,
            validationState:'',
            error:'Provide valid Access Key ID associated with this AWS account.',
            border:'1px solid #4C58A4',
            showTooltip:'hover',
            schema:{"Access Key":Joi.string().required()}
          },
          secretKey:{
            valid:false,
            validationState:'',
            error:'Provide valid Secret Access Key associated with this AWS account.',
            border:'1px solid #4C58A4',
            showTooltip:'hover',
            schema:{"Secret Key":Joi.string().required()}
          },
          startIP:{
            valid:false,
            validationState:'',
            error:'Enter a valid ip address.',
            border:'1px solid #4C58A4',
            showTooltip:'hover',
            schema:{"Starting IP":Joi.string().required()}
          },
          endIP:{
            valid:false,
            validationState:'',
            error:'Enter a valid ip address.',
            border:'1px solid #4C58A4',
            showTooltip:'hover',
            schema:{"Ending IP":Joi.string().required()}
          } ,
    },
    showEditModal: false ,
    showcloud:false,
    showiprange:false,
    modaltitle:"",
    passType:"password",
    regionloading:false,
    regionselected:[],
    regions:[],
    region:[],
    vpcselected:[],
    vpcs:[],
    vpcloading:false,
    grouplabel:"",
    groupAccountName:"",
    descriptionofgroup:"",
    idasset:-1,
    loadingdiv:true,
    selectedCredIdList:[],
    templatesList:[],
    selectedTemplate:'',
    groupType:'Cloud',
    showhideforaccess:"Show characters",
    fontfamilyforaccess:"Source Sans Pro",
    fontfamilyforsecret:"Source Sans Pro",
    credidsforedit:[],
    savebuttondisability:true,
    disablegroupname:false,
    tags:[],
    IAMRoleStatus:false,
    IAMRoleRadioOption:'',
    IAMRoleName:"",
    instanceCredential:false,
    projectloading:false,
    zonesloading:false,
    projects : [],
    project :[],
    zoness : [],
    projectselected:[],
    zonesselected:[],
    zones:[],
    projectId:[],
    zones: [],
    accountselected:'',
    projectObj: {},
    projectList:[],
    instanceChecked:false,
    containerChecked:false,
    clusterChecked:false,

  };
},
componentWillMount(){
  let templatesListValue = {label:'',value:''}, templatesList=[]
  getScanSchedules()
  .then((responseData) => {
    if(responseData.scanschedules != null && responseData.scanschedules.length>0)
    {
      templatesListValue = {label:'Not Scheduled',value:''}
      templatesList.push(templatesListValue)          
    }
    responseData.scanschedules.map((val,key)=>{
      console.log('val ', val)
      templatesListValue = {label:'',value:''}
      templatesListValue.label= val.label
      templatesListValue.value = val.label
      templatesList.push(templatesListValue)          
    })
    console.log('templatesList', templatesList)
    this.setState({templatesList:templatesList})
  })
  .catch((error) => console.log("error in getting the templates list"))
},


onChangeInstance(e){
  if(e.target.checked==true){
    this.setState({instanceChecked:true})
    
  }
  else{
    this.setState({instanceChecked:false})
   

  }
  
},
onChangeContainers(e){
  if(e.target.checked==true){
    this.setState({containerChecked:true})
   
  }
  else{
    this.setState({containerChecked:false})
   

  }
  
},
onChangeClusetrs(e){
  if(e.target.checked==true){
    this.setState({clusterChecked:true})
   
  }
  else{
    this.setState({clusterChecked:false})
    

  }
  
},


handleregion(newvalue){
  this.state.regionselected=newvalue;
  if(this.state.regionselected==""){
    this.setState({vpcs:[]});
    this.setState({vpcselected:[]});
  }
  if(this.state.instanceCredential==false){
    if(this.state.regionselected!=""){
      this.getallvpcs(this.state.groupAccountName);
    }
  }

},

getallregions(cloudAccountName){
    this.setState({regionselected:[]});
    if(cloudAccountName!=""){
      this.state.regionloading=true;

      getRegionList(cloudAccountName)
      .then((response)=>{
        if(response.regions){
        let populatedregion=[];
        let populatedreg=[];

        response.regions.map(function(keyobj){
          var oneRegion=keyobj;

          for (var key in oneRegion) {
            if (oneRegion.hasOwnProperty(key)) {
              populatedregion.push({value:oneRegion[key],label:key});
                populatedreg.push(oneRegion[key]);
            }
          }
         })
         this.setState({region:populatedregion,regionloading:false},function(){
          this.getallvpcs(cloudAccountName)
          })

      }
      else if(response.output){
         this.setState({region:[]});
         this.setState({regionloading:false});
      }

      })
      .catch((error)=>{

        console.log("get regions error in container"+JSON.stringify(error));
        if(error != null && error.status != null && error.status==400){

          if(error.data.message.indexOf("Invalid Aws Credentials Exception: Not a valid AK or SK")!=-1){
             this.setState({region:[]});
             this.setState({regionloading:false});

          }
        }
      })
    }
},




getallvpcs(accountName){

  if(this.state.regionselected!=""){
    this.setState({vpcloading:true});
    getVpcs(accountName,this.state.regionselected)
     .then(
      (response) => {
        console.log("vpcs "+response);
        let populatedvpc=[];
        response.map(function(x){
          populatedvpc.push({value:x,label:x});
        })
        this.setState({vpcs:populatedvpc});
        this.setState({vpcloading:false});
      })
     .catch((error) => {
      console.log("Error in getVpcs " + error)
      this.setState({vpcs:[]});
      this.setState({vpcloading:false});
    })
  }

},

populateGroupData(assetGroup){
  this.state.idasset=assetGroup.assetId;
  this.state.modaltitle=assetGroup.name;
  this.setState({grouplabel:assetGroup.name});
  this.setState({descriptionofgroup:assetGroup.description});

  groupid.value=assetGroup.name;

  descriptiongroupid.value=assetGroup.description;


  this.setState({selectedTemplate:assetGroup.templeteName})
  this.state.disablegroupname=true;

},
populateAssetData(asset){
  this.state.groupType=asset.assettype;
  let regionedit=[];
  if(asset.assettype=='Aws'){
    this.setState({showcloud:true});
    this.setState({groupAccountName:asset.cloudAccountName[0]},function(){
     groupAccountName.value=asset.cloudAccountName[0];
    })
    /*this.setState({instanceCredential:asset.instanceCredentials},function(){
      if(this.state.instanceCredential == true){
        this.setState({IAMRoleRadioOption:'iamrole'});
      }
      else if(this.state.instanceCredential == false && this.state.IAMRoleStatus==true){
        this.setState({IAMRoleRadioOption:'accessrole'});
      }
    });*/
   /* if(this.state.instanceCredential == false){
      secretaccesskeyedit.value=asset.secretAccessKey;
      accesskeyedit.value=asset.accessKey;
    }*/
    this.setState({
      credidsforedit:asset.credentialids,
      selectedCredIdList:asset.credentialids
    })

     if(this.state.instanceCredential == false){
        this.getallregions(asset.cloudAccountName[0]);
    }
    /*else{
      //this.newGetRegion(asset.cloudAccountName[0])
         getRegions("","","")
              .then((response)=>{
               if(response.regions){

                let populatedregion=[];
                let populatedreg=[];

                response.regions.map(function(keyobj){
                  var oneRegion=keyobj;

                  for (var key in oneRegion) {
                    if (oneRegion.hasOwnProperty(key)) {
                      console.log(key + " -> " + oneRegion[key]);
                      populatedregion.push({value:oneRegion[key],label:key});
                        populatedreg.push(oneRegion[key]);

                    }
                  }

                })

              this.setState({regions:populatedreg});
              this.setState({region:populatedregion,regionloading:false},function(){

              })

             }
             else if(response.output){
              console.log("get regions error in container");
             }
            })
            .catch((error)=>{
              console.log("get regions error in container"+JSON.stringify(error));

            })

    }*/
    if(asset.cloudpart.regions!=null||asset.cloudpart.regions!=""){
        asset.cloudpart.regions.map(function(x){
          regionedit.push(x);
        })
    }
    this.setState({regionselected:regionedit});
    let vpcedit=[];
    if(asset.cloudpart.vpcids!=null||asset.cloudpart.vpcids!=""){
      asset.cloudpart.vpcids.map(function(x){
        vpcedit.push(x);
      })
    }
    this.setState({vpcselected:vpcedit});

  }else  if(asset.assettype=='Azure'){
    this.setState({
      showcloud:true,
      groupAccountName:asset.cloudAccountName[0],
      credidsforedit:asset.credentialids,
      selectedCredIdList:asset.credentialids      
    },function(){
     groupAccountName.value=asset.cloudAccountName[0];
    });
  }else if(asset.assettype=='Google'){
    this.setState({
      projectloading:true,
      zonesloading:true,
      showcloud:true,
      groupAccountName:asset.cloudAccountName[0],
      credidsforedit:asset.credentialids,
      selectedCredIdList:asset.credentialids      
    },function(){
     groupAccountName.value=asset.cloudAccountName[0];
    
     this.newGetProject(asset.cloudAccountName[0],asset.cloudpart.projectId,asset.cloudpart.zones);

    });
  }  
  else if(asset.assettype=='OnPrem'){

    this.setState({showiprange:true},function(){
      this.setState({
        credidsforedit:asset.credentialids,
        selectedCredIdList:asset.credentialids
      })

    }.bind(this));
    startIP.value=asset.cloudpart.ipstart;
    endIP.value=asset.cloudpart.ipend;

  }
},
setValidationState(newValidations){
  this.setState({validations:newValidations})
},

openEdit(){
   this.setState({ showEditModal: false ,
    showcloud:false,
    showiprange:false,
    modaltitle:"",
    passType:"password",
    passSecret:"password",
    regionselected:[],
    vpcselected:[],
    vpcs:[],
    vpcloading:false,
    grouplabel:"",
    descriptionofgroup:"",
    idasset:-1,
    loadingdiv:true,
    selectedCredIdList:[],
    selectedTemplate:'',
    groupType:'Cloud',
    showhideforaccess:"Show characters",
    fontfamilyforaccess:"Source Sans Pro",
    fontfamilyforsecret:"Source Sans Pro",
    credidsforedit:[],
    savebuttondisability:true,
    disablegroupname:false,
    isHybridGroup:true,
    tags:[]});


    let groupnameValidation=this.getValidationStateObj("groupName",true,"")
    groupnameValidation.height=135

    let startIPValidation = this.getValidationStateObj("startIP",true,"")
    let endIPValidation = this.getValidationStateObj("endIP",true,"")
    this.setState({validations:{...this.state.validations,startIP:startIPValidation,endIP:endIPValidation}})

    let idtobeedited=this.props.editGroupId;
    this.state.loadingdiv=true;
    getAssetGroup(idtobeedited)
    .then((responsegroup)=>{
      if(responsegroup.monitorSourceId){

        getMonitorAccountDetails(responsegroup.monitorSourceId,responsegroup.name,responsegroup.assetType)
         .then((monres)=>{
            this.setState({instanceChecked:monres.instances,containerChecked:monres.containers,clusterChecked:monres.clusters})
         })
         .catch((monerror)=>{
          console.log("monitor error")

         })
      }

      if(responsegroup.assetId && responsegroup.assetId > 0){
        getassetforedit(responsegroup.assetId)
        .then((response) => {

          //... To check if its hybrid group as cherrpickGroup doesnot have cloudpart in response ...
          if(response.cloudpart)
            this.setState({isHybridGroup:false})
          else
            this.setState({isHybridGroup:true})

          this.setState({loadingdiv:false});
          this.populateGroupData(responsegroup);
          this.populateAssetData(response);
        })
        .catch((error)=>{
          this.setState({loadingdiv:false});
          console.log("Error in edit:" + error)
        })
      }else{
        this.setState({loadingdiv:false});
        this.state.groupType = '';
        this.populateGroupData(responsegroup);
      }
    })
   .catch((assetgroupError)=>{
      this.setState({loadingdiv:false});

   })

  this.setState({ showEditModal: true });

},


editSaveMethod(){
    let id=this.state.idasset;
    let name=groupid.value;
    let description=descriptiongroupid.value;
    let accessKey;
    let secretAccessKey;
    let regionlist;
    let vpclist;
    let ipst;
    let iped;
    let credint= [];
    let number;

    for(let i=0;i<this.state.selectedCredIdList.length;i++)
    {
     number = parseInt(this.state.selectedCredIdList[i] , 10 );
     credint.push(number);
    }

    if(this.state.groupType=="Aws" ){
        //++++ Construct cloudPart JSON ++++++++++++++++++
      let cloudpart={};
      cloudpart["cloudtype"]="Aws";

      if(typeof(this.state.regionselected)=="string"){
        cloudpart["regions"]=JSON.parse(JSON.stringify(this.state.regionselected.split(",")));
      }else{
         cloudpart["regions"]=this.state.regionselected;
      }

      if(typeof(this.state.vpcselected)=="string")
        cloudpart["vpcids"]=JSON.parse(JSON.stringify(this.state.vpcselected.split(",")));
      else
      cloudpart["vpcids"]=this.state.vpcselected;

      assetupdate(id,name,groupAccountName.value,credint,cloudpart,this.state.groupType)
      .then((responseasset)=>{
        console.log('successful edit asset')
      })
      .catch((errorasset)=>{
        console.log('error in edit asset')
      })
    }else if(this.state.groupType=="Azure" ){
        //++++ Construct cloudPart JSON ++++++++++++++++++
      let cloudpart={};
      cloudpart["cloudtype"]="Azure";

      assetupdate(id,name,groupAccountName.value,credint,cloudpart,this.state.groupType)
      .then((responseasset)=>{
        console.log('successful edit asset')
      })
      .catch((errorasset)=>{
        console.log('error in edit asset')
      })
    }else if(this.state.groupType=="Google" ){
        //++++ Construct cloudPart JSON ++++++++++++++++++
      let cloudpart={};
      cloudpart["cloudtype"]="Google";
      cloudpart["projectId"]=this.state.projectselected;
      cloudpart["zones"]=this.state.zonesselected

      assetupdate(id,name,groupAccountName.value,credint,cloudpart,this.state.groupType)
      .then((responseasset)=>{
        console.log('successful edit asset')
      })
      .catch((errorasset)=>{
        console.log('error in edit asset')
      })
    }else if(this.state.groupType=="OnPrem" ){
      ipst=startIP.value;
      iped=endIP.value;
      updateOnPremAsset(id,name,ipst,iped,description,credint)
      .then((responseassetip)=>{
        console.log('successful edit asset')
      })
      .catch((errorassetip)=>{
        console.log('error in edit asset')
      })
    }

    assetgroupupdate(this.props.editGroupId,name,description)
    if(this.state.isHybridGroup==false)
     updateMonitorAcountForGroup(this.props.editGroupId,name,this.state.groupType,this.state.instanceChecked,this.state.containerChecked,this.state.clusterChecked)


    if(this.state.selectedTemplate != null && this.state.selectedTemplate !== '')
    {
      addScheduleTemplateToGroup(this.props.editGroupId[0],this.state.selectedTemplate,"",this.props.loginName)
      .then((saveGroupResponse) => {
        console.log("Saved Schedule info to asset group")
      })
      .catch((error) => {
        console.log("error in adding schedule template to group:"+JSON.stringify(error))
      })
    }else{
      removeScheduleTemplateFromGroup(this.props.editGroupId[0])
      .then((saveGroupResponse) => {
        console.log("Removed Schedule template from asset group")
      })
      .catch((error) => {
        console.log("Error in removing schedule template from group:"+JSON.stringify(error))
      })
    }


    this.props.refreshedit(true);
    this.closeEdit();

},


closeEdit() {

    this.setState({
        showEditModal: false,
        credidsforedit:[],
        selectedCredIdList:[]
    });

},

handleTemplateSelected(e){
  this.setState({selectedTemplate:e});
},

handlevpc(value){
  this.state.vpcselected=value;
  console.log("this.state.vpcselected"+this.state.vpcselected);
},

getCredentialsId(credIdList){
   this.state.selectedCredIdList=credIdList;
},

getTagList(tagList){
   this.state.tags=tagList;
   console.log("this.state.tags "+ this.state.tags);
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

validateGroupLabel:  function(){
    let result = Joi.validate({"Group Name":cloudLabel.value}, this.state.validations.groupName.schema);
    if (result.error) {
    let groupNameValidation = this.getValidationStateObj("groupName",false,"error",result.error.details[0].message)
    groupNameValidation.height = 55;
    this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolname.show())
    }else{
    let groupNameValidation = this.getValidationStateObj("groupName",true,"success","")
    this.setState({validations:{...this.state.validations,groupName:groupNameValidation}},()=>this.refs.toolname.hide())
    }
},

validateCloudType : function() {
  let result = Joi.validate({"Cloud Type":cloudTypeid.value}, this.state.validations.cloudType.schema)
  if (result.error) {
    let cloudTypeValidation =  this.getValidationStateObj("cloudType",false,"error",result.error.details[0].message)
    this.setState({validations:{...this.state.validations,cloudType:cloudTypeValidation}})
  } else {
    let cloudTypeValidation =  this.getValidationStateObj("cloudType",true,"success",'Select your cloud provider. Please note, only one cloud type can be selected for each group.')
    this.setState({validations:{...this.state.validations,cloudType:cloudTypeValidation}})

    this.setState({cloudType:cloudTypeid.value})
  }
},


validateStartIp:  function(){
    let result = Joi.validate({"Starting IP":startIP.value}, this.state.validations.startIP.schema);
    if (result.error) {
    let startIpValidation = this.getValidationStateObj("startIP",false,result.error.details[0].message)
    this.setState({validations:{...this.state.validations,startIP:startIpValidation}},()=>this.refs.toolsip.show())
    }else{
    let startIpValidation = this.getValidationStateObj("startIP",true,'')
    this.setState({validations:{...this.state.validations,startIP:startIpValidation}},()=>this.refs.toolsip.hide())
    }
},

validateEndIp:  function(){

    let result = Joi.validate({"Ending IP":endIP.value}, this.state.validations.endIP.schema);

    if (result.error) {
    let endIpValidation = this.getValidationStateObj("endIP",false,result.error.details[0].message)
    this.setState({validations:{...this.state.validations,endIP:endIpValidation}},()=>this.refs.tooleip.show())
    }else{
    let endIpValidation = this.getValidationStateObj("endIP",true,'')
    this.setState({validations:{...this.state.validations,endIP:endIpValidation}},()=>this.refs.tooleip.hide())
    }

},


funpassaccess(){
    if(this.state.passType==="password")
    {
      this.setState({passType:"text"});
      this.setState({showhideforaccess:"Hide characters"});
       this.setState({fontfamilyforaccess:"Source Sans Pro"});
    }
    else
    {
       this.setState({passType:"password"});
       this.setState({showhideforaccess:"Show characters"});
       this.setState({fontfamilyforaccess:"courier"});
    }

},

handledesc(e){
    this.state.descriptionofgroup=e.target.value;
},

handlegroup(e){
    this.state.grouplabel=e.target.value;
},

newGetProject(accountselected,projectselect,zoneselect){
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
                  //  this.getallzoness(accountselected);
                  // })
                });
        this.setState({project:populatedprojectValue,
          projectselected:projectselect,
          zonesselected: zoneselect},function(){


                let projectList = this.state.projectList;
                projectList.filter(function(item){
                  if(projectselect === item.project){
                    this.setState({zones:item.zones})
                    let formattedZones = this.formattedZone(item.zones)
                    this.setState({
                      zoness:formattedZones,zonesloading:false
                    })
                  }
                }.bind(this))

          });
   
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
                  //  this.getallzoness(accountselected);
                  // })
                });
        this.setState({project:populatedprojectValue});
     
  })
},

getallzoness(accountselected){
  var projecttobesent=this.state.projectselected;
  let selectedZone = [];
    this.setState({zonesselected:[]});
  

    /*if(this.state.projectselected==null||this.state.projectselected==""){
      this.setState({projectselected:"All Projects"});
      this.props.setInputData("projectselected","All Projects");
    }*/
    if(this.state.projectselected!=""){
    this.setState({zonesloading:true});

    if(this.state.projectselected=="All Projects"){
      projecttobesent = this.state.project;
    }
    
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
    projectselected:value,zonesselected:[],zoness:[]
  })
  

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
    
},


render() {
    let validations = this.state.validations;
    this.state.savebuttondisability=!((this.state.isHybridGroup)||(validations.startIP.valid&&validations.endIP.valid&& this.state.groupType=='OnPrem')||(this.state.groupType=='Aws')||(this.state.groupType=='Azure')||(this.state.groupType=='Google'&&this.state.projectselected!=""&&this.state.zonesselected!=""));

    const tooltipGroupLabel = (
      <Popover   style={{height:validations.groupName.height,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{validations.groupName.error}</Popover>
    );

    const tooltipAcesskey = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:80}}>{validations.accessKey.error}</Popover>
    );

    const tooltipSecretKey = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:80}}>{validations.secretKey.error}</Popover>
    );


    const tooltipStartIP = (
      <Popover   style={{height:60,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{validations.startIP.error}</Popover>
    );

   const tooltipEndIp = (
      <Popover   style={{height:60,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{validations.endIP.error}</Popover>
    );

 
    let toolTipStyle = {color: 'black',borderWidth: 2,borderRadius:0,width:200}

    const tooltipProjectwarning = (
      <Popover style={{...toolTipStyle,height:135}}><div className="pull-right"><a href="javascript:void(0)" style={{fontSize:'18px'}} onClick={this.hideInfoPopup}>x</a></div><span style={{color:'red'}}>Warning !</span><br />Selecting "All projects" will result in longer discovery time. Please avoid using this option unless its required.  </Popover>
    );

   let containerStyle={paddingRight: 0,paddingLeft: 0,marginRight: 0,marginLeft:0,width:'100%'}

    return (
      <span className={modalContainer} >

      <a href='JavaScript: void(0)' onClick={this.openEdit}>
        Edit
      </a>
      <Modal  show={this.state.showEditModal} keyboard={false} onHide={this.closeEdit} backdrop='static'>
        <Modal.Header style={{float:'middle'}} className={headerContainerForEdit} >
          <a href="javascript:void(0)"  style={{color:"#FFFFFF", strokeColor:'#00c484'}} className={modalCloseStyle1} onClick={this.closeEdit}>x</a>
          <Modal.Title style={{width:'100%',fontWeight:'bold',padding:0,marginTop:12,color:"#FFFFFF"}}>
            <svg className="col-lg-1 pull-left" style={{padding:0,margin:0,horizontalAlign: 'left',justifyContent:'left',alignItems: 'left',  textAlign: 'left',align:"left",float:'left'}} width="30px" height="30px"  viewBox="656 156 288 288" version="1.1" >
               <g id="Group-2" stroke="none" strokeWidth="20" fill="none" fill-rule="evenodd" transform="translate(660.000000, 160.000000)">
                <path d="M238.529268,238.300807 C213.343231,263.458971 178.555888,279.020052 140.127469,279.020052 C63.2799069,279.020052 0.978093317,216.784994 0.978093317,139.999073 C0.978093317,63.2177865 63.2799069,0.978094172 140.127469,0.978094172 C189.701753,0.978094172 233.213762,26.8684345 257.861755,65.845283" id="Stroke-1" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"></path>
                <path d="M193.088648,192.956335 C179.516946,206.51088 160.773525,214.893845 140.072736,214.893845 C98.6757973,214.893845 65.0990531,181.357351 65.0990531,139.993976 C65.0990531,98.6306005 98.6757973,65.0941063 140.072736,65.0941063 C161.752209,65.0941063 181.284143,74.2926611 194.971803,88.9871786" id="Stroke-3" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"></path>
                <path d="M158.681646,140 C158.681646,150.231944 150.383705,158.536131 140.128396,158.536131 C129.89164,158.536131 121.575146,150.231944 121.575146,140 C121.575146,129.768056 129.89164,121.463869 140.128396,121.463869 C150.383705,121.463869 158.681646,129.768056 158.681646,140 L158.681646,140 Z" id="Stroke-5" stroke="#FFFFFF" stroke-width="8"></path>
                <path d="M279.504121,139.995366 C279.504121,155.35255 267.045614,167.799562 251.674246,167.799562 C236.302878,167.799562 223.844371,155.35255 223.844371,139.995366 C223.844371,124.642816 236.302878,112.19117 251.674246,112.19117 C267.045614,112.19117 279.504121,124.642816 279.504121,139.995366 L279.504121,139.995366 Z" id="Stroke-7" stroke="#FFFFFF" stroke-width="8"></path>
                <path d="M153.19174,153.046655 L238.527413,238.298954" id="Stroke-9" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"></path>
               </g>
            </svg>

            { this.state.modaltitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{padding:0}}>
          {this.state.loadingdiv?
          <div style={{marginTop: 20,paddingTop:'100px',width:'100%'}}>
            <div style={{width:'90px',height:'90px',marginLeft:'240px'}}>
              <SpinnyLogo />
            </div>
          </div>
          :
          <form >

           <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#FAFFFF'}}>
              <div className="col-lg-3 col-xs-3 col-md-3 col-sm-3">
              </div>
           <div className="col-lg-9 col-xs-9 col-md-9 col-sm-9">
            <br />
             <FormGroup controlId="GeneralInfo">
                <ControlLabel style={{fontSize:'15px'}} >GENERAL INFO</ControlLabel>
             </FormGroup>

             <FormGroup  controlId="groupid"  validationState={validations.groupName.validationState}>
                <ControlLabel className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{padding:'0',fontSize:'15px',fontWeight:500}}>Group Name</ControlLabel>

                  <input id="groupid" type="text" disabled={true} onChange={this.validateGroupLabel}
                    style={{width:326,height:40,paddingLeft:'10px',border:validations.groupName.border,borderRadius:0}}/>

             </FormGroup>
            {
              this.state.showcloud ==true ?
              <FormGroup  controlId="groupAccountName">
                <ControlLabel className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{padding:'0',fontSize:'15px',fontWeight:500}}>Account Name</ControlLabel>
                  <input id="groupAccountName" type="text" disabled={true}  style={{width:326,height:40,paddingLeft:'10px',border:'1px solid #4C58A4',borderRadius:0}}/>
             </FormGroup>
             :
               <noscript />
            }
              <FormGroup  controlId="descriptiongroupid"  >
                <ControlLabel className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{padding:'0',fontSize:'15px',fontWeight:500}}>Description</ControlLabel>
                  <input id="descriptiongroupid" type="text" onChange={this.handledesc}  style={{width:326,height:40,paddingLeft:'10px',border:'1px solid #4C58A4',borderRadius:0}}/>

              </FormGroup>

           </div>
           </div>

           <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#F9FAFC'}}>
              <div className="col-lg-3 col-xs-3 col-md-3 col-sm-3">
              </div>
              {
              (this.state.showcloud ==true && this.state.groupType==="Aws")?
              <div className="col-lg-9 col-xs-9 col-md-9 col-sm-9">

                {((this.state.IAMRoleRadioOption === 'accessrole')||(this.state.IAMRoleStatus === false))?
                 <div>
                 <br />
                <FormGroup controlId="Credentials">
                  <ControlLabel style={{fontSize:'15px'}} >CLOUD CREDENTIALS</ControlLabel>
                </FormGroup>
              <br />

                </div>
               :
               <noscript />
                }

              <FormGroup controlId="cloudRegionSelect">
                <ControlLabel className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{fontWeight:500,padding:'0'}}>Region </ControlLabel>
                <Select id="cloudRegionSelect" placeholder={<i>Select Region</i>}
                  name=""
                  value={this.state.regionselected}
                  options={this.state.region}
                  multi={true}
                  clearable={true}
                  searchable={true}
                  onChange={this.handleregion}
                  isLoading={this.state.regionloading}
                  />
              </FormGroup>
              {((this.state.IAMRoleRadioOption === 'accessrole')||(this.state.IAMRoleStatus === false))?
                <FormGroup controlId="vpcselect">
                  <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>VPC (Optional)</ControlLabel>
                  <Select id="vpcselect"  placeholder={<i>Select VPC</i>}
                    name=""
                    value={this.state.vpcselected}
                    options={this.state.vpcs}
                    multi={true}
                    clearable={true}
                    searchable={true}
                    isLoading={this.state.vpcloading}
                    onChange={this.handlevpc}/>
                </FormGroup>
                  :
               <noscript />
              }

             <br />
             <br />
            </div>
            :<noscript />
            }

            {
              this.state.showcloud==true && this.state.groupType==="Google"?
              <div className="col-lg-9 col-xs-9 col-md-9 col-sm-9">
                <FormGroup controlId="cloudProjectSelect" >
                  <ControlLabel className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{fontWeight:500,padding:'0'}}>Project List </ControlLabel>

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
                  <ControlLabel className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{fontWeight:500,padding:'0'}}>Zones</ControlLabel>
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
              :
              <noscript />
            }

            {
            this.state.showiprange==true ?
            <div className="col-lg-9 col-xs-9 col-md-9 col-sm-9">
            <FormGroup  controlId="startIP" validationState={validations.startIP.validationState} >
              <ControlLabel className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{fontWeight:500,padding:'0'}}>Starting IP: </ControlLabel>
              <OverlayTrigger ref="toolsip" trigger={validations.startIP.showTooltip} placement="right" overlay={tooltipStartIP}>
                <input id="startIP" type="text" placeholder="Enter Starting IP" style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:validations.startIP.border,borderRadius:0}} onBlur={this.validateStartIp} />
              </OverlayTrigger>
            </FormGroup>

            <FormGroup  controlId="endIP" validationState={validations.endIP.validationState}>
              <ControlLabel className="col-lg-12 col-xs-12 col-md-12 col-sm-12" style={{fontWeight:500,padding:'0'}}>Ending IP: </ControlLabel>
              <OverlayTrigger ref="tooleip" trigger={validations.endIP.showTooltip} placement="right" overlay={tooltipEndIp}>
                <input id="endIP" type="text" placeholder="Enter Ending IP" style={{padding:'12px',width:326,paddingLeft:'10px',height:40,border:validations.endIP.border,borderRadius:0}} onBlur={this.validateEndIp}/>
                </OverlayTrigger>
            </FormGroup>
            </div>
           :<noscript />
            }
            </div>

            {(this.state.showcloud === true || this.state.showiprange === true)?
            <div className="row "  style={{margin:'0px',width:'100%',backgroundColor:'#F9FBFB'}}>
              <div className="col-lg-3 col-xs-3 col-md-3 col-sm-3"></div>
              <div className="col-lg-9 col-xs-9 col-md-9 col-sm-9">
                
               <ResourceCredentialsListEdit credidsedit={this.state.credidsforedit} idtobeedited={this.props.editGroupId} getCredentialsId={this.getCredentialsId}/>
                <br />
              </div>
            </div>
            :<noscript />
            }

            <div className="row "  style={{margin:'0px',width:'100%',backgroundColor:'#F9FBFB'}}>
              <div className="col-lg-3 col-xs-3 col-md-3 col-sm-3"></div>
              <div className="col-lg-9 col-xs-9 col-md-9 col-sm-9">
                <FormGroup  controlId="selectedTemplate" >
                <ControlLabel style={{fontSize:'16px',fontWeight:600, color:'#474856', marginBottom:15}}>SCHEDULE AND NOTIFICATION TEMPLATE</ControlLabel><br/>
                {/*<select className={selectStyle} id="templateNameSelect" value={this.state.selectedTemplate} placeholder= "Select a template" onChange={this.handleTemplateSelected} style={{width:326,height:40,paddingLeft:'10px',border:'1px solid #4C58A4',borderRadius:0}} >
                  <option key="EMPTY" value="">Not Scheduled</option>
                  {
                    this.state.templatesList.map((item) =>
                    {
                      return <option key={item.label} name={item.label} value={item.label}>{item.label}</option>
                    })
                  }
                </select>*/}
                <Select className="dropdownForm" placeholder='Not Scheduled'
                  name=""
                  value={this.state.selectedTemplate}
                  options={this.state.templatesList}
                  searchable={true}
                  multi={false}
                  clearable={false}
                  allowCreate={false}
                  onChange={this.handleTemplateSelected}/>
                </FormGroup>

               
                {this.state.isHybridGroup===false?
                  <div>
                    <ControlLabel><h3 style={{fontSize:'15px'}}><strong>MONITORING  &nbsp;&nbsp;&nbsp; </strong> 
                      </h3></ControlLabel><br/>
                     <input type='Checkbox' style={{position:'absolute'}} id="Instances" value="Instances" name="Instances" onChange={this.onChangeInstance} checked={this.state.instanceChecked}/> 
                     <label style={{display:'inline',fontWeight:'500',textOverflow: 'ellipsis',width:'326px','whiteSpace': 'nowrap',overflow:'hidden',height:'22px','lineHeight':'20px'}} htmlFor="Instances" title="Instances">&nbsp;&nbsp;Instances</label><br/><br/>
                     
                     <input type='Checkbox' style={{position:'absolute'}} id="Containers" value="Containers" name="Containers" onChange={this.onChangeContainers} checked={this.state.containerChecked}/> 
                     <label style={{display:'inline',fontWeight:'500',textOverflow: 'ellipsis',width:'326px','whiteSpace': 'nowrap',overflow:'hidden',height:'22px','lineHeight':'20px'}} htmlFor="Containers" title="Containers">&nbsp;&nbsp;Containers</label><br/><br/>
                     
                     <input type='Checkbox' style={{position:'absolute'}} id="Clusters" value="Clusters" name="Clusters" onChange={this.onChangeClusetrs} checked={this.state.clusterChecked}/> 
                     <label style={{display:'inline',fontWeight:'500',textOverflow: 'ellipsis',width:'326px','whiteSpace': 'nowrap',overflow:'hidden',height:'22px','lineHeight':'20px'}} htmlFor="Clusters" title="Clusters">&nbsp;&nbsp;Clusters</label><br/><br/>

                      <br/>
                    </div>
                  : ""}
                    <br/>

              </div>
            </div>

        </form>
        }
        </Modal.Body>
        <Modal.Footer className={footerDivContainer} style={{position:'relative'}}>
          <div id="" style={{position:'absolute',top:'50%',right:30,transform:'translateY(-50%)'}}>
            <Button onClick={this.closeEdit}
              style={{backgroundColor:'#4C58A4',color:'#FFFFFF',borderRadius:0,height:30,paddingTop:'2px'}}>Cancel</Button>
            <Button disabled={this.state.savebuttondisability} onClick={this.editSaveMethod}
              style={{backgroundColor:'#4C58A4',color:'#FFFFFF',borderRadius:0,height:30,paddingTop:'2'}}>
              Done
            </Button>
           </div>
        </Modal.Footer>
      </Modal>
    </span>
    );
  }
})

export default connect(
 ({users}) => ({loginName: users.login}),
)(EditGroups)

