'use strict';
const fs = require('fs');

/**
 * METHODS
 */
const log = {
  info: (message) => {
    console.info('\x1b[36m', message);
    console.info('\x1b[0m');
  },
  error: (message) => {
    console.error('\x1b[31m', message);
    console.error('\x1b[0m');
    process.exit(-1);
  },
};

const testCommitMsg = (message) => /^(fix|style|chore|refactor|maintain|feat|merge|test)\(.*\):(.+){5,}/.test(message);

const testGitMsg = (message) => /^(Merge|Revert) */.test(message);

const testMail = (email) => /<*@(adneom\.com|positivethinking\.co|positivethinking\.company)>/.test(email);

const getEnvParam = (param) => {
  if (process) {
    if (process.env) {
      return process.env[param];
    }
  }
  log.error('Can not get env params');
};

/**
 * CHECK PARAMS
 */
const gitMessageFilePath = getEnvParam('HUSKY_GIT_PARAMS');
const email = getEnvParam('GIT_AUTHOR_EMAIL');

if (!gitMessageFilePath) {
  log.error('Can get HUSKY_GIT_PARAMS');
}

if (!email) {
  log.error('Can get GIT_AUTHOR_EMAIL');
}

/**
 * CHECK MESSAGE + EMAIL
 */
try {
  const commitMessage = fs.readFileSync(gitMessageFilePath, 'utf8');

  if (!testGitMsg(commitMessage) && !testCommitMsg(commitMessage)) {
    log.error(
      `The commit was rejected because its message does not follow commit convention.
      You can see the convention here :
      https://gitlab.positivethinking.company/adneom-lab/knowledge-base/wikis/git`,
    );
  }

  if (testMail(email)) {
    log.error('The commit was rejected because its author email does not match a PTC address');
  }

  log.info('Message commit + email -> checked');
} catch (e) {
  log.error(e);
}
