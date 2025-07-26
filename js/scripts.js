// (!) isEmptyObject - проверка объекта на пустоту. Не очень большое доверие - взято с просторов интернета
function isEmptyObject(obj) {
	for(let prop in obj) {
		if(obj.hasOwnProperty(prop)) return false; // 'The hasOwnProperty() метод возвращает true, если объект содержит указанное свойство, которое является прямым свойством этого объекта, а не унаследованным
	}
	return true; // - объект пустой
}
// (!) writeTopic - создать iframe с темой топика
function writeTopic() {
	if (window.location.search !== "") {
		vrsTopic.currP = vrsNavigation.def = window.location.search.substring(1).replace(/:/g, "");
	}
	// *при первичной загрузке создаем iframe топика по умолчанию
	// if (document.getElementById('ifrmtopic') === null) {
	// 	document.currentScript.insertAdjacentHTML("afterend", '<iframe id="ifrmtopic" name="ifrmtopic" class="scroll-pane" src="' + vrsTopic.currP + '" title="Вкладка Тема"></iframe>');
	// }
	// (i) др.вариант
	let iframe = document.getElementById('ifrmtopic');
	if (iframe !== null && typeof(iframe) !== "undefined" && typeof(iframe) === "object" || iframe === Object(iframe)) return;
	iframe = document.createElement('iframe');
	iframe.id = "ifrmtopic";
	iframe.name = "ifrmtopic";
	iframe.classList.add('scroll-pane');
	iframe.setAttribute('src', vrsTopic.currP);
	iframe.title = "Вкладка Тема";
	document.getElementById('idTopicBox').appendChild(iframe);
}
// (!) loaderPreLoader - загрузчик/предзагрузчик
function loaderPreLoader() {
	let idInt = setInterval(() => {
		if (document.readyState === 'complete' || document.body.readyState === 'complete') {
			clearInterval(idInt);
			// *.loader/.preloader
			let lpl = document.querySelector('.preloader');
			if (lpl === null) {
				lpl = document.querySelector('.loader');
				if (lpl === null) {
					console.warn(`(!) Косяк: не удалось создать предварительный загрузчик - переменная не определена или значение переменной не соответствует условию(-ям) проверки:\n function loaderPreLoader():\n window.«${window.name}»\n location.origin: ${location.origin}`);
					alert(`(!) Косяк: не удалось создать предварительный загрузчик - переменная не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
					return;
				}
			}
			lpl.classList.add('loaded-hiding');
			// (i) чтобы position: fixed не блокировало стр.
			setTimeout(() => {
				lpl.style.display = "none";
			}, 500);
		}
	}, 500);
}
// (!) создать загрузчик/предзагрузчик
function writeLoaderPreLoader() {
	if (window === top && window.name === "") {
		document.currentScript.insertAdjacentHTML('afterend', '<div class="preloader"><div class="preloader-img"></div></div>');
	} else {
		document.currentScript.insertAdjacentHTML('afterend', '<div class="loader"><div class="loader-img"></div></div>');
	}
	loaderPreLoader(); // - загрузчик/предзагрузчик
}
// (!) получить скрипт - ссылка на js-файл
function getScript(wnd = window, srcScript = "") {
	let retVal = false;
	if (typeof(srcScript) !== "string" || (srcScript === "" && typeof(srcScript) === "string")) {
		console.error(`(!) Косяк - не удалось получить скрипт - ссылка на js-файл - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function getScript(wnd."${wnd.name}", srcScript: typeof(${typeof(srcScript)}), ${srcScript}): window."${window.name}", location.origin: ${location.origin}\n`);
		alert(`(!) Косяк - не удалось получить скрипт - ссылка на js-файл - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return retVal;
	}
	let listNode = wnd.document.querySelectorAll('script');
	if (listNode.length > 0) {
		for (let i = 0; i < listNode.length; i++) {
			if (listNode[i].getAttribute('src') === srcScript) {
				retVal = true; // - скрипт уже имеется
				break;
			}
		}
	} return retVal;
}
// (!) создать скрипт - ссылка на js-файл
function setScript(wnd = window, srcScript = "") {
	// if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
	// (!) не люблю такую проверку и нет уверенности, что она правильная
	// console.log(`function setScript(${wnd}, wnd."${wnd.name}")\n !wnd === top || !wnd.name === "" || !wnd === window.top.getFrame() || !wnd.name === window.top.getFrame().name: ${!wnd === top || !wnd.name === "" || !wnd === window.top.getFrame() || !wnd.name === window.top.getFrame().name}\n 1) !wnd === top: ${!wnd === top}\n 2) !wnd.name === "": ${!wnd.name === ""}\n 3) !wnd === window.top.getFrame(): ${!wnd === window.top.getFrame()}\n 4) !wnd.name === window.top.getFrame().name: ${!wnd.name === window.top.getFrame().name}`); // x -
	// (?)(!) сделать test с проверкой на окно // (?) скорее всего проверка на то, какое окно не нужна
	// let frm = window.top.getFrame();
	// if (frm === null && frm !== Object(frm)) {
	// 	frm = window.top.document.getElementById('ifrmtopic'); // фрейм гл.топика по умолчанию
	// }
	// if (!wnd === top || !wnd.name === "" || !wnd === frm || !wnd.name === frm.name) {
	// 	console.error(`(!) Косяк: не удалось создать/удалить ссылку на файл lightbox.js - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setScript("${wnd}"): window."${window.name}", location.origin: ${location.origin}`);
	// 	alert(`(!) Косяк: не удалось создать/удалить ссылку на файл lightbox.js - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
	// 	return false;
	// }
	let retVal = false;
	// *без учета, если html-док.открыт отд.стр.
	if (typeof(srcScript) !== "string" || (srcScript === "" && typeof(srcScript) === "string")) {
		console.error(`(!) Косяк - не удалось создать скрипт - ссылка на js-файл - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setScript(wnd."${wnd.name}", srcScript: typeof(${typeof(srcScript)}), ${srcScript}): window."${window.name}", location.origin: ${location.origin}\n`);
		alert(`(!) Косяк - не удалось создать скрипт - ссылка на js-файл - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return retVal;
	}
	let js = wnd.document.querySelectorAll('script');
	if (js.length > 0) { // ??? js instanceof(NodeList) возвращает false
		let AfterOrBefore = "";
		let elem = null; // эл., после кот.создаем скрипт
		for (let i = 0; i < js.length; i++) {
			if (js[i].getAttribute('src') === srcScript) { // 'скрипт уже имеется
				return true;
			} else { // 'скрипт отсутствует, получаем элемент после кот.требуется создать новый
				if (srcScript === "js/msgbox.js") {
					AfterOrBefore = "after";
					if (js[i].getAttribute('src') === "js/topic.js") {
						elem = js[i];
					}
				} else if (srcScript === "js/variables.js") {
					AfterOrBefore = "before";
					if (js[i].getAttribute('src') === "js/settings.js") {
						elem = js[i];
					}
				} else if (srcScript === "js/lightbox.js") {
					AfterOrBefore = "after";
					if ((js[i].getAttribute('src') === "js/msgbox.js") || (js[i].getAttribute('src') === "js/topic.js") || (js[i].getAttribute('src') === "js/index.js")) {
						elem = js[i];
					}
				}
			}
		}
		// *создаем и проверяем объект - ссылка на js-файл
		let jsNew = wnd.document.createElement('script');
		jsNew.src = srcScript;
		if (elem !== null && elem === Object(elem)) {
			if (AfterOrBefore === "after") {
				elem.after(jsNew);
			} else if (AfterOrBefore === "before") {
				elem.before(jsNew);
			} else { // 'по умолчанию
				elem.after(jsNew);
			}
		} else { // ссылка на скрипт будет создана в body по умолчанию
			wnd.document.body.append(jsNew);
		}
		js = wnd.document.querySelectorAll('script[src="' + srcScript + '"]'); // переопределяем переменную
		if (js.length === 1) {
			retVal = true;
		} else { // - протестить после правки
			// (?)(!) не понятно почему, без этой комбинации генерируется ошибка, несмотря на то, что скрипт создается и эл.предварительно сразу же обнаруживается
			let idInt = setInterval(() => { // для подстраховки небольшая выдержка
				if (js.length === 1) {
					retVal = true;
					clearInterval(idInt);
				} else {
					js = wnd.document.querySelectorAll('script[src="' + srcScript + '"]'); // переопределяем переменную
				}
			}, 100);
		}
	}
	return retVal;
}
// (!) получить полноразмерное значение св-ва
function getValueFullSizeProperty(elem) {
	if (elem === null || typeof(elem) === "undefined" && typeof(elem) !== "object" || elem !== Object(elem)) {
		console.error(`(!) Косяк - не удалось получить значения св-ва элемента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function getValueFullSizeProperty(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк - не удалось получить значения св-ва элемента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return 0;
	}
	let property = {
		width: parseInt(getComputedStyle(elem, null).width, 10),
		height: parseInt(getComputedStyle(elem, null).height, 10),
		padding: {
			left: parseInt(getComputedStyle(elem, null).paddingLeft, 10),
			right: parseInt(getComputedStyle(elem, null).paddingRight, 10),
			top: parseInt(getComputedStyle(elem, null).paddingTop, 10),
			bottom: parseInt (getComputedStyle(elem, null).paddingBottom, 10)
		},
		border: {
			left: parseInt(getComputedStyle(elem, null).borderLeft, 10),
			right: parseInt(getComputedStyle(elem, null).borderRight, 10),
			top: parseInt(getComputedStyle(elem, null).borderTop, 10),
			bottom: parseInt(getComputedStyle(elem, null).borderBottom, 10)
		},
		margin: {
			left: parseInt(getComputedStyle(elem, null).marginLeft, 10),
			right: parseInt(getComputedStyle(elem, null).marginRight, 10),
			top: parseInt(getComputedStyle(elem, null).marginTop, 10),
			bottom: parseInt(getComputedStyle(elem, null).marginBottom, 10)
		},
	};
	let size = {
		width: property.width + property.padding.left + property.padding.right + property.border.left + property.border.right + property.margin.left + property.margin.right,
		height: property.height + property.padding.top + property.padding.bottom + property.border.top + property.border.bottom + property.margin.top + property.margin.bottom
	}
	return size;
}
// (!) фокусировка
function setFocus(elem, focusInOut = "", focusOptions = {scrolling: false, visible: true}) {
	// ~focus и blur не всплывают, но имеют фазу погружения и перехват на внутренний эл.может быть только через родителя
	// не всегда работает - браузер сам решает на свое усмотрение
	// (?)'как снять визуальное выделение браузером наверняка
	// focus({
		// preventScroll: false (по умолчанию) / true, прокрутка не произойдет
		// focusVisible: true (по умолчанию) / false для предотвращения отображения видимого признака того, что эл.находится в фокусе
	// }):
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error("(!) Косяк: не удалось установить фокус на элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setFocus(elem: ", elem, "\n focusInOut: ", focusInOut, "\n focusOptions: ", focusOptions, "): window.«", window.name, "», location.origin: ", location.origin);
		alert(`(!) Косяк: не удалось установить фокус на элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	// x // if (typeof(focusInOut) === "undefined" || focusInOut === "" && (focusInOut === String(focusInOut) || typeof(elem) === "string")) {
	if (focusInOut !== "focusIn" && focusInOut !== "focusOut") {
		console.error("(!) Косяк: не удалось установить фокус на элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setFocus(elem: ", elem, "\n focusInOut: ", focusInOut, "\n focusOptions: ", focusOptions, "): window.«", window.name, "», location.origin: ", location.origin);
		alert(`(!) Косяк: не удалось установить фокус на элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	if (focusInOut === "focusIn") {
		// console.log("focusInOut: ", focusInOut, "\n elem:\n", elem, "\n document.activeElement:\n", document.activeElement, "\n document.activeElement.getAttribute('tabIndex') === null: ", document.activeElement.getAttribute('tabIndex') === null, "\n 1) document.activeElement.getAttribute('tabIndex') === 0: ", document.activeElement.getAttribute('tabIndex') === 0, "\n 2) +document.activeElement.getAttribute('tabIndex') === -1: ", +document.activeElement.getAttribute('tabIndex') === -1, "\n 3) document.activeElement.getAttribute('tabIndex') === '0': ", document.activeElement.getAttribute('tabIndex') === "0");
		// console.log("activeElement.hasAttribute: ", document.activeElement.hasAttribute('tabIndex'));
		// console.log("activeElement.getAttribute: ", document.activeElement.getAttribute('tabIndex'));

		elem.tabIndex = "0"; // (1) // для возможности перевести фокус
		elem.focus({ preventScroll: focusOptions.scrolling, focusVisible: focusOptions.visible }); // (2)
		// if (elem !== document.activeElement) { // (3) - если activeElement тоже был сфокусирован в виде исключения
		// 	if (document.activeElement.hasAttribute('tabIndex')) { // наличие аттрибута в теге html
		// 		document.activeElement.removeAttribute('tabIndex');
		// 	}
		// }
	} else if (focusInOut === "focusOut") {
		if (elem.hasAttribute('tabIndex')) { // наличие аттрибута в теге html
			elem.removeAttribute('tabIndex');
		} else {
			elem.blur();
		}
	}
}
// (!) setUpdateVariables - обновление глобальных переменных variables.js в гл.окне
function setUpdateVariables(in_vrsTopic = {}, in_vrsNavigation = {}, in_vrsPermalink = {}) {
	if (isEmptyObject(in_vrsTopic) === false || Object.keys(in_vrsTopic).length !== 0 || JSON.stringify(in_vrsTopic) !== "{}") { // - если переменная аргумента внутри объекта содержит ключ(-и) со значением
		for (const key in window.top.vrsTopic) {
			for (const k in in_vrsTopic) {
				if (key === k) {
					if (window.top.vrsTopic[key] !== in_vrsTopic[k]) {
						window.top.vrsTopic[key] = in_vrsTopic[k];
					}
				}
			}
		}
	}
	if (isEmptyObject(in_vrsNavigation) === false || Object.keys(in_vrsNavigation).length !== 0 || JSON.stringify(in_vrsNavigation) !== "{}") { // - если переменная аргумента внутри объекта содержит ключ(-и) со значением
		for (const key in window.top.vrsNavigation) {
			for (const k in in_vrsNavigation) {
				if (key === k) {
					if (window.top.vrsNavigation[key] !== in_vrsNavigation[k]) {
						window.top.vrsNavigation[key] = in_vrsNavigation[k];
					}
				}
			}
		}
	}
	if (isEmptyObject(in_vrsPermalink) === false || Object.keys(in_vrsPermalink).length !== 0 || JSON.stringify(in_vrsPermalink) !== "{}") { // - если переменная аргумента внутри объекта содержит ключ(-и) со значением
		for (const key in window.top.vrsPermalink) {
			for (const k in in_vrsPermalink) {
				if (key === k) {
					if (window.top.vrsPermalink[key] !== in_vrsPermalink[k]) {
						window.top.vrsPermalink[key] = in_vrsPermalink[k];
					}
				}
			}
		}
	}
	// x первичный вариант
	// if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании
	// (i) в Firefox origin = "null"
	// 	console.error(`function setUpdateVariables(window.name: ${window.name}):\n window.location.origin: ${window.location.origin}`);
	// 	alert(`(!) Косяк: function setUpdateVariables(window.name: ${window.name}):\n window.location.origin: ${window.location.origin}, см.консоль.`);
	// } else {
		// let win = [];
		// if (window !== top) { win.push(window.top); }
		// // (i) window.top.frames возвращает коллекцию окон фреймов, а не сами фреймы как таковые
		// for (let i = 0; i < window.top.frames.length; i++) {
		// 	if (window.top.frames[i].name !== "ifrmkeywords" && window.top.frames[i].name !== "ifrmsearch" && window.top.frames[i].name !== window.name) {
		// 		win.push(window.top.frames[i]);
		// 	}
		// }
		// for (let w = 0; w < win.length; w++) {
		// 	// *topic_Settings.js
		// 	for (const key in win[w].vrsTopic) {
		// 		if (Object.keys(in_vrsTopic).length === 0 && in_vrsTopic.constructor === Object) { // - если переменная аргумента не содержит ключа со значением. В том числе проверка конструктора
		// 			if (key in win[w].vrsTopic === key in window.vrsTopic) {
		// 				if (win[w].vrsTopic[key] !== window.vrsTopic[key]) {
		// 					win[w].vrsTopic[key] = window.vrsTopic[key];
		// 				}
		// 			}
		// 		} else {
		// 			if (key in win[w].vrsTopic === key in in_vrsTopic) {
		// 				if (win[w].vrsTopic[key] !== in_vrsTopic[key]) {
		// 					win[w].vrsTopic[key] = in_vrsTopic[key];
		// 				}
		// 			}
		// 		}
		// 	}
		// 	// *index_settings.js
		// 	for (let key in win[w].vrsPermalink) {
		// 		if (Object.keys(in_vrsPermalink).length === 0 && in_vrsPermalink.constructor === Object) { // - если переменная аргумента не содержит ключа со значением. В том числе проверка конструктора
		// 			if (key in win[w].vrsPermalink === key in window.vrsPermalink) {
		// 				if (win[w].vrsPermalink[key] !== window.vrsPermalink[key]) {
		// 					win[w].vrsPermalink[key] = window.vrsPermalink[key];
		// 				}
		// 			}
		// 		} else {
		// 			if (key in win[w].vrsPermalink === key in in_vrsPermalink) {
		// 				if (win[w].vrsPermalink[key] !== in_vrsPermalink[key]) {
		// 					win[w].vrsPermalink[key] = in_vrsPermalink[key];
		// 				}
		// 			}
		// 		}
		// 	}
		// 	for (let key in win[w].vrsNavigation) {
		// 		if (Object.keys(in_vrsPermalink).length === 0 && in_vrsPermalink.constructor === Object) { // - если переменная аргумента не содержит ключа со значением. В том числе проверка конструктора
		// 			if (key in win[w].vrsNavigation === key in window.vrsNavigation) {
		// 				if (win[w].vrsNavigation[key] !== window.vrsNavigation[key]) {
		// 					win[w].vrsNavigation[key] = window.vrsNavigation[key];
		// 				}
		// 			}
		// 		} else {
		// 			if (key in win[w].vrsNavigation === key in in_vrsNavigation) {
		// 				if (win[w].vrsNavigation[key] !== in_vrsNavigation[key]) {
		// 					win[w].vrsNavigation[key] = in_vrsNavigation[key];
		// 				}
		// 			}
		// 		}
		// 	}
		// }
	// }
}
// (!) setToggleToolbarElement - переключение элемента на пан.инструментов
function setToggleToolbarElement(elem, classNameOn = "", classNameOff = "", valueOnOff = "") {
	if (typeof(classNameOn) === "undefined" || classNameOn === "" && (classNameOn === String(classNameOn) || typeof(classNameOn) === "string")) {
		console.error(`(!) Косяк: не удалось осуществить переключение элемента(-ов) - переменная аргумента не определена:\n function setToggleToolbarElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, classNameOn: "${classNameOn}", classNameOff: "${classNameOff}", valueOnOff: "${valueOnOff}"): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось осуществить переключение элемента(-ов) - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	if (typeof(classNameOff) === "undefined" || classNameOff === "" && (classNameOff === String(classNameOff) || typeof(classNameOff) === "string")) {
		console.error(`(!) Косяк: не удалось осуществить переключение элемента(-ов) - переменная аргумента не определена:\n function setToggleToolbarElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, classNameOn: "${classNameOn}", classNameOff: "${classNameOff}", valueOnOff: "${valueOnOff}"): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось осуществить переключение элемента(-ов) - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	// *если elem - это строка, например id элемента
	if (typeof(elem) !== "undefined" || elem !== "" && (elem === String(elem) || typeof(elem) === "string")) {
		if (valueOnOff === "on") {
			window.top.document.getElementById(elem).classList.remove(classNameOff);
			window.top.document.getElementById(elem).classList.add(classNameOn);
		} else if (valueOnOff == "off") {
			window.top.document.getElementById(elem).classList.remove(classNameOn);
			window.top.document.getElementById(elem).classList.add(classNameOff);
		} else {
			console.error(`(!) Косяк: не удалось осуществить переключение элемента(-ов) - переменная аргумента не определена:\n function setToggleToolbarElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, classNameOn: "${classNameOn}", classNameOff: "${classNameOff}", valueOnOff: "${valueOnOff}"): window."${window.name}", location.origin: ${location.origin}`);
			alert(`(!) Косяк: не удалось осуществить переключение элемента(-ов) - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
			return;
		}
	} else if (typeof(elem) !== "undefined" || elem !== null && (elem === Object(elem) || typeof(elem) === "object")) {
		if (valueOnOff === "on") {
			elem.classList.remove(classNameOff);
			elem.classList.add(classNameOn);
		} else if (valueOnOff == "off") {
			elem.classList.remove(classNameOn);
			elem.classList.add(classNameOff);
		} else {
			console.error(`(!) Косяк: не удалось осуществить переключение элемента(-ов) - переменная аргумента не определена:\n function setToggleToolbarElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, classNameOn: "${classNameOn}", classNameOff: "${classNameOff}", valueOnOff: "${valueOnOff}"): window."${window.name}", location.origin: ${location.origin}`);
			alert(`(!) Косяк: не удалось осуществить переключение элемента(-ов) - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
			return;
		}
	} else {
		console.error(`(!) Косяк: не удалось осуществить переключение элемента(-ов) - переменная аргумента не определена:\n function setToggleToolbarElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, classNameOn: "${classNameOn}", classNameOff: "${classNameOff}", valueOnOff: "${valueOnOff}"): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось осуществить переключение элемента(-ов) - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
}
// (!) включить/отключить кнопку пан.инструментов
function setToolbarButtonsOnOff(elemId = "") {
	if (typeof(elemId) === "undefined" || elemId === "" && (elemId === String(elemId) || typeof(elemId) === "string")) {
		console.error(`(!) Косяк: не удалось осуществить переключение элемента(-ов) - переменная аргумента не определена:\n function setToolbarButtonsOnOff(elemId: typeof(${typeof(elemId)}), Object(${Object(elemId)}), ${elemId}): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось осуществить переключение элемента(-ов) - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	switch (elemId) {
		case 'idExpandOn':
			// *кнопка-переключатель скрытого контента - доступна
			setToggleToolbarElement("idExpandOn", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idExpandOff", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idExpandText", "btn_text-on", "btn_text-off", "on");
			break;
		case 'idExpandOff':
			// *кнопка-переключатель скрытого контента - нет доступа
			setToggleToolbarElement("idExpandOn", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idExpandOff", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idExpandText", "btn_text-on", "btn_text-off", "off");
			break;
		case 'idPagePreviousOn':
			// *кнопка назад - доступна
			setToggleToolbarElement("idPagePreviousOn", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idPagePreviousOff", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idPagePreviousText", "btn_text-on", "btn_text-off", "on");
			break;
		case 'idPagePreviousOff':
			// *кнопка назад - нет доступа
			setToggleToolbarElement("idPagePreviousOn", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idPagePreviousOff", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idPagePreviousText", "btn_text-on", "btn_text-off", "off");
			break;
		case 'idPageNextOn':
			// *кнопка вперед - доступна
			setToggleToolbarElement("idPageNextOn", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idPageNextOff", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idPageNextText", "btn_text-on", "btn_text-off", "on");
			break;
		case 'idPageNextOff':
			// *кнопка вперед - нет доступа
			setToggleToolbarElement("idPageNextOn", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idPageNextOff", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idPageNextText", "btn_text-on", "btn_text-off", "off");
			break;
		case 'idTopicTab':
			// *кнопка открепить - нет доступа
			setToggleToolbarElement("idUndockTabOn", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idUndockTabOff", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idUndockTabText", "btn_text-on", "btn_text-off", "off");
			// *кнопка дублировать - доступна
			setToggleToolbarElement("idNewTabOn", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idNewTabOff", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idNewTabText", "btn_text-on", "btn_text-off", "on");
			// x *кнопка-переключатель скрытого контента - доступна, если в тексте текущей темы присутствует скрытый контент
			// if (window.top.vrsTopic.btnExpand === "idExpandOn") {
			// 	setToggleToolbarElement("idExpandOn", "btn-icon", "btn_icon-off", "on");
			// 	setToggleToolbarElement("idExpandOff", "btn-icon", "btn_icon-off", "off");
			// 	setToggleToolbarElement("idExpandText", "btn_text-on", "btn_text-off", "on");
			// } else if (window.top.vrsTopic.btnExpand === "idExpandOff") {
			// 	setToggleToolbarElement("idExpandOn", "btn-icon", "btn_icon-off", "off");
			// 	setToggleToolbarElement("idExpandOff", "btn-icon", "btn_icon-off", "on");
			// 	setToggleToolbarElement("idExpandText", "btn_text-on", "btn_text-off", "off");
			// }
			// *кнопка постоянная ссылка - доступна
			setToggleToolbarElement("idPermalinkOn", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idPermalinkOff", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idPermalinkText", "btn_text-on", "btn_text-off", "on");
			// *кнопка email - доступна
			// setToggleToolbarElement("idFeedBackOn", "btn-icon", "btn_icon-off", "on");
			// setToggleToolbarElement("idFeedBackOff", "btn-icon", "btn_icon-off", "off");
			// setToggleToolbarElement("idFeedBackText", "btn_text-on", "btn_text-off", "on");
			// *кнопка печать - доступна
			// setToggleToolbarElement("idPrinterOn", "btn-icon", "btn_icon-off", "on");
			// setToggleToolbarElement("idPrinterOff", "btn-icon", "btn_icon-off", "off");
			// setToggleToolbarElement("idPrinterText", "btn_text-on", "btn_text-off", "on");
			// *кнопка назад
			if (window.top.vrsTopic.prevP === "") { // - нет доступа
				setToggleToolbarElement("idPagePreviousOn", "btn-icon", "btn_icon-off", "off");
				setToggleToolbarElement("idPagePreviousOff", "btn-icon", "btn_icon-off", "on");
				setToggleToolbarElement("idPagePreviousText", "btn_text-on", "btn_text-off", "off");
			} else { // - доступна
				setToggleToolbarElement("idPagePreviousOn", "btn-icon", "btn_icon-off", "on");
				setToggleToolbarElement("idPagePreviousOff", "btn-icon", "btn_icon-off", "off");
				setToggleToolbarElement("idPagePreviousText", "btn_text-on", "btn_text-off", "on");
			}
			// *кнопка домой - доступна
			setToggleToolbarElement("idPageHomeOn", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idPageHomeOff", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idPageHomeText", "btn_text-on", "btn_text-off", "on");
			// *кнопка вперед
			if (window.top.vrsTopic.nextP === "") { // - нет доступа
				setToggleToolbarElement("idPageNextOn", "btn-icon", "btn_icon-off", "off");
				setToggleToolbarElement("idPageNextOff", "btn-icon", "btn_icon-off", "on");
				setToggleToolbarElement("idPageNextText", "btn_text-on", "btn_text-off", "off");
			} else { // - доступна
				setToggleToolbarElement("idPageNextOn", "btn-icon", "btn_icon-off", "on");
				setToggleToolbarElement("idPageNextOff", "btn-icon", "btn_icon-off", "off");
				setToggleToolbarElement("idPageNextText", "btn_text-on", "btn_text-off", "on");
			}
			break;
		case 'idIndexTab': case 'idSearchTab':
			// *кнопка открепить - доступна
			setToggleToolbarElement("idUndockTabOn", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idUndockTabOff", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idUndockTabText", "btn_text-on", "btn_text-off", "on");
			// *кнопка дублировать - нет доступа
			setToggleToolbarElement("idNewTabOn", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idNewTabOff", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idNewTabText", "btn_text-on", "btn_text-off", "off");
			// *кнопка-переключатель скрытого контента - нет доступа
			setToggleToolbarElement("idExpandOn", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idExpandOff", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idExpandText", "btn_text-on", "btn_text-off", "off");
			// *кнопка постоянная ссылка - нет доступа
			setToggleToolbarElement("idPermalinkOn", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idPermalinkOff", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idPermalinkText", "btn_text-on", "btn_text-off", "off");
			// *кнопка email - нет доступа
			// setToggleToolbarElement("idFeedBackOn", "btn-icon", "btn_icon-off", "off");
			// setToggleToolbarElement("idFeedBackOff", "btn-icon", "btn_icon-off", "on");
			// setToggleToolbarElement("idFeedBackText", "btn_text-on", "btn_text-off", "off");
			// *кнопка печать - нет доступа
			// setToggleToolbarElement("idPrinterOn", "btn-icon", "btn_icon-off", "off");
			// setToggleToolbarElement("idPrinterOff", "btn-icon", "btn_icon-off", "on");
			// setToggleToolbarElement("idPrinterText", "btn_text-on", "btn_text-off", "off");
			// *кнопка назад - нет доступа
			setToggleToolbarElement("idPagePreviousOn", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idPagePreviousOff", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idPagePreviousText", "btn_text-on", "btn_text-off", "off");
			// *кнопка домой - нет доступа
			setToggleToolbarElement("idPageHomeOn", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idPageHomeOff", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idPageHomeText", "btn_text-on", "btn_text-off", "off");
			// *кнопка вперед - нет доступа
			setToggleToolbarElement("idPageNextOn", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idPageNextOff", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idPageNextText", "btn_text-on", "btn_text-off", "off");
			break;
		// 'для остальных вкладок, кот.будут созданы как новые вкладки
		default:
			// *кнопка открепить - доступна
			setToggleToolbarElement("idUndockTabOn", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idUndockTabOff", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idUndockTabText", "btn_text-on", "btn_text-off", "on");
			// *кнопка дублировать - доступна
			setToggleToolbarElement("idNewTabOn", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idNewTabOff", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idNewTabText", "btn_text-on", "btn_text-off", "on");
			// x *кнопка-переключатель скрытого контента - доступна, если в тексте текущей темы присутствует скрытый контент
			// if (window.top.vrsTopic.btnExpand === "idExpandOn") {
			// 	setToggleToolbarElement("idExpandOn", "btn-icon", "btn_icon-off", "on");
			// 	setToggleToolbarElement("idExpandOff", "btn-icon", "btn_icon-off", "off");
			// 	setToggleToolbarElement("idExpandText", "btn_text-on", "btn_text-off", "on");
			// } else if (window.top.vrsTopic.btnExpand === "idExpandOff") {
			// 	setToggleToolbarElement("idExpandOn", "btn-icon", "btn_icon-off", "off");
			// 	setToggleToolbarElement("idExpandOff", "btn-icon", "btn_icon-off", "on");
			// 	setToggleToolbarElement("idExpandText", "btn_text-on", "btn_text-off", "off");
			// }
			// *кнопка постоянная ссылка - доступна
			setToggleToolbarElement("idPermalinkOn", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idPermalinkOff", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idPermalinkText", "btn_text-on", "btn_text-off", "on");
			// *кнопка email - доступна
			// setToggleToolbarElement("idFeedBackOn", "btn-icon", "btn_icon-off", "on");
			// setToggleToolbarElement("idFeedBackOff", "btn-icon", "btn_icon-off", "off");
			// setToggleToolbarElement("idFeedBackText", "btn_text-on", "btn_text-off", "on");
			// *кнопка печать - доступна
			// setToggleToolbarElement("idPrinterOn", "btn-icon", "btn_icon-off", "on");
			// setToggleToolbarElement("idPrinterOff", "btn-icon", "btn_icon-off", "off");
			// setToggleToolbarElement("idPrinterText", "btn_text-on", "btn_text-off", "on");
			// *кнопка назад
			if (window.top.vrsTopic.prevP === "") { // - нет доступа
				setToggleToolbarElement("idPagePreviousOn", "btn-icon", "btn_icon-off", "off");
				setToggleToolbarElement("idPagePreviousOff", "btn-icon", "btn_icon-off", "on");
				setToggleToolbarElement("idPagePreviousText", "btn_text-on", "btn_text-off", "off");
			} else { // - доступна
				setToggleToolbarElement("idPagePreviousOn", "btn-icon", "btn_icon-off", "on");
				setToggleToolbarElement("idPagePreviousOff", "btn-icon", "btn_icon-off", "off");
				setToggleToolbarElement("idPagePreviousText", "btn_text-on", "btn_text-off", "on");
			}
			// *кнопка домой - доступна
			setToggleToolbarElement("idPageHomeOn", "btn-icon", "btn_icon-off", "on");
			setToggleToolbarElement("idPageHomeOff", "btn-icon", "btn_icon-off", "off");
			setToggleToolbarElement("idPageHomeText", "btn_text-on", "btn_text-off", "on");
			// *кнопка вперед
			if (window.top.vrsTopic.nextP === "") { // - нет доступа
				setToggleToolbarElement("idPageNextOn", "btn-icon", "btn_icon-off", "off");
				setToggleToolbarElement("idPageNextOff", "btn-icon", "btn_icon-off", "on");
				setToggleToolbarElement("idPageNextText", "btn_text-on", "btn_text-off", "off");
			} else { // - доступна
				setToggleToolbarElement("idPageNextOn", "btn-icon", "btn_icon-off", "on");
				setToggleToolbarElement("idPageNextOff", "btn-icon", "btn_icon-off", "off");
				setToggleToolbarElement("idPageNextText", "btn_text-on", "btn_text-off", "on");
			}
		break;
	}
}
// (!) получить целевое окно среди имеющихся топиков/клонов
function getTargetWindow(srcFrame = "") {
	let retVal = "";
	if (typeof(srcFrame) !== "string" || (srcFrame === "" && typeof(srcFrame) === "string")) {
		console.error(`(!) Косяк - не удалось получить целевое окно - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function getTargetWindow(srcFrame: typeof(${typeof(srcFrame)}), ${srcFrame}): window.«${window.name}», location.origin: ${location.origin}\n`);
		alert(`(!) Косяк - не удалось получить целевое окно - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return retVal;
	}
	let frm = window.top.document.querySelector('iframe[src="' + srcFrame + '"]');
	if (frm === null && frm !== Object(frm)) {
		// frm = window.top.setNewTab(srcFrame).frm; // создать новую вкладку
		frm = setNewTab(srcFrame).frm; // создать новую вкладку
		if (frm === null && frm !== Object(frm)) {
			console.error(`(!) Косяк - не удалось получить целевое окно - не найден элемент:\n function getTargetWindow(srcFrame: ${srcFrame}): window.«${window.name}», location.origin: ${location.origin}\n frm: ${frm}`);
			alert(`(!) Косяк - не удалось получить целевое окно - не найден элемент, см.консоль`);
		} else {
			retVal = frm.name;
		}
	} else {
		retVal = frm.name;
		// *делаем вкладку текущей
		let tab = window.top.document.querySelector('.tabs[tabnum="' + +frm.parentElement.getAttribute('boxnum') + '"]');
		if (tab !== null && tab === Object(tab)) {
			window.top.setTabVisibility(tab, "show", "goToPage"); // показать/скрыть текущую вкладку
		} else {
			console.error(`(!) Косяк - не удалось получить целевое окно - не найден элемент:\n function getTargetWindow(srcFrame: ${srcFrame}): window.«${window.name}», location.origin: ${location.origin}\n tab: ${tab}`);
			alert(`(!) Косяк - не удалось получить целевое окно - не найден элемент, см.консоль`);
		}
	}
	if (retVal === "") {
		retVal = "ifrmtopic";
	}
	return retVal;
}
// (!) установить целевое окно ч.2 // (?) x - на удаление
function putTargetWindow(frmName = "") {
	// 'frmName - tagName iframe.name
	// (i)(!) сюда попадать нужно только текущим окном или через postMessage()
	if ((frmName === "" && typeof(frmName) === "string") || typeof(frmName) !== "string" || frmName === undefined || typeof(frmName) === "undefined") {
		console.error(`(!) Косяк: не удалось установить целевое окно - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function putTargetWindow(frmName: typeof(${typeof(frmName)}), frmName: ${frmName}): window.«${window.name}», location.origin: ${location.origin}\n---`);
		alert(`(!) Косяк: не удалось установить целевое окно - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	let arr = [];
	// (i) преобразуем NodeList в массив:
	// 'Array.from появился в ECMA6 - для более новых версий браузеров и может работать не везде
	// ''Array.prototype.slice.call - не сработает для IE8
	if (window === top && window.name === "") { // - если гл.окно
		// if (list instanceof(NodeList) // преобразуем NodeList в массив
		arr = Array.from(document.getElementById('idToolbar').querySelectorAll('#idLinkPagePrevious, #idLinkPageHome, #idLinkPageNext'));
	} else if (window.name === "ifrmnavigation") { // - если пан.нав.
		// if (list instanceof(NodeList) // преобразуем NodeList в массив
		arr = Array.prototype.slice.call(document.getElementById('idTocBody').querySelectorAll('a[target]:not([target=""], [target="_top"], [target="_blank"])'));
	}
	if (arr.length > 0) {
		arr.forEach(elem => {
			if (Array.isArray(elem)) { // - во избежание в массиве др.массива
				for (let i = 0; i < elem.length; i++) {
					if (elem[i].getAttribute('target') !== "" && elem[i].getAttribute('target') !== "_top" && elem[i].getAttribute('target') !== "_blank") {
						if (elem[i].getAttribute('target') !== frmName) {
							elem[i].setAttribute('target', frmName);
						}
					}
				}
			} else if (elem !== null && elem === Object(elem)) {
				if (elem.getAttribute('target') !== "" && elem.getAttribute('target') !== "_top" && elem.getAttribute('target') !== "_blank") {
					if (elem.getAttribute('target') !== frmName) {
						elem.setAttribute('target', frmName);
					}
				}
			}
		}); return true;
	} else { return false; }
}
// (!) установить целевое окно ч.1
// *(пере-)назначить аттрибут target для ссылок в:
// 'пан.инстр.(idLinkPagePrevious/idLinkPageHome/idLinkPageNext)
// ''пан.нав.(idToc-ul)
function setTargetWindow(frmName = "") {
	// 'frmName - tagName iframe.name
	if ((frmName === "" && typeof(frmName) === "string") || typeof(frmName) !== "string" || frmName === undefined || typeof(frmName) === "undefined") {
		console.error(`(!) Косяк: не удалось установить целевое окно - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setTargetWindow(frmName: typeof(${typeof(frmName)}), frmName: ${frmName}): window.«${window.name}», location.origin: ${location.origin}\n---`);
		alert(`(!) Косяк: не удалось установить целевое окно - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	let arr = [];
	if (window === top && window.name === "") { // - если гл.окно
		// if (list instanceof(NodeList) // преобразуем NodeList в массив
		arr = Array.from(document.getElementById('idToolbar').querySelectorAll('#idLinkPagePrevious, #idLinkPageHome, #idLinkPageNext'));
		if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
			let msg = {
				value: "setTargetWindow",
				frmName: frmName
			}
			frames.ifrmnavigation.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
		} else {
			// if (list instanceof(NodeList) // преобразуем NodeList в массив
			arr.push(Array.prototype.slice.call(frames.ifrmnavigation.document.getElementById('idTocBody').querySelectorAll('a[target]:not([target=""], [target="_top"], [target="_blank"])')));
		}
	} else if (window.name === "ifrmnavigation") { // - если пан.нав.
		// if (list instanceof(NodeList) // преобразуем NodeList в массив
		arr = Array.from(document.getElementById('idTocBody').querySelectorAll('a[target]:not([target=""], [target="_top"], [target="_blank"])'));
		if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
			let msg = {
				value: "setTargetWindow",
				frmName: frmName
			}
			window.top.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
		} else {
			// if (list instanceof(NodeList) // преобразуем NodeList в массив
			arr.push(Array.prototype.slice.call(window.top.document.getElementById('idToolbar').querySelectorAll('#idLinkPagePrevious, #idLinkPageHome, #idLinkPageNext')));
		}
	}
	// *
	if (arr.length > 0) {
		arr.forEach(elem => {
			if (Array.isArray(elem)) { // во избежание в массиве др.массива
				for (let i = 0; i < elem.length; i++) {
					if (elem[i].getAttribute('target') !== "" && elem[i].getAttribute('target') !== "_top" && elem[i].getAttribute('target') !== "_blank") {
						if (elem[i].getAttribute('target') !== frmName) {
							elem[i].setAttribute('target', frmName);
						}
					}
				}
			} else if (elem !== null && elem === Object(elem)) {
				if (elem.getAttribute('target') !== "" && elem.getAttribute('target') !== "_top" && elem.getAttribute('target') !== "_blank") {
					if (elem.getAttribute('target') !== frmName) {
						elem.setAttribute('target', frmName);
					}
				}
			}
		}); return true;
	} else { return false; }
}
// (!) обновление некоторых элементов значениями из глоб.переменной variables.js:
// 'кн.на пан.инстр.: группу кнопок навигации на пан.инструментов (домой/назад/вперед), кнопку-переключатель скрытого контента
// ''наименование текущей вкладки на пан.топика
// '''ссылку на текущую тему в текущ.вкладке топика в меню вкладок
// ''''ссылку в окне Постоянная ссылка
// '''''аттрибут title фрейма
function setUpdateElements() {
	// *обновляем адресс ссылок в кнопках на пан.инструментов
	let elem = window.top.document.getElementById('idLinkPageHome');
	if (typeof(elem) !== "undefined" || elem !== null && (elem === Object(elem) || typeof(elem) === "object")) {
		elem.setAttribute('href', window.top.vrsTopic.homeP);
	}
	elem = window.top.document.getElementById('idLinkPagePrevious');
	if (typeof(elem) !== "undefined" || elem !== null && (elem === Object(elem) || typeof(elem) === "object")) {
		if (window.top.vrsTopic.prevP === "") {
			elem.setAttribute('href', '#');
			setToolbarButtonsOnOff('idPagePreviousOff');
		} else {
			setToolbarButtonsOnOff('idPagePreviousOn');
			elem.setAttribute('href', window.top.vrsTopic.prevP);
		}
	}
	elem = window.top.document.getElementById('idLinkPageNext');
	if (typeof(elem) !== "undefined" || elem !== null && (elem === Object(elem) || typeof(elem) === "object")) {
		if (window.top.vrsTopic.nextP === "") {
			elem.setAttribute('href', '#');
			setToolbarButtonsOnOff('idPageNextOff');
		} else {
			setToolbarButtonsOnOff('idPageNextOn');
			elem.setAttribute('href', window.top.vrsTopic.nextP);
		}
	}
	// *обновляем наименование текущей вкладки
	elem = window.top.document.querySelector('.tab-current');
	if (elem === null && elem !== Object(elem)) {
		elem = window.top.document.getElementById('idTopicTab'); // вкладка текущ.топика по умолчанию
	}
	if (typeof(elem) !== "undefined" || elem !== null && (elem === Object(elem) || typeof(elem) === "object")) {
		elem.querySelector('a').setAttribute('data', window.top.vrsTopic.titleP);
		elem.querySelector('a').setAttribute('title', window.top.vrsTopic.titleP);
		elem.querySelector('span').textContent = window.top.vrsTopic.titleP;
	}
	// *обновляем текстовое содержание ссылки на текущую вкладку в меню вкладок
	let lnk = window.top.document.getElementById('idTabsList').querySelector('li[listnum="' + +elem.getAttribute('tabnum') + '"]>a');
	if (lnk !== null && lnk === Object(lnk)) {
		if (lnk.id === "idTabList0") {
			// (&ensp;), (RegExp: (/[ \f\n\r\t\v]/) / (\s))
			// 1 // before: lnk.innerHTML.match(/Актуальная тема:\s/i).toString(), // фраза: «Актуальная тема:&ensp;»
			// 2 // before: lnk.innerHTML.substring(0, lnk.innerHTML.indexOf(":") + 2), // фраза: «Актуальная тема:&ensp;»
			lnk.innerHTML = lnk.innerHTML.match(/Актуальная тема:\s/i).toString() + window.top.vrsTopic.titleP;
		} else {
			lnk.innerHTML = window.top.vrsTopic.titleP;
		}
		lnk.href = window.top.vrsPermalink.url; // или так
		// if (window.top.vrsNavigation.hash === "") {
		// 	lnk.href = window.top.location.pathname.slice(window.top.location.pathname.lastIndexOf("/") + 1) + "?" + window.top.vrsTopic.currP;
		// } else {
		// 	lnk.href = window.top.location.pathname.slice(window.top.location.pathname.lastIndexOf("/") + 1) + "?" + window.top.vrsTopic.currP + "#" + window.top.vrsNavigation.hash;
		// }
	}
	// *Обновляем окно Постоянная ссылка
	elem = window.top.document.getElementById('idPermalinkBox');
	if (elem === null && elem !== Object(elem)) {
		if (elem.classList.contains('permalink-popup')) {
			let txtArea = window.top.document.getElementById('idPermaLinkTxT');
			if (txtArea === null && txtArea !== Object(txtArea)) {
				setClearPermalink(); // очистить окно Постоянная ссылка
				txtArea.value = window.top.vrsPermalink.url; // (?)~не понятно как обновить поле, да еще со свойством "readonly"
			}
		}
	}
	// *обновляем аттрибут(-ы) текущего фрейма
	// (i) обновление св-ва src приводит к дополнит.перезагрузке contentDocument iframe, что приводит здесь к зацикливанию топика
	window.top.getFrame().title = window.top.vrsTopic.titleP;
	// elem = window.top.getFrame();
	// if (elem !== null && elem === Object(elem)) {
	// 	elem.title = window.top.vrsTopic.titleP;
	// 	// elem.src = window.top.vrsTopic.currP; // 'looping - зацикливаюсь, т.к.сюда попадаем в момент события "load" фрейма текущ.топика через фрейм нав.пан.:
	// 	// 'ifrmtopic load => ifrmnavigation: setVariables/goToPage
	// x // *обновляем кнопку переключения скрытого контента на пан.инстр.
	// 	setToolbarButtonsOnOff(elem.contentWindow.getButtonExpand().status); // получить сведения кнопки-переключателя скрытого контента
	// }
}
// (!) обновление списка Меню вкладок и выделение ссылки на текущую вкладку
function setUpdateTabsMenuList(tabs) {
	// 'tabs - tagName ul: idTabSliderTrack/.tab_slider-track
	if (typeof(tabs) === "undefined" || tabs === null && (tabs === Object(tabs) || typeof(tabs) === "object")) {
		console.error(`(!) Косяк: не удалось обновить список в меню вкладок - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setUpdateTabsMenuList(tabs: typeof(${typeof(tabs)}), Object(${Object(tabs)}), ${tabs}): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось обновить список в меню вкладок - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	let tabsList = window.top.document.getElementById('idTabsList');
	if (tabsList === null && tabsList !== Object(tabsList)) {
		console.error(`(!) Косяк: не удалось обновить список в меню вкладок - не найден элемент:\n function setUpdateTabsMenuList(tabs: typeof(${typeof(tabs)}), Object(${Object(tabs)}), ${tabs}): window."${window.name}", location.origin: ${location.origin}\n tabsList: typeof(${typeof(tabsList)}), Object(${Object(tabsList)}), ${tabsList}`);
		alert(`(!) Косяк: не удалось обновить список в меню вкладок - не найден элемент, см.консоль.`);
		return;
	}
	let lnk = null;
	let txt = "";
	let str = {before: "", after: ""};
	let elem = null;
	// (i) 'в tabsList потомков будет на 1 больше из-за скрытого эл.<hr>, кот.отображается при клонировании эл.
	// ''в отличие от вкладок-клонов, вкладки: idIndexTab и idSearchTab скрываются, но сами эл.не удаляются, поэтому кол-во владок всегда будет с учетом 1-х 3-х вкладок
	if (tabs.children.length > tabsList.querySelectorAll('li[listnum]').length) { // *пополняем список меню вкладок
		// 'ищем недостающую вкладку в списке меню вкладок
		for (let i = 0; i < tabs.children.length; i++) {
			if (tabs.children[i].hasAttribute('tabnum')) {
				elem = tabsList.querySelector('li[listnum="' + +tabs.children[i].getAttribute('tabnum') + '"]');
				if (elem === null && elem !== Object(elem)) {
					tabsList.children[i].insertAdjacentHTML('afterend', '<li listnum="' + +tabs.children[i].getAttribute('tabnum') + '"><a id="idTabList' + +tabs.children[i].getAttribute('tabnum') + '" href="#">' + tabs.children[i].querySelector('span').innerHTML + '</a></li>');
					// (i) test: проверка эл.tagName
					// console.warn(`tabsList.children[${i}]: ${tabsList.children[i].tagName}\n tabsList.children[${i}].nodeType: ${tabsList.children[i].nodeType} = 1: ${tabsList.children[i].nodeType === 1}\n 1) tabsList.children[${i}].tagName !== undefined: ${tabsList.children[i].tagName !== undefined}\n 2) typeof(${typeof(tabsList.children[i].tagName)}) !== "undefined"}: ${typeof(tabsList.children[i].tagName) !== "undefined"}`); // 'test
					if (tabsList.children[i].tagName !== undefined && tabsList.children[i].tagName === "HR") { // отображаем разделитель
						tabsList.children[i].removeAttribute('style');
					}
					// *выделяем ссылку пункта на текущую вкладку
					if (tabs.children[i].classList.contains('tab-current')) {
						lnk = tabsList.children[i + 1].querySelector('a');
						if (lnk !== null && lnk === Object(lnk)) {
							lnk.classList.add('highlight');
						}
					}
				} else {
					lnk = elem.querySelector('a');
					if (lnk !== null && lnk === Object(lnk)) {
						lnk.classList.remove('highlight');
					}
				}
			}
		}
	} else if (tabs.children.length < tabsList.querySelectorAll('li[listnum]').length) { // *удаляем пункт в списке меню вкладок
		for (let i = 0; i < tabsList.children.length; i++) {
			if (tabsList.children[i].hasAttribute('listnum')) {
				elem = tabs.querySelector('li[tabnum="' + +tabsList.children[i].getAttribute('listnum') + '"]');
				if (elem === null && elem !== Object(elem)) {
					tabsList.children[i].remove();
				} else {
					if (elem.classList.contains('tab-current')) {
						lnk = tabsList.children[i].querySelector('a');
						if (lnk !== null && lnk === Object(lnk)) {
							lnk.classList.add('highlight');
						}
					}
				}
			}
		}
	} else if (tabs.children.length === tabsList.querySelectorAll('li[listnum]').length) { // *обновляем список меню вкладок
		// 'работаем с HTMLCollection и массивом: ul li's
		// (i) преобразуем NodeList в массив:
		// 'Array.from появился в ECMA6 - для более новых версий браузеров и может работать не везде
		// ''Array.prototype.slice.call - не сработает для IE8
		tabsList = Array.prototype.slice.call(window.top.document.getElementById('idTabsList').querySelectorAll('li[listnum]')); // ul li's
		for (let i = 0; i < tabs.children.length; i++) {
			// *если вкладка совпадает с пунктом в списке
			if (tabs.children[i].hasAttribute('tabnum') && tabsList[i].hasAttribute('listnum')) {
				if (+tabs.children[i].getAttribute('tabnum') === +tabsList[i].getAttribute('listnum')) {
					// *выделяем ссылку пункта на текущую вкладку
					lnk = tabsList[i].querySelector('a');
					if (lnk !== null && lnk === Object(lnk)) {
						if (tabs.children[i].classList.contains('tab-current')) {
							lnk.classList.add('highlight');
						} else {
							lnk.classList.remove('highlight');
						}
					}
					// *сверяем текст
					if (tabs.children[i].hasAttribute('id')) {
						txt = tabs.children[i].querySelector('span').innerHTML;
						if (tabs.children[i].id === "idTopicTab") {
							// (&ensp;), (RegExp: (/[ \f\n\r\t\v]/) / (\s))
							// 1 // before: lnk.innerHTML.match(/Актуальная тема:\s/i).toString(), // фраза: Актуальная тема:&ensp;
							// 2 // before: lnk.innerHTML.substring(0, lnk.innerHTML.indexOf(":") + 2), // фраза: Актуальная тема:&ensp;
							// 'Метод String.slice извлекает часть строки и возвращает ее, не изменяя исходную строку.
							str = {
								before: lnk.innerHTML.match(/Актуальная тема:\s/i).toString(), // фраза: Актуальная тема:&ensp;
								after: lnk.innerHTML.slice(lnk.innerHTML.indexOf(":") + 2), // без фразы: Актуальная тема:&ensp;
							}
							if (txt !== str.after) {
								lnk.innerHTML = str.before + txt;
							}
						} else {
							if (lnk.innerHTML !== txt) {
								lnk.innerHTML = txt;
							}
						}
					}
				}
			}
			// *сверяем скрытые вкладки
			if (tabs.children[i].style.display === "none") {
				tabsList[i].style.display = "none";
			} else {
				tabsList[i].removeAttribute('style'); // или
				// tabsList[i].style.removeProperty('display'); // удалить css св-во
			}
		}
	}
	// *скрываем/отображаем эл.hr, если вкладки-клононы отсутствют/присутсвуют
	// console.log(window.top.document.getElementById('idTabsList').children.length); // x -
	if (window.top.document.getElementById('idTabsList').children.length > 4) { // ul li's + 1 hr
		window.top.document.getElementById('idTabsList').querySelector('hr').removeAttribute('style');
	} else {
		window.top.document.getElementById('idTabsList').querySelector('hr').style.display = "none";
	}
	// x 'цикл for...in / ''цикл for...of
	// let tabNum, listNum;
	// for (const tab of tabs.children) {
	// 	if (tab.hasAttribute('tabnum')) {
	// 		tabNum = +tab.getAttribute('tabnum');
	// 		for (const list of tabsList.children) {
	// 			if (list.hasAttribute('listnum')) {
	// 				listNum = +list.getAttribute('listnum');
	// 				if (tabNum === listNum) { // 'обновляем аттрибут(-ы) эл.в списке меню
	// 					// *выделяем ссылку на текущую вкладку
	// 					if (list.children[0].hasAttribute('tagName')) {
	// 						if (list.children[0].tagName === "A") {
	// 							if (tab.classList.contains('tab-current')) {
	//								list.classList.add('highlight');
	// 							} else {
	// 								list.children[0].classList.remove('highlight');
	// 							}
	// 						}
	// 					} else { // перестраховка
	// 						lnk = list.querySelector('a');
	// 						if (lnk !== null && lnk === Object(lnk)) {
	// 							if (lnk.tagName === "A") {
	// 								if (tab.classList.contains('tab-current')) {
	// 									lnk.classList.add('highlight');
	// 								} else {
	// 									lnk.classList.remove('highlight');
	// 								}
	// 							}
	// 						}
	// 					}
	// 				}
	// 				// *сверяем скрытые вкладки
	// 				if (tab.style.display === "none") {
	// 					if (list.style.display !== "none") {
	// 						list.style.display = "none";
	// 					}
	// 				} else if (tab.style.display !== "none") {
	// 					if (list.style.display === "none") {
	// 						list.removeAttribute('style');
	// 						// list.style.removeProperty('display'); // удалить css св-во
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }
	// 'цикл for...in
	// for (let i = 0; i < tabs.children.length; i++) {
	// 	tabNum = +tabs.children[i].getAttribute('tabnum');
	// 	for (let k = 0; k < tabsList.children.length; k++) {
	// 		listNum = +tabsList.children[k].getAttribute('listnum');
	// 		if (tabNum === listNum) {
	// 			// *для 1-х 3-х вкладок
	// 			if (((tabNum >= 0) && (tabNum < 3)) && ((listNum >= 0) && (listNum < 3))) {
	// 				// *выделяем ссылку на текущую вкладку
	// 				if (tabs.children[i].classList.contains('tab-current')) {
	// 					tabsList.children[k].children[0].classList.add('highlight');
	// 				} else {
	// 					tabsList.children[k].children[0].classList.remove('highlight');
	// 				}
	// 				// *сверяем скрытые вкладки
	// 				if (tabs.children[i].style.display === "none") {
	// 					if (tabsList.children[k].style.display !== "none") {
	// 						tabsList.children[k].style.display = "none";
	// 					}
	// 				} else if (tabs.children[i].style.display !== "none") {
	// 					if (tabsList.children[k].style.display === "none") {
	// 						// tabsList.children[k].style.removeProperty('display'); // - удалить css св-во
	// 						tabsList.children[k].removeAttribute('style');
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }
}
// (!) установить видимость вкладки - показать/скрыть текущую вкладку
function setTabVisibility(elem, visibilityState = "", setGoTo = "") {
	// (i) elem - tagName li:
	// '.tab-current
	// ''idTopicTab - по умолчанию без класса.tab-current (ни одна вкладка не активна при первичном открытии/загрузке сайта)
	if (elem === undefined || typeof(elem) === "undefined" || elem !== Object(elem) || (elem === null && elem === Object(elem))) {
		console.error(`(!) Косяк - не удалось показать/скрыть текущую вкладку - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setTabVisibility(elem: typeof(${typeof(elem)}) | Object(${Object(elem)}) | ${elem}, visibilityState: "${visibilityState}", setGoTo: ${setGoTo}): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк - не удалось показать/скрыть текущую вкладку - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль`);
		return;
	} else if (visibilityState === "" && visibilityState === String(visibilityState) || typeof(visibilityState) !== "string") {
		console.error(`(!) Косяк - не удалось показать/скрыть текущую вкладку - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setTabVisibility(elem: typeof(${typeof(elem)}) | Object(${Object(elem)}) | ${elem}, visibilityState: "${visibilityState}, setGoTo: ${setGoTo}"): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк - не удалось показать/скрыть текущую вкладку - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль`);
		return;
	}
	let tabs = elem.parentElement; // idTabSliderTrack/.tab_slider-track
	let boxes = window.top.document.getElementById('idTopicContent'); // .topic-content
	let box = boxes.querySelector('div[boxnum="' + +elem.getAttribute('tabnum') + '"]');
	let kontent = null; // контентная часть найденной вкладки в цикле
	if (box === null || box === Object(box) && box === null) {
		for (let i = 0; i < boxes.children.length; i++) { // ~ лапатим весь DOM-узел
			if (+boxes.children[i].getAttribute('boxnum') === +elem.getAttribute('tabnum')) {
				box = boxes.children[i];
				break;
			}
		}
		if (box === null || box === Object(box) && box === null) {
			console.error(`(!) Косяк - не удалось показать/скрыть текущую вкладку - не найден элемент:\n function setTabVisibility(elem: typeof(${typeof(elem)}) | Object(${Object(elem)}) | ${elem}, visibilityState: "${visibilityState}, setGoTo: ${setGoTo}"): window."${window.name}", location.origin: ${location.origin}\n box: ${box}`);
			alert(`(!) Косяк - не удалось показать/скрыть текущую вкладку - не найден элемент, см.консоль`);
			return;
		}
	}
	if (visibilityState === "show") {
		// *лапатим все вкладки, чтобы избежать дублирования класса.tab-current
		for (let i = 0; i < tabs.children.length; i++) {
			if (+tabs.children[i].getAttribute('tabnum') === +elem.getAttribute('tabnum')) {
				// *делаем вкладку текущей и выводим ее контентную часть
				// elem.style.display = null; // удаляем значение св-ва
				elem.removeAttribute('style'); // удаляем атрибут "стиль"
				elem.classList.add('tab-current');
				box.removeAttribute('style');
				let frm = box.querySelector('iframe');
				if (frm !== null && frm === Object(frm)) {
					if (frm.name !== "ifrmkeywords" && frm.name !== "ifrmsearch") {
						// (i) при локальном использовании вызов будет через postMessage, т.к.ссылка contentDocument текущ.фрейма будет доступна от туда для ф.: goToPage()/setVariables()/setHistoryState()/setTargetWindow()
						if (location.origin === "file://" || location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
							// *получаем и устанавливаем св-ва кн.-переключателя скрытого контента
							frm.contentWindow.postMessage('getButtonExpand', '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
						} else {
							if (setGoTo !== "") {
								let href = frm.contentDocument.location.href.slice(frm.contentDocument.location.href.lastIndexOf("/") + 1); // ~ссылка док.(НО не фрейма) уже имеет новый href
								if (setGoTo === "goToPage") {
									window.top.frames.ifrmnavigation.goToPage(null, href); // перейти на страницу
									// *сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
									window.top.setHistoryState("push", href); // сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
								} else if (setGoTo === "setVariables") {
									if (frm.contentDocument.location.hash === "") {
										window.top.frames.ifrmnavigation.setVariables(null, href); // обновление глобальных переменных в variables.js
									} else {
										let hash = currP.slice(currP.lastIndexOf("#") + 1);
										window.top.frames.ifrmnavigation.setVariables(null, href, hash); // обновление глобальных переменных в variables.js
									}
								}
								// *сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
								window.top.setHistoryState("push", href); // сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
								// *получаем и устанавливаем св-ва кн.-переключателя скрытого контента
								setButtonExpand(frm.contentWindow.getButtonExpand().status); // установить статус кн.для скрытого контента
							}
							setTargetWindow(frm.name) // установить целевое окно // *(пере-)назначить аттрибут target для ссылок в: пан.нав./инстр.
						}
					}
				}
				setToolbarButtonsOnOff(elem.id); // меняем состояние вкл/выкл группы кнопок на панели инструментов
			} else { // - для всех остальных, кроме той, на кот.кликнули снимаем статус "текущая"
				tabs.children[i].classList.remove('tab-current');
				kontent = boxes.querySelector('div[boxnum="' + +tabs.children[i].getAttribute('tabnum') + '"]');
				if (kontent !== null && kontent === Object(kontent)) {
					kontent.style.display = "none";
				}
			}
		}
	} else if (visibilityState === "hide") {
		// *скрываем текущую вкладку и переназначаем предыдущей ВИДИМОЙ вкладке значение на "текущая", если текущая вкладка была активной
		if (elem.classList.contains('tab-current')) {
			// *получить номер индекса текущего дочернего эл.
			// 1) let index = Array.from(chdn.parentElement.children).indexOf(chdn);
			// 2) let index = Array.prototype.indexOf.call(chdn.parentElement.children, chdn);
			let index = Array.from(elem.parentElement.children).indexOf(elem); // номер индекса текущей вкладки, на кот.кликнули
			// *
			let list = tabs.querySelectorAll('.tab-current');
			if (list.length > 0) {
				list.forEach(item => {
					item.classList.remove('tab-current');
				});
			}
			elem.style.display = "none";
			box.style.display = "none";
			for (let i = index - 1; i >= 0; i--) {
				if (tabs.children[i].style.display !== "none") {
					tabs.children[i].classList.add('tab-current');
					kontent = boxes.querySelector('div[boxnum="' + +tabs.children[i].getAttribute('tabnum') + '"]');
					if (kontent !== null && kontent === Object(kontent)) {
						kontent.removeAttribute('style');
					}
					setToolbarButtonsOnOff(tabs.children[i].id); // - меняем состояние вкл/выкл группы кнопок на панели инструментов
					break;
				}
			}
		} else { // - скрываем текущую вкладку (ту, в кот.кликнули на кн.закрытия) и ее контентную часть
			elem.style.display = "none";
			box.style.display = "none";
		}
	} else {
		console.error(`(!) Косяк - не удалось показать/скрыть текущую вкладку - переменная аргумента не определена:\n function setTabVisibility(elem: typeof(${typeof(elem)}) | Object(${Object(elem)}) | ${elem}, visibilityState: "${visibilityState}", setGoTo: ${setGoTo}): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк - не удалось показать/скрыть текущую вкладку - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль`);
		return;
	}
	setUpdateTabsMenuList(tabs); // обновление списка Меню вкладок и выделение ссылки на текущую вкладку
}
// (!) animationOffset - анимационное смещение для: 1) вкладок на панели тема топика, 2) слайдера изо в скрытом контенте
function animationOffset(elem) {
	// 'elem - tagName img.tabs-btns: idTabFirst/idTabPrevious/idTabNext/idTabLast
	// ''elem - tagName div.slider-track
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк - не удалось воспроизвести анимацию - переменная аргумента не определена:\n function animationOffset(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось воспроизвести анимацию - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	if (elem.hasAttribute('id') || elem.hasOwnProperty('id') || elem.getAttribute('id') !== null) { // *для вкладок на панели тема топика
		let topicTabs = document.getElementById('idTabSliderTrack');
		if (typeof(topicTabs) === "undefined" || topicTabs === null && (topicTabs === Object(topicTabs) || typeof(topicTabs) === "object")) {
			console.error(`(!) Косяк - не удалось воспроизвести анимацию - не найден элемент:\n function animationOffset(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n topicTabs: typeof(${typeof(topicTabs)}) / Object(${Object(topicTabs)}) / ${topicTabs}`);
			alert(`(!) Косяк: не удалось воспроизвести анимацию - не найден элемент, см.консоль.`);
			return;
		}
		// topicTabs.style.animationFillMode = "backwards"; // Элемент сохранит стиль первого ключевого кадра на протяжении периода animation-delay. Первый ключевой кадр определяется значением animation-direction
		switch (elem.id) {
			case 'idTabFirst': case 'idTabPrevious':
				topicTabs.style.animation = "jumpToRight"; // имя @keyframes в файле styles.css
				break;
			case 'idTabNext': case 'idTabLast':
				topicTabs.style.animation = "jumpToLeft"; // имя @keyframes в файле styles.css
				break;
			default:
				console.error(`(!) Косяк - не удалось воспроизвести анимацию - текущая вкладка не определена:\n function animationOffset(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n elem.id: ${elem.id}`);
				alert(`(!) Косяк: не удалось воспроизвести анимацию - текущая вкладка не определена, см.консоль.`);
				return;
		}
		topicTabs.style.animationDuration = ".1s"; // продолжительность одного цикла анимации
		topicTabs.style.animationTimingFunction = "cubic-bezier(0.18, 0.89, 0.32, 1.28)"; // временнАя функция - описывает, как будет развиваться анимация между каждой парой ключевых кадров. *Во время задержки анимации временные функции не применяются
		topicTabs.style.animationIterationCount = 1; // кол-во повторов - ск-ко раз проигрывается цикл анимации
		// topicTabs.style.animationDirection = "alternate"; // alternate-reverse // направление - определяет, должна ли анимация воспроизводиться в обратном порядке в некоторых или во всех циклах. *Когда анимация воспроизводится в обратном порядке, временные функции также меняются местами. Например, при воспроизведении в обратном порядке функция ease-in будет вести себя как ease-out
		topicTabs.style.animationDelay = "0ms"; // задержка - определяет, когда анимация начнется. *Задается в секундах s или миллисекундах ms
		// topicTabs.style.animationFillMode = "both"; // Анимация будет вести себя так, как будто значения forwards и backwards заданы одновременно
		// topicTabs.style.animationFillMode = "forwards"; // По окончании анимации элемент сохранит стили последнего ключевого кадра, который определяется значениями animation-direction и animation-iteration-count. Определяет, какие значения применяются анимацией вне времени ее выполнения. Когда анимация завершается, элемент возвращается к своим исходным стилям. По умолчанию анимация не влияет на значения свойств animation-name и animation-delay, когда анимация применяется к элементу. Кроме того, по умолчанию анимация не влияет на значения свойств animation-duration и animation-iteration-count после ее завершения. Свойство animation-fill-mode может переопределить это поведение
		// topicTabs.style.willChange = "transform"; // (i) - св-во will-change - экспериментальная технология, заранее передает браузеру инфу о возможном предстоящем изменении элемента
	} else if (elem.classList.contains('slider-track')) { // *для слайдера изо.в скрытом контенте
		if (elem.firstElementChild.classList.contains('slider-current')) {
			elem.style.animation = "jumpToRight"; // имя @keyframes в файле styles.css
		} else if (elem.lastElementChild.classList.contains('slider-current')) {
			elem.style.animation = "jumpToLeft"; // имя @keyframes в файле styles.css
		} else {
			console.error(`(!) Косяк - не удалось воспроизвести анимацию - элемент не определен:\n function animationOffset(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})\n elem.classList: ${JSON.stringify(elem.classList, null, 1)}`);
			alert(`(!) Косяк: не удалось воспроизвести анимацию - элемент не определен, см.консоль.`);
		}
		elem.style.animationDuration = ".1s"; // продолжительность одного цикла анимации
		elem.style.animationTimingFunction = "cubic-bezier(0.18, 0.89, 0.32, 1.28)"; // временнАя функция - описывает, как будет развиваться анимация между каждой парой ключевых кадров. *Во время задержки анимации временные функции не применяются
		elem.style.animationIterationCount = 1; // кол-во повторов - ск-ко раз проигрывается цикл анимации
		elem.style.animationDelay = "0ms"; // задержка - определяет, когда анимация начнется. *Задается в секундах s или миллисекундах ms
	}
}
// (!) обработчик вплывающих эл.
function handlerPoPuPs(eVent) {
	// 'idPermalinkBox/idTabsMenuBox/.btn_icon-tooltip-popup
	// ''ifrmnavigation:.treeview-tooltip-popup/.toclist-tooltip-popup/.footer_btn-tooltip-popup
	// '''ifrmtopic:.toc-menu/.tooltip_finger_toggle-popup(.msg_icon-finger_toggle-popup)/.tooltip_lightswitch-show
	// (?)~почему если применять event.target, то приходит как eVent.type === undefined, но в ф.handlerTargetWindow(eVent) приходит как eVent.type === ""
	// тест
	// if (typeof(eVent) === "undefined") { // 'ф.исп.не как обработчик событий
	// 	console.log(`window.«${window.name}»:\n typeof(eVent: ${typeof(eVent)}) === "undefined": ${typeof(eVent) === "undefined"}`);
	// } else if (eVent.type === undefined) {
	// 	console.log(`window.«${window.name}»:\n eVent.type === undefined: ${eVent.type === undefined}`);
	// } else if (eVent.type === "") {
	// 	console.log(`window.«${window.name}»:\n eVent.type === "": ${eVent.type === ""}`);
	// } else {
	// 	console.log(`window.«${window.name}»:\n eVent: ${eVent}`);
	// }
	// (!) скрытие эл.в текущем окне
	function setMeHide(elem) {
		if (window === top && window.name === "") {
			// 'idPermalinkBox - эл."Постоянная ссылка"
			// ''idTabsMenuBox - эл."Меню вкладок"
			if (elem.id === "idPermalinkBox") { // эл."Постоянная ссылка"
				if (elem.classList.contains('permalink-popup')) {
					setClearPermalink(); // очистить окно Постоянная ссылка
					// setShowOrHide(elem, "", "", "", "permalink-popup");
					elem.classList.remove('permalink-popup');
					setEventHandlersPermalink(elem, 'remove'); // создание/удаление обработчиков событий для узла permalink
				}
			} else if (elem.id === "idTabsMenuBox") { // эл."Меню вкладок"
				if (elem.classList.contains('tabs-menu-popup')) {
					// elem.classList.remove('tabs-menu-popup'); // или так
					setShowOrHide(elem, "", "", "", "tabs-menu-popup");
					setEventHandlersTabsList(elem.querySelector('.tabs-list'), "remove"); // создание/удаление обработчиков событий для узла.tabs-list/idTabsList
				}
			}
		} else if (window.name === "ifrmtopic") { // (window === self || self !== top && window.name !== "") // 'еще вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
			if (elem.id === "idPageMenuToc") {
				if (elem.classList.contains('toc-menu-popup')) { // эл."Меню содержание страницы"
					// setShowOrHide(elem, "", "", "", "toc-menu-popup");
					elem.classList.remove('toc-menu-popup');
				}
				let icon = elem.parentElement.querySelector('.toc-btn_icon');
				if (icon !== null && icon === Object(icon)) {
					if (icon.style.order === "2") {
						icon.removeAttribute('style');
					}
				}
			}
		}
	}
	// '
	if (window === top && window.name === "") { // (!) допродумать про проникновение сюда по клику из пан.топика для скрытия только подсказок, т.к.в этом случае сюда он приходит НЕ как прослушиватель (eVent=undefined)
		if (getBrowser().toString().toLowerCase() === "firefox") { // для firefox - скрытие вплывающих элементов, подсказок
			if (document.querySelector('.btn_icon-tooltip-popup') !== null) {
				document.querySelector('.btn_icon-tooltip-popup').classList.remove('btn_icon-tooltip-popup');
				document.removeEventListener('click', handlerPoPuPs, { capture: true }); // удаляем обработчик для всего док. // (i) { once: true } - для button-link не прокатывает и совместить нельзя с опцией capture (фаза всплытие - false/true - погружение)
			}
		}
		if (typeof(eVent) === "undefined") {
			// 'эл."Постоянная ссылка"
			// ''эл."Меню вкладок"
			const elems = [
				document.getElementById('idPermalinkBox'),
				document.getElementById('idTabsMenuBox')
			];
			elems.forEach(item => {
				if (item !== null && item === Object(item)) {
					setMeHide(item); // скрытие эл.в текущем окне
				}
			});
		// } else if (eVent.type === undefined) {

		} else {
			if (eVent.type === "message") {
				// 'эл."Постоянная ссылка"
				// ''эл."Меню вкладок"
				const elems = [
					document.getElementById('idPermalinkBox'),
					document.getElementById('idTabsMenuBox')
				];
				elems.forEach(item => {
					if (item !== null && item === Object(item)) {
						setMeHide(item); // скрытие эл.в текущем окне
					}
				});
				// x (?)
				// eVent.data.id.forEach((item) => {
				// 	if (item === "idPermalinkBox") { // всплывающий(-е) эл.в гл.окне
				// 		let elem = document.getElementById(item);
				// 		if (elem !== null && elem === Object(elem)) {
				// 			setClearPermalink(); // очистить окно Постоянная ссылка
				// 			if (elem.classList.contains('permalink-popup')) {
				// 				// setShowOrHide(document.getElementById(item), event.data.hide);
				// 				// setShowOrHide(elem, "", "", "", "permalink-popup");
				// 				elem.classList.remove('permalink-popup');
				// 				setEventHandlersPermalink(elem, 'remove'); // создание/удаление обработчиков событий для узла permalink
				// 			}
				// 		}
				// 	} else if (item === "idTabsMenuBox") { // всплывающий(-е) эл.в гл.окне
				// 		let elem = document.getElementById(item);
				// 		if (elem !== null && elem === Object(elem)) {
				// 			if (elem.classList.contains('tabs-menu-popup')) {
				// 				// setShowOrHide(elem, "", "", "", "tabs-menu-popup");
				//				elem.classList.remove('tabs-menu-popup');
				// 			}
				// 		}
				// 	}
				// 	// else if (item === "idPageMenuToc") { // всплывающий(-е) эл.в топике // x (?)
				// 	// 	let msg = {
				// 	// 		value: eVent.data.value,
				// 	// 		id: item
				// 	// 	};
				// 	// 	let frm = getFrame(); // получить фрейм текущей вкладки или фрейм вкладки гл.топика по умолчанию
				// 	// 	if (frm !== null && Object(frm)) {
				// 	// 		frm.contentWindow.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
				// 	// 	}
				// 	// }
				// });
			} else if (eVent.type === "keyup") { // esc
				let elem = document.getElementById('idPermalinkBox'); // эл."Постоянная ссылка"
				if (elem !== null || typeof(elem) !== "undefined" || elem !== null && elem === Object(elem)) {
					setMeHide(elem); // скрытие эл.в текущем окне
				}
				elem = document.getElementById('idTabsMenuBox'); // эл."Меню вкладок"
				if (elem !== null || typeof(elem) !== "undefined" || elem !== null && elem === Object(elem)) {
					setMeHide(elem); // скрытие эл.в текущем окне
				}
				// *в др.окнах:
				// 'эл."Меню содержание страницы"
				elem = getFrame(); // получить фрейм текущей вкладки или фрейм вкладки гл.топика по умолчанию
				if (elem !== null && elem === Object(elem)) {
					if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
						elem.contentWindow.postMessage('handlerPoPuPs', '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
					} else {
						elem.contentWindow.handlerPoPuPs(); // обработчик вплывающих эл.
					}
				}
				// x (?)
				// let frm = getFrame(); // получить фрейм текущей вкладки или фрейм вкладки гл.топика по умолчанию
				// if (frm !== null && frm === Object(frm)) {
				// 	if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
				// 		let msg = {
				// 			value: "handlerPoPuPs",
				// 			id: "idPageMenuToc"
				// 		};
				// 		frm.contentWindow.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
				// 	} else {
				// 		elem = frm.contentDocument.getElementById('idPageMenuToc');
				// 		if (elem !== null || typeof(elem) !== "undefined" || (elem !== null && elem === Object(elem))) {
				// 			if (elem.classList.contains('toc-menu-popup')) {
				// 				// setShowOrHide(elem, "", "", "", "toc-menu-popup");
				//				elem.classList.remove('toc-menu-popup');
				// 			}
				// 			let icon = elem.parentElement.querySelector('.toc-btn_icon');
				// 			if (icon !== null && icon === Object(icon)) {
				// 				if (icon.style.order === "2") {
				// 					icon.removeAttribute('style');
				// 				}
				// 			}
				// 		}
				// 	}
				// }
				// ''всплывающие подсказки для кн.: SJ/hh/email и эл.-переключателей: idTreeView/idTocList
				if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
					window.top.frames.ifrmnavigation.postMessage('handlerPoPuPs', '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
				} else {
					window.top.frames.ifrmnavigation.handlerPoPuPs(); // для firefox - скрытие вплывающих элементов, подсказок
				}
				document.removeEventListener('keyup', handlerPoPuPs, false); // удаляем обработчик для всего док.
			} else if (eVent.type === "click") {
				const elem = document.getElementById('idPermalinkBox');
				setMeHide(elem); // скрытие эл.в текущем окне
			}
		}
	} else if (window.name === "ifrmnavigation") {
		if (getBrowser().toString().toLowerCase() === "firefox") { // для firefox - скрытие вплывающих элементов, подсказок
			// document.querySelector('[for=idTreeView]').classList.remove('treeview-tooltip-popup');
			document.querySelector('[for=idTreeView]').removeAttribute('class');
			// document.querySelector('[for=idTocList]').classList.remove('toclist-tooltip-popup');
			document.querySelector('[for=idTocList]').removeAttribute('class');
			if (document.querySelector('.footer_btn-tooltip-popup') !== null) document.querySelector('.footer_btn-tooltip-popup').classList.remove('footer_btn-tooltip-popup');
			document.removeEventListener('click', handlerPoPuPs, { capture: true }); // удаляем обработчик для всего док. // (i) { once: true } - для button-link не прокатывает и совместить нельзя с опцией capture (фаза всплытие - false/true - погружение)
		}
		if (typeof(eVent) !== "undefined") {
			if (eVent.type === "message") { // (i) всплывающих эл.нет, кроме подсказок, кот.к этому моменту уже обработаны
			} else if (eVent.type === "click") { // без удаления обработчика события
				// *в др.окнах:
				// если стр.не открыта отдельным окном
				if (window === self || self !== top && window.name !== "") { // 'еще вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
					if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
						// const msg = { // x (?)
						// 	value: "handlerPoPuPs",
						// 	id: ["idPermalinkBox", "idTabsMenuBox"],
						// 	className: ["btn_icon-tooltip-popup"]
						// };
						window.top.postMessage('handlerPoPuPs', '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
						// перезаписываем значения массивов в объекте для окна ifrmtopic // x (?)
						// msg.id = ["idPageMenuToc"];
						// msg.className = ["tooltip_finger_toggle-popup", "tooltip_lightswitch-show"];
						window.top.frames.ifrmtopic.postMessage('handlerPoPuPs', '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
						// const frm = getFrame(); // получить фрейм текущей вкладки или фрейм вкладки гл.топика по умолчанию
						// if (frm !== null && Object(frm)) {
						// 	frm.contentWindow.postMessage('handlerPoPuPs', '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
						// }
					} else {
						window.top.handlerPoPuPs(); // обработчик вплывающих эл.
						const frm = window.top.getFrame(); // получить фрейм текущей вкладки или фрейм вкладки гл.топика по умолчанию
						frm.contentWindow.handlerPoPuPs(); // обработчик вплывающих эл.
						// x (?)
						// const elems = [
						// 	window.top.document.getElementById('idPermalinkBox'),
						// 	window.top.document.querySelector('.btn_icon-tooltip-popup'),
						// 	window.top.document.getElementById('idTabsMenuBox'),
						// 	frm.contentDocument.getElementById('idPageMenuToc'),
						// 	frm.contentDocument.querySelector('.tooltip_finger_toggle-popup'),
						// 	frm.contentDocument.querySelector('.tooltip_lightswitch-show')
						// ];
						// elems.forEach(item => {
						// 	if (item !== null && item === Object(item)) {
						// 		if (item.id === "idPermalinkBox") { // всплывающий(-е) эл.в гл.окне
						// 			window.top.setClearPermalink(); // очистить окно Постоянная ссылка
						// 			// setShowOrHide(item, "", "", "", "permalink-popup");
						// 			item.classList.remove('permalink-popup');
						// 			window.top.setEventHandlersPermalink(item, 'remove'); // создание/удаление обработчиков событий для узла permalink
						// 		} else if (item.hasAttribute('class') && item.classList.contains('btn_icon-tooltip-popup')) { // всплывающий(-е) эл.в гл.окне
						// 			item.classList.remove('btn_icon-tooltip-popup');
						// 			window.top.document.removeEventListener('click', handlerPoPuPs, { capture: true }); // удаляем обработчик для всего док. // (i) { once: true } - для button-link не прокатывает и совместить нельзя с опцией capture (фаза всплытие - false/true - погружение)
						// 		} else if (item.id === "idTabsMenuBox") { // всплывающий(-е) эл.в гл.окне
						// 			if (item.classList.contains('tabs-menu-popup')) {
						// 				// setShowOrHide(item, "", "", "", "tabs-menu-popup");
						//				item.classList.remove('tabs-menu-popup');
						// 			}
						// 		} else if (item.id === "idPageMenuToc") { // всплывающий(-е) эл.в топике
						// 			if (item.classList.contains('toc-menu-popup')) {
						// 				setShowOrHide(item, "", "", "", "toc-menu-popup");
						//				item.classList.remove('toc-menu-popup');
						// 				let icon = item.parentElement.querySelector('.toc-btn_icon');
						// 				if (icon !== null && icon === Object(icon)) {
						// 					if (icon.style.order === "2") {
						// 						icon.removeAttribute('style');
						// 					}
						// 				}
						// 			}
						// 		} else if (item.hasAttribute('class') && item.classList.contains('tooltip_finger_toggle-popup')) { // всплывающий(-е) эл.в топике
						// 			item.classList.remove('tooltip_finger_toggle-popup');
						// 			if (item.parentElement.hasAttribute('class') && item.parentElement.classList.contains('msg_icon-finger_toggle')) {
						// 				item.parentElement.classList.remove('msg_icon-finger_toggle-popup');
						// 			}
						// 		} else if (item.hasAttribute('class') && item.classList.contains('tooltip_lightswitch-show')) { // всплывающий(-е) эл.в топике
						// 			item.classList.remove('tooltip_lightswitch-show');
						// 		}
						// 	}
						// });
						// frm.document.removeEventListener('click', handlerPoPuPs, { capture: true }); // удаляем обработчик для всего док. // (i) { once: true } - для button-link не прокатывает и совместить нельзя с опцией capture (фаза всплытие - false/true - погружение)
					}
				}
			}
		}
	} else if (window.name === "ifrmtopic") { // (window === self || self !== top && window.name !== "") // 'еще вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
		if (typeof(eVent) === "undefined") {
			if (getBrowser().toString().toLowerCase() === "firefox") { // для firefox - скрытие вплывающих элементов, подсказок
				const tooltip = document.querySelectorAll('.msg-tooltip');
				if (tooltip.length > 0) {
					tooltip.forEach(item => {
						if (item !== null || typeof(item) !== "undefined" || item !== null && item === Object(item)) {
							if (item.hasAttribute('class') && item.classList.contains('tooltip-finger_toggle')) {
								item.classList.remove('tooltip_finger_toggle-popup');
								if (item.parentElement.hasAttribute('class') && item.parentElement.classList.contains('msg_icon-finger_toggle')) {
									item.parentElement.classList.remove('msg_icon-finger_toggle-popup');
								}
							} else if (item.hasAttribute('class') && item.classList.contains('tooltip-lightswitch')) {
								item.classList.remove('tooltip_lightswitch-show');
							}
						}
					});
				}
				if (document.documentElement.clientWidth < 501) {
					const footer = document.getElementById('idTopicFooter');
					if (footer !== null || typeof(footer) !== "undefined" || footer !== null && footer === Object(footer)) {
						footer.classList.remove('footer-max');
					}
				}
				document.removeEventListener('click', handlerPoPuPs, { capture: true }); // удаляем обработчик для всего док. // (i) { once: true } - для button-link не прокатывает и совместить нельзя с опцией capture (фаза всплытие - false/true - погружение)
			}
			const tocMenu = document.getElementById('idPageMenuToc'); // всплывающий(-е) эл.в текущем окне
			if (tocMenu !== null || typeof(tocMenu) !== "undefined" || tocMenu !== null && tocMenu === Object(tocMenu)) {
				if (tocMenu.classList.contains('toc-menu-popup')) {
					setMeHide(tocMenu); // скрытие эл.в текущем окне
				}
			}
		} else {
			if (getBrowser().toString().toLowerCase() === "firefox") { // для firefox - скрытие вплывающих элементов, подсказок
				if (eVent.target.id !== "idIconFingerToggle" && eVent.target.id !== "idIconLightSwitch" && (eVent.target.hasAttribute('class') && !eVent.target.classList.contains('lightswitch-ball')) || !eVent.target.hasAttribute('class')) { // чтобы click срабатывал на этих эл.в качестве переключателя
					const tooltip = document.querySelectorAll('.msg-tooltip');
					if (tooltip.length > 0) {
						tooltip.forEach(item => {
							if (item !== null || typeof(item) !== "undefined" || item !== null && item === Object(item)) {
								if (item.hasAttribute('class') && item.classList.contains('tooltip-finger_toggle')) {
									item.classList.remove('tooltip_finger_toggle-popup');
									if (item.parentElement.hasAttribute('class') && item.parentElement.classList.contains('msg_icon-finger_toggle')) {
										item.parentElement.classList.remove('msg_icon-finger_toggle-popup');
									}
								} else if (item.hasAttribute('class') && item.classList.contains('tooltip-lightswitch')) {
									item.classList.remove('tooltip_lightswitch-show');
								}
							}
						});
					}
				}
			}
			if (eVent.type === "message") {
				const tocMenu = document.getElementById(eVent.data.id); // всплывающий(-е) эл.в текущем окне
				if (tocMenu !== null || typeof(tocMenu) !== "undefined" || tocMenu !== null && tocMenu === Object(tocMenu)) {
					setMeHide(tocMenu); // скрытие эл.в текущем окне
				}
			} else if (eVent.type === "keyup") { // esc
				const tocMenu = document.getElementById('idPageMenuToc'); // всплывающий(-е) эл.в текущем окне
				if (tocMenu !== null || typeof(tocMenu) !== "undefined" || tocMenu !== null && tocMenu === Object(tocMenu)) {
					if (tocMenu.classList.contains('toc-menu-popup')) {
						setMeHide(tocMenu); // скрытие эл.в текущем окне
					}
				}
				document.removeEventListener('keyup', handlerPoPuPs, false); // удаляем обработчик для всего док.
				// *в др.окнах:
				// если стр.не открыта отдельным окном
				if (window === self || self !== top && window.name !== "") { // 'еще вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
					if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
						// let msg = { // x (?)
						// 	value: "handlerPoPuPs",
						// 	id: ["idPermalinkBox", "idTabsMenuBox"],
						// 	className: ["btn_icon-tooltip-popup"]
						// };
						window.top.postMessage('handlerPoPuPs', '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
						// перезаписываем значения массивов в объекте для окна ifrmnavigation // x (?)
						// msg.qSelector = ["[for=idTreeView]", "idTocList"]; // создаем/добавляем новое св-во в объекте
						// msg.className = ["footer_btn-tooltip-popup"];
						window.top.frames.ifrmnavigation.postMessage('handlerPoPuPs', '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
					} else {
						window.top.handlerPoPuPs(); // обработчик вплывающих эл.
						window.top.frames.ifrmnavigation.handlerPoPuPs(); // обработчик вплывающих эл.
						// x (?)
						// const frm = window.top.frames.ifrmnavigation.handlerPoPuPs(); // обработчик вплывающих эл.
						// let elems = [
						// 	window.top.document.getElementById('idPermalinkBox'),
						// 	window.top.document.querySelector('.btn_icon-tooltip-popup'),
						// 	window.top.document.getElementById('idTabsMenuBox'),
						// 	frm.contentDocument.querySelector('.[for=idTreeView]'),
						// 	frm.contentDocument.querySelector('.[for=idTocList]'),
						// 	frm.contentDocument.querySelector('.footer_btn-tooltip-popup')
						// ];
						// elems.forEach(item => {
						// 	if (item !== null && item === Object(item)) {
						// 		if (item.id === "idPermalinkBox") { // всплывающий(-е) эл.в гл.окне
						// 			window.top.setClearPermalink(); // очистить окно Постоянная ссылка
						// 			// setShowOrHide(item, "", "", "", "permalink-popup");
						// 			item.classList.remove('permalink-popup');
						// 			window.top.setEventHandlersPermalink(item, 'remove'); // создание/удаление обработчиков событий для узла permalink
						// 		} else if (item.hasAttribute('class') && item.classList.contains('btn_icon-tooltip-popup')) { // всплывающий(-е) эл.в гл.окне
						// 			item.classList.remove('btn_icon-tooltip-popup');
						// 			window.top.document.removeEventListener('click', handlerPoPuPs, { capture: true }); // удаляем обработчик для всего док. // (i) { once: true } - для button-link не прокатывает и совместить нельзя с опцией capture (фаза всплытие - false/true - погружение)
						// 		} else if (item.id === "idTabsMenuBox") { // всплывающий(-е) эл.в гл.окне
						// 			if (item.classList.contains('tabs-menu-popup')) {
						// 				// setShowOrHide(item, "", "", "", "tabs-menu-popup");
						//				item.classList.remove('tabs-menu-popup');
						// 			}
						// 		} else if (item.id === "idTreeView") { // всплывающий(-е) эл.в пан.нав.
						// 			item.removeAttribute('class');
						// 		} else if (item.id === "idTocList") { // всплывающий(-е) эл.в пан.нав.
						// 			item.removeAttribute('class');
						// 		} else if (item.hasAttribute('class') && item.classList.contains('footer_btn-tooltip-popup')) { // всплывающий(-е) эл.в пан.нав.
						// 			item.classList.remove('footer_btn-tooltip-popup');
						// 		}
						// 	}
						// });
						// frm.document.removeEventListener('click', handlerPoPuPs, { capture: true }); // удаляем обработчик для всего док. // (i) { once: true } - для button-link не прокатывает и совместить нельзя с опцией capture (фаза всплытие - false/true - погружение)
					}
				}
			} else if (eVent.type === "click") {
				// (!) допродумать про проникновение сюда по клику из гл.окна для скрытия только подсказок, т.к.в этом случае сюда он приходит НЕ как прослушиватель (eVent=undefined)

				if (document.documentElement.clientWidth < 501) {
					if (getBrowser().toString().toLowerCase() === "firefox") { // для firefox - скрытие вплывающих элементов, подсказок
						if (eVent.target.id !== "idTopicFooter") {
							const footer = document.getElementById('idTopicFooter');
							if (footer !== null || typeof(footer) !== "undefined" || footer !== null && footer === Object(footer)) {
								footer.classList.remove('footer-max');
							}
						}
					}
				}
				document.removeEventListener('click', handlerPoPuPs, { capture: true }); // удаляем обработчик для всего док. // (i) { once: true } - для button-link не прокатывает и совместить нельзя с опцией capture (фаза всплытие - false/true - погружение)
			}
		}
	}
}
// (!) установить отображение или скрытие
function setShowOrHide(elem, displayShowHide = "", classNameOn = "", classNameOff = "", classNameToggle = "") {
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк - не удалось установить переключение элементов - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setShowOrHide(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, displayShowHide: "${displayShowHide}", classNameOn = "${classNameOn}", classNameOff = "${classNameOff}", classNameToggle = "${classNameToggle}"): window.«${window.name}», location.origin: ${location.origin}`);
		alert(`(!) Косяк - не удалось установить переключение элементов - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	if (classNameOn === "" && classNameOff === "" && classNameToggle === "") {
		if (displayShowHide !== "show" && displayShowHide !== "hide") { // переключатель
			if (elem.style.display === "none") {
				// elem.removeAttribute('style'); // может удалить и др.стили
				elem.style.removeProperty('display');
			} else {
				elem.style.display = "none";
			}
			return true;
		} else {
			if (displayShowHide === "show") {
				elem.style.removeProperty('display');
			} else if (displayShowHide === "hide") {
				elem.style.display = "none";
			} else {
				console.error(`(!) Косяк - не удалось установить переключение элементов - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setShowOrHide(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, displayShowHide: "${displayShowHide}", classNameOn = "${classNameOn}", classNameOff = "${classNameOff}", classNameToggle = "${classNameToggle}): window.«${window.name}», location.origin: ${location.origin}`);
				alert(`(!) Косяк - не удалось установить переключение элементов - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
				return false;
			}
			return true;
		}
	} else {
		if (classNameToggle === "") {
			if (classNameOn !== "" && classNameOff !== "") {
				elem.classList.replace(classNameOn, classNameOff);
			} else { // если один из аргументов будет пустым
				if (classNameOn !== "" && classNameOff === "") {
					elem.classList.add(classNameOn);
				} else if (classNameOn === "" && classNameOff !== "") {
					elem.classList.remove(classNameOff);
				} else {
					console.error(`(!) Косяк - не удалось установить переключение элементов - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setShowOrHide(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, displayShowHide: "${displayShowHide}", classNameOn = "${classNameOn}", classNameOff = "${classNameOff}", classNameToggle = "${classNameToggle}): window.«${window.name}», location.origin: ${location.origin}`);
					alert(`(!) Косяк - не удалось установить переключение элементов - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
					return false;
				}
			}
		} else {
			elem.classList.toggle(classNameToggle);
		}
		return true;
	}
}
// (!) windowOpen - открытие в новом окне браузера
function windowOpen(htmlFileName = "", winProp = "") {
	if (typeof(htmlFileName) === "undefined" || htmlFileName !== String(htmlFileName) || typeof(htmlFileName) !== "string") {
		console.error(`(!) Косяк - не удалось выполнить открытие в новом окне браузера - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function windowOpen (htmlFileName: "${htmlFileName}", winProp: "${winProp}"): window.«${window.name}», location.origin: ${location.origin}`);
		alert(`(!) Косяк - не удалось выполнить открытие в новом окне браузера - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	if (typeof(winProp) === "undefined" || winProp !== String(winProp) || typeof(winProp) !== "string") {
		console.error(`(!) Косяк - не удалось выполнить открытие в новом окне браузера - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function windowOpen (htmlFileName: "${htmlFileName}", winProp: "${winProp}"): window.«${window.name}», location.origin: ${location.origin}`);
		alert(`(!) Косяк - не удалось выполнить открытие в новом окне браузера - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	// window.open("","","width=250,height=250"); // пример открытия пустого окна
	// // let windowProperties = 'toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=yes,width=900,height=700';
	// // let windowProperties = 'left=100,top=100,width=350,height=250,menubar=false,toolbar=false,location=false,resizabie=no,scrollbars=yes,status=false';
	if (htmlFileName === "") {
		htmlFileName = window.top.vrsTopic.currP;
	}
	window.open(htmlFileName, "", winProp);
}