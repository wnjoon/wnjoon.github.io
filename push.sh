#!/bin/bash

MESSAGE=$1
NOWDATE=$(date +"%y.%m.%d-%H:%M")

echo "1. Add all"
git add -A

echo "2. commit"
# git commit -m $NOWDATE" : "$MESSAGE 

# echo "3. push"
# git push origin master

# echo "4. rebuild commit(dunno why)"
git commit --allow-empty -m $NOWDATE" : "$MESSAGE 

echo "3. push"
git push origin master

