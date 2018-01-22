import axios from 'axios'

export function getAllAlerts (severity,state1,account) {

  console.log("getAllAlerts called in helper",severity,state1,account);
  let filter="?filter=";
  const filter1="?filter=";
  if(severity){
    if(severity === "low" || severity == "medium" || severity == "high"){
       if(filter === filter1){
        filter=filter+'severity:'+severity
      }else{
        filter=filter+',severity:'+severity
      }
    }
  }
  if(account){
    if(filter === filter1){
        filter=filter+'account:'+account
      }else{
        filter=filter+',account:'+account
      }
  }
  
  if(state1){
    if(state1=="on"){
      if(filter === filter1){
         filter = filter+'active:'+true
      }else{
         filter = filter+',active:'+true
      }
    }
    else{
      if(filter === filter1){
         filter = filter+'active:'+false
      }else{
         filter = filter+',active:'+false
      }
    }
 }

  
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER_MONITORING+'/monitoring/rules'+filter)  // ?filter='+sevdata+","+statedata  ?filter=severity:'+severity
        .then(function (response) {
        	console.log(response.data.monitoringRules)
          resolve(response.data.monitoringRules);
        })
        .catch(function (response) {
          console.log("getAllAlerts reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

/**** Create New Alert - POST Call ****/

export function createAlertRules(alertName, severity, description, metricName, ifMetric, conditions, thresholdData, duration, email, groupNameId, stopsAfterRepeat, doNotDisplay, alertFrequency, disable,securityGroupId,securityGroupName,lambdaFunctionName,lambdaFunctionRegion,slack,pagerduty){

  console.log("createAlertRules called in helper");
  
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER_MONITORING+'/monitoring/rules',{
      name:alertName,
      severity:severity,
      description:description,
      //rationale:rationale,
      metricName:metricName,
      type:ifMetric,
      condition:conditions,
      threshold:thresholdData,
      duration:duration,
      email:email,
      monitoredSourceId:groupNameId,
      stopsAfterRepeat:stopsAfterRepeat,
      doNotDisplay:doNotDisplay,
      reduceAfterFrequency:alertFrequency,
      active:disable,
      securityGroupId:securityGroupId,
      securityGroupName:securityGroupName,
      lambdaFunctionName:lambdaFunctionName,      
      lambdaFunctionRegion:lambdaFunctionRegion,
      pagerDuty:pagerduty,
      slack:slack    
      
    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

export  function deleteAlert(alertId) {
  console.log("deleteAlert called in helper");
  return new Promise((resolve, reject) => {
      axios.delete(NetworkConstants.API_SERVER_MONITORING+'/monitoring/rules/'+alertId)
        .then(function (response) {
          console.log("deleteAlert resolve response: " + JSON.stringify(response));
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("deleteAlert reject :"+JSON.stringify(response));
          reject(response);
      });

  })
}


export function getAlertCount (id,fromTime,to) {
  var filterJSON = {"startTime":fromTime,"endTime":to}
 
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.NODEJS_SERVER_MONITORING+'api/rule/monitoring/count/'+id,filterJSON,{headers: {
     'Content-Type': 'application/json',
     }})
      /*axios.post(NetworkConstants.NODEJS_SERVER_MONITORING+'api/rule/monitoring/count/'+id,{
        // startTime:"2015-05-14T00:00:00.000Z",
        // endTime:"2015-05-21T00:00:00.000Z"
        startTime:fromTime,
        endTime:to
      })*/
        .then(function (response) {
          console.log(response.data)
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("getAllAlerts reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}
export function getAlertReportDetails(id,fromTime,to,start,end) {
 console.log('Called in helperrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr'+ fromTime, to)
  return new Promise((resolve, reject) => {

      axios.post(NetworkConstants.NODEJS_SERVER_MONITORING+'api/rule/monitoring/events/'+id+'?offSet='+start+'&limit='+end,{
        // startTime:"2015-05-14T00:00:00.000Z",
        // endTime:"2015-05-21T00:00:00.000Z"
        startTime:fromTime,
        endTime:to
        /*startTime:'2015-05-18T06:30:00.000Z',
        endTime:'2015-05-18T11:02:30.000Z'*/
      })
        .then(function (response) {
          console.log(response.data)
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("getAllAlerts reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}


/**** Update a Alert - POST Call ****/

export function updateAlertRules(alertId, alertName, severity, description,  metricName, ifMetric, conditions, thresholdData, duration, acountId, email, stopsAfterRepeat, doNotDisplay, alertFrequency, disable,securityGroupId,securityGroupName,lambdaFunctionName,lambdaFunctionRegion,slack,pagerduty){

  console.log("Update AlertRules called in helper");
  
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER_MONITORING+'/monitoring/rules/'+alertId,{
      name:alertName,
      severity:severity,
      description:description,
     // rationale:rationale,
      metricName:metricName,
      type:ifMetric,
      condition:conditions,
      threshold:thresholdData,
      duration:duration,
      email:email,
      monitoredSourceId:acountId,
      stopsAfterRepeat:stopsAfterRepeat,
      doNotDisplay:doNotDisplay,
      reduceAfterFrequency:alertFrequency,
      active:disable,
      securityGroupId:securityGroupId,
      securityGroupName:securityGroupName,
      lambdaFunctionName:lambdaFunctionName,      
      lambdaFunctionRegion:lambdaFunctionRegion,
      pagerDuty:pagerduty,
      slack:slack  

    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}



export function disableAlert(alertID) {
  console.log("Disable Alert called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER_MONITORING+'/monitoring/rules/disable/'+alertID)
        .then(function (response) {
          console.log("I am in response",response.data)
          resolve(response.data)
        })
        .catch(function (response) {
          console.log("disable Alerts reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}


export function enableAlert(alertID) {
  console.log("enable Alert called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER_MONITORING+'api/rule/monitoring/rules/enable/'+alertID)
        .then(function (response) {
          console.log("I am in response",response.data)
          resolve(response.data)
        })
        .catch(function (response) {
          console.log("disable Alerts reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}





export function generateReportTable(alertId, startTime, endTime){

  console.log("generate Report Table called in helper");
  
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.NODEJS_SERVER_MONITORING+'api/rule/monitoring/event/'+alertId,{
      startTime:startTime,
      endTime:endTime,
    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

/*monitoring 2 page Meta values*/

export function getReportMeta(alertID) {
  console.log("Get Report Meta Alert called in helper" + alertID);
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER_MONITORING+'/monitoring/rules/'+alertID)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}


export function getalertDataStatistics (alertId,fromTime,to) {
  return new Promise((resolve, reject) => {
    /* var filterJSON = {"startTime":fromTime,"endTime":to}

    axios.post(NetworkConstants.NODEJS_SERVER_MONITORING+'api/rule/monitoring/graph/'+alertId,filterJSON,{headers: {
     'Content-Type': 'application/json',
     }})*/


    axios.post(NetworkConstants.NODEJS_SERVER_MONITORING+'api/rule/monitoring/graph/'+alertId,{
      startTime:fromTime,
        endTime:to
    })
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


/*GET call for getting Metrics name*/
export function getMetrics(metrictype,monitortype) {
  let data="";
  if(metrictype=="AWSLambda" && monitortype=="CLOUDACCOUNT")
      data=metrictype;
  else if(monitortype=="ASSETGROUP")
     data=monitortype
   else
    data=metrictype

  console.log("Get Report getMetrics called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER_MONITORING+'api/rule/metrics?type=' + data)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}


/*Get All the S3 Bucket name Using AK and SAK*/
export function getS3BucketNameForMonitorAK_SAK (apiParameter) {
  console.log("getRegionsForMonitorAK_SAK called in helper",apiParameter);
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/monitoring/aws/s3buckets',{
      authCredential:apiParameter
    })
    .then(function (response) {
      console.log("xons resolve data------------------------------------ " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getRegionsForMonitor reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}


/*Get All the S3 Bucket names Using Asume Ins*/
export function getS3BucketNameForMonitorAIC (apiParameter) {
  console.log("getRegions For Monitor AIC called in helper",apiParameter);
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/monitoring/aws/s3buckets',{
      authCredential:apiParameter
    })
    .then(function (response) {
      console.log("xons resolve data AIC " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getRegionsForMonitor reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}


/*Get All the S3 Bucket names Using ARN*/
export function getS3BucketNameForMonitorARN (apiParameter) {
  console.log("getRegions For Monitor AIC called in helper",apiParameter);
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/monitoring/aws/s3buckets',{
      authCredential:apiParameter
    })
    .then(function (response) {
      console.log("xons resolve data ARM " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getRegionsForMonitor reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

/*GET the Cloud Acount monitor details*/

export function monitorAcountDetails (id,accountName,type,bucketName,collection) {
 type=type.toLowerCase();

  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER_MONITORING+'/monitoring/source',{
      accountName: accountName,
      bucketName: bucketName,
      // region: regionUsingBucket,
      //prefix: prefix
      collection:collection,
      cloudAccountId:id,
      accountType:type,
      monitoringType:"cloudaccount"


    })
    .then(function (response) {
      console.log("Sucess monitorAcountDetails: " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("Monitor Acount Details reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}


export function enablemonitorForAccounts (id,accountName,type,disables) {
 
/*if(/\s/g.test(accountName)){
    accountName= accountName.replace(' ', '%20');
  }*/
 type=type.toLowerCase();

  return new Promise((resolve, reject) => {
    axios.patch(NetworkConstants.API_SERVER_MONITORING+'/monitoring/source/'+id+'?disable='+disables)
    .then(function (response) {
      console.log("Sucess monitorAcountDetails: " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("Monitor Acount Details reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}


/*GET call for getting regions using AIM*/
export function getMonitorAccountDetails(id,acountName,type) {
 
  console.log("Get added monitor account called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER_MONITORING+'/monitoring/source/'+id)
        .then(function (response) {
          console.log('response ----->', response)
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

/*GET the monitor Acount Update details*/

export function updateMonitorAcount(id,acountId,accountNameEdit,type,bucketNameEdit,collectionEdit) {
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER_MONITORING+'/monitoring/source/'+acountId,{
      accountName: accountNameEdit,
      bucketName: bucketNameEdit,
      // region: regionUsingBucket,
     // prefix: prefixEdit
     collection:collectionEdit
    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("Monitor Acount Details reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

/*GET call for getting Account name*/
export function getAcountNames() {
  console.log("Get Report getMetrics called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER_MONITORING+'api/rule/monitoring/accounts')
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}


export function getSecurityGroups(accname,regionSelected) {
  console.log("getSecurityGroups called in helper" );
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER_MONITORING+'/monitoring/aws/securitygroups?accountname='+accname+'&regions='+regionSelected)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

export function getLambdaFunctions(accname,regionSelected) {
  console.log("getSecurityGroups called in helper" );
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER_MONITORING+'/monitoring/aws/lambdafunctions?accountname='+accname+'&regions='+regionSelected)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}


export function getListOfAccountsFilter() {
  console.log("getSecurityGroups called in helper" );
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER_MONITORING+'api/rule/monitoring/sources')
        .then(function (response) {

          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}
