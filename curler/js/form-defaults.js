/**
 * Form Defaults - Sets default values for form fields
 */

// Set default dates when form is rendered
function setDefaultDates() {
    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);

    const todayStr = today.toISOString().split('T')[0];
    const oneWeekStr = oneWeekLater.toISOString().split('T')[0];

    // Set start date to today
    const startDateInputs = document.querySelectorAll('input[name="contract_start_date"]');
    startDateInputs.forEach(input => {
        if (!input.value) {
            input.value = todayStr;
        }
    });

    // Set end date to one week later
    const endDateInputs = document.querySelectorAll('input[name="contract_end_date"]');
    endDateInputs.forEach(input => {
        if (!input.value) {
            input.value = oneWeekStr;
        }
    });
}

// Call when DOM is ready and when form changes
document.addEventListener('DOMContentLoaded', setDefaultDates);
window.addEventListener('hashchange', () => setTimeout(setDefaultDates, 100));

// Export for manual calling
if (typeof window !== 'undefined') {
    window.setDefaultDates = setDefaultDates;
}
