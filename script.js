// ===== GLOBAL VARIABLES =====
let patientCounter = 6; // Starting from PAT006
let registeredPatients = []; // Store registered patients

// Initialize Toastr
if (typeof toastr !== 'undefined') {
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "timeOut": "4000",
        "extendedTimeOut": "2000"
    };
}

// ===== PAGE NAVIGATION =====
function showPage(pageId, event = null) {
    if (event) {
        event.preventDefault();
    }
    
    // Hide all pages
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===== MODAL FUNCTIONS =====
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// ===== PASSWORD TOGGLE =====
function togglePassword(passwordId, button) {
    const passwordInput = document.getElementById(passwordId);
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        button.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        button.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// ===== VALIDATION FUNCTIONS =====
function validateName(name) {
    return /^[A-Za-z\s]{2,50}$/.test(name.trim());
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePhone(phone) {
    return /^[\d\s\+\-\(\)]{10,15}$/.test(phone.trim());
}

function validatePassword(password) {
    return password.length >= 6;
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function validateBirthDateForAge(birthDate) {
    const age = calculateAge(birthDate);
    return age >= 0 && age <= 120;
}

function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input) {
        input.classList.add('is-invalid');
    }
    
    if (error) {
        error.textContent = message;
        error.style.display = 'block';
    }
}

function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input) {
        input.classList.remove('is-invalid');
    }
    
    if (error) {
        error.style.display = 'none';
    }
}

function clearAllErrors() {
    // Clear all validation errors
    const errorElements = document.querySelectorAll('.invalid-feedback');
    errorElements.forEach(error => {
        error.style.display = 'none';
    });
    
    const inputElements = document.querySelectorAll('.is-invalid');
    inputElements.forEach(input => {
        input.classList.remove('is-invalid');
    });
}

// ===== NOTIFICATION FUNCTION =====
function showNotification(message, type = 'success') {
    if (typeof toastr !== 'undefined') {
        if (type === 'success') {
            toastr.success(message);
        } else if (type === 'error') {
            toastr.error(message);
        } else if (type === 'info') {
            toastr.info(message);
        } else {
            toastr.warning(message);
        }
    } else {
        // Fallback to alert
        alert(message);
    }
}

// ===== PATIENT REGISTRATION VALIDATION FUNCTIONS =====
function validateFirstName() {
    const firstName = document.getElementById('firstName').value.trim();
    clearError('firstName', 'firstNameError');
    
    if (!firstName) {
        showError('firstName', 'firstNameError', 'First name is required');
        return false;
    } else if (!validateName(firstName)) {
        showError('firstName', 'firstNameError', 'First name must be 2-50 letters only');
        return false;
    }
    return true;
}

function validateLastName() {
    const lastName = document.getElementById('lastName').value.trim();
    clearError('lastName', 'lastNameError');
    
    if (!lastName) {
        showError('lastName', 'lastNameError', 'Last name is required');
        return false;
    } else if (!validateName(lastName)) {
        showError('lastName', 'lastNameError', 'Last name must be 2-50 letters only');
        return false;
    }
    return true;
}

function validateBirthDate() {
    const birthDate = document.getElementById('birthDate').value;
    clearError('birthDate', 'birthDateError');
    
    if (!birthDate) {
        showError('birthDate', 'birthDateError', 'Date of birth is required');
        return false;
    } else if (!validateBirthDateForAge(birthDate)) {
        showError('birthDate', 'birthDateError', 'Age must be between 0 and 120 years');
        return false;
    }
    return true;
}

function validateGender() {
    const gender = document.getElementById('gender').value;
    clearError('gender', 'genderError');
    
    if (!gender) {
        showError('gender', 'genderError', 'Please select a gender');
        return false;
    }
    return true;
}

function validatePhoneField() {
    const phone = document.getElementById('phone').value.trim();
    clearError('phone', 'phoneError');
    
    if (!phone) {
        showError('phone', 'phoneError', 'Phone number is required');
        return false;
    } else if (!validatePhone(phone)) {
        showError('phone', 'phoneError', 'Please enter a valid phone number (10-15 digits)');
        return false;
    }
    return true;
}

