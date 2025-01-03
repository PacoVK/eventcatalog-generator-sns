<div align="center">

<h1>⚡️ Amazon SNS generator for EventCatalog</h1>
<p>Bring discoverability to teams with the Amazon SNS plugin for EventCatalog</p>

[![Quality](https://github.com/PacoVK/eventcatalog-generator-sns/actions/workflows/lint.yml/badge.svg)](https://github.com/PacoVK/eventcatalog-generator-sns/actions/workflows/lint.yml)
[![Test](https://github.com/PacoVK/eventcatalog-generator-sns/actions/workflows/tests.yml/badge.svg)](https://github.com/PacoVK/eventcatalog-generator-sns/actions/workflows/tests.yml)
[![Release](https://github.com/PacoVK/eventcatalog-generator-sns/actions/workflows/release.yml/badge.svg)](https://github.com/PacoVK/eventcatalog-generator-sns/actions/workflows/release.yml)

[<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" height="20px" />](https://www.linkedin.com/in/pascal-euhus-611309164/) [![blog](https://img.shields.io/badge/license-AGPL--3.0-brightgreen)](https://github.com/PacoVK/eventcatalog-generator-sns/blob/main/LICENSE.md)

</div>

<hr/>

# Core Features

- 📃 Document channels from your Amazon SNS topics
- ⭐ Discoverability feature (search, filter and more)

# How it works

EventCatalog supports [generators](https://www.eventcatalog.dev/docs/development/plugins/generators).
Generators are scripts are run to pre-build to generate content in your catalog. Generators can use the [EventCatalog SDK](https://www.eventcatalog.dev/docs/sdk).

With this SNS plugin you can collect topics and add them as channels to your catalog. You can map owners to those channels via tags and also filter for specific topics.

This is done by defining your generators in your `eventcatalog.config.js` file.

```js
...
generators: [
    [
      '@pacovk/eventcatalog-generator-sns',
        {
            // (optional) Tag that will be used to map the owner of the channel
            // Case-Insensitive (default: 'owner')
            // Value must match a team or user in you eventcatalog instance
            ownerTagKey: 'owner',
            // (optional) Filter for topics by tags
            // If not set all topics will be added, otherwise only topics that match the filter will be added
            filter: {
                type: 'global', // e.g. only add topics that have a tag with the key 'type' and value 'global'
            },
            // (optional) AWS credentials
            // If not set, the default credentials will be used
            // RECOMMENDED: Use environment variables  instead
            credentials: {
                accessKeyId: 'X',
                secretAccessKey: 'X',
                accountId: 'X',
            }
        }
  ]
]
...
```

# Getting started

## Installation and configuration

_Make sure you are on the latest version of EventCatalog_.

1. Install the package

```sh
@pacovk/eventcatalog-generator-sns
```

2. Configure your `eventcatalog.config.js` file

3. Run the generate command

```sh
npm run generate
```

4. See your new channels, run

```sh
npm run dev
```

## Found a problem?

Raise a GitHub issue on this project!

# Contributing

If you have any questions, features or issues please raise any issue or pull requests you like. I will try my best to get back to you.

You can find the [contributing guidelines here](https://eventcatalog.dev/docs/contributing/overview).

## Running the project locally

1. Clone the repo
1. Install required dependencies `yarn install`
1. Run tests `yarn test`
