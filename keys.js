console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bit = {
    id: process.env.BIT_ID
  };

  exports.ombd = {
    id: process.env.OMBD_ID
  };

  var keys = require("./keys.js");
 