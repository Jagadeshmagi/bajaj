import axios from 'axios'

export default function putDockerImage (imagename,username,passwordfield,type) {
  console.log("putDockerImage called in helper");
  console.log("imagename"+imagename);
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/dockerimages',{
        imageName:imagename,
        username:username,
        password:passwordfield,
    
    })
        .then(function (response) {

          resolve(response.data);
        })
        .catch(function (response) {
          console.log("putDockerImage reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

/*export function getAllDockerImage () {
  console.log("getAllDockerImage called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/dockerimages?detail=true')
        .then(function (response) {

          resolve(response.data);
        })
        .catch(function (response) {
          console.log("getAllDockerImage reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}
*/
export function getAllDockerImage (start,end,filter) {
  console.log("getAllDockerImage called in helper");
  return new Promise((resolve, reject) => {
      
      axios.get(NetworkConstants.API_SERVER+'/images/'+ start + '/' + end,{headers: {
      'Content-Type': 'application/json',
      }})
      .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("getAllDockerImage reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function getDockerImageByLabel (imageId) {
  console.log("getDockerImageByLabel called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/dockerimages/'+imageId+'?detail=false')
        .then(function (response) {

          resolve(response);
        })
        .catch(function (response) {
          console.log("getDockerImageByLabel reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function deleteDockerImageByLabel (imageId) {
  console.log("deleteDockerImageByLabel called in helper");
  return new Promise((resolve, reject) => {
      axios.delete(NetworkConstants.API_SERVER+'/dockerimages/'+imageId)
        .then(function (response) {

          resolve(response);
        })
        .catch(function (response) {
          console.log("deleteDockerImageByLabel reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}


export function dockerImageScan (imageId,policy,toScan, scannedBy) {
  console.log("dockerImageScan called in helper");
  console.log("policy"+policy)
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/dockerimages/'+imageId+'/scan',{
          policypacks: policy,
          scan: toScan,
          scanedby: scannedBy
      })
        .then(function (response) {

          resolve(response);
        })
        .catch(function (response) {
          console.log("dockerImageScan reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function dockerScanResults (start,end,filterJSON) {
  console.log("dockerScanResults called in helper");

  return new Promise((resolve, reject) => {
    console.log("filterJSON:" + filterJSON);
    axios.post(NetworkConstants.API_SERVER+'/dockerimages/scanresults/'+ start + '/' + end,filterJSON,{headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {

          resolve(response.data);
        })
        .catch(function (response) {
          console.log("dockerScanResults reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function IndividualdockerScanResults (id,filterJSON,start,end) {
  console.log("IndividualdockerScanResults called in helper");

  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/dockerimages/scanresults/'+id+'/'+start+'/'+end,filterJSON,{headers: {
      'Content-Type': 'application/json'
      }})

        .then(function (response) {

          resolve(response.data);
        })
        .catch(function (response) {
          console.log("IndividualdockerScanResults reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function getScoreWithScanId (scanid,policypack) {
  console.log("getScoreWithScanId in helper scanId:"+scanid);
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'getScoreByScanId/'+scanid+'?policypack='+policypack)
    .then(function (response) {
      console.log("getScoreWithScanId resolve data: " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getScoreWithScanId reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}


export function getDockerDataStatistics (scanid,zoom,policypack) {
  console.log("getDockerDataStatistics in helper scanId:"+scanid);
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'getDockerReportCS?scanId='+scanid+'&zoom='+zoom+'&policypack='+policypack)
   
    .then(function (response) {
      console.log("getScoreWithScanId resolve data: " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getScoreWithScanId reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

/*export function getWorkLogViewRecordForDocker (scanId) {
  console.log("getWorkLogViewRecordForDocker in helper worklogId:"+scanId);
  return new Promise((resolve, reject) => {
     axios.get(NetworkConstants.API_SERVER+'/reports/docker/header/'+scanId)
    .then(function (response) {
      console.log("getWorkLogViewRecordForDocker resolve data: " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getWorkLogViewRecordForDocker reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}*/

export function getControlFamiliesOnPolicyPackForDocker(scanID,policyPack) {
  return new Promise((resolve, reject) => {
     axios.get(NetworkConstants.API_SERVER+'/policypack/controlfamily?scanid='+scanID+'&policypack='+policyPack)
    .then(function (response) {
      console.log("getControlFamiliesOnPolicyPackForDocker resolve data: " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getControlFamiliesOnPolicyPackForDocker reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

export function getRuleDetailsForDocker(ruleId) {
  console.log("getRuleDetails called in helper , ruleId:"+ruleId);
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/policypack/rule/details?id='+ruleId+'&type=CVE')
      .then(function (response) {
        console.log("getRuleDetails resolve data: " +response.data);
        console.log("getRuleDetails resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
      });

    }
  )
}

export function dockerRescan(scanId,regId, username) {
  console.log("Dockr rescan helper"+regId+scanId);
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/dockerimages/rescan?regId='+regId+'&scanId='+scanId+'&scanedby='+username)
      .then(function (response) {
        console.log("Dockr rescan resolve data: " +response.data);
        console.log("Dockr rescan resolve status: " +response.status);
        resolve(response);
      })
      .catch(function (response) {
        reject(response);
      });

    }
  )
}

export function getDockerGetScore(imageId) {
  console.log("getDockerGetScore in helper with assetGroupId:"+imageId);
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'getScoreByDockerImage?imageid='+imageId)
    .then(function (response) {
      console.log("getDockerGetScore resolve data: " +JSON.stringify(response.data));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("getDockerGetScore reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}




export function addScheduleTemplateToDocker(Id,templateName,reportName, scannedBy){
  console.log("addScheduleTemplateToDocker called in helper");
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/settings/assetgroups/schedule',{
      imageid:Id,
      testName:reportName,
      schedulelabel:templateName,
      scanedby: scannedBy
    })
    /*axios.post(NetworkConstants.API_SERVER+'/scanschedule/docker?imageId='+Id,{
   
      testName:reportName,
      templeteName:templateName
    })*/
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

export function addNotificationToDocker(Id,reportName,uiNotificationObj){
 console.log("addNotificationToDocker called in helper");
 return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/scanschedule/docker?imageId='+Id,{
      testName:reportName,
      notifyTestBegin: uiNotificationObj.notifyTestBegin,
      notifyTestEnd: uiNotificationObj.notifyTestEnd,
      notifytestfail: uiNotificationObj.notifyTestFailed,
      notifytestabort: uiNotificationObj.notifyTestAborted,
      notifypagerduty:uiNotificationObj.notifyByPagerDuty,
      notifyslack:uiNotificationObj.notifyBySlack,
      notify:uiNotificationObj.notify,
      emails: uiNotificationObj.emails,
      reportingPref:uiNotificationObj.reportingPref,
      recurrence:"now",
      scanedby:uiNotificationObj.scannedBy
    })
    .then(function (response) {
      console.log("addNotificationToGroup resolve : " + JSON.stringify(response));
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("addNotificationToGroup reject : " + JSON.stringify(response));
      reject(response);
    });
  })
}




