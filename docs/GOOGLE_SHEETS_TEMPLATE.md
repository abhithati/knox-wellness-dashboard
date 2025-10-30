# 📊 Google Sheets Template Guide

This document shows you exactly how to structure your Google Sheet for the dashboard.

---

## 📋 Overview

Your Google Sheet should have **4 tabs** (sheets):

1. **Van Schedule** - Where the van will be (future stops)
2. **Service Tracking** - What services were provided (past stops)
3. **Census Tract Data** - Demographic information (rarely changes)
4. **Barriers to Care** - Survey data (rarely changes)

---

## 📅 Tab 1: "Van Schedule"

### Purpose
Shows upcoming wellness van stops so people know where and when to find services.

### Column Structure

| Column Name | Type | Required | Example | Notes |
|------------|------|----------|---------|-------|
| Date | Date | ✅ Yes | 2025-11-15 | Format: YYYY-MM-DD |
| Time | Text | ✅ Yes | 10:00 AM | Can be range: "10AM-2PM" |
| Location | Text | ✅ Yes | Camden Library | Name of the place |
| Address | Text | ✅ Yes | 55 Main Street, Camden, ME | Full street address |
| Services | Text | ✅ Yes | Health Screening, Dental | Comma-separated list |
| Zip Code | Number | ✅ Yes | 04843 | 5-digit zip code |
| Latitude | Number | ✅ Yes | 44.2098 | GPS coordinate |
| Longitude | Number | ✅ Yes | -69.0648 | GPS coordinate |
| Notes | Text | No | Free blood pressure checks | Optional details |

### Sample Data

```
Row 1 (Headers):
Date | Time | Location | Address | Services | Zip Code | Latitude | Longitude | Notes

Row 2:
2025-11-15 | 10:00 AM | Camden Library | 55 Main Street, Camden, ME | Health Screening, Dental, Wellness Education | 04843 | 44.2098 | -69.0648 | Free blood pressure checks

Row 3:
2025-11-17 | 2:00 PM - 5:00 PM | Rockland Community Center | 23 Union Street, Rockland, ME | Health Screening, Mental Health | 04841 | 44.1037 | -69.1092 | Mental health counselor on-site

Row 4:
2025-11-20 | 1:00 PM | Thomaston Fire Station | 45 Meadow Road, Thomaston, ME | Health Screening, Dental | 04861 | 44.0814 | -69.1839 | 

Row 5:
2025-11-22 | 10:00 AM | Hope Community Church | 12 Church Lane, Hope, ME | Wellness Education, Health Screening | 04847 | 44.2563 | -69.1544 | Bring insurance card if you have one
```

### How to Get Coordinates

