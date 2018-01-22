import React from 'react'
import {getWorklogById} from 'helpers/assetGroups'
import {SpinnyLogo} from 'containers'

const AssetGroupReport = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentDidMount(){
    
    let worklogId = this.props.routeParams.worklogId
    getWorklogById(worklogId)
    .then((worklog) => {
      let policyGroupsStr = worklog.policygroups.substring(1,worklog.policygroups.length-1);
      let policypack = policyGroupsStr.split(",")[0]
      let assetType = worklog.assettype;
      let reportAtype = worklog.assettype;
      let scoreHref = "reportdetail/"+worklogId+"?policypackname="+policypack+"&assettype="+assetType+"&reportAtype="+assetType

      if(assetType && assetType=== "IMAGE")
        scoreHref = 'dockerReportdetail/'+worklogId+'?policypackname='+policypack+'&assettype='+assetType+'&reportAtype='+assetType
      else if(assetType && assetType.toUpperCase() === "AWS")
        scoreHref = 'cloudReportdetail/'+worklogId+'?policypackname='+policypack+'&assettype='+assetType+'&reportAtype='+assetType          

      this.context.router.replace(scoreHref);
    })
    
  },
  render(){
    return (<div style={{marginTop: 20,paddingTop:'100px',width:'100%'}}>
      <SpinnyLogo />
    </div>)
  }
});

export default (AssetGroupReport)