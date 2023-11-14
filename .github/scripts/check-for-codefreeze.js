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

for (const { start, end, reason } of codeFreezes) {
  const freezeStart = new Date(start);
  const freezeEnd = new Date(end);

  if (currentTime >= freezeStart && currentTime <= freezeEnd) {
    const githubToken = process.env.GITHUB_TOKEN;
    const context = github.context;

    console.log({ ght: githubToken });

    if (context.eventName === "pull_request") {
      const octokit = github.getOctokit(githubToken);
      const prNumber = context.payload.pull_request.number;

      const labelName = "Failed Codefreeze Check";

      console.log("here it is", {
        owner: context.repo.owner,
        repo: context.repo,
        issue_number: prNumber,
        labels: [labelName],
      });
      // Add label
      octokit.rest.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        labels: [labelName],
      });

      // Post comment
      octokit.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        body: `This PR failed the code freeze check due to: ${reason}. To merge it in, please remove the '${labelName}' label.`,
      });
    }
    break;
  }
}
