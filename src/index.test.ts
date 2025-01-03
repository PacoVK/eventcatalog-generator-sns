import { fetchTopics, processTopics } from './index';
import { mockClient } from 'aws-sdk-client-mock';
import { GetTopicAttributesCommand, ListTagsForResourceCommand, ListTopicsCommand, SNS } from '@aws-sdk/client-sns';
import utils from '@eventcatalog/sdk';

jest.mock('@eventcatalog/sdk');
const snsMock = mockClient(SNS);

describe('fetchTopics', () => {
  beforeEach(() => {
    snsMock.reset();
  });
  it('should yield SNS topics with correct attributes', async () => {
    snsMock.on(GetTopicAttributesCommand).resolves({ Attributes: { DisplayName: 'TestTopic', EffectiveDeliveryPolicy: '{}' } });
    snsMock.on(ListTagsForResourceCommand).resolves({ Tags: [{ Key: 'owner', Value: 'test-owner' }] });
    snsMock.on(ListTopicsCommand).resolves({ Topics: [{ TopicArn: 'arn:aws:sns:us-east-1:123456789012:TestTopic' }] });

    const topics = fetchTopics({ filter: {}, ownerTagKey: 'owner' });
    const result = [];
    for await (const topic of topics) {
      result.push(topic);
    }

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      DisplayName: 'TestTopic',
      Owner: 'test-owner',
      FifoTopic: 'false',
      ArchivePolicy: '',
    });
  });

  it('should skip topics that do not match filter criteria', async () => {
    snsMock.on(GetTopicAttributesCommand).resolves({ Attributes: { DisplayName: 'TestTopic', EffectiveDeliveryPolicy: '{}' } });
    snsMock
      .on(ListTagsForResourceCommand)
      .resolvesOnce({ Tags: [] })
      .resolvesOnce({ Tags: [{ Key: 'Type', Value: 'my-message-infrastructure' }] });
    snsMock.on(ListTopicsCommand).resolves({
      Topics: [
        { TopicArn: 'arn:aws:sns:us-east-1:123456789012:TestTopic' },
        { TopicArn: 'arn:aws:sns:us-east-1:123456789013:TestTopic' },
      ],
    });
    const topics = fetchTopics({ filter: { type: 'my-message-infrastructure' }, ownerTagKey: 'owner' });
    const result = [];
    for await (const topic of topics) {
      result.push(topic);
    }

    expect(result).toHaveLength(1);
    expect(result[0].TopicArn).toBe('arn:aws:sns:us-east-1:123456789013:TestTopic');
  });
});

describe('processTopics', () => {
  const mockWriteChannel = jest.fn();
  //@ts-ignore
  utils.mockReturnValue({ writeChannel: mockWriteChannel });

  beforeEach(() => {
    snsMock.reset();
  });

  it('should process and write SNS topics to the event catalog', async () => {
    snsMock.on(GetTopicAttributesCommand).resolves({ Attributes: { DisplayName: 'TestTopic', EffectiveDeliveryPolicy: '{}' } });
    snsMock.on(ListTagsForResourceCommand).resolves({ Tags: [{ Key: 'owner', Value: 'test-owner' }] });
    snsMock.on(ListTopicsCommand).resolves({ Topics: [{ TopicArn: 'arn:aws:sns:us-east-1:123456789012:TestTopic' }] });

    await processTopics({}, { filter: {}, ownerTagKey: 'owner' });

    expect(mockWriteChannel).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'TestTopic',
        name: 'TestTopic',
        version: '1.0.0',
        summary: 'Amazon SNS Topic TestTopic',
        address: 'arn:aws:sns:us-east-1:123456789012:TestTopic',
        owners: ['test-owner'],
        protocols: ['sns'],
      }),
      { override: true }
    );
  });
});
