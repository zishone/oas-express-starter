import { dotnotate } from '../../../src/utils';
import { expect } from 'chai';
import { it } from 'mocha';

export default (): void => {
  it('should dotnotate a given object', async (): Promise<void> => {
    const obj = { a: { b: { c: 1 } } };

    const dotnotatedObject = dotnotate(obj);

    expect(dotnotatedObject).to.deep.equal({ 'a.b.c': 1 });
  });
};
