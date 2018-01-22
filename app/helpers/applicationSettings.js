import axios from 'axios'

export default function getIpConfig() {
  console.log("getIpConfig called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/configuration/ipconfig')
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          console.log("getIpConfig reject :"+JSON.stringify(response));
          reject(response);
      });
    }
  )
}


export function saveIPConfig(ipSettings,ipAddress,subnetMask,defaultGateway,preferredDNS,alternateDNS) {
  return new Promise((resolve, reject) => {
    if(ipSettings==='static'){
      axios.post(NetworkConstants.API_SERVER+'/configuration/ipconfig?type='+ipSettings,{
        ipAddress:ipAddress,
        subnetMask: subnetMask,
        defaultGateway: defaultGateway,
        preferredDNS:preferredDNS,
        alternateDNS:alternateDNS
    })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (response) {
          reject(response);
      });
    }
    else{
      axios.post(NetworkConstants.API_SERVER+'/configuration/ipconfig?type='+ipSettings,{
    })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (response) {
          reject(response);
      });
    }
  }
  )
}

