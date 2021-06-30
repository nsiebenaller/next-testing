const fs = require("fs");
const { spawn } = require("child_process");
const validator = require("html-validator");

const RESULTS_FILE_PATH = `./scripts/output/results.txt`;
const URL = "http://localhost:3000";

async function main() {
  // Remove previous results
  fs.unlinkSync(RESULTS_FILE_PATH);

  // Start server
  const thread = spawn("npm", ["run", "start"]);
  let starting = false;
  thread.stdout.on("data", (msg) => {
    console.log(msg.toString());
    if (!starting) {
      starting = true;
      // Run validation on url (arbitrary delay)
      setTimeout(() => {
        console.log("Start validation");
        validateURL(URL).then((result) => {
          console.log("before file save");
          //fs.writeFileSync(RESULTS_FILE_PATH, JSON.stringify(result));
          thread.kill();
          console.log("after thread kill");
        });
      }, 1000);
    }
  });
  thread.on("close", (code) => {
    console.log(`Thread exited with code ${code}`);
  });
}
main();

async function validateURL(url) {
  try {
    const options = {
      url,
      format: "text",
      isLocal: true,
    };
    console.log("fetch results");
    const result = await validator(options);
    console.log("got results");
    return result;
  } catch (err) {
    return err;
  }
}

// exec("yarn start", (err, stdout, stderr) => {
//   if (err) {
//     // node couldn't execute the command
//     return;
//   }

//   // the *entire* stdout and stderr (buffered)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// });
