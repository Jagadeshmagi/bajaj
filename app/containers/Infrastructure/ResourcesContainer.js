import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect } from 'react-redux'
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row, Nav, NavItem, MenuItem, NavDropdown} from 'react-bootstrap'
import {spacer} from 'sharedStyles/styles.css'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange, diamond, triangleup} from './styles.css'
import {Table,Column, Cell} from 'fixed-data-table'
import {Header } from 'components/Header/Header'
import {AccessCell,ArrayLinkCell,ScoreCell, ScoreCell2, ComplianceCell,
        GroupCell,TextCell,LinkCell,CheckboxCell, TooltipCell,
        TooltipDataCell,TestStatusCell, CollapsedRowsCell} from 'components/Table/Table'
import {IpAddressCell} from './ResourceIPAddressCell'
import {ResourceColumnChooserClass} from './ResourceColumnChooserCell'
import {getResourcesList,getResourcesCounts, getResourcesTags, getDeviceDetailsById, getDeviceDetailsComplianceHistoryById,getDiscoverList} from 'helpers/resources'
import {ActionLinks,ColumnChooserPopover} from 'components/Infrastructure/Resources'
import Dimensions from 'react-dimensions'
import TestTable from "./TestTable"
import AutoSearch from './autoSearch';
import AttributeConstants from 'constants/AttributeConstants'
import refreshIcon1 from 'assets/refreshIcon1.png'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {SpinnyLogo} from 'containers'
import moment from 'moment'
import {getAllDockerImage} from 'helpers/docker'


// Object.prototype.map = function(o, f, ctx) {
//     ctx = ctx || this;
//     var result = {};
//     Object.keys(o).forEach(function(k) {
//         result[k] = f.call(ctx, o[k], k, o);
//     });
//     return result;
// }


var SortTypes = {
  ASC: 'asc',
  DESC: 'desc',
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props);

    this._onSortChanges = this._onSortChanges.bind(this);
  }

  render() {
    var {sortDir, children, ...props} = this.props;
    return (
      <Cell {...props}>
        <a style={{cursor: "pointer"}} onClick={this._onSortChanges}>
          {children}
        </a> {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
      </Cell>
    );
  }

  _onSortChanges(e) {
    console.log("this is clicked - SORT PLEASE!!", e.target)
    e.preventDefault();

    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.DESC
      );
    }
  }
}

const NavDropdownExample = React.createClass({
  handleSelect(eventKey) {
    event.preventDefault();
    alert(`selected ${eventKey}`);
  },

  render() {
    return (
      <Nav bsStyle="tabs" activeKey="1" onSelect={this.handleSelect}>
        <NavItem eventKey="1" >NavItem 1 content</NavItem>
        <NavItem eventKey="2" title="Item">NavItem 2 content</NavItem>
        <NavItem eventKey="3">NavItem 3 content</NavItem>
      </Nav>
    );
  }
});

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

Array.prototype.delete = function (index) {
  this.splice(index, 1);
};

function findElement(arr, propName, propValue) {
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return arr[i];
}

