/**
 * Created by cody on 6/2/17.
 */
const args = ["start"];
const opts = { stdio: "inherit", cwd: "client", shell: true };
require("child_process").spawn("npm", args, opts);
