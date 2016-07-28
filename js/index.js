const request = require('request-promise'),
    _ = require('lodash'),
    Promise = require('bluebird');

class GithubCleanup {
  constructor(APIKEY) {
    this.GITHUBKEY = APIKEY;

    this.defaultRequestOptions = {
      headers: {
        "Authorization": `token ${this.GITHUBKEY}`,
        "User-Agent": "CleanupGithubScript"
      },
      json: true
    }
  }

  findRepositories() {
    const options = Object.assign({}, this.defaultRequestOptions, {
      method: "GET",
      uri: "https://api.github.com/user/repos",
      qs: {
        visibility: "private",
        affiliation: "owner"
      }
    });

    return request(options);
  }

  cleanUpRepositories(repositoryNames) {
    return Promise.all(repositoryNames.map((repo) => {
      const options = Object.assign({}, this.defaultRequestOptions, {
        method: "DELETE",
        uri: `https://api.github.com/repos/${repo}`
      });

      return request(options)
      .then(() => console.log(repo, "succesfull"))
      .catch(() => console.log(repo, "error"));
    }));
  }

  getRepositoryNames() {
    return this.findRepositories().then((result) => {
      return result.map((repo) => {
        return repo.full_name;
      });
    });
  }
}

const ghHelper = new GithubCleanup(process.env.GITHUB_TOKEN);

ghHelper.getRepositoryNames().then((repositories) => {
  ghHelper.cleanUpRepositories(repositories);
});
