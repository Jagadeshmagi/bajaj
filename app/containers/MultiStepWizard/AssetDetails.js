import React, { Component, PropTypes } from 'react'
import {Tags} from './tags'
import {FormGroup, ControlLabel, Radio} from 'react-bootstrap'
import {divContainer,toDoCircle,inProgressOuterCircle,inProgressInnerCircle} from './styles.css'

import {getAssetGroup} from 'helpers/assetGroups'
import {getassetforedit} from 'helpers/assetGroups';

import OnPremAssetDetails from './OnPremAssetDetails'
import CloudAssetDetails from './CloudAssetDetails'
import DockerDetails from './DockerDetails'



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
                    <li>ASSESSMENTS </li>
                </ul>
              </td>
          </tr>
        </tbody>
      </table>
    </div>

  )
}

function DockerMultistepHeader() {
  let DiscoverLabelStyle={color:"white"}
  return (
    <div className={divContainer}>
    <br/>
    <table className="col-lg-12 col-sm-12 col-md-12 col-xs-12" style={{width: '70%',fontSize: 15,marginLeft:120}} >
     <tbody>
        <tr>
        </tr>
        <tr>
        </tr>
        <tr >
            <td style={{width:'25%'}}>
             <span  className={inProgressOuterCircle}>
               <span  className={inProgressInnerCircle}>
               </span>
             </span>
            </td>
            <td style={{width:'25%'}}>
             <span  className={toDoCircle}>
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
             
        </tr>
       </tbody>
      </table>
    </div>

  )
}


const AssetDetails = React.createClass ({
  getInitialState() {
   return {
	  cloudOption :'Cloud',
    credidsforedit:[],
	  selectedCredIdList:[],
    tags:[],
  }},

  contextTypes: {
    router: PropTypes.object.isRequired,
  },

  componentDidMount(){
	   /*
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
*/
},


handleOptionChange: function (changeEvent) {
  this.setState({
    cloudOption: changeEvent.target.value

  });
},

getCredentialsId(credIdList){
  console.log("Cred id from ResourceCredentials "+credIdList);
  this.setState({selectedCredIdList:credIdList});
  console.log("Cred id after setting ResourceCredentials "+ this.state.selectedCredIdList);
},

getTagList(tagList){
  console.log("Tags list from tags "+tagList);
  this.setState({tags:tagList});
  console.log("this.state.tags "+ this.state.tags);
},

loadPolicyPacks(id){
	let navPath='policyPacks/'+id;
	console.log("NavPath is "+navPath);
	this.context.router.replace(navPath);
},

loadDockerPolicyPacks(imageId){
  let navPath='dockerpolicyPacks/'+imageId;
  console.log("NavPath is "+navPath);
  this.context.router.replace(navPath);
  
},


loadGroupsPage(id){
	this.context.router.replace('infrastructure/mygroups')
},

render() {

  let headingColor = {color: 'green'}
  let tooltipeffect= {color: 'black', borderWidth: 2, borderRadius:0, width:200, height:150}

  let popoverwidth ={width:1200}
  let containerStyle={paddingRight: 0,paddingLeft: 0,marginRight: 0,marginLeft:0,width:'100%',fontFamily: 'Source Sans Pro'}

  return (
    <div style={containerStyle} className="container">
     {
      /*(this.state.cloudOption==='Cloud'|| this.state.cloudOption==='Onpremises')?
      <CloudMultistepHeader/>
      :
      <DockerMultistepHeader />*/
     }
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
                <strong>On-Prem &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
              <input type="radio" name="dockername" id="dockername" value="Docker" checked={this.state.cloudOption === 'Docker'?true:false} onChange={this.handleOptionChange}/>
                <strong>Docker Image &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
            </div>
          </div>
         </FormGroup>
         <br />
         <br />
        </div>
      </div>

      {
        this.state.cloudOption==='Cloud'?
    		<CloudAssetDetails 
    		loadPolicyPacks = {this.loadPolicyPacks}
    		loadGroupsPage = {this.loadGroupsPage}
    		getCredentialsId = {this.getCredentialsId}
    		credidsforedit = {this.state.credidsforedit}
    		id = {this.props.id}
    		selectedCredIdList = {this.state.selectedCredIdList}
    		/>
    		:
        <noscript />
      }
      {
        this.state.cloudOption==='Onpremises'?
    		<OnPremAssetDetails 
    		loadPolicyPacks = {this.loadPolicyPacks}
    		loadGroupsPage = {this.loadGroupsPage}
    		getCredentialsId = {this.getCredentialsId}
    		credidsforedit = {this.state.credidsforedit}
    		id = {this.props.id}
    		selectedCredIdList = {this.state.selectedCredIdList}
    		/>
        :
        <noscript />
      }
      {
        this.state.cloudOption==='Docker'?
        <DockerDetails 
        loadDockerPolicyPacks = {this.loadDockerPolicyPacks}
        loadGroupsPage = {this.loadGroupsPage}
        getCredentialsId = {this.getCredentialsId}
        credidsforedit = {this.state.credidsforedit}
        id = {this.props.id}
        selectedCredIdList = {this.state.selectedCredIdList}
        />
        :
        <noscript />
      }
   
	 


   </div>
  );
}
})

export default AssetDetails
