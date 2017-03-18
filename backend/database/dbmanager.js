const mysql = require('mysql'),
     config = require('../config'),
       path = require('path'),
      debug = require('debug')('backend');

class DBManager {
  constructor() {
    this.host     = config.database.host;
    this.user     = config.database.user;
    this.password = config.database.password;
    this.database = config.database.database;
    this.connection = null;
  }

  getConnection() {
    if (!this.connection) {
      this.connection =  mysql.createConnection({
        host     : this.host,
        user     : this.user,
        password : this.password,
        database : this.database
      });
    }
    return this.connection;
  }
  /**
   * @param data
   * data.json   : the json content
   * data.jsonDir: the directory of json
   */
  insertLoops(data) {
    let title = data.json.title,
        loops = data.json.loops;
    const conn = this.getConnection();
    conn.connect();
    new Promise((resolve, reject) => {
      // Insert Episode
      let sql = 'INSERT INTO Episode(name) VALUES(?)';
      conn.query(sql, [title], (err, results, fields) => {
        if (err) throw err;
        // Get the auto increment id
        debug("Insert results: " + results);
        debug("Episode inserted, insertId: " + results.insertId);
        resolve(results.insertId);
      });
    }).then((insertId) => {
      return new Promise((resolve, reject) => {
        // Insert loops
        loops.forEach((loop) => {
          let         dir = path.dirname(data.jsonDir),
            coverFilename = path.join(dir, loop.cover_filename),
            videoFilename = path.join(dir, loop.video_filename);
          let sql = 'INSERT INTO `Loop`(cover_filename, video_filename, episode_id) VALUES(?, ?, ?)';
          conn.query(sql, [coverFilename, videoFilename, insertId], (err, results, fields) => {
            if (err) {reject(err);}
            resolve();
          });
        });
      });
    }).then(() => {
      conn.end();
    })
  }
}

module.exports = DBManager;