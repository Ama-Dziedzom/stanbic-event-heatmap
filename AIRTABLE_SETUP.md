# Airtable Integration Setup Guide

This guide will help you set up Airtable as a CMS for managing events in your Stanbic Event Heatmap application.

## Table of Contents
1. [Create Airtable Account & Base](#1-create-airtable-account--base)
2. [Set Up Your Events Table](#2-set-up-your-events-table)
3. [Get Your API Credentials](#3-get-your-api-credentials)
4. [Configure Your Application](#4-configure-your-application)
5. [Add Your First Event](#5-add-your-first-event)
6. [Testing](#6-testing)

---

## 1. Create Airtable Account & Base

### Sign Up for Airtable
1. Go to [airtable.com](https://airtable.com)
2. Sign up for a free account
3. Verify your email

### Create a New Base
1. Click **"Add a base"** from your home workspace
2. Select **"Start from scratch"**
3. Name it: **"Stanbic Events Database"**

---

## 2. Set Up Your Events Table

### Create the Table Structure

Once your base is created, rename the default table to **"Events"** and add these fields:

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| **Event Name** | Single line text | *Required* - The name of the event |
| **Event Date** | Date | Include time if needed |
| **Event Time** | Single line text | e.g., "7:00 PM - 11:00 PM" |
| **Latitude** | Number | Decimal format, precision: 6 - *Optional if Location Name is provided* |
| **Longitude** | Number | Decimal format, precision: 6 - *Optional if Location Name is provided* |
| **Location Name** | Single line text | e.g., "Labadi Beach Hotel, Accra" - **System will auto-geocode this!** |
| **Category** | Single select | Options: "Stanbic Event", "General Event" |
| **Description** | Long text | Full event details |
| **Intensity** | Number | Range: 0.1 to 1.0 (for heatmap weight) |
| **Ticket Price** | Currency | Use GHS (Ghanaian Cedi) |
| **Status** | Single select | Options: "Published", "Draft", "Past" |
| **Event Images** | Attachment | Upload 1-3 event photos |
| **Expectations** | Long text | Comma-separated list, e.g., "Live music, Food, Networking" |
| **Created By** | Single line text | Optional: Track who added the event |

### 🎯 **Auto-Geocoding Feature**

**Good news!** You don't need to manually look up latitude and longitude coordinates. If you provide a **Location Name**, the system will automatically convert it to coordinates using Mapbox Geocoding.

**How it works:**
- Fill in "Location Name" (e.g., "Movenpick Hotel, Accra")
- Leave "Latitude" and "Longitude" empty
- The system automatically geocodes when the map loads
- Works for any location in Ghana!

### Field Setup Instructions

#### Category Field (Single Select):
1. Click on field type → Choose "Single select"
2. Add these options:
   - `Stanbic Event` (for blue blobs on map)
   - `General Event` (for warm heatmap)

#### Status Field (Single Select):
1. Click on field type → Choose "Single select"
2. Add these options:
   - `Published` (only these appear on map)
   - `Draft` (work in progress)
   - `Past` (archived events)

#### Latitude & Longitude:
- Use [LatLong.net](https://www.latlong.net/) to find coordinates for locations
- For Accra, Ghana coordinates are approximately:
  - Latitude: 5.6037
  - Longitude: -0.1870

---

## 3. Get Your API Credentials

### Get Your API Key

1. Click on your **profile icon** (top right)
2. Go to **"Developer hub"**
3. Click **"Create token"** (or **"Personal access tokens"**)
4. Name it: `Stanbic Events Access`
5. Under **Scopes**, select:
   - ✅ `data.records:read`
   - ✅ `data.records:write` (if you want to add events via the app later)
   - ✅ `schema.bases:read`
6. Under **Access**, select your **"Stanbic Events Database"** base
7. Click **"Create token"**
8. **IMPORTANT**: Copy the token immediately - you won't see it again!
   - It looks like: `pat################.################`

### Get Your Base ID

1. Go to [airtable.com/api](https://airtable.com/api)
2. Click on your **"Stanbic Events Database"**
3. In the URL or documentation, you'll see your Base ID
   - It looks like: `appXXXXXXXXXX`
   - Or find it in your base URL: `https://airtable.com/appXXXXXXXXXX/...`

---

## 4. Configure Your Application

### Create Environment File

1. In your project root (`stanbic-heatmap-next/`), create a file named `.env.local`
2. Add your credentials (replace with your actual values):

```bash
# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# Airtable Configuration
AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXX
AIRTABLE_TABLE_NAME=Events
```

### Important Notes
- ⚠️ **Never commit `.env.local` to Git** (it's already in `.gitignore`)
- ⚠️ Keep your API key secret
- ✅ A template file `env.example` is provided for reference

### Restart Your Development Server

After creating `.env.local`, restart your dev server:

```bash
# Press Ctrl+C to stop the current server
# Then restart:
npm run dev
```

---

## 5. Add Your First Event

### Example: Adding a Stanbic Jazz Night

1. In Airtable, click **"+"** to add a new record
2. Fill in the details:

   ```
   Event Name: Stanbic Jazz Night
   Event Date: 2025-12-25
   Event Time: 8:00 PM - 11:00 PM
   Latitude: 5.5500
   Longitude: -0.2167
   Location Name: National Theatre, Accra
   Category: Stanbic Event
   Description: An evening of smooth jazz featuring top Ghanaian artists. Enjoy premium drinks, networking, and live music under the stars.
   Intensity: 0.9
   Ticket Price: 150
   Status: Published
   Event Images: [Upload a promotional image]
   Expectations: Live jazz, Premium drinks, Networking, VIP lounge
   Created By: Marketing Team
   ```

3. Click outside the record to save

### Finding Coordinates for Accra Venues

**Popular Accra Event Locations:**

| Venue | Latitude | Longitude |
|-------|----------|-----------|
| National Theatre | 5.5500 | -0.2167 |
| Labadi Beach Hotel | 5.6191 | -0.1384 |
| Movenpick Ambassador Hotel | 5.6037 | -0.1870 |
| Kempinski Hotel Gold Coast | 5.6100 | -0.1850 |
| Alliance Française | 5.5633 | -0.1967 |
| Accra International Conference Centre | 5.5600 | -0.1700 |

---

## 6. Testing

### Verify Your Setup

1. **Check the Browser Console**
   - Open your app in browser
   - Press `F12` to open Developer Tools
   - Go to "Console" tab
   - Look for any errors related to Airtable

2. **Expected Behavior**
   - **If configured correctly**: Events from Airtable appear on map
   - **If not configured**: Mock data appears with a console warning

3. **Success Indicators**
   - ✅ Blue blobs appear for "Stanbic Event" category events
   - ✅ Warm heatmap appears for "General Event" category events
   - ✅ Only "Published" status events are visible
   - ✅ Event details show in popup/bottom sheet

### Troubleshooting

#### No Events Appearing
- ✅ Check that events have `Status = "Published"`
- ✅ Verify `.env.local` has correct credentials
- ✅ Restart dev server after adding `.env.local`
- ✅ Check browser console for error messages

#### "Airtable not configured" Warning
- ❌ Missing `.env.local` file
- ❌ Wrong API key or Base ID
- ❌ API token doesn't have correct scopes

#### Events in Wrong Category
- ✅ Check `Category` field is exactly: `"Stanbic Event"` or `"General Event"`
- ✅ Field is case-sensitive

---

## Managing Events

### Daily Workflow

1. **Add Event**: Click "+" in Airtable, fill details, set Status to "Published"
2. **Edit Event**: Click any cell to edit, changes reflect on map within seconds
3. **Remove Event**: Change Status to "Past" or delete the record
4. **Preview Event**: Set Status to "Draft" to work on it without publishing

### Best Practices

✅ **Always set Status** - Only "Published" events appear on map
✅ **Use descriptive names** - Users see this in the popup
✅ **Add high-quality images** - First impression matters
✅ **Set appropriate intensity** - Higher intensity = more prominent on heatmap
✅ **Accurate coordinates** - Double-check location on map
✅ **Keep descriptions concise** - Mobile users see truncated text

### Data Entry Tips

- **Intensity Guide:**
  - `0.3-0.5` = Small local event
  - `0.6-0.7` = Medium event
  - `0.8-0.9` = Major event
  - `1.0` = Flagship Stanbic event

- **Category Usage:**
  - **"Stanbic Event"** = Sponsored/flagship events (max 5-10)
  - **"General Event"** = Community/partner events (unlimited)

---

## Advanced Features

### Views in Airtable

Create custom views for easier management:

1. **Upcoming Events View**
   - Filter: `Status = "Published"` AND `Event Date > Today`
   - Sort: Event Date (ascending)

2. **Stanbic Events Only**
   - Filter: `Category = "Stanbic Event"`

3. **Draft Events**
   - Filter: `Status = "Draft"`

### Calendar View

1. Click **"Grid view"** dropdown → **"Calendar"**
2. Group by: Event Date
3. Visualize event schedule

### Forms for Event Submission

Allow partners/venues to submit events:

1. Click **"Create form"**
2. Include fields: Event Name, Date, Location, Description, Images
3. Share form URL with partners
4. You review & publish from Airtable

---

## Cost & Limits

### Free Tier (Perfect for This Use Case)
- ✅ 1,200 records per base
- ✅ 2GB attachments per base
- ✅ Unlimited bases
- ✅ 5 API requests/second
- ✅ Unlimited users (viewer access)

### If You Need More
- **Plus Plan**: $10/month - 5,000 records, 5GB attachments
- **Pro Plan**: $20/month - 50,000 records, automations

For a typical event calendar, **free tier is sufficient**.

---

## Security Notes

🔒 **API Key Security**
- Never share your API key
- Never commit `.env.local` to Git
- Regenerate key if compromised
- Use read-only tokens when possible

🔒 **Base Permissions**
- Limit who can edit the base
- Use "Viewer" role for non-editors
- Creator/Owner roles for marketing team

---

## Support

If you encounter issues:

1. **Check this guide** for common solutions
2. **View browser console** for error messages
3. **Airtable Support**: [support.airtable.com](https://support.airtable.com)
4. **API Documentation**: [airtable.com/developers/web/api/introduction](https://airtable.com/developers/web/api/introduction)

---

## Next Steps

Once setup is complete, your marketing team can:
- ✅ Add/remove events without developer help
- ✅ Update event details in real-time
- ✅ Upload event images directly
- ✅ Control event visibility with Status field
- ✅ Categorize events for proper map display

**The map will automatically update as data changes in Airtable!** 🎉
