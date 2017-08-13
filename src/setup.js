/**
 * Created by cody on 6/27/17.
 */
import fs0 from "fs";

const fs = fs0;
fs.createReadStream(".sample-env").pipe(fs.createWriteStream(".env"));
