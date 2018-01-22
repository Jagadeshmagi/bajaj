import React from 'react'
import {Cell} from 'fixed-data-table'
import {Glyphicon} from 'react-bootstrap'
import {getDiscoveryWorklog} from 'helpers/context'
import {getScoreWithWorklogId} from 'helpers/reports'

export const GroupScore = React.createClass({
  getInitialState() {
    return { 
      assetId: this.props.group.assetId,
      statusText: "loading",
      score:'',
      pollForStatus: false
    };
  },
  componentDidMount(){
    this.getDiscoveryStatus();
  },
  componentWillReceiveProps(nextProps,nextState){
    if (nextProps.reRenderStatus != this.props.reRenderStatus) {
      console.log("reRenderStatus changed")
      if(nextProps.reRenderStatus){
        console.log("reRenderStatus is true")
        this.getDiscoveryStatus();
      }
    }
  },  
  getDiscoveryStatus(){

    let assetId = this.props.group.assetId

    if(assetId > 0){
      return getDiscoveryWorklog(assetId)
      .then((workLogStr) => {
        let workLog = JSON.parse(workLogStr.output);
        if(workLog != null){
          this.setState({statusText:workLog.status})
          if(workLog.status != null && workLog.status === 'COMPLETED'){
            console.log("SCORE CALL COMPLETED for assetId:"+assetId);
            this.getScore();
          }else{
            setTimeout(()=>{{this.getDiscoveryStatus()}}, 2000);
          }
        }
      })
      .catch((error) => console.log("Error in getDiscoveryWorklog:" + error))
    }
  },
  getScore(){
    if(this.props.group.assessmentLogId != null){
      getScoreWithWorklogId(this.props.group.assessmentLogId)
      .then((assessmentScore)=>{
        this.setState({score:assessmentScore})  
      })
      .catch((scoreError)=>console.log("error in fetching score "+scoreError))
    }
  },  
  render() {
    let status = this.state.statusText;
    let score = this.state.score;
    return (<div>{score}</div>)
  },
});
