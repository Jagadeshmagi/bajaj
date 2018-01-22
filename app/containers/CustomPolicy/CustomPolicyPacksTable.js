import React from 'react'
import {mytable, spacer} from 'sharedStyles/styles.css'
import logo1 from 'assets/jira.png'
import logo2 from 'assets/serviceNow.png'
import logo3 from 'assets/pagerduty.png'
import {getCustomPoliciesList} from 'helpers/scriptedPolicy'
import { Glyphicon, ProgressBar, FormGroup, InputGroup, Col, FormControl, Row} from 'react-bootstrap'
import {CustomPoliciesActions, AddCustomPolicies} from 'containers'
import {SpinnyLogo} from 'containers'
import moment from 'moment'
import TestTable from 'containers/Infrastructure/TestTable'
import {Table,Column, Cell} from 'fixed-data-table'
import {CheckboxCell, TooltipCell, GroupsCell} from 'components/Table/Table'
import {findElement} from 'javascripts/util.js'

const CustomPoliciesIntro = React.createClass({
  render: function () {
    return (
      <table style={{width: '100%', marginTop:80, fontSize: 24}} >
        <tbody>
          <tr ><td style={{textAlign: 'center',  fontWeight: 'bold', color: '#454855', paddingBottom: 10}}>
                    Ready to add CustomPolicies ?</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>By adding CustomPolicies you will let</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>us send alerts to you and</td></tr>
          <tr><td style={{textAlign: 'center', color: '#737684'}}>your teams. </td></tr>
        </tbody>
      </table>
    )
  }
})


