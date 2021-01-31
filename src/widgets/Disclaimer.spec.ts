import Disclaimer from './Disclaimer';

describe('cov/widgets/Disclaimer', () => {
  const disclaimer = new Disclaimer();

  it('should have default title', () => {
    expect(disclaimer.title).toBe('Disclaimer');
  });

  it('should have default disclaimer', () => {
    expect(disclaimer.disclaimer).toBe(
      `There are no warranties, expressed or implied, including the warranty of merchantability or fitness for a particular purpose, accompanying this application.`,
    );
  });
});
