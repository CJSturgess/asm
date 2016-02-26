#!/bin/bash
if [$HOSTNAME == "vultr.guest"]
    then
        echo "Yeppers"
fi
cd /home/anchor/asm
git pull
node anchor