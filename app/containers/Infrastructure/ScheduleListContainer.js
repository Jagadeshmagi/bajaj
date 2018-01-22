import React, {PropTypes} from 'react'
import {input} from 'components/Report/styles.css'
import {Col,Row,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Modal,Button} from 'react-bootstrap'
import {TextCell,LinkCell,CheckboxCell,GroupsForSchedule} from 'components/Table/Table'
import {spacer, spinner} from 'sharedStyles/styles.css'
import ScrollableDataTable from "containers/DataTable/ScrollableDataTable"
import {CreateScheduleAndNotifications,EditCredentials,DeleteCredentials,ScheduleAndNotificationsActions,CredentialsStart} from 'containers'
import TestTable from "./TestTable"
import {getScanSchedules, putScanSchedule, getScanTable} from 'helpers/schedules'
import {Table,Column, Cell} from 'fixed-data-table'
import moment from 'moment'
import {SpinnyLogo} from 'containers'
import {findElement} from 'javascripts/util.js'

const SchedulingIntro = React.createClass({
  render: function () {
    return (
      <table style={{width: '100%', marginTop:80, fontSize: 24}} >
        <tbody>
          <tr ><td style={{textAlign: 'center',  fontWeight: 'bold', color: '#454855', paddingBottom: 10}}>
                    Ready to create new Schedule and Notification template ?</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>By adding new Schedule and Notification</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>you will be able to run and manage your assessments more efficiently.</td></tr>
        </tbody>
      </table>
    )
  }
})

const ScheduleListContainer = React.createClass({
getInitialState(){
  return{
      filter:{},
      columnChooserShow:false,
      selectAll:false,
      totalTemplateCount:'',
      accessiblityCount:'',
      inaccessibleCount:'',
      selectedList: [],
      heightGear:null,
      columnsList:[
        {name:'templateName', displayText:'TEMPLATE NAME', show:true, columnName: "NAME", width:"130"},
        {name:'created', displayText:'CREATED', show:true, columnName: "CREATED", width:"125"},
        {name:'lastTimeEdited', displayText:'LAST TIME EDITED', show:true,  columnName: "LAST TIME EDITED", width:"130",},
        {name:'groups', displayText:'GROUPS', show:true,  columnName: "GROUPS", width:"240"},
        {name:'creator', displayText:'CREATOR', show:true, columnName: "CREATOR", width:"200"}
      ],
      all:false,
      reRenderStatus:false,
      templatesList:[],
      groupsAssigned:'false',
      loadingDiv:true,
      selectedTemplateName:""
  }
},

componentDidMount(){
  let heightWindow = window.innerHeight;
    let heightGear = heightWindow - 360;
    this.setState({
      heightGear: heightGear
    })
    getScanTable(50,50)
    .then((responseData) => {
      this.setState({loadingDiv:false,
        templatesList:responseData.scanschedulesview,
        totalTemplateCount:responseData.totalcount})
    })
    .catch((error) => console.log("error in getting the templates list"+error))
},

refreshTemplatesList(){
  this.setState({loadingDiv:true})
   getScanTable(50,50)
    .then((responseData) => {
      this.setState({loadingDiv:false,
        templatesList:responseData.scanschedulesview,
        totalTemplateCount:responseData.totalcount})
    })
    .catch((error) => console.log("error in getting the templates list"))
},

selectAllHandler(){
  this.setState({selectAll:!this.state.selectAll}, function(){
    if(this.state.selectAll === true){
       getScanTable(0,0)
       .then((responseData) =>  {
        let selectList = [];
        let scanTempData = responseData.scanschedulesview[0];
        if(scanTempData.length==1){
          if(scanTempData.groupsAssigned!=undefined && scanTempData.groupsAssigned.length>0){
            this.setState({groupsAssigned:true})
          }else
            this.setState({groupsAssigned:false})
          selectList.push(scanTempData.label)
          this.setState({selectedTemplateName:scanTempData.label})
        }else{
          responseData.scanschedulesview.map((r) => {
            selectList.push(r.label)
          })
        }
        this.setState({templatesList:responseData.scanschedulesview,
                      selectedList:selectList});
       })
       .catch((error) => console.log("Error in getScanTable in container:" + error))
      }else{
        this.setState({selectedList: []})
      }
    })
  },

  onClickHandler(e) {
    let chkVal = e.target.id;
    const index = this.state.selectedList.indexOf(chkVal)
    let newList = this.state.selectedList.slice();
    if (index === -1)
    {
      this.setState({selectedTemplateName:chkVal,
                    groupsAssigned:e.target.value})
      newList = newList.concat(chkVal)
    } else {
      newList.splice(index,1);
      this.setState({selectedTemplateName:"",
                    groupsAssigned:'false'})
    }
    this.setState({selectedList: newList})
  },


removeFromSelected(label){
  let newList = this.state.selectedList.slice();
  const index = this.state.selectedList.indexOf(label)
  if(index > -1){
    newList.splice(index,1);
    this.setState({selectedList: newList});
  }
},

  getDataOnScroll(start,end,filter){
    getScanTable(start,end)
    .then((resultsList) =>  {
       let newList = this.state.templatesList.concat(resultsList.scanschedulesview);
       this.updateList(newList);
    })
    .catch((resultListError) => console.log("Error in fetchReportsList:" + JSON.stringify(resultListError)))
  },


updateList(newList){
    this.setState({templatesList:newList});
  },


getTableColumn: function(colName){
      let colObj = findElement(this.state.columnsList,"name",colName);
      let dataList = this.state.templatesList;
      if(colObj != null && colObj["show"]){
        switch(colName){
          case 'templateName' :
            return <Column
              header={<Cell>TEMPLATE NAME</Cell>}
              flexGrow={1.5}
              cell={({rowIndex, ...props}) => {
                return(
                <Cell {...props}>
                     {this.state.templatesList[rowIndex]["label"]}
                </Cell>
              )}}
              width={140} />
            case 'created' :
            return <Column
              header={<Cell>CREATED(UTC)</Cell>}
              flexGrow={1}
               cell={({rowIndex, ...props}) => {
                let createdTime = this.state.templatesList[rowIndex]["createtime"]
                if(createdTime === null || createdTime === "null" || createdTime === undefined)
                  createdTime = '-';
                else{
                  createdTime = moment.utc(createdTime,"YYYY/MM/DD HH:mm:ss").format('MM[/]DD[/]YYYY [@] HH[:]mm');
                }
                return(
                <Cell {...props}>
                  {createdTime}
                </Cell>
              )}}
              width={95}/>
            case 'lastTimeEdited' :
            return <Column
              align='center'
              header={<Cell>LAST TIME EDITED(UTC)</Cell>}
              flexGrow={1}
              cell={({rowIndex, ...props}) => {
                let modifiedTime = this.state.templatesList[rowIndex]["modifytime"]
                if(modifiedTime === null || modifiedTime === "null" || modifiedTime === undefined)
                  modifiedTime = '-';
                else{
                  modifiedTime = moment.utc(modifiedTime,"YYYY/MM/DD @ HH:mm:ss").format('MM[/]DD[/]YYYY [@] HH[:]mm');
                }
                return(
                <Cell {...props}>
                  {modifiedTime}
                </Cell>
              )}}
              width={95}/>
          case 'groups' :
            return <Column
              align='center'
              header={<Cell>GROUPS</Cell>}
              flexGrow={1}
              width={50}
              cell={<GroupsForSchedule data={dataList} rowIndex={this.props.rowIndex} col="groups"/>}
              />

            case 'creator':
            return <Column
              align='center'
              header={<Cell>CREATOR</Cell>}
              flexGrow={1}
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                 {this.state.templatesList[rowIndex]["creator"]}
                 </Cell>
              )}
              width={180}  />
          default :
            return {}
        }
     }
   },


