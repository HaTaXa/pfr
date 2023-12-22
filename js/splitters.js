// (i) Инициализация переменных
const banner = document.getElementById('idBanner');
const toolbarPane = document.getElementById('idToolbar');
const navPane = document.getElementById('idNavPane');
const topicPane = document.getElementById('idTopicPane');
const splitterRight = document.getElementById('idSplitterRight');
const splitterBottom = document.getElementById('idSplitterBottom');
// '
let unlockResize = false; // флаг, определяющий предотвращение изменения размеров панелей
let oldClientWidth = document.documentElement.clientWidth;
let reSizes = {
	totalMinHeight: 300,
	navpaneInitHeight: parseInt(getComputedStyle(navPane, null).height, 10),
	navpaneMinWidth: 294,
	navpaneMinHeight: 250,
	navpaneWidth: parseInt(getComputedStyle(navPane, null).width, 10),
	navpaneTop: parseInt(getComputedStyle(navPane, null).top, 10),
	navpaneHeight: 0,
	topicpaneMinWidth: 500,
	topicpaneMinHeight: 200,
	topicpaneLeft: parseInt(getComputedStyle(topicPane, null).left, 10),
	topicpaneTop: parseInt(getComputedStyle(topicPane, null).top, 10),
	topicpaneWidth: parseInt(getComputedStyle(topicPane, null).width, 10),
	topicpaneHeight: 0,
};
// '
window.addEventListener('resize', reSizePanels, false); // false - фаза "всплытие"
$(document).ready(function () { // - jq
	// (!) splitterRight
	splitterRight.addEventListener('mousedown', function (e) {
		unlockResize = true;
		// splitterBottom.style.pointerEvents = "none"; // (?) св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие.
		function splitterRight_onMousemove(eVent) {
			if (unlockResize) {
				getSizes(eVent); // - получить размеры в глобальную переменную reSizes
				navPane.style.width = reSizes.navpaneWidth + "px";
				topicPane.style.left = reSizes.topicpaneLeft + "px";
				// (i)*отменяем действия браузера по умолчанию - без этого на локальном ПК событие безумно тормозит при изменении размеров элементов
				eVent.preventDefault(); // если через обработчик addEventListener
				// eVent.stopPropagation();
				// return false; // если через обработчик on<событие>
			}
		}
		document.addEventListener('mousemove', splitterRight_onMousemove, false);
		function splitterRight_onMouseup(eVent) {
			// 'eVent - tagName div splitterRight, но может быть и другим элементом предположительно из-за делегирования через наследование на основе прототипов (.prototype)
			if (unlockResize) {
				unlockResize = false;
				setSizes(eVent); // - установить значения и обновить глобальную переменную reSizes
				// splitterRight.style.pointerEvents = "initial"; // (?) св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие.
				document.removeEventListener('mousemove', splitterRight_onMousemove, false);
				document.removeEventListener('mouseup', splitterRight_onMouseup, false);
			}
		}
		document.addEventListener('mouseup', splitterRight_onMouseup, false);
	}, false); // false - фаза "всплытие"
	// (!) splitterBottom
	splitterBottom.addEventListener('mousedown', function (e) {
		unlockResize = true;
		splitterBottom.classList.add('icon-grab'); // (!) иногда срабатывает инверсионно + не всеми браузерами поддерживается (IE)
		// splitterBottom.style.pointerEvents = "none"; // (?) св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие.
		function splitterBottom_onMousemove(eVent) {
			if (unlockResize) {
				getSizes(eVent); // - получить размеры в глобальную переменную reSizes
				if (parseInt(getComputedStyle(navPane, null).height, 10) > 0) navPane.style.removeProperty('min-height');
				navPane.style.height = reSizes.navpaneHeight + "px";
				topicPane.style.height = reSizes.topicpaneHeight + "px";
				// (i) отменяем действия браузера по умолчанию - без этого на локальном ПК событие безумно тормозит при изменении размеров элементов
				eVent.preventDefault(); // если через обработчик addEventListener
				// eVent.stopPropagation();
				// return false; // если через обработчик on<событие>
			}
		}
		document.addEventListener('mousemove', splitterBottom_onMousemove, false);
		function splitterBottom_onMouseup(eVent) {
			// 'eVent - tagName div splitterBottom, но может быть и другим элементом предположительно из-за делегирования через наследование на основе прототипов (.prototype)
			if (unlockResize) {
				unlockResize = false;
				setSizes(eVent); // - установить значения и обновить глобальную переменную reSizes
				splitterBottom.classList.remove('icon-grab'); // (!) иногда срабатывает инверсионно + не всеми браузерами поддерживается, например IE
				// splitterBottom.style.pointerEvents = "initial"; // (?) св-во позволяет управлять тем, как элементы будут реагировать на события мыши или прикосновения к сенсорному экрану. Применяется для взаимодействия с нижележащими элементами, игнорируя вышележащие.
				document.removeEventListener('mousemove', splitterBottom_onMousemove, false);
				document.removeEventListener('mouseup', splitterBottom_onMouseup, false);
			}
		}
		document.addEventListener('mouseup', splitterBottom_onMouseup, false);
	}, false); // false - фаза "всплытие"
}); // ready end
// (!) getSizes - получить размеры в глобальную переменную reSizes
// (i) вариант, когда панели были display: block
// function getSizes(eVent) {
// 	// 'eVent.type - onMousemove
// 	// 'eVent.target - splitterRight/splitterBottom (?) не понятно почему eVent.target в условии вызывает тормоза
// 	let toolbarHeight = getValueFullSizeProperty(toolbarPane).height; // - получить полноразмерное значение св-ва
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
function getSizes(eVent) {
	// 'eVent.type - onMousemove
	// 'eVent.target - splitterRight/splitterBottom (?) не понятно почему eVent.target в условии вызывает тормоза
	let toolbarHeight = getValueFullSizeProperty(toolbarPane).height; // - получить полноразмерное значение св-ва
	let navpaneStyles = getComputedStyle(navPane, null);
	let topicpaneStyles = getComputedStyle(topicPane, null);

	if (document.documentElement.clientWidth > 501) {
		reSizes.navpaneWidth = (eVent.clientX + getValueFullSizeProperty(splitterRight).width - parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.paddingRight, 10)) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.marginLeft, 10);
		reSizes.topicpaneLeft = eVent.clientX + parseInt(navpaneStyles.marginRight, 10);
		reSizes.topicpaneWidth = document.body.offsetWidth - (eVent.clientX + parseInt(navpaneStyles.marginRight, 10));
	} else if (document.documentElement.clientWidth < 501) {
		if (browser === "firefox") {
			// (i) выс.относительно пан.инстр., НО на самом деле при position: relative выс.= 0
			reSizes.navpaneTop = (eVent.clientY + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10)) - ((eVent.clientY + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10)) - banner.offsetHeight - toolbarHeight) + parseInt(navpaneStyles.marginTop, 10);
			// *немного завышаем, чтобы в Mozilla Firefox была хоть какая то возможность тащить сплиттер вверх
			reSizes.navpaneHeight = eVent.clientY - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10) - banner.offsetHeight - toolbarHeight;
			reSizes.topicpaneTop = eVent.clientY + parseInt(navpaneStyles.marginBottom, 10) + parseInt(topicpaneStyles.marginTop, 10);
			// *немного завышаем, чтобы в Mozilla Firefox была хоть какая то возможность тащить сплиттер вверх
			reSizes.topicpaneHeight = document.body.offsetHeight - (eVent.clientY - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.borderBottom, 10)) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10) - parseInt(topicpaneStyles.paddingTop, 10) - parseInt(topicpaneStyles.paddingBottom, 10) - parseInt(topicpaneStyles.borderTop, 10) - parseInt(topicpaneStyles.borderBottom, 10) - parseInt(topicpaneStyles.marginTop, 10) - parseInt(topicpaneStyles.marginBottom, 10);
		} else {
			// (i) выс.относительно пан.инстр., НО на самом деле при position: relative выс.= 0
			reSizes.navpaneTop = (eVent.clientY + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10)) - ((eVent.clientY + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10)) - banner.offsetHeight - toolbarHeight) + parseInt(navpaneStyles.marginTop, 10);
			reSizes.navpaneHeight = (eVent.clientY + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10)) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10) - banner.offsetHeight - toolbarHeight;
			reSizes.topicpaneTop = eVent.clientY + parseInt(navpaneStyles.marginBottom, 10) + parseInt(topicpaneStyles.marginTop, 10);

			reSizes.topicpaneHeight = document.body.offsetHeight - (eVent.clientY + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderBottom, 10)) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(topicpaneStyles.paddingTop, 10) - parseInt(topicpaneStyles.paddingBottom, 10) - parseInt(topicpaneStyles.borderTop, 10) - parseInt(topicpaneStyles.borderBottom, 10) - parseInt(topicpaneStyles.marginTop, 10) - parseInt(topicpaneStyles.marginBottom, 10);
		}
	}
}
// (!) setSizes - установить значения и обновить глобальную переменную reSizes
// function setSizes(eVent) {
// 	// 'eVent.type - onMouseup
// 	// 'eVent.target - splitterRight/splitterBottom
// 	let toolbarHeight = getValueFullSizeProperty(toolbarPane).height; // - получить полноразмерное значение св-ва
// 	let navpaneStyles = getComputedStyle(navPane, null);
// 	let topicpaneStyles = getComputedStyle(topicPane, null);
// 	// *проверяем внутренний размер окна без полос прокрутки
// 	if (document.documentElement.clientWidth > 501) { // (i) изменение структуры сайта при медиа запросе 500, см.правила: .nav-pane/.topic-pane в styles.css
// 		if (reSizes.navpaneWidth < reSizes.navpaneMinWidth) {
// 			navPane.style.removeProperty('width'); // удаляем css св-во
// 			topicPane.style.removeProperty('left'); // удаляем css св-во
// 			// *частично обновляем значения по ширине в глобальной переменной reSizes
// 			reSizes.navpaneWidth = reSizes.navpaneMinWidth;
// 			reSizes.topicpaneLeft = reSizes.navpaneWidth + parseInt(navpaneStyles.paddingLeft, 10) + parseInt(navpaneStyles.paddingRight, 10) + parseInt(navpaneStyles.borderLeft, 10) + parseInt(navpaneStyles.borderRight, 10) + parseInt(navpaneStyles.marginRight, 10); // = 304px
// 			reSizes.topicpaneWidth = document.body.offsetWidth - reSizes.topicpaneLeft;
// 		} else if (reSizes.topicpaneWidth < reSizes.topicpaneMinWidth) {
// 			reSizes.topicpaneWidth = reSizes.topicpaneMinWidth;
// 			reSizes.topicpaneLeft = document.body.offsetWidth - reSizes.topicpaneWidth;
// 			reSizes.navpaneWidth = reSizes.topicpaneLeft - parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.marginLeft, 10);
// 			navPane.style.width = reSizes.navpaneWidth + "px";
// 			topicPane.style.left = reSizes.topicpaneLeft + "px";
// 		} else {
// 			navPane.style.width = reSizes.navpaneWidth + "px";
// 			topicPane.style.left = reSizes.topicpaneLeft + "px";
// 		}
// 	} else if (document.documentElement.clientWidth < 501) { // (i) изменение структуры сайта при медиа запросе 500, см.правила: .nav-pane/.topic-pane в styles.css
// 		// *частично обновляем значения по высоте в глобальной переменной reSizes
// 		reSizes.navpaneTop = banner.offsetHeight + toolbarHeight - parseInt(navpaneStyles.marginTop, 10);
// 		navPane.style.top = reSizes.navpaneTop + "px";
// 		if (reSizes.navpaneHeight < 300) {
// 			if (reSizes.navpaneHeight < parseInt(navpaneStyles.minHeight, 10)) { // - "притягиваем" пан.топика к пан.инструментов
// 				navPane.style.minHeight = 0; // - отменяем минимальную высоту по умолчанию в styles.css
// 				reSizes.navpaneHeight = 0;
// 				// reSizes.topicpaneTop = banner.offsetHeight - toolbarHeight - reSizes.navpaneHeight - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.borderBottom, 10) + parseInt(navpaneStyles.marginTop, 10) + parseInt(navpaneStyles.marginBottom, 10) + parseInt(topicpaneStyles.marginTop, 10); // только здесь // = 114px
// 			} else {
// 				navPane.style.removeProperty('min-height');
// 				reSizes.navpaneHeight = reSizes.navpaneMinWidth;
// 			}
// 			reSizes.topicpaneTop = banner.offsetHeight + toolbarHeight + reSizes.navpaneHeight + parseInt(navpaneStyles.paddingTop, 10) + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderTop, 10) + parseInt(navpaneStyles.borderBottom, 10); // для обоих вариантов // = 408px
// 			reSizes.topicpaneHeight = document.body.offsetHeight - reSizes.topicpaneTop - parseInt(topicpaneStyles.marginTop, 10); // = 525px

