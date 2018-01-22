import React, { PropTypes } from 'react'
import {AlertTable} from 'containers'
import {footerBtn, blueBtn,btnPrimary, selectStyle,modalCloseBtnStyle,modalDialogClass} from 'sharedStyles/styles.css'
import {Col, Row, Grid, Button, Modal, ControlLabel, FormGroup, Popover, OverlayTrigger, FormControl} from 'react-bootstrap'
import {addCloudModalHeader, modalCloseStyle, footerDivContainer, cloudModal, modalContainer} from './styles.css'
import {verifyPDconnection, addIntegration, getAllIntegrations} from 'helpers/integration'
import {getIAMRoleStatus} from 'helpers/assetGroups'
import {addCloud, validateCloud, updateCloud, getCloudById, uploadJSONP12} from 'helpers/cloud'
// import {updateCloud, getCloudById} from 'helpers/cloud'
import {monitorAcountDetails, getMonitorAccountDetails, updateMonitorAcount, getS3BucketNameForMonitorAK_SAK, getS3BucketNameForMonitorAIC, getS3BucketNameForMonitorARN,enablemonitorForAccounts} from 'helpers/alerts'
import Joi from 'joi-browser'
import {Instructions} from "./Instructions"
import closeButtonImg from 'assets/close_Button.png'
import OverLayCustom from 'components/Common/OverLayCustom'
import Select from 'react-select'

const MaxInputCount = React.createClass({
	getInitialState() {
    let charsLeft = 150;
    if(this.props.defaultValue){
      charsLeft = 149-this.props.defaultValue.length
    }
    	return {
        	charsLeft: charsLeft,
          value:"",
        };
    },
  checkLength(){
      if(this.state.charsLeft > 0){
        this.props.handleChange(this.state.value);
        return true;
      }
      else {
        var str = this.state.value;
        str = str.substring(0, 149);
        this.props.handleChange(str);
        document.getElementById(this.props.bordercolc).value = str;
      }
    },
    handleChange(event) {
      let maxChars = 150
    	var input = event.target.value;
        this.setState({
        	charsLeft: maxChars - input.length,
          value: event.target.value
        }
        , ()=>{this.checkLength()}
      );
    },
	render(){
    	return (
        	<div>
            <FormControl componentClass="textarea" style={{width:325,height:80,borderRadius:0,border:this.props.bordercolc}}
             id={this.props.bordercolc}
             placeholder="Enter Account Description"
             defaultValue={this.props.defaultValue}
             onFocus={this.props.onFocus}
             onChange={this.handleChange}/>
					 <p style={{fontSize:"12px"}}>Characters Left: {this.state.charsLeft}</p>
          </div>
        );
    }
});

