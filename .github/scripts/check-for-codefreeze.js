const github = require("@actions/github");
const core = require("@actions/core");

const codeFreezes = [
  {
    start: "2023-11-14T17:59:19Z",
    end: "2023-11-14T19:59:19Z",
    reason: "Preparing for major release",
  },
];

const currentTime = new Date();

for (const { start, end } of codeFreezes) {
  const freezeStart = new Date(start);
  const freezeEnd = new Date(end);

  if (currentTime >= freezeStart && currentTime <= freezeEnd) {
    core.setOutput("isInFreeze", "true");
    break;
  } else {
    core.setOutput("isInFreeze", "false");
  }
}
