#Anchor Server Manager
###ASM - 1.1.0 - ALPHA

 - Grabs info regarding it's host.
 - Confirms its permissions.
 - Creates a one-time token.
 - Hosts endpoints, files, and backups
 - Checks for updates.
 - Updates if necessary.
 - Starts gameserver.
 - Handles command-line input
 - Handles remote commands
 
###Terminal Commands
 - log
   - Dumps latest.log to term.
 - console
   - Pipes STDOUT of java proc to term.
 - start
   - duh.
 - stop
   - duh.
 - restart
   - duh.
 - backup
   - duh.
 - quit
   - "quit" safely shuts down the gameserver, then kills the asm proc.
   - "quit force" kills *everything* (java proc then asm proc)
 - send
   - supply a message after "send", and it will be passed as an admin msg to the gameserver.
   - EX: "send hello world" will show in game as "[AnchorHosting] hello world" (in red)
 - Anything not listed is interpreted as a gameserver command, and as such is passed to the STDIN of the java proc.
 
###Web thingies
 - /serve/
   - banned-ips
   - banned-players
   - ops
   - server-properties
   - whitelist
   - log
 - /func/
   - start
   - stop
   - restart
   - backup
 - /func/command/:arg
   - requires argument after "command/"
   - for example, */func/command/say hi*
 - /backups
   - lists backups in JSON format
 - /backup/:id
   - downloads backup *:id* as *world-:id.tar.gz*
 
##In Active Development!