function validateEmailField() {
    const email = document.getElementById('email').value.trim();
    clearError('email', 'emailError');
    
    if (!email) {
        showError('email', 'emailError', 'Email address is required');
        return false;
    } else if (!validateEmail(email)) {
        showError('email', 'emailError', 'Please enter a valid email address');
        return false;
    }
    return true;
}

// ===== GENERATE PATIENT ID =====
function generatePatientId() {
    const patientId = `PAT${String(patientCounter).padStart(3, '0')}`;
    patientCounter++;
    return patientId;
}

// ===== UPDATE SUCCESS MODAL WITH ACTUAL DATA =====
function updateSuccessModal(patientData) {
    // Calculate age
    const age = calculateAge(patientData.birthDate);
    const formattedBirthDate = new Date(patientData.birthDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Format gender
    const genderDisplay = patientData.gender.charAt(0).toUpperCase() + patientData.gender.slice(1);
    
    // Update modal with actual data
    document.getElementById('modalPatientId').textContent = patientData.patientId;
    document.getElementById('modalFullName').textContent = `${patientData.firstName} ${patientData.lastName}`;
    document.getElementById('modalBirthDate').textContent = formattedBirthDate;
    document.getElementById('modalAge').textContent = `${age} years`;
    document.getElementById('modalGender').textContent = genderDisplay;
    document.getElementById('modalContact').textContent = patientData.phone;
    document.getElementById('modalEmail').textContent = patientData.email;
    document.getElementById('modalEmailSent').textContent = patientData.email;
    document.getElementById('modalAddress').textContent = patientData.address || 'Not provided';
    document.getElementById('modalMedical').textContent = patientData.medicalConditions || 'None reported';
    document.getElementById('modalCenter').textContent = patientData.vaccinationCenter || 'Not specified';
    
    // Update success message with patient name
    document.getElementById('successTitle').textContent = 'Patient Registered Successfully!';
    document.getElementById('successMessage').textContent = 
        `${patientData.firstName} ${patientData.lastName} has been successfully registered in the Vaccine Management System. Patient ID: ${patientData.patientId}`;
}

// ===== PATIENT REGISTRATION =====
function handlePatientRegistration() {
    let isValid = true;

    // Validate all fields
    if (!validateFirstName()) isValid = false;
    if (!validateLastName()) isValid = false;
    if (!validateBirthDate()) isValid = false;
    if (!validateGender()) isValid = false;
    if (!validatePhoneField()) isValid = false;
    if (!validateEmailField()) isValid = false;

    if (!isValid) {
        showNotification('Please correct all errors in the form before submitting.', 'error');
        return;
    }

    // Get all form values
    const patientData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        birthDate: document.getElementById('birthDate').value,
        gender: document.getElementById('gender').value,
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        address: document.getElementById('address').value.trim(),
        medicalConditions: document.getElementById('medicalConditions').value.trim(),
        vaccinationCenter: document.getElementById('vaccinationCenter').value,
        patientId: generatePatientId(),
        registrationDate: new Date().toISOString().split('T')[0]
    };

    // Add to registered patients array
    registeredPatients.push(patientData);
    
    // Update success modal with actual data
    updateSuccessModal(patientData);

    // Show success modal
    showModal('registrationSuccessModal');
    
    // Show toast notification
    showNotification(`${patientData.firstName} ${patientData.lastName} registered successfully! Patient ID: ${patientData.patientId}`);
    
    // Store patient data in localStorage
    localStorage.setItem('registeredPatients', JSON.stringify(registeredPatients));
    localStorage.setItem('patientCounter', patientCounter);
    
    // Reset form
    document.getElementById('patientRegistrationForm').reset();
    clearAllErrors();
}

// ===== RESET FORM FUNCTION =====
function handleResetForm() {
    document.getElementById('patientRegistrationForm').reset();
    clearAllErrors();
    showNotification('Form has been reset.', 'info');
}

