let Processor = require('../processor'),
       config = require('./config');

let processor = new Processor(config.rawDataDir, config.dataDir, config.processDelay);

processor.start();