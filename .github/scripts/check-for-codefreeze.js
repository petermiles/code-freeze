const github = require("@actions/github");
const core = require("@actions/core");

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
    const githubToken = process.env["github-token"];
    const context = github.context;

    if (context.eventName === "pull_request") {
      const octokit = github.getOctokit();
      const prNumber = context.payload.pull_request.number;

      const labelName = "Failed Codefreeze Check";

      // Add label
      octokit.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        labels: [labelName],
      });

      // Post comment
      octokit.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        body: `This PR failed the code freeze check due to: ${reason}. To merge it in, please remove the '${labelName}' label.`,
      });
    }
    break;
  }
}
