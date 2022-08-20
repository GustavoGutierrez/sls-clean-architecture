module.exports.config = (serverless) => {
    const STAGE = 'staging';
    const ACCOUNT_ID = '0000000000000';
    const REGION = 'us-east-1';
    const API_KEY_NAME = `sls-clean-architecture-key-${STAGE}`;
    const API_KEY_VALUE = '483ebd1b4cbd844682f5c457f3f5d9454fe0262b831edcf275fbb49ed6f4fe4b';
    return {
        STAGE,
        ACCOUNT_ID,
        REGION,
        API_KEY_NAME,
        API_KEY_VALUE,
    };
};
