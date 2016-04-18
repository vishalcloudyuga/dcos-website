# Marketing site for DCOS

[![Build Status](https://travis-ci.com/dcos/dcos-website.svg?token=yAREgxuvuzZLg282ZE3m&branch=develop)](https://travis-ci.com/dcos/dcos-website)

Built using [Metalsmith](http://metalsmith.io).

## Contribution Workflow

1. [Create a repo fork in Github](https://guides.github.com/activities/forking/)
1. [Clone the dcos/dcos-website repo](https://help.github.com/articles/cloning-a-repository/)
1. Add repo fork as remote repo:

    ```
    git remote add fork https://github.com/<github-user>/dcos-website
    git fetch fork
    ```
1. Checkout the develop branch:

    ```
    git checkout develop
    ```
1. Update the dcos-docs submodule:

    ```
    git submodule update --init --recursive
    ```
1. [Install Node](https://docs.npmjs.com/getting-started/installing-node)
1. Install dependencies:

    ```
    npm install
    ```
1. Launch local dev server:

    ```
    npm start
    ```
    (opens dev server in browser)
1. Create a new feature branch:

    ```
    git checkout -b feature/<feature-name>
    ```
1. Make local changes
1. Verify changes in dev server (updates automatically when files are changed)
1. Add and Commit changes

    ```
    git add -p .
    git commit
    ```
1. Rebase repo fork to include recent dcos/dcos-website:develop changes

    Rebasing a repo (instead of merging) will keep your fork commit history clean and move all your changes to the top of the commit log.

    ```
    git pull --rebase origin develop
    ```
    (may require resolving conflicts)
1. Push changes to repo fork feature branch

    ```
    git push -u fork feature/<feature-name>
    ```
1. [Create a pull request](https://help.github.com/articles/creating-a-pull-request/) from the repo fork feature branch to dcos/dcos-website:develop


Once changes are accepted and merged to the develop branch, CI will push the updates to <https://dev.dcos.io/>.

## Update the Docs

Docs should be updated on `develop` by maintainers to avoid git sha merge conflicts:

```
git checkout origin develop
scripts/bump_docs.sh
git push
```

## Promote to Production

Once changes have been previewed and accepted on <https://dev.dcos.io/>, the maintainers will create a PR from `develop` to `master`.

Once the PR is merged, CI will push the updates to <https://dcos.io/>.

After merging, the `develop` branch must be rebased from `master` to synchronize the merge commit:

```
git fetch origin
git checkout develop
git pull --rebase origin master
git push
```

## Setting dcos.io Redirects

- `aws configure --profile dcos`
- `scripts/setup-redirects.sh`

## Adding New dcos.io Redirects

Add to `redirects` with the following format:

/from/ /to/
