const driverList = document.getElementById('drivers');
const liveTrack = document.getElementById('liveTrack');
const estimateResult = document.getElementById('estimateResult');
const bookingResult = document.getElementById('bookingResult');
const ratingResult = document.getElementById('ratingResult');
const rideState = document.getElementById('rideState');
const cancelRide = document.getElementById('cancelRide');
const profile = document.getElementById('profile');
const profileInfo = document.getElementById('profileInfo');
const profileLanguage = document.getElementById('profileLanguage');
const toggleTheme = document.getElementById('toggleTheme');
const enableNotifications = document.getElementById('enableNotifications');
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
let currentRideId = null;
let currentDriver = null;
let enableNotifs = localStorage.getItem('enableNotifications') === 'true';

const translations = {
  en: {
    appTitle: "Taxi Booking App",
    tagline: "Book faster, track clearly, pay securely, rate confidently.",
    loginRegister: "Login / Register",
    username: "Username",
    password: "Password",
    role: "Role",
    memberSince: "Member since",
    login: "Login",
    register: "Register",
    adminDashboard: "Admin Dashboard",
    refreshAdminRides: "Refresh Admin Ride List",
    quickActions: "Quick Actions",
    refreshDrivers: "Refresh Drivers",
    pickNearest: "Pick Nearest Driver",
    rideStatus: "Ride Status",
    noActiveBooking: "No active booking.",
    bookRide: "Book a Ride",
    pickupLocation: "Pickup location",
    dropoffLocation: "Dropoff location",
    getFareEstimate: "Get Fare Estimate",
    bookRideBtn: "Book Ride",
    liveTracking: "Live Driver Tracking",
    noRoute: "No route selected.",
    payment: "Payment",
    card: "Card (Stripe style)",
    upi: "UPI",
    wallet: "Wallet",
    amountAuto: "Amount (auto)",
    payNow: "Pay Now",
    rideHistory: "Ride History",
    refreshHistory: "Refresh History",
    rateDriver: "Rate Driver",
    rideId: "Ride ID",
    driverId: "Driver ID",
    rating: "Rating (1-5)",
    comment: "Comment",
    sendRating: "Send Rating",
    language: "Language",
    english: "English",
    hindi: "Hindi",
    kannada: "Kannada",
    welcome: "Welcome to Taxi Booking",
    displayMode: "Display Mode",
    toggleDark: "Toggle Dark Mode",
    signedInAs: "Signed in as {username} ({role})",
    notSignedIn: "Not signed in",
    loginFailed: "Login failed",
    registrationSuccessful: "Registration successful. Login now.",
    registrationFailed: "Registration failed",
    passwordTooShort: "Password must be at least 6 characters.",
    usernamePasswordRequired: "Username and password required.",
    welcomeBack: "Welcome back, {username}!",
    adminAccessRequired: "Admin access required.",
    failedToLoadAdminRides: "Failed to load admin rides.",
    enterPickupDropoff: "Enter pickup and dropoff first.",
    provideLocations: "Please provide pickup and dropoff locations.",
    booking: "Booking...",
    bookingFailed: "Booking failed",
    networkErrorBooking: "Network error while booking.",
    rideStatusUpdate: "Ride {id} status update: {status} (driver {driver})",
    currentRide: "Current ride: {id} ({status})",
    paymentSucceeded: "Payment succeeded for ₹{amount} (Intent {id})",
    getEstimateFirst: "Please get a fare estimate first to set the payment amount.",
    creatingPaymentIntent: "Creating payment intent...",
    paymentIntentCreated: "Payment intent created: {id}. Confirming...",
    paymentSucceededIntent: "Payment succeeded with intent {id}",
    paymentComplete: "Payment complete - enjoy your ride!",
    paymentFailed: "Payment failed",
    paymentConfirmationFailed: "Payment confirmation failed",
    errorDuringPayment: "Error during payment flow.",
    enterCardDetails: "Please enter card details.",
    invalidCardDetails: "Invalid card details.",
    enterValidRating: "Please enter valid ride, driver and rating (1-5).",
    thankYouRating: "Thank you for rating!",
    ratedDriver: "Rated driver {driverId} with {rating}★",
    nearestDriver: "Nearest driver is {name} ({car})",
    routeInfo: "Route: {pickup} → {dropoff} | Distance: {distance} km | ETA: {eta} min",
    mapboxRoute: "Mapbox: {distance} km | ETA {eta} min",
    fareEstimate: "Fare approx ₹{fare} for {distance} km, ETA {eta} min",
    bookedRide: "Booked ride {id} with {driver}. Status: {status} | ETA {eta} min",
    rideMatched: "Ride {id} matched with {driver}",
    driver: "Driver",
    rideCancelled: "Ride cancelled.",
    surgeApplied: " (Surge pricing applied)",
    // and more for messages
  hi: {
    appTitle: "टैक्सी बुकिंग ऐप",
    tagline: "तेजी से बुक करें, स्पष्ट रूप से ट्रैक करें, सुरक्षित रूप से भुगतान करें, आत्मविश्वास से रेट करें।",
    loginRegister: "लॉगिन / रजिस्टर",
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    role: "भूमिका",
    memberSince: "से सदस्य",
    login: "लॉगिन",
    register: "रजिस्टर",
    adminDashboard: "एडमिन डैशबोर्ड",
    refreshAdminRides: "एडमिन राइड सूची रिफ्रेश करें",
    quickActions: "त्वरित कार्य",
    refreshDrivers: "ड्राइवर रिफ्रेश करें",
    pickNearest: "निकटतम ड्राइवर चुनें",
    rideStatus: "राइड स्थिति",
    noActiveBooking: "कोई सक्रिय बुकिंग नहीं।",
    bookRide: "राइड बुक करें",
    pickupLocation: "पिकअप स्थान",
    dropoffLocation: "ड्रॉपऑफ स्थान",
    getFareEstimate: "किराया अनुमान प्राप्त करें",
    bookRideBtn: "राइड बुक करें",
    liveTracking: "लाइव ड्राइवर ट्रैकिंग",
    noRoute: "कोई रूट चयनित नहीं।",
    payment: "भुगतान",
    card: "कार्ड (स्ट्राइप स्टाइल)",
    upi: "यूपीआई",
    wallet: "वॉलेट",
    amountAuto: "राशि (ऑटो)",
    payNow: "अभी भुगतान करें",
    rideHistory: "राइड इतिहास",
    refreshHistory: "इतिहास रिफ्रेश करें",
    rateDriver: "ड्राइवर को रेट करें",
    rideId: "राइड आईडी",
    driverId: "ड्राइवर आईडी",
    rating: "रेटिंग (1-5)",
    comment: "टिप्पणी",
    sendRating: "रेटिंग भेजें",
    language: "भाषा",
    english: "अंग्रेजी",
    hindi: "हिंदी",
    kannada: "कन्नड़",
    welcome: "टैक्सी बुकिंग में आपका स्वागत है",
    displayMode: "प्रदर्शन मोड",
    toggleDark: "डार्क मोड टॉगल करें",
    signedInAs: "{username} ({role}) के रूप में साइन इन",
    notSignedIn: "साइन इन नहीं",
    loginFailed: "लॉगिन विफल",
    registrationSuccessful: "पंजीकरण सफल। अब लॉगिन करें।",
    registrationFailed: "पंजीकरण विफल",
    passwordTooShort: "पासवर्ड कम से कम 6 वर्ण का होना चाहिए।",
    usernamePasswordRequired: "उपयोगकर्ता नाम और पासवर्ड आवश्यक।",
    welcomeBack: "वापसी पर स्वागत, {username}!",
    adminAccessRequired: "एडमिन पहुंच आवश्यक।",
    failedToLoadAdminRides: "एडमिन राइड लोड करने में विफल।",
    enterPickupDropoff: "पहले पिकअप और ड्रॉपऑफ दर्ज करें।",
    provideLocations: "कृपया पिकअप और ड्रॉपऑफ स्थान प्रदान करें।",
    booking: "बुकिंग...",
    bookingFailed: "बुकिंग विफल",
    networkErrorBooking: "बुकिंग के दौरान नेटवर्क त्रुटि।",
    rideStatusUpdate: "राइड {id} स्थिति अपडेट: {status} (ड्राइवर {driver})",
    currentRide: "वर्तमान राइड: {id} ({status})",
    paymentSucceeded: "₹{amount} के लिए भुगतान सफल (इंटेंट {id})",
    getEstimateFirst: "भुगतान राशि निर्धारित करने के लिए पहले किराया अनुमान प्राप्त करें।",
    creatingPaymentIntent: "भुगतान इंटेंट बनाया जा रहा है...",
    paymentIntentCreated: "भुगतान इंटेंट बनाया गया: {id}। पुष्टि की जा रही है...",
    paymentSucceededIntent: "इंटेंट {id} के साथ भुगतान सफल",
    paymentComplete: "भुगतान पूरा - अपनी राइड का आनंद लें!",
    paymentFailed: "भुगतान विफल",
    paymentConfirmationFailed: "भुगतान पुष्टि विफल",
    errorDuringPayment: "भुगतान प्रवाह के दौरान त्रुटि।",
    enterCardDetails: "कृपया कार्ड विवरण दर्ज करें।",
    invalidCardDetails: "अमान्य कार्ड विवरण।",
    enterValidRating: "कृपया मान्य राइड, ड्राइवर और रेटिंग (1-5) दर्ज करें।",
    thankYouRating: "रेटिंग के लिए धन्यवाद!",
    ratedDriver: "ड्राइवर {driverId} को {rating}★ से रेट किया",
    nearestDriver: "निकटतम ड्राइवर {name} ({car}) है",
    routeInfo: "रूट: {pickup} → {dropoff} | दूरी: {distance} किमी | ईटीए: {eta} मिनट",
    mapboxRoute: "मैपबॉक्स: {distance} किमी | ईटीए {eta} मिनट",
    fareEstimate: "{distance} किमी के लिए किराया लगभग ₹{fare}, ईटीए {eta} मिनट",
    bookedRide: "{driver} के साथ राइड {id} बुक किया। स्थिति: {status} | ईटीए {eta} मिनट",
    rideMatched: "{driver} के साथ राइड {id} मिलान",
    driver: "ड्राइवर",
    rideCancelled: "राइड रद्द।",
    surgeApplied: " (सर्ज मूल्य निर्धारण लागू)",
    // and more for messages
  kn: {
    appTitle: "ಟ್ಯಾಕ್ಸಿ ಬುಕ್ಕಿಂಗ್ ಅಪ್ಲಿಕೇಶನ್",
    tagline: "ವೇಗವಾಗಿ ಬುಕ್ ಮಾಡಿ, ಸ್ಪಷ್ಟವಾಗಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ, ಸುರಕ್ಷಿತವಾಗಿ ಪಾವತಿ ಮಾಡಿ, ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ರೇಟ್ ಮಾಡಿ.",
    loginRegister: "ಲಾಗಿನ್ / ನೋಂದಣಿ",
    username: "ಬಳಕೆದಾರ ಹೆಸರು",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    role: "ಪಾತ್ರ",
    memberSince: "ಸದಸ್ಯರಾಗಿ",
    login: "ಲಾಗಿನ್",
    register: "ನೋಂದಣಿ",
    adminDashboard: "ಆಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    refreshAdminRides: "ಆಡ್ಮಿನ್ ರೈಡ್ ಪಟ್ಟಿ ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    refreshDrivers: "ಡ್ರೈವರ್‌ಗಳನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    pickNearest: "ಹತ್ತಿರದ ಡ್ರೈವರ್ ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    rideStatus: "ರೈಡ್ ಸ್ಥಿತಿ",
    noActiveBooking: "ಯಾವುದೇ ಸಕ್ರಿಯ ಬುಕ್ಕಿಂಗ್ ಇಲ್ಲ.",
    bookRide: "ರೈಡ್ ಬುಕ್ ಮಾಡಿ",
    pickupLocation: "ಪಿಕ್‌ಅಪ್ ಸ್ಥಳ",
    dropoffLocation: "ಡ್ರಾಪ್‌ಆಫ್ ಸ್ಥಳ",
    getFareEstimate: "ಫೇರ್ ಅಂದಾಜು ಪಡೆಯಿರಿ",
    bookRideBtn: "ರೈಡ್ ಬುಕ್ ಮಾಡಿ",
    liveTracking: "ಲೈವ್ ಡ್ರೈವರ್ ಟ್ರ್ಯಾಕಿಂಗ್",
    noRoute: "ಯಾವುದೇ ರೂಟ್ ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ.",
    payment: "ಪಾವತಿ",
    card: "ಕಾರ್ಡ್ (ಸ್ಟ್ರೈಪ್ ಶೈಲಿ)",
    upi: "ಯೂಪಿಐ",
    wallet: "ವಾಲೆಟ್",
    amountAuto: "ಮೊತ್ತ (ಆಟೋ)",
    payNow: "ಈಗ ಪಾವತಿ ಮಾಡಿ",
    rideHistory: "ರೈಡ್ ಇತಿಹಾಸ",
    refreshHistory: "ಇತಿಹಾಸವನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    rateDriver: "ಡ್ರೈವರ್ ಅನ್ನು ರೇಟ್ ಮಾಡಿ",
    rideId: "ರೈಡ್ ಐಡಿ",
    driverId: "ಡ್ರೈವರ್ ಐಡಿ",
    rating: "ರೇಟಿಂಗ್ (1-5)",
    comment: "ಕಾಮೆಂಟ್",
    sendRating: "ರೇಟಿಂಗ್ ಕಳುಹಿಸಿ",
    language: "ಭಾಷೆ",
    english: "ಇಂಗ್ಲಿಷ್",
    hindi: "ಹಿಂದಿ",
    kannada: "ಕನ್ನಡ",
    welcome: "ಟ್ಯಾಕ್ಸಿ ಬುಕ್ಕಿಂಗ್‌ಗೆ ಸ್ವಾಗತ",
    displayMode: "ಪ್ರದರ್ಶನ ಮೋಡ್",
    toggleDark: "ಡಾರ್ಕ್ ಮೋಡ್ ಟಾಗಲ್ ಮಾಡಿ",
    signedInAs: "{username} ({role}) ಆಗಿ ಸೈನ್ ಇನ್ ಮಾಡಲಾಗಿದೆ",
    notSignedIn: "ಸೈನ್ ಇನ್ ಮಾಡಲಾಗಿಲ್ಲ",
    loginFailed: "ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ",
    registrationSuccessful: "ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ. ಈಗ ಲಾಗಿನ್ ಮಾಡಿ.",
    registrationFailed: "ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ",
    passwordTooShort: "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು.",
    usernamePasswordRequired: "ಬಳಕೆದಾರ ಹೆಸರು ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯ.",
    welcomeBack: "ಮರಳಿ ಸ್ವಾಗತ, {username}!",
    adminAccessRequired: "ಆಡ್ಮಿನ್ ಪ್ರವೇಶ ಅಗತ್ಯ.",
    failedToLoadAdminRides: "ಆಡ್ಮಿನ್ ರೈಡ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ.",
    enterPickupDropoff: "ಮೊದಲು ಪಿಕ್‌ಅಪ್ ಮತ್ತು ಡ್ರಾಪ್‌ಆಫ್ ನಮೂದಿಸಿ.",
    provideLocations: "ದಯವಿಟ್ಟು ಪಿಕ್‌ಅಪ್ ಮತ್ತು ಡ್ರಾಪ್‌ಆಫ್ ಸ್ಥಳಗಳನ್ನು ಒದಗಿಸಿ.",
    booking: "ಬುಕ್ಕಿಂಗ್...",
    bookingFailed: "ಬುಕ್ಕಿಂಗ್ ವಿಫಲವಾಗಿದೆ",
    networkErrorBooking: "ಬುಕ್ಕಿಂಗ್ ಸಮಯದಲ್ಲಿ ನೆಟ್‌ವರ್ಕ್ ದೋಷ.",
    rideStatusUpdate: "ರೈಡ್ {id} ಸ್ಥಿತಿ ನವೀಕರಣ: {status} (ಡ್ರೈವರ್ {driver})",
    currentRide: "ಪ್ರಸ್ತುತ ರೈಡ್: {id} ({status})",
    paymentSucceeded: "₹{amount} ಗಾಗಿ ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ (ಇಂಟೆಂಟ್ {id})",
    getEstimateFirst: "ಪಾವತಿ ಮೊತ್ತವನ್ನು ಹೊಂದಿಸಲು ಮೊದಲು ಫೇರ್ ಅಂದಾಜು ಪಡೆಯಿರಿ.",
    creatingPaymentIntent: "ಪಾವತಿ ಇಂಟೆಂಟ್ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    paymentIntentCreated: "ಪಾವತಿ ಇಂಟೆಂಟ್ ರಚಿಸಲಾಗಿದೆ: {id}. ದೃಢೀಕರಿಸಲಾಗುತ್ತಿದೆ...",
    paymentSucceededIntent: "ಇಂಟೆಂಟ್ {id} ನೊಂದಿಗೆ ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ",
    paymentComplete: "ಪಾವತಿ ಪೂರ್ಣ - ನಿಮ್ಮ ರೈಡ್ ಅನ್ನು ಆನಂದಿಸಿ!",
    paymentFailed: "ಪಾವತಿ ವಿಫಲವಾಗಿದೆ",
    paymentConfirmationFailed: "ಪಾವತಿ ದೃಢೀಕರಣ ವಿಫಲವಾಗಿದೆ",
    errorDuringPayment: "ಪಾವತಿ ಹರಿವಿನಲ್ಲಿ ದೋಷ.",
    enterCardDetails: "ದಯವಿಟ್ಟು ಕಾರ್ಡ್ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.",
    invalidCardDetails: "ಅಮಾನ್ಯ ಕಾರ್ಡ್ ವಿವರಗಳು.",
    enterValidRating: "ದಯವಿಟ್ಟು ಮಾನ್ಯ ರೈಡ್, ಡ್ರೈವರ್ ಮತ್ತು ರೇಟಿಂಗ್ (1-5) ನಮೂದಿಸಿ.",
    thankYouRating: "ರೇಟಿಂಗ್‌ಗಾಗಿ ಧನ್ಯವಾದಗಳು!",
    ratedDriver: "ಡ್ರೈವರ್ {driverId} ಅನ್ನು {rating}★ ನೊಂದಿಗೆ ರೇಟ್ ಮಾಡಲಾಗಿದೆ",
    nearestDriver: "ಹತ್ತಿರದ ಡ್ರೈವರ್ {name} ({car}) ಆಗಿದೆ",
    routeInfo: "ರೂಟ್: {pickup} → {dropoff} | ದೂರ: {distance} ಕಿಮೀ | ಇಟಿಎ: {eta} ನಿಮಿಷ",
    mapboxRoute: "ಮ್ಯಾಪ್‌ಬಾಕ್ಸ್: {distance} ಕಿಮೀ | ಇಟಿಎ {eta} ನಿಮಿಷ",
    fareEstimate: "{distance} ಕಿಮೀಗೆ ಫೇರ್ ಅಂದಾಜು ₹{fare}, ಇಟಿಎ {eta} ನಿಮಿಷ",
    bookedRide: "{driver} ನೊಂದಿಗೆ ರೈಡ್ {id} ಬುಕ್ ಮಾಡಲಾಗಿದೆ. ಸ್ಥಿತಿ: {status} | ಇಟಿಎ {eta} ನಿಮಿಷ",
    rideMatched: "{driver} ನೊಂದಿಗೆ ರೈಡ್ {id} ಹೊಂದಾಣಿಕೆಯಾಗಿದೆ",
    liveDriver: "ಲೈವ್: {name} [{lat}, {lng}] ನಲ್ಲಿ",
    driver: "ಡ್ರೈವರ್",
    rideCancelled: "ರೈಡ್ ರದ್ದುಗೊಂಡಿದೆ.",
    surgeApplied: " (ಸರ್ಜ್ ಬೆಲೆ ನಿಯೋಗಿಸಲಾಗಿದೆ)"
  }
};

const translations = {
  en: {
    appTitle: "Taxi Booking App",
    tagline: "Book faster, track clearly, pay securely, rate confidently.",
    loginRegister: "Login / Register",
    username: "Username",
    password: "Password",
    login: "Login",
    register: "Register",
    adminDashboard: "Admin Dashboard",
    refreshAdminRides: "Refresh Admin Ride List",
    quickActions: "Quick Actions",
    refreshDrivers: "Refresh Drivers",
    pickNearest: "Pick Nearest Driver",
    rideStatus: "Ride Status",
    noActiveBooking: "No active booking.",
    bookRide: "Book a Ride",
    pickupLocation: "Pickup location",
    dropoffLocation: "Dropoff location",
    getFareEstimate: "Get Fare Estimate",
    bookRideBtn: "Book Ride",
    liveTracking: "Live Driver Tracking",
    noRoute: "No route selected.",
    payment: "Payment",
    card: "Card (Stripe style)",
    upi: "UPI",
    wallet: "Wallet",
    amountAuto: "Amount (auto)",
    payNow: "Pay Now",
    rideHistory: "Ride History",
    refreshHistory: "Refresh History",
    rateDriver: "Rate Driver",
    rideId: "Ride ID",
    driverId: "Driver ID",
    rating: "Rating (1-5)",
    comment: "Comment",
    sendRating: "Send Rating",
    language: "Language",
    english: "English",
    hindi: "Hindi",
    kannada: "Kannada",
    tamil: "Tamil",
    welcome: "Welcome to Taxi Booking",
    displayMode: "Display Mode",
    toggleDark: "Toggle Dark Mode",
    signedInAs: "Signed in as {username} ({role})",
    notSignedIn: "Not signed in",
    loginFailed: "Login failed",
    registrationSuccessful: "Registration successful. Login now.",
    registrationFailed: "Registration failed",
    passwordTooShort: "Password must be at least 6 characters.",
    usernamePasswordRequired: "Username and password required.",
    welcomeBack: "Welcome back, {username}!",
    adminAccessRequired: "Admin access required.",
    failedToLoadAdminRides: "Failed to load admin rides.",
    enterPickupDropoff: "Enter pickup and dropoff first.",
    provideLocations: "Please provide pickup and dropoff locations.",
    booking: "Booking...",
    bookingFailed: "Booking failed",
    networkErrorBooking: "Network error while booking.",
    rideStatusUpdate: "Ride {id} status update: {status} (driver {driver})",
    currentRide: "Current ride: {id} ({status})",
    paymentSucceeded: "Payment succeeded for ₹{amount} (Intent {id})",
    getEstimateFirst: "Please get a fare estimate first to set the payment amount.",
    creatingPaymentIntent: "Creating payment intent...",
    paymentIntentCreated: "Payment intent created: {id}. Confirming...",
    paymentSucceededIntent: "Payment succeeded with intent {id}",
    paymentComplete: "Payment complete - enjoy your ride!",
    paymentFailed: "Payment failed",
    paymentConfirmationFailed: "Payment confirmation failed",
    errorDuringPayment: "Error during payment flow.",
    enterCardDetails: "Please enter card details.",
    invalidCardDetails: "Invalid card details.",
    enterValidRating: "Please enter valid ride, driver and rating (1-5).",
    thankYouRating: "Thank you for rating!",
    ratedDriver: "Rated driver {driverId} with {rating}★",
    nearestDriver: "Nearest driver is {name} ({car})",
    routeInfo: "Route: {pickup} → {dropoff} | Distance: {distance} km | ETA: {eta} min",
    mapboxRoute: "Mapbox: {distance} km | ETA {eta} min",
    fareEstimate: "Fare approx ₹{fare} for {distance} km, ETA {eta} min",
    bookedRide: "Booked ride {id} with {driver}. Status: {status} | ETA {eta} min",
    rideMatched: "Ride {id} matched with {driver}",
    liveDriver: "Live: {name} at [{lat}, {lng}]",
    driver: "Driver",
    rideCancelled: "Ride cancelled.",
    surgeApplied: " (Surge pricing applied)",
    role: "Role",
    memberSince: "Member since"
  },
  hi: {
    appTitle: "टैक्सी बुकिंग ऐप",
    tagline: "तेजी से बुक करें, स्पष्ट रूप से ट्रैक करें, सुरक्षित रूप से भुगतान करें, आत्मविश्वास से रेट करें।",
    loginRegister: "लॉगिन / रजिस्टर",
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    login: "लॉगिन",
    register: "रजिस्टर",
    adminDashboard: "एडमिन डैशबोर्ड",
    refreshAdminRides: "एडमिन राइड सूची रिफ्रेश करें",
    quickActions: "त्वरित कार्य",
    refreshDrivers: "ड्राइवर रिफ्रेश करें",
    pickNearest: "निकटतम ड्राइवर चुनें",
    rideStatus: "राइड स्थिति",
    noActiveBooking: "कोई सक्रिय बुकिंग नहीं।",
    bookRide: "राइड बुक करें",
    pickupLocation: "पिकअप स्थान",
    dropoffLocation: "ड्रॉपऑफ स्थान",
    getFareEstimate: "किराया अनुमान प्राप्त करें",
    bookRideBtn: "राइड बुक करें",
    liveTracking: "लाइव ड्राइवर ट्रैकिंग",
    noRoute: "कोई रूट चयनित नहीं।",
    payment: "भुगतान",
    card: "कार्ड (स्ट्राइप स्टाइल)",
    upi: "यूपीआई",
    wallet: "वॉलेट",
    amountAuto: "राशि (ऑटो)",
    payNow: "अभी भुगतान करें",
    rideHistory: "राइड इतिहास",
    refreshHistory: "इतिहास रिफ्रेश करें",
    rateDriver: "ड्राइवर को रेट करें",
    rideId: "राइड आईडी",
    driverId: "ड्राइवर आईडी",
    rating: "रेटिंग (1-5)",
    comment: "टिप्पणी",
    sendRating: "रेटिंग भेजें",
    language: "भाषा",
    english: "अंग्रेजी",
    hindi: "हिंदी",
    kannada: "कन्नड़",
    tamil: "तमिल",
    welcome: "टैक्सी बुकिंग में आपका स्वागत है",
    displayMode: "प्रदर्शन मोड",
    toggleDark: "डार्क मोड टॉगल करें",
    signedInAs: "{username} ({role}) के रूप में साइन इन",
    notSignedIn: "साइन इन नहीं",
    loginFailed: "लॉगिन विफल",
    registrationSuccessful: "पंजीकरण सफल। अब लॉगिन करें।",
    registrationFailed: "पंजीकरण विफल",
    passwordTooShort: "पासवर्ड कम से कम 6 वर्ण का होना चाहिए।",
    usernamePasswordRequired: "उपयोगकर्ता नाम और पासवर्ड आवश्यक।",
    welcomeBack: "वापसी पर स्वागत, {username}!",
    adminAccessRequired: "एडमिन पहुंच आवश्यक।",
    failedToLoadAdminRides: "एडमिन राइड लोड करने में विफल।",
    enterPickupDropoff: "पहले पिकअप और ड्रॉपऑफ दर्ज करें।",
    provideLocations: "कृपया पिकअप और ड्रॉपऑफ स्थान प्रदान करें।",
    booking: "बुकिंग...",
    bookingFailed: "बुकिंग विफल",
    networkErrorBooking: "बुकिंग के दौरान नेटवर्क त्रुटि।",
    rideStatusUpdate: "राइड {id} स्थिति अपडेट: {status} (ड्राइवर {driver})",
    currentRide: "वर्तमान राइड: {id} ({status})",
    paymentSucceeded: "₹{amount} के लिए भुगतान सफल (इंटेंट {id})",
    getEstimateFirst: "भुगतान राशि निर्धारित करने के लिए पहले किराया अनुमान प्राप्त करें।",
    creatingPaymentIntent: "भुगतान इंटेंट बनाया जा रहा है...",
    paymentIntentCreated: "भुगतान इंटेंट बनाया गया: {id}। पुष्टि की जा रही है...",
    paymentSucceededIntent: "इंटेंट {id} के साथ भुगतान सफल",
    paymentComplete: "भुगतान पूरा - अपनी राइड का आनंद लें!",
    paymentFailed: "भुगतान विफल",
    paymentConfirmationFailed: "भुगतान पुष्टि विफल",
    errorDuringPayment: "भुगतान प्रवाह के दौरान त्रुटि।",
    enterCardDetails: "कृपया कार्ड विवरण दर्ज करें।",
    invalidCardDetails: "अमान्य कार्ड विवरण।",
    enterValidRating: "कृपया मान्य राइड, ड्राइवर और रेटिंग (1-5) दर्ज करें।",
    thankYouRating: "रेटिंग के लिए धन्यवाद!",
    ratedDriver: "ड्राइवर {driverId} को {rating}★ से रेट किया",
    nearestDriver: "निकटतम ड्राइवर {name} ({car}) है",
    routeInfo: "रूट: {pickup} → {dropoff} | दूरी: {distance} किमी | ईटीए: {eta} मिनट",
    mapboxRoute: "मैपबॉक्स: {distance} किमी | ईटीए {eta} मिनट",
    fareEstimate: "{distance} किमी के लिए किराया अनुमान ₹{fare}, ईटीए {eta} मिनट",
    bookedRide: "{driver} के साथ राइड {id} बुक किया। स्थिति: {status} | ईटीए {eta} मिनट",
    rideMatched: "{driver} के साथ राइड {id} मिलान",
    liveDriver: "लाइव: {name} [{lat}, {lng}] पर",
    driver: "ड्राइवर",
    rideCancelled: "राइड रद्द।",
    surgeApplied: " (सर्ज मूल्य निर्धारण लागू)",
    role: "भूमिका",
    memberSince: "से सदस्य"
  },
  kn: {
    appTitle: "ಟ್ಯಾಕ್ಸಿ ಬುಕ್ಕಿಂಗ್ ಅಪ್ಲಿಕೇಶನ್",
    tagline: "ವೇಗವಾಗಿ ಬುಕ್ ಮಾಡಿ, ಸ್ಪಷ್ಟವಾಗಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ, ಸುರಕ್ಷಿತವಾಗಿ ಪಾವತಿ ಮಾಡಿ, ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ರೇಟ್ ಮಾಡಿ.",
    loginRegister: "ಲಾಗಿನ್ / ನೋಂದಣಿ",
    username: "ಬಳಕೆದಾರ ಹೆಸರು",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    login: "ಲಾಗಿನ್",
    register: "ನೋಂದಣಿ",
    adminDashboard: "ಆಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    refreshAdminRides: "ಆಡ್ಮಿನ್ ರೈಡ್ ಪಟ್ಟಿ ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    refreshDrivers: "ಡ್ರೈವರ್‌ಗಳನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    pickNearest: "ಹತ್ತಿರದ ಡ್ರೈವರ್ ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    rideStatus: "ರೈಡ್ ಸ್ಥಿತಿ",
    noActiveBooking: "ಯಾವುದೇ ಸಕ್ರಿಯ ಬುಕ್ಕಿಂಗ್ ಇಲ್ಲ.",
    bookRide: "ರೈಡ್ ಬುಕ್ ಮಾಡಿ",
    pickupLocation: "ಪಿಕ್‌ಅಪ್ ಸ್ಥಳ",
    dropoffLocation: "ಡ್ರಾಪ್‌ಆಫ್ ಸ್ಥಳ",
    getFareEstimate: "ಫೇರ್ ಅಂದಾಜು ಪಡೆಯಿರಿ",
    bookRideBtn: "ರೈಡ್ ಬುಕ್ ಮಾಡಿ",
    liveTracking: "ಲೈವ್ ಡ್ರೈವರ್ ಟ್ರ್ಯಾಕಿಂಗ್",
    noRoute: "ಯಾವುದೇ ರೂಟ್ ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ.",
    payment: "ಪಾವತಿ",
    card: "ಕಾರ್ಡ್ (ಸ್ಟ್ರೈಪ್ ಶೈಲಿ)",
    upi: "ಯೂಪಿಐ",
    wallet: "ವಾಲೆಟ್",
    amountAuto: "ಮೊತ್ತ (ಆಟೋ)",
    payNow: "ಈಗ ಪಾವತಿ ಮಾಡಿ",
    rideHistory: "ರೈಡ್ ಇತಿಹಾಸ",
    refreshHistory: "ಇತಿಹಾಸವನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    rateDriver: "ಡ್ರೈವರ್ ಅನ್ನು ರೇಟ್ ಮಾಡಿ",
    rideId: "ರೈಡ್ ಐಡಿ",
    driverId: "ಡ್ರೈವರ್ ಐಡಿ",
    rating: "ರೇಟಿಂಗ್ (1-5)",
    comment: "ಕಾಮೆಂಟ್",
    sendRating: "ರೇಟಿಂಗ್ ಕಳುಹಿಸಿ",
    language: "ಭಾಷೆ",
    english: "ಇಂಗ್ಲಿಷ್",
    hindi: "ಹಿಂದಿ",
    kannada: "ಕನ್ನಡ",
    tamil: "ತಮಿಳು",
    welcome: "ಟ್ಯಾಕ್ಸಿ ಬುಕ್ಕಿಂಗ್‌ಗೆ ಸ್ವಾಗತ",
    displayMode: "ಪ್ರದರ್ಶನ ಮೋಡ್",
    toggleDark: "ಡಾರ್ಕ್ ಮೋಡ್ ಟಾಗಲ್ ಮಾಡಿ",
    signedInAs: "{username} ({role}) ಆಗಿ ಸೈನ್ ಇನ್ ಮಾಡಲಾಗಿದೆ",
    notSignedIn: "ಸೈನ್ ಇನ್ ಮಾಡಲಾಗಿಲ್ಲ",
    loginFailed: "ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ",
    registrationSuccessful: "ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ. ಈಗ ಲಾಗಿನ್ ಮಾಡಿ.",
    registrationFailed: "ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ",
    passwordTooShort: "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು.",
    usernamePasswordRequired: "ಬಳಕೆದಾರ ಹೆಸರು ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯ.",
    welcomeBack: "ಮರಳಿ ಸ್ವಾಗತ, {username}!",
    adminAccessRequired: "ಆಡ್ಮಿನ್ ಪ್ರವೇಶ ಅಗತ್ಯ.",
    failedToLoadAdminRides: "ಆಡ್ಮಿನ್ ರೈಡ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ.",
    enterPickupDropoff: "ಮೊದಲು ಪಿಕ್‌ಅಪ್ ಮತ್ತು ಡ್ರಾಪ್‌ಆಫ್ ನಮೂದಿಸಿ.",
    provideLocations: "ದಯವಿಟ್ಟು ಪಿಕ್‌ಅಪ್ ಮತ್ತು ಡ್ರಾಪ್‌ಆಫ್ ಸ್ಥಳಗಳನ್ನು ಒದಗಿಸಿ.",
    booking: "ಬುಕ್ಕಿಂಗ್...",
    bookingFailed: "ಬುಕ್ಕಿಂಗ್ ವಿಫಲವಾಗಿದೆ",
    networkErrorBooking: "ಬುಕ್ಕಿಂಗ್ ಸಮಯದಲ್ಲಿ ನೆಟ್‌ವರ್ಕ್ ದೋಷ.",
    rideStatusUpdate: "ರೈಡ್ {id} ಸ್ಥಿತಿ ನವೀಕರಣ: {status} (ಡ್ರೈವರ್ {driver})",
    currentRide: "ಪ್ರಸ್ತುತ ರೈಡ್: {id} ({status})",
    paymentSucceeded: "₹{amount} ಗಾಗಿ ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ (ಇಂಟೆಂಟ್ {id})",
    getEstimateFirst: "ಪಾವತಿ ಮೊತ್ತವನ್ನು ಹೊಂದಿಸಲು ಮೊದಲು ಫೇರ್ ಅಂದಾಜು ಪಡೆಯಿರಿ.",
    creatingPaymentIntent: "ಪಾವತಿ ಇಂಟೆಂಟ್ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    paymentIntentCreated: "ಪಾವತಿ ಇಂಟೆಂಟ್ ರಚಿಸಲಾಗಿದೆ: {id}. ದೃಢೀಕರಿಸಲಾಗುತ್ತಿದೆ...",
    paymentSucceededIntent: "ಇಂಟೆಂಟ್ {id} ನೊಂದಿಗೆ ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ",
    paymentComplete: "ಪಾವತಿ ಪೂರ್ಣ - ನಿಮ್ಮ ರೈಡ್ ಅನ್ನು ಆನಂದಿಸಿ!",
    paymentFailed: "ಪಾವತಿ ವಿಫಲವಾಗಿದೆ",
    paymentConfirmationFailed: "ಪಾವತಿ ದೃಢೀಕರಣ ವಿಫಲವಾಗಿದೆ",
    errorDuringPayment: "ಪಾವತಿ ಹರಿವಿನಲ್ಲಿ ದೋಷ.",
    enterCardDetails: "ದಯವಿಟ್ಟು ಕಾರ್ಡ್ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.",
    invalidCardDetails: "ಅಮಾನ್ಯ ಕಾರ್ಡ್ ವಿವರಗಳು.",
    enterValidRating: "ದಯವಿಟ್ಟು ಮಾನ್ಯ ರೈಡ್, ಡ್ರೈವರ್ ಮತ್ತು ರೇಟಿಂಗ್ (1-5) ನಮೂದಿಸಿ.",
    thankYouRating: "ರೇಟಿಂಗ್‌ಗಾಗಿ ಧನ್ಯವಾದಗಳು!",
    ratedDriver: "ಡ್ರೈವರ್ {driverId} ಅನ್ನು {rating}★ ನೊಂದಿಗೆ ರೇಟ್ ಮಾಡಲಾಗಿದೆ",
    nearestDriver: "ಹತ್ತಿರದ ಡ್ರೈವರ್ {name} ({car}) ಆಗಿದೆ",
    routeInfo: "ರೂಟ್: {pickup} → {dropoff} | ದೂರ: {distance} ಕಿಮೀ | ಇಟಿಎ: {eta} ನಿಮಿಷ",
    mapboxRoute: "ಮ್ಯಾಪ್‌ಬಾಕ್ಸ್: {distance} ಕಿಮೀ | ಇಟಿಎ {eta} ನಿಮಿಷ",
    fareEstimate: "{distance} ಕಿಮೀಗೆ ಫೇರ್ ಅಂದಾಜು ₹{fare}, ಇಟಿಎ {eta} ನಿಮಿಷ",
    bookedRide: "{driver} ನೊಂದಿಗೆ ರೈಡ್ {id} ಬುಕ್ ಮಾಡಲಾಗಿದೆ. ಸ್ಥಿತಿ: {status} | ಇಟಿಎ {eta} ನಿಮಿಷ",
    rideMatched: "{driver} ನೊಂದಿಗೆ ರೈಡ್ {id} ಹೊಂದಾಣಿಕೆಯಾಗಿದೆ",
    liveDriver: "ಲೈವ್: {name} [{lat}, {lng}] ನಲ್ಲಿ",
    driver: "ಡ್ರೈವರ್",
    rideCancelled: "ರೈಡ್ ರದ್ದುಗೊಂಡಿದೆ.",
    surgeApplied: " (ಸರ್ಜ್ ಬೆಲೆ ನಿಯೋಗಿಸಲಾಗಿದೆ)",
    role: "ಪಾತ್ರ",
    memberSince: "ಸದಸ್ಯರಾಗಿ"
  },
  ta: {
    appTitle: "டாக்ஸி புக்கிங் ஆப்",
    tagline: "விரைவாக புக் செய்யுங்கள், தெளிவாக கண்காணிக்கவும், பாதுகாப்பாக செலுத்துங்கள், நம்பிக்கையுடன் மதிப்பிடுங்கள்.",
    loginRegister: "லாகின் / பதிவு",
    username: "பயனர் பெயர்",
    password: "கடவுச்சொல்",
    login: "லாகின்",
    register: "பதிவு",
    adminDashboard: "நிர்வாக டாஷ்போர்ட்",
    refreshAdminRides: "நிர்வாக ரைட் பட்டியலை புதுப்பிக்கவும்",
    quickActions: "விரைவு செயல்கள்",
    refreshDrivers: "டிரைவர்களை புதுப்பிக்கவும்",
    pickNearest: "அருகிலுள்ள டிரைவரை தேர்ந்தெடுக்கவும்",
    rideStatus: "ரைட் நிலை",
    noActiveBooking: "செயலில் உள்ள புக்கிங் இல்லை.",
    bookRide: "ரைட் புக் செய்யவும்",
    pickupLocation: "பிக் அப் இடம்",
    dropoffLocation: "டிராப் ஆஃப் இடம்",
    getFareEstimate: "கட்டண மதிப்பீட்டைப் பெறுங்கள்",
    bookRideBtn: "ரைட் புக் செய்யவும்",
    liveTracking: "லைவ் டிரைவர் டிராக்கிங்",
    noRoute: "ரூட் தேர்ந்தெடுக்கப்படவில்லை.",
    payment: "கட்டணம்",
    card: "கார்ட் (ஸ்ட்ரைப் ஸ்டைல்)",
    upi: "யூபிஐ",
    wallet: "வாலட்",
    amountAuto: "தொகை (ஆட்டோ)",
    payNow: "இப்போது செலுத்துங்கள்",
    rideHistory: "ரைட் வரலாறு",
    refreshHistory: "வரலாற்றை புதுப்பிக்கவும்",
    rateDriver: "டிரைவரை மதிப்பிடுங்கள்",
    rideId: "ரைட் ஐடி",
    driverId: "டிரைவர் ஐடி",
    rating: "மதிப்பீடு (1-5)",
    comment: "கருத்து",
    sendRating: "மதிப்பீட்டை அனுப்புங்கள்",
    language: "மொழி",
    english: "ஆங்கிலம்",
    hindi: "இந்தி",
    kannada: "கன்னடம்",
    tamil: "தமிழ்",
    welcome: "டாக்ஸி புக்கிங்கிற்கு வரவேற்கிறோம்",
    displayMode: "காட்சி முறை",
    toggleDark: "டார்க் மோட் மாற்றவும்",
    signedInAs: "{username} ({role}) ஆக உள்நுழைந்துள்ளீர்கள்",
    notSignedIn: "உள்நுழையவில்லை",
    loginFailed: "லாகின் தோல்வியடைந்தது",
    registrationSuccessful: "பதிவு வெற்றிகரமாக. இப்போது லாகின் செய்யுங்கள்.",
    registrationFailed: "பதிவு தோல்வியடைந்தது",
    passwordTooShort: "கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.",
    usernamePasswordRequired: "பயனர் பெயர் மற்றும் கடவுச்சொல் தேவை.",
    welcomeBack: "மீண்டும் வரவேற்கிறோம், {username}!",
    adminAccessRequired: "நிர்வாக அணுகல் தேவை.",
    failedToLoadAdminRides: "நிர்வாக ரைட்களை ஏற்றுவதில் தோல்வி.",
    enterPickupDropoff: "முதலில் பிக் அப் மற்றும் டிராப் ஆஃப் உள்ளீடு செய்யுங்கள்.",
    provideLocations: "பிக் அப் மற்றும் டிராப் ஆஃப் இடங்களை வழங்கவும்.",
    booking: "புக்கிங்...",
    bookingFailed: "புக்கிங் தோல்வியடைந்தது",
    networkErrorBooking: "புக்கிங் செய்யும் போது நெட்வொர்க் பிழை.",
    rideStatusUpdate: "ரைட் {id} நிலை புதுப்பித்தல்: {status} (டிரைவர் {driver})",
    currentRide: "தற்போதைய ரைட்: {id} ({status})",
    paymentSucceeded: "₹{amount} க்கு கட்டணம் வெற்றிகரமாக (இன்டென்ட் {id})",
    getEstimateFirst: "கட்டண தொகையை அமைக்க முதலில் கட்டண மதிப்பீட்டைப் பெறுங்கள்.",
    creatingPaymentIntent: "கட்டண இன்டென்ட் உருவாக்கப்படுகிறது...",
    paymentIntentCreated: "கட்டண இன்டென்ட் உருவாக்கப்பட்டது: {id}. உறுதிப்படுத்தப்படுகிறது...",
    paymentSucceededIntent: "இன்டென்ட் {id} உடன் கட்டணம் வெற்றிகரமாக",
    paymentComplete: "கட்டணம் முழுமையடைந்தது - உங்கள் ரைட்டை அனுபவிக்கவும்!",
    paymentFailed: "கட்டணம் தோல்வியடைந்தது",
    paymentConfirmationFailed: "கட்டண உறுதிப்படுத்தல் தோல்வியடைந்தது",
    errorDuringPayment: "கட்டண ஓட்டத்தில் பிழை.",
    enterCardDetails: "கார்ட் விவரங்களை உள்ளீடு செய்யுங்கள்.",
    invalidCardDetails: "தவறான கார்ட் விவரங்கள்.",
    enterValidRating: "சரியான ரைட், டிரைவர் மற்றும் மதிப்பீடு (1-5) உள்ளீடு செய்யுங்கள்.",
    thankYouRating: "மதிப்பீட்டுக்கு நன்றி!",
    ratedDriver: "டிரைவர் {driverId} {rating}★ உடன் மதிப்பிடப்பட்டது",
    nearestDriver: "அருகிலுள்ள டிரைவர் {name} ({car})",
    routeInfo: "ரூட்: {pickup} → {dropoff} | தூரம்: {distance} கிமீ | ஈடிஏ: {eta} நிமிடம்",
    mapboxRoute: "மேப்பாக்ஸ்: {distance} கிமீ | ஈடிஏ {eta} நிமிடம்",
    fareEstimate: "{distance} கிமீக்கு கட்டண மதிப்பீடு ₹{fare}, ஈடிஏ {eta} நிமிடம்",
    bookedRide: "{driver} உடன் ரைட் {id} புக் செய்யப்பட்டது. நிலை: {status} | ஈடிஏ {eta} நிமிடம்",
    rideMatched: "{driver} உடன் ரைட் {id} பொருந்துகிறது",
    liveDriver: "லைவ்: {name} [{lat}, {lng}] இல்",
    driver: "டிரைவர்",
    rideCancelled: "ரைட் ரத்து செய்யப்பட்டது.",
    surgeApplied: " (சர்ஜ் விலை நிர்ணயம் பயன்படுத்தப்பட்டது)",
    role: "பங்கு",
    memberSince: "உறுப்பினராக இருந்து"
  }
};

let currentLang = 'en';

const translate = (key, params = {}) => {
  let text = translations[currentLang][key] || translations.en[key] || key;
  Object.keys(params).forEach(p => {
    text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
  });
  return text;
};

const setLanguage = (lang) => {
  currentLang = lang;
  document.querySelector('h1').textContent = translate('appTitle');
  document.querySelector('.status').textContent = translate('tagline');
  document.querySelector('#auth h2').textContent = translate('loginRegister');
  authUsername.placeholder = translate('username');
  authPassword.placeholder = translate('password');
  loginBtn.textContent = translate('login');
  registerBtn.textContent = translate('register');
  document.querySelector('#adminDashboard h2').textContent = translate('adminDashboard');
  refreshAdminRides.textContent = translate('refreshAdminRides');
  document.querySelector('#book .section-card:nth-child(1) h2').textContent = translate('quickActions');
  document.getElementById('refreshDrivers').textContent = translate('refreshDrivers');
  document.getElementById('pickNearest').textContent = translate('pickNearest');
  document.querySelector('#book .section-card:nth-child(2) h2').textContent = translate('rideStatus');
  document.querySelector('#book h2').textContent = translate('bookRide');
  document.getElementById('pickup').placeholder = translate('pickupLocation');
  document.getElementById('dropoff').placeholder = translate('dropoffLocation');
  document.getElementById('estimate').textContent = translate('getFareEstimate');
  document.getElementById('bookRide').textContent = translate('bookRideBtn');
  document.querySelector('#track h2').textContent = translate('liveTracking');
  document.querySelector('#payment h2').textContent = translate('payment');
  document.querySelector('#paymentAmount').placeholder = translate('amountAuto');
  document.getElementById('payButton').textContent = translate('payNow');
  document.querySelector('#history h2').textContent = translate('rideHistory');
  refreshHistory.textContent = translate('refreshHistory');
  document.querySelector('#rate h2').textContent = translate('rateDriver');
  document.getElementById('rideId').placeholder = translate('rideId');
  document.getElementById('driverId').placeholder = translate('driverId');
  document.getElementById('rating').placeholder = translate('rating');
  document.getElementById('comment').placeholder = translate('comment');
  document.getElementById('submitRating').textContent = translate('sendRating');
  document.querySelector('#locale h2').textContent = translate('language');
  document.querySelector('#language option[value="en"]').textContent = translate('english');
  document.querySelector('#language option[value="hi"]').textContent = translate('hindi');
  document.querySelector('#language option[value="kn"]').textContent = translate('kannada');
  greeting.textContent = translate('welcome');
  document.querySelector('#locale h2:last-of-type').textContent = translate('displayMode');
  themeToggle.textContent = translate('toggleDark');
  // Update dynamic states if needed
  if (currentUser) {
    authStatus.textContent = translate('signedInAs', { username: currentUser.username, role: currentUser.role });
  } else {
    authStatus.textContent = translate('notSignedIn');
  }
  rideState.textContent = translate('noActiveBooking');
  routeInfo.textContent = translate('noRoute');
};

const setAuthState = (token, user) => {
  authToken = token || null;
  currentUser = user || null;
  if (token) {
    localStorage.setItem('authToken', token);
    authStatus.innerText = translate('signedInAs', { username: user.username, role: user.role });
    if (user.role === 'admin') adminDashboard.hidden = false;
    profile.hidden = false;
    profileInfo.innerHTML = `
      <p><strong>${translate('username')}:</strong> ${user.username}</p>
      <p><strong>${translate('role')}:</strong> ${user.role}</p>
      <p><strong>${translate('memberSince')}:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
    `;
    profileLanguage.value = currentLang;
    enableNotifications.checked = enableNotifs;
  } else {
    localStorage.removeItem('authToken');
    authStatus.innerText = translate('notSignedIn');
    adminDashboard.hidden = true;
    profile.hidden = true;
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

document.getElementById('language').addEventListener('change', (event) => {
  const lang = event.target.value;
  localStorage.setItem('language', lang);
  setLanguage(lang);
});
setLanguage('en');

const loadProfile = () => {
  if (!authToken) { setAuthState(null); return; }
  requestWithAuth('/me').then((r) => r.json()).then((data) => {
    if (data.success) setAuthState(authToken, data.user);
    else setAuthState(null);
  }).catch(() => setAuthState(null));
};

loginBtn.addEventListener('click', () => {
  if (!authUsername.value || !authPassword.value) {
    authStatus.innerText = translate('usernamePasswordRequired', { default: 'Username and password required.' });
    authStatus.classList.add('error');
    return;
  }
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
        showToast(translate('welcomeBack', { username: data.user.username }), 'success');
      } else {
        authStatus.innerText = data.error || translate('loginFailed');
        authStatus.classList.add('error');
        showToast(data.error || translate('loginFailed'), 'error');
      }
    });
});

registerBtn.addEventListener('click', () => {
  if (authPassword.value.length < 6) {
    authStatus.innerText = translate('passwordTooShort', { default: 'Password must be at least 6 characters.' });
    authStatus.classList.add('error');
    return;
  }
  fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: authUsername.value, password: authPassword.value })
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        authStatus.innerText = translate('registrationSuccessful');
        authStatus.classList.remove('error');
        showToast(translate('registrationSuccessful'), 'success');
      } else {
        authStatus.innerText = data.error || translate('registrationFailed');
        authStatus.classList.add('error');
        showToast(data.error || translate('registrationFailed'), 'error');
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
        li.textContent = `#${ride.rideId} | ${ride.pickup} → ${ride.dropoff} | ${translate('driver')}: ${ride.driver.name} | ₹${ride.fare} | ${ride.status}`;
        rideHistory.appendChild(li);
      });
    });
};

