export const convertFilterKeysToLowerCase = (filter: { [key: string]: string }) => {
  const lowerCaseFilterObj: { [key: string]: string } = {};
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      lowerCaseFilterObj[key.toLowerCase()] = filter[key];
    }
  }
  return lowerCaseFilterObj;
};
