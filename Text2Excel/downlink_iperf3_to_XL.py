import re
import pandas as pd
import json
from datetime import datetime, timedelta

# Reading the iPerf3 log file
log_file_path = "../Backend/output/downlinkdata.txt"  
gps_file_path = "../Backend/output/gps_data.txt"

# Initialize lists for GPS and iPerf data
time_list = []
interval_list = []
transfer_list = []
bitrate_list = []
jitter_list = []
lost_total_list = []
latitude_list = []
longitude_list = []
altitude_list = []

# Read the GPS data from the GPS file
gps_data = []
with open(gps_file_path, "r") as gps_file:
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

# Updated regular expression to capture time, interval, transfer, bitrate, jitter, and lost/total datagrams
pattern = r"\w+\s+\w+\s+\d+\s+(\d+:\d+:\d+)\s+\d+\s+\[\s*\d+\]\s+(\d+\.\d+-\d+\.\d+)\s+sec\s+(\d+\s+\w+)\s+(\d+\s+\w+/sec)\s+([\d\.]+\s+ms)\s+(\d+/\d+)"

# Read the iPerf data and parse the required information
with open(log_file_path, "r") as file:
    iperf_output = file.read()
    matches = re.findall(pattern, iperf_output)

    for match in matches:
        time, interval, transfer, bitrate, jitter, lost_datagrams = match
        time_list.append(time)
        interval_list.append(interval)
        transfer_list.append(transfer)
        bitrate_list.append(bitrate)
        jitter_list.append(jitter)
        lost_total_list.append(lost_datagrams)
        
        # Find and append GPS data based on the timestamp
        latitude, longitude, altitude = find_closest_gps_data(time)
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
df.to_excel("exceloutput/downlink_iperf_with_gps_output.xlsx", index=False)

print("Downlink data with GPS coordinates has been successfully written to downlink_iperf_with_gps_output.xlsx")
