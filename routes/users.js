var express = require('express');
var router = express.Router();

router.get('/', require('../views/home/home').get);

router.get('/login/', require('../views/login/index').init);
router.post('/login/', require('../views/login/index').login);

module.exports = router;
