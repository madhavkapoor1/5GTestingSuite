import re
import pandas as pd
import json
from datetime import datetime, timedelta

# Function to find nearest GPS data based on timestamp (ignores the date)
def find_closest_gps_data(gps_data, target_time, threshold=2):
    closest_entry = None
    closest_diff = float('inf')
    
    for entry in gps_data:
        gps_time = datetime.strptime(entry["timestamp"], "%H:%M:%S").time()
        target_time_only = target_time.time()
        
        # Calculate time difference in seconds
        time_diff = abs((datetime.combine(datetime.min, target_time_only) - 
                         datetime.combine(datetime.min, gps_time)).total_seconds())
        
        if time_diff <= threshold and time_diff < closest_diff:
            closest_diff = time_diff
            closest_entry = entry
    
    if closest_entry:
        return closest_entry["latitude"], closest_entry["longitude"], closest_entry["altitude_meters"]
    return None, None, None

# Load the GPS data from the file (assuming JSON format for GPS data)
gps_file = "../Backend/output/gps_data.txt"  # Update path if needed
gps_data = []
with open(gps_file, "r") as f:
    for line in f:
        gps_data.append(json.loads(line.strip()))

# Initialize lists to hold parsed data
time_list = []
rtt_list = []
lat_list = []
long_list = []
alt_list = []

# Regular expression to match RTT values and timestamps in the TCP latency data
pattern = re.compile(r"(\d{4}-\d{2}-\d{2})\s+(\d+:\d+:\d+).*rtt=(\d+\.\d+)\s+ms")

# Read the TCP latency log file
tcp_latency_file = "../Backend/output/TCPresults.txt"  # Update path
with open(tcp_latency_file, "r") as file:
    for line in file:
        match = pattern.search(line)
        if match:
            date = match.group(1)
            time = match.group(2)
            rtt = float(match.group(3))
            
            # Combine date and time into a datetime object
            timestamp = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M:%S")

            # Find corresponding GPS data based on the timestamp (time-only match)
            lat, long, alt = find_closest_gps_data(gps_data, timestamp)

            # Append the data to the lists
            time_list.append(time)
            rtt_list.append(rtt)
            lat_list.append(lat)
            long_list.append(long)
            alt_list.append(alt)

# Create a DataFrame from the parsed data
df = pd.DataFrame({
    "Time": time_list,
    "RTT (ms)": rtt_list,
    "Latitude": lat_list,
    "Longitude": long_list,
    "Altitude (m)": alt_list
})

# Save the DataFrame to an Excel file
df.to_excel("exceloutput/tcp_latency_with_gps_updated.xlsx", index=False)

print("TCP latency data with GPS coordinates has been written to tcp_latency_with_gps_updated.xlsx.")
