#!/bin/bash
echo "{}\n" > schemas/$1.json
echo "{% extends 'styles/blank.njk' %}\n" > templates/styles/$1.njk
echo "\n" > templates/$1.njk
echo "\n" > templates/$1.njk
mkdir test_data/$1
echo "{}\n" > test_data/$1/simple.json
