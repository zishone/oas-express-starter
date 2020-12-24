import { describe, it } from 'mocha';
import { dotnotate } from '../../../src/utils';
import { expect } from 'chai';

export default () => {
  describe('dotnotate', () => {
    it('should dotnotate a given object', async () => {
      const obj = { a: { b: { c: 1 } } };

      const dotnotatedObject = dotnotate(obj);

      expect(dotnotatedObject).to.deep.equal({ 'a.b.c': 1 });
    });
  });
};
