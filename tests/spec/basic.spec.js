describe("Jasmine", function() {
  it("successfully runs tests", function() {
    expect(true).toBe(true);
  });
});

describe("Getting page context JSON", function() {
  it("Checks that header contains 'Solidus'", function() {
    var headerValue = isSolidus('Solidus');
    expect(headerValue).toBe(true);
  });
});