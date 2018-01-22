import React from 'react'
import {Cell} from 'fixed-data-table'
import {Glyphicon} from 'react-bootstrap'
import {getReportStatus} from 'helpers/context'
import AttributeConstants from 'constants/AttributeConstants'

export const TestStatus = React.createClass({
  getInitialState() {
    return { 
      workLogId: this.props.report.id,
      statusText: "-"
    };
  },
  componentDidMount(){
    this.setState({statusText:this.props.report.status})
  },
  componentWillReceiveProps(nextProps,nextState){
    if(nextProps.report.status != this.props.report.status){
      this.setState({statusText:this.props.report.status})
      if(nextProps.report.status !== "COMPLETED" && nextProps.report.status !== "ABORTED"){
        this.getStatus()
      }
    }
  },  
  getStatus(){
    let workLogId = this.props.report.worklogid

    if(workLogId > 0){
      return getReportStatus(workLogId)
      .then((workLogStr) => {
        let workLog = JSON.parse(workLogStr.output);
        if(workLog !== null){
          this.setState({statusText:workLog.status})
          if(workLog.status !== this.props.report.status)
            this.props.refreshDetails(this.props.report.id,workLog.status);
        }
       
       
      })
      .catch((error) => console.log("Error in getReportStatus:" + error))
    }
  },
  render() {
    let status = this.state.statusText
    if(status !== null 
      && status !== ''
      && status !== '-' && status !== "null"){
      
      if(status !== "COMPLETED" && status !== "ABORTED"){
        setTimeout(()=>{
          {this.getStatus()}

        }, 10000);
      }
      return (<div>{AttributeConstants.TEST_STATUS[status]}</div>)
    }else{
      return (<div>-</div>)
    }
  },
});

