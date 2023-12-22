// document.addEventListener("DOMContentLoaded", function () {}); // - js. Дожидаемся, когда Объектная модель документа страницы (DOM) будет готова к выполнению кода JavaScript
// (!) *window
// window.addEventListener('resize', function (e) {
// x // 	reSizeTopicContent(); // изменение размера расположения контент-текста
// }, false); // false - фаза "всплытие"
// x // window.addEventListener('resize', reSizeTopicContent, false); // false - фаза "всплытие" // x изменение размера расположения контент-текста
window.addEventListener('load', function () { // - js. Сработает, как только вся страница (изображения или встроенные фреймы), а не только DOM, будет готово
	if (window === top || window.name === "") { // (i) окно элемента яв-ся главным, например, при запуске отдельной страницей или через ctrl+клик из общего проекта
		writeBreadCrumbs([]); // - заполнение топика навигационными ссылками
	} else {
		let vrs = {
			currP: location.pathname.slice(location.pathname.lastIndexOf("/") + 1),
			titleP: document.title,
			btnExpand: document.getElementById('idContentText').querySelector('.toggle-content') ? "idExpandOn" : "idExpandOff", // - если есть скрытый контент, получаем и обновляем состояние кнопки развернуть/свернуть скрытый текст
		};
		if (window.location.origin === "file://") { // - при локальном использовании
			// (i) в Firefox не работает
			let msg = {
				value: "setToolbarButtonsOnOff",
				hmtopicvars: vrs
			};
			window.top.postMessage(msg, '*'); // (?) когда звездочка - это плохое использование в целях безопасности от взлома страниц
		} else {
			setToolbarButtonsOnOff(vrs.btnExpand);
			setUpdateVariables(vrs); // - обновляем некоторые глобальные переменные в variables.js
			let idTimer = setInterval(() => {
				let frame = window.top.document.getElementById('hmnavigation').contentWindow || window.top.frames.hmnavigation.contentWindow;
				if (frame !== null || typeof(frame) !== "undefined" || typeof(frame) === "object" || frame === Object(frame)) {
					clearInterval(idTimer);
					// (i) если вариант 2, то эта часть кода переносится в гл.окно - index.js
					if (window.top.location.search === "") {
						frame.setVariables(null, vrs.currP); // - обновление глобальных переменных в variables.js
					} else {
						frame.goToPage(null, vrs.currP); // - перейти на страницу выполнив обновление глобальных переменных в variables.js

					} // 'если вариант 2, то эта часть кода переносится в гл.окно - index.js
				}
			}, 500);
			if (window.top.hmtopicvars.msgBox === "enable") {
				setMsgBox(null, window.top.hmtopicvars.msgBtn, window.top.hmtopicvars.msgText); // - заполнение всплывающего окна сообщения
			}
		}
	}
	setPageToc(); // - создать содержание страницы
}, false); // false - фаза "всплытие"
// (!) *document
$(document).ready(function () { // - jq
	if (document !== null && typeof(document) === "object") {
		// 'message
		window.addEventListener("message", (event) => {
			// console.log(`window.addEventListener("message", (event) window.name: ${window.name}):\n location.origin: "${location.origin}" <=> event.origin: "${event.origin}": ${location.origin === event.origin}\n event.origin === 0: ${event.origin === 0}\n event.data: ${JSON.stringify(event.data, null, 1)}`); // X -
			if (location.origin === "file://") {
				if (event.data.value === "writeBreadCrumbs") {
					writeBreadCrumbs(event.data.breadCrumbs); // - заполнение топика навигационными ссылками
				} else if (event.data.value === "setMsgBox") {
					setMsgBox(event.data.msgBox, event.data.msgBtn, event.data.msgText); // - заполнение всплывающего окна сообщения
				} else if (event.data.value === "setToggleElement") {
					// *развернуть/свернуть скрытый контент в тексте
					// **проверяем наличие ссылки на файл lightbox.js
					if (getLightboxLink(window.self)) { // - получить скрипт - ссылка на lightbox.js
						// (i) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
						setToggleElement(null, event.data.btnChecked); // - отображаем/скрываем скрытый контент
					} else {
						let js = setLightboxLink(window.self); // - создать скрипт - ссылка на lightbox.js
						let id = setInterval(() => {
							if (js) {
								clearInterval(id);
								// (i) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
								setToggleElement(null, event.data.btnChecked); // - отображаем/скрываем скрытый контент
							}
						}, 500);
					}
				} else if (event.data.value === "setShowHideWindow") {
					// *Закрыть окно "Меню содержание страницы"
					setShowHideWindow(document.getElementById(event.data.winId), event.data.winHide);
				}
			}
		}, false); // false - фаза "всплытие"
		// 'keyup
		document.addEventListener("keyup", function (event) {
			if (event.key === "Escape" || event.code === "Escape" || event.keyCode === 27 || event.which === 27) {
				setShowHideWindow(document.getElementById('idPageMenuToc'), 'hide');
				if (window.location.origin === "file://") { // - при локальном использовании
					// (i) в Firefox не работает
					let msg = {
						value: "setShowHideWindow",
						winId: ["idPermalinkBox", "idTabsMenuBox"],
						winHide: "hide"
					};
					window.top.postMessage(msg, '*'); // (?) когда звездочка - это плохое использование в целях безопасности от взлома страниц
				} else {
					let elems = [
						window.top.document.getElementById('idPermalinkBox'),
						window.top.document.getElementById('idTabsMenuBox')
					];
					elems.forEach(item => {
						if (item !== null) {
							if (item.style.display !== "none") {
								if (item.id === "idPermalinkBox") { window.top.clearPermalink(); } // - очищение инфо-подсказок при закрытии окна Постоянная ссылка
								setShowHideWindow(item, 'hide');
							}
						}
					});
				}
			}
		}, false); // false - фаза "всплытие"
		// (!) idNavLinks - навигационные ссылки
		if (document.getElementById('idNavLinks') !== null && typeof(document.getElementById('idNavLinks')) === "object") {
			// 'click
			document.getElementById('idNavLinks').addEventListener("click", function (e) {
				if (e.target.tagName === "A") {
					if (e.target.parentElement.classList.contains('sync-toc-off')) {
						if (location.origin === "file://") {
							let msg = {
								value: "setHistoryPushState",
								currP: e.target.getAttribute('href'),
								winName: window.name
							};
							window.top.postMessage(msg, '*'); // (?) когда звездочка - это плохое использование в целях безопасности от взлома страниц
						} else {
							window.top.setHistoryPushState(e.target.getAttribute('href')); // сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
						}
					}
				}
			}, false); // false - фаза "всплытие"
		}
		// (!) idPageToc - содержание страницы
		if (document.getElementById('idPageIconToc') !== null && typeof(document.getElementById('idPageIconToc')) === "object") {
			// 'click
			document.getElementById('idPageIconToc').addEventListener("click", function (e) {
				if (e.target.tagName === "IMG") {
					if (e.target.id === "idPageIconToc") {
						if (e.target.getAttribute('src') === "icon/toc-menu_on.png") {
							let tocMenu = document.getElementById('idPageMenuToc');
							if (tocMenu === null) {
								tocMenu = document.querySelector('toc-menu');
								if (tocMenu === null) {
									console.error(`(!) Косяк - не удалось проверить содержание страницы - не найден элемент:\n document.getElementById('idPageIconToc').addEventListener("click", function(e.target: ${e.target}):\n 1) tocMenu === null: ${tocMenu === null}\n 2) typeof(tocMenu) === "undefined": ${typeof (tocMenu) === "undefined"}\n 3) typeof(tocMenu) !== "object": ${typeof(tocMenu) !== "object"}\n 4) tocMenu !== Object(tocMenu): ${tocMenu !== Object(tocMenu)}`);
									alert(`(!) Косяк - не удалось проверить содержание страницы - не найден элемент, см.консоль.`);
								}
							}
							if (tocMenu !== null) {
								if (tocMenu.style.display === "none") {
									tocMenu.style.removeProperty('display');
								} else {
									tocMenu.style.display = "none";
								}
							}
						}
					}
				}
			}, false); // false - фаза "всплытие"
		}
		// (!) idLinksComment
		if (document.getElementById('idLinksComment') !== null && typeof(document.getElementById('idLinksComment')) === "object") {
			// 'click
			document.getElementById('idLinksComment').addEventListener("click", function (e) {
				if (e.target.tagName === "A") {
					if (e.target.id === "idCommentToggle1") {
						showComments();
					}
				}
			}, false); // false - фаза "всплытие"
		}
		// (!) idMsgBox - всплывающее окно сообщения
		if (document.getElementById('idMsgBox') !== null && typeof(document.getElementById('idMsgBox')) === "object") {
			// 'click
			document.getElementById('idMsgBox').addEventListener("click", function (e) {
				if (e.target.tagName === "DIV") {
					if (e.target.id === "idMsgBtn") {
						toggleMsgBox(e.target); // - переключить всплывающее окно сообщения
					}
				}
			}, false); // false - фаза "всплытие"
		}
		// (!) idContentText
		if (document.getElementById('idContentText') !== null && typeof(document.getElementById('idContentText')) === "object") {
			// 'click
			document.getElementById('idContentText').addEventListener("click", function (e) {
				if (e.target.tagName === "A") {
					if (e.target.classList.contains('popuplink')) {
						let winProp = 'width=350,height=350,left=' + ((screen.width - 500) / 2) + ',top=' + ((screen.height - 500) / 2) + ',menubar=false,toolbar=false,location=false,resizabie=no,scrollbars=yes,status=false';
						windowOpen('manualVersion.html', winProp);
					} else if (e.target.classList.contains('toggle-dropdown') || e.target.classList.contains('toggle-inline')) {
						if (getLightboxLink(window.self)){ // - получить скрипт - ссылка на lightbox.js
							// (i) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
							setToggleElement(e.target); // - развернуть/свернуть скрытый контент
						} else {
							let js = setLightboxLink(window.self) // - создать скрипт - ссылка на lightbox.js
							let id = setInterval(() => {
								if (js) {
									clearInterval(id);
									// (i) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
									setToggleElement(e.target); // - отображаем/скрываем скрытый контент
								}
							}, 500);
						}
					} else {
						if (location.origin === "file://") {
							let msg = {
								value: "setHistoryPushState",
								currP: e.target.getAttribute('href'),
								winName: window.name
							};
							window.top.postMessage(msg, '*'); // (?) когда звездочка - это плохое использование в целях безопасности от взлома страниц
						} else {
							window.top.setHistoryPushState(e.target.getAttribute('href')); // сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
						}
					}
				} else if (e.target.tagName === "IMG") {
					if (e.target.classList.contains('toggle-icon')) {
						// *в текущем абзаце отображаем/скрываем каждый скрытый контент
						// **проверяем наличие ссылки на файл lightbox.js
						if (getLightboxLink(window.self)) { // - получить скрипт - ссылка на lightbox.js
							// (i) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
							setToggleElement(e.target); // - отображаем/скрываем скрытый контент
						} else {
							let js = setLightboxLink(window.self); // - создать скрипт - ссылка на lightbox.js
							let id = setInterval(() => {
								if (js) {
									clearInterval(id);
									// (i) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
									setToggleElement(e.target); // - отображаем/скрываем скрытый контент
								}
							}, 500);
						}
					}
				}
			}, false); // false - фаза "всплытие"
		}
	}
}); // ready end
// (!) writeBreadCrumbs - заполнение топика навигационными ссылками
function writeBreadCrumbs(navlinks = []) {
	// let elem = document.getElementById('idNavLinks').querySelector('.sync-toc-off');
	let elem = document.getElementById('idNavLinks').querySelector('noscript');
	if (elem === null || typeof(elem) === "undefined" || typeof(elem) !== "object" || elem !== Object(elem)) { // 'не объект/не объект HTMLSpanElement
		console.error(`(!) Косяк - не удалось создать навигационные ссылки - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function writeBreadCrumbs(navlinks.length: ${navlinks.length}), window.«${window.name}»:\n 1) elem === null: ${elem === null}\n 2) typeof(elem) === "undefined": ${typeof (elem) === "undefined"}\n 3) typeof(elem) !== "object": ${typeof(elem) !== "object"}\n 4) elem !== Object(elem): ${elem !== Object(elem)}`);
		alert(`(!) Косяк - не удалось создать навигационные ссылки - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	if (navlinks.length === 0) {
		elem.insertAdjacentHTML('afterend', '<span class="sync-toc-off">»Нет темы выше этого уровня«</span>');
	} else if (navlinks.length > 0) {
		let strHTML = "";
		for (let i = 0; i < navlinks.length; i++) {
			if (navlinks.length === i + 1) {
				strHTML = strHTML + '<span class="sync-toc-off"><a href="' + navlinks[i][0] + '" target="hmcontent">' + navlinks[i][1] + '</a>:</span>';
			} else {
				strHTML = strHTML + '<span class="sync-toc-off"><a href="' + navlinks[i][0] + '" target="hmcontent">' + navlinks[i][1] + '</a>&nbsp;&#47;&ensp;</span>';
			}
			// (i) если массив был заполнен добавлением в конец, см.ф.getBreadCrumbs()
			// if (i === 0) {
			// 	strHTML = '<span class="sync-toc-off"><a href="' + navlinks[i][0] + '" target="hmcontent">' + navlinks[i][1] + '</a>:</span>' + strHTML;
			// } else {
			// 	strHTML = '<span class="sync-toc-off"><a href="' + navlinks[i][0] + '" target="hmcontent">' + navlinks[i][1] + '</a>&nbsp;&#47;&ensp;</span>' + strHTML;
			// }
		}
		elem.insertAdjacentHTML('afterend', strHTML);
	}
}
// (!) setPageToc - создать содержание страницы
function setPageToc() {
	let tocMenu = document.getElementById('idTopicBox').querySelector('.toc-menu');
	if (tocMenu === null) {
		console.log(`function setPageToc():\n tocMenu: ${tocMenu}`); // x -
		return false;
	}

	let arr = Array.from(document.getElementById('idTopicBody').querySelectorAll('h1, h2, h3, h4, h5, h6'));
	if (arr.length > 0) {
		arr.forEach(elem => {
			tocMenu.insertAdjacentHTML('beforeend', '<p><a href="#' + elem.id + '">' + elem.innerHTML + '</a></p>');
		});
		let img = document.getElementById('idPageIconToc');
		if (img !== null) {
			if (img.getAttribute('src') !== "icon/toc-menu_on.png") {
				img.setAttribute('src', 'icon/toc-menu_on.png');
			}
		}
		img.setAttribute('title', 'Показать/Скрыть содержание на текущей странице');
		return true;
	} else {
		return false;
	}
}
// (!) showComments-см.файл comments.js
function showComments(params) {
	alert(`(i) Функция показать комментарий(-и) пока что в разработке.`);
}
// (!) writeCommentLink-см.файл comments.js
function writeCommentLink(params) { }
// (!) reSizeTopicContent - изменение размера расположения контент-текста
// x использовалось, когда фрейм в пан.топ.был display: block
// function reSizeTopicContent() {
// 	let elem = document.getElementById('idTopicHeader');
// 	let headerHeight = getValueFullSizeProperty(elem).height; // - получить полноразмерное значение св-ва
// 	if (typeof(headerHeight) === "undefined") { // перестраховка
// 		headerHeight = 0;
// 	}
// 	elem = document.getElementById('idMsgBox');
// 	let msgHeight = getValueFullSizeProperty(elem).height; // - получить полноразмерное значение св-ва
// 	// *важно проверять на isNaN, т.к.может оказаться NAN
// 	if (isNaN(msgHeight) && typeof(msgHeight) === "number" || typeof(msgHeight) === "undefined") { // перестраховка
// 		msgHeight = 0;
// 	}
// 	elem = document.getElementById('idTopicFooter');
// 	let footerHeight = getValueFullSizeProperty(elem).height; // - получить полноразмерное значение св-ва
// 	if (typeof(footerHeight) === "undefined") { // перестраховка
// 		footerHeight = 0;
// 	}
// 	let topicContent = {
// 		top: headerHeight + msgHeight,
// 		bottom: footerHeight
// 	};
// 	elem = document.getElementById('idTopicBody');
// 	if (topicContent.top > 0) {
// 		elem.style.top = topicContent.top + "px";
// 	}
// 	if (topicContent.bottom > 0) {
// 		elem.style.bottom = topicContent.bottom + "px";
// 	}
// }
// (!) setMsgBox - заполнение всплывающего окна сообщения
function setMsgBox(msgBox = "enable", msgBtn = false, msgText = "") {
	if (msgBox === "disable") return; // (i) в условии намеренно не используется проверка на null/""/undefined, чтобы в переменной аргумента этот параметр можно было опускать как необязательный
	if (msgText === "") {
		console.error(`(!) Косяк - не удалось создать всплывающее окно сообщения:\n function setMsgBox(msgBox = "${msgBox}", msgText = "${msgText}", msgBtn = ${msgBtn})`);
		alert(`(!) Косяк - не удалось создать всплывающее окно сообщения. Отсутствует информационный текст, см.консоль.`);
		return;
	}
	let elem = document.getElementById('idMsgBox');
	if (elem !== null && elem === Object(elem)) { // 'объект HTMLDivElement
		document.getElementById('idMsgText').innerHTML = msgText;
		// document.getElementById('idMsgBtn').innerHTML = "«";
		if (msgBtn) {
			document.getElementById('idMsgContent').removeAttribute('style');
			document.getElementById('idMsgBtn').classList.add('msg-show');
			document.getElementById('idMsgBtn').classList.remove('msg-hide');
		} else {
			document.getElementById('idMsgContent').style.display = "none";
			document.getElementById('idMsgBtn').classList.add('msg-hide');
			document.getElementById('idMsgBtn').classList.remove('msg-show');
		}
		elem.removeAttribute('style');
		// x // reSizeTopicContent(); // - изменение размера расположения контент-текста
	}
}
// x writeMsgBox-создать всплывающее окно сообщения
function writeMsgBox(msgBox = "enable", msgBtn = false, msgText = "") {
	if (msgBox === "disable") return; // (i) в условии намеренно не используется проверка на null/""/undefined, чтобы в переменной аргумента этот параметр можно было опускать как необязательный
	if (msgText === "") {
		console.error(`(!) Косяк - не удалось создать всплывающее окно сообщения:\n function writeMessage(msgText = "${msgText}")`);
		alert(`(!) Косяк - не удалось создать всплывающее окно сообщения. Отсутствует информационный текст, см.консоль.`);
		return;
	}
	// *проверяем существование узла, если он существует, назначаем ему обработчик события, если нет, создаем его.
	if (document.getElementById('idMsgBox') === null && document.getElementById('idMsgBox') !== Object(document.getElementById('idMsgBox'))) { // 'НЕ объект HTMLDivElement
		let elem = document.getElementById('idTopicBody');
		if (elem === null || typeof (elem) === "undefined" || typeof (elem) !== "object" || elem !== Object(elem)) {
			console.error(`(!) Косяк - не удалось определить положение для вставки всплывающего окна сообщения:\n function writeMsgBox(msgBox = "${msgBox}", msgBtn = ${msgBtn}, msgText = "${msgText}"):\n elem: ${elem} / typeof(${typeof (elem)}) / ${Object(elem)}`);
			alert(`(!) Косяк - не удалось определить положение для вставки всплывающего окна сообщения, см.консоль.`);
			return;
		}
		// *добавляем узел
		if (msgBtn) {
			elem.insertAdjacentHTML('beforebegin', '<div id="idMsgBox" class="msg-box"><div id="idMsgContent" class="msg-content"><div id="idMsgImg" class="msg-info"></div><div id="idMsgText" class="msg-text"><p>' + msgText + '</p></div></div><div id="idMsgBtn" class="msg-btn msg-show" title="Скрыть/Показать информационное сообщение">«</div></div>');
		} else {
			elem.insertAdjacentHTML('beforebegin', '<div id="idMsgBox" class="msg-box"><div id="idMsgContent" class="msg-content" style="display: none;"><div id="idMsgImg" class="msg-info"></div><div id="idMsgText" class="msg-text"><p>' + msgText + '</p></div></div><div id="idMsgBtn" class="msg-btn msg-hide" title="Скрыть/Показать информационное сообщение">«</div></div>');
		}
	}
	// *создаем обработчик события
	document.getElementById('idMsgBox').addEventListener("click", function (e) {
		if (e.target.tagName === "DIV") {
			if (e.target.id === "idMsgBtn") {
				toggleMsgBox(e.target); // - переключить всплывающее окно сообщения
			}
		}
	}, false); // - false - фаза "всплытие"
	// x // reSizeTopicContent(); // - изменение размера расположения контент-текста
}
// (!) toggleMsgBox - переключить всплывающее окно сообщения
function toggleMsgBox(elem) {
	if (elem === null || typeof (elem) === "undefined" && typeof (elem) !== "object" || elem !== Object(elem)) {
		console.error(`(!) Косяк - не удалось скрыть/показать всплывающее окно сообщения:\n function toggleMsgBox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк - не удалось скрыть/показать всплывающее окно сообщения, см.консоль.`);
		return;
	}
	if (elem.classList.contains('msg-show')) {
		elem.classList.replace('msg-show', 'msg-hide');
		setShowHideWindow(document.getElementById('idMsgContent'), 'hide');
		// *обновление глобальной переменной в variables.js
		if (window.location.origin === "file://") { // - при локальном использовании
			// (i) в Firefox не работает
			let msg = {
				value: "msgBtnUpdate",
				msgBtn: false
			};
			window.top.postMessage(msg, '*'); // (?) когда звездочка - это плохое использование в целях безопасности от взлома страниц
		} else {
			window.top.hmtopicvars.msgBtn = false;
		}
	} else if (elem.classList.contains('msg-hide')) {
		elem.classList.replace('msg-hide', 'msg-show');
		setShowHideWindow(document.getElementById('idMsgContent'), 'show');
		// *обновление глобальной переменной в variables.js
		if (window.location.origin === "file://") { // - при локальном использовании
			// (i) в Firefox не работает
			let msg = {
				value: "msgBtnUpdate",
				msgBtn: true
			};
			window.top.postMessage(msg, '*'); // (?) когда звездочка - это плохое использование в целях безопасности от взлома страниц
		} else {
			window.top.hmtopicvars.msgBtn = true;
		}
	} else {
		console.error(`(!) Косяк - не удалось изменить элементу класс:\n function toggleMsgBox(elem: ${elem.tagName}, ${elem.id}):\n elem.classList: ${JSON.stringify(elem.classList, null, 1)}`);
		alert(`(!) Косяк - не удалось изменить элементу класс, см.консоль.`);
		return;
	}
	// x // reSizeTopicContent(); // - изменение размера расположения контент-текста
}