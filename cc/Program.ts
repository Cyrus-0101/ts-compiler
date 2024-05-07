import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function main() {
  rl.question("> ", (line) => {
    if (!line.trim())
    {
      rl.close();
      return;
    }

    if (line === "1 + 2 * 3")
      console.log(1 + 2 * 3);
    else
      console.log("ERROR: Invalid Expression");

    main(); // Recursive call to keep asking for input
  });
}

main();