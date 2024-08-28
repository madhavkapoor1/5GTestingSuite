#!/bin/bash

# Destination IP address
DEST_IP="99.210.172.230"

# Number of cycles for each MTR run
CYCLES=10

# Function to run MTR and save the output to a timestamped file
run_mtr() {
    TIMESTAMP=$(date "+%H-%M-%S")
    LOG_FILE="./output/mtr_results.txt"
    echo "Starting MTR script" >> ./output/testlog.txt
    echo "Running MTR to $DEST_IP at $TIMESTAMP" >> $LOG_FILE
    mtr -r -c $CYCLES $DEST_IP >> $LOG_FILE
    echo "----------------------------------------" >> $LOG_FILE
    echo "Finished MTR script" >> ./output/testlog.txt
}

run_mtr
