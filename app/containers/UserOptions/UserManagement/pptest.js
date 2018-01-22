import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect } from 'react-redux'
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row, Nav, NavItem, MenuItem, NavDropdown} from 'react-bootstrap'
import {spacer} from 'sharedStyles/styles.css'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange, diamond, triangleup, sevcircle} from './styles.css'
import {Table,Column, Cell} from 'fixed-data-table'
import {Header } from 'components/Header/Header'
import {AccessCell,ArrayLinkCell,ScoreCell, ScoreCell2, ComplianceCell,GroupCell,TextCell,LinkCell,CheckboxCell, TooltipCell, TooltipDataCell, CollapsedRowsCell2} from 'components/Table/Table'
import {ResourceColumnChooserClass} from '../../Infrastructure/ResourceColumnChooserCell'
import {getResourcesList,getResourcesCounts, getResourcesTags, getDeviceDetailsById, getDeviceDetailsComplianceHistoryById,getDiscoverList} from 'helpers/resources'
import {ActionLinksUsers,ColumnChooserPopover} from 'components/Infrastructure/Resources'
import Dimensions from 'react-dimensions'
import TestTable from "../../Infrastructure/TestTable"
import AutoSearch from '../../Infrastructure/autoSearch';
import AttributeConstants from 'constants/AttributeConstants'
import refreshIcon1 from 'assets/refreshIcon1.png'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {SpinnyLogo} from 'containers'
import moment from 'moment'
import {pptestsearch} from 'helpers/cloud'
import {RuleDetails} from '../../PolicyPacksList/RuleDetails'

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

