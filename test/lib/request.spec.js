
var RequestProvider = require("../../lib/request");
var EE = require("events").EventEmitter;
var chai = require("chai");
chai.should();

describe("#RequestProvider", function(){
  var upData = null;
  var app = {
    createClient: function(id){
      var ee = new EE();

      ee.updatePredicate = function(pred, groundings, data){
        upData = {pred:pred, groundings:groundings, data:data};
      };

      return ee;
    }
  };

  afterEach(function(){
    upData = null;
  });

  it("should create RequestProvider", function(){
    var request = new RequestProvider({id:"test"});
    request.id.should.equal("test");
  });

  it("should addTo application", function(){
    var request = new RequestProvider({id:"test"});
    request.addTo(app);
    upData.pred.should.equal("initialized(Type)");
  });

  it("should sendData", function(done){
    var request = new RequestProvider({id:"test", dirname: __dirname});
    request.addTo(app);
    request.client.emit("invoke-rule", {predicate:"request(Url, ContentType)", groundings:["http://localhost", "application/x-www-form-urlencoded"], payload:"hello world"});
    setTimeout(function(){
      done();
    }, 500)
  });

  it.skip("should transform sendData", function(done){
    var writer = new FsWriter({id:"test", dirname: __dirname, transforms:{"bacon" : function(){return "bacon";}}});
    writer.addTo(app);
    writer.client.emit("invoke-rule", {predicate:"write(FileName, Mode, Transform)", groundings:["test1.txt", "overwrite", "bacon"], payload:"hello world"});
    setTimeout(function(){
      done(new Error("Set Sail for fail"));
    }, 500)
  });
})
