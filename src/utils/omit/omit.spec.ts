import { omit } from './omit';

describe('omit', () => {
  it('should omit the object keys', () => {
    const object = {
      name: 'Test',
      age: 10,
      gender: 'Male',
    };

    const omittedObject = omit(object, ['gender']);

    expect(omittedObject).not.toHaveProperty('gender');
  });
});