// 			navPane.style.height = reSizes.navpaneHeight + "px";
// 			topicPane.style.top = reSizes.topicpaneTop + "px";

// 		} else if (reSizes.topicpaneHeight < 300) {
// 			navPane.style.removeProperty('min-height');
// 			if (reSizes.topicpaneHeight < parseInt(topicpaneStyles.minHeight, 10)) { // - "притягиваем" пан.нав.к низу
// 				reSizes.topicpaneHeight = parseInt(topicpaneStyles.minHeight, 10);
// 				reSizes.navpaneHeight = document.body.offsetHeight - banner.offsetHeight - toolbarHeight - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.borderBottom, 10); // = 819px
// 				reSizes.topicpaneTop = banner.offsetHeight + toolbarHeight + reSizes.navpaneHeight + parseInt(navpaneStyles.paddingTop, 10) + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderTop, 10) + parseInt(navpaneStyles.borderBottom, 10); // = 927px, а не 931px // x parseInt(topicpaneStyles.marginTop, 10)
// 			} else {
// 				reSizes.topicpaneHeight = 250;
// 				reSizes.topicpaneTop = document.body.offsetHeight - reSizes.topicpaneHeight - parseInt(topicpaneStyles.marginTop, 10); // = 683px
// 				reSizes.navpaneHeight = reSizes.topicpaneTop - banner.offsetHeight - toolbarHeight - parseInt(navpaneStyles.marginTop, 10) + parseInt(navpaneStyles.marginBottom, 10) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.borderBottom, 10); // = 569px
// 			}
// 			navPane.style.height = reSizes.navpaneHeight + "px";
// 			topicPane.style.top = reSizes.topicpaneTop + "px";
// 		} else {
// 			navPane.style.removeProperty('min-height');
// 			// (i) reSizes.navpaneHeight определится ф.getSizes()
// 			// reSizes.topicpaneTop = toolbarHeight + reSizes.navpaneHeight + parseInt(navpaneStyles.paddingTop, 10) + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderTop, 10) + parseInt(navpaneStyles.borderBottom, 10);
// 		}
// 	}
// }
function setSizes(eVent) {
	// 'eVent.type - onMouseup
	// 'eVent.target - splitterRight/splitterBottom
	let toolbarHeight = getValueFullSizeProperty(toolbarPane).height; // - получить полноразмерное значение св-ва
	let navpaneStyles = getComputedStyle(navPane, null);
	let topicpaneStyles = getComputedStyle(topicPane, null);
	// *проверяем внутренний размер окна без полос прокрутки
	if (document.documentElement.clientWidth > 501) { // (i) изменение структуры сайта при медиа запросе 500, см.правила: .nav-pane/.topic-pane в styles.css
		if (reSizes.navpaneWidth < reSizes.navpaneMinWidth) {
			navPane.style.removeProperty('width'); // удаляем css св-во
			topicPane.style.removeProperty('left'); // удаляем css св-во
			// *частично обновляем значения по ширине в глобальной переменной reSizes
			reSizes.navpaneWidth = reSizes.navpaneMinWidth;
			reSizes.topicpaneLeft = reSizes.navpaneWidth + parseInt(navpaneStyles.paddingLeft, 10) + parseInt(navpaneStyles.paddingRight, 10) + parseInt(navpaneStyles.borderLeft, 10) + parseInt(navpaneStyles.borderRight, 10) + parseInt(navpaneStyles.marginRight, 10); // = 304px
			reSizes.topicpaneWidth = document.body.offsetWidth - reSizes.topicpaneLeft;
		} else if (reSizes.topicpaneWidth < reSizes.topicpaneMinWidth) {
			reSizes.topicpaneWidth = reSizes.topicpaneMinWidth;
			reSizes.topicpaneLeft = document.body.offsetWidth - reSizes.topicpaneWidth;
			reSizes.navpaneWidth = reSizes.topicpaneLeft - parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.marginLeft, 10);
			navPane.style.width = reSizes.navpaneWidth + "px";
			topicPane.style.left = reSizes.topicpaneLeft + "px";
		} else {
			navPane.style.width = reSizes.navpaneWidth + "px";
			topicPane.style.left = reSizes.topicpaneLeft + "px";
		}
	} else if (document.documentElement.clientWidth < 501) { // (i) изменение структуры сайта при медиа запросе 500, см.правила: .nav-pane/.topic-pane в styles.css
		// *частично обновляем значения по высоте в глобальной переменной reSizes
		if (reSizes.navpaneHeight < reSizes.totalMinHeight) { // - ограничение для эффекта резинки - возврата к общей минимальной высоте
			if (reSizes.navpaneHeight < reSizes.navpaneMinHeight) { // - "притягиваем" пан.топика к пан.инстр., вытесняя пан.нав.за пределы окна брауера
				navPane.style.minHeight = 0;
				reSizes.navpaneHeight = 0;
			} else { // - срабатывает резинка
				navPane.style.removeProperty('min-height');
				reSizes.navpaneHeight = reSizes.totalMinHeight;
			}
			// reSizes.topicpaneTop = banner.offsetHeight + toolbarHeight + reSizes.navpaneHeight + parseInt(navpaneStyles.paddingTop, 10) + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderTop, 10) + parseInt(navpaneStyles.borderBottom, 10) + parseInt(navpaneStyles.marginTop, 10) + parseInt(navpaneStyles.marginBottom, 10) + parseInt(topicpaneStyles.marginTop, 10); // оставлено для теста
			reSizes.topicpaneHeight = document.body.offsetHeight - banner.offsetHeight - toolbarHeight - (reSizes.navpaneHeight + parseInt(navpaneStyles.paddingTop, 10) + parseInt(navpaneStyles.paddingBottom, 10) + parseInt(navpaneStyles.borderTop, 10) + parseInt(navpaneStyles.borderBottom, 10)) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10) - parseInt(topicpaneStyles.paddingTop, 10) - parseInt(topicpaneStyles.paddingBottom, 10) - parseInt(topicpaneStyles.borderTop, 10) - parseInt(topicpaneStyles.borderBottom, 10) - parseInt(topicpaneStyles.marginTop, 10) - parseInt(topicpaneStyles.marginBottom, 10);

			navPane.style.height = reSizes.navpaneHeight + "px";
			topicPane.style.height = reSizes.topicpaneHeight + "px";

		} else if (reSizes.topicpaneHeight < reSizes.totalMinHeight) { // - ограничение для эффекта резинки - возврата к общей минимальной высоте
			if (reSizes.topicpaneHeight < reSizes.topicpaneMinHeight) { // - "притягиваем" пан.нав.к низу, вытесняя пан.топика за пределы окна брауера
				topicPane.style.minHeight = 0;
				reSizes.topicpaneHeight = 0;
			} else { // - срабатывает резинка
				topicPane.style.removeProperty('min-height');
				reSizes.topicpaneHeight = reSizes.totalMinHeight;
			}
			reSizes.navpaneHeight = document.body.offsetHeight - banner.offsetHeight - toolbarHeight - (reSizes.topicpaneHeight + parseInt(topicpaneStyles.paddingTop, 10) + parseInt(topicpaneStyles.paddingBottom, 10) + parseInt(topicpaneStyles.borderTop, 10) + parseInt(topicpaneStyles.borderBottom, 10)) - parseInt(topicpaneStyles.marginTop, 10) - parseInt(topicpaneStyles.marginBottom, 10) - parseInt(navpaneStyles.paddingTop, 10) - parseInt(navpaneStyles.paddingBottom, 10) - parseInt(navpaneStyles.borderTop, 10) - parseInt(navpaneStyles.borderBottom, 10) - parseInt(navpaneStyles.marginTop, 10) - parseInt(navpaneStyles.marginBottom, 10);
			// reSizes.topicpaneTop = document.body.offsetHeight - reSizes.topicpaneHeight - parseInt(topicpaneStyles.marginTop, 10); // оставлено для теста

			navPane.style.height = reSizes.navpaneHeight + "px";
			topicPane.style.height = reSizes.topicpaneHeight + "px";
		} else {
			navPane.style.removeProperty('min-height');
			topicPane.style.removeProperty('min-height');
		}
	}
}
// (!) putSizes - установить размеры в глобальную переменную reSizes
// x не используется
// function putSizes() {
// 	let navpaneStyles = getComputedStyle(navPane, null);
// 	let topicpaneStyles = getComputedStyle(topicPane, null);

