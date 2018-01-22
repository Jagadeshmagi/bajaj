import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect } from 'react-redux'
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row} from 'react-bootstrap'
import {Table,Column, Cell} from 'fixed-data-table'
import {Header } from '../Header/Header'
import {AccessCell,ArrayLinkCell,ScoreCell,ComplianceCell,
        GroupCell,TextCell,LinkCell,CheckboxCell, TooltipCell,
        TooltipDataCell, CollapsedRowsCell, TestStatusCell} from '../Table/Table'
import {IpAddressCell} from '../../containers/Infrastructure/ResourceIPAddressCell'
import {ResourceColumnChooserClass} from '../../containers/Infrastructure/ResourceColumnChooserCell'
import {getResourcesList,getResourcesCounts, getResourcesTags,getGroupResourcesTags } from 'helpers/resources'
import {ActionLinks, ActionLinksGroupResources,ColumnChooserPopover} from '../Infrastructure/Resources'
import Dimensions from 'react-dimensions'
import TestTable from '../../containers/Infrastructure/TestTable'
import AutoSearch from '../../containers/Infrastructure/autoSearch';
import {MetaItem,StackedHorizontalBarChart, ReportHeader, ReportTitle, GraphLegendsForHorizontal} from '../Report/ReportCommon'
import AttributeConstants from 'constants/AttributeConstants'
import {SpinnyLogo} from 'containers'
import AlertComponent from 'components/Common/AlertComponent'
import {findElement} from 'javascripts/util.js'

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

Array.prototype.delete = function (index) {
  this.splice(index, 1);
};


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

