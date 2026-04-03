const driverList = document.getElementById('drivers');
const liveTrack = document.getElementById('liveTrack');
const estimateResult = document.getElementById('estimateResult');
const bookingResult = document.getElementById('bookingResult');
const ratingResult = document.getElementById('ratingResult');
const rideState = document.getElementById('rideState');
const rideHistory = document.getElementById('rideHistory');
const refreshHistory = document.getElementById('refreshHistory');
const themeToggle = document.getElementById('themeToggle');
const greeting = document.getElementById('greeting');

const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const authStatus = document.getElementById('authStatus');
const adminDashboard = document.getElementById('adminDashboard');
const adminRides = document.getElementById('adminRides');
const refreshAdminRides = document.getElementById('refreshAdminRides');

let authToken = localStorage.getItem('authToken');
let currentUser = null;

const setLanguage = (lang) => {
  const messages = {
    en: 'Welcome to Taxi Booking',
    hi: 'टैक्सी बुकिंग में आपका स्वागत है',
    kn: 'ಟ್ಯಾಕ್ಸಿ ಬುಕ್ಕಿಂಗ್‌ಗೆ ಸ್ವಾಗತ'
  };
  greeting.innerText = messages[lang] || messages.en;
};

const setAuthState = (token, user) => {
  authToken = token || null;
  currentUser = user || null;
  if (token) {
    localStorage.setItem('authToken', token);
    authStatus.innerText = `Signed in as ${user.username} (${user.role})`;
    if (user.role === 'admin') adminDashboard.hidden = false;
  } else {
    localStorage.removeItem('authToken');
    authStatus.innerText = 'Not signed in';
    adminDashboard.hidden = true;
  }
};

const toastContainer = document.getElementById('toastContainer');

const showToast = (message, type = 'info') => {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4200);
};

const requestWithAuth = (url, options = {}) => {
  options.headers = options.headers || {};
  options.headers['Content-Type'] = 'application/json';
  if (authToken) options.headers.Authorization = `Bearer ${authToken}`;
  return fetch(url, options);
};

const pickupInput = document.getElementById('pickup');
const dropoffInput = document.getElementById('dropoff');
const pickupSuggestions = document.getElementById('pickupSuggestions');
const dropoffSuggestions = document.getElementById('dropoffSuggestions');

const setSuggestions = (container, items, inputEl) => {
  if (items.length === 0) {
    container.hidden = true;
    return;
  }
  container.hidden = false;
  container.innerHTML = items.map((item) => `<div class="suggestion-item" data-lat="${item.lat}" data-lon="${item.lon}">${item.display_name}</div>`).join('');
  container.querySelectorAll('.suggestion-item').forEach((el) => {
    el.addEventListener('click', () => {
      inputEl.value = el.textContent;
      inputEl.dataset.lat = el.dataset.lat;
      inputEl.dataset.lon = el.dataset.lon;
      container.hidden = true;
    });
  });
};

