import util from 'simple-xdm/src/common/util';

const threshold = 0.25;
const throttle_delay = 500;
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
} else {
  // Ponyfill for SafarIE
  const getIntersection = (target) => {
    const docEl = document.documentElement;
    if (!docEl.contains(target)
      || getComputedStyle(target).display === 'none') {
      return;
    };
    const targetRect = target.getBoundingClientRect();
    let parent = target.parentNode;
    let intersection = targetRect;
    do {
      const parentStyle = getComputedStyle(parent);
      if (parentStyle.display === 'none') {
        return;
      };
      let parentRect;
      if (parent === document.body) {
        parentRect = {
          top: 0,
          left: 0,
          right: docEl.clientWidth,
          bottom: docEl.clientHeight,
        };
      } else if (parentStyle.overflow !== 'visible') {
        parentRect = parent.getBoundingClientRect();
      }
      if (parentRect) {
        const top = Math.max(parentRect.top, intersection.top);
        const left = Math.max(parentRect.left, intersection.left);
        const right = Math.min(parentRect.right, intersection.right);
        const bottom = Math.min(parentRect.bottom, intersection.bottom);
        const width = right - left;
        const height = bottom - top;
        if (width <= 0 || height <= 0) {
          return;
        };
        intersection = { top, left, right, bottom, width, height };
      }
      parent = parent.parentNode;
    } while (parent !== docEl);
    if (intersection) {
      return (intersection.width * intersection.height)
        / (targetRect.width * targetRect.height);
    }
  }

  observe = element => {
    if (getIntersection(element) >= threshold) {
      observed(element);
    }
  }

  const throttled_observe = util.throttle(() => {
    targets.forEach(({ element }) => observe(element));
  }, throttle_delay);

  window.addEventListener('resize', throttled_observe);
  document.addEventListener('scroll', throttled_observe);
  if ('MutationObserver' in window) {
    document.addEventListener('DOMContentLoaded', () => {
      new MutationObserver(throttled_observe).observe(document.body, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    });
  }
}

export default (element, callback) => {
  if (typeof callback === 'function'
    && element instanceof Element) {
    targets.push({ element, callback });
    observe(element);
  }
};
