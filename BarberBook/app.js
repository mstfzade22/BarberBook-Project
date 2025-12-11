// API_BASE_URL is now imported from config.js
// Use API_BASE from config.js for automatic environment detection

function getAuthToken() {
  const user = localStorage.getItem("currentUser");
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
}

async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

let barbersData = [];
let currentBooking = {
  barberId: null,
  barber: null,
  serviceId: null,
  service: null,
  date: null,
  time: null,
  currentStep: 1,
};

async function fetchBarbers() {
  try {
    const response = await apiRequest("/barbers");
    return response.data;
  } catch (error) {
    showToast("Error loading barbers", "error");
    return [];
  }
}

async function fetchBarberById(barberId) {
  try {
    const response = await apiRequest(`/barbers/${barberId}`);
    return response.data;
  } catch (error) {
    showToast("Error loading barber details", "error");
    return null;
  }
}

async function fetchBarberAvailability(barberId, date) {
  try {
    const response = await apiRequest(
      `/barbers/${barberId}/availability?date=${date}`
    );
    return response.data;
  } catch (error) {
    showToast("Error loading availability", "error");
    return null;
  }
}

async function registerUser(userData) {
  try {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    throw error;
  }
}

async function loginUser(credentials) {
  try {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return response;
  } catch (error) {
    throw error;
  }
}

async function fetchAppointments() {
  try {
    const response = await apiRequest("/appointments");
    return response.data;
  } catch (error) {
    showToast("Error loading appointments", "error");
    return [];
  }
}

