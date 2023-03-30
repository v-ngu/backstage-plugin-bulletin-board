# Contributing to Bulletin Board Backstage Plugin

You are more than welcome in participating in this open source project. Simply follow these guidelines if you would like to contribute.

## Issues
Found a bug or have an idea for a feature? You can help us by [creating an issue](https://github.com/v-ngu/backstage-plugin-bulletin-board/issues).
You can go even further and [open a Pull Request](https://github.com/v-ngu/backstage-plugin-bulletin-board/pulls) with the fix or proposed feature.

## Pull Requests
Follow the steps bellow to submit a pull request:

1. [Open an issue](https://github.com/v-ngu/backstage-plugin-bulletin-board/issues) describing the problem or proposed feature. Ask maintainers (in the issue thread) to assign the issue to you so we know who is working on what.
2. Fork this repo and create a branch for your work.
3. Push changes to your branch.
4. Test your changes.
5. Open a [Pull Request](https://github.com/v-ngu/backstage-plugin-bulletin-board/pulls) when your code is ready for review. Mention the issue number in the comment (e.g. Fixes #37).
6. We will review your PR, give feedback, and merge when it is ready.

## Versioning

We use [changesets](https://github.com/atlassian/changesets) in order to prepare releases. To make the process of generating releases easy, please include changesets with your pull request. This will result in a every package affected by a change getting a proper version number and an entry in its `CHANGELOG.md.

### When to use a changeset?

Any time a patch, minor, or major change aligning to [Semantic Versioning](https://semver.org) is made to any published package in `plugins/`, a changeset should be used.
In general, changesets are not needed for the documentation, build utilities or similar.

### How to create a changeset

1. Run `yarn changeset`
2. Select which packages you want to include a changeset for
3. Select impact of change that you're introducing, using `minor` for breaking changes and `patch` otherwise.
4. Explain your changes in the generated changeset. See [examples of well written changesets](https://backstage.io/docs/getting-started/contributors#writing-changesets).
5. Add generated changeset to git
6. Push the commit with your changeset to the branch associated with your PR

For more information, checkout [adding a changeset](https://github.com/atlassian/changesets/blob/master/docs/adding-a-changeset.md) documentation in the changesets repository.

Thanks for your contribution!
