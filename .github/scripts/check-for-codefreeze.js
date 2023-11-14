const codeFreezes = [
  {
    start: "2023-11-14T17:59:19Z",
    end: "2023-11-14T18:59:19Z",
    reason: "Preparing for major release",
  },
];

const currentTime = new Date();

for (const { start, end, reason } of codeFreezes) {
  const freezeStart = new Date(start);
  const freezeEnd = new Date(end);

  if (currentTime >= freezeStart && currentTime <= freezeEnd) {
    console.log(`Code freeze is in effect: ${reason}`);
    process.exit(1);
    break;
  }

  process.exit(0);
}
