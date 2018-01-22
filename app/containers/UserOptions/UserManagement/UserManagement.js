import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect } from 'react-redux'
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row, Nav, NavItem, MenuItem, NavDropdown} from 'react-bootstrap'
import {spacer} from 'sharedStyles/styles.css'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange, diamond, triangleup, sevcircle} from './styles.css'
import {Table,Column, Cell} from 'fixed-data-table'
import {Header } from 'components/Header/Header'
import {AccessCell,ArrayLinkCell,ScoreCell, ScoreCell2, ComplianceCell,GroupCell,TextCell,LinkCell,CheckboxCellUser, TooltipCell, TooltipDataCell, CollapsedRowsCell} from 'components/Table/Table'
import {ResourceColumnChooserClass} from '../../Infrastructure/ResourceColumnChooserCell'
import {getResourcesList,getResourcesCounts, getResourcesTags, getDeviceDetailsById, getDeviceDetailsComplianceHistoryById,getDiscoverList} from 'helpers/resources'
// import {ActionLinksUsers,ColumnChooserPopover} from 'components/Infrastructure/Resources'
import {ActionLinksUsers} from './UserActions'
import Dimensions from 'react-dimensions'
import TestTable from "../../Infrastructure/TestTable"
import AutoSearch from '../../Infrastructure/autoSearch';
import AttributeConstants from 'constants/AttributeConstants'
import refreshIcon1 from 'assets/refreshIcon1.png'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {SpinnyLogo} from 'containers'
import moment from 'moment'

import {getAllUsers} from 'helpers/user'



// Object.prototype.map = function(o, f, ctx) {
//     ctx = ctx || this;
//     var result = {};
//     Object.keys(o).forEach(function(k) {
//         result[k] = f.call(ctx, o[k], k, o);
//     });
//     return result;
// }

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

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

// Array.prototype.insert = function (index, item) {
//   this.splice(index, 0, item);
// };
//
// Array.prototype.delete = function (index) {
//   this.splice(index, 1);
// };

function findElement(arr, propName, propValue) {
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return arr[i];
}

