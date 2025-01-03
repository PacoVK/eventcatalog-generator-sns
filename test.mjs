import { parse } from '@aws-sdk/util-arn-parser';

console.log(parse('arn:aws:sns:eu-central-1:560965213947:FooBar').accountId);

const foo = {
  arn: 'arn:aws:sns:eu-central-1:560965213947:FooBar',
  bar: '',
};

console.log(foo.bar || 'default');
console.log(foo.eeee || 'default');