// ===== ADMIN LOGIN =====
function handleAdminLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    let isValid = true;

    // Clear errors
    clearError('adminUsername', 'adminUsernameError');
    clearError('adminPassword', 'adminPasswordError');

    // Validate
    if (!username) {
        showError('adminUsername', 'adminUsernameError', 'Username is required');
        isValid = false;
    }
    
    if (!password) {
        showError('adminPassword', 'adminPasswordError', 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError('adminPassword', 'adminPasswordError', 'Password must be at least 6 characters');
        isValid = false;
    }

    // Check credentials
    if (isValid) {
        // Demo credentials
        if (username === 'admin' && password === 'admin123') {
            showNotification('Login successful! Redirecting to Admin Dashboard...');
            // Show dashboard after delay
            setTimeout(() => {
                showPage('admin-dashboard');
            }, 1000);
        } else {
            showNotification('Invalid username or password. Use: admin / admin123', 'error');
        }
    }
}

// ===== NURSE LOGIN =====
function handleNurseLogin() {
    const username = document.getElementById('nurseUsername').value.trim();
    const password = document.getElementById('nursePassword').value;
    let isValid = true;

    // Clear errors
    clearError('nurseUsername', 'nurseUsernameError');
    clearError('nursePassword', 'nursePasswordError');

    // Validate
    if (!username) {
        showError('nurseUsername', 'nurseUsernameError', 'Username is required');
        isValid = false;
    }
    
    if (!password) {
        showError('nursePassword', 'nursePasswordError', 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError('nursePassword', 'nursePasswordError', 'Password must be at least 6 characters');
        isValid = false;
    }

    // Check credentials
    if (isValid) {
        // Demo credentials
        if (username === 'nurse' && password === 'nurse123') {
            showNotification('Login successful! Redirecting to Nurse Dashboard...');
            // Show dashboard after delay
            setTimeout(() => {
                showPage('nurse-dashboard');
            }, 1000);
        } else {
            showNotification('Invalid username or password. Use: nurse / nurse123', 'error');
        }
    }
}

// ===== CONTACT FORM =====
function handleContact() {
    let isValid = true;

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    // Clear errors
    ['contactName', 'contactEmail', 'contactMessage'].forEach(field => {
        clearError(field, `${field}Error`);
    });

    // Validate
    if (!name) {
        showError('contactName', 'contactNameError', 'Name is required');
        isValid = false;
    } else if (!validateName(name)) {
        showError('contactName', 'contactNameError', 'Enter valid name (2-50 letters)');
        isValid = false;
    }

    if (!email) {
        showError('contactEmail', 'contactEmailError', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('contactEmail', 'contactEmailError', 'Enter valid email address');
        isValid = false;
    }

    if (!message) {
        showError('contactMessage', 'contactMessageError', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('contactMessage', 'contactMessageError', 'Message must be at least 10 characters');
        isValid = false;
    }

    // If valid, show success
    if (isValid) {
        showNotification('Message sent! We will contact you soon.');
        // Reset form
        document.getElementById('contactForm').reset();
    }
}

// ===== APPOINTMENT =====
function handleAppointment() {
    let isValid = true;

    const patientName = document.getElementById('appointmentPatientName').value.trim();
    const vaccineType = document.getElementById('appointmentVaccineType').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;

    // Clear errors
    ['appointmentPatientName', 'appointmentVaccineType', 'appointmentDate', 'appointmentTime'].forEach(field => {
        clearError(field, `${field}Error`);
    });

    // Validate
    if (!patientName) {
        showError('appointmentPatientName', 'appointmentPatientNameError', 'Patient name required');
        isValid = false;
    }

    if (!vaccineType) {
        showError('appointmentVaccineType', 'appointmentVaccineTypeError', 'Select vaccine type');
        isValid = false;
    }

    if (!date) {
        showError('appointmentDate', 'appointmentDateError', 'Select date');
        isValid = false;
    }

    if (!time) {
        showError('appointmentTime', 'appointmentTimeError', 'Select time');
        isValid = false;
    }

    if (isValid) {
        hideModal('addAppointmentModal');
        showNotification('Appointment scheduled successfully!');
        document.getElementById('addAppointmentForm').reset();
    }
}

// ===== STOCK =====
function handleStock() {
    let isValid = true;

    const vaccineName = document.getElementById('vaccineName').value.trim();
    const batchNumber = document.getElementById('batchNumber').value.trim();
    const quantity = document.getElementById('stockQuantity').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const manufacturer = document.getElementById('manufacturer').value.trim();
    const temperature = document.getElementById('storageTemperature').value.trim();

    // Clear errors
    ['vaccineName', 'batchNumber', 'stockQuantity', 'expiryDate', 'manufacturer', 'storageTemperature'].forEach(field => {
        clearError(field, `${field}Error`);
    });

    // Validate
    if (!vaccineName) {
        showError('vaccineName', 'vaccineNameError', 'Vaccine name required');
        isValid = false;
    }

    if (!batchNumber) {
        showError('batchNumber', 'batchNumberError', 'Batch number required');
        isValid = false;
    }

    if (!quantity || quantity < 1) {
        showError('stockQuantity', 'stockQuantityError', 'Enter valid quantity (min 1)');
        isValid = false;
    }

    if (!expiryDate) {
        showError('expiryDate', 'expiryDateError', 'Select expiry date');
        isValid = false;
    }

    if (!manufacturer) {
        showError('manufacturer', 'manufacturerError', 'Manufacturer required');
        isValid = false;
    }

    if (!temperature) {
        showError('storageTemperature', 'storageTemperatureError', 'Storage temperature required');
        isValid = false;
    }

    if (isValid) {
        hideModal('addStockModal');
        showNotification('Vaccine stock added successfully!');
        document.getElementById('addStockForm').reset();
    }
}

// ===== ENHANCED SEARCH FUNCTIONS =====
function searchAllRecords() {
    const searchTerm = document.getElementById('searchAllRecords').value.toLowerCase().trim();
    const table = document.getElementById('allRecordsTable');
    const rows = table.getElementsByTagName('tr');
    
    let found = false;
    let exactMatch = null;
    
    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const patientId = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        const patientName = row.querySelector('td:nth-child(2) strong').textContent.toLowerCase();
        
        // Check for exact ID match first
        if (patientId === searchTerm) {
            exactMatch = row;
            // Highlight and show only this row
            for (let j = 1; j < rows.length; j++) {
                rows[j].style.display = 'none';
            }
            row.style.display = '';
            row.style.backgroundColor = '#e8f4fd'; // Light blue highlight
            found = true;
            
            // Show details popup for exact ID match
            setTimeout(() => showPatientDetails(row), 300);
            break;
        } 
        // Check for partial matches
        else if (patientId.includes(searchTerm) || patientName.includes(searchTerm)) {
            row.style.display = '';
            row.style.backgroundColor = '';
            found = true;
        } else {
            row.style.display = 'none';
            row.style.backgroundColor = '';
        }
    }
    
    if (searchTerm && !found) {
        showNotification(`No records found for ID or name: ${searchTerm}`, 'info');
    } else if (found && !exactMatch) {
        showNotification(`Found records matching: ${searchTerm}`, 'success');
    }
}

function showPatientDetails(row) {
    // Extract data from the row
    const patientId = row.querySelector('td:nth-child(1)').textContent;
    const patientName = row.querySelector('td:nth-child(2) strong').textContent;
    const vaccine = row.querySelector('td:nth-child(3)').textContent;
    const date = row.querySelector('td:nth-child(4)').textContent;
    const dose = row.querySelector('td:nth-child(5)').textContent;
    const status = row.querySelector('td:nth-child(6) .badge').textContent;
    const nurse = row.querySelector('td:nth-child(7)').textContent;
    
    // Get additional data from data attributes
    const rowData = row.dataset;
    
    // Populate modal
    document.getElementById('detailPatientId').textContent = patientId;
    document.getElementById('detailFullName').textContent = patientName;
    document.getElementById('detailVaccine').textContent = vaccine;
    document.getElementById('detailDate').textContent = date;
    document.getElementById('detailDose').textContent = dose;
    document.getElementById('detailStatus').textContent = status;
    document.getElementById('detailNurse').textContent = nurse;
    
    // Set additional details
    document.getElementById('detailAge').textContent = 'Not specified';
    document.getElementById('detailGender').textContent = 'Not specified';
    document.getElementById('detailContact').textContent = 'Not specified';
    document.getElementById('detailEmail').textContent = 'Not specified';
    document.getElementById('detailCenter').textContent = 'Not specified';
    document.getElementById('detailNextDue').textContent = 'Not specified';
    document.getElementById('detailBatch').textContent = 'Not specified';
    
    // Show the modal
    showModal('patientDetailsModal');
}

// Update the filter function to work properly
function filterAllRecords() {
    const status = document.getElementById('filterAllStatus').value;
    const table = document.getElementById('allRecordsTable');
    const rows = table.getElementsByTagName('tr');
    
    let found = false;
    
    // Skip header row
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rowStatus = row.getAttribute('data-status');
        
        if (!status || rowStatus === status) {
            row.style.display = '';
            found = true;
        } else {
            row.style.display = 'none';
        }
    }
    
    if (found) {
        const statusText = status || 'all statuses';
        showNotification(`Showing records with ${statusText}`, 'success');
    } else {
        showNotification(`No records found for status: ${status}`, 'info');
    }
}

function searchPatientHistory() {
    const searchTerm = document.getElementById('searchPatient').value.toLowerCase();
    const table = document.getElementById('vaccinationHistoryTable');
    const rows = table.getElementsByTagName('tr');
    
    let found = false;
    
    // Skip header row
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const patientName = row.querySelector('td:nth-child(1) strong').textContent.toLowerCase();
        const patientId = row.querySelector('td:nth-child(1) small').textContent.toLowerCase();
        
        if (patientName.includes(searchTerm) || patientId.includes(searchTerm)) {
            row.style.display = '';
            found = true;
        } else {
            row.style.display = 'none';
        }
    }
    
    if (searchTerm && !found) {
        showNotification('No patients found matching your search.', 'info');
    } else if (found) {
        showNotification('Search completed.', 'success');
    }
}

