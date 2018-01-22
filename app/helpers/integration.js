import axios from 'axios';

export function addIntegration(integrationType,credentialJson, status, integrationDescription) {
  return new Promise((resolve, reject) => {
      axios.post(NetworkConstants.NODEJS_SERVER+'addIntegration/',{
        name:integrationType,
        credential: credentialJson,
        status: status,
        description:integrationDescription
    })
        .then(function (response) {
          console.log("addIntegration resolve status: " +JSON.stringify(response));
          resolve(response);
         })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}


export function updateIntegration(integrationType,credentialJson, status, integrationDescription) {
  return new Promise((resolve, reject) => {
      axios.put(NetworkConstants.NODEJS_SERVER+'updateIntegration/',{
        name:integrationType,
        credential: credentialJson,
        status: status,
        description:integrationDescription
    })
        .then(function (response) {
          console.log("updateIntegration resolve status: " +JSON.stringify(response));
          resolve(response);
         })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}


export function getAllIntegrations() {
  console.log("getAllIntegrations called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getIntegrations/')
        .then(function (response) {
          console.log("getAllIntegrations resolve status: " +response.status);
          resolve(response.data);
         })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}


export function getIntegrationById(integrationId) {
  console.log("getIntegrationById called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.NODEJS_SERVER+'getIntegration/'+integrationId)
        .then(function (response) {
          console.log("getIntegrationById resolve status: " +response.status);
          resolve(response.data);
         })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

export function deleteIntegrationById(integrationId) {
  console.log("deleteIntegrationById called in helper");
  return new Promise((resolve, reject) => {
      axios.delete(NetworkConstants.NODEJS_SERVER+'deleteIntegration/'+integrationId)
        .then(function (response) {
          console.log("deleteIntegrationById resolve status: " +response.status);
          resolve(response.data);
         })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}


//++++++++++++api for PagerDuty connectivity +++++++++++++++++++
export function verifyPDconnection(serviceKey, eventType, description){
	console.log("verifyPDconnection called in helper")
	return new Promise((resolve, reject)=>{
	  axios.post(NetworkConstants.NODEJS_SERVER+'checkPDconnection/',{
	  	service_key:serviceKey,
	  	event_type:eventType,
	  	description:description
	  })
	  .then(function(response){
	  	console.log("verifyPDconnection response "+response.status)
	  	resolve(response)
	  })
	  .catch(function(response){
	  	reject(response);
	  });
	 }
	)
}

//+++++++++++++++api to to trigger incident to PagerDuty service++++++++++++++++++
export function triggerPDIncident(eventType, description){
	console.log("triggerPDIncident called in helper")
	return new Promise((resolve, reject)=>{
	  axios.post(NetworkConstants.NODEJS_SERVER+'triggerPDincident/',{
	  	event_type:eventType,
	  	description:description
	  })
	  .then(function(response){
	  	console.log("triggerPDIncident response "+response.status)
	  	resolve(response)
	  })
	  .catch(function(response){
	  	reject(response);
	  });
	 }
	)
}


//++++++++++++api for slack connectivity +++++++++++++++++++
export function verifySlackConnection(webhookUrl){
  console.log("verifySlackConnection called in helper")
  return new Promise((resolve, reject)=>{
    axios.post(NetworkConstants.NODEJS_SERVER+'checkSlackconnection',{
      webhook:webhookUrl
    })
    .then(function(response){
      console.log("verifySlackConnection response "+response.status)
      resolve(response)
    })
    .catch(function(response){
      reject(response);
    });
   }
  )
}

/*
 * Verify Jira Connection
 * @request : requested json with node(username,password,host,key)
 * response type : json
 */
export function verifyJiraConnection(request){
  console.log("verifySlackConnection called in helper")
  return new Promise((resolve, reject)=>{
     axios.post(NetworkConstants.NODEJS_SERVER+'jira/auth',request,'Content-Type': 'application/json')
       .then(function (response) {
         resolve(response);
       })
       .catch(function (response) {
         reject(response);
     });
   }
  )
}

export function verifyUserPasswordForServiceNow(username,password,url) {
  console.log("verifyUserPasswordForServiceNow called in helper");
  return new Promise((resolve, reject) => {
      
      axios.post(NetworkConstants.NODEJS_SERVER+'servicenow/auth',{
       
          username: username,
         password: password,
         url:url
  
        },'Content-Type': 'application/json')
        .then(function (response) {
          console.log("verifyUserPasswordForServiceNow resolve status: " +response.status);
          resolve(response);
         })
        .catch(function (response) {
          reject(response);
      });

    }
  )
}

