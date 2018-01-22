import React, { PropTypes } from 'react'
import {Glyphicon,Col, Row} from 'react-bootstrap'
import {RuleDetails} from './RuleDetails'
import {Table,Column, Cell} from 'fixed-data-table'
import ScrollableDataTableInModal from "containers/DataTable/ScrollableDataTableInModal"
import {newGetPolicyPackRules} from 'helpers/policies'
import ReactTooltip from 'react-tooltip'
import ReactDOM from 'react-dom'
import {TooltipCellPolicyPack} from 'components/Table/Table'



function findElement(arr, propName, propValue) {
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return arr[i];
}

export const RuleList = React.createClass ({
  getInitialState(){
    return{
      ruleNodesToLoad:[],
      columnsList:[
        {name:'policyName', displayText:'POLICY NAME', show:true, columnName: "NAME", width:"200"},
        {name:'iIcon', displayText:'', show:true, columnName: "IICON", width:"100"}
      ],
      filter:{},
    }
  },

  componentDidMount(){
    this.getRulesList(50,50,{})
  },

  getTableColumn(colName){
    let colObj = findElement(this.state.columnsList,"name",colName);
    if(colObj != null && colObj["show"]){
      switch(colName){
          case 'policyName' :
            return <Column
              flexGrow={1.5}
              cell={<TooltipCellPolicyPack data={this.state.ruleNodesToLoad} col="title"/>}
              width={420} />
          case 'iIcon' :
            return <Column
              align='center'
              flexGrow={2}
              cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                 <RuleDetails key={this.state.ruleNodesToLoad[rowIndex]["id"]} ruleId={this.state.ruleNodesToLoad[rowIndex]["id"]}/>
                 </Cell>
              )}
              width={100}  />
          default :
            return {}
            }
     }
   },
  getRulesList(start,end,filter){

    newGetPolicyPackRules(this.props.controlId, this.props.osSelected,this.props.policyPackPath,this.props.profiles,start,end)
    .then((nodes) => {
      let newList = this.state.ruleNodesToLoad.concat(nodes);
      this.setState({ruleNodesToLoad:newList})
    })
    .catch((error) => console.log("Error in getting the getPolicyPackRules"))

  },
  render() {

    return (
      <div>
        <div style={{width:550, height:400, marginTop:-50}}>

        <ScrollableDataTableInModal
          large = "no"
          columnsList={this.state.columnsList}
          getTableColumn={this.getTableColumn}
          list={this.state.ruleNodesToLoad}
          getDataList={this.getRulesList}
          filter={this.state.filter}
          width={560}
          height={500}
          margin={{top:0, bottom: 0, left: 0, right: 0}}
        />
        </div>
      </div>
    )
  }
})
