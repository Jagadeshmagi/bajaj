import React, { PropTypes } from 'react'
import {AlertTable} from 'containers'
import {blueBtn} from 'sharedStyles/styles.css'
import {Button,Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Overlay, Grid, Row} from 'react-bootstrap'
import {ResourceColumnChooserClass} from 'containers/Infrastructure/ResourceColumnChooserCell'
import {Table,Column, Cell} from 'fixed-data-table'
import {Header } from 'components/Header/Header'
import {AccessCell,ArrayLinkCell,ScoreCell,ComplianceCell,GroupCell,TextCell,LinkCell,CheckboxCell, TooltipCell, GroupsCell} from 'components/Table/Table'
import {SpinnyLogo} from 'containers'
import moment from 'moment'
import TestTable from 'containers/Infrastructure/TestTable'
import {getAllDockerImage} from 'helpers/docker'
import {getAllAlerts} from 'helpers/alerts'

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


const AlertActionButtons = React.createClass({
  render: function () {
      let count = this.props.alertCount
      return (count > 0 )
      ? <p style={{paddingLeft: 20, paddingTop: 10, paddingBottom: 10, fontSize: 18}}>
            {count} Alerts selected: {' '}
            <a href="javaScript:void(0)">Edit</a> {' '} | {' '}
            <a href="javaScript:void(0)">Delete</a> {' '} | {' '}
            <a href="javaScript:void(0)">Integrate</a>
        </p>
      :
      <p style={{paddingLeft: 20, paddingTop: 10, paddingBottom: 10, fontSize: 18}}>
         {' '}
      </p>
  }
})

const AlertRules = React.createClass({
  getInitialState(){
    return{
      list:[],
      selected: [],
      columnsList:[
        {name:'name', displayText:'Alert', show:true, columnName: "ALERT", width:"150"},
        {name:'createTime', displayText:'Date', show:true,  columnName: "DATE", width:"100",},
        {name:'description', displayText:'Description', show:true, columnName: "DESCRIPTION", width:"150"},
        {name:'severity', displayText:'Severity', show:true, columnName: "SEVERITY", width:"150"},
        {name:'count', displayText:'Alert Count', show:true, columnName: "ALERT COUNT", width:"150"},
        {name:'source', displayText:'Source', show:true, columnName: "SOURCE", width:"150"}
      ],
      all:false,
      dataLoad:true,
    }
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  refreshList(){
   this.setState({list:[]},function(){
    getAllAlerts()
    .then((alert) => {
      
      if(alert){
        this.setState({
          list:alert
        },function(){
          console.log("list***********"+JSON.stringify(this.state.list))
        })
      }
    })
    .catch((error) => console.log("Error in getting images list:"+error))
   })
  },
  componentDidMount(){
    this.setState({selected: []});
    let heightWindow = window.innerHeight;
    let heightGear = heightWindow - 360;
    this.setState({
      heightGear: heightGear
    })

    getAllAlerts()
    .then((alert) => {
     
      if(alert){
        this.setState({
          list:alert,
          dataLoad:true
        },function(){
          console.log("list***********"+JSON.stringify(this.state.list))
        })
      }
    })
    .catch((error) => console.log("Error in getting images list:"+error))

    
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
  selectAllHandler(){
    if(!this.state.all){
      this.setState({dataLoad:true});
    }
    this.setState({all:!this.state.all},
      (res)=>{
        console.log("this.state.all ", this.state.all, this.state.selected)
        if(this.state.all === true){
         getAllAlerts()
         .then((alert) => {
          
           let selectList = [];
              alert.map((r) =>
             {
               selectList.push(r.id)
             })
           this.setState({
             selected: selectList,
             list:alert,
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
             align='center'
              header={<Cell>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ALERT</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      {dataList[rowIndex]["name"]}
                    </Cell>
                    )}

             width={150} />
            case 'createTime' :
            return <Column
              align='center'
              header={<Cell>DATE</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                     {dataList[rowIndex]["createTime"]}
                    </Cell>
                    )}
              width={100}  />
          case 'description' :
            return <Column
              align='center'
              header={<Cell>DESCRIPTION</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                     -
                    </Cell>
                    )}
              width={100}  />
            case 'severity' :
            return <Column
              align='center'
              header={<Cell>SEVERITY</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      { dataList[rowIndex]["severity"]}
                    </Cell>
                    )}

              width={100}  />
            case 'count':
            return <Column
              align='center'
              header={<Cell>ALERT COUNT</Cell>}
              flexGrow={3}
               cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                      -
                    </Cell>
                    )}
              width={150}/>

             case 'source':
              return <Column
                align='center'
                header={<Cell>SOURCE</Cell>}
                flexGrow={4}
                cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                     -
                    </Cell>
                    )}
                width={130}  />
          default :
            return {}
        }
     }
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


 /* onClickHandler(rowIndex) {
    const index = this.state.selected.indexOf(rowIndex)
    if (index == -1)
    {
      this.state.selected.push(rowIndex)
    } else {
      this.state.selected.splice(index,1)
    }
    this.setState({selected: this.state.selected})
    //console.log(this.state.selected)
  },*/
  render() {
    let dataList = this.state.list;
     let selectedList = this.state.selected;

    return (
    <div>
     {(this.state.dataLoad)?

     

      <div>
        <Row style={{height:50, marginTop:20}}>
          <Col xs={6} style={{paddingLeft:58}}>
            <AlertActionButtons alertCount={this.state.selected.length} />
          </Col>
        </Row>
         <Row style={{marginRight:"0"}}>
        <Col xs={12} lg={12}>
         <AlertTable onClickHandler={this.onClickHandler}/>
          <TestTable
            columnsList={this.state.columnsList}
            getTableColumn={this.getTableColumn}
            list={this.state.list}
            selected={this.state.selected}
            updateList = {this.updateList}
            onClickHandler={this.onClickHandler}
            selectAllHandler={this.selectAllHandler}
            all={this.state.all}
           getDataList={getAllAlerts}
          
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
              <div style={{display: 'flex',justifyContent:'flex-end', position:'absolute', top:-48, right:5}}>
               
                <div id="refresh" style={{margin:'9px 10px', cursor:'pointer'}}>
                  <a onClick={this.refreshList}> <Glyphicon style={{color:'#4e56a0', fontSize:"19"}} glyph="glyphicon glyphicon-refresh" /></a>
                  {/*<a onClick={this.refreshList}> <img src={refreshIcon1} alt="refreshIcon"/></a>*/}
                </div>
                <div style={{margin:'0px 5px', cursor:'pointer'}}>
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
    : <div style={{marginTop:280}}><SpinnyLogo /></div>
    }

    </div>
        
       
     
    )
  },
})

export default AlertRules