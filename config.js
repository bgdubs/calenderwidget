// ========================================
// BOOKING WIDGET CONFIGURATION
// ========================================

const BOOKING_CONFIG = {

    // ====================
    // BUSINESS HOURS
    // ====================
    // Define when you're available for bookings
    businessHours: {
        // Which days of the week are you available? (0 = Sunday, 1 = Monday, etc.)
        availableDays: [1, 2, 3, 4, 5], // Monday to Friday

        // What times are you available each day?
        // Format: 'HH:MM' in 24-hour format
        startTime: '09:00',
        endTime: '17:00',

        // How long is each appointment slot? (in minutes)
        slotDuration: 60,

        // How much break time between appointments? (in minutes)
        breakBetweenSlots: 0
    },

    // ====================
    // CUSTOM SCHEDULE
    // ====================
    // Override specific dates or days with custom hours
    // Leave empty array if not needed
    customSchedule: [
        // Example: Different hours on Wednesdays
        // {
        //     dayOfWeek: 3, // Wednesday
        //     startTime: '10:00',
        //     endTime: '15:00'
        // },

        // Example: Special hours for a specific date
        // {
        //     date: '2026-01-25',
        //     startTime: '08:00',
        //     endTime: '12:00'
        // }
    ],

    // ====================
    // BLOCKED DATES
    // ====================
    // Dates when you're NOT available
    blockedDates: [
        // Add dates in 'YYYY-MM-DD' format
        // '2026-01-20',
        // '2026-02-14',
    ],

    // ====================
    // BOOKING LIMITS
    // ====================
    // How far in advance can people book?
    maxAdvanceBookingDays: 60, // 2 months

    // Minimum notice required for booking (in hours)
    minNoticeHours: 24,

    // ====================
    // GOOGLE CALENDAR INTEGRATION
    // ====================
    googleCalendar: {
        // Enable Google Calendar sync?
        enabled: false,

        // Your Google Calendar API Key
        // Get it from: https://console.cloud.google.com/apis/credentials
        apiKey: '',

        // Your Google Calendar ID (usually your email)
        calendarId: '',

        // Check for conflicts with existing events?
        checkConflicts: true
    },

    // ====================
    // EMAIL NOTIFICATIONS
    // ====================
    // Where should booking notifications be sent?
    notifications: {
        // Your email address
        recipientEmail: 'zn@zachnolin.com',

        // Email service (options: 'formspree', 'emailjs', 'custom')
        provider: 'formspree',

        // Provider-specific settings
        formspree: {
            // Get your form ID from: https://formspree.io/ (Free tier available)
            formId: 'https://formspree.io/f/xbddorwr'
        },

        emailjs: {
            // Get credentials from: https://www.emailjs.com/ (Free tier available)
            serviceId: '',
            templateId: '',
            publicKey: ''
        }
    },

    // ====================
    // TIMEZONE
    // ====================
    // Your timezone (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo')
    // Full list: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    timezone: 'America/New_York',

    // ====================
    // UI CUSTOMIZATION
    // ====================
    ui: {
        // Widget title
        title: 'Book an Appointment',

        // Show phone field in booking form?
        requirePhone: false,

        // Confirmation message
        confirmationMessage: "You'll receive a confirmation email shortly.",

        // Date format for display (e.g., 'January 15, 2026')
        dateFormat: 'long' // options: 'long', 'short', 'numeric'
    }
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BOOKING_CONFIG;
}
