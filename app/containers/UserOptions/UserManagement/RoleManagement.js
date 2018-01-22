import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect } from 'react-redux'
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row, Nav, NavItem, MenuItem, NavDropdown, ControlLabel} from 'react-bootstrap'
import {spacer} from 'sharedStyles/styles.css'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange, diamond, triangleup, sevcircle} from './styles.css'
import {Table,Column, Cell} from 'fixed-data-table'
import {Header } from 'components/Header/Header'
import {AccessCell,ArrayLinkCell,ScoreCell, ScoreCell2, ComplianceCell,GroupCell,TextCell,LinkCell,CheckboxCell3, TooltipCell, TooltipDataCell, CollapsedRowsCell, RoleHeader} from 'components/Table/Table'
import {ResourceColumnChooserClass} from '../../Infrastructure/ResourceColumnChooserCell'
import {getResourcesList,getResourcesCounts, getResourcesTags, getDeviceDetailsById, getDeviceDetailsComplianceHistoryById,getDiscoverList} from 'helpers/resources'
import {ActionLinksRole,ColumnChooserPopover} from './UserActions'
import Dimensions from 'react-dimensions'
import TestTable from "../../Infrastructure/TestTable"
import AutoSearch from '../../Infrastructure/autoSearch';
import AttributeConstants from 'constants/AttributeConstants'
import refreshIcon1 from 'assets/refreshIcon1.png'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {SpinnyLogo} from 'containers'
import moment from 'moment'

function findElement(arr, propName, propValue) {
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return arr[i];
}

