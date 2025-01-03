import { convertFilterKeysToLowerCase } from './config';

describe('convertFilterKeysToLowerCase', () => {
  it('should convert all keys to lowercase', () => {
    const input = { KeyOne: 'value1', KeyTwo: 'value2', KeyThree: 'value3' };
    const expectedOutput = { keyone: 'value1', keytwo: 'value2', keythree: 'value3' };
    expect(convertFilterKeysToLowerCase(input)).toEqual(expectedOutput);
  });

  it('should handle an empty object', () => {
    const input = {};
    const expectedOutput = {};
    expect(convertFilterKeysToLowerCase(input)).toEqual(expectedOutput);
  });

  it('should handle keys that are already lowercase', () => {
    const input = { keyone: 'value1', keytwo: 'value2', keythree: 'value3' };
    const expectedOutput = { keyone: 'value1', keytwo: 'value2', keythree: 'value3' };
    expect(convertFilterKeysToLowerCase(input)).toEqual(expectedOutput);
  });

  it('should handle mixed case keys', () => {
    const input = { KeyOne: 'value1', keyTwo: 'value2', KEYTHREE: 'value3' };
    const expectedOutput = { keyone: 'value1', keytwo: 'value2', keythree: 'value3' };
    expect(convertFilterKeysToLowerCase(input)).toEqual(expectedOutput);
  });

  it('should handle keys with special characters', () => {
    const input = { 'Key-One': 'value1', Key_Two: 'value2', 'Key.Three': 'value3' };
    const expectedOutput = { 'key-one': 'value1', key_two: 'value2', 'key.three': 'value3' };
    expect(convertFilterKeysToLowerCase(input)).toEqual(expectedOutput);
  });
});
