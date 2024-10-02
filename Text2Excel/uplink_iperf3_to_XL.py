import re
import pandas as pd
import json
from datetime import datetime, timedelta

# Initialize empty lists to hold the data
time_list = []
interval_list = []
transfer_list = []
bitrate_list = []
jitter_list = []
lost_total_list = []
latitude_list = []
longitude_list = []
altitude_list = []

# Define the regex pattern to match the summary lines, including timestamp
pattern = re.compile(
    r"(\w+\s+\d+\s+(\d+:\d+:\d+)\s+\d+)\s+\[\s*\d+\]\s*(\d+\.\d+-\d+\.\d+)\s+sec\s+(\d+\.\d+\s+\w+Bytes)\s+(\d+\.\d+\s+\w+/sec)\s+(\d+\.\d+\s+ms)\s+(\d+)/(\d+)"
)

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
        gps_time = datetime.strptime(gps["timestamp"], time_format)
        if abs((gps_time - target_time).total_seconds()) <= 2:
            return gps["latitude"], gps["longitude"], gps["altitude_meters"]
    
    return None, None, None

# Read the iPerf data and parse the required information
with open("../Backend/output/uplinkdata.txt", "r") as file:
    for line in file:
        match = pattern.search(line)
        if match:
            timestamp = match.group(2)  # Only captures the HH:MM:SS part
            interval = match.group(3)
            transfer = match.group(4)
            bitrate = match.group(5)
            jitter = match.group(6)
            lost = match.group(7)
            total = match.group(8)
            
            # Append the extracted data to the respective lists
            time_list.append(timestamp)
            interval_list.append(interval)
            transfer_list.append(transfer)
            bitrate_list.append(bitrate)
            jitter_list.append(jitter)
            lost_total_list.append(f"{lost}/{total}")
            
            # Find and append GPS data based on the timestamp
            latitude, longitude, altitude = find_closest_gps_data(timestamp)
            latitude_list.append(latitude)
            longitude_list.append(longitude)
            altitude_list.append(altitude)

# Create a DataFrame from the lists
df = pd.DataFrame({
    "Time": time_list,
    "Interval": interval_list,
    "Transfer": transfer_list,
    "Bitrate": bitrate_list,
    "Jitter": jitter_list,
    "Lost/Total Datagrams": lost_total_list,
    "Latitude": latitude_list,
    "Longitude": longitude_list,
    "Altitude": altitude_list
})

# Save the DataFrame to an Excel file
df.to_excel("exceloutput/uplink_iperf3_with_gps_output.xlsx", index=False)

print("Summary data with GPS coordinates has been successfully written to uplink_iperf3_with_gps_output.xlsx")
