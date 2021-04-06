// eslint-disable-next-line
require('dotenv').config();

const { TEST_ACCOUNT_SID, TEST_AUTH_TOKEN } = process.env;

if (!TEST_ACCOUNT_SID || !TEST_AUTH_TOKEN) throw new Error('No testing authorization provided in env!');
