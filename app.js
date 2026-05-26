/**
 * Project ARCH Café - Client Website Logic
 * Handles multi-page safe execution (loader on index, calendar on reserve).
 */

class ArchCafeWebsite {
    constructor() {
        this.selectedDate = null;
        this.selectedTime = "01:00 PM";
        
        this.initDOMElements();
        
        // Execute features conditionally based on element availability
        if (this.preloader) {
            this.initPreloader();
        } else {
            document.body.classList.add('site-entered');
        }
        
        this.initScrollAnimations();
        
        if (this.calendarGrid) {
            this.initCalendar();
            this.initTimeSlots();
        }
        
        this.bindEvents();
        

    }

    initDOMElements() {
        // Safe resolutions
        this.preloader = document.getElementById('preloader');
        this.calendarGrid = document.getElementById('calendarGrid');
        this.timeSlotsGrid = document.getElementById('timeSlotsGrid');
        this.bookingForm = document.getElementById('bookingForm');
        
        // Confirmation Modal Elements
        this.confirmOverlay = document.getElementById('confirmOverlay');
        this.btnCloseConfirm = document.getElementById('btnCloseConfirm');
        this.confirmDate = document.getElementById('confirmDate');
        this.confirmTime = document.getElementById('confirmTime');
        this.confirmGuests = document.getElementById('confirmGuests');
        
        // Form Inputs
        this.guestName = document.getElementById('guestName');
        this.guestPhone = document.getElementById('guestPhone');
        this.guestCount = document.getElementById('guestCount');


    }

    initPreloader() {
        // Hide pre-loader after 2.2 seconds to allow the SVG drawing animation to finish
        setTimeout(() => {
            if (this.preloader) {
                this.preloader.classList.add('loaded');
            }
            document.body.classList.add('site-entered');
        }, 2200);
    }

    initScrollAnimations() {
        // Create intersection observer for fading elements on scroll
        const options = {
            threshold: 0.05,
            rootMargin: "0px 0px -40px 0px"
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        }, options);

        const fadeElements = document.querySelectorAll('.scroll-fade');
        fadeElements.forEach(el => observer.observe(el));
    }

    initCalendar() {
        // Generate calendar slots for the next 7 days starting today
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const today = new Date();
        this.calendarGrid.innerHTML = ''; // Clear

        // 1. Add headers
        for (let i = 0; i < 7; i++) {
            const tempDate = new Date();
            tempDate.setDate(today.getDate() + i);
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = daysOfWeek[tempDate.getDay()];
            this.calendarGrid.appendChild(dayHeader);
        }

        // 2. Add clickable days
        for (let i = 0; i < 7; i++) {
            const tempDate = new Date();
            tempDate.setDate(today.getDate() + i);
            
            const dayButton = document.createElement('div');
            dayButton.className = 'calendar-day';
            if (i === 0) {
                dayButton.classList.add('selected');
                this.selectedDate = this.formatDateString(tempDate);
            }
            
            dayButton.dataset.date = this.formatDateString(tempDate);
            
            dayButton.innerHTML = `
                <span class="day-num">${tempDate.getDate()}</span>
                <span class="day-month">${months[tempDate.getMonth()]}</span>
            `;

            dayButton.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                document.querySelectorAll('.calendar-day').forEach(btn => btn.classList.remove('selected'));
                targetBtn.classList.add('selected');
                this.selectedDate = targetBtn.dataset.date;
            });

            this.calendarGrid.appendChild(dayButton);
        }
    }

    formatDateString(dateObj) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    }

    initTimeSlots() {
        if (!this.timeSlotsGrid) return;
        // Interactive slot selection
        this.timeSlotsGrid.addEventListener('click', (e) => {
            const slot = e.target.closest('.time-slot');
            if (!slot) return;

            document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
            slot.classList.add('selected');
            this.selectedTime = slot.dataset.time;
        });
    }

    bindEvents() {
        // Form Submission (if booking form exists)
        if (this.bookingForm) {
            this.bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showConfirmationOverlay();
            });
        }

        // Close Confirmation modal (if overlay close button exists)
        if (this.btnCloseConfirm) {
            this.btnCloseConfirm.addEventListener('click', () => {
                this.confirmOverlay.classList.remove('active');
                if (this.bookingForm) {
                    this.bookingForm.reset();
                }
                if (this.calendarGrid) {
                    this.initCalendar(); // Reset calendar selection
                }
            });
        }
    }

    showConfirmationOverlay() {
        if (!this.confirmOverlay) return;
        
        // Populate modal data
        this.confirmDate.textContent = this.selectedDate;
        this.confirmTime.textContent = this.selectedTime;
        
        const count = this.guestCount.value;
        this.confirmGuests.textContent = `${count} ${count === "1" ? 'Guest' : 'Guests'}`;

        // Show Modal
        this.confirmOverlay.classList.add('active');
    }


}

// Initialise Application
window.addEventListener('DOMContentLoaded', () => {
    try {
        window.archCafe = new ArchCafeWebsite();
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (e) {
        console.error('Initialization error:', e);
    }
});