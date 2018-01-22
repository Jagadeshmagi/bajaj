import axios from 'axios'

export default function getAssetGroupsList () {
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/settings/assetgroups?summary=0')
        .then(function (response) {
          resolve(response.data.assetgroups);
        })
        .catch(function (response) {
          console.log("getAssetGroupsList reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

// export function getAssetGroupsTableList (startTemp, endTemp, filter) {
//   return new Promise((resolve, reject) => {
//     // assetgroups?summary=0&limit=50&
//     axios.get(NetworkConstants.API_SERVER + '/settings/assetgroups?summary=0' + "&limit=" + endTemp + "&offset=" + startTemp + '&sort=-lastscantime')
//     // axios.get(NetworkConstants.API_SERVER+'/settings/assetgroups?summary=0' + "&limit=" + 50 + "&offset=" + 0 + '&sort=-assetGroupName')
//       .then(function (response) {
//         // console.log("getAssetGroupsList resolve data: " +JSON.stringify(response.data));
//         // console.log("getAssetGroupsList resolve status: " +response.status);
//         var data = {}
//         // var start = startTemp-50;
//         // console.log("getAssetGroupsList called in helper", start);
//         // var end = endTemp + start;
//         // var toBeReturned = response.data.assetgroups.slice(start, end)
//         var toBeReturned = response.data.assetgroups
//         data.list = toBeReturned;
//         data.listLength = response.data.total
//         // console.log("getAssetGroupsList resolve data: ", start, end, JSON.stringify(toBeReturned));
//         console.log("getAssetGroupsList resolve status: " +response.status, response.data, response.data.total);
//         // if(start===0){
//           // resolve(data);
//         // } else {
//           resolve(data);
//         // }
//       })
//         .catch(function (response) {
//           console.log("getAssetGroupsList reject :"+JSON.stringify(response));
//           reject(response);
//       });
//
//     }
//   )
// }

export function getAssetGroup(assetId) {
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/settings/assetgroups/'+assetId)
        .then(function (response) {
         // console.log("getAssetGroup resolve data: " +response.data);
         // console.log("getAssetGroup resolve status: " +response.status);
         // console.log("data is "+JSON.stringify(response.data))
          resolve(response.data);
        })
        .catch(function (response) {
         // console.log("getAssetGroup reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function putAssetGroup(name,assetDescription,assetId){
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/settings/assetgroups',{
        name:name,
        description:assetDescription,
        assetId:assetId,
      })
        .then(function (response) {
          console.log("putAssetGroup resolve in helper: " + JSON.stringify(response));
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("putAssetGroup reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function monitorAcountDetailsForGroup(id,grpname,type,instance,containers,cluster) {
 type=type.toLowerCase();

  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER_MONITORING+'/monitoring/source',{
      assetGroupId:id,
      accountName:grpname,
       accountType:type,
       monitoringType:"assetgroup",
       instances : instance,
       containers : containers,
       clusters : cluster

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


export function updateMonitorAcountForGroup(acountId,accountNameEdit,type,instance,containers,cluster) {
   type=type.toLowerCase();
   if(type==""){
    type="onprem"
   }
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER_MONITORING+'/monitoring/source/'+acountId,{
      accountName: accountNameEdit,
      accountType:type,
      monitoringType:"assetgroup",
      instances : instance,
      containers : containers,
      clusters : cluster

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




export function updateAssetGroupPolicyPacks(groupId,policyGroups){
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/settings/groupwizard?assetGroupId='+groupId+'&page=2',{
        policyPackTargetRequest:policyGroups
      })
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (response) {
        console.log("putAssetGroup reject :"+JSON.stringify(response));
        reject(response);
      });

    })

}


export function addScheduleTemplateToGroup(groupId,templateName,reportName,scannedBy){
  console.log("addScheduleTemplateToGroup called in helper"+scannedBy);
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/settings/assetgroups/schedule',{
      assetgroupid:groupId,
      testName:reportName,
      schedulelabel:templateName,
      scanedby:scannedBy
    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

export function addNotificationToGroup(groupId,reportName,uiNotificationObj){
 return new Promise((resolve, reject) => {
  console.log("uiNotificationObj.scannedBy "+uiNotificationObj.scannedBy)
    axios.post(NetworkConstants.API_SERVER+'/settings/groupwizard?assetGroupId='+groupId+'&page=3',{
      testName:reportName,
      notifyTestBegin: uiNotificationObj.notifyTestBegin,
      notifyTestEnd: uiNotificationObj.notifyTestEnd,
      notifytestfail: uiNotificationObj.notifyTestFailed,
      notifytestabort: uiNotificationObj.notifyTestAborted,
      notifypagerduty:uiNotificationObj.notifyByPagerDuty,
      notifyslack:uiNotificationObj.notifyBySlack,
      notify:uiNotificationObj.notify,
      reportingPref:uiNotificationObj.reportingPref,
      emails: uiNotificationObj.emails,
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

export function removeScheduleTemplateFromGroup(groupId){
  return new Promise((resolve, reject) => {
    axios.delete(NetworkConstants.API_SERVER+'/settings/assetgroups/schedule/'+groupId)
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

export function updateAssetGroupScheduleInfo(groupId,testName,uiScheduleObj){
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/settings/groupwizard?assetGroupId='+groupId+'&page=3',{
        starttime:uiScheduleObj.startTime,
        endtime:uiScheduleObj.endTime,
        templeteName:uiScheduleObj.templateName,
        notifyTestBegin: uiScheduleObj.notifyTestBegin,
        notifyTestEnd: uiScheduleObj.notifyTestEnd,
        emails: uiScheduleObj.emails,
        reportingPref: uiScheduleObj.reportingPref,
        recurrence: uiScheduleObj.recurrence,
        dayModifier:uiScheduleObj.dayModifier,
        weekModifier:uiScheduleObj.weekModifier,
        endCount:uiScheduleObj.endCount,
        custom:uiScheduleObj.custom,
        testName:testName
    })
    .then(function (response) {
      console.log("putAssetGroup resolve data: " +response.data);
      console.log("putAssetGroup resolve status: " +response.status);
      resolve(response.data);
    })
    .catch(function (response) {
      console.log("putAssetGroup reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

export function putResourceAssetGroup(name,description,resources) {
  return new Promise((resolve, reject) => {

      axios.post(NetworkConstants.API_SERVER+'/settings/assetgroups',{
        name:name,
        description:description,
        resourceids:resources
      })
      .then(function (response) {
        console.log("putAssetGroup response data:"+response.data);
        console.log("putAssetGroup response status:"+response.status);
        resolve(response)
      })
      .catch(function (response) {
        console.log("putAssetGroup reject response:"+response);
        reject(response);
      });

    }
  )
}

export function addResourcesToGroups(assetGroups,resources) {
  return new Promise((resolve, reject) => {

      axios.post(NetworkConstants.API_SERVER+'/settings/assetgroups/associateresource',{
        assetGroupIds:assetGroups,
        resourceIds:resources
      })
      .then(function (response) {
        console.log("addResourcesToGroups response data:"+response.data);
        console.log("addResourcesToGroups response status:"+response.status);
        resolve(response)
      })
      .catch(function (response) {
        console.log("addResourcesToGroups reject response:"+response);
        reject(response);
      });

    }
  )
}
export function putAssetlatest(assettype,assetname,credentialids,accountname,cloudpart) {

  console.log("In helper along with data")
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/settings/assets/', {
        "assettype":assettype,
        "assetname":assetname,
        "credentialids":credentialids,
        "cloudAccountName":accountname,
        "cloudpart":cloudpart

      })
        .then(function (response) {
          console.log("putAsset response data:"+response.data);
          console.log("putAsset response status:"+response.status);
          resolve(response.data)
        })
        .catch(function (response) {
          console.log("putAsset reject response:"+JSON.stringify(response));
          reject(response);
      });
  })
}


export function putAssetlatestforip(name,startip,endip,desc,credlist) {
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/settings/assets/', {
        type: "OnPrem",
        ipstart:startip,
        ipend: endip,
        name:name,
        description:desc,
        credentialids:credlist

      })
        .then(function (response) {
          console.log("putAssetlatestforip response data:"+response.data);
          console.log("putAssetlatestforip response status:"+response.status);
          resolve(response.data)
        })
        .catch(function (response) {
          console.log("putAssetlatestforip reject response:"+JSON.stringify(response));
          reject(response);
      });
  })
}

export function putOnPremAsset(name,startip,endip,desc,credlist) {
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/settings/assets/', {
        assettype: "OnPrem",
        assetname:name,
        credentialids:credlist,
        description:desc,
        cloudpart:{
          cloudtype:"ipRange",
          ipstart:startip,
          ipend: endip
        }
      })
      .then(function (response) {
        resolve(response.data)
      })
      .catch(function (response) {
        reject(response);
      });
  })
}

export function updateOnPremAsset(id,name,startip,endip,desc,credlist) {
  return new Promise((resolve, reject) => {
  axios.post(NetworkConstants.API_SERVER+'/settings/assets/'+id,{
        assettype: "OnPrem",
        assetname:name,
        credentialids:credlist,
        description:desc,
        cloudpart:{
          cloudtype:"ipRange",
          ipstart:startip,
          ipend: endip
        }
      })
      .then(function (response) {
        resolve(response.data);
        return (JSON.stringify(response.data));
      })
      .catch(function (response) {
        reject(response);
      });

    }
  )
}
export function getAsset(assetId) {
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.API_SERVER+'/settings/assets/'+assetId)
      .then(function (response) {
        //console.log("getAsset resolve: "+JSON.stringify(response))
        resolve(response.data);
      })
      .catch(function (response) {
        //console.log("getAsset reject :"+JSON.stringify(response));
        reject(response);
    });
  })
}

export function getAllAssetlatest() {
  return new Promise((resolve, reject) => {
     axios.get(NetworkConstants.API_SERVER+'/settings/assets/')
        .then(function (response) {
          console.log("getAllAssetlatest resolve data: " +response.data);
          console.log("getAllAssetlatest resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("getAllAssetlatest reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export  function deleteAssetGroup(groupId) {
  return new Promise((resolve, reject) => {
      axios.delete(NetworkConstants.API_SERVER+'/settings/assetgroups/'+groupId)
        .then(function (response) {
          console.log("deleteAssetGroup resolve data: " +response.data);
          console.log("deleteAssetGroup resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("deleteAssetGroup reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export  function refreshAssetGroup(groupId, scannedBy) {
  console.log("refreshAssetGroup called in helper", scannedBy);
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.NODEJS_SERVER+'refreshAssetGroup/', {
        aid: groupId,
        scanedby: scannedBy
      })
        .then(function (response) {
          console.log("refreshAssetGroup resolve data: " +response.data);
          console.log("refreshAssetGroup resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("refreshAssetGroup reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}
//old definition
export function getRegionsold(accesskey,secretaccesskey,rolename) {
  console.log("getRegions called in helper");
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/settings/aws/regions',{
      accessKey: accesskey,
      secretAccessKey: secretaccesskey,
      roleName:rolename
    })
    .then(function (response) {
      console.log("getRegions resolve data: " +response.data);
      console.log("getRegions resolve status: " +response.status);
      console.log("data is "+JSON.stringify(response.data))

      resolve(response.data.regions);
      return (JSON.stringify(response.data));
    })
    .catch(function (response) {
      console.log("getRegions reject :"+JSON.stringify(response));
      reject(response);
    });

  })
}

//definition from node js to add display strinng fr region
export function getRegions(accesskey,secretaccesskey,rolename) {
  console.log("getRegions called in helper");
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.NODEJS_SERVER+'aws/regions',{
      accessKey: accesskey,
      secretAccessKey: secretaccesskey,
      roleName:rolename
    })
    .then(function (response) {
      console.log("getRegions resolve data: " +response.data);
      console.log("getRegions resolve status: " +response.status);
      console.log("data is "+JSON.stringify(response.data))

      resolve(response.data);
      return (JSON.stringify(response.data));
    })
    .catch(function (response) {
      console.log("getRegions reject :"+JSON.stringify(response));
      reject(response);
    });

  })
}




export function getVpcs(cloudAccountName,regionselected) {
  console.log("getVpcs called in helper");

   let regionsList =  regionselected.toString().split(',');

  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/settings/aws/vpc',{
      cloudAccountName: cloudAccountName,
      regions: regionsList
    })
    .then(function (response) {
      console.log("getVpcs resolve data: " +response.data);
      console.log("getVpcs resolve status: " +response.status);
      console.log("data is "+JSON.stringify(response.data))

      resolve(response.data.vpc);
      return (JSON.stringify(response.data));
    })
    .catch(function (response) {
      console.log("getVpcs reject :"+JSON.stringify(response));
      reject(response);
    });

  })

}



export function getassetforedit(id) {
  console.log("getassetforedit called in helper");
  return new Promise((resolve, reject) => {
  axios.get(NetworkConstants.API_SERVER+'/settings/assets/'+id)
        .then(function (response) {
          console.log("getassetforedit resolve data: " +response.data);
          console.log("getassetforedit resolve status: " +response.status);
          console.log("data is "+JSON.stringify(response.data))

          resolve(response.data);
          return (JSON.stringify(response.data));
        })
        .catch(function (response) {
          console.log("getassetforedit reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}


export function assetgroupupdate(id,name,description) {
 return new Promise((resolve, reject) => {
  axios.post(NetworkConstants.API_SERVER+'/settings/assetgroups/'+id,{
      name:name,
      description:description
    })
    .then(function (response) {
      resolve(response.data);
      return (JSON.stringify(response.data));
    })
    .catch(function (response) {
      console.log("assetgroupupdate reject :"+JSON.stringify(response));
      reject(response);
    });

  })
}

export function assetupdate(id,name,cloudAccountName,credlist,cloudpartJson,assetType) {

  let cAccName = cloudAccountName.split();

  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/settings/assets/'+id,{
      assettype:assetType,
      assetname:name,
      cloudAccountName:cAccName,
      cloudpart:cloudpartJson,
      credentialids:credlist

    })
        .then(function (response) {
          resolve(response.data);
          return (JSON.stringify(response.data));
        })
        .catch(function (response) {
          console.log("assetupdate reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function assetupdateforip(id,name,startip,endip,desc,credlist) {

  return new Promise((resolve, reject) => {
  axios.post(NetworkConstants.API_SERVER+'/settings/assets/'+id,{
   type: "OnPrem",
   ipstart:startip,
   ipend: endip,
   name:name,
   description:desc,
   credentialids:credlist

  })
        .then(function (response) {
          resolve(response.data);
          return (JSON.stringify(response.data));
        })
        .catch(function (response) {
          console.log("assetupdateforip reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}


export function getIAMRoleStatus() {
  //var IAM="true";
  // var data={"iamrole":"true", "name":"HELLOOOO"}
  //'http://10.101.10.125:8080/arap-server/api/v0/settings/aws/instancemetadata/'
  console.log("iamresponse in helper");
  return new Promise((resolve, reject) => {
  axios.get(NetworkConstants.API_SERVER+'/settings/aws/instancemetadata/')
        .then(function (response) {

          console.log("response in iam"+JSON.stringify(response));
          resolve(response.data);
          return (JSON.stringify(response.data));
          // resolve(data);
          // return (data);
        })
        .catch(function (error) {
          console.log("error"+JSON.stringify(error));
          //reject(IAM);
          reject(error);
      });

    }
  )




}

//methods for account name population


export  function getAccountListCloud (assettype) {
  console.log("getAccountListCloud called in helper");
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.API_SERVER+'/settings/accounts/'+assettype)
        .then(function (response) {

          resolve(response.data.clouds);
        })
        .catch(function (response) {
          console.log("getAccountListCloud reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

//new api for get regions for the specified aws cloud account

export  function getRegionList (accountSelected) {
  console.log("getRegionList called in helper");
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/settings/aws/regions',{
      "cloudAccountName":accountSelected
      })
        .then(function (response) {
          resolve(response.data.regions);
        })
        .catch(function (response) {
          console.log("getRegionList reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

//update policy pack targeted artifacts in assetgroup

export function updateAssetGroupPolicyPacksArtifacts(groupId,ppArtifactData){
  console.log("updateAssetGroupPolicyPacksArtifacts called in helper");
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/policypack/artifact',{
        agId:groupId,
        ppArtData :ppArtifactData

      })
      .then(function (response) {
        console.log("updateAssetGroupPolicyPacksArtifacts resolve data: " +response.data);
        console.log("updateAssetGroupPolicyPacksArtifacts resolve status: " +response.status);
        resolve(response);
      })
      .catch(function (response) {
        console.log("updateAssetGroupPolicyPacksArtifacts reject :"+JSON.stringify(response));
        reject(response);
      });

    })

}
export function getArtifectsForAssetGroup(groupId){
  console.log("updateAssetGroupPolicyPacksArtifacts called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/policypack/artifact?agId='+groupId)
      .then(function (response) {
        console.log("updateAssetGroupPolicyPacksArtifacts resolve data: " +response.data);
        console.log("updateAssetGroupPolicyPacksArtifacts resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        console.log("updateAssetGroupPolicyPacksArtifacts reject :"+JSON.stringify(response));
        reject(response);
      });

    })

}

export function getWorklogById(worklogId) {
  console.log("getWorklogById called in helper");
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.API_SERVER+'/worklog/'+worklogId)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function getAssetGroupsTableListFilter (startTemp, endTemp, filter, sortString) {
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.API_SERVER + '/settings/assetgroups?summary=0' + "&limit=" + endTemp + "&offset=" + startTemp + filter + sortString)
        .then(function (response) {
          var data = {}
          var toBeReturned = response.data.assetgroups
          data.list = toBeReturned;
          data.listLength = response.data.total
          console.log("getAssetGroupsList resolve status: " +response.status, response.data, response.data.total);
            resolve(data);
        })
        .catch(function (response) {
          console.log("getAssetGroupsList reject :"+JSON.stringify(response));
          reject(response);
      });
    }
  )
}

export function getProjects(accountname) {
  console.log("getProjects called in helper");
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/settings/gcp/projects',{cloudAccountName:accountname})
    .then(function (response) {
      console.log("getProjects resolve data: " +response.data);
      console.log("getProjects resolve status: " +response.status);
      console.log("data is "+JSON.stringify(response.data))

      resolve(response.data);
      return (JSON.stringify(response.data));
    })
    .catch(function (response) {
      console.log("getProjects reject :"+JSON.stringify(response));
      let test = {
          "projects": [{
              "project": "projectName1",
              "zones": ["zone1", "zone2", "zone3"],
              "additionalProperties": {}
          }, {
              "project": "projectName2",
              "zones": ["zone4", "zone5", "zone6"],
              "additionalProperties": {}
          }, {
              "project": "projectName3",
              "zones": ["zone7", "zone8", "zone9"],
              "additionalProperties": {}
          }, {
              "project": "projectName4",
              "zones": ["zone10", "zone11", "zone12", "zone13"],
              "additionalProperties": {}
          }],
          "additionalProperties": {}
      }
      reject(test);
    });
  })
}

export function getAssetgroupPercent(id) {
  console.log("getAssetgroupPercent called in helper");
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.NODEJS_SERVER+'getAssetgroupPercent',{agid:id})
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function getCompletedScanGroups(){
 return new Promise((resolve, reject) => {
  axios.get(NetworkConstants.API_SERVER+'/settings/assetgroups?summary=2')
    .then(function(response){
      resolve(response.data.assetgroups)
    })
    .catch(function(response){
      reject(response)
    })
 })
}