const loadAdminRides = () => {
  fetch('/admin/rides', { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        adminRides.innerHTML = '<li>' + translate('adminAccessRequired') + '</li>';
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
      adminRides.innerHTML = '<li>' + translate('failedToLoadAdminRides') + '</li>';
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
        rideState.innerText = translate('nearestDriver', { name: nearest.name, car: nearest.car });
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

cancelRide.addEventListener('click', () => {
  if (!currentRideId) return;
  requestWithAuth('/cancel-ride', {
    method: 'POST',
    body: JSON.stringify({ rideId: currentRideId })
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        rideState.innerText = translate('rideCancelled', { default: 'Ride cancelled.' });
        cancelRide.hidden = true;
        currentRideId = null;
        currentDriver = null;
        if (pickupMarker) map.removeLayer(pickupMarker);
        if (dropoffMarker) map.removeLayer(dropoffMarker);
        pickupMarker = null;
        dropoffMarker = null;
        showToast(translate('rideCancelled'), 'info');
      } else {
        showToast(data.error || 'Failed to cancel ride', 'error');
      }
    });
});

const map = L.map('map').setView([12.9721, 77.5933], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const driverMarkers = {};
let routeLine = null;
let routeLayer = null;
let pickupMarker = null;
let dropoffMarker = null;
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

  routeInfo.innerText = translate('routeInfo', { pickup, dropoff, distance: distance.toFixed(1), eta: etaMinutes });
  return { distance, etaMinutes };
};

const socket = io();
socket.on('driver-location', (driver) => {
  if (currentDriver && driver.id === currentDriver.id) {
    liveTrack.innerText = translate('liveDriver', { name: driver.name, lat: driver.lat.toFixed(4), lng: driver.lng.toFixed(4) });
    updateDriverMarker(driver);
    map.panTo([driver.lat, driver.lng]);
  } else if (!currentDriver) {
    // show all if no ride
    updateDriverMarker(driver);
  }
});


document.getElementById('estimate').addEventListener('click', () => {
  const pickup = document.getElementById('pickup').value;
  const dropoff = document.getElementById('dropoff').value;

  if (!pickup || !dropoff) {
    estimateResult.innerText = translate('enterPickupDropoff');
    return;
  }

  estimateResult.innerText = translate('estimating', { default: 'Estimating...' }); // add to translations

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
        routeInfo.innerText = translate('mapboxRoute', { distance: distanceKm.toFixed(1), eta: etaMinutes });
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
          let surgeText = data.surge ? translate('surgeApplied', { default: ' (Surge pricing applied)' }) : '';
          estimateResult.innerText = translate('fareEstimate', { fare: data.fare, distance: distance.toFixed(1), eta: etaMinutes }) + surgeText;
        });
    });
});

