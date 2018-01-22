var IDLE_TIMEOUT = 600; //seconds
var _idleSecondsTimer = null;
var _idleSecondsCounter = 0;
localStorage.setItem("idletime", 0);

document.onclick = function() {
    _idleSecondsCounter = 0;
    localStorage.setItem("idletime", _idleSecondsCounter);
};

document.onmousemove = function() {
    _idleSecondsCounter = 0;
    localStorage.setItem("idletime", _idleSecondsCounter);
};

document.onkeypress = function() {
    _idleSecondsCounter = 0;
    localStorage.setItem("idletime", _idleSecondsCounter);
};

_idleSecondsTimer = window.setInterval(CheckIdleTime, 1000);

function CheckIdleTime() {
    _idleSecondsCounter = localStorage.getItem("idletime");
    _idleSecondsCounter++;
    localStorage.setItem("idletime", _idleSecondsCounter);
     /*
     var oPanel = document.getElementById("SecondsUntilExpire");
     if (oPanel)
         oPanel.innerHTML = (IDLE_TIMEOUT - _idleSecondsCounter) + "";

    */
    if (_idleSecondsCounter >= IDLE_TIMEOUT && document.location.href.indexOf('auth') === -1) {
        //window.clearInterval(_idleSecondsTimer);
        var locationHref = document.location.href;
        var locationURL = locationHref.substring(0,locationHref.indexOf('#'));
        document.location.href = locationURL + "#/sessionTimeout";
        
    }
}