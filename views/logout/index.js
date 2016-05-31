'use strict';

module.exports.init = function(req, res) {
  req.logout();
  res.redirect(req.session.returnUrl);
};
