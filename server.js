require('dotenv').config();
const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taxi_booking';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error', err);
    useMongo = false;
  });

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error', err);
  useMongo = false;
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected, falling back to in-memory storage');
  useMongo = false;
});

const RideSchema = new mongoose.Schema({
  rideId: Number,
  user: String,
  pickup: String,
  dropoff: String,
  status: String,
  driver: Object,
  fare: Number,
  etaMinutes: Number,
  distanceKm: Number,
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const RatingSchema = new mongoose.Schema({
  rideId: Number,
  driverId: Number,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const Ride = mongoose.model('Ride', RideSchema);
const Rating = mongoose.model('Rating', RatingSchema);
const User = mongoose.model('User', UserSchema);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let useMongo = true;
const localUsers = [];
const localRides = [];
const localRatings = [];

const drivers = [
  { id: 1, name: 'Priya', car: 'Toyota', plate: 'KA01AB1234', lat: 12.9716, lng: 77.5946 },
  { id: 2, name: 'Amit', car: 'Honda', plate: 'KA01CD5678', lat: 12.9750, lng: 77.5990 },
  { id: 3, name: 'Salma', car: 'Suzuki', plate: 'KA01EF9999', lat: 12.9690, lng: 77.5900 },
  { id: 4, name: 'Rajesh', car: 'Hyundai', plate: 'KA01GH1111', lat: 12.9730, lng: 77.5960 },
  { id: 5, name: 'Kavita', car: 'Maruti', plate: 'KA01IJ2222', lat: 12.9700, lng: 77.5920 },
  { id: 6, name: 'Vikram', car: 'Tata', plate: 'KA01KL3333', lat: 12.9770, lng: 77.6010 },
  { id: 7, name: 'Anjali', car: 'Mahindra', plate: 'KA01MN4444', lat: 12.9680, lng: 77.5880 },
  { id: 8, name: 'Suresh', car: 'Ford', plate: 'KA01OP5555', lat: 12.9740, lng: 77.5970 },
  { id: 9, name: 'Meera', car: 'Nissan', plate: 'KA01QR6666', lat: 12.9720, lng: 77.5930 },
  { id: 10, name: 'Arjun', car: 'BMW', plate: 'KA01ST7777', lat: 12.9760, lng: 77.6000 }
];

const pickupDropoffCoords = (location) => {
  const key = location.trim().toLowerCase();
  if (key.includes('airport')) return [12.9558, 77.6650];
  if (key.includes('station')) return [12.9780, 77.5713];
  if (key.includes('mall')) return [12.9758, 77.6050];
  if (key.includes('home')) return [12.9716, 77.5946];
  if (key.includes('office')) return [12.9718, 77.6413];
  return [12.9716 + (Math.random() - 0.5) * 0.03, 77.5946 + (Math.random() - 0.5) * 0.03];
};

const getDistance = (lat1, lng1, lat2, lng2) => {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
};

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
};

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    if (useMongo) {
      const existing = await User.findOne({ username });
      if (existing) return res.status(400).json({ error: 'User exists' });
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, passwordHash });
      res.json({ success: true, user: { username: user.username, role: user.role } });
      return;
    }

    const existingLocal = localUsers.find((u) => u.username === username);
    if (existingLocal) return res.status(400).json({ error: 'User exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const newLocalUser = { id: Date.now(), username, passwordHash, role: 'user' };
    localUsers.push(newLocalUser);
    res.json({ success: true, user: { username: newLocalUser.username, role: newLocalUser.role } });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    let user;
    if (useMongo) {
      user = await User.findOne({ username });
    } else {
      user = localUsers.find((u) => u.username === username);
    }
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id || user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ success: true, token, user: { username: user.username, role: user.role } });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/me', authMiddleware, async (req, res) => {
  if (useMongo) {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true, user: { username: user.username, role: user.role } });
  }
  const local = localUsers.find((u) => u.id === req.user.id || u.username === req.user.username);
  if (!local) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, user: { username: local.username, role: local.role } });
});

app.get('/drivers', (req, res) => res.json(drivers));

app.get('/fare-estimate', (req, res) => {
  const { pickup, dropoff } = req.query;
  if (!pickup || !dropoff) return res.status(400).json({ error: 'pickup and dropoff required' });
  const base = 50;
  const distanceKm = 6.5;
  const surge = Math.random() > 0.8 ? 1.5 : 1; // 20% chance of surge
  const total = (base + distanceKm * 14) * surge;
  res.json({ pickup, dropoff, distance_km: distanceKm, fare: (Math.round(total * 100) / 100), surge: surge > 1 });
});

