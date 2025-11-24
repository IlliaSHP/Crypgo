import { b as bodyLockToggle, c as bodyLockStatus, u as uniqArray, e as bodyUnlock, g as gotoBlock, f as getHash, i as isMobile } from "./common.min.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function menuInit() {
  document.addEventListener("click", function(e) {
    if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
      bodyLockToggle();
      document.documentElement.toggleAttribute("data-fls-menu-open");
    }
  });
}
document.querySelector("[data-fls-menu]") ? window.addEventListener("load", menuInit) : null;
window.addEventListener("DOMContentLoaded", function() {
  headerLinkAnim();
});
function headerLinkAnim() {
  const header = document.querySelector("header");
  document.querySelectorAll("header .menu__list").forEach((list) => {
    let span = list.querySelector(".run");
    if (!span) {
      span = document.createElement("span");
      span.classList.add("run");
      list.appendChild(span);
    }
    let isFirstAppearance = true;
    let activeItem = null;
    function updateCoordinates(item) {
      const currentRect = item.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      const translateValueX = currentRect.left - listRect.left, translateValueY = currentRect.top - listRect.top, link = item.querySelector(".menu__link"), paddingTop = getComputedStyle(link).paddingTop, paddingTopValue = parseInt(paddingTop);
      const adjustedY = translateValueY - 5 + paddingTopValue, width = item.offsetWidth;
      span.style.setProperty("--x", translateValueX + "px");
      span.style.setProperty("--y", adjustedY + "px");
      span.style.setProperty("--width", width + "px");
      if (isFirstAppearance) {
        span.style.transition = "opacity 0.8s ease, width 0.8s ease";
      } else {
        span.style.transition = "all 1s ease";
      }
    }
    header.addEventListener("mouseover", function(event) {
      const item = event.target.closest(".menu__item");
      if (item) {
        activeItem = item;
        updateCoordinates(item);
        if (isFirstAppearance) {
          setTimeout(() => {
            span.classList.add("active");
            isFirstAppearance = false;
          }, 10);
        } else {
          span.classList.add("active");
        }
        span.classList.remove("hidden");
      }
    });
    header.addEventListener("mousemove", function(event) {
      const currentItem = event.target.closest(".menu__item");
      if (currentItem && currentItem === activeItem) {
        updateCoordinates(currentItem);
      }
    });
    header.addEventListener("mouseleave", function(event) {
      span.classList.add("hidden");
      span.classList.remove("active");
      span.style.setProperty("--width", "0px");
      isFirstAppearance = true;
      activeItem = null;
    });
    window.addEventListener("resize", function() {
      if (activeItem) {
        updateCoordinates(activeItem);
      }
    });
  });
}
function headerScroll() {
  const header = document.querySelector("[data-fls-header-scroll]");
  const headerShow = header.hasAttribute("data-fls-header-scroll-show");
  const headerShowTimer = header.dataset.flsHeaderScrollShow ? header.dataset.flsHeaderScrollShow : 500;
  const startPoint = header.dataset.flsHeaderScroll ? header.dataset.flsHeaderScroll : 1;
  let scrollDirection = 0;
  let timer;
  document.addEventListener("scroll", function(e) {
    const scrollTop = window.scrollY;
    clearTimeout(timer);
    if (scrollTop >= startPoint) {
      !header.classList.contains("--header-scroll") ? header.classList.add("--header-scroll") : null;
      if (headerShow) {
        if (scrollTop > scrollDirection) {
          header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
        } else {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }
        timer = setTimeout(() => {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }, headerShowTimer);
      }
    } else {
      header.classList.contains("--header-scroll") ? header.classList.remove("--header-scroll") : null;
      if (headerShow) {
        header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
      }
    }
    scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
  });
}
document.querySelector("[data-fls-header-scroll]") ? window.addEventListener("load", headerScroll) : null;
class ScrollWatcher {
  constructor(props) {
    let defaultConfig = {
      logging: true
    };
    this.config = Object.assign(defaultConfig, props);
    this.observer;
    !document.documentElement.hasAttribute("data-fls-watch") ? this.scrollWatcherRun() : null;
  }
  // Оновлюємо конструктор
  scrollWatcherUpdate() {
    this.scrollWatcherRun();
  }
  // Запускаємо конструктор
  scrollWatcherRun() {
    document.documentElement.setAttribute("data-fls-watch", "");
    this.scrollWatcherConstructor(document.querySelectorAll("[data-fls-watcher]"));
  }
  // Конструктор спостерігачів
  scrollWatcherConstructor(items) {
    if (items.length) {
      let uniqParams = uniqArray(Array.from(items).map(function(item) {
        if (item.dataset.flsWatcher === "navigator" && !item.dataset.flsWatcherThreshold) {
          let valueOfThreshold;
          if (item.clientHeight > 2) {
            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
            if (valueOfThreshold > 1) {
              valueOfThreshold = 1;
            }
          } else {
            valueOfThreshold = 1;
          }
          item.setAttribute(
            "data-fls-watcher-threshold",
            valueOfThreshold.toFixed(2)
          );
        }
        return `${item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null}|${item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px"}|${item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0}`;
      }));
      uniqParams.forEach((uniqParam) => {
        let uniqParamArray = uniqParam.split("|");
        let paramsWatch = {
          root: uniqParamArray[0],
          margin: uniqParamArray[1],
          threshold: uniqParamArray[2]
        };
        let groupItems = Array.from(items).filter(function(item) {
          let watchRoot = item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null;
          let watchMargin = item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px";
          let watchThreshold = item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0;
          if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) {
            return item;
          }
        });
        let configWatcher = this.getScrollWatcherConfig(paramsWatch);
        this.scrollWatcherInit(groupItems, configWatcher);
      });
    }
  }
  // Функція створення налаштувань
  getScrollWatcherConfig(paramsWatch) {
    let configWatcher = {};
    if (document.querySelector(paramsWatch.root)) {
      configWatcher.root = document.querySelector(paramsWatch.root);
    } else if (paramsWatch.root !== "null") ;
    configWatcher.rootMargin = paramsWatch.margin;
    if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
      return;
    }
    if (paramsWatch.threshold === "prx") {
      paramsWatch.threshold = [];
      for (let i = 0; i <= 1; i += 5e-3) {
        paramsWatch.threshold.push(i);
      }
    } else {
      paramsWatch.threshold = paramsWatch.threshold.split(",");
    }
    configWatcher.threshold = paramsWatch.threshold;
    return configWatcher;
  }
  // Функція створення нового спостерігача зі своїми налаштуваннями
  scrollWatcherCreate(configWatcher) {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        this.scrollWatcherCallback(entry, observer);
      });
    }, configWatcher);
  }
  // Функція ініціалізації спостерігача зі своїми налаштуваннями
  scrollWatcherInit(items, configWatcher) {
    this.scrollWatcherCreate(configWatcher);
    items.forEach((item) => this.observer.observe(item));
  }
  // Функція обробки базових дій точок спрацьовування
  scrollWatcherIntersecting(entry, targetElement) {
    if (entry.isIntersecting) {
      !targetElement.classList.contains("--watcher-view") ? targetElement.classList.add("--watcher-view") : null;
    } else {
      targetElement.classList.contains("--watcher-view") ? targetElement.classList.remove("--watcher-view") : null;
    }
  }
  // Функція відключення стеження за об'єктом
  scrollWatcherOff(targetElement, observer) {
    observer.unobserve(targetElement);
  }
  // Функція обробки спостереження
  scrollWatcherCallback(entry, observer) {
    const targetElement = entry.target;
    this.scrollWatcherIntersecting(entry, targetElement);
    targetElement.hasAttribute("data-fls-watcher-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
    document.dispatchEvent(new CustomEvent("watcherCallback", {
      detail: {
        entry
      }
    }));
  }
}
document.querySelector("[data-fls-watcher]") ? window.addEventListener("load", () => new ScrollWatcher({})) : null;
function pageNavigation() {
  document.addEventListener("click", pageNavigationAction);
  document.addEventListener("watcherCallback", pageNavigationAction);
  function pageNavigationAction(e) {
    if (e.type === "click") {
      const targetElement = e.target;
      if (targetElement.closest("[data-fls-scrollto]")) {
        const gotoLink = targetElement.closest("[data-fls-scrollto]");
        const gotoLinkSelector = gotoLink.dataset.flsScrollto ? gotoLink.dataset.flsScrollto : "";
        const noHeader = gotoLink.hasAttribute("data-fls-scrollto-header") ? true : false;
        const gotoSpeed = gotoLink.dataset.flsScrolltoSpeed ? gotoLink.dataset.flsScrolltoSpeed : 500;
        const offsetTop = gotoLink.dataset.flsScrolltoTop ? parseInt(gotoLink.dataset.flsScrolltoTop) : 0;
        if (window.fullpage) {
          const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fls-fullpage-section]");
          const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.flsFullpageId : null;
          if (fullpageSectionId !== null) {
            window.fullpage.switchingSection(fullpageSectionId);
            if (document.documentElement.hasAttribute("data-fls-menu-open")) {
              bodyUnlock();
              document.documentElement.removeAttribute("data-fls-menu-open");
            }
          }
        } else {
          gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
        }
        e.preventDefault();
      }
    } else if (e.type === "watcherCallback" && e.detail) {
      const entry = e.detail.entry;
      const targetElement = entry.target;
      if (targetElement.dataset.flsWatcher === "navigator") {
        document.querySelector(`[data-fls-scrollto].--navigator-active`);
        let navigatorCurrentItem;
        if (targetElement.id && document.querySelector(`[data-fls-scrollto="#${targetElement.id}"]`)) {
          navigatorCurrentItem = document.querySelector(`[data-fls-scrollto="#${targetElement.id}"]`);
        } else if (targetElement.classList.length) {
          for (let index = 0; index < targetElement.classList.length; index++) {
            const element = targetElement.classList[index];
            if (document.querySelector(`[data-fls-scrollto=".${element}"]`)) {
              navigatorCurrentItem = document.querySelector(`[data-fls-scrollto=".${element}"]`);
              break;
            }
          }
        }
        if (entry.isIntersecting) {
          navigatorCurrentItem ? navigatorCurrentItem.classList.add("--navigator-active") : null;
        } else {
          navigatorCurrentItem ? navigatorCurrentItem.classList.remove("--navigator-active") : null;
        }
      }
    }
  }
  if (getHash()) {
    let goToHash;
    if (document.querySelector(`#${getHash()}`)) {
      goToHash = `#${getHash()}`;
    } else if (document.querySelector(`.${getHash()}`)) {
      goToHash = `.${getHash()}`;
    }
    goToHash ? gotoBlock(goToHash) : null;
  }
}
document.querySelector("[data-fls-scrollto]") ? window.addEventListener("load", pageNavigation) : null;
const math = {
  lerp: (a, b, n) => {
    return (1 - n) * a + n * b;
  }
};
const CURSOR_SETTINGS = {
  shadowSizeMultiplier: 1.4,
  // Множник розміру при 100% магнетизмі (1.4 = 140%)
  shadowSizeEase: 0.25,
  // Швидкість розтягування тіні (0.1-0.3)
  // ДЕФОРМАЦІЯ ТІНІ
  magnetShadowDeformation: 3,
  // Як сильно стискається тінь при магнетизмі (2-6)
  minShadowScale: 0.6,
  // НОВИЙ: Мінімальний масштаб при вході (0.4-0.8)
  // Приклад: при вході в зону мінімальна висота буде 60% від повної
  // РУХЛИВІСТЬ ТІНІ
  shadowEase: 0.1,
  // Швидкість руху тіні до елемента (0.15-0.35)
  shadowMoveEase: 0.15,
  // Швидкість базового руху за мишею (0.05-0.3)
  // МАГНЕТИЗМ ТІНІ
  shadowMagnetStrength: 0.01
  // Як сильно тінь тягнеться до елемента (0.01-0.2)
};
const MAGNET_SETTINGS = {
  distance: 100,
  // Радіус зони магнетизму (50-150)
  hysteresis: 20,
  // Гістерезис "мертвої зони" (10-40)
  // МАГНЕТИЗМ ЕЛЕМЕНТА
  elementMagnetStrength: 0.5,
  // Як сильно елемент рухається до курсору (0.3-1.0)
  elementEase: 0.1
  // Швидкість руху елемента (0.1-0.3)
};
function customCursor() {
  const wrapper = document.querySelector("[data-fls-cursor]");
  const isShadowWrapper = document.querySelector("[data-fls-cursor-shadow]");
  const targetWrapper = wrapper || isShadowWrapper;
  if (targetWrapper && !isMobile.any()) {
    let getElementMotion = function(element) {
      if (!elementMotionMap.has(element)) {
        elementMotionMap.set(element, {
          target: { x: 0, y: 0 },
          // Цільова позиція
          current: { x: 0, y: 0 }
          // Поточна позиція (інтерпольована)
        });
      }
      return elementMotionMap.get(element);
    }, mouseActions = function(e) {
      if (e.type === "mouseout") {
        cursor.style.opacity = 0;
        resetAllMagneticElements();
      } else if (e.type === "mousemove") {
        cursor.style.removeProperty("opacity");
        if (e.target.closest("button") || e.target.closest("a") || e.target.closest("input") || window.getComputedStyle(e.target).cursor !== "none" && window.getComputedStyle(e.target).cursor !== "default") {
          cursor.classList.add("--hover");
        } else {
          cursor.classList.remove("--hover");
        }
      } else if (e.type === "mousedown") {
        cursor.classList.add("--active");
      } else if (e.type === "mouseup") {
        cursor.classList.remove("--active");
      }
      cursorPointer ? cursorPointer.style.transform = `translate3d(${e.clientX - cursorPointerStyle.width / 2}px, ${e.clientY - cursorPointerStyle.height / 2}px, 0)` : null;
      if (cursorShadow && shadowData) {
        shadowData.mouse.x = e.clientX;
        shadowData.mouse.y = e.clientY;
        shadowData.current.x = e.clientX;
        shadowData.current.y = e.clientY;
      }
      checkMagneticElements(e.clientX, e.clientY);
    }, checkMagneticElements = function(mouseX, mouseY) {
      const magneticElements = document.querySelectorAll("[data-fls-magnate]");
      let closestElement = null;
      let closestDistance = magnetData.distance;
      magneticElements.forEach((element) => {
        if (element === cursorShadow || element.closest(".fls-cursor")) {
          return;
        }
        const bounds = element.getBoundingClientRect();
        const elementCenterX = bounds.left + bounds.width / 2;
        const elementCenterY = bounds.top + bounds.height / 2;
        const distance = Math.sqrt(
          Math.pow(mouseX - elementCenterX, 2) + Math.pow(mouseY - elementCenterY, 2)
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestElement = element;
          magnetData.targetBounds = bounds;
        }
      });
      const threshold = magnetData.target ? magnetData.distance + magnetData.hysteresis : magnetData.distance;
      if (closestDistance > threshold) {
        closestElement = null;
      }
      if (magnetData.target !== closestElement) {
        if (magnetData.target) {
          magnetData.target.classList.remove("--magnate-pull");
        }
        if (closestElement === null) {
          shadowData.targetWidth = cursorShadowStyle.width;
          shadowData.targetHeight = cursorShadowStyle.height;
        }
      }
      magnetData.target = closestElement;
      magnetData.isActive = closestElement !== null;
    }, resetAllMagneticElements = function() {
      const magneticElements = document.querySelectorAll("[data-fls-magnate]");
      magneticElements.forEach((element) => {
        element.classList.remove("--magnate-pull");
        const motion = getElementMotion(element);
        motion.target.x = 0;
        motion.target.y = 0;
      });
      magnetData.target = null;
      magnetData.isActive = false;
      if (shadowData) {
        shadowData.targetWidth = cursorShadowStyle.width;
        shadowData.targetHeight = cursorShadowStyle.height;
      }
    }, updateShadowPosition = function() {
      if (cursorShadow && shadowData) {
        let targetX = shadowData.current.x;
        let targetY = shadowData.current.y;
        let targetShadowWidth = cursorShadowStyle.width;
        let targetShadowHeight = cursorShadowStyle.height;
        if (magnetData.isActive && magnetData.target && magnetData.targetBounds) {
          const elementCenterX = magnetData.targetBounds.left + magnetData.targetBounds.width / 2;
          const elementCenterY = magnetData.targetBounds.top + magnetData.targetBounds.height / 2;
          const motion = getElementMotion(magnetData.target);
          const actualElementCenterX = elementCenterX + motion.current.x;
          const actualElementCenterY = elementCenterY + motion.current.y;
          const distX = shadowData.mouse.x - actualElementCenterX;
          const distY = shadowData.mouse.y - actualElementCenterY;
          const distance = Math.sqrt(distX * distX + distY * distY);
          if (distance > 0) {
            const strength = Math.max(0, 1 - distance / magnetData.distance);
            const minScale = CURSOR_SETTINGS.minShadowScale;
            const adjustedStrength = minScale + strength * (1 - minScale);
            targetShadowWidth = math.lerp(
              cursorShadowStyle.width,
              magnetData.targetBounds.width * CURSOR_SETTINGS.shadowSizeMultiplier,
              adjustedStrength
            );
            targetShadowHeight = math.lerp(
              cursorShadowStyle.height,
              magnetData.targetBounds.height * CURSOR_SETTINGS.shadowSizeMultiplier,
              adjustedStrength
            );
            const elementX = actualElementCenterX - targetShadowWidth / 2;
            const elementY = actualElementCenterY - targetShadowHeight / 2;
            const cursorPullX = (shadowData.mouse.x - actualElementCenterX) * strength * magnetData.shadowMagnetStrength * 0.8;
            const cursorPullY = (shadowData.mouse.y - actualElementCenterY) * strength * magnetData.shadowMagnetStrength * 0.8;
            targetX = elementX + targetShadowWidth / 2 + cursorPullX;
            targetY = elementY + targetShadowHeight / 2 + cursorPullY;
          } else {
            targetShadowWidth = magnetData.targetBounds.width * CURSOR_SETTINGS.shadowSizeMultiplier;
            targetShadowHeight = magnetData.targetBounds.height * CURSOR_SETTINGS.shadowSizeMultiplier;
            targetX = actualElementCenterX;
            targetY = actualElementCenterY;
          }
          cursorShadow.classList.add("--magnate-active");
          const magnetStrength = Math.max(0, 1 - distance / magnetData.distance);
          shadowData.fx.magnetScale = 1 - magnetStrength * CURSOR_SETTINGS.magnetShadowDeformation / 10;
        } else {
          targetShadowWidth = cursorShadowStyle.width;
          targetShadowHeight = cursorShadowStyle.height;
          cursorShadow.classList.remove("--magnate-active");
          shadowData.fx.magnetScale = math.lerp(shadowData.fx.magnetScale, 1, 0.1);
        }
        shadowData.last.x = math.lerp(shadowData.last.x, targetX, magnetData.shadowEase);
        shadowData.last.y = math.lerp(shadowData.last.y, targetY, magnetData.shadowEase);
        shadowData.currentWidth = math.lerp(shadowData.currentWidth, targetShadowWidth, shadowData.sizeEase);
        shadowData.currentHeight = math.lerp(shadowData.currentHeight, targetShadowHeight, shadowData.sizeEase);
        shadowData.fx.diffX = shadowData.current.x - shadowData.last.x;
        shadowData.fx.accX = shadowData.fx.diffX / window.innerWidth;
        shadowData.fx.veloX = shadowData.fx.accX;
        shadowData.fx.diffY = shadowData.current.y - shadowData.last.y;
        shadowData.fx.accY = shadowData.fx.diffY / window.innerHeight;
        shadowData.fx.veloY = shadowData.fx.accY;
        const maxVelo = Math.max(Math.abs(shadowData.fx.veloX), Math.abs(shadowData.fx.veloY));
        shadowData.fx.scale = 1 - Math.abs(maxVelo * 4);
        const finalScale = shadowData.fx.scale * shadowData.fx.magnetScale;
        let borderRadius = "50%";
        if (magnetData.isActive && magnetData.target && magnetData.targetBounds) {
          borderRadius = window.getComputedStyle(magnetData.target).borderRadius;
        }
        cursorShadow.style.transform = `translate3d(${shadowData.last.x - shadowData.currentWidth / 2}px, ${shadowData.last.y - shadowData.currentHeight / 2}px, 0) scale(${finalScale})`;
        cursorShadow.style.width = `${shadowData.currentWidth}px`;
        cursorShadow.style.height = `${shadowData.currentHeight}px`;
        cursorShadow.style.borderRadius = borderRadius;
      }
    }, updateMagneticElements = function() {
      const magneticElements = document.querySelectorAll("[data-fls-magnate]");
      magneticElements.forEach((element) => {
        const motion = getElementMotion(element);
        if (magnetData.target === element && magnetData.isActive) {
          const bounds = element.getBoundingClientRect();
          const elementCenterX = bounds.left + bounds.width / 2;
          const elementCenterY = bounds.top + bounds.height / 2;
          const distX = shadowData.mouse.x - elementCenterX;
          const distY = shadowData.mouse.y - elementCenterY;
          const distance = Math.sqrt(distX * distX + distY * distY);
          if (distance > 0 && distance < magnetData.distance) {
            const strength = 1 - distance / magnetData.distance;
            motion.target.x = distX * strength * magnetData.elementMagnetStrength * 0.8;
            motion.target.y = distY * strength * magnetData.elementMagnetStrength * 0.8;
            motion.absoluteX = elementCenterX + motion.target.x;
            motion.absoluteY = elementCenterY + motion.target.y;
          } else {
            motion.target.x = 0;
            motion.target.y = 0;
            motion.absoluteX = elementCenterX;
            motion.absoluteY = elementCenterY;
          }
          motion.current.x = math.lerp(motion.current.x, motion.target.x, magnetData.elementEase);
          motion.current.y = math.lerp(motion.current.y, motion.target.y, magnetData.elementEase);
          element.style.transform = `translate(${motion.current.x}px, ${motion.current.y}px)`;
          element.classList.add("--magnate-pull");
        } else {
          motion.target.x = 0;
          motion.target.y = 0;
          motion.current.x = math.lerp(motion.current.x, 0, magnetData.elementEase);
          motion.current.y = math.lerp(motion.current.y, 0, magnetData.elementEase);
          element.style.transform = `translate(${motion.current.x}px, ${motion.current.y}px)`;
          if (Math.abs(motion.current.x) < 0.5 && Math.abs(motion.current.y) < 0.5) {
            element.classList.remove("--magnate-pull");
          }
        }
      });
    };
    const isShadowTrue = document.querySelector("[data-fls-cursor-shadow]");
    const cursor = document.createElement("div");
    cursor.classList.add("fls-cursor");
    cursor.style.opacity = 0;
    if (wrapper) {
      cursor.insertAdjacentHTML("beforeend", `<span class="fls-cursor__pointer"></span>`);
    }
    if (isShadowTrue) {
      cursor.insertAdjacentHTML("beforeend", `<span class="fls-cursor__shadow"></span>`);
    }
    targetWrapper.append(cursor);
    const cursorPointer = document.querySelector(".fls-cursor__pointer");
    const cursorPointerStyle = {
      width: cursorPointer?.offsetWidth || 0,
      height: cursorPointer?.offsetHeight || 0
    };
    let cursorShadow, cursorShadowStyle;
    let shadowData = null;
    if (isShadowTrue) {
      cursorShadow = document.querySelector(".fls-cursor__shadow");
      cursorShadowStyle = {
        width: cursorShadow.offsetWidth,
        height: cursorShadow.offsetHeight
      };
      shadowData = {
        // Поточна позиція миші (оновлюється при mousemove)
        mouse: {
          x: 0,
          y: 0
        },
        // Поточна позиція тіні (інтерпольована позиція)
        current: {
          x: 0,
          y: 0
        },
        // Остання позиція тіні (для розрахунку швидкості)
        last: {
          x: 0,
          y: 0
        },
        // Швидкість інтерполяції тіні
        ease: CURSOR_SETTINGS.shadowMoveEase,
        // Розмір тіні (оновлюється при магнетизмі елемента)
        targetWidth: cursorShadowStyle.width,
        targetHeight: cursorShadowStyle.height,
        currentWidth: cursorShadowStyle.width,
        currentHeight: cursorShadowStyle.height,
        // Швидкість зміни розміру тіні
        sizeEase: CURSOR_SETTINGS.shadowSizeEase,
        // Ефекти (деформація тіні при русі)
        fx: {
          diffX: 0,
          diffY: 0,
          accX: 0,
          accY: 0,
          veloX: 0,
          veloY: 0,
          scale: 1,
          // Окремий масштаб для магнетичної зони
          magnetScale: 1
        },
        // Позиціонування тіні
        posX: 0,
        posY: 0
      };
    }
    const magnetData = {
      target: null,
      targetBounds: null,
      isActive: false,
      distance: MAGNET_SETTINGS.distance,
      hysteresis: MAGNET_SETTINGS.hysteresis,
      elementMagnetStrength: MAGNET_SETTINGS.elementMagnetStrength,
      shadowMagnetStrength: CURSOR_SETTINGS.shadowMagnetStrength,
      elementEase: MAGNET_SETTINGS.elementEase,
      shadowEase: CURSOR_SETTINGS.shadowEase
    };
    const elementMotionMap = /* @__PURE__ */ new WeakMap();
    targetWrapper.addEventListener("mouseup", mouseActions);
    targetWrapper.addEventListener("mousedown", mouseActions);
    targetWrapper.addEventListener("mousemove", mouseActions);
    targetWrapper.addEventListener("mouseout", mouseActions);
    if (isShadowTrue && shadowData) {
      let animateShadow = function() {
        updateShadowPosition();
        updateMagneticElements();
        requestAnimationFrame(animateShadow);
      };
      animateShadow();
    }
  }
}
document.querySelector("[data-fls-cursor]") || document.querySelector("[data-fls-cursor-shadow]") ? window.addEventListener("load", customCursor) : null;
