#!/usr/bin/env bash

SRC="https://docs.google.com/spreadsheets/d/e/2PACX-1vS6R4cAFsbSoOGGXV58jabkAnuN70b9Jkuafa6OJbvY7STO7SQ2WtY5c0kjORrWnUiyM-aNc_4bzBE4/pub?gid=0&single=true&output=csv"

curl $SRC -o ./src/data/scholarships.csv