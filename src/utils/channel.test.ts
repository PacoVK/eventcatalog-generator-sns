import { generatedMarkdownByTopic } from './channel';
import { SnsTopic } from '../types';
import { ARN } from '@aws-sdk/util-arn-parser';

const testMetadata: ARN = {
  region: 'us-east-1',
  partition: 'aws',
  service: 'sns',
  resource: 'TestTopic',
  accountId: '123456789012',
};

describe('generatedMarkdownByTopic', () => {
  it('should generate markdown for a standard SNS topic', () => {
    const snsTopic: SnsTopic = {
      DisplayName: 'TestTopic',
      FifoTopic: 'false',
      EffectiveDeliveryPolicy: '{}',
      ArchivePolicy: '',
      Metadata: testMetadata,
      TopicArn: 'arn:aws:sns:us-east-1:123456789012:TestTopic',
    };
    const result = generatedMarkdownByTopic(snsTopic);
    expect(result).toContain('Documentation for the Amazon SNS Topic: TestTopic.');
    expect(result).toContain('FifoTopic : false');
    expect(result).toContain('Open the TestTopic  in the AWS console');
    expect(result).toContain('Publish test events to TestTopic in the AWS console.');
    expect(result).toContain('Effective Delivery Policy');
    expect(result).not.toContain('Archive Policy');
  });

  it('should generate markdown for a FIFO SNS topic', () => {
    const snsTopic: SnsTopic = {
      DisplayName: 'TestFifoTopic',
      FifoTopic: 'true',
      EffectiveDeliveryPolicy: '{}',
      ArchivePolicy: '',
      Metadata: testMetadata,
      TopicArn: 'arn:aws:sns:us-west-2:123456789012:TestFifoTopic.fifo',
    };
    const result = generatedMarkdownByTopic(snsTopic);
    expect(result).toContain('Documentation for the Amazon SNS Topic: TestFifoTopic.');
    expect(result).toContain('FifoTopic : true');
    expect(result).toContain('Open the TestFifoTopic  in the AWS console');
    expect(result).toContain('Publish test events to TestFifoTopic in the AWS console.');
    expect(result).toContain('Effective Delivery Policy');
    expect(result).not.toContain('Archive Policy');
  });

  it('should include archive policy if present', () => {
    const snsTopic: SnsTopic = {
      DisplayName: 'TestTopicWithArchive',
      FifoTopic: 'true',
      EffectiveDeliveryPolicy: '{}',
      ArchivePolicy: '{"archive": "policy"}',
      Metadata: testMetadata,
      TopicArn: 'arn:aws:sns:eu-central-1:123456789012:TestTopicWithArchive',
    };
    const result = generatedMarkdownByTopic(snsTopic);
    expect(result).toContain('Documentation for the Amazon SNS Topic: TestTopicWithArchive.');
    expect(result).toContain('FifoTopic : true');
    expect(result).toContain('Open the TestTopicWithArchive  in the AWS console');
    expect(result).toContain('Publish test events to TestTopicWithArchive in the AWS console.');
    expect(result).toContain('Effective Delivery Policy');
    expect(result).toContain('Archive Policy');
    expect(result).toContain('{"archive": "policy"}');
  });
});
