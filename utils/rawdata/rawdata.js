var mqtt = require('mqtt');
var moment = require('moment');

var brokerAddr;
var brokerID;
var redis;

var topicRouter = {
  '/neuro/weather': onMsgNeuroWeather,
  '/sensor/neurite-00016694/out': onMsgOffice,
}

module.exports.start = function(broker, redisClient) {
  brokerAddr = broker;
  redis = redisClient;

  mqttClient = mqtt.connect('mqtt:' + brokerAddr);

  mqttClient.on('connect', function() {
    console.log("connected mqtt broker");
    mqttClient.subscribe(Object.keys(topicRouter), function(err, granted) {
        console.log("sub", granted);
    });

    mqttClient.on("message", onMsgMqtt);
  });
}

function onMsgMqtt(topicStr, message) {
    var topic = topicStr.split("/"); 
    //console.log(topic, message.toString());

    var tpKey = topic.shift();
    switch(tpKey) {
        case "$SYS":
            onMsgSys(topic, message);
            break;
        case "":
            onMsgMain(topicStr, message);
            break;
        default:
            console.log("unsupported topic key:", tpKey );
            return -1;
    } 
}

function onMsgSys(topic, message) {
    var tpKey = topic.shift();
    if (tpKey === broker) {
        tpKey = topic.shift();
        switch(tpKey) {
            case "disconnect":
                var device = message.toString();
                console.log("client disconnected: ", device);
                var Fiber = Npm.require('fibers');
                Fiber(function() {
                    deviceProfileAll.collec.update({name:device}, {$set:{isOnline:false}});
                }).run();
                break;
            case "new":
                var device = message.toString();
                console.log("client connected: ", device);
                var Fiber = Npm.require('fibers');
                Fiber(function() {
                    deviceProfileAll.collec.update({name:device}, {$set:{isOnline:true}});
                }).run();
                break;
            default:
        }
    }
}

function onMsgMain(topicStr, message) {
  for (var k in topicRouter) {
    if (k == topicStr) {
      topicRouter[k](message);
    }
  }
}

function onMsgOffice(message) {
  if (message.toString().substring(0,7) == "checkin") {
    return 
  }
  var data = JSON.parse(message);
  var ts = moment().valueOf();
  data.ts = ts;
  redis.lpush('office', JSON.stringify(data));
}

function onMsgNeuroWeather(message) {
  //console.log("handle", message.toString());
  var data = JSON.parse(message);
  var ts = moment().valueOf();
  data.ts = ts;
  redis.lpush('weather-'+ data.City, JSON.stringify(data));
}

function onMsgMainLegacy(topic, message) {
    var tpKey = topic.shift();
    switch(tpKey) {
        case "up":
            onMsgUp(topic, message);
            break;
        case "down":
            console.log("get down message");
            break;
        case "neuro":
            onMsgNeuro(topic, message);
            break;
        default:
            console.log("unsupported topic key:", tpKey );
    }
}

function onMsgUp(topic, message) {
    var tpKey = topic.shift();
    switch(tpKey) {
        case "bs":
            onMsgUpBs(topic, message);
            break;
        default:
            console.log("unsupported topic key:", tpKey );
    }
}

function onMsgUpBs(topic, message) {
    var tpKey = topic.shift();
    switch(tpKey) {
        case "checkin":
            onMsgUpBsCheckin(topic, message);
            break;
        default:
            onMsgUpBsTarget(tpKey, topic, message);
    }
}

function onMsgUpBsCheckin(topic, message) {
    var target = message.toString();
    console.log("checkin:", target);
    doMsgDownBsTargetConfig(target);
}

function onMsgUpBsTarget(target, topic, message) {
    var Fiber = Npm.require('fibers');
    Fiber(function() {
        if (deviceProfileAll.collec.findOne({name: target}) !== undefined) {
            //console.log("message from:", target);
            deviceProfileAll.collec.update({name:target}, {$set:{isOnline:true}}); 
            var tpKey = topic.shift();
            switch(tpKey) {
                case "input":
                    onMsgUpBsTargetInput(target, topic, message);
                    break;
                case "output":
                    onMsgUpBsTargetOutput(target, topic, message);
                    break;
                default:
                    console.log("unsupported topic key:", tpKey );
            }
        } else {
            console.log("unrecognized device:", target);
        }
    }).run();
}

function onMsgUpBsTargetInput(target, topic, message) {
    var tpKey = topic.shift();
    switch(tpKey) {
        case "bundle":
            try {
                if (message[message.length -1] == '\0') {
                    message.slice(0, message.length - 1);
                }
                var value = JSON.parse(message.toString());
                for (var k in value) {
                    contactAll.collec.update({owner:target, localName:k},
                        {$set:{value:Number(value[k])}});
                }
                console.log("update input:", target, tpKey, value);
            } catch (exception) {
                console.log(exception);
                console.log(message);
            }
        default:
            var value = parseInt(message.toString());
            contactAll.collec.update({owner:target, localName:tpKey},
                {$set:{value:value}});
    }
}

function onMsgUpBsTargetOutput(target, topic, message) {
    var tpKey = topic.shift();
    contactAll.collec.update({owner:target, localName:tpKey},
        {$set:{value:message.toString()}});
    //console.log("update output:", target, tpKey, message);
}

function doMsgDown(topic, message) {
    console.log("publish", topic, message);
    mqttClient.publish(topic, message, {qos:1});
}

function doMsgDownBsTargetOutput(target, outputId, value) {
    var topic = "/down/bs/" + target + "/output/" + outputId;
    doMsgDown(topic, value);
}

function getCurrentConfig(target) {
        var config = "";
        contactAll.collec.find({owner:target, port:"digital"},
            {fields: {localName:1, type:1, _id:0}}).forEach( function(doc) {
            config = config + doc.localName + ':' + doc.type + ',';
        });
        console.log("get config:", config);
        return config;
}

function doMsgDownBsTargetConfig(target) {
    var Fiber = Npm.require('fibers');
    Fiber(function() {
        var topic = "/down/bs/" + target + "/config";
        var config = getCurrentConfig(target);
        doMsgDown(topic, config);
    }).run();
}

function doMsgDownBsTargetConfigNetwork(target) {
    var network = deviceProfileAll.collec.findOne({name:target});
    var config = "ssid:" + network.ssid + "," + "password:" + network.pwd;
    console.log("netowrk config:", config);
    var topic = "/down/bs/" + target + "/config";
    doMsgDown(topic, config);
}

function getIPAddress() {
  var interfaces = Npm.require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }

  return '0.0.0.0';
}
