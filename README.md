# Github Repo Cleanup

This is a small script used to clean up a lot of private repositories in my account at once (as I've been creating a lot for testing).

## Usage

run `npm install`

create a .env file within the root directory containing your github token key:

```
GITHUB_TOKEN=yourtoken
```

run `npm run babel` and then `npm start` to execute the script.

It will only delete private repositories you created in your account. You might need to run it more than once because the api returns a small subset of repositories (30 at a time).