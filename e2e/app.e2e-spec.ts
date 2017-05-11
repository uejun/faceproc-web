import { FaceprocWebPage } from './app.po';

describe('faceproc-web App', () => {
  let page: FaceprocWebPage;

  beforeEach(() => {
    page = new FaceprocWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