const lookupPlaces = (text, callback) => {
  if (!text || text.length < 2) {
    callback([]);
    return;
  }
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5&addressdetails=1`) 
    .then((res) => res.json())
    .then((data) => callback(data || []))
    .catch(() => callback([]));
};

const bindAutocomplete = (inputEl, containerEl) => {
  let timer = null;
  inputEl.addEventListener('input', (event) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      lookupPlaces(event.target.value, (suggestions) => setSuggestions(containerEl, suggestions, inputEl));
    }, 260);
  });
  document.addEventListener('click', (evt) => {
    if (!inputEl.contains(evt.target) && !containerEl.contains(evt.target)) {
      containerEl.hidden = true;
    }
  });
};

bindAutocomplete(pickupInput, pickupSuggestions);
bindAutocomplete(dropoffInput, dropoffSuggestions);

document.getElementById('language').addEventListener('change', (event) => setLanguage(event.target.value));
setLanguage('en');

const loadProfile = () => {
  if (!authToken) { setAuthState(null); return; }
  requestWithAuth('/me').then((r) => r.json()).then((data) => {
    if (data.success) setAuthState(authToken, data.user);
    else setAuthState(null);
  }).catch(() => setAuthState(null));
};

loginBtn.addEventListener('click', () => {
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: authUsername.value, password: authPassword.value })
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        setAuthState(data.token, data.user);
        loadRideHistory();
        authStatus.classList.remove('error');
        showToast(`Welcome back, ${data.user.username}!`, 'success');
      } else {
        authStatus.innerText = data.error || 'Login failed';
        authStatus.classList.add('error');
        showToast(data.error || 'Login failed', 'error');
      }
    });
});

registerBtn.addEventListener('click', () => {
  fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: authUsername.value, password: authPassword.value })
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        authStatus.innerText = `Registered ${data.user.username}, please login.`;
        authStatus.classList.remove('error');
        showToast('Registration successful. Login now.', 'success');
      } else {
        authStatus.innerText = data.error || 'Registration failed';
        authStatus.classList.add('error');
        showToast(data.error || 'Registration failed', 'error');
      }
    });
});

loadProfile();

const loadRideHistory = () => {
  fetch('/ride-history', { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) return;
      rideHistory.innerHTML = '';
      data.rides.forEach((ride) => {
        const li = document.createElement('li');
        li.textContent = `#${ride.rideId} | ${ride.pickup} -> ${ride.dropoff} | Driver: ${ride.driver.name} | ₹${ride.fare} | ${ride.status}`;
        rideHistory.appendChild(li);
      });
    });
};

const loadAdminRides = () => {
  fetch('/admin/rides', { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        adminRides.innerHTML = '<li>Admin access required.</li>';
        return;
      }
      adminRides.innerHTML = '';
      data.rides.forEach((ride) => {
        const li = document.createElement('li');
        li.textContent = `#${ride.rideId} [${ride.status}] ${ride.user}: ${ride.pickup} → ${ride.dropoff}, ₹${ride.fare}`;
        adminRides.appendChild(li);
      });
    })
    .catch(() => {
      adminRides.innerHTML = '<li>Failed to load admin rides.</li>';
    });
};

const setupTheme = () => {
  const dark = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark', dark);
};

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', isDark);
});

const refreshDrivers = () => {
  fetch('/drivers')
    .then((r) => r.json())
    .then((drivers) => {
      driverList.innerHTML = '';
      drivers.forEach((d) => {
        const li = document.createElement('li');
        li.textContent = `${d.id}: ${d.name} (${d.car}, ${d.plate}) @ [${d.lat.toFixed(4)}, ${d.lng.toFixed(4)}]`;
        driverList.appendChild(li);
      });
    });
};

const pickNearestDriver = () => {
  fetch('/drivers')
    .then((r) => r.json())
    .then((drivers) => {
      const nearest = drivers[0];
      if (nearest) {
        rideState.innerText = `Nearest driver is ${nearest.name} (${nearest.car})`; 
      }
    });
};

setupTheme();
refreshDrivers();
loadRideHistory();
loadAdminRides();

refreshHistory.addEventListener('click', loadRideHistory);
refreshAdminRides.addEventListener('click', loadAdminRides);

document.getElementById('refreshDrivers').addEventListener('click', refreshDrivers);
document.getElementById('pickNearest').addEventListener('click', pickNearestDriver);

