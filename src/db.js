/**
 * Created by cody on 6/23/17.
 */
import mysql from "mysql";

exports.handleDatabase = (userInfo, req, res) => {
  const host = process.env.HAPPYFINDER_HOST;
  const user = process.env.HAPPYFINDER_USER;
  const password = process.env.HAPPYFINDER_PASSWORD;
  const database = process.env.HAPPYFINDER_DATABASE;
  const debug = process.env.DEBUG;

  const pool = mysql.createPool({
    connectionLimit: 100,
    host,
    user,
    password,
    database,
    debug: debug || false
  });

  pool.query(req, (err, rows) => {
    if (!err) {
      if (userInfo) {
        rows.push(userInfo);
      }
      res.json(rows);
    } else {
      res.end();
    }
  });

  pool.on("error", () => {
    res.json({ code: 100, status: "Error in connection database" });
  });
};
