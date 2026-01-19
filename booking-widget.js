// ========================================
// BOOKING WIDGET - Main JavaScript
// ========================================

class BookingWidget {
    constructor(config) {
        this.config = config;
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.bookedSlots = new Map(); // Store booked slots
        this.googleCalendarEvents = [];

        this.init();
    }

    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.renderCalendar();

        // Load Google Calendar events if enabled
        if (this.config.googleCalendar.enabled) {
            this.loadGoogleCalendarEvents();
        }
    }

    cacheElements() {
        this.elements = {
            prevMonth: document.getElementById('prevMonth'),
            nextMonth: document.getElementById('nextMonth'),
            currentMonth: document.getElementById('currentMonth'),
            calendarDays: document.getElementById('calendarDays'),
            timeSlotsContainer: document.getElementById('timeSlotsContainer'),
            timeSlots: document.getElementById('timeSlots'),
            selectedDate: document.getElementById('selectedDate'),
            widgetPanels: document.getElementById('widgetPanels'),
            bookingForm: document.getElementById('bookingForm'),
            appointmentForm: document.getElementById('appointmentForm'),
            cancelBooking: document.getElementById('cancelBooking'),
            successMessage: document.getElementById('successMessage'),
            newBooking: document.getElementById('newBooking'),
            summaryDate: document.getElementById('summaryDate'),
            summaryTime: document.getElementById('summaryTime')
        };
    }

    attachEventListeners() {
        this.elements.prevMonth.addEventListener('click', () => this.changeMonth(-1));
        this.elements.nextMonth.addEventListener('click', () => this.changeMonth(1));
        this.elements.cancelBooking.addEventListener('click', () => this.resetBooking());
        this.elements.newBooking.addEventListener('click', () => this.resetBooking());
        this.elements.appointmentForm.addEventListener('submit', (e) => this.handleBookingSubmit(e));
    }

    // ========================================
    // CALENDAR RENDERING
    // ========================================

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Update month display
        this.elements.currentMonth.textContent = new Date(year, month).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

        // Clear previous days
        this.elements.calendarDays.innerHTML = '';

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Previous month's days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayElement = this.createDayElement(day, 'other-month');
            this.elements.calendarDays.appendChild(dayElement);
        }

        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = new Date(year, month, day);
            currentDay.setHours(0, 0, 0, 0);

            let className = '';

            // Check if day is in the past
            if (currentDay < today) {
                className = 'past';
            }
            // Check if day is today
            else if (currentDay.getTime() === today.getTime()) {
                className = 'today';
                if (this.isDayAvailable(currentDay)) {
                    className += ' available';
                } else {
                    className += ' unavailable';
                }
            }
            // Check if day is available
            else if (this.isDayAvailable(currentDay)) {
                className = 'available';
            } else {
                className = 'unavailable';
            }

            const dayElement = this.createDayElement(day, className, currentDay);
            this.elements.calendarDays.appendChild(dayElement);
        }

        // Next month's days to fill grid
        const totalCells = this.elements.calendarDays.children.length;
        const remainingCells = 42 - totalCells; // 6 rows × 7 days

        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(day, 'other-month');
            this.elements.calendarDays.appendChild(dayElement);
        }
    }

    createDayElement(day, className, date = null) {
        const dayElement = document.createElement('div');
        dayElement.className = `day ${className}`;
        dayElement.textContent = day;

        if (date && className.includes('available')) {
            dayElement.addEventListener('click', () => this.selectDate(date));
        }

        return dayElement;
    }

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    // ========================================
    // DATE AVAILABILITY LOGIC
    // ========================================

    isDayAvailable(date) {
        const dayOfWeek = date.getDay();
        const dateString = this.formatDate(date);

        // Check if date is blocked
        if (this.config.blockedDates.includes(dateString)) {
            return false;
        }

        // Check if beyond max advance booking
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + this.config.maxAdvanceBookingDays);

        if (date > maxDate) {
            return false;
        }

        // Check minimum notice
        const minNoticeDate = new Date();
        minNoticeDate.setHours(minNoticeDate.getHours() + this.config.minNoticeHours);

        if (date < minNoticeDate) {
            return false;
        }

        // Check if day of week is available
        const hasCustomSchedule = this.config.customSchedule.find(cs =>
            cs.date === dateString || cs.dayOfWeek === dayOfWeek
        );

        if (hasCustomSchedule) {
            return true; // Has custom schedule, assume available
        }

        return this.config.businessHours.availableDays.includes(dayOfWeek);
    }

    // ========================================
    // TIME SLOTS
    // ========================================

    selectDate(date) {
        this.selectedDate = date;

        // Update selected day styling
        document.querySelectorAll('.day').forEach(day => {
            day.classList.remove('selected');
        });
        event.target.classList.add('selected');

        // Format and display selected date
        const formattedDate = this.formatDateForDisplay(date);
        this.elements.selectedDate.textContent = formattedDate;

        // Generate and show time slots
        this.renderTimeSlots();
        this.elements.timeSlotsContainer.style.display = 'block';

        // Scroll to time slots
        this.elements.timeSlotsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    renderTimeSlots() {
        this.elements.timeSlots.innerHTML = '';

        const slots = this.generateTimeSlots(this.selectedDate);

        if (slots.length === 0) {
            this.elements.timeSlots.innerHTML = '<p style="color: #999; grid-column: 1/-1; text-align: center;">No available time slots for this date.</p>';
            return;
        }

        slots.forEach(slot => {
            const slotElement = document.createElement('div');
            slotElement.className = 'time-slot';
            slotElement.textContent = slot.display;

            // Check if slot is already booked
            const slotKey = `${this.formatDate(this.selectedDate)}_${slot.time}`;
            if (this.bookedSlots.has(slotKey) || this.isSlotConflicting(this.selectedDate, slot.time)) {
                slotElement.classList.add('booked');
            } else {
                slotElement.addEventListener('click', () => this.selectTimeSlot(slot.time, slotElement));
            }

            this.elements.timeSlots.appendChild(slotElement);
        });
    }

    generateTimeSlots(date) {
        const dayOfWeek = date.getDay();
        const dateString = this.formatDate(date);

        // Check for custom schedule
        let schedule = this.config.businessHours;
        const customSchedule = this.config.customSchedule.find(cs =>
            cs.date === dateString || cs.dayOfWeek === dayOfWeek
        );

        if (customSchedule) {
            schedule = {
                startTime: customSchedule.startTime,
                endTime: customSchedule.endTime,
                slotDuration: this.config.businessHours.slotDuration,
                breakBetweenSlots: this.config.businessHours.breakBetweenSlots
            };
        }

        const slots = [];
        const [startHour, startMin] = schedule.startTime.split(':').map(Number);
        const [endHour, endMin] = schedule.endTime.split(':').map(Number);

        let currentTime = new Date(date);
        currentTime.setHours(startHour, startMin, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(endHour, endMin, 0, 0);

        // Check minimum notice for today
        const now = new Date();
        const minNoticeTime = new Date(now.getTime() + this.config.minNoticeHours * 60 * 60 * 1000);

        while (currentTime < endTime) {
            // Skip if slot is too soon (minimum notice)
            if (currentTime > minNoticeTime) {
                const timeString = this.formatTime(currentTime);
                const displayTime = this.formatTimeForDisplay(currentTime);

                slots.push({
                    time: timeString,
                    display: displayTime
                });
            }

            // Add slot duration + break time
            currentTime.setMinutes(
                currentTime.getMinutes() +
                schedule.slotDuration +
                schedule.breakBetweenSlots
            );
        }

        return slots;
    }

    selectTimeSlot(time, element) {
        // Remove previous selection
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Mark as selected
        element.classList.add('selected');
        this.selectedTime = time;

        // Show booking form
        this.showBookingForm();
    }

    isSlotConflicting(date, time) {
        if (!this.config.googleCalendar.enabled || !this.config.googleCalendar.checkConflicts) {
            return false;
        }

        const [hours, minutes] = time.split(':').map(Number);
        const slotStart = new Date(date);
        slotStart.setHours(hours, minutes, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + this.config.businessHours.slotDuration);

        // Check against Google Calendar events
        return this.googleCalendarEvents.some(event => {
            const eventStart = new Date(event.start.dateTime || event.start.date);
            const eventEnd = new Date(event.end.dateTime || event.end.date);

            return (slotStart < eventEnd && slotEnd > eventStart);
        });
    }

    // ========================================
    // BOOKING FORM
    // ========================================

    showBookingForm() {
        const formattedDate = this.formatDateForDisplay(this.selectedDate);
        const formattedTime = this.selectedTime;

        this.elements.summaryDate.textContent = formattedDate;
        this.elements.summaryTime.textContent = formattedTime;

        // Trigger slide animation
        this.elements.widgetPanels.classList.add('show-form');
    }

    async handleBookingSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const bookingData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            notes: formData.get('notes'),
            date: this.formatDateForDisplay(this.selectedDate),
            time: this.selectedTime,
            dateISO: this.formatDate(this.selectedDate)
        };

        // Add loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Booking...';
        submitBtn.disabled = true;

        try {
            // Send notification email
            await this.sendNotification(bookingData);

            // Mark slot as booked locally
            const slotKey = `${bookingData.dateISO}_${bookingData.time}`;
            this.bookedSlots.set(slotKey, bookingData);

            // Show success message
            this.showSuccessMessage();

        } catch (error) {
            console.error('Booking error:', error);
            alert('There was an error processing your booking. Please try again or contact us directly.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async sendNotification(bookingData) {
        const provider = this.config.notifications.provider;

        if (provider === 'formspree') {
            return this.sendFormspree(bookingData);
        } else if (provider === 'emailjs') {
            return this.sendEmailJS(bookingData);
        }

        // If no provider configured, just simulate success
        return Promise.resolve();
    }

    async sendFormspree(bookingData) {
        const formId = this.config.notifications.formspree.formId;

        if (!formId) {
            console.warn('Formspree form ID not configured');
            return;
        }

        const response = await fetch(`https://formspree.io/f/${formId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject: `New Booking: ${bookingData.date} at ${bookingData.time}`,
                message: `
New appointment booking:

Name: ${bookingData.name}
Email: ${bookingData.email}
Phone: ${bookingData.phone || 'Not provided'}
Date: ${bookingData.date}
Time: ${bookingData.time}
Notes: ${bookingData.notes || 'None'}
                `.trim(),
                ...bookingData
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send notification');
        }
    }

    async sendEmailJS(bookingData) {
        const config = this.config.notifications.emailjs;

        if (!config.serviceId || !config.templateId || !config.publicKey) {
            console.warn('EmailJS not fully configured');
            return;
        }

        // Load EmailJS library if not already loaded
        if (typeof emailjs === 'undefined') {
            await this.loadScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js');
            emailjs.init(config.publicKey);
        }

        await emailjs.send(config.serviceId, config.templateId, {
            to_email: this.config.notifications.recipientEmail,
            from_name: bookingData.name,
            from_email: bookingData.email,
            phone: bookingData.phone,
            appointment_date: bookingData.date,
            appointment_time: bookingData.time,
            notes: bookingData.notes
        });
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    showSuccessMessage() {
        this.elements.bookingForm.style.display = 'none';
        this.elements.successMessage.style.display = 'block';
    }

    resetBooking() {
        this.selectedDate = null;
        this.selectedTime = null;

        // Slide back to calendar view
        this.elements.widgetPanels.classList.remove('show-form');

        this.elements.timeSlotsContainer.style.display = 'none';
        this.elements.successMessage.style.display = 'none';
        this.elements.appointmentForm.reset();

        this.renderCalendar();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ========================================
    // GOOGLE CALENDAR INTEGRATION
    // ========================================

    async loadGoogleCalendarEvents() {
        if (!this.config.googleCalendar.apiKey || !this.config.googleCalendar.calendarId) {
            console.warn('Google Calendar not fully configured');
            return;
        }

        try {
            // Load Google API client library
            if (typeof gapi === 'undefined') {
                await this.loadScript('https://apis.google.com/js/api.js');
                await new Promise(resolve => gapi.load('client', resolve));
            }

            await gapi.client.init({
                apiKey: this.config.googleCalendar.apiKey,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
            });

            // Fetch events for the next few months
            const timeMin = new Date().toISOString();
            const timeMax = new Date();
            timeMax.setDate(timeMax.getDate() + this.config.maxAdvanceBookingDays);

            const response = await gapi.client.calendar.events.list({
                calendarId: this.config.googleCalendar.calendarId,
                timeMin: timeMin,
                timeMax: timeMax.toISOString(),
                singleEvents: true,
                orderBy: 'startTime'
            });

            this.googleCalendarEvents = response.result.items || [];

            // Re-render calendar with updated availability
            this.renderCalendar();

        } catch (error) {
            console.error('Error loading Google Calendar events:', error);
        }
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatDateForDisplay(date) {
        const options = this.config.ui.dateFormat === 'long'
            ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
            : this.config.ui.dateFormat === 'short'
            ? { month: 'short', day: 'numeric', year: 'numeric' }
            : { month: '2-digit', day: '2-digit', year: 'numeric' };

        return date.toLocaleDateString('en-US', options);
    }

    formatTime(date) {
        return date.toTimeString().slice(0, 5); // HH:MM
    }

    formatTimeForDisplay(date) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
}

// ========================================
// INITIALIZE WIDGET
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const widget = new BookingWidget(BOOKING_CONFIG);
});
