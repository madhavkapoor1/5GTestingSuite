#!/bin/bash

# Define the target IP and port
TARGET_IP="99.210.172.230"
PORT=8080

# Start the test and log the start time
echo "Starting TCP Latency Test at $(date)" | tee -a ./output/testlog.txt ./output/TCPresults.txt

# Run the hping3 command, process its output, and prepend the current timestamp to each line
sudo hping3 -S -p $PORT $TARGET_IP -c 10 -i 1 --verbose | awk '{ print strftime("%Y-%m-%d %H:%M:%S"), $0 }' >> ./output/TCPresults.txt

# Notify the user that the test has completed
echo "TCP Latency Test Done" >> ./output/testlog.txt
