// http://54.242.254.133:3000/context/chefsend
import axios from 'axios'

export function saveRemediation(name, data){
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.NODEJS_SERVER+'chefsend',{
        name:name,
        data:data,
      })
        .then(function (response) {
          console.log("saveRemediation resolve in helper: " + JSON.stringify(response));
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("saveRemediation reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function getRemediationByName(name){
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'chefget/?name='+name)
        .then(function (response) {
          console.log("getRemediationByName resolve in helper: " + JSON.stringify(response));
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("getRemediationByName reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}

export function deleteRemediationByName(name){
  console.log('asdflakfjlkajd239432ijlrk')
  return new Promise((resolve, reject) => {
      axios.delete(NetworkConstants.NODEJS_SERVER+'chefdelete/?name='+name)
        .then(function (response) {
          console.log("deleteRemediationByName resolve in helper: " + JSON.stringify(response));
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("deleteRemediationByName reject :"+JSON.stringify(response));
          reject(response);
      });

    }
  )
}
