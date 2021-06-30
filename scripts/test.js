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
  thread.stdout.on("data", (msg) => {
    console.log(msg.toString());

    // Run validation on url (arbitrary delay)
    setTimeout(() => {
      validateURL(URL).then((result) => {
        fs.writeFileSync(RESULTS_FILE_PATH, JSON.stringify(result));
        thread.kill();
      });
    }, 1000);
  });
  thread.on("close", (code) => {
    console.log(`Thread exited with code ${code}`);
  });
}
main();

async function validateURL(url) {
  const options = {
    url,
    format: "text",
    isLocal: true,
  };
  const result = await validator(options);
  return result;
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
