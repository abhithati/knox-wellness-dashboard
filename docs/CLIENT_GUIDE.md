# Client Guide: Managing Your Wellness Van Dashboard

**For: Knox County Health Department Staff**  
**Last Updated: October 2025**

---

## 📋 Quick Start

Your wellness van dashboard automatically updates when you edit your Google Sheet. That's it! No coding or technical knowledge required.

### Your Dashboard Links
- **Dashboard URL:** `https://[your-username].github.io/knox-wellness-dashboard/`
- **Google Sheet:** [Link to your Google Sheet]

---

## 🗂️ Understanding Your Google Sheet

Your Google Sheet has **4 tabs** (sheets) that control different parts of the dashboard:

### 1. **Van Schedule** Tab
This shows where the van will be and when.

**Required Columns:**
| Column Name | What to Enter | Example |
|-------------|---------------|---------|
| Date | Date of stop | 2025-11-15 |
| Time | Time of stop | 10:00 AM |
| Location | Name of location | Camden Library |
| Address | Street address | 55 Main Street |
| Services | Services offered (separate with commas) | Health Screening, Dental, Wellness Education |
| Zip Code | Zip code | 04843 |
| Latitude | GPS latitude | 44.2098 |
| Longitude | GPS longitude | -69.0648 |
| Notes | Optional notes | Free blood pressure checks |

**💡 Getting Coordinates:**
1. Go to [Google Maps](https://maps.google.com)
2. Right-click on the location
3. Click the coordinates that appear
4. Copy and paste into your sheet

---

### 2. **Service Tracking** Tab
Record what happened at each stop.

**Required Columns:**
| Column Name | What to Enter | Example |
|-------------|---------------|---------|
| Date | Date service was provided | 2025-11-01 |
| Location | Where service was provided | Rockland Community Center |
| Attendees | Number of people served | 25 |
| Services Provided | What services were given | Blood pressure checks, Dental screenings |
| Notes | Optional notes | High turnout, good weather |

---

### 3. **Census Tract Data** Tab
⚠️ **Don't edit this tab often** - it contains demographic data that changes annually.

---

### 4. **Barriers to Care** Tab
⚠️ **Don't edit this tab** - it contains survey data from your research.

---

## ✏️ How to Add a New Van Stop

1. **Open your Google Sheet** (bookmark this link!)

2. **Go to the "Van Schedule" tab**

3. **Add a new row** with all the information:
   - Date (YYYY-MM-DD format, like 2025-11-15)
   - Time (like 10:00 AM or 2:30 PM)
   - Location name
   - Full address
   - Services (use commas between services)
   - Zip code
   - Latitude and longitude (from Google Maps)
   - Any notes

4. **Save** - Google Sheets auto-saves

5. **Wait 1-2 minutes** - Your dashboard will automatically update!

6. **Check the dashboard** - Refresh the page to see your new stop

---

## 📝 How to Record Services Provided

After a van stop:

1. **Go to "Service Tracking" tab**

2. **Add a new row** with:
   - Date of service
   - Location where you were
   - Number of people who attended
   - Services you provided
   - Any notes about the visit

3. **Save** - The dashboard statistics will automatically update!

---

## 🔧 Common Tasks

### Editing an Existing Stop
1. Find the row in "Van Schedule"
2. Click the cell you want to change
3. Type the new information
4. Save (auto-saves)
5. Wait 1-2 minutes for dashboard to update

### Canceling a Stop
**Option 1: Delete the row**
- Right-click the row number → Delete row

**Option 2: Add a note**
- Keep the row, add "CANCELED" to the Notes column

### Changing a Date or Time
1. Find the stop in "Van Schedule"
2. Edit the Date or Time cell
3. Save - Dashboard updates automatically

### Adding a New Service Type
Just type it in the Services column! Use commas to separate multiple services:
```
Health Screening, Dental, Mental Health, Wellness Education
```

---

## 🎨 Understanding the Dashboard

### Map Colors
- **🟢 Green markers** = Today's stops
- **🔵 Blue markers** = Upcoming stops  
- **⚪ Gray markers** = Past stops

### Filters
Use the dropdown menus to filter what you see:
- **Date Range:** Show only upcoming, this week, etc.
- **Services:** Show only specific services
- **Census Overlay:** Toggle demographic data on/off

### Statistics Cards
The four boxes at the top show:
- Total number of stops you've done
- Total people you've served
- Total services provided
- Number of different communities reached

---

## ⚠️ Troubleshooting

### "My changes aren't showing on the dashboard"

**Check these things:**

1. **Did you save?** Google Sheets auto-saves, but check for "All changes saved" at the top

2. **Wait 1-2 minutes** - The dashboard checks for updates every few minutes

3. **Refresh the page** - Click the refresh button in your browser

4. **Check your spelling** - Column names must match exactly (Date, Time, Location, etc.)

5. **Check the format** - Dates should be YYYY-MM-DD (like 2025-11-15)

### "The dashboard shows an error"

1. Make sure your Google Sheet is set to "Anyone with link can view"
   - File → Share → Change to "Anyone with link"

2. Check that the Sheet ID in `config.js` matches your Google Sheet URL

3. Contact your technical team if the error persists

### "The map isn't showing markers"

Check that you have:
- Latitude and Longitude filled in for each stop
- Numbers in the correct format (like 44.2098 and -69.0648)
- No text in the coordinate columns

---

## 📞 Getting Help

### For Data/Content Questions:
- Email: [your-email@knoxcounty.org]
- Phone: [your-phone]

### For Technical Issues:
- Create a GitHub Issue: [Link to GitHub Issues]
- Email technical team: [tech-email]

### Helpful Resources:
- **Google Sheets Help:** https://support.google.com/docs
- **Google Maps Coordinates:** https://support.google.com/maps/answer/18539

---

## ✅ Best Practices

### Do's ✓
- ✓ Update the sheet regularly after each van stop
- ✓ Use consistent naming for locations
- ✓ Include detailed notes when helpful
- ✓ Double-check dates and times
- ✓ Back up your sheet occasionally (File → Make a copy)

### Don'ts ✗
- ✗ Don't delete column headers
- ✗ Don't change column names
- ✗ Don't add extra columns without coordinating with tech team
- ✗ Don't enter personal health information (HIPAA!)
- ✗ Don't delete the "Census Tract Data" or "Barriers to Care" tabs

---

## 🔒 Privacy & Security

**Important:** This dashboard is public-facing, so:

- ❌ **Never include** patient names, medical records, or any personal health information
- ❌ **Never include** phone numbers or email addresses of people served
- ✅ **Only include** aggregate numbers (like "25 people served")
- ✅ **Only include** scheduled locations and services offered

---

## 📅 Recommended Schedule

**Weekly:**
- Add upcoming van stops for the next 2 weeks
- Record attendance and services from past week

**Monthly:**
- Review dashboard statistics
- Export monthly report (click "Export Report" button)
- Share with stakeholders

**Quarterly:**
- Review patterns in high-need areas
- Adjust schedule based on demand

---

## 🎯 Dashboard Features

### Current Features
- ✅ Interactive map with van locations
- ✅ Upcoming schedule display
- ✅ Service statistics tracking
- ✅ Census tract demographic overlay
- ✅ Export data reports
- ✅ Automatic data refresh

### Coming Soon
- 🔜 Mobile app version
- 🔜 SMS notifications for community members
- 🔜 Multi-language support
- 🔜 Predictive analytics for optimal routing

---

**Remember: You're doing great! This tool is here to make your work easier. If you have questions, don't hesitate to reach out for help.** 🚐💙
