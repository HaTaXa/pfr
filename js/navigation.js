// 'Инициализация переменных
let isCollapse = true; // - переменная для хранения условия в функции setGoToWithOptionDefault // (i) если вариант 1
// document.addEventListener("DOMContentLoaded", function () { // - js. Дожидаемся, когда Объектная модель документа страницы (DOM) будет готова к выполнению кода JavaScript
// }, false); // - false - фаза "всплытие"
// (!) *window
// window.addEventListener("load", function () { // - js. Сработает, как только вся страница (изображения или встроенные фреймы), а не только DOM, будет готово
// }, false); // - false - фаза "всплытие"
// (!) *document
$(document).ready(function () { // - jq
	if (document !== null && typeof (document) === "object") {
		// setListExpandCollapse(true); // 'если требуется, чтобы при старте все оглавление было сразу развернутым
		// (!) message
		window.addEventListener("message", (event) => {
			// console.log(`window.addEventListener("message", (event) window.name: ${window.name}):\n location.origin: "${location.origin}" <=> event.origin: "${event.origin}": ${location.origin === event.origin}\n event.origin === 0: ${event.origin === 0}\n event.data: ${JSON.stringify(event.data, null, 1)}`); // x -
			if (location.origin === "file://") {
				if (event.data.value === "goToPage" || event.data.value === "setVariables") {
					// (i) в Firefox не работает
					if (event.data.currP !== "") {
						let elem = document.getElementById('idToc-ul').querySelector('a[href="' + event.data.currP + '"]');
						if (elem !== null || typeof (elem) !== "undefined" || typeof (elem) === "object" || elem === Object(elem)) {
							if (event.data.value === "goToPage") {
								let isKey = false;
								for (const key in event.data) {
									if (key === "collapse") {
										isKey = true;
										break;
									}
								}
								if (isKey) {
									goToPage(elem, event.data.currP, event.data.collapse); // - перейти на страницу
								} else {
									goToPage(elem, event.data.currP); // - перейти на страницу
								}
							} else if (event.data.value === "setVariables") {
								setVariables(elem, event.data.currP); // - обновление глобальных переменных в variables.js
							}
						}
					}
				} else if (event.data.value === "setCollapse") { // (i) если вариант 1
					isCollapse = event.data.collapse;
				}
			}
		}, false); // false - фаза "всплытие"
		// (!) click
		document.addEventListener("click", function (e) {
			if (window.name === "hmnavigation") { // 'вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
				// *показать/скрыть всплывающее окно Постоянная ссылка в пан.интсрументов/Меню вкладок в пан.тема топика
				if (window.location.origin === "file://") { // - при локальном использовании
					// (i) в Firefox не работает
					let msg = {
						value: "setShowHideWindow",
						winId: ["idPermalinkBox", "idTabsMenuBox", "idPageMenuToc"],
						winHide: "hide"
					};
					window.top.postMessage(msg, '*'); // (?) когда звездочка - это плохое использование в целях безопасности от взлома страниц
				} else {
					let elems = [
						window.top.document.getElementById('idPermalinkBox'),
						window.top.document.getElementById('idTabsMenuBox'),
						window.top.frames.hmcontent.document.getElementById('idPageMenuToc')
					];
					elems.forEach(item => {
						if (item.style.display !== "none") {
							if (item.id === "idPermalinkBox") { window.top.clearPermalink(); } // - очищение инфо-подсказок при закрытии окна Постоянная ссылка
							setShowHideWindow(item, 'hide');
						}
					});
				}
			}
			// '
			if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
				if (e.target.id === "idTocListMenuSwitch") {
					navigationListToggle(e.target); // - переключатель развернуть/свернуть все оглавление
				}
			} else if (e.target.tagName === "SPAN") {
				if (e.target.parentElement.tagName === "A") {
					isCollapse = true; // (i) если вариант 1
					if (window === top && window.name === "") {
						goToPage(e.target.parentElement, e.target.parentElement.getAttribute('href')); // - перейти на страницу
					} else {
						if (window.name === "hmnavigation") { // 'вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
							if (location.origin === "file://") {
								let msg = {
									value: "setHistoryPushState",
									currP: e.target.parentElement.getAttribute('href'),
									winName: window.name
								};
								window.top.postMessage(msg, '*'); // (?) когда звездочка - это плохое использование в целях безопасности от взлома страниц
							} else {
								window.top.setHistoryPushState(e.target.parentElement.getAttribute('href')); // сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
								// *проверяем размер окна браузера для определения запуска анимации скрытия пан.нав., если она занимает весь экран
								if (window.top.document.documentElement.clientWidth < 501) {
									window.top.setHideNavPane(); // - скрыть пан.нав.
								}
							}
							// (i) если вариант 2 - при очень интенсивных кликах браузер может не успевать и будет срабатывать ошибка
							// setTimeout(() => { // - без задержки стр.загружается с опозданием
							// 	goToPage(e.target.parentElement); // - перейти на страницу
							// }, 1000); // 'если вариант 2
						} else {
							console.error(`(!) Косяк - не удалось установить имя текущего окна:\n window.«${window.name}», location.origin: ${location.origin}`);
							alert(`(!) Косяк - не удалось установить имя текущего окна, см.консоль.`);
						}
					}
				}
			}
		}, false); // false - фаза "всплытие"
	}
}); // ready end
// (!) setCollapse - обновление глобальной переменной для кнопок Домой/Назад/Вперед в пан.инструментов и при переходах по списку оглавления в пан.нав., см.в функции goToPage переменную аргумента функции setGoToWithOptionDefault
function setCollapse (value = true) { isCollapse = value; } // (i) если вариант 1
// (!) setListExpandCollapse - развернуть/свернуть все оглавление
function setListExpandCollapse (value) {
	// let ulFirstLevel = document.querySelector('ul:first-child'); // - ul самый 1-ый родитель - предок всех потомков
	// let list = document.querySelectorAll('ul:not(:first-child)'); // - ul все предки, кроме 1-го
	let list = document.querySelectorAll('ul'); // - ul все предки
	if (list !== null && typeof(list) === "object") {
		if (value) { // - expand - развернуть все оглавление
			for (let ul of list) {
				if (ul.hasAttribute('class')) {
					if (ul.classList.contains('icon-expand')) {
						ul.classList.remove('icon-expand');
						ul.classList.add('icon-collapse');
					}
				}
				if (ul.style.display === "none") { ul.removeAttribute('style'); }
			}
		} else { // - collapse - свернуть все оглавление
			for (let ul of list) {
				if (ul.hasAttribute('class')) {
					if (ul.classList.contains('icon-collapse')) {
						ul.classList.remove('icon-collapse');
						ul.classList.add('icon-expand');
					}
				}
				if (ul.id !== "idToc-ul") {
					if (ul.style.display !== "none") { ul.style.display = "none"; }
				}
			}
		}
	}
	setSwitchTocIcon(document.querySelectorAll('li.toc-list'), value); // - переключение иконки в оглавлении
}
// (!) navigationListToggle - переключатель развернуть/свернуть все оглавление
function navigationListToggle (elem) {
	let idNavIcon = document.getElementById('idNavIcon');
	setListExpandCollapse(elem.checked); // - true - развернуть/свернуть - false, все оглавление
	if (idNavIcon.classList.contains('btn-icon')) { // - замена первоначальной иконки на иконки-переключатели
		idNavIcon.classList.replace('btn-icon', 'btn-icon-toggle');
		// idNavIcon.classList.remove('btn-icon');
		// idNavIcon.classList.add('btn-icon-toggle');
	}
}
// (!) setHighlightsOnElement - установка подсветки на выбранном элементе
function setHighlightsOnElement (elem) {
	// *проверяем наличие подсвечиваемого элемента
	let e = document.getElementById('idToc-ul').getElementsByClassName('hilight');
	if (e.length > 0) { // - проверяем длинну, а не наличие объекта, если объект "idToc-ul" содержит элемент(-ы) с классом "hilight"
		for (let i = 0; i < e.length; i++) {
			if (e[i].id !== elem.id) { // - если не одна и та же страница
				e[i].classList.remove('hilight');
			}
		}
	}
	elem.classList.add('hilight');
}
// (!) setStatusTocListMenuSwitch - изменение состояния кнопки-переключателя развернуть/свернуть все оглавлениеи при переходах по страницам
function setStatusTocListMenuSwitch () {
	let inputCheckboxNode = document.getElementById('idTocListMenuSwitch');
	let toc = document.getElementById('idToc-ul');
	if (toc.classList.contains('icon-collapse')) {
		inputCheckboxNode.checked = true;
	} else if (toc.classList.contains('icon-expand')) {
		inputCheckboxNode.checked = false;
	}
}
// (!) setSwitchTocIcon - переключение иконки в оглавлении
function setSwitchTocIcon(elem, value = true) {
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось выполнить изменение иконки переключателя - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setSwitchTocIcon(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, value = ${value})`);
		alert(`(!) Косяк: не удалось выполнить изменение иконки переключателя - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	if (elem.length > 0) { // (!) нужна проверка, что список может быть NodeList, а не HTMLObject
		if (value) { // - expand - развернуть все оглавление
			for (let li of elem) {
				if (li.hasAttribute('class')) {
					if (li.classList.contains('icon-book-purple1-close')) {
						li.classList.replace('icon-book-purple1-close', 'icon-book-purple1-open');
					} else if (li.classList.contains('icon-book-purple2-close')) {
						li.classList.replace('icon-book-purple2-close', 'icon-book-purple2-open');
					} else if (li.classList.contains('icon-book-blue-close')) {
						li.classList.replace('icon-book-blue-close', 'icon-book-blue-open');
					} else if (li.classList.contains('icon-book-orange-close')) {
						li.classList.replace('icon-book-orange-close', 'icon-book-orange-open');
					} else if (li.classList.contains('icon-folder1-close')) {
						li.classList.replace('icon-folder1-close', 'icon-folder1-open');
					} else if (li.classList.contains('icon-folder2-close')) {
						li.classList.replace('icon-folder-close2', 'icon-folder2-open');
					}
				}
			}
		} else { // - collapse - свернуть все оглавление
			for (let li of elem) {
				if (li.hasAttribute('class')) {
					if (li.classList.contains('icon-book-purple1-open')) {
						li.classList.replace('icon-book-purple1-open', 'icon-book-purple1-close');
					} else if (li.classList.contains('icon-book-purple2-open')) {
						li.classList.replace('icon-book-purple2-open', 'icon-book-purple2-close');
					} else if (li.classList.contains('icon-book-blue-open')) {
						li.classList.replace('icon-book-blue-open', 'icon-book-blue-close');
					} else if (li.classList.contains('icon-book-orange-open')) {
						li.classList.replace('icon-book-orange-open', 'icon-book-orange-close');
					} else if (li.classList.contains('icon-folder1-open')) {
						li.classList.replace('icon-folder1-open', 'icon-folder1-close');
					} else if (li.classList.contains('icon-folder2-open')) {
						li.classList.replace('icon-folder2-open', 'icon-folder2-close');
					}
				}
			}
		}
	} else {
		if (elem.hasAttribute('class')) {
			if (value) { // - expand - развернуть все оглавление
				if (elem.classList.contains('icon-book-purple1-close')) {
					elem.classList.replace('icon-book-purple1-close', 'icon-book-purple1-open');
				} else if (elem.classList.contains('icon-book-purple2-close')) {
					elem.classList.replace('icon-book-purple2-close', 'icon-book-purple2-open');
				} else if (elem.classList.contains('icon-book-blue-close')) {
					elem.classList.replace('icon-book-blue-close', 'icon-book-blue-open');
				} else if (elem.classList.contains('icon-book-orange-close')) {
					elem.classList.replace('icon-book-orange-close', 'icon-book-orange-open');
				} else if (elem.classList.contains('icon-folder1-close')) {
					elem.classList.replace('icon-folder1-close', 'icon-folder1-open');
				} else if (elem.classList.contains('icon-folder2-close')) {
					elem.classList.replace('icon-folder2-close', 'icon-folder2-open');
				}
			} else { // - collapse - свернуть все оглавление
				if (elem.hasAttribute('class')) {
					if (elem.classList.contains('icon-book-purple1-open')) {
						elem.classList.replace('icon-book-purple1-open', 'icon-book-purple1-close');
					} else if (elem.classList.contains('icon-book-purple2-open')) {
						elem.classList.replace('icon-book-purple2-open', 'icon-book-purple2-close');
					} else if (elem.classList.contains('icon-book-blue-open')) {
						elem.classList.replace('icon-book-blue-open', 'icon-book-blue-close');
					} else if (elem.classList.contains('icon-book-orange-open')) {
						elem.classList.replace('icon-book-orange-open', 'icon-book-orange-close');
					} else if (elem.classList.contains('icon-folder1-open')) {
						elem.classList.replace('icon-folder1-open', 'icon-folder1-close');
					} else if (elem.classList.contains('icon-folder2-open')) {
						elem.classList.replace('icon-folder2-open', 'icon-folder2-close');
					}
				}
			}
		}
	}
}
// (!) setGoToWithOptionCurrent - переход на страницу - опция древовидный вид списка в режиме "Текущий пункт":
// (i) в древовидном виде списка будет скрытие всех разделов/подразделов, кроме выбранного пункта оглавления
// *jq/jQuery
// x не используется, см.функцию setGoToWithOptionCurrent
function setTreeViewListCurrent (elem) {
	if (elem.tagName !== "SPAN") return; // 'если кликнули вне тега span
	// 'предки - родительские узлы элементов:
	// x let ulAllParents = document.querySelectorAll('ul'); // - ul узлы всех предков
	let ulParents = $(elem).parents('ul'); // - все родительские узлы по селектору, вложенные по цепочке в верх
	let ulParent = $(elem).parents().eq(2); // - текущий узел предка - ul, на кот.кликнули
	// 'потомки - дети:
	// let ulChildren = $(elem).parents('li').eq(0).children(); // - все узлы потомков по селектору предка li, внутри кот.находятся: а-шка и вложенные ul-ки
	// let ulChildren = $(elem).parents('li').children('ul'); // - все узлы потомков по селектору по цепочке в верх
	// 'узлы потомков по селектору:
	// let ulChildren = $(elem).parents('li').eq(0).children('ul'); // - вариант 1. Смотрим потомков через селектор li предка
	let ulChildren = $(elem).parents().eq(1).children('ul'); // - вариант 2
	if (ulChildren.length === 0) { // - если вложенных детей ul нет, проверяем наличие ul среди детей li текущего предка
		ulChildren = $(ulParent).children('ul');
		// X let ulChildrensChildren = $(ulChildren).children().children('ul'); // в противном случае вернет "0" вместо "undefined"
	}
	// 'потомки текущего потомка - вложенность цепочки во внутрь
	let ulChildrensChildren = $(ulChildren).children('ul'); // в противном случае вернет "0" вместо "undefined"
	/*
	(!) Соседи:
	(i) набор всех соседних узлов (тех, которые имеют того же родителя что и текущий) по селектору, вложенных по цепочке в верх */
	let ulSiblings = $(elem).parents('ul').siblings('ul'); // - в противном случае вернет "0" вместо "undefined"
	// *запоминаем имя текущего класса предка для переключения возможности скрыть/показать текущий пункт списка оглавления
	let className;
	for (let i = 0; i < ulParent[0].classList.length; i++) {
		if ((ulParent[0].classList[i] === "icon-expand") || (ulParent[0].classList[i] === "icon-collapse")) {
			className = ulParent[0].classList[i];
			break;
		}
	} // 'запоминаем имя текущего класса предка для переключения возможности скрыть/показать текущий пункт списка оглавления
	setHighlightsOnElement(elem.parentElement); // - устанавливаем подсветку на выбранном элементе
	setListExpandCollapse(false); // - сворачиваем все оглавление
	// *Отображаем все соседние узлы, вложенные по цепочке в верх
	if (ulSiblings.length > 0) {
		for (let i = 0; i < ulSiblings.length; i++) {
			if ($(ulSiblings[i]).css(`display`) === "none") {
				$(ulSiblings[i]).removeAttr('style');
			}
		}
	}
	// *Отображаем всех потомков текущего потомка
	if (ulChildrensChildren.length > 0) {
		for (let i = 0; i < ulChildrensChildren.length; i++) {
			if ($(ulChildrensChildren[i]).css(`display`) === "none") {
				$(ulChildrensChildren[i]).removeAttr('style');
			}
		}
	}
	// *Отображаем/скрываем всех потомков
	if (ulChildren.length > 0) {
		if (className === "icon-collapse") {
			for (let i = 0; i < ulChildren.length; i++) {
				if ($(ulChildren[i]).css(`display`) !== "none") {
					$(ulChildren).attr(`display`, `none`);
				}
			}
		} else {
			for (let i = 0; i < ulChildren.length; i++) {
				if ($(ulChildren[i]).css(`display`) === "none") {
					$(ulChildren[i]).removeAttr('style');
				}
			}
		}
	}
	// *Отображаем все родительские узлы, вложенные по цепочке в верх с учетом текущего родителя, для кот.предусмотрена возможность скрывать/отображать список
	for (let i = 0; i < ulParents.length; i++) {
		if ($(ulParents[i]).css(`display`) === "none") {
			$(ulParents[i]).removeAttr('style');
		}
		if (ulParents[i].id === ulParent[0].id) {
			// *проверяем наличие атрибута "класс"
			if (($(ulParents[i]).attr('class') !== false) || (typeof($(ulParents[i]).attr('class')) !== "undefined")) {
				if (className === "icon-collapse") {
					if ($(ulParents[i]).hasClass('icon-collapse')) {
						$(ulParents[i]).removeClass('icon-collapse');
						$(ulParents[i]).addClass('icon-expand');
					}
				} else {
					if ($(ulParents[i]).hasClass('icon-expand')) {
						$(ulParents[i]).removeClass('icon-expand');
						$(ulParents[i]).addClass('icon-collapse');
					}
				}
			}
		} else {
			if ($(ulParents[i]).hasClass('icon-expand')) {
				$(ulParents[i]).removeClass('icon-expand');
				$(ulParents[i]).addClass('icon-collapse');
			}
		}
	}
}
function setGoToWithOptionCurrent (elem) {
	setListExpandCollapse(false); // - сворачиваем все оглавление
	setHighlightsOnElement(elem); // - устанавливаем подсветку на выбранном элементе
	// *первоначально проникаем внутрь
	e = elem.parentElement; // - li
	for (let i = 0; i < e.children.length; i++) {
		if (e.children[i].tagName === "UL") {
			for (let k = 0; k < e.children[i].children.length; k++) {
				if (e.children[i].children[k].style.display === "none") {
					e.children[i].children[k].removeAttribute('style');
				}
			}
			if (e.children[i].style.display === "none") {
				e.children[i].removeAttribute('style');
			}
		}
	}
	// *переключаем иконку
	if (e.hasAttribute('class')) {
		if (e.classList.contains('toc-list')) {
			setSwitchTocIcon(e, true); // - переключение иконки в оглавлении
		}
	}
	// *поднимаемся на верх до самой последней ul
	while (e.id !== "idToc-ul") {
		while (e.tagName !== "UL") {
			e = e.parentElement;
		}
		if (e.id === "idToc-ul") {
			if (e.classList.contains('icon-expand')) {
				e.classList.replace('icon-expand', 'icon-collapse');
				setStatusTocListMenuSwitch(); // - меняем состояние кнопки-переключателя развернуть/свернуть все оглавление
				// return;
			}
		} else {
			if (e.hasAttribute('class')) {
				if (e.classList.contains('icon-expand')) {
					e.classList.replace('icon-expand', 'icon-collapse');
					// *переключаем иконку
					if (e.firstElementChild.classList.contains('toc-list')) {
						setSwitchTocIcon(e.firstElementChild, true); // - переключение иконки в оглавлении
					}
				}
				for (let i = 0; i < e.parentElement.children.length; i++) {
					if (e.parentElement.children[i].tagName === "UL") {
						if (e.parentElement.children[i].style.display === "none") {
							e.parentElement.children[i].removeAttribute('style');
						}
					}
				}
			} else {
				for (let i = 0; i < e.children.length; i++) {
					if (e.children[i].tagName === "UL") {
						if (e.children[i].style.display === "none") {
							e.children[i].removeAttribute('style');
						}
					}
				}
			}
			if (e.style.display === "none") {
				e.removeAttribute('style');
			}
			e = e.parentElement;
		}
	}
}
// (!) setGoToWithOptionDefault - переход на страницу - опция древовидный вид списка в режиме "По умолчанию":
// (i) в древовидном виде списка скрытие/отображение будет применительно ко всем пунктам оглавления
// *jq/jQuery
// x не используется, см.функцию setGoToWithOptionDefault
function setTreeViewListDefault (elem) {
	if (elem.tagName !== "SPAN") return; // 'если кликнули вне тега span
	// 'предки - родительские узлы элементов:
	// let ulParents = $(elem).parents('ul'); // - все родительские узлы по селектору, вложенные по цепочке в верх
	let ulParent = $(elem).parents().eq(2); // - текущий узел предка - ul, на кот.кликнули
	// 'потомки - дети:
	// let ulChildren = $(elem).parents('li').eq(0).children(); // - все узлы потомков по селектору предка li, внутри кот.находятся: а-шка и вложенные ul-ки
	// let ulChildren = $(elem).parents('li').children('ul'); // - узлы потомков по селектору по цепочке в верх
	// 'узлы потомков по селектору:
	// let ulChildren = $(elem).parents('li').eq(0).children('ul'); // - вариант 1. Смотрим потомков через селектор li предка
	let ulChildren = $(elem).parents().eq(1).children('ul'); // - вариант 2
	// let ulChildren = $(ulParent[0]).children('li').children('ul'); // - вариант 3
	// 'потомки текущего потомка - вложенность цепочки во внутрь
	let ulChildrensChildren = $(ulChildren).children('ul');
	if (ulChildren.length === 0) return; // 'короткая запись if, если нет вложенных детей
	setHighlightsOnElement(elem.parentElement); // - устанавливаем подсветку на выбраном элементе
	// *если есть атрибут "класс" меняем иконку «+/-» текущего предка и отображаем/скрываем: потомков и потомков от потомков
	if (($(ulParent).attr('class') !== false) || (typeof($(ulParent).attr('class')) !== "undefined")) {
		if ($(ulParent).hasClass('icon-expand')) {
			for (let i = 0; i < ulChildren.length; i++) {
				if ($(ulChildren[i]).css(`display`) === "none") {
					$(ulChildren[i]).removeAttr('style'); // - отображаем
				}
			}
			if (ulChildrensChildren.length > 0) {
				for (let i = 0; i < ulChildrensChildren.length; i++) {
					if ($(ulChildrensChildren[i]).css(`display`) === "none") {
						$(ulChildrensChildren[i]).removeAttr('style'); // - отображаем
					}
				}
			}
			$(ulParent).removeClass('icon-expand');
			$(ulParent).addClass('icon-collapse');
		}
		else if ($(ulParent).hasClass('icon-collapse')) {
			for (let i = 0; i < ulChildren.length; i++) {
				$(ulChildren[i]).css('display', 'none'); // - скрываем
			}
			if (ulChildrensChildren.length > 0) {
				for (let i = 0; i < ulChildrensChildren.length; i++) {
					$(ulChildrensChildren[i]).css('display', 'none'); // - скрываем
				}
			}
			$(ulParent).removeClass('icon-collapse');
			$(ulParent).addClass('icon-expand');
		}
	} else {
		for (let i = 0; i < ulChildren.length; i++) {
			if ($(ulChildren[i]).css(`display`) === "none") {
				$(ulChildren[i]).removeAttr('style'); // - отображаем
			} else {
				$(ulChildren[i]).css('display', 'none'); // - скрываем
			}
		}
		if (ulChildrensChildren.length > 0) {
			for (let i = 0; i < ulChildrensChildren.length; i++) {
				if ($(ulChildrensChildren[i]).css(`display`) === "none") {
					$(ulChildrensChildren[i]).removeAttr('style'); // - отображаем
				} else {
					$(ulChildrensChildren[i]).css('display', 'none'); // - скрываем
				}
			}
		}
	}
}
function setGoToWithOptionDefault (elem, collapse = true) {
	setHighlightsOnElement(elem); // - устанавливаем подсветку на выбранном элементе
	e = elem.parentElement; // - li
	// *переключаем иконку
	if (e.hasAttribute('class')) {
		if (e.classList.contains('toc-list')) {
			setSwitchTocIcon(e, true); // - переключение иконки в оглавлении
		}
	}
	if (collapse) {
		if (e.parentElement.hasAttribute('class')) { // - ul
			if (e.parentElement.classList.contains('icon-expand')) {
				e.parentElement.classList.replace('icon-expand', 'icon-collapse');
				for (let i = 0; i < e.children.length; i++) {
					if (e.children[i].tagName === "UL") {
						for (let k = 0; k < e.children[i].children.length; k++) {
							if (e.children[i].children[k].style.display === "none") {
								e.children[i].children[k].removeAttribute('style');
							}
						}
						if (e.children[i].style.display === "none") {
							e.children[i].removeAttribute('style');
						}
					}
				}
				// *переключаем иконку
				if (e.hasAttribute('class')) {
					if (e.classList.contains('toc-list')) {
						setSwitchTocIcon(e, true); // - переключение иконки в оглавлении
					}
				}
			} else if (e.parentElement.classList.contains('icon-collapse')) {
				e.parentElement.classList.replace('icon-collapse', 'icon-expand');
				for (let i = 0; i < e.children.length; i++) {
					if (e.children[i].tagName === "UL") {
						if (e.children[i].style.display !== "none") {
							e.children[i].style.display = "none";
						}
					}
				}
				// *переключаем иконку
				if (e.hasAttribute('class')) {
					if (e.classList.contains('toc-list')) {
						setSwitchTocIcon(e, false); // - переключение иконки в оглавлении
					}
				}
			}
		}
	} else {
		if (e.parentElement.hasAttribute('class')) { // - ul
			if (e.parentElement.classList.contains('icon-expand')) {
				e.parentElement.classList.replace('icon-expand', 'icon-collapse');
				for (let i = 0; i < e.children.length; i++) {
					if (e.children[i].tagName === "UL") {
						for (let k = 0; k < e.children[i].children.length; k++) {
							if (e.children[i].children[k].style.display === "none") {
								e.children[i].children[k].removeAttribute('style');
							}
						}
						if (e.children[i].style.display === "none") {
							e.children[i].removeAttribute('style');
						}
					}
				}
			}
		}
		// *поднимаемся на верх до самой последней ul
		while (e.id !== "idToc-ul") {
			while (e.tagName !== "UL") {
			e = e.parentElement;
			}
			if (e.id === "idToc-ul") {
				if (e.classList.contains('icon-expand')) {
					e.classList.replace('icon-expand', 'icon-collapse');
				}
			} else {
				if (e.hasAttribute('class')) {
					if (e.classList.contains('icon-expand')) {
						e.classList.replace('icon-expand', 'icon-collapse');
					}
					for (let i = 0; i < e.parentElement.children.length; i++) {
						if (e.parentElement.children[i].tagName === "UL") {
							if (e.parentElement.children[i].style.display === "none") {
								e.parentElement.children[i].removeAttribute('style');
							}
						}
					}
				} else {
					for (let i = 0; i < e.children.length; i++) {
						if (e.children[i].tagName === "UL") {
							if (e.children[i].style.display === "none") {
								e.children[i].removeAttribute('style');
							}
						}
					}
				}
				if (e.style.display === "none") {
					e.removeAttribute('style');
				}
				e = e.parentElement;
			}
		}
	}
	setStatusTocListMenuSwitch(); // - меняем состояние кнопки-переключателя развернуть/свернуть все оглавление
}
// (!) getPageHome - получение ссылки на страницу текущего раздела/подраздела
function getPageHome (elem) {
	let e = elem;
	while (e.tagName !== "UL") {
		e = e.parentElement;
	}
	if (e.id === "idToc-ul") {
		while (e.tagName !== "A") {
			if (e.tagName === "IMG") { // TODO: перепродумать, если +/- будет отдельной иконкой
				if (e.nextElementSibling !== null && typeof (e.nextElementSibling) === "object" || e.nextElementSibling === Object(e.nextElementSibling)) {
					e = e.nextElementSibling;
				}
			}
			e = e.firstElementChild;
		}
		return e.getAttribute('href');
	} else {
		e = e.parentElement;
		if (e.tagName === "UL") {
			if (e.previousElementSibling !== null && typeof (e.previousElementSibling) === "object") {
				if (e.previousElementSibling.tagName === "A") {
					return e.previousElementSibling.getAttribute('href');
				}
			}
		} else if (e.tagName === "LI") {
			while (e.tagName !== "A") {
				e = e.firstElementChild;
			}
			return e.getAttribute('href');
		}
	}
	// x старый вариант
	// if (elem.parentElement.id === "idToc-a") {
	// 	return elem.parentElement.getAttribute('href');
	// } else {
	// 	let ulParent = $(elem).parents('ul').eq(1); // узел родителя от предка текущего элемента - ul>ul>span, на кот.кликнули
	// 	// проверяем наличие атрибута "класс", если он отсутствует, поднимаемся еще на одного предка по цепочке в верх
	// 	if ($(ulParent).attr('class') === false || typeof($(ulParent).attr('class')) === "undefined") {
	// 		ulParent = $(elem).parents('ul').eq(2); // родительский узел от родителя от предка текущего элемента - ul>ul>ul>span, на кот.кликнули
	// 	}
	// 	return $(ulParent).children('li').children('a').attr('href');
	// }
}
// (!) getPagePrevious - рекурсия - получение ссылки на предыдущую страницу
function getPagePrevious (elem) {
	let href = "";
	if (elem.id === "idToc-a") {
		return href;
		// // return elem.getAttribute('href');
		// // *будет ходить в списке по кругу
		// if (elem.id === "idToc-ul") {
		// 	let eChild = elem.lastElementChild;
		// 	while (eChild.tagName !== "A") {
		// 		eChild = eChild.lastElementChild;
		// 	}
		// 	href = eChild.getAttribute('href');
		// 	if (href.slice(-4) === ".htm" || href.slice(-5) === ".html") {
		// 		return href;
		// 	} else {
		// 		getPagePrevious(eChild.parentElement);
		// 	}
		// }
	} else {
		if (elem.previousElementSibling !== null && typeof(elem.previousElementSibling) === "object") {
			let e = elem.previousElementSibling;
			if (e.tagName === "A") {
				href = e.getAttribute('href');
			} else {
				while (e.tagName !== "A") {
					if (e.tagName === "IMG") { // TODO: перепродумать, если +/- будет отдельной иконкой
						if (e.nextElementSibling !== null && typeof(e.nextElementSibling) === "object" || e.nextElementSibling === Object(e.nextElementSibling)) {
							e = e.nextElementSibling;
						}
					}
					e = e.lastElementChild;
				}
				href = e.getAttribute('href');
			}
			if (href.slice(-4) === ".htm" || href.slice(-5) === ".html") {
				return href;
			} else {
				return getPagePrevious(e.parentElement);
			}
		} else {
			return getPagePrevious(elem.parentElement);
		}
	}
}
// (!) getPageNext - рекурсия - получение ссылки на следующую страницу
function getPageNext (elem) {
	let href = "";
	if (elem.id === "idToc-ul") {
		return href;
		// // *будет ходить в списке по кругу
		// let eChild = elem.firstElementChild;
		// while (eChild.tagName !== "A") {
		// 	eChild = eChild.firstElementChild;
		// }
		// href = eChild.getAttribute('href');
		// if (href.slice(-4) === ".htm" || href.slice(-5) === ".html") {
		// 	return href;
		// } else {
		// 	getPageNext(eChild.parentElement);
		// }
	} else {
		if (elem.nextElementSibling !== null && typeof (elem.nextElementSibling) === "object") {
			let e = elem.nextElementSibling;
			while (e.tagName !== "A") {
				if (e.tagName === "IMG") { // TODO: перепродумать, если +/- будет отдельной иконкой
					if (e.nextElementSibling !== null && typeof (e.nextElementSibling) === "object" || e.nextElementSibling === Object(e.nextElementSibling)) {
						e = e.nextElementSibling;
					}
				}
				e = e.firstElementChild;
			}
			href = e.getAttribute('href');
			if (href.slice(-4) === ".htm" || href.slice(-5) === ".html") {
				return href;
			} else {
				return getPageNext(e.parentElement);
			}
		} else {
			return getPageNext(elem.parentElement);
		}
	}
}
// (!) getBreadCrumbs - рекурсия - получение навигационных ссылок
function getBreadCrumbs (elem) {
	let e = elem;
	let breadCrumbs = [];
	while (e.tagName !== "UL") {
		e = e.parentElement;
	}
	if (e.id === "idToc-ul") {
		return breadCrumbs;
	} else {
		let arr = [];
		while (e.id !== "idToc-ul") {
			e = e.parentElement;
			if (e.tagName === "UL") {
				if (e.hasAttribute('class')) {
					let eChild = e;
					while (eChild.tagName !== "SPAN") {
						if (eChild.tagName === "IMG") { // TODO: перепродумать, если +/- будет отдельной иконкой
							if (eChild.nextElementSibling !== null && typeof (eChild.nextElementSibling) === "object" || eChild.nextElementSibling === Object(eChild.nextElementSibling)) {
								eChild = eChild.nextElementSibling;
							}
						}
						if (eChild.tagName === "A") {
							arr.push(eChild.getAttribute('href'));
						}
						eChild = eChild.firstElementChild;
					}
					arr.push(eChild.textContent); // 'заполняем массив добавлением в конец
					// breadCrumbs.push(arr); // (i) если изменено условие в ф.writeBreadCrumbs()
					breadCrumbs.unshift(arr); // 'заполняем массив добавлением в начало
					arr = [];
				}
			}
		}
		return breadCrumbs;
	}
}
// (!) getVariables - получение данных для обновления глобальных переменных в variables.js
function getVariables (elem, currP = "") {
	if (elem === null || typeof (elem) === "undefined" || typeof (elem) !== "object" || elem !== Object(elem)) { // 'не объект/не объект HTMLlinkElement
		if (currP !== null && typeof (currP) !== "undefined" && typeof (currP) === "string" && currP !== "") {
			elem = document.getElementById('idTocBody').querySelector('a[href="' + currP + '"]');
		} else { // - стремимся все равно получить текущий элемент и/или его значение
			if (window.location.origin === "file://") { // - при локальном использовании
				console.error(`(!) Косяк - не удалось получить глобальные переменные:\n function getVariables (elem: ${typeof (elem)} / ${elem}, currP = "${currP}"):\n 1) isEmptyObject(${isEmptyObject(elem)})\n 2) elem === null: ${elem === null}`);
				alert(`(!) Косяк - не удалось получить глобальные переменные, см.консоль.`);
				return;
			} else {
				if (window.top.location.search !== "") {
					currP = window.top.location.search.substring(1).replace(/:/g, "");
					elem = document.getElementById('idTocBody').querySelector('a[href="' + currP + '"]');
				} else {
					console.error(`(!) Косяк - не удалось получить глобальные переменные:\n function getVariables (elem: ${typeof (elem)} / ${elem}, currP = "${currP}"):\n 1) isEmptyObject(${isEmptyObject(elem)})\n 2) elem === null: ${elem === null}`);
					alert(`(!) Косяк - не удалось получить глобальные переменные, см.консоль.`);
					return;
				}
			}
		}
	}
	let homeP = getPageHome(elem);
	if (currP === "") {
		currP = elem.getAttribute('href');
	}
	let toc = location.href.slice(location.href.lastIndexOf("/") + 1);
	let url = location.href.replace(toc, "index.html") + "?" + currP;
	return {
		hmtopicvars: {
			homeP: homeP,
			prevP: getPagePrevious(elem),
			nextP: getPageNext(elem),
			currP: currP,
			titleP: elem.innerText,
		},
		hmnavpages: {
			top: homeP,
			def: currP,
			query: currP,
			breadCrumbs: getBreadCrumbs(elem),
		},
		hmpermalink: { url: url },
	};
}
// (!) setVariables - обновление глобальных переменных в variables.js
function setVariables (elem, currP = "") {
	if (elem === null || typeof (elem) === "undefined" || typeof (elem) !== "object" || elem !== Object(elem)) { // 'не объект/не объект HTMLlinkElement
		if (currP !== null && typeof (currP) !== "undefined" && typeof (currP) === "string" && currP !== "") {
			elem = document.getElementById('idTocBody').querySelector('a[href="' + currP + '"]');
			if (elem === null) {
				let arr = Array.prototype.slice.call(document.getElementById('idTocBody').querySelectorAll('a[href="' + currP + '"]'));
				if (arr.length === 1) {
					elem = arr[0];
				} else {
					console.error(`(!) Косяк - не удалось установить глобальные переменные:\n function setVariables (elem: ${typeof (elem)} / ${elem}, currP = "${currP}"):\n 1) isEmptyObject(${isEmptyObject(elem)})\n 2) elem === null: ${elem === null}`);
					alert(`(!) Косяк - не удалось установить глобальные переменные, см.консоль.`);
					return;
				}
			}
		} else { // - стремимся все равно получить текущий элемент и/или его значение
			if (window.location.origin === "file://") { // - при локальном использовании
				console.error(`(!) Косяк - не удалось установить глобальные переменные:\n function setVariables (elem: ${typeof (elem)} / ${elem}, currP = "${currP}"):\n 1) isEmptyObject(${isEmptyObject(elem)})\n 2) elem === null: ${elem === null}`);
				alert(`(!) Косяк - не удалось установить глобальные переменные, см.консоль.`);
				return;
			} else {
				if (window.top.location.search !== "") {
					currP = window.top.location.search.substring(1).replace(/:/g, "");
					elem = document.getElementById('idTocBody').querySelector('a[href="' + currP + '"]');
				} else {
					console.error(`(!) Косяк - не удалось установить глобальные переменные:\n function setVariables (elem: ${typeof (elem)} / ${elem}, currP = "${currP}"):\n 1) isEmptyObject(${isEmptyObject(elem)})\n 2) elem === null: ${elem === null}`);
					alert(`(!) Косяк - не удалось установить глобальные переменные, см.консоль.`);
					return;
				}
			}
		}
	}
	let vrs = getVariables(elem, currP);
	if (Object.keys(vrs).length > 0 && JSON.stringify(vrs) !== "{}") {
		if (window.location.origin === "file://") { // - при локальном использовании
			// (i) в Firefox не работает
			vrs.value = "setUpdateVariables";
			window.top.postMessage(vrs, '*'); // (?) когда звездочка - это плохое использование в целях безопасности от взлома страниц
		} else {
			if (window.top.location.search === "") {
				setToolbarButtonsOnOff(window.top.hmtopicvars.btnExpand);
			} else {
				setUpdateVariables(
					vrs.hmtopicvars,
					vrs.hmnavpages,
					vrs.hmpermalink
				); // - обновляем глобальные переменные в variables.js
				let tab = window.top.document.getElementById('idTopicTab');
				if (tab !== "" && typeof(tab) !== "undefined" && typeof(tab) === "object") {
					if (tab.classList.contains('tab-current')) {
						setToolbarButtonsOnOff(window.top.hmtopicvars.btnExpand);
					} else {
						setTabShowHide(tab, 'show'); // - показать/скрыть текущую вкладку
					}
				}
			}
			setUpdateElements(); // - обновляем группу кнопок навигации на пан.инструментов (домой/назад/вперед), вкладку главная и ссылку на актуальную тему в меню вкладок на пан.тема топика
			// *идем в hmcontent создавать навигационные ссылки
			window.top.document.getElementById('hmcontent').contentWindow.writeBreadCrumbs(vrs.hmnavpages.breadCrumbs);
		}
	}
}
// (!) goToPage - перейти на страницу
function goToPage (elem, currP = "", collapse = true) {
	if (elem === null || typeof (elem) === "undefined" || typeof (elem) !== "object" || elem !== Object(elem)) { // 'не объект/не объект HTMLlinkElement
		if (currP !== null && typeof(currP) !== "undefined" && typeof(currP) === "string" && currP !== "") {
			elem = document.getElementById('idTocBody').querySelector('a[href="' + currP + '"]');
			if (elem === null) {
				let arr = Array.prototype.slice.call(document.getElementById('idTocBody').querySelectorAll('a[href="' + currP + '"]'));
				if (arr.length === 1) {
					elem = arr[0];
				} else {
					console.error(`(!) Косяк - не удалось выполнить переход на страницу:\n function goToPage (elem: ${typeof (elem)} / ${elem}, currP = "${currP}", collapse = ${collapse}):\n 1) isEmptyObject(${isEmptyObject(elem)})\n 2) elem === null: ${elem === null}`);
					alert(`(!) Косяк - не удалось выполнить переход на страницу, см.консоль.`);
					return;
				}
			}
		} else { // - стремимся все равно получить текущий элемент и/или его значение
			if (window.location.origin === "file://") { // - при локальном использовании
				console.error(`(!) Косяк - не удалось выполнить переход на страницу:\n function goToPage (elem: ${typeof (elem)} / ${elem}, currP = "${currP}", collapse = ${collapse}):\n 1) isEmptyObject(${isEmptyObject(elem)})\n 2) elem === null: ${elem === null}`);
				alert(`(!) Косяк - не удалось выполнить переход на страницу, см.консоль.`);
				return;
			} else {
				if (window.top.location.search !== "") {
					currP = window.top.location.search.substring(1).replace(/:/g, "");
					elem = document.getElementById('idTocBody').querySelector('a[href="' + currP + '"]');
				} else {
					console.error(`(!) Косяк - не удалось выполнить переход на страницу:\n function goToPage (elem: ${typeof (elem)} / ${elem}, currP = "${currP}", collapse = ${collapse}):\n 1) isEmptyObject(${isEmptyObject(elem)})\n 2) elem === null: ${elem === null}`);
					alert(`(!) Косяк - не удалось выполнить переход на страницу, см.консоль.`);
					return;
				}
			}
		}
	}
	if (elem.tagName === "A") {
		let inputCheckboxNode = document.getElementById('idTreeView');
		if (inputCheckboxNode !== null && typeof (inputCheckboxNode) !== "undefined" && typeof (inputCheckboxNode) === "object") {
			if (inputCheckboxNode.checked) {
				setGoToWithOptionCurrent(elem); // - переход на страницу - опция древовидный вид списка в режиме "Текущий пункт"
				// setTreeViewListCurrent(elem); // x не используется
			} else {
				collapse = isCollapse; // (i) если вариант 1
				setGoToWithOptionDefault(elem, collapse); // - переход на страницу - опция древовидный вид списка в режиме "По умолчанию"
				// setTreeViewListDefault(elem); // x не используется
			}
		} else { // *код оставлен для варианта классический
			console.warn(`function goToPage (elem: ${typeof (elem)} / ${elem}, currP = "${currP}", collapse = ${collapse}):\n (i) сработало условие для варианта классический`);
			if (elem.tagName !== "INPUT") return; // 'если кликнули вне тега input
			let inputRadioNodes = document.getElementsByTagName('INPUT');
			if (inputRadioNodes.length > 0) {
				for (let r = 0; r < inputRadioNodes.length; r++) {
					if (inputRadioNodes[r].checked) {
						switch (inputRadioNodes[r].id) {
							case 'idTreeViewListDefault':
								setGoToWithOptionDefault(elem); // - переход на страницу - опция древовидный вид списка в режиме "По умолчанию"
								// setTreeViewListDefault(elem); // X не используется
								return;
							case 'idTreeViewListCurrent':
								setGoToWithOptionCurrent(elem); // - переход на страницу - опция древовидный вид списка в режиме "Текущий пункт"
								// setTreeViewListCurrent(elem); // X не используется
								return;
							default:
								console.info(`(i) inputRadioNodes[${r}].id: ${inputRadioNodes[r].id}`);
								alert(`(i) Опция режим древовидного вида списка не найдена.\nНастройка будет работать в режиме "По умолчанию".`);
								setGoToWithOptionDefault(elem); // - переход на страницу - опция древовидный вид списка в режиме "По умолчанию"
								// setTreeViewListDefault(elem); // X не используется
								return;
						}
					}
				}
			} else {
				console.info(`(i) inputRadioNodes.length: ${inputRadioNodes.length}`);
				alert(`(i) Опция режим древовидного вида списка не найдена.\n Настройка будет работать в режиме "Текущий список".`);
			}
		}
		if (window.name === "hmnavigation") { // 'вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
			setVariables(elem, currP); // - обновление глобальных переменных в variables.js
		}
	}
}