const pptest = React.createClass({
  getInitialState(){
    return {
      ruleNodesToLoad:[],
      list:[],
      selected: [],
      colSortDirs:{},
      filter:{sortby: "ipaddress", orderby: "desc"},
      columnChooserShow:false,
      accessiblityCount:'',
      inaccessibleCount:'',
      heightGear:null,
      columnsList:[
        {name:'ipaddress', displayText:'IP Address', show:true, columnName: "USER NAME", width:560}
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
        "regions": [],
        "securityGroup": [],
        "credentials": [
        ]
      },
      test2:[],
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
    this.setState({list:[]},function(){
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
  },
  componentDidMount () {
    let heightWindow = window.innerHeight;
    let heightGear = heightWindow - 360;
    this.setState({
      heightGear: heightGear
    })
    this._onSortChange(this.state.filter.sortby, this.state.filter.orderby)
    // this.searchNow("*")

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
    this.context.router.replace(navPath);


  },
  showDockerImage(){
    let navPath='/infrastructure/dockerTab';
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
    let that=this;
    this.state.columnsList.forEach(function(col){
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
    console.log("AFTER STATEMENT", this.state.columnsList)
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
    var environment = this.state.list[index].assetType
    if(environment !== "ONPREM"){
      return this.state.collapsedRows.has(index) ? 0 : 0;
    } else {
      return this.state.collapsedRows.has(index) ? 0 : 0;
    }
  },

  callSaveData(index, id){
    var itemById = this.state.list.filter(function(item){console.log("this is filter in progress ", id, item.id); return item.id == id})[0].tagset;
    let currentTagsList = this.state.tagsList;
    currentTagsList[index] = itemById;
    this.setState({
      tagsList:currentTagsList
    })

    getDeviceDetailsComplianceHistoryById(id)
      .then((response)=>{
        let currentCHList = this.state.complianceHistory;
        currentCHList[index] = response;
        this.setState({
          complianceHistory:currentCHList
        })
      })
      .catch((error)=>{
        console.log("Error in getting getDeviceDetailsComplianceHistory by id", error)
      })
    getDeviceDetailsById(id)
      .then((response)=>{
        let currentDDList = this.state.deviceDetails;
        currentDDList[index] = response;
        this.setState({
          deviceDetails:currentDDList
        }, (res)=>{
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
    return  tagsArray;
  },

  rowDropdownGetter(index) {
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
      } else if(environment === "GOOGLE") {
      console.log
        setTagList = this.makeTagList(google);
        setTagString = setTagList?setTagList.join(", "):""
      } else if(environment === "PULSAR") {
        setTagList = this.makeTagList(pulsar);
        setTagString = setTagList?setTagList.join(", "):""
      } else if(environment === "AZURE") {
        setTagList = this.makeTagList(azure);
        setTagString = setTagList?setTagList.join(", "):""
      }
    var style = {
      height: '100%',
      width: '100%',
    };
    var colStyle = {borderRight:'2px solid #E5EAF4'}
    var titleStyle = {fontWeight: 'bold'}

    var deviceDetails = this.state.deviceDetails[index-1];
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
            <div>Last Scan Time:&nbsp;&nbsp;{ch[0] && ch[0].test_date?moment.utc(ch[0].test_date).local().format('MMM DD HH[:]mm'):'-'} </div>
            <div>Credentials:&nbsp;&nbsp;{!dd.credentials || dd.credentials.length == 0?'-':dd.credentials.join(", ")} </div>
          </div>
        </Col>
      );
      tagsEnvironment = (
        <Col lg={12}>
        </Col>
      );
    } else {
      details = (
        <div>
        <Col lg={3}>
          <div style = {titleStyle}>Device Configuration</div>
          <br></br>
          <div style = {colStyle}>
            <div>Instance ID:&nbsp;&nbsp;{!dd.instanceId?'-':dd.instanceId} </div>
            <div>Instance Type:&nbsp;&nbsp;{!dd.instanceType?'-':dd.instanceType} </div>
            <div>Instance State:&nbsp;&nbsp;{!dd.instanceState?'-':dd.instanceState} </div>
            <div>Private IP:&nbsp;&nbsp;{!dd.privateIp?'-':dd.privateIp} </div>
            <div>Public IP:&nbsp;&nbsp;{!dd.publicIp?'-':dd.publicIp} </div>
            <div>OS Name:&nbsp;&nbsp;{!dd.OSType?'-':dd.OSType} </div>
            <div>OS Version:&nbsp;&nbsp;{!dd.OSVersion?'-':dd.OSVersion} </div>
          </div>
        </Col>
        <Col lg={3}>
          <div style = {titleStyle}>Cloud Details</div>
          <br></br>
            <div style = {colStyle}>
              <div>Cloud Type:&nbsp;&nbsp;{!dd.cloudType?'-':dd.cloudType} </div>
              <div>Region:&nbsp;&nbsp;{!dd.regions?'-':dd.regions} </div>
              <div>VPC ID:&nbsp;&nbsp;{!dd.vpcId?'-':dd.vpcId} </div>
              <div>Key Pair:&nbsp;&nbsp;{!dd.keypair?'-':dd.keypair} </div>
              <div>Security Group:&nbsp;&nbsp;{!dd.securityGroup || dd.securityGroup.length == 0 ?'-':dd.securityGroup.join(" ,")} </div>
              <div>Subnet ID:&nbsp;&nbsp;{!dd.subnetId?'-':dd.subnetId} </div>
              <div style={{opacity: '0'}}> .</div>
            </div>
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
if (this.state.ruleNodesToLoad.length > 0){
  console.log("this.state.ruleNodesToLoad[index]._source.id", this.state.ruleNodesToLoad[index]._source.id)
}
    return (
      <div style={style}>
        <Row style={{marginLeft:"20px", marginRight:"20px", marginBottom:"40px", borderTop:'2px solid #E5EAF4', paddingTop:"20px"}}>
          {this.state.ruleNodesToLoad.length > 0
            ?
            <RuleDetails key={this.state.ruleNodesToLoad[index]._source.id} ruleId={this.state.ruleNodesToLoad[index]._source.id}/>
            :
            <div>hello</div>
          }
        </Row>
      </div>
    )
  },


  _onSortChange(columnKey, sortDir) {
    var sortFilters = this.state.filter;
    sortFilters.sortby = columnKey
    sortFilters.orderby = sortDir
    this.setState({
      filter:sortFilters
    }, ()=>{
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
    this.setState({
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  },
  getTableColumn: function(colName,width){
      let colObj = findElement(this.state.columnsList,"name",colName);
      let dataList = this.state.list;
      if(colObj != null && colObj["show"]){
        switch(colName){
          case 'ipaddress' :
            return <Column
              columnKey="ipaddress"
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.ipaddress}>
                  SEARCH RESULTS
                </SortHeaderCell>
              }
              flexGrow={1}
              cell={<CollapsedRowsCell2 style={{paddingLeft:"55"}} col="ipaddress" data={dataList} callback={this.handleCollapseClick} collapsedRows={this.state.collapsedRows} />}
              width={colObj['width']} />
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
     data.key = oneFilter.slice(colons[0]+1, colons[1])
     data.value = oneFilter.slice(colons[1]+1, oneFilter.length)
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
          if (newElements) {
            newElements.map((elem) =>
           {
             selectList.push(elem.id)
           })
          }
            this.setState({
                list: newElements,
                selected: selectList,
                top: false,
                lastIndex: null,

            }, (res) => {
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

  searchNow(e){
    // pptestsearch(e.target.value)
//     {
//   "query":"npt and cis",
//   "fields":["description", "title", "_id","severity","type","cceid","nistid"],
//   "index":"rules",
//   "type":"ru",
//   "size": 10
// }
    // console.log("asdfaksdfjaslkfdjlasf", e.target.value)
    let payload = {};
    payload.fields = ["description", "title", "_id","severity","type","cceid","nistid"];
    payload.index = "rules";
    payload.type = "ru";
    payload.size = 10;
    payload.fron = 0;
    payload.query = e;
    console.log("asdfaksdfjaslkfdjlasf", e, payload)

    pptestsearch(payload)
    .then((res)=>{
      console.log("THIS IS THE RES", res.output.hits.hits)
      let results = res.output.hits.hits
      this.setState({
          list: results,
          ruleNodesToLoad: results
      })
    })
  },

  _handleKeyPress: function(e) {
    if (e.key === 'Enter') {
      this.searchNow(e.target.value)
    }
  },

  render () {
    let heightGear = this.state.heightGear;
    let selectedList = this.state.selected;
    let dataList = this.state.list
    return (
    <div>
    {(this.state.dataLoad)?
    <div>
      <Row>
        <Col style={{marginLeft: "60px", marginRight:"60px", marginTop:"30px", width:"1000px"}} lg={12}>
          <FormGroup controlId="search" className="search">
            <InputGroup style={{marginRight:"60px"}}>
              <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
              <FormControl
                type="text"
                placeholder="Search for reports, policy packs, control families, controls or groups"
                onBlur={this.searchNow}
                onKeyPress={this._handleKeyPress}
                />
            </InputGroup>
          </FormGroup>
          <Row>
            <Col lg={6}>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{marginRight:"0"}}>
        <Col xs={12} lg={12}>
          <TestTable
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
          />
        </Col>
        <Col xs={6} lg={6}></Col>
          <Col xs={6} lg={6} style={{textAlign:"right",  alignItems: 'flex-start', position: 'absolute', right:'0', bottom:'0', top:'262', marginLeft: "60px", marginRight:"35px", height:"20px"}}>
            <Col xs={4} lg={4}></Col>
              <div style={{display: 'flex',justifyContent:'flex-end'}}>
                <div id="refresh" style={{margin:'9px 10px', cursor:'pointer'}}>

                </div>
                <div style={{margin:'0px 5px', cursor:'pointer'}}>

                </div>
              </div>
        </Col>
      </Row>
      </div>
      : <div style={{marginTop:280}}><SpinnyLogo /></div>}
    </div>
    )
  }
})

export default pptest
