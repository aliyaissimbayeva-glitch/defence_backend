const {
  getStatus,
  getPrice
} = require('../listing/listing.service')

describe('Listing Service', () => {

  test('should return FRESH status', () => {

    const future =
      new Date(
        Date.now() + 7200000
      );

    const result =
      getStatus(future);

    expect(result)
      .toBe('FRESH');
  });

  test('should return COMPOST status', () => {

    const past =
      new Date(
        Date.now() - 1000
      );

    const result =
      getStatus(past);

    expect(result)
      .toBe('COMPOST');
  });

  test('should calculate discounted price', () => {

    const future =
      new Date(
        Date.now() + 2000000
      );

    const result =
      getPrice(1000, future);

    expect(result)
      .toBe(700);
  });

});