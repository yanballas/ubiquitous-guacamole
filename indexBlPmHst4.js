true &&
  (function polyfill() {
    const relList = document.createElement("link").relList;
    if (relList && relList.supports && relList.supports("modulepreload")) {
      return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
      processPreload(link);
    }
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "childList") {
          continue;
        }
        for (const node of mutation.addedNodes) {
          if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
        }
      }
    }).observe(document, { childList: true, subtree: true });
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

document.addEventListener("DOMContentLoaded", () => {
  const errorMessage = new Error("Ошибка в скриптах");
  const data = {
    tel: "",
    email: "",
    password: "",
    currency: "",
    isAdult: false,
  };
  const checkInputs = (form) => {
    const inputs = Array.from(form.querySelectorAll("input"));
    const submitBtn = form.querySelector(".btn__submit");
    const enabledInputs = inputs.filter((input) => !input.disabled);
    const checkMark = form.querySelector(".form__agree input");
    const isAllFilled = enabledInputs.every((input) => input.value.trim() !== "");
    const isCheckboxChecked = checkMark ? checkMark.checked : true;
    if (isAllFilled && isCheckboxChecked) {
      submitBtn?.removeAttribute("disabled");
    } else {
      submitBtn?.setAttribute("disabled", "");
    }
  };
  const tabChange = () => {
    const tabsButtonsLogin = document.querySelectorAll(".contact__tab-btn");
    const tabsFormLogin = document.querySelectorAll(".form__login");
    const tabsButtonsForm = document.querySelectorAll(".form__toggler button");
    const tabsForm = document.querySelectorAll(".form");
    const toggleTab = (btns, tabs) => {
      const handleClick = (e) => {
        const currentBtn = e.currentTarget;
        const currentAttr = currentBtn.dataset.tab;
        btns.forEach((btn) => {
          btn.classList.remove("--active");
        });
        currentBtn.classList.add("--active");
        tabs.forEach((tab) => {
          const tabAttr = tab.dataset.tab;
          if (currentAttr === tabAttr) {
            if (tab.classList.contains("--active")) return;
            tab.classList.add("--active");
          } else {
            tab.classList.remove("--active");
          }
        });
      };
      btns.forEach((btn) => {
        btn.addEventListener("click", handleClick);
      });
    };
    const disabledLogin = () => {
      const handleDisabled = (e) => {
        const currentBtn = e.currentTarget;
        const currentAttr = currentBtn.dataset.tab;
        tabsFormLogin.forEach((tab) => {
          const form = tab.closest(".form");
          const inputs = tab.querySelectorAll(".form__input");
          const shouldEnable = currentAttr === tab.dataset.tab;
          inputs.forEach((input) => {
            if (shouldEnable) {
              input.removeAttribute("disabled");
            } else {
              input.setAttribute("disabled", "");
            }
          });
          inputs.forEach((input) => (input.value = ""));
          checkInputs(form);
        });
      };
      tabsButtonsLogin.forEach((btn) => {
        btn.addEventListener("click", handleDisabled);
      });
    };
    toggleTab(tabsButtonsLogin, tabsFormLogin);
    disabledLogin();
    toggleTab(tabsButtonsForm, tabsForm);
  };
  const togglePassword = () => {
    const btns = document.querySelectorAll(".form__password-btn");
    const handleClick = (e) => {
      const currentFormPassword = e.currentTarget.closest(".form__password");
      if (!currentFormPassword) return;
      const input = currentFormPassword.querySelector(".form__input");
      if (input.type === "password") return (input.type = "text");
      input.type = "password";
    };
    btns.forEach((btn) => btn.addEventListener("click", handleClick));
  };
  const customSelect = () => {
    const selectForms = document.querySelectorAll(".form__select");
    selectForms.forEach((select) => {
      const chooseSection = select.querySelector(".form__select-choose");
      const list = select.querySelector(".form__select-list");
      if (!chooseSection && !list) return;
      const options = list.querySelectorAll(".form__select-list__item");
      const dumpInput = select.querySelector(".form__input-dumb");
      const changeChoice = () => {
        const textSection = chooseSection?.querySelector("span");
        const imgSection = chooseSection?.querySelector(".form__select-icon img");
        if (!textSection && !imgSection) return;
        textSection.innerText = chooseSection.dataset.text;
        imgSection.setAttribute("src", chooseSection.dataset.icon);
        dumpInput.value = chooseSection.dataset.text;
      };
      const handleChange = (e) => {
        e.stopPropagation();
        const currentOption = e.currentTarget;
        chooseSection.dataset.text = currentOption.dataset.text;
        chooseSection.dataset.icon = currentOption.dataset.icon;
        changeChoice();
        chooseSection?.classList.remove("--active");
        list?.classList.remove("--active");
      };
      changeChoice();
      select?.addEventListener("click", (e) => {
        chooseSection?.classList.toggle("--active");
        list?.classList.toggle("--active");
      });
      options.forEach((option) => option.addEventListener("click", handleChange));
    });
  };
  const checkedMark = () => {
    const input = document.querySelector(".form__agree input");
    const customInput = document.querySelector(".form__agree-checkmark");
    customInput?.addEventListener("click", () => {
      if (input.checked) input.checked = false;
      else input.checked = true;
      const form = customInput.closest(".form");
      checkInputs(form);
    });
  };
  const toggleAction = () => {
    const forms = document.querySelectorAll(".form");
    forms.forEach((form) => {
      checkInputs(form);
      const inputs = form.querySelectorAll("input");
      inputs.forEach((input) => {
        input.addEventListener("input", () => checkInputs(form));
      });
    });
  };
  const submitForm = () => {
    const forms = document.querySelectorAll(".form");
    function handleSubmit(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const inputs = Array.from(form.querySelectorAll("input"));
      const enabledInputs = inputs.filter((input) => !input.disabled);
      const validatePhone = (value) => /^\+[71]\d{10}$/.test(value);
      const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const validatePassword = (value) => value.length >= 6;
      enabledInputs.forEach((input) => {
        input.classList.remove("--danger");
        const currentValue = input.value.trim();
        let isValid2 = false;
        switch (input.type) {
          case "tel": {
            const formPhone = input.closest(".form__phone");
            const dumpInput = formPhone.querySelector(".form__input-dumb");
            const fullPhoneValue = `+${dumpInput.value.trim()}${currentValue}`;
            isValid2 = validatePhone(fullPhoneValue);
            if (isValid2) data.tel = fullPhoneValue;
            break;
          }
          case "email":
            isValid2 = validateEmail(currentValue);
            if (isValid2) data.email = currentValue;
            break;
          case "password":
            isValid2 = validatePassword(currentValue);
            if (isValid2) data.password = currentValue;
            break;
          case "checkbox":
            data.isAdult = input.checked;
            break;
          default:
            if (input.name === "currency") {
              data.currency = currentValue;
            }
            break;
        }
        if (!isValid2 && input.type !== "checkbox" && input.name !== "currency") {
          input.classList.add("--danger");
        }
      });
      const isValid =
        Object.values(data).every((value) => value !== false && value !== null) &&
        (data.tel !== "" || data.email !== "");
      if (isValid) {
        const jsonData = JSON.stringify(data);
        console.log(jsonData);
        enabledInputs.forEach((input) => {
          if (!input.classList.contains("form__input-dumb") && input.type !== "checkbox") input.value = "";
          if (input.type === "checkbox") input.checked = false;
          checkInputs(form);
        });
        for (let key in data) {
          if (typeof data[key] === "string") {
            data[key] = "";
          } else if (typeof data[key] === "boolean") {
            data[key] = false;
          } else if (typeof data[key] === "number") {
            data[key] = 0;
          } else {
            data[key] = null;
          }
        }
      } else {
        console.log("Объект содержит недопустимые значения");
      }
    }
    forms.forEach((form) => form.addEventListener("submit", handleSubmit));
  };
  try {
    tabChange();
    togglePassword();
    customSelect();
    checkedMark();
    toggleAction();
    submitForm();
  } catch {
    console.error(errorMessage);
  }
});
