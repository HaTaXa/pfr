// (!) lightbox_window_onReSize
function lightbox_window_onReSize(eVent) {
	// 'eVent.target - window
	// *перебираем и ищем все lightbox's и корректируем высоту каждого, даже когда окно яв-ся гл.
	let lbxList = eVent.target.document.querySelectorAll('.lightbox');
	if (lbxList.length === 0) {
		console.error(`(!) Косяк: не удалось изменить размер окна просмотра изо - не найден элемент:\n function lightbox_window_onReSize(eVent: type: ${eVent.type}, target: ${eVent.target}, name: «${eVent.target.name}»):\n lbx: typeof(${typeof(lbx)}) / Object(${Object(lbx)} / ${lbx}`);
		alert(`(!) Косяк: не удалось изменить размер окна просмотра изображения - не найден элемент, см.консоль.`);
		return;
	}
	lbxList.forEach(lbx => {
		if (!lbx.classList.contains('toggle-collapse')) {
			setReSizeViewerImg(lbx); // - переустановить размер элемента просмотра изо
		}
	});
}
// (!) lightbox_onMouseover
function lightbox_onMouseover(eVent) {
	if (eVent.target.tagName === "IMG") {
		if (eVent.target.classList.contains('zoom-in') || eVent.target.classList.contains('zoom-out')) {
			toggleZoomerIcon(eVent.target, eVent.type); // - переключить (+/-) иконку масштабирования
		}
		function iconZoomer_onMouseout(evt) {
			if (eVent.target.classList.contains('zoom-in') || eVent.target.classList.contains('zoom-out')) {
				toggleZoomerIcon(evt.target, evt.type); // - переключить (+/-) иконку масштабирования
			}
			eVent.target.removeEventListener('mouseout', iconZoomer_onMouseout, false);
		}
		// (!) mouseout
		eVent.target.addEventListener('mouseout', iconZoomer_onMouseout, false);
	}
}
// (!) lightbox_onKeydown
function lightbox_onKeydown(eVent) {
	if (window === top && window.name === "") {
		eVent.preventDefault(); // отменяем действия браузера по умолчанию
		// (?)~End/Home/PageUp/PageDown - достигает гор.клав.проникая с гл.окна далее для др.эл.НЕ перехватывая на текущий эл., т.е.гор.клав.для др.эл.в гл.окне тоже срабатывают одновременно наряду с текущим эл.т.к.присутствует общий слушатель на весь док.
	}
	// (?)~перехват срабатывает, но курсор двигается по контенту - без preventDefault() не обойтись
	// console.log(`window.«${window.name}»`);
	// console.log(document.activeElement);
	// console.log(eVent.target);
	// (i) event.code всегда содержит только одно латинское обозначение в отличие от event.key, кот.содержит обозначение относительно раскладки клавиатуры
	if (eVent.code === "Escape" || eVent.key === "Escape" || eVent.keyCode === 27 || eVent.which === 27) {
		if (window === top || window.name === "") {
			setLightboxRemove(eVent.target); // удаление DOM-элемента - узел lightbox в гл.окне
		} else if (window === self || self !== top && window.name !== "") { // 'еще вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
			setLightboxHide(eVent.target); // скрыть окно просмотра изо - текущий lightbox
		}
	// не стала пока назначать
	// } else if (eVent.code === "PageUp" || eVent.key === "PageUp" || eVent.keyCode === 33 || eVent.which === 33) {
	// 	eVent.preventDefault(); // отменяем действия браузера по умолчанию
	// } else if (eVent.code === "PageDown" || eVent.key === "PageDown" || eVent.keyCode === 34 || eVent.which === 34) {
	// 	eVent.preventDefault(); // отменяем действия браузера по умолчанию
	} else if (eVent.code === "End" || eVent.key === "End" || eVent.keyCode === 35 || eVent.which === 35) {
		eVent.preventDefault(); // отменяем действия браузера по умолчанию
		goToImage(eVent.target, eVent.code); // переключение по изо.в lightbox
	} else if (eVent.code === "Home" || eVent.key === "Home" || eVent.keyCode === 36 || eVent.which === 36) {
		eVent.preventDefault(); // отменяем действия браузера по умолчанию
		goToImage(eVent.target, eVent.code); // переключение по изо.в lightbox
	} else if (eVent.code === "ArrowLeft" || eVent.key === "ArrowLeft" || eVent.keyCode === 37 || eVent.which === 37) {
		eVent.preventDefault(); // отменяем действия браузера по умолчанию
		goToImage(eVent.target, eVent.code); // переключение по изо.в lightbox
	} else if (eVent.code === "ArrowUp" || eVent.key === "ArrowUp" || eVent.keyCode === 38 || eVent.which === 38) {
		eVent.preventDefault(); // отменяем действия браузера по умолчанию
		goToImage(eVent.target, eVent.code); // переключение по изо.в lightbox
	} else if (eVent.code === "ArrowRight" || eVent.key === "ArrowRight" || eVent.keyCode === 39 || eVent.which === 39) {
		eVent.preventDefault(); // отменяем действия браузера по умолчанию
		goToImage(eVent.target, eVent.code); // переключение по изо.в lightbox
	} else if (eVent.code === "ArrowDown" || eVent.key === "ArrowDown" || eVent.keyCode === 40 || eVent.which === 40) {
		eVent.preventDefault(); // отменяем действия браузера по умолчанию
		goToImage(eVent.target, eVent.code); // переключение по изо.в lightbox
	}
}
// (!) lightbox_onClick
function lightbox_onClick(eVent) {
	if (eVent.target.tagName === "A") {
		if (eVent.target.parentElement.classList.contains('btn-box')) { // (!) получаем div через.target.tagName a
			// *просмотр/пролистывание изо.в lightbox
			if (eVent.target.parentElement.classList.contains('img-btn-prev')) {
				goToImage(eVent.target.parentElement, "");
			} else if (eVent.target.parentElement.classList.contains('img-btn-next')) {
				goToImage(eVent.target.parentElement, "");
			}
		} else if (eVent.target.parentElement.classList.contains('btn-slider')) { // (!) получаем div через.target.tagName a
			// *переключение по изо.в lightbox
			if (eVent.target.parentElement.classList.contains('slider-btn-prev')) {
				goToImage(eVent.target.parentElement, "");
			} else if (eVent.target.parentElement.classList.contains('slider-btn-next')) {
				goToImage(eVent.target.parentElement, "");
			}
		}
	} else if (eVent.target.tagName === "DIV") {
		if (eVent.target.classList.contains('lightbox-btn-close')) {
			if (window === top || window.name === "") {
				setLightboxRemove(eVent.target); // удаление DOM-элемента - узел lightbox в гл.окне
			} else if (window === self || self !== top && window.name !== "") { // 'еще вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
				setLightboxHide(eVent.target); // - скрыть окно просмотра изо - текущий lightbox
			}
		}
	} else if (eVent.target.tagName === "IMG") {
		if (eVent.target.classList.contains('img-item')) {
			// *toggle image zoom
			toggleZoomerIcon(eVent.target, ""); // - переключить (+/-) иконку масштабирования
		} else if (eVent.target.classList.contains('zoom-in')) {
			if (window === top || window.name === "") { // (i) окно элемента яв-ся главным, например, при запуске отдельной страницей или через ctrl+клик из общего проекта
				// *toggle image zoom
				toggleZoomerIcon(eVent.target, ""); // - переключить (+/-) иконку масштабирования
			} else if (window === self || self !== top && window.name !== "") { // 'еще вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
				// *image full screen - вывод текущего lightbox в гл.окне
				let retVal = false;
				let clone = getLightboxCopy(eVent.target); // создать и получить копию/клона DOM-элемента - узел lightbox
				if (clone) {
					// retVal = setItemSessionStorage("lightbox", clone);
					retVal = true;
				} else {
					let lbx = getLightbox(eVent.target);
					clone = getLightboxCopy(lbx); // создать и получить копию/клона DOM-элемента - узел lightbox
					if (clone) {
						// retVal = setItemSessionStorage("lightbox", clone);
						retVal = true;
					} else {
						console.error(`(!) Косяк: не удалось осуществить вывод текущего элемента в гл.окне - не найден элемент:\n function lightbox_onClick(eVent: ${eVent}): window.«${window.name}» | location.origin: ${location.origin}:\n clone: ${clone}`);
						alert(`(!) Косяк: не удалось осуществить вывод текущего элемента в гл.окне - не найден элемент, см.консоль.`);
					}
				}
				if (location.origin === "file://" || location.origin === "null") { // - получаем элемент lightbox и передаем его в гл.окно
					// (i) в Firefox origin = "null"
					// (i)~нельзя передать узел/копию DOM-элемента в другое окно/фрейм, см.спецификацию, поэтому передаем узел в виде строки методом parseFromString() объекта DOMParser()
					if (retVal) {
						let msg = {
							value: "setImageFullScreen",
							lbxString: clone.outerHTML,
						};
						window.top.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
					}
				} else { // - вывод текущего lightbox в гл.окне
					// *проверяем наличие ссылки на файл lightbox.js
					// **получить скрипт - ссылка на lightbox.js
					if (getScript(window.top, "js/lightbox.js")) { // (i) если еще ни разу не было ни одного раскрытия скрытого контента на стр.
						if (retVal) window.top.setImageFullScreen(clone); // - вывод текущего lightbox в гл.окне
					} else {
						let js = setScript(window.top, "js/lightbox.js"); // - создать скрипт - ссылка на js-файл
						let idInt = setInterval(() => {
							if (js) {
								clearInterval(idInt);
								if (retVal) window.top.setImageFullScreen(clone); // - вывод текущего lightbox в гл.окне
							}
						}, 500);
					}
				}
			}
		} else if (eVent.target.classList.contains('zoom-out')) {
			toggleZoomerIcon(eVent.target, ""); // - переключить (+/-) иконку масштабирования
		} else if (eVent.target.parentElement.classList.contains('slider-item')) {
			// *установка на просмотр выбранного изо.из слайдера
			setImageCurrent(eVent.target); // - установить изо.текущим
		}
	}
}
// (!) удаляем css св-во "animation" по окончанию воспроизведения анимации, иначе она больше не будет воспроизводиться:
// 'slider-track - для 1-ого/последнего слайда
// ''img-viewer>.img-item: img-item-center/img-item-left/img-item-right/img-item-up/img-item-down
function lightbox_onAnimationend(eVent) {
	eVent.target.style.removeProperty('animation');
	eVent.target.removeEventListener('animationend', lightbox_onAnimationend, false);
}
// (!) создание/удаление обработчиков событий для узла.lightbox
function setEventHandlersLightbox(elem, addOrRemove = "") {
	// 'elem - lightbox/дочерние элементы
	// if (addOrRemove === "" && (addOrRemove !== String(addOrRemove) || typeof(addOrRemove) !== "string")) {
	if (addOrRemove !== "add" && addOrRemove !== "remove") {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setEventHandlersLightbox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	if (typeof(elem) === "undefined" || elem === null || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setEventHandlersLightbox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	} else if (!elem.classList.contains('lightbox')) {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - у элемента отсутствует класс, либо класс не определен:\n function setEventHandlersLightbox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")\n elem.classList: ${elem.classList}`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
		return false;
	}
	// *добавляем/удаляем обработчики событий
	if (addOrRemove === "add") {
		window.addEventListener('resize', lightbox_window_onReSize, false);
		elem.addEventListener('animationend', lightbox_onAnimationend, false);
		elem.addEventListener('mouseover', lightbox_onMouseover, false);
		elem.addEventListener('keydown', lightbox_onKeydown, false);
		elem.addEventListener('click', lightbox_onClick, false);
	} else if (addOrRemove === "remove") {
		window.removeEventListener('resize', lightbox_window_onReSize, false);
		elem.removeEventListener('animationend', lightbox_onAnimationend, false);
		elem.removeEventListener('mouseover', lightbox_onMouseover, false);
		elem.removeEventListener('keydown', lightbox_onKeydown, false);
		elem.removeEventListener('click', lightbox_onClick, false);
	}
	return true;
}
// (!) получить DOM-элемент - узел lightbox
function getLightbox(elem) {
	let lbx;
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		if (document.querySelectorAll('.lightbox').length !== 1) {
			console.error(`(!) Косяк: не удалось получить узел DOM-элемента lightbox - элемент не определен или определен не однозначно:\n function getLightbox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n document.querySelectorAll('.lightbox').length: ${document.querySelectorAll('.lightbox').length} !== 1: ${document.querySelectorAll('.lightbox').length !== 1}`);
			alert(`(!) Косяк: не удалось получить узел DOM-элемента lightbox - элемент не определен или определен не однозначно, см.консоль.`);
			return null;
		} else { // - пытаемся определить элемент в документе, если он единичный
			lbx = document.querySelector('.lightbox');
			if (typeof(lbx) === "undefined" || lbx === null && (lbx === Object(lbx) || typeof(lbx) === "object")) {
				console.error(`(!) Косяк: не удалось получить узел DOM-элемента lightbox - не найден элемент:\n function getLightbox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n lbx: typeof(${typeof(lbx)}) / Object(${Object(lbx)}) / ${lbx}\n lbx.tagName: ${lbx.tagName}, lbx.classList: ${lbx.classList}`);
				alert(`(!) Косяк: не удалось получить узел DOM-элемента lightbox - не найден элемент, см.консоль.`);
				return null;
			}
		}
	} else { // *ситуации, если:
		// 'elem - DOM-элемент вне узла lightbox, например ссылка-переключатель
		if (elem.classList.contains('toggle-dropdown')) {
			let tgl = elem.parentElement.nextElementSibling;
			if (typeof(tgl) === "undefined" || tgl === null && (tgl === Object(tgl) || typeof(tgl) === "object")) {
				console.error(`(!) Косяк: не удалось получить узел DOM-элемента lightbox - не найден элемент:\n function getLightbox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n tgl: typeof(${typeof(tgl)}) / Object(${Object(tgl)}) / ${tgl}\n tgl.tagName: ${tgl.tagName}, tgl.classList: ${tgl.classList}`);
				alert(`(!) Косяк: не удалось получить узел DOM-элемента lightbox - не найден элемент, см.консоль.`);
				return null;
			} else {
				if (tgl.tagName === "DIV" && tgl.classList.contains('toggle-content')) {
					if (elem.hasAttribute('num')) {
						for (let i = 0; i < tgl.children.length; i++) {
							if (+tgl.children[i].getAttribute('num') === +elem.getAttribute('num')) {
								return tgl.children[i];
							}
						}
					} else {
						if (tgl.children.length === 1) {
							return tgl.firstElementChild;
						} else { // перестраховка
							console.error(`(!) Косяк: не удалось получить узел DOM-элемента lightbox - элемент определен не однозначно:\n function getLightbox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n tgl: typeof(${typeof(tgl)}) / Object(${Object(tgl)}) / ${tgl}\n tgl.tagName: ${tgl.tagName}, tgl.classList: ${tgl.classList}\n tgl.children.length: ${tgl.children.length}`);
							alert(`(!) Косяк: не удалось получить узел DOM-элемента lightbox - элемент определен не однозначно, см.консоль.`);
							return null;
						}
					}
				}
			}
		} else { // ''elem - дочерний DOM-элемент узла lightbox
			lbx = elem;
			while (!lbx.classList.contains('lightbox')) { // - всплываем
				if (lbx.tagName === "BODY" || lbx.id === "idContentText") {
					console.error(`(!) Косяк: не удалось получить узел DOM-элемента lightbox - не найден элемент:\n function getLightbox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n lbx: typeof(${typeof(lbx)}) / Object(${Object(lbx)}) / ${lbx}\n lbx.tagName: ${lbx.tagName}, lbx.classList: ${lbx.classList}`);
					alert(`(!) Косяк: не удалось получить узел DOM-элемента lightbox - не найден элемент, см.консоль.`);
					return null;
				}
				lbx = lbx.parentElement;
			}
			return lbx;
		}
	}
}
// (!) проверка видимости DOM-элемента - узел lightbox
function hasLightboxVisible(elem) {
	// 'elem - toggle-content
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось проверить видимость DOM-элемента - узел lightbox - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function hasLightboxVisible(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк: не удалось проверить видимость DOM-элемента - узел lightbox - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	for (let i = 0; i < elem.children.length; i++) {
		if (!elem.children[i].classList.contains('toggle-collapse')) {
			return true;
		}
	}
	return false;
}
// (!) создать и получить копию/клона DOM-элемента - узел lightbox
function getLightboxCopy(elem) {
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось создать копию/клонировать элемент - узел для просмотра изо.во весь экран - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function getLightboxCopy(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось создать копию/клонировать элемент - узел для просмотра изображения во весь экран - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return null;
	}
	// 'elem - zoomer>zoom-in - tagName img
	// ''elem - lightbox - tagName div
	let lbx = null;
	if (elem.classList.contains('lightbox')) {
		lbx = elem;
	} else if (elem.classList.contains('zoom-in')) {
		lbx = getLightbox(elem); // - получить DOM-элемент - узел lightbox
		if (lbx === null || typeof(lbx) === "undefined") {
			console.error(`(!) Косяк: не удалось создать копию/клонировать элемент - узел для просмотра изо.во весь экран - не найден элемент:\n function getLightboxCopy(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n lbx: typeof(${typeof(lbx)}) / Object(${Object(lbx)}) / ${lbx}`);
			alert(`(!) Косяк: не удалось создать копию/клонировать элемент - узел для просмотра изо.во весь экран - не найден элемент, см.консоль.`);
			return null;
		}
	}
	// *варианты клонирования - копия узла:
	// '.cloneNode() - для копирования внутри того же документа (для клонирования узла из текущего document)
	// ''.importNode() - для копирования узлов из других документов (для клонирования узла из другого документа) importNode() копирует исходный элемент, не удаляя его
	// '''.adoptNode() - это еще один метод, который очень похож на importNode() с той разницей, что он удаляет исходный элемент из его родительского DOM. adoptNode() полностью удаляет исходный элемент из его DOM
	// ''''Object.assign({}, e.target) - вариант клонирования объекта
	// '''''structuredClone() - глубокое копирование - структурированное клонирование
	// let clone = document.importNode(lbx, true); // - создаем копию lightbox
	let clone = lbx.cloneNode(true); // - клонируем lightbox
	// *обрабатываем клон
	if (clone.hasAttribute('num')) {clone.removeAttribute('num');} // - убираем аттрибут "num"
	clone.style.removeProperty('height'); // убираем стили в элементе
	clone.querySelector('.lightbox-img').style.removeProperty('height'); // убираем стили в дочерних элементах
	// 'возвращаем иконку: zoom-in.png => zoom.png
	let imgZoom = clone.querySelector('.zoomer>img');
	if (typeof(imgZoom) !== "undefined" || imgZoom !== null && (imgZoom === Object(imgZoom) || typeof(imgZoom) === "object")) {
		// imgZoom.setAttribute('src', "icon/zoom.png");
		imgZoom.src = "icon/zoom.png";
	}
	// 'удаляем кнопку поднятия наверх, она нужна только в топике
	let btnTop = clone.querySelector('.btn-top');
	if (btnTop) {
		btnTop.remove();
	}
	// '
	let imgItem = clone.querySelector('.img-item');
	if (imgItem) {
		if (!imgItem.classList.contains('img-zoom100')) {
			imgItem.classList.add('img-zoom100');
		}
		// *анимируем появление/переключение по изо
		imgItem.style.setProperty('animation-name', 'img-item-center'); // или так
		// imgItem.style.animationName = "img-item-center"; // или так
		// imgItem.setAttribute('style', 'animation-name: img-item-center');
	}
	return clone;
}
// (!) setLightboxRemove - удаление DOM-элемента - узел lightbox в гл.окне
function setLightboxRemove(elem) {
	// 'elem - tagName div:
	// 'elem - lightbox-btn-close
	// ''elem - lightbox
	let lbx;
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		if (document.activeElement.classList.contains('lightbox')) {
			lbx = document.activeElement;
		} else if (document.activeElement.classList.contains('lightbox-btn-close')) {
			lbx = getLightbox(document.activeElement);
			if (lbx === null && lbx !== Object(lbx)) {
				lbx = document.querySelector('.lightbox');
				if (lbx === null && lbx !== Object(lbx)) {
					let btn = document.querySelector('.lightbox-btn-close');
					if (btn === null && btn !== Object(btn)) {
						console.error(`(!) Косяк: не удалось закрыть окно просмотра изо.во весь экран - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setLightboxRemove(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n document.activeElement: ${document.activeElement}\n lbx: typeof(${typeof(lbx)}) / Object(${Object(lbx)}) / ${lbx}\n btn: typeof(${typeof(btn)}) / Object(${Object(btn)}) / ${btn}`);
						alert(`(!) Косяк: не удалось закрыть окно просмотра изображений во весь экран - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
						return;
					} else {
						lbx = getLightbox(btn); // получить DOM-элемент - узел lightbox
						if (lbx === null && lbx !== Object(lbx)) {
							console.error(`(!) Косяк: не удалось закрыть окно просмотра изо.во весь экран - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setLightboxRemove(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n document.activeElement: ${document.activeElement}\n lbx: typeof(${typeof(lbx)}) / Object(${Object(lbx)}) / ${lbx}\n btn: typeof(${typeof(btn)}) / Object(${Object(btn)}) / ${btn}`);
							alert(`(!) Косяк: не удалось закрыть окно просмотра изображений во весь экран - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
							return;
						};
					}
				}
			}
		}
	} else {
		if (elem.classList.contains('lightbox')) {
			lbx = elem;
		} else if (elem.classList.contains('lightbox-btn-close')) {
			lbx = getLightbox(elem); // получить DOM-элемент - узел lightbox
		} else {
			lbx = getLightbox(elem); // получить DOM-элемент - узел lightbox
			if (lbx === null && lbx !== Object(lbx)) {
				console.error(`(!) Косяк: не удалось закрыть окно просмотра изо.во весь экран - у элемента отсутствует класс, либо класс не определен:\n function setLightboxRemove(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n elem.classList.contains('lightbox-btn-close'): ${elem.classList.contains('lightbox-btn-close')}\n elem.classList.contains('lightbox'): ${elem.classList.contains('lightbox')}\n elem.classList: ${elem.classList}`);
				alert(`(!) Косяк: не удалось закрыть окно просмотра изображений во весь экран - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
				return;
			}
		}
	}
	if (lbx) {
		lbx.remove(); // удаляем узел lightbox
		setEventHandlersLightbox(lbx, 'remove'); // создание/удаление обработчиков событий для узла.lightbox
	}
}
// (!) создать дочерний элемент изо
function writeImageElement(elem) {
	// 'elem - div lightbox
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось создать дочерний элемент изо - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function writeImageElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк: не удалось создать дочерний элемент изображения - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return null;
	} else if (elem.tagName === "DIV" && !elem.classList.contains('lightbox')) {
		console.error(`(!) Косяк: не удалось создать дочерний элемент изо - у элемента отсутствует класс, либо класс не определен:\n function writeImageElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк: не удалось создать дочерний элемент изображения - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
		return null;
	}
	let imgItem = null; // img img-item
	let txt = elem.querySelector('.img-title'); // div img-title
	let img = elem.querySelector('.slider-current>img'); // img slider-item
	let imgViewer = elem.querySelector('.img-viewer'); // div img-viewer
	if (txt === null || img === null || imgViewer === null) {
		console.error(`(!) Косяк: не удалось создать дочерний элемент изо - не найден элемент:\n function writeImageElement(elem: typeof(${typeof(elem)}), Object(${Object(elem)}, ${elem}):\n window.«${window.name}», location.origin: ${location.origin}\n 1) txt: typeof(${typeof(txt)}), Object(${Object(txt)}), ${txt}\n 2) img: typeof(${typeof(img)}), Object(${Object(img)}), ${img}\n 3) imgViewer: typeof(${typeof(imgViewer)}), Object(${Object(imgViewer)}), ${imgViewer}`);
		alert(`(!) Косяк: не удалось создать дочерний элемент изображения - не найден элемент, см.консоль.`);
		return null
	}
	if (imgViewer.children.length === 0) { // - img отсутствует, создаем его из слайдера
		imgViewer.insertAdjacentHTML('afterbegin', '<img class="img-item" src="' + img.src + '" alt="' + img.alt + '">');
		// imgViewer.insertAdjacentHTML('afterbegin', '<img class="img-item" src="' + img.src + '" alt="' + img.alt + '" style="animation-name:img-item-center;">'); // или так
		// imgViewer.insertAdjacentHTML('afterbegin', `<img class="img-item" src="${img.src}" alt="${img.alt}" style="animation-name:img-item-center;">`);
		// *проверяем наличие пользовательского аттрибута « cap »
		if (img.hasAttribute('cap')) {
			txt.innerHTML = img.getAttribute('cap');
		} else {
			txt.innerHTML = img.alt;
		}
		imgItem = elem.querySelector('.img-item');
	} return imgItem;
}
// (!) скрыть/отобразить кнопку масштабирование
function toggleZoomer(elem) {
	// 'elem - img-item - tagName img
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось скрыть/отобразить кнопку масштабирование элемента в окне просмотра изо - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function toggleZoomer(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк: не удалось показать/скрыть кнопку мастабирование элемента в окне просмотра изображения - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	} else if (!elem.classList.contains('img-item')) {
		console.error(`(!) Косяк: не удалось скрыть/отобразить кнопку масштабирование элемента в окне просмотра изо - у элемента отсутствует класс, либо класс не определен:\n function toggleZoomer(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n elem.classList.contains('img-item'): ${elem.classList.contains('img-item')}\n elem.classList: ${elem.classList}`);
		alert(`(!) Косяк: не удалось показать/скрыть кнопку мастабирование элемента в окне просмотра изображения - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
		return;
	}
	let lbx = getLightbox(elem);
	if (lbx === null || typeof(elem) === "undefined") {
		console.error(`(!) Косяк: не удалось скрыть/отобразить кнопку масштабирование элемента в окне просмотра изо - не найден элемент:\n function toggleZoomer(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n lbx: typeof(${typeof(lbx)}) / Object(${Object(lbx)}) / ${lbx}`);
		alert(`(!) Косяк: не удалось показать/скрыть кнопку мастабирование элемента в окне просмотра изображения - не найден элемент, см.консоль.`);
		return;
	}
	let zoomer = lbx.querySelector('.zoomer');
	if (typeof(zoomer) === "undefined" || zoomer === null && (zoomer === Object(zoomer) || typeof(zoomer) === "object")) {
		console.error(`(!) Косяк: не удалось скрыть/отобразить кнопку масштабирование элемента в окне просмотра изо - не найден элемент:\n function toggleZoomer(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n zoomer: typeof(${typeof(zoomer)}) / Object(${Object(zoomer)}) / ${zoomer}`);
		alert(`(!) Косяк: не удалось показать/скрыть кнопку мастабирование элемента в окне просмотра изображения - не найден элемент, см.консоль.`);
		return;
	}
	if (elem.naturalWidth > 300) {
		if (zoomer.style.display === "none") {
			zoomer.removeAttribute('style');
		}
	} else {zoomer.style.display = "none"}
}
// (!) переключить (+/-) иконку масштабирования
function toggleZoomerIcon(elem, typeEvent = "") {
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось переключить (+/-) иконку масштабирования - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function toggleZoomerIcon(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}: window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось переключить (+/-) иконку масштабирования - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	if (typeof(typeEvent) === "undefined" || typeEvent !== String(typeEvent) || typeof(typeEvent) !== "string") {
		console.error(`(!) Косяк: не удалось переключить (+/-) иконку масштабирования - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function toggleZoomerIcon(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}: window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось переключить (+/-) иконку масштабирования - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	// 'elem - tagName img:
	// '.img-item <=>.img-item.img-zoom100 текущ.фрейма
	// ''.zoomer>.zoom-in <=>.zoom-out гл.окна
	let lbx = getLightbox(elem); // - lightbox гл.окна
	if (lbx === null || typeof(lbx) === "undefined") { return; }
	// (?)~не понятно работает или нет
	// if (typeEvent !== "mouseover" && typeEvent !== "mouseout") {
	// 	lbx.scrollIntoView({behavior: "smooth"}); // переход к элементу - не путать с фокусированием {behavior: "smooth", block: "center", inline: "start"}
	// 	if (!(elem.classList.contains('zoom-in') || elem.classList.contains('zoom-out'))) {
	// 		setFocus(lbx, 'focusIn'); // фокусировка на lightbox
	// 	}
	// }
	let imgItem = null;
	if (elem.classList.contains('img-item')) {
		imgItem = elem;
	} else if (elem.classList.contains('zoom-in') || elem.classList.contains('zoom-out')) {
		imgItem = lbx.querySelector('.img-item');
		if (typeof(imgItem) === "undefined" || imgItem === null && (imgItem === Object(imgItem) || typeof(imgItem) === "object")) {
			console.error(`(!) Косяк: не удалось переключить (+/-) иконку масштабирования - не найден элемент:\n function toggleZoomerIcon(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n imgItem: typeof(${typeof(imgItem)}) / Object(${Object(imgItem)}) / ${imgItem}`);
			alert(`(!) Косяк: не удалось переключить (+/-) иконку масштабирования - не найден элемент, см.консоль.`);
			return;
		}
	}
	if (imgItem.naturalWidth > 300) { // - проверяем размер изо
		let zoom = lbx.querySelector('.zoomer>img');
		if (typeof(zoom) === "undefined" || zoom === null && (zoom === Object(zoom) || typeof(zoom) === "object")) {
			console.error(`(!) Косяк: не удалось переключить (+/-) иконку масштабирования - не найден элемент:\n function toggleZoomerIcon(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n zoom: typeof(${typeof(zoom)}) / Object(${Object(zoom)}) / ${zoom}`);
			alert(`(!) Косяк: не удалось переключить (+/-) иконку масштабирования - не найден элемент, см.консоль.`);
			return;
		}
		if (window === top || window.name === "") {
			if (typeEvent === "mouseover") { // - меняется только иконка
				if (zoom.classList.contains('zoom-in')) {
					// zoom.setAttribute('src', 'icon/zoom-in.png'); // или так
					zoom.src = "icon/zoom-in.png";
				} else if (zoom.classList.contains('zoom-out')) {
					// zoom.setAttribute('src', 'icon/zoom-out.png'); // или так
					zoom.src = "icon/zoom-out.png";
				}
			} else if (typeEvent === "mouseout") { // - меняется только иконка
				// zoom.setAttribute('src', 'icon/zoom.png'); // или так
				zoom.src = "icon/zoom.png";
			} else { // - меняется и правило, и иконка
				// tmp: (?) как различить 2 случая, когда окно яв-ся гл.
				// 'Косяк наблюдается, если открыть стр.в отд.вкладке или отд.окном, по ск-ку css правило img-zoom100 для lightbox в гл.окне работает противоположно правилу img-zoom100 для lightbox в теме топика
				imgItem.classList.toggle('img-zoom100');
				if (imgItem.classList.contains('img-zoom100')) {
					zoom.classList.remove('zoom-out');
					zoom.classList.add('zoom-in');
					if (elem.classList.contains('zoom-in') || elem.classList.contains('zoom-out')) {
						// zoom.setAttribute('src', 'icon/zoom-in.png'); // или так
						zoom.src = "icon/zoom-in.png";
					}
				} else {
					zoom.classList.remove('zoom-in');
					zoom.classList.add('zoom-out');
					if (elem.classList.contains('zoom-in') || elem.classList.contains('zoom-out')) {
						// zoom.setAttribute('src', 'icon/zoom-out.png'); // или так
						zoom.src = "icon/zoom-out.png";
					}
				}
			}
		} else if (window === self || self !== top && window.name !== "") { // еще вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
			if (typeEvent === "mouseover") { // - меняется только иконка
				// zoom.setAttribute('src', 'icon/zoom-in.png'); // или так
				zoom.src = "icon/zoom-in.png";
			} else if (typeEvent === "mouseout") { // - меняется только иконка
				// zoom.setAttribute('src', 'icon/zoom.png'); // или так
				zoom.src = "icon/zoom.png";
			} else { // - меняется только правило
				// (!) css правило img-zoom100 для lightbox в гл.окне работает противоположно правилу img-zoom100 для lightbox в теме топика
				imgItem.classList.toggle('img-zoom100');
				if (imgItem.classList.contains('img-zoom100')) {
					zoom.classList.remove('zoom-out');
					zoom.classList.add('zoom-in');
				} else {
					zoom.classList.remove('zoom-out');
					zoom.classList.add('zoom-in');
				}
			}
		}
	}
}
// (!) установить значок курсора
function setCursorIcon(elem) {
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось установить значок изображения курсора - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setCursorIcon(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк: не удалось установить значок изображения курсора - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	// 'elem - img-item - tagName img
	if (elem.naturalWidth > 300) {
		if (elem.style.cursor === "default") {
			elem.style.removeProperty('cursor'); // - удалить css св-во
		}
	} else {
		if (elem.style.cursor !== "default") {elem.style.cursor = "default";}
	}
}
// (!) переключатель иконки/списка для скрытого контента в теме топика
function setToggleIcon(elem = null, btnValue = null) {
	// 'elem - tagName: img/a/any elem (UL/LI/p)..?
	// ''btnValue - boolean tagName div.toolbar_box-center>img: idExpandOn/idExpandOff
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		if (btnValue === null || typeof(btnValue) !== "boolean" || btnValue !== Boolean(btnValue)) {
			console.error(`(!) Косяк: не удалось выполнить изменение иконки-переключателя - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setToggleIcon(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, btnValue = ${btnValue})`);
			alert(`(!) Косяк: не удалось выполнить изменение иконки-переключателя - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
			return;
		}
	}
	if (btnValue === null) { // - для текущего элемента(-ов)
		// 'elem - tagName img
		// ''elem - tagName a
		// *получаем общий DOM-узел
		let el = elem;
		while (!el.parentElement.classList.contains('content-text')) { // поднимаемся выше до <DIV> id="idContentText"
			el = el.parentElement;
		}
		let nextSib = null;
		if (el.querySelectorAll('.toggle-dropdown').length > 0) {
			if (el.nextElementSibling.hasAttribute('class')) {
				if (el.nextElementSibling.classList.contains('toggle-content')) {
					nextSib = el.nextElementSibling; // - получим объект HTML-collection - сосед с классом.toggle-content
				}
			}
		}
		let chdn = null;
		for (let i = 0; i < el.children.length; i++) {
			if (el.children[i].children.length > 0) {
				chdn = el.children[i].firstElementChild; // запоминаем узел
				break;
			}
		}
		if (chdn === null) {
			let img = el.querySelector('.toggle-icon');
			if (el.classList.contains('toggle-list') || img !== null) {
				let arr = Array.prototype.slice.call(el.querySelectorAll('.toggle-content')); // - span's, преобразуем NodeList в массив
				if (nextSib !== null) {
					let list = el.querySelectorAll('.toggle-dropdown'); // - a's
					if (list.length > 0) {
						list.forEach(link => {
							if (link.hasAttribute('num')) {
								for (let i = 0; i < nextSib.children.length; i++) {
									if (+nextSib.children[i].getAttribute('num') === +link.getAttribute('num')) {
										arr.push(nextSib.children[i]);
										break;
									}
								}
							} else {
								arr.push(nextSib);
							}
						});
					}
				}
				if (arr.length > 0) {
					let showIs = false; // определение для каждой иконки/списка-переключателя
					for (let j = 0; j < arr.length; j++) {
						if (!arr[j].classList.contains('toggle-collapse')) {
							showIs = true;
							break;
						}
					}
					if (img !== null) {
						if (showIs) {
							if (img.getAttribute('src') === "icon/tgl-fri.png") {
								img.setAttribute('src', 'icon/tgl-fri_0.png');
							} else if (img.getAttribute('src') === "icon/tgl-expand1.gif") {
								// img.setAttribute('src', 'icon/tgl-collapse1.gif');
								img.src = "icon/tgl-collapse1.gif";
							}
						} else {
							if (img.getAttribute('src') === "icon/tgl-fri_0.png") {
								img.setAttribute('src', 'icon/tgl-fri.png');
								} else if (img.getAttribute('src') === "icon/tgl-collapse1.gif") {
									// img.setAttribute('src', 'icon/tgl-expand1.gif');
									img.src = "icon/tgl-expand1.gif";
								}
						}
					}
					if (el.hasAttribute('class')) {
						if (el.classList.contains('toggle-list')) {
							if (showIs) {
								if (el.classList.contains('list-style-fri-expand')) {
									el.classList.replace("list-style-fri-expand", "list-style-fri-collapse");
								} else if (el.classList.contains('list-style-expand')) {
									el.classList.replace("list-style-expand", "list-style-collapse");
								}
							} else {
								if (el.classList.contains('list-style-fri-collapse')) {
									el.classList.replace("list-style-fri-collapse", "list-style-fri-expand");
								} else if (el.classList.contains('list-style-collapse')) {
									el.classList.replace("list-style-collapse", "list-style-expand");
								}
							}
						}
					}
				}
			}
		} else { // - если есть глубина
			// 1) Array.from(chdn.parentElement.children).indexOf(chdn); // получить номер индекса текущего дочернего эл.
			// 2) Array.prototype.indexOf.call(chdn.parentElement.children, chdn);
			while (!chdn.parentElement.classList.contains('content-text')) {
				if (chdn.children.length > 0) { // - погружаемся
					chdn = chdn.firstElementChild; // перезаписываем узел
				} else { // - перебираем соседей
					if (chdn.nextElementSibling !== null) {
						chdn = chdn.nextElementSibling;
					} else {
						while (chdn.nextElementSibling === null) { // - всплываем
							chdn = chdn.parentElement; // перезаписываем узел
							let img = chdn.querySelector('.toggle-icon');
							if (chdn.classList.contains('toggle-list') || img !== null) {
								let arr = []; // объекты для последующей проверки
								if (chdn.parentElement.classList.contains('content-text')) { // для общей иконки/списка-переключателя проверяем состояние скрытых переключателей на общей основе
									arr = Array.prototype.slice.call(chdn.querySelectorAll('.toggle-content'));
									if (nextSib !== null) arr.push(nextSib);
								} else {
									for (let j = 0; j < chdn.children.length; j++) {
										if (chdn.children[j].classList.contains('toggle-content')) { // - span
											arr.push(chdn.children[j]);
										} else if (chdn.children[j].classList.contains('toggle-dropdown')) { // - a
											if (nextSib !== null) {
												if (chdn.children[j].hasAttribute('num')) {
													for (let n = 0; n < nextSib.children.length; n++) {
														if (+nextSib.children[n].getAttribute('num') === +chdn.children[j].getAttribute('num')) {
															arr.push(nextSib.children[n]);
															break;
														}
													}
												} else {
													arr.push(nextSib);
												}
											}
										}
									}
								}
								if (arr.length > 0) {
									let showIs = false; // определение для каждой иконки/списка-переключателя
									for (let j = 0; j < arr.length; j++) {
										if (!arr[j].classList.contains('toggle-collapse')) {
											showIs = true;
											break;
										}
									}
									if (img !== null) {
										if (showIs) {
											if (img.getAttribute('src') === "icon/tgl-fri.png") {
												img.setAttribute('src', 'icon/tgl-fri_0.png');
											} else if (img.getAttribute('src') === "icon/tgl-expand1.gif") {
												// img.setAttribute('src', 'icon/tgl-collapse1.gif');
												img.src = "icon/tgl-collapse1.gif";
											}
										} else {
											if (img.getAttribute('src') === "icon/tgl-fri_0.png") {
												img.setAttribute('src', 'icon/tgl-fri.png');
												} else if (img.getAttribute('src') === "icon/tgl-collapse1.gif") {
													// img.setAttribute('src', 'icon/tgl-expand1.gif');
													img.src = "icon/tgl-expand1.gif";
												}
										}
									}
									if (chdn.hasAttribute('class')) {
										if (chdn.classList.contains('toggle-list')) {
											if (showIs) {
												if (chdn.classList.contains('list-style-fri-expand')) {
													chdn.classList.replace("list-style-fri-expand", "list-style-fri-collapse");
												} else if (chdn.classList.contains('list-style-expand')) {
													chdn.classList.replace("list-style-expand", "list-style-collapse");
												}
											} else {
												if (chdn.classList.contains('list-style-fri-collapse')) {
													chdn.classList.replace("list-style-fri-collapse", "list-style-fri-expand");
												} else if (chdn.classList.contains('list-style-collapse')) {
													chdn.classList.replace("list-style-collapse", "list-style-expand");
												}
											}
										}
									}
								}
							}
							if (chdn.parentElement.classList.contains('content-text')) {
								break;
							}
						}
						if (chdn.parentElement.classList.contains('content-text')) {
							break;
						} else {
							chdn = chdn.nextElementSibling;
						}
					}
				}
				if (chdn.classList.contains('content-text')) { // на всякий случай
					break;
				}
			}
		}
	} else { // - кнопка idExpandOn/idExpandOff - для всех эл-в на всей странице
		if (typeof(btnValue) !== "boolean" || btnValue !== Boolean(btnValue)) {
			console.error(`(!) Косяк - не удалось выполнить изменение иконки - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setToggleIcon(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, btnValue = ${btnValue})`);
			alert(`(!) Косяк - не удалось выполнить изменение иконки - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
			return;
		}
		// TODO: (!) похорошему надо переделывать - предположительно правильно перебрать на странице по гл.иконкам/спискам-переключателям и делать в каждый углубление
		// *преобразуем NodeList в массив
		let arr = Array.prototype.slice.call(document.getElementById('idContentText').querySelectorAll('.toggle-icon'));
		let list = Array.prototype.slice.call(document.getElementById('idContentText').querySelectorAll('.toggle-list'));
		list.forEach(tgl => { // - во избежание в массиве др.массива
			if (Array.isArray(tgl)) {
				for (let i = 0; i < tgl.length; i++) {
					arr.push(tgl[i]);
				}
			} else {
				arr.push(tgl);
			}
		});
		if (arr.length > 0) {
			arr.forEach(ico => {
				if (ico.tagName === "IMG") {
					if (btnValue) { // - контент скрыт, отображаем
						if (ico.getAttribute('src') === "icon/tgl-fri.png") {
							ico.setAttribute('src', 'icon/tgl-fri_0.png');
						} else if (ico.getAttribute('src') === "icon/tgl-expand1.gif") {
							// ico.setAttribute('src', 'icon/tgl-collapse1.gif');
							ico.src = "icon/tgl-collapse1.gif";
						}
					} else { // - контент раскрыт, скрываем
						if (ico.getAttribute('src') === "icon/tgl-fri_0.png") {
							ico.setAttribute('src', 'icon/tgl-fri.png');
						} else if (ico.getAttribute('src') === "icon/tgl-collapse1.gif") {
							// ico.setAttribute('src', 'icon/tgl-expand1.gif');
							ico.src = "icon/tgl-expand1.gif";
						}
					}
				} else if (ico.tagName === "UL" || ico.tagName === "OL" || ico.tagName === "LI") {
					if (btnValue) { // - контент скрыт, отображаем
						if (ico.classList.contains('list-style-fri-expand')) {
							ico.classList.replace("list-style-fri-expand", "list-style-fri-collapse");
						} else if (ico.classList.contains('list-style-expand')) {
							ico.classList.replace("list-style-expand", "list-style-collapse");
						}
					} else { // - контент раскрыт, скрываем
						if (ico.classList.contains('list-style-fri-collapse')) {
							ico.classList.replace("list-style-fri-collapse", "list-style-fri-expand");
						} else if (ico.classList.contains('list-style-collapse')) {
							ico.classList.replace("list-style-collapse", "list-style-expand");
						}
					}
				}
			});
		}
	}
}
// (!) переключить встроенный элемент
function toggleInlineElement(elem) {
	// 'elem - tagName a.toggle-inline
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось переключить встроенный элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function toggleInlineElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк: не удалось переключить встроенный элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	} else if (!elem.classList.contains('toggle-inline')) {
		console.error(`(!) Косяк: не удалось переключить встроенный элемент - у элемента отсутствует класс, либо класс не определен:\n function toggleInlineElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n elem.classList.contains('toggle-inline'): ${elem.classList.contains('toggle-inline')}\n elem.classList: ${elem.classList}`);
		alert(`(!) Косяк: не удалось переключить встроенный элемент - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
		return;
	}
	// *меняем состояние отображения span.toggle-content
	if (typeof(elem.nextElementSibling) === "undefined" || elem.nextElementSibling === null && (elem.nextElementSibling === Object(elem.nextElementSibling) || typeof(elem.nextElementSibling) === "object")) {
		console.error(`(!) Косяк: не удалось переключить встроенный элемент - не найден элемент:\n function toggleInlineElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n elem.nextElementSibling: ${typeof(elem.nextElementSibling)} / Object(${Object(elem.nextElementSibling)}) / ${elem.nextElementSibling}`);
		alert(`(!) Косяк: не удалось переключить встроенный элемент - не найден элемент, см.консоль.`);
		return;
	} else if (elem.nextElementSibling.classList.contains('toggle-content')) {
		elem.nextElementSibling.classList.toggle('toggle-collapse');
	} else {
		console.error(`(!) Косяк: не удалось переключить встроенный элемент - у элемента отсутствует класс, либо класс не определен:\n function toggleDropdownElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n elem.classList.contains('toggle-content'): ${elem.classList.contains('toggle-content')}\n elem.classList: ${elem.classList}`);
		alert(`(!) Косяк: не удалось переключить встроенный элемент - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
		return;
	}
}
// (!) переустановить размер элемента просмотра изо
function setReSizeViewerImg(elem) {
	// 'elem - tagName div.lightbox
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось переустановить размер элемента просмотра изо - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setReSizeViewerImg(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n window.«${window.name}», location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось переустановить размер элемента просмотра изображения - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	} else if (elem.tagName === "DIV" && !elem.classList.contains('lightbox')) {
		console.error(`(!) Косяк: не удалось переустановить размер элемента просмотра изо - у элемента отсутствует класс, либо класс не определен:\n function setReSizeViewerImg(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n window.«${window.name}», location.origin: ${location.origin}:\n elem.tagName: ${elem.tagName}\n elem.classList.contains('lightbox'): ${elem.classList} = ${elem.classList.contains('lightbox')}`);
		alert(`(!) Косяк: не удалось переустановить размер элемента просмотра изображения - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
		return;
	}
	let lbxImg = elem.querySelector('.lightbox-img');
	// 'только для топика
	if (window !== self || self !== top || window !== top && window.name !== "") {
		// *проверяем внутренний размер окна без полос прокрутки
		if (document.documentElement.clientHeight < 530) { // удаляем стиль
			elem.style.removeProperty('height');
			if (lbxImg === null) {
				console.error(`(!) Косяк: не удалось переустановить размер элемента просмотра изо - не найден элемент:\n function setReSizeViewerImg(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n window.«${window.name}», location.origin: ${location.origin}:\n lbxImg: typeof(${typeof(lbxImg)}) / Object(${Object(lbxImg)}) / ${lbxImg}, lbxImg.classList: ${lbxImg.classList}`);
				alert(`(!) Косяк: не удалось переустановить размер элемента просмотра изображения - не найден элемент, см.консоль.`);
				return;
			}
			lbxImg.style.removeProperty('height');
			return;
		}
	}
	// ''как для гл.окна, так и в топике
	let txt = elem.querySelector('.img-title');
	let sldr = elem.querySelector('.img-slider');
	if (lbxImg === null || txt === null) {
		console.error(`(!) Косяк: не удалось переустановить размер элемента просмотра изо - не найден элемент:\n function setReSizeViewerImg(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n window.«${window.name}», location.origin: ${location.origin}:\n 1) lbxImg: typeof(${typeof(lbxImg)}) / Object(${Object(lbxImg)}) / ${lbxImg}, lbxImg.classList: ${lbxImg.classList}\n 2) txt: typeof(${typeof(txt)}) / Object(${Object(txt)}) / ${txt}, txt.classList: ${txt.classList}`);
		alert(`(!) Косяк: не удалось переустановить размер элемента просмотра изображения - не найден элемент, см.консоль.`);
		return;
	}
	// *определяем высоту.lightbox
	let lbxHeight = null;
	// *отталкиваемся от высоты видимой части контента, т.е.высота.lightbox = высоте idTopicBody.clientHeight - видимая часть контента на стр.
	let idTpCnt = document.getElementById('idTopicBody');
	if (idTpCnt === null) { // - копия lightbox создана в гл.окне, а не открыта отд.окном
		// lbxHeight = getValueFullSizeProperty(elem).height; // получить полноразмерное значение св-ва
		lbxHeight = window.top.document.documentElement.clientHeight;
	} else { // - lightbox во фрейме или стр.открыта отд.окном
		lbxHeight = getValueFullSizeProperty(idTpCnt).height; // получить полноразмерное значение св-ва
	}
	// *минусуем padding.lightbox
	lbxHeight = lbxHeight - (parseInt(getComputedStyle(elem, null).paddingTop, 10) + parseInt (getComputedStyle(elem, null).paddingBottom, 10));
	if (window !== self || self !== top || window !== top && window.name !== "") {
		elem.style.height = lbxHeight + "px";
	} else { // для lightbox в гл.окне удаляем стиль высоты
		elem.style.removeProperty('height');
	}
	// *определяем высоту у остальных элементов с учетом margin, padding, border, кот.не будут учитываться, т.к.box-sizing для.lightbox-img изменяет алгоритм расчета ширины и высоты элемента
	let txtHeight = getValueFullSizeProperty(txt).height; // получить полноразмерное значение св-ва
	// *если изо.одиночное, чтобы вместо узла DOM элемента не получить « NAN »
	if (sldr === null) {
		lbxImg.style.height = lbxHeight - txtHeight + "px";
	} else {
		let sldrHeight = getValueFullSizeProperty(sldr).height; // получить полноразмерное значение св-ва
		lbxImg.style.height = lbxHeight - (txtHeight + sldrHeight) + "px";
	}
}
// (!) переключить выпадающий эл.
function toggleDropdownElement(elem) {
	// 'elem:
	// 'div.lightbox (img/video)
	// ''др.потомок.toggle-content
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error("(!) Косяк: не удалось переключить выпадающий элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function toggleDropdownElement(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin);
		alert(`(!) Косяк: не удалось переключить выпадающий элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	let tgl = elem.parentElement;
	if (tgl.hasAttribute('class')) {
		if (!tgl.classList.contains('toggle-content')) {
			while (!el.parentElement.classList.contains('content-text')) { // поднимаемся выше до <DIV> id="idContentText"
				tgl = tgl.parentElement;
				if (tgl.tagName === "BODY") {
					console.error("(!) Косяк: не удалось переключить выпадающий элемент - не найден элемент:\n function toggleDropdownElement(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin, "\n tgl: ", tgl);
					alert(`(!) Косяк: не удалось переключить выпадающий элемент - не найден элемент, см.консоль.`);
					return;
				} else if (tgl.hasAttribute('class')) {
					if (tgl.classList.contains('toggle-content')) {
						break;
					}
				}
			}
		}
	}
	function setToggleLightbox(lbx) {
		if (lbx.querySelectorAll('.lightbox-img').length > 0) { // - изо
			if (lbx.classList.contains('toggle-collapse')) { // - отображаем
				// setEventHandlersLightbox(lbx, 'add'); // создание/удаление обработчиков событий для узла.lightbox
				// 'проверяем существование (existence) элемента.img-item в.img-viewer
				let imgItem = lbx.querySelector('.img-item');
				if (typeof(imgItem) === "undefined" || imgItem === null && (imgItem === Object(imgItem) || typeof(imgItem) === "object")) {
					if (lbx.querySelector('.img-slider')) { // - если есть слайдер
						imgItem = writeImageElement(lbx); // создать дочерний элемент изо.в текущем.lightbox
					} else {
						console.error("(!) Косяк: не удалось получить элемент с классом.img-item/.img-slider для одиночного.lightbox:\n function toggleDropdownElement(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin, "imgItem: ", imgItem);
						alert(`(!) Косяк: не удалось получить элемент с классом.img-item для одиночного.lightbox, см.консоль.`);
					}
				}
				toggleZoomer(imgItem); // скрыть/отобразить кнопку масштабирование
				setCursorIcon(imgItem); // установить значок курсора
				lbx.classList.remove('toggle-collapse'); // отображаем.lightbox
				lbx.tabIndex = "0"; // для возможности перевести фокус
				tgl.classList.remove('toggle-collapse'); // отображаем div.toggle-content
				// (i) переустанавливаем размер только после того, как будет отображен сам div.toggle-content
				setReSizeViewerImg(lbx); // переустановить размер элемента просмотра изо
				// *анимируем появление/переключение по изо
				imgItem.style.setProperty('animation-name', 'img-item-center'); // или так
				// imgItem.style.animationName = "img-item-center"; // или так
				// imgItem.setAttribute('style', 'animation-name: img-item-center');
			} else { // - скрываем
				lbx.removeAttribute('tabIndex');
				// setFocus(lbx, 'focusOut'); // фокусировка на.узел эл. // перенесено в setToggleElement()
				lbx.classList.add('toggle-collapse'); // скрываем.lightbox
				// setEventHandlersLightbox(lbx, 'remove'); // создание/удаление обработчиков событий для узла.lightbox
				// *проверяем видимость др.эл.-узлов, вложенных в.toggle-content, если есть хотя бы 1 раскрытый узел,.toggle-content остается видимым
				// if (hasLightboxVisible(tgl)) { // проверка по каждому узлу в.toggle-content
				if (tgl.children.length === tgl.querySelectorAll('.lightbox.toggle-collapse').length) {
					tgl.classList.add('toggle-collapse'); // скрываем div.toggle-content
				} else {
					tgl.classList.remove('toggle-collapse'); // отображаем div.toggle-content
				}
			}
		} else if (lbx.querySelectorAll('.lightbox-video').length > 0) { // - видео
			console.info("function setToggleLightbox(lbx: ", lbx, ")");
		}
	}
	if (elem.classList.contains('lightbox')) {
		setToggleLightbox(elem);
	} else { // потомок.toggle-content:.footnote/...
		// console.log("elem.classList.length: ", elem.classList.length, "\n elem.classList.value: ", elem.classList.value, "\n elem.classList: ", elem.classList);
		if (elem.hasAttribute('class')) {
			if (elem.classList.contains('toggle-collapse')) { // - отображаем
				elem.classList.remove('toggle-collapse');
				tgl.classList.remove('toggle-collapse');
			} else { // - скрываем
				tgl.classList.add('toggle-collapse');
				elem.classList.add('toggle-collapse');
			}
		} else if (elem.hasAttribute('style')) {
			if (elem.style.display === "none") { // - отображаем
				tgl.classList.remove('toggle-collapse');
				elem.style.removeProperty('display'); // удаляем css св-во
			} else { // - скрываем
				tgl.classList.add('toggle-collapse');
				elem.style.display = "none";
			}
		} else {
			tgl.classList.toggle('toggle-collapse');
		}
	}
}
// (!) установить элемент переключения скрытого контента - развернуть/свернуть скрытый контент
function setToggleElement(elem) {
	// (i)(!) для неск-их сгруппированных скрытых контентов в одном текущем абзаце работает принцип переключателя
	// elem - tagName a/img //~null (для кн.div.toolbar_box-center>img: idExpandOn/idExpandOff)
	if (!elem === null && !elem.classList.contains('toggle-icon') && !elem.classList.contains('toggle-inline') && !elem.classList.contains('toggle-dropdown')) {
		console.error("(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setToggleElement(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin);
		alert(`(!) Косяк: не удалось выполнить переключение элементов скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	function getToggleNode(item) {
		if (item === null && item !== Object(item)) {
			console.error("(!) Косяк: не удалось выполнить переключение элементов скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function getToggleNode(item: ", item, "): window.«", window.name, "», location.origin: ", location.origin);
			alert(`(!) Косяк: не удалось выполнить переключение элементов скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
			return null;
		}
		if (item.hasAttribute('class')) {
			if (item.classList.contains('toggle-icon') || item.classList.contains('toggle-dropdown') || item.classList.contains('toggle-inline')) { // a/img
				let el = item;
				while (!el.parentElement.classList.contains('content-text')) { // поднимаемся выше до <DIV> id="idContentText"
					el = el.parentElement;
					if (el.tagName === "BODY") {
						console.error("(!) Косяк: не удалось получить узел скрытого контента - не найден элемент:\n function getToggleNode(item: ", item, "): window.«", window.name, "», location.origin: ", location.origin, "\n el: ", el);
						alert(`(!) Косяк: не удалось получить узел скрытого контента - не найден элемент, см.консоль.`);
						break;
					}
				}
				if (el.nextElementSibling.classList.contains('toggle-content')) {
					return el.nextElementSibling;
				}
			} else { // потомок.toggle-content - lightbox
				let el = item;
				while (!el.parentElement.classList.contains('content-text')) { // поднимаемся выше до <DIV> id="idContentText"
					el = el.parentElement;
					if (el.tagName === "BODY") {
						console.error("(!) Косяк: не удалось получить узел скрытого контента - не найден элемент:\n function getToggleNode(item: ", item, "): window.«", window.name, "», location.origin: ", location.origin, "\n el: ", el);
						alert(`(!) Косяк: не удалось получить узел скрытого контента - не найден элемент, см.консоль.`);
						break;
					}
				}
				if (el.hasAttribute('class')) {
					if (el.classList.contains('toggle-content')) {
						return el;
					}
				}
			}
		}
		return null;
	}
	function tglDropdownItem(item) {
		// 'item - tagName a.toggle-dropdown
		if (typeof(item) === "undefined" || item === null && (item === Object(item) || typeof(item) === "object")) {
			console.error("(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function tglDropdownItem(item: ", item, "): window.«", window.name, "», location.origin: ", location.origin);
			alert(`(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
			return null;
		}
		let lbx = null;
		// проверка наличия якоря
		// getAttribute если (# + ...) вернет string || null если (#) заглушка
		if (item.hash !== "" && item.hash.length > 0 && item.getAttribute('hash') !== "") {
			const hash = item.href.slice(item.href.lastIndexOf("#") + 1);
			if (hash !== "" && hash.length > 0) { // ~НЕ заглушка
				lbx = document.getElementById(hash);
				if (lbx !== null && lbx === Object(lbx)) {
					toggleDropdownElement(lbx); // переключить выпадающий эл.
				} else {
					console.error("(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - не найден элемент:\n function tglDropdownItem(item: ", item, "): window.«", window.name, "», location.origin: ", location.origin, "\n hash: ", hash, "lbx: ", lbx);
					alert(`(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - не найден элемент, см.консоль.`);
					return lbx;
				}
			} else if (hash === "" && hash.length === 0) { // заглушка
				// потомок.toggle-content:.footnote/...
				let tgl = getToggleNode(item);
				if (tgl !== null && tgl === Object(tgl)) {
					for (let i = 0; i < tgl.children.length; i++) {
						toggleDropdownElement(tgl.children[i]); // переключить выпадающий эл.
					}
				}
			}
		} else { // (item.getAttribute('hash') === null) // ~заглушка
			// потомок.toggle-content:.footnote/...
			let tgl = getToggleNode(item);
			if (tgl !== null && tgl === Object(tgl)) {
				for (let i = 0; i < tgl.children.length; i++) {
					toggleDropdownElement(tgl.children[i]); // переключить выпадающий эл.
				}
			}
		}
		return lbx;
	}
	function setFocusLoss(el = document) {
		let list = null;
		if (el === document) {
			list = el.getElementById('idTopicBody').querySelectorAll('.toggle-collapse[tabIndex="0"]'); // NodeList
			if (list.length === 0) return;
		} else {
			if (el.hasAttribute('class')) {
				if (el.classList.contains('toggle-content')) {
					list = el.querySelectorAll('.toggle-collapse[tabIndex="0"]'); // NodeList
					if (list.length === 0) return;
				} else {
					const tgl = getToggleNode(el);
					if (tgl !== null && tgl === Object(tgl)) {
						list = tgl.querySelectorAll('.toggle-collapse[tabIndex="0"]'); // NodeList
						if (list.length === 0) return;
					}
				}
			}
		}
		if (list !== null && list.length > 0) {
			list.forEach(item => {
				if (item.hasAttribute('tabIndex')) { // наличие аттрибута в теге html
					item.removeAttribute('tabIndex');
				}
			});
		}
	}
	// '
	if (elem === null) { // ~работаем по всем элементам на стр.
		// 'toggle-content - tagName: div/span; lightbox's - tagName div; toggle-dropdown/toggle-inline - tagName a; toggle-icon - tagName img
		let elems = document.getElementById('idTopicBody').querySelectorAll('.toggle-content');
		if (elems.length === 0) {
			console.info("(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - не найден(-ы) элемент(-ы):\n function setToggleElement(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin, "\n elems: ", elems);
			alert(`(i) Косяк: не удалось выполнить переключение элементов скрытого контента - не найден(-ы) элемент(-ы), см.консоль.`);
			return;
		}
		// elems.forEach(tgl => { // ~классическая проверка
		// 	if (getButtonExpand().value) { // - скрываем
		// 		tgl.classList.add('toggle-collapse'); // div/span // 'если.toggle-content содержит.lightbox's, значит это div, если нет это span
		// 		for (let i = 0; i < tgl.children.length; i++) {
		// 			if (tgl.children[i].hasAttribute('class')) {
		// 				if (tgl.children[i].classList.contains('lightbox')) {
		// 					if (!tgl.children[i].classList.contains('toggle-collapse')) {
		// 						toggleDropdownElement(tgl.children[i]);
		// 					}
		// 				}
		// 			}
		// 		}
		// 	} else { // - отображаем
		// 		tgl.classList.remove('toggle-collapse'); // div/span // 'если.toggle-content содержит.lightbox's, значит это div, если нет это span
		// 		for (let i = 0; i < tgl.children.length; i++) {
		// 			if (tgl.children[i].hasAttribute('class')) {
		// 				if (tgl.children[i].classList.contains('lightbox')) {
		// 					if (tgl.children[i].classList.contains('toggle-collapse')) {
		// 						toggleDropdownElement(tgl.children[i]);
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// }); // ~классическая проверка
		let arrShown = [];
		let arrHidden = [];
		// let arrLightbox = Array.prototype.slice.call(tgl.querySelectorAll('.lightbox')); // преобразуем NodeList в массив // (!) Array.prototype.slice.call - не сработает для IE8
		// *проверяем на условие скрыть или отобазить, т.к. в toggleDropdownElement() переключение происходит логически равно как и для span.toggle-content
		elems.forEach(tgl => { // div/span
			if (tgl.tagName === "SPAN") { // собираем span.tgl-content
				if (tgl.hasAttribute('class')) {
					if (tgl.classList.contains('toggle-collapse')) {
						arrHidden.push(tgl);
					} else {
						arrShown.push(tgl);
					}
				} else if (tgl.hasAttribute('style')) {
					if (tgl.style.display === "none") {
						arrHidden.push(tgl);
					} else {
						arrShown.push(tgl);
					}
				} else {
					if (getComputedStyle(tgl).display === "none") {
						arrHidden.push(tgl);
					} else {
						arrShown.push(tgl);
					}
				}
			} else { // собираем потомков tgl
				for (let i = 0; i < tgl.children.length; i++) {
				// let test = getComputedStyle(tgl.children[i]).display;
				// console.log("tgl: ", tgl, "\n", tgl.children[i], "\n getComputedStyle(tgl.children[i]).display: ", test, "\n tgl.children[i].hasAttribute('style'): ", tgl.children[i].hasAttribute('style'), "\n tgl.children[i].getAttribute('style'): ", tgl.children[i].getAttribute('style'));

					if (tgl.children[i].hasAttribute('class')) {
						if (tgl.children[i].classList.contains('toggle-collapse')) {
							arrHidden.push(tgl.children[i]);
						} else if (!tgl.children[i].classList.contains('un-hide')) { // ~js-класс исключает потомки:.toggle-content>span... с любым др.глассом
							arrShown.push(tgl.children[i]);
						}
					} else if (tgl.children[i].hasAttribute('style')) {
						if (tgl.children[i].style.display === "none") {
							arrHidden.push(tgl.children[i]);
						} else if (tgl.children[i].style.display !== "none") { // (?)~критично ли, если не учитывать так же, как с классом.un-hide
							arrShown.push(tgl.children[i]);
						}
					} else {
						if (tgl.classList.contains('toggle-collapse') && getComputedStyle(tgl.children[i]).display !== "none") {
							arrHidden.push(tgl.children[i]);
						} else {
							arrShown.push(tgl.children[i]);
						}
					}
				}
			}
		});
		console.log("arrShown: ", arrShown, "\n arrHidden: ", arrHidden);
		console.log("arrShown.length: ", arrShown.length, "\n arrHidden.length: ", arrHidden.length);

		if (arrShown.length === 0 && arrHidden.length === 0) {
			console.error("(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - не найден(-ы) элемент(-ы):\n function setToggleElement(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin, "\n arrShown: ", arrShown, "\n arrHidden: ", arrHidden);
			alert(`(!) Косяк: не удалось выполнить переключение элементов скрытого контента - не найден(-ы) элемент(-ы), см.консоль.`);
			// ~попробовать использ.вар.на удаление
			return;
		}
		if (arrHidden.length === 0) { // - скрываем
			for (let i = 0; i < arrShown.length; i++) {
				if (arrShown[i].tagName === "SPAN") { // span.toggle-content
					if (arrShown[i].hasAttribute('class')) {
						if (arrShown[i].classList.contains('toggle-content')) {
							arrShown[i].classList.add('toggle-collapse');
						}
					} else if (arrShown[i].hasAttribute('style')) {
						arrShown[i].classList.add('toggle-collapse');
					}
				} else { // div.toggle-content
					toggleDropdownElement(arrShown[i]);
				}

			}
		} else { // - отображаем
			for (let i = 0; i < arrHidden.length; i++) {
				if (arrHidden[i].tagName === "SPAN") { // span.toggle-content
					if (arrHidden[i].hasAttribute('class')) {
						if (arrHidden[i].classList.contains('toggle-content')) {
							arrHidden[i].classList.remove('toggle-collapse');
						}
					} else if (arrHidden[i].hasAttribute('style')) {
						arrHidden[i].classList.remove('toggle-collapse');
					}
				} else { // div.toggle-content
					toggleDropdownElement(arrHidden[i]);
				}
			}
		}
		// ~на удаление
		// let ndListShown = document.getElementById('idContentText').querySelectorAll('.toggle-content:not(.toggle-collapse)'); // список видимых узлов
		// let ndListHidden = document.getElementById('idContentText').querySelectorAll('.toggle-content.toggle-collapse'); // список скрытых узлов
		// if (ndListShown.length === 0 && ndListHidden.length === 0) {
		// 	console.info("(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - не найден(-ы) элемент(-ы):\n function setToggleElement(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin, "\n ndListShown: ", ndListShown, "\n ndListHidden: ", ndListHidden);
		// 	alert(`(i) Косяк: не удалось выполнить переключение элементов скрытого контента - не найден(-ы) элемент(-ы), см.консоль.`);
		// 	return;
		// }
		// elems.forEach(tgl => {
		// 	if (ndListShown.length < ndListHidden.length || ndListShown.length === ndListHidden.length) { // - отображаем
		// 		tgl.classList.remove('toggle-collapse'); // div/span // 'если.toggle-content содержит.lightbox's, значит это div, если нет это span
		// 		for (let i = 0; i < tgl.children.length; i++) {
		// 			if (tgl.children[i].hasAttribute('class')) {
		// 				if (tgl.children[i].classList.contains('lightbox')) {
		// 					if (tgl.children[i].classList.contains('toggle-collapse')) {
		// 						toggleDropdownElement(tgl.children[i]);
		// 					}
		// 				}
		// 			} else if (tgl.children[i].hasAttribute('style')) {
		// 				// (?)~переделать
		// 				if (tgl.children[i].style.display === "none") {
		// 					tgl.children[i].style.removeProperty('display'); // удаляем css св-во
		// 				}
		// 			}
		// 		}
		// 	} else if (ndListHidden.length === 0) { // - скрываем
		// 		tgl.classList.add('toggle-collapse'); // div/span // 'если.toggle-content содержит.lightbox's, значит это div, если нет это span
		// 		for (let i = 0; i < tgl.children.length; i++) {
		// 			if (tgl.children[i].hasAttribute('class')) {
		// 				if (tgl.children[i].classList.contains('lightbox')) {
		// 					if (!tgl.children[i].classList.contains('toggle-collapse')) {
		// 						toggleDropdownElement(tgl.children[i]);
		// 					}
		// 				}
		// 			} else if (tgl.children[i].hasAttribute('style')) {
		// 				// (?)~переделать
		// 				if (tgl.children[i].style.display !== "none") {
		// 					tgl.children[i].style.display = "none";
		// 				}
		// 			}
		// 		}
		// 	} else { // test
		// 		console.log("test:\n", "ndListShown.length === ndListHidden.length: ", ndListShown.length === ndListHidden.length);
		// 	}
		// });
		// *перелапачиваем все иконки/списоки, если есть
		setToggleIcon(null, getButtonExpand().value); // переключатель иконки/списка
		setFocusLoss();
	} else { // ~работаем с текущим элементом - на кот.кликнули
		if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
			console.error("(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setToggleElement(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin);
			alert(`(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
			return;
		}
		let arr = [];
		if (elem.tagName === "A") {
			if (elem.classList.contains('toggle-inline')) { // - встроенный переключатель
				toggleInlineElement(elem); // переключить встроенный элемент
			} else if (elem.classList.contains('toggle-dropdown')) { // - выпадающий переключатель
				let lbx = tglDropdownItem(elem);
				if (lbx !== null && lbx === Object(lbx)) {
					arr.push(lbx);
				}

				// x // проверка наличия якоря
				// // getAttribute если (# + ...) вернет string || null если (#) заглушка
				// if (elem.hash !== "" && elem.hash.length > 0 && elem.getAttribute('hash') !== "") {
				// 	const hash = elem.href.slice(elem.href.lastIndexOf("#") + 1);
				// 	if (hash !== "" && hash.length > 0) { // ~НЕ заглушка
				// 		const lbx = document.getElementById(hash);
				// 		if (lbx !== null && lbx === Object(lbx)) {
				// 			arr.push(lbx);
				// 			toggleDropdownElement(lbx); // переключить выпадающий эл.
				// 		} else {
				// 			console.error("(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - не найден элемент:\n function setToggleElement(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin, "\n hash: ", hash, "lbx: ", lbx, "arr: ", arr);
				// 			alert(`(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - не найден элемент, см.консоль.`);
				// 			return;
				// 		}
				// 	} else if (hash === "" && hash.length === 0) { // заглушка
				// 		// потомок.toggle-content:.footnote/...
				// 		let tgl = getToggleNode(elem);
				// 		if (tgl !== null && tgl === Object(tgl)) {
				// 			for (let i = 0; i < tgl.children.length; i++) {
				// 				toggleDropdownElement(tgl.children[i]); // переключить выпадающий эл.
				// 			}
				// 		}
				// 	}
				// } else { // (elem.getAttribute('hash') === null) // ~заглушка
				// 	// потомок.toggle-content:.footnote/...
				// 	let tgl = getToggleNode(elem);
				// 	if (tgl !== null && tgl === Object(tgl)) {
				// 		for (let i = 0; i < tgl.children.length; i++) {
				// 			toggleDropdownElement(tgl.children[i]); // переключить выпадающий эл.
				// 		}
				// 	}
				// }
			} else {
				console.error("(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - у элемента отсутствует класс, либо класс не определен:\n function setToggleElement(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin, "\n elem.classList: ", elem.classList);
				alert(`(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
				return;
			}
		} else if (elem.tagName === "IMG") {
			if (elem.classList.contains('toggle-icon')) {
				// *если иконка верхнего ур-ня, отображаем/скрываем все скрытые узлы текущего узла и узла.toggle-content
				// *если иконка вложенного узла, в текущем узле с общей иконкой отображаем/скрываем каждый скрытый узел и в.toggle-content узлы, относящиеся к текущему узлу
				let links = elem.parentElement.querySelectorAll('a.toggle-inline, a.toggle-dropdown');
				if (links.length > 0) {
					links.forEach(lnk => {
						if (lnk.classList.contains('toggle-inline')) {
							toggleInlineElement(lnk); // переключить встроенный элемент
						} else if (lnk.classList.contains('toggle-dropdown')) {
							let lbx = tglDropdownItem(lnk);
							if ( lbx !== null && lbx === Object(lbx)) {
								arr.push(lbx);
							}

							// x // проверка наличия якоря
							// // getAttribute если (# + ...) вернет string || null если (#) заглушка
							// if (lnk.hash !== "" && lnk.hash.length > 0 && lnk.getAttribute('hash') !== "") {
							// 	const hash = lnk.href.slice(lnk.href.lastIndexOf("#") + 1);
							// 	if (hash !== "" && hash.length > 0) { // ~НЕ заглушка
							// 		const lbx = document.getElementById(hash);
							// 		if (lbx !== null && lbx === Object(lbx)) {
							// 			arr.push(lbx);
							// 			toggleDropdownElement(lbx); // переключитй выпадающие эл.
							// 		} else {
							// 			console.error("(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - не найден элемент:\n function setToggleElement(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin, "\n hash: ", hash, "lbx: ", lbx, "arr: ", arr);
							// 			alert(`(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - не найден элемент, см.консоль.`);
							// 			return;
							// 		}
							// 	} else if (hash === "" && hash.length === 0) { // заглушка
							// 		// потомок.toggle-content:.footnote/...
							// 		let tgl = getToggleNode(lnk);
							// 		if (tgl !== null && tgl === Object(tgl)) {
							// 			for (let i = 0; i < tgl.children.length; i++) {
							// 				toggleDropdownElement(tgl.children[i]); // переключить выпадающий эл.
							// 			}
							// 		}
							// 	}
							// } else { // (lnk.getAttribute('hash') === null) // ~заглушка
							// 	// потомок.toggle-content:.footnote/...
							// 	let tgl = getToggleNode(lnk);
							// 	if (tgl !== null && tgl === Object(tgl)) {
							// 		for (let i = 0; i < tgl.children.length; i++) {
							// 			toggleDropdownElement(tgl.children[i]); // переключить выпадающий эл.
							// 		}
							// 	}
							// }
						}
					});
				}
			} else {
				console.error("(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - у элемента отсутствует класс, либо класс не определен:\n function setToggleElement(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin, "\n elem.classList: ", elem.classList);
				alert(`(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
				return;
			}
		}
		setToggleIcon(elem) // переключатель иконки/списка // ~перелапачиваем все иконки/списки, если есть
		// *фокусируемся на узле в.toggle-content
		if (arr.length > 0) {
			function setFocusItem(el, goTo = "next") {
				let retVal = false;
				const tgl = getToggleNode(el);
				if (tgl !== null && tgl !== Object(tgl)) {
					console.error("(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - не найден элемент:\n function setFocusItem(el: ", el, "\n goTo: ", goTo, "): window.«", window.name, "», location.origin: ", location.origin, "\n tgl: ", tgl);
					alert(`(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - не найден элемент, см.консоль.`);
					return;
				}
				// получить номер индекса текущего дочернего эл.
				// 1) Array.from(tgl.children).indexOf(el);
				// 2) Array.prototype.indexOf.call(el.parentElement.children, el);
				const index = Array.from(tgl.children).indexOf(el); // номер индекса текущ.эл.(умерация с 0-ля)
				// console.log("index: ", index, " | tgl.children.length: ", tgl.children.length);
				if (goTo === "next") {
					for(let i = index + 1; i < tgl.children.length; i++) {
						if (tgl.children[i].classList.contains('toggle-collapse')) {
							if (tgl.children[i].hasAttribute('tabIndex')) { // наличие аттрибута в теге html
								tgl.children[i].removeAttribute('tabIndex');
							}
						} else {
							if (tgl.children[i].hasAttribute('class')) {
								if (tgl.children[i].classList.contains('lightbox')) {
									// tgl.children[i].focus({ focusVisible: false }); // true - по умолчанию
									setFocus(tgl.children[i], 'focusIn'); // фокусировка на.узел эл.
									retVal = true;
									break;
								}
							}
						}
					}
				} else if (goTo === "prev") {
					for(let i = index - 1; i >= 0; i--) {
						if (tgl.children[i].classList.contains('toggle-collapse')) {
							if (tgl.children[i].hasAttribute('tabIndex')) { // наличие аттрибута в теге html
								tgl.children[i].removeAttribute('tabIndex');
							}
						} else {
							if (tgl.children[i].hasAttribute('class')) {
								if (tgl.children[i].classList.contains('lightbox')) {
									// tgl.children[i].focus({ focusVisible: false }); // true - по умолчанию
									setFocus(tgl.children[i], 'focusIn'); // фокусировка на.узел эл.
									retVal = true;
									break;
								}
							}
						}
					}
				}
				if (retVal) return retVal;
				if (goTo === "next") {
					return setFocusItem(el, "prev");
				} else if (goTo === "prev") {
					return retVal;
				}
				return retVal;
			}
			if (arr.length === 1) {
				if (arr[0].hasAttribute('class')) {
					if (arr[0].classList.contains('toggle-collapse')) {
						// setFocus(arr[0], 'focusOut'); // фокусировка на.узел эл.
						// *проверяем видимость др.эл.-узлов, вложенных в.toggle-content, если есть хотя бы 1 раскрытый узел,.toggle-content остается видимым, и если есть узел эл.для фокусирования переключаемся на узел, лежащий до/после текущего
						setFocusItem(arr[0]);
					} else {
						setFocus(arr[0], 'focusIn'); // фокусировка на.узел эл.
						// arr[0].scrollIntoView({ behavior: "smooth" }); // переход к элементу - не путать с фокусированием {behavior: "smooth", block: "center", inline: "start"} // ~без этого тоже скролится
					}
				}
				setFocusLoss(arr[0].parentElement);
			} else {
				if (arr[arr.length - 1].hasAttribute('class')) {
					if (arr[arr.length - 1].classList.contains('toggle-collapse')) {
						// setFocus(arr[arr.length - 1], 'focusOut'); // фокусировка на.узел эл.
						// *проверяем видимость др.эл.-узлов, вложенных в.toggle-content, если есть хотя бы 1 раскрытый узел,.toggle-content остается видимым, и если есть узел эл.для фокусирования переключаемся на узел, лежащий до/после текущего
						setFocusItem(arr[arr.length - 1]);
					} else {
						setFocus(arr[arr.length - 1], 'focusIn'); // фокусировка на.узел эл.
						// (i) для tagName a, чтобы сработал scrollIntoView() надо использовать отмену действия браузером по умолчанию - preventDefault(), см.событие keydown в lightbox, с использованием св-ва tabIndex = "0" элементов, не имеющих автофокусировку
						// arr[arr.length - 1].scrollIntoView({ behavior: "smooth" }); // переход к элементу - не путать с фокусированием {behavior: "smooth", block: "center", inline: "start"} // ~без этого тоже скролится
					}
				}
				setFocusLoss(arr[arr.length - 1].parentElement);
			}
		}
	}
}
// (!) установить изо.текущим
function setImageCurrent(elem) {
	// 'elem - tagName img:.slider-item <=>.slider-item.slider-current
	let lbx;
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		lbx = getLightbox(elem); // - получить DOM-элемент - узел.lightbox
		if (lbx === null) { return };
	} else {
		if (elem.classList.contains('lightbox')) {
			lbx = elem;
		} else {
			lbx = getLightbox(elem); // - получить DOM-элемент - узел.lightbox
			if (lbx === null) { return };
		}
	}
	// (?)~не понятно работает или нет
	// lbx.scrollIntoView({behavior: "smooth"}); // переход к элементу - не путать с фокусированием {behavior: "smooth", block: "center", inline: "start"}
	// setFocus(lbx, 'focusIn'); // фокусировка на.узел эл.


	let img = lbx.querySelector('.img-item'); // img-viewer>img - это slider-current в слайдере lightbox
	let txt = lbx.querySelector('.img-title');
	let sldr = lbx.querySelector('.slider-current');

	if (txt === null || img === null || sldr === null) {
		// x if (typeof(sldr) === "undefined" || sldr === null && (sldr === Object(sldr) || typeof(sldr) === "object")) {
		console.error(`(!) Косяк: не удалось установить изо.текущим - не найден элемент:\n function setImageCurrent(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n img: typeof(${typeof(img)}) / Object(${Object(img)}) / ${img}\n txt: typeof(${typeof(txt)}) / Object(${Object(txt)}) / ${txt}\n sldr: typeof(${typeof(sldr)}) / Object(${Object(sldr)}) / ${sldr}`);
		alert(`(!) Косяк: не удалось установить изображение текущим - не найден элемент, см.консоль.`);
		return;
	}
	// '
	if (img.src !== elem.src) {
		img.src = elem.src;
		img.alt = elem.alt;
		// *проверяем наличие аттрибута « cap »
		txt.innerHTML = "";
		if (elem.hasAttribute('cap')) {
			txt.innerHTML = elem.getAttribute('cap');
		} else {
			txt.innerHTML = elem.alt;
		}
		sldr.classList.remove('slider-current');
		elem.parentElement.classList.add('slider-current');
	}
	setReSizeViewerImg(lbx); // - переустановить размер элемента просмотра изо
	// *анимируем появление/переключение по изо
	img.style.setProperty('animation-name', 'img-item-center'); // или так
	// img.style.animationName = "img-item-center"; // или так
	// img.setAttribute('style', 'animation-name: img-item-center');
	setCursorIcon(img); // - установить значок курсора
	// 'проверяем натуральный размер изо, чтобы отобразить/скрыть элемент зумер
	let zoomer = lbx.querySelector('.zoomer');
	if (typeof(zoomer) !== "undefined" || zoomer !== null && (zoomer === Object(zoomer) || typeof(zoomer) === "object")) {
		if (elem.naturalWidth > 300) {
			if (zoomer.style.display === "none") {zoomer.removeAttribute('style');}
		} else {zoomer.style.display = "none"}
	}
}
// (!) переключение по изо.в.lightbox
function goToImage(elem, keyEvent = "") {
	// *elem - tagName div:
	// '.lightbox
	// ''.lightbox-img:.img-btn-prev/.img-btn-next
	// '''.img-slider:.slider-btn-prev/.slider-btn-next
	// **elem - tagName a:
	// '.toggle-dropdown
	// ''.img-btn-prev/.img-btn-next // (?) если придет ссылкой, то косяк
	// '''.slider-btn-prev/.slider-btn-next // (?) если придет ссылкой, то косяк
	// ***keyEvent - keyboardEvent:
	// 'event.code
	let lbx;
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		lbx = getLightbox(elem); // - получить DOM-элемент - узел lightbox
		if (lbx === null) { return; }
	} else {
		if (elem.classList.contains('lightbox')) {
			lbx = elem;
		} else {
			lbx = getLightbox(elem); // - получить DOM-элемент - узел lightbox
			if (lbx === null) { return; }
		}
	}
	if (typeof(keyEvent) === "undefined" || keyEvent !== String(keyEvent) || typeof(keyEvent) !== "string") { // (i) может оставаться пустой строкой
		console.error(`(!) Косяк: не удалось осуществить переключение на другое изо - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function goToImage(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, keyEvent: "${keyEvent}"): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось осуществить переключение на другое изображение - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}

	// (?)~не понятно работает или нет
	// (i) для tagName a, чтобы сработал scrollIntoView() надо использовать отмену действия браузером по умолчанию - preventDefault(), см.событие keydown в lightbox, с использованием св-ва tabIndex = "0" элементов, не имеющих автофокусировку
	// lbx.scrollIntoView({behavior: "smooth"}); // переход к элементу - не путать с фокусированием {behavior: "smooth", block: "center", inline: "start"}
	// setFocus(lbx, 'focusIn'); // фокусировка на lightbox


	let img = lbx.querySelector('.img-item'); // - img-viewer>img - это slider-current в слайдере lightbox
	let txt = lbx.querySelector('.img-title');
	let sldr = lbx.querySelector('.slider-track');
	if (sldr === null) return; // - одиночное изо
	if (txt === null || img === null) {
		console.error(`(!) Косяк: не удалось совершить переключение на др.изо - не найден элемент:\n function goToImage(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, keyEvent: "${keyEvent}"): window."${window.name}", location.origin: ${location.origin}:\n img: typeof(${typeof(img)}) / Object(${Object(img)}) / ${img}\n txt: typeof(${typeof(txt)}) / Object(${Object(txt)}) / ${txt}`);
		alert(`(!) Косяк: не удалось совершить переключение на другое изображение - не найден элемент, см.консоль.`);
		return;
	}
	// *в slider-track перебираем slider-item ищем slider-current и переназначаем его в зависимости от условия перехода
	for (let i = 0; i < sldr.children.length; i++) {
		if (sldr.children[i].classList.contains('slider-current')) {
			if (keyEvent === "Home") {
				if (i === 0) { // - изо.первое
					animationOffset(sldr); // - анимационное смещение
					return;
				} else { // - изо.последнее или промежуточное
					// 'меняем изо.в окне просмотра
					if (img.src !== sldr.children[0].firstElementChild.src) {
						img.src = sldr.children[0].firstElementChild.src;
						img.alt = sldr.children[0].firstElementChild.alt;
						// *проверяем наличие пользовательского аттрибута « cap »
						txt.innerHTML = "";
						if (sldr.children[0].firstElementChild.hasAttribute('cap')) {
							txt.innerHTML = sldr.children[0].firstElementChild.getAttribute('cap');
						} else {
							txt.innerHTML = sldr.children[0].firstElementChild.alt;
						}
						// 'переназначаем класс
						sldr.children[i].classList.remove('slider-current');
						sldr.children[0].classList.add('slider-current');
					}
				}
				sldr.scrollLeft -= sldr.scrollWidth; // - прокручиваем скроллбар
			} else if (keyEvent === "End") {
				if (i === sldr.children.length - 1) { // - изо.последнее
					animationOffset(sldr); // - анимационное смещение
					return;
				} else { // - изо.первое или промежуточное
					// 'меняем изо.в окне просмотра
					if (img.src !== sldr.children[sldr.children.length - 1].firstElementChild.src) {
						img.src = sldr.children[sldr.children.length - 1].firstElementChild.src;
						img.alt = sldr.children[sldr.children.length - 1].firstElementChild.alt;
						// *проверяем наличие пользовательского аттрибута « cap »
						txt.innerHTML = "";
						if (sldr.children[sldr.children.length - 1].firstElementChild.hasAttribute('cap')) {
							txt.innerHTML = sldr.children[sldr.children.length - 1].firstElementChild.getAttribute('cap');
						} else {
							txt.innerHTML = sldr.children[sldr.children.length - 1].firstElementChild.alt;
						}
						// 'переназначаем класс
						sldr.children[i].classList.remove('slider-current');
						sldr.children[sldr.children.length - 1].classList.add('slider-current');
					}
				}
				sldr.scrollLeft += sldr.scrollWidth; // - прокручиваем скроллбар
			} else if (elem.classList.contains('img-btn-prev') || keyEvent === "ArrowUp") {
				if (i === 0) { // - изо.первое
					// 'меняем изо.в окне просмотра
					if (img.src !== sldr.children[sldr.children.length - 1].firstElementChild.src) {
						img.src = sldr.children[sldr.children.length - 1].firstElementChild.src;
						img.alt = sldr.children[sldr.children.length - 1].firstElementChild.alt;
						// *проверяем наличие пользовательского аттрибута « cap »
						txt.innerHTML = "";
						if (sldr.children[sldr.children.length - 1].firstElementChild.hasAttribute('cap')) {
							txt.innerHTML = sldr.children[sldr.children.length - 1].firstElementChild.getAttribute('cap');
						} else {
							txt.innerHTML = sldr.children[sldr.children.length - 1].firstElementChild.alt;
						}
						// 'переназначаем класс
						sldr.children[i].classList.remove('slider-current');
						sldr.children[sldr.children.length - 1].classList.add('slider-current');
					}
					sldr.scrollLeft += sldr.scrollWidth; // - прокручиваем скроллбар (перех.к последнему)
				} else { // - изо.последнее или промежуточное
					// 'меняем изо.в окне просмотра
					if (img.src !== sldr.children[i - 1].firstElementChild.src) {
						img.src = sldr.children[i - 1].firstElementChild.src;
						img.alt = sldr.children[i - 1].firstElementChild.alt;
						// *проверяем наличие пользовательского аттрибута « cap »
						txt.innerHTML = "";
						if (sldr.children[i - 1].firstElementChild.hasAttribute('cap')) {
							txt.innerHTML = sldr.children[i - 1].firstElementChild.getAttribute('cap');
						} else {
							txt.innerHTML = sldr.children[i - 1].firstElementChild.alt;
						}
						// 'переназначаем класс
						sldr.children[i].classList.remove('slider-current');
						sldr.children[i - 1].classList.add('slider-current');
					}
					sldr.scrollLeft -= sldr.children[i - 1].clientWidth; // - прокручиваем скроллбар
				}
			} else if (elem.classList.contains('slider-btn-prev') || keyEvent === "ArrowLeft") {
				if (i === 0) { // - изо.первое
					animationOffset(sldr); // - анимационное смещение
					return;
				} else { // - изо.последнее или промежуточное
					// 'меняем изо.в окне просмотра
					if (img.src !== sldr.children[i - 1].firstElementChild.src) {
						img.src = sldr.children[i - 1].firstElementChild.src;
						img.alt = sldr.children[i - 1].firstElementChild.alt;
						// *проверяем наличие пользовательского аттрибута « cap »
						txt.innerHTML = "";
						if (sldr.children[i - 1].firstElementChild.hasAttribute('cap')) {
							txt.innerHTML = sldr.children[i - 1].firstElementChild.getAttribute('cap');
						} else {
							txt.innerHTML = sldr.children[i - 1].firstElementChild.alt;
						}
						// 'переназначаем класс
						sldr.children[i].classList.remove('slider-current');
						sldr.children[i - 1].classList.add('slider-current');
					}
					sldr.scrollLeft -= sldr.children[i - 1].clientWidth; // - прокручиваем скроллбар
				}
			} else if (elem.classList.contains('img-btn-next') || keyEvent === "ArrowDown") {
				if (i === sldr.children.length - 1) { // - изо.последнее
					// 'меняем изо.в окне просмотра
					if (img.src !== sldr.children[0].firstElementChild.src) {
						img.src = sldr.children[0].firstElementChild.src;
						img.alt = sldr.children[0].firstElementChild.alt;
						// *проверяем наличие пользовательского аттрибута « cap »
						txt.innerHTML = "";
						if (sldr.children[0].firstElementChild.hasAttribute('cap')) {
							txt.innerHTML = sldr.children[0].firstElementChild.getAttribute('cap');
						} else {
							txt.innerHTML = sldr.children[0].firstElementChild.alt;
						}
					}
					// 'переназначаем класс
					sldr.children[i].classList.remove('slider-current');
					sldr.children[0].classList.add('slider-current');
					sldr.scrollLeft -= sldr.scrollWidth; // - прокручиваем скроллбар (перех.к первому)
				} else { // - изо.первое или промежуточное
					// 'меняем изо.в окне просмотра
					if (img.src !== sldr.children[i + 1].firstElementChild.src) {
						img.src = sldr.children[i + 1].firstElementChild.src;
						img.alt = sldr.children[i + 1].firstElementChild.alt;
						// *проверяем наличие пользовательского аттрибута « cap »
						txt.innerHTML = "";
						if (sldr.children[i + 1].firstElementChild.hasAttribute('cap')) {
							txt.innerHTML = sldr.children[i + 1].firstElementChild.getAttribute('cap')
						} else {
							txt.innerHTML = sldr.children[i + 1].firstElementChild.alt;
						}
					}
					// 'переназначаем класс
					sldr.children[i].classList.remove('slider-current');
					sldr.children[i + 1].classList.add('slider-current');
					sldr.scrollLeft += sldr.children[i + 1].clientWidth; // - прокручиваем скроллбар
				}
			} else if (elem.classList.contains('slider-btn-next') || keyEvent === "ArrowRight") {
				if (i === sldr.children.length - 1) { // - изо.последнее
					animationOffset(sldr); // - анимационное смещение
					return;
				} else { // - изо.первое или промежуточное
					// 'меняем изо.в окне просмотра
					if (img.src !== sldr.children[i + 1].firstElementChild.src) {
						img.src = sldr.children[i + 1].firstElementChild.src;
						img.alt = sldr.children[i + 1].firstElementChild.alt;
						// *проверяем наличие пользовательского аттрибута « cap »
						txt.innerHTML = "";
						if (sldr.children[i + 1].firstElementChild.hasAttribute('cap')) {
							txt.innerHTML = sldr.children[i + 1].firstElementChild.getAttribute('cap');
						} else {
							txt.innerHTML = sldr.children[i + 1].firstElementChild.alt;
						}
					}
					// 'переназначаем класс
					sldr.children[i].classList.remove('slider-current');
					sldr.children[i + 1].classList.add('slider-current');
				}
				sldr.scrollLeft += sldr.children[i + 1].clientWidth; // - прокручиваем скроллбар
			}
			setReSizeViewerImg(lbx); // - переустановить размер элемента просмотра изо
			break;
		}
	}
	// *анимируем появление/переключение по изо
	if (elem.classList.contains('img-btn-prev') || elem.classList.contains('slider-btn-prev') || keyEvent === "ArrowLeft" || keyEvent === "Home") {
		img.style.setProperty('animation-name', 'img-item-right'); // или так
		// img.style.animationName = "img-item-right"; // или так
		// img.setAttribute('style', 'animation: img-item-right');
	} else if (elem.classList.contains('img-btn-next') || elem.classList.contains('slider-btn-next') || keyEvent === "ArrowRight" || keyEvent === "End") {
		img.style.setProperty('animation-name', 'img-item-left'); // или так
		// img.style.animationName = "img-item-left"; // или так
		// img.setAttribute('style', 'animation: img-item-left');
	} else {
		if (keyEvent === "ArrowUp") {
		img.style.setProperty('animation-name', 'img-item-up'); // или так
		// img.style.animationName = "img-item-up"; // или так
		// img.setAttribute('style', 'animation: img-item-up');
		} else if (keyEvent === "ArrowDown") {
			img.style.setProperty('animation-name', 'img-item-down'); // или так
			// img.style.animationName = "img-item-down"; // или так
			// img.setAttribute('style', 'animation: img-item-down');
		}
	}
	setCursorIcon(img); // - установить значок курсора
	// 'проверяем натуральный размер изо, чтобы отобразить/скрыть элемент зумер
	let zoomer = lbx.querySelector('.zoomer');
	if (typeof(zoomer) !== "undefined" || zoomer !== null && (zoomer === Object(zoomer) || typeof(zoomer) === "object")) {
		if (img.naturalWidth > 300) {
			if (zoomer.style.display === "none") {zoomer.removeAttribute('style');}
		} else {zoomer.style.display = "none"}
	}
}
// (!) создать изо.во весь экран - вывод текущего lightbox в гл.окне
function setImageFullScreen(elem) {
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось создать изо.во весь экран - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setImageFullScreen(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось создать изображение во весь экран - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	// else if (!elem.classList.contains('lightbox')) { // x -
	// 	console.error(`(!) Косяк: не удалось создать изо.во весь экран - у элемента отсутствует класс, либо класс не определен:\n function setImageFullScreen(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n elem.classList.contains('zoom-in'): ${elem.classList.contains('zoom-in')} / elem.classList.contains('lightbox'): ${elem.classList.contains('lightbox')}\n elem.classList: ${elem.classList}`);
	// 	alert(`(!) Косяк: не удалось создать изображение во весь экран - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
	// 	return;
	// }
	// *проверяем существование (existence) DOM-элемента - узел lightbox в гл.окне
	let lbx = window.top.document.body.querySelector('.lightbox');
	if (lbx !== null && lbx === Object(lbx)) {
		lbx.remove();
		lbx = null;
	}
	// *создаем клона lightbox в гл.окне и фокусируемся на нем
	// 'elem:
	// 'lightbox - tagName div
	// ''zoomer>zoom-in - tagName img
	// '''lightbox children's
	if (elem.classList.contains('lightbox')) {
		window.top.document.body.prepend(elem); // создаем DOM-элемент - узел lightbox
	} else if (elem.classList.contains('zoom-in')) {
		let clone = getLightboxCopy(elem); // создать и получить копию/клона DOM-элемента - узел lightbox
		if (clone !== null && clone === Object(clone)) {
			window.top.document.body.prepend(clone); // создаем DOM-элемент - узел lightbox
		} else {
			console.error(`(!) Косяк: не удалось создать изо.во весь экран - не найден элемент:\n function setImageFullScreen(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n clone: ${clone}`);
			alert(`(!) Косяк: не удалось создать изображение во весь экран - не найден элемент, см.консоль.`);
			return;
		}
	} else { // lightbox children's
		let clone = getLightboxCopy(elem); // создать и получить копию/клона DOM-элемента - узел lightbox
		if (clone !== null && clone === Object(clone)) {
			window.top.document.body.prepend(clone); // создаем DOM-элемент - узел lightbox
		} else {
			console.error(`(!) Косяк: не удалось создать изо.во весь экран - не найден элемент:\n function setImageFullScreen(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}\n clone: ${clone}\n document.activeElement: ${document.activeElement}`);
			alert(`(!) Косяк: не удалось создать изображение во весь экран - не найден элемент, см.консоль.`);
			return;
		}
	}
	// перепроверяемся
	lbx = window.top.document.querySelector('.lightbox');
	if (lbx !== null && lbx === Object(lbx)) {
		setEventHandlersLightbox(lbx, 'add'); // создание/удаление обработчиков событий для узла.lightbox
		setReSizeViewerImg(lbx); // переустановить размер элемента просмотра изо
		setFocus(lbx, 'focusIn');
	}

	// x -
	// // 'elem - zoomer>zoom-in - tagName img
	// // // ''elem - lightbox - tagName div
	// let clone = getLightboxCopy(elem); // создать и получить копию/клона DOM-элемента - узел lightbox
	// if (typeof(clone) === "undefined" || clone === null && (clone === Object(clone) || typeof(clone) === "object")) {
	// 	console.error(`(!) Косяк: не удалось создать изо.во весь экран - не найден элемент:\n function setImageFullScreen(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n clone: typeof(${typeof(clone)}) / Object(${Object(clone)} / ${clone}`);
	// 	alert(`(!) Косяк: не удалось создать изображение во весь экран - не найден элемент, см.консоль.`);
	// 	return;
	// }
	// // *проверяем существование (existence) DOM-элемента - узел lightbox в гл.окне
	// let lbx = window.top.document.body.querySelector('.lightbox');
	// 	if (lbx !== null && (lbx === Object(lbx) || typeof(lbx) === "object")) { // x typeof(lbx) === "undefined"
	// 	lbx.remove();
	// 	lbx = null;
	// }
	// // *создаем клона lightbox в гл.окне и фокусируемся на нем
	// window.top.document.body.prepend(clone); // создаем DOM-элемент - узел lightbox
	// setEventHandlersLightbox(clone, 'add'); // создание/удаление обработчиков событий для узла.lightbox
	// setReSizeViewerImg(clone); // переустановить размер элемента просмотра изо
	// setFocus(clone, 'focusIn'); // фокусировка на lightbox // (?)'странно, что срабатывает возможность фокусировки для клона, а не для созданного DOM-элемента
	// // x // lbx = window.top.document.body.querySelector('.lightbox');
	// // if (typeof(lbx) === "undefined" || lbx === null && (lbx === Object(lbx) || typeof(lbx) === "object")) {
	// // 	console.error(`(!) Косяк: не удалось создать изо.во весь экран - не найден элемент:\n function setImageFullScreen(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n lbx.classList: ${lbx.classList}\n lbx: typeof(${typeof(lbx)}) / Object(${Object(lbx)})\n ${lbx}`);
	// // 	alert(`(!) Косяк: не удалось создать изображение во весь экран - не найден элемент, см.консоль.`);
	// // 	return;
	// // }
	// // setEventHandlersLightbox(clone, 'add'); // создание/удаление обработчиков событий для узла.lightbox
	// // setFocus(clone, 'focusIn'); // фокусировка на lightbox
}
// (!) скрыть окно просмотра изо/видео - текущий.lightbox
function setLightboxHide(elem) {
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error("(!) Косяк: не удалось переключить выпадающий элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setLightboxHide(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin);
		alert(`(!) Косяк: не удалось закрыть окно просмотра изображений - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	// 'elem:
	// 'div.lightbox
	// ''children elements:
	// ''div.lightbox-btn-close &...
	let lbx = null;
	let tgl = null;
	function setToggleNode() {
		tgl = elem;
		while (!tgl.classList.contains('toggle-content')) {
			tgl = tgl.parentElement;
			if (tgl.tagName === "BODY" || tgl.id === "idContentText") {
				console.error("(!) Косяк: не удалось закрыть окно просмотра изображений - не найден элемент:\n function setLightboxHide(elem: ", elem, "): window.«", window.name, "», location.origin: ", location.origin, "\n tgl: ", tgl);
				alert(`(!) Косяк: не удалось закрыть окно просмотра изображений - не найден элемент, см.консоль.`);
				return;
			} else if (tgl.classList.contains('lightbox')) {
				lbx = tgl; // запоминаем текущий.lightbox
				// выйдет раньше
				if (tgl.parentElement.classList.contains('toggle-content')) {
					tgl = tgl.parentElement;
					break;
				}
			}
		}
	}
	if (elem.hasAttribute('class')) {
		if (elem.classList.contains('lightbox')) {
			lbx = elem;
			tgl = elem.parentElement;
		} else {
			setToggleNode();
		}
	} else {
		setToggleNode();
	}
	setFocus(lbx, 'focusOut'); // фокусировка на.узел эл.
	lbx.classList.add('toggle-collapse');
	setEventHandlersLightbox(lbx, 'remove'); // создание/удаление обработчиков событий для узла.lightbox
	function setFocusItem(goTo = "next") {
		let retVal = false;
		// получить номер индекса текущего дочернего эл.
		// 1) Array.from(tgl.children).indexOf(lbx);
		// 2) Array.prototype.indexOf.call(lbx.parentElement.children, lbx);
		const index = Array.from(tgl.children).indexOf(lbx); // номер индекса текущ.эл.(умерация с 0-ля)
		// console.log("index: ", index, " | tgl.children.length: ", tgl.children.length);
		if (goTo === "next") {
			for(let i = index + 1; i < tgl.children.length; i++) {
				// console.log("goTo: ", goTo, "\n tgl.children[i]: ", tgl.children[i]);
				if (tgl.children[i].classList.contains('toggle-collapse')) {
					if (tgl.children[i].hasAttribute('tabIndex')) { // наличие аттрибута в теге html
						tgl.children[i].removeAttribute('tabIndex');
					}
				} else {
					if (tgl.children[i].hasAttribute('class')) {
						if (tgl.children[i].classList.contains('lightbox')) {
							// tgl.children[i].focus({ focusVisible: false }); // true - по умолчанию
							setFocus(tgl.children[i], 'focusIn'); // фокусировка на.узел эл.
							retVal = true;
							break;
						}
					}
				}
			}
		} else if (goTo === "prev") {
			for(let i = index - 1; i >= 0; i--) {
				// console.log("goTo: ", goTo, "\n tgl.children[i]: ", tgl.children[i]);
				if (tgl.children[i].classList.contains('toggle-collapse')) {
					if (tgl.children[i].hasAttribute('tabIndex')) { // наличие аттрибута в теге html
						tgl.children[i].removeAttribute('tabIndex');
					}
				} else {
					if (tgl.children[i].hasAttribute('class')) {
						if (tgl.children[i].classList.contains('lightbox')) {
							// tgl.children[i].focus({ focusVisible: false }); // true - по умолчанию
							setFocus(tgl.children[i], 'focusIn'); // фокусировка на.узел эл.
							retVal = true;
							break;
						}
					}
				}
			}
		}
		if (retVal) return retVal;
		if (goTo === "next") {
			return setFocusItem("prev");
		} else if (goTo === "prev") {
			return retVal;
		}
		return retVal;
	}
	// *проверяем видимость др.эл.-узлов, вложенных в.toggle-content, если есть хотя бы 1 раскрытый узел,.toggle-content остается видимым, и если есть узел эл.для фокусирования переключаемся на узел, лежащий до/после текущего
	if (hasLightboxVisible(tgl)) { // проверка по каждому узлу в.toggle-content
		// x // tgl.classList.remove('toggle-collapse'); // - отображаем div.toggle-content
		// // x // setFocus(tgl, 'focusIn'); // - фокусировка на.toggle-content
		setFocusItem();
		if (tgl.children.length === tgl.querySelectorAll('.toggle-collapse').length) {
			tgl.classList.add('toggle-collapse'); // скрываем div.toggle-content
		}
	} else {
		// x // setFocus(tgl, 'focusOut'); // - фокусировка на.toggle-content
		tgl.classList.add('toggle-collapse'); // скрываем div.toggle-content
	}
	// *перелапачиваем иконки/списки-переключатели
	tgl = tgl.previousElementSibling;
	if (typeof(tgl) !== "undefined" || tgl !== null && (tgl === Object(tgl) || typeof(tgl) === "object")) {
		if (tgl.children.length > 0) {
			if (lbx.hasAttribute('id')) { // - ищем ссылку по id
				let lnk = document.querySelector('a[href="#' + lbx.id + '"]');
				if (lnk !== null && lnk === Object(lnk)) {
					setToggleIcon(lnk); // переключатель иконки/списка
				}
			} else if (lbx.hasAttribute('num')) { // - ищем ссылку по номеру
				let links = tgl.querySelectorAll('.toggle-dropdown'); // tagName a
				if (links.length > 0) {
					for (let i = 0; i < links.length; i++) {
						if (links[i].hasAttribute('num')) {
							if (+links[i].getAttribute('num') === +lbx.getAttribute('num')) {
								setToggleIcon(links[i]); // переключатель иконки/списка
								break;
							}
						}
					}
				}
			} else { // - проверяем наличие переключателя у всего элемента
				setToggleIcon(tgl); // - переключатель иконки/списка
			}
		}
	}
}