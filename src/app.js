require('dotenv').config();

require('./config/env');

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./modules/auth/auth.routes');
const listingRoutes = require('./modules/listing/listing.routes');
const orderRoutes = require('./modules/order/order.routes');
const driverRoutes = require('./modules/driver/driver.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const restaurantRoutes = require('./modules/restaurant/restaurant.routes');
const shelterRoutes = require('./modules/shelter/shelter.routes');
const deliveryRoutes = require('./modules/delivery/delivery.routes');
const ratingRoutes = require('./modules/rating/rating.routes');
const bidRoutes = require('./modules/bid/bid.routes');
const {
  requireAuth
} = require('./middleware/auth.middleware');
const webhookRoutes = require('./modules/webhooks/webhook.routes');
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('API running');
});
app.use('/auth', authRoutes);app.use(
  '/listings',
  requireAuth,
  listingRoutes
);
app.use('/orders', orderRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/drivers', driverRoutes);
app.use('/shelters', shelterRoutes);
app.use('/deliveries', deliveryRoutes);
app.use('/ratings', ratingRoutes);
app.use('/bids', bidRoutes);
app.use('/admin', adminRoutes);
app.use('/webhooks', webhookRoutes);
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

module.exports = app;