const ResourcesContainers = React.createClass({
	getInitialState(){
		return {
			list:[],
      firstResource:"",
      colSortDirs:{},
			selected: [],
      filter:{sortby: "ipaddress", orderby: "desc"},
			columnChooserShow:false,
			accessiblityCount:0,
			inaccessibleCount:0,
			heightGear:null,
      loadingDiv:true,
			// columnsList:[
			// 	{name:'ipaddress', displayText:'IP Address', show:true, columnName: "IP ADDRESS", width:"130"},
			// 	{name:'hostName', displayText:'Name', show:true, columnName: "NAME", width:"125"},
			// 	{name:'osName', displayText:'OS', show:true, columnName: "OS", width:"75"},
			// 	{name:'complianceStatus', displayText:'Compliance', show:true,	columnName: "COMPLIANCE", width:"130",},
			// 	{name:'assessmentStatus', displayText:'Test Status', show:true,	columnName: "TEST STATUS", width:"240"},
			// 	{name:'accessible', displayText:'Access', show:true, columnName: "ACCESS", width:"70"},
			// 	{name:'groupNames', displayText:'Group Name', show:true, columnName: "GROUP NAME", width:"200"},
			// 	{name:'environment', displayText:'Environment', show:true, columnName: "ENVIRONMENT", width:"150"},
			// 	{name:'lastScanTime', displayText:'Last time scanned',show:false,	columnName: "LAST SCAN", width:"200"},
			// 	{name:'vpcId', displayText:'VPC ID', show:false, columnName: "VPC ID", width:"100"},
			// 	{name:'regions', displayText:'Availability zone', show:false,	columnName: "AVAILABILITY ZONE", width:"150"},
			// 	{name:'tags', displayText:'TAGs', show:false,	columnName: "TAGS", width:"200"}
			// ],
      columnsList:[
        {name:'ipaddress', displayText:'IP Address', show:true, columnName: "IP ADDRESS", width:130},
        {name:'hostName', displayText:'Name', show:true, columnName: "NAME", width:125},
        {name:'osName', displayText:'OS', show:true, columnName: "OS", width:120},
        {name:'complianceStatus', displayText:'Compliance', show:true,  columnName: "COMPLIANCE", width:100,},
        {name:'assessmentStatus', displayText:'Assessment Status', show:true, columnName: "ASSESSMENT STATUS", width:120},
        {name:'accessible', displayText:'Access', show:true, columnName: "ACCESS", width:70},
        {name:'groupNames', displayText:'Group Name', show:true, columnName: "GROUP NAME", width:200},
        {name:'environment', displayText:'Environment', show:true, columnName: "ENVIRONMENT", width:200},
        {name:'lastScanTime', displayText:'Last time scanned',show:false, columnName: "LAST SCAN", width:120},
        {name:'vpcId', displayText:'VPC ID', show:false, columnName: "VPC ID", width:120},
        {name:'regions', displayText:'Availability zone', show:false, columnName: "AVAILABILITY ZONE", width:170},
        {name:'dockerenabled', displayText:'Docker Enabled', show:false, columnName: "DOCKER ENABLED", width:225},
        // {name:'tags', displayText:'TAGs', show:false,  columnName: "TAGS", width:"200"}
      ],
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
		}
	},
	componentDidMount () {
		let heightWindow = window.innerHeight;
		let heightGear = heightWindow - 360;
    let defaultFilter = {groupnames: []}
    let groupName = this.props.routeParams.groupName
    defaultFilter.groupnames.push(groupName)
		this.setState({
			heightGear: heightGear,
      filter:defaultFilter
		})
    // this._onSortChange(this.state.filter.sortby, this.state.filter.orderby)

    getResourcesList(0, 0, defaultFilter, true)
    .then((resources) => {
      this.setState({loadingDiv:false})
      if(resources.resources.length>0){
        console.log("RESOURCESRESOURCES", resources)
        this.setState({
          list:resources.resources,
          accessiblityCount:resources.accessible,
          inaccessibleCount:resources.inaccessible
        })
      }
    })
    .catch((error) => console.log("Error in getting resourcescounts list:"+error))

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
		// this.setState({columnsList:newColumnsList})
		console.log("AFTER STATEMENT", this.state.columnsList)
	},
  onClickHandler(e) {
    let chkVal = parseInt(e.target.id);
    const index = this.state.selected.indexOf(chkVal)
    let newList = this.state.selected.slice();
    if (index === -1)
    {
      newList = newList.concat(chkVal)
      this.setState({
        firstResource:e.target.name
      })
    } else {
      newList.splice(index,1);
    }
    this.setState({selected: newList})
  },
  selectAllHandler(){
    this.setState({all:!this.state.all},
      (res)=>{
        console.log("this.state.all ", this.state.all, this.state.selected)
        if(this.state.all === true){
         let selectList = [];
         let resources = this.state.list;
            resources.map((r) =>
           {
             selectList.push(r.id)
           })
          this.setState({
            selected: selectList,
            list:resources,
         }, (res)=>{console.log("this.state.all back", this.state.all, this.state.selected)});
        //   getResourcesList(0, 0, this.state.filter)
        //  .then((resources) => {
        //    console.log("BAM!, BAM!, BAM!")
        //    let selectList = [];
        //       resources.map((r) =>
        //      {
        //        selectList.push(r.id)
        //      })
        //    this.setState({
        //      selected: selectList,
        //      list:resources,
        //   }, (res)=>{console.log("this.state.all back", this.state.all, this.state.selected)});
        //  })
        //   .catch((error) => console.log("Error in getting resources list:"+error))
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
    let collapsedRows = this.state.collapsedRows;
    if (collapsedRows.has(rowIndex)) {
      collapsedRows.delete(rowIndex)
    } else {
      collapsedRows.add(rowIndex, {});
    }
    this.setState({
      collapsedRows: collapsedRows
    });
  },
  rowHeightGetter(index) {
    return this.state.collapsedRows.has(index) ? 64.1 : 64;
  },

  rowDropdownHeightGetter(index) {
    return this.state.collapsedRows.has(index) ? 250 : 0;
  },

  rowDropdownGetter(index) {
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
    var df = this.state.deviceConfiguration;
    var cd = this.state.cloudDetails;
    var ppC = this.state.ppComplianceStatus;
    // var ppC = this.state.ppComplianceStatus.splice(0,6);
    return (
      <div style={style}>
        <Row style={{marginLeft:"20px", marginRight:"20px", borderTop:'2px solid #E5EAF4', paddingTop:"20px"}}>
          <Col lg={3}>
            <div>Device Configuration</div>
            <br></br>
            <div style = {colStyle}>
              <div>Instance ID:&nbsp;&nbsp;{df.instanceID} </div>
              <div>Instance Type:&nbsp;&nbsp;{df.instanceType} </div>
              <div>Instance State:&nbsp;&nbsp;{df.instanceState} </div>
              <div>Private IP:&nbsp;&nbsp;{df.privateIP} </div>
              <div>Public IP:&nbsp;&nbsp;{df.publicIP} </div>
              <div>OS Type:&nbsp;&nbsp;{df.osType} </div>
              <div>OS Version:&nbsp;&nbsp;{df.osVersion} </div>
            </div>
          </Col>
          <Col lg={3}>
            <div>Cloud Details</div>
            <br></br>
              <div style = {colStyle}>
                <div>Cloud Type:&nbsp;&nbsp;{cd.cloudType} </div>
                <div>Region:&nbsp;&nbsp;{cd.region} </div>
                <div>VPC ID:&nbsp;&nbsp;{cd.vpcID} </div>
                <div>Security Group:&nbsp;&nbsp;{cd.securityGroup} </div>
                <div>Subnet ID:&nbsp;&nbsp;{cd.subnetID} </div>
                <div style={{opacity: '0'}}> .</div>
                <div style={{opacity: '0'}}> .</div>
              </div>
          </Col>
          <Col lg={6}>
            <div>Policy Pack and Compliance Status</div>
            <br></br>
              { ppC.map((status) =>
                {
                  return  (
                    <Row style = {colStyle}>
                      <Col lg={3}>
                        <div>{status[0]}</div>
                      </Col>
                      <Col lg={4}>
                        <div>{status[1]}</div>
                      </Col>
                      <Col lg={2}>
                        <div>{status[2]}</div>
                      </Col>
                    </Row>
                )}
              )}
          </Col>
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
	getTableColumn: function(colName){
			let colObj = findElement(this.state.columnsList,"name",colName);
			let dataList = this.state.list;
			if(colObj != null && colObj["show"]){

				switch(colName){
					case 'ipaddress' :
						return <Column
            isReorderable={true}
              isResizable={true}
              columnKey="ipaddress"
              align='center'
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.ipaddress}>
                  IP ADDRESS
                </SortHeaderCell>
              }
              flexGrow={2}
              //cell={<CollapsedRowsCell col="ipaddress" data={dataList} callback={this.handleCollapseClick} collapsedRows={this.state.collapsedRows} />}
							cell={<TextCell data={dataList} col="ipaddress" />}
							width={colObj['width']} />
					case 'hostName' :
						return <Column
             isReorderable={true}
              isResizable={true}
              columnKey="hostName"
              align='center'
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.hostName}>
                  NAME
                </SortHeaderCell>
              }
							flexGrow={2}
							cell={<TooltipCell data={dataList} col="hostName"/>}
							width={colObj['width']} />
					case 'osName' :
						return <Column
              align='center'
              isReorderable={true}
              isResizable={true}
              columnKey="osName"
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
							flexGrow={2}
							cell={<ComplianceCell data={dataList} statusCol="complianceStatus"/>}
							width={colObj['width']}  />
          case 'assessmentStatus' :
						return <Column
              align='center'
               isReorderable={true}
              isResizable={true}
              columnKey="assessmentStatus"
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.test_status}>
                  ASSESSMENT STATUS
                </SortHeaderCell>
              }
							flexGrow={1}
						  cell={<TestStatusCell data={dataList} col="testStatus" width={colObj['width']}/>}
							width={colObj['width']}  />
					case 'accessible' :
						return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="accessible"
              align='center'
              header={
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.accessible}>
                  ACCESS
                </SortHeaderCell>
              }
							flexGrow={1}
							cell={<AccessCell data={dataList} col="accessible"/>}
							width={colObj['width']}  />
					case 'groupNames':
						return <Column
              align='center'
              isReorderable={true}
              isResizable={true}
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
							width={colObj['width']}  />
          case 'environment':
						return <Column
            isReorderable={true}
              isResizable={true}
              columnKey="environment"
              align='center'
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
              case 'lastScanTime':
    						return <Column
                  align='center'
                  //columnKey="endtime"
                  isReorderable={true}
              isResizable={true}
              columnKey="lastScanTime"
    							flexGrow={1}
                  header={
                    <SortHeaderCell
                      onSortChange={this._onSortChange}
                      sortDir={this.state.colSortDirs.endtime}>
                      LAST SCAN
                    </SortHeaderCell>
                  }
    							cell={<TooltipCell data={dataList} col="enddate"/>}
    							width={colObj['width']}  />
    					case 'vpcId':
    						return <Column
                  align='center'
                 // columnKey="vpcId"
  isReorderable={true}
              isResizable={true}
              columnKey="vpcId"
    							flexGrow={2}
                  header={
                    <SortHeaderCell
                      onSortChange={this._onSortChange}
                      sortDir={this.state.colSortDirs.vpcId}>
                      VPC ID
                    </SortHeaderCell>
                  }
    							cell={<TextCell data={dataList} col="vpcid"/>}
    							width={colObj['width']}  />
    					case 'regions':
    						return <Column
                  align='center'
                  //columnKey="availabilityzone"
 isReorderable={true}
              isResizable={true}
              columnKey="regions"
    							flexGrow={2}
                  header={
                    <SortHeaderCell
                      onSortChange={this._onSortChange}
                      sortDir={this.state.colSortDirs.availabilityzone}>
                      AVAILABILITY ZONE
                    </SortHeaderCell>
                  }    							cell={<TooltipCell data={dataList} col="availabilityzone"/>}
    							width={colObj['width']}  />
    					// case 'tags':
    					// 	return <Column
              //     align='center'
    					// 		header={<Cell>TAGS</Cell>}
    					// 		flexGrow={2}
    					// 		cell={<TextCell data={dataList} col="tagset"/>}
    					// 		width={200}  />
              case 'dockerenabled' :
                return <Column
                  align='center'
                    isReorderable={true}
              isResizable={true}
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
    let group = this.props.routeParams.groupName
    this.setState({loadingDiv:true})

    if(group){
      let groupNames = []
      groupNames.push(group)
      newFilter["groupnames"] = groupNames;
    }

    if(accessFlag!=="ALL")
      newFilter["accessible"] = accessFlag
      console.log("newFilternewFilter")
    getResourcesList(0, 0, newFilter)
    .then((newElements)=>{
        this.setState({
           loadingDiv:false,
           list: newElements,
           filter: newFilter,
           top: false,
           lastIndex: null,
           selected: []
        })

    })
    .catch((error) => "Error on gettingresources with accessible="+accessFlag+":"+error)
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
          if (newElements) {
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
        let filter = {groupnames: []}
        let groupName = this.props.routeParams.groupName
        filter.groupnames.push(groupName)

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
          console.log("GET DATA IS CALLED ON SEARCH =)", key)
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
             if(!deleted) {
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
             }
       },

   refreshList(){
     this.setState({list:[],dataLoad:false},function(){
     // getResourcesList(this.state.list.length+50, 50, this.state.filter)
     getResourcesList(50, 50, this.state.filter)
     .then((resources) => {
       if(resources){
         this.setState({
           list:resources,dataLoad:true
         })
       }
     })
     .catch((error) => console.log("Error in getting resourcescounts list:"+error))
     })
     // this.getGroupsList(true);
     // Have to call the resource list function
   },
	render () {
		let heightGear = this.state.heightGear;
    let selectedList = this.state.selected;
    let dataList = this.state.list
    let worklogId = this.props.routeParams.worklogId
    let groupName = this.props.routeParams.groupName
    // <Col xs={12} lg={12} style={{textAlign:"right",  alignItems: 'flex-start', position: 'absolute', right:'0', bottom:'0', top:'320', marginLeft: "60px", marginRight:"90px", marginBottom:650}}>
	  return (
	  <div>
    <ReportHeader name={groupName} />
      {this.state.loadingDiv?
        <div style={{margin:'0 auto',paddingTop:'100px', marginLeft:'500px'}}>
          <SpinnyLogo />
        </div>
        :<div id="GroupResourceTable">
          <Row>
            <Col style={{marginLeft: "60px", marginRight:"60px", marginTop:"30px", width:"1000px"}} lg={12}>
              <AutoSearch style={{width:"1000px"}}
                offSet={100}
                searchNow={this.searchNow}
                deleteNow={this.deleteNow}
                getDataTags={getGroupResourcesTags}
                className="plainTable"
                />
                <ActionLinksGroupResources
                    firstResource={this.state.firstResource}
                    refreshList={this.refreshList}
                    groupName={this.props.routeParams.groupName}
                    list={this.state.list}
                    selectedResources={selectedList}
                    numAccessible= {this.state.accessiblityCount}
                    numInaccessible={this.state.inaccessibleCount}
                    numSelected={selectedList.length}
                    getDevicesByAccess={this.getDevicesByAccess}/>
            </Col>
          </Row>
    	    <Row style={{marginRight:"0"}}>
    				<Col xs={12} lg={12}>

    					<TestTable
                large={'yes'}
                isInfiniteScroll="noScroll"
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
    						getDataTags={getGroupResourcesTags}
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
            <Col xs={6} lg={6}></Col>
              <Col xs={6} lg={6} style={{textAlign:"right",  height:'20px', alignItems: 'flex-start', position: 'absolute', right:'0', bottom:'0', top:'160', marginLeft: "60px", marginRight:"90px",height:"20px"}}>
    					<ResourceColumnChooserClass
    						toggle={this.columnChooserToggle}
    						columnShow={this.state.columnChooserShow}
    						container={this.refs.resourcesTable}
    						columnsList={this.state.columnsList}
    						changeHandler={this.columnDisplayChangeHandler}
    					/>
    				</Col>
    	    </Row>
        </div>
      }
      </div>
	  )
	}
})

export default ResourcesContainers
