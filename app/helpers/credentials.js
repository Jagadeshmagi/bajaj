//import NetworkConstants from '../constants/NetworkConstants';
import axios from 'axios'

export default function getCredentialsList () {
  console.log("getCredentialsList called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/settings/credentials')
        .then(function (response) {
          resolve(response.data.credentials);
        })
        .catch(function (response) {
          console.log("getCredentialsList reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function putCredential(label,type,loginId,password,usage,pemFileName) {
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/settings/credentials',{
        label:label,
        credentialType:type,
        username: loginId,
        password: password,
        usage:usage,
        pemFile:pemFileName
    })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}


export function deleteCredential(label) {
  return new Promise((resolve, reject) => {
      axios.delete(NetworkConstants.API_SERVER+'/settings/credentials/'+label)
        .then(function (response) {
          resolve(response)
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

export function getCredentialsById(credId) {
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/settings/credentials/'+credId)
        .then(function (response) {
          resolve(response)
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}


export function updateCredentialByLabel(label,loginId,password,usage,credType,pemFile,keyPairFilePath) {
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/settings/credentials/'+label, {
        username: loginId,
        password: password,
        usage:usage,
        credentialType:credType,
        pemFile:pemFile,
        keyPairFilePath:keyPairFilePath
    })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (response) {
          console.log("updateCredential reject response:"+JSON.stringify(response));
          reject(response);
      });
    }
  )
}

export  function uploadFile (data) {
  console.log("fileUpload called in helper");
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/settings/fileupload',data,{headers: {
      'Content-Type': 'multipart/form-data',
      }})


     // axios.post(NetworkConstants.API_SERVER+'/settings/fileupload',data)
        .then(function (response) {
          console.log("fileupload resolve data: " +JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("fileupload reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

