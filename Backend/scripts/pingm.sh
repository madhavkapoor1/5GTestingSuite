#!/bin/sh

dev="unknown"
dest="99.210.18.80"
if [ $(id -u) = 0 ] ; then
	interval=0.01
else
	interval=0.1
fi
packet_size=56		# default size 56 bytes (+ ICMP header 8 bytes = 64 bytes)
num_req=10

usage() {
    echo
    echo "Usage: $0 [OPTION]... [DEST]"
    echo
    echo "OPTION"
    echo "    -d  DEV      device used for the ping measurements"
    echo "    -i  interval interval in seconds"
    echo "    -s  size     data packet size (default 56 bytes)"
    echo "    -c  count    number of ping request to send"
    echo "    -h           print usage screen"
    echo
    echo "DEST"
    echo "    Destination, default 8.8.8.8"
    echo
}

while getopts “hd:i:s:c:” option
do
    case $option in
        h)
            usage
            exit 0
            ;;
        d)
            dev=$OPTARG
            ;;
        i)
            interval=$OPTARG
            ;;
        s)
            packet_size=$OPTARG
            ;;
        c)
            num_req=$OPTARG
            ;;
        ?)
            usage
            exit 0
            ;;
    esac
done
shift $((OPTIND -1))

if [ $# -ge 1 ] ; then
    dest=$1
fi
echo "Starting ping test"
echo "Using device: ${dev}" >> ./output/pingresults.txt
echo "Destination: ${dest}" >> ./output/pingresults.txt
echo "Packet size (payload): ${packet_size} bytes" >> ./output/pingresults.txt
echo "Interval: ${interval} sec" >> ./output/pingresults.txt
echo "Number of requests: ${num_req}" >> ./output/pingresults.txt

starttime=$(date)
echo "Starting test at ${starttime}" >> ./output/pingresults.txt
ping -D -s ${packet_size} -i ${interval} -c ${num_req} ${dest} | awk '{ print strftime("%Y-%m-%d %H:%M:%S"), $0 }' >> ./output/pingresults.txt
echo "--------------------------" >> ./output/pingresults.txt
echo "Ping test done"
