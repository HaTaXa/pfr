// (i) Инициализация переменных
// MediaQueryList
let mqlVariables = {vw: null, vh: null, varMobileIs: false} // глоб.переменная для хранения размеров и передачи в MediaQueryList
const mql = window.matchMedia('(max-width: 500px)'); // срабатывает только при пересечении точки останова
function mql_onChange(e) {
	const navPane = document.getElementById('idNavPane');
	if (e.matches) {
		if (mqlVariables.vh !== null) navPane.style.height = mqlVariables.vh + "vh";
		navPane.style.removeProperty('width');
		navPane.parentElement.classList.remove('var-mobile');
	} else {
		if (mqlVariables.varMobileIs) navPane.parentElement.classList.add('var-mobile');
		if (mqlVariables.vh === null) {
			if (mqlVariables.vw !== null) navPane.style.width = mqlVariables.vw + "vw";
			navPane.style.removeProperty('height');
		}
	}
}
mql.addEventListener('change', mql_onChange);
// <-- MediaQueryList
// (!) idSplitterRight/idSplitterBottom
function splitter_onPointerdown(eVent) {
	eVent.target.setPointerCapture(eVent.pointerId); // перенацеливаем все события указателя (до pointerup) на элемент idSplitterRight/idSplitterBottom
	// 'для событий мыши предотвращаем запуск и перехват браузером встроенного события pointercancel для процесса перетаскивания drag’n’drop для изображений
	// ''для сэнсорного экрана исп.css св-во: touch-action: none; см.в css.SplitterRight/idSplitterBottom
	eVent.target.ondragstart = () => false; // или так
	// eVent.target.ondragstart = function() { return false; };
	const navPane = document.getElementById('idNavPane');
	const topicPane = document.getElementById('idTopicPane');
	let client = {
		X: 0,
		Y: 0
	};
	let sizes = {
		width: navPane.offsetWidth,
		height: navPane.offsetHeight,
		minWidth: 300,
		maxWidth: navPane.parentElement.clientWidth - 102,
		innerHeightTop: 40,
		innerHeightBottom: navPane.parentElement.clientHeight - 40,
	};
	// получить значения в глобальную переменную sizes
	function getSizes(eVent) {
		// 'eVent.type - mouseup/pointerup
		// 'eVent.target - div.idSplitterBottom
		if (eVent.target.id === "idSplitterBottom") {
			if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
				function splitter_onMessageWindow(evn) {
					if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
						if (evn.data.value === "innerHeightTop") {
							sizes.innerHeightTop = evn.data.innerHeightTop;
						} else if (evn.data.value === "innerHeightBottom") {
							sizes.innerHeightBottom = evn.data.innerHeightBottom;
						}
					}
				}
				if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
					// (i) к сожалению нет смысла создавать дополнительные обработчики message для фреймов, потому что создание обработчика требует присутствия в своем окне
					window.top.addEventListener('message', splitter_onMessageWindow, false);
				}
				const frmNavPane = navPane.querySelector('iframe');
				frmNavPane.contentWindow.postMessage("innerHeightTop", "*"); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
				const frmTopicPane = getFrame(); // получить фрейм текущей вкладки или фрейм вкладки гл.топика по умолчанию
				frmTopicPane.contentWindow.postMessage("innerHeightBottom", "*"); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
			} else {
				const frmNavPane = navPane.querySelector('iframe');
				const frmTopicPane = getFrame(); // получить фрейм текущей вкладки или фрейм вкладки гл.топика по умолчанию
				const tocbody = frmNavPane.contentDocument.querySelector('.toc-body');
				sizes.innerHeightTop = tocbody.clientHeight - parseInt(getComputedStyle(tocbody, null).paddingTop, 10) - parseInt(getComputedStyle(tocbody, null).paddingBottom, 10);
				if (frmTopicPane.name === "ifrmkeywords") {
					sizes.innerHeightBottom = frmTopicPane.contentDocument.querySelector('.kwd-body').clientHeight;
				} else if (frmTopicPane.name === "ifrmsearch") {
					sizes.innerHeightBottom = frmTopicPane.contentDocument.querySelector('.search-body').clientHeight;
				} else {
					sizes.innerHeightBottom = frmTopicPane.contentDocument.querySelector('.topic-body').clientHeight;
				}
			}
		}
	}
	// установить значения из глобальной переменной sizes
	function setSizes(eVent) {
		// 'eVent.type - mouseup/pointerup
		// 'eVent.target - div.idSplitterRight/idSplitterBottom
		getSizes(eVent); // получить значения в глобальную переменную sizes
		if (eVent.target.id === "idSplitterRight") {
			if (sizes.width < sizes.minWidth) { // -отпружиниваем на выс.по умолчанию в.css правиле
				mqlVariables.vw = null;
				navPane.classList.remove('maxsize');
				// navPane.style.removeProperty('width'); // удаляем css св-во
				navPane.removeAttribute('style');
			} else {
				if (sizes.width >= sizes.maxWidth) {
					if (!navPane.parentElement.classList.contains('var-mobile')) navPane.parentElement.classList.add('var-mobile');
					mqlVariables.vw = null;
					// navPane.removeAttribute('style');
					navPane.style.removeProperty('width'); // удаляем css св-во
				} else {
					mqlVariables.vw = (sizes.width / document.documentElement.clientWidth) * 100;
					navPane.style.width = mqlVariables.vw + "vw";
					if (navPane.parentElement.classList.contains('var-mobile')) {
						navPane.parentElement.classList.remove('var-mobile');
					} else {
						navPane.classList.remove('maxsize');
					}
				}
				if (navPane.parentElement.classList.contains('var-mobile')) {
					mqlVariables.varMobileIs = true;
				} else { mqlVariables.varMobileIs = false; }
			}
		} else if (eVent.target.id === "idSplitterBottom") {
			const setSizesSplitterBottom = () => {
				if (sizes.innerHeightTop === 0) { // сворачиваем нав.пан.
					if (!navPane.classList.contains('minsize')) {
						navPane.classList.add('minsize'); // navPane.style.height = "auto";
						mqlVariables.varMobileIs = true;
					}
					mqlVariables.vh = null;
					// navPane.style.removeProperty('height'); // удаляем css св-во
					navPane.removeAttribute('style');
				} else if (sizes.innerHeightTop < 18) { // отпружиниваем на выс.по умолчанию в.css правиле
					if (navPane.classList.contains('minsize')) {
						navPane.classList.remove('minsize');
						mqlVariables.varMobileIs = false;
					}
					mqlVariables.vh = null;
					// navPane.style.removeProperty('height'); // удаляем css св-во
					navPane.removeAttribute('style');
				} else if (sizes.innerHeightBottom === 0) { // full size
						if (!navPane.classList.contains('maxsize')) {
							navPane.classList.add('maxsize'); // navPane.style.height = "100%";
							mqlVariables.varMobileIs = true;
						}
						mqlVariables.vh = null;
						// navPane.style.removeProperty('height'); // удаляем css св-во
						navPane.removeAttribute('style');
				} else {
					mqlVariables.vh = (sizes.height / document.documentElement.clientHeight) * 100;
					navPane.style.height = mqlVariables.vh + "vh";
					mqlVariables.varMobileIs = true;
					if (navPane.classList.contains('maxsize')) navPane.classList.remove('maxsize');
					if (navPane.classList.contains('minsize')) navPane.classList.remove('minsize');
				}
			};

			if (location.origin === "file://" || location.origin === "null") { // (i) в Firefox origin = "null"
				setTimeout(() => {
					setSizesSplitterBottom();
				}, 50);
			} else {
				setSizesSplitterBottom();
			}
		}
	}
	// *определяем первоначальное положение координат Y |— X
	if (eVent.target.id === "idSplitterRight") {
		client.X = eVent.clientX;
		// 'инициализация в глобальной переменной sizes
		sizes.width = navPane.offsetWidth;
	} else if (eVent.target.id === "idSplitterBottom") {
		client.Y = eVent.clientY;
		// 'инициализация в глобальной переменной sizes
		sizes.height = navPane.offsetHeight;
		// '
		if (eVent.pointerType === "mouse") eVent.target.classList.add('cursor-grabbing'); // (!) иногда срабатывает инверсионно + не всеми браузерами поддерживается (IE)
	}
	// eVent.target.style.pointerEvents = "none"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
	function splitter_onPointermove(eVent) {
		if (eVent.target.id === "idSplitterRight") {
			sizes.width = sizes.width + (eVent.clientX - client.X);
			client.X = eVent.clientX;
			if ((sizes.width + parseInt(getComputedStyle(navPane, null).marginRight, 10)) >= navPane.parentElement.offsetWidth) {
				navPane.parentElement.classList.add('var-mobile');
				if (mqlVariables.vh !== null) navPane.style.height = mqlVariables.vh + "vh"; // (i) т.к.sizes.height не хранит предыдущее значение
				navPane.style.removeProperty('width'); // удаляем css св-во
			} else {
				navPane.style.width = sizes.width + "px";
				navPane.parentElement.classList.remove('var-mobile');
				navPane.style.removeProperty('height'); // удаляем css св-во
			}
		} else if (eVent.target.id === "idSplitterBottom") {
			sizes.height = sizes.height + (eVent.clientY - client.Y);
			client.Y = eVent.clientY;
			if (sizes.height <= 0) {
				navPane.classList.remove('maxsize');
				navPane.classList.add('minsize');
				// navPane.style.removeProperty('height'); // удаляем css св-во
				navPane.removeAttribute('style');
			} else if (sizes.height >= navPane.parentElement.offsetHeight) {
				navPane.classList.remove('minsize');
				navPane.classList.add('maxsize');
				// navPane.style.removeProperty('height'); // удаляем css св-во
				navPane.removeAttribute('style');
			} else {
				navPane.style.height = sizes.height + "px";
				navPane.classList.remove('maxsize');
				navPane.classList.remove('minsize');
			}
		}
	}
	eVent.target.addEventListener('pointermove', splitter_onPointermove, false);
	function splitter_onPointerup(eVent) {
		eVent.target.releasePointerCapture(eVent.pointerId); // явно останавливаем захват на элемент idSplitterRight/idSplitterBottom
		setSizes(eVent); // установить значения из глобальной переменной sizes
		if (eVent.target.id === "idSplitterBottom") {
			if (eVent.pointerType === "mouse") eVent.target.classList.remove('cursor-grabbing');
		}
		// eVent.target.style.pointerEvents = "initial"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
		eVent.target.removeEventListener('pointermove', splitter_onPointermove, false);
		eVent.target.removeEventListener('pointerup', splitter_onPointerup, false);
	}
	eVent.target.addEventListener('pointerup', splitter_onPointerup, false);
}
// (!) создание/удаление обработчиков событий для узла нав.пан.
function setEventHandlersSplitters(elem, addOrRemove = "add") {
	// 'elem - idNavPane/дочерние элементы
	if (addOrRemove !== "add" && addOrRemove !== "remove") {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setEventHandlersSplitters(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	if (typeof(elem) === "undefined" || elem === null || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setEventHandlersSplitters(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	} else if ((elem.id !== "idSplitterRight" && !elem.classList.contains('splitter-right')) && (elem.id !== "idSplitterBottom" && !elem.classList.contains('splitter-bottom'))) {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - у элемента отсутствует класс, либо класс не определен:\n function setEventHandlersSplitters(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}"):\n elem.id = «${elem.id}»\n elem.classList: ${elem.classList}`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
		return false;
	}
	// *добавляем/удаляем обработчики событий
	if (addOrRemove === "add") {
		elem.addEventListener('pointerdown', splitter_onPointerdown, false); // 'mouse & touch
	} else if (addOrRemove === "remove") {
		elem.removeEventListener('pointerdown', splitter_onPointerdown, false); // 'mouse & touch
	}
	return true;
}




// 'на удаление
// (i) Инициализация переменных
// x -
// // const banner = document.getElementById('idBanner'); // исп.при position: absolute
// // const toolbarPane = document.getElementById('idToolbar'); // исп.при position: absolute
// const navPane = document.getElementById('idNavPane');
// const topicPane = document.getElementById('idTopicPane');
// const splitterRight = document.getElementById('idSplitterRight');
// const splitterBottom = document.getElementById('idSplitterBottom');
// // '
// // let unlockResize = false; // флаг, определяющий предотвращение изменения размеров панелей // (?)'тест на удаление

// // let oldClientWidth = document.documentElement.clientWidth; // (i) для ф.reSizePanels() // исп.при position: absolute
// // let reSizes = { // исп.при position: absolute
// // 	totalMinHeight: 300,
// // 	navpaneInitHeight: navPane.offsetHeight - parseInt(getComputedStyle(navPane, null).paddingTop, 10) - parseInt(getComputedStyle(navPane, null).paddingBottom, 10) - parseInt(getComputedStyle(navPane, null).borderTop, 10) - parseInt(getComputedStyle(navPane, null).borderBottom, 10),
// // 	navpaneMinWidth: 294,
// // 	navpaneMinHeight: 250,
// // 	navpaneWidth: navPane.offsetWidth - parseInt(getComputedStyle(navPane, null).paddingLeft, 10) - parseInt(getComputedStyle(navPane, null).paddingRight, 10) - parseInt(getComputedStyle(navPane, null).borderLeft, 10) - parseInt(getComputedStyle(navPane, null).borderRight, 10),
// // 	navpaneTop: navPane.offsetTop - parseInt(getComputedStyle(navPane, null).marginTop, 10),
// // 	navpaneHeight: navPane.offsetHeight - parseInt(getComputedStyle(navPane, null).paddingTop, 10) - parseInt(getComputedStyle(navPane, null).paddingBottom, 10) - parseInt(getComputedStyle(navPane, null).borderTop, 10) - parseInt(getComputedStyle(navPane, null).borderBottom, 10),
// // 	topicpaneMinWidth: 500,
// // 	topicpaneMinHeight: 200,
// // 	topicpaneLeft: topicPane.offsetLeft - parseInt(getComputedStyle(topicPane, null).marginLeft, 10),
// // 	topicpaneTop: topicPane.offsetTop - parseInt(getComputedStyle(topicPane, null).marginTop, 10),
// // 	topicpaneWidth: topicPane.offsetWidth - parseInt(getComputedStyle(topicPane, null).paddingLeft, 10) - parseInt(getComputedStyle(topicPane, null).paddingRight, 10) - parseInt(getComputedStyle(topicPane, null).borderLeft, 10) - parseInt(getComputedStyle(topicPane, null).borderRight, 10),
// // 	topicpaneHeight: topicPane.offsetHeight - parseInt(getComputedStyle(topicPane, null).paddingTop, 10) - parseInt(getComputedStyle(topicPane, null).paddingBottom, 10) - parseInt(getComputedStyle(topicPane, null).borderTop, 10) - parseInt(getComputedStyle(topicPane, null).borderBottom, 10),
// // };


// let reSizes = {
// 	width: navPane.offsetWidth,
// 	height: navPane.offsetHeight,
// 	minWidth: 300,
// 	minHeight: 40,
// 	minReset: 250,
// };
// let client = {
// 	eventClientX: 0,
// 	eventClientY: 0
// }; // x -

// $(document).ready(function () { // - jq
// 	// (!) splitterRight
// 	splitterRight.addEventListener('pointerdown', function (e) {
// 		splitterRight.setPointerCapture(e.pointerId); // перенацеливаем все события указателя (до pointerup) на элемент idSplitterRight
// 		// *определяем первоначальное положение координат Y |— X
// 		client.eventClientX = e.clientX;
// 		// 'инициализация в глобальной переменной reSizes
// 		reSizes.width = navPane.offsetWidth;
// 		// splitterRight.style.pointerEvents = "none"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 		function splitterRight_onPointermove(eVent) {
// 			getSizes(eVent); // получить размеры в глобальную переменную reSizes
// 			if (reSizes.width >= navPane.parentElement.clientWidth) {
// 				navPane.style.height = reSizes.height + "px";
// 				navPane.parentElement.classList.add('var-mobile');
// 				navPane.style.removeProperty('width'); // удаляем css св-во
// 			} else {
// 				navPane.style.width = reSizes.width + "px";
// 				navPane.parentElement.classList.remove('var-mobile');
// 				navPane.style.removeProperty('height'); // удаляем css св-во
// 			}
// 		}
// 		splitterRight.addEventListener('pointermove', splitterRight_onPointermove, false);
// 		function splitterRight_onPointerup(eVent) {
// 			splitterRight.releasePointerCapture(eVent.pointerId); // явно останавливаем захват на элемент idSplitterRight
// 			// 'eVent.target - tagName div splitterRight, но может быть и другим элементом предположительно из-за делегирования через наследование на основе прототипов (.prototype)
// 			setSizes(eVent); // установить значения и обновить глобальную переменную reSizes
// 			// splitterRight.style.pointerEvents = "initial"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 			splitterRight.removeEventListener('pointermove', splitterRight_onPointermove, false);
// 			splitterRight.removeEventListener('pointerup', splitterRight_onPointerup, false);
// 		}
// 		splitterRight.addEventListener('pointerup', splitterRight_onPointerup, false);
// 		// 'для событий мыши предотвращаем запуск и перехват браузером встроенного события pointercancel для процесса перетаскивания drag’n’drop для изображений
// 		// ''для сэнсорного экрана исп.css св-во: touch-action: none; см.в idSplitterRight
// 		splitterRight.ondragstart = () => false; // или так
// 		// splitterRight.ondragstart = function() { return false; };
// 	}, false);
// 	// (!) splitterBottom
// 	splitterBottom.addEventListener('pointerdown', function (e) {
// 		splitterBottom.setPointerCapture(e.pointerId); // перенацеливаем все события указателя (до pointerup) на элемент idSplitterBottom
// 		// *определяем первоначальное положение координат Y |— X
// 		client.eventClientY = e.clientY;
// 		// 'инициализация в глобальной переменной reSizes
// 		reSizes.height = navPane.offsetHeight;
// 		// '
// 		if (e.pointerType === "mouse") splitterBottom.classList.add('cursor-grabbing'); // (!) иногда срабатывает инверсионно + не всеми браузерами поддерживается (IE)
// 		// splitterBottom.style.pointerEvents = "none"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 		function splitterBottom_onPointermove(eVent) {
// 			getSizes(eVent); // получить размеры в глобальную переменную reSizes
// 			if (reSizes.height <= navPane.parentElement.clientHeight) navPane.style.height = reSizes.height + "px";
// 		}
// 		splitterBottom.addEventListener('pointermove', splitterBottom_onPointermove, false);
// 		function splitterBottom_onPointerup(eVent) {
// 			splitterBottom.releasePointerCapture(eVent.pointerId); // явно останавливаем захват на элемент idSplitterBottom
// 			// 'eVent.target - tagName div splitterBottom, но может быть и другим элементом предположительно из-за делегирования через наследование на основе прототипов (.prototype)
// 			setSizes(eVent); // установить значения и обновить глобальную переменную reSizes
// 			if (eVent.pointerType === "mouse") splitterBottom.classList.remove('cursor-grabbing');
// 			// splitterBottom.style.pointerEvents = "initial"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 			splitterBottom.removeEventListener('pointermove', splitterBottom_onPointermove, false);
// 			splitterBottom.removeEventListener('pointerup', splitterBottom_onPointerup, false);
// 		}
// 		splitterBottom.addEventListener('pointerup', splitterBottom_onPointerup, false);
// 		// 'для событий мыши предотвращаем запуск и перехват браузером встроенного события pointercancel для процесса перетаскивания drag’n’drop для изображений
// 		// ''для сэнсорного экрана исп.css св-во: touch-action: none; см.в idSplitterBottom
// 		splitterBottom.ondragstart = () => false; // или так
// 		// splitterBottom.ondragstart = function() { return false; };
// 	}, false);






// 	// (i) исп.при position: absolute
// 	// splitterRight.addEventListener('pointerdown', function (e) {
// 	// 	splitterRight.setPointerCapture(e.pointerId); // перенацеливаем все события указателя (до pointerup) на элемент idSplitterRight
// 	// 	// *определяем первоначальное положение координат Y |— X
// 	// 	client.eventClientX = e.clientX;
// 	// 	// '
// 	// 	if (getComputedStyle(navPane, null).boxSizing === "border-box") {
// 	// 		reSizes.navpaneWidth = navPane.offsetWidth;
// 	// 	} else {
// 	// 		reSizes.navpaneWidth = navPane.offsetWidth - parseInt(getComputedStyle(navPane, null).paddingLeft, 10) - parseInt(getComputedStyle(navPane, null).paddingRight, 10) - parseInt(getComputedStyle(navPane, null).borderLeft, 10) - parseInt(getComputedStyle(navPane, null).borderRight, 10);
// 	// 	}
// 	// 	// '
// 	// 	reSizes.topicpaneLeft = topicPane.offsetLeft - parseInt(getComputedStyle(topicPane, null).marginLeft, 10);
// 	// 	// '
// 	// 	reSizes.topicpaneWidth = topicPane.offsetWidth - parseInt(getComputedStyle(topicPane, null).paddingLeft, 10) - parseInt(getComputedStyle(topicPane, null).paddingRight, 10) - parseInt(getComputedStyle(topicPane, null).borderLeft, 10) - parseInt(getComputedStyle(topicPane, null).borderRight, 10);
// 	// 	// '
// 	// 	// splitterRight.style.pointerEvents = "none"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 	// 	function splitterRight_onPointermove(eVent) {
// 	// 		// (i)*отменяем действия браузера по умолчанию - без этого на локальном ПК событие безумно тормозит при изменении размеров элементов
// 	// 		// eVent.preventDefault(); // если через обработчик addEventListener
// 	// 		// eVent.stopPropagation();
// 	// 		// return false; // если через обработчик on<событие>
// 	// 		getSizes(eVent); // получить размеры в глобальную переменную reSizes
// 	// 		navPane.style.width = reSizes.navpaneWidth + "px";
// 	// 		topicPane.style.left = reSizes.topicpaneLeft + "px";
// 	// 	}
// 	// 	splitterRight.addEventListener('pointermove', splitterRight_onPointermove, false);
// 	// 	function splitterRight_onPointerup(eVent) {
// 	// 		splitterRight.releasePointerCapture(eVent.pointerId); // явно останавливаем захват на элемент idSplitterRight
// 	// 		// 'eVent.target - tagName div splitterRight, но может быть и другим элементом предположительно из-за делегирования через наследование на основе прототипов (.prototype)
// 	// 		setSizes(eVent); // установить значения и обновить глобальную переменную reSizes
// 	// 		// splitterRight.style.pointerEvents = "initial"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 	// 		splitterRight.removeEventListener('pointermove', splitterRight_onPointermove, false);
// 	// 		splitterRight.removeEventListener('pointerup', splitterRight_onPointerup, false);
// 	// 	}
// 	// 	splitterRight.addEventListener('pointerup', splitterRight_onPointerup, false);
// 	// 	// 'для событий мыши предотвращаем запуск и перехват браузером встроенного события pointercancel для процесса перетаскивания drag’n’drop для изображений
// 	// 	// ''для сэнсорного экрана исп.css св-во: touch-action: none; см.в idSplitterRight
// 	// 	splitterRight.ondragstart = () => false; // или так
// 	// 	// splitterRight.ondragstart = function() { return false; };
// 	// }, false);
// 	// (!) splitterBottom
// 	// splitterBottom.addEventListener('pointerdown', function (e) {
// 	// 	splitterBottom.setPointerCapture(e.pointerId); // перенацеливаем все события указателя (до pointerup) на элемент idSplitterBottom
// 	// 	// *определяем первоначальное положение координат Y |— X
// 	// 	client.eventClientY = e.clientY;
// 	// 	// '
// 	// 	reSizes.navpaneTop = navPane.offsetTop - parseInt(getComputedStyle(navPane, null).marginTop, 10);
// 	// 	// '
// 	// 	reSizes.navpaneHeight = navPane.offsetHeight - parseInt(getComputedStyle(navPane, null).paddingTop, 10) - parseInt(getComputedStyle(navPane, null).paddingBottom, 10) - parseInt(getComputedStyle(navPane, null).borderTop, 10) - parseInt(getComputedStyle(navPane, null).borderBottom, 10);
// 	// 	// '
// 	// 	reSizes.topicpaneTop = topicPane.offsetTop - parseInt(getComputedStyle(topicPane, null).marginTop, 10);
// 	// 	// '
// 	// 	reSizes.topicpaneHeight = topicPane.offsetHeight - parseInt(getComputedStyle(topicPane, null).paddingTop, 10) - parseInt(getComputedStyle(topicPane, null).paddingBottom, 10) - parseInt(getComputedStyle(topicPane, null).borderTop, 10) - parseInt(getComputedStyle(topicPane, null).borderBottom, 10);
// 	// 	// '
// 	// 	if (e.pointerType === "mouse") splitterBottom.classList.add('cursor-grabbing'); // (!) иногда срабатывает инверсионно + не всеми браузерами поддерживается (IE)
// 	// 	// splitterBottom.style.pointerEvents = "none"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 	// 	function splitterBottom_onPointermove(eVent) {
// 	// 		// (i)*отменяем действия браузера по умолчанию - без этого на локальном ПК событие безумно тормозит при изменении размеров элементов
// 	// 		// eVent.preventDefault(); // если через обработчик addEventListener
// 	// 		// eVent.stopPropagation();
// 	// 		// return false; // если через обработчик on<событие>
// 	// 		getSizes(eVent); // получить размеры в глобальную переменную reSizes
// 	// 		if (parseInt(getComputedStyle(navPane, null).height, 10) > 0) navPane.style.removeProperty('min-height');
// 	// 		navPane.style.height = reSizes.navpaneHeight + "px";
// 	// 		topicPane.style.height = reSizes.topicpaneHeight + "px";
// 	// 	}
// 	// 	splitterBottom.addEventListener('pointermove', splitterBottom_onPointermove, false);
// 	// 	function splitterBottom_onPointerup(eVent) {
// 	// 		splitterBottom.releasePointerCapture(eVent.pointerId); // явно останавливаем захват на элемент idSplitterBottom
// 	// 		// 'eVent.target - tagName div splitterBottom, но может быть и другим элементом предположительно из-за делегирования через наследование на основе прототипов (.prototype)
// 	// 		setSizes(eVent); // установить значения и обновить глобальную переменную reSizes
// 	// 		if (eVent.pointerType === "mouse") splitterBottom.classList.remove('cursor-grabbing');
// 	// 		// splitterBottom.style.pointerEvents = "initial"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 	// 		splitterBottom.removeEventListener('pointermove', splitterBottom_onPointermove, false);
// 	// 		splitterBottom.removeEventListener('pointerup', splitterBottom_onPointerup, false);
// 	// 	}
// 	// 	splitterBottom.addEventListener('pointerup', splitterBottom_onPointerup, false);
// 	// 	// 'для событий мыши предотвращаем запуск и перехват браузером встроенного события pointercancel для процесса перетаскивания drag’n’drop для изображений
// 	// 	// ''для сэнсорного экрана исп.css св-во: touch-action: none; см.в idSplitterBottom
// 	// 	splitterBottom.ondragstart = () => false; // или так
// 	// 	// splitterBottom.ondragstart = function() { return false; };
// 	// }, false);



// 	// 'mouse & touch - после test point event можно удалять
// 	// if (isMobile()) {
// 	// 	// (!) splitterRight
// 	// 	splitterRight.addEventListener('touchstart', function (e) {
// 	// 		console.log(`test: splitterRight`);
// 	// 		// unlockResize = true;
// 	// 		// *определяем первоначальное положение координат Y |— X
// 	// 		client.touchClientX = e.touches[0].clientX;
// 	// 		// '
// 	// 		reSizes.navpaneWidth = navPane.offsetWidth - parseInt(getComputedStyle(navPane, null).paddingLeft, 10) - parseInt(getComputedStyle(navPane, null).paddingRight, 10) - parseInt(getComputedStyle(navPane, null).borderLeft, 10) - parseInt(getComputedStyle(navPane, null).borderRight, 10);
// 	// 		// '
// 	// 		reSizes.topicpaneLeft = topicPane.offsetLeft - parseInt(getComputedStyle(topicPane, null).marginLeft, 10);
// 	// 		// '
// 	// 		reSizes.topicpaneWidth = topicPane.offsetWidth - parseInt(getComputedStyle(topicPane, null).paddingLeft, 10) - parseInt(getComputedStyle(topicPane, null).paddingRight, 10) - parseInt(getComputedStyle(topicPane, null).borderLeft, 10) - parseInt(getComputedStyle(topicPane, null).borderRight, 10);
// 	// 		// '
// 	// 		// splitterRight.style.pointerEvents = "none"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 	// 		function splitterRight_onTouchmove(eVent) {
// 	// 			// (i)*отменяем действия браузера по умолчанию - без этого на локальном ПК событие безумно тормозит при изменении размеров элементов
// 	// 			// eVent.preventDefault(); // если через обработчик addEventListener
// 	// 			// eVent.stopPropagation();
// 	// 			// return false; // если через обработчик on<событие>
// 	// 			// if (unlockResize) {
// 	// 				getSizes(eVent); // получить размеры в глобальную переменную reSizes
// 	// 				navPane.style.width = reSizes.navpaneWidth + "px";
// 	// 				topicPane.style.left = reSizes.topicpaneLeft + "px";
// 	// 			// }
// 	// 		}
// 	// 		document.addEventListener('touchmove', splitterRight_onTouchmove, {passive: false}); // passive - по умолчанию true для touchstart/touchmove - обработчик никогда не вызовет preventDefault(). Если вызов будет произведен, браузер его проигнорит и сгенерирует консольное предупреждение
// 	// 		function splitterRight_onTouchend(eVent) {
// 	// 			// 'eVent.target - tagName div splitterRight, но может быть и другим элементом предположительно из-за делегирования через наследование на основе прототипов (.prototype)
// 	// 			// if (unlockResize) {
// 	// 				// unlockResize = false;
// 	// 				setSizes(eVent); // установить значения и обновить глобальную переменную reSizes
// 	// 				// splitterRight.style.pointerEvents = "initial"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 	// 				document.removeEventListener('touchmove', splitterRight_onTouchmove, {passive: false}); // passive - по умолчанию true для touchstart/touchmove - обработчик никогда не вызовет preventDefault(). Если вызов будет произведен, браузер его проигнорит и сгенерирует консольное предупреждение
// 	// 				document.removeEventListener('touchend', splitterRight_onTouchend, false);
// 	// 			// }
// 	// 		}
// 	// 		document.addEventListener('touchend', splitterRight_onTouchend, false);
// 	// 	}, {passive: false}); // passive - по умолчанию true для touchstart/touchmove - обработчик никогда не вызовет preventDefault(). Если вызов будет произведен, браузер его проигнорит и сгенерирует консольное предупреждение
// 	// 	// (!) splitterBottom
// 	// 	splitterBottom.addEventListener('touchstart', function (e) {
// 	// 		console.log(`test: splitterBottom`);
// 	// 		// unlockResize = true;
// 	// 		// *определяем первоначальное положение координат Y |— X
// 	// 		client.touchClientY = e.touches[0].clientY;
// 	// 		// '
// 	// 		reSizes.navpaneTop = navPane.offsetTop - parseInt(getComputedStyle(navPane, null).marginTop, 10);
// 	// 		// '
// 	// 		reSizes.navpaneHeight = navPane.offsetHeight - parseInt(getComputedStyle(navPane, null).paddingTop, 10) - parseInt(getComputedStyle(navPane, null).paddingBottom, 10) - parseInt(getComputedStyle(navPane, null).borderTop, 10) - parseInt(getComputedStyle(navPane, null).borderBottom, 10);
// 	// 		// '
// 	// 		reSizes.topicpaneTop = topicPane.offsetTop - parseInt(getComputedStyle(topicPane, null).marginTop, 10);
// 	// 		// '
// 	// 		reSizes.topicpaneHeight = topicPane.offsetHeight - parseInt(getComputedStyle(topicPane, null).paddingTop, 10) - parseInt(getComputedStyle(topicPane, null).paddingBottom, 10) - parseInt(getComputedStyle(topicPane, null).borderTop, 10) - parseInt(getComputedStyle(topicPane, null).borderBottom, 10);
// 	// 		// '
// 	// 		// splitterBottom.style.pointerEvents = "none"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 	// 		function splitterBottom_onTouchmove(eVent) {
// 	// 			// (i)*отменяем действия браузера по умолчанию - без этого на локальном ПК событие безумно тормозит при изменении размеров элементов
// 	// 			// eVent.preventDefault(); // если через обработчик addEventListener
// 	// 			// eVent.stopPropagation();
// 	// 			// return false; // если через обработчик on<событие>
// 	// 			// if (unlockResize) {
// 	// 				getSizes(eVent); // получить размеры в глобальную переменную reSizes
// 	// 				if (parseInt(getComputedStyle(navPane, null).height, 10) > 0) navPane.style.removeProperty('min-height');
// 	// 				navPane.style.height = reSizes.navpaneHeight + "px";
// 	// 				topicPane.style.height = reSizes.topicpaneHeight + "px";
// 	// 			// }
// 	// 		}
// 	// 		document.addEventListener('touchmove', splitterBottom_onTouchmove, {passive: false}); // passive - по умолчанию true для touchstart/touchmove - обработчик никогда не вызовет preventDefault(). Если вызов будет произведен, браузер его проигнорит и сгенерирует консольное предупреждение
// 	// 		function splitterBottom_onTouchend(eVent) {
// 	// 			// 'eVent.target - tagName div splitterBottom, но может быть и другим элементом предположительно из-за делегирования через наследование на основе прототипов (.prototype)
// 	// 			// if (unlockResize) {
// 	// 				// unlockResize = false;
// 	// 				setSizes(eVent); // установить значения и обновить глобальную переменную reSizes
// 	// 				// splitterBottom.style.pointerEvents = "initial"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 	// 				document.removeEventListener('touchmove', splitterBottom_onTouchmove, {passive: false}); // passive - по умолчанию true для touchstart/touchmove - обработчик никогда не вызовет preventDefault(). Если вызов будет произведен, браузер его проигнорит и сгенерирует консольное предупреждение
// 	// 				document.removeEventListener('touchend', splitterBottom_onTouchend, false);
// 	// 			// }
// 	// 		}
// 	// 		document.addEventListener('touchend', splitterBottom_onTouchend, false);
// 	// 	}, {passive: false}); // passive - по умолчанию true для touchstart/touchmove - обработчик никогда не вызовет preventDefault(). Если вызов будет произведен, браузер его проигнорит и сгенерирует консольное предупреждение
// 	// } else { // - desktop - Windows NT...
// 	// 	// (!) splitterRight
// 	// 	splitterRight.addEventListener('mousedown', function (e) {
// 	// 		// unlockResize = true;
// 	// 		// *определяем первоначальное положение координат Y |— X
// 	// 		client.eventClientX = e.clientX;
// 	// 		// '
// 	// 		reSizes.navpaneWidth = navPane.offsetWidth - parseInt(getComputedStyle(navPane, null).paddingLeft, 10) - parseInt(getComputedStyle(navPane, null).paddingRight, 10) - parseInt(getComputedStyle(navPane, null).borderLeft, 10) - parseInt(getComputedStyle(navPane, null).borderRight, 10);
// 	// 		// '
// 	// 		reSizes.topicpaneLeft = topicPane.offsetLeft - parseInt(getComputedStyle(topicPane, null).marginLeft, 10);
// 	// 		// '
// 	// 		reSizes.topicpaneWidth = topicPane.offsetWidth - parseInt(getComputedStyle(topicPane, null).paddingLeft, 10) - parseInt(getComputedStyle(topicPane, null).paddingRight, 10) - parseInt(getComputedStyle(topicPane, null).borderLeft, 10) - parseInt(getComputedStyle(topicPane, null).borderRight, 10);
// 	// 		// '
// 	// 		// splitterRight.style.pointerEvents = "none"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 	// 		function splitterRight_onMousemove(eVent) {
// 	// 			// (i)*отменяем действия браузера по умолчанию - без этого на локальном ПК событие безумно тормозит при изменении размеров элементов
// 	// 			eVent.preventDefault(); // если через обработчик addEventListener
// 	// 			// eVent.stopPropagation();
// 	// 			// return false; // если через обработчик on<событие>
// 	// 			// if (unlockResize) {
// 	// 				getSizes(eVent); // получить размеры в глобальную переменную reSizes
// 	// 				navPane.style.width = reSizes.navpaneWidth + "px";
// 	// 				topicPane.style.left = reSizes.topicpaneLeft + "px";
// 	// 			// }
// 	// 		}
// 	// 		document.addEventListener('mousemove', splitterRight_onMousemove, false);
// 	// 		function splitterRight_onMouseup(eVent) {
// 	// 			// 'eVent.target - tagName div splitterRight, но может быть и другим элементом предположительно из-за делегирования через наследование на основе прототипов (.prototype)
// 	// 			// if (unlockResize) {
// 	// 				// unlockResize = false;
// 	// 				setSizes(eVent); // установить значения и обновить глобальную переменную reSizes
// 	// 				// splitterRight.style.pointerEvents = "initial"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 	// 				document.removeEventListener('mousemove', splitterRight_onMousemove, false);
// 	// 				document.removeEventListener('mouseup', splitterRight_onMouseup, false);
// 	// 			// }
// 	// 		}
// 	// 		document.addEventListener('mouseup', splitterRight_onMouseup, false);
// 	// 	}, false);
// 	// 	// (!) splitterBottom
// 	// 	splitterBottom.addEventListener('mousedown', function (e) {
// 	// 		// unlockResize = true;
// 	// 		// *определяем первоначальное положение координат Y |— X
// 	// 		client.eventClientY = e.clientY;
// 	// 		// '
// 	// 		reSizes.navpaneTop = navPane.offsetTop - parseInt(getComputedStyle(navPane, null).marginTop, 10);
// 	// 		// '
// 	// 		reSizes.navpaneHeight = navPane.offsetHeight - parseInt(getComputedStyle(navPane, null).paddingTop, 10) - parseInt(getComputedStyle(navPane, null).paddingBottom, 10) - parseInt(getComputedStyle(navPane, null).borderTop, 10) - parseInt(getComputedStyle(navPane, null).borderBottom, 10);
// 	// 		// '
// 	// 		reSizes.topicpaneTop = topicPane.offsetTop - parseInt(getComputedStyle(topicPane, null).marginTop, 10);
// 	// 		// '
// 	// 		reSizes.topicpaneHeight = topicPane.offsetHeight - parseInt(getComputedStyle(topicPane, null).paddingTop, 10) - parseInt(getComputedStyle(topicPane, null).paddingBottom, 10) - parseInt(getComputedStyle(topicPane, null).borderTop, 10) - parseInt(getComputedStyle(topicPane, null).borderBottom, 10);
// 	// 		// '
// 	// 		splitterBottom.classList.add('cursor-grabbing'); // (!) иногда срабатывает инверсионно + не всеми браузерами поддерживается (IE)
// 	// 		// splitterBottom.style.pointerEvents = "none"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 	// 		function splitterBottom_onMousemove(eVent) {
// 	// 			// (i)*отменяем действия браузера по умолчанию - без этого на локальном ПК событие безумно тормозит при изменении размеров элементов
// 	// 			eVent.preventDefault(); // если через обработчик addEventListener
// 	// 			// eVent.stopPropagation();
// 	// 			// return false; // если через обработчик on<событие>
// 	// 			// if (unlockResize) {
// 	// 				getSizes(eVent); // получить размеры в глобальную переменную reSizes
// 	// 				if (parseInt(getComputedStyle(navPane, null).height, 10) > 0) navPane.style.removeProperty('min-height');
// 	// 				navPane.style.height = reSizes.navpaneHeight + "px";
// 	// 				topicPane.style.height = reSizes.topicpaneHeight + "px";
// 	// 			// }
// 	// 		}
// 	// 		document.addEventListener('mousemove', splitterBottom_onMousemove, false);
// 	// 		function splitterBottom_onMouseup(eVent) {
// 	// 			// 'eVent.target - tagName div splitterBottom, но может быть и другим элементом предположительно из-за делегирования через наследование на основе прототипов (.prototype)
// 	// 			// if (unlockResize) {
// 	// 				// unlockResize = false;
// 	// 				setSizes(eVent); // установить значения и обновить глобальную переменную reSizes
// 	// 				splitterBottom.classList.remove('cursor-grabbing');
// 	// 				// splitterBottom.style.pointerEvents = "initial"; // св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие. // (?)
// 	// 				document.removeEventListener('mousemove', splitterBottom_onMousemove, false);
// 	// 				document.removeEventListener('mouseup', splitterBottom_onMouseup, false);
// 	// 			// }
// 	// 		}
// 	// 		document.addEventListener('mouseup', splitterBottom_onMouseup, false);
// 	// 	}, false); // false - фаза "всплытие"
// 	// }
// }); // ready end


// (!) getSizes - получить размеры в глобальную переменную reSizes
// (i) вариант, когда панели были display: block
// function getSizes(eVent) {
// 	// 'eVent.type - onMousemove
// 	// 'eVent.target - splitterRight/splitterBottom (?) не понятно почему eVent.target в условии вызывает тормоза
// 	let toolbarHeight = getValueFullSizeProperty(toolbarPane).height; // получить полноразмерное значение св-ва
// 	let navpaneStyles = getComputedStyle(navPane, null);
// 	let topicpaneStyles = getComputedStyle(topicPane, null);

// 	if (document.documentElement.clientWidth > 501) {
// 		reSizes.navpaneWidth = (eVent.clientX + getValueFullSizeProperty(splitterRight).width - parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.paddingRight, 10)) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.marginLeft, 10);
// 		reSizes.topicpaneLeft = eVent.clientX + parseInt(navpaneStyles.marginRight, 10);
// 		reSizes.topicpaneWidth = document.body.offsetWidth - (eVent.clientX + parseInt(navpaneStyles.marginRight, 10));
// 	} else if (document.documentElement.clientWidth < 501) {
// 		reSizes.navpaneTop = (reSizes.navpaneHeight < 250) ? (eVent.clientY + getValueFullSizeProperty(splitterBottom).height) - parseInt(navpaneStyles.height, 10) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10) : (banner.offsetHeight + toolbarHeight) - parseInt(navpaneStyles.marginTop, 10);
// 		reSizes.navpaneHeight = (eVent.clientY + getValueFullSizeProperty(splitterBottom).height) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.marginTop, 10) - banner.offsetHeight - toolbarHeight;
// 		reSizes.topicpaneTop = (eVent.clientY + getValueFullSizeProperty(splitterBottom).height) + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10) - parseInt(navpaneStyles.marginBottom, 10);
// 		reSizes.topicpaneHeight = document.body.offsetHeight - (eVent.clientY + getValueFullSizeProperty(splitterBottom).height + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10) - parseInt(navpaneStyles.marginBottom, 10)) - parseInt(topicpaneStyles.paddingTop, 10) - parseInt(topicpaneStyles.paddingBottom, 10) - parseInt(topicpaneStyles.borderTop, 10) - parseInt(topicpaneStyles.borderBottom, 10) - parseInt(topicpaneStyles.marginTop, 10) - parseInt(topicpaneStyles.marginBottom, 10);
// 	}
// }
// function getSizes(eVent) {
// 	// 'eVent.type - mouseup/pointerup
// 	// 'eVent.target - div.idSplitterRight/idSplitterBottom
// 	if (eVent.target.id === "idSplitterRight") {
// 		reSizes.width = reSizes.width + (eVent.clientX - client.eventClientX);
// 		client.eventClientX = eVent.clientX;
// 		if (reSizes.width >= navPane.parentElement.clientWidth) {
// 			reSizes.height = navPane.offsetHeight;
// 		}
// 	} else if (eVent.target.id === "idSplitterBottom") {
// 		reSizes.height = reSizes.height + (eVent.clientY - client.eventClientY);
// 		client.eventClientY = eVent.clientY;
// 	}
// 	// console.log(`reSizes:`, reSizes);


// 	// (i) исп.при position: absolute
// 	// if (document.documentElement.clientWidth > 501) {
// 	// 	reSizes.navpaneWidth = reSizes.navpaneWidth + (eVent.clientX - client.eventClientX);
// 	// 	reSizes.topicpaneLeft = reSizes.topicpaneLeft + (eVent.clientX - client.eventClientX);
// 	// 	reSizes.topicpaneWidth = reSizes.topicpaneWidth - (eVent.clientX - client.eventClientX);
// 	// 	client.eventClientX = eVent.clientX;
// 	// } else if (document.documentElement.clientWidth < 501) {
// 	// 	reSizes.navpaneTop = reSizes.navpaneTop - (eVent.clientY - client.eventClientY);
// 	// 	reSizes.navpaneHeight = reSizes.navpaneHeight + (eVent.clientY - client.eventClientY);
// 	// 	reSizes.topicpaneTop = reSizes.topicpaneTop + (eVent.clientY - client.eventClientY);
// 	// 	reSizes.topicpaneHeight = reSizes.topicpaneHeight - (eVent.clientY - client.eventClientY);
// 	// 	client.eventClientY = eVent.clientY;
// 	// }



// 	// стар.вар.
// 	// eVent.type - onMousemove/onTouchmove
// 	// eVent.target/touch - splitterRight/splitterBottom (?) не понятно почему eVent.target в условии вызывает тормоза
// 	// let toolbarHeight = getValueFullSizeProperty(toolbarPane).height; // получить полноразмерное значение св-ва
// 	// let navpaneStyles = getComputedStyle(navPane, null);
// 	// let topicpaneStyles = getComputedStyle(topicPane, null);
// 	// if (eVent.type === "touchmove") {
// 	// 	if (document.documentElement.clientWidth > 501) {
// 	// 		reSizes.navpaneWidth = reSizes.navpaneWidth + (eVent.touches[0].clientX - client.touchClientX);
// 	// 		reSizes.topicpaneLeft = reSizes.topicpaneLeft + (eVent.touches[0].clientX - client.touchClientX);
// 	// 		reSizes.topicpaneWidth = reSizes.topicpaneWidth - (eVent.touches[0].clientX - client.touchClientX);
// 	// 		client.touchClientX = eVent.touches[0].clientX;
// 	// 	} else if (document.documentElement.clientWidth < 501) {
// 	// 		reSizes.navpaneTop = reSizes.navpaneTop - (eVent.touches[0].clientY - client.touchClientY);
// 	// 		reSizes.navpaneHeight = reSizes.navpaneHeight + (eVent.touches[0].clientY - client.touchClientY);
// 	// 		reSizes.topicpaneTop = reSizes.topicpaneTop + (eVent.touches[0].clientY - client.touchClientY);
// 	// 		reSizes.topicpaneHeight = reSizes.topicpaneHeight - (eVent.touches[0].clientY - client.touchClientY);
// 	// 		client.touchClientY = eVent.touches[0].clientY;
// 	// 	}
// 	// } else if (eVent.type === "mousemove") {
// 	// 	if (document.documentElement.clientWidth > 501) {
// 	// 		reSizes.navpaneWidth = reSizes.navpaneWidth + (eVent.clientX - client.eventClientX);
// 	// 		reSizes.topicpaneLeft = reSizes.topicpaneLeft + (eVent.clientX - client.eventClientX);
// 	// 		reSizes.topicpaneWidth = reSizes.topicpaneWidth - (eVent.clientX - client.eventClientX);
// 	// 		client.eventClientX = eVent.clientX;
// 	// 		// стар.вар.
// 	// 		// reSizes.navpaneWidth = (eVent.clientX + splitterRight.offsetWidth.width - parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.paddingRight, 10)) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.marginLeft, 10);
// 	// 		// reSizes.topicpaneLeft = eVent.clientX + parseInt(navpaneStyles.marginRight, 10);
// 	// 		// reSizes.topicpaneWidth = document.body.offsetWidth - (eVent.clientX + parseInt(navpaneStyles.marginRight, 10));
// 	// 	} else if (document.documentElement.clientWidth < 501) {
// 	// 		reSizes.navpaneTop = reSizes.navpaneTop - (eVent.clientY - client.eventClientY);
// 	// 		reSizes.navpaneHeight = reSizes.navpaneHeight + (eVent.clientY - client.eventClientY);
// 	// 		reSizes.topicpaneTop = reSizes.topicpaneTop + (eVent.clientY - client.eventClientY);
// 	// 		reSizes.topicpaneHeight = reSizes.topicpaneHeight - (eVent.clientY - client.eventClientY);
// 	// 		client.eventClientY = eVent.clientY;
// 	// 		// стар.вар.
// 	// 		// if (getBrowser().toString().toLowerCase() === "firefox") {
// 	// 		// 	// (i) выс.относительно пан.инстр., НО на самом деле при position: relative выс.= 0
// 	// 		// 	reSizes.navpaneTop = (eVent.clientY + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10)) - ((eVent.clientY + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10)) - banner.offsetHeight - toolbarHeight) + parseInt(navpaneStyles.marginTop, 10);
// 	// 		// 	// *немного завышаем, чтобы в Mozilla Firefox была хоть какая то возможность тащить сплиттер вверх
// 	// 		// 	reSizes.navpaneHeight = eVent.clientY - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10) - banner.offsetHeight - toolbarHeight;
// 	// 		// 	reSizes.topicpaneTop = eVent.clientY + parseInt(navpaneStyles.marginBottom, 10) + parseInt(topicpaneStyles.marginTop, 10);
// 	// 		// 	// *немного завышаем, чтобы в Mozilla Firefox была хоть какая то возможность тащить сплиттер вверх
// 	// 		// 	reSizes.topicpaneHeight = document.body.offsetHeight - (eVent.clientY - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.borderBottom, 10)) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10) - parseInt(topicpaneStyles.paddingTop, 10) - parseInt(topicpaneStyles.paddingBottom, 10) - parseInt(topicpaneStyles.borderTop, 10) - parseInt(topicpaneStyles.borderBottom, 10) - parseInt(topicpaneStyles.marginTop, 10) - parseInt(topicpaneStyles.marginBottom, 10);
// 	// 		// } else {
// 	// 		// 	// (i) выс.относительно пан.инстр., НО на самом деле при position: relative выс.= 0
// 	// 		// 	reSizes.navpaneTop = (eVent.clientY + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10)) - ((eVent.clientY + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10)) - banner.offsetHeight - toolbarHeight) + parseInt(navpaneStyles.marginTop, 10);
// 	// 		// 	reSizes.navpaneHeight = (eVent.clientY + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10)) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10) - banner.offsetHeight - toolbarHeight;
// 	// 		// 	reSizes.topicpaneTop = eVent.clientY + parseInt(navpaneStyles.marginBottom, 10) + parseInt(topicpaneStyles.marginTop, 10);

// 	// 		// 	reSizes.topicpaneHeight = document.body.offsetHeight - (eVent.clientY + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10)) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(topicpaneStyles.paddingTop, 10) - parseInt(topicpaneStyles.paddingBottom, 10) - parseInt(topicpaneStyles.borderTop, 10) - parseInt(topicpaneStyles.borderBottom, 10) - parseInt(topicpaneStyles.marginTop, 10) - parseInt(topicpaneStyles.marginBottom, 10);
// 	// 		// }
// 	// 	}
// 	// }
// }
// // (!) setSizes - установить значения и обновить глобальную переменную reSizes
// // function setSizes(eVent) {
// // 	// 'eVent.type - onMouseup
// // 	// 'eVent.target - splitterRight/splitterBottom
// // 	let toolbarHeight = getValueFullSizeProperty(toolbarPane).height; // - получить полноразмерное значение св-ва
// // 	let navpaneStyles = getComputedStyle(navPane, null);
// // 	let topicpaneStyles = getComputedStyle(topicPane, null);
// // 	// *проверяем внутренний размер окна без полос прокрутки
// // 	if (document.documentElement.clientWidth > 501) { // (i) изменение структуры сайта при медиа запросе 500, см.правила: .nav-pane/.topic-pane в styles.css
// // 		if (reSizes.navpaneWidth < reSizes.navpaneMinWidth) {
// // 			navPane.style.removeProperty('width'); // удаляем css св-во
// // 			topicPane.style.removeProperty('left'); // удаляем css св-во
// // 			// *частично обновляем значения по ширине в глобальной переменной reSizes
// // 			reSizes.navpaneWidth = reSizes.navpaneMinWidth;
// // 			reSizes.topicpaneLeft = reSizes.navpaneWidth + parseInt(navpaneStyles.paddingLeft, 10) + parseInt(navpaneStyles.paddingRight, 10) + parseInt(navpaneStyles.borderLeft, 10) + parseInt(navpaneStyles.borderRight, 10) + parseInt(navpaneStyles.marginRight, 10); // = 304px
// // 			reSizes.topicpaneWidth = document.body.offsetWidth - reSizes.topicpaneLeft;
// // 		} else if (reSizes.topicpaneWidth < reSizes.topicpaneMinWidth) {
// // 			reSizes.topicpaneWidth = reSizes.topicpaneMinWidth;
// // 			reSizes.topicpaneLeft = document.body.offsetWidth - reSizes.topicpaneWidth;
// // 			reSizes.navpaneWidth = reSizes.topicpaneLeft - parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.marginLeft, 10);
// // 			navPane.style.width = reSizes.navpaneWidth + "px";
// // 			topicPane.style.left = reSizes.topicpaneLeft + "px";
// // 		} else {
// // 			navPane.style.width = reSizes.navpaneWidth + "px";
// // 			topicPane.style.left = reSizes.topicpaneLeft + "px";
// // 		}
// // 	} else if (document.documentElement.clientWidth < 501) { // (i) изменение структуры сайта при медиа запросе 500, см.правила: .nav-pane/.topic-pane в styles.css
// // 		// *частично обновляем значения по высоте в глобальной переменной reSizes
// // 		reSizes.navpaneTop = banner.offsetHeight + toolbarHeight - parseInt(navpaneStyles.marginTop, 10);
// // 		navPane.style.top = reSizes.navpaneTop + "px";
// // 		if (reSizes.navpaneHeight < 300) {
// // 			if (reSizes.navpaneHeight < parseInt(navpaneStyles.minHeight, 10)) { // - "притягиваем" пан.топика к пан.инструментов
// // 				navPane.style.minHeight = 0; // - отменяем минимальную высоту по умолчанию в styles.css
// // 				reSizes.navpaneHeight = 0;
// // 				// reSizes.topicpaneTop = banner.offsetHeight - toolbarHeight - reSizes.navpaneHeight - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.borderBottom, 10) + parseInt(navpaneStyles.marginTop, 10) + parseInt(navpaneStyles.marginBottom, 10) + parseInt(topicpaneStyles.marginTop, 10); // только здесь // = 114px
// // 			} else {
// // 				navPane.style.removeProperty('min-height');
// // 				reSizes.navpaneHeight = reSizes.navpaneMinWidth;
// // 			}
// // 			reSizes.topicpaneTop = banner.offsetHeight + toolbarHeight + reSizes.navpaneHeight + parseInt(navpaneStyles.paddingTop, 10) + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderTop, 10) + parseInt(navpaneStyles.borderBottom, 10); // для обоих вариантов // = 408px
// // 			reSizes.topicpaneHeight = document.body.offsetHeight - reSizes.topicpaneTop - parseInt(topicpaneStyles.marginTop, 10); // = 525px

// // 			navPane.style.height = reSizes.navpaneHeight + "px";
// // 			topicPane.style.top = reSizes.topicpaneTop + "px";

// // 		} else if (reSizes.topicpaneHeight < 300) {
// // 			navPane.style.removeProperty('min-height');
// // 			if (reSizes.topicpaneHeight < parseInt(topicpaneStyles.minHeight, 10)) { // - "притягиваем" пан.нав.к низу
// // 				reSizes.topicpaneHeight = parseInt(topicpaneStyles.minHeight, 10);
// // 				reSizes.navpaneHeight = document.body.offsetHeight - banner.offsetHeight - toolbarHeight - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.borderBottom, 10); // = 819px
// // 				reSizes.topicpaneTop = banner.offsetHeight + toolbarHeight + reSizes.navpaneHeight + parseInt(navpaneStyles.paddingTop, 10) + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderTop, 10) + parseInt(navpaneStyles.borderBottom, 10); // = 927px, а не 931px // x parseInt(topicpaneStyles.marginTop, 10)
// // 			} else {
// // 				reSizes.topicpaneHeight = 250;
// // 				reSizes.topicpaneTop = document.body.offsetHeight - reSizes.topicpaneHeight - parseInt(topicpaneStyles.marginTop, 10); // = 683px
// // 				reSizes.navpaneHeight = reSizes.topicpaneTop - banner.offsetHeight - toolbarHeight - parseInt(navpaneStyles.marginTop, 10) + parseInt(navpaneStyles.marginBottom, 10) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.borderBottom, 10); // = 569px
// // 			}
// // 			navPane.style.height = reSizes.navpaneHeight + "px";
// // 			topicPane.style.top = reSizes.topicpaneTop + "px";
// // 		} else {
// // 			navPane.style.removeProperty('min-height');
// // 			// (i) reSizes.navpaneHeight определится ф.getSizes()
// // 			// reSizes.topicpaneTop = toolbarHeight + reSizes.navpaneHeight + parseInt(navpaneStyles.paddingTop, 10) + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderTop, 10) + parseInt(navpaneStyles.borderBottom, 10);
// // 		}
// // 	}
// // }
// function setSizes(eVent) {
// 	// 'eVent.type - mouseup/pointerup
// 	// 'eVent.target - div.idSplitterRight/idSplitterBottom
// 	if (eVent.target.id === "idSplitterRight") {
// 		if (reSizes.width < reSizes.minWidth) { // -отпружиниваем на 25vw по умолчанию в.css правиле
// 			// navPane.style.removeProperty('width'); // удаляем css св-во
// 			navPane.removeAttribute('style');
// 			// reSizes.width = navPane.offsetWidth;
// 		} else {
// 			if (reSizes.width >= navPane.parentElement.clientWidth) {
// 				navPane.style.height = ((reSizes.height / document.documentElement.clientHeight) * 100) + "vh";
// 			} else {
// 				navPane.style.width = ((reSizes.width / document.documentElement.clientWidth) * 100) + "vw";
// 			}
// 		}
// 	} else if (eVent.target.id === "idSplitterBottom") {
// 		if (reSizes.height < reSizes.minReset) {
// 			if (reSizes.height < reSizes.minHeight) { // - сворачиваем нав.пан.
// 				// *проверяем внутренний размер окна без полос прокрутки
// 				if (document.documentElement.clientWidth > 500) { // (i) изменение структуры сайта при медиа запросе 500, см.правила: .nav-pane/.topic-pane в styles.css
// 					// navPane.style.removeProperty('height'); // удаляем css св-во
// 					navPane.removeAttribute('style');
// 				} else if (document.documentElement.clientWidth < 501) { // (i) изменение структуры сайта при медиа запросе 500, см.правила: .nav-pane/.topic-pane в styles.css
// 					navPane.style.height = "auto";
// 					reSizes.height = navPane.offsetHeight;
// 				}
// 			} else { // -отпружиниваем на 250
// 				navPane.style.height = ((reSizes.minReset / document.documentElement.clientHeight) * 100) + "vh";
// 			}
// 		} else {
// 			if (reSizes.height >= navPane.parentElement.offsetHeight) {
// 				navPane.style.height = "100%";
// 			} else {
// 				navPane.style.height = ((reSizes.height / document.documentElement.clientHeight) * 100) + "vh";
// 			}
// 		}
// 	}
// 	// console.log(`reSizes:`, reSizes);
// 	// console.log(document.documentElement.clientWidth);



// 	// let navpaneStyles = getComputedStyle(navPane, null);
// 	// let topicpaneStyles = getComputedStyle(topicPane, null);
// 	// // *проверяем внутренний размер окна без полос прокрутки
// 	// if (document.documentElement.clientWidth > 501) { // (i) изменение структуры сайта при медиа запросе 500, см.правила: .nav-pane/.topic-pane в styles.css
// 	// 	if (eVent.target.id === "idSplitterRight") {
// 	// 		if (reSizes.width < reSizes.minWidth) { // -отпружиниваем на 25vw по умолчанию в.css правиле
// 	// 			navPane.style.removeProperty('width'); // удаляем css св-во
// 	// 		} else {
// 	// 			if ((navPane.offsetWidth + parseInt(getComputedStyle(navPane, null).marginRight, 10)) >= navPane.parentElement.clientWidth) {
// 	// 				reSizes.width = navPane.parentElement.clientWidth - parseInt(getComputedStyle(navPane, null).marginRight, 10);
// 	// 			} else {
// 	// 				navPane.style.width = ((reSizes.width / document.documentElement.clientWidth) * 100) + "vw";
// 	// 			}
// 	// 		}
// 	// 	} else if (eVent.target.id === "idSplitterBottom") {
// 	// 		if (reSizes.height < reSizes.minHeight) { // - сворачиваем нав.пан.
// 	// 			reSizes.height = 0;
// 	// 			navPane.style.height = 0;
// 	// 		} else {
// 	// 			if (reSizes.height < 300) { // -отпружиниваем на 35vh по умолчанию в.css правиле
// 	// 				navPane.style.removeProperty('height'); // удаляем css св-во
// 	// 			} else {
// 	// 				if (reSizes.height >= navPane.parentElement.offsetHeight) {
// 	// 					navPane.style.height = "100%";
// 	// 					topicPane.style.display = "none";
// 	// 				} else {
// 	// 					navPane.style.height = ((reSizes.height / document.documentElement.clientHeight) * 100) + "vh";
// 	// 				}
// 	// 			}
// 	// 		}
// 	// 	}
// 	// } else if (document.documentElement.clientWidth < 501) { // (i) изменение структуры сайта при медиа запросе 500, см.правила: .nav-pane/.topic-pane в styles.css
// 	// 	if (reSizes.height < reSizes.minHeight) { // - сворачиваем нав.пан.
// 	// 		reSizes.height = 0;
// 	// 		navPane.style.height = 0;
// 	// 	} else {
// 	// 		if (reSizes.height < 300) { // -отпружиниваем на 35vh по умолчанию в.css правиле
// 	// 			navPane.style.removeProperty('height'); // удаляем css св-во
// 	// 		} else {
// 	// 			if (reSizes.height >= navPane.parentElement.offsetHeight) {
// 	// 				navPane.style.height = "100%";
// 	// 				topicPane.style.display = "none";
// 	// 			} else {
// 	// 				navPane.style.height = ((reSizes.height / document.documentElement.clientHeight) * 100) + "vh";
// 	// 			}
// 	// 		}
// 	// 	}




// 		// if (reSizes.height < reSizes.limitHeight) { // - для нав.пан.ограничение для эфф.пружины - возврата к общей минимальной высоте
// 		// 	if (reSizes.height > reSizes.minHeight) { // - "притягиваем" пан.топика к пан.инстр., вытесняя пан.нав.за пределы окна брауера
// 		// 		reSizes.height = reSizes.limitHeight; // - срабатывает пружина
// 		// 	}
// 		// 	// if (reSizes.height < reSizes.minHeight) { // - "притягиваем" пан.топика к пан.инстр., вытесняя пан.нав.за пределы окна брауера
// 		// 	// 	navPane.style.minHeight = 0;
// 		// 	// 	reSizes.height = 0;
// 		// 	// } else { // - срабатывает пружина
// 		// 	// 	// navPane.style.removeProperty('min-height');
// 		// 	// 	reSizes.height = reSizes.minHeightTotal;
// 		// 	// }
// 		// 	// reSizes.topicpaneHeight = document.body.offsetHeight - (reSizes.navpaneHeight + parseInt(navpaneStyles.paddingTop, 10) + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderTop, 10) + parseInt(navpaneStyles.borderBottom, 10)) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10) - parseInt(topicpaneStyles.paddingTop, 10) - parseInt(topicpaneStyles.paddingBottom, 10) - parseInt(topicpaneStyles.borderTop, 10) - parseInt(topicpaneStyles.borderBottom, 10) - parseInt(topicpaneStyles.marginTop, 10) - parseInt(topicpaneStyles.marginBottom, 10);

// 		// 	navPane.style.height = reSizes.height + "px";
// 		// 	// topicPane.style.height = reSizes.topicpaneHeight + "px";

// 		// } else { // - для топик пан.ограничение для эфф.пружины - возврата к общей минимальной высоте
// 		// 	// if (reSizes.topicpaneHeight < reSizes.topicpaneMinHeight) { // - "притягиваем" пан.нав.к низу, вытесняя пан.топика за пределы окна брауера
// 		// 	// 	topicPane.style.minHeight = 0;
// 		// 	// 	reSizes.topicpaneHeight = 0;
// 		// 	// } else { // - срабатывает пружина
// 		// 	// 	// topicPane.style.removeProperty('min-height');
// 		// 	// 	reSizes.topicpaneHeight = reSizes.totalMinHeight;
// 		// 	// }
// 		// 	// reSizes.navpaneHeight = document.body.offsetHeight - (reSizes.topicpaneHeight + parseInt(topicpaneStyles.paddingTop, 10) + parseInt(topicpaneStyles.paddingBottom, 10) + parseInt(topicpaneStyles.borderTop, 10) + parseInt(topicpaneStyles.borderBottom, 10)) - parseInt(topicpaneStyles.marginTop, 10) - parseInt(topicpaneStyles.marginBottom, 10) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.borderBottom, 10) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10);
// 		// 	// // reSizes.topicpaneTop = document.body.offsetHeight - reSizes.topicpaneHeight - parseInt(topicpaneStyles.marginTop, 10); // оставлено для теста

// 		// 	navPane.style.height = reSizes.height + "px";
// 		// 	// topicPane.style.height = reSizes.topicpaneHeight + "px";
// 		// }
// 		// // else {
// 		// // 	// navPane.style.removeProperty('min-height');
// 		// // 	// topicPane.style.removeProperty('min-height');
// 		// // }
// 	// }



// 	// (i) исп.при position: absolute
// 	// let toolbarHeight = getValueFullSizeProperty(toolbarPane).height; // получить полноразмерное значение св-ва
// 	// let navpaneStyles = getComputedStyle(navPane, null);
// 	// let topicpaneStyles = getComputedStyle(topicPane, null);
// 	// // *проверяем внутренний размер окна без полос прокрутки
// 	// if (document.documentElement.clientWidth > 501) { // (i) изменение структуры сайта при медиа запросе 500, см.правила: .nav-pane/.topic-pane в styles.css
// 	// 	if (reSizes.navpaneWidth < reSizes.navpaneMinWidth) {
// 	// 		navPane.style.removeProperty('width'); // удаляем css св-во
// 	// 		topicPane.style.removeProperty('left'); // удаляем css св-во
// 	// 		// *частично обновляем значения по ширине в глобальной переменной reSizes
// 	// 		reSizes.navpaneWidth = reSizes.navpaneMinWidth; // 294
// 	// 		if (navpaneStyles.boxSizing === "border-box") {
// 	// 			reSizes.topicpaneLeft = reSizes.navpaneMinWidth + parseInt(navpaneStyles.marginRight, 10); // = 304px
// 	// 		} else {
// 	// 			reSizes.topicpaneLeft = reSizes.navpaneMinWidth + parseInt(navpaneStyles.paddingLeft, 10) + parseInt(navpaneStyles.paddingRight, 10) + parseInt(navpaneStyles.borderLeft, 10) + parseInt(navpaneStyles.borderRight, 10) + parseInt(navpaneStyles.marginRight, 10); // = 304px
// 	// 		}
// 	// 		reSizes.topicpaneWidth = document.body.offsetWidth - reSizes.topicpaneLeft;
// 	// 	} else if (reSizes.topicpaneWidth < reSizes.topicpaneMinWidth) {
// 	// 		reSizes.topicpaneWidth = reSizes.topicpaneMinWidth; // 500
// 	// 		reSizes.topicpaneLeft = document.body.offsetWidth - reSizes.topicpaneMinWidth;
// 	// 		if (navpaneStyles.boxSizing === "border-box") {
// 	// 			reSizes.navpaneWidth = reSizes.topicpaneLeft - parseInt(navpaneStyles.marginRight, 10);
// 	// 		} else {
// 	// 			reSizes.navpaneWidth = reSizes.topicpaneLeft - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.marginRight, 10);
// 	// 		}
// 	// 		navPane.style.width = reSizes.navpaneWidth + "px";
// 	// 		topicPane.style.left = reSizes.topicpaneLeft + "px";
// 	// 	}
// 	// 	// x *else {
// 	// 	// 	navPane.style.width = reSizes.navpaneWidth + "px";
// 	// 	// 	topicPane.style.left = reSizes.topicpaneLeft + "px";
// 	// 	// }
// 	// } else if (document.documentElement.clientWidth < 501) { // (i) изменение структуры сайта при медиа запросе 500, см.правила: .nav-pane/.topic-pane в styles.css
// 	// 	// *частично обновляем значения по высоте в глобальной переменной reSizes
// 	// 	if (reSizes.navpaneHeight < reSizes.totalMinHeight) { // - ограничение для эфф.пружины - возврата к общей минимальной высоте
// 	// 		if (reSizes.navpaneHeight < reSizes.navpaneMinHeight) { // - "притягиваем" пан.топика к пан.инстр., вытесняя пан.нав.за пределы окна брауера
// 	// 			navPane.style.minHeight = 0;
// 	// 			reSizes.navpaneHeight = 0;
// 	// 		} else { // - срабатывает пружина
// 	// 			navPane.style.removeProperty('min-height');
// 	// 			reSizes.navpaneHeight = reSizes.totalMinHeight;
// 	// 		}
// 	// 		// reSizes.topicpaneTop = banner.offsetHeight + toolbarHeight + reSizes.navpaneHeight + parseInt(navpaneStyles.paddingTop, 10) + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderTop, 10) + parseInt(navpaneStyles.borderBottom, 10) + parseInt(navpaneStyles.marginTop, 10) + parseInt(navpaneStyles.marginBottom, 10) + parseInt(topicpaneStyles.marginTop, 10); // оставлено для теста
// 	// 		reSizes.topicpaneHeight = document.body.offsetHeight - banner.offsetHeight - toolbarHeight - (reSizes.navpaneHeight + parseInt(navpaneStyles.paddingTop, 10) + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderTop, 10) + parseInt(navpaneStyles.borderBottom, 10)) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10) - parseInt(topicpaneStyles.paddingTop, 10) - parseInt(topicpaneStyles.paddingBottom, 10) - parseInt(topicpaneStyles.borderTop, 10) - parseInt(topicpaneStyles.borderBottom, 10) - parseInt(topicpaneStyles.marginTop, 10) - parseInt(topicpaneStyles.marginBottom, 10);

// 	// 		navPane.style.height = reSizes.navpaneHeight + "px";
// 	// 		topicPane.style.height = reSizes.topicpaneHeight + "px";

// 	// 	} else if (reSizes.topicpaneHeight < reSizes.totalMinHeight) { // - ограничение для эфф.пружины - возврата к общей минимальной высоте
// 	// 		if (reSizes.topicpaneHeight < reSizes.topicpaneMinHeight) { // - "притягиваем" пан.нав.к низу, вытесняя пан.топика за пределы окна брауера
// 	// 			topicPane.style.minHeight = 0;
// 	// 			reSizes.topicpaneHeight = 0;
// 	// 		} else { // - срабатывает пружина
// 	// 			topicPane.style.removeProperty('min-height');
// 	// 			reSizes.topicpaneHeight = reSizes.totalMinHeight;
// 	// 		}
// 	// 		reSizes.navpaneHeight = document.body.offsetHeight - banner.offsetHeight - toolbarHeight - (reSizes.topicpaneHeight + parseInt(topicpaneStyles.paddingTop, 10) + parseInt(topicpaneStyles.paddingBottom, 10) + parseInt(topicpaneStyles.borderTop, 10) + parseInt(topicpaneStyles.borderBottom, 10)) - parseInt(topicpaneStyles.marginTop, 10) - parseInt(topicpaneStyles.marginBottom, 10) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.borderBottom, 10) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10);
// 	// 		// reSizes.topicpaneTop = document.body.offsetHeight - reSizes.topicpaneHeight - parseInt(topicpaneStyles.marginTop, 10); // оставлено для теста

// 	// 		navPane.style.height = reSizes.navpaneHeight + "px";
// 	// 		topicPane.style.height = reSizes.topicpaneHeight + "px";
// 	// 	} else {
// 	// 		navPane.style.removeProperty('min-height');
// 	// 		topicPane.style.removeProperty('min-height');
// 	// 	}
// 	// }
// }



// // (!) putSizes - установить размеры в глобальную переменную reSizes
// // x не используется
// // function putSizes() {
// // 	let navpaneStyles = getComputedStyle(navPane, null);
// // 	let topicpaneStyles = getComputedStyle(topicPane, null);

// // 	console.log(`1) function putSizes()\n reSizes: ${JSON.stringify(reSizes, null, 1)}`); // x -

// // 	if (document.documentElement.clientWidth > 501) {
// // 		if (navPane.style.display === "none") { // нав.пан.скрыта
// // 			navPane.style.removeProperty('display'); // для получения св-тв элемента, (!) НО может не успевать
// // 			reSizes.navpaneTop = parseInt(navpaneStyles.top, 10);
// // 			reSizes.navpaneWidth = parseInt(navpaneStyles.width, 10);
// // 			navPane.style.display = "none";
// // 		} else {
// // 			reSizes.navpaneTop = parseInt(navpaneStyles.top, 10);
// // 			reSizes.navpaneWidth = parseInt(navpaneStyles.width, 10);
// // 		}
// // 		reSizes.topicpaneLeft = parseInt(topicpaneStyles.left, 10);
// // 		reSizes.topicpaneTop = parseInt(topicpaneStyles.top, 10);
// // 		reSizes.topicpaneWidth = parseInt(topicpaneStyles.width, 10);
// // 	} else if (document.documentElement.clientWidth < 501) {
// // 		if (navPane.style.display === "none") { // нав.пан.скрыта
// // 			navPane.style.removeProperty('display'); // для получения св-тв элемента, (!) НО может не успевать
// // 			reSizes.navpaneHeight = parseInt(navpaneStyles.height, 10);
// // 			navPane.style.display = "none";
// // 			reSizes.topicpaneHeight = parseInt(topicpaneStyles.height, 10);
// // 		} else {
// // 			if (parseInt(navpaneStyles.height, 10) > 0) {
// // 				reSizes.navpaneHeight = parseInt(navpaneStyles.height, 10);
// // 			}
// // 			if (parseInt(topicpaneStyles.height, 10) > 0) {
// // 				reSizes.topicpaneHeight = parseInt(topicpaneStyles.height, 10);
// // 			}
// // 		}
// // 	}
// // 	console.log(`2) function putSizes()\n reSizes: ${JSON.stringify(reSizes, null, 1)}`); // x -
// // }
// // (!) изменение размера панелей
// function reSizePanels(eVent) {
// 	// console.log(`function reSizePanels(eVent: ${eVent.type})`);

// 	// 'eVent.type - onResize
// 	// 'eVent.target - window
// 	// if (navPane === null || typeof(navPane) === "undefined" && typeof(navPane) !== "object" || navPane !== Object(navPane)) {
// 	// 	console.error(`(!) Косяк: не удалось установить позиционирование панелей - переменная не определена или значение переменной не соответствует условию(-ям) проверки:\n function reSizePanels ():\n 1) navPane: Object(${Object(navPane)}) / typeof(${typeof(navPane)}) / ${navPane}\n 2) topicPane: Object(${Object(topicPane)}) / typeof(${typeof(topicPane)}) / ${topicPane}`);
// 	// 	alert(`(!) Косяк: не удалось установить позиционирование панелей - переменная не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
// 	// 	return;
// 	// }
// 	// if (topicPane === null || typeof(topicPane) === "undefined" || typeof(topicPane) !== "object" || topicPane !== Object(topicPane)) {
// 	// 	console.error(`(!) Косяк: не удалось установить позиционирование панелей - переменная не определена или значение переменной не соответствует условию(-ям) проверки:\n function reSizePanels ():\n 1) navPane: Object(${Object(navPane)}) / typeof(${typeof(navPane)}) / ${navPane}\n 2) topicPane: Object(${Object(topicPane)}) / typeof(${typeof(topicPane)}) / ${topicPane}`);
// 	// 	alert(`(!) Косяк: не удалось установить позиционирование панелей - переменная не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
// 	// 	return;
// 	// }


// 	// порог
// 	// console.log(document.documentElement.clientWidth >= 500 && document.documentElement.clientWidth < 501);


// 	// if (document.documentElement.clientWidth > 500) {
// 	// 	if (navPane.style.display === "none") {
// 	// 		reSizes.height = parseInt(getComputedStyle(navPane, null).height, 10);
// 	// 	} else {
// 	// 		reSizes.height = navPane.offsetHeight;
// 	// 	}
// 	// 	navPane.style.removeProperty('height');
// 	// 	navPane.style.width = Math.round((reSizes.width / document.documentElement.clientWidth) * 100) + "vw";
// 	// } else if (document.documentElement.clientWidth < 501) {
// 	// 	if (navPane.style.display === "none") {
// 	// 		reSizes.width = parseInt(getComputedStyle(navPane, null).width, 10);
// 	// 	} else {
// 	// 		reSizes.width = navPane.offsetWidth;
// 	// 	}
// 	// 	navPane.style.removeProperty('width');
// 	// 	navPane.style.height = Math.round((reSizes.height / document.documentElement.clientHeight) * 100) + "vh";
// 	// }



// 	// (i) исп.при position: absolute
// 	// // (!) нужно учесть, что когда нав.пан.скрывается (.style.display:"none"), то getComputedStyle образует ошибку, следовательно в этом случае должна быть альтернатива для получения св-тв элемента
// 	// // let toolbarHeight = getValueFullSizeProperty(toolbarPane).height; // получить полноразмерное значение св-ва
// 	// let navpaneStyles = getComputedStyle(navPane, null);
// 	// let topicpaneStyles = getComputedStyle(topicPane, null);
// 	// // *проверяем внутренний размер окна без полос прокрутки
// 	// if (document.documentElement.clientWidth > 500) {
// 	// 	navPane.style.removeProperty('top');
// 	// 	topicPane.style.removeProperty('top');
// 	// 	navPane.style.top = null;
// 	// 	topicPane.style.top = null;
// 	// 	navPane.style.removeProperty('height');
// 	// 	topicPane.style.removeProperty('height');
// 	// 	if (banner.style.display === "none") {
// 	// 		navPane.classList.remove('navpane-banner');
// 	// 		topicPane.classList.remove('topicpane-banner');
// 	// 	} else {
// 	// 		navPane.classList.add('navpane-banner');
// 	// 		topicPane.classList.add('topicpane-banner');
// 	// 	}
// 	// 	if (navPane.style.display === "none") { // нав.пан.скрыта
// 	// 		// (!) чтобы не образовывалась ошибка на getComputedStyle
// 	// 		navPane.style.removeProperty('display'); // для получения св-тв элемента, (!) НО может не успевать
// 	// 		navPane.style.left = 0 - (navPane.offsetWidth + parseInt(navpaneStyles.marginRight, 10)) + "px";
// 	// 		if (reSizes.navpaneWidth > reSizes.navpaneMinWidth) { // - применялся splitterRight
// 	// 			if (oldClientWidth > document.documentElement.clientWidth) { // уменьшаем размер окна браузера
// 	// 				if (parseInt(navpaneStyles.width, 10) <= reSizes.navpaneMinWidth) {
// 	// 					navPane.style.removeProperty('width');
// 	// 				} else if (parseInt(topicpaneStyles.width, 10) < reSizes.topicpaneMinWidth) {
// 	// 					if (navpaneStyles.boxSizing === "border-box") {
// 	// 						navPane.style.width = (document.body.offsetWidth - reSizes.topicpaneMinWidth) - parseInt(navpaneStyles.marginLeft, 10) - parseInt(navpaneStyles.marginRight, 10) + "px";
// 	// 					} else {
// 	// 						navPane.style.width = (document.body.offsetWidth - reSizes.topicpaneMinWidth) + parseInt(navpaneStyles.borderLeft, 10) + parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.marginLeft, 10) - parseInt(navpaneStyles.marginRight, 10) + "px";
// 	// 					}
// 	// 				} else { // < 1
// 	// 					if (navpaneStyles.boxSizing === "border-box") {
// 	// 						navPane.style.width = ((parseInt(navpaneStyles.width, 10) - 1) - parseInt(navpaneStyles.marginLeft, 10) - parseInt(navpaneStyles.marginRight, 10)) + "px";
// 	// 					} else {
// 	// 						navPane.style.width = ((parseInt(navpaneStyles.width, 10) - 1) + parseInt(navpaneStyles.paddingLeft, 10) + parseInt(navpaneStyles.paddingRight, 10) + parseInt(navpaneStyles.borderLeft, 10) + parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.marginLeft, 10) - parseInt(navpaneStyles.marginRight, 10)) + "px";
// 	// 					}
// 	// 				}
// 	// 			} else if (oldClientWidth < document.documentElement.clientWidth) { // увеличиваем размер окна браузера
// 	// 				if (parseInt(navpaneStyles.width, 10) > reSizes.navpaneWidth) {
// 	// 					navPane.style.width = reSizes.navpaneWidth + "px";
// 	// 				} else { // > 1
// 	// 					if (navpaneStyles.boxSizing === "border-box") {
// 	// 						navPane.style.width = ((parseInt(navpaneStyles.width, 10) + 1) + parseInt(navpaneStyles.marginLeft, 10) + parseInt(navpaneStyles.marginRight, 10)) + "px";
// 	// 					} else {
// 	// 						navPane.style.width = ((parseInt(navpaneStyles.width, 10) + 1) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.borderRight, 10) + parseInt(navpaneStyles.marginLeft, 10) + parseInt(navpaneStyles.marginRight, 10)) + "px";
// 	// 					}
// 	// 				}
// 	// 			}
// 	// 			oldClientWidth = document.documentElement.clientWidth;
// 	// 		}
// 	// 		navPane.style.display = "none";
// 	// 		topicPane.style.left = 0;
// 	// 	} else { // - нав.пан.раскрыта
// 	// 		navPane.style.removeProperty('left');
// 	// 		if (reSizes.navpaneWidth > reSizes.navpaneMinWidth) { // - применялся splitterRight
// 	// 			if (oldClientWidth > document.documentElement.clientWidth) { // уменьшаем размер окна браузера
// 	// 				if (parseInt(navpaneStyles.width, 10) <= reSizes.navpaneMinWidth) {
// 	// 					navPane.style.removeProperty('width');
// 	// 					topicPane.style.removeProperty('left');
// 	// 				} else if (parseInt(topicpaneStyles.width, 10) < reSizes.topicpaneMinWidth) {
// 	// 					if (navpaneStyles.boxSizing === "border-box") {
// 	// 						navPane.style.width = (document.body.offsetWidth - reSizes.topicpaneMinWidth) - parseInt(navpaneStyles.marginLeft, 10) - parseInt(navpaneStyles.marginRight, 10) + "px";
// 	// 					} else {
// 	// 						navPane.style.width = (document.body.offsetWidth - reSizes.topicpaneMinWidth) + parseInt(navpaneStyles.borderLeft, 10) + parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.marginLeft, 10) - parseInt(navpaneStyles.marginRight, 10) + "px";
// 	// 					}
// 	// 					topicPane.style.left = document.body.offsetWidth - reSizes.topicpaneMinWidth + "px";
// 	// 				} else { // < 1
// 	// 					if (navpaneStyles.boxSizing === "border-box") {
// 	// 						navPane.style.width = ((parseInt(navpaneStyles.width, 10) - 1) - parseInt(navpaneStyles.marginLeft, 10) - parseInt(navpaneStyles.marginRight, 10)) + "px";
// 	// 					} else {
// 	// 						navPane.style.width = ((parseInt(navpaneStyles.width, 10) - 1) + parseInt(navpaneStyles.paddingLeft, 10) + parseInt(navpaneStyles.paddingRight, 10) + parseInt(navpaneStyles.borderLeft, 10) + parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.marginLeft, 10) - parseInt(navpaneStyles.marginRight, 10)) + "px";
// 	// 					}
// 	// 					topicPane.style.left = (document.body.offsetWidth - ((parseInt(topicpaneStyles.width, 10) - 1) + parseInt(navpaneStyles.marginRight, 10))) + "px";
// 	// 				}
// 	// 			} else if (oldClientWidth < document.documentElement.clientWidth) { // увеличиваем размер окна браузера
// 	// 				if (navpaneStyles.boxSizing === "border-box") {
// 	// 					if (parseInt(navpaneStyles.width, 10) > reSizes.navpaneWidth) {
// 	// 						navPane.style.width = reSizes.navpaneWidth + "px";
// 	// 						topicPane.style.left = reSizes.navpaneWidth + parseInt(navpaneStyles.marginLeft, 10) + parseInt(navpaneStyles.marginRight, 10) + "px";
// 	// 					} else { // > 1
// 	// 						navPane.style.width = ((parseInt(navpaneStyles.width, 10) + 1) + parseInt(navpaneStyles.marginLeft, 10) + parseInt(navpaneStyles.marginRight, 10)) + "px";
// 	// 						topicPane.style.left = (document.body.offsetWidth - ((parseInt(topicpaneStyles.width, 10) + 1) - parseInt(navpaneStyles.marginRight, 10))) + "px";
// 	// 					}
// 	// 				} else {
// 	// 					if (parseInt(navpaneStyles.width, 10) > reSizes.navpaneWidth) {
// 	// 						navPane.style.width = reSizes.navpaneWidth + "px";
// 	// 						topicPane.style.left = reSizes.navpaneWidth + parseInt(navpaneStyles.paddingLeft, 10) + parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.borderRight, 10) + parseInt(navpaneStyles.marginLeft, 10) + parseInt(navpaneStyles.marginRight, 10) + "px";
// 	// 					} else { // > 1
// 	// 						navPane.style.width = ((parseInt(navpaneStyles.width, 10) + 1) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.borderRight, 10) + parseInt(navpaneStyles.marginLeft, 10) + parseInt(navpaneStyles.marginRight, 10)) + "px";
// 	// 						topicPane.style.left = (document.body.offsetWidth - ((parseInt(topicpaneStyles.width, 10) + 1) - parseInt(navpaneStyles.marginRight, 10))) + "px";
// 	// 					}
// 	// 				}
// 	// 			}
// 	// 			oldClientWidth = document.documentElement.clientWidth;
// 	// 		}
// 	// 	}
// 	// } else if (document.documentElement.clientWidth < 501) {
// 	// 	navPane.style.removeProperty('left');
// 	// 	navPane.style.removeProperty('width');
// 	// 	topicPane.style.removeProperty('left');
// 	// 	navPane.classList.remove('navpane-banner');
// 	// 	topicPane.classList.remove('topicpane-banner');
// 	// 	if (navPane.style.display === "none") {
// 	// 		navPane.style.removeProperty('display'); // для получения св-тв элемента, (!) НО может не успевать
// 	// 		if (reSizes.navpaneHeight === 0) {
// 	// 			navPane.style.top = (~parseInt(navpaneStyles.height, 10)) + "px";
// 	// 			topicPane.style.removeProperty('height');
// 	// 		} else {
// 	// 			navPane.style.top = (~reSizes.navpaneHeight) + "px";
// 	// 		}
// 	// 		navPane.style.removeProperty('height');
// 	// 		topicPane.style.removeProperty('top');
// 	// 		navPane.style.display = "none";
// 	// 	} else {
// 	// 		navPane.style.removeProperty('top');
// 	// 		topicPane.style.removeProperty('top');
// 	// 		if (reSizes.navpaneHeight === 0) {
// 	// 			navPane.style.removeProperty('height');
// 	// 			topicPane.style.removeProperty('height');
// 	// 		} else { // частично обновляем переменные в reSize
// 	// 			navPane.style.height = reSizes.navpaneHeight + "px";
// 	// 			topicPane.style.height = reSizes.topicpaneHeight + "px";
// 	// 		}
// 	// 	}
// 	// }
// }