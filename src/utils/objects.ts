import { ObjectId } from 'mongodb';

const recurse = (source: any, destination: any, currentKey?: string) => {
  for (const key in source) {
    const value = source[key];
    const newKey = currentKey ? `${currentKey}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value) && !ObjectId.isValid(value)) {
      recurse(value, destination, newKey);
    } else {
      destination[newKey] = value;
    }
  }
};

export const dotnotate = (object: any): any => {
  const result = {};
  recurse(object, result);
  return result;
};

export const removeUndefined = (object: any): any => {
  return JSON.parse(JSON.stringify(object));
};
