var express = require('express');
var router = express.Router();

router.get('/', require('../views/lab/index').get);

//router.get('/home/', require('../views/home/index').get);

router.get('/login/', require('../views/login/index').init);
router.post('/login/', require('../views/login/index').login);

router.get('/signup/', require('../views/signup/index').init);
router.post('/signup/', require('../views/signup/index').signup);

router.get('/logout', require('../views/logout/index').init);

router.post('/data/', require('../views/data/index').fetch);

module.exports = router;
