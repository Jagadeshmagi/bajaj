import React, { PropTypes } from 'react';
import {Col, Row, Grid, Button, Modal, ControlLabel, FormGroup, Popover, OverlayTrigger, FormControl, Glyphicon} from 'react-bootstrap';
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import Policy from './Policy'
import { Link } from 'react-router'
import {footerBtn, blueBtn,btnPrimary, selectStyle} from 'sharedStyles/styles.css'



export class Copy extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      copySuccess: '',
      showPolicy: "none",
      textAreaHeight:0,
      textOpacity:0,
      shown: "Show Policy"
    }
  }

  copyToClipboard = (e) => {
    this.textArea.select();
    document.execCommand('copy');
    e.target.focus();
    this.setState({ copySuccess: 'Copied!' });
    let that = this;
    setTimeout(function(){
       that.setState({ copySuccess: '' });
     }, 3000)
  };

  showPolicy = () => {
    this.setState({
      showPolicy: "inline",
      textOpacity:1,
      textAreaHeight:this.props.textAreaHeight,
      shown: "Hide Policy"
    })
  };

  hidePolicy = () => {
    this.setState({
      showPolicy: "none",
      textOpacity:0,
      textAreaHeight:0,
      shown: "Show Policy"
    })
  };

  render() {
    let policyLink = 'JavaScript: void(0)'
      policyLink = '#policytext'
    if(this.props.inline){
      return (
        <span>
          {
           document.queryCommandSupported('copy') &&
            <span>
              &nbsp;&nbsp;<Glyphicon onClick={this.copyToClipboard} style={{fontSize: '17px', color:'#4C58A4', cursor:"pointer"}} glyph="copy"/>&nbsp;&nbsp;
              {this.props.tabs?<a href={policyLink} target='_blank' title='Open in a new Window'>Show Policy</a>:<span style={{color:'#4C58A4', cursor:"pointer"}} onClick={this.state.shown === "Show Policy"?this.showPolicy:this.hidePolicy}>{this.state.shown}</span>} &nbsp;&nbsp;
                  <span style={{color:'#00C484'}}>{this.state.copySuccess}</span>
            </span>
          }
          <form style={{height:this.state.textAreaHeight, opacity:this.state.textOpacity}}>
            <textarea
              name="hide"
              style={{width:325, height:this.state.textAreaHeight, borderRadius:0, border:"thin solid #4C58A4"}}
              ref={(textarea) => this.textArea = textarea}
              value={this.props.requiredText}
            />
          </form>
        </span>
      );
    } else {
      return (
        <span>
          {
           document.queryCommandSupported('copy') &&
            <span>
              &nbsp;&nbsp;
              <Button
                onClick={this.copyToClipboard}
                bsStyle='primary' bsSize='large' className={btnPrimary}
                style={{borderRadius: 0, marginTop: 20, marginBottom: 20, width:'200px'}}>
                Copy to Clipboard
              </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{color:'#00C484'}}>{this.state.copySuccess}</span>
            </span>
          }
          <form style={{height:this.state.textAreaHeight, opacity:this.state.textOpacity}}>
            <textarea
              name="hide"
              style={{width:325, height:this.state.textAreaHeight, paddingBottom:this.state.textMargin, borderRadius:0, border:"thin solid #4C58A4"}}
              ref={(textarea) => this.textArea = textarea}
              value={this.props.requiredText}
            />
          </form>
        </span>
      );
    }
  }

}


