//import NetworkConstants from '../constants/NetworkConstants';
import axios from 'axios'

export function startDiscovery (groupId, uName) {
  console.log("startDiscovery called in helper");
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/settings/assetgroups/scan?agId='+groupId+'&scanedby='+uName)
        .then(function (response) {
          console.log("startDiscovery resolve response: " + JSON.stringify(response));
          resolve(response);
        })
        .catch(function (response) {
          console.log("startDiscovery reject response:"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function repeatDiscovery (worklogId,groupId,userName) {
  console.log("startDiscovery called in helper");
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/settings/assetgroups/rescan?agId='+groupId+'&worklogId='+worklogId+'&scanedby='+userName)
        .then(function (response) {
          console.log("repeatDiscovery resolve response: " + JSON.stringify(response));
          resolve(response);
        })
        .catch(function (response) {
          console.log("repeatDiscovery reject response:"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function stopDiscovery (worklogId) {
  console.log("stopDiscovery called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'stopScan/'+worklogId)
      .then(function (response) {
        console.log("stopDiscovery resolve data: " +response.data);
        console.log("stopDiscovery resolve status: " +response.status);
        resolve(response);
      })
      .catch(function (response) {
        console.log("stopDiscovery reject :"+JSON.stringify(response));
        reject(response);
      });
    }
  )
}

export function startAssessment(assetGroupId) {
  console.log("startAssessment called in helper");
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.API_SERVER+'/settings/assetgroups/'+assetGroupId+'/start')
      .then(function (response) {
        console.log("startAssessment resolve data: " +response.data);
        console.log("startAssessment resolve status: " +response.status);
        resolve(response);
      })
      .catch(function (response) {
        console.log("startAssessment reject :"+JSON.stringify(response));
        reject(response);
      });

    }
  )
}
