import React, { Component, PropTypes } from 'react'
import {ResourceCredentials} from './ResourceCredentials'
import {Tags} from './tags'
import {Popover,Tooltip, Table, ButtonToolbar,ButtonGroup, Button , SplitButton , MenuItem,Col, FormControl, FormGroup,ControlLabel, HelpBlock, OverlayTrigger ,Checkbox, Radio} from 'react-bootstrap'
import {navbar,footerBtn,selectStyle} from 'sharedStyles/styles.css'
import {PolicyPacks} from './PolicyPacks'
import {italic1,divContainer,footerDivContainer,customHrBefore,toDoCircle,inProgressOuterCircle,inProgressInnerCircle,completedInnerCheckMark,completedOuterCircle} from './styles.css'
import Joi from 'joi-browser'
import ReactDOM from 'react-dom'
import {putAssetlatest} from '../../../app/helpers/assetGroups'
import {startDiscovery} from '../../../app/helpers/discovery'
import {putAssetGroup} from '../../../app/helpers/assetGroups'
import {getVpcs} from '../../../app/helpers/assetGroups'
import {getRegions,getIAMRoleStatus} from '../../../app/helpers/assetGroups'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import {putAssetlatestforip} from '../../../app/helpers/assetGroups'
import {getAssetGroup} from '../../../app/helpers/assetGroups'
import {getassetforedit} from '../../../app/helpers/assetGroups';
import {assetupdate} from '../../../app/helpers/assetGroups'
import {assetupdateforip} from '../../../app/helpers/assetGroups';
import {assetgroupupdate} from '../../../app/helpers/assetGroups';


function CloudMultistepHeader() {
  let DiscoverLabelStyle={color:"white"}
  return (
    <div className={divContainer}>
    <br/>
    <table className="col-lg-12 col-sm-12 col-md-12 col-xs-12" style={{width: '90%',fontSize: 15,marginLeft:20}} >
     <tbody>
    <tr>
    </tr>
    <tr>
    </tr>
          <tr >
          <td style={{width:'33.33%'}}>
           <span  className={inProgressOuterCircle}>
             <span  className={inProgressInnerCircle}>
             </span>
           </span>
          </td>
          <td style={{width:'33.33%'}}>
           <span  className={toDoCircle}>
           </span>
          </td>
          <td style={{width:'30.33%'}}>
          <span className={toDoCircle}>
          </span>
          </td>
          </tr>
          <tr >
              <td>
                <ul style={{listStyleType:'none',color:'white'}}>
                    <li style={{marginTop:93}}>DISCOVER</li>
                    <li> RESOURCES</li>
                </ul>
              </td>
              <td>
                <ul style={{listStyleType:'none',color:'white'}}>
                    <li style={{marginTop:93}}>SELECT POLICY</li>
                    <li> PACKS</li>
                </ul>
              </td>
              <td>
                <ul style={{listStyleType:'none',color:'white'}}>
                    <li style={{marginTop:93}}>SCHEDULE</li>
                    <li> ASSESSMENTS</li>
                </ul>
              </td>
          </tr>
        </tbody>
      </table>
    </div>

  )
}