function filterVaccineHistory() {
    const vaccineType = document.getElementById('filterVaccine').value.toLowerCase();
    const table = document.getElementById('vaccinationHistoryTable');
    const rows = table.getElementsByTagName('tr');
    
    if (!vaccineType) {
        // Show all rows
        for (let i = 1; i < rows.length; i++) {
            rows[i].style.display = '';
        }
        showNotification('Showing all vaccines.', 'info');
        return;
    }
    
    let found = false;
    
    // Skip header row
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const vaccine = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        
        if (vaccine.includes(vaccineType)) {
            row.style.display = '';
            found = true;
        } else {
            row.style.display = 'none';
        }
    }
    
    if (found) {
        showNotification(`Filtered by ${vaccineType} vaccine.`, 'success');
    } else {
        showNotification('No records found for this vaccine type.', 'info');
    }
}

// ===== VACCINE STOCK MANAGEMENT =====
function editStock(batchNumber) {
    // In a real application, you would fetch the stock data for this batch
    // For now, we'll show a modal with edit form
    showNotification(`Editing stock for batch: ${batchNumber}`, 'info');
    
    // You can create an edit modal similar to addStockModal
    // For now, we'll show an alert with edit options
    const newQuantity = prompt(`Enter new quantity for batch ${batchNumber}:`, "100");
    if (newQuantity && !isNaN(newQuantity) && parseInt(newQuantity) > 0) {
        showNotification(`Updated quantity for batch ${batchNumber} to ${newQuantity}`, 'success');
        // Here you would update the table row
        updateStockInTable(batchNumber, parseInt(newQuantity));
    }
}

