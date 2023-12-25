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
	}
}
// (!) lightbox_onMouseout
function lightbox_onMouseout(eVent) {
	if (eVent.target.tagName === "IMG") {
		if (eVent.target.classList.contains('zoom-in') || eVent.target.classList.contains('zoom-out')) {
			toggleZoomerIcon(eVent.target, eVent.type); // - переключить (+/-) иконку масштабирования
		}
	}
}
// (!) lightbox_onKeydown
function lightbox_onKeydown(eVent) {
	if (eVent.key === "Escape" || eVent.code === "Escape" || eVent.keyCode === 27 || eVent.which === 27) {
		if (window === top || window.name === "") {
			setLightboxRemove(eVent.target); // - удаление DOM-элемента - узел lightbox в гл.окне
		}
		// else if (window === self || self !== top && window.name === "hmcontent") { // 'вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
		// 	setLightboxHide(eVent.target); // скрыть окно просмотра изо - текущий lightbox
		// }
	} else if (eVent.key === "Home" || eVent.code === "Home" || eVent.keyCode === 36 || eVent.which === 36) {
		goToImage(eVent.target, eVent.code); // - переключение по изо.в lightbox
		eVent.preventDefault(); // отменяем действия браузера по умолчанию
	} else if (eVent.key === "End" || eVent.code === "End" || eVent.keyCode === 35 || eVent.which === 35) {
		goToImage(eVent.target, eVent.code); // - переключение по изо.в lightbox
		eVent.preventDefault(); // отменяем действия браузера по умолчанию
	} else if (eVent.key === "ArrowLeft" || eVent.code === "ArrowLeft" || eVent.keyCode === 37 || eVent.which === 37) {
		goToImage(eVent.target, eVent.code); // - переключение по изо.в lightbox
	} else if (eVent.key === "ArrowUp" || eVent.code === "ArrowUp" || eVent.keyCode === 38 || eVent.which === 38) {
		goToImage(eVent.target, eVent.code); // - переключение по изо.в lightbox
		eVent.preventDefault(); // отменяем действия браузера по умолчанию
	} else if (eVent.key === "ArrowRight" || eVent.code === "ArrowRight" || eVent.keyCode === 39 || eVent.which === 39) {
		goToImage(eVent.target, eVent.code); // - переключение по изо.в lightbox
	} else if (eVent.key === "ArrowDown" || eVent.code === "ArrowDown" || eVent.keyCode === 40 || eVent.which === 40) {
		goToImage(eVent.target, eVent.code); // - переключение по изо.в lightbox
		eVent.preventDefault(); // отменяем действия браузера по умолчанию
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
				setLightboxRemove(eVent.target); // - удаление DOM-элемента - узел lightbox в гл.окне
			} else if (window === self || self !== top && window.name === "hmcontent") { // 'вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
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
			} else if (window === self || self !== top && window.name === "hmcontent") { // 'вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
				// *image full screen - вывод текущего lightbox в гл.окне
				if (location.origin === "file://") { // - получаем элемент lightbox clone и передаем его в гл.окно
					alert(`(!) Не удалось осуществить image full screen - вывод текущего lightbox в гл.окне.\n (i) Нельзя передать узел/копию DOM-элемента в другое окно/фрейм, см.спецификацию.\n function lightbox_onClick(eVent.target: ${eVent.target}\n ${eVent})\n window.«${window.name}»\n location.origin: ${location.origin}`);

					let clone = getLightboxCopy(eVent.target); // - создать и получить копию/клона DOM-элемента - узел lightbox
					if (clone) { // TODO: (!)
						console.log(`I) function lightbox_onClick(eVent: ${eVent.target.tagName} / ${eVent.target.classList}):\n clone.classList: ${clone.classList}\n 1) ${clone}\n 2) typeof(clone): ${typeof(clone)}\n 3) clone === Object(clone): ${clone === Object(clone)}`); // x -
					} else {
						let lbx = getLightbox(eVent.target);
						clone = getLightboxCopy(lbx); // - создать и получить копию/клона DOM-элемента - узел lightbox

						console.log(`II) function lightbox_onClick(eVent: ${eVent.target.tagName} / ${eVent.target.classList}):\n clone = getLightboxCopy(eVent.target)\n clone.classList: ${clone.classList}\n 1) ${lbx}\n 2) typeof(lbx): typeof(lbx)\n 3) ${lbx === Object(lbx)}\n lbx.classList: ${lbx.classList}\n---\n clone: 1) ${clone}\n 2) typeof(clone): ${typeof(clone)}\n 3) clone === Object(clone): ${clone === Object(clone)}`); // x -
					}
					// (i) нельзя передать узел/копию DOM-элемента в другое окно/фрейм, см.спецификацию
					// x // let clone = getLightboxCopy(e.target);
					// clone = clone.innerHTML;
					// x // let clone = JSON.parse(JSON.stringify(getLightboxCopy(e.target))) // (i) JSON-форматированный и/или сериализованный объект
					// x let deepCopy = structuredClone(getLightboxCopy(e.target));
					// let clone = deepCopy.innerHTML;

					let msg = {
						value: "setImageFullScreen",
						clone: clone
					};
					window.top.postMessage(msg, '*'); // (?) когда звездочка - это плохое использование в целях безопасности от взлома страниц
				} else { // - вывод текущего lightbox в гл.окне
					// *проверяем наличие ссылки на файл lightbox.js
					// **получить скрипт - ссылка на lightbox.js
					if (getLightboxLink(window.top)) { // (i) если еще ни разу не было ни одного раскрытия скрытого контента на стр.
						window.top.setImageFullScreen(eVent.target); // - вывод текущего lightbox в гл.окне
					} else {
						let js = setLightboxLink(window.top); // - создать скрипт - ссылка на lightbox.js
						let id = setInterval(() => {
							if (js) {
								clearInterval(id);
								window.top.setImageFullScreen(eVent.target); // - вывод текущего lightbox в гл.окне
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
// (!) lightbox_onAnimationend - удаляем css св-во "animation" по окончанию воспроизведения анимации, иначе она больше не будет воспроизводиться:
// 'slider-track - для 1-ого/последнего слайда
// ''img-viewer>.img-item: img-item-center/img-item-left/img-item-right/img-item-up/img-item-down
function lightbox_onAnimationend(eVent) {
	eVent.target.style.removeProperty('animation');
}
// (!) setEventHandlersLightbox - создание/удаление обработчиков событий для узла lightbox
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
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - у элемента отсутствует класс, либо класс не установлен:\n function setEventHandlersLightbox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")\n elem.classList: ${elem.classList}`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - у элемента отсутствует класс, либо класс не установлен, см.консоль.`);
		return false;
	}
	// *добавляем/удаляем обработчики событий
	if (addOrRemove === "add") {
		window.addEventListener("resize", lightbox_window_onReSize);
		elem.addEventListener("animationend", lightbox_onAnimationend);
		elem.addEventListener("mouseover", lightbox_onMouseover);
		elem.addEventListener("mouseout", lightbox_onMouseout);
		elem.addEventListener("keydown", lightbox_onKeydown);
		elem.addEventListener("click", lightbox_onClick);
	} else if (addOrRemove === "remove") {
		window.removeEventListener("resize", lightbox_window_onReSize);
		elem.removeEventListener("animationend", lightbox_onAnimationend);
		elem.removeEventListener("mouseover", lightbox_onMouseover);
		elem.removeEventListener("mouseout", lightbox_onMouseout);
		elem.removeEventListener("keydown", lightbox_onKeydown);
		elem.removeEventListener("click", lightbox_onClick);
	}
	return true;
}
// (!) getLightbox - получить DOM-элемент - узел lightbox
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
// (!) hasLightboxVisible - получить значение существования DOM-элемента - узел lightbox
function hasLightboxVisible(elem) {
	// 'elem - toggle-content
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось получить значение существования DOM-элемента - узел lightbox - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function hasLightboxVisible(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк: не удалось получить значение существования DOM-элемента - узел lightbox - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	for (let i = 0; i < elem.children.length; i++) {
		if (!elem.children[i].classList.contains('toggle-collapse')) {
			return true;
		}
	}
	return false;
}
// (!) getLightboxCopy - создать и получить копию/клона DOM-элемента - узел lightbox
function getLightboxCopy(elem) { // (i) нельзя передать узел/копию DOM-элемента в другое окно/фрейм, см.спецификацию
	if (typeof (elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
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
	// *варианты клонирования - копия узла lightbox:
	// '.cloneNode() - для копирования внутри того же документа (для клонирования узла из текущего document)
	// ''.importNode() - для копирования узлов из других документов (для клонирования узла из другого документа) importNode() копирует исходный элемент, не удаляя его
	// '''.adoptNode() - это еще один метод, который очень похож на importNode() с той разницей, что он удаляет исходный элемент из его родительского DOM. adoptNode() полностью удаляет исходный элемент из его DOM
	// ''''Object.assign({}, e.target) - вариант клонирования объекта
	// '''''structuredClone() - глубокое копирование - структурированное клонирование
	// clone = document.importNode(lbx, true); // - создаем копию lightbox
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
			if (lbx === null || typeof(lbx) === "undefined") {
				lbx = document.querySelector('.lightbox');
				if (typeof(lbx) === "undefined" || lbx === null && (lbx === Object(lbx) || typeof(lbx) === "object")) {
					let btn = document.querySelector('.lightbox-btn-close');
					if (typeof(btn) === "undefined" || btn === null && (btn === Object(btn) || typeof(btn) === "object")) {
						console.error(`(!) Косяк: не удалось закрыть окно просмотра изо.во весь экран - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setLightboxRemove(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n document.activeElement: ${document.activeElement}\n lbx: typeof(${typeof(lbx)}) / Object(${Object(lbx)}) / ${lbx}\n btn: typeof(${typeof(btn)}) / Object(${Object(btn)}) / ${btn}`);
						alert(`(!) Косяк: не удалось закрыть окно просмотра изображений во весь экран - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
						return;
					} else {
						lbx = getLightbox(btn); // - получить DOM-элемент - узел lightbox
						if (lbx === null || typeof(lbx) === "undefined") {return;}
					}
				}
			}
		}
	} else {
		if (elem.classList.contains('lightbox')) {
			lbx = elem;
		} else if (elem.classList.contains('lightbox-btn-close')) {
			lbx = getLightbox(elem); // - получить DOM-элемент - узел lightbox
			if (lbx === null || typeof(lbx) === "undefined") {return;}
		} else {
			if (!elem.classList.contains('lightbox-btn-close') || !elem.classList.contains('lightbox')) {
				console.error(`(!) Косяк: не удалось закрыть окно просмотра изо.во весь экран - у элемента отсутствует класс, либо класс не установлен:\n function setLightboxRemove(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n elem.classList.contains('lightbox-btn-close'): ${elem.classList.contains('lightbox-btn-close')}\n elem.classList.contains('lightbox'): ${elem.classList.contains('lightbox')}\n elem.classList: ${elem.classList}`);
				alert(`(!) Косяк: не удалось закрыть окно просмотра изображений во весь экран - у элемента отсутствует класс, либо класс не установлен, см.консоль.`);
				return;
			}
		}
	}
	// '
	lbx.remove(); // - удаляем узел lightbox
	setEventHandlersLightbox(lbx, 'remove'); // - создание/удаление обработчиков событий для узла lightbox
}
// (!) writeImageElement - создать дочерний элемент изо
function writeImageElement(elem) {
	// 'elem - div lightbox
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось создать дочерний элемент изо - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function writeImageElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк: не удалось создать дочерний элемент изображения - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return null;
	} else if (elem.tagName === "DIV" && !elem.classList.contains('lightbox')) {
		console.error(`(!) Косяк: не удалось создать дочерний элемент изо - у элемента отсутствует класс, либо класс не установлен:\n function writeImageElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк: не удалось создать дочерний элемент изображения - у элемента отсутствует класс, либо класс не установлен, см.консоль.`);
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
		imgViewer.insertAdjacentHTML('afterbegin', '<img class="img-item" src="' + img.src + '" alt="' + img.alt + '"style="animation-name:img-item-center";>');
		// *проверяем наличие пользовательского аттрибута « cap »
		if (img.hasAttribute('cap')) {
			txt.innerHTML = img.getAttribute('cap');
		} else {
			txt.innerHTML = img.alt;
		}
		imgItem = elem.querySelector('.img-item');
	} return imgItem;
}
// (!) toggleZoomer - скрыть/отобразить кнопку масштабирование
function toggleZoomer(elem) {
	// 'elem - img-item - tagName img
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось скрыть/отобразить кнопку масштабирование элемента в окне просмотра изо - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function toggleZoomer(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк: не удалось показать/скрыть кнопку мастабирование элемента в окне просмотра изображения - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	} else if (!elem.classList.contains('img-item')) {
		console.error(`(!) Косяк: не удалось скрыть/отобразить кнопку масштабирование элемента в окне просмотра изо - у элемента отсутствует класс, либо класс не установлен:\n function toggleZoomer(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n elem.classList.contains('img-item'): ${elem.classList.contains('img-item')}\n elem.classList: ${elem.classList}`);
		alert(`(!) Косяк: не удалось показать/скрыть кнопку мастабирование элемента в окне просмотра изображения - у элемента отсутствует класс, либо класс не установлен, см.консоль.`);
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
// (!) toggleZoomerIcon - переключить (+/-) иконку масштабирования
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
	// '.img-item <=>.img-item.img-zoom100 фрейма hmcontent
	// ''.zoomer>.zoom-in <=>.zoom-out гл.окна
	let lbx = getLightbox(elem); // - lightbox гл.окна
	if (lbx === null || typeof(lbx) === "undefined") {return;}
	if (typeEvent !== "mouseover" && typeEvent !== "mouseout") {
		lbx.scrollIntoView(); // - переход к элементу - не путать с фокусированием
		if (!(elem.classList.contains('zoom-in') || elem.classList.contains('zoom-out'))) {
			setFocus(lbx, 'focusIn'); // - фокусировка на lightbox
		}
	}
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
		} else if (window === self || self !== top && window.name === "hmcontent") { // 'вариант проверки яв-ся ли окно фреймом: (window.frameElement && window.frameElement.nodeName === "IFRAME")
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
// (!) setCursorIcon - установить значок курсора
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
// (!) setToggleIcon - переключатель иконки/списка для скрытого контента в теме топика
function setToggleIcon(elem = null, btnValue = null) {
	// 'btnValue - value: true/false input (checkbox)
	// ''elem - tagName: img/a/any elem (UL/LI/p)..?
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
			// 1) Array.from(chdn.parentElement.children).indexOf(chdn) // получить номер индекса текущего дочернего эл.
			// 2) Array.prototype.indexOf.call(chdn.parentElement.children, chdn)
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
	} else { // - кнопка idTextExpandCollapse - для каждого элемента на всей странице
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
// (!) toggleInlineElement - переключить встроенный элемент
function toggleInlineElement(elem) {
	// 'elem - tagName a.toggle-inline
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось переключить встроенный элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function toggleInlineElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк: не удалось переключить встроенный элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	} else if (!elem.classList.contains('toggle-inline')) {
		console.error(`(!) Косяк: не удалось переключить встроенный элемент - у элемента отсутствует класс, либо класс не установлен:\n function toggleInlineElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n elem.classList.contains('toggle-inline'): ${elem.classList.contains('toggle-inline')}\n elem.classList: ${elem.classList}`);
		alert(`(!) Косяк: не удалось переключить встроенный элемент - у элемента отсутствует класс, либо класс не установлен, см.консоль.`);
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
		console.error(`(!) Косяк: не удалось переключить встроенный элемент - у элемента отсутствует класс, либо класс не установлен:\n function toggleDropdownElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n elem.classList.contains('toggle-content'): ${elem.classList.contains('toggle-content')}\n elem.classList: ${elem.classList}`);
		alert(`(!) Косяк: не удалось переключить встроенный элемент - у элемента отсутствует класс, либо класс не установлен, см.консоль.`);
		return;
	}
}
// (!) setReSizeViewerImg - переустановить размер элемента просмотра изо
function setReSizeViewerImg(elem) {
	// 'elem - tagName div.lightbox
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось переустановить размер элемента просмотра изо - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setReSizeViewerImg(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n window.«${window.name}», location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось переустановить размер элемента просмотра изображения - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	} else if (elem.tagName === "DIV" && !elem.classList.contains('lightbox')) {
		console.error(`(!) Косяк: не удалось переустановить размер элемента просмотра изо - у элемента отсутствует класс, либо класс не установлен:\n function setReSizeViewerImg(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n window.«${window.name}», location.origin: ${location.origin}:\n elem.tagName: ${elem.tagName}\n elem.classList.contains('lightbox'): ${elem.classList} = ${elem.classList.contains('lightbox')}`);
		alert(`(!) Косяк: не удалось переустановить размер элемента просмотра изображения - у элемента отсутствует класс, либо класс не установлен, см.консоль.`);
		return;
	}
	let lbxImg = elem.querySelector('.lightbox-img');
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
	if (idTpCnt === null) { // - копия lightbox создана в глобальном окне, а не открыта отд.окном
		lbxHeight = getValueFullSizeProperty(elem).height; // - получить полноразмерное значение св-ва
	} else { // - lightbox во фрейме или стр.открыта отд.окном
		lbxHeight = getValueFullSizeProperty(idTpCnt).height; // - получить полноразмерное значение св-ва
	}
	// *минусуем padding.lightbox
	lbxHeight = lbxHeight - (parseInt(getComputedStyle(elem, null).paddingTop, 10) + parseInt (getComputedStyle(elem, null).paddingBottom, 10));
	if (window !== top || window.name !== "" && window.name === "hmcontent") {
		elem.style.height = lbxHeight + "px";
	}
	// *определяем высоту у остальных элементов с учетом margin, padding, border, кот.не будут учитываться, т.к.box-sizing для.lightbox-img изменяет алгоритм расчета ширины и высоты элемента
	let txtHeight = getValueFullSizeProperty(txt).height; // - получить полноразмерное значение св-ва
	// *если изо.одиночное, чтобы вместо узла DOM элемента не получить « NAN »
	if (sldr === null) {
		lbxImg.style.height = lbxHeight - txtHeight + "px";
	} else {
		let sldrHeight = getValueFullSizeProperty(sldr).height; // - получить полноразмерное значение св-ва
		lbxImg.style.height = lbxHeight - (txtHeight + sldrHeight) + "px";
	}
}
// (!) toggleDropdownElement - переключить выпадающий элемент
function toggleDropdownElement(elem) {
	// 'elem - tagName a.toggle-dropdown
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось переключить выпадающий элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function toggleDropdownElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк: не удалось переключить выпадающий элемент - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	} else if (!elem.classList.contains('toggle-dropdown')) {
		console.error(`(!) Косяк: не удалось переключить выпадающий элемент - у элемента отсутствует класс, либо класс не установлен:\n function toggleDropdownElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n elem.classList.contains('toggle-dropdown'): ${elem.classList.contains('toggle-dropdown')}\n elem.classList: ${elem.classList}`);
		alert(`(!) Косяк: не удалось переключить выпадающий элемент - у элемента отсутствует класс, либо класс не установлен, см.консоль.`);
		return;
	}
	let el = elem;
	while (!el.parentElement.classList.contains('content-text')) { // поднимаемся выше до <DIV> id="idContentText"
		el = el.parentElement;
		if (el.tagName === "BODY") {
			console.error(`(!) Косяк: не удалось переключить выпадающий элемент - не найден элемент:\n function toggleDropdownElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n el: typeof(${typeof(el)}) / Object(${Object(el)} / ${el}`);
			alert(`(!) Косяк: не удалось переключить выпадающий элемент - не найден элемент, см.консоль.`);
			return;
		}
	}
	let tgl = el.nextElementSibling; // - div.toggle-content
	if (typeof(tgl) === "undefined" || tgl === null && (tgl === Object(tgl) || typeof(tgl) === "object")) {
		console.error(`(!) Косяк: не удалось переключить выпадающий элемент - не найден элемент:\n function toggleDropdownElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n tgl: typeof(${typeof(tgl)}) / Object(${Object(tgl)} / ${tgl}`);
		alert(`(!) Косяк: не удалось переключить выпадающий элемент - не найден элемент, см.консоль.`);
		return;
	} else if (!tgl.classList.contains('toggle-content')) {
		console.error(`(!) Косяк: не удалось переключить выпадающий элемент - у элемента отсутствует класс, либо класс не установлен:\n function toggleDropdownElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n tgl.classList.contains('toggle-content'): ${tgl.classList.contains('toggle-content')}\n tgl.classList: ${tgl.classList}`);
		alert(`(!) Косяк: не удалось переключить выпадающий элемент - у элемента отсутствует класс, либо класс не установлен, см.консоль.`);
		return;
	}
	// 'проверяем существование (existence) элемента lightbox
	if (tgl.querySelector('.lightbox') === null) { // - если скрытый контент - это НЕ изо, а например какой-то текст...
		tgl.classList.toggle('toggle-collapse');
	} else { // *в lightbox's ищем аттрибут "num", сверяя его с аттрибутом текущ.эл.tagName a
		for (let i = 0; i < tgl.children.length; i++) {
			if (tgl.children[i].classList.contains('lightbox')) {
				let lbx = tgl.children[i];
				let imgItem = lbx.querySelector('.img-item');
				if (lbx.hasAttribute('num')) { // *в lightbox's ищем аттрибут "num", сверяя его с аттрибутом текущ.эл.tagName a
					if (+lbx.getAttribute('num') === +elem.getAttribute('num')) {
						if (lbx.querySelectorAll('.lightbox-img').length > 0) { // - изо
							if (lbx.classList.contains('toggle-collapse')) { // - отображаем
								// 'проверяем существование (existence) элемента.img-item в.img-viewer
								if (typeof(imgItem) === "undefined" || imgItem === null && (imgItem === Object(imgItem) || typeof(imgItem) === "object")) {
									if (lbx.querySelector('.img-slider')) { // - если есть слайдер
										imgItem = writeImageElement(lbx); // создать дочерний элемент изо.в текущем.lightbox
									} else {
										console.error(`(!) Косяк: не удалось получить элемент с классом.img-item/.img-slider для одиночного.lightbox:\n function toggleDropdownElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n imgItem: typeof(${typeof(imgItem)}) / Object(${Object(imgItem)} / ${imgItem}`);
										alert(`(!) Косяк: не удалось получить элемент с классом.img-item для одиночного.lightbox, см.консоль.`);
									}
								}
								toggleZoomer(imgItem); // скрыть/отобразить кнопку масштабирование
								setCursorIcon(imgItem); // установить значок курсора
								lbx.classList.remove('toggle-collapse'); // отображаем.lightbox
								tgl.classList.remove('toggle-collapse'); // отображаем div.toggle-content
								// (i) переустанавливаем размер только после того, как будет отображен сам div.toggle-content
								setReSizeViewerImg(lbx); // переустановить размер элемента просмотра изо
								setEventHandlersLightbox(lbx, 'add'); // создание/удаление обработчиков событий для узла.lightbox
								// *анимируем появление/переключение по изо
								imgItem.style.setProperty('animation-name', 'img-item-center'); // или так
								// imgItem.style.animationName = "img-item-center"; // или так
								// imgItem.setAttribute('style', 'animation-name: img-item-center');
								setFocus(lbx, 'focusIn'); // фокусировка на.lightbox
							} else { // - скрываем
								setFocus(lbx, 'focusOut'); // фокусировка на.lightbox
								lbx.classList.add('toggle-collapse'); // скрываем.lightbox
								setEventHandlersLightbox(lbx, 'remove'); // создание/удаление обработчиков событий для узла.lightbox
								// *проверяем видимость др.lightbox's, кот.вложенны в.toggle-content для текущего абзаца, если есть хотя бы 1 раскрытый.lightbox,.toggle-content остается видимым
								if (hasLightboxVisible(tgl)) {
									tgl.classList.remove('toggle-collapse'); // отображаем div.toggle-content
								} else {
									tgl.classList.add('toggle-collapse'); // скрываем div.toggle-content
								}
							}
						} else if (lbx.querySelectorAll('.lightbox-video').length > 0) { // - видео
							if (lbx.classList.contains('toggle-collapse')) { // - отображаем
								lbx.classList.remove('toggle-collapse');
								tgl.classList.remove('toggle-collapse');
								setEventHandlersLightbox(lbx, 'add'); // создание/удаление обработчиков событий для узла.lightbox
								setFocus(lbx, 'focusIn'); // фокусировка на.lightbox
								// (i) для tagName a, чтобы сработал scrollIntoView() надо использовать отмену действия браузером по умолчанию - preventDefault(), см.событие keydown в lightbox, с использованием св-ва tabIndex = "0" элементов, не имеющих автофокусировку
								lbx.scrollIntoView(); // переход к элементу - не путать с фокусированием
							} else { // - скрываем
								setFocus(lbx, 'focusOut'); // фокусировка на.lightbox
								lbx.classList.add('toggle-collapse');
								setEventHandlersLightbox(lbx, 'remove'); // создание/удаление обработчиков событий для узла.lightbox
								// *проверяем видимость др.lightbox's, кот.вложенны в.toggle-content для текущего абзаца, если есть хотя бы 1 раскрытый.lightbox,.toggle-content остается видимым
								if (hasLightboxVisible(tgl)) {
									tgl.classList.remove('toggle-collapse'); // отображаем div.toggle-content
								} else {
									tgl.classList.add('toggle-collapse'); // скрываем div.toggle-content
								}
							}
						} break;
					}
				} else { // - одиночный.lightbox или забыли добавить аттрибут num
					if (lbx.querySelectorAll('.lightbox-img').length > 0) { // - изо
						if (lbx.classList.contains('toggle-collapse')) { // - отображаем
							// 'проверяем существование (existence) элемента.img-item в.img-viewer
							if (typeof(imgItem) === "undefined" || imgItem === null && (imgItem === Object(imgItem) || typeof(imgItem) === "object")) {
								if (lbx.querySelector('.img-slider')) { // - если есть слайдер
									imgItem = writeImageElement(lbx); // создать дочерний элемент изо.в текущем.lightbox
								} else {
									console.error(`(!) Косяк: не удалось получить элемент с классом.img-item/.img-slider для одиночного.lightbox:\n function toggleDropdownElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n imgItem: typeof(${typeof(imgItem)}) / Object(${Object(imgItem)} / ${imgItem}`);
									alert(`(!) Косяк: не удалось получить элемент с классом.img-item для одиночного.lightbox, см.консоль.`);
								}
							}
							toggleZoomer(imgItem); // скрыть/отобразить кнопку масштабирование
							setCursorIcon(imgItem); // установить значок курсора
							lbx.classList.remove('toggle-collapse');
							tgl.classList.remove('toggle-collapse');
							// (i) переустанавливаем размер только после того, как будет отображен сам div.toggle-content
							setReSizeViewerImg(lbx); // переустановить размер элемента просмотра изо
							setEventHandlersLightbox(lbx, 'add'); // создание/удаление обработчиков событий для узла.lightbox
							// *анимируем появление/переключение по изо
							imgItem.style.setProperty('animation-name', 'img-item-center'); // или так
							// imgItem.style.animationName = "img-item-center"; // или так
							// imgItem.setAttribute('style', 'animation-name: img-item-center');
							setFocus(lbx, 'focusIn'); // - фокусировка на.lightbox
							// (i) для tagName a, чтобы сработал scrollIntoView() надо использовать отмену действия браузером по умолчанию - preventDefault(), см.событие keydown в lightbox, с использованием св-ва tabIndex = "0" элементов, не имеющих автофокусировку
							lbx.scrollIntoView(); // переход к элементу - не путать с фокусированием
						} else { // - скрываем
							setFocus(lbx, 'focusOut'); // фокусировка на.lightbox
							lbx.classList.add('toggle-collapse');
							setEventHandlersLightbox(lbx, 'remove'); // создание/удаление обработчиков событий для узла.lightbox
							// *проверяем видимость др.lightbox's, кот.вложенны в.toggle-content для текущего абзаца, если есть хотя бы 1 раскрытый.lightbox,.toggle-content остается видимым
							if (hasLightboxVisible(tgl)) {
								tgl.classList.remove('toggle-collapse'); // отображаем div.toggle-content
							} else {
								tgl.classList.add('toggle-collapse'); // скрываем div.toggle-content
							}
						}
					} else if (lbx.querySelectorAll('.lightbox-video').length > 0) { // - видео
						if (lbx.classList.contains('toggle-collapse')) { // - отображаем
							lbx.classList.remove('toggle-collapse');
							tgl.classList.remove('toggle-collapse');
							setEventHandlersLightbox(lbx, 'add'); // создание/удаление обработчиков событий для узла.lightbox
							setFocus(lbx, 'focusIn'); // фокусировка на.lightbox
							// (i) для tagName a, чтобы сработал scrollIntoView() надо использовать отмену действия браузером по умолчанию - preventDefault(), см.событие keydown в lightbox, с использованием св-ва tabIndex = "0" элементов, не имеющих автофокусировку
							lbx.scrollIntoView(); // переход к элементу - не путать с фокусированием
						} else { // - скрываем
							setFocus(lbx, 'focusOut'); // фокусировка на.lightbox
							lbx.classList.add('toggle-collapse');
							setEventHandlersLightbox(lbx, 'remove'); // создание/удаление обработчиков событий для узла.lightbox
							// *проверяем видимость др.lightbox's, кот.вложенны в.toggle-content для текущего абзаца, если есть хотя бы 1 раскрытый.lightbox,.toggle-content остается видимым
							if (hasLightboxVisible(tgl)) {
								tgl.classList.remove('toggle-collapse'); // отображаем div.toggle-content
							} else {
								tgl.classList.add('toggle-collapse'); // скрываем div.toggle-content
							}
						}
					}
				}
			}
		}
	}
}
// (!) setToggleElement - установить элемент переключения скрытого контента - развернуть/свернуть скрытый контент
function setToggleElement(elem = null, btnChecked = null) {
	// 'elem - tagName a
	// ''elem - tagName img
	// '''btnChecked - boolean input (checkbox)
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) { // *работаем по всем элементам на стр.
		if (btnChecked === null || typeof(btnChecked) !== "boolean" || btnChecked !== Boolean(btnChecked)) {
			console.error(`(!) Косяк: не удалось выполнить переключение элементов скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setToggleElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, btnChecked: ${btnChecked})`);
			alert(`(!) Косяк: не удалось выполнить переключение элементов скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
			return;
		}
		// 'toggle-content - tagName: div/span; lightbox's - tagName div; toggle-dropdown/toggle-inline - tagName a; toggle-icon - tagName img
		let elems = document.getElementById('idTopicBody').querySelectorAll('.toggle-content');
		if (elems.length === 0) {
			console.error(`(!) Косяк: не удалось выполнить переключение элементов скрытого контента - не найден элемент:\n function setToggleElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, btnChecked: ${btnChecked}):\n elems: typeof(${typeof(elems)}) / Object(${Object(elems)}) / ${elems}`);
			alert(`(!) Косяк: не удалось выполнить переключение элементов скрытого контента - не найден элемент, см.консоль.`);
			return;
		}
		if (elems.length > 0) {
			elems.forEach(tgl => {
				// 'если.toggle-content содержит.lightbox's, значит это div, если нет это span
				let lbx = Array.prototype.slice.call(tgl.querySelectorAll('.lightbox')); // 'преобразуем NodeList в массив
				if (btnChecked) { // - отображаем
					tgl.classList.remove('toggle-collapse'); // - div/span
					if (lbx.length > 0) { // if (lbx instanceof(NodeList)
						for (let i = 0; i < lbx.length; i++) {
							if (lbx[i].querySelectorAll('.lightbox-img').length > 0) {
								let imgItem = lbx[i].querySelector('.img-item');
								// 'проверяем существование (existence) элемента.img-item в.img-viewer
								if (typeof(imgItem) === "undefined" || imgItem === null && (imgItem === Object(imgItem) || typeof(imgItem) === "object")) {
									imgItem = writeImageElement(lbx[i]); // - создать дочерний элемент изо
								} else {
									// *анимируем появление/переключение по изо
									imgItem.style.setProperty('animation-name', 'img-item-center'); // или так
									// imgItem.style.animationName = "img-item-center"; // или так
									// imgItem.setAttribute('style', 'animation-name: img-item-center');
								}
								setEventHandlersLightbox(lbx[i], 'add'); // - создание/удаление обработчиков событий для узла.lightbox
								toggleZoomer(imgItem); // - скрыть/отобразить кнопку масштабирование
								setCursorIcon(imgItem); // - установить значок курсора
								lbx[i].classList.remove('toggle-collapse');
								setReSizeViewerImg(lbx[i]); // - переустановить размер элемента просмотра изо
							} else if (lbx[i].querySelectorAll('.lightbox-video').length > 0) {
								setEventHandlersLightbox(lbx[i], 'add'); // - создание/удаление обработчиков событий для узла.lightbox
								lbx[i].classList.remove('toggle-collapse');
							}
						}
					}
				} else { // - скрываем
					if (lbx.length > 0) {
						for (let i = 0; i < lbx.length; i++) {
							lbx[i].classList.add('toggle-collapse');
							setEventHandlersLightbox(lbx[i], 'remove'); // - создание/удаление обработчиков событий для узла.lightbox
						}
					}
					tgl.classList.add('toggle-collapse'); // - div/span
				}
			});
		}
		// *перелапачиваем все иконки/списоки, если есть
		setToggleIcon(null, btnChecked); // - переключатель иконки/списка
	} else { // *работаем с текущим элементом - на кот.кликнули
		if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
			console.error(`(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setToggleElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, btnChecked: ${btnChecked})`);
			alert(`(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
			return;
		}
		if (elem.tagName === "A") {
			if (elem.classList.contains('toggle-inline')) { // - встроенный переключатель
				toggleInlineElement(elem); // - переключить встроенный элемент
			} else if (elem.classList.contains('toggle-dropdown')) { // - выпадающий переключатель
				toggleDropdownElement(elem); // - переключить выпадающий элемент
			} else {
				console.error(`(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - у элемента отсутствует класс, либо класс не установлен:\n function setToggleElement(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, btnChecked: ${btnChecked}):\n elem.classList: ${elem.classList}`);
				alert(`(!) Косяк: не удалось выполнить переключение элемента(-ов) скрытого контента - у элемента отсутствует класс, либо класс не установлен, см.консоль.`);
				return;
			}
		} else if (elem.tagName === "IMG") { // *в текущем абзаце отображаем/скрываем каждый скрытый контент
			let links = elem.parentElement.querySelectorAll('a.toggle-inline, a.toggle-dropdown');
			links.forEach(link => {
				if (link.classList.contains('toggle-inline')) {
					toggleInlineElement(link); // - переключить встроенный элемент
				} else if (link.classList.contains('toggle-dropdown')) {
					toggleDropdownElement(link); // - переключить выпадающий элемент
				}
			});
		}
		// *перелапачиваем все иконки/списки, если есть
		setToggleIcon(elem) // - переключатель иконки/списка
	}
}
// (!) setImageCurrent - установить изо.текущим
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
	lbx.scrollIntoView(); // - переход к элементу - не путать с фокусированием
	setFocus(lbx, 'focusIn'); // - фокусировка на.lightbox
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
// (!) goToImage - переключение по изо.в.lightbox
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
	if (typeof(keyEvent) === "undefined" || keyEvent !== String(keyEvent) || typeof(keyEvent) !== "string") { // - может оставаться пустой строкой
		console.error(`(!) Косяк: не удалось осуществить переключение на другое изо - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function goToImage(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, keyEvent: "${keyEvent}"): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось осуществить переключение на другое изображение - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	// (i) для tagName a, чтобы сработал scrollIntoView() надо использовать отмену действия браузером по умолчанию - preventDefault(), см.событие keydown в lightbox, с использованием св-ва tabIndex = "0" элементов, не имеющих автофокусировку
	lbx.scrollIntoView(); // - переход к элементу - не путать с фокусированием
	setFocus(lbx, 'focusIn'); // - фокусировка на lightbox
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
					sldr.scrollLeft -= sldr.children[i - 1].clientWidth / 2; // - прокручиваем скроллбар
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
					sldr.scrollLeft -= sldr.children[i - 1].clientWidth / 2; // - прокручиваем скроллбар
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
					sldr.scrollLeft += sldr.children[i + 1].clientWidth / 2; // - прокручиваем скроллбар
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
				sldr.scrollLeft += sldr.children[i + 1].clientWidth / 2; // - прокручиваем скроллбар
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
// (!) setImageFullScreen - создать изо.во весь экран - вывод текущего lightbox в гл.окне
function setImageFullScreen(elem) {
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось создать изо.во весь экран - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setImageFullScreen(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}`);
		alert(`(!) Косяк: не удалось создать изображение во весь экран - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	} else if (!(elem.classList.contains('zoom-in') || elem.classList.contains('lightbox'))) {
		console.error(`(!) Косяк: не удалось создать изо.во весь экран - у элемента отсутствует класс, либо класс не установлен:\n function setImageFullScreen(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n elem.classList.contains('zoom-in'): ${elem.classList.contains('zoom-in')} / elem.classList.contains('lightbox'): ${elem.classList.contains('lightbox')}\n elem.classList: ${elem.classList}`);
		alert(`(!) Косяк: не удалось создать изображение во весь экран - у элемента отсутствует класс, либо класс не установлен, см.консоль.`);
		return;
	}
	// 'elem - zoomer>zoom-in - tagName img
	// ''elem - lightbox - tagName div
	let clone = getLightboxCopy(elem); // - создать и получить копию/клона DOM-элемента - узел lightbox
	if (typeof(clone) === "undefined" || clone === null && (clone === Object(clone) || typeof(clone) === "object")) {
		console.error(`(!) Косяк: не удалось создать изо.во весь экран - не найден элемент:\n function setImageFullScreen(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n clone: typeof(${typeof(clone)}) / Object(${Object(clone)} / ${clone}`);
		alert(`(!) Косяк: не удалось создать изображение во весь экран - не найден элемент, см.консоль.`);
		return;
	}
	// *проверяем существование (existence) DOM-элемента - узел lightbox в гл.окне
	let lbx = window.top.document.body.querySelector('.lightbox');
		if (lbx !== null && (lbx === Object(lbx) || typeof(lbx) === "object")) { // x typeof(lbx) === "undefined"
		lbx.remove();
		lbx = null;
	}
	// *создаем клона lightbox в гл.окне и фокусируемся на нем
	window.top.document.body.prepend(clone); // - создаем DOM-элемент - узел lightbox
	setEventHandlersLightbox(clone, 'add'); // - создание/удаление обработчиков событий для узла lightbox
	setReSizeViewerImg(clone); // - переустановить размер элемента просмотра изо
	setFocus(clone, 'focusIn'); // - фокусировка на lightbox
	// (?)'странно, что срабатывает возможность фокусировки для клона, а не для созданного DOM-элемента
	// x // lbx = window.top.document.body.querySelector('.lightbox');
	// if (typeof(lbx) === "undefined" || lbx === null && (lbx === Object(lbx) || typeof(lbx) === "object")) {
	// 	console.error(`(!) Косяк: не удалось создать изо.во весь экран - не найден элемент:\n function setImageFullScreen(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}:\n lbx.classList: ${lbx.classList}\n lbx: typeof(${typeof(lbx)}) / Object(${Object(lbx)})\n ${lbx}`);
	// 	alert(`(!) Косяк: не удалось создать изображение во весь экран - не найден элемент, см.консоль.`);
	// 	return;
	// }
	// setEventHandlersLightbox(clone, 'add'); // - создание/удаление обработчиков событий для узла lightbox
	// setFocus(clone, 'focusIn'); // - фокусировка на lightbox
}
// (!) setLightboxHide - скрыть окно просмотра изо - текущий.lightbox
function setLightboxHide(elem) {
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось закрыть окно просмотра изо - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n setLightboxHide(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin})`);
		alert(`(!) Косяк: не удалось закрыть окно просмотра изображений - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	// 'elem - div.lightbox-btn-close
	let lbx = null;
	let tgl = elem;
	while (!tgl.classList.contains('toggle-content')) {
		tgl = tgl.parentElement;
		if (tgl.tagName === "BODY" || tgl.id === "idContentText") {
			console.error(`(!) Косяк: не удалось закрыть окно просмотра изо - не найден элемент:\n setLightboxHide(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}): window."${window.name}", location.origin: ${location.origin}):\n tgl: 1) ${tgl}\n 2) typeof(tgl): ${typeof(tgl)}\n 3) Object(tgl): ${Object(tgl)}`);
			alert(`(!) Косяк: не удалось закрыть окно просмотра изображений - не найден элемент, см.консоль.`);
			return;
		} else if (tgl.classList.contains('lightbox')) {
			lbx = tgl; // запоминаем текущий.lightbox
			setFocus(lbx, 'focusOut'); // - фокусировка на.lightbox
			lbx.classList.add('toggle-collapse');
			setEventHandlersLightbox(lbx, 'remove'); // - создание/удаление обработчиков событий для узла.lightbox
		}
	}
	// *проверяем видимость др.lightbox's, кот.вложенны в.toggle-content для текущего абзаца, если есть хотя бы 1 раскрытый.lightbox,.toggle-content остается видимым
	if (hasLightboxVisible(tgl)) {
		tgl.classList.remove('toggle-collapse'); // - отображаем div.toggle-content
		setFocus(tgl, 'focusIn'); // - фокусировка на.lightbox
	} else {
		setFocus(tgl, 'focusOut'); // - фокусировка на.lightbox
		tgl.classList.add('toggle-collapse'); // - скрываем div.toggle-content
	}
	// *перелапачиваем иконки/списки-переключатели
	tgl = tgl.previousElementSibling;
	if (typeof(tgl) !== "undefined" || tgl !== null && (tgl === Object(tgl) || typeof(tgl) === "object")) {
		if (tgl.children.length > 0) {
			if (lbx.hasAttribute('num')) { // - ищем ссылку по номеру
				let links = tgl.querySelectorAll('.toggle-dropdown'); // tagName a
				if (links.length > 0) {
					for (let i = 0; i < links.length; i++) {
						if (links[i].hasAttribute('num')) {
							if (+links[i].getAttribute('num') === +lbx.getAttribute('num')) {
								setToggleIcon(links[i]); // - переключатель иконки/списка
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