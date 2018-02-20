#!/bin/bash

set -e
echo "===================> install node modules"
cnpm install
echo "===================> start build"
npm run build
echo "===================> tar -cf dist.tar dist"
tar -cf dist.tar dist
echo "===================> rm -rf dist"
rm -rf dist
echo "===================> end compelete"