function deleteStock(batchNumber) {
    if (confirm(`Are you sure you want to delete stock for batch ${batchNumber}? This action cannot be undone.`)) {
        showNotification(`Stock for batch ${batchNumber} deleted successfully!`, 'success');
        // Here you would remove the row from the table
        removeStockFromTable(batchNumber);
    }
}

function updateStockInTable(batchNumber, newQuantity) {
    // Find and update the row in the table
    const table = document.querySelector('#stock table tbody');
    const rows = table.getElementsByTagName('tr');
    
    for (let row of rows) {
        const batchCell = row.querySelector('td:nth-child(2)');
        if (batchCell && batchCell.textContent === batchNumber) {
            const quantityCell = row.querySelector('td:nth-child(3)');
            if (quantityCell) {
                quantityCell.textContent = newQuantity;
                
                // Update status based on new quantity
                const statusCell = row.querySelector('td:nth-child(5) .badge');
                if (statusCell) {
                    if (newQuantity < 50) {
                        statusCell.textContent = 'Low Stock';
                        statusCell.className = 'badge bg-warning';
                    } else {
                        statusCell.textContent = 'In Stock';
                        statusCell.className = 'badge bg-success';
                    }
                }
            }
            break;
        }
    }
}

function removeStockFromTable(batchNumber) {
    const table = document.querySelector('#stock table tbody');
    const rows = table.getElementsByTagName('tr');
    
    for (let row of rows) {
        const batchCell = row.querySelector('td:nth-child(2)');
        if (batchCell && batchCell.textContent === batchNumber) {
            row.remove();
            break;
        }
    }
}

