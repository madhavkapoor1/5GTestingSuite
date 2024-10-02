import re
import pandas as pd

# Reading the iPerf3 log file
log_file_path = "../Backend/output/downlinkdata.txt"  # Update with correct path
with open(log_file_path, "r") as f:
    iperf_output = f.read()

# Print the content of the log file to ensure it's correctly read
print(iperf_output)

# Updated regular expression to capture time, interval, transfer, bitrate, jitter, and lost/total datagrams
pattern = r"\w+\s+\w+\s+\d+\s+(\d+:\d+:\d+)\s+\d+\s+\[\s*\d+\]\s+(\d+\.\d+-\d+\.\d+)\s+sec\s+(\d+\s+\w+)\s+(\d+\s+\w+/sec)\s+([\d\.]+\s+ms)\s+(\d+/\d+)"

# Find all matches in the output
matches = re.findall(pattern, iperf_output)

# Print matches to debug if data is captured correctly
print(matches)

# Extract data and put into a list of dictionaries
data = []
for match in matches:
    time, interval, transfer, bitrate, jitter, lost_datagrams = match
    data.append({
        "Time": time,
        "Interval": interval,
        "Transfer": transfer,
        "Bitrate": bitrate,
        "Jitter": jitter,
        "Lost/Total Datagrams": lost_datagrams
    })

# Convert the list of dictionaries to a pandas DataFrame
df = pd.DataFrame(data)

# Print DataFrame to ensure it's not empty
print(df)

# Save the DataFrame to an Excel file
df.to_excel("exceloutput/downlink_iperf_output.xlsx", index=False)

print("Excel file created with iPerf3 results including Time, Jitter, and Lost/Total Datagrams.")
