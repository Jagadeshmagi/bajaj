import React, {PropTypes} from 'react'
import {EditGroups} from 'containers'
// import {DeleteGroups} from './RescanGroups'
import {DeleteGroups} from 'containers'
import {RefreshGroups} from 'containers'
import {ScanGroups} from 'containers'
import {StopScan} from 'containers'
import {Col,InputGroup,FormGroup,FormControl,Checkbox,Glyphicon,Modal,Button} from 'react-bootstrap'
import {spacer} from 'sharedStyles/styles.css'
import {findElement,findIndex} from 'javascripts/util.js'

const AssetGroupsActions = React.createClass({
render:function()
{

  let totalGroupsCount = this.props.totalGroupsCount
  console.log("Total Groups Count "+totalGroupsCount)
  let groupsSelected = this.props.selectedIds
  console.log(" Groups selected ids are "+groupsSelected)

  let selectedGroup = {}
  if(totalGroupsCount === 0){
    return <div style={style}>0 Groups</div>
  }

  let numSelected = 0;
  if(groupsSelected != null){
    numSelected = groupsSelected.length;

  }

  const style={marginBottom: 15, display:'flex', justifyContent:'flex-start'}
  let separator = ''
  if (numSelected >= 1) {
     separator = ' | '
  }

   var status = "COMPLETED";
  if(numSelected == 1)
  {
    selectedGroup = findElement(this.props.list,"id",this.props.selectedIds[0])
    this.props.list.map((r) =>
             {
               if(r.id==this.props.selectedIds)
               {
                status = r.discovery_status;
               }
             })
  }

  return(
  numSelected === 0
  ?
    <div style={style}>
      {totalGroupsCount} Groups
    </div>
  :
    <div style={style}>
      {totalGroupsCount} Groups &nbsp;
      {numSelected} Selected:&nbsp;{' '}
      {numSelected === 1 && status!="RUNNING" ? <span><a href='JavaScript: void(0)'><EditGroups editGroupId={this.props.selectedIds} refreshedit={this.props.refreshedit}/></a>&nbsp;{separator}&nbsp;</span> : <noscript />}
      {numSelected === 1 && status!="RUNNING" ? 
        <span><a href='JavaScript: void(0)'>
        <ScanGroups
            list={this.props.list}
            selectedIds={this.props.selectedIds}
            refreshList={this.props.refreshList}
            refreshedit={this.props.refreshedit} /> 
        </a>&nbsp;{separator}&nbsp;</span> : <noscript />
      }
      {numSelected === 1 && status==="RUNNING" ? 
        <span><a href='JavaScript: void(0)'>
           <StopScan
            list={this.props.list}
            selectedGroup={selectedGroup}
            selectedIds={this.props.selectedIds}
            refreshList={this.props.refreshList}
            refreshedit={this.props.refreshedit} />
        </a>&nbsp;&nbsp;</span> : <noscript />
      }      
      {status==="RUNNING" ?'':
      <a href='JavaScript: void(0)'>
        <DeleteGroups
          list={this.props.list}
          selectedIds={this.props.selectedIds}
          refreshList={this.props.refreshList}
          refreshSelected={this.props.refreshSelected}/>
      </a> }
      {status==="RUNNING" ?'':
      <span>
      &nbsp;
      {separator}&nbsp;
      <a href='JavaScript: void(0)'>
        <RefreshGroups
          list={this.props.list}
          selectedIds={this.props.selectedIds}
          refreshList={this.props.refreshList}
          refreshSelected={this.props.refreshSelected}/>
      </a></span>
    }
    </div>
  )
}
})

export default AssetGroupsActions
