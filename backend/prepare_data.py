# prepare_data.py
import pandas as pd
import json

print("🔄 Starting data preparation...")

# 1. Create the Jargon Dictionary (if you haven't already)
jargon_dict = {
    "hard worker": "Consistently exceeded project deadlines through efficient time management.",
    "team player": "Collaborated with cross-functional teams to deliver projects ahead of schedule.",
    "responsible for": "Spearheaded / Orchestrated / Managed end-to-end execution of...",
    "helped": "Facilitated / Accelerated / Drove a 20% increase in...",
    "worked on": "Developed / Engineered / Optimized [Specific Technology] to solve [Specific Problem].",
    "good communication skills": "Translated complex technical requirements for non-technical stakeholders.",
    "references available upon request": "DELETE THIS: It wastes valuable ATS space.",
    "synergy": "Integrated systems to streamline workflows.",
    "think outside the box": "Implemented an innovative solution that reduced costs/time by X%."
}
with open('jargon_dict.json', 'w') as f:
    json.dump(jargon_dict, f)
print("✅ Jargon dictionary saved.")

# 2. Load your downloaded Kaggle dataset
# (Change 'all_companies_matrices.csv' to the exact name of your downloaded file)
try:
    df = pd.read_csv('all_companies_matrices.csv')
    print(f"✅ Loaded dataset with {len(df)} rows.")
except FileNotFoundError:
    print("❌ Error: Could not find the CSV file. Make sure it's in the same folder as this script!")
    exit()

# 3. Filter for ONLY Technical Companies
# We look at the 'Type' column for tech-related keywords
tech_keywords = [
    'IT Services', 'Internet', 'Software', 'Analytics', 'Telecom', 
    'EdTech', 'FinTech', 'Computer Software', 'E-commerce', 'Artificial Intelligence'
]

# Create a regex pattern to match any of the keywords (case-insensitive)
pattern = '|'.join(tech_keywords)
tech_df = df[df['Type'].str.contains(pattern, case=False, na=False)]

print(f"✅ Filtered down to {len(tech_df)} technical companies.")

# 4. Rename columns to match what our FastAPI backend expects
# (Adjust these names if your specific Kaggle download used different column headers)
column_mapping = {
    'Company Name': 'company_name',
    'Type': 'industry',
    'Company Culture': 'culture_score',
    'Work-Life Balance': 'wlb_score',
    'Skill Development': 'skill_score'
}

# Only rename columns that actually exist in your CSV
final_df = tech_df.rename(columns={k: v for k, v in column_mapping.items() if k in tech_df.columns})

# Keep only the columns we need
required_columns = ['company_name', 'industry', 'culture_score', 'wlb_score', 'skill_score']
final_df = final_df[[col for col in required_columns if col in final_df.columns]]

# 5. Clean the data (Drop rows with missing scores)
final_df = final_df.dropna(subset=['culture_score', 'wlb_score', 'skill_score'])

# 6. Save the final, clean master dataset
final_df.to_csv('master_tech_data.csv', index=False)
print(f"🎉 SUCCESS! Saved {len(final_df)} tech companies to 'master_tech_data.csv'.")
print("You can now delete or ignore the original raw CSV files.")