render() {
  let selectedList = this.state.selectedList;
  let selectHandler = this.onClickHandler;
    const checkboxColumn = <Column
      align='center'
          ref="column"
          header={
            <Cell>
            <input type='checkbox' id="selectAllChk" className="chkAll"
            checked={(this.state.totalTemplateCount > 0 && selectedList.length === this.state.totalTemplateCount)?true:false}
            onClick={this.selectAllHandler}
            ref={input => {
                if (input) {
                  input.indeterminate = (selectedList.length > 0 && selectedList.length < this.state.totalTemplateCount)?true:false;
                }
              }}
            />
            <label htmlFor="selectAllChk"></label>
            </Cell>
          }
          cell={({rowIndex, ...props}) =>(

          <Cell style={{marginTop:"5"}} {...props}>
            <input type='checkbox' id={this.state.templatesList[rowIndex]["label"]}
                name={this.state.templatesList[rowIndex]["groups"][0]}
                value={this.state.templatesList[rowIndex]["groups"].length>0?'true':'false'}
                checked={(selectedList.indexOf(this.state.templatesList[rowIndex]["label"]) != -1)?true:false}
                onChange= {selectHandler} />
            <label htmlFor={this.state.templatesList[rowIndex]["label"]}></label>
          </Cell>
          )}
          width={50} />
  if(!this.state.loadingDiv && this.state.totalTemplateCount<1){
    return(<div>
        <SchedulingIntro />
        <table style={{width: '100%'}}>
          <tbody>
            <tr>
              <td style={{textAlign: 'center'}}>
                <CreateScheduleAndNotifications totalCredsCount={this.state.totalTemplateCount} refreshTemplatesList={this.refreshTemplatesList} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      )}
else{
  return (
    <div >
      <div style={{marginLeft:'60px',marginRight:'60px'}}>
        {this.state.loadingDiv?
          <div style={{marginTop: 20,paddingTop:'100px',width:'100%'}}>
            <SpinnyLogo />
          </div>
        :
        <div>
          <Row id="search" style={{margin:'30px 0 0 -4px'}}>
           {/* <div>
                  <FormGroup controlId="search" className="search">
                    <InputGroup style={{marginRight:"60px"}}>
                      <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
                      <FormControl type="text" placeholder="Search or filter  here..."/>
                    </InputGroup>
                  </FormGroup>
            </div>*/}
          </Row>
          <Row  id="ScheduleActions" style={{height:'30px', marginLeft:0}}>
            <div>
              <ScheduleAndNotificationsActions
                totalTemplatesCount={this.state.totalTemplateCount}
                selectedTemplates={this.state.selectedList}
                refreshTemplatesList={this.refreshTemplatesList}
                removeFromSelected={this.removeFromSelected}
                /*selectedTemplateName={this.state.selectedTemplateName}
                groupsAssigned={this.state.groupsAssigned}*//>
            </div>
          </Row>
          <Row xs={12} style={{margin:'10px 0 0'}}>
          <div style={{marginBottom:'20px',marginLeft:'-60px'}}>
                <ScrollableDataTable
                  large = "no"
                  columnsList={this.state.columnsList}
                  getTableColumn={this.getTableColumn}
                  checkboxColumn={checkboxColumn}
                  list={this.state.templatesList}
                  getDataList={this.getDataOnScroll}
                  updateList={this.state.updateList}
                  filter={this.state.filter}
                />
          </div>
          </Row>
        </div>}
      </div>
    </div>
  )}
  }
})

export default ScheduleListContainer
