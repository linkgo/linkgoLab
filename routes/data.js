'use strict';

exports.fetch = function(req, res) {
  //console.log(req.body);
  var redis = req.app.utility.redis;
  var dataKey = req.body.dataKey;
  var count = req.body.count;

  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    //TODO: validate
    workflow.emit('fetch');
  });

  workflow.on('fetch', function() {
    redis.lrange(dataKey, 0, count-1, function(err, result) {
      if (err) {
        console.log(err, result);
        workflow.outcome.errors.push(err);
        return workflow.emit('response');
      } else {
        //console.log(result);
        workflow.outcome.data = result;
        return workflow.emit('response');
      }
    });
  });

  workflow.emit('validate');
};
