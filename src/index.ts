import { EventCatalogConfig, GeneratorProps } from './types';
import utils from '@eventcatalog/sdk';
import { SNS, paginateListTopics, Tag } from '@aws-sdk/client-sns';
import { parse } from '@aws-sdk/util-arn-parser';
import { generatedMarkdownByTopic } from './utils/channel';
import { convertFilterKeysToLowerCase } from './utils/config';

const matchFilters = (tags: Tag[], filters: { [key: string]: string }) => {
  const matching = tags.filter((tag: Tag) => {
    return filters[tag.Key!.toLowerCase()] === tag.Value;
  }).length;
  return matching === Object.keys(filters).length;
};

export async function* fetchTopics(options: GeneratorProps) {
  const client = new SNS({ credentials: options.credentials });
  const iterator = paginateListTopics({ client, pageSize: 100 }, {});
  for await (const page of iterator) {
    for (const topic of page.Topics || []) {
      if (!topic.TopicArn) {
        continue;
      }
      const { Attributes } = await client.getTopicAttributes({
        TopicArn: topic.TopicArn,
      });
      const { Tags } = await client.listTagsForResource({ ResourceArn: topic.TopicArn });
      if (!Attributes || !Tags) {
        continue;
      }
      if (!matchFilters(Tags, options.filter!)) {
        console.log('Skipping topic', topic.TopicArn);
        continue;
      }
      const Owner = Tags.find((tag) => tag.Key?.toLowerCase() === options.ownerTagKey?.toLowerCase());
      const Metadata = {
        ...parse(topic.TopicArn),
      };
      const DisplayName = Attributes.DisplayName || Metadata.resource.replace('.fifo', ''); // remove .fifo from display name
      const snsTopic = {
        Metadata,
        TopicArn: topic.TopicArn,
        DisplayName,
        Owner: Owner?.Value,
        EffectiveDeliveryPolicy: Attributes.EffectiveDeliveryPolicy,
        FifoTopic: Attributes.FifoTopic || 'false',
        ArchivePolicy: Attributes.ArchivePolicy || '',
      };
      yield snsTopic;
    }
  }
}

export const processTopics = async (config: EventCatalogConfig, options: GeneratorProps) => {
  console.log('Processing topics', config, options);
  options.filter = convertFilterKeysToLowerCase(options.filter!);
  if (!process.env.PROJECT_DIR) {
    process.env.PROJECT_DIR = process.cwd();
  }

  const eventCatalogDirectory = process.env.PROJECT_DIR;

  if (!eventCatalogDirectory) {
    throw new Error('Please provide catalog url (env variable PROJECT_DIR)');
  }

  const topics = fetchTopics(options);

  const { writeChannel } = utils(eventCatalogDirectory);

  for await (const topic of topics) {
    await writeChannel(
      {
        id: topic.Metadata.resource,
        name: topic.DisplayName,
        version: '1.0.0', // TODO need feedback, can this be dynamic/ change?
        summary: `Amazon SNS Topic ${topic.DisplayName}`,
        markdown: generatedMarkdownByTopic(topic),
        address: topic.TopicArn,
        owners: topic.Owner ? [topic.Owner] : [],
        protocols: ['sns'],
      },
      { override: true }
    );
  }
};

export default processTopics;
