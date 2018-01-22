import axios from 'axios'
import moment from 'moment'


function formatData(data, type){
  let newData = [];
  for (var i = 0; i < data.length; i++) {
    var itemArray = []
    if(type === "scheduledTestsData"){
      var formatedDate = moment.utc(data[i].nextscan).format('MM[/]DD[/]YY [@] HH[:]mm');
      console.log("formatedDateformatedDateformatedDate", formatedDate)
      itemArray.push(data[i].label)
      itemArray.push(formatedDate)
      newData.push(itemArray)
    }
    // else if (type === "eventLogData"){
    //   var formatedDate = moment.utc(data[i].createtime).format('MM[/]DD[/]YY [@] HH[:]mm');
    //   // var formatedDate = moment.utc.utc(data[i].createtime).local().format('MM[/]DD[/]YY [@] HH[:]mm');
    //   console.log("formatedDateformatedDateformatedDate", formatedDate)
    //   itemArray.push(data[i].message)
    //   itemArray.push(formatedDate)
    //   newData.push(itemArray)
    // }
  }
  return newData
}

export function scheduledTestsData() {
  console.log("scheduledTestsData called in helper");
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.NODEJS_SERVER+'getScanSchedules/100000')
      .then(function (response) {
        console.log("scheduledTestsData resolve data: " + JSON.stringify(response));
        console.log("scheduledTestsData resolve status: " +response.status);
        var formatedData = formatData(response.data.scanSchedules, "scheduledTestsData");
        resolve(formatedData);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

// http://54.87.81.56:3001/api/notif?type=list
export function getAlertList(count) {
  console.log("eventLogData called in helper", count);
  return new Promise((resolve, reject) => {
    // http://35.154.61.251:3000/notification/getn?count=2
    // axios.get('http://54.87.81.56:3001/api/notif?type=list')
    axios.get(NetworkConstants.NODEJS_SERVER_MONITORING +'api/notif?type=list')
      .then(function (response) {
        console.log("eventLogData resolve data: " +response.data);
        // var formatedData = formatData(response.data.output, "eventLogData");
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function eventLogData(count) {
  console.log("eventLogData called in helper", count);
  return new Promise((resolve, reject) => {
    // http://35.154.61.251:3000/notification/getn?count=2
    axios.get(NetworkConstants.NODEJS_SERVER+'notification/getn?count=' + count)
    // axios.get('http://35.154.61.251:3000/notification/getn?count=' + count)
      .then(function (response) {
        // console.log("eventLogData resolve data: " + JSON.stringify(response.data.output));
        // console.log("eventLogData resolve status: " +response.status);
        // var formatedData = formatData(response.data.output, "eventLogData");
        resolve(response.data.output.rows);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function pulsarUpdatesData() {
  console.log("pulsarUpdatesData called in helper" );
  return new Promise((resolve, reject) => {
    // http://35.154.61.251:3000/notification/getn?=2
    axios.get(NetworkConstants.NODEJS_SERVER+'getBuildVersion')
    // axios.get('http://35.154.61.251:3000/notification/getn?=' + )
      .then(function (response) {
        console.log("pulsarUpdatesData resolve data: " + JSON.stringify(response.data["Build ID"].component[0]));
        console.log("pulsarUpdatesData resolve status: " +response.status);
        // var formatedData = formatData(response.data.output, "pulsarUpdatesData");
        resolve(response.data["Build ID"].component[0]);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}
