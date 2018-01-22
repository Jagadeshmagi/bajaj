import axios from 'axios';

// https://34.235.161.206/context/policypacks/getCustomRules

export function getCustomPoliciesList() {
  console.log("getCustomPolicyPacksList called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'policypacks/getCustomRules')
        .then(function (response) {
          console.log("getCustomPolicyPacksList resolve status: " +response.status);
          resolve(response.data);
         })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}


//    "ruleCode":
//    {
//        "command": "test",
//        "expected": "expected value",
//        "check": ""
//    },
//    "description": "description for the ",
//    "title": "title ",
//    "os": "",
//    "severity": "severity level",
//    "uid": "uid"
// }

export function addRule(ruleJSON, description, title, os, severity, uid) {
  console.log("getCustomPolicyPacksList called in helper");
  return new Promise((resolve, reject) => {
      let payload = {
        "ruleCode": ruleJSON,
        "description": description,
        "title": title,
        "os": os,
        "severity": severity,
        "uid": uid
      };
      axios.post(NetworkConstants.NODEJS_SERVER+'policypacks/addRule', payload)
        .then(function (response) {
          console.log("Add RUlE resolve status: " +response.status);
          resolve(response.data);
         })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}