document.getElementById('bookRide').addEventListener('click', () => {
  const pickup = document.getElementById('pickup').value;
  const dropoff = document.getElementById('dropoff').value;
  if (!pickup || !dropoff) {
    bookingResult.innerText = translate('provideLocations');
    return;
  }

  rideState.innerText = translate('booking');

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
        rideState.innerText = translate('bookingFailed');
        return;
      }

      lastFareAmount = fare;
      document.getElementById('paymentAmount').value = `₹${lastFareAmount}`;
      loadRideHistory();
      bookingResult.innerText = translate('bookedRide', { id: data.ride.id, driver: data.ride.driver.name, status: data.ride.status, eta: etaMinutes });
      rideState.innerText = translate('rideMatched', { id: data.ride.id, driver: data.ride.driver.name });
      currentRideId = data.ride.id;
      currentDriver = data.ride.driver;

      // Add pickup and dropoff markers
      if (pickupMarker) map.removeLayer(pickupMarker);
      if (dropoffMarker) map.removeLayer(dropoffMarker);
      const p = pickupDropoffCoords(pickup, pickupInput);
      const d = pickupDropoffCoords(dropoff, dropoffInput);
      pickupMarker = L.marker(p).addTo(map).bindPopup('Pickup: ' + pickup);
      dropoffMarker = L.marker(d).addTo(map).bindPopup('Dropoff: ' + dropoff);

      cancelRide.hidden = false;
    })
    .catch(() => {
      bookingResult.innerText = translate('networkErrorBooking');
      rideState.innerText = translate('bookingFailed');
    });
});

