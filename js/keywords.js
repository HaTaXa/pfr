// (!) *document
$(document).ready(function () { // - jq
	if (document !== null && typeof(document) === "object") {
		// 'message
		window.addEventListener('message', (event) => {
			if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
				if (event.data.value === "handlerTargetWindow") {
					handlerTargetWindow(event); // обработчик целевого окна
				}
			}
		}, false); // false - фаза "всплытие"
		// 'keyup
		document.addEventListener('keyup', function (event) {
			if (event.key === "Escape" || event.code === "Escape" || event.keyCode === 27 || event.which === 27) {
				let idxList = document.querySelectorAll('.idx_list-show');
				if (idxList.length > 0) {
					idxList.forEach(lstShow => {
						lstShow.classList.replace('idx_list-show', 'idx_list-hide');
					});
				}
			}
		}, false);
		// 'click
		document.addEventListener('click', function (event) {
			if (event.target.tagName === "A") {
				if (event.target.classList.contains('idxrefs')) {
					// *подсветка текущей буквы
					// idKeywordHeader
					// (!) с русскими якорями проблема
					let idxSection = document.getElementById(event.target.hash.substring(1, event.target.hash.length)); // - найдем секцию по полученному значению hash-a без символа «#»

					console.warn(`(i)(!) проблема с русскими якорями:\n event: ${event}, event.type: ${event.type}:\n window."${window.name}\n event.target.hash: ${event.target.hash.substring(1, event.target.hash.length)}\n---`); // x -

					if (idxSection !== null && idxSection === Object(idxSection)) {
						if (idxSection.classList.contains('idx-section')) {
							idxSection.children[0].classList.add('flash-light');
							setTimeout(() => {
								idxSection.children[0].removeAttribute('class');
							}, 1000);
						}
					}
				} else if (event.target.getAttribute('href')[0] === "#") { // если вн.ссылка
					// *отображаем список с ссылками
					// 1) event.target.hash === ""
					// 2) event.target.href.toLowerCase().includes("#") // true - строка найдена
					// 3) event.target.href.indexOf("#") === -1 // строка не найдена
					let idxList = document.getElementById(event.target.hash.substring(1, event.target.hash.length));
					if (idxList !== null && idxList === Object(idxList)) {
						if (idxList.classList.contains('idx_list-hide')) {
							idxList.classList.replace('idx_list-hide', 'idx_list-show');
						} else if (idxList.classList.contains('idx_list-show')) {
							idxList.classList.replace('idx_list-show', 'idx_list-hide');
						}
					}
				} else { // если ссылка на целевое окно
					// *ищем наличие вкладки для необходимости переопределения целевого окна топика, если нет, целевое окно будет по умолчанию топик гл.вкладки
					if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
						let msg = {
							value: "getTargetWindow",
							wndName: window.name,
							src: event.target.getAttribute('href'),
						};
						window.top.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
					} else {
						let frmName = window.top.getTargetWindow(event.target.getAttribute('href')); // получить целевое окно среди имеющихся топиков/клонов
						// handlerTargetWindow(event, frmName); // обработчик целевого окна // или так
						if (frmName === "") {
							if (event.target.getAttribute('target') !== "ifrmtopic") {
								event.target.getAttribute('target') = "ifrmtopic";
							}
						} else if (event.target.getAttribute('target') !== frmName) {
							handlerTargetWindow(event.target, frmName); // обработчик целевого окна
						}
					}
				}
			} else {
				let list = document.querySelectorAll('.idx_list-show');
				if (list.length > 0) {
					list.forEach(item => {
						item.classList.replace('idx_list-show', 'idx_list-hide');
					});
				}
			}
		}, false);
	}
}); // ready end
// (!) обработчик целевого окна
function handlerTargetWindow(eVent, frmName = "") {
	// (?)~почему если применять event.target, то приходит как eVent.type === "", но в ф.handlerPoPuPs(eVent) приходит как eVent.type === undefined
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
	// '
	if (eVent.type === "message") {
		let list = document.querySelectorAll('a[href="' + eVent.data.href + '"]');
		if (list.length > 0) {
			list.forEach(item => {
				if (eVent.data.frmName === "") {
					if (item.target.target !== "ifrmtopic") {
						item.target.target = "ifrmtopic";
					}
				} else if (item.target.target !== eVent.data.frmName) {
					item.target.target = eVent.data.frmName;
				}
			});
		} else {
			console.error(`(!) Косяк: не удалось обработать целевое окно - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function handlerTargetWindow(eVent: typeof(${typeof(eVent)}), frmName: ${frmName}): window.«${window.name}», location.origin: ${location.origin}\n---`);
			alert(`(!) Косяк: не удалось обработать целевое окно - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		}
	} else if (eVent.type === "click") {
		if (typeof(frmName) === "string") {
			if (frmName === "") {
				if (eVent.target.target !== "ifrmtopic") {
					eVent.target.target = "ifrmtopic";
				}
			} else if (eVent.target.target !== frmName) {
				eVent.target.target = frmName;
			}
		} else {
			console.error(`(!) Косяк: не удалось обработать целевое окно - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function handlerTargetWindow(eVent: typeof(${typeof(eVent)}), frmName: ${frmName}): window.«${window.name}», location.origin: ${location.origin}\n---`);
			alert(`(!) Косяк: не удалось обработать целевое окно - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		}
	} else if (eVent.type === "") { // 'ф.исп.не как обработчик событий
		if (eVent !== null && eVent === Object(eVent)) {
			let lnk = eVent;
			if (typeof(frmName) === "string") {
				if (frmName === "") {
					if (lnk.target !== "ifrmtopic") {
						lnk.target = "ifrmtopic";
					}
				} else if (lnk.target !== frmName) {
					lnk.target = frmName;
				}
			} else {
				console.error(`(!) Косяк: не удалось обработать целевое окно - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function handlerTargetWindow(eVent: typeof(${typeof(eVent)}), frmName: ${frmName}): window.«${window.name}», location.origin: ${location.origin}\n---`);
				alert(`(!) Косяк: не удалось обработать целевое окно - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
			}
		}
	}
}