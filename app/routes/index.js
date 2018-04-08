const router = require('express-promise-router')();

// Controller Functions
const {
  root,
  checkTicket,
  fail,
  notFound
} = require('../controllers/index');

// Routes
router.get('/', root);
router.post('/check-ticket', checkTicket);
router.get('/fail', fail);

// Fall Through Route
router.use(notFound);

module.exports = router;