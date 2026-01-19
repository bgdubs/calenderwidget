# Simple Booking Widget for Squarespace

A completely free, no-subscription booking calendar widget that you can embed in your Squarespace website. Features a clean, simple interface showing only a calendar with available time slots.

## Features

✅ **100% Free** - No monthly subscriptions or hidden fees
✅ **Simple Calendar View** - Clean interface showing only available slots
✅ **Easy Configuration** - Simple config file for all settings
✅ **Google Calendar Sync** - Optional integration to check availability
✅ **Email Notifications** - Get notified of new bookings via free services
✅ **Mobile Responsive** - Works perfectly on all devices
✅ **No Backend Required** - Runs entirely in the browser

---

## Quick Start

### 1. Download the Files

You'll need these 4 files:
- `booking-widget.html`
- `booking-widget.css`
- `booking-widget.js`
- `config.js`

### 2. Host the Files

You have two options:

#### Option A: GitHub Pages (Recommended - Free)

1. Create a GitHub repository
2. Upload all 4 files to the repository
3. Go to Settings → Pages
4. Enable GitHub Pages from the `main` branch
5. Your files will be available at: `https://yourusername.github.io/repo-name/`

#### Option B: Squarespace File Upload

1. In Squarespace, go to Design → Custom CSS
2. Upload the CSS and JS files as custom files
3. Note the URLs - you'll need them later

### 3. Configure Your Settings

Open `config.js` and customize your availability:

```javascript
businessHours: {
    availableDays: [1, 2, 3, 4, 5], // Monday to Friday
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 60, // 60 minutes per appointment
    breakBetweenSlots: 0
}
```

**Important Settings to Update:**
- `availableDays` - Which days you're available (0=Sunday, 1=Monday, etc.)
- `startTime` / `endTime` - Your working hours
- `slotDuration` - How long each appointment lasts (in minutes)
- `notifications.recipientEmail` - Your email address

### 4. Embed in Squarespace

1. In Squarespace, edit the page where you want the booking widget
2. Add a **Code Block** (from the content blocks menu)
3. Paste this code:

```html
<div id="booking-widget-container"></div>

<!-- Include the widget files -->
<link rel="stylesheet" href="YOUR-CSS-FILE-URL">
<script src="YOUR-CONFIG-FILE-URL"></script>
<script src="YOUR-JS-FILE-URL"></script>
```

4. Replace `YOUR-CSS-FILE-URL`, `YOUR-CONFIG-FILE-URL`, and `YOUR-JS-FILE-URL` with the actual URLs where you hosted the files

**If using GitHub Pages:**
```html
<div id="booking-widget-container"></div>

<link rel="stylesheet" href="https://yourusername.github.io/repo-name/booking-widget.css">
<script src="https://yourusername.github.io/repo-name/config.js"></script>
<script src="https://yourusername.github.io/repo-name/booking-widget.js"></script>
```

---

## Configuration Guide

### Basic Settings

Open `config.js` and configure these essential settings:

#### Available Days and Hours

```javascript
businessHours: {
    availableDays: [1, 2, 3, 4, 5], // Mon-Fri
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 60,
    breakBetweenSlots: 15
}
```

#### Block Specific Dates

```javascript
blockedDates: [
    '2026-01-20',  // Add dates you're unavailable
    '2026-12-25',
]
```

#### Custom Schedule for Specific Days

```javascript
customSchedule: [
    {
        dayOfWeek: 3, // Wednesday
        startTime: '10:00',
        endTime: '15:00'
    },
    {
        date: '2026-02-14', // Specific date
        startTime: '08:00',
        endTime: '12:00'
    }
]
```

---

## Email Notifications (Free Options)

### Option 1: Formspree (Easiest - Recommended)

