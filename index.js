var asm = require('asm');

//Get command-line args then log them
process.argv.forEach(function (val, index, array) {
  if (val == "hostname") {
      console.log(require('os').hostname());
      process.exit(0);
  }
});

//Ask ASM to load. Should spit out a splash message with the version no.
//Passing a param will tell it to say a different version no. (Good for debug builds.)
asm.load();

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
    
    //Start serving all the things! :D
    //Start by serving all of the files.
    //Params: token
    asm.serve.files(info.asm.token).then(function(app) {
        //Then start serving the endpoints.
        //Params: token, app instance
        asm.serve.endpoints(info.asm.token, app).then(function(app) {
            //Then start serving backups.
            //Params: token, app instance
            asm.serve.backups(info.asm.token, app).then(function(app) {
                //Then finally, start listening.
                //Params: port, app instance, token
                asm.serve.startListening(null, app, info.asm.token);
            });
        });
    });
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
        if (!asm.server.running) {
            console.log("[console] Server is not running.".red);
        } else {
            asm.showConsole();
        }
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
    } else if (cmd.split(' ')[0] == "send") {
        var startMsg = cmd.split(' ');
        startMsg.shift();
        var adminMsg = startMsg.toString().replace(/,/g, ' ');
        asm.adminSay(adminMsg);
    } else if (cmd == "quit" || cmd.split(' ')[0] == "quit") {
        var arg = cmd.split(' ')[1];
        if (arg == "force") {
            //true = force shutdown
            asm.quit(true);
        } else {
            //false = DO NOT force shutdown
            asm.quit(false);
        }
    } else {
        if (!asm.server.running) {
            console.log("[command] Server is not running.".red);
        } else {
            asm.server.game.command(cmd);
        }
    }
});