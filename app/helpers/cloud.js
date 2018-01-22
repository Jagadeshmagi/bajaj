import axios from 'axios'

export function getAllCloudAccounts() {
  console.log("getAllCloudAccounts called in helper");
  return new Promise((resolve, reject) => {
    // localhost:8080/arap-server/api/v0/settings/accounts/all
      axios.get(NetworkConstants.API_SERVER+'/settings/accounts/all')
        .then(function (response) {
          console.log("getAllCloudAccounts resolve data: " +response.data);
          console.log("getAllCloudAccounts resolve status: " +response.status);
          resolve(response.data.clouds);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}


// localhost:8080/arap-server/api/v0/settings/accounts/AWS à AWS is cloudType
export function addCloud(cloudType, cloudCredentials) {
  console.log("addCloud called in helper");
  return new Promise((resolve, reject) => {
    //resolve(getDummyReportsList());
    console.log("cloudCredentials:" + cloudCredentials);
      axios.post(NetworkConstants.API_SERVER+'/settings/accounts/'+ cloudType, cloudCredentials, {headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          console.log("addCloud resolve data: " +response.data);
          console.log("addCloud resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

export function updateCloud(id, cloudType, cloudCredentials) {
  console.log("addCloud called in helper");
  return new Promise((resolve, reject) => {
    //resolve(getDummyReportsList());
    console.log("cloudCredentials:" + cloudCredentials);
      axios.post(NetworkConstants.API_SERVER+'/settings/accounts/'+cloudType+"/"+id, cloudCredentials, {headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          console.log("addCloud resolve data: " +response.data);
          console.log("addCloud resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}


// localhost:8080/arap-server/api/v0/settings/accounts/AWS/3à Where 3 is ID and AWS is CloudType
export function deleteCloudById(cloudType, ID) {
  console.log("deleteCloudById called in helper");
  return new Promise((resolve, reject) => {
    // localhost:8080/arap-server/api/v0/settings/accounts/all
      axios.delete(NetworkConstants.API_SERVER+'/settings/accounts/'+cloudType+"/"+ID)
        .then(function (response) {
          console.log("deleteCloudById resolve data: " +response.data);
          console.log("deleteCloudById resolve status: " +response.status);
          resolve(response.data.clouds);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

export function getCloudById(cloudType, ID) {
  console.log("getCloudById called in helper");
  return new Promise((resolve, reject) => {
    // localhost:8080/arap-server/api/v0/settings/accounts/all
      axios.get(NetworkConstants.API_SERVER+'/settings/accounts/'+cloudType+"/"+ID)
        .then(function (response) {
          console.log("getCloudById resolve data: " +response.data);
          console.log("getCloudById resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

export function validateCloud(cloudCredentials, cloud) {
  let type = cloud?cloud:"AWS"
  console.log("validateCloud called in helper");
  return new Promise((resolve, reject) => {
    //resolve(getDummyReportsList());
    console.log("cloudCredentials:" + cloudCredentials);
      axios.post(NetworkConstants.API_SERVER+'/settings/accounts/validate/'+type, cloudCredentials, {headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          console.log("validateCloud resolve data: " +response.data);
          console.log("validateCloud resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}


// localhost:8080/arap-server/api/v0/settings/accounts/validate/AWS
// Method: POST
//
// {
// "name":"somename",
// "description":"Description",
// "authCredential":{
//    "authType":"awsSk",
//    "accessKey":"AKIAJNK7ZYIMVFN7G3OQ",
//    "secretAccessKey":"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"
// }
// }


export function pptestsearch(searchWord) {
  console.log("pptestsearch called in helper", searchWord);
  return new Promise((resolve, reject) => {
    //resolve(getDummyReportsList());
    console.log("searchWord:" + searchWord);
      axios.post('http://54.67.104.203:3001/searchPolicy', searchWord, {headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          console.log("pptestsearch resolve data: " +response.data);
          console.log("pptestsearch resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("pptestsearch resolve data ERROR: " +response);

          reject(response);
      });
    }
  )
}

export  function uploadJSONP12(data) {
  console.log("uploadJSONP12 called in helper");
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/settings/accounts/google/upload',data,{headers: {
      'Content-Type': 'multipart/form-data',
      }})


     // axios.post(NetworkConstants.API_SERVER+'/settings/uploadJSONP12',data)
        .then(function (response) {
          console.log("uploadJSONP12 resolve data: " +JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("uploadJSONP12 reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}
