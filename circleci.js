const fetch = require('node-fetch');
const { exec } = require('child_process');

const modules = ['core', 'components'];

exec('yarn check:changes', (error, stdout) => {
    modules.forEach(name => {
        if (!stdout.includes(name)) return;

        const params = {
            parameters: {
                [name]: true,
                trigger: false,
            },
            branch: process.env.CIRCLE_BRANCH,
        };

        fetch(
            `https://circleci.com/api/v2/project/github/${process.env.CIRCLE_PROJECT_USERNAME}/${process.env.CIRCLE_PROJECT_REPONAME}/pipeline`,
            {
                body: JSON.stringify(params),
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        process.env.CIRCLE_TOKEN
                    ).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            }
        )
            .then(console.log);
    });
});
