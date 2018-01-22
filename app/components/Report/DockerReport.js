import React from 'react'
import {input} from './styles.css'
import {progress, mytable} from 'sharedStyles/styles.css'
import {Glyphicon, ProgressBar, Row, Col } from 'react-bootstrap'
import {TestStatus} from './ReportTestStatusCell'
import {Table,Column, Cell} from 'fixed-data-table'
import image from 'assets/gear.png'
import ScrollableDataTable from "containers/DataTable/ScrollableDataTable"
import ReactDOM from 'react-dom'

function findElement(arr, propName, propValue) {
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return arr[i];
}

const DockerReport = React.createClass({
  getInitialState(){
    return{
      columnsList:[
        {name:'testName', displayText:'TEST NAME', show:true, columnName: "TEST NAME", width:"130"},
        {name:'endtime', displayText:'DATE OF LAST TEST', show:true, columnName: "DATE OF LAST TEST", width:"130"},
        {name:'testStatus', displayText:'TEST STATUS', show:true, columnName: "TEST STATUS", width:"130"},
        {name:'policypacks', displayText:'POLICY PACK', show:true, columnName: "POLICY PACK", width:"130"},
        {name:'score', displayText:'RISK SCORE', show:true, columnName: "RISK SCORE", width:"130"}
      ]
    }
  },
  componentDidMount(){

  },
  getTableColumn: function(colName){

      let refreshDetailsProp = this.props.refreshDetails;
      let colObj = findElement(this.state.columnsList,"name",colName);

      if(colObj != null && colObj["show"]){

        switch(colName){
          case 'testName' :
            return <Column
              align='center'
              header={<Cell>TEST NAME</Cell>}
              flexGrow={5}
              cell={({rowIndex, ...props}) => {

                let testName = this.props.reportsList[rowIndex]["testname"]
                if(testName === null || testName === "null")
                  testName = '-';
                let detailLink = '#dockerReportdetail/'+this.props.reportsList[rowIndex]["scanid"]


                return(
                <Cell {...props}>
                  <a href={detailLink} target='_blank' title='Report'>{testName}</a>
                </Cell>
              )}}
              width={170} />
          case 'endtime' :
            return <Column
              align='center'
              header={<Cell>DATE OF LAST TEST</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => {
                let endtime = this.props.reportsList[rowIndex]["createtime"]
                if(endtime === null || endtime === "null")
                  endtime = '-';
                return(
                <Cell {...props}>
                  {endtime}
                </Cell>
              )}}
              width={150} />
          case 'testStatus' :
            return <Column
              align='center'
              header={<Cell>TEST STATUS</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  <TestStatus key={rowIndex} report={this.props.reportsList[rowIndex]} refreshDetails={refreshDetailsProp} />
                </Cell>
              )}
              width={100} />
          case 'policypacks' :
            return <Column
              align='center'
              header={<Cell>POLICY PACK</Cell>}
              flexGrow={4}
              cell={({rowIndex, ...props}) => {
                let policyPacksStr="";
                let i=0;
                let policyname=[];
                if(this.props.reportsList[rowIndex]["guidelines"] != null){
                  let policyPacksList = this.props.reportsList[rowIndex]["guidelines"]
                  for(i=0;i<policyPacksList.length;i++){
                    if(policyPacksList[i].indexOf("root")!=-1){
                      policyname[i]=policyPacksList[i].slice(5);
                    }else{
                      policyname[i]=policyPacksList[i]
                    }
                  }

                  policyPacksStr = policyname.join(', ');
                }
                return(
                <Cell {...props}>
                  {policyPacksStr}
                </Cell>
              )}}
              width={100} />

          case 'score':
            return <Column
              align='center'
              header={<Cell>RISK SCORE</Cell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  {this.props.reportsList[rowIndex]["score"]}
                </Cell>
              )}
              width={70} />
          default :
            return {}
        }
     }
   },
  render(){
    let selectedList = this.props.selectedList;
    let selectHandler = this.props.selectHandler;
    const checkboxColumn = <Column
      align='center'
          ref="column"
          header={
            <Cell>
            <input type='checkbox' id="selectAllChk" className="chkAll"
            checked={(this.props.reportsList.length > 0 && selectedList.length === this.props.reportsList.length)?true:false}
            onClick={this.props.selectAllHandler}
            ref={input => {
                if (input) {
                  input.indeterminate = (selectedList.length > 0 && selectedList.length < this.props.reportsList.length)?true:false;
                }
              }}
            />
            <label htmlFor="selectAllChk"></label>
            </Cell>
          }
          cell={({rowIndex, ...props}) =>(
          <Cell {...props}>
            <input type='checkbox' id={this.props.reportsList[rowIndex]["scanid"]}
                checked={(selectedList.indexOf(this.props.reportsList[rowIndex]["scanid"]) != -1)?true:false}
                onChange= {selectHandler} />
            <label htmlFor={this.props.reportsList[rowIndex]["scanid"]}></label>
          </Cell>
          )}
          width={50} />

    return (
    <div style={{marginLeft:'-60px'}}>
      <ScrollableDataTable
        columnsList={this.state.columnsList}
        getTableColumn={this.getTableColumn}
        checkboxColumn={checkboxColumn}
        list={this.props.reportsList}
        getDataList={this.props.getDataList}
        updateList={this.props.updateList}
        filter={this.props.filter}
      />
    </div>
  )
  }
})

export default (DockerReport);
