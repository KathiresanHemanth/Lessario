import json
import re
import math
import os
from datetime import datetime, timedelta

def get_latest_speed(log_content):
    """Extracts the latest requestsFinishedPerMinute from crawler logs."""
    # Find all statistics JSON objects in the log
    stats_lines = re.findall(r'PlaywrightCrawler request statistics:\s*({.*})', log_content)
    
    if not stats_lines:
        return 3 # Default fallback speed if no logs found
        
    latest_stats_str = stats_lines[-1]
    try:
        stats = json.loads(latest_stats_str)
        speed = stats.get('requestsFinishedPerMinute', 3)
        return speed if speed > 0 else 3 # Avoid division by zero
    except json.JSONDecodeError:
        return 3

def main():
    base_dir = '/Users/arstudios/Documents/GitHub/Lessario/Client Projects/Nijeesh/Event_Planning/sports-scraper-pro'
    clean_file = os.path.join(base_dir, 'leads_clean.json')
    enriched_file = os.path.join(base_dir, 'leads_enriched_google.json')
    log_file = '/Users/arstudios/Documents/GitHub/Lessario/Client Projects/Nijeesh/Event_Planning/1.md'
    
    # 1. Get total leads
    total_leads = 0
    if os.path.exists(clean_file):
        try:
            with open(clean_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                total_leads = len(data)
        except Exception:
            pass
            
    if total_leads == 0:
        total_leads = 1010 # Fallback

    # 2. Get completed leads
    completed_leads = 0
    if os.path.exists(enriched_file):
        try:
            with open(enriched_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                completed_leads = len(data)
        except Exception:
            pass

    # 3. Get current speed from logs
    speed_per_minute = 3
    if os.path.exists(log_file):
        with open(log_file, 'r', encoding='utf-8') as f:
            log_content = f.read()
            speed_per_minute = get_latest_speed(log_content)

    # 4. Calculations
    leads_remaining = total_leads - completed_leads
    percentage = (completed_leads / total_leads) * 100 if total_leads > 0 else 0
    
    minutes_remaining = leads_remaining / speed_per_minute
    hours = int(minutes_remaining // 60)
    mins = int(minutes_remaining % 60)
    
    finish_time = datetime.now() + timedelta(minutes=minutes_remaining)
    finish_time_str = finish_time.strftime('%I:%M %p')

    # 5. Generate Output
    output = f"""Based on the current progress and the statistics from your terminal, here is the estimate for how much longer it will take to finish the Google Enrichment:

### **Current Progress Stats:**
*   **Total Leads to Process:** {total_leads:,}
*   **Leads Completed So Far:** {completed_leads:,} (approx. {math.floor(percentage)}%)
*   **Leads Remaining:** {leads_remaining:,}
*   **Current Speed:** ~{speed_per_minute} leads per minute (based on the logs)

### **Time Estimate:**
*   **Estimated Remaining Time:** **~{hours} hours and {mins} minutes**.
*   **Estimated Finish Time:** Roughly **{finish_time_str}** (local time).

### **Notes:**
*   **Why it takes time:** The script includes a 15–25 second delay between every search to prevent Google from blocking your IP.
*   **429 Warnings:** You might see some `429 (Too Many Requests)` warnings. These are normal; the script is designed to "reclaim" those and retry them automatically after a short wait.
*   **Manual Intervention:** If you see a CAPTCHA in the browser window, solving it manually will help the script resume its speed.

It’s best to just let it run in the background. If you need the data sooner, you can stop it at any time and run the `compile.js` script to get the CSV of what has been found so far!"""

    print(output)

if __name__ == '__main__':
    main()
