'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request-promise'),
    _ = require('lodash'),
    Promise = require('bluebird');

var GithubCleanup = function () {
  function GithubCleanup(APIKEY) {
    _classCallCheck(this, GithubCleanup);

    this.GITHUBKEY = APIKEY;

    this.defaultRequestOptions = {
      headers: {
        "Authorization": 'token ' + this.GITHUBKEY,
        "User-Agent": "CleanupGithubScript"
      },
      json: true
    };
  }

  _createClass(GithubCleanup, [{
    key: 'findRepositories',
    value: function findRepositories() {
      var options = Object.assign({}, this.defaultRequestOptions, {
        method: "GET",
        uri: "https://api.github.com/user/repos",
        qs: {
          visibility: "private",
          affiliation: "owner"
        }
      });

      return request(options);
    }
  }, {
    key: 'cleanUpRepositories',
    value: function cleanUpRepositories(repositoryNames) {
      var _this = this;

      return Promise.all(repositoryNames.map(function (repo) {
        var options = Object.assign({}, _this.defaultRequestOptions, {
          method: "DELETE",
          uri: 'https://api.github.com/repos/' + repo
        });

        return request(options).then(function () {
          return console.log(repo, "succesfull");
        }).catch(function () {
          return console.log(repo, "error");
        });
      }));
    }
  }, {
    key: 'getRepositoryNames',
    value: function getRepositoryNames() {
      return this.findRepositories().then(function (result) {
        return result.map(function (repo) {
          return repo.full_name;
        });
      });
    }
  }]);

  return GithubCleanup;
}();

var ghHelper = new GithubCleanup(process.env.GITHUB_TOKEN);

ghHelper.getRepositoryNames().then(function (repositories) {
  ghHelper.cleanUpRepositories(repositories);
});
