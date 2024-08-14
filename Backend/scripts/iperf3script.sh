#!/bin/bash

# Function to check if a process is running
is_running() {
  ps -p $1 > /dev/null 2>&1
  return $?
}

# Function to start iperf3 processes and log start time
start_iperf3() {
  # Log the start time
  echo "Starting iperf3 tests at $(date)" | tee -a downlinkdata.txt uplinkdata.txt maxdata.txt

  # Start iperf3 commands in the background
  iperf3 -c 99.210.18.80 -p 5201 -u -b 800bps -l 100 -t 10 -V --timestamp >> downlinkdata.txt &
  PID1=$!

  iperf3 -c 99.210.18.80 -p 5202 -u -b 2M -t 10 -R -V --timestamp >> uplinkdata.txt &
  PID2=$!

  iperf3 -c 99.210.18.80 -p 5203 -t 10 -V --timestamp >> maxdata.txt &
  PID3=$!
}

# Function to monitor the processes
monitor_processes() {
  while true; do
    sleep 1

    is_running $PID1
    RUN1=$?
    is_running $PID2
    RUN2=$?
    is_running $PID3
    RUN3=$?

    if [ $RUN1 -ne 0 ] || [ $RUN2 -ne 0 ] || [ $RUN3 -ne 0 ]; then
      break
    fi
  done
}

# Main loop

start_iperf3
monitor_processes
echo '-----------------------' | tee -a downlinkdata.txt uplinkdata.txt maxdata.txt > /dev/null
echo "All processes have completed. Waiting for the next run..."
