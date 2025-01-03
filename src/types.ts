import { AwsCredentialIdentity, AwsCredentialIdentityProvider } from '@smithy/types';
import { ARN } from '@aws-sdk/util-arn-parser';

export type EventCatalogConfig = any;

export type GeneratorProps = {
  credentials?: AwsCredentialIdentity | AwsCredentialIdentityProvider;
  filter?: { [key: string]: string };
  ownerTagKey?: string;
};

export type SnsTopic = {
  TopicArn: string;
  DisplayName: string;
  EffectiveDeliveryPolicy: any;
  FifoTopic: string;
  ArchivePolicy: any | undefined;
  Metadata: ARN;
  Owner?: string;
};
