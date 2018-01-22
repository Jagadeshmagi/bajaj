//import NetworkConstants from '../constants/NetworkConstants';
import axios from 'axios'

export function getUIContext (userId) {
  console.log("getUIcontext from node server in helper userid:"+userId);
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getUIContext/'+userId)
      //axios.get('http://52.91.237.79:8080/arap-server/api/v1/settings/credentials')
        .then(function (response) {
          console.log("getUIContext resolve data: " +JSON.stringify(response.data));
          console.log("getUIContext resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("getUIContext reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function putUIContext(userId, welcomeSeen, dashboardSetup, discoverySetup, policySetup) {
  console.log("putUIcontext from node server in helper userid:"+userId+" welcomeSeen:"+welcomeSeen);
  let cValJSON = {
    welcomeSeen : welcomeSeen,
    dashboardSetup : dashboardSetup,
    discoverySetup : discoverySetup,
    policySetup : policySetup
  }
  let cValue = JSON.stringify(cValJSON);
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.NODEJS_SERVER+'putUIContext', {
        userId: userId,
        cValue: cValue
      })
        .then(function (response) {
          console.log("put ui context response data:"+JSON.stringify(response.data));
          console.log("put ui context response status:"+response.status);
          resolve(response)
        })
        .catch(function (response) {
          console.log("putCredential reject response:"+response);
          reject(response);
      });

    }
  )

}
// 10.101.10.117:3000/getAssetGroupStatus/252
export function getAssetGroupStatus (assetGroupId) {
  //console.log("getAssetGroupStatus from node server in helper assetId:"+assetGroupId);
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'getAssetGroupStatus/'+assetGroupId)
    .then(function (response) {
     // console.log("getAssetGroupStatus resolve data: " +JSON.stringify(response.data));
     // console.log("getAssetGroupStatus resolve status: " +response.status);
      resolve(response.data);
    })
    .catch(function (response) {
     // console.log("getAssetGroupStatus reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

export function getDiscoveryWorklog (assetId) {
  //console.log("getDiscoveryWorklog from node server in helper assetId:"+assetId);
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'getDiscoveryWorklog/'+assetId)
    .then(function (response) {
     // console.log("getDiscoveryWorklog resolve data: " +JSON.stringify(response.data));
     // console.log("getDiscoveryWorklog resolve status: " +response.status);
      resolve(response.data);
    })
    .catch(function (response) {
     // console.log("getDiscoveryWorklog reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

export function getReportStatus (worklogId) {
  //console.log("getWorklog from node server in helper worklogId:"+worklogId);
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'getWorklog/'+worklogId)
    .then(function (response) {
      //console.log("getWorklog resolve data: " +JSON.stringify(response.data));
      //console.log("getWorklog resolve status: " +response.status);
      resolve(response.data);
    })
    .catch(function (response) {
      //console.log("getWorklog reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}


export function checkUsage () {
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'checkusage')
    .then(function (response) {
      console.log("checkUsage resolve data: " +JSON.stringify(response.data));
      resolve(response);
    })
    .catch(function (response) {
      console.log("checkUsage reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}

export function getDockerStatus (imageId) {
  //console.log("getDiscoveryWorklog from node server in helper assetId:"+assetId);
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'getDockerImageStatus/'+imageId)
    .then(function (response) {
     // console.log("getDiscoveryWorklog resolve data: " +JSON.stringify(response.data));
     // console.log("getDiscoveryWorklog resolve status: " +response.status);
      resolve(response.data);
    })
    .catch(function (response) {
     // console.log("getDiscoveryWorklog reject :"+JSON.stringify(response));
      reject(response);
    });
  })
}
