import ReactFauxDOM from 'react-faux-dom'
import * as d3 from "d3";
import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect } from 'react-redux'
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row, ProgressBar} from 'react-bootstrap'
import {spacer} from 'sharedStyles/styles.css'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange} from './styles.css'
import {Table,Column, Cell} from 'fixed-data-table'
import {Header } from 'components/Header/Header'
import {AccessCell,ArrayLinkCell,ScoreLinkCell,ComplianceCell,GroupCell,TextCell,LinkCell,CheckboxCell, TooltipCell, GroupsCell, DiscoveryCell} from 'components/Table/Table'
import {IpAddressCell} from './ResourceIPAddressCell'
import {ResourceColumnChooserClass} from './ResourceColumnChooserCell'
import {getResourcesCounts, getResourcesTags} from 'helpers/resources'
import {getAssetGroupsTableListFilter} from 'helpers/assetGroups'
import {AssetGroupsActions} from 'containers'
import {ActionLinks,ColumnChooserPopover} from 'components/Infrastructure/Resources'
import Dimensions from 'react-dimensions'
import TestTable from "./TestTable"
import AutoSearch from './autoSearch';
// import io from 'socket.io-client'
import AttributeConstants from 'constants/AttributeConstants'
import {DiscoveryStatus} from './GroupDiscoveryStatusCell'
import {GroupsInaccessCount} from './GroupsInaccessCountCell'
import {GroupScore} from './GroupScoreCell'
import {SpinnyLogo} from 'containers'
import moment from 'moment'
import sockets from 'constants/socket'
import {findElement} from 'javascripts/util.js'

let socket = sockets.io;

// let socket = io(NetworkConstants.NODEJS_SERVER_SOCKETS)
// var socket = io.connect(NetworkConstants.NODEJS_SERVER_SOCKETS
//   // , {
//   //   reconnect: true,
//   //   transports: ['websocket'] }
// );



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
    console.log("ABC", sortDir)
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


function findIndex(arr, propName, propValue) {
  console.log("arr, propName, propValue", arr, propName, propValue)
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return i;
}

