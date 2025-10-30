# 🚀 QUICK START GUIDE
## Knox Wellness Van Dashboard

**Welcome!** This guide will get your dashboard up and running in 30 minutes.

---

## ✅ What You'll Need

- [ ] GitHub account (free) - [Sign up here](https://github.com/join)
- [ ] Google account (free) - [Sign up here](https://accounts.google.com/signup)
- [ ] Your existing data files (you already have these!)
- [ ] 30 minutes of time

---

## 📦 What's Included

Your dashboard package includes:

```
knox-wellness-dashboard/
├── index.html                  ← Main dashboard
├── public/
│   ├── community.html          ← Public-facing page
│   ├── partners.html           ← Analytics for partners
│   └── assets/
│       ├── css/styles.css      ← Styling
│       └── js/                 ← JavaScript files
├── config/
│   └── config.js               ← Settings (you'll edit this!)
├── docs/
│   ├── CLIENT_GUIDE.md         ← For your team
│   └── DEPLOYMENT_GUIDE.md     ← Technical setup
├── data/
│   └── sample-data.json        ← Sample data
└── README.md                   ← Full documentation
```

---

## 🎯 5-Step Setup

### Step 1: Create Your Google Sheet (10 min)

1. **Go to [sheets.google.com](https://sheets.google.com)**

2. **Click "Blank" to create a new sheet**

3. **Create 4 tabs** by clicking the + button at the bottom:
   - Tab 1: "Van Schedule"
   - Tab 2: "Service Tracking"  
   - Tab 3: "Census Tract Data"
   - Tab 4: "Barriers to Care"

4. **In "Van Schedule" tab, add these column headers in row 1:**
   ```
   Date | Time | Location | Address | Services | Zip Code | Latitude | Longitude | Notes
   ```

5. **Add sample data in row 2:**
   ```
   2025-11-15 | 10:00 AM | Camden Library | 55 Main St | Health Screening, Dental | 04843 | 44.2098 | -69.0648 | Free services
   ```

6. **In "Service Tracking" tab, add these column headers:**
   ```
   Date | Location | Attendees | Services Provided | Notes
   ```

7. **Copy your existing data:**
   - Copy data from `Data_by_Census_Tract__1_.xlsx` to "Census Tract Data" tab
   - Copy data from `Barriers_To_Care_Cleaned__4___3___2___1_.xlsx` to "Barriers to Care" tab

8. **Make it public:**
   - Click **Share** button (top right)
   - Change to "**Anyone with the link can view**"
   - Click **Copy link**
   - Save this link! You'll need the ID from it

9. **Get your Sheet ID:**
   - Your URL looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Actual: `https://docs.google.com/spreadsheets/d/1wT9gWw_erFcYceaoLfY7oK6WJSrKqLIV40WX31EVUp8/edit`
   - Copy the part between `/d/` and `/edit` - that's your Sheet ID
   - Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
   - Actual: `1wT9gWw_erFcYceaoLfY7oK6WJSrKqLIV40WX31EVUp8`

---

### Step 2: Create GitHub Repository (5 min)

1. **Go to [github.com](https://github.com)** and sign in

2. **Click the "+" icon** → **New repository**

3. **Fill in:**
   - Repository name: `knox-wellness-dashboard`
   - Description: "Mobile Wellness Van Dashboard for Knox County"
   - Make it **Public** ✅
   - Check **"Add a README file"** ✅

4. **Click "Create repository"**

---

### Step 3: Upload Dashboard Files (5 min)

1. **In your new repository, click "Add file" → "Upload files"**

2. **Drag and drop ALL the files from the `knox-wellness-dashboard` folder**
   - Or click "choose your files" and select all

3. **Click "Commit changes"** at the bottom

4. **Wait for upload to complete** (green checkmark)

---

### Step 4: Configure Your Dashboard (5 min)

1. **In your repository, find and click: `config/config.js`**

2. **Click the pencil icon** (✏️) to edit

3. **Find this line:**
   ```javascript
   GOOGLE_SHEET_ID: 'YOUR_SHEET_ID_HERE',
   ```

4. **Replace `YOUR_SHEET_ID_HERE` with your actual Sheet ID**
   ```javascript
   GOOGLE_SHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
   ```

5. **Optionally update contact info:**
   ```javascript
   CONTACT: {
     phone: '(207) 555-1234',
     email: 'wellness@knoxcounty.org',
     website: 'https://knoxcounty.org/wellness'
   },
   ```

6. **Click "Commit changes"** → **"Commit changes"** again

---

### Step 5: Enable GitHub Pages (5 min)

1. **Go to your repository Settings** (gear icon at top)

2. **Click "Pages"** in the left sidebar

3. **Under "Source":**
   - Branch: Select **`main`**
   - Folder: Keep as **`/ (root)`**

4. **Click "Save"**

5. **Wait 2-3 minutes** for deployment

6. **Your dashboard is now live at:**
   ```
   https://YOUR-GITHUB-USERNAME.github.io/knox-wellness-dashboard/
   ```

---

## 🎉 Success! You're Done!

Visit your dashboard:
```
https://YOUR-GITHUB-USERNAME.github.io/knox-wellness-dashboard/
```

You should see:
- ✅ Map with your location marker
- ✅ Schedule showing your sample entry
- ✅ Statistics cards with numbers
- ✅ Working filters and controls

---

## 🔄 How to Update Data (Daily Use)

**This is what makes it magical - your team can update the dashboard by just editing the Google Sheet!**

### To Add a New Van Stop:

1. Open your Google Sheet (bookmark it!)
2. Go to "Van Schedule" tab
3. Add a new row with all the info
4. Save (Google Sheets auto-saves)
5. Wait 1-2 minutes
6. Refresh your dashboard - new stop appears! 🎉

### To Record Services Provided:

1. Open your Google Sheet
2. Go to "Service Tracking" tab
3. Add a new row for today's stop
4. Save
5. Dashboard statistics update automatically!

**That's it! No coding, no technical work - just update the Google Sheet!**

---

## 📱 Share Your Dashboard

### With Community Members:
```
Check out where our wellness van will be: 
https://YOUR-USERNAME.github.io/knox-wellness-dashboard/public/community.html
```

### With Partners/Stakeholders:
```
View our program analytics: 
https://YOUR-USERNAME.github.io/knox-wellness-dashboard/public/partners.html
```

### With Your Team:
Give them:
1. Link to the Google Sheet (for editing)
2. Link to the dashboard (for viewing)
3. The CLIENT_GUIDE.md file (in `/docs` folder)

---

## 🆘 Troubleshooting

### Dashboard shows "Loading..." forever

**Fix:**
1. Make sure Google Sheet is set to "Anyone with link can view"
2. Double-check Sheet ID in `config/config.js` is correct
3. Wait 5 minutes (sometimes takes time to update)
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Map shows but no markers

**Fix:**
1. Check that Latitude and Longitude columns have numbers
2. Make sure coordinates are for your area (Knox County, ME is around lat: 44, lng: -69)
3. Verify you have data in the "Van Schedule" tab

### Changes to Google Sheet not showing

**Fix:**
1. Wait 2-3 minutes (cache refresh time)
2. Click the "🔄 Refresh Data" button on dashboard
3. Hard refresh browser

---

## 📚 Next Steps

1. **Read the CLIENT_GUIDE.md** (`/docs/CLIENT_GUIDE.md`)
   - Full instructions for your team
   - How to manage data
   - Best practices

2. **Check the DEPLOYMENT_GUIDE.md** (`/docs/DEPLOYMENT_GUIDE.md`)
   - Advanced setup options
   - Customization tips
   - Troubleshooting

3. **Customize the look:**
   - Edit `config/config.js` to change colors
   - Update contact information
   - Adjust map center for your area

4. **Add real data:**
   - Remove sample data
   - Add your actual van schedule
   - Import past service tracking data

5. **Train your team:**
   - Share the CLIENT_GUIDE with staff
   - Show them how to update Google Sheet
   - Practice adding/editing stops together

---

## 💡 Pro Tips

- **Bookmark your Google Sheet** for easy access
- **Set up a shared team calendar** that matches van schedule
- **Export reports monthly** using the "Export Report" button
- **Check the dashboard weekly** to ensure it's working
- **Add stops 2-4 weeks in advance** so community can plan

---

## 🤝 Support

**Questions? Issues?**

1. Check the troubleshooting section above
2. Read the full guides in `/docs` folder
3. Create a GitHub Issue in your repository
4. Contact Scout Labs team

---

## 📊 Understanding Your Dashboard Pages

### Main Dashboard (`index.html`)
- Interactive map showing all stops
- Filters by date range and service type
- Statistics summary
- Full schedule list
- Export reports

### Community View (`public/community.html`)
- Simple, public-facing page
- Shows next 5 upcoming stops
- Large, easy-to-read format
- Contact information
- Perfect for sharing with community

### Analytics (`public/partners.html`)
- Detailed statistics for partners
- Service breakdown charts
- Geographic coverage
- Monthly trends
- Exportable reports for grants/presentations

---

## 🎯 Your First Week Checklist

**Day 1:**
- [ ] Complete setup (all 5 steps above)
- [ ] Verify dashboard loads
- [ ] Add 2-3 real upcoming stops

**Day 2:**
- [ ] Train team on Google Sheet editing
- [ ] Have each team member add a test stop
- [ ] Verify everyone can see changes

**Day 3:**
- [ ] Replace all sample data with real data
- [ ] Add complete van schedule for next month
- [ ] Import historical service tracking data

**Day 4:**
- [ ] Share community view link with partners
- [ ] Post to social media
- [ ] Email community organizations

**Day 5:**
- [ ] Export first report
- [ ] Share with stakeholders
- [ ] Gather feedback

---

## 🚀 Ready to Launch?

You now have everything you need! Your dashboard will:

✅ Update automatically when you edit Google Sheets  
✅ Show real-time van locations and schedules  
✅ Track services and attendance  
✅ Provide analytics for partners  
✅ Help communities find wellness services  

**Go make an impact! Your community is waiting.** 💙

---

**Built by Scout Labs for Knox County Creative Tech Initiative**  
*Making health services more accessible through technology*
