// (!) кн.в закладки
function setPermaLinkBookmark(elem) { // доделать // (?)
	let msg;
	// let title = "Закладка";
	// let UA = navigator.userAgent.toLowerCase();
	// let isFF = UA.indexOf('firefox') != -1;
	// let isWebkit = UA.indexOf('webkit') != -1;
	// let isMac = UA.indexOf('mac') != -1;
	// let isIE = UA.indexOf('msie') != -1;

	// let navig = "";
	// for (let property in navigator) {
	// navig += `${property}: ${navigator[property]}\n`;
	// }

	// console.log(`function setPermaLinkBookmark (elem: ${elem.tagName}, ${elem.id}\n navigator.userAgent: ${navigator.userAgent}`); // x -

	// if ((isIE) && window.external) { // IE
	// 	window.external.AddFavorite(elem.value, title);
	// 	msg = true;
	// } else if ((isFF) && window.external) { // Firefox
	// 	window.sidebar.addPanel(title, elem.value, "");
	// 	msg = true;
	// } else if (isMac || isWebkit) { // Webkit (Chrome, Opera), Mac
	// 	msg = false;
	// } else { msg = false; }
	return msg;
}
// (!) кн.скопировать в буфер обмена
function setCopyToClipboard(elem) { // доделать // (?)
	let msg;
	if (elem.value === "") {
		msg = false;
	} else {
		// if (navigator.clipboard) { // - поддержка API clipboard имеется
		// 	console.log(`function setCopyToClipboard (elem.tagName: ${elem.tagName}, elem.id: ${elem.id}):\n 1) navigator.clipboard\n document.activeElement.id: ${document.activeElement.id}`); // x -
		// 	let value = navigator.clipboard.writeText(elem.value)
		// 		.then(() => { // - метод then() возвращает Promise
		// 			msg = true;
		// 			console.log(`function setCopyToClipboard (elem.tagName: ${elem.tagName}, elem.id: ${elem.id}):\n 2) navigator.clipboard\n document.activeElement.id: ${document.activeElement.id}\n msg: ${msg}\n value: ${value}`); // x -
		// 		})
		// 		.catch(err => { // (?) непонятно почему - NotAllowedError: Document is not focused
		// 			msg = false;
		// 			console.error(`function setCopyToClipboard (elem.tagName: ${elem.tagName}, elem.id: ${elem.id}):\n 3) navigator.clipboard\n document.activeElement.id: ${document.activeElement.id}\n msg: ${msg}\n value: ${value}\n err: ${err}`); // x -
		// 		});
		// } else { // - поддержки нет, используем метод execCommand
			try {
				elem.select();
				msg = document.execCommand("copy");
			} catch (error) {
				console.error(`error: ${error}`);
				alert(`(!) ${error}, см.консоль.`);
			}
		// }
	}
	return msg;
}
// (!) очистить окно Постоянная ссылка
function setClearPermalink() {
	let elem = window.top.document.getElementById('idPermaLinkTxT');
	if (typeof(elem) !== "undefined" || elem !== null && (elem === Object(elem) || typeof(elem) === "object")) {
		if (elem.labels[0].innerHTML !== "") {
			elem.labels[0].innerHTML = "";
			elem.labels[0].classList.remove('permalink-error');
			elem.labels[0].classList.add('permalink-info');
		}
	}
}
// (!) permalink_onClick
function permalink_onClick(eVent) {
	if (eVent.target.tagName === "DIV") {
		if (eVent.target.id === "idPermaLinkClose") { // - esc - кн.закрыть всплывающее окно Постоянная ссылка
			let plnk = eVent.target;
			while (plnk.id !== "idPermalinkBox") {
				plnk = plnk.parentElement;
				if (plnk.tagName === "BODY") { break; }
			}
			if (plnk.id === "idPermalinkBox") {
				setClearPermalink(); // очистить окно Постоянная ссылка
				// setShowOrHide(plnk, "", "", "", "permalink-popup");
				plnk.classList.remove('permalink-popup');
			}
			setEventHandlersPermalink(plnk, 'remove'); // создание/удаление обработчиков событий для узла permalink
		}
	} else if (eVent.target.tagName === "INPUT") {
		if (eVent.target.id === "idPermaLinkBookmark") { // - кн.в закладки
			let txtArea = document.getElementById('idPermaLinkTxT');
			if (txtArea !== null && typeof(txtArea) === "object") {
				if (txtArea.value === "") {
					// x // eVent.target.value = "Bookmark failed";
					eVent.target.labels[0].setAttribute('data-before', 'Bookmark failed');
					txtArea.labels[0].innerHTML = vrsPermalink.bookmarkError;
					txtArea.labels[0].classList.remove('permalink-info');
					txtArea.labels[0].classList.add('permalink-error');
				} else {
					if (setPermaLinkBookmark(txtArea)) {
						// x // eVent.target.value = "Добавлено";
						eVent.target.labels[0].setAttribute('data-before', 'Добавлено');
						txtArea.labels[0].innerHTML = vrsPermalink.bookmarkInfo;
						txtArea.labels[0].classList.remove('permalink-error');
						txtArea.labels[0].classList.add('permalink-info');
					} else {
						// x // eVent.target.value = "Bookmark failed";
						eVent.target.labels[0].setAttribute('data-before', 'Bookmark failed');
						txtArea.labels[0].innerHTML = vrsPermalink.bookmarkError;
						txtArea.labels[0].classList.remove('permalink-info');
						txtArea.labels[0].classList.add('permalink-error');
					}
					eVent.target.labels[0].classList.add('btn-flip'); // анимация кн.перевертыш
					setTimeout(() => {
						// x // eVent.target.value = "В закладки";
						eVent.target.labels[0].classList.remove('btn-flip');
						// eVent.target.labels[0].setAttribute('data-before', '');
					}, 2000);
				}
			}
		} else if (eVent.target.id === "idPermaLinkCopy") { // - кн.скопировать
			let txtArea = document.getElementById('idPermaLinkTxT');
			if (txtArea !== null && typeof(txtArea) === "object" || txtArea === Object(txtArea)) {
				if (txtArea.value === "") {
					// x // eVent.target.value = "Copy failed";
					eVent.target.labels[0].setAttribute('data-before', 'Copy failed');
					txtArea.labels[0].innerHTML = vrsPermalink.copyError;
					txtArea.labels[0].classList.remove('permalink-info');
					txtArea.labels[0].classList.add('permalink-error');
				} else {
					if (setCopyToClipboard(txtArea)) {
						// x // eVent.target.value = "Скопировано";
						eVent.target.labels[0].setAttribute('data-before', 'Скопировано');
						txtArea.labels[0].innerHTML = vrsPermalink.copyInfo;
						txtArea.labels[0].classList.remove('permalink-error');
						txtArea.labels[0].classList.add('permalink-info');
					} else {
						// x // eVent.target.value = "Copy failed";
						eVent.target.labels[0].setAttribute('data-before', 'Copy failed');
						txtArea.labels[0].innerHTML = vrsPermalink.copyError;
						txtArea.labels[0].classList.remove('permalink-info');
						txtArea.labels[0].classList.add('permalink-error');
					}
					eVent.target.labels[0].classList.add('btn-flip'); // анимация кн.перевертыш
					setTimeout(() => {
						// x // eVent.target.value = "Копировать";
						eVent.target.labels[0].classList.remove('btn-flip');
						// eVent.target.labels[0].setAttribute('data-before', '');
					}, 2000);
				}
			}
		}
	}
}
// (!) setEventHandlersPermalink - создание/удаление обработчиков событий для узла permalink
function setEventHandlersPermalink(elem, addOrRemove = "") {
	let retVal = false;
	if (addOrRemove !== "add" && addOrRemove !== "remove") {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена:\n function setEventHandlersPermalink(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return retVal;
	}
	let plnk;
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		plnk = document.getElementById('idPermalinkBox');
		if (plnk === null) {
			console.error(`(!) Косяк: не удалось создать/удалить обработчик события - не найден элемент:\n function setEventHandlersPermalink(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
			alert(`(!) Косяк: не удалось создать/удалить обработчик события - не найден элемент, см.консоль.`);
			return retVal;
		}
	} else {plnk = elem;}
	// '
	if (addOrRemove === "add") { // - добавляем
		plnk.addEventListener('click', permalink_onClick, false);
		retVal = true;
	} else if (addOrRemove === "remove") { // - удаляем
		plnk.removeEventListener('click', permalink_onClick, false);
		retVal = true;
	}
	return retVal;
}