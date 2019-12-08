
const EventEmitter = require('events');

class Logger  extends EventEmitter{
  log(message) {
    console.log(message);
    this.emit("MessageLogged", {id:"1", url:"http://greecycle.com"})
}
}

module.exports = Logger;