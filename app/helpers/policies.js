import axios from 'axios'

function reformatData1(data){
  let base = {}
  let newFormat = []
  // if (data.failedPolicyCount > 0){
    for (var i = 0; i < data.length; i++) {
      if (data[i].failedPolicyCount > 0){
        let item = {}
        item.childCount = data[i].childCount;
        item.name = data[i].title;
        item.path = data[i].path;
        item.children = []
        newFormat.push(item)
      }
    }
  // }
  // let base = {}
  // let newFormat = []
  // for (var i = 0; i < data.length; i++) {
  //   let item = {}
  //   console.log("Testing data flow item", data);
  //   item.name = data[i].controlid;
  //   item.path = data[i].path;
  //   item.children = []
  //   console.log("Testing data flow item", item);
  //   newFormat.push(item)
  // }
  base.name = "Cavirin",
  base.children = newFormat
  return base;
}

function reformatData2(data, pathParent){
  let newFormat = []
  for (var i = 0; i < data.length; i++) {
    console.log("data[i].failedPolicyCount", data[i].failedPolicyCount)
    // if (data[i].failedPolicyCount > 0 && data[i].childCount > 0){
    if (data[i].failedPolicyCount > 0){
      console.log("data, pathParent0", data, pathParent)
                    let item = {}
                    item.childCount = data[i].childCount;

                    if(data[i].path){
                      console.log("data, pathParent1", data, pathParent)
                      item.path = data[i].path;
                    } else {
                      console.log("data, pathParent2", data, pathParent)
                      item.path = pathParent
                    }

                    if(data[i].controlid){
                      console.log("data, pathParent3", data, pathParent)
                      item.name = data[i].title;
                    } else {
                      console.log("data, pathParent4", data, pathParent)
                      item.name = data[i].title;
                      item.rid = data[i].id;
                      item.path = data[i].id
                    }
                    item.children = []

                    if(data[i].controlid && data[i].controlid.length > 2){
                      console.log("data, pathParent5", data, pathParent)
                      console.log("data[i].controliddata[i].controlid", data[i].controlid)
                      item.controlid = data[i].controlid
                    }
                    // if(data[i].rid){
                    //   item.rid = data[i].rid;
                    // }
                    newFormat.push(item)
    }
  }
  return newFormat;
}

function reformatData3(data, pathParent){
  let newFormat = []
  for (var i = 0; i < data.length; i++) {
    let item = {}
    if(data[i].path){
      item.path = data[i].path;
    } else {
      item.path = pathParent
    }
    if(data[i].controlid){
      item.name = data[i].title;
    } else {
      item.name = data[i].title;
      item.rid = data[i].id;
      item.path = data[i].id
    }
    item.children = []
    if(data[i].controlid && data[i].controlid.length > 2){
      item.controlid = data[i].controlid
    }
    // if(data[i].rid){
    //   item.rid = data[i].rid;
    // }
    newFormat.push(item)
  }
  return newFormat;
}

export function getPolicyDetails(path, umbrella) {
  console.log("getPolicyDetails called in helper , path:"+path);
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/policypack?name='+path)
        .then(function (response) {
          if(umbrella){
            if(path.length < 5){
              resolve(reformatData1(response.data.policypacks));
            }else{
              console.log("response.data.policypacks", reformatData2(response.data.policypacks, path))
              resolve(reformatData2(response.data.policypacks, path));
            }
          } else {
            resolve(response.data.policypacks);
          }
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

export function getPolicyDevices(id) {
  return new Promise((resolve, reject) => {
      // 10.101.10.117:3000/getDashboard/questions/5?rid=979
      axios.get(NetworkConstants.API_SERVER+'/policypack?name='+id)
        .then(function (response) {
            resolve(response.data.policypacks);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

export function getPolicyPackRules(controlId,policyPackPath,benchmark) {
  let osQuery = "";
  if(!benchmark || benchmark !== 'ALL'){
    osQuery = "&benchmark="+benchmark
  }
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/policypack/rule?nistid='+controlId+'&policyPack='+policyPackPath+osQuery)
        .then(function (response) {
          resolve(response.data.rules);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

export function getRuleDetails(ruleId) {
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/policypack/rule/details?id='+ruleId)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
      });

    }
  )
}

export function getOSList(path) {
  console.log("getOSList called in helper , path:"+path);
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/policypack/benchmark?name='+path)
      .then(function (response) {
        resolve(response.data.benchmarks);
      })
      .catch(function (response) {
        reject(response);
      });

    }
  )
}

export function getRuleCount(controlId,policyPackPath,benchmarkSelected,profilesList){
    let benchmark=benchmarkSelected;
    if(benchmarkSelected==='ALL'){
      benchmark="";
    }

  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/policypack/rule/count',{
        "nistid": controlId,
        "platform":benchmark,
        "policyPack":policyPackPath,
        "profiles":profilesList
      },{headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          resolve(response.data.ruleCount);
        })
        .catch(function (response) {
          reject(response);
      });

  })
}

//***
export function newGetPolicyPackRules(controlId, benchmarkSelected, policyPackPath, profiles,start,end, umbrella, getFailed) {
  let benchmark=benchmarkSelected;
  if(benchmarkSelected==='ALL'){
      benchmark="";
  }
 var failed = getFailed || false;
 return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/policypack/rule'+'/'+start+'/'+end+'?fetchfailed='+failed, {
        "nistid": controlId,
        "platform":benchmark,
        "policyPack":policyPackPath,
        "profiles":profiles
      },{headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          if(umbrella){
            resolve(reformatData3(response.data.rules));
          } else {
            resolve(response.data.rules);
          }
        })
        .catch(function (response) {
          reject(response);
      });

  })
}


export function getControlFamilyList(policyPack) {
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/controlfamily?policypack='+policyPack)
      .then(function (response) {
        resolve(response.data.controlfamily);
      })
      .catch(function (response) {
        reject(response);
      });

    }
  )
}
