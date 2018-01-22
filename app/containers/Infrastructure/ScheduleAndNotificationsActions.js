import React, {PropTypes} from 'react'
import {spacer} from 'sharedStyles/styles.css'
import {getScanTable} from 'helpers/schedules'
import {CreateScheduleAndNotifications,EditSchedule, DeleteTemplates} from 'containers'


function findElement(arr, propName, propValue) {
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue){
      return arr[i];
    }
}

const ScheduleAndNotificationsActions = React.createClass({

  getInitialState(){
    return{
      groupsAssigned:false 
    }
  },

  componentDidMount(){
    if(this.props.selectedTemplates.length==1){
     getScanTable(0,0)
    .then((response)=>{
      let selectedTempElement = findElement(response.scanschedulesview,"label",nextProps.selectedTemplates[0])
      if(selectedTempElement.groups.length>0){
       this.setState({groupsAssigned:true})
      }
    })
    .catch((getScanTableError)=>console.log("error in fetching templete details "+getScanTableError))
  }else{
    this.setState({groupsAssigned:false})
  }
  },

  componentWillReceiveProps(nextProps){
    if(nextProps.selectedTemplates!== this.props.selectedTemplates){
      if(nextProps.selectedTemplates.length==1){
     getScanTable(0,0)
    .then((response)=>{
      let selectedTempElement = findElement(response.scanschedulesview,"label",nextProps.selectedTemplates[0])
      if(selectedTempElement.groups.length>0){
       this.setState({groupsAssigned:true})
      }
    })
    .catch((getScanTableError)=>console.log("error in fetching templete details "+getScanTableError))
  }else{
    this.setState({groupsAssigned:false})
  }}
  },

  render:function() 
{ 
  let totalTemplatesCount = this.props.totalTemplatesCount  
  let templatesSelected = this.props.selectedTemplates 
  let numSelected = 0
  if(templatesSelected != null){
    numSelected = templatesSelected.length;
  }

  //const style={marginBottom: 15}
  let separator = ''
  let tempLabel = this.props.selectedTemplates[0]
  if (numSelected === 1) {
     separator = ' | '
  }
  

  return(
  numSelected === 0
  ?
    <div>
     {totalTemplatesCount} Templates :{'  '}
     <CreateScheduleAndNotifications totalTemplatesCount={this.props.totalTemplatesCount} refreshTemplatesList={this.props.refreshTemplatesList}/>
    </div>
  :
  <div>
    {totalTemplatesCount} Templates {numSelected} selected:{'  '}
    <CreateScheduleAndNotifications  totalTemplatesCount={this.props.totalTemplatesCount} refreshTemplatesList={this.props.refreshTemplatesList}/> {'  '}
    {numSelected === 1 ?
    <div style={{display:'inline-block'}}>
          {separator}
          <EditSchedule 
          refreshTemplatesList={this.props.refreshTemplatesList}
          removeFromSelected={this.props.removeFromSelected}
          selectedTemplatesList={this.props.selectedTemplates}
          selectedTemplateName={this.props.selectedTemplates[0]}
          groupsAssigned={this.state.groupsAssigned}/>
          {separator}
          <DeleteTemplates 
          refreshTemplatesList={this.props.refreshTemplatesList}
          removeFromSelected={this.props.removeFromSelected}
          selectedTemplatesList={this.props.selectedTemplates}
          selectedTemplateName={this.props.selectedTemplates[0]}
          groupsAssigned={this.state.groupsAssigned}/>
        
    </div>
      : <noscript/>
  }
 {/* {numSelected > 1 ?
    <div style={{display:'inline-block',marginBottom: 15}}>
    {'|'}
     <DeleteTemplates refreshTemplatesList={this.props.refreshTemplatesList}
          removeFromSelected={this.props.removeFromSelected}
          selectedTemplatesList={this.props.slectedTemplates}/>
      </div>
      : <noscript/>
      }*/}
  </div>
  )
}
})

export default ScheduleAndNotificationsActions
