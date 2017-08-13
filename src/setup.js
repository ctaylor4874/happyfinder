/**
 * Created by cody on 6/27/17.
 */
import fs0 from "fs";
'use strict';
const fs = fs0;
fs.createReadStream('.sample-env')
  .pipe(fs.createWriteStream('.env'));