// ===== REPORT FUNCTIONS WITH PDF EXPORT =====
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('dateRange').value;
    let dateRangeText = dateRange;
    
    // Handle custom date range
    let startDate = '';
    let endDate = '';
    
    if (dateRange === 'custom') {
        startDate = document.getElementById('startDate').value;
        endDate = document.getElementById('endDate').value;
        
        if (!startDate || !endDate) {
            showNotification('Please select both start and end dates for custom range.', 'error');
            return;
        }
        dateRangeText = `${startDate} to ${endDate}`;
    }
    
    // Generate report data based on type
    const reportData = generateReportData(reportType, dateRangeText, startDate, endDate);
    
    // Show report preview
    showReportPreview(reportData);
    
    showNotification(`${reportType} report generated for ${dateRangeText}`, 'success');
}

function generateReportData(type, dateRange, startDate = '', endDate = '') {
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    let report = {
        type: type,
        dateRange: dateRange,
        generatedAt: timestamp,
        summary: {},
        details: []
    };
    
    switch(type) {
        case 'vaccination':
            report.title = 'Vaccination Report';
            report.summary = {
                totalVaccinations: 1245,
                completed: 980,
                scheduled: 200,
                pending: 65,
                averageDaily: 45,
                coverageRate: '85%'
            };
            report.details = [
                { vaccine: 'Polio', count: 320, percentage: '26%' },
                { vaccine: 'COVID-19', count: 450, percentage: '36%' },
                { vaccine: 'Influenza', count: 285, percentage: '23%' },
                { vaccine: 'Hepatitis B', count: 190, percentage: '15%' }
            ];
            break;
            
        case 'stock':
            report.title = 'Stock Inventory Report';
            report.summary = {
                totalVaccineTypes: 15,
                totalDoses: 2450,
                lowStockItems: 3,
                expiringSoon: 2,
                stockValue: '$125,000',
                reorderNeeded: 2
            };
            break;
            
        case 'patient':
            report.title = 'Patient Statistics Report';
            report.summary = {
                totalPatients: 1245,
                activePatients: 342,
                newThisMonth: 78,
                averageAge: 42,
                genderDistribution: { male: 48, female: 50, other: 2 }
            };
            break;
            
        case 'monthly':
            report.title = 'Monthly Summary Report';
            report.summary = {
                month: 'November 2025',
                vaccinations: 245,
                newPatients: 78,
                stockUsed: 320,
                revenue: '$45,000',
                efficiency: '92%'
            };
            break;
    }
    
    return report;
}

