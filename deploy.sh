#!/bin/sh

rsync -a ./ punkavec@punkave.com:/var/www/kickshirts --exclude-from=.gitignore
ssh punkavec@punkave.com 'cd /var/www/kickshirts; npm install'

