// var React = require('react')
// var ReactFauxDOM = require('react-faux-dom')
// var ReactDOM = require('react-dom')
// var d3 = require('d3')

import ReactFauxDOM from 'react-faux-dom'
import * as d3 from "d3";
import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect } from 'react-redux'
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row} from 'react-bootstrap'
import {spacer} from 'sharedStyles/styles.css'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange} from './styles.css'
import {Table,Column, Cell} from 'fixed-data-table'
import {Header } from 'components/Header/Header'
import {ImageCell,AccessCell,ArrayLinkCell,ScoreCell,ComplianceCell,GroupCell,TextCell,LinkCell,CheckboxCell, TooltipCell, GroupsCell} from 'components/Table/Table'
import {IpAddressCell} from './ResourceIPAddressCell'
import {ResourceColumnChooserClass} from './ResourceColumnChooserCell'
import {getResourcesCounts, getResourcesTags} from 'helpers/resources'
import {getAssetGroupsTableList} from 'helpers/assetGroups'
import {AssetGroupsActions} from 'containers'
import {ActionLinksForDocker,ColumnChooserPopover} from 'components/Infrastructure/dockerActions'
import Dimensions from 'react-dimensions'
import TestTable from "./TestTable"
import AutoSearch from './autoSearch';
import AttributeConstants from 'constants/AttributeConstants'
import refreshIcon1 from 'assets/refreshIcon1.png'
import {getAllDockerImage} from 'helpers/docker'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {SpinnyLogo} from 'containers'
import moment from 'moment'
import {DockerScanStatusCell} from './DockerScanStatusCell'


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

function findIndex(arr, propName, propValue) {
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return i;
}



