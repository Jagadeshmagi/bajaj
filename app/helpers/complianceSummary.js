import axios from 'axios'

export function getSummaryData(from, to, zoom, platform, complianceType, ctrlFamily) {
  return new Promise((resolve, reject) => {
    // 10.101.10.117:3000/getDashboardCS?from=10-10-2016&to=10-10-2016&complianceType=HIPAA&zoom=Day&platform=Linux&ctrlFamily=controlFamily
      let toDate = to.slice(0,10);
      let fromDate = from.slice(0,10);
      console.log("HAPPY THANKSGIVING! =D ", toDate, fromDate, zoom)
      let endpoint = NetworkConstants.NODEJS_SERVER+'getDashboardCS?from='+ fromDate +'&to=' + toDate + '&complianceType=' + complianceType + '&zoom=' + zoom + '&platform=' + platform + '&ctrlFamily=' + ctrlFamily;
      // let endpoint = 'http://10.101.10.117:3001/getDashboardCS?from=2016-11-23&to=2016-11-23&complianceType=HIPAA&zoom=Day&platform=Linux&ctrlFamily=controlFamily'
      axios.get(endpoint)
        .then(function (response) {
          console.log("getSummaryData response data:"+response.data);
          console.log("getSummaryData response status:"+response.status);
          resolve(response)
        })
        .catch(function (response) {
          console.log("getSummaryData reject response:"+JSON.stringify(response));
          reject(response);
      });
    }
  )
}


export function newGetSummaryData(filterJSON) {
  return new Promise((resolve, reject) => {
      filterJSON.from=filterJSON.from.slice(0,10)
      filterJSON.to =filterJSON.to.slice(0,10)
      axios.post(NetworkConstants.NODEJS_SERVER+'getDashboardCS',filterJSON,{headers: {
      'Content-Type': 'application/json',
      }})
        .then(function (response) {
          resolve(response.data.output)
        })
        .catch(function (response) {
          console.log("newGetSummaryData reject response:"+JSON.stringify(response));
          reject(response);
      });
    }
  )
}


// from:""
// to:""
// zoom:""
// platform:""
// tags:""
// complianceType:""
// ctrlFamily:""
