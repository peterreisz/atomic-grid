import { AtomicGridExamplePage } from './app.po';

describe('atomic-grid-example App', function() {
  let page: AtomicGridExamplePage;

  beforeEach(() => {
    page = new AtomicGridExamplePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