socket.on('ride-booked', (ride) => {
  bookingResult.innerText = translate('rideStatusUpdate', { id: ride.id, status: ride.status, driver: ride.driver.name });
  rideState.innerText = translate('currentRide', { id: ride.id, status: ride.status });
  showToast(translate('rideStatusUpdate', { id: ride.id, status: ride.status, driver: ride.driver.name }), 'info');
  if (enableNotifs && Notification.permission === 'granted') {
    new Notification('Ride Update', { body: translate('rideStatusUpdate', { id: ride.id, status: ride.status, driver: ride.driver.name }) });
  }
});

socket.on('ride-status-update', (data) => {
  if (currentRideId == data.rideId) {
    rideState.innerText = translate('currentRide', { id: data.rideId, status: data.status });
    showToast(translate('rideStatusUpdate', { id: data.rideId, status: data.status, driver: currentDriver.name }), 'info');
    if (enableNotifs && Notification.permission === 'granted') {
      new Notification('Ride Status Update', { body: translate('rideStatusUpdate', { id: data.rideId, status: data.status, driver: currentDriver.name }) });
    }
    if (data.status === 'Completed' || data.status === 'Cancelled') {
      cancelRide.hidden = true;
      currentRideId = null;
      currentDriver = null;
      if (pickupMarker) map.removeLayer(pickupMarker);
      if (dropoffMarker) map.removeLayer(dropoffMarker);
      pickupMarker = null;
      dropoffMarker = null;
    }
  }
});