function showReportPreview(reportData) {
    // Create a preview of the report
    let previewHtml = `
        <div class="report-preview">
            <h4><i class="fas fa-file-alt me-2"></i>${reportData.title}</h4>
            <p><strong>Date Range:</strong> ${reportData.dateRange}</p>
            <p><strong>Generated:</strong> ${reportData.generatedAt}</p>
            <hr>
            <h5>Summary</h5>
            <div class="row">
    `;
    
    // Add summary items
    Object.entries(reportData.summary).forEach(([key, value]) => {
        previewHtml += `
            <div class="col-md-6">
                <p><strong>${formatKey(key)}:</strong> ${typeof value === 'object' ? JSON.stringify(value) : value}</p>
            </div>
        `;
    });
    
    previewHtml += `</div>`;
    
    // Add details if available
    if (reportData.details && reportData.details.length > 0) {
        previewHtml += `<hr><h5>Details</h5><ul>`;
        reportData.details.forEach(item => {
            previewHtml += `<li>${item.vaccine}: ${item.count} doses (${item.percentage})</li>`;
        });
        previewHtml += `</ul>`;
    }
    
    previewHtml += `</div>`;
    
    // Show in alert or create a modal
    const modalHtml = `
        <div class="modal" id="reportPreviewModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">${reportData.title} Preview</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="hideModal('reportPreviewModal')"></button>
                    </div>
                    <div class="modal-body">
                        ${previewHtml}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="hideModal('reportPreviewModal')">Close</button>
                        <button class="btn btn-success" onclick="exportReportToPDF('${reportData.type}')">
                            <i class="fas fa-file-export me-2"></i>Export to PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body if not exists
    let modal = document.getElementById('reportPreviewModal');
    if (!modal) {
        const div = document.createElement('div');
        div.innerHTML = modalHtml;
        document.body.appendChild(div.firstChild);
    }
    
    showModal('reportPreviewModal');
}

function formatKey(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

async function exportReportToPDF(reportType) {
    try {
        // Check if jsPDF is available
        if (typeof jsPDF === 'undefined') {
            showNotification('PDF library not loaded. Please check your internet connection.', 'error');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add content to PDF
        doc.setFontSize(20);
        doc.text('Vaccine Management System Report', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Report Type: ${reportType}`, 20, 40);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50);
        
        // Add report content based on type
        let yPos = 70;
        
        switch(reportType) {
            case 'vaccination':
                doc.text('Vaccination Statistics:', 20, yPos);
                yPos += 10;
                doc.text('- Total Vaccinations: 1,245', 30, yPos);
                yPos += 7;
                doc.text('- Completed: 980', 30, yPos);
                yPos += 7;
                doc.text('- Scheduled: 200', 30, yPos);
                yPos += 7;
                doc.text('- Pending: 65', 30, yPos);
                break;
                
            case 'stock':
                doc.text('Stock Inventory:', 20, yPos);
                yPos += 10;
                doc.text('- Total Doses: 2,450', 30, yPos);
                yPos += 7;
                doc.text('- Vaccine Types: 15', 30, yPos);
                yPos += 7;
                doc.text('- Low Stock Items: 3', 30, yPos);
                break;
                
            case 'patient':
                doc.text('Patient Statistics:', 20, yPos);
                yPos += 10;
                doc.text('- Total Patients: 1,245', 30, yPos);
                yPos += 7;
                doc.text('- Active Patients: 342', 30, yPos);
                yPos += 7;
                doc.text('- New This Month: 78', 30, yPos);
                break;
                
            case 'monthly':
                doc.text('Monthly Summary:', 20, yPos);
                yPos += 10;
                doc.text('- Vaccinations: 245', 30, yPos);
                yPos += 7;
                doc.text('- New Patients: 78', 30, yPos);
                yPos += 7;
                doc.text('- Stock Used: 320 doses', 30, yPos);
                break;
        }
        
        // Save the PDF
        doc.save(`VMS_Report_${reportType}_${new Date().toISOString().slice(0,10)}.pdf`);
        
        showNotification('PDF exported successfully!', 'success');
        hideModal('reportPreviewModal');
        
    } catch (error) {
        console.error('PDF export error:', error);
        showNotification('Error exporting PDF. Please try again.', 'error');
    }
}

// Also update the existing exportToPDF function to use the new function
function exportToPDF() {
    const reportType = document.getElementById('reportType').value;
    exportReportToPDF(reportType);
}

