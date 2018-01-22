//import NetworkConstants from '../constants/NetworkConstants';
import axios from 'axios'

export function getAllScanConfigurations() {
  console.log("getAllScanConfigurations called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/settings/scanconfigurations')
        .then(function (response) {
          console.log("getAllScanConfigurations resolve data: " +response.data);
          console.log("getAllScanConfigurations resolve status: " +response.status);
          resolve(response.data);
      })
      .catch(function (response) {
        console.log("getAllScanConfigurations reject :"+JSON.stringify(response));
        reject(response);
      });

    }
  )
}

export function getScanConfiguration(scanConfigLabel) {
  console.log("getScanConfiguration called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/settings/scanconfigurations/'+scanConfigLabel)
        .then(function (response) {
          console.log("getScanConfiguration resolve data: " + JSON.stringify(response.data));
          console.log("getScanConfiguration resolve status: " +response.status);
          resolve(response.data);
      })
      .catch(function (response) {
        console.log("getScanConfiguration reject :"+JSON.stringify(response));
        reject(response);
      });

    }
  )
}

export function putScanConfiguration(scanConfigLabel,assetGroupIds) {
console.log("scanConfigLabel in helper:" + scanConfigLabel)
  return new Promise((resolve, reject) => {
      axios.put(NetworkConstants.API_SERVER+'/settings/scanconfigurations/'+scanConfigLabel, {
        algorithm: "New algorithm",
        assetGroupIds:assetGroupIds,
        guidelines:["guidelines1"],
        cronExpression:"cronExpression",
        samplingPercentage:12.00,
        startTime: "2016/07/07 3:00:02",
        endTime: "2016/07/07 03:00:12"        
      })
      .then(function (response) {
        console.log("putScanConfiguration then response:"+JSON.stringify(response));
        console.log("putScanConfiguration then response.data:"+response.data);
        console.log("putScanConfiguration then response.status:"+response.status);
        resolve(response.data)
      })
      .catch(function (response) {
        console.log("putScanConfiguration reject response:"+JSON.stringify(response));
        console.log("putScanConfiguration reject response.response.data:"+response.response.data);
        console.log("putScanConfiguration reject response.response.status:"+response.response.status);
        reject(response.response);
      });

    }
  )

}
