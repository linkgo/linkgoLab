'use strict';

exports = module.exports = function(req, res) {
  var workflow = new (require('events').EventEmitter)();

  workflow.outcome = {
    success: false,
    errors: [],
    errfor: {},
    data: {}
  };

  workflow.hasErrors = function() {
    return Object.keys(workflow.outcome.errfor).length !== 0 || workflow.outcome.errors.length !== 0;
  };

  workflow.on('exception', function(err) {
    console.log("exception", err);
    workflow.outcome.errors.push('Exception: '+ err);
    return workflow.emit('response');
  });

  workflow.on('response', function() {
    workflow.outcome.success = !workflow.hasErrors();
    console.log('response', workflow.outcome);
    res.send(workflow.outcome);
  });

  return workflow;
};