const AddCloud = React.createClass({

  getInitialState(){
    return{
      validated:false,
      errorGeneral:"",
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///AWS CREDENTIAL///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      accesskeyvalid:false,
      errorGeneral:"",
      secretkeyvalid:false,
      ARNRole_validation: '',
      ExternalID_validation: '',
      bordercolarn:'thin solid #4C58A4',
      bordercoleid:'thin solid #4C58A4',
      ARNRole_error: 'Provide valid ARN Role associated with this AWS account.',
      ExternalID_error: ' Provide External ID associated with this AWS account.',
      AccountName_validation: '',
      S3BucketName_error:'Provide S3 Bucket name',
      S3BucketRegion_error:'Provide credentials and click "Validate" to get the Bucket names',
      Prefix_error:'Provide a Prefix (optional)',
      AccountName_error: ' Provide a unique name for this account.',
      bordercolg:'thin solid #4C58A4',
			bordercolPrefix:'thin solid #4C58A4',
      CloudType_validation: '',
      CloudType_error: 'Select your cloud provider. Please note, only one cloud type can be selected for each group.',
      bordercolc:'thin solid #4C58A4',
      AccessKey_validation: '',
      AccessKey_error: ' Provide valid Access Key ID associated with this AWS account.',
      bordercola:'thin solid #4C58A4',
      SecretKey_validation: '',
      SecretKey_error: 'Provide valid Secret Access Key associated with this AWS account.',
      bordercols:'thin solid #4C58A4',
      showtooltipforname:"hover",
			showtooltipfors3:"hover",
      showtooltipforARN:"hover",
      showtooltipforExternalID:"hover",
      showhideforaccess:"Show characters",
      showhideforsecret:"Show characters",
      passType:"password",
      passSecret:"password",
      showCloud:false,
      cloudsList:this.props.cloudsList,
      cloudNumber: 0,
      apiKey:'',
      cloudType:'pagerduty',
      apiCloudStatus:'',
      apiCloudDescription:'',
      loadingDiv:true,
      selectedCloudType:"AWS",
      bordercolc:'thin solid #4C58A4',
      CloudType:[{label:"AWS", value:"AWS"}, {label:"Microsoft Azure", value:"Azure"}, {label:"Google Cloud", value:"Google"}],
      regions:[{label:"East", value:"East"}, {label:"West", value:"West"}, {label:"South", value:"South"}],
      showPwdDescription:"Show characters",
      passType:"password",
      desc:"",
      cloudOptionAWS:"awsAssumeInstanceCred",
      accountDescription:"",
      accountName:"",
      accessKeyAWS:"",
      secretAccessKeyAWS:"",
      ARNRole: "",
      ExternalID:null,
      validateButtonDisability:true,
      // instanceDisable:false,
      instanceDisable:true,
      IAMRoleName:'',
      ASKValid: false,
      ARNValid: false,
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///AZURE CREDENTIAL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      cloudOptionAzure:"RM",
      currentOption:"awsAssumeInstanceCred",
      subscriptionID_Validation: "",
      applicationID_Validation: "",
      applicationKey_Validation: "",
      tenantID_Validation: "",
      email_Validation: "",
      password_Validation: "",
      subscriptionID_Error: "Please enter a Subscription ID",
      applicationID_Error: "Please enter an Application ID",
      applicationKey_Error: "Please enter an Application Key",
      tenantID_Error: "Please enter a Tenant ID",
      email_Error: "Please enter an E-mail",
      password_Error: "Please enter a Password",
      showtooltipforSubscriptionID:"hover",
      showtooltipforAppID:"hover",
      showtooltipforAppKey:"hover",
      showtooltipforTenantID:"hover",
      showtooltipforEmail:"hover",
      showtooltipforPassword:"hover",
      passSubscriptionID:"password",
      passAppID:"password",
      passAppKey:"password",
      passTenantID:"password",
      passPassword:"password",
      bordercolSubID:'thin solid #4C58A4',
      bordercolAppID:'thin solid #4C58A4',
      bordercolAppKey:'thin solid #4C58A4',
      bordercolTenID:'thin solid #4C58A4',
      bordercolEmail:'thin solid #4C58A4',
      bordercolPassword:'thin solid #4C58A4',
      showhideforSubID:"Show characters",
      showhideforAppID:"Show characters",
      showhideforAppKey:"Show characters",
      showhideforTenID:"Show characters",
      showhideforPassword:"Show characters",
      SubscriptionID:"",
      AppID:"",
      AppKey:"",
      TenantID:"",
      Email:"",
      Password:"",
      RMValid: false,
      RMCValid: false,
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///GOOGLE CLOUD CREDENTIAL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      cloudOptionGoogle:"P12",

      serviceAccount:"",
      uploadFileNameJSON:"",
      uploadFileNameP12:"",

      p12_Error:"Please select a P12 file",
      serviceaccount_Error:"Please enter Service Account",
      json_Error:"Please select a JSON file",

      P12_validation:"",
      ServiceAccount_validation:"",
      JSON_validation:"",

      bordercolP12:'thin solid #4C58A4',
      bordercolServiceAccount:'thin solid #4C58A4',
      bordercolJSON:'thin solid #4C58A4',

      showtooltipforP12:"hover",
      showtooltipforServiceAccount:"hover",
      showtooltipforJSON:"hover",
      p12FileExists: false,
      jsonFileExists: false,

      passserviceaccount:"password",
      showhideforserviceaccount:"Show characters",
      S3PrefixValueList:[
        {label:'2 Days',value:'2'},
        {label: '1 Week', value:'7'},
        {label: '1 Month', value:'30'}

      ],

      // serviceAccount_Validation: "",
      // uploadFileName_Validation: "",
      // uploadFileNameP12_Validation: "",
      //
      // serviceAccount_Error: "Please enter a Subscription ID",
      // uploadFileName_Error: "Please enter an Application ID",
      // uploadFileNameP12_Error: "Please enter an Application Key",
      //
      //
      // showtooltipforSubscriptionID:"hover",
      // showtooltipforAppID:"hover",
      // showtooltipforAppKey:"hover",
      // showtooltipforTenantID:"hover",
      // showtooltipforEmail:"hover",
      // showtooltipforPassword:"hover",
      // passSubscriptionID:"password",
      // passAppID:"password",
      // passAppKey:"password",
      // passTenantID:"password",
      // passPassword:"password",
      // bordercolSubID:'thin solid #4C58A4',
      // bordercolAppID:'thin solid #4C58A4',
      // bordercolAppKey:'thin solid #4C58A4',
      // bordercolTenID:'thin solid #4C58A4',
      // bordercolEmail:'thin solid #4C58A4',
      // bordercolPassword:'thin solid #4C58A4',
      // showhideforSubID:"Show characters",
      // showhideforAppID:"Show characters",
      // showhideforAppKey:"Show characters",
      // showhideforTenID:"Show characters",
      // showhideforPassword:"Show characters",
      //
      // RMValid: false,
      // RMCValid: false,
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///Monitoring///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      enableMonitor:false,
      S3bucketname:'',
      S3Prefix:'2',
      S3SelectedBucketname:'',
      s3Regions:[],
      S3BucketName:[],
      responceRegions:[],
      bucketId:'',
      s3bucketNameValid:false,
      bordercolorForS3name:'thin solid #4C58A4',
      regionUsingBucket:'',
      S3BucketNameResponce:[],
      cloudAdded:false,
      showCollectionWindowModal:false,
      newS3Prefix:'',
      idofCloud:'',
      }
  },

  componentWillReceiveProps(nextProps){
    this.setState({
      cloudsList:nextProps.cloudsList
    })
  },

  openCloudModal(){
    // if(this.state.cloudOptionAWS === "awsSk" && this.props.edit === true){
    //   this.setState({
    //     ASKValid: true
    //   })
    // } else if (this.state.cloudOptionAWS === "awsArn" && this.props.edit === true){
    //   this.setState({
    //     ARNValid: true
    //   })
    // }
    // this.checkValidationDisability();
    if (this.props.edit === true){
      let cloudId=this.props.selectedIntegrationIds[0].id;
      let cloudType=this.props.selectedIntegrationIds[0].cloudType;
      getCloudById(cloudType,cloudId)
      .then((cloudResponseData)=>{

       this.setState({idofCloud:cloudResponseData.monitorSourceId})
        if(cloudResponseData.authtype === "awsSk" && this.props.edit === true){
          this.setState({
						cloudOptionAWS: "",
            ASKValid: true,
            errorGeneral:"",
          }, ()=>{
						console.log("ASKASKASKASK", this.state.ASKValid);
						console.log("this.state.cloudOptionAWS", this.state.cloudOptionAWS)
						this.checkValidationDisability()
					}
				)
        } else if (cloudResponseData.authtype === "awsArn" && this.props.edit === true){
          this.setState({
						cloudOptionAWS: "",
            ARNValid: true,
            errorGeneral:"",
          }, ()=>{
						console.log("this.state.cloudOptionAWS", this.state.cloudOptionAWS)
						this.checkValidationDisability()
					}
				)
        } else if (cloudResponseData.authtype === "AzureServicePrincipal" && this.props.edit === true){
          this.setState({
						cloudOptionAzure:"RM",
						cloudOptionAWS: "",
            RMValid: true,
            errorGeneral:"",
          }, ()=>{
						console.log("this.state.cloudOptionAWS", this.state.cloudOptionAWS)
						this.checkValidationDisability()
					}
				)
        } else if (cloudResponseData.authtype === "AzureOAuth2" && this.props.edit === true){
          this.setState({
						cloudOptionAzure:"RMC",
						cloudOptionAWS: "",
            RMCValid: true,
            errorGeneral:"",
          }, ()=>{
						console.log("this.state.cloudOptionAWS", this.state.cloudOptionAWS)
						this.checkValidationDisability()
					}
				)
        } else if (cloudResponseData.authtype === "gcpJson" && this.props.edit === true){
          this.setState({
						cloudOptionGoogle:"JSON",
						cloudOptionAWS: "",
            RMCValid: true,
            errorGeneral:"",
						uploadFileNameJSON:cloudResponseData.authCredential.serviceAccountKeyPath.slice(33,cloudResponseData.authCredential.serviceAccountKeyPath.length),
          }, ()=>{
						console.log("this.state.cloudOptionAWS", this.state.cloudOptionAWS)
						this.checkValidationDisability()
					}
				)
        } else if (cloudResponseData.authtype === "gcpP12" && this.props.edit === true){
          this.setState({
						cloudOptionGoogle:"P12",
						cloudOptionAWS: "",
            RMCValid: true,
            errorGeneral:"",
						serviceAccount:cloudResponseData.authCredential.serviceAccountId,
						uploadFileNameP12:cloudResponseData.authCredential.serviceAccountKeyPath.slice(33,cloudResponseData.authCredential.serviceAccountKeyPath.length),
          }, ()=>{
						console.log("cloudResponseData.authCredential.serviceAccountId", cloudResponseData.authCredential.serviceAccountId)
						this.checkValidationDisability()
					}
				)
        }
        console.log("cloudResponseData", cloudResponseData)
        this.setState({cloudData:cloudResponseData},function(){
					let cloud = cloudResponseData.authtype || ""
          this.setState({
            selectedCloudType:cloudResponseData.cloudtype,
            desc:cloudResponseData.description,
            cloudOptionAWS:cloud,
            accountDescription:cloudResponseData.description,
            accountName:cloudResponseData.name,
            accessKeyAWS:cloudResponseData.authCredential.accessKey,
            secretAccessKeyAWS:cloudResponseData.authCredential.secretAccessKey,
            ARNRole:cloudResponseData.authCredential.roleArn,
            ExternalID: cloudResponseData.authCredential.externalId,
            AppID:cloudResponseData.authCredential.applicationId,
            AppKey:cloudResponseData.authCredential.applicationKey,
            TenantID:cloudResponseData.authCredential.tenantId,
            SubscriptionID:cloudResponseData.authCredential.subscriptionId,
            Email:cloudResponseData.authCredential.username,
            Password:cloudResponseData.authCredential.password,
            // ServiceAccount:cloudResponseData.authCredential.serviceAccountId,
            // uploadFileNameJSON:cloudResponseData.authCredential.serviceAccountKeyPath.slice(33,cloudResponseData.authCredential.serviceAccountKeyPath.length),
            // uploadFileNameP12:cloudResponseData.authCredential.serviceAccountKeyPath.slice(33,cloudResponseData.authCredential.serviceAccountKeyPath.length),
            showCloud:true,
          }, ()=>{
            this.refs.toolname.hide();
            this.setState({showtooltipforname: 'false',
                          showtooltipforSubscriptionID: 'false',
                          showtooltipforApplicationID: 'false',
                          showtooltipforApplicationKey: 'false'})

            this.checkValidationDisability()
						this.checkTotalValidation()
            this.APICallformonitorAcount(this.state.accountName)
          })
        })
      })
      .catch((cloudResponseError)=>console.log("cloudResponseError "+cloudResponseError))
    } else {
      this.setState({showCloud:true})
      this.checkValidationDisability();
    }
		console.log("this.state.cloudOptionAWS", this.state.cloudOptionAWS)
		this.validateInstanceCredentials(true);
  },

  APICallformonitorAcount(accountNameMonitor){
    getMonitorAccountDetails(this.state.idofCloud,this.state.accountName,this.state.selectedCloudType)
    .then((response) => {
      if(response.bucketName != ''||response.bucketName!= undefined ){
        this.getRegionsAPIFunction()
        this.setState({
          enableMonitor:true,
          bucketId:response.id,
          S3Bucketname:response.bucketName,
          S3Prefix:response.collection.toString(),
          S3SelectedBucketname:response.bucketName,
          bordercolorForS3name:'thin solid #00C484',
          s3bucketNameValid:true,

          showtooltipfors3:false,
          regionUsingBucket:response.region
        },()=>{

            selectionfors3bucket.value=response.bucketName;
           // prefix.value=response.prefix
            this.refs.S3Bucketnametool.hide()
          this.handleRegionBucketName(this.state.S3SelectedBucketname)
        })

      }
      console.log('I am in sucess of getting the monitor account Detail'+ response)
    })
    .catch((error) => console.log("Error in getting the monitor accounts"))
  },

  // validateInstanceCredentials(){
  //   getIAMRoleStatus()
  //   .then((response)=>{
  //     if (response.iamrole !== "true"){
  //       this.setState({
  //         instanceDisable: true,
  //       }, ()=>{console.log("this.state.instanceDisablethis.state.instanceDisable", this.state.instanceDisable)})
  //     }
  //     else{
  //        this.setState({IAMRoleName:response.rolename}, function(){
  //         console.log(this.state.IAMRoleName)
  //         if(this.state.cloudOptionAWS === 'awsAssumeInstanceCred'){
  //
  //       }
  //       });
  //     }
  //     console.log("this is the response from the IAM role status API", response)
  //   })
  // },
  validateInstanceCredentials(pageLoad){
  getIAMRoleStatus()
  .then((response)=>{
		if(pageLoad){
			if (response.rolename){
				this.setState({IAMRoleName:response.rolename})
			}
		} else {
			if (response.iamrole !== "true"){
				this.setState({
					validated: false,
					errorGeneral: "IAM Role Unavailable. Please follow the instructions above and then click 'Validate'."
				}, ()=>{console.log("this.state.validatedthis.state.validated", this.state.validated)})
			} else if (response.iamrole == "true"){
				 this.setState({IAMRoleName:response.rolename});
				if (response.permissions !== "false"){
					this.setState({
						validated: true,
						errorGeneral:""
					})
				} else {
					this.setState({
						errorGeneral: "The policy does not have sufficient permissions. Please follow the instructions above and then click 'Validate'."
					})
				}
			}
		}
    console.log("this is the response from the IAM role status API", response)
  })
},

  toggleValidate(bool){
    this.setState({
      validated: bool
    })
  },

  closeCloud() {
    this.setState({
      IAMRoleName:'',
      validated:false,
      errorGeneral:"",
      showCloud: false,
      selectedCloudType: "AWS",
      cloudOptionAWS: "awsAssumeInstanceCred",
      accesskeyvalid:false,
      secretkeyvalid:false,
      ARNRole:"",
      ExternalID:null,
      accountName:'',
      validateButtonDisability:true,
      bordercolg:'thin solid #4C58A4',
			bordercolPrefix:'thin solid #4C58A4',
      bordercolc:'thin solid #4C58A4',
      bordercols:'thin solid #4C58A4',
      bordercola:'thin solid #4C58A4',
      bordercolarn:'thin solid #4C58A4',
      bordercoleid:'thin solid #4C58A4',
      ARNRole_validation: '',
      ExternalID_validation: '',
      AccessKey_validation: '',
      SecretKey_validation: '',
      AccountName_validation: '',
      AccessKey_error: ' Provide valid Access Key ID associated with this AWS account.',
      SecretKey_error: 'Provide valid Secret Access Key associated with this AWS account.',
      ARNRole_error: ' Provide valid ARN Role associated with this AWS account.',
      ExternalID_error: ' Provide External ID associated with this AWS account.',
      AccountName_error: ' Provide a unique name for this account.',
      S3BucketName_error:'Provide S3 Bucket name',
      S3BucketRegion_error:'Provide credentials and click "Validate" to get the Bucket names',
      Prefix_error:'Provide a Prefix (optional)',

      ASKValid: false,
      ARNValid: false,
      RMCValid: false,
      RMValid: false,
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///AZURE CREDENTIAL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      cloudOptionAzure:"RM",
      subscriptionID_Validation: "",
      applicationID_Validation: "",
      applicationKey_Validation: "",
      tenantID_Validation: "",
      email_Validation: "",
      password_Validation: "",
      subscriptionID_Error: "Please enter a Subscription ID",
      applicationID_Error: "Please enter an Application ID",
      applicationKey_Error: "Please enter an Application Key",
      tenantID_Error: "Please enter a Tenant ID",
      email_Error: "Please enter an E-mail",
      password_Error: "Please enter a Password",
      showtooltipforSubscriptionID:"hover",
      showtooltipforAppID:"hover",
      showtooltipforAppKey:"hover",
      showtooltipforTenantID:"hover",
      showtooltipforEmail:"hover",
      showtooltipforPassword:"hover",
      passSubscriptionID:"password",
      passAppID:"password",
      passAppKey:"password",
      passTenantID:"password",
      passPassword:"password",
      bordercolSubID:'thin solid #4C58A4',
      bordercolAppID:'thin solid #4C58A4',
      bordercolAppKey:'thin solid #4C58A4',
      bordercolTenID:'thin solid #4C58A4',
      bordercolEmail:'thin solid #4C58A4',
      bordercolPassword:'thin solid #4C58A4',
      showhideforSubID:"Show characters",
      showhideforAppID:"Show characters",
      showhideforAppKey:"Show characters",
      showhideforTenID:"Show characters",
      showhideforPassword:"Show characters",
      SubscriptionID:"",
      AppID:"",
      AppKey:"",
      TenantID:"",
      Email:"",
      Password:"",
      accessKeyAWS:"",
      secretAccessKeyAWS:"",
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///GOOGLE CLOUD CREDENTIAL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      cloudOptionGoogle:"P12",

      serviceAccount:"",
      uploadFileNameJSON:"",
      uploadFileNameP12:"",

      p12_Error:"Please select a P12 file",
      serviceaccount_Error:"Please enter Service Account",
      json_Error:"Please select a JSON file",

      P12_validation:"",
      ServiceAccount_validation:"",
      JSON_validation:"",

      bordercolP12:'thin solid #4C58A4',
      bordercolServiceAccount:'thin solid #4C58A4',
      bordercolJSON:'thin solid #4C58A4',

      showtooltipforP12:"hover",
      showtooltipforSubscriptionID:"hover",
      showtooltipforJSON:"hover",
      p12FileExists: false,
      jsonFileExists: false,
      passserviceaccount:"password",
      showhideforserviceaccount:"Show characters",
      ///// Monitoring//////
      enableMonitor:false,
      // S3Bucketname:'',
      S3Prefix:'2',
      s3Regions:[],
      S3BucketName:[],
      responceRegions:[],
      S3SelectedBucketname:'',
      s3bucketNameValid:false,
      bordercolorForS3name:'thin solid #4C58A4',
      accessKeyAWS:"",
      secretAccessKeyAWS:"",
    });
  },

  validateAPIKey(apiKey){
    console.log("validateAPIKey called "+apiKey.target.value)
  },

  selectCloudTypeChange(cloudType){
    console.log("slected type is "+cloudType)
    this.setState({
      selectedCloudType:cloudType,
      validated:false,
      errorGeneral:""
    }, ()=>{this.checkValidationDisability()})
    // if(cloudType === "Azure" || cloudType === "Google"){
    //   this.setState({
    //     validateButtonDisability:false
    //   })
    // }
  },
  handlePrefix(e){
     this.setState({S3Prefix:e})
   /* this.setState({newS3Prefix:e})

   // this.setState({S3Prefix:e.target.value})
   if(this.state.S3Prefix==="30"){

      if(e=="7"||e == "2"){

        this.setState({showCollectionWindowModal:true})
       // document.body.style.backgroundColor = "red";
      }
      else{
        this.setState({S3Prefix:e})
        this.setState({showCollectionWindowModal:false})
      }

   }else if(this.state.S3Prefix==="7"){

     if(e == "2"){

        this.setState({showCollectionWindowModal:true})
        //document.body.style.backgroundColor = "red";
      }
      else{
        this.setState({S3Prefix:e})
        this.setState({showCollectionWindowModal:false})
      }


   }else{
      this.setState({S3Prefix:e})
    }*/

  },

 /* close(){
    let oldVal=this.state.S3Prefix
    this.setState({showCollectionWindowModal:false})
    this.setState({S3Prefix:oldVal})
  },
  handleYes(){
    let val=this.state.newS3Prefix
    this.setState({S3Prefix:val})
     this.setState({showCollectionWindowModal:false})
  },
*/
  handleS3BucketName(event){
      // this.handleRegionBucketName(event.target.value)
    // alert(event.target.value)
    if(event.target.value!=null && event.target.value!=''){
      this.setState({showtooltipfors3:false,s3bucketNameValid:true,bordercolorForS3name:'thin solid #00C484'},()=>this.checkValidationDisability())
      this.refs.S3bucketnametool.hide();
    }else
    {
     this.setState({showtooltipfors3:"hover",s3bucketNameValid:false,bordercolorForS3name:'thin solid #FF444D'},()=>this.checkValidationDisability())
      this.refs.S3bucketnametool.show();
    }
    this.setState({
      S3Bucketname:event.target.value
    }, ()=>{
      this.checkValidationDisability()
      this.handleRegionBucketName(this.state.S3Bucketname, 'onchange')
    })
  },

  handleRegionBucketName(event){
    /*Based on bucketName display region*/
    for(var i=0; i< this.state.S3BucketNameResponce.length; i++){
      let currentString = this.state.S3BucketNameResponce[i]
      let n = currentString.indexOf(event+':')
      if(n === 0){
        let actualRegion = this.state.S3BucketNameResponce[i].slice(event.length+1)
        this.setState({regionUsingBucket:actualRegion})
      }
    }
  },
  handleAPIKeyChange(apiKey){
    console.log("handleAPIKeyChange")
    this.setState({apiKey:apiKey.target.value})
  },

  buildPayload(){
    var payload = {};
    var authCredentials = {};
    if (this.state.selectedCloudType === "AWS"){
      if(this.state.cloudOptionAWS === "awsSk"){
        authCredentials.authType = this.state.cloudOptionAWS;
        authCredentials.accessKey = this.state.accessKeyAWS;
        authCredentials.secretAccessKey = this.state.secretAccessKeyAWS;
        payload.name = this.state.accountName;
        payload.description = this.state.accountDescription;
        payload.authCredential = authCredentials
      }
      else if (this.state.cloudOptionAWS === "awsArn") {
        authCredentials.authType = this.state.cloudOptionAWS;
        authCredentials.roleArn = this.state.ARNRole;
        authCredentials.externalId = this.state.ExternalID;
        payload.authCredential = authCredentials;
        payload.name = this.state.accountName;
        payload.description = this.state.accountDescription;

      } else if (this.state.cloudOptionAWS === "awsAssumeInstanceCred"){
        authCredentials.authType = "awsAssumeInstanceCred";
        payload.authCredential = authCredentials;
        payload.name = this.state.accountName;
        payload.description = this.state.accountDescription;
      }
    } else if (this.state.selectedCloudType === "Azure"){
      // authCredentials.authType = this.state.asdfasdfsad
      // "name": "AzureAccount1",
      // "description": "Azure account",
      // "cloudtype": "Azure",
      // "authCredential": {
      // "applicationId": "99837300-0ece-4a57-80c5-86cabd7b9f3d",
      // "applicationKey": "sdPve+05BmNSNskhkqrA+vSnVJByLJyCiUNM5Z/beRQ=",
      // "tenantId": "063b3e19-1703-4b30-8bd5-61238a5da9a9",
      // "subscriptionId": "32b1e302-d51c-44ab-8047-2af3c25e78f5",
      // "username": "sivakumars@cavirin.com",
      // "password": "password"
      if (this.state.cloudOptionAzure==="RM"){
        authCredentials.authType = "AzureServicePrincipal";
        authCredentials.applicationId = this.state.AppID;
        authCredentials.applicationKey = this.state.AppKey;
        authCredentials.tenantId = this.state.TenantID;
        authCredentials.subscriptionId = this.state.SubscriptionID;
        console.log("adfasdfdfasfdasdf", this.state.selectedCloudType, authCredentials)


      } else if (this.state.cloudOptionAzure==="RMC"){
        authCredentials.authType = "AzureOAuth2";
        authCredentials.applicationId = this.state.AppID;
        authCredentials.applicationKey = this.state.AppKey;
        authCredentials.tenantId = this.state.TenantID;
        authCredentials.subscriptionId = this.state.SubscriptionID;
        authCredentials.username = this.state.Email;
        authCredentials.password = this.state.Password;
        console.log("adfasdfdfasfdasdfRMC", this.state.selectedCloudType, authCredentials)

      }
      payload.cloudtype = "Azure";
      payload.authCredential = authCredentials;
      payload.name = this.state.accountName;
      payload.description = this.state.accountDescription;
    } else if (this.state.selectedCloudType === "Google"){
      console.log("JSONJSONSJONS", this.state.cloudOptionGoogle)
      if (this.state.cloudOptionGoogle === "JSON"){
        console.log("JSONJSONSJONS")
        authCredentials.authType = "gcpJson";
        // authCredentials.serviceAccountKeyPath = "Cavirin-e61bfa4d8f60.json";
        authCredentials.serviceAccountId = "";
        authCredentials.serviceAccountKeyPath = this.state.uploadFileNameJSON;
      } else if (this.state.cloudOptionGoogle === "P12"){
        authCredentials.authType = "gcpP12";
        // authCredentials.serviceAccountId = "sivaowner@cavirin-161511.iam.gserviceaccount.com";
        // authCredentials.serviceAccountKeyPath = "Cavirin-e61bfa4d8f60.p12";
        authCredentials.serviceAccountKeyPath = this.state.uploadFileNameP12;
        authCredentials.serviceAccountId = this.state.serviceAccount;

      }
      payload.cloudtype = "Google";
      payload.authCredential = authCredentials;
      payload.name = this.state.accountName;
      payload.description = this.state.accountDescription;
    }
      return payload;
  },
  addNewCloud(event){
    let collectionWindow=parseInt(this.state.S3Prefix)

    let payload = this.buildPayload();
    this.props.addNewCloud(this.state.selectedCloudType, payload)
      .then((response)=>{
        this.setState({cloudAdded:true},function(){
          {this.state.enableMonitor ?
            monitorAcountDetails(response.id,this.state.accountName,this.state.selectedCloudType,this.state.S3Bucketname, collectionWindow)
            .then((response) => {
              // this.setState({S3SelectedBucketname:S3Bucketname.value})
              console.log('I am in sucess'+ response)
              this.closeCloud()
            })
            .catch((error) => console.log("Error in getting the getPolicyPackRules"))
          : <noscript/>
          }
        })
        this.props.refreshCloudsList();
        this.closeCloud();
      })
      .catch((error)=>{
        this.refs.toolname.show();
        this.setState({AccountName_error : error.data.message, AccountName_validation: 'error'}, ()=>{this.checkValidationDisability()})
       //  this.state.cloudgoupnamevalid=false;
        this.state.bordercolg='thin solid #FF444D';
        this.state.labeltoolheight=55;
        this.setState({showtooltipforname:"hover"});
      })


  },

  updateCloud(event){

      console.log("this is the event, what does it have?", event, this.state.selectedCloudType)
    // //logic to build payload
    // var payload = {};
    // var authCredentials = {};
    //
    // // cloudOptionAWS: "awsAssumeInstanceCred",
    //
    // if(this.state.cloudOptionAWS === "awsSk"){
    //   this.setState({
    //     ASKValid: true
    //   })
    // } else if (this.state.cloudOptionAWS === "awsArn") {
    //   this.setState({
    //     ARNValid: true
    //   })
    // }

    let collectionWindow=parseInt(this.state.S3Prefix)
    let payload = this.buildPayload();
    this.props.updateCloud(this.props.selectedIntegrationIds[0].id, this.state.selectedCloudType, payload)
    .then((res)=>{
      this.props.refreshCloudsList();
    })

    if(this.state.enableMonitor){
			console.log("please update monitoring ", this.state.enableMonitor)
      let _this=this.state;
      updateMonitorAcount(this.state.idofCloud,this.state.bucketId, this.state.accountName,this.state.selectedCloudType,this.state.S3Bucketname, collectionWindow)
      .then((response) => {

        console.log('I am in sucessvvvv')
           enablemonitorForAccounts(_this.idofCloud,_this.accountName,_this.selectedCloudType,false)
           .then((response1) => {

            console.log('I am in sucess response1'+ response)
           })
          .catch((error1) => console.log("Error in getting the enablemonitorForAccounts"))
      })
      .catch((error) => console.log("Error in getting the getPolicyPackRules"))



      }
      else{
      enablemonitorForAccounts(this.state.idofCloud,this.state.accountName,this.state.selectedCloudType,true)
       .then((response12) => {

        console.log('I am in sucess response12'+ response)
       })
      .catch((error12) => console.log("Error in getting the enablemonitorForAccounts"))
    }


    this.closeCloud();
  },

  handleAccountDescription(event){
    this.setState({
      accountDescription: event,
      validated:false
    });
  },

  handleAccountName(event){
    if(event.target.value === ''){
      this.refs.toolname.show();
    }
    else {
      this.refs.toolname.hide();
      this.setState({showtooltipforname: false})
    }

    let AccountName_schema = {
      accountName: Joi.string().max(32).required(),
    }

    let result = Joi.validate({accountName: event.target.value}, AccountName_schema)
    if(result.error)
    {
      let errorMessage = result.error.details[0].message
        if(errorMessage.indexOf('empty') != -1){
          this.setState({AccountName_error : 'Account name must not be empty.', AccountName_validation: 'error'}, ()=>{this.checkValidationDisability()})
        }
        else {
          this.setState({AccountName_error : 'Account name must not exceed 32 characters.', AccountName_validation: 'error'}, ()=>{this.checkValidationDisability()})
        }
      this.state.bordercolg='thin solid #FF444D';
      this.state.labeltoolheight=55;
      this.setState({showtooltipforname:"hover"});
      this.refs.toolname.show();
    }else
    {
      this.setState({AccountName_validation: 'success'})
      this.state.bordercolg='thin solid #00C484';
      this.setState({showtooltipforname: false})
      this.refs.toolname.hide();
    }
    // if (this.selectedCloudType === "Azure"){
    //   this.setState({
    //     accountName: event.target.value,,
    validated:false
    //     validateButtonDisability:false
    //   })
    // } else {
      this.setState({
        accountName: event.target.value,
        validated:false
      }, ()=>{this.checkValidationDisability()})
    // }
  },

  handleAccessKeyAWS(event){
    console.log("handleAccessKeyAWS", event.target.value)
    this.setState({
      accessKeyAWS: event.target.value,
      validated:false
    }, ()=>{this.checkValidationDisability()
      if(this.state.secretAccessKeyAWS!= '' && this.state.accessKeyAWS!='' && this.state.enableMonitor){
        this.getRegionsAPIFunction()
      }else{
        this.setState({regionUsingBucket:'', S3BucketName:[]})
      }
    })


  },

  handleSecretAccessKeyAWS(event){
    console.log("handleSecretAccessKeyAWS", event.target.value)
    this.setState({
      secretAccessKeyAWS: event.target.value,
      validated:false
    }, ()=>{
      this.checkValidationDisability()
      if(this.state.secretAccessKeyAWS!= '' && this.state.accessKeyAWS!=''&&this.state.enableMonitor){
        this.getRegionsAPIFunction()
      }else{
        this.setState({regionUsingBucket:'', S3BucketName:[]})
      }
    })



  },

  handleARNRole(event){
    console.log("I am changing ARN ROLE RIGHT?", event.target.value)
    this.setState({
      ARNRole: event.target.value,
      validated:false
    }, ()=>{this.checkValidationDisability()
            if(!this.state.ARNRole && !this.state.ExternalID){
              this.getRegionsAPIFunction()
            }else{
              this.setState({regionUsingBucket:'', S3Bucketname:[]})
            }
    })


  },

  handleExternalID(event){
    console.log("I am changing ExternalID RIGHT?", event.target.value)
    this.setState({
      ExternalID: event.target.value,
      validated:false
    }, ()=>{this.checkValidationDisability()
      if(!this.state.ARNRole && !this.state.ExternalID){
        this.getRegionsAPIFunction()
      }else{
        this.setState({regionUsingBucket:'', S3BucketName:[]})
      }
    })
  },

  handleOptionChangeAWS:function (changeEvent) {

    console.log("changeEvent.target.value", changeEvent.target.value)
      this.setState({regionUsingBucket:'', S3BucketName:[]}, function(){
        this.getRegionsAPIFunction()
      })

    this.setState({
      validated:false,
      errorGeneral:"",
      cloudOptionAWS: changeEvent.target.value,
      currentOption: changeEvent.target.value,
      bordercolc:'thin solid #4C58A4',
      bordercols:'thin solid #4C58A4',
      bordercola:'thin solid #4C58A4',
      bordercolarn:'thin solid #4C58A4',
      bordercoleid:'thin solid #4C58A4',
      // ARNRole:"",
      // ExternalID:null,
      // accessKeyAWS:"",
      // secretAccessKeyAWS:"",
      ARNRole_validation: '',
      ExternalID_validation: '',
      AccessKey_validation: '',
      SecretKey_validation: '',

      AccessKey_error: ' Provide valid Access Key ID associated with this AWS account.',
      SecretKey_error: 'Provide valid Secret Access Key associated with this AWS account.',
      ARNRole_error: ' Provide valid ARN Role associated with this AWS account.',
      ExternalID_error: ' Provide External ID associated with this AWS account.',
      AccountName_error: ' Provide a unique name for this account.',
      S3BucketName_error:'Provide S3 Bucket name',
      S3BucketRegion_error:'Provide credentials and click "Validate" to get the Bucket names',
      Prefix_error:'Provide a Prefix (optional)'
    }, ()=>{this.checkValidationDisability()
      this.refs.eid.hide();
      this.refs.arn.hide();
      this.refs.secretinfo.hide();
      this.refs.toolaccess.hide();
    });
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

 handleTemplateDescChange(e){
   this.setState({
     desc: e.target.value
   })
 },

 /*validateAccountName: function(AccountName) {
   let AccountName_schema = {
       AccountName: Joi.string().max(32).required(),
   };
   let result = Joi.validate({AccountName: cloudLabel.value}, AccountName_schema)
   if (result.error) {
       this.refs.toolname.show();
       this.setState({AccountName_error : result.error.details[0].message, AccountName_validation: 'error'})
      //  this.state.cloudgoupnamevalid=false;
       this.state.bordercolg='thin solid #FF444D';
       this.state.labeltoolheight=55;
       this.setState({showtooltipforname:"hover"});
   } else {
       this.refs.toolname.hide();
       this.setState({showtooltipforname:false});
       this.setState({AccountName_error: '', AccountName_validation : 'success'}, ()=>{this.checkValidationDisability()})
      //  this.state.cloudgoupnamevalid=true;
       this.state.bordercolg='thin solid #00C484';

      // if(this.state.cloudOptionAWS === "awsSk" && this.state.accessKeyAWS && this.state.secretAccessKeyAWS){
      //   //  this.validateASK();
      //  } else if (this.state.cloudOptionAWS === "awsArn" && this.state.ARNRole){
      // //  } else if (this.state.cloudOptionAWS === "awsArn" && this.state.ARNRole && this.state.ExternalID){
      //   //  this.validateARN();
      //  }
   }
   if( this.state.cloudgoupnamevalid)
       return true
   },
*/
 validateARNRole: function(ARNRole) {
   let ARNRole_schema = {
       ARNRole: Joi.string().max(60).required(),
   };
   let result = Joi.validate({ARNRole: this.state.ARNRole}, ARNRole_schema)
   if (result.error) {
       this.refs.arn.show();
       this.setState({ARNRole_error : result.error.details[0].message, ARNRole_validation: 'error'})
       this.state.bordercolarn='thin solid #FF444D';
       this.state.labeltoolheight=55;
       this.setState({showtooltipforARN:"hover"});
   } else {
    //  if (this.state.ARNRole && this.state.ExternalID){
    if (this.state.ARNRole){
      //  this.validateARN();
     }
   }
   if( this.state.cloudgoupnamevalid)
       return true
   },

   validateExternalID: function(ExternalID) {
    //  let ExternalID_schema = {
    //     //  ExternalID: Joi.string().max(32).required(),
    //     ExternalID: Joi.string(),
    //  };
    //  let result = Joi.validate({ExternalID: this.state.ExternalID}, ExternalID_schema)
    //  if (result.error) {
    //      this.refs.eid.show();
    //      this.setState({ExternalID_error : result.error.details[0].message, ExternalID_validation: 'error'})
    //      this.state.bordercoleid='thin solid #FF444D';
    //      this.state.labeltoolheight=55;
    //      this.setState({showtooltipforExternalID:"hover"});
    //  } else {
      //  if (this.state.ARNRole && this.state.ExternalID){
      if (this.state.ARNRole){
        //  this.validateARN();
       }
    //  }
     if( this.state.cloudgoupnamevalid)
         return true
     },

 ValidateAccesskey : function() {
   if(this.state.passType=="password"){
     this.setState({fontfamilyforaccess:"Source Sans Pro"})
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
     this.setState({AccessKey_error : result.error.details[0].message, AccessKey_validation: 'error'}, ()=>{this.checkValidationDisability()})
     this.state.bordercola='thin solid #FF444D';
     this.state.accesskeyvalid=false;
     this.state.showtooltipforaccess="hover";
   } else {
     if (this.state.secretAccessKeyAWS && this.state.accessKeyAWS){
      //  this.validateASK();
     }
   }
   if( this.state.accesskeyvalid)
   return true
    // this.checkValidationDisability();
   },
  ValidateSecretKey : function() {
   if(this.state.passSecret==="password"){
       this.setState({fontfamilyforsecret:"Source Sans Pro"})
   }
   else{
       this.setState({fontfamilyforsecret:"Source Sans Pro "})
    }
   console.log("secretaccesskey.value", secretaccesskey.value);

   let SecretKey_schema = {
       SecretKey: Joi.string().required(),
   };
   let result = Joi.validate({SecretKey: secretaccesskey.value}, SecretKey_schema)
   console.log("result of the secretaccesskey", result)
     if (result.error) {
         this.setState({SecretKey_error : result.error.details[0].message, SecretKey_validation: 'error'}, ()=>{this.checkValidationDisability()})
         this.state.bordercols='thin solid #FF444D';
         this.state.secretkeyvalid=false;
         this.refs.secretinfo.show();
         this.state.showtooltipforsecret="hover";
     } else {
       if (this.state.secretAccessKeyAWS && this.state.accessKeyAWS){
        //  this.validateASK();
       }
      }
     if( this.state.secretkeyvalid)
       return true
  },

  validateARN(){
    let payload = this.buildPayload();
    validateCloud(payload)
    .then((res)=>{
      this.toggleValidate(true)

       this.refs.eid.hide();
       this.setState({showtooltipforExternalID:false, ARNValid: true});
       this.setState({ExternalID_error: '', ExternalID_validation : 'success'}, ()=>{this.checkValidationDisability()})
       this.state.bordercoleid='thin solid #00C484';
       this.refs.arn.hide();
       this.setState({showtooltipforARN:false});
       this.setState({ARNRole_error: '', ARNRole_validation : 'success'}, ()=>{this.checkValidationDisability()})
       this.state.bordercolarn='thin solid #00C484';
      this.checkValidationDisability();

    })
    .catch((error)=>{
      this.toggleValidate(false)

      if (error && error.data) {
        // Name Should not be null or empty
        console.log("errordkfkalksdfjlksadf", error.data.message, error)
        // if(error.data.message === "Name Should not be null or empty" || error.data.message === "Cloud Account already exists with Name"){
        if(error.data.message){
          console.log("errordkfkalksdfjlksadf", error.data.message, error)
          // this.setState({
            // AccountName_error: error.data.message,
            // AccountName_validation: 'error',
            // bordercolg:'thin solid #FF444D',
            // showtooltipforname:"hover"
          // })

           this.refs.eid.show();
          //  this.setState({ExternalID_error : error.data.message, ExternalID_validation: 'error', ARNValid: false}, ()=>{this.checkValidationDisability()})
          //  this.state.bordercoleid='thin solid #FF444D';
          //  this.state.labeltoolheight=55;
          //  this.setState({showtooltipforExternalID:"hover"});
           this.refs.arn.show();
           this.setState({ARNRole_error : error.data.message, ARNRole_validation: 'error'}, ()=>{this.checkValidationDisability()})
           this.state.bordercolarn='thin solid #FF444D';
           this.state.labeltoolheight=55;
           this.setState({showtooltipforARN:"hover"});

        } else {
           this.refs.eid.show();
          //  this.setState({ExternalID_error : "Invalid Credentials. Please enter valid External ID.", ExternalID_validation: 'error', ARNValid: false}, ()=>{this.checkValidationDisability()})
          //  this.state.bordercoleid='thin solid #FF444D';
          //  this.state.labeltoolheight=55;
          //  this.setState({showtooltipforExternalID:"hover"});
           this.refs.arn.show();
           this.setState({ARNRole_error : "Invalid Credentials. Please enter valid ARN Role.", ARNRole_validation: 'error'}, ()=>{this.checkValidationDisability()})
           this.state.bordercolarn='thin solid #FF444D';
           this.state.labeltoolheight=55;
           this.setState({showtooltipforARN:"hover"});
        }
      }
    })
  },

  validateASK(){
    let payload = this.buildPayload();
    validateCloud(payload)
    .then((res)=>{
      this.toggleValidate(true)
      this.refs.secretinfo.hide();
      this.setState({SecretKey_error: '', SecretKey_validation : 'success', ASKValid: true}, ()=>{this.checkValidationDisability()})
      this.state.bordercols='thin solid #00C484';
      this.state.secretkeyvalid=true;
      this.state.showtooltipforsecret="false";
      this.refs.toolaccess.hide();
      this.setState({AccessKey_error: '', AccessKey_validation : 'success'}, ()=>{this.checkValidationDisability()})
      this.state.bordercola='thin solid #00C484'
      this.state.accesskeyvalid=true;
      this.state.showtooltipforaccess="false";
      this.checkValidationDisability();
    })
    .catch((error)=>{
      if (error) {
        this.toggleValidate(false)

        // Name Should not be null or empty
        this.refs.secretinfo.show();
        this.refs.toolaccess.show();
        console.log("errordkfkalksdfjlksadf", error.data.message, error)
        if(error.data.message === "Name Should not be null or empty" || error.data.message === "Cloud Account already exists with Name"){
          console.log("errordkfkalksdfjlksadf", error.data.message, error)
          this.setState({
            AccountName_error: error.data.message,
            AccountName_validation: 'error',
            bordercolg:'thin solid #FF444D',
            showtooltipforname:"hover"
          })
      } else {
        // this.setState({SecretKey_error : "Invalid Credentials. Please enter valid Secret Key.", SecretKey_validation: 'error', ASKValid: false}, ()=>{this.checkValidationDisability()})
        this.setState({SecretKey_error : error.data.message, SecretKey_validation: 'error', ASKValid: false}, ()=>{this.checkValidationDisability()})
        this.state.bordercols='thin solid #FF444D';
        this.state.bordercola='thin solid #FF444D';

        this.state.secretkeyvalid=false;
        // this.refs.secretinfo.show();
        this.state.showtooltipforsecret="hover";
        //  this.refs.toolaccess.show();
        //  this.setState({AccessKey_error : "Invalid Credentials. Please enter valid Access Key.", AccessKey_validation: 'error'}, ()=>{this.checkValidationDisability()})
        this.setState({AccessKey_error : error.data.message, AccessKey_validation: 'error'}, ()=>{this.checkValidationDisability()})

        //  this.state.bordercola='thin solid #FF444D';
         this.state.accesskeyvalid=false;
         this.state.showtooltipforaccess="hover";
      }

      }
    })
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
    }

 },

 checkAccountName(){
   console.log("Super focused!!!")
   if(!this.state.accountName){
     this.setState({
       AccountName_error: 'Account Name is not allowed to be empty',
       AccountName_validation: 'error',
       bordercolg:'thin solid #FF444D',
       showtooltipforname:"hover"
     })
   }
 },

 checkTotalValidation(){
   if(this.state.selectedCloudType === "AWS"){
     this.setState({
       currentOption:this.state.cloudOptionAWS
     })
     if(this.state.cloudOptionAWS === "awsSk"){
      this.validateASK();
     } else if (this.state.cloudOptionAWS === "awsAssumeInstanceCred"){
       this.validateInstanceCredentials();
     } else if (this.state.cloudOptionAWS === "awsArn"){
       console.log("this.state.accountName && this.state.ARNRole && this.state.ExternalID", this.state.accountName, this.state.ARNRole, this.state.ExternalID, this.state.ARNValid)
       this.validateARN();
     }
   } else if(this.state.selectedCloudType === "Azure"){
      this.validateRMRMC();
   } else if(this.state.selectedCloudType === "Google"){
      this.validateGoogle();
   }
 },

  checkValidationDisability(){
    // this.setState({
    //   validated:false
    // })
    let validateButtonDisability
    if(this.state.selectedCloudType === "AWS"){
      this.setState({
        currentOption:this.state.cloudOptionAWS
      })
      if(this.state.cloudOptionAWS === "awsSk"){
        console.log("this.state.accountName && this.state.accesskeyvalid && this.state.secretkeyvalid", this.state.accountName, this.state.accesskeyvalid, this.state.secretkeyvalid)
        // if(this.state.accountName && this.state.accesskeyvalid && this.state.secretkeyvalid && this.state.ASKValid){
        // if(this.state.enableMonitor){
        //   if(this.state.accountName && this.state.accessKeyAWS && this.state.secretAccessKeyAWS&&this.state.s3bucketNameValid){
        //   this.setState({
        //     validateButtonDisability:false
        //   })
        //   } else {
        //     this.setState({
        //         validateButtonDisability:true
        //     })
        //   }
        // }
        // else{
          if(this.state.accountName && this.state.accessKeyAWS && this.state.secretAccessKeyAWS){
            this.setState({
              validateButtonDisability:false
            })
          } else {
            this.setState({
              validateButtonDisability:true
            })
          }
        // }
      } else if (this.state.cloudOptionAWS === "awsAssumeInstanceCred"){
        //  if(this.state.enableMonitor){
        //     if(this.state.accountName&&this.state.s3bucketNameValid){
        //       this.setState({
        //         validateButtonDisability:false
        //       })
        //     } else {
        //        this.setState({
        //          validateButtonDisability:true
        //        })
        //      }
        //  }
        //  else{
            if(this.state.accountName){
              this.setState({
                validateButtonDisability:false
              })
            } else {
               this.setState({
                 validateButtonDisability:true
               })
             }
        //  }
      } else if (this.state.cloudOptionAWS === "awsArn"){
        console.log("this.state.accountName && this.state.ARNRole && this.state.ExternalID", this.state.accountName, this.state.ARNRole, this.state.ExternalID, this.state.ARNValid)
        // if(this.state.accountName && this.state.ARNRole && this.state.ExternalID && this.state.ARNValid){
          // if(this.state.enableMonitor){
          //   if(this.state.accountName && this.state.ARNRole &&this.state.s3bucketNameValid){
          //   this.setState({
          //     validateButtonDisability:false
          //   })
          //   } else {
          //    this.setState({
          //      validateButtonDisability:true
          //    })
          //  }
					//
          // }else{

            if(this.state.accountName && this.state.ARNRole ){
            this.setState({
              validateButtonDisability:false
            })
            } else {
             this.setState({
               validateButtonDisability:true
             })
           }
         }
      // }
    } else if(this.state.selectedCloudType === "Azure"){
      console.log("azureafasflkajfklasjfl")
      this.setState({
        currentOption:this.state.cloudOptionAzure,
        // validateButtonDisability:false
      })
      // SubscriptionID:"",
      // AppID:"",
      // AppKey:"",
      // TenantID:"",
      // Email:"",
      // Password:"",
      if(this.state.cloudOptionAzure === "RMC"){
        if(this.state.accountName && this.state.SubscriptionID && this.state.AppID && this.state.AppKey && this.state.TenantID && this.state.Email && this.state.Password){
          this.setState({
            validateButtonDisability:false
          })
        }
        else {
           this.setState({
             validateButtonDisability:true
           })
         }
      } else if(this.state.cloudOptionAzure === "RM"){
        console.log("is this true???1")
        if(this.state.accountName && this.state.SubscriptionID && this.state.AppID && this.state.AppKey && this.state.TenantID){
          console.log("is this true???")

          this.setState({
            validateButtonDisability:false
          })
        }
        else {
          console.log("is this true??? nooo")

           this.setState({
             validateButtonDisability:true
           })
         }
      }
    } else if(this.state.selectedCloudType === "Google"){
      this.setState({
        currentOption:this.state.cloudOptionGoogle,
      })

      if(this.state.cloudOptionGoogle === "P12"){
        console.log("this.state.serviceAccount && this.state.uploadFileNameP12", this.state.serviceAccount, this.state.uploadFileNameP12)
        if(this.state.accountName && this.state.serviceAccount && this.state.uploadFileNameP12){
          this.setState({
            validateButtonDisability:false
          })
        }
        else {
           this.setState({
             validateButtonDisability:true
           })
         }
      } else if(this.state.cloudOptionGoogle === "JSON"){
        console.log("is this true???1")
        if(this.state.accountName && this.state.uploadFileNameJSON){
          console.log("is this true???")

          this.setState({
            validateButtonDisability:false
          })
        }
        else {
          console.log("is this true??? nooo")

           this.setState({
             validateButtonDisability:true
           })
         }
      }

    }
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///AZURE CREDENTIAL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleOptionChangeAzure:function (changeEvent) {
    console.log("changeEvent.target.value", changeEvent.target.value)
    this.setState({
      validated:false,
      errorGeneral:"",
      cloudOptionAzure: changeEvent.target.value,
      currentOption: changeEvent.target.value,
      subscriptionID_Error: "Please enter a Subscription ID",
      applicationID_Error: "Please enter an Application ID",
      applicationKey_Error: "Please enter an Application Key",
      tenantID_Error: "Please enter a Tenant ID",
      email_Error: "Please enter an E-mail",
      password_Error: "Please enter a Password",
      bordercolSubID:'thin solid #4C58A4',
      bordercolAppID:'thin solid #4C58A4',
      bordercolAppKey:'thin solid #4C58A4',
      bordercolTenID:'thin solid #4C58A4',
      bordercolEmail:'thin solid #4C58A4',
      bordercolPassword:'thin solid #4C58A4',
      // SubscriptionID:"",
      // AppID:"",
      // AppKey:"",
      // TenantID:"",
      // Email:"",
      // Password:"",
      subscriptionID_Validation: "",
      applicationID_Validation: "",
      applicationKey_Validation: "",
      tenantID_Validation: "",
      email_Validation: "",
      password_Validation: "",
    }
    , ()=>{this.checkValidationDisability()
      // this.refs.email.hide();
      // this.refs.password.hide();
      // this.refs.subscriptionID.hide();
      // this.refs.applicationID.hide();
      // this.refs.applicationKey.hide();
      // this.refs.tenantID.hide();
    }
  );
    this.refs.subscriptionID.hide();
    this.refs.applicationID.hide();
    this.refs.applicationKey.hide();
    this.refs.tenantID.hide();
    if(this.refs.email) {
      this.refs.email.hide();
      this.refs.password.hide();
    }
  },

  handleSubscriptionID(event){
    if(event.target.value == ''){
      this.refs.subscriptionID.show();
      this.setState({subscriptionID_Error: "Please enter a Subscription ID",
                    showtooltipforSubscriptionID: 'hover'})
    }
    else {
      this.refs.subscriptionID.hide();
      this.setState({showtooltipforSubscriptionID: false})
    }
    this.setState({
      SubscriptionID: event.target.value,
      validated:false
    }, ()=>{this.checkValidationDisability()})
  },
  handleApplicationID(event){
    if(event.target.value === '') {
      this.refs.applicationID.show()
      this.setState({ applicationID_Error: 'Please enter an Application ID',
                      showtooltipforApplicationID: 'hover'})
    }
    else{
      this.setState({showtooltipforApplicationID: 'false'})
      this.refs.applicationID.hide()
    }
    this.setState({
      AppID: event.target.value,
      validated:false
    }, ()=>{this.checkValidationDisability()})
  },
  handleApplicationKey(event){
    if(event.target.value === '') {
      this.setState({applicationKey_Error: "Please enter an Application Key",
                    showtooltipforApplicationKey: 'hover'})
      this.refs.applicationKey.show()
    }
    else {
      this.setState({showtooltipforApplicationKey: 'false'})
      this.refs.applicationKey.hide()
    }
    this.setState({
      AppKey: event.target.value,
      validated:false
    }, ()=>{this.checkValidationDisability()})
  },
  handleTenantID(event){
    if(event.target.value === ''){
      this.refs.tenantID.show()
      this.setState({tenantID_Error: "Please enter a Tenant ID",
                      showtooltipforTenantID: 'hover'})
    }
    else {
      this.refs.tenantID.hide()
      this.setState({showtooltipforTenantID: 'false'})
    }
    this.setState({
      TenantID: event.target.value,
      validated:false
    }, ()=>{this.checkValidationDisability()})
  },
  handleEmail(event){
    if(event.target.value === ''){
      this.setState({ email_Error: 'Please enter an E-mail',
                      showtooltipforEmail: 'hover'})
      this.refs.email.show()
    }
    else {
      this.setState({showtooltipforEmail: 'false'})
      this.refs.email.hide()
    }
    this.setState({
      Email: event.target.value,
      validated:false
    }, ()=>{this.checkValidationDisability()})
  },
  handlePassword(event){
    if(event.target.value === ''){
      this.setState({password_Error: "Please enter a Password",
                    showtooltipforPassword: 'hover'})
      this.refs.password.show()
    }
    else {
      this.setState({showtooltipforPassword: 'false'})
      this.refs.password.hide()
    }
    this.setState({
      Password: event.target.value,
      validated:false
    }, ()=>{this.checkValidationDisability()})
  },

 //  passSubscriptionID:"password",
 //  passAppID:"password",
 //  passAppKey:"password",
 //  passTenantID:"password",
 //  passPassword:"password",

 funpasssubscriptionID(){
     if(this.state.passSubscriptionID==="password")
     {
       this.setState({passSubscriptionID:"text"});
       this.setState({showhideforSubID:"Hide characters"});
        this.setState({fontfamilyforsecret:"Source Sans Pro"});
     }
     else{
       this.setState({passSubscriptionID:"password"});
       this.setState({showhideforSubID:"Show characters"});
    }
 },
 funpassapplicationID(){
     if(this.state.passAppID==="password")
     {
       this.setState({passAppID:"text"});
       this.setState({showhideforAppID:"Hide characters"});
        this.setState({fontfamilyforsecret:"Source Sans Pro"});
     }
     else{
       this.setState({passAppID:"password"});
       this.setState({showhideforAppID:"Show characters"});
    }
 },
 funpassapplicationKey(){
     if(this.state.passAppKey==="password")
     {
       this.setState({passAppKey:"text"});
       this.setState({showhideforAppKey:"Hide characters"});
        this.setState({fontfamilyforsecret:"Source Sans Pro"});
     }
     else{
       this.setState({passAppKey:"password"});
       this.setState({showhideforAppKey:"Show characters"});
    }
 },
 funpasstenantID(){
     if(this.state.passTenantID==="password")
     {
       this.setState({passTenantID:"text"});
       this.setState({showhideforTenID:"Hide characters"});
        this.setState({fontfamilyforsecret:"Source Sans Pro"});
     }
     else{
       this.setState({passTenantID:"password"});
       this.setState({showhideforTenID:"Show characters"});
    }
 },
 funpasspassword(){
     if(this.state.passPassword==="password")
     {
       this.setState({passPassword:"text"});
       this.setState({showhideforPassword:"Hide characters"});
        this.setState({fontfamilyforsecret:"Source Sans Pro"});
     }
     else{
       this.setState({passPassword:"password"});
       this.setState({showhideforPassword:"Show characters"});
    }
 },

 validateRMRMC(){
   let payload = this.buildPayload();
   validateCloud(payload, "AZURE")
   .then((res)=>{
     this.toggleValidate(true)

     console.log("res.data.isValid", res)
		//  showtooltipforSubscriptionID:false,
		//  showtooltipforAppID:false,
		//  showtooltipforAppKey:false,
		//  showtooltipforTenantID:false,
		//  showtooltipforEmail:false,
		//  showtooltipforPassword:false,
       if (this.state.cloudOptionAzure === "RMC" ){
         this.refs.email.hide();
         this.setState({email_Error : "", Email_validation: 'success', RMCValid: true, bordercolEmail:'thin solid #00C484', showtooltipforEmail:false}, ()=>{this.checkValidationDisability()})
        //  this.state.bordercolEmail='thin solid #00C484';
         // this.state.accesskeyvalid=true;
        //  this.state.showtooltipforEmail="hover";
         this.refs.password.hide();
         this.setState({password_Error : "", Password_validation: 'success', RMCValid: true, bordercolPassword:'thin solid #00C484', showtooltipforPassword:false}, ()=>{this.checkValidationDisability()})
        //  this.state.bordercolPassword='thin solid #00C484';
         // this.state.accesskeyvalid=true;
        //  this.state.showtooltipforPassword="hover";
       }
       this.refs.subscriptionID.hide();
       this.setState({subscriptionID_Error : "", SubscriptionID_validation: 'success', RMCValid: true, RMValid: true, bordercolSubID:'thin solid #00C484', showtooltipforSubscriptionID:false}, ()=>{this.checkValidationDisability()})
      //  this.state.bordercolSubID='thin solid #00C484';
       // this.state.accesskeyvalid=true;
      //  this.state.showtooltipforSubscriptionID="hover";
       this.refs.applicationID.hide();
       this.setState({applicationID_Error : "", ApplicationID_validation: 'success', RMCValid: true, RMValid: true, bordercolAppID:'thin solid #00C484'}, ()=>{this.checkValidationDisability()})
      //  this.state.bordercolAppID='thin solid #00C484';
       // this.state.accesskeyvalid=true;
      //  this.state.showtooltipforApplicationID="hover";
       this.refs.applicationKey.hide();
       this.setState({applicationKey_Error : "", ApplicationKey_validation: 'success', RMCValid: true, RMValid: true, bordercolAppKey:'thin solid #00C484', showtooltipforAppID:false}, ()=>{this.checkValidationDisability()})
      //  this.state.bordercolAppKey='thin solid #00C484';
       // this.state.accesskeyvalid=true;
      //  this.state.showtooltipforApplicationKey="hover";
       this.refs.tenantID.hide();
       this.setState({tenantID_Error : "", TenantID_validation: 'success', RMCValid: true, RMValid: true, bordercolTenID:'thin solid #00C484', showtooltipforAppKey:false, showtooltipforTenantID:false}, ()=>{this.checkValidationDisability()})
      //  this.state.bordercolTenID='thin solid #00C484';
       // this.state.accesskeyvalid=true;
      //  this.state.showtooltipforTenantID="hover";
      //  this.refs.secretinfo.hide();
      //  this.setState({SecretKey_error: '', SecretKey_validation : 'success', ASKValid: true}, ()=>{this.checkValidationDisability()})
      //  this.state.bordercols='thin solid #00C484';
      //  this.state.secretkeyvalid=true;
      //  this.state.showtooltipforsecret="false";
      //  this.refs.toolaccess.hide();
      //  this.setState({AccessKey_error: '', AccessKey_validation : 'success'}, ()=>{this.checkValidationDisability()})
      //  this.state.bordercola='thin solid #00C484'
      //  this.state.accesskeyvalid=true;
      //  this.state.showtooltipforaccess="false";
      //  this.checkValidationDisability();
    //  }
   })
   .catch((error)=>{
     this.toggleValidate(false)
     console.log("this is it. ", error, error.data)
    //  authCredentials.authType = "AzureOAuth2";
    //  authCredentials.applicationId = this.state.AppID;
    //  authCredentials.applicationKey = this.state.AppKey;
    //  authCredentials.tenantId = this.state.TenantID;
    //  authCredentials.subscriptionId = this.state.SubscriptionID;
    //  authCredentials.username = this.state.Email;
    //  authCredentials.password = this.state.Password;
     if (this.state.cloudOptionAzure === "RMC" ){
      //  this.refs.email.show();
      if (error.data.more_info === "username"){
       this.setState({email_Error :error.data.message, Email_validation: 'error', RMCValid: false, bordercolEmail:'thin solid #FF444D'}, ()=>{this.checkValidationDisability()})
       this.refs.email.show();
      //  this.state.bordercolEmail='thin solid #FF444D';
       // this.state.accesskeyvalid=false;
       this.state.showtooltipforEmail="hover";
     }
     //  this.refs.password.show();
     if (error.data.more_info === "password"){
       this.setState({password_Error :error.data.message, Password_validation: 'error', RMCValid: false, bordercolPassword:'thin solid #FF444D'}, ()=>{this.checkValidationDisability()})
       this.refs.password.show();
      //  this.state.bordercolPassword='thin solid #FF444D';
       // this.state.accesskeyvalid=false;
       this.state.showtooltipforPassword="hover";
     }
   }
    //  this.refs.subscriptionID.show();
    if (error.data.more_info === "subscriptionId"){
     this.setState({subscriptionID_Error :error.data.message, SubscriptionID_validation: 'error', RMCValid: false, RMValid: false, bordercolSubID:'thin solid #FF444D'}, ()=>{this.checkValidationDisability()})
     this.refs.subscriptionID.show();``
    //  this.state.bordercolSubID='thin solid #FF444D';
     // this.state.accesskeyvalid=false;
     this.state.showtooltipforSubscriptionID="hover";
   }
   //  this.refs.applicationID.show();
   if (error.data.more_info === "ApplicationId/ApplicationKey"){
     this.setState({applicationID_Error :error.data.message, ApplicationID_validation: 'error', bordercolAppID:'thin solid #FF444D',
										applicationKey_Error :error.data.message, ApplicationKey_validation: 'error', RMCValid: false, RMValid: false, bordercolAppKey:'thin solid #FF444D'
			  }, ()=>{this.checkValidationDisability()})
     this.refs.applicationID.show();
    //  this.state.bordercolAppID='thin solid #FF444D';
     // this.state.accesskeyvalid=false;
     this.state.showtooltipforApplicationID="hover";

		//  this.setState({applicationKey_Error :error.data.message, ApplicationKey_validation: 'error', RMCValid: false, RMValid: false, bordercolAppKey:'thin solid #FF444D'}, ()=>{this.checkValidationDisability()})
		 this.refs.applicationKey.show();
		//  this.state.bordercolAppKey='thin solid #FF444D';
		 // this.state.accesskeyvalid=false;
		 this.state.showtooltipforApplicationKey="hover";
   }

   //  this.refs.tenantID.show();
    if (error.data.more_info === "tenantId"){
      console.log("tenid errorrroooo")
     this.setState({tenantID_Error :error.data.message, TenantID_validation: 'error', RMCValid: false, RMValid: false, bordercolTenID:'thin solid #FF444D'}, ()=>{this.checkValidationDisability()})
     this.refs.tenantID.show();
    //  this.state.bordercolTenID='thin solid #FF444D';
     // this.state.accesskeyvalid=false;
     this.state.showtooltipforTenantID="hover";
   }
	 if (error.data.more_info === "username/password"){
		 console.log("username/password errorrroooo")
		 this.setState({email_Error :error.data.message, email_Validation: 'error', bordercolEmail:'thin solid #FF444D',
										password_Error :error.data.message, password_Validation: 'error', RMCValid: false, RMValid: false, bordercolPassword:'thin solid #FF444D', showtooltipforEmail:"hover", showtooltipforPassword:"hover"
			  }, ()=>{this.checkValidationDisability()})
				// this.refs.tenantID.show();
				this.refs.email.show();
				this.refs.password.show();

	 //  this.state.bordercolTenID='thin solid #FF444D';
		// this.state.accesskeyvalid=false;
		this.state.showtooltipforEmail="hover"
		this.state.howtooltipforPassword="hover"
		this.state.showtooltipforTenantID="hover";
	}
	 if (!error.data.more_info){
		 console.log("tenid errorrroooo")
		this.setState({errorGeneral: error.data.message, TenantID_validation: 'error', RMCValid: false, RMValid: false, bordercolTenID:'thin solid #FF444D'}, ()=>{this.checkValidationDisability()})
		this.refs.tenantID.show();
	 //  this.state.bordercolTenID='thin solid #FF444D';
		// this.state.accesskeyvalid=false;
		this.state.showtooltipforTenantID="hover";
	}
   })
 },
// {"timestamp":1.508544259952E12,"status":400,"error":"No results found","message":"Invalid tenant is provided","path":"POST settings/accounts/validate/{type}","code":"400-1","more_info":"tenantId","fieldErrors":[]}
  ValidateSubscriptionID : function() {

    let SubscriptionID_schema  = {
      SubscriptionID: Joi.string().required(),
    };
    let result = Joi.validate({SubscriptionID: subscriptionID.value}, SubscriptionID_schema)
    // console.log("resultsnomnomnom", result)
    if (result.error) {
      this.refs.subscriptionID.show();
      this.setState({SubscriptionID_error : result.error.details[0].message, SubscriptionID_validation: 'error'}, ()=>{this.checkValidationDisability()})
      this.state.bordercolSubID='thin solid #FF444D';
      // this.state.accesskeyvalid=false;
      this.state.showtooltipforSubscriptionID="hover";
    }
    else {
      // SubscriptionID:"",
      // AppID:"",
      // AppKey:"",
      // TenantID:"",
      // Email:"",
      // Password:"",
      if (this.state.SubscriptionID && this.state.AppID && this.state.AppKey && this.state.TenantID){
        // this.validateRMRMC();
      }
    }
    // if( this.state.accesskeyvalid)
    // return true
    //  // this.checkValidationDisability();
    },
    ValidateApplicationID: function() {

      let ApplicationID_schema = {
        ApplicationID: Joi.string().required(),
      };
      let result = Joi.validate({ApplicationID: applicationID.value}, ApplicationID_schema)
      if (result.error) {
        this.refs.applicationID.show();
        this.setState({ApplicationID_Error : result.error.details[0].message, ApplicationID_validation: 'error'}, ()=>{this.checkValidationDisability()})
        this.state.bordercolAppID='thin solid #FF444D';
        // this.state.accesskeyvalid=false;
        this.state.showtooltipforApplicationID="hover";
      }
      else {
        if (this.state.SubscriptionID && this.state.AppID && this.state.AppKey && this.state.TenantID){
          // this.validateRMRMC();
        }
      }
      // if( this.state.accesskeyvalid)
      // return true
      //  // this.checkValidationDisability();
    },
    ValidateApplicationKey: function() {

      let ApplicationKey_schema = {
        ApplicationKey: Joi.string().required(),
      };
      let result = Joi.validate({ApplicationKey: applicationKey.value}, ApplicationKey_schema)
      if (result.error) {
        this.refs.applicationKey.show();
        this.setState({ApplicationKey_Error : result.error.details[0].message, ApplicationKey_validation: 'error'}, ()=>{this.checkValidationDisability()})
        this.state.bordercolAppKey='thin solid #FF444D';
        // this.state.accesskeyvalid=false;
        this.state.showtooltipforApplicationKey="hover";
      }
      else {
        if (this.state.SubscriptionID && this.state.AppID && this.state.AppKey && this.state.TenantID){
          // this.validateRMRMC();
        }
      }
      // if( this.state.accesskeyvalid)
      // return true
      //  // this.checkValidationDisability();
    },
    ValidateTenantID: function() {

      let TenantID_schema = {
        TenantID: Joi.string().required(),
      };
      let result = Joi.validate({TenantID: tenantID.value}, TenantID_schema)

      if (result.error) {
        this.refs.tenantID.show();
        this.setState({TenantID_Error : result.error.details[0].message, TenantID_validation: 'error'}, ()=>{this.checkValidationDisability()})
        this.state.bordercolTenID='thin solid #FF444D';
        // this.state.accesskeyvalid=false;
        this.state.showtooltipforTenantID="hover";
      }
      else {
        if (this.state.SubscriptionID && this.state.AppID && this.state.AppKey && this.state.TenantID){
          // this.validateRMRMC();
        }
      }
      // if( this.state.accesskeyvalid)
      // return true
      //  // this.checkValidationDisability();
    },
    ValidateEmail: function() {

      let Email_schema = {
        Email: Joi.string().required(),
      };
      let result = Joi.validate({Email: this.state.Email}, Email_schema)
      console.log("resultsnomnomnom", result)

      if (result.error) {
        this.refs.email.show();
        this.setState({Email_Error : result.error.details[0].message, Email_validation: 'error'}, ()=>{this.checkValidationDisability()})
        this.state.bordercolEmail='thin solid #FF444D';
        // this.state.accesskeyvalid=false;
        this.state.showtooltipforEmail="hover";
      }
      else {
        if (this.state.cloudOptionAzure === "RMC" && this.state.SubscriptionID && this.state.AppID && this.state.AppKey && this.state.TenantID && this.state.Email && this.state.Password){
          // this.validateRMRMC();
        }
      }
      // if( this.state.accesskeyvalid)
      // return true
      //  // this.checkValidationDisability();
    },
    ValidatePassword: function() {

      let Password_schema = {
        Password: Joi.string().required(),
      };
      let result = Joi.validate({Password: this.state.Password}, Password_schema)
      console.log("resultsnomnomnompassword", result)
      if (result.error) {
        this.refs.password.show();
        this.setState({Password_Error : result.error.details[0].message, Password_validation: 'error'}, ()=>{this.checkValidationDisability()})
        this.state.bordercolPassword='thin solid #FF444D';
        // this.state.accesskeyvalid=false;
        this.state.showtooltipforPassword="hover";
      }
      else {
        console.log("resultstrueture rmc", this.state.cloudOptionAzure === "RMC", this.state.SubscriptionID, this.state.AppID, this.state.AppKey, this.state.TenantID, this.state.Email, this.state.Password)

        if (this.state.cloudOptionAzure === "RMC" && this.state.SubscriptionID && this.state.AppID && this.state.AppKey && this.state.TenantID && this.state.Email && this.state.Password){
          // console.log("resultstrueture rmc", this.state.cloudOptionAzure === "RMC", this.state.SubscriptionID, this.state.AppID, this.state.AppKey, this.state.TenantID, this.state.Email, this.state.Password)

          // this.validateRMRMC();
        }
      }
      // if( this.state.accesskeyvalid)
      // return true
      //  // this.checkValidationDisability();
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///GOOGLE CLOUD CREDENTIAL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleOptionChangeGoogle: function (changeEvent) {
    this.setState({
      validated:false,
      errorGeneral:"",

      cloudOptionGoogle: changeEvent.target.value,
      currentOption: changeEvent.target.value,

      serviceAccount:"",
      uploadFileNameJSON:"",
      uploadFileNameP12:"",

      p12_Error:"Please select a P12 file",
      serviceaccount_Error:"Please enter Service Account",
      json_Error:"Please select a JSON file",

      P12_validation:"",
      ServiceAccount_validation:"",
      JSON_validation:"",

      bordercolP12:'thin solid #4C58A4',
      bordercolServiceAccount:'thin solid #4C58A4',
      bordercolJSON:'thin solid #4C58A4',

      showtooltipforP12:"hover",
      showtooltipforServiceAccount:"hover",
      showtooltipforJSON:"hover",
      p12FileExists: false,
      jsonFileExists: false,
      passserviceaccount:"password",
      showhideforserviceaccount:"Show characters",
    },
    ()=>{this.checkValidationDisability()}
  )
  },

  funpassserviceaccount(){
      if(this.state.passserviceaccount==="password")
      {
        this.setState({passserviceaccount:"text"});
        this.setState({showhideforserviceaccount:"Hide characters"});
        //  this.setState({fontfamilyforsecret:"Source Sans Pro"});
      }
      else{
        this.setState({passserviceaccount:"password"});
        this.setState({showhideforserviceaccount:"Show characters"});
     }
  },

  validateGoogle(){
    console.log("validateGoogle");
    let payload = this.buildPayload();
      validateCloud(payload, "GOOGLE")
      .then((res)=>{
        if (this.state.cloudOptionGoogle === "P12" ){
					this.toggleValidate(true)

          this.refs.p12.hide();
          this.setState({p12_Error : "", P12_validation: 'success', bordercolP12:'thin solid #00C484', showtooltipforP12:false}, ()=>{this.checkValidationDisability()})
          // this.state.bordercolP12='thin solid #00C484';

          this.refs.serviceaccounts.hide();
          this.setState({serviceaccount_Error : "", ServiceAccount_validation: 'success', bordercolServiceAccount:'thin solid #00C484', showtooltipforServiceAccount:false}, ()=>{this.checkValidationDisability()})
          // this.state.bordercolServiceAccount='thin solid #00C484';

          // this.state.showtooltipforServiceAccount="";
      } else if (this.state.cloudOptionGoogle === "JSON") {
				this.toggleValidate(true)
        this.refs.json.hide();
        this.setState({json_Error : "", JSON_validation: 'success', bordercolJSON: 'thin solid #00C484', showtooltipforJSON:false}, ()=>{this.checkValidationDisability()})
        // this.state.bordercolJSON='thin solid #00C484';
        // this.state.accesskeyvalid=true;
        // this.state.showtooltipforJSON="";
      }
    })
    .catch((error)=>{
      console.log("google error", error)
      if (this.state.cloudOptionGoogle === "P12" ){
        this.refs.p12.show();
        this.setState({p12_Error : error.data.message, P12_validation: 'error', bordercolP12:'thin solid #FF444D'}, ()=>{this.checkValidationDisability()})
        // this.state.bordercolP12:'thin solid #FF444D';
        // this.state.accesskeyvalid=true;
        this.state.showtooltipforP12="hover";
        this.refs.serviceaccounts.show();
        this.setState({serviceaccount_Error : error.data.message, ServiceAccount_validation: 'error', bordercolServiceAccount:'thin solid #FF444D'}, ()=>{this.checkValidationDisability()})
        // this.state.bordercolServiceAccount='thin solid #FF444D';
        // this.state.accesskeyvalid=true;
        this.state.showtooltipforServiceAccount="hover";
      } else if (this.state.cloudOptionGoogle === "JSON") {
        this.refs.json.show();
        this.setState({json_Error : error.data.message, JSON_validation: 'error', bordercolJSON:'thin solid #FF444D'}, ()=>{this.checkValidationDisability()})
        // this.state.bordercolJSON:'thin solid #FF444D';
        // this.state.accesskeyvalid=true;
        this.state.showtooltipforJSON="hover";
      }
    })
  },

  // validateRMRMC(){
  //   let payload = this.buildPayload();
  //   validateCloud(payload, "AZURE")
  //   .then((res)=>{
  //     this.toggleValidate(true)
  //
  //     console.log("res.data.isValid", res)
  //       if (this.state.cloudOptionAzure === "RMC" ){
  //         this.refs.email.hide();
  //         this.setState({email_Error : "", Email_validation: 'success', RMCValid: true}, ()=>{this.checkValidationDisability()})
  //         this.state.bordercolEmail='thin solid #00C484';
  //         // this.state.accesskeyvalid=true;
  //         this.state.showtooltipforEmail="hover";
  //         this.refs.password.hide();
  //         this.setState({password_Error : "", Password_validation: 'success', RMCValid: true}, ()=>{this.checkValidationDisability()})
  //         this.state.bordercolPassword='thin solid #00C484';
  //         // this.state.accesskeyvalid=true;
  //         this.state.showtooltipforPassword="hover";
  //       }
  //       this.refs.subscriptionID.hide();
  //       this.setState({subscriptionID_Error : "", SubscriptionID_validation: 'success', RMCValid: true, RMValid: true}, ()=>{this.checkValidationDisability()})
  //       this.state.bordercolSubID='thin solid #00C484';
  //       // this.state.accesskeyvalid=true;
  //       this.state.showtooltipforSubscriptionID="hover";
  //       this.refs.applicationID.hide();
  //       this.setState({applicationID_Error : "", ApplicationID_validation: 'success', RMCValid: true, RMValid: true}, ()=>{this.checkValidationDisability()})
  //       this.state.bordercolAppID='thin solid #00C484';
  //       // this.state.accesskeyvalid=true;
  //       this.state.showtooltipforApplicationID="hover";
  //       this.refs.applicationKey.hide();
  //       this.setState({applicationKey_Error : "", ApplicationKey_validation: 'success', RMCValid: true, RMValid: true}, ()=>{this.checkValidationDisability()})
  //       this.state.bordercolAppKey='thin solid #00C484';
  //       // this.state.accesskeyvalid=true;
  //       this.state.showtooltipforApplicationKey="hover";
  //       this.refs.tenantID.hide();
  //       this.setState({tenantID_Error : "", TenantID_validation: 'success', RMCValid: true, RMValid: true}, ()=>{this.checkValidationDisability()})
  //       this.state.bordercolTenID='thin solid #00C484';
  //       // this.state.accesskeyvalid=true;
  //       this.state.showtooltipforTenantID="hover";
  //      //  this.refs.secretinfo.hide();
  //      //  this.setState({SecretKey_error: '', SecretKey_validation : 'success', ASKValid: true}, ()=>{this.checkValidationDisability()})
  //      //  this.state.bordercols='thin solid #00C484';
  //      //  this.state.secretkeyvalid=true;
  //      //  this.state.showtooltipforsecret="false";
  //      //  this.refs.toolaccess.hide();
  //      //  this.setState({AccessKey_error: '', AccessKey_validation : 'success'}, ()=>{this.checkValidationDisability()})
  //      //  this.state.bordercola='thin solid #00C484'
  //      //  this.state.accesskeyvalid=true;
  //      //  this.state.showtooltipforaccess="false";
  //      //  this.checkValidationDisability();
  //    //  }
  //   })
  //   .catch((error)=>{
  //     this.toggleValidate(false)
  //     console.log("this is it. ", error, error.data)
  //    //  authCredentials.authType = "AzureOAuth2";
  //    //  authCredentials.applicationId = this.state.AppID;
  //    //  authCredentials.applicationKey = this.state.AppKey;
  //    //  authCredentials.tenantId = this.state.TenantID;
  //    //  authCredentials.subscriptionId = this.state.SubscriptionID;
  //    //  authCredentials.username = this.state.Email;
  //    //  authCredentials.password = this.state.Password;
  //     if (this.state.cloudOptionAzure === "RMC" ){
  //      //  this.refs.email.show();
  //      if (error.data.more_info === "username"){
  //       this.setState({email_Error :error.data.message, Email_validation: 'error', RMCValid: false}, ()=>{this.checkValidationDisability()})
  //       this.refs.email.show();
  //       this.state.bordercolEmail='thin solid #FF444D';
  //       // this.state.accesskeyvalid=false;
  //       this.state.showtooltipforEmail="hover";
  //     }
  //     //  this.refs.password.show();
  //     if (error.data.more_info === "password"){
  //       this.setState({password_Error :error.data.message, Password_validation: 'error', RMCValid: false}, ()=>{this.checkValidationDisability()})
  //       this.refs.password.show();
  //       this.state.bordercolPassword='thin solid #FF444D';
  //       // this.state.accesskeyvalid=false;
  //       this.state.showtooltipforPassword="hover";
  //     }
  //   }
  //    //  this.refs.subscriptionID.show();
  //    if (error.data.more_info === "subscriptionId"){
  //     this.setState({subscriptionID_Error :error.data.message, SubscriptionID_validation: 'error', RMCValid: false, RMValid: false}, ()=>{this.checkValidationDisability()})
  //     this.refs.subscriptionID.show();``
  //     this.state.bordercolSubID='thin solid #FF444D';
  //     // this.state.accesskeyvalid=false;
  //     this.state.showtooltipforSubscriptionID="hover";
  //   }
  //   //  this.refs.applicationID.show();
  //   if (error.data.more_info === "applicationId"){
  //     this.setState({applicationID_Error :error.data.message, ApplicationID_validation: 'error', RMCValid: false, RMValid: false}, ()=>{this.checkValidationDisability()})
  //     this.refs.applicationID.show();
  //     this.state.bordercolAppID='thin solid #FF444D';
  //     // this.state.accesskeyvalid=false;
  //     this.state.showtooltipforApplicationID="hover";
  //   }
  //   //  this.refs.applicationKey.show();
  //   if (error.data.more_info === "applicationKey"){
  //     this.setState({applicationKey_Error :error.data.message, ApplicationKey_validation: 'error', RMCValid: false, RMValid: false}, ()=>{this.checkValidationDisability()})
  //     this.refs.applicationKey.show();
  //     this.state.bordercolAppKey='thin solid #FF444D';
  //     // this.state.accesskeyvalid=false;
  //     this.state.showtooltipforApplicationKey="hover";
  //   }
  //   //  this.refs.tenantID.show();
  //    if (error.data.more_info === "tenantId"){
  //     this.setState({tenantID_Error :error.data.message, TenantID_validation: 'error', RMCValid: false, RMValid: false}, ()=>{this.checkValidationDisability()})
  //     this.refs.tenantID.show();
  //     this.state.bordercolTenID='thin solid #FF444D';
  //     // this.state.accesskeyvalid=false;
  //     this.state.showtooltipforTenantID="hover";
  //   }
  //   })
  // },
  handleServiceAccount(event){
    console.log("I am changing ServiceAccount RIGHT?", event.target.value)
    this.setState({
      serviceAccount: event.target.value,
      validated:false
    },
    ()=>{this.checkValidationDisability()}
  )
  },

	handleLongFileName(filename, type){
		let finalFileName = filename;
		 if(filename.length>25) {
		   let concatString='...'+type
		   let subFileName=filename.substring(0,25);
		   finalFileName= subFileName.concat(concatString)
		 }
		 return finalFileName;
	},

  handleP12(evt){
    console.log("evtevtevt", evt, evt.target.files[0], evt.target.files[0].name)

   let fileName=evt.target.files[0].name;
   let finalFileName=evt.target.files[0].name;

   var ext = fileName.substring(fileName.indexOf(".") + 1, fileName.length);
   if (ext != 'P12' && ext != 'p12') {
     var uploadFileNameP12=fileName.substring(0, fileName.indexOf("."));
     // cloudOptionGoogle:"P12",
     // ServiceAccount:"",
     // uploadFileNameJSON:"",
     // uploadFileNameP12:"",
     this.setState({bordercolP12:'thin solid #FF444D',
                   showtooltipforP12:'hover',
                   p12_Error:'File type is invalid,upload only .p12 file',
                   uploadFileNameP12:finalFileName,
									 validated:false,
                   p12FileExists:false,
                   addButtonDisability:true})
     this.refs.p12.show();
   } else {
     this.refs.p12.hide();
     this.setState({bordercolP12:'thin solid #4C58A4',
                   showtooltipforP12:''})
     var localFileName=fileName.substring(0, fileName.indexOf("."));
     console.log("localFileName", localFileName)
     var file = evt.target.files[0];
     if (file) {
       var reader = new FileReader();
       reader.readAsText(file, "UTF-8");
       reader.onload = function (evt)
       {
         let p12Stroing=evt.target.result;
         this.setState({p12FileExists:true,
           bordercolP12:'thin solid #4C58A4',
           p12_Error:'Upload P12 file'},function()
         {
           this.setState({uploadFileNameP12:finalFileName, validated:false}, ()=>{this.checkValidationDisability()});
          //  if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered && this.state.p12FileExists && this.state.isLabelSet)
          //  {
          //    this.setState({addButtonDisability:false})
          //  }
          let password='';
          let p12FileName=document.getElementById('uploadBtnP12').files[0].name
          var data = new FormData();
          data.append('file', document.getElementById('uploadBtnP12').files[0]);
          uploadJSONP12(data)
          .then((response)=>{
            // this.saveCredentials(label, ncredType, loginId, password, usage, p12FileName)
            console.log("response from uploading file", response)
          })
          .catch((error)=>{
            console.log("error in saving pem file "+error)
          })
         }.bind(this))
       }.bind(this)
       reader.onerror = function (evt) {
         console.log("error reading file "+evt);
       }
     } else {
       console.log("no file")
       this.setState({pemContents:''})
     }
   }
 },

 handleJSON(evt){
   console.log("evtevtevt", evt, evt.target.files[0], evt.target.files[0].name)

  let fileName=evt.target.files[0].name;
  let finalFileName=evt.target.files[0].name;

  var ext = fileName.substring(fileName.indexOf(".") + 1, fileName.length);
  if (ext != 'JSON' && ext != 'json') {
    var uploadFileNameJSON=fileName.substring(0, fileName.indexOf("."));
    // cloudOptionGoogle:"JSON",
    // ServiceAccount:"",
    // uploadFileNameJSON:"",
    // uploadFileNameJSON:"",
    this.setState({bordercolJSON:'thin solid #FF444D',
                  showtooltipforJSON:'hover',
                  json_Error:'File type is invalid, upload only .json file',
                  uploadFileNameJSON:finalFileName,
									validated:false,
                  jsonFileExists:false,
                  addButtonDisability:true})
    this.refs.json.show();
  } else {
    this.refs.json.hide();
    this.setState({bordercolJSON:'thin solid #4C58A4',
                  showtooltipforJSON:''})
    var localFileName=fileName.substring(0, fileName.indexOf("."));
    console.log("localFileName", localFileName)
    var file = evt.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt)
      {
        let jsonStroing=evt.target.result;
        this.setState({jsonFileExists:true,
          bordercolJSON:'thin solid #4C58A4',
          json_Error:'Upload JSON file'},function()
        {
          this.setState({uploadFileNameJSON:finalFileName, validated:false}, ()=>{this.checkValidationDisability()});
         //  if(this.state.isSelectedType && this.state.isSelectedUsage && this.state.userNameEntered && this.state.jsonFileExists && this.state.isLabelSet)
         //  {
         //    this.setState({addButtonDisability:false})
         //  }
         let password='';
         let jsonFileName=document.getElementById('uploadBtnJSON').files[0].name
         var data = new FormData();
         data.append('file', document.getElementById('uploadBtnJSON').files[0]);
         uploadJSONP12(data)
         .then((response)=>{
           // this.saveCredentials(label, ncredType, loginId, password, usage, jsonFileName)
           console.log("response from uploading file", response)
         })
         .catch((error)=>{
           console.log("error in saving pem file "+error)
         })
        }.bind(this))
      }.bind(this)
      reader.onerror = function (evt) {
        console.log("error reading file "+evt);
      }
    } else {
      console.log("no file")
      this.setState({pemContents:''})
    }
  }
},

 // save(ev) {
 //   let label = this.state.credLabel;
 //   let ncredType=this.state.credType;
 //   let loginId=formControlsUsername.value;
 //   let password=formPassword.value;
 //   let usage=formControlsUsage.value;
 //   let p12FileName='';
 //   if(this.state.selectedOption==="JSON"){
 //     password='';
 //     p12FileName=document.getElementById('uploadBtn').files[0].name
 //     var data = new FormData();
 //     data.append('file', document.getElementById('uploadBtn').files[0]);
 //     uploadJSONP12(data)
 //     .then((response)=>{
 //       this.saveCredentials(label, ncredType, loginId, password, usage, p12FileName)
 //     })
 //     .catch((error)=>{
 //       console.log("error in saving pem file "+error)
 //     })
 //
 //   }
 //   else{
 //     //password selection
 //     this.saveCredentials(label, ncredType, loginId, password, usage, p12FileName)
 //   }
 //
 // },

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///Monitoring///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  handleEnableMonitor(){
  let _that=this;
    this.getRegionsAPIFunction()

    if(!this.state.enableMonitor)
      this.setState({
				enableMonitor:true,
				S3Bucketname:""
			},()=>{
            this.checkValidationDisability()
            if(this.props.edit==true){
             enablemonitorForAccounts(this.state.idofCloud,this.state.accountName,this.state.selectedCloudType,false)
             .then((response1) => {
                 _that.APICallformonitorAcount(this.state.accountName)

                console.log('I am in sucess response1'+ response)
             })
            .catch((error1) => console.log("Error in getting the enablemonitorForAccounts"))
            }


        })
    else
      this.setState({
				enableMonitor:false,
				S3Bucketname:""
			},()=>this.checkValidationDisability())

  },

  // getRegionsAPIFunction(){

  //   if(this.state.cloudOptionAWS === 'awsSk'&& this.state.accessKeyAWS != '', this.state.secretAccessKeyAWS!=''){

  //     /*API call to generate regions for AK SAK --- Start----*/
  //     let apiParameter = {
  //       "authType": this.state.cloudOptionAWS,
  //       "accessKey": this.state.accessKeyAWS,
  //       "secretAccessKey":this.state.secretAccessKeyAWS
  //     }
  //     getRegionsForMonitorAK_SAK(apiParameter)
  //     .then((responce)=>{
  //       this.setState({responceRegions:responce.regions.regions})
  //       let regionArray=[]
  //       console.log('response AIM==========> '+ JSON.stringify(this.state.responceRegions))
  //       this.state.responceRegions.map((val,key)=>{
  //         let regionValue=Object.keys(val)
  //         regionArray.push(regionValue)
  //       })
  //       this.setState({s3Regions:this.state.responceRegions})
  //     })
  //     .catch((error) => console.log("Error in getting the S3 Regions Using AIM"))
  //     /*----- API End ----*/
  //   }else if(this.state.cloudOptionAWS === "awsAssumeInstanceCred"){

  //     /*API call to generate regions for AIC --- Start----*/
  //       let apiParameter = {
  //         "authType": this.state.cloudOptionAWS
  //       }
  //       getRegionsForMonitorAIC(apiParameter)
  //       .then((responce)=>{
  //         this.setState({responceRegions:responce.regions.regions})
  //         let regionArray=[]
  //         console.log('response AIM==========> '+ JSON.stringify(this.state.responceRegions))
  //         this.state.responceRegions.map((val,key)=>{
  //           let regionValue=Object.keys(val)
  //           regionArray.push(regionValue)
  //         })
  //         this.setState({s3Regions:this.state.responceRegions})
  //       })
  //       .catch((error) => console.log("Error in getting the S3 Regions Using getRegionsForMonitorAIC"))
  //     /*----- API End ----*/
  //   }else if(this.state.cloudOptionAWS === "awsArn" && this.state.ARNRole!= ''&& this.state.ExternalID){

  //     /*API call to generate regions for ARN --- Start----*/
  //       let apiParameter = {
  //         "authType": this.state.cloudOptionAWS,
  //         "roleArn":this.state.ARNRole,
  //         "externalId":this.state.ExternalID
  //       }
  //       getRegionsForMonitorARN(apiParameter)
  //       .then((responce)=>{
  //         this.setState({responceRegions:responce.regions.regions})
  //         let regionArray=[]
  //         console.log('response AIM==========> '+ JSON.stringify(this.state.responceRegions))
  //         this.state.responceRegions.map((val,key)=>{
  //           let regionValue=Object.keys(val)
  //           regionArray.push(regionValue)
  //         })
  //         this.setState({s3Regions:this.state.responceRegions})
  //       })
  //       .catch((error) => console.log("Error in getting the S3 Regions Using getRegionsForMonitorARN"))
  //     /*----- API End ----*/
  //   }
  // },

  getRegionsAPIFunction(){
    let newBucketName = []
    if(this.state.cloudOptionAWS === 'awsSk'&& this.state.accessKeyAWS != '' && this.state.secretAccessKeyAWS!=''){

      /*API call to generate S3Bucket Name for AK SAK --- Start----*/
      let apiParameter = {
        "authType": this.state.cloudOptionAWS,
        "accessKey": this.state.accessKeyAWS,
        "secretAccessKey":this.state.secretAccessKeyAWS
      }
      getS3BucketNameForMonitorAK_SAK(apiParameter)
      .then((responce)=>{
        this.setState({S3BucketName :responce.s3buckets})
        /*for(var i=0;i< this.state.S3BucketNameResponce.length;i++){
          let n = this.state.S3BucketNameResponce[i].indexOf(":")
          let forBucketName = this.state.S3BucketNameResponce[i].slice(0,n)
          newBucketName.push(forBucketName)
        }
        this.handleRegionBucketName(newBucketName[0])
        console.log('S3BucketNameResponce ', S3BucketNameResponce)
        this.setState({S3BucketName:newBucketName})*/
      })
      .catch((error) => console.log("Error in getting the S3 Regions Using AIM"))
      /*----- API End ----*/
    }else if(this.state.cloudOptionAWS === "awsAssumeInstanceCred"){

      /*API call to generate regions for AIC --- Start----*/
        let apiParameter = {
          "authType": this.state.cloudOptionAWS
        }

        getS3BucketNameForMonitorAIC(apiParameter)
        .then((responce)=>{
          this.setState({S3BucketName :responce.s3buckets})
          /*this.setState({S3BucketNameResponce :responce.s3buckets})
          for(var i=0;i< this.state.S3BucketNameResponce.length;i++){
            let n = this.state.S3BucketNameResponce[i].indexOf(":")
            let forBucketName = this.state.S3BucketNameResponce[i].slice(0,n)
            newBucketName.push(forBucketName)
          }
          this.handleRegionBucketName(newBucketName[0])
          console.log('S3BucketNameResponce ', S3BucketNameResponce)
          this.setState({S3BucketName:newBucketName})*/
        })
        .catch((error) => console.log("Error in getting the S3 Bucket Name Using getS3BucketNameForMonitorAIC"))
      /*----- API End ----*/
    // }else if(this.state.cloudOptionAWS === "awsArn" && this.state.ARNRole!= ''&& this.state.ExternalID){
  }else if(this.state.cloudOptionAWS === "awsArn" && this.state.ARNRole!= ''){

      /*API call to generate regions for ARN --- Start----*/
        let apiParameter = {
          "authType": this.state.cloudOptionAWS,
          "roleArn":this.state.ARNRole,
          "externalId":this.state.ExternalID
        }
        getS3BucketNameForMonitorARN(apiParameter)
        .then((responce)=>{
          this.setState({S3BucketName :responce.s3buckets})
          /*this.setState({S3BucketNameResponce :responce.s3buckets})
          for(var i=0;i< this.state.S3BucketNameResponce.length;i++){
            let n = this.state.S3BucketNameResponce[i].indexOf(":")
            let forBucketName = this.state.S3BucketNameResponce[i].slice(0,n)
            newBucketName.push(forBucketName)
          }
          this.handleRegionBucketName(newBucketName[0])
          // console.log('S3BucketNameResponce ', S3BucketNameResponce)
          this.setState({S3BucketName:newBucketName})
          this.setState({S3BucketName:responce.s3buckets})*/
        })
        .catch((error) => console.log("Error in getting the S3 Regions Using getRegionsForMonitorARN"))
      /*----- API End ----*/
    }
  },

  handleRegion(){
    this.getRegionsAPIFunction()
  },
  render() {
		// let saveDisability = this.state.enableMonitor? this.state.S3bucketname?false:true:false;
		let saveDisability;

		if (this.state.enableMonitor){
			if (this.state.S3Bucketname){
				saveDisability = false;
			} else {
				saveDisability = true;
			}
		} else {
			saveDisability = false;
		}
		// let monitorDisablErrorbucket = !this.state.validate?'Provide credentials and click "Validate" to input Prefix':this.state.Prefix_error;
		let monitorDisablError = !this.state.validate?'Provide credentials and click "Validate" to input Prefix':this.state.Prefix_error;

    let list = this.state.cloudsList;
    let cloudCredentials;
    console.log("listlistlist", list, this.state.cloudNumber)
    let overLayStyle= {color: 'grey',borderWidth: 2,
                        borderRadius:0,width:220,height:120,paddingLeft:5,paddingBottom:0,paddingRight:0,paddingTop:10}
    let posstyle = {  position: 'relative', top:40, left: 76,
      width: '200px',
      float: 'right',
      margin: 'auto' }

      //let savebuttonDisable=(this.state.validateButtonDisability||(enableMonitor&&!s3bucketNameValid))

      const tooltipS3BucketName = (
        <Popover   style={{color: 'black',borderWidth: 2,borderRadius:0,height:"auto"}}>{this.state.S3BucketName_error}</Popover>
      );
      const tooltipS3BucketRegion = (
        <Popover   style={{color: 'black',borderWidth: 2,borderRadius:0,height:"auto"}}>{this.state.S3BucketRegion_error}</Popover>
      );
      const tooltipPrefix = (
        <Popover   style={{color: 'black',borderWidth: 2,borderRadius:0,height:"auto"}}>{monitorDisablError}</Popover>
      )
      const tooltipAccountName = (
        <Popover   style={{color: 'black',borderWidth: 2,borderRadius:0,height:"auto"}}>{this.state.AccountName_error}</Popover>
      );

      const tooltipAcesskey = (
       <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:"auto"}}>{this.state.AccessKey_error}</Popover>
     );

      const tooltipSecretKey = (
       <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:"auto"}}>{this.state.SecretKey_error}</Popover>
     );

     const tooltipARNRole = (
      <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:"auto"}}>{this.state.ARNRole_error}</Popover>
     );

      const tooltipExternalID = (
       <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:"auto"}}>{this.state.ExternalID_error}</Popover>
      );

      const tooltipSubscriptionID = (
        <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:"auto"}}>{this.state.subscriptionID_Error}</Popover>
      );
      const tooltipApplicationID = (
        <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:"auto"}}>{this.state.applicationID_Error}</Popover>
      );
      const tooltipApplicationKey = (
        <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:"auto"}}>{this.state.applicationKey_Error}</Popover>
      );
      const tooltipTenantID = (
        <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:"auto"}}>{this.state.tenantID_Error}</Popover>
      );
      const tooltipEmail = (
        <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:"auto"}}>{this.state.email_Error}</Popover>
      );
      const tooltipPassword = (
        <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:"auto"}}>{this.state.password_Error}</Popover>
      );

      const tooltipP12 = (
        <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:"auto"}}>{this.state.p12_Error}</Popover>
      );
      const tooltipServiceAccount = (
        <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:200,height:"auto"}}>{this.state.serviceaccount_Error}</Popover>
      );
      const tooltipJSON = (
        <Popover style={{color: 'black',borderWidth: 2,borderRadius:0,width:250,height:"auto"}}>{this.state.json_Error}</Popover>
      );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///GOOGLE CLOUD CREDENTIAL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(this.state.selectedCloudType === "Google"){
	let uploadFileNameP12, uploadFileNameJSON;
		uploadFileNameP12 = this.handleLongFileName(this.state.uploadFileNameP12, "p12")
		uploadFileNameJSON = this.handleLongFileName(this.state.uploadFileNameJSON, "json")

  cloudCredentials = (
    <div>
    <FormGroup controlId="formControlCloudOnpremises">

     <div className="form-group option_field radio" id="grping-server">
      <div className="row col-xs-12 pull-right">
        <Col lg={4}>
          <input type="radio" name="cloudname" id="cloudid" value="P12" checked={this.state.cloudOptionGoogle === 'P12'?true:false} onChange={this.handleOptionChangeGoogle}/>
             <span >P12 Key</span>
        </Col>
        <Col lg={6}>
          <input type="radio" name="onpremisesname" id="onpremisesid" value="JSON" checked={this.state.cloudOptionGoogle === 'JSON'?true:false} onChange={this.handleOptionChangeGoogle}/>
             <span>JSON</span>
        </Col>
       </div>
     </div>
    </FormGroup>
    <br/><br/>
      {this.state.cloudOptionGoogle==="P12"?
        <div>
          <FormGroup  controlId="clientid">
           <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Service Account</ControlLabel>
             <OverLayCustom ref="serviceaccounts" trigger={this.state.showtooltipforServiceAccount} placement="right" overlay={tooltipServiceAccount}>
                 <input id="serviceaccount"
                   type={this.state.passserviceaccount}
                   defaultValue={this.state.serviceAccount}
                   placeholder="Enter Service Account"
                   onChange={this.handleServiceAccount}
                   style={{fontFamily:this.state.fontfamilyforsecret,width:326,height:40,padding:'12px',border:this.state.bordercolServiceAccount,borderRadius:0}}/>
               </OverLayCustom>
             <div  style={{width:'326px',marginLeft:15, textAlign:'right'}}>
               <a style={{cursor: "pointer",fontFamily:"Source Sans Pro",fontSize:'15px', paddingRight:"15px"}} onClick={this.funpassserviceaccount}>{this.state.showhideforserviceaccount}</a>
             </div>
          </FormGroup>

          <FormGroup controlId="CallbackUri" style={{width:'326px',marginBottom:'31px'}}>
            <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px'}}>Service Account Key</ControlLabel>
            <OverLayCustom ref="p12" trigger={this.state.showtooltipforP12} placement="right" overlay={tooltipP12}>
              <div>
                <div id="uploadFileDiv" style={{display:'inline-block', border:this.state.bordercolP12, paddingTop:'7px', paddingLeft:'12px', paddingRight:'12px', width:258,height:40}}>
                  {uploadFileNameP12}&nbsp; {(this.state.uploadFileNameP12 === "") ?<i>Select P12 File</i>: <noscript/>}
                </div>
                <div className="fileUpload btn btnPrimary" style={{display:'inline-block', backgroundColor: 'rgb(76, 88, 164)', color: 'white', borderRadius: 0, width: 68, height: 40, padding: 0}}>
                  <input id="uploadBtnP12" name="file" type="file" accept=".p12" onChange={this.handleP12} style={{borderRadius:0, width: 30, height: 10, top: 0, right: 0, margin: 0, padding: 0, fontSize: '20px', cursor: 'pointer', opacity: 0, filter: 'alpha(opacity=0)'}}/>
                  <span style={{'WebkitUserSelect': 'none', borderRadius:0}}>Browse</span>
                </div>
              </div>
            </OverLayCustom>
          </FormGroup>
        </div>
        :<FormGroup controlId="CallbackUri" style={{width:'326px',marginBottom:'31px'}}>
        <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px'}}>Select JSON</ControlLabel>
        <OverLayCustom ref="json" trigger={this.state.showtooltipforJSON} placement="right" overlay={tooltipJSON}>
          <div>
            <div id="uploadFileDiv" style={{display:'inline-block', border:this.state.bordercolJSON, paddingTop:'7px', paddingLeft:'12px', paddingRight:'12px', width:258,height:40}}>
              {uploadFileNameJSON}&nbsp; {(this.state.uploadFileNameJSON === "") ?<i>Select JSON File</i>: <noscript/>}
            </div>
            <div className="fileUpload btn btnPrimary" style={{display:'inline-block', backgroundColor: 'rgb(76, 88, 164)', color: 'white', borderRadius: 0, width: 68, height: 40, padding: 0}}>
              <input id="uploadBtnJSON" name="file" type="file" accept=".json" onChange={this.handleJSON} style={{borderRadius:0, width: 30, height: 10, top: 0, right: 0, margin: 0, padding: 0, fontSize: '20px', cursor: 'pointer', opacity: 0, filter: 'alpha(opacity=0)'}}/>
              <span style={{'WebkitUserSelect': 'none', borderRadius:0}}>Browse</span>
            </div>
          </div>
        </OverLayCustom>
      </FormGroup>}
    </div>
  )
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///AZURE CREDENTIAL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } else if (this.state.selectedCloudType === "Azure"){
      cloudCredentials = (
        <div>
          <FormGroup controlId="formControlCloudOnpremises">
           <div className="form-group option_field radio" id="grping-server">
            <div className="row col-xs-12 pull-right">
              <Col lg={12}>
                <input type="radio" name="RM" id="RM" value="RM" checked={this.state.cloudOptionAzure === 'RM'?true:false} onChange={this.handleOptionChangeAzure}/>
                   <span >Discover RM type only</span>
              </Col>
              <Col lg={12}>
                <input type="radio" name="RMC" id="RMC" value="RMC" checked={this.state.cloudOptionAzure === "RMC"?true:false} onChange={this.handleOptionChangeAzure}/>
                   <span>Discover RM & Classic</span>
              </Col>
             </div>
           </div>
          </FormGroup>
          <br/><br/>
          <br/><br/>
        <FormGroup controlId="subscriptionID" validationState={this.state.subscriptionID_Validation}>
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Subscription ID</ControlLabel>
          <OverLayCustom ref="subscriptionID" trigger={this.state.showtooltipforSubscriptionID} placement="right" overlay={tooltipSubscriptionID}>
            <input id="subscriptionID"
              type={this.state.passSubscriptionID}
              defaultValue={this.state.SubscriptionID}
              placeholder="Enter Subscription ID"
              onChange={this.handleSubscriptionID}
              style={{fontFamily:this.state.fontfamilyforsecret,width:326,height:40,padding:'12px',border:this.state.bordercolSubID,borderRadius:0}}/>
          </OverLayCustom>
          <div style={{width:'326px',textAlign:'right'}}>
             <a style={{cursor: "pointer"}} onClick={this.funpasssubscriptionID}>{this.state.showhideforSubID}</a>
          </div>
        </FormGroup>
        <FormGroup controlId="applicationID" validationState={this.state.applicationID_Validation}>
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Application ID</ControlLabel>
          <OverLayCustom ref="applicationID" trigger={this.state.showtooltipforApplicationID} placement="right" overlay={tooltipApplicationID}>
            <input id="applicationID"
              type={this.state.passAppID}
              defaultValue={this.state.AppID}
              placeholder="Enter Application ID"
              onChange={this.handleApplicationID}
              style={{fontFamily:this.state.fontfamilyforsecret,width:326,height:40,padding:'12px',border:this.state.bordercolAppID,borderRadius:0}}/>
          </OverLayCustom>
          <div style={{width:'326px',textAlign:'right'}}>
             <a style={{cursor: "pointer"}} onClick={this.funpassapplicationID}>{this.state.showhideforAppID}</a>
          </div>
        </FormGroup>
        <FormGroup controlId="applicationKey" validationState={this.state.applicationKey_Validation}>
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Application Key</ControlLabel>
          <OverLayCustom ref="applicationKey" trigger={this.state.showtooltipforApplicationKey} placement="right" overlay={tooltipApplicationKey}>
            <input id="applicationKey"
              type={this.state.passAppKey}
              defaultValue={this.state.AppKey}
              placeholder="Enter Application Key"
              onChange={this.handleApplicationKey}
              style={{fontFamily:this.state.fontfamilyforsecret,width:326,height:40,padding:'12px',border:this.state.bordercolAppKey,borderRadius:0}}/>
          </OverLayCustom>
          <div style={{width:'326px',textAlign:'right'}}>
             <a style={{cursor: "pointer"}} onClick={this.funpassapplicationKey}>{this.state.showhideforAppKey}</a>
          </div>
        </FormGroup>
        <FormGroup controlId="tenantID" validationState={this.state.tenantID_validation}>
          <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Tenant ID</ControlLabel>
          <OverLayCustom ref="tenantID" trigger={this.state.showtooltipforTenantID} placement="right" overlay={tooltipTenantID}>
            <input id="tenantID"
              type={this.state.passTenantID}
              defaultValue={this.state.TenantID}
              placeholder="Enter Tenant ID"
              onChange={this.handleTenantID}
              style={{fontFamily:this.state.fontfamilyforsecret,width:326,height:40,padding:'12px',border:this.state.bordercolTenID,borderRadius:0}}/>
          </OverLayCustom>
          <div style={{width:'326px',textAlign:'right'}}>
             <a style={{cursor: "pointer"}} onClick={this.funpasstenantID}>{this.state.showhideforTenID}</a>
          </div>
        </FormGroup>
           {this.state.cloudOptionAzure === "RMC"?
             <div>
                <FormGroup controlId="email" >
                 <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>E-mail</ControlLabel>
                 <OverLayCustom ref="email" trigger={this.state.showtooltipforEmail} placement="right" overlay={tooltipEmail}>
                   <input id="email"
                     defaultValue={this.state.Email}
                     placeholder="Enter E-mail"
                     onChange={this.handleEmail}
                     style={{fontFamily:this.state.fontfamilyforsecret,width:326,height:40,padding:'12px',border:this.state.bordercolEmail,borderRadius:0}}/>
                 </OverLayCustom>
               </FormGroup>
               <FormGroup controlId="password" >
                 <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Password</ControlLabel>
                 <OverLayCustom ref="password" trigger={this.state.showtooltipforPassword} placement="right" overlay={tooltipPassword}>
                   <input id="password"
                     type={this.state.passPassword}
                     defaultValue={this.state.Password}
                     placeholder="Enter Password"
                     onChange={this.handlePassword}
                     style={{fontFamily:this.state.fontfamilyforsecret,width:326,height:40,padding:'12px',border:this.state.bordercolPassword,borderRadius:0}}/>
                 </OverLayCustom>
                 <div style={{width:'326px',textAlign:'right'}}>
                    <a style={{cursor: "pointer"}} onClick={this.funpasspassword}>{this.state.showhideforPassword}</a></div>
               </FormGroup>
             </div>

               :
               <span></span>
         }
        </div>

      )