export const Instructions = React.createClass({
  render(){
    let instruction;
    console.log("typetypetypetype", Policy)
    if(this.props.type === "JSON" || this.props.type === "Google"){
      // 1.	Type a name for the Google cloud account that the Platform uses locally. (It does not need to match the account name that you enter in GCP.)
      // 2.	Type a description, as needed.
      // 3.	In the Cloud Credentials area, select JSON.
      // 4.	Log into the organization’s Google Cloud Console. https://cloud.google.com
      // 5.	Select the name of a project at the top of the screen; click Open.
      // 6.	In the upper-left corner, click the list icon (for Products and Services) to open a navigation pane.
      // 7.	Click APIs and services and select Dashboard (default). (You can bypass the dashboard by selecting Libraries.)
      // 8.	Click Enable APIs and Services. You will use a search box to locate and enable two APIs (they might already be enabled).
      // 9.	In the Enable APIs and Service search box, type Google Compute Engine API to start searching for it. After finding it, click on the API.
      // 10.	Click Enable if this button is visible (otherwise, the API is already enabled).
      // 11.	In the same search box, type Google Cloud Resource Manager API. After finding it, click on this API. Click Enable if this button is visible (otherwise, it is already enabled).
      // 12.	Again, in APIs and Services, locate and click Credentials (in the menu at left).
      // 13.	Click Create Credentials, and then select Service account key.
      // 14.	In the Service account dropdown, choose New service account (near bottom of the list).
      // 15.	Type a name for the service account (for example, “Cavirin”).
      // 16.	Access the Role dropdown and select the Viewer role.
      // 17.	For Key type, select JSON.
      // 18.	Click Create. GCP creates and downloads the key in JSON format to your local system.
      // 19.	(This and the remaining steps are in the Cavirin system.) In the Select JSON box, Browse to and select the JSON file (downloaded with preceding step); click Open.
      // 20.	At the bottom of the screen for a new cloud account, click Validate (or Save if present). After validation succeeds, the button changes to Save.
      // 21.	Click Save.
      instruction=(
        <ol>
          <li>Type a name for the Google cloud account that the Platform uses locally. (It does not need to match the account name that you enter in GCP.)</li>
          <li>Type a description, as needed.</li>
          <li>In the <i>Cloud Credentials</i> area, select <b>JSON</b>.</li>
          <li>Log into the organization’s <a target="_blank" href="https://cloud.google.com/">Google Cloud Console.</a></li>
          <li>Select the name of a project at the top of the screen; click <b>Open</b>.</li>
          <li>In the upper-left corner, click the list icon (for <i>Products and Services</i>) to open a navigation pane.</li>
          <li>Click <b>APIs and services</b> and select Dashboard (default). (You can bypass the dashboard by selecting <b>Libraries</b>.)</li>
          <li>Click <b>Enable APIs and Services</b>. You will use a search box to locate and enable two APIs (they might already be enabled).</li>
          <li>In the <i>Enable APIs and Service</i> search box, type <b>Google Compute Engine API</b> to start searching for it. After finding it, click on the API.</li>
          <li>Click <b>Enable</b> if this button is visible (otherwise, the API is already enabled).</li>
          <li>In the same search box, type <b>Google Cloud Resource Manager API</b>. After finding it, click on this API. Click <b>Enable</b> if this button is visible (otherwise, it is already enabled).</li>
          <li>Again, in <b>APIs and Services</b>, locate and click <b>Credentials</b> (in the menu at left).</li>
          <li>Click <b>Create Credentials</b>, and then select <b>Service account key</b>.</li>
          <li>In the <i>Service account</i> dropdown, choose <b>New service account</b> (near bottom of the list).</li>
          <li>Type a name for the service account (for example, “Cavirin”).</li>
          <li>Access the <i>Role</i> dropdown and select the <b>Viewer</b> role.</li>
          <li>For <i>Key type</i>, select <b>JSON</b>.</li>
          <li>Click <b>Create</b>. GCP creates and downloads the key in JSON format to your local system.</li>
          <li>(This and the remaining steps are in the Cavirin system.) In the <i>Select JSON</i> box, <b>Browse</b> to and select the JSON file (downloaded with preceding step); click <b>Open</b>.</li>
          <li>At the bottom of the screen for a new cloud account, click <b>Validate</b> (or <b>Save</b> if present). After validation succeeds, the button changes to <i>Save</i>.</li>
          <li>Click <b>Save</b>.</li>
        </ol>
      )
    }if(this.props.type === "P12" || this.props.type === "Google"){
      // 1.	Type a name for the Google cloud account that the Platform uses locally. (It does not need to match the account name that you enter in GCP.)
      // 2.	Type a description, as needed.
      // 3.	In the Cloud Credentials area, select P12.
      // 4.	Log into the organization’s Google Cloud Console. https://cloud.google.com
      // 5.	Select the name of a project at the top of the screen; click Open.
      // 6.	In the upper-left corner, click the list icon (for Products and Services) to open a navigation pane.
      // 7.	Click APIs and services and select Dashboard (default). (You can bypass the dashboard by selecting Libraries.)
      // 8.	Click Enable APIs and Services. You will use a search box to locate and enable two APIs (they might already be enabled).
      // 9.	In the Enable APIs and Service search box, type Google Compute Engine API to start searching for it. After finding it, click on the API.
      // 10.	Click Enable if this button is visible (otherwise, the API is already enabled).
      // 11.	In the same search box, type Google Cloud Resource Manager API. After finding it, click on this API. Click Enable if this button is visible (otherwise, it is already enabled).
      // 12.	Again, in APIs and Services, locate and click Credentials (in the menu at left).
      // 13.	Click Create Credentials, and then select Service account key.
      // 14.	In the Service account dropdown, choose New service account (near bottom of the list).
      // 15.	For the Service account name, type a name (for example, “Cavirin”).
      // 16.	Access the Role dropdown and select the Viewer.
      // 17.	For Key type, select P12.
      // 18.	Click Create. GCP creates and downloads the key in P12 format it to your local system.
      // 19.	Still in Google’s Service Account key section, click the Manage service account. (This link is at far right in Credentials window.)
      // 20.	Locate the new service account you named in Step 15. Its ID resembles the following:
      // 298651aqa932151-compute@developer.gserviceaccount.com; copy this Service account ID.
      // 21.	(This and the remaining steps are on the Cavirin system.) Paste the Service account ID copied from CGP in the preceding step into the Service Account.
      // 22.	At the Service Account Key box, Browse to and select the downloaded P12 key; click Open.
      // 23.	At the bottom of the screen for a new cloud account, click Validate (or Save if present). After validation succeeds, the button changes to Save.
      // 24.	Click Save.
        instruction=(
          <ol>
            <li>Type a name for the Google cloud account that the Platform uses locally. (It does not need to match the account name that you enter in GCP.)</li>
            <li>Type a description, as needed.</li>
            <li>In the <i>Cloud Credentials</i> area, select <b>P12</b>.</li>
            <li>Log into the organization’s <a target="_blank" href="https://cloud.google.com/">Google Cloud Console.</a></li>
            <li>Select the name of a project at the top of the screen; click <b>Open</b>.</li>
            <li>In the upper-left corner, click the list icon (for <i>Products and Services</i>) to open a navigation pane.</li>
            <li>Click <b>APIs and services</b> and select Dashboard (default). (You can bypass the dashboard by selecting <b>Libraries</b>.)</li>
            <li>Click <b>Enable APIs and Services</b>. You will use a search box to locate and enable two APIs (they might already be enabled).</li>
            <li>In the <i>Enable APIs and Service</i> search box, type <b>Google Compute Engine API</b> to start searching for it. After finding it, click on the API.</li>
            <li>Click <b>Enable</b> if this button is visible (otherwise, the API is already enabled).</li>
            <li>In the same search box, type <b>Google Cloud Resource Manager API</b>. After finding it, click on this API. Click <b>Enable</b> if this button is visible (otherwise, it is already enabled).</li>
            <li>Again, in <b>APIs and Services</b>, locate and click <b>Credentials</b> (in the menu at left).</li>
            <li>Click <b>Create Credentials</b>, and then select <b>Service account key</b>.</li>
            <li>In the <i>Service account</i> dropdown, choose <b>New service account</b> (near bottom of the list).</li>
            <li>For the Service account name, type a name (for example, “Cavirin”).</li>
            <li>Access the <i>Role</i> dropdown and select the <b>Viewer</b>.</li>
            <li>For <i>Key type</i>, select <b>P12</b>.</li>
            <li>Click <b>Create</b>. GCP creates and downloads the key in P12 format it to your local system.</li>
            <li>Still in Google’s <i>Service Account key</i> section, click the <b>Manage service account</b>. (This link is at far right in <i>Credentials</i> window.)</li>
            <li>Locate the new service account you named in <b>Step 15</b>. Its ID resembles the following:</li>
            <ul>
              <div style={{marginLeft:"-52px"}}>298651aqa932151-compute@developer.gserviceaccount.com; <b>copy</b> this <i>Service account ID</i>.</div>
            </ul>
            <li>(This and the remaining steps are on the Cavirin system.) <b>Paste</b> the <i>Service account ID</i> copied from CGP in the preceding step into the <i>Service Account</i>.</li>
            <li>At the <i>Service Account Key</i> box, <b>Browse</b> to and select the downloaded P12 key; click <b>Open</b>.</li>
            <li>At the bottom of the screen for a new cloud account, click <b>Validate</b> (or <b>Save</b> if present). After validation succeeds, the button changes to Save.</li>
            <li>Click <b>Save</b>.</li>
          </ol>
        )
      } else if (this.props.type === "awsAssumeInstanceCred"){
        // 1.	Log into the link: AWS Console.
        // 2.	Click Services, then select IAM.
        // 3.	Select Policies, then click Create Policy.
        // 4.	Select Create Your Own Policy. (This policy will come from Cavirin’s Platform.)
        // 5.	Create a name for the policy that AWS is about to get from the Platform (for example, cavirin_arn).
        // 6.	Here in the Platform’s screen for adding cloud accounts, copy the policy in one of two ways: Click the icon or click link: *Show Policy*, select-all, then copy.
        // 7.	In the AWS window for creating policies, paste the policy into the Policy Document area, then click Create Policy.
        // 8.	In the left pane (still AWS), select Roles, then click Create new role.
        // 9.	From Role Type, select Amazon EC2 (allow EC2 instances to call AWS services on your behalf).
        // 10.	Search for the policy created in Steps 4 - 7. Select the policy, then click Next Step.
        // 11.	Set Role Name with your choice (‘pulsar_trusted_role), then click Create Role.
        // 12.	Click Services, then select the EC2.
        // 13.	Locate and select the EC2 instance where the Cavirin Platform resides.
        // 14.	Click Actions -> Instance Settings, then select Attach/Replace the IAM Role.
        // 15.	Select the Role you created in Step 10 in the dropdown.
        // 16.	Click Validate at the bottom of the screen. After validation, the button changes to Save.
        // 17.	Click Save now unless you plan to enable Monitoring, below. (After completing the steps for Monitoring, then you click Save.)
      instruction=(
        <ol>
          <li>Log into the <a target="_blank" href="https://aws.amazon.com/">AWS console</a></li>
          <li>Click <b>Services</b>, and then select <b>IAM</b>.</li>
          <li>Select <b>Policies</b>, and then click <b>Create Policy</b>.</li>
          <li>Select <b>Create Your Own Policy</b>. (This policy will come from Cavirin’s Platform.)</li>
          <li>Create a name for the policy that AWS is about to get from the Platform (for example, <b>cavirin_assume_role</b>).</li>
            <li> Here in the Platform’s screen for adding cloud accounts, copy the policy in one of two ways: Click the icon or click link: <b>Show Policy</b>, select-all, then copy.
              <Copy
                style={{display:"inline"}}
                textAreaHeight={200}
                showText={"Show Policy"}
                requiredText={Policy.policy}
                tabs={false}
                inline={true}
              />
            </li>
            <li>In the AWS window for creating policies, paste the policy into the Policy Document area, then click Create Policy.</li>
            <li>In the left pane (still AWS), select <b>Roles</b>, then click <b>Create new role</b>.</li>
            <li>From Role Type, select Amazon EC2 (allow EC2 instances to call AWS services on your behalf).</li>
            <li>Search for the policy created in Steps 4 - 7. Select the policy, then click Next Step.</li>
            <li>Set Role Name with your choice (‘pulsar_trusted_role), then click <b>Create Role</b>.</li>
            <li>Click <b>Services</b>, then select the <b>EC2</b>.</li>
            <li>Locate and select the EC2 instance where the Cavirin Platform resides.</li>
            <li>Click <b>Actions</b> -> <b>Instance Settings</b>, then select <b>Attach/Replace the IAM Role</b>.</li>
            <li>Select the Role you created in Step 10 in the dropdown.</li>
            <li>Click <b>Validate</b> at the bottom of the screen. After validation, the button changes to Save.</li>
            <li>Click <b>Save</b> now unless you plan to enable Monitoring, below. (After completing the steps for Monitoring, then you click <b>Save</b>.)</li>
        </ol>
      )
    } else if (this.props.type === "awsArn"){
      // 1.	Log into the AWS account that you intend to evaluate link: AWS Console.
      // 2.	Click Services, and then select IAM.
      // 3.	Select Policies, and then click Create Policy.
      // 4.	Select Create Your Own Policy. (This policy will come from Cavirin’s Platform.)
      // 5.	Create a name for the policy that AWS is about to get from the Platform (for example, cavirin_assume_role).
      // 6.	Copy the Platform policy, thus: Click Show Policy, select-all, then copy.
      // 7.	In the AWS console policy creation window, paste the policy into the _Policy Document _area, then click Create Policy.
      // 8.	In the left pane (in AWS), select Roles and then click Create new role.
      // 9.	In Role Type, select Role for cross-account Access. Select Provide access between your AWS account and a 3rd party AWS account.
        // o	For account ID, provide the AWS account ID for the account where your Pulsar instance is running.
        // o	The range for external ID is 2 - 96 characters. Later, you insert this ID to finish setup.
        // o	Clear the Require MFA box.
      // 10.	Click Next Step.
      // 11.	Search for and then select the policy created in Steps 4 - 7, then click Next Step.
      // 12.	Specify a Role Name of your choice (e.g., ‘Pulsar-Trusted’), then click Create Role.
      // 13.	On the search box, look for the role name specified in the preceding step and click it.
      // 14.	Copy the Role ARN. Paste it in the ARN Role field in the Cavirin Platform.
      // 15.	Provide the external ID from Step 9.
      // 16.	Click Validate at the bottom of the screen. After validation, the button changes to Save.
      // 17.	Click Save now unless you plan to enable Monitoring, below. (After completing the steps for Monitoring, then you click Save.)
      instruction=(
        <ol>
          <li>Log into the <a target="_blank" href="https://aws.amazon.com/">AWS account</a> that you intend to evaluate.</li>
          <li>Click <b>Services</b>, and then select <b>IAM</b>.</li>
          <li>Select <b>Policies</b>, and then click <b>Create Policy</b>.</li>
          <li>Select <b>Create Your Own Policy</b>. (This policy will come from Cavirin’s Platform.)</li>
          <li>Create a name for the policy that AWS is about to get from the Platform (for example, <b>cavirin_arn</b>).</li>
            <li> Here in the Platform’s screen for adding cloud accounts, copy the policy in one of two ways: Click the icon or click link: <b>Show Policy</b>, select-all, then copy.
              <Copy
                style={{display:"inline"}}
                textAreaHeight={200}
                showText={"Show Policy"}
                requiredText={Policy.policy}
                tabs={false}
                inline={true}
              />
            </li>
            <li>In the AWS window for creating policies, paste the policy into the <i>Policy Document</i> area, then click <b>Create Policy</b>.</li>
            <li>In the left pane (in AWS), select <b>Roles</b> and then click <b>Create new role</b>.</li>
            <li>In Role Type, select <b>Role for cross-account Access</b>. Select <b>Provide access between your AWS account and a 3rd party AWS account</b>.</li>
              <div><ul>
                <li>For <i>account ID</i>, provide the AWS <i>account ID</i> for the account where your Pulsar instance is running.</li>
                <li>The range for external ID is 2 - 96 characters. Later, you insert this ID to finish setup.</li>
                <li>Clear the <i>Require MFA</i> box.</li>
              </ul></div>
            <li>Click <b>Next Step</b>.</li>
            <li>Search for and then select the policy created in Steps 4 - 7, then click Next Step.</li>
            <li>Specify a Role Name of your choice (e.g., ‘Pulsar-Trusted’), then click Create Role.</li>
            <li>On the search box, look for the <i>role name</i> specified in the preceding step and click it.</li>
            <li>Copy the Role ARN. Paste it in the ARN Role field in the Cavirin Platform.</li>
            <li>Provide the <i>external ID</i> from Step 9.</li>
            <li>Click <b>Validate</b> at the bottom of the screen. After validation, the button changes to Save.</li>
            <li>Click <b>Save</b> now unless you plan to enable Monitoring, below. (After completing the steps for Monitoring, then you click <b>Save</b>.)</li>
        </ol>
      )
    } else if (this.props.type === "RM" || this.props.type === "RMC"){
      // NOTE: To complete the steps in Azure, the user must have the Azure role of owner.
      //
      // 1.	Type a name for the Azure cloud account that the Platform uses locally. (It does not need to match the account name that you enter in Azure.)
      // 2.	Type a description, as needed.
      // 3.	In the Cloud Credentials area, select Discover RM type only or Discover RM & Classic. Discover RM & Classic takes an email address (typically an admin’s) and password.
      // 4.	Log into the Azure Management Portal.
      // 5.	Go to Azure Active Directory. Click Properties.
      // 6.	Copy the directory ID value.
      // 7.	In Cavirin, paste the directory ID value into the Tenant ID box.
      //
      // NOTE: For the first-time use of the following step, you locate App registration by clicking More Services at the bottom of the navigation pane. Thereafter, App registration appears as a favorite, outside More Services.
      //
      // 8.	In the Azure Active Directory navigation blade, click App registrations, then click +New application registration.
      // 9.	Type a name for the Cavirin application in the Name box. Remember this name for Step 25.
      // 10.	In the Application Type dropdown, select Web app/API.
      // 11.	For a sign-on URL, type any valid URL. (Cavirin ignores this URL, but Azure requires a URL.) The Create button now appears at the bottom of the screen.
      // 12.	Click Create. Azure begins generating the application ID (but does not display it in this blade).
      // 13.	In the App registrations list, find the generated application ID, click on it, and copy it.
      // 14.	In Cavirin, paste the application ID in the Application ID box.
      // 15.	In Azure (where the same window is open), select the Settings blade at right and then select Keys near the top of the blade.
      // 16.	Specify a key description and a duration (expiration) for the key.
      // 17.	Click Save at the top of the blade. Azure now generates the key and displays it.
      // 18.	Record the value of the key and safely store it.
      //
      // WARNING: Record the key value (before next step) because you can’t retrieve it later.
      //
      // 19.	Copy the key and paste it the Cavirin Application Key box.
      //
      // NOTE: For the first-time use of the following step, locate Subscriptions by clicking More Services at the bottom of the navigation pane. Thereafter, Subscriptions appears as a favorite, outside More Services.
      //
      // 20.	In Azure, in the nav blade at left, click Subscriptions; copy the subscription ID.
      // 21.	Paste this subscription ID into the Subscription ID box in Cavirin.
      // 22.	In Azure, again locate the subscription; click on it to open a configuration blade at right.
      // 23.	Select Access control (IAM) in the menu. The Add button appears (if you have an owner role).
      // 24.	Click Add. The blade for role configuration opens at right. In the Role dropdown at upper-right, select Reader.
      // 25.	In the Select box, start typing the name of the Cavirin application (specified in Step 9). When auto-complete displays the app name, click it.
      // 26.	Click Save. This completes the tasks in Azure.
      // 27.	Click the Validate button at bottom in the Cavirin screen. After successful validation, the button changes to Save.
      // 28.	Click Save. This completes the addition of the Azure cloud account.

      instruction=(
        <ol>
          <ul>
            <div style={{marginLeft:"-52px"}}><b>NOTE</b>: To complete the steps in Azure, the user must have the Azure role of <i>owner</i>.</div>
          </ul>
          <li>Type a name for the Azure cloud account that the Platform uses locally. (It does not need to match the account name that you enter in Azure.)</li>
          <li>Type a description, as needed.</li>
          <li>In the Cloud Credentials area, select <b>Discover RM type only</b> or <b>Discover RM & Classic</b>. <b>Discover RM & Classic</b> takes an email address (typically an admin’s) and password.</li>
          <li>Login to the <a target="_blank" href="https://portal.azure.com/"> Azure Management Portal</a></li>
          <li>Go to Azure Active Directory. Click <b>Properties</b>.</li>
          <li>Copy the <i>directory ID</i> value.</li>
          <li>In Cavirin, paste the <i>directory ID</i> value into the <b>Tenant ID</b> box.</li>
          <ul>
            <div style={{marginLeft:"-52px"}}><b>NOTE</b>: For the first-time use of the following step, you locate <i>App registration</i> by clicking <b>More Services</b> at the bottom of the navigation pane. Thereafter, <i>App registration</i> appears as a favorite, outside <i>More Services</i>.</div>
          </ul>
          <li>In the Azure Active Directory navigation blade, click <b>App registrations</b>, then click <b>+New application registration</b>.</li>
          <li>Type a name for the Cavirin application in the Name box. Remember this name for Step 25.</li>
          <li>In the <i>Application Type</i> dropdown, select <b>Web app/API</b>.</li>
          <li>For a sign-on URL, type <i>any</i> valid URL. (Cavirin ignores this URL, but Azure requires a URL.) The <i>Create</i> button now appears at the bottom of the screen.</li>
          <li>Click <b>Create</b>. Azure begins generating the <i>application ID</i> (but does not display it in this blade).</li>
          <li>In the <i>App registrations</i> list, find the generated application ID, click on it, and <b>copy</b> it.</li>
          <li>In Cavirin, paste the <i>application ID</i> in the Application ID box.</li>
          <li>In Azure (where the same window is open), select the <b>Settings</b> blade at right and then select <b>Keys</b> near the top of the blade.</li>
          <li>Specify a key description and a duration (expiration) for the key.</li>
          <li>Click <b>Save</b> at the top of the blade. Azure now generates the key and displays it.</li>
          <li>Record the value of the key and safely store it.</li>
          <ul>
            <div style={{marginLeft:"-52px"}}><b>WARNING</b>: Record the key value (before next step) because you can’t retrieve it later.</div>
          </ul>
          <li><b>Copy</b> the key and paste it the Cavirin <i>Application</i> Key box.</li>
          <ul>
            <div style={{marginLeft:"-52px"}}><b>NOTE</b>: For the first-time use of the following step, locate <i>Subscriptions</i> by clicking <b>More Services</b> at the bottom of the navigation pane. Thereafter, <i>Subscriptions</i> appears as a favorite, outside <i>More Services</i>.</div>
          </ul>
          <li>In Azure, in the nav blade at left, click <b>Subscriptions</b>; <b>copy</b> the <i>subscription ID</i>.</li>
          <li>Paste this <i>subscription ID</i> into the <i>Subscription ID</i> box in Cavirin.</li>
          <li>In Azure, again locate the subscription; click on it to open a configuration blade at right.</li>
          <li>Select <b>Access control (IAM)</b> in the menu. The <i>Add</i> button appears (if you have an <i>owner</i> role).</li>
          <li>Click <b>Add</b>. The blade for role configuration opens at right. In the <i>Role</i> dropdown at upper-right, select <b>Reader</b>.</li>
          <li>In the <i>Select</i> box, start typing the name of the Cavirin application (specified in Step 9). When auto-complete displays the app name, click it.</li>
          <li>Click <b>Save</b>. This completes the tasks in Azure.</li>
          <li>Click the <b>Validate</b> button at bottom in the Cavirin screen. After successful validation, the button changes to <i>Save</i>.</li>
          <li>Click <b>Save</b>. This completes the addition of the Azure cloud account.</li>
        </ol>
      )
    }

    return(
      <Col>
        {instruction}
      </Col>
    )
  }
})