const UserManagement = React.createClass({
  getInitialState(){
    return {
      list:[],
      lists:[
        {"id":1422,"hostName":"View Dashboards","osName":"Ubuntu 14.04","complianceStatus":"43","testStatus":"COMPLETED","ipaddress":"10.101.39.99","groupnames":"39-Subnet","assetType":"ONPREM","accessible":"True","vpcid":"null","availabilityzone":"null","enddate":"2017-06-15 12:43:28.993","tagset":{"AZURE":{},"PULSAR":{},"AWS":{},"GOOGLE":{}},"dockerenabled":"False"},
        {"id":1422,"hostName":"Manage Cloud Accounts","osName":"Ubuntu 14.04","complianceStatus":"43","testStatus":"COMPLETED","ipaddress":"10.101.39.99","groupnames":"39-Subnet","assetType":"ONPREM","accessible":"True","vpcid":"null","availabilityzone":"null","enddate":"2017-06-15 12:43:28.993","tagset":{"AZURE":{},"PULSAR":{},"AWS":{},"GOOGLE":{}},"dockerenabled":"False"},
        {"id":1422,"hostName":"Create and View Reports","osName":"Ubuntu 14.04","complianceStatus":"43","testStatus":"COMPLETED","ipaddress":"10.101.39.99","groupnames":"39-Subnet","assetType":"ONPREM","accessible":"True","vpcid":"null","availabilityzone":"null","enddate":"2017-06-15 12:43:28.993","tagset":{"AZURE":{},"PULSAR":{},"AWS":{},"GOOGLE":{}},"dockerenabled":"False"},
        {"id":1422,"hostName":"Manage Users","osName":"Ubuntu 14.04","complianceStatus":"43","testStatus":"COMPLETED","ipaddress":"10.101.39.99","groupnames":"39-Subnet","assetType":"ONPREM","accessible":"True","vpcid":"null","availabilityzone":"null","enddate":"2017-06-15 12:43:28.993","tagset":{"AZURE":{},"PULSAR":{},"AWS":{},"GOOGLE":{}},"dockerenabled":"False"},
        {"id":1422,"hostName":"Set Up and Run Discovery","osName":"Ubuntu 14.04","complianceStatus":"43","testStatus":"COMPLETED","ipaddress":"10.101.39.99","groupnames":"39-Subnet","assetType":"ONPREM","accessible":"True","vpcid":"null","availabilityzone":"null","enddate":"2017-06-15 12:43:28.993","tagset":{"AZURE":{},"PULSAR":{},"AWS":{},"GOOGLE":{}},"dockerenabled":"False"}
      ],
      selected: [],
      selected2: [],
      selected3: [],
      selected4: [],
      selected5:[],
      colSortDirs:{},
      filter:{sortby: "ipaddress", orderby: "desc"},
      // filter:{},
      columnChooserShow:false,
      accessiblityCount:'',
      inaccessibleCount:'',
      heightGear:null,
      columnsList:[
        "firstName","lastName","bs","email", "test"
        // {name:'hostNames', displayText:'Name', show:true, columnName: "ACTION", width:80},
        // {name:'ipaddress', displayText:'IP Address', show:true, columnName: "SUPER ADMIN", width:160},
        // {name:'hostName', displayText:'Name', show:true, columnName: "ADMIN", width:185},
        // {name:'osName', displayText:'OS', show:true, columnName: "EDITOR", width:80},
        // {name:'complianceStatus', displayText:'Compliance', show:true,  columnName: "VIEWER", width:150,},
        // {name:'test_status', displayText:'Test Status', show:true,  columnName: "+ ADD CUSTOM", width:150},
        // {name:'accessible', displayText:'Access', show:true, columnName: "+ ADD CUSTOM", width:110},
        // {name:'groupNames', displayText:'Group Name', show:true, columnName: "GROUP ADMIN", width:160},
        // {name:'assettype', displayText:'Environment', show:true, columnName: "ENVIRONMENT", width:155},
        // {name:'endtime', displayText:'Last time scanned',show:false,  columnName: "LAST SCAN", width:120},
        // {name:'vpcId', displayText:'VPC ID', show:false, columnName: "VPC ID", width:120},
        // {name:'availabilityzone', displayText:'Availability zone', show:false,  columnName: "AVAILABILITY ZONE", width:170},
        // {name:'dockerenabled', displayText:'Docker Enabled', show:false, columnName: "DOCKER ENABLED", width:225},
        // {name:'tags', displayText:'TAGs', show:false,  columnName: "TAGS", width:"200"}
      ],
      dataLoad:false,
      all:false,
      collapsedRows: new Set(),

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
    // getResourcesList(this.state.list.length+50, 50, this.state.filter)
    getResourcesList(0, 0)
    .then((resources) => {
      console.log("resources, resources", resources)
      if(resources){
        this.setState({
          list:resources,
          dataLoad:true
        })
      }
    })
    .catch((error) => console.log("Error in getting resourcescounts list:"+error))
    })
    // this.getGroupsList(true);
    // Have to call the resource list function
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
    //     console.log("dfas9sd98sf", resources)
    //     this.setState({
    //       list:resources,
    //       dataLoad:true
    //     }, ()=>{console.log("dfas9sd98sf", resources)})
    //   }
    // })
    // .catch((error) => console.log("Error in getting resourcescounts list:"+error))
    // this._onSortChange(this.state.filter.sortby, this.state.filter.orderby)
this.refreshList();
      // getResourcesCounts()
      // .then((countsData) => {
      //   if(countsData){
      //     this.setState({
      //       accessiblityCount:countsData.accessible,
      //       inaccessibleCount:countsData.inaccessible
      //     })
      //   }
      // })
      // .catch((error) => console.log("Error in getting resourcescounts list:"+error))
  },

  onClickHandler(e, matrix) {
    // console.log("BAM!BAM!BAM!BAM!BAM!BAM!BAM!BAM!", e, e.target, e.target.value)
    let chkVal = parseInt(e.target.getAttribute("data-custom"));
    console.log("BAM!BAM!BAM!BAM!BAM!BAM!BAM!BAM!", e, e.target, e.target.data, chkVal)

    let selected = [];
    let selectedList = e.target.value;
    if(e.target.value === "selected"){
      selected = this.state.selected
      // selectedList=e.target.value
    } else if(e.target.value === "selected2"){
      selected = this.state.selected2
      // selectedList=e.target.value
    } else if(e.target.value === "selected3"){
      selected = this.state.selected3
      // selectedList=e.target.value
    } else if(e.target.value === "selected4"){
      selected = this.state.selected4
      // selectedList=e.target.value
    } else if(e.target.value === "selected5"){
      selected = this.state.selected5
      // selectedList=e.target.value
    }
    // console.log("BAM!BAM!BAM!BAM!", selected)
    const index = selected.indexOf(chkVal)
    // console.log("BAM!BAM!BAM!BAM!", e, e.target, e.target.value,selected, typeof(selected), index)
    // console.log("BAM!BAM!BAM!BAM!", selected, index)

    let newList = selected.slice();
    console.log("BAM!BAM!BAM!BAM!", selected, index, newList)

    if (index === -1)
    {
      newList = newList.concat(chkVal)
    } else {
      newList.splice(index,1);
    }
    let newListObj = {};
    newListObj[selectedList] = newList
    console.log("omgg, whats going on???1", newListObj)
    this.setState(newListObj, ()=>{console.log("omgg, whats going on???", this.state.selected, this.state.selected2, this.state.selected3, this.state.selected4)})
  },
  selectAllHandler(test){
    console.log("this is the test", test)
    // if(!this.state.all){
    //   this.setState({dataLoad:false});
    // }
    this.setState({all:!this.state.all}
    ,
      (res)=>{
        console.log("this.state.all ", this.state.all, this.state.selected)
        if(this.state.all === true){
             let selectList = [];
                this.state.list.map((r) =>
               {
                 selectList.push(r.id)
               })
          this.setState({
            selected:selectList
          })
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
        //      dataLoad:true
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
  // selectAllHandler(){
  //   // if(!this.state.all){
  //   //   this.setState({dataLoad:false});
  //   // }
  //   this.setState({all:!this.state.all})
  //   // ,
  //     // (res)=>{
  //     //   console.log("this.state.all ", this.state.all, this.state.selected)
  //       if(this.state.all === true){
  //     //     getResourcesList(0, 0, this.state.filter)
  //     //    .then((resources) => {
  //     //      console.log("BAM!, BAM!, BAM!")
  //          let selectList = [];
  //             resources.map((r) =>
  //            {
  //              selectList.push(r.id)
  //            })
  //          this.setState({
  //            selected: selectList,
  //           //  list:resources,
  //           //  dataLoad:true
  //         }, (res)=>{console.log("this.state.all back", this.state.all, this.state.selected)});
  //     //    })
  //     //     .catch((error) => console.log("Error in getting resources list:"+error))
  //       } else if (this.state.all === false){
  //         this.setState({
  //           selected: []
  //         })
  //       }
  //     // })
  // },

  saveRoleSuccess(roleName){
    let currRoleList = this.state.columnsList;
    currRoleList.push(roleName);
    this.setState({
      columnsList:currRoleList
    })
  },

  getTableColumn: function(colName,width){

      let colObj = findElement(this.state.columnsList,"name",colName);
      let dataList = this.state.list;
      if(colObj != null && colObj["show"]){
//alert(colObj['width']);
        switch(colName){
          case 'hostNames' :
            return <Column
              // style={{marginLeft:"30"}}
              columnKey="hostName"
              isReorderable={true}
              isResizable={true}
              header={
                <div style={{height:"80", marginLeft:"30"}}>
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={this.state.colSortDirs.hostName}>
                    ACTION
                  </SortHeaderCell>
                </div>
              }
              flexGrow={2}
              cell={<TextCell style={{marginLeft:"30"}} data={dataList} col="hostName"/>}
              width={colObj['width']}  />
          // case 'ipaddress' :
          //
          //   return <Column
          //     // align='center'
          //     // header={<Cell>SUPER ADMIN</Cell>}
          //     isReorderable={true}
          //     isResizable={true}
          //     columnKey="ipaddress"
          //     header={
          //       <SortHeaderCell
          //         onSortChange={this._onSortChange}
          //         sortDir={this.state.colSortDirs.ipaddress}>
          //         SUPER ADMIN
          //       </SortHeaderCell>
          //     }
          //     flexGrow={1}
          //     cell={<CollapsedRowsCell style={{paddingLeft:"55"}} col="ipaddress" data={dataList} callback={this.handleCollapseClick} collapsedRows={this.state.collapsedRows} />}
          //     // cell={<TextCell data={dataList} col="ipaddress" />}
          //     width={colObj['width']} />
          // case 'hostName' :
          //   return <Column
          //     align='center'
          //     columnKey="hostName"
          //     isReorderable={true}
          //     isResizable={true}
          //     header={
          //       <SortHeaderCell
          //         onSortChange={this._onSortChange}
          //         sortDir={this.state.colSortDirs.hostName}>
          //         ADMIN
          //       </SortHeaderCell>
          //     }
          //     flexGrow={2}
          //     cell={<TextCell data={dataList} col="hostName"/>}
          //     width={colObj['width']}  />
          // case 'osName' :
          //   return <Column
          //     align='center'
          //     columnKey="osName"
          //     isReorderable={true}
          //     isResizable={true}
          //     header={
          //       <SortHeaderCell
          //         onSortChange={this._onSortChange}
          //         sortDir={this.state.colSortDirs.osName}>
          //         EDITOR
          //       </SortHeaderCell>
          //     }
          //     flexGrow={2}
          //     cell={<TextCell data={dataList} col="osName"/>}
          //     width={colObj['width']}  />
          // case 'complianceStatus' :
          //   return <Column
          //     align='center'
          //     isReorderable={true}
          //     isResizable={true}
          //     columnKey="complianceStatus"
          //     header={
          //       <SortHeaderCell
          //         onSortChange={this._onSortChange}
          //         sortDir={this.state.colSortDirs.complianceStatus}>
          //         VIEWER
          //       </SortHeaderCell>
          //     }
          //     flexGrow={1}
          //     cell={<ComplianceCell data={dataList} statusCol="complianceStatus"/>}
          //     width={colObj['width']}  />
          // case 'test_status' :
          //   return <Column
          //     align='center'
          //     isReorderable={true}
          //     isResizable={true}
          //     columnKey="test_status"
          //     header={
          //       <SortHeaderCell
          //         onSortChange={this._onSortChange}
          //         sortDir={this.state.colSortDirs.test_status}>
          //         + ADD CUSTOM
          //       </SortHeaderCell>
          //     }
          //     flexGrow={1}
          //     cell={({rowIndex, ...props}) => {
          //       let value = (dataList[rowIndex]["testStatus"] && dataList[rowIndex]["testStatus"] !== 'null')? dataList[rowIndex]["testStatus"] : '-';
          //       return(
          //       <Cell {...props}>
          //           {AttributeConstants.TEST_STATUS[value]}
          //       </Cell>
          //       )
          //     }}
          //     width={colObj['width']}  />
          // case 'accessible' :
          //   return <Column
          //     align='center'
          //     isReorderable={true}
          //     isResizable={true}
          //     columnKey="accessible"
          //     header={
          //       <SortHeaderCell
          //         onSortChange={this._onSortChange}
          //         sortDir={this.state.colSortDirs.accessible}>
          //         + ADD CUSTOM
          //       </SortHeaderCell>
          //     }
          //     flexGrow={1}
          //     cell={<AccessCell data={dataList} col="accessible"/>}
          //     width={110}  />



          // case 'groupNames':
          //   return <Column
          //     isReorderable={true}
          //     isResizable={true}
          //     align='center'
          //     columnKey="groupNames"
          //     header={
          //       <SortHeaderCell
          //         onSortChange={this._onSortChange}
          //         sortDir={this.state.colSortDirs.groupNames}>
          //         GROUP NAME
          //       </SortHeaderCell>
          //     }
          //     flexGrow={1}
          //     cell={<TextCell data={dataList} col="groupnames"/>}
          //     // cell={<TextCell data={dataList} col="groupnames"/>}
          //
          //     width={colObj['width']}  />
          // case 'assettype':
          //   return <Column
          //     isReorderable={true}
          //     isResizable={true}
          //     align='center'
          //     columnKey="assettype"
          //     header={
          //       <SortHeaderCell
          //         onSortChange={this._onSortChange}
          //         sortDir={this.state.colSortDirs.assettype}>
          //         ENVIRONMENT
          //       </SortHeaderCell>
          //     }
          //     flexGrow={1}
          //     cell={({rowIndex, ...props}) => {
          //       let value = (dataList[rowIndex]["assetType"] && dataList[rowIndex]["assetType"] !== 'null')? dataList[rowIndex]["assetType"] : '-';
          //       return(
          //       <Cell {...props}>
          //           {AttributeConstants.ASSET_TYPE[value]}
          //       </Cell>
          //       )
          //     }}
          //     width={colObj['width']}  />
          // case 'endtime':
          //   return <Column
          //     align='center'
          //     isReorderable={true}
          //     isResizable={true}
          //     columnKey="endtime"
          //     header={
          //       <SortHeaderCell
          //         onSortChange={this._onSortChange}
          //         sortDir={this.state.colSortDirs.endtime}>
          //         LAST SCAN
          //       </SortHeaderCell>
          //     }
          //     flexGrow={1}
          //     cell={<TextCell data={dataList} col="enddate"/>}
          //     width={colObj['width']}  />
          // case 'vpcId':
          //   return <Column
          //     align='center'
          //     isReorderable={true}
          //     isResizable={true}
          //     columnKey="vpcId"
          //     header={
          //       <SortHeaderCell
          //         onSortChange={this._onSortChange}
          //         sortDir={this.state.colSortDirs.vpcId}>
          //         VPC ID
          //       </SortHeaderCell>
          //     }
          //     flexGrow={2}
          //     cell={<TextCell data={dataList} col="vpcid"/>}
          //     width={colObj['width']}  />
          // case 'availabilityzone':
          //   return <Column
          //     isReorderable={true}
          //     isResizable={true}
          //     align='center'
          //     columnKey="availabilityzone"
          //     header={
          //       <SortHeaderCell
          //         onSortChange={this._onSortChange}
          //         sortDir={this.state.colSortDirs.availabilityzone}>
          //         AVAILABILITY ZONE
          //       </SortHeaderCell>
          //     }
          //     flexGrow={2}
          //     cell={<TextCell data={dataList} col="availabilityzone"/>}
          //     width={colObj['width']}  />
          // // case 'tags':
          // //  return <Column
          // //     align='center'
          // //    header={<Cell>TAGS</Cell>}
          // //    flexGrow={2}
          // //    cell={<TextCell data={dataList} col="tagset"/>}
          // //    width={200}  />
          // case 'dockerenabled' :
          //   return <Column
          //     isReorderable={true}
          //     isResizable={true}
          //     align='center'
          //     header={<Cell>DOCKER ENABLED</Cell>}
          //     flexGrow={5}
          //     cell={<AccessCell data={dataList} col="dockerenabled"/>}
          //     width={colObj['width']}  />
          default :
            return {}
        }
     }
   },

  saveNewRoleName(){
    console.log("Need to integrate with save new name API when available")
  },

  render () {
    const {height, width, containerHeight, containerWidth, ...props} = this.props;

    var containerHeightUse, containerWidthUse;
      containerWidthUse = containerWidth;
      containerHeightUse = containerHeight;

    let heightGear = this.state.heightGear;
    let selectedList = this.state.selected;
    let selectedList2 = this.state.selected2;
    let selectedList3 = this.state.selected3;
    let selectedList4 = this.state.selected4;
    let selectedList5 = this.state.selected5;


    let dataList = this.state.list
    console.log("adadfasfasdfasfasdf", dataList, this.state.dataLoad)
    let that = this;
    // <Col xs={12} lg={12} style={{textAlign:"right",  alignItems: 'flex-start', position: 'absolute', right:'0', bottom:'0', top:'320', marginLeft: "60px", marginRight:"90px"}}>
    return (
    <div>
    {(this.state.dataLoad)?
    <div>
      <Row>
        <Col style={{marginLeft: "60px", marginRight:"60px", marginTop:"30px", width:"1000px"}} lg={12}>
          <Row>
            <Col lg={6} style={{height:"40"}}>
              <ActionLinksRole
                  saveRoleSuccess={this.saveRoleSuccess}
                  selectedResources={this.state.selected}
                  numAccessible= {this.state.accessiblityCount}
                  numInaccessible={this.state.inaccessibleCount}
                  numSelected={this.state.selected.length}
                  cherryPickedDiscover={this.cherryPickedDiscover}/>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col className="table-container" style={{marginLeft: "60px", marginRight:"60px", width:'1000px'}} xs={12} lg={12}>
          <Table
            rowHeight={50}
            headerHeight={100}
            width={containerWidthUse}
            height={containerHeightUse}
            groupHeaderHeight={30}
            rowsCount={dataList.length}
            {...this.props}>
            <Column
              align='center'
              // style={{marginLeft:"30"}}
              columnKey="hostName"
              isReorderable={true}
              isResizable={true}
              header={
                <Cell style={{height:"80", marginLeft:"30"}}>
                  <div style={{height:"80"}}>Action</div>
                </Cell>
              }
              flexGrow={2}
              cell={<TextCell style={{marginLeft:"30"}} data={dataList} col="hostName"/>}
              width={300}  />
            {
              this.state.columnsList.map(function(columnName){
                return <Column
                    align='center'
                    flexGrow={2}
                    // ref="column3"
                    header={
                      <Cell>
                        <div>
                          <EditRoleName width={that.props.width} saveNewRoleName={that.saveNewRoleName}columnName={columnName}/>
                        </div>
                        <div style={{color:'red', fontSize:"11", fontWeight:"100"}}>
                          (Suspended)
                        </div>
                      <input type='checkbox' id={columnName}
                      checked={(dataList.length > 0 && selectedList.length === dataList.length)?true:false}
                      onClick={that.selectAllHandler}
                      ref={input => {
                          if (input) {
                            input.indeterminate = (selectedList.length > 0 && selectedList.length < dataList.length)?true:false;
                          }
                        }}
                      />
                      <label htmlFor={columnName}></label>
                      </Cell>
                    }
                        // cell={<Cell>{columnName}</Cell>}
                        cell={<CheckboxCell3 data={dataList} col="id"/>}
                    // cell={props =>(
                    //   console.log("does this have all the props?", props)
                    //   // <CheckboxCell3
                    //   // {...props}
                    //   // matrix={"selected3"}
                    //   // selectedList={selectedList3}
                    //   // // data={dataList} col="id"
                    //   // onClickHandler={that.onClickHandler} />
                    // )}
                    width={170}
                  />
                // return <Column
                //     columnKey={columnName}
                //     header={ <Cell>Header</Cell>}
                //     cell={<Cell>{columnName}</Cell>}
                //     width={200}
                //     />
                })
            }
          </Table>
          {/*<TestTable
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
            checkBoxMatrix={true}
            checkboxColumn={
              <Column
                align='center'
                ref="column"
                header={
                  <Cell>
                    <div style={{height:"80"}}>SUPER-ADMIN</div>
                  </Cell>
                }
                cell={props =>(
                  <CheckboxCell3
                  {...props}
                  matrix={"selected"}
                  selectedList={selectedList}
                  data={dataList} col="id"
                  onClickHandler={this.onClickHandler} />
                )}
                width={170}
              />
            }
            checkboxColumn2={
              <Column
                align='center'
                ref="column2"
                header={
                  <Cell>
                    <div style={{height:"80"}}>ADMIN</div>
                  </Cell>
                }
                cell={props =>(
                  <CheckboxCell3
                  {...props}
                  matrix={"selected2"}
                  selectedList={selectedList2}
                  data={dataList} col="id"
                  onClickHandler={this.onClickHandler} />
                )}
                width={170}
              />
            }
            checkboxColumn3={
              <Column
                align='center'
                ref="column3"
                header={
                  <Cell>
                    <div style={{marginBottom:15}}>
                      EDITOR
                    </div>
                  <input type='checkbox' id="selectAllChk" className="chkAll"
                  checked={(dataList.length > 0 && selectedList.length === dataList.length)?true:false}
                  onClick={()=>{this.selectAllHandler("testing")}}
                  ref={input => {
                      if (input) {
                        input.indeterminate = (selectedList.length > 0 && selectedList.length < dataList.length)?true:false;
                      }
                    }}
                  />
                  <label htmlFor="selectAllChk"></label>
                  </Cell>
                }
                cell={props =>(
                  <CheckboxCell3
                  {...props}
                  matrix={"selected3"}
                  selectedList={selectedList3}
                  data={dataList} col="id"
                  onClickHandler={this.onClickHandler} />
                )}
                width={170}
              />
            }
            checkboxColumn4={
              <Column
                align='center'
                ref="column4"
                header={
                  <Cell>
                    <div style={{marginBottom:15}}>
                      VIEWER
                    </div>
                  <input type='checkbox' id="selectAllChk" className="chkAll"
                  checked={(dataList.length > 0 && selectedList.length === dataList.length)?true:false}
                  onClick={this.selectAllHandler}
                  ref={input => {
                      if (input) {
                        input.indeterminate = (selectedList.length > 0 && selectedList.length < dataList.length)?true:false;
                      }
                    }}
                  />
                  <label htmlFor="selectAllChk"></label>
                  </Cell>
                }
                cell={props =>(
                  <CheckboxCell3
                  {...props}
                  matrix={"selected4"}
                  selectedList={selectedList4}
                  data={dataList} col="id"
                  onClickHandler={this.onClickHandler} />
                )}
                width={170}
              />
            }
            checkboxColumn5={
              <Column
                align='center'
                ref="column5"
                header={
                  <Cell>
                    <div>
                      CUSTOM ROLE A <Glyphicon style={{color:'#4e56a0', fontSize:"16"}} glyph="glyphicon glyphicon-pencil" />
                    </div>
                    <div style={{color:'red', fontSize:"11", fontWeight:"100"}}>
                      (Suspended)
                    </div>
                  <input type='checkbox' id="selectAllChk" className="chkAll"
                  checked={(dataList.length > 0 && selectedList.length === dataList.length)?true:false}
                  onClick={this.selectAllHandler}
                  ref={input => {
                      if (input) {
                        input.indeterminate = (selectedList.length > 0 && selectedList.length < dataList.length)?true:false;
                      }
                    }}
                  />
                  <label htmlFor="selectAllChk"></label>
                  </Cell>
                }
                cell={props =>(
                  <CheckboxCell3
                  {...props}
                  matrix={"selected5"}
                  selectedList={selectedList5}
                  data={dataList} col="id"
                  onClickHandler={this.onClickHandler} />
                )}
                width={170}
              />
            }
          />*/}
        </Col>

        <Col xs={6} lg={6}></Col>
          <Col xs={6} lg={6} style={{textAlign:"right",  alignItems: 'flex-start', position: 'absolute', right:'0', bottom:'0', top:'262', marginLeft: "60px", marginRight:"35px", height:"20px"}}>
            <Col xs={4} lg={4}></Col>
              <div style={{display: 'flex',justifyContent:'flex-end'}}>


              </div>
        </Col>

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
      </Row>
      </div>
      : <div style={{marginTop:280}}><SpinnyLogo /></div>}
    </div>
    )
  }
})


export default Dimensions(
  {
  getHeight: function(element) {
    return window.innerHeight - 305;
    // return window.innerHeight - 205;
  },
  getWidth: function(element) {
    let widthOffset = window.innerWidth < 680 ? 0 : 240;
    // let widthOffset = window.innerWidth < 680 ? 0 : 140;
    return window.innerWidth - widthOffset;
  }
}
)(UserManagement);


const EditRoleName = React.createClass({
  getInitialState(){
    return {
      edit:false
    }
  },
  allowEdit(){
    // this.refs.inputRole.focus();
    this.setState({
      edit:true
    })
  },
  saveNewRoleName(){
    this.props.saveNewRoleName()
    this.setState({
      edit:false
    })
  },
  checkEnter(e){
    if (e.key === "Enter" || e.key === "Tab"){
      this.saveNewRoleName();
    }
  },
  render() {
    return(
      <span>
        {!this.state.edit?
          <span>{this.props.columnName} <Glyphicon style={{color:'#4e56a0', fontSize:"16", cursor: "pointer"}} glyph="glyphicon glyphicon-pencil" onClick={this.allowEdit}/></span>
        :
          <input type="text"
             ref="inputRole"
             name="GroupLabel"
             defaultValue={this.props.columnName}
             onBlur={this.saveNewRoleName}
             onKeyPress={this.checkEnter}
             placeholder="Enter Role Name"
             style={{width:this.props.width - 20 || 120, height:25, borderRadius:0, textAlign:"center"}}
          ></input>
        }
      </span>
    )
  }
})