///////////////////////////////////////////////s/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///AWS CREDENTIAL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } else if (this.state.selectedCloudType === "AWS"){
      console.log("not yet")
      let awsCredentials
      if (this.state.cloudOptionAWS === "awsSk"){
        awsCredentials = (
          <div>
            <FormGroup controlId="accesskey" validationState={this.state.AccessKey_validation}>
              <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Access Key ID</ControlLabel>
              <OverLayCustom  ref="toolaccess"  trigger={this.state.showtooltipforaccess} placement="right" overlay={tooltipAcesskey}>
                <input id="accesskey" type={this.state.passType} defaultValue={this.state.accessKeyAWS} placeholder=" Access key"
                  onChange={this.handleAccessKeyAWS} style={{fontFamily:this.state.fontfamilyforaccess,width:326,height:40,padding:'12px',border:this.state.bordercola,borderRadius:0}}/>
              </OverLayCustom>
              <div  style={{width:'326px',textAlign:'right'}}>
                <a style={{cursor: "pointer"}} onClick={this.funpassaccess}>{this.state.showhideforaccess}</a></div>
            </FormGroup>
            <FormGroup controlId="secretaccesskey" validationState={this.state.SecretKey_validation}>
              <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Secret Access Key</ControlLabel>
              <OverLayCustom ref="secretinfo" trigger={this.state.showtooltipforsecret} placement="right" overlay={tooltipSecretKey}>
                <input id="secretaccesskey" type={this.state.passSecret} defaultValue={this.state.secretAccessKeyAWS} placeholder=" Secret access key"
                  onChange={this.handleSecretAccessKeyAWS} style={{fontFamily:this.state.fontfamilyforsecret,width:326,height:40,padding:'12px',border:this.state.bordercols,borderRadius:0}}/>
              </OverLayCustom>
              <div style={{width:'326px',textAlign:'right'}}>
                 <a style={{cursor: "pointer"}} onClick={this.funpasssecret}>{this.state.showhideforsecret}</a></div>
            </FormGroup>
          </div>
        );
      } else if(this.state.cloudOptionAWS === "awsAssumeInstanceCred"){
        awsCredentials = (
          <div>
          </div>
        );
      } else if(this.state.cloudOptionAWS === "awsArn"){
        awsCredentials = (
          <div>
            <FormGroup controlId="ARNRole" style={{width:'326px'}}>
              <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px'}}>ARN Role</ControlLabel>
                <OverLayCustom ref="arn" trigger={this.state.showtooltipforARN} placement="right" overlay={tooltipARNRole}>
                  <FormControl type="text"
                      name="clientid"
                      onChange={this.handleARNRole}
                      placeholder="Enter ARN Role"
                      defaultValue={this.state.ARNRole}
                      style={{fontFamily:this.state.fontfamilyforsecret,width:326,height:40,padding:'12px',border:this.state.bordercolarn,borderRadius:0}}
                        />
                </OverLayCustom>
             </FormGroup>
             <FormGroup controlId="ExternalID" style={{width:'326px'}}>
               <ControlLabel style={{fontSize:'15px',fontWeight:'500',marginBottom:'11px'}}>External ID (Optional)</ControlLabel>
                 <OverLayCustom ref="eid" trigger={this.state.showtooltipforExternalID} placement="right" overlay={tooltipExternalID}>
                  <FormControl type="text"
                       name="clientid"
                       id="ExternalID"
                       onChange={this.handleExternalID}
                        placeholder="Enter External ID"
                        defaultValue={this.state.ExternalID}
                      style={{fontFamily:this.state.fontfamilyforsecret,width:326,height:40,padding:'12px',border:this.state.bordercoleid,borderRadius:0}}
                         />
                   </OverLayCustom>
              </FormGroup>
          </div>
        );
      }
      cloudCredentials = (
        <div>
          <FormGroup controlId="formControlCloudOnpremises">
           <div className="form-group option_field radio" id="grping-server">
            <div className="row col-xs-12 pull-right">
              <Col lg={12} style={{position:'relative'}}>
                <input type="radio" name="awsAssumeInstanceCred" id="awsAssumeInstanceCred" value="awsAssumeInstanceCred"  checked={this.state.cloudOptionAWS === 'awsAssumeInstanceCred'?true:false} onChange={this.handleOptionChangeAWS}/>
                  <div style={{display:'flex'}}>
                    <span >Use IAM Role&nbsp;</span>
                    {this.state.IAMRoleName!=""?
                    <span onMouseEnter={this.handleiamCredOver} onMouseLeave={this.handleiamCredOver} style={{whiteSpace:'nowrap', width:115, overflow:'hidden',textOverflow:'ellipsis'}}>
                      ({this.state.IAMRoleName})
                      </span>:<noscript />}
                  </div>
                {this.state.IAMRoleName.toString().length > 15 ?
                <div style={{position:'absolute', bottom:22, left:122, display: this.state.iamCredOver ? 'block' : 'none'}}>{this.state.IAMRoleName}</div> : <noscript />}
              </Col>
              <Col lg={12}>
                <input type="radio" name="awsArn" id="awsArn" value="awsArn" checked={this.state.cloudOptionAWS === "awsArn"?true:false} onChange={this.handleOptionChangeAWS}/>
                   <span>Use ARN</span>
              </Col>
              <Col lg={12}>
                <input type="radio" name="awsSk" id="awsSk" value="awsSk" checked={this.state.cloudOptionAWS === 'awsSk'?true:false} onChange={this.handleOptionChangeAWS}/>
                   <span>Use Access and Secret Key</span>
              </Col>
             </div>
           </div>
          </FormGroup>
          <br/><br/>
            <br/><br/>

          {awsCredentials}
        </div>
      )
    }

    const CloudButtonHover = (
    <Popover positionLeft={20} arrowOffsetLeft={20} style={overLayStyle} id='popoverCloud'>
      By adding CloudAccounts you will be able to discover
    </Popover>
    );

    let buttonUse;
    if(this.props.edit === true) {
      buttonUse = (
        <a href='JavaScript: void(0)' onClick={this.openCloudModal}>
          Edit
        </a>
      )
    } else {
      let addButton;
      let posstyle = {  position: 'relative', top:40, left: 55,
        float: 'right',
        margin: 'auto' }
      if (this.props.totalIntegrationsCount > 0) {
        buttonUse=(
          <Button onClick={this.openCloudModal}
          bsSize='large' style={posstyle} className={blueBtn} >Add Cloud Account</Button>
        )
      } else {
        buttonUse = (
            <Button href='JavaScript: void(0)' onClick={this.openCloudModal}
              bsStyle='primary' bsSize='large' className={btnPrimary}
              style={{borderRadius: 0, marginTop: 20, marginBottom: 20, width:'300px'}}>
                Add Cloud Account
            </Button>
        )
      }
      //
      //
      // buttonUse = (
      //   {(this.props.totalIntegrationsCount > 0)?
      //       <Button onClick={this.openCloudModal}
      //       bsSize='large' style={posstyle} className={blueBtn} >Add Cloud Account</Button>
      // :
      //   <OverLayCustom placement="right" overlay={CloudButtonHover}>
      //     <Button href='JavaScript: void(0)' onClick={this.openCloudModal}
      //       bsStyle='primary' bsSize='large' className={btnPrimary}
      //       style={{borderRadius: 0, marginTop: 20,marginBottom: 20,width:'300px'}}>
      //         Add Cloud Account
      //     </Button>
      //   </OverLayCustom>
      //   }
      // )


    }

    return (
      <span className={modalContainer}>

        {buttonUse}
            <Modal show={this.state.showCloud}
                   onHide={this.closeCloud}
                   dialogClassName={cloudModal}
                   backdrop='static'
                   keyboard={false}
                   style={{width:'900'}}
                   >
              <Modal.Header style={{float:'middle'}} className={addCloudModalHeader} >
                <a href="javascript:void(0)"
                   style={{position:'absolute', top:22, right:30}}
                   className={modalCloseStyle}
                   onClick={this.closeCloud}>
                  <img style={{width:12,height:16}} src={closeButtonImg} alt='close_btn'/>
                </a>
                <Modal.Title id="contained-modal-title"
                  style={{width:'100%',fontWeight:'bold',padding:0,marginTop:12,color:"#FFFFFF"}}>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{margin:'0px',padding:'0px', width:'100%',backgroundColor:'#F9FAFC'}}>
                <div>

                  <Row style={{paddingRight:"45px", paddingLeft:"45px"}}>
                    <Col lg={5}>
                      <h3 style={{fontSize:'15px'}}><strong>CLOUD TYPE</strong></h3>
                      <FormGroup>
                       <ControlLabel className="col-lg-12" style={{fontWeight:500,padding:'0'}}>Cloud Type </ControlLabel>
                       {/*<select
												 className={selectStyle}
												 id="cloudTypeid"
												 placeholder= "Select Cloud Type"
												 style={{width:326,height:40,border:this.state.bordercolc,borderRadius:0}}
												 disabled={this.props.edit===true?true:false}
												 defaultValue={this.state.selectedCloudType}
												 onChange={this.selectCloudTypeChange}>
                       {
                         this.state.CloudType.map((item) =>
                         {
                             return <option key={item.value} name={item.value} value={item.value}>{item.label}</option>

                         }
                         )}
                       </select>*/}
											 <Select placeholder={'Select Cloud Type'}
												 name=""
												 style={{width:326,height:40,border:this.state.bordercolc,borderRadius:0}}
												 disabled={this.props.edit===true?true:false}
												 inputProps={{id:'cloudTypeid'}}
												 value={this.state.selectedCloudType}
												 options={this.state.CloudType}
												 searchable={true}
												 multi={false}
												 clearable={false}
												 allowCreate={false}
												 onChange={this.selectCloudTypeChange}/>
                      </FormGroup>

                      <FormGroup  controlId="cloudLabel" validationState={this.state.AccountName_validation} >
                       <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Account Name</ControlLabel>
                       <OverLayCustom ref="toolname" trigger={this.state.showtooltipforname} placement="right" overlay={tooltipAccountName}>
                       <FormControl type="text"
                           name="GroupLabel"
                           value={this.state.accountName}
                           placeholder="Enter Account name"
                           style={{width:326,height:40,border:this.state.bordercolg,borderRadius:0}}
                           defaultValue={this.state.accountName}
                           disabled={this.props.edit===true?true:false}
                           onChange={this.handleAccountName}
                           />
                       </OverLayCustom>
                      </FormGroup>
                      <FormGroup controlId="formTemplateDesc">
                        <ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Description</ControlLabel>
                          <MaxInputCount
                            bordercolc={this.state.bordercolc}
                            defaultValue={this.state.desc}
                            handleChange={this.handleAccountDescription}
                          />
                       </FormGroup>
                      <br/>
                      <h3 style={{fontSize:'15px'}}><strong>CLOUD CREDENTIALS</strong></h3>
                    {cloudCredentials}
									</Col>
										<Col lg={7}>
                      <div className='addCloudIns'>
                        <Instructions
                          type={this.state.currentOption}
                        />
                        <div style={{color:"red", marginTop:"22", marginLeft:"20",marginBottom:15}}>{this.state.errorGeneral}</div>
                      </div><br/>
										</Col></Row>

                    {/*Adding Acount for Cloud Monitoring*/}
										<Row style={{paddingRight:"45px", paddingLeft:"45px"}}><Col lg={5}>
                      {this.state.selectedCloudType === 'AWS' ?
                      <div>
                      <FormGroup controlId="enableMonitor" style={{margin:'0 0 -35px -10px'}}>
                        <label htmlFor="enableMonitoring" style={{fontWeight:'500'}}>
                          <input type="checkbox" checked={this.state.enableMonitor} id="notifyByEmail"
                            name="notifyByEmail" onChange={this.handleEnableMonitor}/>
                          <label htmlFor="notifyByEmail" style={{fontWeight:'500', marginLeft:10, marginTop:8}}></label>
                          &nbsp;&nbsp;&nbsp; Enable Monitoring<br/>
                          <br/><br/>
                        </label>
                      </FormGroup>

                       <br/>
                      {this.state.enableMonitor?
                      <div>

                      <FormGroup controlId="enableMonitor">
                        <ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>S3 Bucket Name</ControlLabel><br/>
                        <OverLayCustom ref="S3bucketnametool" trigger={"hover"} placement="right" overlay={tooltipS3BucketRegion}>
													<div id="S3Bucketname" style={{zIndex:"3"}}>
														<select id="selectionfors3bucket" disabled={!this.state.validated} className={selectStyle} onChange={this.handleS3BucketName}  placeholder= "Select Severity" style={{width:326,height:40, backgroundColor:'#fff',border:this.state.bordercolc,borderRadius:0}}>
															<option value="" disabled selected>Select Bucket name</option>
															{
																this.state.S3BucketName.map((item) =>
																{
																	var selected = false;
																	if(this.state.S3SelectedBucketname === item){selected = true;}
																	return <option value={item} selected={selected}>{item}</option>
																})
															}
														</select>
													</div>
                        </OverLayCustom>
                      </FormGroup>
                      <FormGroup controlId="enableMonitor">
                        <ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Collection Window&nbsp;&nbsp;</ControlLabel>
                        <OverLayCustom ref="prefix" trigger={this.state.showtooltipfors3} placement="right" overlay={tooltipPrefix}>
                         {/* <FormControl id = 'prefix'
                           onChange={this.handlePrefix}
														disabled={!this.state.validated}
                            type="text"
                            name="S3Prefix"
                            placeholder="Enter Your Prefix"
                            style={{width:326,height:40,border:this.state.bordercolPrefix,borderRadius:0}}
                            defaultValue={this.state.S3Prefix}
                            />*/}

                             <Select id="prefix" className="dropdownFilter"
                             disabled={!this.state.validated}
                             placeholder={<i>Select a value</i>}
                              name="S3Prefix"
                              value={this.state.S3Prefix}
                              options={this.state.S3PrefixValueList}
                              searchable={true}
                              multi={false}
                              clearable={false}
                              allowCreate={false}
                             onChange={this.handlePrefix}/>
                           </OverLayCustom>
                            {
                             /*{this.state.showCollectionWindowModal ?
                          <div className='outsideWrapper' style={{height:window.innerHeight,width:window.innerWidth}}> </div> :""}
                             {this.state.showCollectionWindowModal ?

                                <div className='alertModal' >
                                  <div style={{display:'flex'}}>
                                    <div className='modalTitle'>
                                      Collection Window
                                    </div>
                                    <div className='modalCloseDay'><a  onClick={this.close}>&times;</a></div>
                                  </div>

                                  <div>
                                    <p style={{paddingLeft: 19,marginBottom:0}}>Are you sure you want to reduce the collection window?</p>
                                    <p style={{paddingLeft: 19,marginTop:0}}>You will loose some of your monitoring data.</p>
                                    </div>
                                  <div style={{paddingLeft:220}}>
                                    <Button className={footerBtn} style={{width:50}} onClick={this.close}>No </Button>
                                    <Button className={footerBtn} style={{width:50}} onClick={this.handleYes} >Yes </Button>
                                  </div>
                                </div>
                            :
                             ""}

                              <Modal
                                show={this.state.showCollectionWindowModal}
                                dialogClassName={modalDialogClass}
                                onHide={this.close}
                               // style={{display:this.state.showCollectionWindowModal?'block':'none'}}
                                // aria-labelledby="contained-modal-title"
                                backdrop='static'>
                                <form style={{border: '1px solid Navy'}}>
                                  <div style={{marginTop:'10px',paddingLeft:'15px'}}>
                                    <Modal.Header  style={{marginRight:15,borderBottom:0}}>
                                      <a  className={modalCloseBtnStyle} onClick={this.close} >
                                        x
                                      </a>
                                      <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>
                                        {'Collection Window'}
                                      </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body style={{padding:'0 15px 15px'}}>
                                        <p>Are you sure?</p>

                                    </Modal.Body>
                                     <Modal.Footer style={{marginRight:10,marginBottom:5,borderTop:0}}>
                                         <Button className={footerBtn} style={{width:100}} onClick={this.close}>No </Button>
                                          <Button className={footerBtn} style={{width:100}} onClick={this.handleYes} >Yes </Button>
                                      </Modal.Footer>
                                  </div>
                                </form>
                              </Modal>





                           */}



                      </FormGroup>
                      </div>
                      : <noscript/>}
                      </div>
                      : <noscript />}
                    </Col>
                    <Col lg={7}>
                      {this.state.enableMonitor && this.state.selectedCloudType === 'AWS'?
                      <div className='monitorIns'>
                        <h4>Instructions for Monitoring</h4>
                        <ol>
                          <li>Log in to AWS console and Turn on <a target="_blank" href="http://docs.aws.amazon.com/awscloudtrail/latest/userguide/turn-on-cloudtrail-in-additional-accounts.html">Cloud trail</a></li>
                          <li>Provide Trail name </li>
                          <li>Apply Trail to All  region -> Yes and Read/Write events-> All</li>
                          <li>At Storage Location select ‘Yes ’ for Create a new S3 bucket</li>
                          <li>Provide S3 bucket where you would like to your logs delivered.</li>
                          <li>Click Create</li>
                        </ol>
                         <h4>Collection Window</h4>
                         <p style={{padding:'0 22px'}}>Collection Window defines the time period for how long historical monitoring data is saved.
                        </p>
                         <p style={{padding:'0 0 0 22px'}}>
                         Switching to a shorter collection window causes some loss of monitoring data.
                        </p>
                      </div> : <noscript/>}
                    </Col>
                  </Row>
               </div>
              </Modal.Body>
              <Modal.Footer className={footerDivContainer}>
                <Button onClick={this.closeCloud}
                  style={{backgroundColor:'#4C58A4',margin:'20px 5px 0px 0px',color:'#FFFFFF',borderRadius:0,height:30,paddingTop:'5px'}}>
                    Cancel
                </Button>
                  {/*this.state.selectedCloudType === "AWS" && this.state.cloudOptionAWS === "awsAssumeInstanceCred" && this.state.instanceDisable?*/}
                {!this.state.validated?
                  <Button
                    style={{backgroundColor:'#4C58A4',margin:'20px 5px 0px 15px',color:'#FFFFFF',borderRadius:0,height:30,paddingTop:'5px'}}
                    onClick={this.checkTotalValidation}
                    disabled={this.state.validateButtonDisability}

                    >
                    Validate
                  </Button>:
                  <Button
                  style={{backgroundColor:'#4C58A4',margin:'20px 5px 0px 15px',color:'#FFFFFF',borderRadius:0,height:30,paddingTop:'5px'}}
                  onClick={this.props.edit?this.updateCloud:this.addNewCloud}
									disabled={saveDisability}
                  >
                  Save
                </Button>
              }
              </Modal.Footer>
            </Modal>
       </span>
        )
      },
    }
  )

export default AddCloud
