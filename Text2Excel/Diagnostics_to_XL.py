import re
import pandas as pd
import json
from datetime import datetime, timedelta

# Function to find nearest GPS data based on timestamp (ignores the date)
def find_closest_gps_data(gps_data, target_time, threshold=3):
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

# Function to parse the log file and extract relevant fields
def parse_modem_diagnostics(file_path, gps_data):
    # Fields we want to track
    fields_to_track = ['SINR', 'SINR_5G', 'RSRQ', 'RSRP', 'DBM', 'SS', 'NETWORK_SUBNET',
                       'RSRQ_5G', 'RSRP_5G', 'RFBANDWIDTH_5G', 'ULFRQ', 'DLFRQ', 'RFCHANNEL',
                       'LTEBANDWIDTH', 'ULFRQ_5G', 'DLFRQ_5G', 'PHY_CELL_ID', 'MDN', 'CELL_ID',
                       'DNS1', 'DNS2', 'MODEMTEMP', 'RAD_IF', 'TAC', 'TX_LTE', 'RFBAND_5G']

    diagnostics_data = []
    current_entry = {'Timestamp': None}
    
    # Regex pattern to match each line in the log
    pattern = re.compile(r"(?P<timestamp>\d+-\d+-\d+ \d+:\d+:\d+).*modem_diagnostics: (?P<field>.*?): (?P<value>.*)")
    
    with open(file_path, 'r') as file:
        for line in file:
            match = pattern.match(line.strip())
            if match:
                field = match.group('field')
                value = match.group('value')
                timestamp_str = match.group('timestamp')
                
                # Convert timestamp to datetime object
                timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
                
                # Start a new entry if we're seeing a new "Time" field
                if field == 'Time':
                    # Save the previous entry if it exists
                    if current_entry['Timestamp']:
                        diagnostics_data.append(current_entry)
                    
                    # Adjust timestamp by subtracting one hour and store time only in HH:MM:SS format
                    adjusted_time = timestamp - timedelta(hours=1)
                    current_entry = {'Timestamp': adjusted_time.strftime('%H:%M:%S')}
                    
                    # Find nearest GPS data and add it to the entry
                    lat, long, alt = find_closest_gps_data(gps_data, adjusted_time)
                    current_entry['Latitude'] = lat
                    current_entry['Longitude'] = long
                    current_entry['Altitude (m)'] = alt
                
                # Only track the fields we are interested in
                if field in fields_to_track:
                    current_entry[field] = value
        
        # Append the last entry
        if current_entry['Timestamp']:
            diagnostics_data.append(current_entry)
    
    return diagnostics_data

# Function to convert parsed data to DataFrame and save to Excel
def diagnostics_to_excel(data, output_file):
    df = pd.DataFrame(data)
    
    # Ensure all columns are present even if some diagnostics sets don't have all fields
    all_columns = ['Timestamp', 'Latitude', 'Longitude', 'Altitude (m)', 'SINR', 'SINR_5G', 'RSRQ', 'RSRP', 'DBM', 'SS', 
                   'NETWORK_SUBNET', 'RSRQ_5G', 'RSRP_5G', 'RFBANDWIDTH_5G', 'ULFRQ', 'DLFRQ', 'RFCHANNEL',
                   'LTEBANDWIDTH', 'ULFRQ_5G', 'DLFRQ_5G', 'PHY_CELL_ID', 'MDN', 'CELL_ID', 'DNS1', 'DNS2', 
                   'MODEMTEMP', 'RAD_IF', 'TAC', 'TX_LTE', 'RFBAND_5G']

    # Reorder the columns and fill in missing columns with None
    df = df.reindex(columns=all_columns)
    
    # Save the DataFrame to an Excel file
    df.to_excel(output_file, index=False)
    print(f"Data successfully saved to {output_file}")

# Load GPS data from file (assuming JSON format for GPS data)
def load_gps_data(gps_file):
    gps_data = []
    with open(gps_file, 'r') as f:
        for line in f:
            gps_data.append(json.loads(line.strip()))
    return gps_data

# Main execution
if __name__ == "__main__":
    input_file = "../Backend/output/Log.txt"  # Replace with the path to your input txt file
    gps_file = "../Backend/output/gps_data.txt"  # Replace with the path to your GPS data file
    output_file = "exceloutput/modem_diagnostics_output_with_gps.xlsx"
    
    # Load GPS data
    gps_data = load_gps_data(gps_file)
    
    # Parse the modem diagnostics data and include GPS data
    diagnostics_data = parse_modem_diagnostics(input_file, gps_data)
    
    # Write to Excel
    diagnostics_to_excel(diagnostics_data, output_file)