const UserManagement = React.createClass({
  getInitialState(){
    return {
      list:[],
      selectedUserName:"",
      selectedSuspended:"",
      selected: [],
      colSortDirs:{},
      filter:{sortby: "ipaddress", orderby: "desc"},
      // filter:{},
      columnChooserShow:false,
      accessiblityCount:'',
      inaccessibleCount:'',
      heightGear:null,
      columnsList:[
        {name:'username', show:true, columnName: "USER NAME", width:160},
        {name:'email', show:true, columnName: "EMAIL", width:185},
        {name:'roles', show:true, columnName: "ROLE", width:80},
        {name:'department', show:true,  columnName: "DEPARTMENT", width:150,},
        {name:'created', show:true,  columnName: "CREATED", width:170},
        // {name:'accessible', show:true, columnName: "LAST LOGIN", width:110},
        {name:'active', show:true, columnName: "STATUS", width:160},
      ],
      dataLoad:false,
      all:false,
      // collapsedRows: new Set(),
    }
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },

  saveUserSuccess(){
    Alert.show("User is added successfully and password is sent to the user's email address.","ADD USER")
    this.refreshList();
  },

  refreshList(){
    this.setState({list:[]},function(){
    // getAllUsers(this.state.list.length+50, 50, this.state.filter)
    getAllUsers()
    .then((users) => {
      if(users){
        this.setState({
          list:users
        })
      }
    })
    .catch((error) => console.log("Error in getting resourcescounts list:"+error))
    })
    // this.getGroupsList(true);
    // Have to call the resource list function
  },
  removeFromSelected(id){
    let newList = this.state.selected.filter(function(item){
      return item !== id
    });
      this.setState({selected: newList});
  },
  componentDidMount () {
    let heightWindow = window.innerHeight;
    let heightGear = heightWindow - 360;
    this.setState({
      heightGear: heightGear
    })

    // getAllUsers(this.state.list.length+50, 50, this.state.filter)
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
  // showResource(){
  //   let navPath='/infrastructure/allresources';
  //   // console.log("NavPath is "+navPath);
  //   this.context.router.replace(navPath);
  //
  //
  // },
  // showDockerImage(){
  //   let navPath='/infrastructure/dockerTab';
  //   // console.log("NavPath is "+navPath);
  //   this.context.router.replace(navPath);
  //
  //
  // },
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
    console.log("BAM! this.state.list", e.target.value, this.state.list)
    let chkVal = parseInt(e.target.id);
    const index = this.state.selected.indexOf(chkVal)
    let newList = this.state.selected.slice();

    var selectedSuspended = findElement(this.state.list,"id",chkVal);

    if (index === -1)
    {
      newList = newList.concat(chkVal)
      this.setState({
        selectedUserName:e.target.name,
        selectedSuspended:selectedSuspended.active
      })
    } else {
      newList.splice(index,1);
    }
    this.setState({
      selected: newList,
      // selectedUserName:e.target.name,
      // selectedSuspended:selectedSuspended.active
    })
  },
  selectAllHandler(){
    if(!this.state.all){
      this.setState({dataLoad:false});
    }
    this.setState({all:!this.state.all},
      (res)=>{
        console.log("this.state.all ", this.state.all, this.state.selected)
        if(this.state.all === true){
          getAllUsers()
        //  .then((resources) => {
           console.log("BAM!, BAM!, BAM!")
           let selectList = [];
              this.state.list.map((r, index) =>
             {
               if (index === 0){
                 console.log("adminadminadminadmin")
               } else {
                 selectList.push(r.id)
               }
             })
           this.setState({
             selected: selectList,
             dataLoad:true
          }, (res)=>{console.log("this.state.all back", this.state.all, this.state.selected)});
        //  })
        } else if (this.state.all === false){
          this.setState({
            selected: []
          })
        }
      })
  },



  _onSortChange(columnKey, sortDir) {
    console.log("columnKey, sortDir", columnKey, sortDir)
    var sortFilters = this.state.filter;
    sortFilters.sortby = columnKey
    sortFilters.orderby = sortDir
    this.setState({
      filter:sortFilters
    }, ()=>{
      // getAllUsers(this.state.list.length+50, 50, sortFilters)
      getAllUsers()
      .then((resources) => {
        console.log("refadlfkjdflkasdf", resources)
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

      let colObj = findElement(this.state.columnsList,"name",colName);
      let dataList = this.state.list;
      if(colObj != null && colObj["show"]){
//alert(colObj['width']);
        switch(colName){
          case 'username' :
            return <Column
              // align='center'
              // header={<Cell>IP ADDRESS</Cell>}
              isReorderable={true}
              isResizable={true}
              columnKey="username"
              header={
                // <SortHeaderCell
                //   onSortChange={this._onSortChange}
                //   sortDir={this.state.colSortDirs.ipaddress}>
                  <Cell>USER NAME</Cell>
                // </SortHeaderCell>
              }
              flexGrow={1}
              cell={<TextCell data={dataList} col="username" />}
              width={colObj['width']} />
            case 'email' :
            return <Column
              align='center'
              columnKey="email"
              isReorderable={true}
              isResizable={true}
              header={
                // <SortHeaderCell
                //   onSortChange={this._onSortChange}
                //   sortDir={this.state.colSortDirs.email}>
                  <Cell>EMAIL</Cell>
                // </SortHeaderCell>
              }
              flexGrow={2}
              cell={<TextCell data={dataList} col="email"/>}
              width={colObj['width']}  />
            case 'roles' :
            return <Column
              align='center'
              columnKey="roles"
              isReorderable={true}
              isResizable={true}
              header={
                // <SortHeaderCell
                //   onSortChange={this._onSortChange}
                //   sortDir={this.state.colSortDirs.roles}>
                <Cell>ROLE</Cell>
                // </SortHeaderCell>
              }
              flexGrow={2}
              cell={<TextCell data={dataList} col="roles"/>}
              width={colObj['width']}  />
            case 'department' :
            return <Column
              align='center'
              isReorderable={true}
              isResizable={true}
              columnKey="department"
              header={
                // <SortHeaderCell
                //   onSortChange={this._onSortChange}
                //   sortDir={this.state.colSortDirs.roles}>
                  <Cell>DEPARTMENT</Cell>
                // </SortHeaderCell>
              }
              flexGrow={1}
              cell={<TextCell data={dataList} col="department"/>}
              width={colObj['width']}  />
            case 'created' :
            return <Column
              align='center'
              isReorderable={true}
              isResizable={true}
              columnKey="created"
              header={
                // <SortHeaderCell
                //   onSortChange={this._onSortChange}
                //   sortDir={this.state.colSortDirs.created}>
                  <Cell>CREATED(UTC)</Cell>
                // </SortHeaderCell>
              }
              flexGrow={1}
              cell={<TextCell data={dataList} col="created"/>}

              width={colObj['width']}  />
            // case 'lastLogin' :
            // return <Column
            //   align='center'
            //   isReorderable={true}
            //   isResizable={true}
            //   columnKey="lastLogin"
            //   header={
            //     <SortHeaderCell
            //       onSortChange={this._onSortChange}
            //       sortDir={this.state.colSortDirs.lastLogin}>
            //       LAST LOGIN
            //     </SortHeaderCell>
            //   }
            //   flexGrow={1}
            //   cell={<AccessCell data={dataList} col="accessible"/>}
            //   width={110}  />
          case 'active':
            return <Column
              isReorderable={true}
              isResizable={true}
              align='center'
              columnKey="active"
              header={
                // <SortHeaderCell
                //   onSortChange={this._onSortChange}
                //   sortDir={this.state.colSortDirs.active}>
                  <Cell>STATUS</Cell>
                // </SortHeaderCell>
              }
              flexGrow={1}
              // cell={<TooltipCell data={dataList} col="active"/>}
              cell={<TextCell data={dataList} col="active"/>}

              width={colObj['width']}  />
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
          //     cell={<TooltipCell data={dataList} col="enddate"/>}
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
          //     cell={<TooltipCell data={dataList} col="availabilityzone"/>}
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

  render () {
    // rowDropdownHeightGetter={this.rowDropdownHeightGetter}


    let heightGear = this.state.heightGear;
    let selectedList = this.state.selected;
    let dataList = this.state.list
    // <Col xs={12} lg={12} style={{textAlign:"right",  alignItems: 'flex-start', position: 'absolute', right:'0', bottom:'0', top:'320', marginLeft: "60px", marginRight:"90px"}}>
    return (
    <div className="container-fluid">
    {(this.state.dataLoad)?
    <div>
      <Row>
        <Col style={{marginLeft: "60px", marginRight:"60px", marginTop:"30px", width:"1000px"}} lg={12}>
          {/*<AutoSearch style={{width:"1000px"}}
            searchNow={this.searchNow}
            deleteNow={this.deleteNow}
            getDataTags={getResourcesTags}
            />*/}
          <Row>
            <Col lg={10}>
              <ActionLinksUsers
                  suspend={this.state.selectedSuspended}
                  refreshList={this.refreshList}
                  saveUserSuccess={this.saveUserSuccess}
                  removeFromSelected={this.removeFromSelected}
                  numUsers={dataList.length}
                  selectedUserIds={this.state.selected}
                  numAccessible= {this.state.accessiblityCount}
                  numInaccessible={this.state.inaccessibleCount}
                  selectedUserName={this.state.selectedUserName}
                  numSelected={this.state.selected.length}/>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row style={{marginRight:"0"}}>
        <Col xs={12} lg={12}>
          <TestTable
            isInfiniteScroll="isInfiniteScroll"
            columnsList={this.state.columnsList}
            getTableColumn={this.getTableColumn}
            list={this.state.list}
            selected={this.state.selected}
            accessiblityCount={true}
            onClickHandler={this.onClickHandler}
            selectAllHandler={this.selectAllHandler}
            all={this.state.all}
            filter={this.state.filter}
            rowHeightGetter={this.rowHeightGetter}
            rowDropdownGetter={this.rowDropdownGetter}
            getDataList={getAllUsers}
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
                  <label htmlFor="selectAllChk"></label>
                  </Cell>
                }
                cell={props =>(
                  <CheckboxCellUser
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
          <Col xs={6} lg={6} style={{textAlign:"right",  alignItems: 'flex-start', position: 'absolute', right:'0', bottom:'0', top:'200', marginLeft: "60px", marginRight:"35px", height:"20px"}}>
            <Col xs={4} lg={4}></Col>
              <div style={{display: 'flex',justifyContent:'flex-end'}}>
                <div id="refresh" style={{margin:'9px 30px', cursor:'pointer'}}>
                  <a onClick={this.refreshList}> <Glyphicon style={{color:'#4e56a0', fontSize:"19"}} glyph="glyphicon glyphicon-refresh" /></a>
                  {/*<a onClick={this.refreshList}> <img src={refreshIcon1} alt="refreshIcon"/></a>*/}

                </div>
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

export default UserManagement
