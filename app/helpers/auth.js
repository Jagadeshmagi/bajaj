//import NetworkConstants from '../constants/NetworkConstants'
import axios from 'axios'
import base64 from 'base-64'

const axiosWithoutToken = axios.create();

axios.interceptors.request.use(function (config) {
    config.headers = config.headers || {};

    var accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
       config.headers.Authorization = 'Bearer ' + accessToken;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  return response;
  }, function (error) {
    const originalRequest = error.config;
    if (error.status === 401) {

      //originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      //return axiosWithoutToken.post(NetworkConstants.AUTHENTICATION_SERVER+'/oauth/refresh', {}, config)
      return axiosWithoutToken.post(NetworkConstants.AUTHENTICATION_SERVER+'/token?grant_type=refresh_token&refresh_token='+refreshToken+'&client_id='+NetworkConstants.CLIENT_ID+'&client_secret='+NetworkConstants.CLIENT_SECRET)
      .then((res) => {
        localStorage.setItem('accessToken',res.data.access_token);
        localStorage.setItem('refreshToken',res.data.refresh_token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.access_token;
        originalRequest.headers['Authorization'] = 'Bearer ' + res.data.access_token;
        return axios(originalRequest);
       }).catch((error) => {
          console.log("refresh error:" + JSON.stringify(error));
        });
      }

    return Promise.reject(error);
});

export default function auth (username, password, loginWithReset) {

  let encodedStr = base64.encode(username+':'+password)
  let AuthStr = 'Basic '+encodedStr;
  //let client_id="pulsar"
  //let client_secret="cavirinSecurity"
  return new Promise((resolve, reject) => {
    axiosWithoutToken.post(NetworkConstants.AUTHENTICATION_SERVER+'/api/v0/login', {},{ headers: {'Content-Type':'application/x-www-form-urlencoded', Authorization: AuthStr } })
    //axiosWithoutToken.post(NetworkConstants.AUTHENTICATION_SERVER+'/token?grant_type=password&'+'username='+username+'&password='+password+'&client_id='+NetworkConstants.CLIENT_ID+'&client_secret='+NetworkConstants.CLIENT_SECRET)
       .then(function (response) {
        // console.log("This is the login response", response.data)
        console.log("response.data.user.created !== response.data.user.modified", response.data.user.created, response.data.user.modified)
        // if (response.data.user.created !== response.data.user.modified){
        if (!response.data.user.changePassword){
          console.log("This is the login response", response.data)
          localStorage.setItem('accessToken',response.data.access_token);
          localStorage.setItem('refreshToken',response.data.refresh_token);
          localStorage.setItem('userID',response.data.user.id);
          resolve({
            name: username,
            company: '',
            uid: response.data.access_token,
            user: response.data.user
          })
        } else {
          localStorage.setItem('accessToken',response.data.access_token);
          localStorage.setItem('refreshToken',response.data.refresh_token);
          localStorage.setItem('userID',response.data.user.id);
          resolve({
            user: response.data.user
          })
        }
      })
      .catch(function (response) {
        console.log("failed to auth", response.data)
        if (response.data.message === "License has expired"){
          response.data.license = "License has expired";
        }
        console.log("failed to auth", response)
        reject(response)
      }
    )
  })
}

export function getUserInfoSAAS (userName, token) {

  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.AUTHENTICATION_SERVER+'/api/v0/login', {
      userName:userName,
      token:token
    })
    //axiosWithoutToken.post(NetworkConstants.AUTHENTICATION_SERVER+'/token?grant_type=password&'+'username='+username+'&password='+password+'&client_id='+NetworkConstants.CLIENT_ID+'&client_secret='+NetworkConstants.CLIENT_SECRET)
       .then(function (response) {
        // console.log("This is the login response", response.data)
        console.log("response.data.user.created !== response.data.user.modified", response.data.user.created, response.data.user.modified)
        // if (response.data.user.created !== response.data.user.modified){
        // if (!response.data.user.changePassword){
          console.log("This is the login response", response.data)
          localStorage.setItem('accessToken',response.data.access_token);
          localStorage.setItem('refreshToken',response.data.refresh_token);
          localStorage.setItem('userID',response.data.user.id);
          resolve({
            name: username,
            company: '',
            uid: response.data.access_token,
            user: response.data.user
          })
        // } else {
        //   localStorage.setItem('accessToken',response.data.access_token);
        //   localStorage.setItem('refreshToken',response.data.refresh_token);
        //   localStorage.setItem('userID',response.data.user.id);
        //   resolve({
        //     user: response.data.user
        //   })
        // }
      })
      .catch(function (response) {
        console.log("failed to auth", response.data)
        if (response.data.message === "License has expired"){
          response.data.license = "License has expired";
        }
        console.log("failed to auth", response)
        reject(response)
      }
    )
  })
}

export function checkIfAuthed (store) {
  // ignore real authentication for now - to be done later
  return store.getState().users.isAuthed
}

export function logout () {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userID');
  localStorage.removeItem('state');
  localStorage.removeItem('localInProgress');
  console.log('Logged out!')
}
