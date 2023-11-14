const github = require("@actions/github");
const core = require("@actions/core");

async function run() {
  const githubToken = process.env["github-token"];
  const context = github.context;

  if (context.eventName === "pull_request") {
    const octokit = github.getOctokit(githubToken);
    const prNumber = context.payload.pull_request.number;

    const { data: labels } = await octokit.rest.issues.listLabelsOnIssue({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: prNumber,
    });

    if (labels.some((label) => label.name === "Failed Codefreeze Check")) {
      core.setFailed(
        'This PR cannot be merged because it has the "Failed Codefreeze Check" label.'
      );
    }
  }
}

run().catch((error) => core.setFailed(error.message));