const Dockertab = React.createClass({
  getInitialState(){
    return {
      list:[],
      selected: [],
      filter:{},
      heightGear:null,
      columnChooserShow:false,
      count:0,
      heightGear:null,
      columnsList:[
        {name:'name', displayText:'Image Name', show:true, columnName: "IMAGE NAME", width:150},
        {name:'compliance', displayText:'Risk Score', show:true,  columnName: "COMPLIANCE", width:80,},
        {name:'teststatus', displayText:'Assessment Status', show:true, columnName: "ASSESSMENT STATUS", width:140},
        {name:'username', displayText:'User Name', show:true, columnName: "USER NAME", width:100},
        {name:'created', displayText:'Created', show:true, columnName: "CREATED", width:150},
        {name:'os', displayText:'Os', show:true, columnName: "OS", width:130},
        {name:'notification', displayText:'Notification', show:true, columnName: "NOTIFICATION", width:180}
      ],
      all:false,
      dataLoad:false,
      reRenderStatus:true,
      step:2
    }
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },

   /*componentWillReceiveProps(nextProps) {
    this.setState({
      list:nextProps.list,

    })
  },*/

  updateScore(id, score){
    let currentList = this.state.list;
    console.log("this is the id and this is the score0", id, score, currentList)
      if(id && score >= 0 && !currentList.score) {
        this.getImagesList(true);

        // console.log("this is the id and this is the score", id, score)
        // let indexToBeUpdated = findIndex(currentList,"id",id);
        // console.log("this is the id and this is the score2", indexToBeUpdated)
        // currentList[indexToBeUpdated].score = score;
        // console.log("this is the id and this is the score3", currentList)
        // this.setState({
        //   list:currentList
        // }, (res)=>{console.log("NEW LIST IS UPDATED WITH NEW SCORE AND STATUS ", this.state.list)})

      }
    console.log("this is the id and this is the score", id, score)


  },
  eventLogUpdate(data){
    let updateArray = update.split(",")
    if (updateArray.length > 3) {
      this.getImagesList()
    }
  },
  updateDiscoveryStatus(data){

   /* if(data){
      let updateArray = data.split(",")

      console.log("UpdateDiscoveryStatus", data)
      console.log("updateArrayupdateArrayupdateArray", updateArray)

      let id = updateArray[0];
      let resourcesScanned = updateArray[1].replace( /^\D+/g, '');
      let total = updateArray[2].replace( /^\D+/g, '');
      let resourcesTobeScanned = total - resourcesScanned

      console.log("UpdateDiscoveryStatus", id, resourcesScanned, total, resourcesTobeScanned)


      if(updateArray[0] && updateArray[1]) {
        let currentList = this.state.list;
        let idToChange = id;
        let newStatus = "Running";
        let indexToBeUpdated = findIndex(currentList,"id",idToChange);
        console.log("indexToBeUpdated BEFORE", indexToBeUpdated)
        console.log("indexToBeUpdated BEFORE", indexToBeUpdated, currentList,"id",idToChange)
        console.log("indexToBeUpdated BEFORE", indexToBeUpdated, currentList[indexToBeUpdated], currentList[indexToBeUpdated].discovery_status)
        currentList[indexToBeUpdated].discovery_status = newStatus;
        currentList[indexToBeUpdated].resourcesScanned = parseInt(resourcesScanned)
        currentList[indexToBeUpdated].resourcesTobeScanned = resourcesTobeScanned
        console.log("indexToBeUpdated AFTER", currentList[indexToBeUpdated])
        this.setState({
          list:currentList
        }, (res)=>{console.log("NEW LIST IS UPDATED WITH NEW STATUS ", this.state.list)})
      }
    }*/
  },


  refreshList(){

   this.setState({list:[]},function(){
    getAllDockerImage(50,50)
    .then((images) => {
      console.log("images***********"+JSON.stringify(images.dockeriamges))
      if(images.dockeriamges){
        this.setState({
          list:images.dockeriamges,count:images.total
        },function(){
          if(this.state.count<=0){
            let navPath='/infrastructure/allresources';
            console.log("NavPath is "+navPath);
            this.context.router.replace(navPath);

          }
          console.log("list***********"+JSON.stringify(this.state.list))
        })
      }
    })
    .catch((error) => console.log("Error in getting images list:"+error))
   })
  // this.getGroupsList(true);
  // Have to call the resource list function
  },

   removeFromList(id){
    let groupInx = -1;
    for (var i=0; i < this.state.list.length; i++)
      if (this.state.list[i]["id"] == id)
        groupInx = i;
      console.log("labelto be deleted"+this.state.list[i])
    let newList = this.state.list.slice();
    if(groupInx > -1){
      newList.splice(groupInx,1);
      this.setState({list: newList});
    }
  },
  removeFromSelected(label){
    let newList = this.state.selected.slice();
    const index = this.state.selected.indexOf(label)
    if(index > -1){
      newList.splice(index,1);
      this.setState({selected: newList});
    }
  },


  componentDidMount () {
    let heightWindow = window.innerHeight;
    let heightGear = heightWindow - 360;
    this.setState({
      heightGear: heightGear
    })

    getAllDockerImage(50,50)
    .then((images) => {
      console.log("images***********"+JSON.stringify(images.dockeriamges))
      if(images.dockeriamges){
        this.setState({
          list:images.dockeriamges,count:images.total,
          dataLoad:true
        },function(){
          console.log("list***********"+JSON.stringify(this.state.list))
        })
      }
    })
    .catch((error) => console.log("Error in getting images list:"+error))

     /* getResourcesCounts()
      .then((countsData) => {
        if(countsData){
          this.setState({
            accessiblityCount:countsData.accessible,
            inaccessibleCount:countsData.inaccessible
          })
        }
      })
      .catch((error) => console.log("Error in getting resourcescounts list:"+error))*/
  },
  showResource(){
    let navPath='/infrastructure/allresources';
    console.log("NavPath is "+navPath);
    this.context.router.replace(navPath);


  },
  showDockerImage(){
    let navPath='/infrastructure/dockerTab';
    console.log("NavPath is "+navPath);
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
      this.setState({dataLoad:true});
    }
    this.setState({all:!this.state.all},
      (res)=>{
        console.log("this.state.all ", this.state.all, this.state.selected)
        if(this.state.all === true){
          getAllDockerImage(50,50)
         .then((images) => {
           console.log("BAM!, BAM!, BAM!")
           let selectList = [];
              images.dockeriamges.map((r) =>
             {
               selectList.push(r.id)
             })
           this.setState({
             selected: selectList,
             list:images.dockeriamges,
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




  getTableColumn: function(colName){
      let colObj = findElement(this.state.columnsList,"name",colName);
      let dataList = this.state.list;
      if(colObj != null && colObj["show"]){
        switch(colName){
          case 'name' :
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="name"
              align='center'
              header={<Cell>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IMAGE NAME</Cell>}
              flexGrow={4}
              cell={<ImageCell data={dataList} col="imageName" />}

             width={colObj['width']}  />
            case 'compliance' :
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="compliance"
              align='center'
              header={<Cell>RISK SCORE</Cell>}
              flexGrow={2}

              cell={({rowIndex, ...props}) => {
              let statusStyle;
              if(dataList[rowIndex]["score"]<= 50 && dataList[rowIndex]["status"] === "COMPLETED"){
                statusStyle = diamondRed;
              }else if(50 < dataList[rowIndex]["score"]&& dataList[rowIndex]["score"] <= 80 && dataList[rowIndex]["status"]=== "COMPLETED"){
                statusStyle = triangleupOrange;
              }else if(80 < dataList[rowIndex]["score"]<=100 && dataList[rowIndex]["status"]=== "COMPLETED"){
                statusStyle = circleGreen;
              }
                return(
                <Cell {...props}>
                  <div className={statusStyle} style={{display:'flex',justifyContent:'center',paddingLeft:'10px'}}>{statusStyle?dataList[rowIndex]["score"]:""}</div>
                </Cell>
              )}}

              width={100} />

          case 'teststatus' :
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="teststatus"
              align='center'
              header={<Cell>ASSESSMENT STATUS</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                    <DockerScanStatusCell key={rowIndex} group={dataList[rowIndex]} reRenderStatus={this.state.reRenderStatus} updateScore={this.updateScore}/>
                  </Cell>
                    )}
              width={colObj['width']}   />
            case 'username' :
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="username"
              align='center'
              header={<Cell>USER NAME</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      { dataList[rowIndex]["username"]}
                    </Cell>
                    )}

              width={colObj['width']}   />
            case 'created':
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="created"
              align='center'
              header={<Cell>CREATED(UTC)</Cell>}
              flexGrow={3}
               cell={({rowIndex, ...props}) => {
                let createdTime = dataList[rowIndex]["created"]
                if(createdTime === null || createdTime === "null" || createdTime === undefined)
                  createdTime = '-';
                else{
                  createdTime = moment.utc(createdTime,"YYYY/MM/DD @ HH:mm TZD").format('MM[/]DD[/]YYYY [@] HH[:]mm[:]ss');
                }
                return(
                <Cell {...props}>
                  {createdTime}
                </Cell>
              )}}
              width={colObj['width']} />

             case 'os':
              return <Column
                isReorderable={true}
                isResizable={true}
                columnKey="os"
                align='center'
                header={<Cell>OS</Cell>}
                flexGrow={4}
                cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {dataList[rowIndex]["os"]}
                    </Cell>
                    )}
                width={colObj['width']}   />

            case 'notification':
              return <Column
                isReorderable={true}
                isResizable={true}
                columnKey="notification"
                align='center'
                header={<Cell>NOTIFICATION</Cell>}
                flexGrow={12}
                cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {dataList[rowIndex]["testname"]}
                    </Cell>
                    )}
                width={colObj['width']}   />
          default :
            return {}
        }
     }
   },


   getDockerByImages: function(accessFlag){
      let newFilter = {}
       getAllDockerImage(50,50)
        .then((images) => {

          this.setState({
             list: images.dockeriamges,
             filter: newFilter,
             top: false,
             lastIndex: null,
             selected: []
          })
        })
        .catch((error) => "Error "+accessFlag+":"+error)
   },

  getImagesList(scan){
    var start = this.state.list.length+50
    if(scan){
      start = 50
    }
    this.setState({list:[]},function(){
    this.setState({reRenderStatus:false});
    getAllDockerImage(start,50)
    /* .then(
        (data) =>  {
          if(data.dockeriamges){
            this.setState({list:data.dockeriamges, listLength:data.total}
              // , ()=>{this.updateDiscoveryStatus("4,Completed:34,Total:125")}
            );
            this.setState({reRenderStatus:true, loadingDiv:false});
          } else {
            this.setState({list:data});
            this.setState({reRenderStatus:true, loadingDiv:false});
          }
        }
       )*/

    .then(
      (image) =>  {
        this.setState({list:image.dockeriamges});
        this.setState({reRenderStatus:true});
      }
     )
    .catch((error) => console.log("Error " + error))
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

          getAllDockerImage(50,50).then((newElements)=>{
            console.log(newElements)
            this.setState({
                list: newElements.dockeriamges,
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
          console.log("GET DATA IS CALLED ON SEARCH =)", tag)
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
          //  if (newKey && value){
             if(!deleted) {
               if (tag === "GLOBAL") {
                 if(filter[newKey]) {
                   if (newKey === "accessible") {
                     filter[newKey]="";
                     this.setNewFilter(filter);
                   } else{
                    //  console.log(filter, newKey)
                     filter[newKey].push(value)
                     this.setNewFilter(filter);
                   }
                 } else {
                   if (newKey === "accessible") {
                     filter[newKey]="";
                     this.setNewFilter(filter);
                   } else{
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


  render(){
    let heightGear = this.state.heightGear;
    let selectedList = this.state.selected;


    let dataList = this.state.list;
    return(
    <div>
    {(this.state.dataLoad)?

        <div className="container-fluid">

         <Row>
            <Col style={{marginLeft: "60px", marginRight:"60px", marginTop:"35px", width:"1000px"}} lg={12}>

              {/*<FormGroup controlId="search" className="search">
                <InputGroup style={{marginRight:"60px"}}>
                  <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
                  <FormControl type="text" placeholder="Search or filter  here..."/>
                </InputGroup>
              </FormGroup>*/}

              <Row>
                <Col lg={4}>
                  <ActionLinksForDocker
                      list={this.state.list}
                      selectedImages={this.state.selected}
                      imageCount={this.state.count}
                      numSelected={this.state.selected.length}
                      refreshList={this.refreshList}
                      refreshSelected={this.removeFromSelected}
                      getDockerByImages={this.getDockerByImages}
                      refreshedit={this.getImagesList}/>

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
            onClickHandler={this.onClickHandler}
            selectAllHandler={this.selectAllHandler}
            all={this.state.all}
            getDataList={getAllDockerImage}
            docker={"Docker"}

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
          <Col xs={6} lg={6} style={{textAlign:"right",  alignItems: 'flex-start', position: 'absolute', right:'0', bottom:'0', top:'260', marginLeft: "60px", marginRight:"35px", marginBottom:650}}>
            <Col xs={4} lg={4}></Col>
              <div style={{display: 'flex',justifyContent:'flex-end'}}>
                {/*<Button onClick={this.showResource} style={{minWidth:120, height:30,border:'1px solid #4c58a4', color:'#625aad', margin:'0 5px', textAlign:'center', padding:2, cursor:'pointer',borderRadius:'0'}}>Resources Page</Button>
                <Button onClick={this.showDockerImage} style={{minWidth:120, height:30,border:'1px solid #4c58a4', color:'#625aad', margin:'0 10px', textAlign:'center', padding:2, cursor:'pointer',borderRadius:'0'}}>Image page</Button>*/}

                  <div id="tabs" style={{minWidth:222, marginTop:-54, fontSize:18}}>
                    <Tabs selectedIndex={1}>
                      <TabList>
                        <Tab><div onClick={this.showResource} >Resources Page</div></Tab>
                        <Tab><div onClick={this.showDockerImage} >Image page</div></Tab>
                      </TabList>
                    </Tabs>

                  </div>

                <div id="refresh" style={{marginTop:'-47px',marginRight:'10px',marginLeft:'10px', cursor:'pointer'}}>
                  <a onClick={this.refreshList}> <Glyphicon style={{color:'#4e56a0', fontSize:"19"}} glyph="glyphicon glyphicon-refresh" /></a>
                  {/*<a onClick={this.refreshList}> <img src={refreshIcon1} alt="refreshIcon"/></a>*/}
                </div>
                <div style={{marginTop:'-58px', cursor:'pointer'}}>
                  <ResourceColumnChooserClass
                    toggle={this.columnChooserToggle}
                    columnShow={this.state.columnChooserShow}
                    container={this.refs.resourcesTable}
                    columnsList={this.state.columnsList}
                    changeHandler={this.columnDisplayChangeHandler}
                  />
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

export default Dockertab
