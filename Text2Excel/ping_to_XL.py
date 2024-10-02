import re
import pandas as pd
import json
from datetime import datetime

# Initialize empty lists to hold the data
timestamp_list = []
packet_loss_list = []
rtt_min_list = []
rtt_avg_list = []
rtt_max_list = []
rtt_mdev_list = []
latitude_list = []
longitude_list = []
altitude_list = []

# Define the regex pattern to capture the summary lines and packet loss
summary_pattern = re.compile(r"rtt min/avg/max/mdev = ([\d\.]+)/([\d\.]+)/([\d\.]+)/([\d\.]+) ms")
packet_loss_pattern = re.compile(r"(\d+)% packet loss")

# Read GPS data from the file
gps_data = []
with open("../Backend/output/gps_data.txt", "r") as gps_file:
    for line in gps_file:
        gps_data.append(json.loads(line))

# Helper function to find the closest GPS data within 2 seconds of a given timestamp
def find_closest_gps_data(timestamp):
    time_format = "%H:%M:%S"
    target_time = datetime.strptime(timestamp, time_format)
    
    for gps in gps_data:
        gps_time = datetime.strptime(gps["timestamp"], "%H:%M:%S")
        if abs((gps_time - target_time).total_seconds()) <= 2:
            return gps["latitude"], gps["longitude"], gps["altitude_meters"]
    
    return None, None, None

# Read the ping test results
with open("../Backend/output/pingresults.txt", "r") as file:
    packet_loss = None
    timestamp = None

    for line in file:
        # Search for packet loss percentage line
        packet_loss_match = packet_loss_pattern.search(line)
        if packet_loss_match:
            packet_loss = packet_loss_match.group(1)

        # Search for summary RTT line
        summary_match = summary_pattern.search(line)
        if summary_match:
            rtt_min = summary_match.group(1)
            rtt_avg = summary_match.group(2)
            rtt_max = summary_match.group(3)
            rtt_mdev = summary_match.group(4)

            # Extract the timestamp from the line above the summary (which contains the timestamp)
            if timestamp:
                timestamp_list.append(timestamp)
                packet_loss_list.append(packet_loss)
                rtt_min_list.append(rtt_min)
                rtt_avg_list.append(rtt_avg)
                rtt_max_list.append(rtt_max)
                rtt_mdev_list.append(rtt_mdev)

                # Find and append GPS data based on the timestamp
                latitude, longitude, altitude = find_closest_gps_data(timestamp)
                latitude_list.append(latitude)
                longitude_list.append(longitude)
                altitude_list.append(altitude)

            # Reset packet loss and timestamp for the next test
            packet_loss = None
            timestamp = None

        # Search for the timestamp from the test header (using HH:MM:SS format)
        timestamp_match = re.search(r"(\d{2}:\d{2}:\d{2})", line)
        if timestamp_match:
            timestamp = timestamp_match.group(1)

# Create a DataFrame from the lists
df = pd.DataFrame({
    "Time": timestamp_list,
    "Packet Loss (%)": packet_loss_list,
    "RTT Min (ms)": rtt_min_list,
    "RTT Avg (ms)": rtt_avg_list,
    "RTT Max (ms)": rtt_max_list,
    "RTT Mdev (ms)": rtt_mdev_list,
    "Latitude": latitude_list,
    "Longitude": longitude_list,
    "Altitude (meters)": altitude_list
})

# Save the DataFrame to an Excel file
df.to_excel("exceloutput/ping_summary_with_gps.xlsx", index=False)

print("Ping summary data with GPS coordinates has been successfully written to ping_summary_with_gps.xlsx")