app.get('/route', async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) return res.status(400).json({ error: 'from and to required' });

  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
  if (!mapboxToken) {
    return res.json({ success: true, polyline: null, distance: 0, duration: 0, message: 'No Mapbox token configured' });
  }

  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${encodeURIComponent(from)};${encodeURIComponent(to)}?geometries=geojson&overview=full&access_token=${mapboxToken}`;
    const result = await fetch(url);
    const data = await result.json();
    if (data.code !== 'Ok') return res.status(400).json({ error: 'Route failure', details: data });

    const route = data.routes[0];
    res.json({ success: true, distance: route.distance / 1000, duration: route.duration / 60, geometry: route.geometry });
  } catch (err) {
    console.error('route error', err);
    res.status(500).json({ success: false, error: 'Failed to fetch route' });
  }
});

app.post('/book', authMiddleware, async (req, res) => {
  const { pickup, dropoff, fare, etaMinutes, distanceKm } = req.body;
  const user = req.user.username;
  if (!user || !pickup || !dropoff) return res.status(400).json({ error: 'user, pickup, dropoff required' });

  const pickupCoords = pickupDropoffCoords(pickup);
  let minDist = Infinity;
  let selectedDriver = drivers[0];
  drivers.forEach(d => {
    const dist = getDistance(pickupCoords[0], pickupCoords[1], d.lat, d.lng);
    if (dist < minDist) {
      minDist = dist;
      selectedDriver = d;
    }
  });

  const rideId = Date.now();

  const ride = new Ride({
    rideId,
    user,
    pickup,
    dropoff,
    status: 'Accepted',
    driver: selectedDriver,
    fare: fare || 0,
    etaMinutes: etaMinutes || 0,
    distanceKm: distanceKm || 0
  });

  try {
    if (useMongo) {
      await ride.save();
    } else {
      localRides.push({ ...ride.toObject ? ride.toObject() : ride, createdAt: new Date() });
    }
    const rideRes = { id: rideId, user, pickup, dropoff, status: 'Accepted', driver: selectedDriver };
    io.emit('ride-booked', rideRes);
    res.json({ success: true, ride: rideRes });

    console.log(`Email/SMS notification: Ride ${rideId} booked for user ${user} with driver ${selectedDriver.name}`);

    // Simulate status updates
    setTimeout(async () => {
      try {
        if (useMongo) {
          await Ride.findOneAndUpdate({ rideId }, { status: 'Driver Arriving' });
        } else {
          const ride = localRides.find(r => r.rideId == rideId);
          if (ride) ride.status = 'Driver Arriving';
        }
        io.emit('ride-status-update', { rideId, status: 'Driver Arriving' });
        console.log(`SMS notification: Ride ${rideId} status updated to Driver Arriving`);
      } catch (err) {
        console.error('update status error', err);
      }
    }, 10000);

    setTimeout(async () => {
      try {
        if (useMongo) {
          await Ride.findOneAndUpdate({ rideId }, { status: 'In Transit' });
        } else {
          const ride = localRides.find(r => r.rideId == rideId);
          if (ride) ride.status = 'In Transit';
        }
        io.emit('ride-status-update', { rideId, status: 'In Transit' });
        console.log(`SMS notification: Ride ${rideId} status updated to In Transit`);
      } catch (err) {
        console.error('update status error', err);
      }
    }, 20000);

    setTimeout(async () => {
      try {
        if (useMongo) {
          await Ride.findOneAndUpdate({ rideId }, { status: 'Completed' });
        } else {
          const ride = localRides.find(r => r.rideId == rideId);
          if (ride) ride.status = 'Completed';
        }
        io.emit('ride-status-update', { rideId, status: 'Completed' });
        console.log(`Email notification: Ride ${rideId} completed`);
      } catch (err) {
        console.error('update status error', err);
      }
    }, 30000);
  } catch (err) {
    console.error('save ride error', err);
    res.status(500).json({ success: false, error: 'Failed to save ride' });
  }
});

app.post('/update-ride-status', authMiddleware, async (req, res) => {
  const { rideId, status } = req.body;
  if (!rideId || !status) return res.status(400).json({ error: 'rideId and status required' });
  try {
    if (useMongo) {
      await Ride.findOneAndUpdate({ rideId }, { status });
    } else {
      const ride = localRides.find(r => r.rideId == rideId);
      if (ride) ride.status = status;
    }
    io.emit('ride-status-update', { rideId, status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.post('/cancel-ride', authMiddleware, async (req, res) => {
  const { rideId } = req.body;
  if (!rideId) return res.status(400).json({ error: 'rideId required' });
  try {
    if (useMongo) {
      await Ride.findOneAndUpdate({ rideId }, { status: 'Cancelled' });
    } else {
      const ride = localRides.find(r => r.rideId == rideId);
      if (ride) ride.status = 'Cancelled';
    }
    io.emit('ride-status-update', { rideId, status: 'Cancelled' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel ride' });
  }
});

app.get('/ride-history', authMiddleware, async (req, res) => {
  try {
    if (useMongo) {
      const rides = await Ride.find().sort({ createdAt: -1 }).limit(50);
      res.json({ success: true, rides });
      return;
    }
    const rides = [...localRides].sort((a, b) => b.createdAt - a.createdAt).slice(0, 50);
    res.json({ success: true, rides });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load ride history' });
  }
});

app.get('/admin/drivers', authMiddleware, adminMiddleware, (req, res) => {
  res.json({ success: true, drivers });
});

app.get('/admin/rides', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (useMongo) {
      const rides = await Ride.find().sort({ createdAt: -1 }).limit(100);
      res.json({ success: true, rides });
      return;
    }
    const rides = [...localRides].sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
    res.json({ success: true, rides });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load rides' });
  }
});

app.post('/rate', async (req, res) => {
  const { rideId, driverId, rating, comment } = req.body;
  if (!rideId || !driverId || !rating) return res.status(400).json({ error: 'rideId, driverId and rating required' });

  try {
    if (useMongo) {
      const ratingDoc = new Rating({ rideId, driverId, rating, comment });
      await ratingDoc.save();
    } else {
      localRatings.push({ rideId, driverId, rating, comment, createdAt: new Date() });
    }
    res.json({ success: true, message: 'Thanks for rating', rating: { rideId, driverId, rating, comment } });
  } catch (err) {
    console.error('save rating error', err);
    res.status(500).json({ success: false, error: 'Failed to save rating' });
  }
});
app.post('/payment-intent', async (req, res) => {
  const { amount, method } = req.body;
  if (!amount || !method) return res.status(400).json({ error: 'amount and method are required' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      payment_method_types: method === 'card' ? ['card'] : ['upi', 'card'],
      description: 'Taxi booking fare'
    });
    res.json({ success: true, paymentIntent });
  } catch (err) {
    console.error('stripe intent error', err);
    res.status(500).json({ success: false, error: 'Failed to create payment intent' });
  }
});

app.post('/confirm-payment', async (req, res) => {
  const { paymentIntentId } = req.body;
  if (!paymentIntentId) return res.status(400).json({ error: 'paymentIntentId required' });

  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    res.json({ success: true, paymentIntent });
  } catch (err) {
    console.error('stripe confirm error', err);
    res.status(500).json({ success: false, error: 'Failed to confirm payment' });
  }
});

app.post('/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      io.emit('payment-success', { id: intent.id, amount: intent.amount / 100 });
    }
    res.json({ received: true });
  } catch (err) {
    console.error('stripe webhook error', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
io.on('connection', (socket) => {
  let idx = 0;
  const interval = setInterval(() => {
    idx = (idx + 1) % drivers.length;
    drivers[idx].lat += (Math.random() - 0.5) * 0.001;
    drivers[idx].lng += (Math.random() - 0.5) * 0.001;
    socket.emit('driver-location', drivers[idx]);
  }, 3000);

  socket.on('disconnect', () => clearInterval(interval));
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
  const keyFile = process.env.HTTPS_KEY_PATH || path.join(__dirname, 'certs', 'key.pem');
  const certFile = process.env.HTTPS_CERT_PATH || path.join(__dirname, 'certs', 'cert.pem');
  if (fs.existsSync(keyFile) && fs.existsSync(certFile)) {
    const https = require('https');
    const options = {
      key: fs.readFileSync(keyFile),
      cert: fs.readFileSync(certFile)
    };
    https.createServer(options, app).listen(PORT, () => console.log('HTTPS server running on', PORT));
  } else {
    server.listen(PORT, () => console.log('HTTP server running on', PORT));
  }
} else {
  server.listen(PORT, () => console.log('HTTP server running on', PORT));
}