// ===== NOTIFICATION FUNCTIONS =====
function sendNotification() {
    const patients = Array.from(document.getElementById('selectPatients').selectedOptions).map(option => option.value);
    const notificationType = document.getElementById('notificationType').value;
    const message = document.getElementById('notificationMessage').value;
    
    if (!message.trim()) {
        showNotification('Please enter a notification message.', 'error');
        return;
    }
    
    if (patients.length === 0) {
        showNotification('Please select at least one patient.', 'error');
        return;
    }
    
    // Get delivery methods
    const deliveryMethods = [];
    if (document.getElementById('deliverySMS').checked) deliveryMethods.push('SMS');
    if (document.getElementById('deliveryEmail').checked) deliveryMethods.push('Email');
    if (document.getElementById('deliveryApp').checked) deliveryMethods.push('In-App');
    
    if (deliveryMethods.length === 0) {
        showNotification('Please select at least one delivery method.', 'error');
        return;
    }
    
    // Prepare notification data
    const notificationData = {
        patients: patients,
        type: notificationType,
        message: message,
        deliveryMethods: deliveryMethods,
        sentAt: new Date().toLocaleString()
    };
    
    // Show success message
    let patientCount = patients.includes('all') ? 'All patients' : `${patients.length} patient(s)`;
    showNotification(`Notification sent to ${patientCount} via ${deliveryMethods.join(', ')}!`, 'success');
    
    // Clear form
    document.getElementById('notificationMessage').value = '';
}

// ===== ACTION FUNCTIONS =====
function markAppointmentDone(patientId) {
    showNotification(`Appointment for ${patientId} marked as done!`);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Vaccine Management System loaded');
    
    // Load registered patients from localStorage
    const storedPatients = localStorage.getItem('registeredPatients');
    if (storedPatients) {
        registeredPatients = JSON.parse(storedPatients);
        // Update patient counter based on stored patients
        if (registeredPatients.length > 0) {
            const lastPatientId = registeredPatients[registeredPatients.length - 1].patientId;
            patientCounter = parseInt(lastPatientId.replace('PAT', '')) + 1;
        }
    }
    
    // Load patient counter from localStorage
    const storedCounter = localStorage.getItem('patientCounter');
    if (storedCounter) {
        patientCounter = parseInt(storedCounter);
    }
    
    // Show home page initially
    showPage('home');
    
    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Patient registration buttons
    const registerBtn = document.getElementById('registerPatientBtn');
    const resetBtn = document.getElementById('resetFormBtn');
    
    if (registerBtn) {
        registerBtn.addEventListener('click', handlePatientRegistration);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', handleResetForm);
    }
    
    // Enter key support for forms
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            const form = activeElement.closest('form');
            if (!form) return;
            
            e.preventDefault();
            
            if (form.id === 'adminLoginForm') {
                handleAdminLogin();
            } else if (form.id === 'nurseLoginForm') {
                handleNurseLogin();
            } else if (form.id === 'contactForm') {
                handleContact();
            } else if (form.id === 'patientRegistrationForm') {
                handlePatientRegistration();
            } else if (form.id === 'addAppointmentForm') {
                handleAppointment();
            } else if (form.id === 'addStockForm') {
                handleStock();
            }
        }
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            e.target.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modals with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                modal.style.display = 'none';
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            });
        }
    });
    
    // Show custom date range when selected
    const dateRangeSelect = document.getElementById('dateRange');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            const customDateRange = document.getElementById('customDateRange');
            if (this.value === 'custom') {
                customDateRange.style.display = 'flex';
            } else {
                customDateRange.style.display = 'none';
            }
        });
    }
    
    // Enter key for search inputs
    const searchPatientInput = document.getElementById('searchPatient');
    if (searchPatientInput) {
        searchPatientInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchPatientHistory();
            }
        });
    }
    
    const searchAllRecordsInput = document.getElementById('searchAllRecords');
    if (searchAllRecordsInput) {
        searchAllRecordsInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchAllRecords();
            }
        });
    }
}