const ResourcesContainers = React.createClass({
  getInitialState(){
    return {
      list:[],
      dockerListLength:0,
      selected: [],
      colSortDirs:{},
      filter:{sortby: "ipaddress", orderby: "desc"},
      // filter:{},
      columnChooserShow:false,
      accessiblityCount:'',
      inaccessibleCount:'',
      heightGear:null,
      columnsList:[
        {name:'ipaddress', displayText:'IP Address', show:true, columnName: "IP ADDRESS", width:160},
        {name:'hostName', displayText:'Name', show:true, columnName: "NAME", width:185},
        {name:'osName', displayText:'OS', show:true, columnName: "OS", width:80},
        {name:'complianceStatus', displayText:'Risk Score', show:true,  columnName: "COMPLIANCE", width:150,},
        {name:'test_status', displayText:'Assessment Status', show:true,  columnName: "ASSESSMENT STATUS", width:170},
        {name:'accessible', displayText:'Access', show:true, columnName: "ACCESS", width:110},
        {name:'groupNames', displayText:'Group Name', show:true, columnName: "GROUP NAME", width:160},
        {name:'assettype', displayText:'Environment', show:true, columnName: "ENVIRONMENT", width:155},
        {name:'endtime', displayText:'Last time scanned',show:false,  columnName: "LAST SCAN", width:120},
        {name:'vpcId', displayText:'VPC ID', show:false, columnName: "VPC ID", width:120},
        {name:'availabilityzone', displayText:'Availability zone', show:false,  columnName: "AVAILABILITY ZONE", width:170},
        {name:'dockerenabled', displayText:'Docker Enabled', show:false, columnName: "DOCKER ENABLED", width:225},
        // {name:'tags', displayText:'TAGs', show:false,  columnName: "TAGS", width:"200"}
      ],
      dataLoad:false,
      all:false,
      collapsedRows: new Set(),
      deviceConfiguration:{
        instanceID:"1jk1l4kj23l4k234234",
        instanceType: "fSDfdklgadf",
        instanceState: "Running",
        privateIP: "120.369.940.302",
        publicIP: "204.502.403.204",
        osType: "Windows",
        osVersion: "poleitimd"
      },
      cloudDetails:{
        cloudType: "AWS",
        region: "USA-East",
        vpcID: "234jkwd2i3lkj2432",
        securityGroup: "qedflkj3iourkdf92034",
        subnetID: "subnet-edflajksdfjierj"
      },
      ppComplianceStatus: [
        ["My AWS Test", "09/17/2019 @ 15:53:37", "Score 3"],
        ["My AWS Test", "09/17/2019 @ 15:53:37", "Score 3"],
        ["My AWS Test", "09/17/2019 @ 15:53:37", "Score 3"],
        ["My AWS Test", "09/17/2019 @ 15:53:37", "Score 3"],
        ["My AWS Test", "09/17/2019 @ 15:53:37", "Score 3"],
        ["My AWS Test", "09/17/2019 @ 15:53:37", "Score 3"]
      ],
      test: {
        // "instanceId": "null",
        // "instanceType": "null",
        // "instanceState": "null",
        // "privateIp": "null",
        // "publicIp": "null",
        // "OSType": "Linux",
        // "OSVersion": "null",
        // "cloudType": "ONPREM",
        "regions": [
            // "US-East-01",
            // "US-East-02"
        ],
        // "vpcId": "null",
        "securityGroup": [
        ],
        // "subnetId": "null",
        // "hostname": "Cavirin-Bangalore-Linux-100000000",
        // "macaddress": "mac1",
        "credentials": [
        ]
      },
      test2:[
        // {
        //   "resourceid": 849,
        //   "test_date": "2017-01-28T18:30:00.000Z",
        //   "policypack_name": "NIST",
        //   "score": 54
        // },
        // {
        //   "resourceid": 849,
        //   "test_date": "2017-01-28T18:30:00.000Z",
        //   "policypack_name": "NIST",
        //   "score": 48
        // },
      ],
      deviceDetails:{},
      tagsList:{},
      complianceHistory:{},

      tagSet: {"AZURE":{},"PULSAR":{},"AWS":{},"GOOGLE":{}},
      ddTagSet: {"AZURE":{"owner":"qwerqwerAZURE", "test":"rtyurtyuAZURE"},"PULSAR":{"owner":"qwerqwerPULSAR", "test":"rtyurtyuPULSAR"},"AWS":{"owner":"qwerqwerAWS", "test":"rtyurtyuAWS"},"GOOGLE":{"owner":"qwerqwerGOOGLE", "test":"rtyurtyuGOOGLE"}}

    }
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  refreshList(){
    this.setState({list:[],selected:[]},function(){
    // getResourcesList(this.state.list.length+50, 50, this.state.filter)
    getResourcesList(50, 50, this.state.filter)
    .then((resources) => {
      if(resources){
        this.setState({
          list:resources
        })
      }
    })
    .catch((error) => console.log("Error in getting resourcescounts list:"+error))
    })
    // this.getGroupsList(true);
    // Have to call the resource list function
  },
  componentWillMount () {
    getAllDockerImage(0,1)
    .then((images) => {

      if(images.dockeriamges&&images.total>0){
        this.setState({
          dockerListLength:images.total
        })
      }
    })
    .catch((error) => console.log("Error in getting images list:"+error))
  },
  componentDidMount () {
    let heightWindow = window.innerHeight;
    let heightGear = heightWindow - 360;
    this.setState({
      heightGear: heightGear
    })

    // getResourcesList(this.state.list.length+50, 50, this.state.filter)
    // .then((resources) => {
    //   if(resources){
    //     this.setState({
    //       list:resources,
    //       dataLoad:true
    //     })
    //   }
    // })
    // .catch((error) => console.log("Error in getting resourcescounts list:"+error))
    this._onSortChange(this.state.filter.sortby, this.state.filter.orderby)

      getResourcesCounts()
      .then((countsData) => {
        if(countsData){
          this.setState({
            accessiblityCount:countsData.accessible,
            inaccessibleCount:countsData.inaccessible
          })
        }
      })
      .catch((error) => console.log("Error in getting resourcescounts list:"+error))
  },
  showResource(){
    let navPath='/infrastructure/allresources';
    // console.log("NavPath is "+navPath);
    this.context.router.replace(navPath);


  },
  showDockerImage(){
    let navPath='/infrastructure/dockerTab';
    // console.log("NavPath is "+navPath);
    this.context.router.replace(navPath);


  },
  columnChooserToggle() {
    console.log("goodness gracious")
    this.setState({ columnChooserShow: !this.state.columnChooserShow });
  },
  columnDisplayChangeHandler(colName){
    console.log("THIS CHANGE THING IS ALSO CALLED")
    console.log(this.state.columnsList)
    let newColumnsList = [];
    var SelectedList = localStorage.getItem("ResourceTable")?JSON.parse(localStorage.getItem("ResourceTable")):this.state.columnsList;
    let that=this;
    SelectedList.forEach(function(col){
      // console.log("INSIDE FOREACH STATEMENT", col.name, colName)
      if(col.name === colName){
        newColumnsList.push({...col,show:!col.show});
        that.setState({columnsList:newColumnsList})
        console.log("INSIDE CORRECT if STATEMENT", col.name, colName, newColumnsList, that.state.columnsList)
      }
      else{
        newColumnsList.push(col);
        console.log("INSIDE if STATEMENT")
      }
    })
    localStorage.setItem("ResourceTable", JSON.stringify(newColumnsList));
    //this.setState({columnsList:newColumnsList})
    console.log("AFTER STATEMENT"+ JSON.stringify(newColumnsList))
  },
  onClickHandler(e) {
    console.log("BAM!")
    let chkVal = parseInt(e.target.id);
    const index = this.state.selected.indexOf(chkVal)
    let newList = this.state.selected.slice();
    if (index === -1)
    {
      newList = newList.concat(chkVal)
    } else {
      newList.splice(index,1);
    }
    this.setState({selected: newList})
  },
  selectAllHandler(){
    if(!this.state.all){
      this.setState({dataLoad:false});
    }
    this.setState({all:!this.state.all},
      (res)=>{
        console.log("this.state.all ", this.state.all, this.state.selected)
        if(this.state.all === true){
          getResourcesList(0, 0, this.state.filter)
         .then((resources) => {
           console.log("BAM!, BAM!, BAM!")
           let selectList = [];
              resources.map((r) =>
             {
               selectList.push(r.id)
             })
           this.setState({
             selected: selectList,
             list:resources,
             dataLoad:true
          }, (res)=>{console.log("this.state.all back", this.state.all, this.state.selected)});
         })
          .catch((error) => console.log("Error in getting resources list:"+error))
        } else if (this.state.all === false){
          this.setState({
            selected: []
          })
        }
      })
  },
  updateList(newList){
    console.log("PRE___________", this.state.list, newList)
    this.setState({
      list:newList
    }, (res)=>{console.log("POST___________", this.state.list)})
  },
  handleCollapseClick(rowIndex) {
    var id = this.state.list[rowIndex].id
    let collapsedRows = this.state.collapsedRows;
    if (collapsedRows.has(rowIndex)) {
      collapsedRows.delete(rowIndex)
    } else {
      console.log("elseelseelseelseelseelseelseelseelse", id)
      collapsedRows.add(rowIndex, {});
      this.callSaveData(rowIndex, id)
    }
    this.setState({
      collapsedRows: collapsedRows
    });
  },
  rowHeightGetter(index) {
    return this.state.collapsedRows.has(index) ? 64.1 : 64;
  },

  rowDropdownHeightGetter(index) {
    let dd = this.state.deviceDetails[index]?this.state.deviceDetails[index]:this.state.test
    var environment = this.state.list[index].assetType
    // console.log("ENVIRONMENTenvironment", index, this.state.list[index], environment)

    if(dd.securityGroup.length <3){
      if(environment !== "ONPREM"){
        return this.state.collapsedRows.has(index) ? 370 : 0;
      } else {
        return this.state.collapsedRows.has(index) ? 240 : 0;
      }
    }else{
      if(environment !== "ONPREM"){
        return this.state.collapsedRows.has(index) ? dd.securityGroup.length * 27 + 370 : 0;
      } else {
        return this.state.collapsedRows.has(index) ? 240 : 0;
      }
    }
  },

  callSaveData(index, id){
    var itemById = this.state.list.filter(function(item){console.log("this is filter in progress ", id, item.id); return item.id == id})[0].tagset;
    console.log("TAGTAGTAGTAG =) ",itemById)
    console.log("index, id ", index, id)

    let currentTagsList = this.state.tagsList;
    console.log('indexindexindexindexindexindexindexindex=)=)=)=)=)', index, currentTagsList)

    // currentTagsList.push(response);
    currentTagsList[index] = itemById;
    console.log('indexindexindexindexindexindexindexindex=)=)=)=)=)', currentTagsList)

    this.setState({
      tagsList:currentTagsList
      // deviceDetails:this.state.test
    })

    getDeviceDetailsComplianceHistoryById(id)
      .then((response)=>{
        let currentCHList = this.state.complianceHistory;
        // currentCHList.push(response);
        currentCHList[index] = response.reverse();
        console.log('indexindexindexindexindexindexindexindex', currentCHList)

        this.setState({
          complianceHistory:currentCHList
          // deviceDetails:this.state.test
        }, (res)=>{
          // console.log('indexindexindexindexindexindexindexindex', this.state.complianceHistory)
          // this.rowDropdownGetter(index)
        })
      })
      .catch((error)=>{
        console.log("Error in getting getDeviceDetailsComplianceHistory by id", error)
      })
    getDeviceDetailsById(id)
      .then((response)=>{
        let currentDDList = this.state.deviceDetails;
        // currentDDList.push(response);
        currentDDList[index] = response;
        this.setState({
          deviceDetails:currentDDList
          // deviceDetails:this.state.test
        }, (res)=>{
          // console.log('indexindexindexindexindexindexindexindex')
          this.rowDropdownGetter(index)
        })
      })
      .catch((error)=>{
        console.log("Error in getting device details by id", error)
      })
  },
  makeTagList(tags){
    var tagsArray = [];
    for(var oneTag in tags){
      tagsArray.push(`${oneTag} - ${tags[oneTag]}`)
    }
    // console.log("tagsArraytagsArraytagsArraytagsArraytagsArraytagsArraytagsArraytagsArray", tagsArray)
    return  tagsArray;

    // tags.map((oneTag) => {
    //    tagsArray.push(oneTag)
    //    console.log("AZUREoneTag", oneTag, tagsArray)
    //    return  tagsArray;
    // })
  },

  rowDropdownGetter(index) {
    console.log("this.state.list[index].assetType", this.state.list[index].assetType)
    let dd = this.state.deviceDetails[index]?this.state.deviceDetails[index]:this.state.test
    let ch = this.state.complianceHistory[index]?this.state.complianceHistory[index]:this.state.test2
    let tags = this.state.tagsList[index]?this.state.tagsList[index]:this.state.ddTagSet
      let aws = tags.AWS;
      let google = tags.GOOGLE;
      let pulsar = tags.PULSAR;
      let azure = tags.AZURE;
      let setTagList = [];
      let setTagString = "";
      var environment = this.state.list[index].assetType
      if(environment === "AWS") {
        setTagList = this.makeTagList(aws);
        setTagString = setTagList?setTagList.join(", "):""
        // console.log("THIS IS THE ENVIRONMENT YAYYY", awsTag,setTagString);
      } else if(environment === "GOOGLE") {
        console.log("THIS IS THE ENVIRONMENT YAYYY", environment );
        setTagList = this.makeTagList(google);
        setTagString = setTagList?setTagList.join(", "):""
      } else if(environment === "PULSAR") {
        console.log("THIS IS THE ENVIRONMENT YAYYY", environment );
        setTagList = this.makeTagList(pulsar);
        setTagString = setTagList?setTagList.join(", "):""
      } else if(environment === "AZURE") {
        console.log("THIS IS THE ENVIRONMENT YAYYY", environment );
        setTagList = this.makeTagList(azure);
        setTagString = setTagList?setTagList.join(", "):""
      }



    // console.log("THIS IS THE TAGS FROM ROWGETTER ", azure, azureTagList)
    var style = {
      height: '100%',
      width: '100%',
      // textAlign: 'center',
      // lineHeight: '50px',
      // fontSize: 30,
      // fontWeight: 'bold',
      // color: '#777',
      // background: 'white',
      // letterSpacing: '1px'
    };
    var colStyle = {borderRight:'2px solid #E5EAF4'}
    var titleStyle = {fontWeight: 'bold'}

    // var df = this.state.deviceConfiguration;
    // var cd = this.state.cloudDetails;
    // var ppC = this.state.ppComplianceStatus;
    var deviceDetails = this.state.deviceDetails[index-1];
    // var ppC = this.state.ppComplianceStatus.splice(0,6);
    let details, tagsEnvironment;
    if (this.state.list[index].assetType === "ONPREM") {
      details = (
        <Col lg={5}>
          <div style = {titleStyle}>Device Configuration</div>
          <br></br>
          <div style = {colStyle}>
            <div>Host Name:&nbsp;&nbsp;{!dd.hostname?'-':dd.hostname} </div>
            <div>IP Address:&nbsp;&nbsp;{!dd.ipaddress?'-':dd.ipaddress} </div>
            <div>MAC Address:&nbsp;&nbsp;{!dd.macaddress?'-':dd.macaddress} </div>
            <div>OS Name:&nbsp;&nbsp;{!dd.OSType?'-':dd.OSType} </div>
            <div>OS Version:&nbsp;&nbsp;{!dd.OSVersion?'-':dd.OSVersion} </div>
            <div>Last Scan Time:&nbsp;&nbsp;{ch[0] && ch[0].test_date?moment.utc(ch[0].test_date).format('MMM DD HH[:]mm'):'-'} </div>
            <div>Credentials:&nbsp;&nbsp;{!dd.credentials || dd.credentials.length == 0?'-':dd.credentials.join(", ")} </div>
          </div>
        </Col>
      );
      tagsEnvironment = (
        <Col lg={12}>
        </Col>
      );
    } else {
      let cloud;
      if (this.state.list[index].assetType == "AWS"){
        cloud = (
          <div style = {colStyle}>
            <div>Cloud Type:&nbsp;&nbsp;{!dd.cloudType?'-':dd.cloudType} </div>
            <div>Region:&nbsp;&nbsp;{!dd.regions?'-':dd.regions} </div>
            <div>VPC ID:&nbsp;&nbsp;{!dd.vpcId?'-':dd.vpcId} </div>
            <div>Key Pair:&nbsp;&nbsp;{!dd.keypair?'-':dd.keypair} </div>
            <div>Security Group:&nbsp;&nbsp;{!dd.securityGroup || dd.securityGroup.length == 0 ?'-':dd.securityGroup.join(" ,")} </div>
            <div>Subnet ID:&nbsp;&nbsp;{!dd.subnetId?'-':dd.subnetId} </div>
            <div style={{opacity: '0'}}> .</div>
            <div style={{opacity: '0'}}> .</div>
            <div style={{opacity: '0'}}> .</div>
            <div style={{opacity: '0'}}> .</div>
          </div>
        )
      } else if (this.state.list[index].assetType == "GOOGLE") {
        //   "instanceId": "9182280759861481631",
        //   "instanceType": "n1-standard-1",
        //   "instanceState": "RUNNING",
        //   "privateIp": "10.128.0.13",
        //   "publicIp": "35.193.64.166",
        //   "OSType": "Container-Optimized OS from Google",
        //   "OSVersion": "Container-Optimized OS from Google",
        //   "cloudType": "Google",
        //   "regions": "us-central1-c",
        //   "securityGroup": [],
        //   "hostname": "gke-denzin-default-pool-f9d70cb8-gqr6",
        //   "macaddress": "02:42:55:aa:08:8f\r\n42:01:0a:80:00:08\r\n\r\n",
        //   "credentials": [
        //     "GCP",
        //     "GCPWIN"
        //   ],
        //   "ipaddress": "35.193.64.166",
        //   "policypack": [],
        //   "keypair": [
        //     "nsappakey.pem"
        //   ]
        // }
        cloud = (
          // Cloud type: GCP
          // Instance group groups: instance group name
          // Region: -> map to Zone in GCP
          // VPC ID: use VPC group from GCP
          <div style = {colStyle}>
            <div>Cloud Type:&nbsp;&nbsp;{!dd.cloudType?'-':dd.cloudType} </div>
            <div>Instance Group:&nbsp;&nbsp;{!dd.instanceGroup?'-':dd.instanceGroup} </div>
            <div>Region:&nbsp;&nbsp;{!dd.regions?'-':dd.regions} </div>
            <div>VPC ID:&nbsp;&nbsp;{!dd.vpcId?'-':dd.vpcId} </div>
            <div style={{opacity: '0'}}> .</div>
            <div style={{opacity: '0'}}> .</div>
            <div style={{opacity: '0'}}> .</div>
            <div style={{opacity: '0'}}> .</div>
            <div style={{opacity: '0'}}> .</div>
            <div style={{opacity: '0'}}> .</div>
          </div>
        )
      } else if (this.state.list[index].assetType == "AZURE"){
        cloud = (
          // Cloud type: Azure
          // Security groups: map to Network security group
          // Resource group: Name of the group resource belongs to in Azure
          // Region: map to Location in Azure
          // Virtual networks: name of the Virtual Network
          // Deployment model: Resource manager or Classic
          // SubscriptionID:
          <div style = {colStyle}>
            <div>Cloud Type:&nbsp;&nbsp;{!dd.cloudType?'-':dd.cloudType} </div>
            <div>Security Group:&nbsp;&nbsp;{!dd.securityGroup || dd.securityGroup.length == 0 ?'-':dd.securityGroup.join(" ,")} </div>
            <div>Resource Group:&nbsp;&nbsp;{!dd.resourceGroup?'-':dd.resourceGroup} </div>
            <div>Region:&nbsp;&nbsp;{!dd.regions?'-':dd.regions} </div>
            <div>Virtual Networks:&nbsp;&nbsp;{!dd.virtualNetworks?'-':dd.virtualNetworks} </div>
            <div>Deployment Model:&nbsp;&nbsp;{!dd.deploymentModel?'-':dd.deploymentModel} </div>
            <div>Subscription ID:&nbsp;&nbsp;{!dd.subscriptionID?'-':dd.subscriptionID} </div>
            <div style={{opacity: '0'}}> .</div>
            <div style={{opacity: '0'}}> .</div>
            <div style={{opacity: '0'}}> .</div>
          </div>
        )
      }
      details = (
        <div>
        <Col lg={3}>
          <div style = {titleStyle}>Device Configuration</div>
          <br></br>
            <div style = {colStyle}>
              <div>Instance ID:&nbsp;&nbsp;{!dd.instanceId?'-':dd.instanceId} </div>
              <div>Instance Type:&nbsp;&nbsp;{!dd.instanceType?'-':dd.instanceType} </div>
              <div>Instance State:&nbsp;&nbsp;{!dd.instanceState?'-':dd.instanceState} </div>
              <div>Host Name:&nbsp;&nbsp;{!dd.hostname?'-':dd.hostname} </div>
              <div>MAC Address:&nbsp;&nbsp;{!dd.macaddress?'-':dd.macaddress} </div>
              <div>Credentials:&nbsp;&nbsp;{!dd.credentials || dd.credentials.length == 0?'-':dd.credentials.join(", ")} </div>
              <div>Private IP:&nbsp;&nbsp;{!dd.privateIp?'-':dd.privateIp} </div>
              <div>Public IP:&nbsp;&nbsp;{!dd.publicIp?'-':dd.publicIp} </div>
              <div>OS Name:&nbsp;&nbsp;{!dd.OSType?'-':dd.OSType} </div>
              <div>OS Version:&nbsp;&nbsp;{!dd.OSVersion?'-':dd.OSVersion} </div>
            </div>
        </Col>
        <Col lg={3}>
          <div style = {titleStyle}>Cloud Details</div>
          <br></br>
          {cloud}
        </Col>
        </div>
      );
      tagsEnvironment = (
        <Col lg={12} style={{overflowX:"scroll", whiteSpace: "nowrap", height: "55px"}}>
          <span>{!dd.cloudType?'':dd.cloudType}&nbsp;Tags:&nbsp;&nbsp;</span>
          <span style={{display:"inline-block", marginTop:"5px", marginRight:"20px"}}>
              { setTagList.map((singleTag) =>
                {
                  return  (
                    <span style={{padding: '5px', margin:"3px", border:'1px solid black', backgroundColor:"#E5EAF4"}}>{singleTag}</span>
                )}
              )}
          </span>
        </Col>
      );
    }


    return (
      <div style={{width:'100%'}}>
        <Row style={{margin: '0 20px 10px', borderTop:'2px solid #E5EAF4', paddingTop:"20px"}}>
          {details}
          <Col lg={6}>
            <div style = {titleStyle}>Policy Pack and Risk Posture</div>
            <br></br>
              { ch.map((status) =>
                {
                  console.log("status.test_date.slice(0, 10)", status.test_date.slice(0, 10))

                  return  (
                    <Row >
                      <Col lg={3}>
                        <div>{moment.utc(status.test_date.slice(0, 10)).format('MM[/]DD[/]YYYY')}</div>
                      </Col>
                      <Col lg={5}>
                        <div>{status.policypack_name}</div>
                      </Col>
                      <Col lg={3}>
                        {/*<Col lg={6}><div className={diamond}></div></Col>
                        <Col lg={6}>{status.score}</Col>*/}
                        <ScoreCell2 data={status} />
                      </Col>
                    </Row>
                )}
              )}
          </Col>
        </Row>
        <Row style={{marginLeft:"20px", marginRight:"20px", borderTop:'2px solid #E5EAF4', paddingTop:"20px"}}>
          {tagsEnvironment}
        </Row>
      </div>
    )
  },


  _onSortChange(columnKey, sortDir) {
    console.log("columnKey, sortDir", columnKey, sortDir)
    var sortFilters = this.state.filter;
    sortFilters.sortby = columnKey
    sortFilters.orderby = sortDir
    this.setState({
      filter:sortFilters
    }, ()=>{
      // getResourcesList(this.state.list.length+50, 50, sortFilters)
      getResourcesList(50, 50, sortFilters)
      .then((resources) => {
        if(resources){
          this.setState({
            list:resources,
            dataLoad:true
          })
        }
      })
      .catch((error) => console.log("Error in getting resourcescounts list:"+error))
    })
    // var sortIndexes = this._defaultSortIndexes.slice();
    // sortIndexes.sort((indexA, indexB) => {
    //   var valueA = this._dataList.getObjectAt(indexA)[columnKey];
    //   var valueB = this._dataList.getObjectAt(indexB)[columnKey];
    //   var sortVal = 0;
    //   if (valueA > valueB) {
    //     sortVal = 1;
    //   }
    //   if (valueA < valueB) {
    //     sortVal = -1;
    //   }
    //   if (sortVal !== 0 && sortDir === SortTypes.ASC) {
    //     sortVal = sortVal * -1;
    //   }
    //
    //   return sortVal;
    // })
    this.setState({
      // sortedDataList: new DataListWrapper(sortIndexes, this._dataList),
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  },
  getTableColumn: function(colName,width){
      //var SelectedList = localStorage.getItem("ResourceTable")?JSON.parse(localStorage.getItem("ResourceTable")):this.state.columnsList;
      //var SelectedList = localStorage.getItem("ResourceTable")?JSON.parse(localStorage.getItem("ResourceTable")):this.state.columnsList;
      var StateList = this.state.columnsList;
      var StorageList = JSON.parse(localStorage.getItem("ResourceTable"));
      if(StorageList!=undefined){
        for (var i = 0, len = StateList.length; i < len; i++) {
          for (var j = 0, len = StorageList.length; j < len; j++) {
            if(StateList[i].name==StorageList[j].name)
            {
               StateList[i].show = StorageList[j].show;
               StateList[i].width = StorageList[j].width;
            }
          }
        }
      }
      var StorageList = JSON.parse(localStorage.getItem("ResourceTable1"));
      if(StorageList!=undefined){
        for (var i = 0, len = StateList.length; i < len; i++) {
          for (var j = 0, len = StorageList.length; j < len; j++) {
            if(StateList[i].name==StorageList[j].name)
            {
               StateList[i].width = StorageList[j].width;
            }
          }
        }
      }
      var SelectedList = StateList;
      let colObj = findElement(SelectedList,"name",colName);
      let dataList = this.state.list;
      if(colObj != null && colObj["show"]){
//alert(colObj['width']);
        switch(colName){
          case 'ipaddress' :

            return <Column
              // align='center'
              // header={<Cell>IP ADDRESS</Cell>}
              isReorderable={true}
              isResizable={true}
              columnKey="ipaddress"
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.ipaddress}>
                  IP ADDRESS
                </SortHeaderCell>
              }
              flexGrow={1}
              cell={<CollapsedRowsCell style={{paddingLeft:"55"}} col="ipaddress" data={dataList} callback={this.handleCollapseClick} collapsedRows={this.state.collapsedRows} />}
              // cell={<TextCell data={dataList} col="ipaddress" />}
              width={colObj['width']} />
          case 'hostName' :
            return <Column
              align='center'
              columnKey="hostName"
              isReorderable={true}
              isResizable={true}
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.hostName}>
                  NAME
                </SortHeaderCell>
              }
              flexGrow={2}
              cell={<TooltipCell data={dataList} col="hostName"/>}
              width={colObj['width']}  />
          case 'osName' :
            return <Column
              align='center'
              columnKey="osName"
              isReorderable={true}
              isResizable={true}
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.osName}>
                  OS
                </SortHeaderCell>
              }
              flexGrow={2}
              cell={<TooltipCell data={dataList} col="osName"/>}
              width={colObj['width']}  />
          case 'complianceStatus' :
            return <Column
              align='center'
              isReorderable={true}
              isResizable={true}
              columnKey="complianceStatus"
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.complianceStatus}>
                  RISK SCORE
                </SortHeaderCell>
              }
              flexGrow={1}
              cell={<ComplianceCell data={dataList} statusCol="complianceStatus"/>}
              width={colObj['width']}  />
          case 'test_status' :
            return <Column
              align='center'
              isReorderable={true}
              isResizable={true}
              columnKey="test_status"
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.test_status}>
                  ASSESSMENT STATUS
                </SortHeaderCell>
              }
              flexGrow={1}
              cell={<TestStatusCell data={dataList} col="testStatus"
                      width={colObj['width']}/>}
              width={colObj['width']}  />
          case 'accessible' :
            return <Column
              align='center'
              isReorderable={true}
              isResizable={true}
              columnKey="accessible"
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.accessible}>
                  ACCESS
                </SortHeaderCell>
              }
              flexGrow={1}
              cell={<AccessCell data={dataList} col="accessible"/>}
              width={colObj['width']}   />
          case 'groupNames':
            return <Column
              isReorderable={true}
              isResizable={true}
              align='center'
              columnKey="groupNames"
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.groupNames}>
                  GROUP NAME
                </SortHeaderCell>
              }
              flexGrow={1}
              cell={<TooltipCell data={dataList} col="groupnames"/>}
              // cell={<TextCell data={dataList} col="groupnames"/>}

              width={colObj['width']}  />
          case 'assettype':
            return <Column
              isReorderable={true}
              isResizable={true}
              align='center'
              columnKey="assettype"
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.assettype}>
                  ENVIRONMENT
                </SortHeaderCell>
              }
              flexGrow={1}
              cell={({rowIndex, ...props}) => {
                let value = (dataList[rowIndex]["assetType"] && dataList[rowIndex]["assetType"] !== 'null')? dataList[rowIndex]["assetType"] : '-';
                return(
                <Cell {...props}>
                    {AttributeConstants.ASSET_TYPE[value]}
                </Cell>
                )
              }}
              width={colObj['width']}  />
          case 'endtime':
            return <Column
              align='center'
              isReorderable={true}
              isResizable={true}
              columnKey="endtime"
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.endtime}>
                  LAST SCAN
                </SortHeaderCell>
              }
              flexGrow={1}
              cell={<TooltipCell data={dataList} col="enddate"/>}
              width={colObj['width']}  />
          case 'vpcId':
            return <Column
              align='center'
              isReorderable={true}
              isResizable={true}
              columnKey="vpcId"
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.vpcId}>
                  VPC ID
                </SortHeaderCell>
              }
              flexGrow={2}
              cell={<TextCell data={dataList} col="vpcid"/>}
              width={colObj['width']}  />
          case 'availabilityzone':
            return <Column
              isReorderable={true}
              isResizable={true}
              align='center'
              columnKey="availabilityzone"
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.availabilityzone}>
                  AVAILABILITY ZONE
                </SortHeaderCell>
              }
              flexGrow={2}
              cell={<TooltipCell data={dataList} col="availabilityzone"/>}
              width={colObj['width']}  />
          // case 'tags':
          //  return <Column
          //     align='center'
          //    header={<Cell>TAGS</Cell>}
          //    flexGrow={2}
          //    cell={<TextCell data={dataList} col="tagset"/>}
          //    width={200}  />
          case 'dockerenabled' :
            return <Column
              isReorderable={true}
              isResizable={true}
              align='center'
              columnKey="dockerenabled"
              header={<Cell>DOCKER ENABLED</Cell>}
              flexGrow={5}
              cell={<AccessCell data={dataList} col="dockerenabled"/>}
              width={colObj['width']}  />
          default :
            return {}
        }
     }
   },
   getDevicesByAccess: function(accessFlag){
    let newFilter = {}

    if(accessFlag!=="ALL")
      newFilter["accessible"] = accessFlag
    getResourcesList(50, 50, newFilter).then((newElements)=>{
      this.setState({
         list: newElements,
         filter: newFilter,
         top: false,
         lastIndex: null,
         selected: []
      })
    })
    .catch((error) => "Error on gettingresources with accessible="+accessFlag+":"+error)
   },

   cherryPickedDiscover(resourcesId){
    getDiscoverList(resourcesId)
    // .then((success)=>{
    //  console.log('Executed sucess-'+success)
    // })
    // .catch((error) => "getDiscoverList"+error)
   },

   parseData(filter){
     let data = {}
     let colons = [];
     let oneFilter = filter.value;
     data.tag = filter.tagGroup;
     var count = 0;
     console.log("datadata", data, filter)
     for (var i = 0; i < oneFilter.length; i++) {
        if (oneFilter[i] === ":") {
          colons.push(i)
       }
     }
     console.log("colons", colons, oneFilter[colons[0]], oneFilter[colons[1]])

     data.key = oneFilter.slice(colons[0]+1, colons[1])
     data.value = oneFilter.slice(colons[1]+1, oneFilter.length)
     console.log("colons", data)

      // for (var i = 0; i < oneFilter.length; i++) {
      //    if (oneFilter[i] === ":") {
      //      let value = oneFilter.slice(i+1, oneFilter.length);
      //      data.value = value
      //   }
      // }
      // for (var i = oneFilter.length; i > 0; i--) {
      //    if (oneFilter[i] === ":") {
      //      let key = oneFilter.slice(i+1, oneFilter.length);
      //      console.log("keykey", i, key)
      //      data.key = key;
      //   }
      // }
      // for (var i = oneFilter.length; i > 0; i--) {
      //    if (oneFilter[i] === ":" && count <= 0) {
      //      console.log("keykey", i, count)
      //      count++;
      //   } else if (oneFilter[i] === ":" && count > 0) {
      //    let key = oneFilter.slice(i+1, oneFilter.length);
      //    console.log("keykey", i, key)
      //    data.key = key;
      //  }
      // }
      return data;
   },
   setNewFilter(filter) {
     this.setState({
       filter:filter
     }, (res)=>{
       console.log("GET DATA IS CALLED ON SEARCH", filter, this.state.filter)
          getResourcesList(0, 0, filter).then((newElements)=>{
            console.log(newElements)
            let selectList = [];
            //if (newElements) {
           if (newElements && Object.keys(filter).length>2) {
            // this.props.updateList(newElements)
            newElements.map((elem) =>
           {
             selectList.push(elem.id)
           })
          }
            this.setState({
                list: newElements,
                selected: selectList,
                // filter: filter,
                top: false,
                lastIndex: null,

            }, (res) => {
             //  this.selectAllHandler();
              console.log("RAWR RAWR RAWR!!! THIS IS THE SELECTED LIST UPON SEARCH ", this.state.list, this.state.selected)})
          });
     })
   },
   deleteNow(newValue, deletedValue, deleted){
     var filter = this.state.filter;
     var deletedData;
     let newFilter;
     if(newValue.length > 0) {
       console.log("deletedValue=)", this.state.filter, deletedValue)
       if (deletedValue.tagGroup === "GLOBAL"){
         var deletedData = this.parseData(deletedValue)
         if(filter[deletedData.key]){
           for(var i = 0; i < filter[deletedData.key].length; i++) {
             if(filter[deletedData.key][i] === deletedData.value) {
               newFilter = filter[deletedData.key].splice(i-1, i)
             }
           }
           filter[deletedData.key] = newFilter;
          //  this.setState({
          //    filter:filter
          //  }, (res)=>{console.log("this.state.filterthis.state.filterthis.state.filterthis.state.filterthis.state.filterthis.state.filter", this.state.filter)})
          console.log("filter, newFilter", filter, filter[deletedData.key], newFilter)
          this.setNewFilter(filter)
         }
       } else {
         var deletedData = this.parseData(deletedValue)
         if(filter.tagSet[deletedData.tag][deletedData.key]){
            delete filter.tagSet[deletedData.tag][deletedData.key]
            console.log("filter, newFilter", filter, filter[deletedData.key], newFilter)
            this.setNewFilter(filter)
         }
       }
     } else {
       let filter = {};

          getResourcesList(0, 50, filter).then((newElements)=>{
            console.log(newElements)
            this.setState({
                list: newElements,
                filter: filter,
                top: false,
                lastIndex: null,
                selected: []
            }, (res) => {
              console.log("RAWR RAWR RAWR!!! THIS IS THE SELECTED LIST UPON SEARCH ", this.state.list, this.state.selected)})
          });
     }
   },
   searchNow: function(newValue, key, value, tag, deleted) {
          console.log("GET DATA IS CALLED ON SEARCH =)123", newValue)
           console.log("GET DATA IS CALLED ON SEARCH =)", this.state.filter, key, value, tag, deleted)
           var filter = this.state.filter;
           let tagSet;
           var valueArray = [];
           let newKey;
           if (key) {
             for (var i = 0; i < key.length; i++) {
                if (key[i] === ":") {
                  newKey = key.slice(i+1, key.length);
                 console.log("key! Value!key! Value!key! Value!", newKey, value)
               }
             }
           }
           valueArray.push(value)
           console.log("abcdefghijklmn", value, newKey)

          //  if (newKey && value){
             if(!deleted && newValue.length > 0) {
               if (tag === "GLOBAL") {
                 if(filter[newKey]) {
                   if (newKey === "accessible") {
                     console.log("valuevaluedsfasdfsdf", value)
                     filter[newKey]=value;
                     this.setNewFilter(filter);
                   } else if (newKey === "LASTSCAN") {
                     console.log("vLASTSCANLASTSCANLASTSCANLASTSCAN", value)
                    //  filter[newKey].push(value)
                    // filter[newKey]=JSON.parse(value);
                    filter.scanTimeStart = value.scanTimeStart;
                    filter.scanTimeEnd = value.scanTimeEnd;
                     this.setNewFilter(filter);
                   } else{
                     filter[newKey].push(value)
                     this.setNewFilter(filter);
                   }
                 } else {
                   if (newKey === "accessible") {
                     console.log("valuevaluedsfasdfsdf", value, newKey)
                     filter[newKey]=value;
                     this.setNewFilter(filter);
                   } else if (newKey === "LASTSCAN") {
                     console.log("vLASTSCANLASTSCANLASTSCANLASTSCAN", value)
                    //  filter[newKey]=[value];
                    // filter[newKey]=JSON.parse(value);
                    filter.scanTimeStart = value.scanTimeStart;
                    filter.scanTimeEnd = value.scanTimeEnd;
                     this.setNewFilter(filter);
                   } else {
                    //  console.log(filter, newKey)
                     filter[newKey]=[value]
                     this.setNewFilter(filter);
                   }
                 }
               } else {
                  let tagSet = this.state.tagSet;
                 tagSet[tag][newKey] = value;
                 filter.tagSet = tagSet;
                 this.setNewFilter(filter);
                 console.log('tagSettagSettagSettagSet', tagSet);
               }
             }else if (!deleted && newValue.length == 0) {
               this.setNewFilter({sortby: "ipaddress", orderby: "desc"})
               //this.refreshList();
             }
       },

  render () {

    let heightGear = this.state.heightGear;
    let selectedList = this.state.selected;
    let dataList = this.state.list
    var SelectedList = localStorage.getItem("ResourceTable")?JSON.parse(localStorage.getItem("ResourceTable")):this.state.columnsList;
    // <Col xs={12} lg={12} style={{textAlign:"right",  alignItems: 'flex-start', position: 'absolute', right:'0', bottom:'0', top:'320', marginLeft: "60px", marginRight:"90px"}}>
    return (
    <div className="container-fluid">
    {(this.state.dataLoad)?
    <div className="container-fluid">
      <Row>
        <Col style={{marginLeft: "30px", marginRight:"60px", marginTop:"30px", width:"1000px"}} lg={12}>
          <AutoSearch style={{width:"1000px"}}
            searchNow={this.searchNow}
            deleteNow={this.deleteNow}
            getDataTags={getResourcesTags}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={6} lg={6} style={{height:45,paddingLeft:50}}>
          <ActionLinks
            list={this.state.list}
            refreshList={this.refreshList}
            selectedResources={this.state.selected}
            numAccessible= {this.state.accessiblityCount}
            numInaccessible={this.state.inaccessibleCount}
            numSelected={this.state.selected.length}
            getDevicesByAccess={this.getDevicesByAccess}
            cherryPickedDiscover={this.cherryPickedDiscover}/>
        </Col>
        <Col xs={6} lg={6} style={{textAlign:"right",  alignItems: 'flex-start', height:45}}>
          <div style={{display: 'flex',justifyContent:'flex-end'}}>
             {this.state.dockerListLength>0?
                <div id="tabs" style={{minWidth:222, marginTop:4, fontSize:18, zIndex:9}}>

                  <Tabs>
                    <TabList>
                      <Tab><div onClick={this.showResource} >Resources Page</div></Tab>
                      <Tab><div onClick={this.showDockerImage} >Image page</div></Tab>
                    </TabList>
                  </Tabs>

                </div>
                :
                <noscript />
              }
              <div id="refresh" style={{margin:'9px 10px', cursor:'pointer'}}>
                <a onClick={this.refreshList}> <Glyphicon style={{color:'#4e56a0', fontSize:"19"}} glyph="glyphicon glyphicon-refresh" /></a>
                {/*<a onClick={this.refreshList}> <img src={refreshIcon1} alt="refreshIcon"/></a>*/}

              </div>
              <div style={{margin:'0px 5px', cursor:'pointer',marginRight:'50px'}}>
                <ResourceColumnChooserClass
                  toggle={this.columnChooserToggle}
                  columnShow={this.state.columnChooserShow}
                  container={this.refs.resourcesTable}
                  columnsList={SelectedList}
                  changeHandler={this.columnDisplayChangeHandler}
                />
              </div>
            </div>
        </Col>
      </Row>

      <Row style={{marginLeft:-45}}>
        <Col xs={12} lg={12}>
          <TestTable
            type="ResourceTable"
            columnsList={this.state.columnsList}
            getTableColumn={this.getTableColumn}
            list={this.state.list}
            selected={this.state.selected}
            updateList = {this.updateList}
            accessiblityCount={true}
            onClickHandler={this.onClickHandler}
            selectAllHandler={this.selectAllHandler}
            all={this.state.all}
            filter={this.state.filter}
            rowHeightGetter={this.rowHeightGetter}
            rowDropdownHeightGetter={this.rowDropdownHeightGetter}
            rowDropdownGetter={this.rowDropdownGetter}
            getDataList={getResourcesList}
            getDataCounts={getResourcesCounts}
            getDataTags={getResourcesTags}
            checkboxColumn={
              <Column
                ref="column"
                header={
                  <Cell>
                  <input type='checkbox' id="selectAllChk" className="chkAll"
                  checked={(dataList.length > 0 && selectedList.length === dataList.length)?true:false}
                  onClick={this.selectAllHandler}
                  ref={input => {
                      if (input) {
                        input.indeterminate = (selectedList.length > 0 && selectedList.length < dataList.length)?true:false;
                      }
                    }}
                  />
                  <label style={{marginTop:'10px'}} htmlFor="selectAllChk"></label>
                  </Cell>
                }
                cell={props =>(
                  <CheckboxCell
                  {...props}
                  selectedList={selectedList}
                  data={dataList} col="id"
                  ref={(node) => {
                    let allData;
                    allData= node}}
                  onClickHandler={this.onClickHandler} />
                )}
                width={50}
              />
            }

          />
        </Col>
      </Row>


        {/*<Col xs={6} lg={6}></Col>
          <Col xs={6} lg={6} style={{textAlign:"right",  alignItems: 'flex-start', position: 'absolute', right:'0', bottom:'0', top:'256', marginLeft: "60px", marginRight:"90px"}}>
            <Col xs={4} lg={4}></Col>
            <Col xs={7} lg={7} style={{textAlign:"right"}}>
              <NavDropdownExample style={{textAlign:"right"}}/>
            </Col>
            <Col xs={1} lg={1}>
              <ResourceColumnChooserClass
                toggle={this.columnChooserToggle}
                columnShow={this.state.columnChooserShow}
                container={this.refs.resourcesTable}
                columnsList={this.state.columnsList}
                changeHandler={this.columnDisplayChangeHandler}
              />
        </Col>*/}
      </div>
      : <div style={{marginTop:280}}><SpinnyLogo /></div>}
    </div>
    )
  }
})