**Method 1: Google Maps**
1. Go to [maps.google.com](https://maps.google.com)
2. Search for your location
3. Right-click on the exact spot
4. Click the coordinates that appear (e.g., "44.2098, -69.0648")
5. They'll be copied to your clipboard
6. Paste into your sheet (Latitude first, then Longitude)

**Method 2: GPS Coordinates Website**
1. Go to [gps-coordinates.net](https://www.gps-coordinates.net/)
2. Enter the address
3. Copy the latitude and longitude

### Service Types You Can Use

Common services (you can add your own):
- Health Screening
- Blood Pressure Check
- Dental
- Dental Screening
- Mental Health
- Mental Health Counseling
- Wellness Education
- Nutrition Counseling
- Vaccination
- COVID-19 Testing
- Flu Shots
- Health Insurance Enrollment
- Social Services Referral

---

## 📊 Tab 2: "Service Tracking"

### Purpose
Records what actually happened at each stop - how many people attended and what services were provided.

### Column Structure

| Column Name | Type | Required | Example | Notes |
|------------|------|----------|---------|-------|
| Date | Date | ✅ Yes | 2025-11-01 | Format: YYYY-MM-DD |
| Location | Text | ✅ Yes | Camden Library | Should match schedule |
| Attendees | Number | ✅ Yes | 25 | Total people served |
| Services Provided | Text | ✅ Yes | Blood pressure checks, Dental screenings | What you actually did |
| Notes | Text | No | High turnout, good weather | Observations |

### Sample Data

```
Row 1 (Headers):
Date | Location | Attendees | Services Provided | Notes

Row 2:
2025-11-01 | Rockland Community Center | 25 | Blood pressure checks, Dental screenings, Wellness education | High turnout, excellent weather

Row 3:
2025-11-05 | Camden Library | 18 | Health screenings, Mental health consultations, Blood pressure | Good engagement with mental health services

Row 4:
2025-11-08 | Thomaston Fire Station | 12 | Dental screenings, Health screenings | Rainy day, lower turnout than expected

Row 5:
2025-11-12 | Hope Community Church | 30 | Wellness education, Blood pressure, Nutrition counseling | Best turnout yet! Community very engaged
```

### Best Practices

- ✅ **Record data same day or next day** while it's fresh
- ✅ **Count all attendees** even if they only asked questions
- ✅ **List all services provided** separated by commas
- ✅ **Add notes** about what worked well or challenges
- ✅ **Match location names** to your schedule for consistency

---

## 📍 Tab 3: "Census Tract Data"

### Purpose
Contains demographic and health data for Knox County census tracts. This helps identify high-need areas.

### Column Structure

Use the same structure as your `Data_by_Census_Tract__1_.xlsx` file:

```
Census_Tract | Name | Med_Inc | Pct_Over65_LivingAlone | Pct_Internet_Access | Pct_HSDiploma_Only | Pct_Wout_Insurance | Pct_No_Transport | Pct_Housing_Insec | Med_Age | Pct_Food_Insec | Pct_Health_Status | Pct_Mental_Distress | Pct_No_Broadband
```

### Sample Data

```
Row 1 (Headers):
Census_Tract | Name | Med_Inc | Pct_Over65_LivingAlone | Pct_Internet_Access | Pct_HSDiploma_Only | Pct_Wout_Insurance | Pct_No_Transport | Pct_Housing_Insec | Med_Age | Pct_Food_Insec | Pct_Health_Status | Pct_Mental_Distress | Pct_No_Broadband

Row 2:
23013970200 | Camden | 62500 | 8.5 | 92.3 | 28.4 | 8.2 | 3.1 | 7.8 | 45.2 | 9.4 | 12.7 | 12.7 | 5.19

Row 3:
23013970301 | Rockport | 58200 | 9.2 | 88.5 | 31.2 | 9.5 | 4.2 | 8.5 | 47.8 | 10.2 | 15.7 | 15.7 | 14.93
```

### Updating This Data

- ⚠️ **Update annually** or when new census data is released
- ⚠️ **Don't change unless** you have updated official data
- Copy directly from your census data file

---

## 📋 Tab 4: "Barriers to Care"

### Purpose
Contains survey data about healthcare barriers in Knox County. Used for reporting and grant applications.

### Column Structure

Use the same structure as your `Barriers_To_Care_Cleaned__4___3___2___1_.xlsx` file.

### Sample Columns

```
Zip Code | Age | Gender | Your estimated household income last year | Employment Status | Health Insurance Provider | Do you have a regular doctor? | Do you have a regular dentist? | ... [and so on]
```

### Updating This Data

- ⚠️ **Update when** you conduct new surveys
- ⚠️ **Don't modify** historical survey responses
- Add new survey data as new rows

---

## 🔒 Privacy & Security

### ✅ DO Include:
- Scheduled van locations (public places)
- Aggregate attendance numbers
- Types of services offered
- Community/neighborhood names
- Census tract statistics
- Survey data (anonymized)

### ❌ DON'T Include:
- Patient names
- Individual health information
- Specific addresses of individuals
- Phone numbers of people served
- Medical diagnoses
- Insurance details
- Social security numbers
- Any HIPAA-protected information

---

## 🎨 Formatting Tips

### Dates
- **Use format:** YYYY-MM-DD (e.g., 2025-11-15)
- **Why:** Ensures proper sorting and compatibility
- **In Google Sheets:** Format → Number → Date

### Numbers
- **Coordinates:** Use decimal format (44.2098, not 44° 12' 35.3")
- **Zip Codes:** Format as "Plain text" so leading zeros aren't removed
- **Percentages:** Can be 8.2 or 8.2% (either works)

### Text
- **Services:** Separate with commas: "Service 1, Service 2, Service 3"
- **Location Names:** Be consistent - always "Camden Library" not sometimes "Library in Camden"
- **Notes:** Write clearly, no special characters that might break (avoid: ", ', <, >)

---

## ✏️ How to Create Your Sheet

### Option 1: Start from Scratch

1. Create new Google Sheet
2. Create 4 tabs with exact names above
3. Add column headers in Row 1 of each tab
4. Copy data from your Excel files to tabs 3 and 4
5. Start adding van schedule to tab 1

### Option 2: Copy Template (Recommended)

1. Make a copy of the template: [Template Link - if provided]
2. Rename it: "Knox Wellness Van Data"
3. Replace sample data with your real data
4. Keep column headers exactly as they are

---

## 📱 Mobile Editing

Yes! You can edit your Google Sheet from your phone:

1. Download "Google Sheets" app (iOS/Android)
2. Sign in to your Google account
3. Open your sheet
4. Tap a cell to edit
5. Changes sync automatically

**Perfect for:** Recording attendance right after a van stop!

---

## 🔄 Sharing & Permissions

### For Dashboard to Work:
```
Anyone with the link → Viewer
```

### For Your Team to Edit:
```
Specific people → Editor
Add team members' email addresses
```

### How to Set:
1. Click "Share" button (top right)
2. Under "General access" → Click "Restricted"
3. Change to "Anyone with the link"
4. Set to "Viewer"
5. Click "Done"

---

## 🐛 Common Issues & Fixes

### Issue: Dashboard not showing my data

**Check:**
- [ ] Sheet is set to "Anyone with link can view"
- [ ] Column names match exactly (case-sensitive!)
- [ ] No extra spaces in column names
- [ ] Date format is YYYY-MM-DD

### Issue: Map markers not appearing

**Check:**
- [ ] Latitude and Longitude are numbers, not text
- [ ] Coordinates are in correct range
- [ ] No empty cells in Latitude/Longitude columns

### Issue: Services not displaying

**Check:**
- [ ] Services are comma-separated
- [ ] No extra commas at start or end
- [ ] Column is named exactly "Services"

---

## 📊 Example Complete Sheet

Here's what a complete "Van Schedule" tab might look like:

| Date | Time | Location | Address | Services | Zip Code | Latitude | Longitude | Notes |
|------|------|----------|---------|----------|----------|----------|-----------|-------|
| 2025-11-15 | 10:00 AM | Camden Library | 55 Main St, Camden | Health Screening, Dental | 04843 | 44.2098 | -69.0648 | Free BP checks |
| 2025-11-17 | 2:00 PM | Rockland Center | 23 Union St, Rockland | Mental Health, Health Screening | 04841 | 44.1037 | -69.1092 | Counselor present |
| 2025-11-20 | 1:00 PM | Thomaston Fire Station | 45 Meadow Rd, Thomaston | Dental, Health Screening | 04861 | 44.0814 | -69.1839 | |
| 2025-11-22 | 10:00 AM | Hope Church | 12 Church Ln, Hope | Wellness Ed, Health Screening | 04847 | 44.2563 | -69.1544 | |

---

## 🎯 Quick Reference

**Column names must match EXACTLY:**

Van Schedule:
- Date, Time, Location, Address, Services, Zip Code, Latitude, Longitude, Notes

Service Tracking:
- Date, Location, Attendees, Services Provided, Notes

**Date format:** 2025-11-15  
**Service format:** Service 1, Service 2, Service 3  
**Coordinates:** Numbers with decimals (44.2098, -69.0648)

---

## 📞 Need Help?

**Can't figure out coordinates?**
- Use Google Maps method above
- Or email Scout Labs team with addresses

**Not sure about column format?**
- Check examples in this document
- Keep it simple - dashboard is flexible!

**Data not updating?**
- Wait 2-3 minutes after changes
- Click "Refresh Data" on dashboard
- Check troubleshooting section

---

**Remember: The dashboard pulls data from your Google Sheet automatically. Edit the sheet, wait a couple minutes, and your dashboard updates! No coding required.** ✨
