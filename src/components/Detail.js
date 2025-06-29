import DetailView from "../views/DetailView.js";
import DetailPresenter from "../presenters/DetailPresenter.js";

export default class Detail {
  constructor(container, storyId) {
    const view = new DetailView(container, () => {
      window.location.hash = "#/login";
    });
    new DetailPresenter(view, storyId);
  }
}
