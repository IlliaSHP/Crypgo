import { s as slideUp, a as slideToggle, b as bodyLockToggle, c as bodyLockStatus, u as uniqArray, i as isMobile } from "./common.min.js";
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
let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll("[required]");
    if (formRequiredItems.length) {
      formRequiredItems.forEach((formRequiredItem) => {
        if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    let error = 0;
    if (formRequiredItem.type === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(" ", "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
      this.addError(formRequiredItem);
      this.removeSuccess(formRequiredItem);
      error++;
    } else {
      if (!formRequiredItem.value.trim()) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }
    return error;
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add("--form-error");
    formRequiredItem.parentElement.classList.add("--form-error");
    let inputError = formRequiredItem.parentElement.querySelector("[data-fls-form-error]");
    if (inputError) formRequiredItem.parentElement.removeChild(inputError);
    if (formRequiredItem.dataset.flsFormErrtext) {
      formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div data-fls-form-error>${formRequiredItem.dataset.flsFormErrtext}</div>`);
    }
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove("--form-error");
    formRequiredItem.parentElement.classList.remove("--form-error");
    if (formRequiredItem.parentElement.querySelector("[data-fls-form-error]")) {
      formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector("[data-fls-form-error]"));
    }
  },
  addSuccess(formRequiredItem) {
    formRequiredItem.classList.add("--form-success");
    formRequiredItem.parentElement.classList.add("--form-success");
  },
  removeSuccess(formRequiredItem) {
    formRequiredItem.classList.remove("--form-success");
    formRequiredItem.parentElement.classList.remove("--form-success");
  },
  removeFocus(formRequiredItem) {
    formRequiredItem.classList.remove("--form-focus");
    formRequiredItem.parentElement.classList.remove("--form-focus");
  },
  formClean(form) {
    form.reset();
    setTimeout(() => {
      let inputs = form.querySelectorAll("input,textarea");
      for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        formValidate.removeFocus(el);
        formValidate.removeSuccess(el);
        formValidate.removeError(el);
      }
      let checkboxes = form.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length) {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      }
      if (window["flsSelect"]) {
        let selects = form.querySelectorAll("select[data-fls-select]");
        if (selects.length) {
          selects.forEach((select) => {
            window["flsSelect"].selectBuild(select);
          });
        }
      }
    }, 0);
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
  }
};
class SelectConstructor {
  constructor(props, data = null) {
    let defaultConfig = {
      init: true,
      speed: 150
    };
    this.config = Object.assign(defaultConfig, props);
    this.selectClasses = {
      classSelect: "select",
      // Головний блок
      classSelectBody: "select__body",
      // Тіло селекту
      classSelectTitle: "select__title",
      // Заголовок
      classSelectValue: "select__value",
      // Значення у заголовку
      classSelectLabel: "select__label",
      // Лабел
      classSelectInput: "select__input",
      // Поле введення
      classSelectText: "select__text",
      // Оболонка текстових даних
      classSelectLink: "select__link",
      // Посилання в елементі
      classSelectOptions: "select__options",
      // Випадаючий список
      classSelectOptionsScroll: "select__scroll",
      // Оболонка при скролі
      classSelectOption: "select__option",
      // Пункт
      classSelectContent: "select__content",
      // Оболонка контенту в заголовку
      classSelectRow: "select__row",
      // Ряд
      classSelectData: "select__asset",
      // Додаткові дані
      classSelectDisabled: "--select-disabled",
      // Заборонено
      classSelectTag: "--select-tag",
      // Клас тега
      classSelectOpen: "--select-open",
      // Список відкритий
      classSelectActive: "--select-active",
      // Список вибрано
      classSelectFocus: "--select-focus",
      // Список у фокусі
      classSelectMultiple: "--select-multiple",
      // Мультивибір
      classSelectCheckBox: "--select-checkbox",
      // Стиль чекбоксу
      classSelectOptionSelected: "--select-selected",
      // Вибраний пункт
      classSelectPseudoLabel: "--select-pseudo-label"
      // Псевдолейбл
    };
    this._this = this;
    if (this.config.init) {
      const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select[data-fls-select]");
      if (selectItems.length) {
        this.selectsInit(selectItems);
      }
    }
  }
  // Конструктор CSS класу
  getSelectClass(className) {
    return `.${className}`;
  }
  // Геттер елементів псевдоселекту
  getSelectElement(selectItem, className) {
    return {
      originalSelect: selectItem.querySelector("select"),
      selectElement: selectItem.querySelector(this.getSelectClass(className))
    };
  }
  // Функція ініціалізації всіх селектів
  selectsInit(selectItems) {
    selectItems.forEach((originalSelect, index) => {
      this.selectInit(originalSelect, index + 1);
    });
    document.addEventListener("click", (function(e) {
      this.selectsActions(e);
    }).bind(this));
    document.addEventListener("keydown", (function(e) {
      this.selectsActions(e);
    }).bind(this));
    document.addEventListener("focusin", (function(e) {
      this.selectsActions(e);
    }).bind(this));
    document.addEventListener("focusout", (function(e) {
      this.selectsActions(e);
    }).bind(this));
  }
  // Функція ініціалізації конкретного селекту
  selectInit(originalSelect, index) {
    index ? originalSelect.dataset.flsSelectId = index : null;
    if (originalSelect.options.length) {
      const _this = this;
      let selectItem = document.createElement("div");
      selectItem.classList.add(this.selectClasses.classSelect);
      originalSelect.parentNode.insertBefore(selectItem, originalSelect);
      selectItem.appendChild(originalSelect);
      originalSelect.hidden = true;
      if (this.getSelectPlaceholder(originalSelect)) {
        originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
        if (this.getSelectPlaceholder(originalSelect).label.show) {
          const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
          selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
        }
      }
      selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
      this.selectBuild(originalSelect);
      originalSelect.dataset.flsSelectSpeed = originalSelect.dataset.flsSelectSpeed ? originalSelect.dataset.flsSelectSpeed : this.config.speed;
      this.config.speed = +originalSelect.dataset.flsSelectSpeed;
      originalSelect.addEventListener("change", function(e) {
        _this.selectChange(e);
      });
    }
  }
  // Конструктор псевдоселекту
  selectBuild(originalSelect) {
    const selectItem = originalSelect.parentElement;
    if (originalSelect.id) {
      selectItem.id = originalSelect.id;
      originalSelect.removeAttribute("id");
    }
    selectItem.dataset.flsSelectId = originalSelect.dataset.flsSelectId;
    originalSelect.dataset.flsSelectModif ? selectItem.classList.add(`select--${originalSelect.dataset.flsSelectModif}`) : null;
    originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
    originalSelect.hasAttribute("data-fls-select-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
    this.setSelectTitleValue(selectItem, originalSelect);
    this.setOptions(selectItem, originalSelect);
    originalSelect.hasAttribute("data-fls-select-search") ? this.searchActions(selectItem) : null;
    originalSelect.hasAttribute("data-fls-select-open") ? this.selectAction(selectItem) : null;
    this.selectDisabled(selectItem, originalSelect);
  }
  // Функція реакцій на події
  selectsActions(e) {
    const t = e.target, type = e.type;
    const isSelect = t.closest(this.getSelectClass(this.selectClasses.classSelect));
    const isTag = t.closest(this.getSelectClass(this.selectClasses.classSelectTag));
    if (!isSelect && !isTag) return this.selectsСlose();
    const selectItem = isSelect || document.querySelector(`.${this.selectClasses.classSelect}[data-fls-select-id="${isTag.dataset.flsSelectId}"]`);
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    if (originalSelect.disabled) return;
    if (type === "click") {
      const tag = t.closest(this.getSelectClass(this.selectClasses.classSelectTag));
      const title = t.closest(this.getSelectClass(this.selectClasses.classSelectTitle));
      const option = t.closest(this.getSelectClass(this.selectClasses.classSelectOption));
      if (tag) {
        const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-fls-select-id="${tag.dataset.flsSelectId}"] .select__option[data-fls-select-value="${tag.dataset.flsSelectValue}"]`);
        this.optionAction(selectItem, originalSelect, optionItem);
      } else if (title) {
        this.selectAction(selectItem);
      } else if (option) {
        this.optionAction(selectItem, originalSelect, option);
      }
    } else if (type === "focusin" || type === "focusout") {
      if (isSelect) selectItem.classList.toggle(this.selectClasses.classSelectFocus, type === "focusin");
    } else if (type === "keydown" && e.code === "Escape") {
      this.selectsСlose();
    }
  }
  // Функція закриття всіх селектів
  selectsСlose(selectOneGroup) {
    const selectsGroup = selectOneGroup ? selectOneGroup : document;
    const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
    if (selectActiveItems.length) {
      selectActiveItems.forEach((selectActiveItem) => {
        this.selectСlose(selectActiveItem);
      });
    }
  }
  // Функція закриття конкретного селекту
  selectСlose(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    if (!selectOptions.classList.contains("_slide")) {
      selectItem.classList.remove(this.selectClasses.classSelectOpen);
      slideUp(selectOptions, originalSelect.dataset.flsSelectSpeed);
      setTimeout(() => {
        selectItem.style.zIndex = "";
      }, originalSelect.dataset.flsSelectSpeed);
    }
  }
  // Функція відкриття/закриття конкретного селекту
  selectAction(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`);
    const selectOpenzIndex = originalSelect.dataset.flsSelectZIndex ? originalSelect.dataset.flsSelectZIndex : 3;
    this.setOptionsPosition(selectItem);
    if (originalSelect.closest("[data-fls-select-one]")) {
      const selectOneGroup = originalSelect.closest("[data-fls-select-one]");
      this.selectsСlose(selectOneGroup);
    }
    setTimeout(() => {
      if (!selectOptions.classList.contains("--slide")) {
        selectItem.classList.toggle(this.selectClasses.classSelectOpen);
        slideToggle(selectOptions, originalSelect.dataset.flsSelectSpeed);
        if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
          selectItem.style.zIndex = selectOpenzIndex;
        } else {
          setTimeout(() => {
            selectItem.style.zIndex = "";
          }, originalSelect.dataset.flsSelectSpeed);
        }
      }
    }, 0);
  }
  // Сеттер значення заголовка селекту
  setSelectTitleValue(selectItem, originalSelect) {
    const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
    if (selectItemTitle) selectItemTitle.remove();
    selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
    originalSelect.hasAttribute("data-fls-select-search") ? this.searchActions(selectItem) : null;
  }
  // Конструктор значення заголовка
  getSelectTitleValue(selectItem, originalSelect) {
    let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
    if (originalSelect.multiple && originalSelect.hasAttribute("data-fls-select-tags")) {
      selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option) => `<span role="button" data-fls-select-id="${selectItem.dataset.flsSelectId}" data-fls-select-value="${option.value}" class="--select-tag">${this.getSelectElementContent(option)}</span>`).join("");
      if (originalSelect.dataset.flsSelectTags && document.querySelector(originalSelect.dataset.flsSelectTags)) {
        document.querySelector(originalSelect.dataset.flsSelectTags).innerHTML = selectTitleValue;
        if (originalSelect.hasAttribute("data-fls-select-search")) selectTitleValue = false;
      }
    }
    selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.flsSelectPlaceholder || "";
    if (!originalSelect.hasAttribute("data-fls-select-tags")) {
      selectTitleValue = selectTitleValue.length ? selectTitleValue.map((item) => {
        return item;
      }) : "";
    }
    let pseudoAttribute = "";
    let pseudoAttributeClass = "";
    if (originalSelect.hasAttribute("data-fls-select-pseudo-label")) {
      pseudoAttribute = originalSelect.dataset.flsSelectPseudoLabel ? ` data-fls-select-pseudo-label="${originalSelect.dataset.flsSelectPseudoLabel}"` : ` data-fls-select-pseudo-label="Заповніть атрибут"`;
      pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
    }
    this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
    if (originalSelect.hasAttribute("data-fls-select-search")) {
      return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-fls-select-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
    } else {
      const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.flsSelectClass ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.flsSelectClass}` : "";
      return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
    }
  }
  // Конструктор даних для значення заголовка
  getSelectElementContent(selectOption) {
    const selectOptionData = selectOption.dataset.flsSelectAsset ? `${selectOption.dataset.flsSelectAsset}` : "";
    const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
    let selectOptionContentHTML = ``;
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
    selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
    selectOptionContentHTML += selectOptionData ? `</span>` : "";
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
    selectOptionContentHTML += selectOption.textContent;
    selectOptionContentHTML += selectOptionData ? `</span>` : "";
    selectOptionContentHTML += selectOptionData ? `</span>` : "";
    return selectOptionContentHTML;
  }
  // Отримання даних плейсхолдера
  getSelectPlaceholder(originalSelect) {
    const selectPlaceholder = Array.from(originalSelect.options).find((option) => !option.value);
    if (selectPlaceholder) {
      return {
        value: selectPlaceholder.textContent,
        show: selectPlaceholder.hasAttribute("data-fls-select-show"),
        label: {
          show: selectPlaceholder.hasAttribute("data-fls-select-label"),
          text: selectPlaceholder.dataset.flsSelectLabel
        }
      };
    }
  }
  // Отримання даних із вибраних елементів
  getSelectedOptionsData(originalSelect, type) {
    let selectedOptions = [];
    if (originalSelect.multiple) {
      selectedOptions = Array.from(originalSelect.options).filter((option) => option.value).filter((option) => option.selected);
    } else {
      selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
    }
    return {
      elements: selectedOptions.map((option) => option),
      values: selectedOptions.filter((option) => option.value).map((option) => option.value),
      html: selectedOptions.map((option) => this.getSelectElementContent(option))
    };
  }
  // Конструктор елементів списку
  getOptions(originalSelect) {
    const selectOptionsScroll = originalSelect.hasAttribute("data-fls-select-scroll") ? `` : "";
    +originalSelect.dataset.flsSelectScroll ? +originalSelect.dataset.flsSelectScroll : null;
    let selectOptions = Array.from(originalSelect.options);
    if (selectOptions.length > 0) {
      let selectOptionsHTML = ``;
      if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) {
        selectOptions = selectOptions.filter((option) => option.value);
      }
      selectOptionsHTML += `<div ${selectOptionsScroll} ${""} class="${this.selectClasses.classSelectOptionsScroll}">`;
      selectOptions.forEach((selectOption) => {
        selectOptionsHTML += this.getOption(selectOption, originalSelect);
      });
      selectOptionsHTML += `</div>`;
      return selectOptionsHTML;
    }
  }
  // Конструктор конкретного елемента списку
  getOption(selectOption, originalSelect) {
    const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
    const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-fls-select-show-selected") && !originalSelect.multiple ? `hidden` : ``;
    const selectOptionClass = selectOption.dataset.flsSelectClass ? ` ${selectOption.dataset.flsSelectClass}` : "";
    const selectOptionLink = selectOption.dataset.flsSelectHref ? selectOption.dataset.flsSelectHref : false;
    const selectOptionLinkTarget = selectOption.hasAttribute("data-fls-select-href-blank") ? `target="_blank"` : "";
    let selectOptionHTML = ``;
    selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-fls-select-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-fls-select-value="${selectOption.value}" type="button">`;
    selectOptionHTML += this.getSelectElementContent(selectOption);
    selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
    return selectOptionHTML;
  }
  // Сеттер елементів списку (options)
  setOptions(selectItem, originalSelect) {
    const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    selectItemOptions.innerHTML = this.getOptions(originalSelect);
  }
  // Визначаємо, де видобразити випадаючий список
  setOptionsPosition(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
    const customMaxHeightValue = +originalSelect.dataset.flsSelectScroll ? `${+originalSelect.dataset.flsSelectScroll}px` : ``;
    const selectOptionsPosMargin = +originalSelect.dataset.flsSelectOptionsMargin ? +originalSelect.dataset.flsSelectOptionsMargin : 10;
    if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
      selectOptions.hidden = false;
      const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue("max-height"));
      const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
      const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
      selectOptions.hidden = true;
      const selectItemHeight = selectItem.offsetHeight;
      const selectItemPos = selectItem.getBoundingClientRect().top;
      const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
      const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);
      if (selectItemResult < 0) {
        const newMaxHeightValue = selectOptionsHeight + selectItemResult;
        if (newMaxHeightValue < 100) {
          selectItem.classList.add("select--show-top");
          selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
        } else {
          selectItem.classList.remove("select--show-top");
          selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
        }
      }
    } else {
      setTimeout(() => {
        selectItem.classList.remove("select--show-top");
        selectItemScroll.style.maxHeight = customMaxHeightValue;
      }, +originalSelect.dataset.flsSelectSpeed);
    }
  }
  // Обробник кліку на пункт списку
  optionAction(selectItem, originalSelect, optionItem) {
    const optionsBox = selectItem.querySelector(this.getSelectClass(this.selectClasses.classSelectOptions));
    if (optionsBox.classList.contains("--slide")) return;
    if (originalSelect.multiple) {
      optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
      const selectedEls = this.getSelectedOptionsData(originalSelect).elements;
      for (const el of selectedEls) {
        el.removeAttribute("selected");
      }
      const selectedUI = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
      for (const el of selectedUI) {
        const val = el.dataset.flsSelectValue;
        const opt = originalSelect.querySelector(`option[value="${val}"]`);
        if (opt) opt.setAttribute("selected", "selected");
      }
    } else {
      if (!originalSelect.hasAttribute("data-fls-select-show-selected")) {
        setTimeout(() => {
          const hiddenOpt = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`);
          if (hiddenOpt) hiddenOpt.hidden = false;
          optionItem.hidden = true;
        }, this.config.speed);
      }
      originalSelect.value = optionItem.dataset.flsSelectValue || optionItem.textContent;
      this.selectAction(selectItem);
    }
    this.setSelectTitleValue(selectItem, originalSelect);
    this.setSelectChange(originalSelect);
  }
  // Реакція на зміну оригінального select
  selectChange(e) {
    const originalSelect = e.target;
    this.selectBuild(originalSelect);
    this.setSelectChange(originalSelect);
  }
  // Обробник зміни у селекті
  setSelectChange(originalSelect) {
    if (originalSelect.hasAttribute("data-fls-select-validate")) {
      formValidate.validateInput(originalSelect);
    }
    if (originalSelect.hasAttribute("data-fls-select-submit") && originalSelect.value) {
      let tempButton = document.createElement("button");
      tempButton.type = "submit";
      originalSelect.closest("form").append(tempButton);
      tempButton.click();
      tempButton.remove();
    }
    const selectItem = originalSelect.parentElement;
    this.selectCallback(selectItem, originalSelect);
  }
  // Обробник disabled
  selectDisabled(selectItem, originalSelect) {
    if (originalSelect.disabled) {
      selectItem.classList.add(this.selectClasses.classSelectDisabled);
      this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
    } else {
      selectItem.classList.remove(this.selectClasses.classSelectDisabled);
      this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
    }
  }
  // Обробник пошуку за елементами списку
  searchActions(selectItem) {
    const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    selectInput.addEventListener("input", () => {
      const inputValue = selectInput.value.toLowerCase();
      const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`);
      selectOptionsItems.forEach((item) => {
        const itemText = item.textContent.toLowerCase();
        item.hidden = !itemText.includes(inputValue);
      });
      if (selectOptions.hidden) {
        this.selectAction(selectItem);
      }
    });
  }
  // Коллбек функція
  selectCallback(selectItem, originalSelect) {
    document.dispatchEvent(new CustomEvent("selectCallback", {
      detail: {
        select: originalSelect
      }
    }));
  }
}
document.querySelector("select[data-fls-select]") ? window.addEventListener("load", () => window.flsSelect = new SelectConstructor({})) : null;
const animationDuration = 2500;
const pauseBetweenLines = 2500;
const initialDelay = 5e3;
const circleAnimationDuration = 2500;
const decorElement = document.querySelector(".decor-statistic-features");
const lines = decorElement?.querySelectorAll(".decor-line");
const circles = decorElement?.querySelectorAll(".decor-circle");
let currentLineIndex = 0;
let isAnimating = false;
let animationTimeout = null;
function log(message, data = null) {
  const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
  console.log(`[${timestamp}] 🎬 ANIMATION: ${message}`, data ? data : "");
}
function resetAnimation(element) {
  if (element) {
    element.style.animation = "none";
    void element.offsetWidth;
  }
}
function animateLine(index) {
  if (!lines || index >= lines.length) {
    return;
  }
  const line = lines[index];
  const path = line.querySelector("path:nth-of-type(1)");
  const circle = circles ? circles[index % circles.length] : null;
  if (!path) {
    return;
  }
  isAnimating = true;
  path.style.animation = `drawLine ${animationDuration / 1e3}s linear forwards`;
  if (circle) {
    circle.style.animation = `drawCircle ${circleAnimationDuration / 1e3}s ease-in-out forwards`;
  }
  animationTimeout = setTimeout(() => {
    resetAnimation(path);
    if (circle) {
      resetAnimation(circle);
    }
    currentLineIndex = (currentLineIndex + 1) % lines.length;
    animationTimeout = setTimeout(() => {
      animateLine(currentLineIndex);
    }, pauseBetweenLines);
  }, animationDuration);
}
function initializeAnimationObserver() {
  const watcherContainer = document.querySelector(".features__container[data-fls-watcher]");
  if (!watcherContainer) {
    return;
  }
  if (!decorElement) {
    return;
  }
  if (!lines || lines.length === 0) {
    return;
  }
  if (!circles || circles.length === 0) ;
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        if (watcherContainer.classList.contains("--watcher-view")) {
          if (!isAnimating) {
            currentLineIndex = 0;
            animationTimeout = setTimeout(() => {
              animateLine(currentLineIndex);
            }, initialDelay);
          } else {
            log("---");
          }
        } else {
          log("---");
        }
      }
    });
  });
  observer.observe(watcherContainer, {
    attributes: true,
    attributeFilter: ["class"]
  });
  if (watcherContainer.classList.contains("--watcher-view")) {
    if (!isAnimating) {
      currentLineIndex = 0;
      animationTimeout = setTimeout(() => {
        animateLine(currentLineIndex);
      }, initialDelay);
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  initializeAnimationObserver();
});
window.addEventListener("beforeunload", () => {
  if (animationTimeout) {
    clearTimeout(animationTimeout);
  }
});
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
        span.style.transition = "all 0.8s ease";
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
class Parallax {
  constructor(elements) {
    if (elements.length) {
      this.elements = Array.from(elements).map((el) => new Parallax.Each(el, this.options));
    }
  }
  destroyEvents() {
    this.elements.forEach((el) => {
      el.destroyEvents();
    });
  }
  setEvents() {
    this.elements.forEach((el) => {
      el.setEvents();
    });
  }
}
Parallax.Each = class {
  constructor(parent) {
    this.parent = parent;
    this.elements = this.parent.querySelectorAll("[data-fls-parallax]");
    this.animation = this.animationFrame.bind(this);
    this.offset = 0;
    this.value = 0;
    this.smooth = parent.dataset.flsParallaxSmooth ? Number(parent.dataset.flsParallaxSmooth) : 15;
    this.setEvents();
  }
  setEvents() {
    this.animationID = window.requestAnimationFrame(this.animation);
  }
  destroyEvents() {
    window.cancelAnimationFrame(this.animationID);
  }
  animationFrame() {
    const topToWindow = this.parent.getBoundingClientRect().top;
    const heightParent = this.parent.offsetHeight;
    const heightWindow = window.innerHeight;
    const positionParent = {
      top: topToWindow - heightWindow,
      bottom: topToWindow + heightParent
    };
    const centerPoint = this.parent.dataset.flsParallaxCenter ? this.parent.dataset.flsParallaxCenter : "center";
    if (positionParent.top < 30 && positionParent.bottom > -30) {
      switch (centerPoint) {
        // верхній точці (початок батька стикається верхнього краю екрану)
        case "top":
          this.offset = -1 * topToWindow;
          break;
        // центрі екрана (середина батька у середині екрана)
        case "center":
          this.offset = heightWindow / 2 - (topToWindow + heightParent / 2);
          break;
        // Початок: нижня частина екрана = верхня частина батька
        case "bottom":
          this.offset = heightWindow - (topToWindow + heightParent);
          break;
      }
    }
    this.value += (this.offset - this.value) / this.smooth;
    this.animationID = window.requestAnimationFrame(this.animation);
    this.elements.forEach((el) => {
      const parameters = {
        axis: el.dataset.axis ? el.dataset.axis : "v",
        direction: el.dataset.flsParallaxDirection ? el.dataset.flsParallaxDirection + "1" : "-1",
        coefficient: el.dataset.flsParallaxCoefficient ? Number(el.dataset.flsParallaxCoefficient) : 5,
        additionalProperties: el.dataset.flsParallaxProperties ? el.dataset.flsParallaxProperties : ""
      };
      this.parameters(el, parameters);
    });
  }
  parameters(el, parameters) {
    if (parameters.axis == "v") {
      el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`;
    } else if (parameters.axis == "h") {
      el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`;
    }
  }
};
if (document.querySelector("[data-fls-parallax-parent]")) {
  new Parallax(document.querySelectorAll("[data-fls-parallax-parent]"));
}
const marquee = () => {
  const $marqueeArray = document.querySelectorAll("[data-fls-marquee]");
  const ATTR_NAMES = {
    inner: "data-fls-marquee-inner",
    item: "data-fls-marquee-item"
  };
  if (!$marqueeArray.length) return;
  const { head } = document;
  const debounce = (delay, fn) => {
    let timerId;
    return (...args) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    };
  };
  const onWindowWidthResize = (cb) => {
    if (!cb && !isFunction(cb)) return;
    let prevWidth = 0;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (prevWidth !== currentWidth) {
        prevWidth = currentWidth;
        cb();
      }
    };
    window.addEventListener("resize", debounce(50, handleResize));
    handleResize();
  };
  const buildMarquee = (marqueeNode) => {
    if (!marqueeNode) return;
    const $marquee = marqueeNode;
    const $childElements = $marquee.children;
    if (!$childElements.length) return;
    Array.from($childElements).forEach(($childItem) => $childItem.setAttribute(ATTR_NAMES.item, ""));
    const htmlStructure = `<div ${ATTR_NAMES.inner}>${$marquee.innerHTML}</div>`;
    $marquee.innerHTML = htmlStructure;
  };
  const getElSize = ($el, isVertical) => {
    if (isVertical) return $el.offsetHeight;
    return $el.offsetWidth;
  };
  $marqueeArray.forEach(($wrapper) => {
    if (!$wrapper) return;
    buildMarquee($wrapper);
    const $marqueeInner = $wrapper.firstElementChild;
    let cacheArray = [];
    if (!$marqueeInner) return;
    const dataMarqueeSpace = parseFloat($wrapper.getAttribute("data-fls-marquee-space"));
    const $items = $wrapper.querySelectorAll(`[${ATTR_NAMES.item}]`);
    const speed = parseFloat($wrapper.getAttribute("data-fls-marquee-speed")) / 10 || 100;
    const isMousePaused = $wrapper.hasAttribute("data-fls-marquee-pause");
    const direction = $wrapper.getAttribute("data-fls-marquee-direction");
    const isVertical = direction === "bottom" || direction === "top";
    const animName = `marqueeAnimation-${Math.floor(Math.random() * 1e7)}`;
    let spaceBetweenItem = parseFloat(window.getComputedStyle($items[0])?.getPropertyValue("margin-right"));
    let spaceBetween = spaceBetweenItem ? spaceBetweenItem : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
    let startPosition = parseFloat($wrapper.getAttribute("data-fls-marquee-start")) || 0;
    let sumSize = 0;
    let firstScreenVisibleSize = 0;
    let initialSizeElements = 0;
    let initialElementsLength = $marqueeInner.children.length;
    let index = 0;
    let counterDuplicateElements = 0;
    const initEvents = () => {
      if (startPosition) $marqueeInner.addEventListener("animationiteration", onChangeStartPosition);
      if (!isMousePaused) return;
      $marqueeInner.removeEventListener("mouseenter", onChangePaused);
      $marqueeInner.removeEventListener("mouseleave", onChangePaused);
      $marqueeInner.addEventListener("mouseenter", onChangePaused);
      $marqueeInner.addEventListener("mouseleave", onChangePaused);
    };
    const onChangeStartPosition = () => {
      startPosition = 0;
      $marqueeInner.removeEventListener("animationiteration", onChangeStartPosition);
      onResize();
    };
    const setBaseStyles = (firstScreenVisibleSize2) => {
      let baseStyle = "display: flex; flex-wrap: nowrap;";
      if (isVertical) {
        baseStyle += `
				flex-direction: column;
				position: relative;
				will-change: transform;`;
        if (direction === "bottom") {
          baseStyle += `top: -${firstScreenVisibleSize2}px;`;
        }
      } else {
        baseStyle += `
				position: relative;
				will-change: transform;`;
        if (direction === "right") {
          baseStyle += `inset-inline-start: -${firstScreenVisibleSize2}px;;`;
        }
      }
      $marqueeInner.style.cssText = baseStyle;
    };
    const setdirectionAnim = (totalWidth) => {
      switch (direction) {
        case "right":
        case "bottom":
          return totalWidth;
        default:
          return -totalWidth;
      }
    };
    const animation = () => {
      const keyFrameCss = `@keyframes ${animName} {
					 0% {
						 transform: translate${isVertical ? "Y" : "X"}(${!isVertical && window.stateRtl ? -startPosition : startPosition}%);
					 }
					 100% {
						 transform: translate${isVertical ? "Y" : "X"}(${setdirectionAnim(
        !isVertical && window.stateRtl ? -firstScreenVisibleSize : firstScreenVisibleSize
      )}px);
					 }
				 }`;
      const $style = document.createElement("style");
      $style.classList.add(animName);
      $style.innerHTML = keyFrameCss;
      head.append($style);
      $marqueeInner.style.animation = `${animName} ${(firstScreenVisibleSize + startPosition * firstScreenVisibleSize / 100) / speed}s infinite linear`;
    };
    const addDublicateElements = () => {
      sumSize = firstScreenVisibleSize = initialSizeElements = counterDuplicateElements = index = 0;
      const $parentNodeWidth = getElSize($wrapper, isVertical);
      let $childrenEl = Array.from($marqueeInner.children);
      if (!$childrenEl.length) return;
      if (!cacheArray.length) {
        cacheArray = $childrenEl.map(($item) => $item);
      } else {
        $childrenEl = [...cacheArray];
      }
      $marqueeInner.style.display = "flex";
      if (isVertical) $marqueeInner.style.flexDirection = "column";
      $marqueeInner.innerHTML = "";
      $childrenEl.forEach(($item) => {
        $marqueeInner.append($item);
      });
      $childrenEl.forEach(($item) => {
        if (isVertical) {
          $item.style.marginBottom = `${spaceBetween}px`;
        } else {
          $item.style.marginRight = `${spaceBetween}px`;
          $item.style.flexShrink = 0;
        }
        const sizeEl = getElSize($item, isVertical);
        sumSize += sizeEl + spaceBetween;
        firstScreenVisibleSize += sizeEl + spaceBetween;
        initialSizeElements += sizeEl + spaceBetween;
        counterDuplicateElements += 1;
        return sizeEl;
      });
      const $multiplyWidth = $parentNodeWidth * 2 + initialSizeElements;
      for (; sumSize < $multiplyWidth; index += 1) {
        if (!$childrenEl[index]) index = 0;
        const $cloneNone = $childrenEl[index].cloneNode(true);
        const $lastElement = $marqueeInner.children[index];
        $marqueeInner.append($cloneNone);
        sumSize += getElSize($lastElement, isVertical) + spaceBetween;
        if (firstScreenVisibleSize < $parentNodeWidth || counterDuplicateElements % initialElementsLength !== 0) {
          counterDuplicateElements += 1;
          firstScreenVisibleSize += getElSize($lastElement, isVertical) + spaceBetween;
        }
      }
      setBaseStyles(firstScreenVisibleSize);
    };
    const correctSpaceBetween = () => {
      if (spaceBetweenItem) {
        $items.forEach(($item) => $item.style.removeProperty("margin-right"));
        spaceBetweenItem = parseFloat(window.getComputedStyle($items[0]).getPropertyValue("margin-right"));
        spaceBetween = spaceBetweenItem ? spaceBetweenItem : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
      }
    };
    const init = () => {
      correctSpaceBetween();
      addDublicateElements();
      animation();
      initEvents();
    };
    const onResize = () => {
      head.querySelector(`.${animName}`)?.remove();
      init();
    };
    const onChangePaused = (e) => {
      const { type, target } = e;
      target.style.animationPlayState = type === "mouseenter" ? "paused" : "running";
    };
    onWindowWidthResize(onResize);
  });
};
marquee();
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
function customCursor$1() {
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
document.querySelector("[data-fls-cursor]") || document.querySelector("[data-fls-cursor-shadow]") ? window.addEventListener("load", customCursor$1) : null;
document.addEventListener("DOMContentLoaded", customCursor);
function customCursor() {
  const hasFlsTouch = document.documentElement.hasAttribute("data-fls-touch");
  if (!hasFlsTouch) {
    let updateMousePosition = function(border) {
      const state = mouseState.get(border);
      if (!state) return;
      const { targetX, targetY, smoothFactor } = state;
      state.currentX += (targetX - state.currentX) * smoothFactor;
      state.currentY += (targetY - state.currentY) * smoothFactor;
      const cards = border.querySelectorAll(".card-borders-item");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${state.currentX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${state.currentY - rect.top}px`);
      });
      const distance = Math.hypot(
        targetX - state.currentX,
        targetY - state.currentY
      );
      if (distance > 0.5) {
        state.rafId = requestAnimationFrame(() => updateMousePosition(border));
      }
    }, handleMouseMove = function(border, event) {
      let state = mouseState.get(border);
      if (!state) {
        state = {
          currentX: event.clientX,
          currentY: event.clientY,
          targetX: event.clientX,
          targetY: event.clientY,
          smoothFactor: 0.2,
          // Плавність курсору (0.05-0.2)
          rafId: null
        };
        mouseState.set(border, state);
      }
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
      }
      state.rafId = requestAnimationFrame(() => updateMousePosition(border));
    };
    const magicalBorders = document.querySelectorAll("[data-fls-cardbg]");
    const mouseState = /* @__PURE__ */ new WeakMap();
    magicalBorders.forEach((border) => {
      border.addEventListener("mousemove", (event) => {
        handleMouseMove(border, event);
      });
    });
  }
}
