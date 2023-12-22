// (!) setPermaLinkBookmark-кнопка в закладки
function setPermaLinkBookmark (elem) { // TODO
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
// (!) setCopyToClipboard-кнопка скопировать в буфер обмена
function setCopyToClipboard (elem) {
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
// (!) clearPermalink - очистить окно Постоянная ссылка
function clearPermalink() {
	let elem = window.top.document.getElementById('idTextArea');
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
		if (eVent.target.id === "idPermaLinkClose") { // - кнопка закрыть всплывающее окно Постоянная ссылка
			let plnk = eVent.target;
			while (plnk.id !== "idPermalinkBox") {
				plnk = plnk.parentElement;
				if (plnk.tagName === "BODY") { break; }
			}
			if (plnk.id === "idPermalinkBox") {
				// tmp: - переделать
				clearPermalink(); // - очищение инфо-подсказок при закрытии окна Постоянная ссылка
				setShowHideWindow(plnk, 'hide');
			}
			setEventHandlersPermalink(eVent.target, 'remove'); // - создание/удаление обработчиков событий для узла permalink
		}
	} else if (eVent.target.tagName === "INPUT") {
		if (eVent.target.id === "idPermaLinkBookmark") { // - кнопка в закладки
			let textArea = document.getElementById('idTextArea');
			if (textArea !== null && typeof (textArea) === "object") {
				if (textArea.value === "") {
					eVent.target.value = "Bookmark failed";
					textArea.labels[0].innerHTML = hmpermalink.bookmarkError;
					textArea.labels[0].classList.remove('permalink-info');
					textArea.labels[0].classList.add('permalink-error');
				} else {
					if (setPermaLinkBookmark(textArea)) {
						eVent.target.value = "Добавлено";
						textArea.labels[0].innerHTML = hmpermalink.bookmarkInfo;
						textArea.labels[0].classList.remove('permalink-error');
						textArea.labels[0].classList.add('permalink-info');
					} else {
						eVent.target.value = "Bookmark failed";
						textArea.labels[0].innerHTML = hmpermalink.bookmarkError;
						textArea.labels[0].classList.remove('permalink-info');
						textArea.labels[0].classList.add('permalink-error');
					}
					setTimeout(() => {
						eVent.target.value = "В закладки";
					}, 2000);
				}
			}
		} else if (eVent.target.id === "idPermaLinkCopy") { // - кнопка скопировать
			let textArea = document.getElementById('idTextArea');
			if (textArea !== null && typeof (textArea) === "object" || textArea === Object(textArea)) {
				if (textArea.value === "") {
					eVent.target.value = "Copy failed";
					textArea.labels[0].innerHTML = hmpermalink.copyError;
					textArea.labels[0].classList.remove('permalink-info');
					textArea.labels[0].classList.add('permalink-error');
				} else {
					if (setCopyToClipboard(textArea)) {
						eVent.target.value = "Скопировано";
						textArea.labels[0].innerHTML = hmpermalink.copyInfo;
						textArea.labels[0].classList.remove('permalink-error');
						textArea.labels[0].classList.add('permalink-info');
					} else {
						eVent.target.value = "Copy failed";
						textArea.labels[0].innerHTML = hmpermalink.copyError;
						textArea.labels[0].classList.remove('permalink-info');
						textArea.labels[0].classList.add('permalink-error');
					}
					setTimeout(() => {
						eVent.target.value = "Копировать";
					}, 2000);
				}
			}
		}
	}
}
// (!) setEventHandlersPermalink - создание/удаление обработчиков событий для узла permalink
function setEventHandlersPermalink(elem, addOrRemove = "") {
	if (addOrRemove !== "add" && addOrRemove !== "remove") {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена:\n function setEventHandlersPermalink(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	let plnk;
	if (typeof(elem) === "undefined" || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		plnk = document.getElementById('idPermalinkBox');
		if (plnk === null) {
			console.error(`(!) Косяк: не удалось создать/удалить обработчик события - не найден элемент:\n function setEventHandlersPermalink(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
			alert(`(!) Косяк: не удалось создать/удалить обработчик события - не найден элемент, см.консоль.`);
			return false;
		}
	} else {plnk = elem;}
	// '
	if (addOrRemove === "add") { // - добавляем
		// plnk.addEventListener("mouseover", permalink_onMouseover);
		// plnk.addEventListener("mouseout", permalink_onMouseout);
		// plnk.addEventListener("keydown", permalink_onKeydown); // tmp: ! доделать
		plnk.addEventListener("click", permalink_onClick);
	} else if (addOrRemove === "remove") { // - удаляем
		// plnk.removeEventListener("mouseover", permalink_onMouseover);
		// plnk.removeEventListener("mouseout", permalink_onMouseout);
		// plnk.removeEventListener("keydown", permalink_onKeydown); // tmp: ! доделать
		plnk.removeEventListener("click", permalink_onClick);
	}
	return true;
}