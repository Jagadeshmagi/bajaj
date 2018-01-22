import axios from 'axios'
import moment from 'moment'

// /arap-server/api/v0/users
//
// Supports all GET, PUT, POST and DELETE methods.

//
// {
//     "id": 0,
//     "email": "admdin@gmail.com",
//     "username": "administrator",
//     "password": "cavirin123",
//     "created": 1500318337116,
//     "roles": "ROLE_ADMIN",
//     "modified": 1500415701921,
//     "active": true
// }

export function getAllUsers() {
  console.log("getAllUsers called in helper");
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.API_SERVER+'/users')
      .then(function (response) {
        console.log("getAllUsers resolve data: " +response.data);
        console.log("getAllUsers resolve status: " +response.status);
        response.data.users.sort(function(a, b) {
          return a.id - b.id;
        });
        resolve(response.data.users);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}


export function addUser(newUser) {
  console.log("addUser called in helper");
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/users', newUser)
      .then(function (response) {
        console.log("addUser resolve data: " +response.data);
        console.log("addUser resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function editUser(id, newUser) {
  console.log("editUser called in helper");
  return new Promise((resolve, reject) => {
    axios.put(NetworkConstants.API_SERVER+'/users/'+id, newUser)
      .then(function (response) {
        console.log("editUser resolve data: " +response.data);
        console.log("editUser resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function deleteUserById(id) {
  console.log("deleteUserById called in helper");
  return new Promise((resolve, reject) => {
    axios.delete(NetworkConstants.API_SERVER+'/users/'+id)
      .then(function (response) {
        console.log("deleteUserById resolve data: " +response.data);
        console.log("deleteUserById resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function getUserById(id) {
  console.log("getUserById called in helper");
  return new Promise((resolve, reject) => {
    axios.get(NetworkConstants.API_SERVER+'/users/'+id)
      .then(function (response) {
        console.log("getUserById resolve data: " +response.data);
        console.log("getUserById resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

// /users/id/password
export function resetPassword(userId, password) {
  console.log("resetPassword called in helper");
  return new Promise((resolve, reject) => {
    axios.patch(NetworkConstants.API_SERVER+'/users/'+userId+"/password", password)
      .then(function (response) {
        console.log("resetPassword resolve data: " +response.data);
        console.log("resetPassword resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function validateUserInfo(input, value) {
  console.log("validateUserInfo called in helper");
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/validate?field='+input+'&value='+value)
      .then(function (response) {
        console.log("validateUserInfo resolve data: " +response.data);
        console.log("validateUserInfo resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

export function AdminResetPWById(id) {
  console.log("AdminResetPWById called in helper");
  return new Promise((resolve, reject) => {
    //Currently using delete endpoint. Awaiting API for reset user password
    axios.delete(NetworkConstants.API_SERVER+'/users/'+id)
      .then(function (response) {
        console.log("AdminResetPWById resolve data: " +response.data);
        console.log("AdminResetPWById resolve status: " +response.status);
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
    });
  })
}

// /api/v0/validate?field=[email,username]&value=<value at the moment>