socket.on('payment-success', (data) => {
  showToast(translate('paymentSucceeded', { amount: data.amount.toFixed(2), id: data.id }), 'success');
  if (enableNotifs && Notification.permission === 'granted') {
    new Notification('Payment Success', { body: translate('paymentSucceeded', { amount: data.amount.toFixed(2), id: data.id }) });
  }
});

const payButton = document.getElementById('payButton');
const paymentResult = document.getElementById('paymentResult');
const paymentMethod = document.getElementById('paymentMethod');
const cardForm = document.getElementById('cardForm');

paymentMethod.addEventListener('change', () => {
  if (paymentMethod.value === 'card') {
    cardForm.style.display = 'block';
  } else {
    cardForm.style.display = 'none';
  }
});

payButton.addEventListener('click', () => {
  if (!lastFareAmount || lastFareAmount <= 0) {
    paymentResult.innerText = translate('getEstimateFirst');
    return;
  }

  if (paymentMethod.value === 'card') {
    const cardNumber = document.getElementById('cardNumber').value;
    const expiry = document.getElementById('expiry').value;
    const cvc = document.getElementById('cvc').value;
    if (!cardNumber || !expiry || !cvc) {
      paymentResult.innerText = translate('enterCardDetails', { default: 'Please enter card details.' });
      return;
    }
    // Simple validation
    if (cardNumber.length < 16 || expiry.length !== 5 || cvc.length !== 3) {
      paymentResult.innerText = translate('invalidCardDetails', { default: 'Invalid card details.' });
      return;
    }
  }

  paymentResult.innerText = translate('creatingPaymentIntent');
  fetch('/payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: lastFareAmount, method: paymentMethod.value })
  })
    .then((r) => r.json())
    .then((data) => {
      if (!data.success) {
        paymentResult.innerText = data.error || translate('paymentFailed');
        throw new Error('payment intent failed');
      }
      paymentResult.innerText = translate('paymentIntentCreated', { id: data.paymentIntent.id });
      return fetch('/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId: data.paymentIntent.id })
      });
    })
    .then((r) => r.json())
    .then((confirmResult) => {
      if (confirmResult.success) {
        paymentResult.innerText = translate('paymentSucceededIntent', { id: confirmResult.paymentIntent.id });
        rideState.innerText = translate('paymentComplete');
      } else {
        paymentResult.innerText = confirmResult.error || translate('paymentConfirmationFailed');
        rideState.innerText = translate('paymentFailed');
      }
    })
    .catch((err) => {
      if (err.message !== 'payment intent failed') {
        paymentResult.innerText = translate('errorDuringPayment');
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
    ratingResult.innerText = translate('enterValidRating');
    return;
  }

  fetch('/rate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rideId, driverId, rating, comment }) })
    .then((r) => r.json())
    .then((d) => {
      ratingResult.innerText = d.success ? translate('thankYouRating') : JSON.stringify(d);
      if (d.success) {
        rideState.innerText = translate('ratedDriver', { driverId, rating });
      }
    });
});

document.getElementById('language').addEventListener('change', (event) => {
  const lang = event.target.value;
  localStorage.setItem('language', lang);
  setLanguage(lang);
});

profileLanguage.addEventListener('change', (event) => {
  const lang = event.target.value;
  localStorage.setItem('language', lang);
  setLanguage(lang);
  document.getElementById('language').value = lang;
});

toggleTheme.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', isDark);
});

enableNotifications.addEventListener('change', () => {
  enableNotifs = enableNotifications.checked;
  localStorage.setItem('enableNotifications', enableNotifs);
  if (enableNotifs && Notification.permission === 'default') {
    Notification.requestPermission();
  }
});

setLanguage(localStorage.getItem('language') || 'en');
