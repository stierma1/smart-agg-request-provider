var childProcess = require("child_process");
var exec = childProcess.exec;
var Bluebird = require("bluebird");
var request = Bluebird.promisifyAll(require("request"));
var url = require("url");

function RequestProvider(config){
  this.id = config.id;
  this.dirname = config.dirname || require("os").tmpdir();
  this.client = null;
  this.transforms = config.transforms || {};
}

RequestProvider.prototype.addTo = function(app){
  var self = this;
  this.client = app.createClient(this.id);
  this.client.updatePredicate("initialized(Type)", ["RequestProvider"], this.id);
  this.client.on("invoke-rule", function(data){
    if(typeof(data) === "string"){
      data = JSON.parse(data);
    }
    if(data.predicate === "request(Url)" || data.predicate === "request(Url, Transform)"){
      self.sendData(data.groundings, data.payloads, data.rule)
        .catch(function(err){
          console.log(err);
          self.client.updatePredicate("error(ActionId, TimeStamp)", ["Request", Date.now()], err);
        });
    }
  });
}

RequestProvider.prototype.sendData = function(groundings, payload, ruleId){
    var url = groundings[0];
    var transformId = groundings[1];
    var payString = typeof(payload) === "string" ? payload : JSON.stringify(payload, null, 2);
    var writeData = (transformId && this.transforms[transformId]) ? this.transforms[transformId](payload) : payString;
    return request.postAsync({url:url, form:writeData});
}

module.exports = RequestProvider;
