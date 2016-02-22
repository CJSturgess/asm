var asm = require('asm');

//Ask ASM to load. Should spit out a splash message with the version no.
//Passing a param will tell it to say a different version no. (Good for debug builds.)
asm.load("1.0.0-DEV");

//Grab info regarding this host THEN push it to var info.
//If host not authorized, the program will exit.
//Otherwise, go ahead and check for updates.
var info;
asm.getInfo().then(function(res) {
    info = res;
    //If this host doesn't have an server, create one.
    if (!asm.server.isPresent) {
        asm.createServer(info.size);
    }
    checkUpdates();
});

//Update the server IF req'd
function checkUpdates() {
    if (info.update) {
        console.log("[checkUpdates] Update required.".green);
        //Run update to specific version.
        asm.doUpdate(info.version);
    }
}

//test