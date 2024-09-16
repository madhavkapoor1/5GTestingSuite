#!/bin/bash

# Define the target IP and port
TARGET_IP="99.210.172.230"
PORT=8080

echo "Starting TCP Latency Test at $(date)" | tee -a ./output/testlog.txt ./output/TCPresults.txt

# Run the hping3 command and save the output to TCPresults.txt
sudo hping3 -S -p $PORT $TARGET_IP -c 10 -i 1 --verbose >> ./output/TCPresults.txt

# Notify the user that the command has completed
echo "TCP Latency Test Done" >> ./output/testlog.txt