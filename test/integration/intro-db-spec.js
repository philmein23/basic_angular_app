describe('the basic angular application', function() {
  it('should have a two way data binding', () => {
    browser.get('http://localhost:5000');
    element(by.model('random')).sendKeys('Hello there!');
    element(by.binding('random')).getText().then(function(text) {
      expect(text).toEqual('Hello there!');
    });
  });
});
