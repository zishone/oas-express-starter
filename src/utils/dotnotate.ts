import { ObjectId } from 'mongodb';

const recurse = (source: { [key: string]: any }, destination: { [key: string]: any }, currentKey?: string): void => {
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

export const dotnotate = (object: { [key: string]: any }): { [key: string]: any } => {
  const result = {};
  recurse(object, result);
  return result;
};
