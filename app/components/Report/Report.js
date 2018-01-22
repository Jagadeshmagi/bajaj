import React from 'react'
import {input} from './styles.css'
import {progress, mytable} from 'sharedStyles/styles.css'
import {Glyphicon, ProgressBar, Row, Col } from 'react-bootstrap'
import {TestStatus} from './ReportTestStatusCell'
import {Table,Column, Cell} from 'fixed-data-table'
import image from 'assets/gear.png'
import ScrollableDataTable from "containers/DataTable/ScrollableDataTable"
import ReactDOM from 'react-dom'
import {container,center,circleGreen,circleBlue,diamondRed,triangleupOrange} from 'containers/Infrastructure/styles.css'
import {PolicyPacksCell} from 'components/Table/Table'
import moment from 'moment'
import ReactTooltip from 'react-tooltip'
import {getReportFilter} from 'helpers/reports'
import {findElement} from 'javascripts/util.js'

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
const Report = React.createClass({
  getInitialState(){
    return{
      filter:{sortby: "name", orderby: "desc"},
      colSortDirs:{},
      columnsList:[
        {name:'testName', displayText:'REPORT NAME', show:true, columnName: "TEST NAME", width:130},
        {name:'endtime', displayText:'DATE OF LAST TEST', show:true, columnName: "DATE OF LAST TEST", width:130},
        {name:'testStatus', displayText:'ASSESSMENT STATUS', show:true, columnName: "ASSESSMENT STATUS", width:130},
        {name:'policypacks', displayText:'POLICY PACK', show:true, columnName: "POLICY PACK", width:130},
        {name:'groupName', displayText:'GROUPS', show:true, columnName: "GROUPS", width:130},
        {name:'score', displayText:'RISK SCORE', show:true, columnName: "RISK SCORE", width:130}
      ]
    }
  },
  componentDidMount(){
    this._onSortChange(this.state.filter.sortby, this.state.filter.orderby)
   
  },
  _onSortChange(columnKey, sortDir) {
    console.log("columnKey, sortDir", columnKey, sortDir)
    if(columnKey=='testName')
      {
        
        var columnKeyJson = 'testname';
        
      }
      if(columnKey=='endtime')
      {
         var columnKeyJson = 'endtime';
        
      }
      if(columnKey=='testStatus')
      {
        var columnKeyJson = 'status';
        
      }
      if(columnKey=='score')
      {
        var columnKeyJson = 'score';
        
      }
      if(columnKey=='groupName')
      {
        var columnKeyJson = 'name';
        
      }
      if(columnKey=='policypacks')
      {
        var columnKeyJson = 'policygroups';
        
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
     getReportFilter(50, 50, SortJson).then((newElements)=>{
               console.log(newElements)
               let selectList = [];
             if (newElements.assessments) {
              newElements.assessments.map((elem) =>
              {
                selectList.push(elem.id)
              })
             }
               this.setState({
                   list: newElements.assessments,
               }, (res) => {
                 console.log("RAWR RAWR RAWR!!! THIS IS THE SELECTED LIST UPON SEARCH ", this.state.list, this.state.selected)})
             });

    this.setState({
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  },
  getTableColumn: function(colName){

      let refreshDetailsProp = this.props.refreshDetails;
      let colObj = findElement(this.state.columnsList,"name",colName);

      if(colObj != null && colObj["show"]){

        switch(colName){
          case 'testName' :
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="testName"
              align='center'
              header={<SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.testName}>
                  REPORT NAME
                </SortHeaderCell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => {
                let selectedPolicyPack={};
                let testName = this.props.reportsList[rowIndex]["testName"]
                let aType = this.props.reportsList[rowIndex]["assetType"]
                if(testName === null || testName === "null")
                  testName = '-';

                let testStatus = this.props.reportsList[rowIndex]["status"]

                let detailLink = '#reportdetail/'+this.props.reportsList[rowIndex]["worklogid"]

                if(this.props.filter.policypacks!=null){
                   //++++++++++ Filters for policypack is applied ++++++++++++
                  let appliedPolicypack = this.props.filter.policypacks
                  let stringifiedPolicyPack = appliedPolicypack.toString();
                  selectedPolicyPack = findElement(this.props.policyPacks,"path",stringifiedPolicyPack.substring(1,stringifiedPolicyPack.length-1));
                }
                else{
                  //+++++++++ No filters appiled +++++++++
                  let firstPolicyPackName = this.props.reportsList[rowIndex]["policygroups"][0];
                  if(firstPolicyPackName != null && aType != null){
                    selectedPolicyPack = findElement(this.props.policyPacks,"path",firstPolicyPackName);
                  }
                }

                if(aType=== "IMAGE" && selectedPolicyPack)
                  detailLink = '#dockerReportdetail/'+this.props.reportsList[rowIndex]["worklogid"]+'?policypackname='+selectedPolicyPack.path+'&assettype='+aType+'&reportAtype='+aType
                else if(selectedPolicyPack && selectedPolicyPack["assettype"] && selectedPolicyPack["assettype"].toUpperCase() === "ONPREM")
                  detailLink = '#reportdetail/'+this.props.reportsList[rowIndex]["worklogid"]+'?policypackname='+selectedPolicyPack.path+'&assettype='+aType+'&reportAtype='+aType
                else if(selectedPolicyPack && selectedPolicyPack["assettype"] && selectedPolicyPack["assettype"].toUpperCase() === "AWS")
                  detailLink = '#cloudReportdetail/'+this.props.reportsList[rowIndex]["worklogid"]+'?policypackname='+selectedPolicyPack.path+'&assettype='+aType+'&reportAtype='+aType                


                if(testStatus === 'COMPLETED'){
                  return(
                    <Cell {...props}
                      onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
                      onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
                      <div data-type="info" ref='valueDiv' data-tip={testName}>
                        <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px", paddingLeft:"10px"}}>
                          <a href={detailLink} target='_blank' title='Report'>{testName}</a>
                        </div>
                      </div>
                    </Cell>
                  )
                }else{
                  return(
                    <Cell {...props}
                      onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
                      onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
                      <div data-type="info" ref='valueDiv' data-tip={testName}>
                        <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px", paddingLeft:"10px"}}>
                          {testName}
                        </div>
                      </div>
                    </Cell>
                  )
                }

              }}

              width={colObj['width']}  />
          case 'endtime' :
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="endtime"
              align='center'
              header={<SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.endtime}>
                  DATE OF LAST TEST(UTC)
                </SortHeaderCell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => {
                let endtime = this.props.reportsList[rowIndex]["endtime"]
                if(endtime === null || endtime === "null" || endtime=== undefined)
                  endtime = '-';
                else{
                  endtime = moment.utc(endtime,"YYYY/MM/DD @ HH:mm TZD").format('MM[/]DD[/]YYYY [@] HH[:]mm');
                }
                return(
                <Cell {...props}>
                  {endtime}
                </Cell>
              )}}
              width={colObj['width']}  />
          case 'testStatus' :
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="testStatus"
              align='center'
              header={<SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.testStatus}>
                  ASSESSMENT STATUS
                </SortHeaderCell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                  <TestStatus key={rowIndex} report={this.props.reportsList[rowIndex]} refreshDetails={refreshDetailsProp} />
                </Cell>
              )}
              width={colObj['width']}  />
          case 'policypacks' :
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="policypacks"
              align='center'
              header={<SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.policypacks}>
                  POLICY PACK
                </SortHeaderCell>}
              flexGrow={1}
              cell={({rowIndex, ...props}) => {
                let policyPacksStr="";
                let i=0;
                let policyname=[];
                if(this.props.reportsList[rowIndex]["policygroups"] != null){
                  let policyPacksList = this.props.reportsList[rowIndex]["policygroups"]
                  for(i=0;i<policyPacksList.length;i++){
                    let policyPack = findElement(this.props.policyPacks,"path",policyPacksList[i])
                    if(policyPack)
                      policyname[i]= policyPack.title
                  }
                  return(
                    <Cell>
                      <PolicyPacksCell width={160} policyname={policyname} rowIndex={this.props.rowIndex} col="policygroups"/>
                    </Cell>
                  )
                }
              }}
              width={colObj['width']} />
          case 'groupName' :
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="groupName"
              align='center'
              header={<SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.groupName}>
                  GROUPS
                </SortHeaderCell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => {

                let groupName = this.props.reportsList[rowIndex]["groupName"]
                if(groupName === null || groupName === "null"||groupName=="N/A")
                  groupName = '-';
                return (
                  (groupName === '-')?
                  <Cell {...props}>
                    {groupName}
                  </Cell>    
                  :
                  <Cell {...props}
                    onMouseMove={() => { ReactTooltip.show(ReactDOM.findDOMNode(this.refs.valueDiv));}}
                    onMouseLeave={() => { ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.valueDiv));}}>
                    <div data-type="info" ref='valueDiv' data-tip={groupName}>
                      <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'block', width:props.width, paddingRight:"10px", paddingLeft:"10px"}}>
                        {groupName}
                      </div>
                    </div>
                  </Cell>                   
              )}}
              width={colObj['width']}  />
          case 'score':
            return <Column
              isReorderable={true}
              isResizable={true}
              columnKey="score"
              align='center'
              header={<SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={this.state.colSortDirs.score}>
                  RISK SCORE
                </SortHeaderCell>}
              flexGrow={2}
              cell={({rowIndex, ...props}) => {
              let statusStyle;
              if(this.props.reportsList[rowIndex]["score"] != null){
                if(this.props.reportsList[rowIndex]["score"] <= 50 &&this.props.reportsList[rowIndex]["status"] === "COMPLETED"){
                  statusStyle = diamondRed;
                }else if(50 < this.props.reportsList[rowIndex]["score"] && this.props.reportsList[rowIndex]["score"]<=80 && this.props.reportsList[rowIndex]["status"]=== "COMPLETED"){
                  statusStyle = triangleupOrange;
                }else if(80 < this.props.reportsList[rowIndex]["score"] && this.props.reportsList[rowIndex]["score"]<=100 && this.props.reportsList[rowIndex]["status"]=== "COMPLETED"){
                  statusStyle = circleGreen;}
              }
                  return(
                  <Cell {...props}>
                    <div className={statusStyle} style={{display:'flex',justifyContent:'center',paddingLeft:'10px'}}>{statusStyle?this.props.reportsList[rowIndex]["score"]:"-"}</div>
                  </Cell>
                )}}

              width={colObj['width']}  />
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
            <label style={{marginTop:'10px'}} htmlFor="selectAllChk"></label>
            </Cell>
          }
          cell={({rowIndex, ...props}) =>(
          <Cell style={{marginTop:"5"}}  {...props}>
            <input type='checkbox' id={this.props.reportsList[rowIndex]["id"]}
                checked={(selectedList.indexOf(this.props.reportsList[rowIndex]["id"]) != -1)?true:false}
                onChange= {selectHandler} />
            <label htmlFor={this.props.reportsList[rowIndex]["id"]}></label>
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

export default (Report);