const map = L.map('map').setView([12.9721, 77.5933], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const driverMarkers = {};
let routeLine = null;
let routeLayer = null;
const routeInfo = document.getElementById('routeInfo');

const drawGeoJSONRoute = (geometry) => {
  if (!geometry) return;
  if (routeLayer) {
    map.removeLayer(routeLayer);
  }
  routeLayer = L.geoJSON(geometry, {
    style: { color: '#34d399', weight: 5, opacity: 0.8 }
  }).addTo(map);
  const bounds = routeLayer.getBounds();
  if (bounds.isValid()) map.fitBounds(bounds, { padding: [60, 60] });
};

const updateDriverMarker = (driver) => {
  if (driverMarkers[driver.id]) {
    driverMarkers[driver.id].setLatLng([driver.lat, driver.lng]);
  } else {
    const marker = L.marker([driver.lat, driver.lng]).addTo(map);
    marker.bindPopup(`${driver.name} (${driver.car})`);
    driverMarkers[driver.id] = marker;
  }
};

const pickupDropoffCoords = (location, inputEl) => {
  if (inputEl && inputEl.dataset.lat && inputEl.dataset.lon) {
    return [Number(inputEl.dataset.lat), Number(inputEl.dataset.lon)];
  }
  const key = location.trim().toLowerCase();
  if (key.includes('airport')) return [12.9558, 77.6650];
  if (key.includes('station')) return [12.9780, 77.5713];
  if (key.includes('mall')) return [12.9758, 77.6050];
  if (key.includes('home')) return [12.9716, 77.5946];
  if (key.includes('office')) return [12.9718, 77.6413];
  // random around city center as fallback
  return [12.9716 + (Math.random() - 0.5) * 0.03, 77.5946 + (Math.random() - 0.5) * 0.03];
};

const toMapBoxCoord = (latLngArray) => `${latLngArray[1]},${latLngArray[0]}`;

let lastFareAmount = 0;

const estimateRoute = (pickup, dropoff) => {
  const p = pickupDropoffCoords(pickup, pickupInput);
  const d = pickupDropoffCoords(dropoff, dropoffInput);

  if (routeLine) {
    map.removeLayer(routeLine);
  }

  routeLine = L.polyline([p, d], { color: '#FA8120', weight: 5, opacity: 0.85 }).addTo(map);
  map.fitBounds(routeLine.getBounds(), { padding: [60, 60] });

  const distance = Math.sqrt(Math.pow(p[0] - d[0], 2) + Math.pow(p[1] - d[1], 2)) * 111;
  const etaMinutes = Math.max(5, Math.round((distance / 30) * 60));

  routeInfo.innerText = `Route: ${pickup} → ${dropoff} | Distance: ${distance.toFixed(1)} km | ETA: ${etaMinutes} min`;
  return { distance, etaMinutes };
};

const socket = io();
socket.on('driver-location', (driver) => {
  liveTrack.innerText = `Live: ${driver.name} at [${driver.lat.toFixed(4)}, ${driver.lng.toFixed(4)}]`;
  updateDriverMarker(driver);
});


document.getElementById('estimate').addEventListener('click', () => {
  const pickup = document.getElementById('pickup').value;
  const dropoff = document.getElementById('dropoff').value;

  if (!pickup || !dropoff) {
    estimateResult.innerText = 'Enter pickup and dropoff first.';
    return;
  }

  const pickupCoords = pickupDropoffCoords(pickup, pickupInput);
  const dropoffCoords = pickupDropoffCoords(dropoff, dropoffInput);
  const mapFrom = toMapBoxCoord(pickupCoords);
  const mapTo = toMapBoxCoord(dropoffCoords);

  fetch(`/route?from=${encodeURIComponent(mapFrom)}&to=${encodeURIComponent(mapTo)}`)
    .then((r) => r.json())
    .then((routeData) => {
      if (routeData.success && routeData.geometry) {
        drawGeoJSONRoute(routeData.geometry);
        const distanceKm = routeData.distance || 0;
        const etaMinutes = Math.round(routeData.duration) || 0;
        routeInfo.innerText = `Mapbox: ${distanceKm.toFixed(1)} km | ETA ${etaMinutes} min`;
        return { distance: distanceKm, etaMinutes };
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      const { distance, etaMinutes } = estimateRoute(pickup, dropoff);
      fetch(`/fare-estimate?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            estimateResult.innerText = data.error;
            return;
          }
          lastFareAmount = data.fare;
          document.getElementById('paymentAmount').value = `₹${lastFareAmount}`;
          estimateResult.innerText = `Fare approx ₹${data.fare} for ${distance.toFixed(1)} km, ETA ${etaMinutes} min`;
        });
    });
});

document.getElementById('bookRide').addEventListener('click', () => {
  const pickup = document.getElementById('pickup').value;
  const dropoff = document.getElementById('dropoff').value;
  if (!pickup || !dropoff) {
    bookingResult.innerText = 'Please provide pickup and dropoff locations.';
    return;
  }

  rideState.innerText = 'Booking...';

  const { distance, etaMinutes } = estimateRoute(pickup, dropoff);
  const fare = lastFareAmount || Math.max(70, Math.round((50 + distance * 14) * 100) / 100);

  requestWithAuth('/book', {
    method: 'POST',
    body: JSON.stringify({ pickup, dropoff, fare, etaMinutes, distanceKm: distance })
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.error) {
        bookingResult.innerText = data.error;
        rideState.innerText = 'Booking failed';
        return;
      }

      lastFareAmount = fare;
      document.getElementById('paymentAmount').value = `₹${lastFareAmount}`;
      loadRideHistory();
      bookingResult.innerText = `Booked ride ${data.ride.id} with ${data.ride.driver.name}. Status: ${data.ride.status} | ETA ${etaMinutes} min`;
      rideState.innerText = `Ride ${data.ride.id} matched with ${data.ride.driver.name}`;
    })
    .catch(() => {
      bookingResult.innerText = 'Network error while booking.';
      rideState.innerText = 'Booking failed';
    });
});

socket.on('ride-booked', (ride) => {
  bookingResult.innerText = `Ride ${ride.id} status update: ${ride.status} (driver ${ride.driver.name})`;
  rideState.innerText = `Current ride: ${ride.id} (${ride.status})`;
  showToast(`Ride ${ride.id} status: ${ride.status}`, 'info');
});

socket.on('payment-success', (data) => {
  showToast(`Payment succeeded for ₹${data.amount.toFixed(2)} (Intent ${data.id})`, 'success');
});

const payButton = document.getElementById('payButton');
const paymentResult = document.getElementById('paymentResult');
const paymentMethod = document.getElementById('paymentMethod');

payButton.addEventListener('click', () => {
  if (!lastFareAmount || lastFareAmount <= 0) {
    paymentResult.innerText = 'Please get a fare estimate first to set the payment amount.';
    return;
  }

  paymentResult.innerText = 'Creating payment intent...';
  fetch('/payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: lastFareAmount, method: paymentMethod.value })
  })
    .then((r) => r.json())
    .then((data) => {
      if (!data.success) {
        paymentResult.innerText = data.error || 'Failed to create payment intent';
        throw new Error('payment intent failed');
      }
      paymentResult.innerText = `Payment intent created: ${data.paymentIntent.id}. Confirming...`;
      return fetch('/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId: data.paymentIntent.id })
      });
    })
    .then((r) => r.json())
    .then((confirmResult) => {
      if (confirmResult.success) {
        paymentResult.innerText = `Payment succeeded with intent ${confirmResult.paymentIntent.id}`;
        rideState.innerText = 'Payment complete - enjoy your ride!';
      } else {
        paymentResult.innerText = confirmResult.error || 'Payment confirmation failed';
        rideState.innerText = 'Payment failed';
      }
    })
    .catch((err) => {
      if (err.message !== 'payment intent failed') {
        paymentResult.innerText = 'Error during payment flow.';
      }
      console.error('payment error', err);
    });
});


document.getElementById('submitRating').addEventListener('click', () => {
  const rideId = Number(document.getElementById('rideId').value);
  const driverId = Number(document.getElementById('driverId').value);
  const rating = Number(document.getElementById('rating').value);
  const comment = document.getElementById('comment').value;

  if (!rideId || !driverId || rating < 1 || rating > 5) {
    ratingResult.innerText = 'Please enter valid ride, driver and rating (1-5).';
    return;
  }

  fetch('/rate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rideId, driverId, rating, comment }) })
    .then((r) => r.json())
    .then((d) => {
      ratingResult.innerText = d.success ? 'Thank you for rating!' : JSON.stringify(d);
      if (d.success) {
        rideState.innerText = `Rated driver ${driverId} with ${rating}★`;
      }
    });
});