const GroupsContainers = React.createClass({
  getInitialState(){
    return {
      resetState:false,
      list:[],
      listLength:0,
      selected: [],
      filter:{sortby: "name", orderby: "desc"},
      colSortDirs:{
        sortString:"&sort=-lastscantime",
      },
      columnChooserShow:false,
      accessiblityCount:'',
      inaccessibleCount:'',
      heightGear:null,
      columnsList:[
        {name:'name', displayText:'Group Name', show:true, columnName: "NAME", width:180},
        {name:'score', displayText:'Risk Score', show:true, columnName: "RISK SCORE", width:150},
        {name:'discovery_status', displayText:'Assessment Status', show:true, columnName: "DISCOVERY ASSESS", width:170,},
        {name:'device_cnt', displayText:'Resource Count', show:true,  columnName: "INACCESSIBLE RESOURCES", width:140},
        {name:'assetType', displayText:'Environment', show:true, columnName: "ASSET TYPE", width:170},
        {name:'testName', displayText:'Notification', show:true, columnName: "TEST NAME", width:180},
        {name:'lastScan', displayText:'Last Scan', show:false, columnName: "LAST SCAN TIME", width:180},
        {name:'nextScan', displayText:'Next Scan', show:false, columnName: "TEST NAME", width:180},
        {name:'policyPack', displayText:'Policy Pack', show:false, columnName: "POLICY PACK", width:180}
      ],
      all:false,
      reRenderStatus:true,
      step:2,
      loadingDiv:true,
      filterStr:'',
    }
  },
  getGroupsList(scan){
    var start = 50
    if(scan){
      start = 50
    }
    this.setState({reRenderStatus:false});
    this.setState({list:[],loadingDiv:true},function(){
      var filterStr = this.state.filterStr;
      let sortString = this.state.colSortDirs["sortString"];
     getAssetGroupsTableListFilter(start, 50, filterStr, sortString)
      .then(
        (data) =>  {
          console.log("why am I getting called so many times?", data)
          if(data.list){
            this.setState({list:data.list, listLength:data.listLength}
            );
            this.setState({reRenderStatus:true, loadingDiv:false});
          } else {
            this.setState({list:data});
            this.setState({reRenderStatus:true, loadingDiv:false});
          }
        }
       )
      .catch((error) => console.log("Error in getAssetGroupsList in container:" + error))
    })
  },
  refreshList(){
    let sortString = this.state.colSortDirs["sortString"];
    //getAssetGroupsTableListFilter(0, 5000, filterStr, sortString).then((newElements)
    console.log("this.state.filterStrthis.state.filterStr", this.state.filterStr)
    var filterStr = this.state.filterStr;

    this.setState({list:[]},function(){
      let sortString = this.state.colSortDirs["sortString"];
     getAssetGroupsTableListFilter(50, 50, filterStr, sortString)
      .then((data) =>  {
          if(data.list){
            this.setState({list:data.list, listLength:data.listLength}
            );
            this.setState({reRenderStatus:true});
          } else {
            this.setState({list:data});
            this.setState({reRenderStatus:true});
          }
        }
       )
      .catch((error) => console.log("Error in getAssetGroupsList in container:" + error))

    })
  },
  componentDidMount () {

    let heightWindow = window.innerHeight;
    let heightGear = heightWindow - 360;
    this.setState({
      heightGear: heightGear
    })
    var filterStr = this.state.filterStr;
    let sortString = this.state.colSortDirs["sortString"];
   getAssetGroupsTableListFilter(50, 50, filterStr, sortString)
    .then((data) => {
      if(data.list){
        this.setState({list:data.list, listLength:data.listLength}
        );
        this.setState({reRenderStatus:true, loadingDiv:false});
      } else {
        this.setState({list:data});
        this.setState({reRenderStatus:true, loadingDiv:false});
      }
    })
    .catch((error) => console.log("Error in getting groupscounts list:"+error))
    // this._onSortChange(this.state.filter.sortby, this.state.filter.orderby)
    // getResourcesCounts()
    // .then((countsData) => {
    //   if(countsData){
    //     this.setState({
    //     this is clicked - SORT PLEASE!!  accessiblityCount:countsData.accessible,
    //       inaccessibleCount:countsData.inaccessible
    //     })
    //   }
    // })
    // .catch((error) => console.log("Error in getting groupscounts list:"+error))
      socket.on('scanEvents',this.eventLogUpdate);
      socket.on('statusUpdate', this.updateDiscoveryStatus);

    // setTimeout(function(){
    //   document.getElementsByClassName('progress-bar-success')[0].style.backgroundColor = '#00C484'
    // }, 1000)
  },
  eventLogUpdate(update){
    console.log("thsi flksajdfklasjdfsadfupdate", update)
    // let update = JSON.parse(data)
    // console.log("thsi flksajdfklasjdfsadf", update)

    if (update.status === "Completed" || update.status === "Started") {
      // console.log("start or end", updateArray)
      this.getGroupsList();
    }
  },
  updateDiscoveryStatus(data){
    console.log("UpdateDiscoveryStatus =)", data, this.state.list)
      let id = data.id
        let currentList = this.state.list;
        let idToChange = id;
        let newStatus = "Running";
        let indexToBeUpdated = findIndex(currentList,"id",idToChange);
        if (!indexToBeUpdated){
          this.setState({resetState:!this.state.resetState}, ()=>{
            if (data.percent){
              currentList[indexToBeUpdated].percent= data.percent
            }
            this.setState({
              list:currentList
            })
          })
        } else {
          if (data.percent){
            currentList[indexToBeUpdated].percent= data.percent
          }
          this.setState({
            list:currentList
          })
        }
  },
  columnChooserToggle() {
    setTimeout(function(){
      let popoverElement = document.getElementById('popover-trigger-click-root-close')
      let popOverChild = popoverElement.firstChild
    },10)
    this.setState({ columnChooserShow: !this.state.columnChooserShow });
  },
  columnDisplayChangeHandler(colName){
    var SelectedList = localStorage.getItem("GroupTable")?JSON.parse(localStorage.getItem("GroupTable")):this.state.columnsList;

    let newColumnsList = [];
    let that=this;
    SelectedList.forEach(function(col){
      if(col.name === colName){
        newColumnsList.push({...col,show:!col.show});
        that.setState({columnsList:newColumnsList})
      }
      else{
        newColumnsList.push(col);
      }
    })
    localStorage.setItem("GroupTable", JSON.stringify(newColumnsList));
  },
  onClickHandler(e) {
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
    this.setState({all:!this.state.all},
      (res)=>{
        if(this.state.all === true){
          var filterStr = this.state.filterStr;
          let sortString = this.state.colSortDirs["sortString"];
         getAssetGroupsTableListFilter(0, 0, filterStr, sortString)
         .then((groups) => {
           let selectList = [];
              groups.map((r) =>
             {
               selectList.push(r.id)
             })
           this.setState({
             selected: selectList,
             list:groups,
          }, (res)=>{console.log("this.state.all back", this.state.all, this.state.selected)});
         })
          .catch((error) => console.log("Error in getting groups list:"+error))
        } else if (this.state.all === false){
          this.setState({
            selected: []
          })
        }
      })
  },
  removeFromList(groupId){
    let groupInx = -1;
    for (var i=0; i < this.state.list.length; i++)
      if (this.state.list[i]["id"] == groupId)
        groupInx = i;
    let newList = this.state.list.slice();
    if(groupInx > -1){
      newList.splice(groupInx,1);
      this.setState({list: newList});
    }
  },
  removeFromSelected(groupId){
    let newList = this.state.selected.slice();
    const index = this.state.selected.indexOf(groupId)
    if(index > -1){
      newList.splice(index,1);
      this.setState({selected: newList});
    }
  },
  updateList(newList){
    this.setState({
      list:newList
    })
  },
  updateScore(id, score){
    let currentList = this.state.list;
    console.log("this is the id and this is the score0", id, score, currentList)
      if(id && score >= 0 && !currentList.score) {
        this.getGroupsList(true);
      }
    console.log("this is the id and this is the score", id, score)
  },

  _onSortChange(columnKey, sortDir) {
    let filterStr = this.state.filterStr;
    console.log("columnKey, sortDir", columnKey, sortDir)
    if(columnKey=='name')
    {
      var columnKeyJson = 'assetGroupName'
    }
    else if(columnKey=='policyPack')
    {
      var columnKeyJson = 'policypacks'
    }
    else{
     var columnKeyJson = columnKey;
    }
    console.log(sortDir)
    var srtBy = "+";
    if(sortDir=='desc')
    {
      srtBy = "-";
    }
    var sortString = "&sort="+srtBy+columnKeyJson;
    var SortJson = {"sortby":columnKeyJson,"orderby":sortDir}
    console.log("SRT"+JSON.stringify(SortJson))
     getAssetGroupsTableListFilter(50, 50, filterStr, sortString).then((newElement)=>{
       let newElements = newElement.list
               console.log(newElement)
               let selectList = [];
             if (newElement) {
               newElements.map((elem) =>
              {
                selectList.push(elem.id)
              })
             }
               this.setState({
                   list: newElements,
               }, (res) => {
                 console.log("RAWR RAWR RAWR!!! THIS IS THE SELECTED LIST UPON SEARCH ", this.state.list, this.state.selected)})
             });
    this.setState({
      colSortDirs: {
        [columnKey]: sortDir,
        "sortString" : sortString
      },
    });
  },
  getTableColumn: function(colName){
    //var SelectedList = localStorage.getItem("GroupTable")?JSON.parse(localStorage.getItem("GroupTable")):this.state.columnsList;
    var StateList = this.state.columnsList;
      var StorageList = JSON.parse(localStorage.getItem("GroupTable"));
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
      var StorageList = JSON.parse(localStorage.getItem("GroupTable1"));
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
    console.log("this.state.reRenderStatus", this.state.reRenderStatus)
      let colObj = findElement(SelectedList,"name",colName);
      let dataList = this.state.list;
      if(colObj != null && colObj["show"]){
        switch(colName){
          case 'name' :
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="name"
              header={<SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.name}>
                  GROUP NAME
                </SortHeaderCell>
              }
              flexGrow={1}
              cell={<GroupsCell data={dataList} col="name" />}
               width={colObj['width']} />
            case 'score' :
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="score"
              header={<SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.score}>
                  RISK SCORE
                </SortHeaderCell>}
              flexGrow={1}
              cell={<ScoreLinkCell data={dataList} col="score"/>}
               width={colObj['width']}  />
            case 'discovery_status' :
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="discovery_status"
              align='center'
              header={<SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.discovery_status}>
                  ASSESSMENT STATUS
                </SortHeaderCell>}
              flexGrow={1}
              cell={<DiscoveryCell refresh={this.state.loadingDiv} data={dataList} col="discovery_status" errorCol="errortext"/>}
               width={colObj['width']}  />
          case 'device_cnt' :
            return <Column
            isReorderable={true}
              isResizable={true}
              columnKey="device_cnt"
              align='center'
              header={<Cell>RESOURCE COUNT</Cell>}
              flexGrow={1.5}
              cell={({rowIndex, ...props}) => {
                return(
                <Cell {...props}>
                  <div>
                    <span data-type="info" ref='inaccessibleDiv' data-tip="Inaccessible" style={{color:'red'}}>
                      {dataList[rowIndex]['inaccessible_cnt']}
                    </span>
                    <span>&nbsp;|&nbsp;</span>
                    <span data-type="info" ref='accessibleDiv' data-tip="Accessible" style={{color:'#00c484'}}>
                      {dataList[rowIndex]['accessible_cnt']}
                    </span>
                  </div>
                </Cell>
                )
              }}
              width={colObj['width']}  />
            case 'assetType' :
            return <Column
            isReorderable={true}
              isResizable={true}
              columnKey="assetType"
              align='center'
              header={<SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.assetType}>
                  ENVIRONMENT
                </SortHeaderCell>}
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
            case 'testName':
            return <Column
            isReorderable={true}
              isResizable={true}
              columnKey="testName"
              align='center'
              header={<SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.testName}>
                  NOTIFICATION
                </SortHeaderCell>}
              flexGrow={1}
              cell={<TooltipCell data={dataList} col="testName"/>}
               width={colObj['width']}  />
          case 'lastScan':
          return <Column
          isReorderable={true}
            isResizable={true}
            columnKey="lastScan"
            align='center'
            header={<Cell>LAST SCAN(UTC)</Cell>}
            flexGrow={1}
            cell={({rowIndex, ...props}) => {
              let lastScan = dataList[rowIndex]["lastscantime"]
              if(lastScan === undefined || lastScan === null || lastScan === "null")
                lastScan = '-';
              else{
                lastScan = moment.utc(lastScan).format('MM[/]DD[/]YYYY [@] HH[:]mm');
              }
              return(
                <Cell {...props}>
                  {lastScan}
                </Cell>
              )}}
            width={colObj['width']}  />
            case 'nextScan':
            return <Column
            isReorderable={true}
              isResizable={true}
              columnKey="nextScan"
              align='center'
              header={<Cell>NEXT SCAN(UTC)</Cell>}
              flexGrow={1}
              cell={({rowIndex, ...props}) => {
                let nextScan = dataList[rowIndex]["nextscan"]
                if(nextScan === undefined || nextScan === null || nextScan === "null")
                  nextScan = '-';
                else{
                  nextScan = moment.utc(nextScan).format('MM[/]DD[/]YYYY [@] HH[:]mm');
                }
                return(
                  <Cell {...props}>
                    {nextScan}
                  </Cell>
                )}}
              width={colObj['width']}  />
            case 'policyPack':
            return <Column
            isReorderable={true}
              isResizable={true}
              columnKey="policyPack"
              align='center'
              header={<SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.policyPack}>
                  POLICY PACK
                </SortHeaderCell>}
              flexGrow={1}
              cell={<TooltipCell data={dataList} col="policypacks"/>}
              width={colObj['width']}  />
          default :
            return {}
        }
     }
   },
  deleteNow(key, deletedValue, deleted){
        var filter = this.state.filter
        var filterJson = {}
        var filterArray_assetType = []
        var filterArray_discovery_status = []
        var filterArray_assetGroupName = []
        var filterArray_testName = []
        var filterArray_score = []
        var valueArray = []
        var filterString = '';
        var filterStr = '';
           if (key && deletedValue){

           key.map((elem) =>
              {
                var vals = elem.value.split(":")
                var key = vals[1];
                var val = vals[2]?vals[2]:null;
                console.log("JHJHJH"+val)
                if(key=='groupname')
                {
                  filterArray_assetGroupName.push(val)
                  filterString +="assetGroupName:"+val+","
                }
                if(key=='assettype')
                {
                  filterArray_assetType.push(val)
                  filterString +="assetType:"+val+","
                }
                if(key=='discovery_status')
                {
                  filterArray_discovery_status.push(val)
                  filterString +="discovery_status:"+val+","
                }
                if(key=='score')
                {
                  filterArray_score.push(val)
                  filterString +="score:"+val+","
                }
                if(key=='testName')
                {
                  filterArray_score.push(val)
                  filterString +="testName:"+val+","
                }
                console.log("kys"+vals[1])
              })
           if(filterString!='')
           {
            filterStr = "&filter="+filterString;
           }

           filterJson = {"assetType":filterArray_assetType,"discovery_status":filterArray_discovery_status,"assetGroupName":filterArray_assetGroupName,"testName":filterArray_testName}
          console.log("GET DATA IS CALLED ON SEARCH", filter, this.state.filter)
          let sortString = this.state.colSortDirs["sortString"];
             getAssetGroupsTableListFilter(50, 50, filterStr, sortString).then((newElement)=>{
               let newElements = newElement.list
               console.log(newElements)
               let selectList = [];
               if(filterStr!=''){
             if (newElements) {
               newElements.map((elem) =>
              {
                selectList.push(elem.id)
              })
             }
           }
               this.setState({
                   list: newElements,
                   selected: selectList,
                   filter: filter,
                   top: false,
                   lastIndex: null,
               }, (res) => {
                 console.log("RAWR RAWR RAWR!!! THIS IS THE SELECTED LIST UPON SEARCH ", this.state.list, this.state.selected)})
             });
        } else {
          filter = {};
          console.log("GET DATA IS CALLED ON SEARCH", filter, this.state.filter)
          let sortString = this.state.colSortDirs["sortString"];
             getAssetGroupsTableListFilter(0, 50, filterStr, sortString).then((newElement)=>{
               let newElements = newElement.list
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
    // console.log("NW"+JSON.stringify(newValue))
   },
   searchNow: function(key, value, deleted) {
        console.log("GET DATA IS CALLED ON SEARCH =)", key)
        var filter = this.state.filter
        var filterJson = {}
        var filterArray_assetType = []
        var filterArray_discovery_status = []
        var filterArray_assetGroupName = []
        var filterArray_testName = []
        var filterArray_score = []
        var filterString = '';
        var filterStr = '';
        var valueArray = []
        valueArray.push(value)
        if (key && value){
           key.map((elem) =>
              {
                var vals = elem.value.split(":")
                var key = vals[1];
                var val = vals[2]?vals[2]:null;
                console.log("JHJHJH"+val)
                if(key=='groupname')
                {
                  filterArray_assetGroupName.push(val)
                  filterString +="assetGroupName:"+val+","
                }
                if(key=='assettype')
                {
                  filterArray_assetType.push(val)
                  filterString +="assetType:"+val+","
                }
                if(key=='discovery_status')
                {
                  filterArray_discovery_status.push(val)
                  filterString +="discovery_status:"+val+","
                }
                if(key=='score')
                {
                  filterArray_score.push(val)
                  filterString +="score:"+val+","
                }
                if(key=='testName')
                {
                  filterArray_score.push(val)
                  filterString +="testName:"+val+","
                }
                console.log("kys"+vals[1])
              })
           if(filterString!='')
           {
            filterStr = "&filter="+filterString;
           }

           console.log("jkjj"+filterStr)
           filterJson = {"assetType":filterArray_assetType,"discovery_status":filterArray_discovery_status,"assetGroupName":filterArray_assetGroupName,"testName":filterArray_testName}
          console.log("GET DATA IS CALLED ON SEARCH", filter, this.state.filter)
          let sortString = this.state.colSortDirs["sortString"];
             getAssetGroupsTableListFilter(0, 0, filterStr, sortString).then((newElement)=>{
               let newElements = newElement.list
               console.log(newElement)
               let selectList = [];
             if (newElement) {
               newElements.map((elem) =>
              {
                selectList.push(elem.id)
              })
             }
               this.setState({
                   filterStr:filterStr,
                   list: newElements,
                   selected: selectList,
                   filter: filter,
                   top: false,
                   lastIndex: null,

               }, (res) => {
                 console.log("RAWR RAWR RAWR!!! THIS IS THE SELECTED LIST UPON SEARCH ", this.state.list, this.state.selected)})
             });
        } else {
          filter = {};
          console.log("GET DATA IS CALLED ON SEARCH", filter, this.state.filter)
          let sortString = this.state.colSortDirs["sortString"];
             getAssetGroupsTableListFilter(0, 0, filterStr, sortString).then((newElement)=>{
               let newElements = newElement.list
               console.log(newElements)
               this.setState({
                 filterStr:filterStr,
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
  render () {
    var SelectedList = localStorage.getItem("GroupTable")?JSON.parse(localStorage.getItem("GroupTable")):this.state.columnsList;

    let heightGear = this.state.heightGear;
    let selectedList = this.state.selected;
    let dataList = this.state.list
    return (
    <div>
    {this.state.loadingDiv?
    <div style={{marginTop: 20,paddingTop:'100px',width:'100%'}}>
      <SpinnyLogo />
    </div>
    :
    <div className="container-fluid">
      <Row>
        <Col style={{marginLeft: "45px", marginRight:"60px", marginTop:"30px", width:"1000px"}} lg={12}>
          <AutoSearch style={{width:"1000px"}}
            searchNow={this.searchNow}
            deleteNow={this.deleteNow}
            getDataTags={getResourcesTags}
            type="AllGroups"
            />
        </Col>
      </Row>
      <Row>
      </Row>
      <Row style={{}}>
        <Col xs={6} lg={6}>
          <div style={{marginLeft:47, height:45}}>
            <AssetGroupsActions
             totalGroupsCount={this.state.listLength}
             selectedIds={this.state.selected}
             selectedGroupsCount={this.state.selected.length}
             list={this.state.list}
             refreshList={this.removeFromList}
             refreshSelected={this.removeFromSelected}
             refreshedit={this.getGroupsList}/>
          </div>
        </Col>
          <Col xs={6} lg={6} style={{textAlign:"right",  alignItems: 'flex-end', height:45, paddingRight:88}}>
              <div style={{display: 'flex',justifyContent:'flex-end'}}>
                <div id="refresh" style={{margin:'9px 10px', cursor:'pointer'}}>
                  <a onClick={this.refreshList}> <Glyphicon style={{color:'#4e56a0', fontSize:"19"}} glyph="glyphicon glyphicon-refresh" /></a>
              </div>
              <div style={{margin:'0px 5px', cursor:'pointer'}}>
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
      <Row  style={{marginLeft:-30}}>
        <Col xs={12} lg={12}>

          <TestTable
            type="GroupTable"
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
            getDataList={getAssetGroupsTableListFilter}
            getDataCounts={getResourcesCounts}
            getDataTags={getResourcesTags}
            checkboxColumn={
              <Column
                align='center'
                ref="column"
                header={
                  <Cell>
                  <input type='checkbox' id="selectAllChk" className="chkAll"
                  checked={(dataList.length > 0 && selectedList.length === dataList.length)?true:false}
                  ref={input => {
                      if (input) {
                        input.indeterminate = (selectedList.length > 0 && selectedList.length < dataList.length)?true:false;
                      }
                    }}
                  onClick={this.selectAllHandler}/>
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
    </div>
  }
    </div>
    )
  }
})

export default GroupsContainers
