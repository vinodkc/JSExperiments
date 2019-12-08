// Event emitter example
const Logger = require('./logger')
var logger = new Logger();

logger.on("MessageLogged", (e) => {
    console.log('Message', e)
});



logger.log("Hello Vinod")