// 	console.log(`1) function putSizes()\n reSizes: ${JSON.stringify(reSizes, null, 1)}`); // x -

// 	if (document.documentElement.clientWidth > 501) {
// 		if (navPane.style.display === "none") { // нав.пан.скрыта
// 			navPane.style.removeProperty('display'); // для получения св-тв элемента, (!) НО может не успевать
// 			reSizes.navpaneTop = parseInt(navpaneStyles.top, 10);
// 			reSizes.navpaneWidth = parseInt(navpaneStyles.width, 10);
// 			navPane.style.display = "none";
// 		} else {
// 			reSizes.navpaneTop = parseInt(navpaneStyles.top, 10);
// 			reSizes.navpaneWidth = parseInt(navpaneStyles.width, 10);
// 		}
// 		reSizes.topicpaneLeft = parseInt(topicpaneStyles.left, 10);
// 		reSizes.topicpaneTop = parseInt(topicpaneStyles.top, 10);
// 		reSizes.topicpaneWidth = parseInt(topicpaneStyles.width, 10);
// 	} else if (document.documentElement.clientWidth < 501) {
// 		if (navPane.style.display === "none") { // нав.пан.скрыта
// 			navPane.style.removeProperty('display'); // для получения св-тв элемента, (!) НО может не успевать
// 			reSizes.navpaneHeight = parseInt(navpaneStyles.height, 10);
// 			navPane.style.display = "none";
// 			reSizes.topicpaneHeight = parseInt(topicpaneStyles.height, 10);
// 		} else {
// 			if (parseInt(navpaneStyles.height, 10) > 0) {
// 				reSizes.navpaneHeight = parseInt(navpaneStyles.height, 10);
// 			}
// 			if (parseInt(topicpaneStyles.height, 10) > 0) {
// 				reSizes.topicpaneHeight = parseInt(topicpaneStyles.height, 10);
// 			}
// 		}
// 	}
// 	console.log(`2) function putSizes()\n reSizes: ${JSON.stringify(reSizes, null, 1)}`); // x -
// 	// console.log(`agent: ${agent}\n browser: ${browser}`); // x -
// }
// (!) reSizePanels-изменение размера панелей
function reSizePanels(eVent) {
	// 'eVent.type - onResize
	// 'eVent.target - window
	if (navPane === null || typeof(navPane) === "undefined" && typeof(navPane) !== "object" || navPane !== Object(navPane)) {
		console.error(`(!) Косяк: не удалось установить позиционирование панелей - переменная не определена или значение переменной не соответствует условию(-ям) проверки:\n function reSizePanels ():\n 1) navPane: Object(${Object(navPane)}) / typeof(${typeof(navPane)}) / ${navPane}\n 2) topicPane: Object(${Object(topicPane)}) / typeof(${typeof(topicPane)}) / ${topicPane}`);
		alert(`(!) Косяк: не удалось установить позиционирование панелей - переменная не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	if (topicPane === null || typeof(topicPane) === "undefined" || typeof(topicPane) !== "object" || topicPane !== Object(topicPane)) {
		console.error(`(!) Косяк: не удалось установить позиционирование панелей - переменная не определена или значение переменной не соответствует условию(-ям) проверки:\n function reSizePanels ():\n 1) navPane: Object(${Object(navPane)}) / typeof(${typeof(navPane)}) / ${navPane}\n 2) topicPane: Object(${Object(topicPane)}) / typeof(${typeof(topicPane)}) / ${topicPane}`);
		alert(`(!) Косяк: не удалось установить позиционирование панелей - переменная не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	// (!) нужно учесть, что когда нав.пан.скрывается (.style.display:"none"), то getComputedStyle образует ошибку, следовательно в этом случае должна быть альтернатива для получения св-тв элемента
	// let toolbarHeight = getValueFullSizeProperty(toolbarPane).height; // - получить полноразмерное значение св-ва
	let navpaneStyles = getComputedStyle(navPane, null);
	let topicpaneStyles = getComputedStyle(topicPane, null);
	// *проверяем внутренний размер окна без полос прокрутки
	if (document.documentElement.clientWidth > 500) {
		navPane.style.removeProperty('top');
		topicPane.style.removeProperty('top');
		// navPane.style.top = null; // удаляем значение св-ва
		// topicPane.style.top = null; // удаляем значение св-ва
		navPane.style.removeProperty('height');
		topicPane.style.removeProperty('height');
		if (banner.style.display === "none") {
			navPane.classList.remove('nav-pane-banner');
			topicPane.classList.remove('topic-pane-banner');
		} else {
			navPane.classList.add('nav-pane-banner');
			topicPane.classList.add('topic-pane-banner');
		}
		if (navPane.style.display === "none") { // нав.пан.скрыта
			// (!) чтобы не образовывалась ошибка на getComputedStyle
			navPane.style.removeProperty('display'); // для получения св-тв элемента, (!) НО может не успевать
			navPane.style.left = 0 - (navPane.offsetWidth + parseInt(navpaneStyles.marginRight, 10)) + "px";
			if (reSizes.navpaneWidth > reSizes.navpaneMinWidth) { // - применялся splitterRight
				if (oldClientWidth > document.documentElement.clientWidth) { // - уменьшаем размер окна браузера
					if (parseInt(navpaneStyles.width, 10) <= reSizes.navpaneMinWidth) {
						navPane.style.removeProperty('width');
					} else if (parseInt(topicpaneStyles.width, 10) < reSizes.topicpaneMinWidth) {
						navPane.style.width = (document.body.offsetWidth - reSizes.topicpaneMinWidth) + parseInt(navpaneStyles.borderLeft, 10) + parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.marginLeft, 10) - parseInt(navpaneStyles.marginRight, 10) + "px";
					} else { // < 1
						navPane.style.width = ((parseInt(navpaneStyles.width, 10) - 1) + parseInt(navpaneStyles.paddingLeft, 10) + parseInt(navpaneStyles.paddingRight, 10) + parseInt(navpaneStyles.borderLeft, 10) + parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.marginLeft, 10) - parseInt(navpaneStyles.marginRight, 10)) + "px";
					}
				} else if (oldClientWidth < document.documentElement.clientWidth) { // - увеличиваем размер окна браузера
					if (parseInt(navpaneStyles.width, 10) > reSizes.navpaneWidth) {
						navPane.style.width = reSizes.navpaneWidth + "px";
					} else { // > 1
						navPane.style.width = ((parseInt(navpaneStyles.width, 10) + 1) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.borderRight, 10) + parseInt(navpaneStyles.marginLeft, 10) + parseInt(navpaneStyles.marginRight, 10)) + "px";
					}
				}
				oldClientWidth = document.documentElement.clientWidth;
			}
			navPane.style.display = "none";
			topicPane.style.left = 0;
		} else { // - нав.пан.раскрыта
			navPane.style.removeProperty('left');
			if (reSizes.navpaneWidth > reSizes.navpaneMinWidth) { // - применялся splitterRight
				if (oldClientWidth > document.documentElement.clientWidth) { // - уменьшаем размер окна браузера
					if (parseInt(navpaneStyles.width, 10) <= reSizes.navpaneMinWidth) {
						navPane.style.removeProperty('width');
						topicPane.style.removeProperty('left');
					} else if (parseInt(topicpaneStyles.width, 10) < reSizes.topicpaneMinWidth) {
						navPane.style.width = (document.body.offsetWidth - reSizes.topicpaneMinWidth) + parseInt(navpaneStyles.borderLeft, 10) + parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.marginLeft, 10) - parseInt(navpaneStyles.marginRight, 10) + "px";
						topicPane.style.left = document.body.offsetWidth - reSizes.topicpaneMinWidth + "px";
					} else { // < 1
						navPane.style.width = ((parseInt(navpaneStyles.width, 10) - 1) + parseInt(navpaneStyles.paddingLeft, 10) + parseInt(navpaneStyles.paddingRight, 10) + parseInt(navpaneStyles.borderLeft, 10) + parseInt(navpaneStyles.borderRight, 10) - parseInt(navpaneStyles.marginLeft, 10) - parseInt(navpaneStyles.marginRight, 10)) + "px";
						topicPane.style.left = (document.body.offsetWidth - ((parseInt(topicpaneStyles.width, 10) - 1) + parseInt(navpaneStyles.marginRight, 10))) + "px";
					}
				} else if (oldClientWidth < document.documentElement.clientWidth) { // - увеличиваем размер окна браузера
					if (parseInt(navpaneStyles.width, 10) > reSizes.navpaneWidth) {
						navPane.style.width = reSizes.navpaneWidth + "px";
						topicPane.style.left = reSizes.navpaneWidth + parseInt(navpaneStyles.paddingLeft, 10) + parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.borderRight, 10) + parseInt(navpaneStyles.marginLeft, 10) + parseInt(navpaneStyles.marginRight, 10) + "px";
					} else { // > 1
						navPane.style.width = ((parseInt(navpaneStyles.width, 10) + 1) - parseInt(navpaneStyles.paddingLeft, 10) - parseInt(navpaneStyles.paddingRight, 10) - parseInt(navpaneStyles.borderLeft, 10) - parseInt(navpaneStyles.borderRight, 10) + parseInt(navpaneStyles.marginLeft, 10) + parseInt(navpaneStyles.marginRight, 10)) + "px";
						topicPane.style.left = (document.body.offsetWidth - ((parseInt(topicpaneStyles.width, 10) + 1) - parseInt(navpaneStyles.marginRight, 10))) + "px";
					}
				}
				oldClientWidth = document.documentElement.clientWidth;
			}
		}
	} else if (document.documentElement.clientWidth < 501) {
		navPane.style.removeProperty('left');
		navPane.style.removeProperty('width');
		topicPane.style.removeProperty('left');
		navPane.classList.remove('nav-pane-banner');
		topicPane.classList.remove('topic-pane-banner');
		if (navPane.style.display === "none") {
			navPane.style.removeProperty('display'); // для получения св-тв элемента, (!) НО может не успевать
			if (reSizes.navpaneHeight === 0) {
				navPane.style.top = (~parseInt(navpaneStyles.height, 10)) + "px";
				topicPane.style.removeProperty('height');
			} else {
				navPane.style.top = (~reSizes.navpaneHeight) + "px";
			}
			navPane.style.removeProperty('height');
			topicPane.style.removeProperty('top');
			navPane.style.display = "none";
		} else {
			navPane.style.removeProperty('top');
			topicPane.style.removeProperty('top');
			if (reSizes.navpaneHeight === 0) {
				navPane.style.removeProperty('height');
				topicPane.style.removeProperty('height');
			} else { // частично обновляем переменные в reSize
				navPane.style.height = reSizes.navpaneHeight + "px";
				topicPane.style.height = reSizes.topicpaneHeight + "px";
			}
		}
	}
}