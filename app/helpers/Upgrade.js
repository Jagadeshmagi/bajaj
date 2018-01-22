import axios from 'axios'

export function getAllsoftwareAndContentData() {
  console.log("getAllsoftwareAndContentData called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/content')
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("getAllsoftwareAndContentData reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}


export function getAllsoftwareData() {
  console.log("getAllsoftwareData called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/software')
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("getAllsoftwareData reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export  function uploadContentFile (data) {
  console.log("uploadContentFile called in helper");
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/content/upload',data)
        .then(function (response) {
          console.log("uploadContentFile resolve data: " +JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("uploadContentFile reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function uploadSoftware (data){
  console.log("uploadSoftware called in helper");
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/software/upload',data)
        .then(function (response) {
          console.log("uploadContentFile resolve data: " +JSON.stringify(response));
          resolve(response);
        })
        .catch(function (response) {
          console.log("uploadContentFile reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function upgradeStatus(id){
  console.log("upgradeStatus called in helper")
  return new Promise ((resolve, reject)=>{
    axios.get(NetworkConstants.NODEJS_SERVER+'upgrade/status/'+id+'?type=CONTENT')
    .then(function(response){
      console.log("upgradeStatus"+JSON.stringify(response));
      resolve(response.data);
    })
  .catch(function (response) {
          console.log("upgradeStatus reject :"+JSON.stringify(response));
          reject(response);
      });

  })
}