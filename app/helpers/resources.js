import axios from 'axios'

export function getResourcesList(start, end, filter, count) {
  // var filter = {sortby: "ipaddress", orderby: "desc"}
  console.log("getResourcesList called in helper", start, end, filter);
  return new Promise((resolve, reject) => {
    if(!filter) {
      axios.post(NetworkConstants.API_SERVER+'/resources/' + start + '/' + end, {}, {headers: { 'Content-Type': 'application/json'}})
        .then(function (response) {
          console.log("getResourcesList resolve data: " +JSON.stringify(response.data));
          console.log("getResourcesList resolve status: " +response.status);
          resolve(response.data.resources);
        })
        .catch(function (response) {
          reject(response);
      })
    } else if (filter && !count) {
      console.log("not counted", count)
        axios.post(NetworkConstants.API_SERVER+'/resources/' + start + '/' + end, filter, {headers: { 'Content-Type': 'application/json'}})
          .then(function (response) {
            console.log("getResourcesList resolve status: " +response.status);
            resolve(response.data.resources);
          })
          .catch(function (response) {
            reject(response);
        });
    } else if (filter && count) {
      console.log("counted")
      axios.post(NetworkConstants.API_SERVER+'/resources/' + start + '/' + end, filter, {headers: { 'Content-Type': 'application/json'}})
        .then(function (response) {
          console.log("getResourcesList resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
  }
  });
}

export function getDiscoverList(resourcesId){
  console.log("getDiscoverList called in helper"+resourcesId);
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.NODEJS_SERVER+'refreshResourceList',{
      ridList:resourcesId
    })
      .then(function (response) {
        console.log("getDiscoverList resolve data: " +JSON.stringify(response.data));
        console.log("getDiscoverList resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
      })
    }
  )
}

export function getResourcesCounts() {
  console.log("getResourcesCounts called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/resources/count')
        .then(function (response) {
          console.log("getResourcesCounts resolve data: " +response.data);
          console.log("getResourcesCounts resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

export function getResourcesTags(scope) {
  console.log("getResourcesTags called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getAllAutoSuggestMMformatted?scope=' + scope)
        .then(function (response) {
          console.log("getResourcesTags resolve data: ", response.data);
          console.log("getResourcesTags resolve status: ", response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

export function getDeviceDetailsById(id) {
  console.log("getDeviceDetailsById called in helper", id);
  return new Promise((resolve, reject) => {
      // http://10.101.10.117:8080/arap-server/api/v0/resources/849?detail=1
      axios.get(NetworkConstants.API_SERVER+'/resources/'+ id +'?detail=1')
        .then(function (response) {
          console.log("getDeviceDetailsById resolve data: ", response.data);
          console.log("getDeviceDetailsById resolve status: ", response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

// http://localhost:3000/resource/compliancehistory/849?limit=10
export function getDeviceDetailsComplianceHistoryById(id) {
  console.log("getDeviceDetailsComplianceHistoryById called in helper", id);
  return new Promise((resolve, reject) => {
      // http://10.101.10.117:8080/arap-server/api/v0/resources/849?detail=1
      axios.get(NetworkConstants.NODEJS_SERVER+'resource/compliancehistory/'+ id +'?limit=6')
        .then(function (response) {
          console.log("getDeviceDetailsComplianceHistoryById resolve data: ", response.data);
          console.log("getDeviceDetailsComplianceHistoryById resolve status: ", response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

// http://13.210.73.111:8080/arap-server/api/v0/detachresource
         // 242.254.133:8080/arap-server/api/v0/detachresource
//
//
// [2:54]
// Method: POST
//
//
// [2:55]
// Method Body :
// {
//  "groupname":"Phani1",
//  "resourceids": [1,2]
// }

// to be updated when API is ready
export function removeResourceFromGroup(groupName, resourceIds) {
  console.log("removeResourceFromGroup called in helper");
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/detachresource', {
       groupname: groupName,
       resourceids: resourceIds
    })
      .then(function (response) {
        console.log("removeResourceFromGroup resolve data: " +response.data);
        console.log("removeResourceFromGroup resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function getGroupResourcesTags(scope) {
  console.log("getGroupResourcesTags called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getAllAutoSuggestMMformatted?scope=ResourcesGroup')
        .then(function (response) {
          console.log("getResourcesTags resolve data: ", response.data);
          console.log("getResourcesTags resolve status: ", response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}
