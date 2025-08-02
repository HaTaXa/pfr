// document.addEventListener('DOMContentLoaded', function () {}); // - js. Дожидаемся, когда Объектная модель документа страницы (DOM) будет готова к выполнению кода JavaScript
// (!) *window
// window.addEventListener('resize', function (e) {}, false); // false - фаза "всплытие"
window.addEventListener('load', function (e) { // - js. Сработает, как только вся страница (изображения или встроенные фреймы), а не только DOM, будет готово
	if (window === top || window.name === "") { // (i) окно элемента яв-ся главным, например, при запуске отдельной страницей или через ctrl+клик из общего проекта
		writeBreadCrumbs([]); // заполнение топика навигационными ссылками
		if (setScript(window.self, "js/variables.js")) { // создать скрипт - ссылка на js-файл
			setTimeout(() => { // (?)'почему то нужна небольшая выдержка времени, чтобы не срабатывала ошибка на отсутствие ссылки на скрипта
				setMsgBox(window.vrsTopic.msgBox, window.vrsTopic.msgBtn, window.vrsTopic.msgText, window.vrsTopic.msgEffect); // заполняем окно инфо
			}, 100);
		}
	} else {
		let href = location.href.slice(location.href.lastIndexOf("/") + 1);
		let hash = location.hash.slice(location.hash.lastIndexOf("#") + 1);
		if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
			let msg = {};
			if ("webReadyState" in window.sessionStorage) {
				if (window.sessionStorage.getItem('webReadyState') === "complete") { // ~последующая зарузка топика во фрейм
					window.sessionStorage.removeItem('webReadyState');
					msg.value = "goToPage";
					msg.href = href;
					msg.frmName = window.name;
				} else { // ~первичная загрузка всего сайта
					msg.value = "setVariables";
					// исключаем наличие hash, если есть
					msg.currP = href.slice(href.lastIndexOf("#") + 1); // перезаписываем переменную без #
					msg.hash = hash;
					msg.frmName = window.name;
				}
			} else { // ~если ключ отсутствует, значит первичная загрузка уже была совершена
				msg.value = "goToPage";
				msg.href = href;
				msg.frmName = window.name;
			}
			window.top.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
		} else {
			if (window.top.document.readyState === "complete") { // ~последующая зарузка топика во фрейм
				// *делаем вкладку текущей
				let tab = window.top.document.querySelector('.tab-current');
				if (tab === null && tab !== Object(tab)) {
					tab = window.top.document.getElementById('idTopicTab'); // вкладка текущ.топика по умолчанию
				}
				window.top.setTabVisibility(tab, "show", "goToPage"); // показать/скрыть текущую вкладку
				setTimeout(() => { // нужна небольшая выдержка времени
					// *создаем навигационные ссылки
					writeBreadCrumbs(window.top.vrsNavigation.breadCrumbs);
				}, 500);
			} else { // ~первичная загрузка всего сайта
				if (window.top.location.search === "") {
					let frame = window.top.document.getElementById('ifrmnavigation'); // или
					// let frame = window.top.frames.ifrmnavigation;
					// let frame = window.top.document.getElementById('ifrmnavigation').contentWindow || window.top.frames.ifrmnavigation.contentWindow;
					let idInt = setInterval(() => {
						frame = window.top.document.getElementById('ifrmnavigation');
						if (frame !== null || (frame !== null && frame === Object(frame))) {
							if (frame.contentDocument.readyState === "complete" || frame.contentWindow.document.readyState === "complete") {
								clearInterval(idInt);
								// исключаем наличие hash, если есть
								if (hash === "") {
									frame.contentWindow.setVariables(null, href); // обновление глобальных переменных в variables.js
								} else { // перезаписываем переменную без #
									href = href.slice(href.lastIndexOf("#") + 1);
									frame.contentWindow.setVariables(null, href, hash); // обновление глобальных переменных в variables.js
								}
								// *создаем навигационные ссылки
								writeBreadCrumbs(window.top.vrsNavigation.breadCrumbs);
							}
						}
					}, 500);
				} else {
					// *делаем вкладку текущей
					let tab = window.top.document.querySelector('.tab-current');
					if (tab === null && tab !== Object(tab)) {
						tab = window.top.document.getElementById('idTopicTab'); // вкладка текущ.топика по умолчанию
					}
					let idInt = setInterval(() => { // ~если будет ошибка перенести сюда
						if (window.top.frames.ifrmnavigation.document.readyState === "complete") {
							clearInterval(idInt);
							// window.top.setTabVisibility(tab, "show", "setVariables"); // показать/скрыть текущую вкладку
							window.top.setTabVisibility(tab, "show", "goToPage"); // показать/скрыть текущую вкладку
							// *создаем навигационные ссылки
							writeBreadCrumbs(window.top.vrsNavigation.breadCrumbs);
						}
					}, 500);
				}
			}
			// *заполняем окно инфо
			if (window.top.vrsTopic.msgBox === "enable") {
				setMsgBox(window.top.vrsTopic.msgBox, window.top.vrsTopic.msgBtn, window.top.vrsTopic.msgText, window.top.vrsTopic.msgEffect); // (?)'перем.аргум.имеющая знач.по умолчанию может быть изменена
			}
		}
	}
	setPageToc(); // создать содержание страницы
	// (i) для tagName a, чтобы сработал scrollIntoView() надо использовать отмену действия браузером по умолчанию - preventDefault(), см.событие keydown в lightbox, с использованием св-ва tabIndex = "0" элементов, не имеющих автофокусировку
	// if (location.hash !== "") { // (?)~не срабатывает
	// 	// let elem = document.getElementById('idTopicBody');
	// 	let elem = document.getElementById(location.hash.slice(location.hash.lastIndexOf("#") + 1));
	// 	elem.tabIndex = "-1";
	// 	elem.focus();
	// 	elem.scrollIntoView({behavior: "smooth"}); // переход к элементу - не путать с фокусированием {behavior: "smooth", block: "center", inline: "start"}
	// 	elem.blur();
	// 	// document.activeElement.blur();

	// 	// function topicbody_onFocus(eVent) {
	// 	// 	eVent.preventDefault();
	// 	// 	elem.tabIndex = "-1";
	// 	// 	elem.focus();
	// 	// 	elem.scrollIntoView({behavior: "smooth"}); // переход к элементу - не путать с фокусированием {behavior: "smooth", block: "center", inline: "start"}
	// 	// 	elem.blur();
	// 	// 	// document.activeElement.blur();
	// 	// 	elem.removeEventListener('focus', topicbody_onFocus, true);
	// 	// }
	// 	// elem.addEventListener('focus', topicbody_onFocus, true);
	// }
}, false); // false - фаза "всплытие"
// (!) *document
$(document).ready(function () { // - jq
	if (document !== null && typeof(document) === "object") {
		// 'message
		window.addEventListener('message', (event) => {
			// console.log(`window.addEventListener('message', (event) window.name: ${window.name}):\n location.origin: "${location.origin}" <=> event.origin: "${event.origin}": ${location.origin === event.origin}\n event.origin === 0: ${event.origin === 0}\n event.data: ${JSON.stringify(event.data, null, 1)}`); // x -
			if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
				if (event.data.value === "loadComplete") {
					writeBreadCrumbs(event.data.breadCrumbs); // заполнение топика навигационными ссылками
					setMsgBox(event.data.msgBox, event.data.msgBtn, event.data.msgText, event.data.msgEffect); // заполнение окна инфо
				} else if (event.data === "setToggleContent") {
					// *развернуть/свернуть скрытый контент в тексте
					// setToggleContent(null, getButtonExpand().value); // переключатель скрытого контента
					setToggleContent(null); // переключатель скрытого контента
				} else if (event.data === "getButtonExpand") {
					// *получаем и передаем обратно в источник - гл.окно, значения статуса кн.для скрытого контента
					let msg = {
						value: "setButtonExpand",
						status: getButtonExpand().status // получить св-ва для кн.скрытого контента на панели toolbabar в гл.окне
					}
					event.source.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
				} else if (event.data.value === "handlerPoPuPs") {
					// *скрываем всплывающие эл.в текущем окне
					handlerPoPuPs(event); // обработчик вплывающих эл.
					// let tocMenu = document.getElementById(event.data.id); // всплывающий(-е) эл.в текущем окне // x -на удаление
					// if (tocMenu !== null || typeof(tocMenu) !== "undefined" || tocMenu !== null && tocMenu === Object(tocMenu)) {
					// 	if (tocMenu.classList.contains('toc-menu-popup')) {
					// 		// setShowOrHide(tocMenu, "", "", "", "toc-menu-popup");
					//		tocMenu.classList.remove('toc-menu-popup');
					// 	}
					// 	let icon = tocMenu.parentElement.querySelector('.toc-btn_icon');
					// 	if (icon !== null && icon === Object(icon)) {
					// 		if (icon.style.order === "2") {
					// 			icon.removeAttribute('style');
					// 		}
					// 	}
					// }
				}
			}
		}, false); // false - фаза "всплытие"
		// (!) hashchange
		window.addEventListener('hashchange', (e) => {

			// console.log(e.type, ": window.«", window.name, "», location.origin: ", location.origin, "\n e.oldURL: ", e.oldURL, "\n e.newURL: ", e.newURL);

		}, false); // false - фаза "всплытие"
		// 'focusIn
		document.addEventListener('focusin', function (event) {
			// console.log("«", event.type, "», window.«", window.name, "»", "\n document.activeElement: ", document.activeElement, "\n event.target: ", event.target);

			if (event.target.hasAttribute('class')) {
				if (event.target.classList.contains('lightbox')) {
					setEventHandlersLightbox(event.target, "add"); // создание/удаление обработчиков событий для узла.lightbox
				}
			}
		}, false);
		// 'focusOut
		document.addEventListener('focusout', function (event) {
			// console.log("«", event.type, "», window.«", window.name, "»", "\n document.activeElement: ", document.activeElement, "\n event.target: ", event.target);

			if (event.target.hasAttribute('class')) {
				if (event.target.classList.contains('lightbox')) {
					setEventHandlersLightbox(event.target, "remove"); // создание/удаление обработчиков событий для узла.lightbox
				}
			}
		}, false);
		// 'keydown
		document.addEventListener('keydown', function (event) {
			if (event.code === "Escape" || event.key === "Escape" || event.keyCode === 27 || event.which === 27) {
				// (i) event.code всегда содержит только одно латинское обозначение в отличие от event.key, кот.содержит обозначение относительно раскладки клавиатуры
				// 'keyup
				document.addEventListener('keyup', handlerPoPuPs, false); // создаем обработчик для всего док.
				// x - на удаление
				// let tocMenu = document.getElementById('idPageMenuToc'); // всплывающий(-е) эл.в текущем окне
				// if (tocMenu !== null || typeof(tocMenu) !== "undefined" || tocMenu !== null && tocMenu === Object(tocMenu)) {
				// 	if (tocMenu.classList.contains('toc-menu-popup')) {
				// 		// setShowOrHide(tocMenu, "", "", "", "toc-menu-popup");
				//		tocMenu.classList.remove('toc-menu-popup');
				// 	}
				// 	let icon = tocMenu.parentElement.querySelector('.toc-btn_icon');
				// 	if (icon !== null && icon === Object(icon)) {
				// 		if (icon.style.order === "2") {
				// 			icon.removeAttribute('style');
				// 		}
				// 	}
				// }
				// if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
				// 	let msg = {
				// 		value: "setShowOrHide",
				// 		id: ["idPermalinkBox", "idTabsMenuBox"]
				// 	};
				// 	window.top.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
				// } else {
				// 	let elems = [
				// 		window.top.document.getElementById('idPermalinkBox'),
				// 		window.top.document.getElementById('idTabsMenuBox')
				// 	];
				// 	elems.forEach(item => {
				// 		if (item !== null && item === Object(item)) {
				// 			if (item.id === "idPermalinkBox") { // всплывающий(-е) эл.в гл.окне
				// 				window.top.setClearPermalink(); // очистить окно Постоянная ссылка
				// 				// setShowOrHide(item, "", "", "", "permalink-popup");
				// 				item.classList.remove('permalink-popup');
				// 				window.top.setEventHandlersPermalink(item, 'remove'); // создание/удаление обработчиков событий для узла permalink
				// 			} else if (item.id === "idTabsMenuBox") { // всплывающий(-е) эл.в гл.окне
				// 				if (item.classList.contains('tabs-menu-popup')) {
				// 					// setShowOrHide(item, "", "", "", "tabs-menu-popup");
				// 					item.classList.remove('tabs-menu-popup');
				// 				}
				// 			}
				// 		}
				// 	});
				// }
			}
		}, false); // false - фаза "всплытие"
		// (!) idTopicHeader
		if (document.getElementById('idTopicHeader') !== null && typeof(document.getElementById('idTopicHeader')) === "object") {
			// 'click
			document.getElementById('idTopicHeader').addEventListener('click', function (e) {
				if (e.target.tagName === "A") {
					if (e.target.parentElement.classList.contains('sync-toc-off')) {
						// (!) idNavLinks - навигационные ссылки
						console.log(`навигационные ссылки:\n window.«${window.name}»\n location.origin: ${location.origin}\n ${e.target.href.slice(e.target.href.lastIndexOf("/") + 1)}`);
						// (?)
						// if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
						// 	let msg = {
						// 		value: "setHistoryState",
						// 		href: e.target.href.slice(e.target.href.lastIndexOf("/") + 1),
						// 		winName: window.name
						// 	};
						// 	window.top.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
						// } else {
						// 	window.top.setGoToPage(e.target); // установка перехода на страницу
						// }
					}
				} else if (e.target.tagName === "IMG") {
					if (e.target.id === "idPageIconToc") {
						// (!) idPageToc - содержание страницы
						let tocMenu = document.getElementById('idPageMenuToc');
						if (tocMenu === null) {
							tocMenu = document.querySelector('.toc-menu');
							if (tocMenu === null) {
								console.error(`(!) Косяк - не удалось получить содержание страницы - не найден элемент:\n e: ${e}, e.type: ${e.type}, e.target: ${e.target}:\n window."${window.name}", location.origin: ${location.origin}\n 1) tocMenu === null: ${tocMenu === null}\n 2) typeof(tocMenu) === "undefined": ${typeof(tocMenu) === "undefined"}\n 3) typeof(tocMenu) === "object": ${typeof(tocMenu) === "object"}\n 4) tocMenu === Object(tocMenu): ${tocMenu === Object(tocMenu)}`);
								alert(`(!) Косяк - не удалось получить содержание страницы - не найден элемент, см.консоль.`);
							}
						}
						if (tocMenu !== null && tocMenu === Object(tocMenu)) {
							// tocMenu.classList.toggle('toc-menu-popup'); // или так
							setShowOrHide(tocMenu, "", "", "", "toc-menu-popup");
							if (tocMenu.classList.contains('toc-menu-popup')) {
								e.target.style.order = "2";
							} else {
								if (e.target.style.order === "2") {
									e.target.removeAttribute('style');
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
			document.getElementById('idLinksComment').addEventListener('click', function (e) {
				if (e.target.tagName === "A") {
					if (e.target.id === "idCommentToggle1") {
						showComments();
					}
				}
			}, false); // false - фаза "всплытие"
		}
		// (!) idContentText
		if (document.getElementById('idContentText') !== null && typeof(document.getElementById('idContentText')) === "object") {
			// 'mousedown
			document.getElementById('idContentText').addEventListener('mousedown', function (e) {
				if (e.target.tagName === "A") {
					if (e.button === 0) { // исключаем нажатие правой кн.м.
						if (e.target.classList.contains('toggle-dropdown') || e.target.classList.contains('toggle-inline')) {
							let lnkToggle = e.target;
							function lnkToggle_onMouseup(eVent) {
								function lnkToggle_onClick(evn) {
									// getAttribute если (# + ...) вернет string || null если (#) заглушка
									if (evn.target.href[evn.target.href.length - 1] === "#" && evn.target.getAttribute('href') === "#" && evn.target.hash === "" && evn.target.hash.length === 0 && evn.target.getAttribute('hash') === null) { // ~если заглушка
										evn.preventDefault(); // отменяем действия браузера по умолчанию
									} else {
										if (evn.target.href.slice(evn.target.href.lastIndexOf("/") + 1) !== location.href.slice(location.href.lastIndexOf("/") + 1)) {
											if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
												let msg = {
													value: "setHistoryState",
													href: evn.target.href.slice(evn.target.href.lastIndexOf("/") + 1),
													winName: window.name
												};
												window.top.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
											} else {
												window.top.setHistoryState("push", evn.target.href.slice(evn.target.href.lastIndexOf("/") + 1)); // сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
											}
										}
										// let lbx = document.getElementById(`${eVent.target.href.slice(eVent.target.href.lastIndexOf("#") + 1)}`);
										// lbx.focus(); // не получается // { focusVisible: true/false } // true - по умолчанию
									}
									lnkToggle.removeEventListener('click', lnkToggle_onClick, false);
								}
								setToggleContent(eVent.target); // переключатель скрытого контента
								lnkToggle.addEventListener('click', lnkToggle_onClick, false);
								lnkToggle.removeEventListener('mouseup', lnkToggle_onMouseup, false);
							}
							lnkToggle.addEventListener('mouseup', lnkToggle_onMouseup, false);
						} else if (e.target.classList.contains('popuplink')) {
							let winProp = 'width=350,height=350,left=' + ((screen.width - 500) / 2) + ',top=' + ((screen.height - 500) / 2) + ',menubar=false,toolbar=false,location=false,resizabie=no,scrollbars=yes,status=false';
							windowOpen('manualVersion.html', winProp);
						}
					}
				}
			}, false); // false - фаза "всплытие"
			// 'click
			document.getElementById('idContentText').addEventListener('click', function (e) {
				if (e.target.tagName === "IMG") {
					if (e.target.classList.contains('toggle-icon')) {
						// *в текущем абзаце отображаем/скрываем каждый скрытый контент
						setToggleContent(e.target); // переключатель скрытого контента
					}
				}
			}, false); // false - фаза "всплытие"
		}
		if (getBrowser().toString().toLowerCase() === "firefox") { // для firefox - скрытие вплывающих элементов, подсказок
			if (document.documentElement.clientWidth < 501) {
				// (!) idTopicFooter
				if (document.getElementById('idTopicFooter') !== null && typeof(document.getElementById('idTopicFooter')) === "object") {
					// 'click
					document.getElementById('idTopicFooter').addEventListener('click', function (e) {
						if (e.target.id === "idTopicFooter") {
							e.target.classList.toggle('footer-max');
						} else {
							let elem = e.target;
							while (elem.parentElement.id !== "idTopicBox") {
								elem = elem.parentElement;
							}
							if (elem.id === "idTopicFooter") {
								elem.classList.toggle('footer-max');
							}
						}
						document.addEventListener('click', handlerPoPuPs, { capture: true }); // создаем обработчик для всего док.
					}, false); // false - фаза "всплытие"
				}
			}
		}
	}
}); // ready end
function handlersEventsUserInter(eVent) {
	let elems = {
		ui: document.querySelector('.user-interaction'),
		btns: {
			accept: document.getElementById('idAccept'),
			reject: document.getElementById('idReject'),
		},
		getCurrentElement() {
			let elem = null;
			if (this.btns.accept.classList.contains('btn-un-current')) { // не текущий
				elem = this.btns.reject;
			} else if (this.btns.reject.classList.contains('btn-un-current')) { // не текущий
				elem = this.btns.accept;
			} else {
				elem = this.ui;
			}
			return elem;
		},
	};
	function setBtnCmd(cmd = "idAccept") {
		// 'cmd: id div.btns-user-inter
		if (cmd === "idAccept") { // так же сработает и по умолчанию
			setItemSessionStorage("allowPlayback", true); // установить выбранное разрешение на воспроизведение
		} else if (cmd === "idReject") {
			setItemSessionStorage("allowPlayback", false); // установить выбранное разрешение на воспроизведение
		} else { // ""/null
			setItemSessionStorage("allowPlayback", false); // установить выбранное разрешение на воспроизведение
		}
		if (elems.ui !== null && elems.ui === Object(elems.ui)) {
			elems.ui.style.display = "none";
			elems.ui.remove(); // удаляем узел div.user-interaction
			setEventHandlersUserInter(elems.ui, "remove");
		}
	}
	function setBtnCurrent(eventCode = "") {
		let elem = elems.getCurrentElement();
		if (eventCode === "") {
			if (eVent.type === "mouseover") {
				if (eVent.target.id === "idAccept") {
					elems.btns.accept.classList.remove('btn-un-current');
					elems.btns.reject.classList.add('btn-un-current'); // не текущий
				} else if (eVent.target.id === "idReject") {
					elems.btns.reject.classList.remove('btn-un-current');
					elems.btns.accept.classList.add('btn-un-current'); // не текущий
				}
			}
		} else {
			if (elem.classList.contains('user-interaction')) {
				elems.btns.reject.classList.add('btn-un-current'); // по умолчанию
			} else if (elem.classList.contains('btns-user-inter')) {
				for (const item in elems.btns) {
					if (eventCode === "Tab") {
						elems.btns[item].classList.toggle('btn-un-current'); // не текущий
					} else if (eventCode === "PageUp" || eventCode === "Home" || eventCode === "ArrowLeft" || eventCode === "ArrowUp") {
						if (elems.btns[item].id === "idAccept") {
							elems.btns[item].classList.add('btn-un-current'); // не текущий
						} else if (elems.btns[item].id === "idReject") {
							elems.btns[item].classList.remove('btn-un-current');
						}
					} else if (eventCode === "PageDown" || eventCode === "End" || eventCode === "ArrowRight" || eventCode === "ArrowDown") {
						if (elems.btns[item].id === "idAccept") {
							elems.btns[item].classList.remove('btn-un-current');
						} else if (elems.btns[item].id === "idReject") {
							elems.btns[item].classList.add('btn-un-current'); // не текущий
						}
					}
				}
			} else {
				console.error(`(!) Косяк - не удалось установить текущий элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n setBtnCurrent(elem: ${elems}, eventCode: «${eventCode}»): window."${window.name}", location.origin: ${location.origin}:\n document.activeElement: ${document.activeElement}`);
				alert(`(!) Косяк - не удалось установить текущий элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
			}
		}
	}
	// '
	if (eVent.type === "mouseover") {
		if (eVent.target.hasAttribute('class')) {
			if (eVent.target.classList.contains('btns-user-inter')) {
				setBtnCurrent();
				function userInter_onMouseout(evn) {
					for (const item in elems.btns) {
						elems.btns[item].classList.remove('btn-un-current');
					}
					evn.target.removeEventListener('mouseout', userInter_onMouseout, false);
				}
				eVent.target.addEventListener('mouseout', userInter_onMouseout, false);
			}
		}
	} else if (eVent.type === "click") {
		if (eVent.target.hasAttribute('class')) {
			if (eVent.target.classList.contains('btns-user-inter')) {
				// elems.ui.removeEventListener('mouseover', handlersEventsUserInter, false);
				setBtnCmd(eVent.target.id);
			}
		}
	} else if (eVent.type === "keydown") {
		eVent.preventDefault(); // отменяем действия браузера по умолчанию
		// (i) event.code всегда содержит только одно латинское обозначение в отличие от event.key, кот.содержит обозначение относительно раскладки клавиатуры
		if (eVent.code === "Tab" || eVent.key === "Tab" || eVent.keyCode === 9 || eVent.which === 9) {
			setBtnCurrent(eVent.code);
		} else if (eVent.code === "Enter" || eVent.key === "Enter" || eVent.keyCode === 13 || eVent.which === 13) {
			let elem = elems.getCurrentElement();
			if (elem.hasAttribute('id')) {
				setBtnCmd(elem.id);
			} else { //.user-interaction
				// setBtnCmd(elems.btns.accept.id); // или так
				setBtnCmd(); // по умолчанию
			}
		} else if (eVent.code === "Escape" || eVent.key === "Escape" || eVent.keyCode === 27 || eVent.which === 27) {
			// (?)~esc не инициирует взаимодействие с юзером, но это учтено в ф.getPlayback()
			// setBtnCmd(elems.btns.reject.id); // или так
			setBtnCmd(""); // или ""/null
		} else if (eVent.code === "PageUp" || eVent.key === "PageUp" || eVent.keyCode === 33 || eVent.which === 33) {
			setBtnCurrent(eVent.code);
		} else if (eVent.code === "PageDown" || eVent.key === "PageDown" || eVent.keyCode === 34 || eVent.which === 34) {
			setBtnCurrent(eVent.code);
		} else if (eVent.code === "End" || eVent.key === "End" || eVent.keyCode === 35 || eVent.which === 35) {
			setBtnCurrent(eVent.code);
		} else if (eVent.code === "Home" || eVent.key === "Home" || eVent.keyCode === 36 || eVent.which === 36) {
			setBtnCurrent(eVent.code);
		} else if (eVent.code === "ArrowLeft" || eVent.key === "ArrowLeft" || eVent.keyCode === 37 || eVent.which === 37) {
			setBtnCurrent(eVent.code);
		} else if (eVent.code === "ArrowUp" || eVent.key === "ArrowUp" || eVent.keyCode === 38 || eVent.which === 38) {
			setBtnCurrent(eVent.code);
		} else if (eVent.code === "ArrowRight" || eVent.key === "ArrowRight" || eVent.keyCode === 39 || eVent.which === 39) {
			setBtnCurrent(eVent.code);
		} else if (eVent.code === "ArrowDown" || eVent.key === "ArrowDown" || eVent.keyCode === 40 || eVent.which === 40) {
			setBtnCurrent(eVent.code);
		}
	}
}
function setEventHandlersUserInter(elem, addOrRemove = "") {
	if (addOrRemove = "") {
		console.error(`(!) Косяк - не удалось создать обработчик событий всплывающему элементу для взаимодействия с пользователем - не найден элемент:\n function setHandlersEventsUserInter(elem: ${elem}, addOrRemove: «${addOrRemove}»), window.«${window.name}», location.origin: ${location.origin}`);
		alert(`(!) Косяк - не удалось создать обработчик событий всплывающему элементу для взаимодействия с пользователем - не найден элемент, см.консоль.`);
		return;
	}
	//'
	if (addOrRemove = "add") {
		elem.addEventListener('keydown', handlersEventsUserInter, false);
		elem.addEventListener('mouseover', handlersEventsUserInter, false);
		elem.addEventListener('click', handlersEventsUserInter, false);
	} else if (addOrRemove = "remove") {
		elem.removeEventListener('keydown', handlersEventsUserInter, false);
		elem.removeEventListener('mouseover', handlersEventsUserInter, false);
		elem.removeEventListener('click', handlersEventsUserInter, false);
	}
}
// (!) создание всплывающего элемента для взаимодействия с пользователем
function writeUserInteraction() {
	let userInter = document.querySelector('.user-interaction');
	if (userInter !== null && userInter === Object(userInter)) return userInter;

	const arr = Array.prototype.slice.call(document.querySelectorAll('noscript')); // преобразуем NodeList в массив // (!) Array.prototype.slice.call - не сработает для IE8
	if (arr.length > 0) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].textContent.indexOf(`class="user-interaction"`) !== -1) {
				arr[i].insertAdjacentHTML('afterend', '<div class="user-interaction" style="display: none;"><div class="box-user-inter"><span></span><span></span><span></span><span></span><p>Разрешить<br>сопровождение анимационных эффектов звуковыми воспроизведениями?</p><div id="idReject" class="btns-user-inter">Отклонить</div><div id="idAccept" class="btns-user-inter">Принять</div></div></div>');
				break;
			}
		}
		function getUserInter() {
			const elem = document.querySelector('.user-interaction');
			if (elem !== null && elem === Object(elem)) {
				setEventHandlersUserInter(elem, "add");
			}
			return elem;
		}
		userInter = getUserInter();
		let idInt = setInterval(() => {
			if (userInter !== null && userInter === Object(userInter)) {
				clearInterval(idInt);
				// userInter.setActive(); // (?)'браузер ругается
				setFocus(userInter, "focusIn");
			} else {
				userInter = getUserInter();
			}
		}, 500);
		return userInter;
	} else {
		console.error(`(!) Косяк - не удалось создать всплывающий элемент для взаимодействия с пользователем - не найден элемент:\n function writeUserInteraction(), window.«${window.name}», location.origin: ${location.origin}:\n elem: ${elem}`);
		alert(`(!) Косяк - не удалось создать всплывающий элемент для взаимодействия с пользователем - не найден элемент, см.консоль.`);
		return null;
	}
}
// (!) заполнение топика навигационными ссылками
function writeBreadCrumbs(navlinks = []) {
	// let elem = document.getElementById('idNavLinks').querySelector('.sync-toc-off');
	let elem = document.getElementById('idNavLinks').querySelector('noscript');
	if (elem === null || typeof(elem) === "undefined" || typeof(elem) !== "object" || elem !== Object(elem)) { // 'не объект/не объект HTMLElement
		console.error(`(!) Косяк - не удалось создать навигационные ссылки - не найден элемент:\n function writeBreadCrumbs(navlinks.length: ${navlinks.length}), window.«${window.name}», location.origin: ${location.origin}:\n 1) elem === null: ${elem === null}\n 2) typeof(elem) === "undefined": ${typeof(elem) === "undefined"}\n 3) typeof(elem) !== "object": ${typeof(elem) !== "object"}\n 4) elem !== Object(elem): ${elem !== Object(elem)}`);
		alert(`(!) Косяк - не удалось создать навигационные ссылки - не найден элемент, см.консоль.`);
		return;
	}
	if (navlinks.length === 0 || (window === top && window.name === "")) {
		elem.insertAdjacentHTML('afterend', '<span class="sync-toc-off">»Нет темы выше этого уровня«</span>');
	} else if (navlinks.length > 0 || (self !== top && window.name !== "")) {
		let strHTML = "";
		for (let i = 0; i < navlinks.length; i++) {
			if (navlinks.length === i + 1) {
				strHTML = strHTML + '<span class="sync-toc-off"><a href="' + navlinks[i][0] + '" target="' + window.name + '">' + navlinks[i][1] + '</a>:</span>';
			} else {
				strHTML = strHTML + '<span class="sync-toc-off"><a href="' + navlinks[i][0] + '" target="' + window.name + '">' + navlinks[i][1] + '</a>&nbsp;&#47;&ensp;</span>';
			}
			// (i) если массив был заполнен добавлением в конец, см.ф.getBreadCrumbs()
			// if (i === 0) {
			// 	strHTML = '<span class="sync-toc-off"><a href="' + navlinks[i][0] + '" target="' + window.name + '">' + navlinks[i][1] + '</a>:</span>' + strHTML;
			// } else {
			// 	strHTML = '<span class="sync-toc-off"><a href="' + navlinks[i][0] + '" target="' + window.name + '">' + navlinks[i][1] + '</a>&nbsp;&#47;&ensp;</span>' + strHTML;
			// }
		}
		elem.insertAdjacentHTML('afterend', strHTML);
	}
}
// (!) создать содержание страницы
function setPageToc() {
	// (i) по умолчанию idPageMenuToc отображает подсказку, если на тек.стр.отсутствует содержание
	let tocMenu = document.getElementById('idTopicBox').querySelector('.toc-menu');
	if (tocMenu === null) {
		if (tocMenu === null || typeof(tocMenu) === "undefined" || typeof(tocMenu) !== "object" || tocMenu !== Object(tocMenu)) { // 'не объект/не объект HTMLElement
			console.error(`(!) Косяк - не удалось создать содержание страницы - не найден элемент:\n function setPageToc(), window.«${window.name}»:\n tocMenu: ${tocMenu}`);
			alert(`(!) Косяк - не удалось создать содержание страницы - не найден элемент, см.консоль.`);
			return false;
		}
	}
	let img = document.getElementById('idPageIconToc');
	let arr = Array.from(document.getElementById('idTopicBody').querySelectorAll('h1, h2, h3, h4, h5, h6'));
	if (arr.length > 0) {
		tocMenu.classList.remove('toc-menu-title');
		tocMenu.innerText = ""; // - очищаем от текста-title
		let tocList = document.createElement('ul');
		tocList.classList.add('toc-list');
		tocMenu.appendChild(tocList);
		arr.forEach(elem => {
			tocList.insertAdjacentHTML('beforeend', '<li><a href="#' + elem.id + '">' + elem.innerHTML + '</a></li>');
		});
		if (img !== null && img === Object(img)) {
			if (img.getAttribute('src') !== "icon/toc-menu_on.png") {
				img.setAttribute('src', 'icon/toc-menu_on.png');
			}
		}
		img.setAttribute('title', 'Показать/Скрыть содержание на текущей странице');
		return true;
	} else { // если на стр.отсутствует содержание
		if (img !== null && img === Object(img)) {
			tocMenu.classList.add('toc-menu-title');
			tocMenu.innerHTML = img.title;
		}
		return false;
	}
}
// (!) showComments - см.файл comments.js
function showComments(params) {
	alert(`(i) Функция показать комментарий(-и) пока что в разработке.`);
}
// (!) writeCommentLink - см.файл comments.js
function writeCommentLink(params) { }
// (!) заполнение окна инфо
function setMsgBox(msgBox = "enable", msgBtn = true, msgText = "Информация отсутствует", msgEffect = "on") {
	// (?)'перем.аргум.имеющая знач.по умолчанию может быть изменена и выглядить типа "Null", что неприемлемо
	if (msgBox === "disable") return; // (i) в условии намеренно не используется проверка на null/""/undefined, чтобы в переменной аргумента этот параметр можно было опускать как необязательный
	if (window === self || self !== top || window !== top && window.name !== "") {
		if (msgText === "") {
			console.error(`(!) Косяк - не удалось создать всплывающее окно сообщения. Отсутствует контент-текст, либо переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setMsgBox(msgBox = "${msgBox}", msgBtn = ${msgBtn}, msgText = "${msgText}", msgEffect = ${msgEffect}):\n window."${window.name}", location.origin: ${location.origin}`);
			alert(`(!) Косяк - не удалось создать всплывающее окно сообщения. Отсутствует контент-текст, либо переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
			return;
		}
	}
	let elem = document.getElementById('idMsgBox');
	if (elem !== null && elem === Object(elem)) { // 'объект HTMLElement
		document.getElementById('idMsgText').innerHTML = msgText;
		let cnt = document.getElementById('idMsgContent');
		let btn = document.getElementById('idBtnToggleMsgBox');
		if (btn !== null && btn === Object(btn)) {
			if (msgBtn) {
				btn.classList.replace('msg-hide', 'msg-show'); // или так
				// x // btn.classList.add('msg-show');
				// x // btn.classList.remove('msg-hide');
				// x // document.getElementById('idMsgContent').removeAttribute('style');
			} else {
				btn.classList.replace('msg-show', 'msg-hide'); // или так
				// x // btn.classList.add('msg-hide');
				// x // btn.classList.remove('msg-show');
				// x // document.getElementById('idMsgContent').style.display = "none";
			}
		}
		// *режим эфф.переключения освещения
		btn = document.getElementById('idBtnLightSwitch'); // переназначаем на др.элемент
		if (btn !== null && btn === Object(btn)) {
			let icon = document.getElementById('idIconLightSwitch');
			if (icon !== null && icon === Object(icon)) {
				if (msgEffect === "on") {
					icon.classList.add('msg_icon-eff_on');
					icon.classList.remove('msg_icon-eff_bgr');
					icon.classList.remove('msg_icon-eff_off');
					elem.classList.replace('msg-eff-off','msg-effect');
				} else if (msgEffect === "bgr") {
					icon.classList.add('msg_icon-eff_bgr');
					icon.classList.remove('msg_icon-eff_on');
					icon.classList.remove('msg_icon-eff_off');
					cnt.classList.add('msg-bgr-content');
					elem.classList.replace('msg-eff-off','msg-effect');
				} else if (msgEffect === "off") {
					icon.classList.add('msg_icon-eff_off');
					icon.classList.remove('msg_icon-eff_on');
					icon.classList.remove('msg_icon-eff_bgr');
					cnt.classList.remove('msg-bgr-content');
					elem.classList.replace('msg-effect','msg-eff-off');
				}
			}
			let info2 = btn.parentElement.querySelector('.tooltip-lightswitch-info2');
			for (let i = 0; i < info2.children.length; i++) {
				if (info2.children[i].hasAttribute('mode')) {
					if (info2.children[i].getAttribute('mode') === msgEffect) {
						info2.children[i].removeAttribute('style');
					} else {
						info2.children[i].style.display = "none";
					}
				}
			}
			elem.removeAttribute('style'); // удаляем style="display: none;"
		}
	}
	// *проверяем наличие ссылки на файл msgbox.js и создаем обработчики событий
	// 'лапатим все скрипты во фрейме
	if (!getScript(window.self, "js/msgbox.js")) { // - получить скрипт - ссылка на js-файл
		// ''создаем и проверяем объект - ссылка на js-файл
		if (!setScript(window.self, "js/msgbox.js")) { // - создать скрипт - ссылка на js-файл
			console.error(`(!) Косяк - не удалось создать ссылку на скрипт для инфо-сообщения:\n function setMsgBox(msgBox = "${msgBox}", msgBtn = ${msgBtn}, msgText = "${msgText}", msgEffect = ${msgEffect}): window.«${window.name}», location.origin: ${location.origin}`);
			alert(`(!) Косяк - не удалось создать ссылку на скрипт для инфо-сообщения, см.консоль.`);
			return;
		}
	}
	let js = document.querySelector('script[src=' + '"js/msgbox.js"' + ']');
	if (js === null || (js === null && js === Object(js))) { // - протестить после правки
		// (?)(!) не понятно почему, без этой комбинации генерируется ошибка, несмотря на то, что скрипт создается и эл.предварительно сразу же обнаруживается
		let idInt = setInterval(() => {
			js = document.querySelector('script[src=' + '"js/msgbox.js"' + ']');
			if (js !== null && !(js === null && js === Object(js))) {
				clearInterval(idInt);
				setEventHandlersMsgBox(elem, 'add'); // создание/удаление обработчиков событий для узла MsgBox
			}
		}, 500);
	} else {
		setTimeout(() => {
			setEventHandlersMsgBox(elem, 'add'); // создание/удаление обработчиков событий для узла MsgBox
		}, 1000);
	}
}
// writeMsgBox // x создать всплывающее окно сообщения
function writeMsgBox(msgBox = "enable", msgBtn = false, msgText = "") {
	if (msgBox === "disable") return; // (i) в условии намеренно не используется проверка на null/""/undefined, чтобы в переменной аргумента этот параметр можно было опускать как необязательный
	if (msgText === "") {
		console.error(`(!) Косяк - не удалось создать всплывающее окно сообщения. Отсутствует информационный текст, либо переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function writeMessage(msgText = "${msgText}")`);
		alert(`(!) Косяк - не удалось создать всплывающее окно сообщения. Отсутствует информационный текст, либо переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	// *проверяем существование узла, если он существует, назначаем ему обработчик события, если нет, создаем его.
	if (document.getElementById('idMsgBox') === null && document.getElementById('idMsgBox') !== Object(document.getElementById('idMsgBox'))) { // 'НЕ объект HTMLDivElement
		let elem = document.getElementById('idTopicBody');
		if (elem === null || typeof(elem) === "undefined" || typeof(elem) !== "object" || elem !== Object(elem)) {
			console.error(`(!) Косяк - не удалось определить положение для вставки всплывающего окна сообщения:\n function writeMsgBox(msgBox = "${msgBox}", msgBtn = ${msgBtn}, msgText = "${msgText}"):\n elem: ${elem} / typeof(${typeof(elem)}) / ${Object(elem)}`);
			alert(`(!) Косяк - не удалось определить положение для вставки всплывающего окна сообщения, см.консоль.`);
			return;
		}
		// *добавляем узел
		if (msgBtn) {
			elem.insertAdjacentHTML('beforebegin', '<div id="idMsgBox" class="msg-box"><div id="idMsgContent" class="msg-content"><div id="idIconLightSwitch" class="msg-info"></div><div id="idMsgText" class="msg-text"><p>' + msgText + '</p></div></div><div id="idBtnToggleMsgBox" class="msg-btn msg-show" title="Скрыть/Показать информационное сообщение">«</div></div>');
		} else {
			elem.insertAdjacentHTML('beforebegin', '<div id="idMsgBox" class="msg-box"><div id="idMsgContent" class="msg-content" style="display: none;"><div id="idIconLightSwitch" class="msg-info"></div><div id="idMsgText" class="msg-text"><p>' + msgText + '</p></div></div><div id="idBtnToggleMsgBox" class="msg-btn msg-hide" title="Скрыть/Показать информационное сообщение">«</div></div>');
		}
	}
	// *создаем обработчик события
	document.getElementById('idMsgBox').addEventListener('click', function (e) {
		if (e.target.tagName === "DIV") {
			if (e.target.id === "idBtnToggleMsgBox") {
				toggleMsgBox(e.target); // - скрыть/показать всплывающее окно сообщения
			}
		}
	}, false); // - false - фаза "всплытие"
}
// (!) переключатель скрытого контента
function setToggleContent(elem) {
	// elem - tagName a/img //~null (для кн.div.toolbar_box-center>img: idExpandOn/idExpandOff)
	if (!elem === null && !elem.classList.contains('toggle-icon') && !elem.classList.contains('toggle-inline') && !elem.classList.contains('toggle-dropdown')) {
		console.error("(!) Косяк - не удалось переключить скрытый контент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setToggleContent(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin);
		alert(`(!) Косяк - не удалось переключить скрытый контент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	// *проверяем наличие ссылки на файл lightbox.js
	let js = document.querySelector('script[src=' + '"js/lightbox.js"' + ']');
	if (js === null || js !== Object(js)) {
		// *лапатим все скрипты во фрейме
		if (!getScript(window.self, "js/lightbox.js")) { // - получить скрипт - ссылка на js-файл
			// *создаем и проверяем объект - ссылка на js-файл
			if (!setScript(window.self, "js/lightbox.js")) { // - создать скрипт - ссылка на js-файл
				console.error("(!) Косяк - не удалось создать ссылку на скрипт для скрытого контента:\n function setToggleContent(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin, "js: ", js);
				alert(`(!) Косяк - не удалось создать ссылку на скрипт для скрытого контента, см.консоль.`);
				return;
			}
		}
	}
	// (?)(!) не понятно почему, без этой комбинации генерируется ошибка, несмотря на то, что скрипт создается и эл.предварительно сразу же обнаруживается
	let idInt = setInterval(() => {
		js = document.querySelector('script[src=' + '"js/lightbox.js"' + ']');
		if (js !== null && js === Object(js)) {
			clearInterval(idInt);
			if (elem !== null && elem === Object(elem)) {
				setToggleElement(elem); // развернуть/свернуть скрытый контент // (i) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
			} else {
				setToggleElement(null); // развернуть/свернуть скрытый контент // (i) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
			}
		}
	}, 500); return;
	// x -
	// if (js !== null && js === Object(js)) {
	// 	if (elem !== null && elem === Object(elem)) {
	// 		setToggleElement(elem); // развернуть/свернуть скрытый контент // (i) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
	// 	} else if (btnValue !== null && typeof(btnValue) === "boolean") {
	// 		setToggleElement(null, btnValue); // развернуть/свернуть скрытый контент // (i) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
	// 	}
	// } else {
	// 	js = document.querySelector('script[src=' + '"js/topic.js"' + ']') || document.querySelector('script[src=' + '"js/index.js"' + ']');
	// 	if (js === null || js !== Object(js)) {
	// 		// *лапатим все скрипты во фрейме
	// 		if (!getScript(window.self, "js/lightbox.js")) { // - получить скрипт - ссылка на js-файл
	// 			setScript(window.self, "js/lightbox.js"); // - создать скрипт - ссылка на js-файл
	// 		}
	// 	} else {
	// 		if (js !== null && js === Object(js)) {
	// 			// *создаем и проверяем объект - ссылка на js-файл
	// 			let jsNew = document.createElement('script');
	// 			jsNew.src = "js/lightbox.js";
	// 			js.after(jsNew);
	// 			// (?)(!) не понятно почему, без этой комбинации генерируется ошибка, несмотря на то, что скрипт создается и эл.предварительно сразу же обнаруживается
	// 			let idInt = setInterval(() => {
	// 				js = document.querySelector('script[src=' + '"js/lightbox.js"' + ']');
	// 				if (js !== null && js === Object(js)) {
	// 					clearInterval(idInt);
	// 					if (elem !== null && elem === Object(elem)) {
	// 						setToggleElement(elem); // развернуть/свернуть скрытый контент // (i) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
	// 					} else if (btnValue !== null && typeof(btnValue) === "boolean") {
	// 						setToggleElement(null, btnValue); // развернуть/свернуть скрытый контент // (i) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
	// 					}
	// 				}
	// 			}, 500); return;
	// 		}
	// 	}
	// }
}
// (!) получить св-ва для кн.скрытого контента на панели toolbabar в гл.окне
function getButtonExpand() {
	// 'status - опр.наличие скрытого контента для устаноки доступа к кн.
	// value - опр.значение скрытости/отображения в текущ.момент
	return {
		status: document.getElementById('idContentText').querySelectorAll('.toggle-content').length > 0 ? "enable" : "disable",
		value: document.getElementById('idContentText').querySelectorAll('.toggle-content:not(.toggle-collapse)').length > 0 ? true : false
	}
}