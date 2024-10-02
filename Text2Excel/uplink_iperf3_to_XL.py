import re
import pandas as pd

# Initialize empty lists to hold the data
time_list = []
interval_list = []
transfer_list = []
bitrate_list = []
jitter_list = []
lost_total_list = []

# Define the regex pattern to match the summary lines, including timestamp
# This pattern specifically captures summary lines that include Jitter and Lost/Total Datagrams
pattern = re.compile(
    r"(\w+\s+\d+\s+(\d+:\d+:\d+)\s+\d+)\s+\[\s*\d+\]\s*(\d+\.\d+-\d+\.\d+)\s+sec\s+(\d+\.\d+\s+\w+Bytes)\s+(\d+\.\d+\s+\w+/sec)\s+(\d+\.\d+\s+ms)\s+(\d+)/(\d+)"
)

# Read the file and parse the required information
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

# Create a DataFrame from the lists
df = pd.DataFrame({
    "Time": time_list,
    "Interval": interval_list,
    "Transfer": transfer_list,
    "Bitrate": bitrate_list,
    "Jitter": jitter_list,
    "Lost/Total Datagrams": lost_total_list
})

# Save the DataFrame to an Excel file
df.to_excel("exceloutput/uplink_iperf3_output.xlsx", index=False)

print("Summary data has been successfully written to uplink_iperf3_output.xlsx")