1. Go to [formspree.io](https://formspree.io)
2. Create a free account (50 submissions/month free)
3. Create a new form and get your Form ID
4. In `config.js`:

```javascript
notifications: {
    recipientEmail: 'your-email@example.com',
    provider: 'formspree',
    formspree: {
        formId: 'YOUR_FORM_ID_HERE'
    }
}
```

### Option 2: EmailJS

1. Go to [emailjs.com](https://www.emailjs.com)
2. Create a free account (200 emails/month free)
3. Set up an email service and template
4. In `config.js`:

```javascript
notifications: {
    recipientEmail: 'your-email@example.com',
    provider: 'emailjs',
    emailjs: {
        serviceId: 'YOUR_SERVICE_ID',
        templateId: 'YOUR_TEMPLATE_ID',
        publicKey: 'YOUR_PUBLIC_KEY'
    }
}
```

---

## Google Calendar Integration (Optional)

Sync with Google Calendar to automatically block times when you're busy.

### Setup Steps:

1. **Create a Google Cloud Project**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project (free)

2. **Enable Calendar API**
   - In your project, go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

3. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

4. **Make Your Calendar Public** (for read-only access)
   - Open Google Calendar
   - Click settings (gear icon) → Settings
   - Select your calendar from the left
   - Under "Access permissions," check "Make available to public"
   - Copy your Calendar ID (usually your email address)

5. **Configure the Widget**

In `config.js`:

```javascript
googleCalendar: {
    enabled: true,
    apiKey: 'YOUR_API_KEY_HERE',
    calendarId: 'your-email@gmail.com',
    checkConflicts: true
}
```

**Security Note:** The API key only allows read access to your public calendar. Keep the key secure and restrict it in Google Cloud Console if possible.

---

## Customization

### Change Colors

Edit `booking-widget.css` and modify these sections:

```css
/* Header background */
.widget-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Primary button color */
.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Available day color */
.day.available {
    background: #f8f9ff;
    color: #667eea;
}
```

### Change Widget Title

In `config.js`:

```javascript
ui: {
    title: 'Book an Appointment',
    requirePhone: false,
    confirmationMessage: "You'll receive a confirmation email shortly."
}
```

### Appointment Duration

In `config.js`:

```javascript
businessHours: {
    slotDuration: 30, // 30-minute appointments
    breakBetweenSlots: 10 // 10-minute break between appointments
}
```

---

## Advanced Features

### Minimum Booking Notice

Prevent last-minute bookings:

```javascript
minNoticeHours: 24, // Require 24 hours notice
```

### Maximum Advance Booking

Limit how far ahead people can book:

```javascript
maxAdvanceBookingDays: 60, // 2 months in advance
```

### Timezone

Set your timezone:

```javascript
timezone: 'America/New_York', // Your timezone
```

[List of valid timezones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

---

## Testing

### Test Locally

1. Open `booking-widget.html` in your browser
2. Configure your settings in `config.js`
3. Test the booking flow

### Test Email Notifications

- Make a test booking
- Check if you receive the notification email
- Verify all booking details are included

---

## Troubleshooting

### Calendar not showing
- Check browser console for errors (F12)
- Verify all file URLs are correct
- Make sure files are hosted and accessible

### Time slots not appearing
- Check `businessHours.availableDays` includes the day you selected
- Verify `startTime` and `endTime` are set correctly
- Check if date is blocked in `blockedDates`

### Email notifications not working
- Verify your Formspree/EmailJS credentials
- Check that `recipientEmail` is set correctly
- Look for errors in browser console (F12)

### Google Calendar sync not working
- Confirm API key is valid
- Check that Calendar API is enabled in Google Cloud Console
- Verify calendar is public and Calendar ID is correct
- Look for errors in browser console (F12)

---

## Standalone vs Embedded

### Standalone Page
- Use `booking-widget.html` directly
- Upload to GitHub Pages or your own hosting
- Share the direct link

### Embedded in Squarespace
- Use a Code Block
- Include CSS and JS files
- Widget integrates seamlessly with your site design

---

## Cost Breakdown

This solution is **100% FREE**:

- **Widget Code**: Free and open source
- **GitHub Pages Hosting**: Free
- **Formspree**: 50 submissions/month free
- **EmailJS**: 200 emails/month free
- **Google Calendar API**: Free (read-only access)

No monthly subscriptions or hidden fees!

---

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

## Security & Privacy

- No backend servers required
- Booking data sent directly to your email
- Google Calendar API uses read-only access
- No sensitive data stored in browser
- All code is open and reviewable

---

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review your configuration in `config.js`
3. Check browser console for error messages (F12)

---

## Example Configurations

### Full-Day Availability (9 AM - 5 PM)
```javascript
businessHours: {
    availableDays: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 60
}
```

### Half-Day (Mornings Only)
```javascript
businessHours: {
    availableDays: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '13:00',
    slotDuration: 30
}
```

### Weekend Availability
```javascript
businessHours: {
    availableDays: [0, 6], // Sunday and Saturday
    startTime: '10:00',
    endTime: '16:00',
    slotDuration: 60
}
```

### Flexible Schedule
```javascript
businessHours: {
    availableDays: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 45
},
customSchedule: [
    {
        dayOfWeek: 3, // Wednesdays: 10 AM - 3 PM
        startTime: '10:00',
        endTime: '15:00'
    },
    {
        dayOfWeek: 5, // Fridays: Mornings only
        startTime: '09:00',
        endTime: '12:00'
    }
]
```

---

## Next Steps

1. ✅ Configure your availability in `config.js`
2. ✅ Set up email notifications (Formspree or EmailJS)
3. ✅ (Optional) Enable Google Calendar sync
4. ✅ Host files on GitHub Pages or Squarespace
5. ✅ Embed in your Squarespace page
6. ✅ Test the booking flow
7. ✅ Share your booking page with clients!

---

## License

This booking widget is free to use for personal and commercial projects. No attribution required, but appreciated!

---

**Enjoy your free booking system! 📅**