const CloudDetails = React.createClass ({
  getInitialState() {
   return {
      GroupLabel_validation: '',
      GroupLabel_error: ' Provide a name for this group. The group name is a unique name used to differentiate resource groups from one another.',
      bordercolg:'1.5px solid #4C58A4',
      CloudType_validation: '',
      CloudType_error: 'Select your cloud provider. Please note, only one cloud type can be selected for each group.',
      bordercolc:'1.5px solid #4C58A4',
      AccessKey_validation: '',
      AccessKey_error: ' Provide valid Access Key ID associated with this AWS account.',
      bordercola:'1.5px solid #4C58A4',
      SecretKey_validation: '',
      SecretKey_error: 'Provide valid Secret Access Key associated with this AWS account.',
      bordercols:'1.5px solid #4C58A4',
      CloudType:[
        { value: "Aws", label: "AWS" },
        { value: "Azure", label: "Azure" },
        { value: "Google", label:"Google" }
      ],
      regions : [],
      vpcs : [],
      timeZone : ["EST", "CST", "MST", "PST"],
      passType:"password",
      passSecret:"password",
      region :[],
      cloudOption :'Cloud',
      savelater:true,
      cloudgoupnamevalid:false,
      cloudtypevalid:true,
      accesskeyvalid:false,
      secretkeyvalid:false,
      selectedCredIdList:[],
      regionselected:[],
      vpcselected:[],
      nextstep:true,
      discoverybutton:true,
      regionloading:false,
      vpcloading:false,
      showhideforaccess:"Show characters",
      showhideforsecret:"Show characters",
      loadmsgnextstep:"Next Step",
      loadingmsgdiscovery:"Discover Resources Now",
      showtooltipforname:"hover",
      showtooltipforaccess:"hover",
      showtooltipforsecret:"hover",
      labeltoolheight:135,
      fontfamilyforaccess:"Source Sans Pro",
      fontfamilyforsecret:"Source Sans Pro",
      validstartip:false,
	    validendip:false,
	    validipgroupname:false,
		  Groupip_validation: '',
      Groupip_error: ' Provide a name for this group. The group name is a unique name used to differentiate resource groups from one another.',
      bordercolipgroup:'1.5px solid #4C58A4',
	    startip_validation: '',
      startip_error: 'Enter a valid ip address.',
      bordercolstartip:'1.5px solid #4C58A4',
	    endip_validation: '',
      endip_error: 'Enter a valid ip address.',
      bordercolendip:'1.5px solid #4C58A4',
	    showtooltipstartip:"hover",
	    showtooltipendip:"hover",
	    showtooltipipgroup:"hover",
      labelheightipgroupname:135,
      loadingsaveforlater:"Save for Later",
      credidsforedit:[],
      tags:[],
      IAMRoleStatus:false,
      IAMRoleRadioOption:'',
      IAMRoleName:"",
      awTagValue:false


  }},

  contextTypes: {
    router: PropTypes.object.isRequired,
  },

   componentWillMount(){
    var iamvalue=false;
      getIAMRoleStatus()
      .then((iamresponse)=>{
          console.log("iamresponse"+iamresponse.iamrole);
          if(iamresponse.iamrole=="false"){
              iamvalue=false;
          }
          else{
              iamvalue=true;
          }
          this.setState({IAMRoleStatus:iamvalue},function(){
          console.log("IAMRoleStatus"+this.state.IAMRoleStatus);
          if(this.state.IAMRoleStatus===true){
            this.setState({IAMRoleRadioOption:'iamrole', IAMRoleName:iamresponse.rolename},function(){console.log("IAMRoleRadio"+this.state.IAMRoleRadioOption)});
            this.setState({accesskeyvalid:true},function(){console.log("accesskeyvalid"+this.state.accesskeyvalid)});
            this.setState({secretkeyvalid:true},function(){console.log("secretkeyvalid"+this.state.secretkeyvalid)});

            getRegions("","","")
            .then((response)=>{
              console.log(response);
              let populatedregion=[];
              for(let i=0;i<response.length;i++){
                this.state.regions[i]=response[i];

              }
              console.log("this.state.regions1"+this.state.regions)
              console.log("this.state.regions"+JSON.stringify(this.state.regions))

              response.map(function(x){
                populatedregion.push({value:x,label:x});
              })
              this.setState({region:populatedregion});
              console.log(this.state.region)
              console.log(populatedregion)

            })
            .catch((error)=>{
              console.log("get regions error in container"+JSON.stringify(error));

            })


          }
          else{
            this.setState({IAMRoleRadioOption:'accessrole'},function(){console.log("IAMRoleRadio"+this.state.IAMRoleRadioOption)});
            this.setState({accesskeyvalid:false},function(){console.log("accesskeyvalid"+this.state.accesskeyvalid)});
            this.setState({secretkeyvalid:false},function(){console.log("secretkeyvalid"+this.state.secretkeyvalid)});

        }

        });

     })
     .catch((iamerror)=>{
        console.log('iamerror'+iamerror);
        this.setState({IAMRoleRadioOption:'accessrole'},function(){console.log("IAMRoleRadio"+this.state.IAMRoleRadioOption)});

     })
   },
   componentDidMount(){
    console.log("this.props.id"+this.props.id);
    let idforedit=this.props.id;
    if(idforedit!=-1){
      //this.state.loadingdiv=true;
    let regionedit=[];
    getAssetGroup(idforedit)
      .then((responsegroup)=>{

        getassetforedit(responsegroup.assetId)
        .then(
          (response) => {
            // this.setState({loadingdiv :false});
            if(response.type=="Aws"){
             this.setState({cloudOption:'Cloud'});
             cloudTypeid.value=response.type;
             this.setState({ CloudType_validation : 'success'})
             this.state.cloudtypevalid=true;
             this.state.bordercolc='1.5px solid #00C484';

             cloudLabel.value=response.name;
             this.setState({showtooltipforname:false});
             this.setState({GroupLabel_error: '', GroupLabel_validation : 'success'})
             this.state.cloudgoupnamevalid=true;
             this.state.bordercolg='1.5px solid #00C484';
             //descriptiongroupid.value=response.description;
             //this.setState({grouplabel:response.name});
            // this.setState({descriptionofgroup:response.description});
             secretaccesskey.value=response.secretAccessKey;
             this.setState({SecretKey_error: '', SecretKey_validation : 'success'})
             this.state.bordercols='1.5px solid #00C484';
             this.state.secretkeyvalid=true;
             this.state.showtooltipforsecret="false";

             accesskey.value=response.accessKey;
             this.setState({AccessKey_error: '', AccessKey_validation : 'success'})
             this.state.bordercola='1.5px solid #00C484'
             this.state.accesskeyvalid=true;
             this.state.showtooltipforaccess="false";


             this.getallregions();
             console.log("response.credentialids"+response.credentialids);
             this.state.credidsforedit=response.credentialids;

             response.regions.map(function(x){
              regionedit.push(x);
             })
             this.setState({regionselected:regionedit});
             console.log(this.state.regionselected);
             console.log(regionedit);
             this.getallvpcs();
             let vpcedit=[];
             response.vpcids.map(function(x){
                vpcedit.push(x);
             })
             this.setState({vpcselected:vpcedit});
           }
           else{

              this.setState({cloudOption:'Onpremises'},function(){
               this.setState({credidsforedit:response.credentialids});

              }.bind(this));
              //this.state.credidsforedit=response.credentialids;
              startIP.value=response.ipstart;
              this.setState({validstartip:true});
              this.setState({startip_error: ' ', startip_validation : 'success'})
              this.state.bordercolstartip='1.5px solid #00C484';
              this.state.showtooltipstartip="false";
              endIP.value=response.ipend;
              this.setState({validendip:true});
              this.setState({endip_error: '', endip_validation : 'success'})
              this.state.bordercolendip='1.5px solid #00C484';
              this.state.showtooltipendip= "false";
              groupname.value=response.name;
              this.setState({validipgroupname:true});
              this.setState({Groupip_error: '', Groupip_validation : 'success'});
              this.setState({bordercolipgroup:'1.5px solid #00C484'});
              this.setState({showtooltipipgroup: false});
              description.value=response.description;

           }



        })
        .catch(
          (error)=>{
                console.log("Error in edit:" + error)

                //this.state.loadingdiv =false;

       })
   })
  .catch((assetgroupError)=>{
    console.log("assetgroupError"+assetgroupError);

   // this.state.loadingdiv =false;
 })

}
},

awsTagEnable:function (changeEvent) {

   if(changeEvent.target.checked==true){
      this.setState({awTagValue:true},function(){
      console.log("this.state.awTagValue"+this.state.awTagValue);
    });


   }
   else{
      this.setState({awTagValue:false},function(){
      console.log("this.state.awTagValue"+this.state.awTagValue);
    });

   }

},

handleOptionChange: function (changeEvent) {
  this.setState({
    cloudOption: changeEvent.target.value

  });
  if(this.state.cloudOption=='Cloud'){
      this.setState({accesskeyvalid:false});
      this.setState({secretkeyvalid:false});
      this.setState({cloudgoupnamevalid:false});

      this.setState({bordercolg:'1.5px solid #4C58A4'});
      this.state.bordercola='1.5px solid #4C58A4';

      this.state.bordercols='1.5px solid #4C58A4';


    }
    else{

     this.state.validstartip=false;
      this.state.validendip=false;
      this.state.validipgroupname=false;
      this.state.bordercolstartip='1.5px solid #4C58A4';
      this.state.bordercolendip='1.5px solid #4C58A4';
      this.state.bordercolipgroup='1.5px solid #4C58A4';

    }

},
handleIAMRadio:function (changeEvent) {
  console.log("THI IS THE EVENT I AM LOOKING FOR ", changeEvent, changeEvent.target.value)
  if (changeEvent.target.value === "iamrole") {
    getRegions("","","")
    .then((response)=>{
      console.log(response);
      let populatedregion=[];
      for(let i=0;i<response.length;i++){
        this.state.regions[i]=response[i];

      }
      console.log("this.state.regions1"+this.state.regions)
      console.log("this.state.regions"+JSON.stringify(this.state.regions))

      response.map(function(x){
        populatedregion.push({value:x,label:x});
      })
      this.setState({region:populatedregion});
      console.log(this.state.region)
      console.log(populatedregion)
      this.state.regionloading=false;
      this.state.accesskeyvalid=true;
      this.state.secretkeyvalid=true;


    })
    .catch((error)=>{
      console.log("get regions error in container"+JSON.stringify(error));
      this.setState({regionloading:false});

    })
  }
  this.setState({
    IAMRoleRadioOption: changeEvent.target.value},function(){
    console.log("IAMRoleRadioOption in change"+this.state.IAMRoleRadioOption+"index of iam "+this.state.IAMRoleRadioOption.indexOf('iam'));
    if(this.state.IAMRoleRadioOption.indexOf('iam')>=0){
      this.setState({accesskeyvalid:true},function(){console.log("accesskeyvalid"+this.state.accesskeyvalid)});
      this.setState({secretkeyvalid:true},function(){console.log("secretkeyvalid"+this.state.secretkeyvalid)});
    }
    else{
      this.setState({accesskeyvalid:false});
      this.setState({secretkeyvalid:false});
      this.setState({regionselected:[]});
      this.setState({region:[]});

    }
  });
},

getCredentialsId(credIdList){
  console.log("Cred id from ResourceCredentials "+credIdList);
  this.state.selectedCredIdList=credIdList;
  console.log("Cred id after setting ResourceCredentials "+ this.state.selectedCredIdList);
},

getTagList(tagList){
  console.log("Tags list from tags "+tagList);
  this.state.tags=credIdList;
  console.log("this.state.tags "+ tthis.state.tags);
},


getallregions(){
  console.log("rolein getallregions"+rolename.value);
  this.setState({regionselected:[]});
  if(secretaccesskey.value!=""&&accesskey.value!=""){
    this.state.regionloading=true;
  getRegions(accesskey.value,secretaccesskey.value,rolename.value)
  .then((response)=>{
    console.log(response);
    let populatedregion=[];
    for(let i=0;i<response.length;i++){
      this.state.regions[i]=response[i];

    }
    console.log("this.state.regions1"+this.state.regions)
    console.log("this.state.regions"+JSON.stringify(this.state.regions))

    response.map(function(x){
      populatedregion.push({value:x,label:x});
    })
    this.setState({region:populatedregion});
    console.log(this.state.region)
    console.log(populatedregion)
    this.state.regionloading=false;
    this.setState({SecretKey_error: 'Valid Key', SecretKey_validation : 'success'})
    this.state.bordercols='1.5px solid #00C484';
    this.state.showtooltipforsecret="false";
    this.setState({AccessKey_error: 'Valid Key', AccessKey_validation : 'success'})
    this.setState({bordercola:'1.5px solid #00C484'});
    this.state.showtooltipforaccess="false";
     this.state.accesskeyvalid=true;
    this.state.secretkeyvalid=true;


  })
  .catch((error)=>{
     console.log("get regions error in container"+JSON.stringify(error));
    console.log("in getallregion"+error.response.data);

    if(error.response.data != null && error.response.status != null && error.response.status==400){

      if(error.response.data.indexOf("Invalid Aws Credentials Exception: Not a valid AK or SK")!=-1){
        this.setState({SecretKey_error : "The AWS Access Key or Secret Access Key is invalid", SecretKey_validation: 'error'})
        this.state.bordercols='1.5px solid #FF444D';
        this.state.showtooltipforsecret="hover";
		    this.state.secretkeyvalid=false;
        this.setState({AccessKey_error : "The AWS Access Key or Secret Access Key is invalid", AccessKey_validation: 'error'})
        this.state.bordercola='1.5px solid #FF444D';
        this.state.showtooltipforaccess="hover";
		    this.state.accesskeyvalid=false;
        this.setState({region:[]});
        this.setState({regionloading:false});
      }
    }
  })
}

},

getallvpcs(){
  this.setState({vpcselected:[]});
  console.log("getallvpcs in container")
  if(this.state.regionselected!=""&&secretaccesskey.value!=""&&accesskey.value!=""){
    this.setState({vpcloading:true});
  getVpcs(accesskey.value,secretaccesskey.value,this.state.regionselected)
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

discoverfunction(e)
{
   if(this.props.id==-1){
  this.state.loadingmsgdiscovery="Saving For Discovery...";
   if(this.state.cloudOption=='Cloud'){
  // validate group name
  let isValidGroupLabelName = this.validateGroupLabel(this.state.GroupLabel)
  let isValidCloudType = this.ValidateCloudType()
  let isValidAccesskey = this.state.accesskeyvalid;
  let isValidSecretKey = this.state.secretkeyvalid

    // procceed only if no error
  if (!(isValidGroupLabelName && isValidCloudType && isValidAccesskey && isValidSecretKey))
    {
      this.state.loadingmsgdiscovery="Discover Resources Now";
      e.preventDefault();
      return false;
    }
  else{
    this.state.loadingmsgdiscovery="Saving For Discovery...";

    let description="AWS Cloud";
    let regionselect=[];
    if(this.state.regionselected==""){
      regionselect=[];
    }
    else{
      let r =this.state.regionselected.split(',');
      regionselect=r ;
    }
	  let vpcselect=[];
	  if(this.state.vpcselected==""){
		vpcselect=[];
	  }
	  else{
		let v =this.state.vpcselected.split(',');
		 vpcselect=v ;

	  }

    let credint= [];
   let number;
   for(let i=0;i<this.state.selectedCredIdList.length;i++)
   {
     number = parseInt(this.state.selectedCredIdList[i] , 10 );
     credint.push(number);
   }
   var accesskeydata='';
   var secretaccesskeydata='';
   var instancecredentail;
   if(this.state.IAMRoleRadioOption=='iamrole'){
      accesskeydata='';
      secretaccesskeydata='';
      instancecredentail=true;
   }
   else{
      accesskeydata=accesskey.value;
      secretaccesskeydata=secretaccesskey.value;
      instancecredentail=false;

   }


  putAssetlatest(cloudTypeid.value,secretaccesskeydata,accesskeydata, cloudLabel.value,description,credint,regionselect,vpcselect,instancecredentail)
  .then(
      (response) => {
      console.log("response after putAssetlatest "+JSON.stringify(response));
      console.log("Id of new asset is "+response.id)
      let assetID=parseInt(response.id , 10 );

      let name=cloudLabel.value;
      let assetDescription="";
      putAssetGroup(name,assetDescription,assetID)
      .then(
          (response)=>{
            console.log("Inside success putAssetGroup")
            console.log("inside putAssetGroup response "+response)
            this.state.loadingmsgdiscovery="Discover Resources Now";
            let groupId = response.id;
            /*startDiscovery(groupId)
            .then(
             (discoveryResponse)=>{
              console.log(discoveryResponse)
              console.log("Inside success discovery")
            })
            .catch((discoveryError) => {console.log("Evrror in start discovery:" + discoveryError)
             console.log("responseStatus is "+discoveryResponse.status);
            })*/
            this.context.router.replace('infrastructure/mygroups')
      })
      .catch((error) => {alert("Error in AssetGroupCreation: " + error.data)
          console.log("Error in putAssetGroup:" + error)
          console.log("responseStatus is "+response.status);
           this.state.loadingmsgdiscovery="Discover Resources Now";
      })

  })
  .catch((error) => {console.log("Error in put asset: " + error)
        console.log("in getallregion"+error.response.data);
        console.log("get regions error in container"+JSON.stringify(error));
        if(error.response.data != null && error.response.status != null && error.response.status==400){

        if(error.response.data.indexOf("Invalid Aws Credentials Exception: Not a valid AK or SK")!=-1){
           this.state.loadingmsgdiscovery="Discover Resources Now";
          this.setState({SecretKey_error : "Invalid Aws Credentials Exception: Not a valid AK or SK", SecretKey_validation: 'error'})
          this.state.bordercols='1.5px solid #FF444D';
          this.setState({secretkeyvalid:false});
           this.state.showtooltipforaccess="hover";
           this.state.showtooltipforsecret="hover";
           this.setState({AccessKey_error : "Invalid Aws Credentials Exception: Not a valid AK or SK", AccessKey_validation: 'error'})
          this.state.bordercola='1.5px solid #FF444D';

           this.setState({accesskeyvalid:false});
          }
        }
        if(error.response.data != null && error.response.status != null && error.response.status==409){

        if(error.response.data.indexOf("Asset already exists with Name:")!=-1){
          this.setState({GroupLabel_error: "Duplicate name", GroupLabel_validation: 'error'})
          this.state.bordercolg='1.5px solid #FF444D';
          this.state.showtooltipforname="hover";
          this.state.labeltoolheight=55;
          this.state.loadingmsgdiscovery="Discover Resources Now";
          this.state.cloudgoupnamevalid=false;

          }
        }
          e.preventDefault();

         return false;
  })
 }
 }
 else{
  this.state.loadingmsgdiscovery="Saving For Discovery...";
  console.log("startIP"+startIP.value);
  console.log("endIP"+endIP.value);
  console.log("groupname"+groupname.value);
  console.log("description"+description.value);

  let credint= [];
  let number;
  for(let i=0;i<this.state.selectedCredIdList.length;i++)
  {
   number = parseInt(this.state.selectedCredIdList[i] , 10 );
   credint.push(number);
  }
  console.log("C  "+credint);
  putAssetlatestforip(groupname.value,startIP.value,endIP.value,description.value,credint)
  .then(
      (response) => {
      console.log("response"+JSON.stringify(response));
      console.log("response after putAssetlatest "+JSON.stringify(response));
      console.log("Id of new asset is "+response.id)
      let assetID=parseInt(response.id , 10 );

       let name=groupname.value;
       let assetDescription="";
       putAssetGroup(name,assetDescription,assetID)
        .then(
           (response)=>{
            console.log("Inside success putAssetGroup")
            console.log("Inside putAssetGroup response "+JSON.stringify(response))
            console.log("New AssetGroup id is "+response.id)
            let groupId = response.id;
           /* startDiscovery(groupId)
            .then(
             (discoveryResponse)=>{
              console.log(discoveryResponse)
              console.log("Inside success discovery")
            })
            .catch((discoveryError) => {console.log("Evrror in start discovery:" + discoveryError)
             console.log("responseStatus is "+discoveryResponse.status);
            })*/
            this.state.loadingmsgdiscovery="Discover Resources Now";
            this.context.router.replace('infrastructure/mygroups')

            return true;
        })
        .catch((error) => {alert("Error in AssetGroupCreation: " + error.data)
          console.log("Error in putAssetGroup:" + error)
          console.log("responseStatus is "+response.status);
          this.state.loadingmsgdiscovery="Discover Resources Now";
          return false;
        })
   })
  .catch((error) => {
      console.log("error"+error.response.data);
      console.log(" error in container"+JSON.stringify(error));

        this.state.loadingmsgdiscovery="Discover Resources Now";
        if(error.response.data != null && error.response.status != null && error.response.status==409){

        if(error.response.data.indexOf("Asset already exists with Name:")!=-1){
          this.setState({Groupip_error: "Duplicate name", Groupip_validation: 'error'})
          this.setState({bordercolipgroup:'1.5px solid #FF444D'});
          this.state.showtooltipipgroup="hover";
		      this.state.labelheightipgroupname=55;
          this.state.loadingmsgdiscovery="Discover Resources Now";
          this.setState({validipgroupname:false});

          }
        }

       e.preventDefault();
       return false;
  })

 }
}
  else{


	  console.log("edit save"+this.props.id);
	  this.state.loadingmsgdiscovery="Saving For Discovery...";
	  if(this.state.cloudOption=='Cloud'){
	  console.log("edit save"+this.props.id)
	  let isValidGroupLabelName = this.validateGroupLabel(this.state.GroupLabel)
	  let isValidCloudType = this.ValidateCloudType()
	  let isValidAccesskey = this.state.accesskeyvalid;
	  let isValidSecretKey = this.state.secretkeyvalid;
	  let responseStatus;

	  // procceed only if no error
	  if (!(isValidGroupLabelName && isValidCloudType && isValidAccesskey && isValidSecretKey))
		  {
			this.state.loadingmsgdiscovery="Discover Resources Now";
			ev.preventDefault();
			return false;
		  }
	  else
	  {
	  console.log("edit save1"+this.props.id)
	  this.state.loadingmsgdiscovery="Saving For Discovery...";
	  let description="AWS Cloud";

	  let regionselect=[];
    if(this.state.regionselected==""){
      regionselect=[];
    }
    else{
      let r =this.state.regionselected.split(',');
      regionselect=r ;
    }
	  let vpcselect=[];
	  if(this.state.vpcselected==""){
		vpcselect=[];
	  }
	  else{
		let v =this.state.vpcselected.split(',');
		 vpcselect=v ;

	  }
	  console.log("regionselect"+regionselect)
	  let credint= [];
	  let number;
	  for(let i=0;i<this.state.selectedCredIdList.length;i++)
	  {
	   number = parseInt(this.state.selectedCredIdList[i] , 10 );
	   credint.push(number);
	  }
	  var accesskeydata='';
    var secretaccesskeydata='';
    var instancecredentail;
    if(this.state.IAMRoleRadioOption=='iamrole'){
        accesskeydata='';
        secretaccesskeydata='';
        instancecredentail=true;
    }
    else{
        accesskeydata=accesskey.value;
        secretaccesskeydata=secretaccesskey.value;
        instancecredentail=false;
    }
	   assetupdate(this.props.id,cloudLabel.value,accesskeydata,secretaccesskeydata,regionselect,description,credint,vpcselect)
		.then(
			   (response)=>{
				   console.log('successful edit assetgroup');
			})
		.catch((error) => {
		console.log("in getallregion"+error.response.data);
		console.log("get regions error in container"+JSON.stringify(error));
		if(error.response.data != null && error.response.status != null && error.response.status==400){

		  if(error.response.data.indexOf("Invalid Aws Credentials Exception: Not a valid AK or SK")!=-1){
			  this.state.loadingmsgdiscovery="Discover Resources Now";
			  this.setState({SecretKey_error : "Invalid Aws Credentials Exception: Not a valid AK or SK", SecretKey_validation: 'error'})
			  this.state.bordercols='1.5px solid #FF444D';
			  this.state.showtooltipforsecret="hover";
			  this.setState({secretkeyvalid:false});
			  this.state.showtooltipforaccess="hover";
			  this.setState({AccessKey_error : "Invalid Aws Credentials Exception: Not a valid AK or SK", AccessKey_validation: 'error'})
			  this.state.bordercola='1.5px solid #FF444D';
			  this.setState({accesskeyvalid:false});
			  }
			}
			if(error.response.data != null && error.response.status != null && error.response.status==409){

			if(error.response.data.indexOf("Asset already exists with Name:")!=-1){
			  console.log("GGGG")
			  this.setState({GroupLabel_error: "Duplicate name", GroupLabel_validation: 'error'})
			  this.state.bordercolg='1.5px solid #FF444D';
			  this.state.showtooltipforname="hover";
			  this.state.labeltoolheight=55;
			  this.state.loadingmsgdiscovery="Discover Resources Now";
			  this.state.cloudgoupnamevalid=false;

			  }
			}

		   ev.preventDefault();
		   return false;
	  })


		assetgroupupdate(this.props.id,cloudLabel.value,description)
		.then((response)=>{
		    console.log('successful edit assetgroup');
				console.log("Inside putAssetGroup response "+JSON.stringify(response))
				console.log("New AssetGroup id is "+response.id)

			  /*startDiscovery(this.props.id)
        .then(
         (discoveryResponse)=>{
        console.log(discoveryResponse)
        console.log("Inside success discovery")
        })
        .catch((discoveryError) => {console.log("Evrror in start discovery:" + discoveryError)
         console.log("responseStatus is "+discoveryResponse.status);
        })*/
				this.state.loadingmsgdiscovery="Discover Resources Now";
				this.context.router.replace('infrastructure/mygroups')
				return true;

		})
		.catch((error) => {alert("Error in AssetGroupCreation: " + error.data)
			  console.log("Error in putAssetGroup:" + error)

			  this.state.loadingmsgdiscovery="Discover Resources Now";
			  return false;
			})



	 }
	}
	else{
	let isvalidsstartip=this.validateStartIp;
	let isvalidendip = this.validateEndIp;
	let isvalidipgrpname = this.validateNameofIp;
	    if (!(isvalidsstartip && isvalidendip && isvalidipgrpname))
		  {
			this.state.loadingmsgdiscovery="Discover Resources Now";
			ev.preventDefault();
			return false;
		  }
	  else
	  {

	  this.setState({loadingmsgdiscovery:"Saving For Discovery..."});


	  let credint= [];
	  let number;
	  for(let i=0;i<this.state.selectedCredIdList.length;i++)
	  {
	   number = parseInt(this.state.selectedCredIdList[i] , 10 );
	   credint.push(number);
	  }
	  console.log("C  "+credint);

	  assetupdateforip(this.props.id,groupname.value,startIP.value,endIP.value,description.value,credint)
	  .then(
			   (response)=>{
				console.log('successful edit assetgroup');
			})
			.catch((error) => {
				  console.log("error"+error.response.data);
				  console.log(" error in container"+JSON.stringify(error));

				 this.state.loadingmsgdiscovery="Discover Resources Now";
				if(error.response.data != null && error.response.status != null && error.response.status==409){

				if(error.response.data.indexOf("Asset already exists with Name:")!=-1){
				  this.setState({Groupip_error: "Duplicate name", Groupip_validation: 'error'})
				  this.setState({bordercolipgroup:'1.5px solid #FF444D'});
				  this.state.showtooltipipgroup="hover";
				  this.state.labelheightipgroupname=55;
				  this.state.loadingmsgdiscovery="Discover Resources Now";
				  this.setState({validipgroupname:false});

			  }
			}
		   ev.preventDefault();
		   return false;
	  })
		assetgroupupdate(this.props.id,groupname.value,description.value)
			.then(
			   (response)=>{
				console.log("Inside success putAssetGroup")
				console.log("Inside putAssetGroup response "+JSON.stringify(response))
				console.log("New AssetGroup id is "+response.id)
			  /*startDiscovery(this.props.id)
        .then(
         (discoveryResponse)=>{
        console.log(discoveryResponse)
        console.log("Inside success discovery")
        })
        .catch((discoveryError) => {console.log("Evrror in start discovery:" + discoveryError)
         console.log("responseStatus is "+discoveryResponse.status);
        })*/

				this.state.loadingmsgdiscovery="Discover Resources Now";
				this.context.router.replace('infrastructure/mygroups')
				return true;
			})
			.catch((error) => {alert("Error in AssetGroupCreation: " + error.data)
			  console.log("Error in putAssetGroup:" + error)
			  console.log("responseStatus is "+response.status);
			  this.state.loadingmsgdiscovery="Discover Resources Now";
			  return false;
			})



	  }
	}


  }
},

 saveforlaterfunction(e)
{
  if(this.props.id==-1){
  this.state.loadingsaveforlater="Saving ...";
   // validate group name
 /* let isValidGroupLabelName = this.validateGroupLabel(this.state.GroupLabel)
  let isValidCloudType = this.ValidateCloudType()
  // procceed only if no error
  if (!(isValidGroupLabelName && isValidCloudType ))
  {
    e.preventDefault();
    return false;
  }*/
  if(this.state.cloudOption=='Cloud'){
    this.state.loadingsaveforlater="Saving ...";
	let isValidGroupLabelName = this.validateGroupLabel(this.state.GroupLabel)
    let isValidCloudType = this.ValidateCloudType()
  // procceed only if no error
	if (!(isValidGroupLabelName && isValidCloudType ))
	  {
		e.preventDefault();
		return false;
	  }
	else{
    let description="AWS Cloud";
    let regionselect=[];
    if(this.state.regionselected==""){
      regionselect=[];
    }
    else{
      let r =this.state.regionselected.split(',');
      regionselect=r ;
    }
	   let vpcselect=[];
	  if(this.state.vpcselected==""){
		vpcselect=[];
	  }
	  else{
		let v =this.state.vpcselected.split(',');
		 vpcselect=v ;

	  }
   console.log("regionselect"+regionselect)
   let credint= [];
   let number;
   for(let i=0;i<this.state.selectedCredIdList.length;i++)
	  {
	   number = parseInt(this.state.selectedCredIdList[i] , 10 );
	   credint.push(number);
	  }
   console.log("C  "+credint);
   var accesskeydata='';
   var secretaccesskeydata='';
   var instancecredentail;
   if(this.state.IAMRoleRadioOption=='iamrole'){
      accesskeydata='';
      secretaccesskeydata='';
      instancecredentail=true;
   }
   else{
      accesskeydata=accesskey.value;
      secretaccesskeydata=secretaccesskey.value;
      instancecredentail=false;
   }

   putAssetlatest(cloudTypeid.value,secretaccesskeydata,accesskeydata, cloudLabel.value,description,credint,regionselect,vpcselect,instancecredentail)
  .then(
      (response) => {
      console.log("response"+JSON.stringify(response));
      console.log("response after putAssetlatest "+JSON.stringify(response));
      console.log("Id of new asset is "+response.id)
      let assetID=parseInt(response.id , 10 );

       let name=cloudLabel.value;
       let assetDescription="";
       putAssetGroup(name,assetDescription,assetID)
        .then(
           (response)=>{
            console.log("Inside success putAssetGroup")
            console.log("Inside putAssetGroup response "+JSON.stringify(response))
            console.log("New AssetGroup id is "+response.id)
            //this.context.router.replace('policyPacks')
           // let navPath='policyPacks/'+response.id;
           // console.log("NavPath is "+navPath);
           // this.state.loadingsaveforlater="Save for Later";
           // this.context.router.replace(navPath);
           this.state.loadingsaveforlater="Save for Later";
            this.context.router.replace('infrastructure/mygroups')
            return true;
        })
        .catch((error) => {alert("Error in AssetGroupCreation: " + error.data)
          console.log("Error in putAssetGroup:" + error)
          console.log("responseStatus is "+response.status);
          this.state.loadingsaveforlater="Save for Later";
          return false;
        })
   })
  .catch((error) => {
      console.log("in getallregion"+error.response.data);
      console.log("get regions error in container"+JSON.stringify(error));
      if(error.response.data != null && error.response.status != null && error.response.status==400){

        if(error.response.data.indexOf("Invalid Aws Credentials Exception: Not a valid AK or SK")!=-1){
         this.state.loadingsaveforlater="Save for Later";
         this.setState({SecretKey_error : "Invalid Aws Credentials Exception: Not a valid AK or SK", SecretKey_validation: 'error'})
         this.state.bordercols='1.5px solid #FF444D';
         this.state.showtooltipforsecret="hover";
         this.setState({secretkeyvalid:false});
         this.state.showtooltipforaccess="hover";
         this.setState({AccessKey_error : "Invalid Aws Credentials Exception: Not a valid AK or SK", AccessKey_validation: 'error'})
         this.state.bordercola='1.5px solid #FF444D';
         this.setState({accesskeyvalid:false});
        }
      }
      if(error.response.data != null && error.response.status != null && error.response.status==409){

        if(error.response.data.indexOf("Asset already exists with Name:")!=-1){
          console.log("GGGG")
          this.setState({GroupLabel_error: "Duplicate name", GroupLabel_validation: 'error'})
          this.state.bordercolg='1.5px solid #FF444D';
          this.state.showtooltipforname="hover";
          this.state.labeltoolheight=55;
          this.state.loadingsaveforlater="Save for Later";
          this.state.cloudgoupnamevalid=false;

        }
      }

      e.preventDefault();
      return false;
  })
  }
  }
  else{
    this.state.loadingsaveforlater="Saving ...";
	//let isvalidsstartip=this.validateStartIp;
	//let isvalidendip = this.validateEndIp;
	let isvalidipgrpname = this.validateNameofIp;
	 if (!( isvalidipgrpname))
		  {
			this.state.loadingsaveforlater="Save for Later";
			ev.preventDefault();
			return false;
		  }
	else
	{
     let credint= [];
  let number;
  for(let i=0;i<this.state.selectedCredIdList.length;i++)
  {
   number = parseInt(this.state.selectedCredIdList[i] , 10 );
   credint.push(number);
  }
  console.log("C  "+credint);
  putAssetlatestforip(groupname.value,startIP.value,endIP.value,description.value,credint)
  .then(
      (response) => {
      console.log("response"+JSON.stringify(response));
      console.log("response after putAssetlatest "+JSON.stringify(response));
      console.log("Id of new asset is "+response.id)
      let assetID=parseInt(response.id , 10 );

      let name=groupname.value;
      let assetDescription="";
      putAssetGroup(name,assetDescription,assetID)
        .then(
           (response)=>{
            console.log("Inside success putAssetGroup")
            console.log("Inside putAssetGroup response "+JSON.stringify(response))
            console.log("New AssetGroup id is "+response.id)
            //this.context.router.replace('policyPacks')
           // let navPath='policyPacks/'+response.id;
            //console.log("NavPath is "+navPath);
           // //this.state.loadingsaveforlater="Save for Later";
           // this.context.router.replace(navPath);
           this.state.loadingsaveforlater="Save for Later";
            this.context.router.replace('infrastructure/mygroups')
            return true;
        })
        .catch((error) => {alert("Error in AssetGroupCreation: " + error.data)
          console.log("Error in putAssetGroup:" + error)
          console.log("responseStatus is "+response.status);
          this.state.loadingsaveforlater="Save for Later";
          return false;
        })

   })
  .catch((error) => {
      console.log("error"+error.response.data);
      console.log(" error in container"+JSON.stringify(error));

       this.state.loadingsaveforlater="Save for Later";
       if(error.response.data != null && error.response.status != null && error.response.status==409){

          if(error.response.data.indexOf("Asset already exists with Name:")!=-1){
            this.setState({Groupip_error: "Duplicate name", Groupip_validation: 'error'})
            this.setState({bordercolipgroup:'1.5px solid #FF444D'});
            this.state.showtooltipipgroup="hover";
            this.state.labelheightipgroupname=55;
            this.state.loadingsaveforlater="Save for Later";
            this.setState({validipgroupname:false});

          }
        }
        ev.preventDefault();
        return false;
  })
  }

  }
  }
  else{

	   this.state.loadingsaveforlater="Saving ...";

     if(this.state.cloudOption=='Cloud'){
       this.state.loadingsaveforlater="Saving ...";
	     let isValidGroupLabelName = this.validateGroupLabel(this.state.GroupLabel)
       let isValidCloudType = this.ValidateCloudType()
       // procceed only if no error
	     if (!(isValidGroupLabelName && isValidCloudType ))
  	   {
    		e.preventDefault();
    		return false;
  	   }
	     else{
        let description="AWS Cloud";
        let regionselect=[];
        if(this.state.regionselected==""){
          regionselect=[];
        }
        else{
          let r =this.state.regionselected.split(',');
          regionselect=r ;
        }
	      let vpcselect=[];
      	if(this.state.vpcselected==""){
      		   vpcselect=[];
      	}
	      else{
      		let v =this.state.vpcselected.split(',');
      		vpcselect=v ;

	      }

       let credint= [];
       let number;
       for(let i=0;i<this.state.selectedCredIdList.length;i++)
  	   {
    	   number = parseInt(this.state.selectedCredIdList[i] , 10 );
    	   credint.push(number);
  	   }
       var accesskeydata='';
       var secretaccesskeydata='';
       var instancecredentail;
       if(this.state.IAMRoleRadioOption=='iamrole'){
          accesskeydata='';
          secretaccesskeydata='';
          instancecredentail=true;
       }
       else{
          accesskeydata=accesskey.value;
          secretaccesskeydata=secretaccesskey.value;
          instancecredentail=false;
       }

      assetupdate(this.props.id,cloudLabel.value,accesskeydata,secretaccesskeydata,regionselect,description,credint,vpcselect)
  		.then(
  			   (response)=>{
  				console.log('successful edit assetgroup');

  			})
  			 .catch((error) => {


  		      if(error.response.data != null && error.response.status != null && error.response.status==400){

  			     if(error.response.data.indexOf("Invalid Aws Credentials Exception: Not a valid AK or SK")!=-1){
        			  this.state.loadingsaveforlater="Save for Later";
        		    this.setState({SecretKey_error : "Invalid Aws Credentials Exception: Not a valid AK or SK", SecretKey_validation: 'error'})
        			  this.state.bordercols='1.5px solid #FF444D';
        		    this.state.showtooltipforsecret="hover";
        			  this.setState({secretkeyvalid:false});
        		    this.state.showtooltipforaccess="hover";
        			  this.setState({AccessKey_error : "Invalid Aws Credentials Exception: Not a valid AK or SK", AccessKey_validation: 'error'})
        			  this.state.bordercola='1.5px solid #FF444D';
        			  this.setState({accesskeyvalid:false});
  			  }
  			}

  			if(error.response.data != null && error.response.status != null && error.response.status==409){

  			if(error.response.data.indexOf("Asset already exists with Name:")!=-1){

  			  this.setState({GroupLabel_error: "Duplicate name", GroupLabel_validation: 'error'})
  			  this.state.bordercolg='1.5px solid #FF444D';
  			  this.state.showtooltipforname="hover";
  			  this.state.labeltoolheight=55;
  			  this.state.loadingsaveforlater="Save for Later";
  			  this.state.cloudgoupnamevalid=false;

  			  }
  			}

  		   ev.preventDefault();
  		   return false;
  	  })


		assetgroupupdate(this.props.id,cloudLabel.value,description)
		.then((response)=>{

        this.state.loadingsaveforlater="Save for Later";
        this.context.router.replace('infrastructure/mygroups')
        return true;

		})
		.catch((error) => {alert("Error in AssetGroupCreation: " + error.data)
			  console.log("Error in putAssetGroup:" + error)

			  this.state.loadingsaveforlater="Save for Later";
			  return false;
			})

   }
  }
  else{

      let isvalidipgrpname = this.validateNameofIp;
      if (!( isvalidipgrpname))
  	  {
  		  this.state.loadingsaveforlater="Save for Later";
  		  ev.preventDefault();
  		  return false;
  	  }
      else
      {

    	  this.state.loadingsaveforlater="Saving ..."


    	  let credint= [];
    	  let number;
    	  for(let i=0;i<this.state.selectedCredIdList.length;i++)
    	  {
    	   number = parseInt(this.state.selectedCredIdList[i] , 10 );
    	   credint.push(number);
    	  }


    	  assetupdateforip(this.props.id,groupname.value,startIP.value,endIP.value,description.value,credint)
    	  .then(
    			   (response)=>{
    				console.log('successful edit assetgroup');

    			})
			  .catch((error) => {

				   this.state.loadingsaveforlater="Save for Later";
  				 if(error.response.data != null && error.response.status != null && error.response.status==409){

  				   if(error.response.data.indexOf("Asset already exists with Name:")!=-1){
      				  this.setState({Groupip_error: "Duplicate name", Groupip_validation: 'error'})
      				  this.setState({bordercolipgroup:'1.5px solid #FF444D'});
      				  this.state.showtooltipipgroup="hover";
      				  this.state.labelheightipgroupname=55;
      				  this.state.loadingsaveforlater="Save for Later";
      				  this.setState({validipgroupname:false});

			        }
			      }
		      ev.preventDefault();
		      return false;
	      })
		   assetgroupupdate(this.props.id,groupname.value,description.value)

			.then(
			   (response)=>{

				   this.state.loadingsaveforlater="Save for Later";
				   this.context.router.replace('infrastructure/mygroups');
				   return true;
			})
			.catch((error) => {alert("Error in AssetGroupCreation: " + error.data)

			    this.state.loadingsaveforlater="Save for Later";
			    return false;
			})

    }
   }

  }

},
nextstepfunction(ev){
  if(this.props.id==-1){
  this.state.loadmsgnextstep="Saving ...";
  if(this.state.cloudOption=='Cloud'){
  let isValidGroupLabelName = this.validateGroupLabel(this.state.GroupLabel)
  let isValidCloudType = this.ValidateCloudType()
  let isValidAccesskey = this.state.accesskeyvalid;
  let isValidSecretKey = this.state.secretkeyvalid;
  let responseStatus;

  // procceed only if no error
  if (!(isValidGroupLabelName && isValidCloudType && isValidAccesskey && isValidSecretKey))
      {
        this.state.loadmsgnextstep="Next Step";
        ev.preventDefault();
        return false;
      }
  else
  {
  this.state.loadmsgnextstep="Saving ...";
  let description="AWS Cloud";

   let regionselect=[];
    if(this.state.regionselected==""){
      regionselect=[];
    }
    else{
      let r =this.state.regionselected.split(',');
      regionselect=r ;
    }
  let vpcselect=[];
  if(this.state.vpcselected==""){
    vpcselect=[];
  }
  else{
    let v =this.state.vpcselected.split(',');
     vpcselect=v ;

  }

  console.log("regionselect"+regionselect)
  let credint= [];
  let number;
  for(let i=0;i<this.state.selectedCredIdList.length;i++)
  {
   number = parseInt(this.state.selectedCredIdList[i] , 10 );
   credint.push(number);
  }
  console.log("C  "+credint);
  var accesskeydata='';
  var secretaccesskeydata='';
  var instancecredentail;
  if(this.state.IAMRoleRadioOption=='iamrole'){
      accesskeydata='';
      secretaccesskeydata='';
      instancecredentail=true;
  }
  else{
      accesskeydata=accesskey.value;
      secretaccesskeydata=secretaccesskey.value;
      instancecredentail=false;
  }
  putAssetlatest(cloudTypeid.value,secretaccesskeydata,accesskeydata, cloudLabel.value,description,credint,regionselect,vpcselect,instancecredentail)
  .then(
    (response) => {
      console.log("response"+JSON.stringify(response));
      console.log("response after putAssetlatest "+JSON.stringify(response));
      console.log("Id of new asset is "+response.id)
      let assetID=parseInt(response.id , 10 );

       let name=cloudLabel.value;
       let assetDescription="";
       putAssetGroup(name,assetDescription,assetID)
        .then(
           (response)=>{
            console.log("Inside success putAssetGroup")
            console.log("Inside putAssetGroup response "+JSON.stringify(response))
            console.log("New AssetGroup id is "+response.id)
            //this.context.router.replace('policyPacks')
            let navPath='policyPacks/'+response.id;
            console.log("NavPath is "+navPath);
            this.state.loadmsgnextstep="Next Step";
            this.context.router.replace(navPath);
            return true;
        })
        .catch((error) => {alert("Error in AssetGroupCreation: " + error.data)
            console.log("Error in putAssetGroup:" + error)
            console.log("responseStatus is "+response.status);
            this.state.loadmsgnextstep="Next Step";
            return false;
        })

   })
  .catch((error) => {
      console.log("in getallregion"+error.response.data);
      console.log("get regions error in container"+JSON.stringify(error));
      if(error.response.data != null && error.response.status != null && error.response.status==400){

        if(error.response.data.indexOf("Invalid Aws Credentials Exception: Not a valid AK or SK")!=-1){
          this.state.loadmsgnextstep="Next Step";
		      this.setState({SecretKey_error : "Invalid Aws Credentials Exception: Not a valid AK or SK", SecretKey_validation: 'error'})
          this.state.bordercols='1.5px solid #FF444D';
		      this.state.showtooltipforsecret="hover";
          this.setState({secretkeyvalid:false});
		      this.state.showtooltipforaccess="hover";
          this.setState({AccessKey_error : "Invalid Aws Credentials Exception: Not a valid AK or SK", AccessKey_validation: 'error'})
          this.state.bordercola='1.5px solid #FF444D';
          this.setState({accesskeyvalid:false});
          }
        }
        if(error.response.data != null && error.response.status != null && error.response.status==409){

        if(error.response.data.indexOf("Asset already exists with Name:")!=-1){
          console.log("GGGG")
          this.setState({GroupLabel_error: "Duplicate name", GroupLabel_validation: 'error'})
          this.state.bordercolg='1.5px solid #FF444D';
          this.state.showtooltipforname="hover";
          this.state.labeltoolheight=55;
          this.state.loadmsgnextstep="Next Step";
          this.state.cloudgoupnamevalid=false;

          }
        }

       ev.preventDefault();
       return false;
  })
 }
}
else{
  this.setState({loadmsgnextstep:"Saving ..."});

  let isvalidsstartip=this.validateStartIp;
	let isvalidendip = this.validateEndIp;
	let isvalidipgrpname = this.validateNameofIp;
	 if (!(isvalidsstartip && isvalidendip && isvalidipgrpname))
		{
		this.state.loadmsgnextstep="Next Step";
		ev.preventDefault();
		return false;
		}
  else
  {

  let credint= [];
  let number;
  for(let i=0;i<this.state.selectedCredIdList.length;i++)
  {
   number = parseInt(this.state.selectedCredIdList[i] , 10 );
   credint.push(number);
  }
  console.log("C  "+credint);
  putAssetlatestforip(groupname.value,startIP.value,endIP.value,description.value,credint)
  .then(
      (response) => {

      let assetID=parseInt(response.id , 10 );

      let name=groupname.value;
      let assetDescription="";
      putAssetGroup(name,assetDescription,assetID)
        .then(
          (response)=>{
            let navPath='policyPacks/'+response.id;
            console.log("NavPath is "+navPath);
            this.state.loadmsgnextstep="Next Step";
            this.context.router.replace(navPath);
            return true;
        })
        .catch((error) => {alert("Error in AssetGroupCreation: " + error.data)
          console.log("Error in putAssetGroup:" + error)
          console.log("responseStatus is "+response.status);
          this.state.loadmsgnextstep="Next Step";
          return false;
        })

   })
  .catch((error) => {

        this.state.loadmsgnextstep="Next Step"
        if(error.response.data != null && error.response.status != null && error.response.status==409){

          if(error.response.data.indexOf("Asset already exists with Name:")!=-1){
            this.setState({Groupip_error: "Duplicate name", Groupip_validation: 'error'})
            this.setState({bordercolipgroup:'1.5px solid #FF444D'});
            this.state.showtooltipipgroup="hover";
  		      this.state.labelheightipgroupname=55;
            this.state.loadmsgnextstep="Next Step";
            this.setState({validipgroupname:false});

          }
        }
      ev.preventDefault();
      return false;
    })
   }
  }
 }
 else{

	  this.state.loadmsgnextstep="Saving ...";
	  if(this.state.cloudOption=='Cloud'){

	  console.log("edit save1"+this.props.id)
      let isValidGroupLabelName = this.validateGroupLabel(this.state.GroupLabel)
      let isValidCloudType = this.ValidateCloudType()
      let isValidAccesskey = this.state.accesskeyvalid;
      let isValidSecretKey = this.state.secretkeyvalid;
      let responseStatus;
	  // procceed only if no error
	    if (!(isValidGroupLabelName && isValidCloudType && isValidAccesskey && isValidSecretKey))
		  {
  			this.state.loadmsgnextstep="Next Step";
  			ev.preventDefault();
  			return false;
		  }
  	  else
  	  {
    	  console.log("edit save1"+this.props.id)
    	  this.state.loadmsgnextstep="Saving ...";
    	  let description="AWS Cloud";

    	 let regionselect=[];
       if(this.state.regionselected==""){
        regionselect=[];
       }
       else{
        let r =this.state.regionselected.split(',');
        regionselect=r ;
       }
    	  let vpcselect=[];
    	  if(this.state.vpcselected==""){
    		  vpcselect=[];
	      }
    	  else{
    		   let v =this.state.vpcselected.split(',');
    		   vpcselect=v ;

    	  }
    	  console.log("regionselect"+regionselect)
    	  let credint= [];
    	  let number;
    	  for(let i=0;i<this.state.selectedCredIdList.length;i++)
    	  {
    	   number = parseInt(this.state.selectedCredIdList[i] , 10 );
    	   credint.push(number);
    	  }
	     console.log("C  "+credint);
       var accesskeydata='';
       var secretaccesskeydata='';
       var instancecredentail;
       if(this.state.IAMRoleRadioOption=='iamrole'){
          accesskeydata='';
          secretaccesskeydata='';
          instancecredentail=true;
       }
       else{
          accesskeydata=accesskey.value;
          secretaccesskeydata=secretaccesskey.value;
          instancecredentail=false;
       }
  	   assetupdate(this.props.id,cloudLabel.value,accesskeydata,secretaccesskeydata,regionselect,description,credint,vpcselect)
  		.then(
  			   (response)=>{
  				console.log('successful edit assetgroup');

  			})
			 .catch((error) => {
  		  console.log("in getallregion"+error.response.data);
  		  console.log("get regions error in container"+JSON.stringify(error));
  		  if(error.response.data != null && error.response.status != null && error.response.status==400){

    			if(error.response.data.indexOf("Invalid Aws Credentials Exception: Not a valid AK or SK")!=-1){
    			  this.state.loadmsgnextstep="Next Step";
    			  this.setState({SecretKey_error : "Invalid Aws Credentials Exception: Not a valid AK or SK", SecretKey_validation: 'error'})
    			  this.state.bordercols='1.5px solid #FF444D';
    			  this.state.showtooltipforsecret="hover";
    			  this.setState({secretkeyvalid:false});
    			  this.state.showtooltipforaccess="hover";
    			  this.setState({AccessKey_error : "Invalid Aws Credentials Exception: Not a valid AK or SK", AccessKey_validation: 'error'})
    			  this.state.bordercola='1.5px solid #FF444D';
    			  this.setState({accesskeyvalid:false});
  			  }
			}
			if(error.response.data != null && error.response.status != null && error.response.status==409){

  			if(error.response.data.indexOf("Asset already exists with Name:")!=-1){
  			  console.log("GGGG")
  			  this.setState({GroupLabel_error: "Duplicate name", GroupLabel_validation: 'error'})
  			  this.state.bordercolg='1.5px solid #FF444D';
  			  this.state.showtooltipforname="hover";
  			  this.state.labeltoolheight=55;
  			  this.state.loadmsgnextstep="Next Step";
  			  this.state.cloudgoupnamevalid=false;

  			  }
			}

		 ev.preventDefault();
		 return false;
	  })


		assetgroupupdate(this.props.id,cloudLabel.value,description)
		.then((response)=>{
		 		let navPath='policyPacks/'+this.props.id;
				console.log("NavPath is "+navPath);
				this.state.loadmsgnextstep="Next Step";
				this.context.router.replace(navPath);
				return true;

		})
		.catch((error) => {alert("Error in AssetGroupCreation: " + error.data)
			  console.log("Error in putAssetGroup:" + error)

			  this.state.loadmsgnextstep="Next Step";
			  return false;
			})

	 }
	}
	else{
  	let isvalidsstartip=this.validateStartIp;
  	let isvalidendip = this.validateEndIp;
  	let isvalidipgrpname = this.validateNameofIp;
	  if (!(isvalidsstartip && isvalidendip && isvalidipgrpname))
		{
			this.state.loadmsgnextstep="Next Step";
			ev.preventDefault();
			return false;
		}
	  else
	  {

  	  this.setState({loadmsgnextstep:"Saving ..."});

  	  let credint= [];
  	  let number;
  	  for(let i=0;i<this.state.selectedCredIdList.length;i++)
  	  {
    	   number = parseInt(this.state.selectedCredIdList[i] , 10 );
    	   credint.push(number);
  	  }


  	  assetupdateforip(this.props.id,groupname.value,startIP.value,endIP.value,description.value,credint)
  	  .then(
  			   (response)=>{
				      console.log('successful edit assetgroup');

			})
			.catch((error) => {
				  console.log("error"+error.response.data);
				  console.log(" error in container"+JSON.stringify(error));

				  this.state.loadmsgnextstep="Next Step"
  				if(error.response.data != null && error.response.status != null && error.response.status==409){

    				if(error.response.data.indexOf("Asset already exists with Name:")!=-1){
  				  this.setState({Groupip_error: "Duplicate name", Groupip_validation: 'error'})
  				  this.setState({bordercolipgroup:'1.5px solid #FF444D'});
  				  this.state.showtooltipipgroup="hover";
  				  this.state.labelheightipgroupname=55;
  				  this.state.loadmsgnextstep="Next Step";
  				  this.setState({validipgroupname:false});

  			  }
			}
		  ev.preventDefault();
		  return false;
	  })
		assetgroupupdate(this.props.id,groupname.value,description.value)
	 .then(
			   (response)=>{
				console.log("Inside success putAssetGroup")
				console.log("Inside putAssetGroup response "+JSON.stringify(response))
				console.log("New AssetGroup id is "+response.id)
				//this.context.router.replace('policyPacks')
				let navPath='policyPacks/'+this.props.id;
				console.log("NavPath is "+navPath);
				this.state.loadmsgnextstep="Next Step";
				this.context.router.replace(navPath);
				return true;
		})
		.catch((error) => {alert("Error in AssetGroupCreation: " + error.data)
			  console.log("Error in putAssetGroup:" + error)
			  console.log("responseStatus is "+response.status);
			  this.state.loadmsgnextstep="Next Step";
			  return false;
		})

	 }
  }
 }
},

handleregion(newvalue){
  this.state.regionselected=newvalue;
  if(this.state.regionselected==""){
     this.setState({vpcs:[]});
     this.setState({vpcselected:[]});
  }
  if(this.state.IAMRoleStatus==true&&this.state.regionselected!=""){

    if(this.state.IAMRoleRadioOption=='accessrole'){
      this.getallvpcs();
    }
    else{
      console.log("dont no should we call getvpcs");
    }
  }

  else if(this.state.IAMRoleStatus==false&&this.state.regionselected!=""&&secretaccesskey.value!=""&&accesskey.value!=""){

     this.getallvpcs();
  }

},
handlevpc(value){
  this.state.vpcselected=value;
  console.log("this.state.vpcselected"+this.state.vpcselected);
},

validateGroupLabel: function(GroupLabel) {
  let GroupLabel_schema = {
      GroupLabel: Joi.string().max(32).required(),
  };
  let result = Joi.validate({GroupLabel: cloudLabel.value}, GroupLabel_schema)
  if (result.error) {
      this.refs.toolname.show();
      this.setState({GroupLabel_error : result.error.details[0].message, GroupLabel_validation: 'error'})
      this.state.cloudgoupnamevalid=false;
      this.state.bordercolg='1.5px solid #FF444D';
      this.state.labeltoolheight=55;
      this.setState({showtooltipforname:"hover"});

  } else {
      this.refs.toolname.hide();
      this.setState({showtooltipforname:false});
      this.setState({GroupLabel_error: '', GroupLabel_validation : 'success'})
      this.state.cloudgoupnamevalid=true;
      this.state.bordercolg='1.5px solid #00C484';

  }

  if( this.state.cloudgoupnamevalid)
      return true
  },

  ValidateCloudType : function() {
    console.log(cloudTypeid.value);
    let CloudType_schema = {
      CloudType: Joi.string().required(),
    };
    let result = Joi.validate({CloudType: cloudTypeid.value}, CloudType_schema)
    if (result.error) {
      this.setState({CloudType_error : result.error.details[0].message, CloudType_validation: 'error'})
      this.state.cloudtypevalid=false;
       this.state.bordercolc='1.5px solid #FF444D';

    } else {
      this.setState({ CloudType_validation : 'success'})
      this.state.cloudtypevalid=true;
      this.state.bordercolc='1.5px solid #00C484';

    }

    if( this.state.cloudtypevalid)
      return true

  },

  ValidateAccesskey : function() {
    if(this.state.passType=="password"){
      this.setState({fontfamilyforaccess:"courier"})
    }
    else{
      this.setState({fontfamilyforaccess:"Source Sans Pro "})
    }

    let AccessKey_schema = {
      AccessKey: Joi.string().required(),
    };
    let result = Joi.validate({AccessKey: accesskey.value}, AccessKey_schema)
    if (result.error) {
      this.refs.toolaccess.show();
      this.setState({AccessKey_error : result.error.details[0].message, AccessKey_validation: 'error'})
      this.state.bordercola='1.5px solid #FF444D';
      this.state.accesskeyvalid=false;
      this.state.showtooltipforaccess="hover";


    } else {
       this.refs.toolaccess.hide();
       this.setState({AccessKey_error: '', AccessKey_validation : 'success'})
       this.state.bordercola='1.5px solid #00C484'
       this.state.accesskeyvalid=true;
       this.state.showtooltipforaccess="false";
      if(accesskey.value!=""&&secretaccesskey.value!=""){
        this.getallregions();
      }
      else{
        this.state.region=[];
      }
       if(this.state.regionselected!=""&&secretaccesskey.value!=""&&accesskey.value!=""){

         this.getallvpcs();
       }
        else{
        this.setState({vpcs:[]});
      }

  }

  if( this.state.accesskeyvalid)
  return true

  },
ValidateSecretKey : function() {
  if(this.state.passSecret==="password"){
      this.setState({fontfamilyforsecret:"courier"})
  }
  else{
      this.setState({fontfamilyforsecret:"Source Sans Pro "})
   }
  console.log(secretaccesskey.value);
  let SecretKey_schema = {
      SecretKey: Joi.string().required(),
  };
  let result = Joi.validate({SecretKey: secretaccesskey.value}, SecretKey_schema)
  if (result.error) {
      this.setState({SecretKey_error : result.error.details[0].message, SecretKey_validation: 'error'})
      this.state.bordercols='1.5px solid #FF444D';
      this.state.secretkeyvalid=false;
      this.refs.secretinfo.show();
      this.state.showtooltipforsecret="hover";


  } else {
      this.refs.secretinfo.hide();
     //ReactDOM.findDOMNode(this.refs.secretinfo).hide();
     //ReactDOM.findDOMNode(document.getElementById("secretinfo")).hide();
      this.setState({SecretKey_error: '', SecretKey_validation : 'success'})
      this.state.bordercols='1.5px solid #00C484';
      this.state.secretkeyvalid=true;
      this.state.showtooltipforsecret="false";

      if(accesskey.value!=""&&secretaccesskey.value!=""){
        this.getallregions();
      }
      else{
        this.setState({region:[]});
      }
      if(this.state.regionselected!=""&&secretaccesskey.value!=""&&accesskey.value!=""){

         this.getallvpcs();
       }
       else{
        this.setState({vpcs:[]});
      }

    }

    if( this.state.secretkeyvalid)
      return true

},
OnchangeRolename : function() {
 console.log("rolename.value"+rolename.value);
 // this.getallregions();
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
funpasssecret(){
    if(this.state.passSecret==="password")
    {
      this.setState({passSecret:"text"});
      this.setState({showhideforsecret:"Hide characters"});
       this.setState({fontfamilyforsecret:"Source Sans Pro"});
    }
    else{
      this.setState({passSecret:"password"});
      this.setState({showhideforsecret:"Show characters"});
      this.setState({fontfamilyforsecret:"courier"});
   }

},
validateStartIp:  function(){

  if(startIP.value!=""){
     this.setState({validstartip:true});
  }else{
     this.setState({validstartip:false});
  }
  let startip_schema = {
    startIprange: Joi.string().required(),
  };
  let result = Joi.validate({startIprange: startIP.value}, startip_schema);
  if (result.error) {
    this.refs.toolsip.show();
    this.state.validstartip=false;
    this.setState({startip_error : "Start Ip is not allowed to be empty.", startip_validation: 'error'})
    this.setState({bordercolstartip:'1.5px solid #FF444D'});
    this.state.showtooltipstartip="hover";

  }
  else{
    this.refs.toolsip.hide();
    this.setState({validstartip:true});
    this.setState({startip_error: ' ', startip_validation : 'success'})
    this.state.bordercolstartip='1.5px solid #00C484';
    this.state.showtooltipstartip="false";
  }
  if( this.state.validstartip)
    return true;

  },
validateEndIp:  function(){

  let endip_schema = {
      endIprange: Joi.string().required(),
  };
  let result = Joi.validate({endIprange: endIP.value}, endip_schema);
  if (result.error) {
     this.refs.tooleip.show();
     this.setState({validendip:false});
	   this.setState({endip_error : "End Ip is not allowed to be empty.", endip_validation: 'error'})
     this.state.bordercolendip='1.5px solid #FF444D';
     this.state.showtooltipendip="hover";

  }
  else{
    this.refs.tooleip.hide();
    this.setState({validendip:true});
    this.setState({endip_error: '', endip_validation : 'success'})
    this.state.bordercolendip='1.5px solid #00C484';
    this.state.showtooltipendip= "false";
  }
 if( this.state.validendip)
  return true;

},
validateNameofIp:  function(){

  let groupname_schema = {
      groupnameIprange: Joi.string().required(),
  };
  let result = Joi.validate({groupnameIprange: groupname.value}, groupname_schema);
  if (result.error) {
    this.refs.toolipname.show();
    this.setState({validipgroupname:false});
	  this.setState({Groupip_error : "Group Name is not allowed to be empty", Groupip_validation: 'error'})
    this.state.bordercolipgroup='1.5px solid #FF444D';
    this.state.showtooltipipgroup="hover";
    this.state.labelheightipgroupname =55;


  }
  else{
    this.refs.toolipname.hide();
    this.setState({validipgroupname:true});
    this.setState({Groupip_error: '', Groupip_validation : 'success'})
    this.state.bordercolipgroup='1.5px solid #00C484';
    this.state.showtooltipipgroup= "false";
  }
  if( this.state.validipgroupname)
    return true;

},


  render() {

	  this.state.savelater=!(this.state.loadingsaveforlater=="Save for Later"&&((this.state.validipgroupname&&this.state.cloudOption!='Cloud')||(this.state.cloudOption=='Cloud'&&this.state.cloudgoupnamevalid)));
    this.state.nextstep=!(this.state.loadmsgnextstep=="Next Step"&&((this.state.validstartip&&this.state.validendip&&this.state.validipgroupname&& this.state.cloudOption!='Cloud')||( this.state.cloudgoupnamevalid&&this.state.cloudtypevalid&&this.state.accesskeyvalid&&this.state.secretkeyvalid&&this.state.cloudOption=='Cloud')));
	  this.state.discoverybutton=!(this.state.loadingmsgdiscovery=="Discover Resources Now"&&((this.state.validstartip&&this.state.validendip&&this.state.validipgroupname&& this.state.cloudOption!='Cloud')||( this.state.cloudgoupnamevalid&&this.state.cloudtypevalid&&this.state.accesskeyvalid&&this.state.secretkeyvalid&&this.state.cloudOption=='Cloud')));

     const   CloudMultiStepFooter=(

     <div className={footerDivContainer}>
      <br/>
      <br/>
      <div>
      <div className="col-lg-7"> </div>
        <div className="col-lg-5">
          <Button  disabled={this.state.savelater} onClick={this.saveforlaterfunction} href='javaScript: void(0)' className={footerBtn} >Save for Later</Button>
           {'        '}
           <Button disabled={this.state.discoverybutton} onClick={this.discoverfunction}   href='javaScript: void(0)' className={footerBtn} >
          {this.state.loadingmsgdiscovery}
          </Button>
          <Button disabled={this.state.nextstep} onClick={this.nextstepfunction} href='javaScript: void(0)' className={footerBtn} >{this.state.loadmsgnextstep}</Button>
        </div>
        </div>
    </div>
    );

    let headingColor = {color: 'green'}
    let tooltipeffect= {color: 'black',borderWidth: 2,
                        borderRadius:0,width:200,height:150}

    let popoverwidth ={width:1200}
    let containerStyle={paddingRight: 0,paddingLeft: 0,marginRight: 0,marginLeft:0,width:'100%',fontFamily: 'Source Sans Pro'}

    const tooltipGroupIpName = (
      <Popover   style={{height:this.state.labelheightipgroupname,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.Groupip_error}</Popover>
    );

	 const tooltipStartIP = (
      <Popover   style={{height:60,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.startip_error}</Popover>
    );

	 const tooltipEndIp = (
      <Popover   style={{height:60,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.endip_error}</Popover>
    );


    const tooltipGroupLabel = (
      <Popover   style={{height:this.state.labeltoolheight,color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.GroupLabel_error}</Popover>
    );
    const tooltipCloudType = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:120}}>{this.state.CloudType_error}</Popover>
    );
     const tooltipAcesskey = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:80}}>{this.state.AccessKey_error}</Popover>
    );

     const tooltipSecretKey = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:80}}>{this.state.SecretKey_error}</Popover>
    );


  return (
    <div style={containerStyle} className="container">
      <CloudMultistepHeader/>

      <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#FFFFFF'}}>
        <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
        </div>
        <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
         <br />
         <FormGroup controlId="formControlCloudOnpremises">

          <div className="form-group option_field radio" id="grping-server">
           <div className="row col-xs-12 pull-right">
             <input type="radio" name="cloudname" id="cloudid" value="Cloud" checked={this.state.cloudOption === 'Cloud'?true:false} onChange={this.handleOptionChange}/>
                <strong >Cloud    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
             <input type="radio" name="onpremisesname" id="onpremisesid" value="Onpremises" checked={this.state.cloudOption === 'Onpremises'?true:false} onChange={this.handleOptionChange}/>
                <strong>On-Prem</strong>
            </div>
          </div>
         </FormGroup>
         <br />
         <br />
        </div>
      </div>

      {
        this.state.cloudOption==='Cloud'?
        <div>
         <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#F9FAFC'}}>
          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
          </div>
          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
           <h3 style={{fontSize:'15px'}}><strong>CLOUD DETAILS</strong></h3>
           <br/>

           <FormGroup  onChange={this.ValidateCloudType} validationState={this.state.CloudType_validation}>
            <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Cloud Type </ControlLabel>
            <OverlayTrigger   placement="right" overlay={tooltipCloudType}>
            <select className={selectStyle} id="cloudTypeid" placeholder= "Enter Cloud Type" style={{width:326,height:40,border:this.state.bordercolc,borderRadius:0}} >
            {
              this.state.CloudType.map((item) =>
              {
                return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
              }
              )}
            </select>
            </OverlayTrigger>
           </FormGroup>

           <FormGroup  controlId="cloudLabel" validationState={this.state.GroupLabel_validation} >
            <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Account Name</ControlLabel>
            <OverlayTrigger ref="toolname" trigger={this.state.showtooltipforname} placement="right" overlay={tooltipGroupLabel}>
            <FormControl type="text"
                name="GroupLabel"
                value={this.state.GroupLabel}
                placeholder="Enter group name"
                style={{width:326,height:40,border:this.state.bordercolg,borderRadius:0}}
                onBlur={this.validateGroupLabel}  />
            </OverlayTrigger>
           </FormGroup>

           <FormGroup  onChange={this.ValidateCloudType} validationState={this.state.CloudType_validation}>
            <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Cloud Type </ControlLabel>
            <OverlayTrigger   placement="right" overlay={tooltipCloudType}>
            <select className={selectStyle} id="cloudTypeid" placeholder= "Enter Cloud Type" style={{width:326,height:40,border:this.state.bordercolc,borderRadius:0}} >
            {
              this.state.CloudType.map((item) =>
              {
                return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
              }
              )}
            </select>
            </OverlayTrigger>
           </FormGroup>

           <FormGroup  onChange={this.ValidateCloudType} validationState={this.state.CloudType_validation}>
            <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Cloud Type </ControlLabel>
            <OverlayTrigger   placement="right" overlay={tooltipCloudType}>
            <select className={selectStyle} id="cloudTypeid" placeholder= "Enter Cloud Type" style={{width:326,height:40,border:this.state.bordercolc,borderRadius:0}} >
            {
              this.state.CloudType.map((item) =>
              {
                return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>
              }
              )}
            </select>
            </OverlayTrigger>
           </FormGroup>

           <FormGroup  controlId="cloudLabel" validationState={this.state.GroupLabel_validation} >
            <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Account Name</ControlLabel>
            <OverlayTrigger ref="toolname" trigger={this.state.showtooltipforname} placement="right" overlay={tooltipGroupLabel}>
            <FormControl type="text"
                name="GroupLabel"
                value={this.state.GroupLabel}
                placeholder="Enter group name"
                style={{width:326,height:40,border:this.state.bordercolg,borderRadius:0}}
                onBlur={this.validateGroupLabel}  />
            </OverlayTrigger>
           </FormGroup>

           <br/><br/>
          </div>
        </div>

        <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#EDF2F8'}}>
          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
          </div>

          <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
             <br/>
            <FormGroup controlId="Credentials">
             <ControlLabel style={{fontSize:'15px'}} >CLOUD CREDENTIALS</ControlLabel>
            </FormGroup>

           {(this.state.IAMRoleStatus === true)?
            <div style={{paddingLeft:'22px'}}>
             <FormGroup controlId="iamradiobutton">
              <div className="form-group option_field radio" id="iamst">

                 <input type="radio"  name="iamrole" id="iamroleid" value="iamrole" checked={this.state.IAMRoleRadioOption==='iamrole'?true:false} onChange={this.handleIAMRadio}/>
                    <label htmlFor="iamroleid" style={{fontWeight:'500',fontSize:'15px'}}>&nbsp;&nbsp;{`Assume instance IAM Role (${this.state.IAMRoleName})`}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </label>
                    <br />
                    <br />
                 <input type="radio"  name="accessrole" id="accessroleid" value="accessrole" checked={this.state.IAMRoleRadioOption==='accessrole'?true:false} onChange={this.handleIAMRadio}/>
                    <label htmlFor="accessrole" style={{fontWeight:'500',fontSize:'15px'}}>&nbsp;&nbsp;Authenticate using Access Key &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </label>

              </div>
             </FormGroup>
             </div>
             :
             <noscript />
           }
           {((this.state.IAMRoleRadioOption === 'accessrole')||(this.state.IAMRoleStatus === false))?
           <div>
           <br />
            <FormGroup controlId="accesskey" validationState={this.state.AccessKey_validation}>
              <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Access Key ID</ControlLabel>
              <OverlayTrigger  ref="toolaccess"  trigger={this.state.showtooltipforaccess} placement="right" overlay={tooltipAcesskey}>
                <input id="accesskey" type={this.state.passType}  placeholder=" Access key" onBlur={this.ValidateAccesskey} style={{fontFamily:this.state.fontfamilyforaccess,width:326,height:40,padding:'12px',border:this.state.bordercola,borderRadius:0}}/>
              </OverlayTrigger>
              <div  style={{width:'326px',textAlign:'right'}}>
                <a style={{cursor: "pointer"}} onClick={this.funpassaccess}>{this.state.showhideforaccess}</a></div>

            </FormGroup>


            <FormGroup controlId="secretaccesskey" validationState={this.state.SecretKey_validation}>
              <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Secret Access Key</ControlLabel>
              <OverlayTrigger ref="secretinfo" trigger={this.state.showtooltipforsecret} placement="right" overlay={tooltipSecretKey}>
                <input id="secretaccesskey" type={this.state.passSecret} placeholder=" Secret access key" onBlur={this.ValidateSecretKey} style={{fontFamily:this.state.fontfamilyforsecret,width:326,height:40,padding:'12px',border:this.state.bordercols,borderRadius:0}}/>
              </OverlayTrigger>
              <div style={{width:'326px',textAlign:'right'}}>
                 <a style={{cursor: "pointer"}} onClick={this.funpasssecret}>{this.state.showhideforsecret}</a></div>
            </FormGroup>
            <FormGroup  controlId="rolename">
              <ControlLabel style={{fontWeight:500}}>Role Name(Optional)</ControlLabel>
              <FormControl type="text" placeholder="Enter Role Name" style={{width:326,height:40,border:'1.5px solid #4C58A4',borderRadius:0}} onChange={this.OnchangeRolename}/>
            </FormGroup>
            <br />


           </div>
           :
           <noscript />
           }

            <FormGroup controlId="cloudRegionSelect">
              <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Region (Optional)</ControlLabel>
              <Select  id="cloudRegionSelect"  placeholder={<i>Select Region</i>}
                name=""
                value={this.state.regionselected}
                options={this.state.region}
                multi={true}
                clearable={true}
                searchable={true}
                isLoading={this.state.regionloading}
                onChange={this.handleregion}/>
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
          <br/>



        </div>
       </div>
      </div>
      :
      <div className="row " style={{margin:'0px',width:'100%',backgroundColor:'#F9FAFC'}}>
       <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
       </div>
       <div className="col-lg-4 col-xs-4 col-md-4 col-sm-4">
       <form >
        <FormGroup  controlId="startIP" validationState={this.state.startip_validation}>
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Starting IP: </ControlLabel>
		      <OverlayTrigger ref="toolsip"  trigger={this.state.showtooltipstartip} placement="right" overlay={tooltipStartIP}>
              <input id="startIP" type="text" placeholder="Ip range" style={{padding:'12px',width:326,height:40,border:'1.5px solid #4C58A4',borderRadius:0,border:this.state.bordercolstartip}} onBlur={this.validateStartIp}/>
          </OverlayTrigger>
		    </FormGroup>

        <FormGroup  controlId="endIP" validationState={this.state.endip_validation}>
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Ending IP: </ControlLabel>
		      <OverlayTrigger ref="tooleip"  trigger={this.state.showtooltipendip} placement="right" overlay={tooltipEndIp}>
             <input id="endIP" type="text" placeholder="Ip range" style={{padding:'12px',width:326,height:40,border:'1.5px solid #4C58A4',borderRadius:0,border:this.state.bordercolendip}} onBlur={this.validateEndIp}/>
		      </OverlayTrigger>
	      </FormGroup>


        <FormGroup  controlId="groupname" validationState={this.state.Groupip_validation}>
          <ControlLabel  className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Asset group name: </ControlLabel>
			    <OverlayTrigger ref="toolipname"  trigger={this.state.showtooltipipgroup} placement="right" overlay={tooltipGroupIpName}>
			      <input id="groupname" type="text" placeholder="Provide group name" style={{padding:'12px',width:326,height:40,border:'1.5px solid #4C58A4',borderRadius:0,border:this.state.bordercolipgroup}}  onBlur={this.validateNameofIp}/>
          </OverlayTrigger>
		    </FormGroup>

        <FormGroup  controlId="description">
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Asset group description: </ControlLabel>
          <input id="description" type="text" placeholder="Provide a description for this group - if needed" style={{padding:'12px',width:326,height:40,border:'1.5px solid #4C58A4',borderRadius:0}}/>
        </FormGroup>

       </form>
      </div>
     </div>
    }

    <ResourceCredentials getCredentialsId={this.getCredentialsId} credidsedit={this.state.credidsforedit} idtobeedited={this.props.id}/>
    {CloudMultiStepFooter}

   </div>
  );
 }
})

export {CloudDetails}
