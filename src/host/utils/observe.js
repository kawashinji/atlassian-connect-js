const threshold = 0.25;
let targets = [];
let observe;

const observed = target => {
  targets = targets.filter(({ element, callback }) => {
    if (element === target) {
      callback();
      return false;
    }
    return true;
  });
}

if ('IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ intersectionRatio, target }) => {
      if (intersectionRatio > 0) {
        observer.unobserve(target);
        observed(target);
      }
    });
  }, { threshold });
  observe = observer.observe.bind(observer);
}

export default (element, callback) => {
  if (typeof callback === 'function'
    && element instanceof Element) {
    targets.push({ element, callback });
    observe(element);
  }
};
