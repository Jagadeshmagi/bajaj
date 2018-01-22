import React from 'react'
import {Cell} from 'fixed-data-table'
import {Glyphicon,ProgressBar} from 'react-bootstrap'
import {getDockerStatus} from 'helpers/context'
import AttributeConstants from 'constants/AttributeConstants'
import {getScoreWithAssetGroupId} from 'helpers/reports'
import {getDockerGetScore} from 'helpers/docker'

/*function ScanProgress(props){
  
  let status = props.status

  let resourcesScanned = parseInt(props.group.resourcesScanned) || 0
  let resourcesTobeScanned = parseInt(props.group.resourcesTobeScanned) || 0

  let percentComplete = 0;
  percentComplete = Math.round(resourcesScanned/resourcesTobeScanned * 100)

  if(isNaN(percentComplete)) {
    percentComplete = 0
  }

  return(
    <div style={{fontSize:'18px'}}>
      {status} &nbsp;&nbsp;&nbsp;{percentComplete} %
      <div>
        <ProgressBar style={{height:'10px'}} bsStyle="success" now={percentComplete}/>
      </div>
    </div>
  )
}*/

export const DockerScanStatusCell = React.createClass({
  getInitialState() {
    return {
      assetGroupId: this.props.group.id,
      statusText: "-",
      pollForStatus: false
    };
  },
  componentDidMount(){
    console.log("polling? reRenderStatus", this.props.reRenderStatus)
    this.setState({statusText:this.props.group.status})
  },
  componentWillReceiveProps(nextProps,nextState){
    // if (nextProps.reRenderStatus != this.props.reRenderStatus) {
      console.log("reRenderStatus changed", nextProps.group)
      // if(nextProps.reRenderStatus){
      if (nextProps.reRenderStatus != this.props.reRenderStatus) {
        // this.getScore();
        console.log("reRenderStatus is true")
        this.setState({statusText:nextProps.group.status})
        if(nextProps.group.status !== "COMPLETED"){
          this.getDiscoveryStatus()
        } else if (nextProps.group.status == "COMPLETED"){
          // this.getScore();
        }
      }

      if(nextProps.group.status != this.props.group.status){
        if(nextProps.group.status === "COMPLETED"){
            // this.getScore();
        }
        // this.setState({statusText:nextProps.group.discovery_status})
        else if(nextProps.group.status !== "COMPLETED"){
          this.getDiscoveryStatus()
        }
        this.setState({statusText:nextProps.group.status})
      }
    // }
  },
  getDiscoveryStatus(){

    let assetGroupId = this.props.group.id

    if(assetGroupId > 0){
      return getDockerStatus(assetGroupId)
      .then((workLogStr) => {
        let workLog = workLogStr.status;
        console.log("assetGroupId: " + assetGroupId + "workLog: "+JSON.stringify(workLogStr), workLog);
        if(workLog != null){
          this.setState({statusText:workLog})
        }
        if(workLog === "COMPLETED"){
          this.getScore();
        }
      })
      .catch((error) => console.log("Error in getAssetGroupStatus:" + error))
    }
  },
  getScore(){
    console.log("getscore called")
    if(this.props.group.id != null){
      getDockerGetScore(this.props.group.id)
      .then((assessmentScore)=>{
        this.props.updateScore(this.props.group.id, assessmentScore.score);
        this.setState({score:assessmentScore})
      })
      .catch((scoreError)=>console.log("error in fetching score "+scoreError))
    }
  },
   render() {
    let status = this.state.statusText;
    if(status !== null 
      && status !== ''
      && status !== '-'){
      
      if(status !== "COMPLETED"){
        setTimeout(()=>{
          {this.getDiscoveryStatus()}

        }, 2000);
      }
      return (<div>{AttributeConstants.TEST_STATUS[status]}</div>)
    }else{
      return (<div>-</div>)
    }
  },
});



 /* render() {
    let status = this.state.statusText;
 
    if(status !== null && status !== '' && status !== '-'&& status!=="null"){
        
      if(status !== "COMPLETED" && status !== "ABORTED"  && status !== "NOT_TESTED"){
        setTimeout(()=>{
          {this.getDiscoveryStatus()}
        }, 2000);
        return(
          <div><ScanProgress key={this.props.group.id} group={this.props.group} status={AttributeConstants.TEST_STATUS[status]}/></div>
        )
      } else {
        return(
          <div>{AttributeConstants.TEST_STATUS[status]}</div>
        )
      }

    }
    else{
      return (
          <div>-</div>
      )
    }
  },
}); */
