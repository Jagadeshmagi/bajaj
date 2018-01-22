import axios from 'axios'

// localhost:3000/api/v0/templateui

export function loadTemplateAPI() {
  console.log("loadTemplate called in helper");
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'api/v0/templateui')
      .then(function (response) {
        console.log("loadTemplate resolve data: " +response.data);
        console.log("loadTemplate resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}


export function saveTemplateAPI(newTemplate) {
  console.log("saveTemplate called in helper");
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.NODEJS_SERVER+'api/v0/templateui', newTemplate)
      .then(function (response) {
        console.log("saveTemplate resolve data: " +response.data);
        console.log("saveTemplate resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

// URL: localhost:3000/api/v0/templateui/3
export function deleteTemplateAPI(id) {
  console.log("deleteTemplate called in helper");
  return new Promise((resolve, reject) => {
    axios.delete(NetworkConstants.NODEJS_SERVER+'api/v0/templateui/'+id)
      .then(function (response) {
        console.log("deleteTemplate resolve data: " +response.data);
        console.log("deleteTemplate resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function getTemplateAPIById(id) {
  console.log("getTemplateAPIById called in helper", id);
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'api/v0/templateui/'+id)
      .then(function (response) {
        console.log("getTemplateAPIById resolve data: " +response.data);
        console.log("getTemplateAPIById resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function getIntegrations() {
  console.log("getIntegrations called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getIntegrations/')
        .then(function (response) {
          console.log("getIntegrations resolve data: " +response.data);
          console.log("getIntegrations resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

export function getDiscoveredOS(params) {
  var query = '';
  if(params!='')
  {
  query = params;
  }
  if(params==undefined)
  {
    query = '';
  }
  console.log("getDiscoveredOS called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getDiscoveredOS'+query)
        .then(function (response) {
          console.log("getDiscoveredOS resolve data: " +response.data);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

function reformatData(data, id){
  let newFormat = [];
  console.log("Testing data flow item q51", data);

  // let newFormat = [{name: 1}, {name: 2}, {name: 3}, {name: 4}, {name: 5}];
  for (var i = 0; i < data.length; i++) {
    let item = {}
    item.name = data[i].ipaddress
    item.path = id
    console.log("Testing data flow item q5", item);
    newFormat.push(item)
  }
  console.log("Testing data flow", newFormat);

  return newFormat;
}

// getQuestion3Data
export function getQuestionData(number, id){
  return new Promise((resolve, reject) => {
    if(number === 5 && id){
      axios.get(NetworkConstants.NODEJS_SERVER+'getDashboard/questions/' + number +"?rid=" + id)
        .then(function (response) {
          let newResponse = reformatData(response.data.data, id)
          console.log("QUESTION!, QUESTION!, QUESTION!, QUESTION!, QUESTION!", number, id)
            console.log("getQuestionData resolve data: " +JSON.stringify(response.data));
            console.log("getQuestionData resolve status: " +response.status);
            resolve(newResponse);
          // }
        })
        .catch(function (response) {
          reject(response);
      });
    } else {
      axios.get(NetworkConstants.NODEJS_SERVER+'getDashboard/questions/' + number)
        .then(function (response) {
          console.log("QUESTION!, QUESTION!, QUESTION!, QUESTION!, QUESTION!", number)
            console.log("getQuestionData resolve data: " +JSON.stringify(response.data));
            console.log("getQuestionData resolve status: " +response.status);
            resolve(response.data);
          // }
        })
        .catch(function (response) {
          reject(response);
      });
    }
  })
}

// 10.101.10.117:3000/getDashboard/horizontal?pp=NIST
// horizontalChartData
export function getHorizontalChartData(pp){
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getDashboard/horizontal?pp=' + encodeURIComponent(pp))
        .then(function (response) {
          console.log("horizontalChartData resolve data: " +JSON.stringify(response.data));
          console.log("horizontalChartData resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    })
}


export function getHorizontalScoreChartData(){
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getDashboard/questions/7')
        .then(function (response) {
          console.log("horizontalChartData resolve data: " +JSON.stringify(response.data));
          console.log("horizontalChartData resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    })
}

export function getQoneTableData(begin, count, severity){
  console.log("getQoneTableData is called with begin, count severity: ", begin, count, severity);
  return new Promise((resolve, reject)=>{
    axios.get(NetworkConstants.NODEJS_SERVER+"getDashboard/questions/1/resources?sev=" + severity + "&count=" + count)
      .then(function (response) {
        console.log("getQoneTableData resolve data: " +response.data, response);
        console.log("getQoneTableData resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function pagerDutyAPI(pagerDutyObj) {
  console.log("triggerPDincident called in helper");
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.NODEJS_SERVER+'triggerPDincident/', pagerDutyObj)
        .then(function (response) {
          console.log("triggerPDincident resolve data: " +response.data);
          console.log("triggerPDincident resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    })
}

export function JiraAPI(data) {

  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.NODEJS_SERVER+'jira/createIssue', data,{headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          console.log("triggerPDincident resolve data: " +response.data);
          console.log("triggerPDincident resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    })
}

export function ServiceNowAPI(data) {

  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.NODEJS_SERVER+'servicenow/createIncident', data,{headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          console.log("triggerPDincident resolve data: " +response.data);
          console.log("triggerPDincident resolve status: " +response.status);
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    })
}

export function getAppliedPolicies(completedStatus) {
  console.log("getAppliedPolicies called in helper ");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/policypacks?completed='+completedStatus)
        .then(function (response) {
            console.log("getAppliedPolicies resolve data: " +JSON.stringify(response.data));
            console.log("getAppliedPolicies resolve status: " +JSON.stringify(response.status));
            resolve(response.data.policypacks);
          }
        )
        .catch(function (response) {
          //console.log("getPolicyDetails reject :"+JSON.stringify(response));
          reject(response);
      });
    }
  )
}

export function getQuestionData8() {
  console.log("getQuestionData8 called in helper ");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getDashboard/chart')
        .then(function (response) {
            // console.log("getQuestionData8 resolve data: " +JSON.stringify(response.data));
            // console.log("getQuestionData8 resolve status: " +JSON.stringify(response.status));
            resolve(response.data);
          }
        )
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

export function getDashboardQuestion8Dropdown(){
  console.log("getDashboardQuestion8Dropdown called in helper ");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getDashboard/dropdown')
        .then(function (response) {
            // console.log("getDashboardQuestion8Dropdown resolve data: " +JSON.stringify(response.data));
            // console.log("getDashboardQuestion8Dropdown resolve status: " +JSON.stringify(response.status));
            resolve(response.data);
          }
        )
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

export function getQuestion8ControlFamilyList(policyPack){
  console.log("getQuestion8ControlFamilyList called in helper ");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getDashboard/dropdown?policy='+policyPack)
        .then(function (response) {
            resolve(response.data);
          }
        )
        .catch(function (response) {
          reject(response);
      });
    }
  )
}




/*************** API Integrations for Top 25 issues ***************/

export function getTop25Issues() {
  console.log("getTop25Issues called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getDashboard/questions/8')
        .then(function (response) {
            // console.log("getTop25Issues resolve data: "+response.data);
            resolve(response.data);
          }
        )
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

/*************** POST - Top 25 issues Device Failed ***************/

export function failedDeviceCount(failDevicesId) {
  console.log("failedDeviceCount called in helper");
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.NODEJS_SERVER+'getFailedResource',
        {
          "id":failDevicesId
        })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    })
}


/*************** GET - Top 25 issues Filters ***************/

export function top25IssuesFilters(osName, groupName, policyPack, family) {
  console.log("top25IssuesFilters called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getDashboard/questions/8?group='+groupName+'&os='+osName+'&policypackname='+policyPack+'&family='+family)
        .then(function (response) {
            console.log("top25IssuesFilters resolve data: " +JSON.stringify(response.data));
            resolve(response.data);
          }
        )
        .catch(function (response) {
          reject(response);
      });
    }
  )
}
