import axios from 'axios'

export function getScanSchedules () {
  console.log("getScanSchedules called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/scanschedules')
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("getScanSchedules reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}


export function putScanSchedule(uiScheduleObj) {
  return new Promise((resolve, reject) => {
      axios.put(NetworkConstants.API_SERVER+'/scanschedules/'+uiScheduleObj.templateName,{
        starttime:uiScheduleObj.startTime,
        endtime:uiScheduleObj.endTime,
        notifyTestBegin: uiScheduleObj.notifyTestBegin,
        notifyTestEnd: uiScheduleObj.notifyTestEnd,
        notifytestfail:uiScheduleObj.notifyTestFail,
        notifytestabort:uiScheduleObj.notifyTestAbort,
        notifyslack:uiScheduleObj.notifyBySlack,
        notifypagerduty:uiScheduleObj.notifyByPagerduty,
        notify:uiScheduleObj.notify,
        emails: uiScheduleObj.emails,
        reportingPref: uiScheduleObj.reportingPref,
        recurrence: uiScheduleObj.recurrence,
        dayModifier:uiScheduleObj.dayModifier,
        weekModifier:uiScheduleObj.weekModifier,
        endCount:uiScheduleObj.endCount,
        custom:uiScheduleObj.custom,
        scanedby:uiScheduleObj.scannedBy

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


export function getScanTable(start,end) {
  console.log("getAScanTable called in helper");
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/settings/assetgroups/scheduleview/'+start + '/' + end,
      {headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          console.log("getScanTable resolve data: " +response.data);
          console.log("getScanTable resolve status: " +response.status);
          resolve(response.data);
      })
      .catch(function (response) {
        console.log("getScanTable reject :"+JSON.stringify(response));
        reject(response);
      });

    }
  )
}

export function deleteTemplate(label) {
  return new Promise((resolve, reject) => {
      axios.delete(NetworkConstants.API_SERVER+'/scanschedules/'+label)
        .then(function (response) {
          resolve(response)
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

export function getScanSchedulesByLabel(label){
  console.log("getScanSchedulesByLabel called in helper "+label)
  return new Promise((resolve,reject)=>{
    axios.get(NetworkConstants.API_SERVER+'/scanschedules/'+label)
      .then(function(response){
          resolve(response)
      })
      .catch(function(response){
        reject(response);
      });
    })
}


export function updateScheduleTemplateByLabel(scheduleObj) {
  console.log('+++++++++++  '+JSON.stringify(scheduleObj))
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.API_SERVER+'/scanschedules/'+scheduleObj.templateName, {
        notifyTestBegin:scheduleObj.notifyTestBegin,
        notifyTestEnd: scheduleObj.notifyTestEnd,
        notifytestfail:scheduleObj.notifyTestFail,
        notifytestabort:scheduleObj.notifyTestAbort,
        notifyslack:scheduleObj.notifyBySlack,
        notify:scheduleObj.notify,
        notifypagerduty:scheduleObj.notifyByPagerduty,
        emails: scheduleObj.emails,
        recurrence:scheduleObj.recurrence,
        reportingPref: scheduleObj.reportingPref,
        starttime:scheduleObj.startTime,
        dayModifier:scheduleObj.dayModifier,
        endtime:scheduleObj.endTime,
        weekModifier:scheduleObj.weekModifier,
        endCount:scheduleObj.endCount,
        custom:scheduleObj.custom
    })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (response) {
          console.log("updateScheduleTemplateByLabel reject response:"+JSON.stringify(response));
          reject(response);
      });
    }
  )
}
