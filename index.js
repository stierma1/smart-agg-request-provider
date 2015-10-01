var RequestProvider = require("./lib/request");

module.exports = function(config){
  return new RequestProvider(config);
};
