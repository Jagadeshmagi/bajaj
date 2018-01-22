import React from 'react'
import {Cell} from 'fixed-data-table'
import {Glyphicon} from 'react-bootstrap'
import {getDiscoveryWorklog} from 'helpers/context'

export const GroupsInaccessCount = React.createClass({
  getInitialState() {
    return { 
      assetId: this.props.group.assetId,
      statusText: "loading",
      inaccessCount:0,
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
          this.setState({statusText:workLog.status,inaccessCount:workLog.inactiveIpCount})
        }else{
          this.setState({statusText:"-"})
        }
      })
      .catch((error) => console.log("Error in getDiscoveryWorklog:" + error))
    }
  },
  render() {
    let status = this.state.statusText;
  let inaccessCount = this.state.inaccessCount;
    if(status === "loading"){
      return (<div>loading...</div>)
    }
    if(status !== null 
      && status !== ''
      && status !== '-'){
      
      if(status !== "COMPLETED"){
        setTimeout(()=>{
          {this.getDiscoveryStatus()}

        }, 2000);
      }
      return (<div>{inaccessCount}</div>)
    }else{
      return (<div>{inaccessCount}</div>)
    }
  },
});