const CustomPolicyPacksTable = React.createClass({
  getInitialState(){
    return{
      customPoliciesList:[],
      selectedCustomPoliciesId:[],
      loadingDiv:true,
      selectedCustomPoliciesName:"",
      columnsList:[
        {name:'name', displayText:'INTEGRATION NAME', show:true, columnName: "INTEGRATION NAME", width:150},
        {name:'status', displayText:'STATUS', show:true, columnName: "STATUS", width:120},
        {name:'created', displayText:'CREATED', show:true, columnName: "CREATED", width:120},
        {name:'servicemessage', displayText:'SERVICE MESSAGE', show:true, columnName: "SERVICE MESSAGE", width:150},
      ],
    }
  },

  componentDidMount(){
      this.getCustomPoliciesList();
  },

  getCustomPoliciesList(){
      getCustomPoliciesList()
      .then(
        (customPolicies) =>  {
          console.log("dsfasdfljaksdfjasdf", customPolicies.output)
          let custom = customPolicies.output;
          this.setState({
            loadingDiv:false,
            customPoliciesList:custom
          });
      })
      .catch((error) => console.log("Error in getCustomPoliciesList in container:" + error))
    },

  refreshCustomPoliciesList(){
    console.log("refresh called in CustomPolicyPacksTable")
    this.setState({loadingDiv:true})
    this.getCustomPoliciesList();
  },

  removeFromSelected(id){
    console.log('Inside remove from Selected.Id is '+id)
    let newList = this.state.selectedCustomPoliciesId.slice();
    const index = this.state.selectedCustomPoliciesId.indexOf(id)
    if(index > -1){
      newList.splice(index,1);
      this.setState({selectedCustomPoliciesId: newList});
    }
  },


  selectAllHandler(){
    let selectList = [];
    if(this.state.selectedCustomPoliciesId.length < this.state.customPoliciesList.length){
      this.state.customPoliciesList.map((r) =>
      {
        selectList.push(r.id)
      })
    }
    this.setState({selectedCustomPoliciesId: selectList})
  },


  selections(e)
  {
    console.log("e "+e.target.name)
    let chkVal = parseInt(e.target.id);
    const index = this.state.selectedCustomPoliciesId.indexOf(chkVal)
    let newList = this.state.selectedCustomPoliciesId.slice();
    if (index === -1)
    {
      newList = newList.concat(chkVal)
    } else {
      newList.splice(index,1);
    }
    this.setState({selectedCustomPoliciesId: newList,
      selectedCustomPoliciesName:e.target.name})
  },
  getTableColumn(colName){
    let colObj = findElement(this.state.columnsList,"name",colName);
    let dataList = this.state.customPoliciesList;
    if(colObj != null && colObj["show"]){
      switch(colName){
        case 'name' :
          return <Column
            align='center'
            isReorderable={true}
            isResizable={true}
            columnKey="name"
            header={<Cell>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;INTEGRATION NAME</Cell>}
            flexGrow={1}
            cell={({rowIndex, ...props}) => {
              let imgSrc;
              if(dataList[rowIndex]["name"]!== null){
                imgSrc = require('assets/'+dataList[rowIndex]["name"]+'.png');
              }
              return(
                <Cell {...props}>
                  <img src={imgSrc} style={{"marginTop":dataList[rowIndex]["name"]=='jira'?'-15px':'0px'}}/>
                </Cell>
              )}
            }
            width={200} />

        case 'status' :
          return <Column
            isReorderable={true}
            isResizable={true}
            columnKey="status"
            align='center'
            header={<Cell>STATUS</Cell>}
            flexGrow={1}
            cell={({rowIndex, ...props}) =>{
              return (
                  <Cell {...props}>
                   <span style={{color:dataList[rowIndex]["status"]==='Active'?'green':'red',"vertical-align":"middle"}}>{dataList[rowIndex]["status"]}</span>
                  </Cell>
                  )
            }}
            width={100}  />

        case 'created' :
          return <Column
          isReorderable={true}
          isResizable={true}
          columnKey="created"
          align='center'
          header={<Cell>CREATED</Cell>}
          flexGrow={1}
          cell={({rowIndex, ...props}) =>{
            let createTime = dataList[rowIndex]["createtime"]
            if(createTime === null || createTime === "null")
              createTime = '-';
            else{
              createTime = moment.utc(createTime).format('MM[/]DD[/]YYYY [@] HH[:]mm');
            }
            return(
            <Cell {...props}>
             {createTime}
            </Cell>
            )}}
          width={200}  />


        case 'servicemessage':
          return <Column
          isReorderable={true}
          isResizable={true}
          columnKey="servicemessage"
          align='center'
          header={<Cell>SERVICE MESSAGE</Cell>}
          flexGrow={3}
          cell={({rowIndex, ...props}) => {
            return(
            <Cell {...props}>
             {dataList[rowIndex]["description"]}
            </Cell>
            )}}
          width={200}  />

        default :
          return {}
      }
    }
  },

  render() {
    let dataList = this.state.customPoliciesList;
    let selectedList = this.state.selectedCustomPoliciesId;

    // if(!this.state.loadingDiv && this.state.customPoliciesList.length<1)
    if(false)
    {
      return(
        <div>
          <CustomPoliciesIntro />
          <table style={{width: '100%'}}>
            <tbody>
              <tr>
                <td style={{textAlign: 'center'}}>
                  <AddCustomPolicies
                    totalCustomPoliciesCount = {this.state.customPoliciesList.length}
                    refreshCustomPoliciesList = {this.refreshCustomPoliciesList}
                    />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
    else{
    return (

    <div className='Col-xs-12' style={{margin: '30px 60px 0'}}>
      <div>
        {this.state.loadingDiv?
          <div style={{marginTop: 100,paddingTop:'100px',width:'100%', position:'relative'}}>
            <SpinnyLogo />
          </div>
        :
        <div>

          {/*<div>
            <FormGroup controlId="search" className="search">
              <InputGroup style={{marginRight:"60px"}}>
                <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
                <FormControl type="text" placeholder="Search or filter  here..."/>
              </InputGroup>
            </FormGroup>
          </div>*/}

          {/*<Row style={{position:'relative', height:50, marginLeft:4}}>
            <div>
              <AddCustomPolicies
                totalCustomPoliciesCount = {this.state.customPoliciesList.length}
                refreshCustomPoliciesList = {this.refreshCustomPoliciesList}
                />
            </div>
            <CustomPoliciesActions
              totalCustomPoliciesCount={this.state.customPoliciesList.length}
              slectedCustomPolicies={this.state.selectedCustomPoliciesId}
              refreshCustomPoliciesList={this.refreshCustomPoliciesList}
              removeFromSelected={this.removeFromSelected}
              selectedCustomPoliciesName={this.state.selectedCustomPoliciesName}/>

          </Row>*/}

          <Row style={{marginLeft:-75}}>
            <Col xs={12} lg={12}>
              <TestTable
                columnsList={this.state.columnsList}
                getTableColumn={this.getTableColumn}
                list={this.state.customPoliciesList}
                selected={this.state.selectedList}
                selectAllHandler={this.selectAllHandler}
                all={this.state.all}
                checkboxColumn={
                  <Column
                    ref="column"
                    header={
                      <Cell>
                        <input type='checkbox' id="selectAllChk" className="chkAll"
                        checked={(dataList.length > 0 && selectedList.length === dataList.length)?true:false}
                        onClick={this.selectAllHandler} />
                        <label htmlFor="selectAllChk"></label>
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
                        onClickHandler={this.selections} />
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
    </div>
  )}
  }
})

export default CustomPolicyPacksTable
