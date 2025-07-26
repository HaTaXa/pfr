// (!) DOMContentLoaded
// document.addEventListener('DOMContentLoaded', function () {}, false); // - js. Дожидаемся, когда Объектная модель документа страницы (DOM) будет готова к выполнению кода JavaScript
// (!) window load
window.addEventListener('load', function () { // - js. Сработает, как только вся страница (изображения или встроенные фреймы), а не только DOM, будет готово
	if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании
		window.sessionStorage.setItem('webReadyState', document.readyState);
	}
	// x -
	// *обновляем глобальные переменные в variables.js
	// (i) если вариант 1
	// if (vrsPermalink.url !== location.href) { // 'перестраховка
	// 	vrsPermalink.url = location.href;
	// }
	// if (location.search !== "") {
	// 	if (vrsTopic.currP !== location.search.replace("?", "")) {
	// 		vrsTopic.currP = vrsNavigation.def = vrsNavigation.query = window.location.search.substring(1).replace(/:/g, "");
	// 	}
	// }
	// (i) если вариант 2
	// if (vrsPermalink.url !== location.href) {
	// 	vrsPermalink.url = location.href;
	// }
	// if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
	// 	let msg = {
	// 		value: location.search === "" ? "setVariables" : "goToPage",
	// 		currP: vrsTopic.currP
	// 	};
	// 	frames.ifrmnavigation.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
	// } else {
	// 	if (location.search === "") {
	// 		document.getElementById('ifrmnavigation').contentWindow.setVariables(null, vrsTopic.currP); // - обновление глобальных переменных в variables.js
	// 	} else {
	// 		if (vrsTopic.currP !== location.search.replace("?", "")) {
	// 			vrsTopic.currP = vrsNavigation.def = vrsNavigation.query = window.location.search.substring(1).replace(/:/g, "");
	// 		}
	// 		document.getElementById('ifrmnavigation').contentWindow.goToPage(null, vrsTopic.currP); // - перейти на страницу выполнив обновление глобальных переменных в variables.js
	// 	}
	// }
}, false); // false - фаза "всплытие"
// (!) popstate
// window.addEventListener('popstate', (event) => {
// 	// (?) не понятно, почему то при возврате по ссылкам история не очищается, но навигация вперед уже не доступна
// 	if (location.search !== "") {
// 		getFrame().src = location.search.substring(1).replace(/:/g, ""); // или
// 		// getFrame().setAttribute('src', location.search.substring(1).replace(/:/g, ""));
// 	}
// }, false); // false - фаза "всплытие"
// (!) resize
// window.addEventListener('resize', function (e) {
// работает, НО не используется в деле
// 	setElemExclude(e); // исключение элементов, например контролы в пан.инстр.
// }, false);
// (!) document
$(document).ready(function () { // - jq
	if (document !== null && typeof(document) === "object") {
		if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании
			window.sessionStorage.setItem('webReadyState', document.readyState);
		}
			// (!) message
		window.addEventListener('message', (event) => {
			// console.log(`window.addEventListener('message', (event)): window.«${window.name}», location.origin: ${location.origin}:\n event.origin === 0: ${event.origin === 0}\n event.data: ${JSON.stringify(event.data, null, 1)}`); // x -
			if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
				if (event.data.value === "setHistoryState") {
					// (?)'replace/push
					if (event.data.winName === "ifrmnavigation") { // (?)-x-
						console.log(`из пан.нав.ф.setHistoryState() отменена`);

						setHideNavPane(); // скрыть пан.нав.при размере окна браузера <= 500
					} else {
						setHistoryState("push", event.data.href); // сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
					}
				} else if (event.data.value === "setHideNavPane") { // (?)
					setHideNavPane(); // скрыть пан.нав.при размере окна браузера <= 500
				} else if (event.data.value === "setVariables" || event.data.value === "goToPage") {
					// x // setUpdateVariables(event.data.vrsTopic, event.data.vrsNavigation); // обновляем некоторые глобальные переменные в variables.js из iframe текущего топика
					// (i) если вариант 1
					// *получаем остальную часть глобальных переменных в variables.js через ifrmnavigation
					let msg = {};
					if (event.data.value === "setVariables") {
						if (location.search === "") {
							msg.value = event.data.value;
							msg.currP = event.data.currP;
							msg.hash = event.data.hash;
						} else { // если при первичной загрузке сайта загружается др.стр.с темой топика
							msg.value = "goToPage";
							msg.href = (event.data.hash === "") ? event.data.currP : event.data.currP + "#" + event.data.hash;
						}
						frames.ifrmnavigation.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
					} else if (event.data.value === "goToPage") { // (i) для доп.условия проверки, можно воспользоваться тем, что созданный ключ в sessionStorage был удален после первичной загрузки сайта, кот.будет возвращать null
						msg.value = event.data.value;
						msg.href = event.data.href;
						frames.ifrmnavigation.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
					}
					if (msg.value === "goToPage") {
						let tab = document.querySelector('.tab-current');
						if (tab === null && tab !== Object(tab)) {
							tab = document.getElementById('idTopicTab'); // вкладка текущ.топика по умолчанию
						}
						setTabVisibility(tab, "show"); // показать/скрыть текущую вкладку
						setHistoryState("push", event.data.href); // сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
					}
					msg.value = "loadComplete"; // изменяем значение св-ва в объекте
					// *удаляем св-во в объекте
					delete msg.currP;
					delete msg.href;
					delete msg.hash;
					// 'создаем/добавляем новое св-во в объекте - 2 способа:
					setTimeout(() => { // нужна небольшая выдержка времени
						msg.breadCrumbs = vrsNavigation.breadCrumbs;
						if (vrsTopic.msgBox === "enable") {
							msg.msgBox = vrsTopic.msgBox;
							msg.msgBtn = vrsTopic.msgBtn;
							msg["msgText"] = vrsTopic.msgText;
							msg.msgEffect = vrsTopic.msgEffect;
						}
						// *возвращаемся обратно в источник iframe текущего топика с переданными значениями глобальных переменных из variables.js и создаем и/или обновляем остальные элементы в текущем топике
						event.source.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
					}, 500);
				} else if (event.data.value === "setUpdateVariables") {
					// *обновляем глобальные переменные из ifrmnavigation
					// if (location.search === "") { // test - в navigetion.js тоже поправить
					// 	setUpdateElements(); // обновляем группу кнопок навигации на пан.инструментов (домой/назад/вперед), кнопку-переключатель скрытого контента, наименование текущей вкладки на пан.топика, ссылку на текущую тему в текущ.вкладке топика в меню вкладок, а так же аттрибут(-ы) фрейма
					// } else {
					// 	setUpdateVariables(
					// 		event.data.vrsTopic,
					// 		event.data.vrsNavigation,
					// 		event.data.vrsPermalink
					// 	);
					// 	setUpdateElements(event.data.topic, event.data.navpane); // обновляем группу кнопок навигации на пан.инструментов (домой/назад/вперед), кнопку-переключатель скрытого контента, наименование текущей вкладки на пан.топика, ссылку на текущую тему в текущ.вкладке топика в меню вкладок, а так же аттрибут(-ы) фрейма
					// }
					// (?)'test
					setUpdateVariables(
						event.data.vrsTopic,
						event.data.vrsNavigation,
						event.data.vrsPermalink
					);
					setUpdateElements(); // обновляем группу кнопок навигации на пан.инструментов (домой/назад/вперед), кнопку-переключатель скрытого контента, наименование текущей вкладки на пан.топика, ссылку на текущую тему в текущ.вкладке топика в меню вкладок, а так же аттрибут(-ы) фрейма
					// *проверяем размер окна браузера для определения запуска анимации скрытия пан.нав., если она занимает весь экран
					if (document.documentElement.clientWidth < 501) {
						setHideNavPane(); // - скрыть пан.нав.
					}
					// if (event.data.vrsNavigation.hash === "") { // 'через ifrmnavigation можно попасть из ф.setTabVisibility(), так что проверка hash обязательно
					// 	setHistoryState("push", event.data.vrsTopic.currP); // сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
					// } else {
					// 	setHistoryState("push", event.data.vrsTopic.currP + "#" + event.data.vrsNavigation.hash); // сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
					// } // test
				} else if (event.data.value === "setButtonExpand") {
					setButtonExpand(event.data.status); // установить статус кн.для скрытого контента
				} else if (event.data.value === "msgBoxUpdate") {
					// *обновляем глобальную переменную в variables.js
					vrsTopic.msgBtn = event.data.msgBtn;
					vrsTopic.msgEffect = event.data.msgEffect;
				} else if (event.data.value === "setImageFullScreen") {
					// 'image full screen - вывод текущего lightbox в гл.окне
					// (i)~нельзя передать узел/копию DOM-элемента в другое окно/фрейм, см.спецификацию, поэтому передаем узел в виде строки методом parseFromString() объекта DOMParser()
					function stringToHTML(htmlString) {
						const parser = new DOMParser();
						const doc = parser.parseFromString(htmlString, 'text/html'); // text/xml
						return doc.body.firstChild;
					};
					const lbx = stringToHTML(event.data.lbxString);
					if (lbx !== null && lbx === Object(lbx)) {
						// *проверяем наличие ссылки на файл lightbox.js
						// **получить скрипт - ссылка на lightbox.js
						if (getScript(window, "js/lightbox.js")) { // (i) если еще ни разу не было ни одного раскрытия скрытого контента на стр.
							setImageFullScreen(lbx); // - вывод текущего lightbox в гл.окне
						} else {
							let js = setScript(window, "js/lightbox.js"); // - создать скрипт - ссылка на js-файл
							let idInt = setInterval(() => {
								if (js) {
									clearInterval(idInt);
									setImageFullScreen(lbx); // - вывод текущего lightbox в гл.окне
								}
							}, 500);
						}
					}
				} else if (event.data === "getFrame") {
					getFrame(); // получить фрейм текущей вкладки или фрейм вкладки гл.топика по умолчанию
				} else if (event.data.value === "getTargetWindow") {
					if (event.data.wndName === "ifrmkeywords") {
						// *вернуть обратно в источник keywords полученное имя фрейма
						let msg = {
							value: "handlerTargetWindow",
							frmName: getTargetWindow(event.data.src), // получить целевое окно среди имеющихся топиков/клонов
							src: event.data.src,
						}; // href: (vrsNavigation.hash > 0) ? vrsTopic.currP + "#" + vrsNavigation.hash : vrsTopic.currP,
						event.source.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
					}
				} else if (event.data.value === "setTargetWindow") {
					// *установить целевое окно
					setTargetWindow(event.data.frmName);
				} else if (event.data.value === "handlerPoPuPs") {
					// *скрываем всплывающие эл.в текущем окне
					handlerPoPuPs(event); // обработчик вплывающих эл.
					// event.data.id.forEach((item) => { // x - на удаление
					// 	if (item === "idPermalinkBox") { // всплывающий(-е) эл.в гл.окне
					// 		let elem = document.getElementById(item);
					// 		if (elem !== null && elem === Object(elem)) {
					// 			setClearPermalink(); // очистить окно Постоянная ссылка
					// 			if (elem.classList.contains('permalink-popup')) {
					// 				// x // setShowOrHide(document.getElementById(item), event.data.hide);
					// 				elem.classList.remove('permalink-popup');
					// 				setEventHandlersPermalink(elem, 'remove'); // создание/удаление обработчиков событий для узла permalink
					// 			}
					// 		}
					// 	} else if (item === "idTabsMenuBox") { // всплывающий(-е) эл.в гл.окне
					// 		let elem = document.getElementById(item);
					// 		if (elem !== null && elem === Object(elem)) {
					// 			if (elem.classList.contains('tabs-menu-popup')) {
					// 				// setShowOrHide(elem, "", "", "", "tabs-menu-popup");
					// 				elem.classList.remove('tabs-menu-popup');
					// 			}
					// 		}
					// 	} else if (item === "idPageMenuToc") { // всплывающий(-е) эл.в топике
					// 		let msg = {
					// 			value: event.data.value,
					// 			id: item
					// 		};
					// 		let frm = getFrame(); // получить фрейм текущей вкладки или фрейм вкладки гл.топика по умолчанию
					// 		if (frm !== null && Object(frm)) {
					// 			frm.contentWindow.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
					// 		}
					// 	}
					// });
				}
			}
		}, false); // false - фаза "всплытие"
		// (!) hashchange
		window.addEventListener('hashchange', (e) => {
			// *изм.hash в адресной строке браузера при кликах по вкладкам
			// if (location.hash.length > 0) {
			// 	if (location.hash === "#topictablink" || location.hash === "#indextablink" || location.hash === "#searchtablink") {
			// 		// let url = location.href.substring(0, location.href.length - location.hash.length);
			// 		let url = document.location.href.toString().replace(/\#.*$/, "");
			// 		// window.history.go(-1);
			// 		window.history.replaceState(null, '', url); // предыдущ.ссылка с hash-ом сохраняется
			// 	}
			// } else if (location.href[location.href.length - 1] === "#") { // при кликах м.по вкладкам-клонам или заглушкам в тексте скрытого контента
			// 	let url = location.href.substring(0, location.href.length - 1);
			// 	// window.history.go(-1);
			// 	window.history.replaceState(null, '', url); // предыдущ.ссылка с hash-ом сохраняется
			// }

			let frm = getFrame();
			if (frm !== null && frm === Object(frm)) {
				if (frm.name === "ifrmkeywords" || frm.name === "ifrmsearch") {
					window.history.replaceState(null, '', e.oldURL);
				} else {
					if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
						console.log(`window.addEventListener('hashchange'): window.location.origin: ${window.location.origin} | window.«${window.name}»:\n необработанное исключение для file://\n e.oldURL: ${e.oldURL}\n e.newURL: ${e.newURL}`);
					} else {
						console.log(e.oldURL);
						console.log(e.newURL);

						let href = location.pathname.slice(location.pathname.lastIndexOf("/") + 1) + "?" + frm.contentDocument.location.href.slice(frm.contentDocument.location.href.lastIndexOf("/") + 1);
						window.history.replaceState(null, '', href); // (i) предыдущ.ссылка с hash-ом все равно сохраняется
					}
				}
			}
		}, false); // false - фаза "всплытие"
		// (!) keydown
		document.addEventListener('keydown', function (event) {
			// handlerPoPuPs_onKeyup // x -на удаление
			// function handlerPoPuPs_onKeyup(eVent) {
			// 	// *скрываем всплывающие эл.:
			// 	// 'idPermalinkBox/idTabsMenuBox/(.btn_icon-tooltip-popup - )
			// 	// ''ifrmtopic -.toc-menu
			// 	// '''ifrmnavigation:.treeview-tooltip-popup/.toclist-tooltip-popup/.footer_btn-tooltip-popup
			// 	let elem = document.getElementById('idPermalinkBox');
			// 	if (elem !== null || typeof(elem) !== "undefined" || elem !== null && elem === Object(elem)) {
			// 		if (elem.classList.contains('permalink-popup')) {
			// 			setClearPermalink(); // очистить окно Постоянная ссылка
			// 			elem.classList.remove('permalink-popup');
			// 			setEventHandlersPermalink(elem, 'remove'); // создание/удаление обработчиков событий для узла permalink
			// 		}
			// 	}
			// 	if (getBrowser().toString().toLowerCase() === "firefox") {
			// 		handlerPoPuPs(eVent); // обработчик всплывающих эл.для.btn_icon-tooltip-popup
			// 	}
			// 	// *эл."Меню вкладок"
			// 	elem = document.getElementById('idTabsMenuBox');
			// 	if (elem !== null || typeof(elem) !== "undefined" || elem !== null && elem === Object(elem)) {
			// 		if (elem.classList.contains('tabs-menu-popup')) {
			// 			// setShowOrHide(elem, "", "", "", "tabs-menu-popup");
			//			elem.classList.remove('tabs-menu-popup');
			// 		}
			// 	}
			// 	// *эл."Меню содержание страницы"
			// 	let frm = getFrame(); // получить фрейм текущей вкладки или фрейм вкладки гл.топика по умолчанию
			// 	if (frm !== null && frm === Object(frm)) {
			// 		if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
			// 			let msg = {
			// 				value: "setShowOrHide",
			// 				id: "idPageMenuToc"
			// 			};
			// 			frm.contentWindow.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
			// 		} else {
			// 			elem = frm.contentDocument.getElementById('idPageMenuToc');
			// 			if (elem !== null || typeof(elem) !== "undefined" || (elem !== null && elem === Object(elem))) {
			// 				if (elem.classList.contains('toc-menu-popup')) {
			// 					// setShowOrHide(elem, "", "", "", "toc-menu-popup");
			//					elem.classList.remove('toc-menu-popup');
			// 				}
			// 				let icon = elem.parentElement.querySelector('.toc-btn_icon');
			// 				if (icon !== null && icon === Object(icon)) {
			// 					if (icon.style.order === "2") {
			// 						icon.removeAttribute('style');
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// 	// *всплывающие подсказки для кн.: SJ/hh/email и эл.-переключателей: idTreeView/idTocList
			// 	frm = document.getElementById('ifrmnavigation');
			// 	if (elem !== null || typeof(elem) !== "undefined" || (elem !== null && elem === Object(elem))) {
			// 		if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
			// 			let msg = {
			// 				value: "handlerPoPuPs",
			// 				className: ["treeview-tooltip-popup", "toclist-tooltip-popup", "footer_btn-tooltip-popup"]
			// 			};
			// 			frm.contentWindow.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
			// 		} else {
			// 			// window.top.frames.ifrmnavigation.handlerPoPuPs(); // для firefox - скрытие вплывающих элементов, подсказок
			// 			frm.contentWindow.handlerPoPuPs(); // для firefox - скрытие вплывающих элементов, подсказок
			// 		}
			// 	}
			// 	document.removeEventListener('keyup', handlerPoPuPs_onKeyup, false);
			// }
			// (!) goToTab_onKeyup
			function goToTab_onKeyup(eVent) {
				eVent.preventDefault(); // отменяем действия браузера по умолчанию
				let elem = null;
				if (eVent.code === "PageUp" || eVent.key === "PageUp" || eVent.keyCode === 33 || eVent.which === 33) {
					elem = document.getElementById('idTabPrevious');
				} else if (eVent.code === "PageDown" || eVent.key === "PageDown" || eVent.keyCode === 34 || eVent.which === 34) {
					elem = document.getElementById('idTabNext');
				} else if (eVent.code === "End" || eVent.key === "End" || eVent.keyCode === 35 || eVent.which === 35) {
					elem = document.getElementById('idTabLast');
				} else if (eVent.code === "Home" || eVent.key === "Home" || eVent.keyCode === 36 || eVent.which === 36) {
					elem = document.getElementById('idTabFirst');
				} else if (eVent.code === "ArrowLeft" || eVent.key === "ArrowLeft" || eVent.keyCode === 37 || eVent.which === 37) {
					elem = document.getElementById('idTabPrevious');
				} else if (eVent.code === "ArrowUp" || eVent.key === "ArrowUp" || eVent.keyCode === 38 || eVent.which === 38) {
					elem = document.getElementById('idTabFirst');
				} else if (eVent.code === "ArrowRight" || eVent.key === "ArrowRight" || eVent.keyCode === 39 || eVent.which === 39) {
					elem = document.getElementById('idTabNext');
				} else if (eVent.code === "ArrowDown" || eVent.key === "ArrowDown" || eVent.keyCode === 40 || eVent.which === 40) {
					elem = document.getElementById('idTabLast');
				}
				if (elem !== null && elem === Object(elem)) {
					goToTab(elem); // переход между вкладками
				}
				document.removeEventListener('keyup', goToTab_onKeyup, false);
			}
			// *
			if (event.target.type !== "text" && event.target.type !== "textarea") {
				if (event.target.hasAttribute('class')) {
					if (event.target.classList.contains('lightbox')) { return; } // ~иначе проникает для других эл.с аналогичными гор.клав.
				}
				if (event.ctrlKey || event.metaKey) {
					if (event.code === "PageUp" || event.key === "PageUp" || event.keyCode === 33 || event.which === 33) {
						// (i) не перехватывается
						// document.addEventListener('keyup', goToTab_onKeyup, false);
						console.log(`event: ${event}, ${event.type}: window."${window.name}":\n event.ctrlKey: ${event.ctrlKey}\n event.altKey: ${event.altKey}\n event.shiftKey: ${event.shiftKey}\n event.metaKey: ${event.metaKey}\n event.code: ${event.code}\n event.key: ${event.key}\n event.keyCode: ${event.keyCode}\n event.which: ${event.which}\n event.repeat: ${event.repeat}`); // x -
					} else if (event.code === "PageDown" || event.key === "PageDown" || event.keyCode === 34 || event.which === 34) {
						// (i) не перехватывается
						// document.addEventListener('keyup', goToTab_onKeyup, false);
						console.log(`event: ${event}, ${event.type}: window."${window.name}":\n event.ctrlKey: ${event.ctrlKey}\n event.altKey: ${event.altKey}\n event.shiftKey: ${event.shiftKey}\n event.metaKey: ${event.metaKey}\n event.code: ${event.code}\n event.key: ${event.key}\n event.keyCode: ${event.keyCode}\n event.which: ${event.which}\n event.repeat: ${event.repeat}`); // x -
					} else if (event.code === "ArrowLeft" || event.key === "ArrowLeft" || event.keyCode === 37 || event.which === 37) {
						document.addEventListener('keyup', goToTab_onKeyup, false);
					} else if (event.code === "ArrowUp" || event.key === "ArrowUp" || event.keyCode === 38 || event.which === 38) {
						document.addEventListener('keyup', goToTab_onKeyup, false);
					} else if (event.code === "ArrowRight" || event.key === "ArrowRight" || event.keyCode === 39 || event.which === 39) {
						document.addEventListener('keyup', goToTab_onKeyup, false);
					} else if (event.code === "ArrowDown" || event.key === "ArrowDown" || event.keyCode === 40 || event.which === 40) {
						document.addEventListener('keyup', goToTab_onKeyup, false);
					}
				} else {
					if (event.code === "Escape" || event.key === "Escape" || event.keyCode === 27 || event.which === 27) {
						// x // document.addEventListener('keyup', handlerPoPuPs_onKeyup, false);
						document.addEventListener('keyup', handlerPoPuPs, false); // создаем обработчик для всего док.
					} else if (event.code === "PageUp" || event.key === "PageUp" || event.keyCode === 33 || event.which === 33) {
						document.addEventListener('keyup', goToTab_onKeyup, false);
					} else if (event.code === "PageDown" || event.key === "PageDown" || event.keyCode === 34 || event.which === 34) {
						document.addEventListener('keyup', goToTab_onKeyup, false);
					} else if (event.code === "End" || event.key === "End" || event.keyCode === 35 || event.which === 35) {
						document.addEventListener('keyup', goToTab_onKeyup, false);
					} else if (event.code === "Home" || event.key === "Home" || event.keyCode === 36 || event.which === 36) {
						document.addEventListener('keyup', goToTab_onKeyup, false);
					// } else if ((event.ctrlKey || event.metaKey) && event.code === "ArrowLeft" || event.key === "ArrowLeft" || event.keyCode === 37 || event.which === 37) {
					// 	document.addEventListener('keyup', goToTab_onKeyup, false);
					// } else if ((event.ctrlKey || event.metaKey) && event.code === "ArrowRight" || event.key === "ArrowRight" || event.keyCode === 39 || event.which === 39) {
					// 	document.addEventListener('keyup', goToTab_onKeyup, false);
					}
				}
			}
		}, false); // false - фаза "всплытие"
		// (!) idToolbar - события на пан.инстр. Используем делегирование событий, прослушивая общий элемент для всех дочерних элементов
		if (document.getElementById('idToolbar') !== null && typeof(document.getElementById('idToolbar')) === "object") {
			// 'input - прослушиваем каждое изменение в отличие от change
			document.getElementById('idToolbar').addEventListener('input', function (e) {
				if (e.target.tagName === "INPUT") {
					if (e.target.id === "idInputSearch") { // (!) поле Быстрый поиск
						if (e.target.labels.length > 0) {
							for (let i = 0; i < e.target.labels.length; i++) {
								if (e.target.labels[i].htmlFor === e.target.id) {
									if (e.target.value === "") {
										e.target.labels[i].style.display = "none"; // скрываем кн.очистить поле
									} else {
										e.target.labels[i].removeAttribute('style'); // отображаем кн.очистить поле
									}
									break;
								}
							}
						}
					}
				}
			}, false);
			// 'click
			document.getElementById('idToolbar').addEventListener('click', function (e) {
				if (e.target.tagName === "INPUT") {
					// *toolbar-search
					if (e.target.id === "idNavPaneToggle") { // (!) кн.-переключатель Скрыть/Показать панель навигации
						setNavPaneShowHide(!e.target.checked); // - делаем "инверсию" значения св-ва
					} // *toolbar-center
					else if (e.target.id === "idBannerShowHide") { // (!) кн.-переключатель Показать/Скрыть баннер
						setBannerShowHide(!e.target.checked); // - делаем инверсию значения, т.к.на событии click значение e.target.checked уже изменено
					}
				} else if (e.target.tagName === "LABEL") {
					// *toolbar-search
					if (e.target.htmlFor === "idInputSearch") { // (!) поле Быстрый поиск
						if (e.target.control.hasAttribute('id')) {
							if (e.target.htmlFor === e.target.control.getAttribute('id')) {
								e.target.control.value = "";
								e.target.style.display = "none";
							}
						}
					}
				} else if (e.target.tagName === "IMG") {
					// *toolbar-search
					if (e.target.id === "idQuickSearchOn") { // (!) кнопка Быстрый поиск - поиск в текущем разделе
						let field = document.getElementById('idInputSearch');
						if (field !== null && field === Object(field)) {
							if (field.value === "") {
								// 'расширенный поиск
								let tab = document.getElementById('idSearchTab');
								if (tab !== null && tab === Object(tab)) {
									if (!tab.classList.contains('tab-current')) {
										setTabVisibility(tab, "show"); // показать/скрыть текущую вкладку
									}
								}
							} else {
								setQuickSearch(); // - быстрый поиск - поиск в текущем разделе
							}
						}
					} // *toolbar-left
					else if (e.target.id === "idIndexOn") { // (!) кн.Ключевые слова
						let tab = document.getElementById('idIndexTab');
						if (!tab.classList.contains('tab-current')) {
							setTabVisibility(tab, "show"); // показать/скрыть текущую вкладку
						}
					} else if (e.target.id === "idUndockTabOn") { // (!) кн.Открепить
						alert(`(i) Кнопка «Открепить» на панели пока что в разработке.`);
						// setUndockTab(elem);
					} else if (e.target.id === "idNewTabOn") { // (!) кн.Дублировать
						setNewTab(); // создать новую вкладку
					} // *toolbar-center
					else if (e.target.id === "idExpandOn") { // (!) кн.Развернуть/Свернуть скрытый контент
						let frm = getFrame().contentWindow; // получить фрейм текущей вкладки или фрейм вкладки гл.топика по умолчанию
						if (frm !== null && frm === Object(frm)) {
							if (location.origin === "file://" || location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
								frm.postMessage('setToggleContent', '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
							} else {
								// frm.setToggleContent(null, frm.getButtonExpand().value); // переключатель скрытого контента
								frm.setToggleContent(null); // переключатель скрытого контента
							}
						}
					} // *toolbar-right
					else if (e.target.id === "idPermalinkOn") { // (!) кн.Постоянная ссылка
						let plnk = document.getElementById('idPermalinkBox');
						if (plnk !== null || typeof(plnk) !== "undefined" || plnk !== null && plnk === Object(plnk)) {
							if (plnk.classList.contains('permalink-popup')) {
								setClearPermalink(); // очистить окно Постоянная ссылка
								// setShowOrHide(plnk, "", "", "", "permalink-popup");
								plnk.classList.remove('permalink-popup');
								setEventHandlersPermalink(plnk, 'remove'); // создание/удаление обработчиков событий для узла permalink
							} else {
								document.getElementById('idPermaLinkTxT').innerHTML = location.href;
								setEventHandlersPermalink(plnk, 'add'); // создание/удаление обработчиков событий для узла permalink
								plnk.classList.add('permalink-popup');
							}
						}
					} else if (e.target.id === "idFeedBackOn") { // (!) кн.E-Mail
						if (getBrowser().toString().toLowerCase() === "firefox") {
							if (e.target.parentElement.id === "idFeedBackLink") {
								let tooltip = e.target.parentElement.querySelector('.feedback-tooltip');
								if (tooltip !== null && tooltip === Object(tooltip)) {
									tooltip.classList.add('btn_icon-tooltip-popup');
									document.addEventListener('click', handlerPoPuPs, { capture: true }); // создаем обработчик для всего док. // (i) { once: true } - для button-link не прокатывает и совместить нельзя с опцией capture (фаза всплытие - false/true - погружение)
								}
							}
						}
					} else if (e.target.id === "idPrinterOn") { // (!) кн.Печать
						setPrintTopic(e.target.parentElement);
					} else if (e.target.id === "idPagePreviousOn") { // (!) кн.Назад
						goToPagePrevious(e.target.parentElement); // (i) если вариант 1
						// (i) если вариант 2 - при очень интенсивных кликах браузер может не успевать и будет срабатывать ошибка
						// setTimeout(() => { // - без задержки стр.загружается с опозданием
						// 	goToPagePrevious(e.target.parentElement);
						// }, 1000); // 'если вариант 2
					} else if (e.target.id === "idPageHomeOn") { // (!) кн.Домой
						goToPageHome(e.target.parentElement); // (i) если вариант 1
						// (i) если вариант 2 - при очень интенсивных кликах браузер может не успевать и будет срабатывать ошибка
						// setTimeout(() => { // - без задержки стр.загружается с опозданием
						// 	goToPageHome(e.target.parentElement);
						// }, 1000); // 'если вариант 2
					} else if (e.target.id === "idPageNextOn") { // (!) кн.Вперед
						goToPageNext(e.target.parentElement); // (i) если вариант 1
						// (i) если вариант 2 - при очень интенсивных кликах браузер может не успевать и будет срабатывать ошибка
						// setTimeout(() => { // - без задержки стр.загружается с опозданием
						// 	goToPageNext(e.target.parentElement);
						// }, 1000); // 'если вариант 2
					}
				}
			}, false); // false - фаза "всплытие"
		}
		// (!) idTopicPane - события на пан.топика. Используем делегирование событий, прослушивая общий элемент для всех дочерних элементов
		// *idTopicControls
		if (document.getElementById('idTopicControls') !== null && typeof(document.getElementById('idTopicControls')) === "object") {
			// **idTabsControls - кнопки переключения между вкладками
			// 'click
			document.getElementById('idTabsControls').addEventListener('click', function (e) {
				if (e.target.tagName === "IMG") {
					if (e.target.id === "idToggleMenuTab") { // (!) показать/скрыть меню вкладок
						let tabsMenu = document.getElementById('idTabsMenuBox');
						if (tabsMenu !== null && tabsMenu === Object(tabsMenu)) {
							// tabsMenu.classList.toggle('tabs-menu-popup'); // или так
							setShowOrHide(tabsMenu, "", "", "", "tabs-menu-popup");
							// 'создаем обработчик перехвата click для узла.tabs-list/idTabsList
							let tabsList = document.getElementById('idTabsList');
							if (tabsList !== null && tabsList === Object(tabsList)) {
								if (tabsMenu.classList.contains('tabs-menu-popup')) {
									setEventHandlersTabsList(tabsList, "add"); // создание/удаление обработчиков событий для узла.tabs-list/idTabsList
									// function tabsList_onMousedown(eVent) {
									// 	if (eVent.target.tagName === "A") {
									// 		if (eVent.button === 0) { // исключаем нажатие правой кн.м.
									// 			function tabsList_onClick(evn) {
									// 				evn.preventDefault(); // отменяем действия браузера по умолчанию
									// 				let tabs = document.getElementById('idTabSliderTrack');
									// 				for (let i = 0; i < tabs.children.length; i++) {
									// 					if (+tabs.children[i].getAttribute('tabnum') === +evn.target.parentElement.getAttribute('listnum')) {
									// 						if (!tabs.children[i].classList.contains('tab-current')) {
									// 							setTabVisibility(tabs.children[i], "show", "goToPage"); // показать/скрыть текущую вкладку
									// 							break;
									// 						}
									// 					}
									// 				}
									// 				tabsList.removeEventListener('click', tabsList_onClick, false);
									// 			}
									// 			function tabsList_onMouseup(evn) {
									// 				tabsList.addEventListener('click', tabsList_onClick, false);
									// 				tabsList.removeEventListener('mouseup', tabsList_onMouseup, false);
									// 			}
									// 			tabsList.addEventListener('mouseup', tabsList_onMouseup, false);
									// 		}
									// 	}
									// }
									// tabsList.addEventListener('mousedown', tabsList_onMousedown, false);
								} else {
									// tabsList.removeEventListener('mousedown', tabsList_onMousedown, false);
									setEventHandlersTabsList(tabsList, "remove"); // создание/удаление обработчиков событий для узла.tabs-list/idTabsList
								}
							}
						}
					} else { // (!) idTabFirst/idTabPrevious/idTabNext/idTabLast
						goToTab(e.target); // переход между вкладками
					}
				}
			}, false); // false - фаза "всплытие"
			// **idTabsWindow - вкладки окон панели топика
			// ***idTabSliderTrack - события вкладок
			if (document.getElementById('idTabSliderTrack') !== null && typeof(document.getElementById('idTabSliderTrack')) === "object") {
				// 'mouseover/mouseout - наведение курсора
				document.getElementById('idTabSliderTrack').addEventListener('mouseover', function (e) {
					if (e.target.tagName === "IMG") {
						e.target.src = "icon/tab-close_on.png"; // или
						// e.target.setAttribute('src', 'icon/tab-close_on.png');
						function tabClose_onMouseout(eVent) {
							eVent.target.src = "icon/tab-close_off.png"; // или
							// eVent.target.setAttribute('src', 'icon/tab-close_off.png');
							e.target.removeEventListener('mouseout', tabClose_onMouseout, false);
						}
						// 'mouseout
						e.target.addEventListener('mouseout', tabClose_onMouseout, false);
					}
				}, false); // false - фаза "всплытие"
				// mouseout
				// document.getElementById('idTabSliderTrack').addEventListener('mouseout', function (e) {
				// }, false); // false - фаза "всплытие"
				// 'mousedown
				document.getElementById('idTabSliderTrack').addEventListener('mousedown', function (e) {
					let tabs = document.getElementById('idTabSliderTrack');
					if (tabs !== null && tabs === Object(tabs)) {
						function tabs_onClick(eVent) {
							eVent.preventDefault(); // отменяем действия браузера по умолчанию
							// *получаем вкладку на основе делегирования событий (НО это еще не.tab-current)
							function getTab() {
								if (eVent.target.tagName === "UL" && eVent.target.classList.contains('tab_slider-track')) return null;
								let elem = eVent.target;
								while (!elem.parentElement.classList.contains('tab_slider-track')) {
									elem = elem.parentElement;
									if (elem.hasAttribute('tabnum')) {
										break;
									}
								}
								return elem;
							}
							// *.nodeType === 1 - для узлов-элементов; 3 - для текстовых узловж; 9 - для объектов документа...
							if (eVent.target.nodeType === 1 && eVent.target.tagName !== undefined) {
								let tab = getTab();
								if (eVent.target.tagName === "A") {
									if (tab !== null && tab === Object(tab)) {
										if (!tab.classList.contains('tab-current')) {
											setTabVisibility(tab, "show", "goToPage"); // показать/скрыть текущую вкладку
											// (?)'как узнать куда и ск-ко прокручивать скрол, если вкладка видна частично
											// tab.parentElement.scrollLeft += eVent.target.clientWidth; // - прокручиваем скроллбар
										}
										if (tab.id === "idIndexTab" || tab.id === "idSearchTab") {
											handlerPoPuPs(e); // обработчик вплывающих эл.
										}
									}
								} else if (eVent.target.tagName === "IMG") {
									if (eVent.target.hasAttribute('class')) {
										if (eVent.target.classList.contains('close-tab')) {
											if (tab !== null && tab === Object(tab)) {
												if (tab.id === "idIndexTab" || tab.id === "idSearchTab") {
													setTabVisibility(tab, "hide"); // показать/скрыть текущую вкладку
												} else { // вкладки-клоны/созданные вкладки
													setRemoveTab(tab); // удалить текущую вкладку
												}
											}
										}
									}
								} else if (eVent.target.tagName === "LI") {
									if (eVent.target.hasAttribute('tabnum')) {
										if (!eVent.target.classList.contains('tab-current')) {
											setTabVisibility(eVent.target, "show", "goToPage"); // показать/скрыть текущую вкладку
											// (?) как узнать куда и ск-ко прокручивать скрол, если вкладка видна частично
											// tab.parentElement.scrollLeft += eVent.target.clientWidth; // - прокручиваем скроллбар
										}
										if (tab.id === "idIndexTab" || tab.id === "idSearchTab") {
											handlerPoPuPs(e); // обработчик вплывающих эл.
										}
									}
								} else if (eVent.target.tagName === "SPAN") {
									if (tab !== null && tab === Object(tab)) {
										if (!tab.classList.contains('tab-current')) {
											setTabVisibility(tab, "show", "goToPage"); // показать/скрыть текущую вкладку
											// (?) как узнать куда и ск-ко прокручивать скрол, если вкладка видна частично
											// tab.parentElement.scrollLeft += eVent.target.clientWidth; // - прокручиваем скроллбар
										}
										if (tab.id === "idIndexTab" || tab.id === "idSearchTab") {
											handlerPoPuPs(e); // обработчик вплывающих эл.
										}
									}
								}
							}
							tabs.removeEventListener('click', tabs_onClick, false);
						}
						function tabs_onMouseup(eVent) {
							tabs.addEventListener('click', tabs_onClick, false);
							tabs.removeEventListener('mouseup', tabs_onMouseup, false);
						}
						tabs.addEventListener('mouseup', tabs_onMouseup, false);
					}
				}, false); // false - фаза "всплытие"
				// 'dblclick
				document.getElementById('idTabSliderTrack').addEventListener('dblclick', function (e) {
					switch (e.target.tagName) {
						case 'SPAN':
							setUndockTab(e.target.parentElement.parentElement);
							break;
						case 'A':
							setUndockTab(e.target.parentElement);
							break;
						case 'IMG':
							setUndockTab(e.target.parentElement);
							break;
						case 'LI':
							setUndockTab(e.target);
							break;
						case 'UL': break;
						default:
							console.error(`document.getElementById('idTabSliderTrack').addEventListener('dblclick', function (${e.target.id}):\n (!) Косяк - на текущей вкладке не учтен тег: «${e.target.tagName}»`);
							alert(`(!) Косяк - на текущей вкладке не учтен тег: «${e.target.tagName}», см.консоль`);
							break;
					}
				}, false); // false - фаза "всплытие"
				// 'animationend - по окончанию анимации удаляем css св-во "animation", иначе она больше не будет воспроизводиться
				document.getElementById('idTabSliderTrack').addEventListener('animationend', function (e) {
					e.target.style.removeProperty('animation'); // удаляем css св-во
				}, false); // false - фаза "всплытие"
			}
		}
	}
}); // ready end
// (!) сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
function setHistoryState(state = "replace", hrefPage = "") {
	let retVal = false;
	if (typeof(hrefPage) !== "string" || hrefPage !== String(hrefPage) || hrefPage === "") {
		console.error(`(!) Косяк: не удалось выполнить сохранение текущей ссылки в истории браузера - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setHistoryState(state: ${state}, hrefPage: typeof(${typeof(hrefPage)}) / Object(${Object(hrefPage)}): window.«${window.name}»`);
		alert(`(!) Косяк: не удалось выполнить сохранение текущей ссылки в истории браузера - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return retVal;
	}
	// проверка наличия символов
	// 1) hrefPage.match(/#/i) // вернет номер символа в строке
	// 2) /#/i.test(href); // true/false
	// 2.1) /\\?/i.test(href); // true/false
	// 3) hrefPage.toLowerCase().includes("#") // true - строка найдена
	// 4) hrefPage.indexOf("#") === -1 // строка НЕ найдена
	// let objLocation = {
	// 	top: window.top.location.pathname.slice(window.top.location.pathname.lastIndexOf("/") + 1), // index.html
	// 	hash: window.top.location.hash.slice(window.top.location.hash.lastIndexOf("#") + 1), // без #
	// 	search: window.top.location.search.slice(window.top.location.search.lastIndexOf("?") + 1), // без ?
	// 	href: "",
	// 	url: "",
	// };
	// if (objLocation.search === "") {
	// 	objLocation.href = objLocation.top;
	// } else {
	// 	objLocation.href = objLocation.top + "?" + objLocation.search;
	// }
	// objLocation.url = objLocation.href;
	// // (?)(!) добавление hash дублируется в адресной строке браузера, поэтому переменная href в объекте только для полноценной проверки
	// if (objLocation.hash !== "") objLocation.href = objLocation.href + "#" + objLocation.hash;
	// let objLocationNew = {
	// 	top: window.top.location.pathname.slice(window.top.location.pathname.lastIndexOf("/") + 1), // index.html
	// 	hash: (/#/i.test(hrefPage)) ? hrefPage.slice(hrefPage.lastIndexOf("#") + 1): "",
	// 	search: (/\\?/i.test(hrefPage)) ? hrefPage.slice(hrefPage.lastIndexOf("?") + 1) : "",
	// 	href: "",
	// 	url: "",
	// }
	// if (objLocationNew.search === "") {
	// 	objLocationNew.url = objLocationNew.top;
	// } else {
	// 	objLocationNew.url = objLocationNew.top + "?" + objLocationNew.search;
	// }
	// 'проверка адреса ссылки с адресом ссылки в гл.окне
	let href = (window.top.location.search !== "") ? window.top.location.href.slice(window.top.location.href.lastIndexOf("?") + 1) : window.top.location.href.slice(window.top.location.href.lastIndexOf("/") + 1);
	// if (window.top.location.hash !== "") { // 'избавляемся от hash
	// 	href = href.replace(window.top.location.hash, "");
	// }
	// console.log(`href: ${href} === hrefPage: ${hrefPage}: ${href === hrefPage}`);
	// проверяем между собой адреса
	if (href === hrefPage) return retVal;
	// href = window.top.location.pathname.slice(window.top.location.pathname.lastIndexOf("/") + 1) + "?" + hrefPage;



	// if (hrefPage[0] === "#") return; // если внутренняя ссылка
	// location.hash = "";
	// // проверяем, если при переходе адреса ссылок совпадают, покидаем ф., гл.вкладка активируется при загрузке стр.в топик теме через пан.нав.
	// if (hrefPage === location.search.substring(1, location.search.length)) return;

	// if (location.search === "") {
	// 	url = location.href + "?" + hrefPage;
	// } else {
	// 	// // url = location.href.replace(vrsTopic.currP, hrefPage);
	// 	// url = location.href.replace(location.href.slice(location.href.lastIndexOf("/") + 1), "index.html") + "?" + hrefPage;
	// 	url = location.href.slice(location.href.lastIndexOf("/") + 1);
	// }

	// if (getBrowser().toString().toLowerCase() === "firefox") {
	// 	// (i) (?) для firefox почему то нужно 2-жды чистить hash (символ «#»)
	// 	url = url.replace("#", "");
	// }
	// if (url[url.length - 1] === "#") { // на всякий случай
	// 	url = url.substring(0, url.length - 1);
	// }
	// // обновляем глоб.переменные
	// vrsNavigation.query = hrefPage; // не знаю пока нужна ли она // (?)
	// if (vrsPermalink.url !== url) {
	// 	vrsPermalink.url = url;
	// }

	// console.log(`state: ${state}`);
	// *сохраняем или перезаписываем адрес в истории браузера
	if (state === "push") {
		window.history.pushState('', '', "?" + hrefPage);
		retVal = true;
	} else {
		// (!) (?) предыдущ.ссылка с hash-ом сохраняется
		window.history.replaceState(null, '', "?" + hrefPage);
		retVal = true;
	}
	return retVal;
}
// (!) создание/удаление обработчиков событий для узла.tabs-list/idTabsList
function setEventHandlersTabsList(elem, addOrRemove = "") {
	// 'elem -.tabs-list/idTabsList
	let retVal = false;
	if (addOrRemove !== "add" && addOrRemove !== "remove") {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setEventHandlerTabsList(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return retVal;
	}
	if (elem === null && elem !== Object(elem)) {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setEventHandlerTabsList(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return retVal;
	}
	// '
	function tabsList_onMousedown(eVent) {
		if (eVent.target.tagName === "A") {
			if (eVent.button === 0) { // исключаем нажатие правой кн.м.
				function tabsList_onClick(evn) {
					evn.preventDefault(); // отменяем действия браузера по умолчанию
					let tabs = document.getElementById('idTabSliderTrack');
					for (let i = 0; i < tabs.children.length; i++) {
						if (+tabs.children[i].getAttribute('tabnum') === +evn.target.parentElement.getAttribute('listnum')) {
							if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
								console.log(`необработанное исключение для:\n window.location.origin: ${window.location.origin}\n window.«${window.name}»\n evn.target: ${evn.target}`);
								console.log(tabs.children[i]);
								setTabVisibility(tabs.children[i], "show", "goToPage"); // показать/скрыть текущую вкладку
								break;
								// let href = // (?)
								// let msg = {
								// 	value: "goToPage",
								// };
								// window.top.frames.ifrmnavigation.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
							} else {
								if (!tabs.children[i].classList.contains('tab-current')) {
									setTabVisibility(tabs.children[i], "show", "goToPage"); // показать/скрыть текущую вкладку
									break;
								}
							}
						}
					}
					elem.removeEventListener('click', tabsList_onClick, false);
				}
				function tabsList_onMouseup(evn) {
					elem.addEventListener('click', tabsList_onClick, false);
					elem.removeEventListener('mouseup', tabsList_onMouseup, false);
				}
				elem.addEventListener('mouseup', tabsList_onMouseup, false);
			}
		}
	}
	if (addOrRemove === "add") {
		elem.addEventListener('mousedown', tabsList_onMousedown, false);
		retVal = true;
	} else if (addOrRemove === "remove") {
		elem.removeEventListener('mousedown', tabsList_onMousedown, false);
		retVal = true;
	} else {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setEventHandlerTabsList(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		// retVal = false;
	}
	return retVal;
}
// (!) установить статус кн.для скрытого контента
function setButtonExpand(btnStatus = "") {
	if (btnStatus === "enable") {
		setToolbarButtonsOnOff("idExpandOn");
	} else if (btnStatus === "disable") {
		setToolbarButtonsOnOff("idExpandOff");
	} else {
		console.error(`(!) Косяк: не удалось установить статус кн.для скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setButtonExpand(btnStatus: typeof(${typeof(btnStatus)}) | ${btnStatus})`);
		alert(`(!) Косяк: не удалось установить статус кн.для скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
	}
}
// (!) получить фрейм текущей вкладки или фрейм вкладки гл.топика по умолчанию
// (?)'попробовать сделать сразу через postMessage() для случаев обращения из других окон
function getFrame() { // (!) ф.не доработана - возникают ошибки
	let frm = null;
	let tab = window.top.document.querySelector('.tab-current'); // текущая вкладка

	if (tab === null && tab !== Object(tab)) {
		frm = window.top.document.getElementById('ifrmtopic') || window.top.frames.ifrmtopic; // фрейм по умолчанию
		if (frm === null && frm !== Object(frm)) {
			tab = window.top.document.getElementById('idTopicTab'); // вкладка гл.топика по умолчанию
			if (tab === null && tab !== Object(tab)) {
				console.error(`(!) Косяк - не удалось получить элемент - не найден элемент:\n function getFrame(): window."${window.name}", location.origin: ${location.origin}\n tab: typeof(${typeof(tab)}), Object(${Object(tab)}), ${tab}`);
				alert(`(!) Косяк - не удалось показать/скрыть текущую вкладку - не найден элемент, см.консоль`);
			}
		}
		return frm; // - получаем фрейм гл.вкладки по умолчанию, если ни одна вкладка не активна (например при первом открытии)
	}
	if (tab.hasAttribute('tabnum')) {
		let box = window.top.document.querySelector('div[boxnum="' + +tab.getAttribute('tabnum') + '"]');
		if (box === null && box !== Object(box)) {
			frm = window.top.document.getElementById('ifrmtopic') || window.top.frames.ifrmtopic; // фрейм по умолчанию
			if (frm === null && frm !== Object(frm)) {
				box = window.top.document.getElementById('idTopicTab'); // вкладка гл.топика по умолчанию
				if (box === null && box !== Object(box)) { // 'ругнемся и получаем null
					console.error(`(!) Косяк - не удалось получить элемент - не найден элемент:\n function getFrame(): window."${window.name}", location.origin: ${location.origin}\n box: typeof(${typeof(box)}), Object(${Object(box)}), ${box}`);
					alert(`(!) Косяк - не удалось показать/скрыть текущую вкладку - не найден элемент, см.консоль`);
				} else {
					frm = box.querySelector('iframe');
					if (frm === null && frm !== Object(frm)) { // 'ругнемся и получаем null
						console.error(`(!) Косяк - не удалось получить элемент - не найден элемент:\n function getFrame(): window."${window.name}", location.origin: ${location.origin}\n frm: typeof(${typeof(frm)}), Object(${Object(frm)}), ${frm}`);
						alert(`(!) Косяк - не удалось показать/скрыть текущую вкладку - не найден элемент, см.консоль`);
					}
				}
			} else {
				console.warn(`test - фрейм по умолчанию:\n function getFrame(): window."${window.name}", location.origin: ${location.origin}\n frm: typeof(${typeof(frm)}), Object(${Object(frm)}), ${frm}`); // x -
			}
		} else {
			frm = box.querySelector('iframe');
			if (frm === null && frm !== Object(frm)) { // 'ругнемся и получаем null
				console.error(`(!) Косяк - не удалось получить элемент - не найден элемент:\n function getFrame(): window."${window.name}", location.origin: ${location.origin}\n frm: typeof(${typeof(frm)}), Object(${Object(frm)}), ${frm}`);
				alert(`(!) Косяк - не удалось показать/скрыть текущую вкладку - не найден элемент, см.консоль`);
			}
		}
	} return frm;
}
// (!) easeInOut
function easeInOut(x, direct = "") {
	// Переменная x это интервал, прогресс анимации, где 0 (начало анимации) и 1 (конец анимации)
	const c1 = 1.70158;
	const c2 = c1 * 1.525;

	if (direct === "backPositive") { // - назад положительный
		return x < 0.5
		? 1 + (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
		: 1 + (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
	} else if (direct === "backNegative") { // - назад отрицательный
		return x < 0.5
		? 1 - (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
		: 1 - (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
	} else { // оригинал
		return x < 0.5
		? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
		: (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
	}
}
// (!) animationNavPane - окно браузера > 500
function animationNavPane(duration = 1000, panels, valueShowHide = "show") {
	let newPosition = { navpane: null, topicpane: null };
	let distance = null; // - расстояние
	if (valueShowHide === "hide") {
		distance = parseInt(getComputedStyle(panels.topicpane, null).left, 10);
	} else if (valueShowHide === "show") {
		panels.navpane.style.removeProperty('display'); // удаляем css св-во - отображаем нав.пан.
		distance = parseInt(getComputedStyle(panels.navpane, null).left, 10);
	}
	const startTime = performance.now(); // - метод производительности выраженный в миллисекундах
	rafId = requestAnimationFrame(function animate(time) {
		if (!startTime) { startTime = time; } // - при первом вызове сохраняется время, если startTime не известно
		// *разница между текущим и начальным временем, поделенная на длиительность анимации (некое число - интервал от 0 до 1, где 0 - начало анимации, а 1 - конец анимации)
		let interval = (time - startTime) / duration;
		if (interval > 1) interval = 1;
		if (valueShowHide === "hide") { // (!) проверить вариант с упрощенной записью вычисления, но с условием для ф.easeInOut()
			newPosition.topicpane = easeInOut(interval, "backNegative") * distance;
			newPosition.navpane = newPosition.topicpane - distance;
		} else if (valueShowHide === "show") {
			newPosition.navpane = easeInOut(interval, "backNegative") * distance;
			newPosition.topicpane = newPosition.navpane - distance;
		}
		panels.navpane.style.left = newPosition.navpane + "px";
		panels.topicpane.style.left = newPosition.topicpane + "px";
		if (interval < 1) { // - планируем новый кадр
			rafId = requestAnimationFrame(animate);
		} else {
			cancelAnimationFrame(rafId);
			rafId = null;
			if (valueShowHide === "hide") {
				// setTimeout(() => {
					panels.navpane.style.display = "none"; // 'скрываем пан.нав.
				// }, duration);
			} else if (valueShowHide === "show") {
				panels.navpane.style.removeProperty('left'); // удаляем css св-во
				if (reSizes.topicpaneStyleLeft === 0 || reSizes.topicpaneStyleLeft === 304) {
					panels.topicpane.style.removeProperty('left'); // удаляем css св-во
				} else {
					panels.topicpane.style.left = reSizes.topicpaneStyleLeft + "px";
				}
			}
		}
	});
}
// (!) animationNavPane500 - окно браузера < 500
function animationNavPane500(duration = 1000, panels, valueShowHide = "show") {
	// (i) отключить анимацию в styles.css
	let newPosition = null;
	let distance = 0;
	if (valueShowHide === "show") { // пан.нав.скрыта, отображаем
		distance = parseInt(getComputedStyle(panels.navpane, null).top, 10);
	} else if (valueShowHide === "hide") { // пан.нав.раскрыта, скрываем
		distance = parseInt(getComputedStyle(panels.navpane, null).height, 10);
		// distance = parseInt(getComputedStyle(panels.navpane, null).height, 10) + parseInt(getComputedStyle(panels.navpane, null).paddingTop, 10) + parseInt(getComputedStyle(panels.navpane, null).paddingBottom, 10) + parseInt(getComputedStyle(panels.navpane, null).borderTop, 10) + parseInt(getComputedStyle(panels.navpane, null).borderBottom, 10) + parseInt(getComputedStyle(panels.navpane, null).marginTop, 10) + parseInt(getComputedStyle(panels.navpane, null).marginBottom, 10);
	}
	// console.log(panels.navpane.getBoundingClientRect()); // (i) вернет координаты элемента
	const startTime = performance.now(); // - метод производительности выраженный в миллисекундах
	rafId = requestAnimationFrame(function animate(time) {
		if (!startTime) { startTime = time; } // - при первом вызове сохраняется время, если startTime не известно
		// *разница между текущим и начальным временем, поделенная на длиительность анимации (некое число - интервал от 0 до 1, где 0 - начало анимации, а 1 - конец анимации)
		let interval = (time - startTime) / duration;
		if (interval > 1) interval = 1;
		// 	let progress = easeInOut(interval);
		// 	let progress = easeInOut(interval, "backPositive");
		let progress = easeInOut(interval, "backNegative");
		newPosition = (distance * progress) - distance;
		if (valueShowHide === "show") { // пан.нав.скрыта, отображаем
			panels.navpane.style.top = (newPosition + distance) + "px";
			if (progress > 1) {
				panels.topicpane.style.top = newPosition + "px"; // качели - делаем небольшой заход вверх вместо кратковременного увеличения размера - не получается его симитировать видимо из-за достигшего размера выс., т.к.приходится подгонять высоту пан.топ.из-за небольшого затыка
			} else if (progress > 0) {
				panels.navpane.style.removeProperty('display');
				panels.navpane.style.height = newPosition + "px";
				panels.topicpane.style.removeProperty('top');
			} else if (progress < 0) {
				panels.navpane.style.height = newPosition + "px";
			} else {
				panels.navpane.style.removeProperty('top');
				panels.navpane.style.height = newPosition + "px";
			}
			panels.topicpane.style.height = (panels.topicpane.clientHeight - distance - newPosition) + "px"; // подгоняем выс.для плавного поднятия, иначе образуется небольшая задержка/приостановка
		} else if (valueShowHide === "hide") { // пан.нав.раскрыта, скрываем
			// 'делаем подмену выс.на мин.выс., чтобы не возникло внезапного увеличения размера пан.нав.при наличии св-ва height при использовании splitterBottom
			panels.navpane.style.minHeight = (distance + newPosition) + "px";
			if (progress > 1) {
				panels.navpane.style.removeProperty('height'); // если применялся splitterBottom
			} else if (progress > 0) {
				panels.navpane.style.top = newPosition + "px";
			} else if (progress < 0) {
				panels.navpane.style.top = newPosition + "px";
				panels.navpane.style.display = "none";
				panels.topicpane.style.top = (newPosition + distance) + "px"; // качели - делаем небольшой заход вверх вместо кратковременного увеличения размера - не получается его симитировать видимо из-за достигшего размера выс., т.к.приходится подгонять высоту пан.топ.из-за небольшого затыка
			} else {
				panels.navpane.style.top = newPosition + "px";
				panels.navpane.style.removeProperty('min-height');
				panels.topicpane.style.removeProperty('top');
			}
			panels.topicpane.style.height = (panels.topicpane.clientHeight - distance - newPosition) + "px"; // подгоняем выс.для плавного поднятия, иначе образуется небольшая задержка/приостановка
		}
		if (interval < 1) { // - планируем новый кадр
			prevPosition = newPosition;
			rafId = requestAnimationFrame(animate);
		} else {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	});
}
// (!) скрыть/показать боковую панель навигации
function setNavPaneShowHide(panelShowHide = true) {
	let imgNavHandle = document.getElementById('idNavHandleIcon'); // - трансформация иконки на панели тема топика
	let panels = {
		banner: document.getElementById('idBanner'),
		toolbar: document.getElementById('idToolbar'),
		navpane: document.getElementById('idNavPane'),
		topicpane: document.getElementById('idTopicPane')
	};
	const duration = 2000; // - длительность анимации
	document.getElementById('idNavPaneToggle').disabled = true; // 'делаем кнопку НЕдоступной для нажатия, пока не выполнится анимация
	if (panelShowHide) { // - нав.пан.раскрыта
		if (panels.banner.style.display === "none") {
			// *проверяем внутренний размер окна без полос прокрутки
			if (document.documentElement.clientWidth > 500) {
				animationNavPane(duration, panels, "hide");
				panels.topicpane.style.left = 0;
				// panels.topicpane.classList.remove('topic-pane-expand');
				// panels.topicpane.classList.add('topic-pane-extend'); // - изм.одну выс.пан.топ.на др.
			} else if (document.documentElement.clientWidth < 501) {
				animationNavPane500(duration, panels, "hide");
			}
		} else {
			// *проверяем внутренний размер окна без полос прокрутки
			if (document.documentElement.clientWidth > 500) {
				animationNavPane(duration, panels, "hide");
				panels.topicpane.style.left = 0;
				// panels.topicpane.classList.remove('topic-pane-extend');
				// panels.topicpane.classList.add('topic-pane-expand'); // - изм.одну выс.пан.топ.на др.
			} else if (document.documentElement.clientWidth < 501) {
				animationNavPane500(duration, panels, "hide");
			}
		}
		// *трансформация иконки на кнопке в панели тема топика
		imgNavHandle.classList.replace('navpane-show', 'navpane-hide');
	} else { // - нав.пан.скрыта
		// *проверяем внутренний размер окна без полос прокрутки
		if (document.documentElement.clientWidth > 500) {
			animationNavPane(duration, panels, "show");
			panels.topicpane.style.left = reSizes.topicpaneLeft + "px";
			// panels.topicpane.classList.remove('topic-pane-extend');
			// panels.topicpane.classList.remove('topic-pane-expand');
		} else if (document.documentElement.clientWidth < 501) {
			animationNavPane500(duration, panels, "show");
		}
		// *трансформация иконки на кнопке в панели тема топика
		imgNavHandle.classList.replace('navpane-hide', 'navpane-show');
	}
	document.getElementById('idNavPaneToggle').disabled = false; // 'делаем кнопку доступной для нажатия
}
// (!) быстрый поиск - поиск в текущем разделе
function setQuickSearch() {
	alert(`(i) Кнопка «Быстрый поиск» на панели пока что в разработке.`);
}
// (!) открепить текущую вкладку
function setUndockTab(elem) {
	// console.log(elem.getAttribute('tabnum')); // x -
	if (+elem.getAttribute('tabnum') === 0) {
		alert(`(i) Нельзя открепить вкладку «Главная».\n    Создайте новую вкладку и нажмите кнопку «Открепить».`);
	} else if (+elem.getAttribute('tabnum') > 0) { // - открепляем текущую вкладку
		alert(`(i) Функция открепить вкладку, пока что в разработке.`);
	}
}
// (!) создать новую вкладку
function setNewTab(srcFrame = "") {
	if (srcFrame === undefined && typeof(srcFrame) === "undefined") {
		console.error(`(!) Косяк - не удалось создать новую вкладку - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setNewTab(srcFrame: ${srcFrame}): window.«${window.name}», location.origin: ${location.origin}`);
		alert(`(!) Косяк - не удалось создать новую вкладку - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль`);
		return null;
	}
	let tabs = document.getElementById('idTabSliderTrack'); // 'ul
	if (tabs === null && tabs !== Object(tabs)) {
		tabs = document.querySelector('.tab_slider-track');
		if (tabs === null && tabs !== Object(tabs)) {
			console.error(`(!) Косяк: не удалось создать или клонировать элемент - новую вкладку - не найден элемент:\n function setNewTab(srcFrame: ${srcFrame}): window.«${window.name}», location.origin: ${location.origin}\n tabs: typeof(${typeof(tabs)}) | Object(${Object(tabs)}) | ${tabs}`);
			alert(`(!) Косяк: не удалось создать или клонировать элемент - новую вкладку - не найден элемент, см.консоль.`);
			return null;
		}
	}
	let boxes = document.getElementById('idTopicContent'); // 'div
	if (boxes === null && boxes !== Object(boxes)) {
		boxes = document.querySelector('.topic-content');
		if (boxes === null && boxes !== Object(boxes)) {
			console.error(`(!) Косяк: не удалось создать или клонировать элемент - текущую вкладку - не найден элемент:\n function setNewTab(srcFrame: ${srcFrame}): window.«${window.name}», location.origin: ${location.origin}\n boxes: typeof(${typeof(boxes)}) | Object(${Object(boxes)}) | ${boxes}`);
			alert(`(!) Косяк: не удалось создать или клонировать элемент - контент текущей вкладки - не найден элемент, см.консоль.`);
			return null;
		}
	}
	let count = tabs.children.length;
	let tabId = "idTab-" + count;
	if (srcFrame !== "" && typeof(srcFrame) === "string") { // - создаем
		document.getElementById('idSearchTab').insertAdjacentHTML('afterend', '<li id="' + tabId + '" class="tabs tab-current" tabnum="' + count + '"><a id="tablink-' + count + '" href="#" data="Тема" title="тема"><span>Тема</span></a><img class="close-tab" src="icon/tab-close_off.png" title="Закрыть эту вкладку"></li>');

		document.getElementById('idSearchBox').insertAdjacentHTML('afterend', '<div id="idBox-' + count + '" class="topic-box" boxnum="' + count + '"><iframe id="iframe-' + count + '" name="iframe-' + count + '" class="scroll-pane" src="' + srcFrame + '" title="тема"></iframe></div>');
	} else if (srcFrame === "" && typeof(srcFrame) === "string") { // - клонируем
		let tabCur = tabs.querySelector('.tab-current');
		let boxCur = boxes.querySelector('div[boxnum="' + +tabCur.getAttribute('tabnum') + '"]');
		if (tabCur !== null && tabCur === Object(tabCur)) {
			if (boxCur !== null && boxCur === Object(boxCur)) {
				// *варианты клонирования - копия узла:
				// '.cloneNode() - для копирования внутри того же документа (для клонирования узла из текущего document)
				// ''.importNode() - для копирования узлов из других документов (для клонирования узла из другого документа) importNode() копирует исходный элемент, не удаляя его
				// '''.adoptNode() - это еще один метод, который очень похож на importNode() с той разницей, что он удаляет исходный элемент из его родительского DOM. adoptNode() полностью удаляет исходный элемент из его DOM
				// ''''Object.assign({}, e.target) - вариант клонирования объекта
				// '''''structuredClone() - глубокое копирование - структурированное клонирование
				let clone = {
					tab: tabCur.cloneNode(true),
					box : boxCur.cloneNode(true)
				}
				// *обрабатываем клоны
				clone.tab.id = tabId;
				clone.box.id = "idBox-" + count;
				clone.tab.setAttribute('tabnum', count);
				clone.box.setAttribute('boxnum', count);
				let elem = clone.tab.querySelector('a');
				elem.id = "tablink-" + count;
				elem.href = "#" + elem.id;
				// *проверяем наличие кн.закрыть вкладку
				if (clone.tab.querySelector('.close-tab') === null) {
					clone.tab.insertAdjacentHTML('beforeend', `<img class="close-tab" src="icon/tab-close_off.png" title="Закрыть эту вкладку">`);
				}
				// *в box удаляем элементы: script/noscript
				let list = clone.box.querySelectorAll('script, noscript');
				if (list.length > 0) {
					list.forEach(item => {
						item.remove();
					});
				}
				// *меняем src, id и имя фрейма
				elem = clone.box.querySelector('iframe');
				if (elem !== null && Object(elem)) {
					let frm = boxCur.querySelector('iframe');
					elem.src = frm.contentDocument.location.href.slice(frm.contentDocument.location.href.lastIndexOf("/") + 1); // ~это не будет работать на location.origin === "file://"
					if (boxCur.id === "idTopicBox") { // 'если дублируется фрейм гл.вкладки
						elem.id = elem.id + "-" + count;
						elem.name = elem.name + "-" + count;
					} else { // ''если дублир.фрейм вкладки-клона
						elem.id = elem.localName + "-" + count;
						elem.name = elem.localName + "-" + count;
					}
				}
				// *создаем клона
				if (tabCur.id === "idTopicTab") { // 'если дублируется гл.вкладка
					// document.getElementById('idSearchTab').after(clone.tab);
					// document.getElementById('idSearchBox').after(clone.box);
					document.getElementById('idSearchTab').insertAdjacentElement('afterend', clone.tab);
					document.getElementById('idSearchBox').insertAdjacentElement('afterend', clone.box);
				} else { // ''если дублир.вкладка-клон
					tabCur.insertAdjacentElement('afterend', clone.tab);
					boxCur.insertAdjacentElement('afterend', clone.box);
				}
			} else {
				console.error(`(!) Косяк: не удалось создать копию/клонировать элемент - текущую вкладку - не найден элемент:\n function setNewTab(srcFrame: ${srcFrame}): window.«${window.name}», location.origin: ${location.origin}\n boxCur: typeof(${typeof(boxCur)}) | Object(${Object(boxCur)}) | ${boxCur}`);
				alert(`(!) Косяк: не удалось создать копию/клонировать элемент - контент текущей вкладки - не найден элемент, см.консоль.`);
				return null;
			}
		} else {
			console.error(`(!) Косяк: не удалось создать копию/клонировать элемент - текущую вкладку - не найден элемент:\n function setNewTab(srcFrame: ${srcFrame}): window.«${window.name}», location.origin: ${location.origin}\n tabCur: typeof(${typeof(tabCur)}) | Object(${Object(tabCur)}) | ${tabCur}`);
			alert(`(!) Косяк: не удалось создать копию/клонировать элемент - контент текущей вкладки - не найден элемент, см.консоль.`);
			return null;
		}
	}
	// *делаем вкладку текущей и обновляем список меню вкладок
	let tab = document.getElementById(tabId);
	let frm = null;
	if (tab !== null && tab === Object(tab)) {
		frm = boxes.querySelector('.topic-box[boxnum="' + +tab.getAttribute('tabnum') + '"]').querySelector('iframe');
	}
	// (?)(!) не понятно почему, без этой комбинации генерируется ошибка, несмотря на то, что эл.предварительно сразу же обнаруживается
	// протестить после правки
	let idInt = setInterval(() => {
		if (frm !== null && frm === Object(frm)) {
			clearInterval(idInt);
			setTabVisibility(tab, "show", "goToPage"); // показать/скрыть текущую вкладку
		} else {
			frm = boxes.querySelector('.topic-box[boxnum="' + +tab.getAttribute('tabnum') + '"]').querySelector('iframe');
		}
	}, 500);
	return { tab: tab, frm: frm };
}
// (!) удалить текущую вкладку
function setRemoveTab(elem) {
	// 'elem - tagName: li.tabs tab-current
	if (elem === undefined || typeof(elem) === "undefined" || elem !== Object(elem) || (elem === null && elem === Object(elem))) {
		console.error(`(!) Косяк: не удалось удалить текущую вкладку - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setRemoveTab(elem: typeof(${typeof(elem)}), Object(${Object(elem)}), ${elem}): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось удалить текущую вкладку - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	// *если вкладка активна, ищем предыдущую вкладку топика для переключения на нее после удаления текущей вкладки
	let tabs = elem.parentElement; // idTabSliderTrack
	if (elem.classList.contains('tab-current')) {
		if (tabs !== null && tabs === Object(tabs)) {
			// 1) Array.from(elem.parentElement.children).indexOf(elem); // получить номер индекса текущего дочернего эл.
			// 2) Array.prototype.indexOf.call(elem.parentElement.children, elem);
			let index = Array.prototype.indexOf.call(tabs.children, elem);
			for (let i = index - 1; i >= 0; i--) {
				if (tabs.children[i].hasAttribute('id')) {
					if (tabs.children[i].id !== "idIndexTab" && tabs.children[i].id !== "idSearchTab") {
						setTabVisibility(tabs.children[i], "show", "goToPage"); // показать/скрыть текущую вкладку
						break;
					}
				}
			}
		}
	}
	// console.log(`function setRemoveTab(elem: typeof(${typeof(elem)}), Object(${Object(elem)}), ${elem}): window."${window.name}, location.origin: ${location.origin}"`); // x -
	// *
	let box = document.querySelector('div[boxnum="' + +elem.getAttribute('tabnum') + '"]');
	if (box !== null && box === Object(box)) {
		box.remove();
		elem.remove();
		let tabsMenu = document.getElementById('idTabsMenuBox');
		if (tabsMenu !== null && tabsMenu === Object(tabsMenu)) {
			if (tabsMenu.children.length !== tabs.children.length) {
				setUpdateTabsMenuList(tabs); // обновление списка Меню вкладок и выделение ссылки на текущую вкладку
			}
			return true;
		} else {
			console.error(`(!) Косяк: не удалось удалить текущую вкладку - не найден элемент:\n function setRemoveTab(elem: typeof(${typeof(elem)}), Object(${Object(elem)}), ${elem}): window."${window.name}", location.origin: ${location.origin}:\n tabsMenu: typeof(${typeof(tabsMenu)}), Object(${Object(tabsMenu)}), ${tabsMenu}`);
			alert(`(!) Косяк: не удалось удалить текущую вкладку - не найден элемент, см.консоль.`);
			return false;
		}
	} else {
		console.error(`(!) Косяк: не удалось удалить текущую вкладку - не найден элемент:\n function setRemoveTab(elem: typeof(${typeof(elem)}), Object(${Object(elem)}), ${elem}): window."${window.name}", location.origin: ${location.origin}:\n box: typeof(${typeof(box)}), Object(${Object(box)}), ${box}`);
		alert(`(!) Косяк: не удалось удалить текущую вкладку - не найден элемент, см.консоль.`);
		return false;
	}
}
// (!)
function easeInOutLiner(time, valueShowHide = "") {
	if (valueShowHide === "show") {
		return 0.5 * (1 - Math.cos(Math.PI * time));
	} else if (valueShowHide === "hide") {
		return 0.5 * (1 + Math.cos(Math.PI * time));
	} else {
		return 0.5 * (Math.cos(Math.PI * time));
	}
}
// (!)
function animationBanner(duration = 1000, panels, valueShowHide = "hide") {
	// (i) отключить анимацию в styles.css
	if (valueShowHide === "show") { // баннер скрыт, отображаем
		panels.banner.style.removeProperty('display'); // удаляем css св-во
	}
	// console.log(panels.navpane.getBoundingClientRect()); // (i) вернет координаты элемента
	let distance = panels.banner.offsetHeight; // - расстояние
	const startTime = performance.now(); // - метод производительности выраженный в миллисекундах
	rafId = requestAnimationFrame(function animate(time) {
		if (!startTime) { startTime = time; } // - при первом вызове сохраняется время, если startTime не известно
		// *разница между текущим и начальным временем, поделенная на длиительность анимации (некое число - интервал от 0 до 1, где 0 - начало анимации, а 1 - конец анимации)
		let interval = (time - startTime) / duration;
		if (interval > 1) interval = 1;
		let progress = easeInOutLiner(interval, valueShowHide);
		panels.banner.style.height = (progress * distance) + "px";
		if (document.documentElement.clientWidth > 500) {
			panels.navpane.style.top = ((progress * distance) + panels.toolbar.offsetHeight + parseInt(getComputedStyle(panels.toolbar, null).marginTop, 10)) + "px";
			panels.topicpane.style.top = ((progress * distance) + panels.toolbar.offsetHeight + parseInt(getComputedStyle(panels.toolbar, null).marginTop, 10)) + "px";
		}
		if (interval < 1) { // - планируем новый кадр
			rafId = requestAnimationFrame(animate);
		} else {
			cancelAnimationFrame(rafId);
			rafId = null;
			if (valueShowHide === "hide") {
				panels.banner.style.display = "none"; // 'скрываем баннер
			}
			panels.banner.style.removeProperty('height');
			if (document.documentElement.clientWidth > 500) {
				panels.navpane.style.removeProperty('top');
			} else if (document.documentElement.clientWidth < 501) {
				if (panels.navpane.style.display !== "none") {
					panels.navpane.style.removeProperty('top');
				}
				if (reSizes.navpaneHeight === 0) {
					panels.navpane.style.removeProperty('height');
					panels.topicpane.style.removeProperty('height');
				}
			}
			panels.topicpane.style.removeProperty('top');
		}
	});
}
// (!) показать/скрыть баннер
function setBannerShowHide(bannerShowHide = false) {
	let panels = {
		banner: document.getElementById('idBanner'),
		toolbar: document.getElementById('idToolbar'),
		navpane: document.getElementById('idNavPane'),
		topicpane: document.getElementById('idTopicPane')
	};
	// console.log(panels.navpane.getBoundingClientRect()); // (i) вернет координаты элемента
	const duration = 1500; // - длительность анимации
	if (document.documentElement.clientWidth > 500) {
		if (bannerShowHide) { // - баннер раскрыт - скрываем его
			panels.toolbar.classList.replace('toolbar-banner', 'toolbar');
			if (panels.navpane.classList.contains('nav-pane-banner')) {
				panels.navpane.classList.remove('nav-pane-banner');
			}
			if (panels.topicpane.classList.contains('topic-pane-banner')) {
				panels.topicpane.classList.remove('topic-pane-banner');
			}
			animationBanner(duration, panels, "hide");
		} else { // - баннер скрыт - отображаем его
			panels.toolbar.classList.replace('toolbar', 'toolbar-banner');
			if (!panels.navpane.classList.contains('nav-pane-banner')) { // - класс отсутствует
				panels.navpane.classList.add('nav-pane-banner');
			}
			if (!panels.topicpane.classList.contains('topic-pane-banner')) { // - класс отсутствует
				panels.topicpane.classList.add('topic-pane-banner');
			}
			animationBanner(duration, panels, "show");
		}
	} else if (document.documentElement.clientWidth < 501) {
		if (bannerShowHide) { // - баннер раскрыт - скрываем его
			panels.toolbar.classList.replace('toolbar-banner', 'toolbar');
			animationBanner(duration, panels, "hide");
		} else { // - баннер скрыт - отображаем его
			panels.toolbar.classList.replace('toolbar', 'toolbar-banner');
			animationBanner(duration, panels, "show");
		}
	}
}
// (!) распечатать
function setPrintTopic(elem) {
	let wndProp = "width=960,height=970,left=" + ((screen.width - 960) / 2) + ",top=0,toolbar=1,scrollbars=1,location=0,status=1,menubar=1,titlebar=1,resizable=1"; // - menubar=0 - отд.окно
	windowOpen(vrsTopic.currP, wndProp);
	// print();
	alert(`(i) Кнопка «Печать» на панели пока что в разработке.`);
}
// (!) скрыть пан.нав.при размере окна браузера <= 500
function setHideNavPane() {
	// *проверяем внутренний размер окна без полос прокрутки
	if (document.documentElement.clientWidth < 501) {
		if (document.getElementById('idTopicPane').offsetTop >= document.body.clientHeight) { // если пан.нав.притянута к низу
			setNavPaneShowHide(true); // скрыть/показать боковую панель навигации
			// *переводим кнопку в состояние, когда пан.нав.скрыта
			document.getElementById('idNavPaneToggle').checked = false;
		}
	}
}
// (!) установка перехода на страницу
function setGoToPage(elem) {
	// (i) если вариант 1
	// *обновляем глобальную переменную в ifrmnavigation
	if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
		let msg = {
			value: "setCollapse",
			collapse: false
		};
		frames.ifrmnavigation.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
	} else {
		document.getElementById('ifrmnavigation').contentWindow.setCollapse(false);
	}
	setHideNavPane(); // скрыть пан.нав.при размере окна браузера <= 500
	// x // setHistoryState("push", elem.getAttribute('href')); // сохранение текущей ссылки в истории браузера для возможности дальнейшей навигации - возврата на предыдущую стр.
}
// (!) перейти на текущую главу/раздел/подраздел темы
function goToPageHome(elem) {
	setGoToPage(elem); // установка перехода на страницу
	vrsTopic.currP = vrsNavigation.def = vrsNavigation.query = vrsTopic.homeP; // обновляем глобальные переменные в variables.js
}
// (!) перейти назад
function goToPagePrevious(elem) {
	setGoToPage(elem); // установка перехода на страницу
	// *обновляем глобальные переменные в variables.js
	vrsTopic.nextP = vrsTopic.currP;
	vrsTopic.currP = vrsNavigation.def = vrsNavigation.query = vrsTopic.prevP;
}
// (!) перейти вперед
function goToPageNext(elem) {
	setGoToPage(elem); // установка перехода на страницу
	// *обновляем глобальные переменные в variables.js
	vrsTopic.prevP = vrsTopic.currP;
	if (location.search === "") { // (i) чтобы не грузить 2-жды одну и ту же страницу, если сайт загружен первично
		vrsTopic.currP = vrsNavigation.def = vrsNavigation.query = vrsTopic.nextP;
	}
}
// (i)*idTopicPane - элементы для панели тема топика
// (!) переход между вкладками
function goToTab(elem) {
	// 'elem - tagName img: idTabFirst/idTabPrevious/idTabNext/idTabLast
	// ''elem - горячая клавиша: Home/End/PageUp/PageDown, по кот.уже найден эл.img: idTabFirst/idTabPrevious/idTabNext/idTabLast
	// (!) надо переделать переменную аргумента строкой = id - нет смысла гнать сюда эл.кнопки, если над ней или с ней нет никаких действий. Это так же связано с ф.animationOffset()

	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось осуществить переключение на другую вкладку - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function goToTab(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, keyEvent: "${keyEvent}"): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось осуществить переключение на другую вкладку - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	let tabs = document.getElementById('idTabSliderTrack');
	// получаем видимые вкладки // (i) преобразуем NodeList в массив:
	// 'Array.from появился в ECMA6 - для более новых версий браузеров и может работать не везде
	// ''Array.prototype.slice.call - не сработает для IE8
	// let tabsVisible = Array.from(tabs.querySelectorAll('li.tabs:not([style="display:none;"])')) || Array.prototype.slice.call(tabs.querySelectorAll('li.tabs:not([style="display:none;"])')); // - не работает
	// console.log(Array.from(tabs.querySelectorAll('li.tabs:not([style="display:none;"])')));
	// console.log(Array.prototype.slice.call(tabs.querySelectorAll('li.tabs:not(li[style="display:none;"])')));

	// *исключаем скрытые вкладки
	let tabsVisible = [];
	for (let i = 0; i < tabs.children.length; i++) {
		if (tabs.children[i].style.display !== "none") {
			tabsVisible.push(tabs.children[i]);
		}
	}
	// *
	if (tabsVisible.length === 1) { // скрыты все вкладки, кроме 1-ой, т.е.главной
		if (elem.id === "idTabFirst" || elem.id === "idTabPrevious") {
			if (tabsVisible[0].classList.contains('tab-current')) {
				animationOffset(elem); // анимационное смещение
			} else {
				setTabVisibility(tabs.children[0], "show", "goToPage"); // показать/скрыть текущую вкладку
			}
		} else if (elem.id === "idTabLast" || elem.id === "idTabNext") {
			if (tabsVisible[0].classList.contains('tab-current')) {
				animationOffset(elem); // анимационное смещение
			} else {
				setTabVisibility(tabs.children[0], "show", "goToPage"); // показать/скрыть текущую вкладку
			}
		}
	} else {
		if (elem.id === "idTabFirst") {
			if (tabsVisible[0].classList.contains('tab-current')) {
				animationOffset(elem); // анимационное смещение
			} else {
				setTabVisibility(tabsVisible[0], "show", "goToPage"); // показать/скрыть текущую вкладку
			}
			tabs.scrollLeft -= tabs.scrollWidth; // прокручиваем скроллбар (перех.к первой вкладке)
		} else if (elem.id === "idTabPrevious") {
			for (let i = tabsVisible.length - 1; i >= 0; i--) {
				if (i === 0) { // если вкладка 1-ая, т.е.главная
					if (tabsVisible[i].classList.contains('tab-current')) {
						animationOffset(elem); // анимационное смещение
					} else {
						setTabVisibility(tabsVisible[i], "show", "goToPage"); // показать/скрыть текущую вкладку
						tabs.scrollLeft -= tabsVisible[i].clientWidth; // прокручиваем скроллбар
					}
				} else {
					if (tabsVisible[i].classList.contains('tab-current')) {
						setTabVisibility(tabsVisible[i - 1], "show", "goToPage"); // показать/скрыть текущую вкладку
						tabs.scrollLeft -= tabsVisible[i - 1].clientWidth; // прокручиваем скроллбар
						break;
					}
				}
			}
		} else if (elem.id === "idTabNext") {
			for (let i = 0; i < tabsVisible.length; i++) {
				if (i === tabsVisible.length - 1) { // если видимая вкладка последняя
					if (tabsVisible[i].classList.contains('tab-current')) {
						animationOffset(elem); // анимационное смещение
					} else {
						setTabVisibility(tabsVisible[0], "show", "goToPage"); // показать/скрыть текущую вкладку
						tabs.scrollLeft += tabsVisible[i].clientWidth; // прокручиваем скроллбар
					}
				} else {
					if (tabsVisible[i].classList.contains('tab-current')) {
						setTabVisibility(tabsVisible[i + 1], "show", "goToPage"); // показать/скрыть текущую вкладку
						tabs.scrollLeft += tabsVisible[i + 1].clientWidth; // прокручиваем скроллбар
						break;
					}
				}
			}
		} else if (elem.id === "idTabLast") {
			if (tabsVisible[tabsVisible.length - 1].classList.contains('tab-current')) { // если последняя видимая вкладка уже активна
				animationOffset(elem); // анимационное смещение
			} else {
				setTabVisibility(tabsVisible[tabsVisible.length - 1], "show", "goToPage"); // показать/скрыть текущую вкладку
			}
			tabs.scrollLeft += tabs.scrollWidth; // прокручиваем скроллбар (перех.к последней вкладке)
		}
	}
}