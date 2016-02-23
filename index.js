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
        asm.createServer(info.size, function(res) {
            if (res) {
                var update = {
                  "created": "true"  
                };
                asm.db.dataobject(info.asm.id).update(update);
                checkUpdates();
            }
        });
    } else {
        checkUpdates();
    }
});

//Update the server IF req'd
function checkUpdates() {
    if (info.update) {
        console.log("[checkUpdates] Update required.".green);
        //Run update to specific version.
        asm.doUpdate(info.version).then(function(res) {
            if (res == "Download Complete") {
                var update = {
                  "update": "false"  
                };
                asm.db.dataobject(info.asm.id).update(update);
                asm.startServer();
            }
        });
    } else {
        //No update. Continue to start server.
        console.log("[checkUpdates] No update required.".green);
        asm.startServer();
    }
}


//Handle command-line input for things like restarting, etc...
process.stdin.on('data', function(text) {
    switch (text) {
        case "stop":
            break;
        case "restart":
            break;
        case "backup":
            break;
    }
});