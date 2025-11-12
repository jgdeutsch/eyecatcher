#!/usr/bin/env python3
import sys
import csv  # <-- Import the csv module
from serpapi import GoogleSearch

# --- Configuration ---

# Replace with your actual SerpApi key
API_KEY = "f56a617678dd8cc33450512a758d6b321ae1d6c913151f0d4d55831ab3e7a970"

# The list of queries you want to scrape
SEARCH_QUERIES = [
    "testosterone blood test",
    "ferritin test",
    "vitamin d test",
    "cmp blood test",
    "crp blood test",
    "tsh test",
    "hemoglobin a1c test",
    "lipid panel test",
    "alt blood test",
    "ast blood test"
]

# Define the output filename
OUTPUT_FILENAME = "image_urls.csv"

# This will store all the (query, url) pairs
all_image_data = []

# We print status messages to stderr so that only the
# final URLs go to stdout (which you can pipe to a file).
print("🚀 Starting Google Shopping image scraper...", file=sys.stderr)

for query in SEARCH_QUERIES:
    print(f"\n🔍 Scraping results for: '{query}'", file=sys.stderr)
    
    params = {
        "engine": "google_shopping",
        "q": query,
        "gl": "us",         # Country: United States
        "hl": "en",         # Language: English
        "api_key": API_KEY
    }
    
    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        
        # Check for an error from SerpApi
        if "error" in results:
            print(f"  Error: {results['error']}", file=sys.stderr)
            continue
            
        shopping_results = results.get("shopping_results", [])
        
        if not shopping_results:
            print(f"  🚫 No shopping results found.", file=sys.stderr)
            continue
        
        # Get up to 40 images for this query
        count_for_this_query = 0
        unique_urls_for_this_query = set() # To avoid duplicates per query

        for item in shopping_results:
            if "thumbnail" in item:
                thumbnail_url = item["thumbnail"]
                # Add to set to check for duplicates *within* this query's top 40
                if thumbnail_url not in unique_urls_for_this_query:
                    
                    # Store the data as a (query, url) tuple
                    all_image_data.append( (query, thumbnail_url) ) 
                    
                    unique_urls_for_this_query.add(thumbnail_url)
                    count_for_this_query += 1
                    
                    if count_for_this_query >= 40:
                        break  # Stop after 40 images for this query
        
        print(f"  ✅ Found {count_for_this_query} images.", file=sys.stderr)
        
    except Exception as e:
        print(f"  An exception occurred for query '{query}': {e}", file=sys.stderr)

print("\n\n🎉 Scraping complete.", file=sys.stderr)
print(f"Total images found: {len(all_image_data)}", file=sys.stderr)

# --- Write to CSV File ---
try:
    # Open the file in 'w' (write) mode
    with open(OUTPUT_FILENAME, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        
        # Write the header row you specified
        writer.writerow(["topic_name", "topic_name_image_url"])
        
        # Write all the data rows
        writer.writerows(all_image_data)
        
    print(f"\n✅ Results successfully saved to {OUTPUT_FILENAME}", file=sys.stderr)

except Exception as e:
    print(f"\n❌ Error writing to CSV file: {e}", file=sys.stderr)
