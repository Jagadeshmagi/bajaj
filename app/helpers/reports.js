//import NetworkConstants from '../constants/NetworkConstants';
import axios from 'axios'

export function getReportsMainList(start,end,filterJSON) {
  console.log("getReportsMainList called in helper");
  return new Promise((resolve, reject) => {
    //resolve(getDummyReportsList());
    console.log("filterJSON:" + filterJSON);
      axios.post(NetworkConstants.API_SERVER+'/reports/assessment/' + start + '/' + end,filterJSON,{headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          console.log("getReportsMainList resolve data: " +response.data);
          console.log("getReportsMainList resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

export function getReportsCount() {
  console.log("getReportsCount called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/reports/assessment/count')
        .then(function (response) {
          console.log("getReportsCount resolve data: " +response.data);
          console.log("getReportsCount resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

export function getReportsList() {
  console.log("getReportsList called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/settings/assetgroups/worklog')
        .then(function (response) {
          console.log("getReportsList resolve data: " +response.data);
          console.log("getReportsList resolve status: " +response.status);
          resolve(response.data);
         })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

export function getResultsList(assetId) {
  console.log("getResultsList called in helper assetId:"+assetId);
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/settings/resources/asset/'+assetId)
        .then(function (response) {
          console.log("getResultsList resolve data: " +response.data);
          console.log("getResultsList resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}


export function getCloudPolicyResultsListWithFilter(worklogId,filterJSON,start,end) {
  console.log("getCloudPolicyResultsList called in helper worklogId:"+worklogId);
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/reports/cloud/'+worklogId+'/'+start+'/'+end,filterJSON,{headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

  })
}

export function getOnPremPolicyResultsList(worklogId, filter, start, end) {
  console.log("getOnPremPolicyResultsList called in helper worklogId:"+worklogId);
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/reports/group/'+worklogId+'/'+start+'/'+end,filter,{
      headers: { 'Content-Type': 'application/json'
       }})
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

  })
}

export function getDevicePolicyResultsList(worklogId, resourceId, filter, start, end) {
  console.log("getDevicePolicyResultsList called in helper resourceId:"+resourceId);
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/reports/devicedetails/'+worklogId+'/'+resourceId+'/'+start+'/'+end,filter,{
      headers: { 'Content-Type': 'application/json'
       }})
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

  })
}

export function getResourceById(resourceId) {
  console.log("getResourceById called in helper resourceId:"+resourceId);
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/settings/resources/'+resourceId)
        .then(function (response) {
          console.log("getResourceById resolve data: " +response.data);
          console.log("getResourceById resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

export function getScoreWithWorklogId(worklogId,policyPack) {
  console.log("getScoreFromWorklog in helper with worklogId:"+worklogId+" policyPack is "+policyPack);
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'getScoreByWorklog?wid='+worklogId+'&pp='+policyPack)
    .then(function (response) {
      console.log("getScoreFromWorklog resolve data: " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getScoreFromWorklog reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

export function getScoreWithAssetGroupId(assetGroupId) {
  console.log("getScoreWithAssetGroupId in helper with assetGroupId:"+assetGroupId);
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'getScoreByAG?aid='+assetGroupId)
    .then(function (response) {
      console.log("getScoreWithAssetGroupId resolve data: " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getScoreWithAssetGroupId reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}


export function getTragettedPolicypacks(worklogId,assetType){
  console.log('getTragettedPolicypacks invoked in helper')
  return new Promise((resolve, reject) => {
     axios.get(NetworkConstants.API_SERVER+'/reports/header/'+worklogId+'/policypack?assettype='+assetType)
    .then(function (response) {
      console.log("getTragettedPolicypacks resolve data: " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getTragettedPolicypacks reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}


export function getWorkLogViewRecord (worklogId,assettype, policyPack) {
  console.log("getWorkLogViewRecord in helper worklogId:"+worklogId);
  return new Promise((resolve, reject) => {
     axios.get(NetworkConstants.API_SERVER+'/reports/header/'+worklogId+'?assettype='+assettype+'&policypack='+policyPack)
    .then(function (response) {
      console.log("getWorkLogViewRecord resolve data: " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getWorkLogViewRecord reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

export function getcloudDataStatistics (worklogID,zoom,policyPack) {
  return new Promise((resolve, reject) => {
     axios.get(NetworkConstants.NODEJS_SERVER+'getCloudReportCS?wid='+worklogID+'&zoom='+zoom+'&pp='+policyPack)
    .then(function (response) {
      console.log("getcloudDataStatistics resolve data: " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getcloudDataStatistics reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

export function getState(params) {
  var query = '';
  if (params !== '')
  {
  query = params;
  }
  if (params === undefined)
  {
    query = '';
  }
  return new Promise((resolve, reject) => {
    // axios.get(NetworkConstants.API_SERVER+'/state?worklogid='+worklogID+'&resid='+resourceId)
    axios.get(NetworkConstants.API_SERVER+'/state'+query)
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

export function getSeverity(params) {
  var query = '';
  if(params!='')
  {
  query = params;
  }
  if(params === undefined)
  {
    query = '';
  }
  return new Promise((resolve, reject) => {
     //axios.get(NetworkConstants.API_SERVER+'/severity?worklogid='+worklogID+'&resid='+resourceId)
    axios.get(NetworkConstants.API_SERVER+'/severity'+query)
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getSeverity reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

export function getControlFamiliesOnPolicyPack(worklogID,policyPack) {
  return new Promise((resolve, reject) => {
     axios.get(NetworkConstants.API_SERVER+'/policypack/controlfamily?worklogid='+worklogID+'&policypack='+policyPack)
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

export function getReportsExists() {
  return new Promise((resolve, reject) => {
     axios.get(NetworkConstants.API_SERVER+'/reports/assessment/status')
    .then(function (response) {
      console.log("getReportsExists resolve data: " +response.data);
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getReportsExists reject :"+response);
      reject(response);
    });
  })
}


export function getDeviceDetailHeaderRecord(worklogId, resourceId, policyPack, assetType) {
  return new Promise((resolve, reject) => {
     axios.get(NetworkConstants.API_SERVER+'/reports/devicedetails/header/'+worklogId+'/'+resourceId+'?policypack='+policyPack+'&assettype='+assetType)
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getDeviceDetailHeaderRecord reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

export function getGroupResultsByControlFamily(worklogId, assetGroupId, policyPack) {
  return new Promise((resolve, reject) => {
    console.log("getGroupResultsByControlFamily called with worklogId:"+worklogId+" assetGroupId:"+assetGroupId +" policyPack:"+policyPack);

     axios.get(NetworkConstants.NODEJS_SERVER+'getDeviceGroupReport/CF?agid='+assetGroupId+'&wid='+worklogId+'&pp='+policyPack)
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getGroupResultsByControlFamily reject :"+JSON.stringify(response));
      reject(response);
    });

  })
}

export function getDeviceResultsByControlFamily(worklogId, resourceId, policyPack) {
  return new Promise((resolve, reject) => {
    console.log("getDeviceResultsByControlFamily called with worklogId:"+worklogId+" resourceId:"+resourceId +" policyPack:"+policyPack);

     axios.get(NetworkConstants.NODEJS_SERVER+'getDeviceDetailReport/CF?rid='+resourceId+'&wid='+worklogId+'&pp='+policyPack)
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getDeviceResultsByControlFamily reject :"+JSON.stringify(response));
      reject(response);
    });

  })
}

export  function deleteReport(reportId,assettype) {
  console.log("deleteReport called in helper"+assettype);
  return new Promise((resolve, reject) => {
      axios.delete(NetworkConstants.API_SERVER+'/reports/delete/'+reportId+'?assettype='+assettype)
        .then(function (response) {
          console.log("deleteReport resolve response: " + JSON.stringify(response));
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("deleteReport reject :"+JSON.stringify(response));
          reject(response);
      });

  })
}

export  function getAssetType(policyPack) {
  console.log("getAssetType called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/reports/assettype/'+policyPack)
        .then(function (response) {
          console.log("getAssetType resolve response: " + JSON.stringify(response));
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("getAssetType reject :"+JSON.stringify(response));
          reject(response);
      });

  })
}



export function downloadReports(rId,rtype) {
  console.log("downloadReports called in helper");
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/reports/download',
        {
          "worklogId":rId,
          "reporttype":rtype
        },{headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          console.log("downloadReports resolve data: " +response.data);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

/*
 * Function to get Report Tags
 * @scope(String) : AllReports
 * @return(json): Json data for report tags
 * @todo : scope param need to change
 */
export function getReportTags(scope) {
  
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getAllAutoSuggestMMformatted?scope=AllReports')
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

/*
 * Function to get Report Filter
 * @scope(String) : AllReports
 * @return(json): Json data for report tags
 * 
 */
export function getReportFilter(start,end,filter) {
  
  return new Promise((resolve, reject) => {
       axios.post(NetworkConstants.API_SERVER+'/reports/assessment/' + start + '/' + end,filter, {headers: { 'Content-Type': 'application/json'}})
        .then(function (response) {
          console.log("getResourcesList resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}


/*
 * Function to suppress rules
 * @scope(String) : Cloud Report, Devicedetails report
 * @return(): 
 * 
 */
export function suppressRules(suppressParams) {  
  return new Promise((resolve, reject) => {
       axios.post(NetworkConstants.API_SERVER+'/policypack/rule/supress/',suppressParams, {headers: { 'Content-Type': 'application/json'}})
        .then(function (response) {
          console.log("suppressRules resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

export function getFailedResults(policyResultId) {
  console.log("getFailedResults called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getFailedResults?pid='+policyResultId)
        .then(function (response) {
          console.log("getReportsCount resolve data: " +response.data);
          console.log("getReportsCount resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}