async function createAppointment(appointmentData) {
  try {
    const response = await apiRequest("/appointments", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
    return response;
  } catch (error) {
    throw error;
  }
}

async function cancelAppointmentAPI(appointmentId) {
  try {
    const response = await apiRequest(`/appointments/${appointmentId}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    throw error;
  }
}

async function fetchBarberCalendar(startDate, endDate) {
  try {
    const query =
      startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : "";
    const response = await apiRequest(`/appointments/calendar${query}`);
    return response.data;
  } catch (error) {
    showToast("Error loading calendar", "error");
    return {};
  }
}

function isLoggedIn() {
  const user = localStorage.getItem("currentUser");
  if (!user) return false;

  const userData = JSON.parse(user);
  return userData.token != null;
}

function getCurrentUser() {
  const userStr = localStorage.getItem("currentUser");
  return userStr ? JSON.parse(userStr) : null;
}

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await loginUser({ email, password });

    const userData = {
      ...response.data.user,
      token: response.data.token,
    };

    localStorage.setItem("currentUser", JSON.stringify(userData));
    showToast("Login successful!", "success");

    setTimeout(() => {
      if (userData.role === "barber") {
        window.location.href = "barber-dashboard.html";
      } else {
        window.location.href = "customer-dashboard.html";
      }
    }, 1000);
  } catch (error) {
    showToast(error.message || "Login failed", "error");
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const isBarber = document.getElementById("registerAsBarber").checked;

  if (password !== confirmPassword) {
    showToast("Passwords do not match!", "error");
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters!", "error");
    return;
  }

  try {
    const response = await registerUser({
      name: fullName,
      email,
      password,
      phone,
      role: isBarber ? "barber" : "customer",
    });

    const userData = {
      ...response.data.user,
      token: response.data.token,
    };

    localStorage.setItem("currentUser", JSON.stringify(userData));
    showToast("Registration successful!", "success");

    setTimeout(() => {
      if (isBarber) {
        window.location.href = "barber-dashboard.html";
      } else {
        window.location.href = "customer-dashboard.html";
      }
    }, 1000);
  } catch (error) {
    showToast(error.message || "Registration failed", "error");
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  showToast("Logged out successfully", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

function updateNavigation() {
  const authLink = document.getElementById("authLink");
  const dashboardLink = document.getElementById("dashboardLink");

  if (isLoggedIn()) {
    const user = getCurrentUser();
    if (authLink) {
      authLink.textContent = "Logout";
      authLink.href = "#";
      authLink.onclick = (e) => {
        e.preventDefault();
        logout();
      };
    }
    if (dashboardLink) {
      dashboardLink.textContent = "Dashboard";
      dashboardLink.href =
        user.role === "barber"
          ? "barber-dashboard.html"
          : "customer-dashboard.html";
    }
  } else {
    if (authLink) {
      authLink.textContent = "Login";
      authLink.href = "login.html";
    }
    if (dashboardLink) {
      dashboardLink.style.display = "none";
    }
  }
}

async function loadBarbers() {
  barbersData = await fetchBarbers();
  displayBarbers(barbersData);
}

function displayBarbers(barbers) {
  const grid = document.getElementById("barbersGrid");
  const noResults = document.getElementById("noResults");

  if (!grid) return;

  if (barbers.length === 0) {
    grid.style.display = "none";
    noResults.style.display = "block";
    return;
  }

  grid.style.display = "grid";
  noResults.style.display = "none";

  grid.innerHTML = barbers
    .map(
      (barber) => `
        <div class="barber-card" onclick="window.location.href='barber.html?id=${
          barber.id
        }'">
            <img src="${barber.photo}" alt="${barber.name}">
            <div class="barber-card-content">
                <h4>${barber.name}</h4>
                <div class="barber-rating">
                    <span>⭐ ${barber.rating}</span>
                    <span>(${barber.totalReviews} reviews)</span>
                </div>
                <div class="barber-services">
                    ${barber.services.map((s) => s.name).join(", ")}
                </div>
                <div class="barber-location">
                    📍 ${barber.location}
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

function searchBarbers() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  const filtered = barbersData.filter((barber) => {
    const nameMatch = barber.name.toLowerCase().includes(searchTerm);
    const serviceMatch = barber.services.some((s) =>
      s.name.toLowerCase().includes(searchTerm)
    );
    return nameMatch || serviceMatch;
  });

  displayBarbers(filtered);
}

function applyFilters() {
  const highRated = document.getElementById("filterHighRated").checked;
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  let filtered = barbersData;

  if (searchTerm) {
    filtered = filtered.filter((barber) => {
      const nameMatch = barber.name.toLowerCase().includes(searchTerm);
      const serviceMatch = barber.services.some((s) =>
        s.name.toLowerCase().includes(searchTerm)
      );
      return nameMatch || serviceMatch;
    });
  }

  if (highRated) {
    filtered = filtered.filter((barber) => barber.rating >= 4.5);
  }

  displayBarbers(filtered);
}

async function loadBarberProfile(barberId) {
  const barber = await fetchBarberById(barberId);

  if (!barber) {
    document.getElementById("barberProfile").innerHTML = `
      <div class="error-message">
        <h2>Barber Not Found</h2>
        <p><a href="index.html">Return to Home</a></p>
      </div>
    `;
    return;
  }

  document.getElementById("barberProfile").innerHTML = `
    <div class="profile-header">
      <img src="${barber.photo}" alt="${barber.name}" class="profile-photo">
      <div class="profile-info">
        <h2>${barber.name}</h2>
        <div class="barber-rating">
          <span>⭐ ${barber.rating}</span>
          <span>(${barber.totalReviews} reviews)</span>
        </div>
        <p>${barber.bio}</p>
        <div class="barber-location">📍 ${barber.location}</div>
        <button onclick="window.location.href='booking.html?barberId=${
          barber.id
        }'" 
                class="btn-primary" style="margin-top: 1rem;">
          Book Appointment
        </button>
      </div>
    </div>
    
    <div class="profile-details">
      <div class="detail-card">
        <h4>Services & Pricing</h4>
        <div class="services-list">
          ${barber.services
            .map(
              (service) => `
            <div class="service-item">
              <div class="service-info">
                <h5>${service.name}</h5>
                <span class="service-duration">${service.duration} minutes</span>
              </div>
              <div class="service-price">$${service.price}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      
      <div class="detail-card">
        <h4>Working Hours</h4>
        <ul class="working-hours-list">
          ${Object.entries(barber.workingHours)
            .map(
              ([day, hours]) => `
            <li>
              <strong>${day.charAt(0).toUpperCase() + day.slice(1)}:</strong>
              <span>${hours}</span>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    </div>
    
    <div class="detail-card" style="margin-top: 2rem;">
      <h4>Gallery</h4>
      <div class="gallery-grid">
        ${barber.gallery
          .map(
            (img) => `
          <img src="${img}" alt="Work sample">
        `
          )
          .join("")}
      </div>
    </div>
    
    <div class="detail-card" style="margin-top: 2rem;">
      <h4>Location</h4>
      <div class="map-placeholder">
        📍 Map view: ${barber.location}<br>
        <small>(In production, this would show Google Maps integration)</small>
      </div>
    </div>
  `;
}

async function initializeBooking(barberId) {
  const barber = await fetchBarberById(barberId);

  if (!barber) {
    showToast("Barber not found", "error");
    return;
  }

  currentBooking.barberId = barberId;
  currentBooking.barber = barber;

  document.getElementById("barberInfo").innerHTML = `
    <h4>${barber.name}</h4>
    <p>${barber.location}</p>
  `;

  document.getElementById("servicesList").innerHTML = barber.services
    .map(
      (service) => `
    <div class="service-item selectable" onclick="selectService('${service.id}')">
      <div class="service-info">
        <h5>${service.name}</h5>
        <span class="service-duration">${service.duration} minutes</span>
      </div>
      <div class="service-price">$${service.price}</div>
    </div>
  `
    )
    .join("");
}

function selectService(serviceId) {
  const service = currentBooking.barber.services.find(
    (s) => s.id === serviceId
  );
  currentBooking.serviceId = serviceId;
  currentBooking.service = service;

  document.querySelectorAll(".service-item").forEach((item) => {
    item.classList.remove("selected");
  });
  event.target.closest(".service-item").classList.add("selected");

  setTimeout(() => nextStep(), 300);
}

function nextStep() {
  const currentStep = currentBooking.currentStep;

  if (currentStep === 1 && !currentBooking.serviceId) {
    showToast("Please select a service", "warning");
    return;
  }

  if (currentStep === 2 && (!currentBooking.date || !currentBooking.time)) {
    showToast("Please select date and time", "warning");
    return;
  }

  if (currentStep === 2 && !isLoggedIn()) {
    showToast("Please login to complete booking", "warning");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
    return;
  }

  document.getElementById(`step${currentStep}`).classList.remove("active");
  document
    .querySelector(`.step[data-step="${currentStep}"]`)
    .classList.remove("active");

  currentBooking.currentStep++;
  document
    .getElementById(`step${currentBooking.currentStep}`)
    .classList.add("active");
  document
    .querySelector(`.step[data-step="${currentBooking.currentStep}"]`)
    .classList.add("active");

  if (currentBooking.currentStep === 3) {
    displayBookingSummary();
  }
}

function previousStep() {
  const currentStep = currentBooking.currentStep;

  document.getElementById(`step${currentStep}`).classList.remove("active");
  document
    .querySelector(`.step[data-step="${currentStep}"]`)
    .classList.remove("active");
  currentBooking.currentStep--;
  document
    .getElementById(`step${currentBooking.currentStep}`)
    .classList.add("active");
  document
    .querySelector(`.step[data-step="${currentBooking.currentStep}"]`)
    .classList.add("active");
}

async function loadTimeSlots() {
  const date = document.getElementById("appointmentDate").value;
  if (!date) return;

  currentBooking.date = date;

  const availabilityData = await fetchBarberAvailability(
    currentBooking.barberId,
    date
  );

  if (!availabilityData) {
    document.getElementById("timeSlots").innerHTML =
      '<p style="color: var(--text-secondary);">Unable to load availability</p>';
    return;
  }

  const slots = generateTimeSlotsFromAPI(
    availabilityData,
    currentBooking.service.duration
  );

  const timeSlotsContainer = document.getElementById("timeSlots");

  if (slots.length === 0) {
    timeSlotsContainer.innerHTML =
      '<p style="color: var(--text-secondary);">No available slots for this date. Please try another date.</p>';
    return;
  }

  timeSlotsContainer.innerHTML = slots
    .map(
      (slot) => `
    <div class="time-slot ${slot.available ? "" : "disabled"}" 
         onclick="${slot.available ? `selectTimeSlot('${slot.time}')` : ""}">
      ${slot.time}
    </div>
  `
    )
    .join("");
}

function generateTimeSlotsFromAPI(availabilityData, duration) {
  const { workingHours, bookedSlots } = availabilityData;

  const date = currentBooking.date;
  const dayOfWeek = new Date(date)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const hours = workingHours[dayOfWeek];

  if (!hours || hours === "Closed") {
    return [];
  }

  const [startTime, endTime] = hours.split("-");
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const slots = [];
  let currentTime = startHour * 60 + startMin;
  const endTimeMinutes = endHour * 60 + endMin;

  const today = new Date().toISOString().split("T")[0];
  const isToday = date === today;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  while (currentTime + duration <= endTimeMinutes) {
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    const timeStr = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}`;

    const isPast = isToday && currentTime < currentMinutes;
    const isBooked = bookedSlots.some((slot) => {
      const slotStart = slot.time.split(":").map(Number);
      const slotStartMinutes = slotStart[0] * 60 + slotStart[1];
      const slotEndMinutes = slotStartMinutes + slot.duration;

      return currentTime >= slotStartMinutes && currentTime < slotEndMinutes;
    });

    slots.push({
      time: timeStr,
      available: !isPast && !isBooked,
    });

    currentTime += 30;
  }

  return slots;
}

function selectTimeSlot(time) {
  currentBooking.time = time;

  document.querySelectorAll(".time-slot").forEach((slot) => {
    slot.classList.remove("selected");
  });
  event.target.classList.add("selected");
  document.getElementById("step2Next").disabled = false;
}

function displayBookingSummary() {
  const user = getCurrentUser();
  const summary = document.getElementById("bookingSummary");

  summary.innerHTML = `
    <div class="summary-item">
      <strong>Barber:</strong>
      <span>${currentBooking.barber.name}</span>
    </div>
    <div class="summary-item">
      <strong>Service:</strong>
      <span>${currentBooking.service.name}</span>
    </div>
    <div class="summary-item">
      <strong>Duration:</strong>
      <span>${currentBooking.service.duration} minutes</span>
    </div>
    <div class="summary-item">
      <strong>Date:</strong>
      <span>${formatDate(currentBooking.date)}</span>
    </div>
    <div class="summary-item">
      <strong>Time:</strong>
      <span>${currentBooking.time}</span>
    </div>
    <div class="summary-item">
      <strong>Customer:</strong>
      <span>${user.name}</span>
    </div>
    <div class="summary-item">
      <strong>Total Price:</strong>
      <span>$${currentBooking.service.price}</span>
    </div>
  `;
}

async function confirmBooking() {
  if (!isLoggedIn()) {
    showToast("Please login to complete booking", "error");
    window.location.href = "login.html";
    return;
  }

  try {
    const appointmentData = {
      barberId: currentBooking.barberId,
      serviceId: currentBooking.serviceId,
      date: currentBooking.date,
      time: currentBooking.time,
      duration: currentBooking.service.duration,
      price: currentBooking.service.price,
    };

    await createAppointment(appointmentData);
    showToast("Appointment booked successfully!", "success");

    setTimeout(() => {
      window.location.href = "customer-dashboard.html";
    }, 1500);
  } catch (error) {
    showToast(error.message || "Error creating appointment", "error");
  }
}

async function loadCustomerDashboard() {
  const user = getCurrentUser();
  document.getElementById("userName").textContent = user.name;

  document.getElementById("profileInfo").innerHTML = `
    <div class="profile-field">
      <strong>Name:</strong>
      <span>${user.name}</span>
    </div>
    <div class="profile-field">
      <strong>Email:</strong>
      <span>${user.email}</span>
    </div>
    <div class="profile-field">
      <strong>Phone:</strong>
      <span>${user.phone || "Not provided"}</span>
    </div>
  `;

  const appointments = await fetchAppointments();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = appointments.filter((apt) => new Date(apt.date) >= today);
  const past = appointments.filter((apt) => new Date(apt.date) < today);

  const upcomingContainer = document.getElementById("upcomingAppointments");
  if (upcoming.length === 0) {
    upcomingContainer.innerHTML =
      '<p style="color: var(--text-secondary);">No upcoming appointments</p>';
  } else {
    upcomingContainer.innerHTML = upcoming
      .map(
        (apt) => `
      <div class="appointment-card">
        <div class="appointment-header">
          <div class="appointment-info">
            <h5>${apt.barberName}</h5>
            <div class="appointment-details">
              <p><strong>${apt.serviceId}</strong> - $${apt.price}</p>
              <p>📅 ${formatDate(apt.date)} at ${apt.time}</p>
              <p>⏱ Duration: ${apt.duration} minutes</p>
            </div>
          </div>
          <div class="appointment-actions">
            <button class="btn-danger" onclick="cancelAppointment('${apt.id}')">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  const pastContainer = document.getElementById("pastAppointments");
  if (past.length === 0) {
    pastContainer.innerHTML =
      '<p style="color: var(--text-secondary);">No past appointments</p>';
  } else {
    pastContainer.innerHTML = past
      .map(
        (apt) => `
      <div class="appointment-card past">
        <div class="appointment-info">
          <h5>${apt.barberName}</h5>
          <div class="appointment-details">
            <p><strong>${apt.serviceId}</strong> - $${apt.price}</p>
            <p>📅 ${formatDate(apt.date)} at ${apt.time}</p>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }
}

async function cancelAppointment(appointmentId) {
  if (!confirm("Are you sure you want to cancel this appointment?")) {
    return;
  }

  try {
    await cancelAppointmentAPI(appointmentId);
    showToast("Appointment cancelled", "success");

    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    showToast(error.message || "Error cancelling appointment", "error");
  }
}

function toggleEditProfile() {
  showToast("Profile editing feature coming soon!", "warning");
}

let currentView = "list";
let currentWeekStart = new Date();

async function loadBarberDashboard() {
  const user = getCurrentUser();
  document.getElementById("barberName").textContent = user.name;

  const appointments = await fetchAppointments();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAppts = appointments.filter(
    (apt) => apt.date === today.toISOString().split("T")[0]
  );
  const upcomingAppts = appointments.filter(
    (apt) => new Date(apt.date) >= today
  );

  const thisMonth = today.getMonth();
  const monthAppts = appointments.filter(
    (apt) => new Date(apt.date).getMonth() === thisMonth
  );

  const totalRevenue = monthAppts.reduce((sum, apt) => sum + apt.price, 0);

  document.getElementById("todayCount").textContent = todayAppts.length;
  document.getElementById("upcomingCount").textContent = upcomingAppts.length;
  document.getElementById("monthCount").textContent = monthAppts.length;
  document.getElementById("revenueCount").textContent = "$" + totalRevenue;

  displayAppointmentsList(appointments);
  const barber = await fetchBarberById(user.barberId);
  if (barber) {
    displayBarberServices(barber.services);
    displayWorkingHours(barber.workingHours);
  }
}

function displayAppointmentsList(appointments) {
  const container = document.getElementById("appointmentsList");

  if (appointments.length === 0) {
    container.innerHTML =
      '<p style="color: var(--text-secondary);">No appointments found</p>';
    return;
  }

  const sorted = appointments.sort((a, b) => {
    const dateA = new Date(a.date + " " + a.time);
    const dateB = new Date(b.date + " " + b.time);
    return dateA - dateB;
  });

  container.innerHTML = sorted
    .map(
      (apt) => `
    <div class="appointment-card">
      <div class="appointment-header">
        <div class="appointment-info">
          <h5>${apt.customerName}</h5>
          <div class="appointment-details">
            <p><strong>${apt.serviceId}</strong> - $${apt.price}</p>
            <p>📅 ${formatDate(apt.date)} at ${apt.time}</p>
            <p>⏱ Duration: ${apt.duration} minutes</p>
            <p>Status: <strong>${apt.status}</strong></p>
          </div>
        </div>
        <div class="appointment-actions">
          <button class="btn-success" onclick="markCompleted('${apt.id}')">
            Complete
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

function displayBarberServices(services) {
  const container = document.getElementById("servicesList");

  container.innerHTML = services
    .map(
      (service) => `
    <div class="service-item">
      <div class="service-info">
        <h5>${service.name}</h5>
        <span class="service-duration">${service.duration} minutes</span>
      </div>
      <div class="service-price">$${service.price}</div>
    </div>
  `
    )
    .join("");
}

function displayWorkingHours(hours) {
  const container = document.getElementById("workingHours");

  container.innerHTML = `
    <ul class="working-hours-list">
      ${Object.entries(hours)
        .map(
          ([day, time]) => `
        <li>
          <strong>${day.charAt(0).toUpperCase() + day.slice(1)}:</strong>
          <span>${time}</span>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
}

function switchView(view) {
  currentView = view;

  document
    .getElementById("listViewBtn")
    .classList.toggle("active", view === "list");
  document
    .getElementById("calendarViewBtn")
    .classList.toggle("active", view === "calendar");

  document.getElementById("listView").style.display =
    view === "list" ? "block" : "none";
  document.getElementById("calendarView").style.display =
    view === "calendar" ? "block" : "none";

  if (view === "calendar") {
    renderCalendar();
  }
}

async function renderCalendar() {
  const weekDisplay = document.getElementById("weekDisplay");
  const calendarGrid = document.getElementById("calendarGrid");

  const weekStart = new Date(currentWeekStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  weekDisplay.textContent = `Week of ${formatDate(
    weekStart.toISOString().split("T")[0]
  )}`;

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const calendarData = await fetchBarberCalendar(
    weekStart.toISOString().split("T")[0],
    weekEnd.toISOString().split("T")[0]
  );

  let html = "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    const dateStr = day.toISOString().split("T")[0];

    const dayAppointments = calendarData[dateStr] || [];

    html += `
      <div class="calendar-day">
        <div class="calendar-day-header">
          ${days[i]} ${day.getDate()}
        </div>
        ${dayAppointments
          .map(
            (apt) => `
          <div class="calendar-appointment">
            ${apt.time} - ${apt.customerName}
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  calendarGrid.innerHTML = html;
}

function changeWeek(direction) {
  currentWeekStart.setDate(currentWeekStart.getDate() + direction * 7);
  renderCalendar();
}

async function filterAppointmentsByDate() {
  const date = document.getElementById("filterDate").value;
  if (!date) return;

  const appointments = await fetchAppointments();
  const filtered = appointments.filter((apt) => apt.date === date);
  displayAppointmentsList(filtered);
}

async function clearDateFilter() {
  document.getElementById("filterDate").value = "";
  loadBarberDashboard();
}

function markCompleted(appointmentId) {
  showToast("Appointment marked as completed", "success");
}

function toggleAddService() {
  showToast("Add service feature coming soon!", "warning");
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function showToast(message, type = "info") {
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchBarbers();
      }
    });
  }
});