export default ResourcesContainers




// import React, {PropTypes} from 'react'
// import ReactDOM from 'react-dom'
// import {connect } from 'react-redux'
// import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row} from 'react-bootstrap'
// import {spacer} from 'sharedStyles/styles.css'
// import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange} from './styles.css'
// import {Table,Column, Cell} from 'fixed-data-table'
// import {Header } from 'components/Header/Header'
// import {AccessCell,ArrayLinkCell,ScoreCell,ComplianceCell,GroupCell,TextCell,LinkCell,CheckboxCell, TooltipCell, TooltipDataCell, CollapsedRowsCell} from 'components/Table/Table'
// import {IpAddressCell} from './ResourceIPAddressCell'
// import {ResourceColumnChooserClass} from './ResourceColumnChooserCell'
// import {getResourcesList,getResourcesCounts, getResourcesTags} from 'helpers/resources'
// import {ActionLinks,ColumnChooserPopover} from 'components/Infrastructure/Resources'
// import Dimensions from 'react-dimensions'
// import TestTable from "./TestTable"
// import AutoSearch from './autoSearch';
//
// Array.prototype.insert = function (index, item) {
//   this.splice(index, 0, item);
// };
//
// Array.prototype.delete = function (index) {
//   this.splice(index, 1);
// };
//
// function findElement(arr, propName, propValue) {
//   for (let i=0; i < arr.length; i++)
//     if (arr[i][propName] == propValue)
//       return arr[i];
// }
//
// const ResourcesContainers = React.createClass({
//  getInitialState(){
//    return {
//      list:[],
//      selected: [],
//       filter:{},
//      columnChooserShow:false,
//      accessiblityCount:'',
//      inaccessibleCount:'',
//      heightGear:null,
//      columnsList:[
//        {name:'ipaddress', displayText:'IP Address', show:true, columnName: "IP ADDRESS", width:"130"},
//        {name:'hostName', displayText:'Name', show:true, columnName: "NAME", width:"125"},
//        {name:'osName', displayText:'OS', show:true, columnName: "OS", width:"75"},
//        {name:'complianceStatus', displayText:'Compliance', show:true,  columnName: "COMPLIANCE", width:"130",},
//        {name:'assessmentStatus', displayText:'Test Status', show:true, columnName: "TEST STATUS", width:"240"},
//        {name:'accessible', displayText:'Access', show:true, columnName: "ACCESS", width:"70"},
//        {name:'groupNames', displayText:'Group Name', show:true, columnName: "GROUP NAME", width:"200"},
//        {name:'environment', displayText:'Environment', show:true, columnName: "ENVIRONMENT", width:"150"},
//        {name:'lastScanTime', displayText:'Last time scanned',show:false, columnName: "LAST SCAN", width:"200"},
//        {name:'vpcId', displayText:'VPC ID', show:false, columnName: "VPC ID", width:"100"},
//        {name:'regions', displayText:'Availability zone', show:false, columnName: "AVAILABILITY ZONE", width:"150"},
//        {name:'tags', displayText:'TAGs', show:false, columnName: "TAGS", width:"200"}
//      ],
//       all:false,
//       collapsedRows: new Set(),
//       deviceConfiguration:{
//         instanceID:"1jk1l4kj23l4k234234",
//         instanceType: "fSDfdklgadf",
//         instanceState: "Running",
//         privateIP: "120.369.940.302",
//         publicIP: "204.502.403.204",
//         osType: "Windows",
//         osVersion: "poleitimd"
//       },
//       cloudDetails:{
//         cloudType: "AWS",
//         region: "USA-East",
//         vpcID: "234jkwd2i3lkj2432",
//         securityGroup: "qedflkj3iourkdf92034",
//         subnetID: "subnet-edflajksdfjierj"
//       },
//       ppComplianceStatus: [
//         ["My AWS Test", "09/17/2019 @ 15:53:37", "Score 3"],
//         ["My AWS Test", "09/17/2019 @ 15:53:37", "Score 3"],
//         ["My AWS Test", "09/17/2019 @ 15:53:37", "Score 3"],
//         ["My AWS Test", "09/17/2019 @ 15:53:37", "Score 3"],
//         ["My AWS Test", "09/17/2019 @ 15:53:37", "Score 3"],
//         ["My AWS Test", "09/17/2019 @ 15:53:37", "Score 3"]
//       ],
//    }
//  },
//  componentDidMount () {
//    let heightWindow = window.innerHeight;
//    let heightGear = heightWindow - 360;
//    this.setState({
//      heightGear: heightGear
//    })
//
//     getResourcesList(this.state.list.length+50, 50, this.state.filter)
//     .then((resources) => {
//       if(resources){
//         this.setState({
//           list:resources
//         })
//       }
//     })
//     .catch((error) => console.log("Error in getting resourcescounts list:"+error))
//
//      getResourcesCounts()
//      .then((countsData) => {
//        if(countsData){
//          this.setState({
//            accessiblityCount:countsData.accessible,
//            inaccessibleCount:countsData.inaccessible
//          })
//        }
//      })
//      .catch((error) => console.log("Error in getting resourcescounts list:"+error))
//  },
//  columnChooserToggle() {
//    console.log("goodness gracious")
//    this.setState({ columnChooserShow: !this.state.columnChooserShow });
//  },
//  columnDisplayChangeHandler(colName){
//    console.log("THIS CHANGE THING IS ALSO CALLED")
//    console.log(this.state.columnsList)
//    let newColumnsList = [];
//    let that=this;
//    this.state.columnsList.forEach(function(col){
//      // console.log("INSIDE FOREACH STATEMENT", col.name, colName)
//      if(col.name === colName){
//        newColumnsList.push({...col,show:!col.show});
//        that.setState({columnsList:newColumnsList})
//        console.log("INSIDE CORRECT if STATEMENT", col.name, colName, newColumnsList, that.state.columnsList)
//      }
//      else{
//        newColumnsList.push(col);
//        console.log("INSIDE if STATEMENT")
//      }
//    })
//    // this.setState({columnsList:newColumnsList})
//    console.log("AFTER STATEMENT", this.state.columnsList)
//  },
//   onClickHandler(e) {
//     console.log("BAM!")
//     let chkVal = parseInt(e.target.id);
//     const index = this.state.selected.indexOf(chkVal)
//     let newList = this.state.selected.slice();
//     if (index === -1)
//     {
//       newList = newList.concat(chkVal)
//     } else {
//       newList.splice(index,1);
//     }
//     this.setState({selected: newList})
//   },
//   selectAllHandler(){
//     this.setState({all:!this.state.all},
//       (res)=>{
//         console.log("this.state.all ", this.state.all, this.state.selected)
//         if(this.state.all === true){
//           getResourcesList(0, 0, this.state.filter)
//          .then((resources) => {
//            console.log("BAM!, BAM!, BAM!")
//            let selectList = [];
//               resources.map((r) =>
//              {
//                selectList.push(r.id)
//              })
//            this.setState({
//              selected: selectList,
//              list:resources,
//           }, (res)=>{console.log("this.state.all back", this.state.all, this.state.selected)});
//          })
//           .catch((error) => console.log("Error in getting resources list:"+error))
//         } else if (this.state.all === false){
//           this.setState({
//             selected: []
//           })
//         }
//       })
//   },
//  updateList(newList){
//    console.log("PRE___________", this.state.list, newList)
//    this.setState({
//      list:newList
//    }, (res)=>{console.log("POST___________", this.state.list)})
//  },
//   handleCollapseClick(rowIndex) {
//     let collapsedRows = this.state.collapsedRows;
//     if (collapsedRows.has(rowIndex)) {
//       collapsedRows.delete(rowIndex)
//     } else {
//       collapsedRows.add(rowIndex, {});
//     }
//     this.setState({
//       collapsedRows: collapsedRows
//     });
//   },
//   rowHeightGetter(index) {
//     return this.state.collapsedRows.has(index) ? 64.1 : 64;
//   },
//
//   rowDropdownHeightGetter(index) {
//     return this.state.collapsedRows.has(index) ? 250 : 0;
//   },
//
//   rowDropdownGetter(index) {
//     var style = {
//       height: '100%',
//       width: '100%',
//       // textAlign: 'center',
//       // lineHeight: '50px',
//       // fontSize: 30,
//       // fontWeight: 'bold',
//       // color: '#777',
//       // background: 'white',
//       // letterSpacing: '1px'
//     };
//     var colStyle = {borderRight:'2px solid #E5EAF4'}
//     var df = this.state.deviceConfiguration;
//     var cd = this.state.cloudDetails;
//     var ppC = this.state.ppComplianceStatus;
//     // var ppC = this.state.ppComplianceStatus.splice(0,6);
//     return (
//       <div style={style}>
//         <Row style={{marginLeft:"20px", marginRight:"20px", borderTop:'2px solid #E5EAF4', paddingTop:"20px"}}>
//           <Col lg={3}>
//             <div>Device Configuration</div>
//             <br></br>
//             <div style = {colStyle}>
//               <div>Instance ID:&nbsp;&nbsp;{df.instanceID} </div>
//               <div>Instance Type:&nbsp;&nbsp;{df.instanceType} </div>
//               <div>Instance State:&nbsp;&nbsp;{df.instanceState} </div>
//               <div>Private IP:&nbsp;&nbsp;{df.privateIP} </div>
//               <div>Public IP:&nbsp;&nbsp;{df.publicIP} </div>
//               <div>OS Type:&nbsp;&nbsp;{df.osType} </div>
//               <div>OS Version:&nbsp;&nbsp;{df.osVersion} </div>
//             </div>
//           </Col>
//           <Col lg={3}>
//             <div>Cloud Details</div>
//             <br></br>
//               <div style = {colStyle}>
//                 <div>Cloud Type:&nbsp;&nbsp;{cd.cloudType} </div>
//                 <div>Region:&nbsp;&nbsp;{cd.region} </div>
//                 <div>VPC ID:&nbsp;&nbsp;{cd.vpcID} </div>
//                 <div>Security Group:&nbsp;&nbsp;{cd.securityGroup} </div>
//                 <div>Subnet ID:&nbsp;&nbsp;{cd.subnetID} </div>
//                 <div style={{opacity: '0'}}> .</div>
//                 <div style={{opacity: '0'}}> .</div>
//               </div>
//           </Col>
//           <Col lg={6}>
//             <div>Policy Pack and Compliance Status</div>
//             <br></br>
//               { ppC.map((status) =>
//                 {
//                   return  (
//                     <Row style = {colStyle}>
//                       <Col lg={3}>
//                         <div>{status[0]}</div>
//                       </Col>
//                       <Col lg={4}>
//                         <div>{status[1]}</div>
//                       </Col>
//                       <Col lg={2}>
//                         <div>{status[2]}</div>
//                       </Col>
//                     </Row>
//                 )}
//               )}
//           </Col>
//         </Row>
//       </div>
//     )
//   },
//  getTableColumn: function(colName){
//      let colObj = findElement(this.state.columnsList,"name",colName);
//      let dataList = this.state.list;
//      if(colObj != null && colObj["show"]){
//
//        switch(colName){
//          case 'ipaddress' :
//            return <Column
//              header={<Cell>IP ADDRESS</Cell>}
//              flexGrow={2}
//               cell={<CollapsedRowsCell col="ipaddress" data={dataList} callback={this.handleCollapseClick} collapsedRows={this.state.collapsedRows} />}
//              // cell={<TooltipDataCell data={dataList} col="ipaddress" />}
//              width={130} />
//          case 'hostName' :
//            return <Column
//              header={<Cell>NAME</Cell>}
//              flexGrow={2}
//              cell={<TooltipCell data={dataList} col="hostName"/>}
//              width={125}  />
//          case 'osName' :
//            return <Column
//              header={<Cell>OS</Cell>}
//              flexGrow={2}
//              cell={<TextCell data={dataList} col="osName"/>}
//              width={75}  />
//          case 'complianceStatus' :
//            return <Column
//              header={<Cell>COMPLIANCE</Cell>}
//              flexGrow={2}
//              cell={<ComplianceCell data={dataList} statusCol="complianceStatus"/>}
//              width={130}  />
//          case 'assessmentStatus' :
//            return <Column
//              header={<Cell>TEST STATUS</Cell>}
//              flexGrow={2}
//              cell={<LinkCell data={dataList} col="testStatus"/>}
//              width={140}  />
//          case 'accessible' :
//            return <Column
//              header={<Cell>ACCESS</Cell>}
//              flexGrow={2}
//              cell={<AccessCell data={dataList} col="accessible"/>}
//              width={70}  />
//          case 'groupNames':
//            return <Column
//              header={<Cell>GROUP NAME</Cell>}
//              flexGrow={2}
//              cell={<GroupCell data={dataList} col="groupnames"/>}
//              width={200}  />
//          case 'environment':
//            return <Column
//              header={<Cell>ENVIRONMENT</Cell>}
//              flexGrow={2}
//              cell={<LinkCell data={dataList} col="assetType"/>}
//              width={150}  />
//          case 'lastScanTime':
//            return <Column
//              header={<Cell>LAST SCAN</Cell>}
//              flexGrow={2}
//              cell={''}
//              width={200}  />
//          case 'vpcId':
//            return <Column
//              header={<Cell>VPC ID</Cell>}
//              flexGrow={2}
//              cell={<TextCell data={dataList} col="vpcid"/>}
//              width={100}  />
//          case 'regions':
//            return <Column
//              header={<Cell>AVAILABILITY ZONE</Cell>}
//              flexGrow={2}
//              cell={<TextCell data={dataList} col="region"/>}
//              width={150}  />
//          case 'tags':
//            return <Column
//              header={<Cell>TAGS</Cell>}
//              flexGrow={2}
//              cell={''}
//              width={200}  />
//          default :
//            return {}
//        }
//     }
//   },
//    getDevicesByAccess: function(accessFlag){
//     let newFilter = {}
//
//     if(accessFlag!=="ALL")
//       newFilter["accessible"] = accessFlag
//     getResourcesList(50, 50, newFilter).then((newElements)=>{
//       this.setState({
//          list: newElements,
//          filter: newFilter,
//          top: false,
//          lastIndex: null,
//          selected: []
//       })
//     })
//     .catch((error) => "Error on gettingresources with accessible="+accessFlag+":"+error)
//    },
//    searchNow: function(key, value, deleted) {
//         console.log("GET DATA IS CALLED ON SEARCH =)", this.state.filter, key, value, deleted)
//         var filter = this.state.filter
//         var valueArray = []
//         valueArray.push(value)
//         if (key && value){
//           if (filter[key] && !deleted) {
//             filter[key].push(value)
//           } else if (!filter[key] || deleted){
//             filter[key] = valueArray
//           }
//           console.log("GET DATA IS CALLED ON SEARCH", filter, this.state.filter)
//              getResourcesList(0, 0, filter).then((newElements)=>{
//                console.log(newElements)
//                let selectList = [];
//              if (newElements) {
//                // this.props.updateList(newElements)
//                newElements.map((elem) =>
//               {
//                 selectList.push(elem.id)
//               })
//              }
//                this.setState({
//                    list: newElements,
//                    selected: selectList,
//                    filter: filter,
//                    top: false,
//                    lastIndex: null,
//
//                }, (res) => {
//                 //  this.selectAllHandler();
//                  console.log("RAWR RAWR RAWR!!! THIS IS THE SELECTED LIST UPON SEARCH ", this.state.list, this.state.selected)})
//              });
//         } else {
//           filter = {};
//           console.log("GET DATA IS CALLED ON SEARCH", filter, this.state.filter)
//              getResourcesList(0, 50, filter).then((newElements)=>{
//                console.log(newElements)
//                this.setState({
//                    list: newElements,
//                    filter: filter,
//                    top: false,
//                    lastIndex: null,
//                    selected: []
//                }, (res) => {
//                  console.log("RAWR RAWR RAWR!!! THIS IS THE SELECTED LIST UPON SEARCH ", this.state.list, this.state.selected)})
//              });
//         }
//     },
//  // componentDidMount(){
//  //  this.setState({list:getDummyResourcesList(0, 50), selected: []});
//   //   console.log(this.state.list)
//  // },
//  render () {
//    let heightGear = this.state.heightGear;
//     let selectedList = this.state.selected;
//     let dataList = this.state.list
//     // <Col xs={12} lg={12} style={{textAlign:"right",  alignItems: 'flex-start', position: 'absolute', right:'0', bottom:'0', top:'320', marginLeft: "60px", marginRight:"90px", marginBottom:650}}>
//    return (
//    <div>
//       <Row>
//         <Col style={{marginLeft: "60px", marginRight:"60px", marginTop:"30px", width:"1000px"}} lg={12}>
//           <AutoSearch style={{width:"1000px"}}
//             searchNow={this.searchNow}
//             getDataTags={getResourcesTags}
//             />
//             <ActionLinks
//                 selectedResources={this.state.selected}
//                 numResources={this.state.list.length}
//                 numAccessible= {this.state.accessiblityCount}
//                 numInaccessible={this.state.inaccessibleCount}
//                 numSelected={this.state.selected.length}
//                 getDevicesByAccess={this.getDevicesByAccess}/>
//         </Col>
//       </Row>
//      <Row style={{marginRight:"0"}}>
//        <Col xs={12} lg={12}>
//
//          <TestTable
//              columnsList={this.state.columnsList}
//            getTableColumn={this.getTableColumn}
//             list={this.state.list}
//             selected={this.state.selected}
//            updateList = {this.updateList}
//            accessiblityCount={true}
//             onClickHandler={this.onClickHandler}
//             selectAllHandler={this.selectAllHandler}
//             all={this.state.all}
//             filter={this.state.filter}
//             rowHeightGetter={this.rowHeightGetter}
//             rowDropdownHeightGetter={this.rowDropdownHeightGetter}
//             rowDropdownGetter={this.rowDropdownGetter}
//            getDataList={getResourcesList}
//            getDataCounts={getResourcesCounts}
//            getDataTags={getResourcesTags}
//             checkboxColumn={
//               <Column
//                 ref="column"
//                 header={
//                   <Cell>
//                   <input type='checkbox' id="selectAllChk"
//                   checked={(dataList.length > 0 && selectedList.length === dataList.length)?true:false}
//                   onClick={this.selectAllHandler}/>
//                   <label htmlFor="selectAllChk"></label>
//                   </Cell>
//                 }
//                 cell={props =>(
//                   <CheckboxCell
//                   {...props}
//                   selectedList={selectedList}
//                   data={dataList} col="id"
//                   ref={(node) => {
//                     let allData;
//                     allData= node}}
//                   onClickHandler={this.onClickHandler} />
//                 )}
//                 width={50}
//               />
//             }
//          />
//        </Col>
//         <Col xs={6} lg={6}></Col>
//           <Col xs={6} lg={6} style={{textAlign:"right",  alignItems: 'flex-start', position: 'absolute', right:'0', bottom:'0', top:'260', marginLeft: "60px", marginRight:"90px", marginBottom:650}}>
//          <ResourceColumnChooserClass
//            toggle={this.columnChooserToggle}
//            columnShow={this.state.columnChooserShow}
//            container={this.refs.resourcesTable}
//            columnsList={this.state.columnsList}
//            changeHandler={this.columnDisplayChangeHandler}
//          />
//        </Col>
//      </Row>
//    </div>
//    )
//  }
// })
//
// export default ResourcesContainers
