const express = require('express'),
    controller = require('../controllers/public');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser);
router.get('/user', auth,  controller.getLoggedUser);
router.get('/logout', auth, controller.logoutUser);

module.exports = router;