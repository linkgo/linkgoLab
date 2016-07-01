var express = require('express');
var router = express.Router();

router.get('/', require('./neuriteSensor').get);
router.get('/neuriteSensor', require('./neuriteSensor').get);
router.get('/boringBuckButton', require('./boringBuckButton').get);
router.get('/newLink', require('./newLink').get);

// router.get('/home/', require('./home').get);
// router.get('/login/', require('./login').init);
// router.post('/login/', require('./login').login);
// router.get('/signup/', require('./signup').init);
// router.post('/signup/', require('./signup').signup);
// router.get('/logout', require('./logout').init);

router.post('/data/', require('./data').fetch);

module.exports = router;
