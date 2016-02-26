#!/bin/bash
if [ $HOSTNAME = "vultr.guest" ]; then
    node /home/anchor/vultr > /etc/hostname
    hostname -F /etc/hostname
    echo $(hostname -I | cut -d\  -f1) $(hostname) | sudo tee -a /etc/hosts
    reboot now
else
    cd /home/anchor/asm
    rm anchor.sh
    git pull
    chmod +x ./anchor.sh
    node anchor
fi