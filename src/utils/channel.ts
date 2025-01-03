import { SnsTopic } from '../types';

const getTopicUrl = (snsTopic: SnsTopic) => {
  const baseURL = `https://${snsTopic.Metadata.region}.console.aws.amazon.com`;
  return `${baseURL}/sns/v3/home?region=${snsTopic.Metadata.region}#/topic/${snsTopic.TopicArn}`;
};

const publishMessageUrl = (snsTopic: SnsTopic) => {
  const baseURL = `https://${snsTopic.Metadata.region}.console.aws.amazon.com`;
  return `${baseURL}/sns/v3/home?region=${snsTopic.Metadata.region}#/publish/topic/${snsTopic.TopicArn}`;
};

export const generatedMarkdownByTopic = (snsTopic: SnsTopic) => {
  return `
  
  ## Overview
  
  Documentation for the Amazon SNS Topic: ${snsTopic.DisplayName}.
  
  FifoTopic : ${snsTopic.FifoTopic}
  
  <Tiles >
      <Tile icon="GlobeAltIcon" href="${getTopicUrl(snsTopic)}" openWindow={true} title="Open Topic" description="Open the ${snsTopic.DisplayName}  in the AWS console" />
      <Tile icon="CodeBracketIcon" href="${publishMessageUrl(snsTopic)}" openWindow={true} title="Publish test events" description="Publish test events to ${snsTopic.DisplayName} in the AWS console." />
  </Tiles>
  
  ## Policies
  
  ### Effective Delivery Policy
  
 \`\`\`json title="Effective Delivery Policy"
    ${snsTopic.EffectiveDeliveryPolicy}
  \`\`\`
    
  ${
    snsTopic.ArchivePolicy
      ? `
### Archive Policy
\`\`\`json title="Archive Policy"
${snsTopic.ArchivePolicy}
\`\`\`  
    `
      : ''
  } 

  `;
};
