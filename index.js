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
    //Serve some files necessary for the front-end.
    asm.serve.files(info.asm.token);
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
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (cmd) => {
    if (cmd == "log") {
        asm.showLog();
    } else if (cmd == "console") {
        asm.showConsole();
    } else if (cmd == "start") {
        if (!asm.server.running) {
            console.log("[start] Starting server...".green);
            asm.startServer();
        } else {
            console.log("[start] Server is already running.".red);
        }
    } else if (cmd == "stop") {
        if (asm.server.running) {
            console.log("[stop] Stopping server...".green);
            asm.stopServer();
        } else {
            console.log("[start] Server is already stopped.".red);
        }
    } else if (cmd == "restart") {
        if (asm.server.running) {
            console.log("[restart] Restarting server...".green);
            asm.restartServer();
        } else {
            console.log("[start] Server is already stopped.".red);
        }
    } else if (cmd == "backup") {
        if (asm.server.running) {
            console.log("[backup] Server must be offline before creating a backup.".red);
        } else {
            console.log("[backup] Backup started.".green);
            asm.backupServer();
        }
    } else if (cmd == "quit") {
        asm.quit();
    } else {
        if (!asm.server.running) {
            console.log("[command] Server is not running.".red);
        } else {
            asm.server.game.command(cmd);
        }
    }
});