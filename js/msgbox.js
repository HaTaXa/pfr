const msgBox = document.getElementById('idMsgBox');
const msgContent = document.getElementById('idMsgContent');
const btnFT = msgBox.querySelector('.msg-btn'); // idBtnToggleMsgBox
const btnLS = msgBox.querySelector('.light-switch'); // idBtnLightSwitch
let RAF_RESET = false; // флаг для определения прерывания воспроизведения цикла анимации в ф.setSwing()
// 'ended - завершение воспроизведения
// bellSound.addEventListener('ended', function (e) {
// 	btnLS.classList.remove('lightswitch-shake'); // прекращение эфф.покачивания светового переключателя
// }, false);
// function msgbox_onAnimationend(eVent) {
// 	if (eVent.target.classList.contains('lightswitch-chain')) {
// 		eVent.target.style.removeProperty('animation');
// 		eVent.target.removeEventListener('animationend', msgbox_onAnimationend, false);
// 	}
// }
// (!) так и не могу понять, как сделать пользовательский точечный объект с индивидуальными методами в группе для каждого объекта, типа: obj.objRustleChain.rustleChain.play()/pause()/stop()
let audioElements = {
	objRustleChain: {
		rustleChain: ({}) ? null : new Audio(),
	},
	objBellSound: {
		bellSound: ({}) ? null : new Audio(),
		rustleChain: ({}) ? null : new Audio(),
	},
	objBallDragg: {
		ratchetSound: ({}) ? null : new Audio(),
		floorClockMechanism: ({}) ? null : new Audio(),
		rustleChain: ({}) ? null : new Audio(),
	},
};
// (!) получить/создать элем.аудио воспроизведения
function handleAudioElement(keyRefName = "", srcPath = "") {
	if (typeof(srcPath) !== "string" && srcPath === "") {
		console.error(`(!) Косяк - не удалось получить элемент аудио воспроизведения - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function getAudioElement(srcPath: typeof(${srcPath}) = ${srcPath}): window.«${window.name}»`);
		alert(`(!) Косяк - не удалось получить элемент аудио воспроизведения - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	function getAudioElement(keyRefName = "", srcPath = "") {
		for (const key in audioElements) {
			if (key === keyRefName) {
				for (let i = 0; i < audioElements[key].length; i++) {
					if (audioElements[key][i].getAttribute('src') === srcPath) { // св-во src яв-ся ссылкой (http://...), поэтому сравнивать можно через getAttribute()
						// return audioElements[key][i];
						return true;
					}
				}
				break;
			}
		}
		return false;
	}
	function setAudioElement(keyRefName = "", srcPath = "") {
		for (const key in audioElements) {
			if (key === keyRefName) {
				audioElements[key].push(new Audio(srcPath)); // доб.в конец
				audioElements[key][audioElements[key].length - 1].preload = "auto"; // подготавливаем звук, чтобы он сразу был готов к воспроизведению
				if (srcPath === "audio/bell-sound.mp3") { // колокольчики
					// 'ended - завершение воспроизведения
					if (btnLS.classList.contains('lightswitch-shake')) {
						function bellSound_onEnded(eVent) {
							btnLS.classList.remove('lightswitch-shake'); // прекращение эфф.покачивания светового переключателя
							// eVent.target.removeEventListener('ended', bellSound_onEnded, false);
						}
						audioElements[key][audioElements[key].length - 1].addEventListener('ended', bellSound_onEnded, false);
					}
				} else if (srcPath === "audio/rustle-chain.mp3") { // шуршание цепочкой
					audioElements[key][audioElements[key].length - 1].loop = true;
				} else if (srcPath === "audio/ratchet-sound.mp3") { // щелчки велосипедной цепи
					audioElements[key][audioElements[key].length - 1].loop = true;
				} else if (srcPath === "audio/floor-clock-mechanism.mp3") { // механический завод напольных часов
					audioElements[key][audioElements[key].length - 1].loop = true;
				}
				// return audioElements[key][audioElements[key].length - 1];
				return true;
			}
		}
		return false;
	}
	// let elem = getAudioElement(keyRefName, srcPath);
	// if (elem === null) return setAudioElement(keyRefName, srcPath);
	// return elem;
	if (getAudioElement(keyRefName, srcPath)) return true;
	return setAudioElement(keyRefName, srcPath);
}
// (!) установить всплывающую подсказку к элементу в MsgBox
function setMsgBoxItemTooltip(eVent, nameClass = "") {
	// 'для idIconFingerToggle
	// ''для idIconLightSwitch над.lightswitch-ball:
	// *при наведении на иконку (версия desktop - Windows NT...)
	// **при кликах в мобильной версии firefox
	if (nameClass === "" && typeof(nameClass) !== "string") {
		console.error(`(!) Косяк - не удалось установить всплывающую подсказку к элементу в MsgBox - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setMsgBoxItemTooltip(eVent: ${eVent.type}, nameClass: ${nameClass}): window.«${window.name}», location.origin: ${location.origin}\n`);
		alert(`(!) Косяк - не удалось установить всплывающую подсказку к элементу в MsgBox - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	if (eVent.target.id === "idIconFingerToggle") {
		// if (isMobile()) { // проверить устройство на кот.исп.браузер // (!) для firefox не сработает нет поддержки
			if (getBrowser().toString().toLowerCase() === "firefox") {
				const tooltip = msgBox.querySelector('.tooltip-finger_toggle');
				if (tooltip !== null && tooltip === Object(tooltip) || typeof(tooltip) === "object") {
					if (nameClass === "tooltip_finger_toggle-popup") {
						// setShowOrHide(tooltip,"", "", "", "tooltip_finger_toggle-popup"); // или так
						tooltip.classList.toggle('tooltip_finger_toggle-popup');
						eVent.target.classList.toggle('msg_icon-finger_toggle-popup');
						if (tooltip.classList.contains('tooltip_finger_toggle-popup') || eVent.target.classList.contains('msg_icon-finger_toggle-popup')) {
							document.addEventListener('click', handlerPoPuPs, { capture: true }); // создаем обработчик для всего док. // (i) { once: true } - для button-link не прокатывает и совместить нельзя с опцией capture (фаза всплытие - false/true - погружение)
						}
						return true;
					}
				} else {
					console.error(`(!) Косяк - не удалось установить всплывающую подсказку к элементу в MsgBox - не найден элемент:\n function setMsgBoxItemTooltip(eVent: ${eVent.type}, nameClass: ${nameClass}): window.«${window.name}»:\n 1) tooltip: ${tooltip}\n 2) typeof(${tooltip}):\n 3) Object(${tooltip})`);
					alert(`(!) Косяк - Косяк - не удалось установить всплывающую подсказку к элементу в MsgBox - не найден элемент, см.консоль.`);
					return false;
				}
			}
		// }
	} else if (eVent.target.id === "idIconLightSwitch") {
		const tooltip = msgBox.querySelector('.tooltip-lightswitch');
		if (tooltip !== null && tooltip === Object(tooltip) || typeof(tooltip) === "object") {
			if (nameClass === "tooltip_lightswitch-show") {
				if (eVent.type === "mouseover") {
					tooltip.classList.add(nameClass);
					// setShowOrHide(tooltip, "", "", "", "tooltip_lightswitch-show"); // или так
					// setShowOrHide(tooltip, "", "tooltip_lightswitch-show", "", ""); // установить отображение или скрытие
					return true;
				} else if (eVent.type === "mouseout") {
					tooltip.classList.remove(nameClass);
					// setShowOrHide(tooltip, "", "", "", "tooltip_lightswitch-show"); // или так
					// setShowOrHide(tooltip, "", "", "tooltip_lightswitch-show", ""); // установить отображение или скрытие
					return true;
				} else { // click...
					if (getBrowser().toString().toLowerCase() === "firefox") {
						if (tooltip !== null && tooltip === Object(tooltip) || typeof(tooltip) === "object") {
							// setShowOrHide(tooltip,"", "", "", "tooltip_lightswitch-show"); // или так
							tooltip.classList.toggle(nameClass);
							if (tooltip.classList.contains(nameClass)) {
								document.addEventListener('click', handlerPoPuPs, { capture: true }); // создаем обработчик для всего док. // (i) { once: true } - для button-link не прокатывает и совместить нельзя с опцией capture (фаза всплытие - false/true - погружение)
							}
							return true;
						}
					}
				}
			}
		} else {
			console.error(`(!) Косяк - не удалось установить всплывающую подсказку к элементу в MsgBox - не найден элемент:\n function setMsgBoxItemTooltip(eVent: ${eVent.type}, nameClass: ${nameClass}): window.«${window.name}»:\n 1) tooltip: ${tooltip}\n 2) typeof(${tooltip}):\n 3) Object(${tooltip})`);
			alert(`(!) Косяк - Косяк - не удалось установить всплывающую подсказку к элементу в MsgBox - не найден элемент, см.консоль.`);
			return false;
		}
	} else if (eVent.target.hasAttribute('class')) {
		if (eVent.target.classList.contains('lightswitch-ball')) {
			if (getBrowser().toString().toLowerCase() === "firefox") {
				const tooltip = msgBox.querySelector('.tooltip-lightswitch');
				if (tooltip !== null && tooltip === Object(tooltip) || typeof(tooltip) === "object") {
					// setShowOrHide(tooltip,"", "", "tooltip_lightswitch-show", ""); // или так
					tooltip.classList.add('tooltip_lightswitch-show');
					document.addEventListener('click', handlerPoPuPs, { capture: true }); // создаем обработчик для всего док. // (i) { once: true } - для button-link не прокатывает и совместить нельзя с опцией capture (фаза всплытие - false/true - погружение)
					return true;
				}
			}
		}
	}
}
// (!) получить разрешение на воспроизведение
function getPlayback(keyName = "") {
	// sessionStorage - allowPlayback
	if (keyName === "") {
		console.error(`(!) Косяк - не удалось получить разрешение на воспроизведение - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function getPlayback(keyName: ${keyName}): window.«${window.name}»`);
		alert(`(!) Косяк - Косяк - не удалось получить разрешение на воспроизведение - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	let retVal = false;
	let userInter = null;
	if (keyName in window.sessionStorage) { // ~при нажатии гор.клавиши esc
		retVal = JSON.parse(window.sessionStorage.getItem(keyName)); // return false
	} else {
		if (navigator.userActivation.hasBeenActive) { // проверка на взаимодействие пользователя в случае перезагрузки/обновления страницы вэб сайта
			if (window.sessionStorage.length === 0) {
				userInter = writeUserInteraction(); // создание всплывающего элемента для взаимодействия с пользователем
				if (userInter !== null && userInter === Object(userInter)) {
					// 'ожидаем выбор пользователя
					userInter.removeAttribute('style'); // экранируем фрейм взаимодействия с пользователем
				}
			} else {
				retVal = JSON.parse(window.sessionStorage.getItem(keyName));
				if (retVal === null) {
					for (const key in window.sessionStorage) {
						if (key === keyName) {
							retVal = JSON.parse(window.sessionStorage[key]);
							break;
						}
					}
					if (retVal === null) {
						userInter = writeUserInteraction(); // создание всплывающего элемента для взаимодействия с пользователем
						if (userInter !== null && userInter === Object(userInter)) {
							// 'ожидаем выбор пользователя
							userInter.removeAttribute('style'); // экранируем фрейм взаимодействия с пользователем
						}
					}
				}
			}
		} else { // NotAllowedError: ошибка воспроизведения произошла из-за того, что пользователь сначала не взаимодействовал с документом
			userInter = writeUserInteraction(); // создание всплывающего элемента для взаимодействия с пользователем
			if (userInter !== null && userInter === Object(userInter)) {
				// 'ожидаем выбор пользователя
				userInter.removeAttribute('style'); // экранируем фрейм взаимодействия с пользователем
			}
		}
	}
	return retVal;
}
// (!) установить pause/play/stop
function setPlayback(playback = "", elem = audioElements) {
	if (playback === "") {
		console.error(`(!) Косяк - не удалось осуществить воспроизведение аудио - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setPlayback(playback: typeof(${typeof(playback)}, elem: typeof(${elem})):\n playback: ${playback}\n elem: ${elem}`);
		alert(`(!) Косяк - не удалось осуществить воспроизведение аудио - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	if (elem === null && typeof(elem) !== "object") {
		console.error(`(!) Косяк - не удалось осуществить воспроизведение аудио - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setPlayback(playback: typeof(${typeof(playback)}, elem: typeof(${elem})):\n playback: ${playback}\n elem: ${elem}`);
		alert(`(!) Косяк - не удалось осуществить воспроизведение аудио - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}

	if (playback === "pause") {
		elem.pause();
		let idInt = setInterval(() => {
			if (elem.paused) {
				clearInterval(idInt);
			}
		}, 100);
	} else if (playback === "play") {
		elem.play().catch(error => { // NotAllowedError/AbortError
			if (error.name === "AbortError") {
				elem.pause();
			} else if (error.name === "NotAllowedError") { // NotAllowedError: ошибка воспроизведения произошла из-за того, что пользователь сначала не взаимодействовал с документом
				const userInter = writeUserInteraction(); // создание всплывающего элемента для взаимодействия с пользователем
				if (userInter !== null && userInter === Object(userInter)) {
					// 'ожидаем выбор пользователя
					userInter.removeAttribute('style'); // экранируем фрейм взаимодействия с пользователем
				}
			} else {
				console.log(error.name);
			}
		});
	} else if (playback === "stop") {
		elem.pause();
		let idInt = setInterval(() => {
			if (elem.paused) {
				clearInterval(idInt);
				elem.currentTime = 0; // обнуляем продолжительность воспроизведения
			}
		}, 100);
	}
}
// (!) анимационное раскачивание
// 'взамен css.lightswitch-shake на кн.idBtnLightSwitch
function setSwing(elem = document.body, duration = 0, objAudioElem = audioElements) {
	// 'elem -.lightswitch-wrapper
	// 'objAudioElem - ссылка на объект(-ы) в глоб.audioElements
	if (elem === document.body || elem === null || (elem === null && elem === Object(elem))) {
		console.error(`(!) Косяк - не удалось осуществить анимационное раскачивание - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setSwing(elem: typeof(${typeof(elem)});\n duration: ${duration}; objAudioElem: ${objAudioElem}):\n 1) Object(${Object(elem)})\n 2) ${elem}`);
		alert(`(!) Косяк - не удалось осуществить анимационное раскачивание - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	const tooltipLS = msgBox.querySelector('.tooltip-lightswitch');
	tooltipLS.style.transition = "none"; // 'чтобы transition не мешал своевременному скрытию на время выполнения анимации
	let deg = 0;
	function getDegree() {
		let r = 0;
		let i = 0;
		while (r === 0) {
			r = (Math.round(Math.random()) * 2) - 1; // диапазон от -1 до 1 без 0 // Math.floor(Math.random() * (max - min + 1)) + min;
			i++;
			if (i > 50) {
				r = 1;
				break;
			}
		}
		return r;
	}
	// let rotate = elem.style.transform.match(/rotate\((.+)\)/); // получить значение свойства rotate в JavaScript
	let angle = getDegree();
	let req;
	if (Object.keys(objAudioElem).length > 0) {
		req = getPlayback("allowPlayback"); // получить разрешение на воспроизведение
		if (req) {
			// 'сопоставим ссылку на объект с ссылкой на объект в глоб.переменной
			if (objAudioElem === audioElements.objRustleChain) { // rustleChain (шуршание цепочкой)
				if (objAudioElem.rustleChain.currentTime === 0) {
					setPlayback("play", objAudioElem.rustleChain); // установить pause/play/stop
				}
			} else if (objAudioElem === audioElements.objBellSound) { // (колокольчики) bellSound/rustleChain (шуршание цепочкой)
				for(let key in objAudioElem) {
					if (objAudioElem[key].paused && objAudioElem[key].currentTime === 0) {
						setPlayback("play", objAudioElem[key]); // установить pause/play/stop
					}
				}
			}
		}
	}
	let timeStart = performance.now(); // метод производительности выраженный в миллисекундах
	let rafId = requestAnimationFrame(function animateSwing(time) {
		if (RAF_RESET) {
			cancelAnimationFrame(rafId);
			rafId = null;
			for (let key in audioElements) {
				let obj = audioElements[key];
				for (let item in obj) {
					if (obj[item] !== null) {
						if (obj[item].currentTime > 0) { // почему то пауза срабатывает быстрее, чем стоп
							setPlayback("pause", obj[item]); // установить pause/play/stop
							obj[item].currentTime = 0;
						}
					}
				}
			}
			elem.removeAttribute('style');
			tooltipLS.removeAttribute('style'); // возвращаем transition
			RAF_RESET = false;
		} else {
			if (!timeStart) timeStart = time;
			// const interval = (time - timeStart) / duration;
			const timeCurrent = time - timeStart;
			tooltipLS.classList.add('tooltip_lightswitch-hide'); // нужен тут, чтобы css.tooltip_lightswitch-show не накладывалось непосредственно после css.tooltip_lightswitch-hide
			if (Math.sign(angle) === 1) { // угол положительный
				if (deg > (angle * (-1))) {
					elem.style.transform = "rotateZ(" + (deg--) + "deg)";
				} else {
					elem.style.transform = "rotateZ(" + (deg++) + "deg)";
					if (timeCurrent < (duration / 2)) {
						angle++;
					} else {
						if (Math.abs(angle) !== 0) angle--; // при проверке исключаем отрицательное значение угла
					}
					angle *= -1; // перезаписываем на противоположное значение угла // сокращенная арифметика с присваиванием ( *= ): angle = angle * -1;
				}
			} else if (Math.sign(angle) === -1) { // угол отрицательный
				if (deg < (angle * (-1))) {
					elem.style.transform = "rotateZ(" + (deg++) + "deg)";
				} else {
					elem.style.transform = "rotateZ(" + (deg--) + "deg)";
					if (timeCurrent < (duration / 2)) {
						angle--;
					} else {
						if (Math.abs(angle) !== 0) angle++; // при проверке исключаем отрицательное значение угла
					}
					angle *= -1; // перезаписываем на противоположное значение угла // сокращенная арифметика с присваиванием ( *= ): angle = angle * -1;
				}
			}
			// '
			// if (interval < 1) { // новый заход
			if (timeCurrent < duration) { // новый заход
				rafId = requestAnimationFrame(animateSwing);
			} else {
				cancelAnimationFrame(rafId);
				rafId = null;
				if (Object.keys(objAudioElem).length > 0) {
					// 'сопоставим ссылку на объект с ссылкой на объект в глоб.переменной
					if (objAudioElem === audioElements.objRustleChain) { // rustleChain (шуршание цепочкой)
						setPlayback("stop", objAudioElem.rustleChain); // установить pause/play/stop
					} else if (objAudioElem === audioElements.objBellSound) { // (колокольчики) bellSound/rustleChain (шуршание цепочкой)
						for(let key in objAudioElem) {
							setPlayback("stop", objAudioElem[key]); // установить pause/play/stop
						}
					}
				}
				elem.removeAttribute('style');
				tooltipLS.removeAttribute('style'); // возвращаем transition
				tooltipLS.classList.remove('tooltip_lightswitch-hide'); // убираем принудительное скрытие подсказки
			}
		}
	});
}
function msgbox_onMouseover(eVent) {
	if (eVent.target.id === "idIconLightSwitch") {
		const wraperLS = msgBox.querySelector('.lightswitch-wrapper');
		if (wraperLS !== null && wraperLS === Object(wraperLS)) {
			if (audioElements.objRustleChain.rustleChain === null) {
				audioElements.objRustleChain.rustleChain = new Audio("audio/rustle-chain.mp3");
				audioElements.objRustleChain.rustleChain.preload = "auto"; // подготавливаем звук, чтобы он сразу был готов к воспроизведению
				let idInt = setInterval(() => {
					if (audioElements.objRustleChain.rustleChain.paused) {
						clearInterval(idInt);
						setSwing(wraperLS, audioElements.objRustleChain.rustleChain.duration * 1000, audioElements.objRustleChain); // анимационное раскачивание // 'взамен css.lightswitch-shake на кн.idBtnLightSwitch
					}
				}, 100);
			} else {
				if (audioElements.objRustleChain.rustleChain.currentTime > 0) {
					RAF_RESET = true;
				}
				let idInt = setInterval(() => {
					if (RAF_RESET === false) {
						clearInterval(idInt);
						setSwing(wraperLS, audioElements.objRustleChain.rustleChain.duration * 1000, audioElements.objRustleChain); // анимационное раскачивание // 'взамен css.lightswitch-shake на кн.idBtnLightSwitch
					}
				}, 100);
			}
		}
		setMsgBoxItemTooltip(eVent, "tooltip_lightswitch-show"); // установить всплывающую подсказку к элементу в MsgBox

		// if (btnLS !== null && btnLS === Object(btnLS)) { // при исп.css.lightswitch-shake на кн.idBtnLightSwitch
		// 	if (getPlayback("allowPlayback")) { // получить разрешение на воспроизведение
		// 		rustleChain.play(); // шуршание цепочкой
		// 	}
		// 	btnLS.classList.add('lightswitch-shake'); // короткое разовое качание кн.переключателя
		// 	setTimeout(() => {
		// 		btnLS.classList.remove('lightswitch-shake');
		// 		rustleChain.pause(); // шуршание цепочкой
		// 		rustleChain.currentTime = 0;
		// 	}, rustleChain.duration * 1000);
		// }
		function iconLS_onMouseout(evt) {
			setMsgBoxItemTooltip(evt, "tooltip_lightswitch-show"); // установить всплывающую подсказку к элементу в MsgBox
			eVent.target.removeEventListener('mouseout', iconLS_onMouseout, false);
		}
		eVent.target.addEventListener('mouseout', iconLS_onMouseout, false);
	}
}
// (!) Метод easeInOutSine() - для синусоидального плавного увеличения и уменьшения
// (i) так и не пригодился
function easeInOutSine_1(startTime, startPos, valueChange, duration) {
	// Метод возвращает смягченное положение объекта, т. е. положение объекта в определенный момент времени
	// startTime: Этот параметр содержит указанное время начала анимации. Например, если значение startTime = 0, это означает, что анимация только что началась.
	// startPos: Этот параметр содержит заданное начальное положение объекта по оси X. Например, если значение startPos = 10, это означает, что начальное положение объектов по оси X = 10.
	// valueChange: Этот параметр содержит заданное изменение значения для объекта. Например, если значение valueChange = 30, это означает, что объект должен переместиться на 30 вправо и остановиться на отметке 40.
	// duration: Этот параметр содержит заданную продолжительность всего процесса. Например, если значение duration = 2, это означает, что у объекта есть 2 секунды, чтобы выполнить это движение от 10 до 40.

	// return valueChange / 2 * (Math.cos(Math.PI * startTime / duration) - 1) + startPos;
	return -valueChange / 2 * (Math.cos(Math.PI * startTime / duration) - 1) + startPos;
}
function easeInOutSine(x) {
	return -(Math.cos(Math.PI * x) - 1) / 2;
}
function easeInExpo(x) {
	return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}
// (!) Получить значения стиля Translate
function getTranslateValues(elem) {
	if (elem === null || typeof(elem) === "undefined" && typeof(elem) !== "object" || elem !== Object(elem)) {
		console.error(`(!) Косяк - не удалось получить матрицу стиля Translate - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function getTranslateValues(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк - не удалось получить матрицу стиля Translate - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return null;
	}
	const elemStyles = getComputedStyle(elem, null);
	const matrix = elemStyles.transform || elemStyles.webkitTransform || elemStyles.mozTransform;
	const matrixType = matrix.includes("3d") ? "3d" : "2d";
	const matrixValue = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");
	if (matrix === "none") {
		console.error(`(!) Косяк, что то пошло не так!!! Не удалось получить матрицу стиля Translate:\n function getTranslateValues(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		return { x: 0, y: 0, z: 0 };
	} else if (matrixType === "2d") { // 6 значений, из кот.4, 5. Значение z отсутствует.
		return {
			x: matrixValue[4],
			y: matrixValue[5],
			z: 0
		};
	} else if (matrixType === "3d") { // 16 значений, из кот.13, 14, 15 - это x, y, z. // 'я так понимаю, что массив матрицы идет от нуля, но даже если это и так, то все равно комментарий из примера должен z приводить под номером 14, а не 15
		return {
			x: matrixValue[12],
			y: matrixValue[13],
			z: matrixValue[14]
		};
	} else {
		console.error(`(!) Косяк, что то пошло не так!!! Не удалось получить матрицу стиля Translate:\n function getTranslateValues(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		return null;
	}
}
// 'mouse & touch
function msgbox_onPointerdown(e) {
	if (e.target.classList.contains('lightswitch-ball')) {
		e.target.setPointerCapture(e.pointerId); // перенацеливаем все события указателя (до pointerup) на элемент ball
		// 'трансформация курсора - меняем вид курсора
		// e.target.style.animationPlayState = "paused";
		if (e.pointerType === "mouse") e.target.classList.add('cursor-grab');
		// 'определяем первоначальное положение координат Y |— X
		let eventClient = {
			X1: e.clientX,
			Y1: e.clientY,
			X2: e.clientX,
			Y2: e.clientY,
		};
		const req = getPlayback("allowPlayback"); // получить разрешение на воспроизведение
		// щелчки велосипедной цепи
		if (audioElements.objBallDragg.ratchetSound === null) {
			audioElements.objBallDragg.ratchetSound = new Audio("audio/ratchet-sound.mp3");
		}
		// механический завод напольных часов
		if (audioElements.objBallDragg.floorClockMechanism === null) {
			audioElements.objBallDragg.floorClockMechanism = new Audio("audio/floor-clock-mechanism.mp3");
		}
		// шуршание цепочкой
		if (audioElements.objBallDragg.rustleChain === null) {
			audioElements.objBallDragg.rustleChain = new Audio("audio/rustle-chain.mp3");
		}
		// подготавливаем звук, чтобы он сразу был готов к воспроизведению
		audioElements.objBallDragg.ratchetSound.preload = "auto";
		audioElements.objBallDragg.floorClockMechanism.preload = "auto";
		audioElements.objBallDragg.rustleChain.preload = "auto";
		let idInt = setInterval(() => {
			if (audioElements.objBallDragg.ratchetSound.paused && audioElements.objBallDragg.floorClockMechanism.paused && audioElements.objBallDragg.rustleChain.paused) {
				clearInterval(idInt);
				audioElements.objBallDragg.ratchetSound.currentTime = 0; // обнуляем продолжительность воспроизведения
				audioElements.objBallDragg.ratchetSound.loop = true;
				audioElements.objBallDragg.floorClockMechanism.currentTime = 0; // обнуляем продолжительность воспроизведения
				audioElements.objBallDragg.floorClockMechanism.loop = true;
				audioElements.objBallDragg.rustleChain.currentTime = 0; // обнуляем продолжительность воспроизведения
				audioElements.objBallDragg.rustleChain.loop = true;
			}
		}, 100);

		const iconLS = document.getElementById('idIconLightSwitch');
		let hIconLS = iconLS.offsetHeight;
		let yIconLS = parseInt(getComputedStyle(iconLS, null).backgroundPositionY, 10);
		const msgText = document.getElementById('idMsgText');
		const iconFT = document.getElementById('idIconFingerToggle');
		const wraperLS = msgBox.querySelector('.lightswitch-wrapper');
		const initX = wraperLS.offsetLeft + (wraperLS.offsetWidth / 2); // 'определение положения т.на оси X
		const tooltipLS = msgBox.querySelector('.tooltip-lightswitch');

		// const stylesTooltipLS = getComputedStyle(tooltipLS, null);
		// const matrix = stylesTooltipLS.transform || stylesTooltipLS.webkitTransform || stylesTooltipLS.mozTransform;
		// const matrixValue = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");
		// const tooltipLSTranslate = {
		// 	x: matrixValue[4],
		// 	y: matrixValue[5],
		// }

		// console.log(`matrix: ${matrix}\n tooltipLSTranslate: ${JSON.stringify(tooltipLSTranslate, null, 2)}`);


		const chainLS = e.target.parentElement.querySelector('.lightswitch-chain');
		if ((chainLS === null) || (chainLS !== Object(chainLS))) {
			chainLS = msgBox.querySelector('.lightswitch-chain');
		}
		let chainLength = {
			len1: chainLS.offsetHeight,
			len2: chainLS.offsetHeight,
		};
		let angle = 0; // rotateZ()
		let gip = 0;
		function getBallDrag(evn) {
			// 'evn.type - onMousemove
			// 'evn.target -.lightswitch-ball
			// .lightswitch-wrapper/idIconLightSwitch/idMsgText/idIconFingerToggle
			if (btnFT.classList.contains('msg-show')) { // уменьшение иконки, увеличение длинны цепочки
				yIconLS = yIconLS - (evn.clientY - eventClient.Y2); // 0, -1, .., -70px
				if (evn.clientY > eventClient.Y2) { // тянем цепу вниз
					hIconLS = hIconLS + (eventClient.Y2 - evn.clientY); // 70, 69, .., 0: уменьшение
					if (hIconLS < 0) {
						hIconLS = 0;
						yIconLS = -70;
					}
				} else if (evn.clientY < eventClient.Y2) { // тянем цепу вверх
					hIconLS = hIconLS + (eventClient.Y2 - evn.clientY); // 0, .., 69, 70: увеличение
					if (hIconLS > 70) {
						hIconLS = 70;
						yIconLS = 0;
					}
				}
			} else if (btnFT.classList.contains('msg-hide')) { // увеличение иконки, уменьшение длинны цепочки
				yIconLS = yIconLS - (eventClient.Y2 - evn.clientY); // /-70, -69, .., 0
				if (evn.clientY > eventClient.Y2) { // тянем цепу вниз
					hIconLS = hIconLS + (evn.clientY - eventClient.Y2); // 0, .., 69, 70: увеличение
					if (hIconLS > 70) { // доступный диапазон с 0 до 70 включительно
						hIconLS = 70;
						yIconLS = 0;
					}
				} else if (evn.clientY < eventClient.Y2) { // тянем цепу вверх
					hIconLS = hIconLS + (evn.clientY - eventClient.Y2); // 70, 69, .., 0: уменьшение
					if (hIconLS < 0) { // доступный диапазон с 70 до 0 включительно
						hIconLS = 0;
						yIconLS = -70;
					}
				}
			}
			// .lightswitch-chain
			chainLength.len1 = chainLength.len1 + (evn.clientY - eventClient.Y2) + (iconLS.offsetHeight - hIconLS); // увеличение, а уменьшение за счет отрицат.знач.evn.clientY
			// *получаем угол в градусах и переводим в радианы
			// (i) угол в градусах - единица измерения углов, которая равна 1/360 полного оборота по окружности (1deg = π/180rad ≈ 0,01745rad)
			// (i) Math.atan2 возвращает угол в плоскости (в радианах) между положительной осью X и лучом от (0, 0) до точки (x, y) для Math.atan2(y, x)
			// angle = (Math.atan2(chainLength.len1, evn.clientX - initX)) * (180 / Math.PI); // получаем угол в радианах и переводим в градусы
			angle = Math.atan2(chainLength.len1 + (wraperLS.offsetWidth / 2), evn.clientX - initX) * (180 / Math.PI); // получаем угол в радианах и переводим в градусы
			angle = angle - 90;
			// (i) теорема Пифагора: квадрат гипотенузы = сумме квадратов катетов
			// gip = Math.round(Math.sqrt(Math.pow((evn.clientX - initX), 2) + Math.pow((evn.clientY - originY), 2)));
			// gip = Math.round(Math.sqrt(Math.pow((evn.clientX - initX), 2) + Math.pow(chainLength.len1, 2)));
			gip = Math.round(Math.sqrt(Math.pow(evn.clientX - initX, 2) + Math.pow(chainLength.len1 + (wraperLS.offsetWidth / 2), 2)));
			gip = gip - (wraperLS.offsetWidth / 2); // (?)'не понятно почему должна учитываться доп.target.offsetHeight/2 (заменена на ширину) без нее курсор будет на самом левом крае
			// (!) хрень получается
			// console.log(`(evn.clientY === eventClient.Y2) || (evn.clientX === eventClient.X2): ${(evn.clientY === eventClient.Y2) || (evn.clientX === eventClient.X2)}\n (evn.clientY === eventClient.Y2): ${(evn.clientY === eventClient.Y2)}\n (evn.clientX === eventClient.X2): ${(evn.clientX === eventClient.X2)}\n evn.clientY: ${evn.clientY}; eventClient.Y2: ${eventClient.Y2}\n evn.clientX: ${evn.clientX}; eventClient.X2: ${eventClient.X2}\n chainLength.len1: ${chainLength.len1}; chainLS.offsetHeight: ${chainLS.offsetHeight}`); // x -
			// (?)
			if (eventClient.Y2 === evn.clientY || eventClient.X2 === evn.clientX) {
				if (chainLength.len1 > chainLength.len2) { // если цепа стала длиннее
					// механический завод напольных часов
					if (!audioElements.objBallDragg.floorClockMechanism.paused) {
						setPlayback("pause", audioElements.objBallDragg.floorClockMechanism); // установить pause/play/stop
					}
				} else if (chainLength.len1 < chainLength.len2) { // если цепа стала короче
					// щелчки велосипедной цепи
					if (!audioElements.objBallDragg.ratchetSound.paused) {
						setPlayback("pause", audioElements.objBallDragg.ratchetSound); // установить pause/play/stop
					}
				} else {
					// механический завод напольных часов
					if (!audioElements.objBallDragg.floorClockMechanism.paused) {
						setPlayback("pause", audioElements.objBallDragg.floorClockMechanism); // установить pause/play/stop
					}
					// щелчки велосипедной цепи
					if (!audioElements.objBallDragg.ratchetSound.paused) {
						setPlayback("pause", audioElements.objBallDragg.ratchetSound); // установить pause/play/stop
					}
				}
				// шуршание цепочкой
				if (!audioElements.objBallDragg.rustleChain.paused) {
					setPlayback("pause", audioElements.objBallDragg.rustleChain); // установить pause/play/stop
				}
				let idInt = setInterval(() => {
					if (eventClient.Y2 !== evn.clientY || eventClient.X2 !== evn.clientX) {
						clearInterval(idInt);
					}
				}, 100);
			} else {
				if (req) {
					if (chainLength.len1 > chainLength.len2) { // если цепа стала длиннее
						// механический завод напольных часов
						if (audioElements.objBallDragg.floorClockMechanism.paused) {
							setPlayback("play", audioElements.objBallDragg.floorClockMechanism); // установить pause/play/stop
						}
						// щелчки велосипедной цепи
						if (!audioElements.objBallDragg.ratchetSound.paused) {
							setPlayback("pause", audioElements.objBallDragg.ratchetSound); // установить pause/play/stop
						}
					} else { // если цепа стала короче
						// щелчки велосипедной цепи
						if (audioElements.objBallDragg.ratchetSound.paused) {
							setPlayback("play", audioElements.objBallDragg.ratchetSound); // установить pause/play/stop
						}
						// механический завод напольных часов
						if (!audioElements.objBallDragg.floorClockMechanism.paused) {
							setPlayback("pause", audioElements.objBallDragg.floorClockMechanism); // установить pause/play/stop
						}
					}
					// шуршание цепочкой
					if (audioElements.objBallDragg.rustleChain.paused) {
						setPlayback("play", audioElements.objBallDragg.rustleChain); // установить pause/play/stop
					}
					let idInt = setInterval(() => {
						if (eventClient.Y2 === evn.clientY || eventClient.X2 === evn.clientX) {
							clearInterval(idInt);
						}
					}, 100);
				}
			}
			// обновляем переменные
			eventClient.X2 = evn.clientX;
			eventClient.Y2 = evn.clientY;
			chainLength.len2 = chainLength.len1;
		}
		function ball_onPointermove(eVent) {
			if (eVent.pointerType === "mouse") eVent.target.classList.replace('cursor-grab', 'cursor-grabbing');
			getBallDrag(eVent);
			iconLS.style.backgroundPositionY = yIconLS + "px"; // изменяем выс.от верхнего края
			iconLS.style.height = hIconLS + "px";
			msgText.children[0].style.overflowY = "hidden";
			msgText.children[0].style.transform = "translateY(" + yIconLS + "px)"; // изменяем выс.от верхнего края
			msgText.children[0].style.height = hIconLS + "px";
			msgText.style.height = hIconLS + "px";
			iconFT.style.height = hIconLS + "px";
			iconFT.style.backgroundPositionY = yIconLS + "px"; // изменяем выс.от верхнего края
			wraperLS.style.top = hIconLS + "px"; // выс.иконки+margin-top: 70+6=76
			chainLS.style.height = gip + "px";
			tooltipLS.style.transition = "none"; // 'чтобы transition не мешал своевременному скрытию на время выполнения анимации
			// tooltipLS.classList.add('tooltip_lightswitch-hide'); // принудительное скрытие подсказки
			// (?)'ф.getTranslateValues() не доработана
			tooltipLS.style.transform = "rotateZ(" + (angle * -1) + "deg) translate(40px, -60px)";
			// const translate = getTranslateValues(tooltipLS); // Получить значения стиля Translate
			// if (translate === null) { // по умолчанию
			// 	tooltipLS.style.transform = "rotateZ(" + (angle * -1) + "deg) translate(40px, -60px)";
			// } else {
			// 	tooltipLS.style.transform = "rotate(" + (angle * -1) + "deg) translate(" + translate.x + "px, " + translate.y + "px)";

			// 	console.log(`translate: ${JSON.stringify(translate, null, 2)}`);
			// }
			wraperLS.style.transform = "rotateZ(" + angle + "deg)";
			// eVent.preventDefault(); // (i) похоже работает и так, проверено на yabrowser, chrome, firefox (кроме моб.вар.)
			if (hIconLS > 10) {
				// 'удаляем css св-ва
				iconLS.style.removeProperty('margin');
				iconLS.style.removeProperty('padding');
				iconLS.style.removeProperty('border');

				// msgText.style.removeProperty('overflow-y');
				msgText.style.removeProperty('margin');
				msgText.style.removeProperty('padding');
				msgText.style.removeProperty('border');

				iconFT.style.removeProperty('margin');
				iconFT.style.removeProperty('padding');
				iconFT.style.removeProperty('border');
			} else {
				iconLS.style.margin = 0;
				iconLS.style.padding = 0;
				iconLS.style.border = 0;

				msgText.style.margin = 0;
				msgText.style.padding = 0;
				msgText.style.border = 0;

				iconFT.style.margin = 0;
				iconFT.style.padding = 0;
				iconFT.style.border = 0;
			}
		}
		e.target.addEventListener('pointermove', ball_onPointermove, false);
		function setBallDrag(evn) {
			// const duration = 3000; // продолжительность выполнения
			// const timeOut = 1000;
			// const timePart = duration / timeOut; // временнОй интервал
			// let timeStart = 0;
			let distance = chainLS.offsetHeight;
			let deg = angle;
			let d = Math.abs(deg); // при проверке исключаем отрицательное значение угла
			tooltipLS.style.transition = "none"; // 'чтобы transition не мешал своевременному скрытию на время выполнения анимации
			tooltipLS.classList.add('tooltip_lightswitch-hide'); // принудительное скрытие подсказки
			// '
			if (btnFT.classList.contains('msg-show')) {
				if (hIconLS <= 30) { // на 5px < половины выс.
					toggleMsgBox(btnFT); // скрыть/показать всплывающее окно сообщения
				}
			} else if (btnFT.classList.contains('msg-hide')) {
				if (hIconLS > 30) { // на 5px < половины выс.
					toggleMsgBox(btnFT); // скрыть/показать всплывающее окно сообщения
				}
			}
			// 'после применения css.msg-show/hide
			if (btnFT.classList.contains('msg-show')) {
				if (distance > 50) {
					distance = distance - 50;
					// механический завод напольных часов
					if (!audioElements.objBallDragg.floorClockMechanism.paused) {
						setPlayback("pause", audioElements.objBallDragg.floorClockMechanism); // установить pause/play/stop
					}
					if (req) {
						// щелчки велосипедной цепи
						if (audioElements.objBallDragg.ratchetSound.paused) {
							setPlayback("play", audioElements.objBallDragg.ratchetSound); // установить pause/play/stop
						}
						// шуршание цепочкой
						if (audioElements.objBallDragg.rustleChain.paused) {
							setPlayback("play", audioElements.objBallDragg.rustleChain); // установить pause/play/stop
						}
					}
				} else if (distance < 50) {
					if (req) {
						// механический завод напольных часов
						if (audioElements.objBallDragg.floorClockMechanism.paused) {
							setPlayback("play", audioElements.objBallDragg.floorClockMechanism); // установить pause/play/stop
						}
						// шуршание цепочкой
						if (audioElements.objBallDragg.rustleChain.paused) {
							setPlayback("play", audioElements.objBallDragg.rustleChain); // установить pause/play/stop
						}
					}
				}
			} else if (btnFT.classList.contains('msg-hide')) {
				if (distance > 16) {
					distance = distance - 16;
					// механический завод напольных часов
					if (!audioElements.objBallDragg.floorClockMechanism.paused) {
						setPlayback("pause", audioElements.objBallDragg.floorClockMechanism); // установить pause/play/stop
					}
					if (req) {
						// щелчки велосипедной цепи
						if (audioElements.objBallDragg.ratchetSound.paused) {
							setPlayback("play", audioElements.objBallDragg.ratchetSound); // установить pause/play/stop
						}
						// шуршание цепочкой
						if (audioElements.objBallDragg.rustleChain.paused) {
							setPlayback("play", audioElements.objBallDragg.rustleChain); // установить pause/play/stop
						}
					}
				} else if (distance < 16) {
					if (req) {
						// механический завод напольных часов
						if (audioElements.objBallDragg.floorClockMechanism.paused) {
							setPlayback("play", audioElements.objBallDragg.floorClockMechanism); // установить pause/play/stop
						}
						// шуршание цепочкой
						if (audioElements.objBallDragg.rustleChain.paused) {
							setPlayback("play", audioElements.objBallDragg.rustleChain); // установить pause/play/stop
						}
					}
				}
			}
			iconLS.removeAttribute('style');
			msgText.removeAttribute('style');
			msgText.children[0].removeAttribute('style');
			iconFT.removeAttribute('style');
			wraperLS.style.removeProperty('top');
			// 'анимация цепочки
			let rafId = requestAnimationFrame(function animate(time1) {
				if (distance > 0) {
					distance--;
					if (btnFT.classList.contains('msg-show')) {
						if (chainLS.offsetHeight > 50) {
							chainLS.style.height = (chainLS.offsetHeight - 1) + "px";
						} else if (chainLS.offsetHeight < 50) {
							chainLS.style.height = (chainLS.offsetHeight + 1) + "px";
						}
					} else if (btnFT.classList.contains('msg-hide')) {
						if (chainLS.offsetHeight > 16) {
							chainLS.style.height = (chainLS.offsetHeight - 1) + "px";
						} else if (chainLS.offsetHeight < 16) {
							chainLS.style.height = (chainLS.offsetHeight + 1) + "px";
						}
					}
					if (distance === 0) {
						// механический завод напольных часов
						if (!audioElements.objBallDragg.floorClockMechanism.paused) {
							setPlayback("stop", audioElements.objBallDragg.floorClockMechanism); // установить pause/play/stop
						}
						// щелчки велосипедной цепи
						if (!audioElements.objBallDragg.ratchetSound.paused) {
							setPlayback("stop", audioElements.objBallDragg.ratchetSound); // установить pause/play/stop
						}
						if (req) {
							// шуршание цепочкой
							if (audioElements.objBallDragg.rustleChain.paused) {
								setPlayback("play", audioElements.objBallDragg.rustleChain); // установить pause/play/stop
							}
						}
						chainLS.removeAttribute('style');
						// переназначаем на максимальный противоположный угол
						if (Math.sign(deg) === 1) { // угол положительный
							if (Math.sign(angle) === 1) { // угол положительный
								deg = -angle;
							} else if (Math.sign(angle) === -1) { // угол отрицательный
								deg = angle;
							}
						} else if (Math.sign(deg) === -1) { // угол отрицательный
							if (Math.sign(angle) === 1) { // угол положительный
								deg = angle;
							} else if (Math.sign(angle) === -1) { // угол отрицательный
								deg = -angle;
							}
						}
						// timeStart = performance.now(); // метод производительности выраженный в миллисекундах
					}
				}
				// ''анимация колебания с постепенным замедлением до полной остановки
				let rafShakeId = requestAnimationFrame(function animateShake(time2){
					if (distance > 0) {
						if (Math.sign(angle) === 1) { // угол положительный
							if (deg > (angle * (-1))) {
								wraperLS.style.transform = "rotateZ(" + (deg--) + "deg)";
							} else {
								wraperLS.style.transform = "rotateZ(" + (deg++) + "deg)";
								angle *= -1; // перезаписываем на противоположное значение угла // сокращенная арифметика с присваиванием ( *= ): angle = angle * -1;
							}
						} else if (Math.sign(angle) === -1) { // угол отрицательный
							if (deg < (angle * (-1))) {
								wraperLS.style.transform = "rotateZ(" + (deg++) + "deg)";
							} else {
								wraperLS.style.transform = "rotateZ(" + (deg--) + "deg)";
								angle *= -1; // перезаписываем на противоположное значение угла // сокращенная арифметика с присваиванием ( *= ): angle = angle * -1;
							}
						}
					} else if (distance === 0) {
						wraperLS.style.transform = "rotateZ(" + deg + "deg)";
					}

					if (distance > 0) {
						cancelAnimationFrame(rafShakeId);
						rafShakeId = null;
					} else if (distance === 0) { // колеблимся (качание от максимального угла) и потихоньку затухаем
						// if (!timeStart) { timeStart = time2; } // при первом вызове сохраняется время, если timeStart не известно
						// // const interval = (time2 - timeStart) / duration;
						// const interval = (time2 - timeStart); // dt - из прим.на сайте
						if (chainLS.offsetHeight === 16) {
							d *= 0.97; // сокращенная арифметика с присваиванием ( *= ): h = h * 0.97; // (?)'так и не разобралась, что за взятый коэфф.0.97 из примера
						} else if (chainLS.offsetHeight === 50) {
							d *= 0.97; // сокращенная арифметика с присваиванием ( *= ): h = h * 0.97; // (?)'так и не разобралась, что за взятый коэфф.0.97 из примера
							// d--;
							if (Math.sign(angle) === 1) { // угол положительный
								angle--;
								if (Math.sign(deg) === 1) { // угол положительный
									deg--;
								} else if (Math.sign(deg) === -1) { // угол отрицательный
									deg++;
								}
							} else if (Math.sign(angle) === -1) { // угол отрицательный
								angle++;
								if (Math.sign(deg) === 1) { // угол положительный
									deg--;
								} else if (Math.sign(deg) === -1) { // угол отрицательный
									deg++;
								}
							}
						}
						// const wave = Math.sin(interval / (angle - interval / deg)); // из прим.на сайте: Math.cos(dt / (200 - dt / 25));
						// // const wave = Math.sin(interval / (interval / deg));

						// deg = (angle - (angle - wave * d)) * -1; // изменяем скорость раскачивания меняя градус угла // '1-й вариант - дергаемся туда-сюда до полной остановки
						// if (Math.round(d) > 0) { // ''2-й вариант
						// 	deg = (deg - (Math.abs(deg) - d)) * -1; // дергаемся туда-сюда до полной остановки
						// } else {
						// 	deg = 0;
						// }

						if (Math.round(d) > 0) { // '''2-й вариант - колебание ближе к желаемому варианту, НО взятый коэфф.0.97 из примера не понятен???
							// d = Math.abs(angle) - d; // ускоряемся с каждым разом за счет увеличения d
							// const r = Math.floor(Math.random() * (angle - 1 + 1)) + 1; // получение случайного числа в другом диапазоне // *вар.не очень
							if (Math.round(d) > 1) {
								if (Math.sign(angle) === 1) { // угол положительный
									if (deg > (angle * (-1))) {
										deg = deg - d;
									} else {
										angle *= -1; // перезаписываем на противоположное значение угла // сокращенная арифметика с присваиванием ( *= ): angle = angle * -1;
										deg = deg + d;
									}
								} else if (Math.sign(angle) === -1) { // угол отрицательный
									if (deg < (angle * (-1))) {
										deg = deg + d;
									} else {
										angle *= -1; // перезаписываем на противоположное значение угла // сокращенная арифметика с присваиванием ( *= ): angle = angle * -1;
										deg = deg - d;
									}
								}
							} else if (Math.round(d) === 1) { // сводим к 0 для законченного вида замедления и полной остановки
								if (Math.sign(deg) === 1) { // угол положительный
									deg--;
								} else if (Math.sign(deg) === -1) { // угол отрицательный
									deg++;
								}
							}
						} else {
							deg = 0;
						}
						// const speed = chainLS.offsetHeight / duration; // velocity - скорость
						// x // const progress = easeInOutSine_1(timeStart, deg, interval, duration);
						// // const progress = easeInExpo(interval);
						// const progress = easeInOutSine(interval);
						// deg = (deg * progress) - deg;
						if (deg === 0) {
							cancelAnimationFrame(rafShakeId);
							rafShakeId = null;
							// шуршание цепочкой
							if (!audioElements.objBallDragg.rustleChain.paused) {
								setPlayback("stop", audioElements.objBallDragg.rustleChain); // установить pause/play/stop
							}
							wraperLS.style.transform = "rotateZ(0deg)";
							wraperLS.removeAttribute('style');
							tooltipLS.removeAttribute('style'); // возвращаем transition
							tooltipLS.classList.remove('tooltip_lightswitch-hide'); // убираем принудительное скрытие подсказки
						} else { // новый заход
							rafShakeId = requestAnimationFrame(animateShake);
						}

						// if (interval < 1) { // новый заход
						// 	rafShakeId = requestAnimationFrame(animateShake);
						// } else {
						// 	cancelAnimationFrame(rafShakeId);
						// 	rafShakeId = null;
						// // шуршание цепочкой
						// if (!audioElements.objBallDragg.rustleChain.paused) {
						// 	setPlayback("stop", audioElements.objBallDragg.rustleChain); // установить pause/play/stop
						// }
						// 	wraperLS.style.transform = "rotateZ(0deg)";
						// 	wraperLS.removeAttribute('style');
						// tooltipLS.removeAttribute('style');
						// }
					}
				});

				if (distance === 0) {
					cancelAnimationFrame(rafId);
					rafId = null;
				} else { // новый заход
					rafId = requestAnimationFrame(animate);
				}
			});
		}
		function ball_onPointerup(eVent) {
			// eVent.target.releasePointerCapture(eVent.pointerId); // явно останавливаем захват на элемент ball
			if (Math.abs(angle) !== 0) { // при проверке исключаем отрицательное значение угла
				setBallDrag(eVent);
			}
			if (eVent.pointerType === "mouse") {
				eVent.target.classList.remove('cursor-grabbing');
				eVent.target.classList.remove('cursor-grab');
			}
			e.target.removeEventListener('pointermove', ball_onPointermove, false);
			e.target.removeEventListener('pointerup', ball_onPointerup, false);

			if (eVent.button === 0) { // исключаем нажатие правой кн.м.
				if ((eVent.clientY === eventClient.Y1 && eventClient.Y1 === eventClient.Y2) && (eVent.clientX === eventClient.X1 && eventClient.X1 === eventClient.X2)) {
					if (btnFT.classList.contains('msg-show')) {
						// console.log(`eVent.type: ${eVent.type}; eVent.pointerType: ${eVent.pointerType}\n eVent.clientY: ${eVent.clientY}; eVent.clientX: ${eVent.clientX}\n ${JSON.stringify(eventClient, null, null)}`); // x -
						// (i) не помогает (в firefox моб.вар.все равно срабатывает 2-ды):
						// 'eVent.preventDefault();
						// ''eVent.stopPropagation();
						// x // eVent.target.addEventListener('click', ball_onClick, false);
						// x // ball_onClick(eVent);
						// *меняем иконку на соответствующий режим спецэфф
						setToggleMsgEffect(eVent.target); // переключение спецэффектов
						jumpLightswitch(chainLS); // анимационный толчок светового переключателя
						// шуршание цепочкой
						if (audioElements.objRustleChain.rustleChain.currentTime > 0) {
							RAF_RESET = true;
						}
						let idInt = setInterval(() => {
							if (RAF_RESET === false) {
								clearInterval(idInt);
								setSwing(wraperLS, audioElements.objRustleChain.rustleChain.duration * 1000, audioElements.objRustleChain); // анимационное раскачивание // 'взамен css.lightswitch-shake на кн.idBtnLightSwitch
							}
						}, 100);
					}
					setMsgBoxItemTooltip(eVent, "tooltip_lightswitch-show"); // установить всплывающую подсказку к элементу в MsgBox
				}
			}
		}
		// x // function ball_onClick(eVent) {
		// 	if (eVent.target.classList.contains('lightswitch-ball')) { // idBtnLightSwitch
		// 		// (i) не помогает (в firefox моб.вар.все равно срабатывает 2-ды):
		// 		// 'eVent.preventDefault();
		// 		// ''eVent.stopPropagation();
		// 		// *меняем иконку на соответствующий режим спецэфф
		// 		setToggleMsgEffect(eVent.target); // переключение спецэффектов
		// 		jumpLightswitch(eVent.target); // анимационный толчок светового переключателя
		// 		setMsgBoxItemTooltip(eVent, "tooltip_lightswitch-show"); // установить всплывающую подсказку к элементу в MsgBox
		// 		eVent.target.removeEventListener('click', ball_onClick, false);
		// 		// function ball_onAnimationend(ev) { // для прекращения воспроизведения анимации
		// 		// 	ev.target.style.removeProperty('animation');
		// 		// 	eVent.target.removeEventListener('animationend', ball_onAnimationend, false);
		// 		// }
		// 		// eVent.target.addEventListener('animationend', ball_onAnimationend, false);
		// 	}
		// }
		e.target.addEventListener('pointerup', ball_onPointerup, false);
		// 'для событий мыши предотвращаем запуск и перехват браузером встроенного события pointercancel для процесса перетаскивания drag’n’drop для изображений
		// ''для сэнсорного эрана исп.css св-во: touch-action: none; см.в.lightswitch-ball
		e.target.ondragstart = () => false; // или так
		// e.target.ondragstart = function() { return false; };
	}
}
// x -
// function msgbox_onMousedown(e) {
// 	if (e.target.classList.contains('lightswitch-ball')) {
// 		// 'трансформация курсора - меняем вид курсора
// 		// e.target.style.animationPlayState = "paused";
// 		e.target.classList.add('cursor-grab');
// 		// 'определяем первоначальное положение координат Y |— X
// 		let eventClient = {
// 			X1: e.clientX,
// 			Y1: e.clientY,
// 			X2: e.clientX,
// 			Y2: e.clientY,
// 		};
// 		const iconLS = document.getElementById('idIconLightSwitch');
// 		let hIconLS = iconLS.offsetHeight;
// 		const msgText = document.getElementById('idMsgText');
// 		const iconFT = document.getElementById('idIconFingerToggle');
// 		const wraperLS = msgBox.querySelector('.lightswitch-wrapper');
// 		const initX = wraperLS.offsetLeft + (wraperLS.offsetWidth / 2); // 'определение положения т.на оси X
// 		const tooltipLS = msgBox.querySelector('.tooltip-lightswitch');
// 		const chainLS = e.target.parentElement.querySelector('.lightswitch-chain');
// 		if ((chainLS === null) || (chainLS !== Object(chainLS))) {
// 			chainLS = msgBox.querySelector('.lightswitch-chain');
// 		}
// 		let chainLength = chainLS.offsetHeight;
// 		let angle = 0; // rotateZ()
// 		let gip = 0;
// 		function getBallDrag(evn) {
// 			// 'evn.type - onMousemove
// 			// 'evn.target -.lightswitch-ball
// 			// .lightswitch-wrapper/idIconLightSwitch/idMsgText/idIconFingerToggle
// 			if (btnFT.classList.contains('msg-show')) { // уменьшение иконки, увеличение цепочки
// 				if (evn.clientY > eventClient.Y2) { // тянем цепу вниз
// 					hIconLS = hIconLS + (eventClient.Y2 - evn.clientY); // 70, 69, .., 0: уменьшение
// 					if (hIconLS < 0) {
// 						hIconLS = 0;
// 					}
// 				} else if (evn.clientY < eventClient.Y2) { // тянем цепу вверх
// 					hIconLS = hIconLS + (eventClient.Y2 - evn.clientY); // 0, .., 69, 70: увеличение
// 					if (hIconLS > 70) {
// 						hIconLS = 70;
// 					}
// 				}
// 			} else if (btnFT.classList.contains('msg-hide')) { // увеличение иконки, уменьшение цепочки
// 				if (evn.clientY > eventClient.Y2) { // тянем цепу вниз
// 					hIconLS = hIconLS + (evn.clientY - eventClient.Y2); // 0, .., 69, 70: увеличение
// 					if (hIconLS > 70) { // доступный диапазон с 0 до 70 включительно
// 						hIconLS = 70;
// 					}
// 				} else if (evn.clientY < eventClient.Y2) { // тянем цепу вверх
// 					hIconLS = hIconLS + (evn.clientY - eventClient.Y2); // 70, 69, .., 0: уменьшение
// 					if (hIconLS < 0) { // доступный диапазон с 70 до 0 включительно
// 						hIconLS = 0;
// 					}
// 				}
// 			}
// 			// .lightswitch-chain
// 			chainLength = chainLength + (evn.clientY - eventClient.Y2) + (iconLS.offsetHeight - hIconLS); // увеличение, а уменьшение за счет отрицат.знач.evn.clientY
// 			// *получаем угол в градусах и переводим в радианы
// 			// (i) угол в градусах - единица измерения углов, которая равна 1/360 полного оборота по окружности (1deg = π/180rad ≈ 0,01745rad)
// 			// (i) Math.atan2 возвращает угол в плоскости (в радианах) между положительной осью X и лучом от (0, 0) до точки (x, y) для Math.atan2(y, x)
// 			// angle = (Math.atan2(chainLength, evn.clientX - initX)) * (180 / Math.PI); // получаем угол в радианах и переводим в градусы
// 			angle = Math.atan2(chainLength + (wraperLS.offsetWidth / 2), evn.clientX - initX) * (180 / Math.PI); // получаем угол в радианах и переводим в градусы
// 			angle = angle - 90;
// 			// (i) теорема Пифагора: квадрат гипотенузы = сумме квадратов катетов
// 			// gip = Math.round(Math.sqrt(Math.pow((evn.clientX - initX), 2) + Math.pow((evn.clientY - originY), 2)));
// 			// gip = Math.round(Math.sqrt(Math.pow((evn.clientX - initX), 2) + Math.pow(chainLength, 2)));
// 			gip = Math.round(Math.sqrt(Math.pow(evn.clientX - initX, 2) + Math.pow(chainLength + (wraperLS.offsetWidth / 2), 2)));
// 			gip = gip - (wraperLS.offsetWidth / 2); // (?)'не понятно почему должна учитываться доп.target.offsetHeight/2 (заменена на ширину) без нее курсор будет на самом левом крае
// 			// обновляем переменные
// 			eventClient.X2 = evn.clientX;
// 			eventClient.Y2 = evn.clientY;
// 		}
// 		function ball_onMousemove(eVent) {
// 			eVent.target.classList.replace('cursor-grab', 'cursor-grabbing');
// 			tooltipLS.classList.add('tooltip_lightswitch-hide'); // принудительное скрытие подсказки
// 			getBallDrag(eVent);
// 			iconLS.style.height = hIconLS + "px";
// 			msgText.style.overflow = "hidden";
// 			msgText.style.height = hIconLS + "px";
// 			iconFT.style.height = hIconLS + "px";
// 			wraperLS.style.top = hIconLS + "px"; // выс.иконки+margin-top: 70+6=76
// 			chainLS.style.height = gip + "px";
// 			// tooltipLS.style.transform = "rotateZ(" + (0 - angle) + "deg) translate(40px, -70px)";
// 			wraperLS.style.transform = "rotateZ(" + angle + "deg)";
// 			// eVent.preventDefault(); // (i) похоже работает и так, проверено на yabrowser, chrome, firefox (кроме моб.вар.)
// 			if (hIconLS > 10) {
// 				// 'удаляем css св-ва
// 				iconLS.style.removeProperty('margin');
// 				iconLS.style.removeProperty('padding');
// 				iconLS.style.removeProperty('border');

// 				msgText.style.removeProperty('overflow');
// 				msgText.style.removeProperty('margin');
// 				msgText.style.removeProperty('padding');
// 				msgText.style.removeProperty('border');

// 				iconFT.style.removeProperty('margin');
// 				iconFT.style.removeProperty('padding');
// 				iconFT.style.removeProperty('border');
// 			} else {
// 				iconLS.style.margin = 0;
// 				iconLS.style.padding = 0;
// 				iconLS.style.border = 0;

// 				msgText.style.margin = 0;
// 				msgText.style.padding = 0;
// 				msgText.style.border = 0;

// 				iconFT.style.margin = 0;
// 				iconFT.style.padding = 0;
// 				iconFT.style.border = 0;
// 			}
// 		}
// 		document.addEventListener('mousemove', ball_onMousemove, false);
// 		function setBallDrag(evn) {
// 			if (hIconLS <= 0) {
// 				btnFT.classList.replace('msg-show', 'msg-hide');
// 			} else {
// 				btnFT.classList.replace('msg-hide', 'msg-show');
// 			}
// 			wraperLS.style.transform = "rotateZ(0deg)";
// 			// tooltipLS.style.transform = "rotateZ(0deg)";
// 			if (angle > 0) {
// 				btnLS.classList.add('lightswitch-shake');
// 			} else {
// 				btnLS.classList.add('lightswitch-shake-reverse');
// 			}
// 			setTimeout(() => { // 'короткое разовое качание кн.переключателя
// 				btnLS.classList.remove('lightswitch-shake');
// 				btnLS.classList.remove('lightswitch-shake-reverse');
// 			}, 2500);
// 			iconLS.removeAttribute('style');
// 			msgText.removeAttribute('style');
// 			iconFT.removeAttribute('style');
// 			chainLS.removeAttribute('style');
// 			wraperLS.removeAttribute('style');
// 			// tooltipLS.removeAttribute('style');
// 		}
// 		function ball_onMouseup(eVent) {
// 			setBallDrag(eVent);
// 			eVent.target.classList.remove('cursor-grabbing');
// 			eVent.target.classList.remove('cursor-grab');
// 			tooltipLS.classList.remove('tooltip_lightswitch-hide'); // убираем принудительное скрытие подсказки
// 			document.removeEventListener('mousemove', ball_onMousemove, false);
// 			document.removeEventListener('mouseup', ball_onMouseup, false);
// 			// '
// 			if ((eventClient.Y1 === eVent.clientY || eventClient.Y1 === eventClient.Y2) && (eventClient.X1 === eVent.clientX || eventClient.X1 === eventClient.X2)) {
// 				if (btnFT.classList.contains('msg-show')) {
// 					eVent.target.addEventListener('click', ball_onClick, false);
// 				}
// 			}
// 		}
// 		function ball_onClick(eVent) {
// 			if (eVent.target.classList.contains('lightswitch-ball')) { // idBtnLightSwitch
// 				// *меняем иконку на соответствующий режим спецэфф
// 				setToggleMsgEffect(eVent.target); // переключение спецэффектов
// 				jumpLightswitch(eVent.target); // анимационный толчок светового переключателя
// 				setMsgBoxItemTooltip(eVent, "tooltip_lightswitch-show"); // установить всплывающую подсказку к элементу в MsgBox // (!) не срабатывает для мобильной версии firefox (добавлен и здесь)
// 				eVent.target.removeEventListener('click', ball_onClick, false);
// 				// function ball_onAnimationend(ev) { // для прекращения воспроизведения анимации
// 				// 	ev.target.style.removeProperty('animation');
// 				// 	eVent.target.removeEventListener('animationend', ball_onAnimationend, false);
// 				// }
// 				// eVent.target.addEventListener('animationend', ball_onAnimationend, false);
// 			}
// 		}
// 		document.addEventListener('mouseup', ball_onMouseup, false);
// 	}
// }
// // x -
// function msgbox_onTouchstart(e) {
// 	if (e.target.classList.contains('lightswitch-ball')) {
// 		// 'трансформация курсора - меняем вид курсора
// 		// e.target.style.animationPlayState = "paused";
// 		const touch = e.touches[0]; // получаем первое касание - все пальцы, кот.сейчас взаимодействуют с экраном ("коснуты" экрана)
// 		// 'определяем первоначальное положение координат Y |— X
// 		let touchClient = {
// 			X1: touch.clientX,
// 			Y1: touch.clientY,
// 			X2: touch.clientX,
// 			Y2: touch.clientY,
// 		};
// 		const iconLS = document.getElementById('idIconLightSwitch');
// 		let hIconLS = iconLS.offsetHeight;
// 		const msgText = document.getElementById('idMsgText');
// 		const iconFT = document.getElementById('idIconFingerToggle');
// 		const wraperLS = msgBox.querySelector('.lightswitch-wrapper');
// 		const tooltipLS = msgBox.querySelector('.tooltip-lightswitch');
// 		const chainLS = e.target.parentElement.querySelector('.lightswitch-chain');
// 		if ((chainLS === null) || (chainLS !== Object(chainLS))) {
// 			chainLS = msgBox.querySelector('.lightswitch-chain');
// 		}
// 		let chainLength = chainLS.offsetHeight;
// 		let angle = 0; // rotateZ()
// 		let gip = 0;
// 		function getBallDrag(evn) {
// 			// 'evn.type - onTouchstart
// 			// 'evn.touch -.lightswitch-ball
// 			const initX = wraperLS.offsetLeft + (wraperLS.offsetWidth / 2); // 'переопределение положения т.на оси X
// 			// .lightswitch-wrapper/idIconLightSwitch/idMsgText/idIconFingerToggle
// 			if (btnFT.classList.contains('msg-show')) { // уменьшение иконки, увеличение цепочки
// 				if (evn.touches[0].clientY > touchClient.Y2) { // тянем цепу вниз
// 					hIconLS = hIconLS + (touchClient.Y2 - evn.touches[0].clientY); // 70, 69, .., 0: уменьшение
// 					if (hIconLS < 0) {
// 						hIconLS = 0;
// 					}
// 				} else if (evn.touches[0].clientY < touchClient.Y2) { // тянем цепу вверх
// 					hIconLS = hIconLS + (touchClient.Y2 - evn.touches[0].clientY); // 0, .., 69, 70: увеличение
// 					if (hIconLS > 70) {
// 						hIconLS = 70;
// 					}
// 				}
// 			} else if (btnFT.classList.contains('msg-hide')) { // увеличение иконки, уменьшение цепочки
// 				if (evn.touches[0].clientY > touchClient.Y2) { // тянем цепу вниз
// 					hIconLS = hIconLS + (evn.touches[0].clientY - touchClient.Y2); // 0, .., 69, 70: увеличение
// 					if (hIconLS > 70) { // доступный диапазон с 0 до 70 включительно
// 						hIconLS = 70;
// 					}
// 				} else if (evn.touches[0].clientY < touchClient.Y2) { // тянем цепу вверх
// 					hIconLS = hIconLS + (evn.touches[0].clientY - touchClient.Y2); // 70, 69, .., 0: уменьшение
// 					if (hIconLS < 0) { // доступный диапазон с 70 до 0 включительно
// 						hIconLS = 0;
// 					}
// 				}
// 			}
// 			// .lightswitch-chain
// 			chainLength = chainLength + (evn.touches[0].clientY - touchClient.Y2) + (iconLS.offsetHeight - hIconLS); // увеличение, а уменьшение за счет отрицат.знач.evn.clientY
// 			// *получаем угол в градусах и переводим в радианы
// 			// (i) угол в градусах - единица измерения углов, которая равна 1/360 полного оборота по окружности (1deg = π/180rad ≈ 0,01745rad)
// 			// (i) Math.atan2 возвращает угол в плоскости (в радианах) между положительной осью X и лучом от (0, 0) до точки (x, y) для Math.atan2(y, x)
// 			// angle = (Math.atan2(chainLength, evn.clientX - initX)) * (180 / Math.PI); // получаем угол в радианах и переводим в градусы
// 			angle = Math.atan2(chainLength + (wraperLS.offsetWidth / 2), evn.touches[0].clientX - initX) * (180 / Math.PI); // получаем угол в радианах и переводим в градусы
// 			angle = angle - 90;
// 			// (i) теорема Пифагора: квадрат гипотенузы = сумме квадратов катетов
// 			// gip = Math.round(Math.sqrt(Math.pow((evn.clientX - initX), 2) + Math.pow((evn.clientY - originY), 2)));
// 			// gip = Math.round(Math.sqrt(Math.pow((evn.clientX - initX), 2) + Math.pow(chainLength, 2)));
// 			gip = Math.round(Math.sqrt(Math.pow(evn.touches[0].clientX - initX, 2) + Math.pow(chainLength + (wraperLS.offsetWidth / 2), 2)));
// 			gip = gip - (wraperLS.offsetWidth / 2); // (?)'не понятно почему должна учитываться доп.target/touch.offsetHeight/2 (заменена на ширину) без нее курсор будет на самом левом крае
// 			// обновляем переменные
// 			touchClient.X2 = evn.touches[0].clientX;
// 			touchClient.Y2 = evn.touches[0].clientY;
// 		}
// 		function ball_onTouchmove(eVent) {
// 			tooltipLS.classList.add('tooltip_lightswitch-hide'); // принудительное скрытие подсказки
// 			getBallDrag(eVent);
// 			iconLS.style.height = hIconLS + "px";
// 			msgText.style.overflow = "hidden";
// 			msgText.style.height = hIconLS + "px";
// 			iconFT.style.height = hIconLS + "px";
// 			wraperLS.style.top = hIconLS + "px"; // выс.иконки+margin-top: 70+6=76
// 			chainLS.style.height = gip + "px";
// 			// tooltipLS.style.transform = "rotateZ(" + (0 - angle) + "deg) translate(40px, -70px)";
// 			wraperLS.style.transform = "rotateZ(" + angle + "deg)";
// 			// eVent.preventDefault(); // (i) в прослушивателе установлен passive: false для возможности применения, НО похоже работает и так, проверено на yabrowser, chrome, firefox (кроме моб.вар.)
// 			if (hIconLS > 10) {
// 				// 'удаляем css св-ва
// 				iconLS.style.removeProperty('margin');
// 				iconLS.style.removeProperty('padding');
// 				iconLS.style.removeProperty('border');

// 				msgText.style.removeProperty('overflow');
// 				msgText.style.removeProperty('margin');
// 				msgText.style.removeProperty('padding');
// 				msgText.style.removeProperty('border');

// 				iconFT.style.removeProperty('margin');
// 				iconFT.style.removeProperty('padding');
// 				iconFT.style.removeProperty('border');
// 			} else {
// 				iconLS.style.margin = 0;
// 				iconLS.style.padding = 0;
// 				iconLS.style.border = 0;

// 				msgText.style.margin = 0;
// 				msgText.style.padding = 0;
// 				msgText.style.border = 0;

// 				iconFT.style.margin = 0;
// 				iconFT.style.padding = 0;
// 				iconFT.style.border = 0;
// 			}
// 		}
// 		document.addEventListener('touchmove', ball_onTouchmove, {passive: false}); // passive - по умолчанию true для touchstart/touchmove - обработчик никогда не вызовет preventDefault(). Если вызов будет произведен, браузер его проигнорит и сгенерирует консольное предупреждение
// 		function setBallDrag(evn) {
// 			if (hIconLS <= 0) {
// 				btnFT.classList.replace('msg-show', 'msg-hide');
// 			} else {
// 				btnFT.classList.replace('msg-hide', 'msg-show');
// 			}
// 			wraperLS.style.transform = "rotateZ(0deg)";
// 			// tooltipLS.style.transform = "rotateZ(0deg)";
// 			if (angle > 0) {
// 				btnLS.classList.add('lightswitch-shake');
// 			} else {
// 				btnLS.classList.add('lightswitch-shake-reverse');
// 			}
// 			setTimeout(() => { // 'короткое разовое качание кн.переключателя
// 				btnLS.classList.remove('lightswitch-shake');
// 				btnLS.classList.remove('lightswitch-shake-reverse');
// 			}, 2500);
// 			iconLS.removeAttribute('style');
// 			msgText.removeAttribute('style');
// 			iconFT.removeAttribute('style');
// 			chainLS.removeAttribute('style');
// 			wraperLS.removeAttribute('style');
// 			// tooltipLS.removeAttribute('style');
// 		}
// 		function ball_onTouchend(eVent) {
// 			setBallDrag(eVent);
// 			tooltipLS.classList.remove('tooltip_lightswitch-hide'); // убираем принудительное скрытие подсказки
// 			document.removeEventListener('touchmove', ball_onTouchmove, {passive: false}); // passive - по умолчанию true для touchstart/touchmove - обработчик никогда не вызовет preventDefault(). Если вызов будет произведен, браузер его проигнорит и сгенерирует консольное предупреждение
// 			document.removeEventListener('touchend', ball_onTouchend, false);
// 			// '
// 			if ((touchClient.Y1 === eVent.changedTouches[0].clientY || touchClient.Y1 === touchClient.Y2) && (touchClient.X1 === eVent.changedTouches[0].clientX || touchClient.X1 === touchClient.X2)) {
// 				if (btnFT.classList.contains('msg-show')) {
// 					eVent.target.addEventListener('click', ball_onClick, false);
// 				}
// 			}
// 		}
// 		function ball_onClick(eVent) {
// 			if (eVent.target.classList.contains('lightswitch-ball')) { // idBtnLightSwitch
// 				// *меняем иконку на соответствующий режим спецэфф
// 				setToggleMsgEffect(eVent.target); // переключение спецэффектов
// 				jumpLightswitch(eVent.target); // анимационный толчок светового переключателя
// 				setMsgBoxItemTooltip(eVent, "tooltip_lightswitch-show"); // установить всплывающую подсказку к элементу в MsgBox // (!) не срабатывает для мобильной версии firefox
// 				eVent.target.removeEventListener('click', ball_onClick, false);
// 				// function ball_onAnimationend(evt) { // для прекращения воспроизведения анимации
// 				// 	evt.target.style.removeProperty('animation');
// 				// 	eVent.target.removeEventListener('animationend', ball_onAnimationend, false);
// 				// }
// 				// eVent.target.addEventListener('animationend', ball_onAnimationend, false);
// 			}
// 		}
// 		document.addEventListener('touchend', ball_onTouchend, false);
// 	}
// }
// // x -
// // для событий mouse & touch // (i) код громоздкий + доп.проверка event.type или ф.isMobile() // (!) для firefox не сработает нет поддержки
// function msgbox_onStartDown(e) {
// 	if (e.target.classList.contains('lightswitch-ball')) {
// 		const iconLS = document.getElementById('idIconLightSwitch');
// 		let hIconLS = iconLS.offsetHeight;
// 		const msgText = document.getElementById('idMsgText');
// 		const iconFT = document.getElementById('idIconFingerToggle');
// 		const wraperLS = msgBox.querySelector('.lightswitch-wrapper');
// 		const initX = wraperLS.offsetLeft + (wraperLS.offsetWidth / 2); // 'определение положения т.на оси X
// 		const tooltipLS = msgBox.querySelector('.tooltip-lightswitch');
// 		const chainLS = e.target.parentElement.querySelector('.lightswitch-chain');
// 		if ((chainLS === null) || (chainLS !== Object(chainLS))) {
// 			chainLS = msgBox.querySelector('.lightswitch-chain');
// 		}
// 		let chainLength = chainLS.offsetHeight;
// 		let angle = 0; // rotateZ()
// 		let gip = 0;
// 		if (e.type === "touchstart") { // моя ф.isMobile() - проверить устройство на кот.исп.браузер // (!) для firefox не сработает нет поддержки
// 			const touch = e.touches[0]; // получаем первое касание - все пальцы, кот.сейчас взаимодействуют с экраном ("коснуты" экрана)
// 			// 'определяем первоначальное положение координат Y |— X
// 			var touchClient = {
// 				X1: touch.clientX,
// 				Y1: touch.clientY,
// 				X2: touch.clientX,
// 				Y2: touch.clientY,
// 			};
// 		} else if (e.type === "mousedown") { // - desktop - Windows NT...
// 			// 'трансформация курсора - меняем вид курсора
// 			// e.target.style.animationPlayState = "paused";
// 			e.target.classList.add('cursor-grab');
// 			// 'определяем первоначальное положение координат Y |— X
// 			var eventClient = {
// 				X1: e.clientX,
// 				Y1: e.clientY,
// 				X2: e.clientX,
// 				Y2: e.clientY,
// 			};
// 		}
// 		function getBallDrag(evn) {
// 			// 'evn.type - onMousemove/onTouchmove
// 			// 'evn.target/touch -.lightswitch-ball
// 			// .lightswitch-wrapper/idIconLightSwitch/idMsgText/idIconFingerToggle
// 			if (evn.type === "touchmove") { // моя ф.isMobile() - проверить устройство на кот.исп.браузер // (!) для firefox не сработает нет поддержки
// 				if (btnFT.classList.contains('msg-show')) { // уменьшение иконки, увеличение цепочки
// 					if (evn.touches[0].clientY > touchClient.Y2) { // тянем цепу вниз
// 						hIconLS = hIconLS + (touchClient.Y2 - evn.touches[0].clientY); // 70, 69, .., 0: уменьшение
// 						if (hIconLS < 0) {
// 							hIconLS = 0;
// 						}
// 					} else if (evn.touches[0].clientY < touchClient.Y2) { // тянем цепу вверх
// 						hIconLS = hIconLS + (touchClient.Y2 - evn.touches[0].clientY); // 0, .., 69, 70: увеличение
// 						if (hIconLS > 70) {
// 							hIconLS = 70;
// 						}
// 					}
// 				} else if (btnFT.classList.contains('msg-hide')) { // увеличение иконки, уменьшение цепочки
// 					if (evn.touches[0].clientY > touchClient.Y2) { // тянем цепу вниз
// 						hIconLS = hIconLS + (evn.touches[0].clientY - touchClient.Y2); // 0, .., 69, 70: увеличение
// 						if (hIconLS > 70) { // доступный диапазон с 0 до 70 включительно
// 							hIconLS = 70;
// 						}
// 					} else if (evn.touches[0].clientY < touchClient.Y2) { // тянем цепу вверх
// 						hIconLS = hIconLS + (evn.touches[0].clientY - touchClient.Y2); // 70, 69, .., 0: уменьшение
// 						if (hIconLS < 0) { // доступный диапазон с 70 до 0 включительно
// 							hIconLS = 0;
// 						}
// 					}
// 				}
// 				// .lightswitch-chain
// 				chainLength = chainLength + (evn.touches[0].clientY - touchClient.Y2) + (iconLS.offsetHeight - hIconLS); // увеличение, а уменьшение за счет отрицат.знач.evn.clientY
// 				// *получаем угол в градусах и переводим в радианы
// 				// (i) угол в градусах - единица измерения углов, которая равна 1/360 полного оборота по окружности (1deg = π/180rad ≈ 0,01745rad)
// 				// (i) Math.atan2 возвращает угол в плоскости (в радианах) между положительной осью X и лучом от (0, 0) до точки (x, y) для Math.atan2(y, x)
// 				// angle = (Math.atan2(chainLength, evn.clientX - initX)) * (180 / Math.PI); // получаем угол в радианах и переводим в градусы
// 				angle = Math.atan2(chainLength + (wraperLS.offsetWidth / 2), evn.touches[0].clientX - initX) * (180 / Math.PI); // получаем угол в радианах и переводим в градусы
// 				angle = angle - 90;
// 				// (i) теорема Пифагора: квадрат гипотенузы = сумме квадратов катетов
// 				// gip = Math.round(Math.sqrt(Math.pow((evn.clientX - initX), 2) + Math.pow((evn.clientY - originY), 2)));
// 				// gip = Math.round(Math.sqrt(Math.pow((evn.clientX - initX), 2) + Math.pow(chainLength, 2)));
// 				gip = Math.round(Math.sqrt(Math.pow(evn.touches[0].clientX - initX, 2) + Math.pow(chainLength + (wraperLS.offsetWidth / 2), 2)));
// 				gip = gip - (wraperLS.offsetWidth / 2); // (?)'не понятно почему должна учитываться доп.target/touch.offsetHeight/2 (заменена на ширину) без нее курсор будет на самом левом крае
// 				// обновляем переменные
// 				touchClient.X2 = evn.touches[0].clientX;
// 				touchClient.Y2 = evn.touches[0].clientY;
// 			} else if (evn.type === "mousemove") { // - desktop - Windows NT...
// 				if (btnFT.classList.contains('msg-show')) { // уменьшение иконки, увеличение цепочки
// 					if (evn.clientY > eventClient.Y2) { // тянем цепу вниз
// 						hIconLS = hIconLS + (eventClient.Y2 - evn.clientY); // 70, 69, .., 0: уменьшение
// 						if (hIconLS < 0) {
// 							hIconLS = 0;
// 						}
// 					} else if (evn.clientY < eventClient.Y2) { // тянем цепу вверх
// 						hIconLS = hIconLS + (eventClient.Y2 - evn.clientY); // 0, .., 69, 70: увеличение
// 						if (hIconLS > 70) {
// 							hIconLS = 70;
// 						}
// 					}
// 				} else if (btnFT.classList.contains('msg-hide')) { // увеличение иконки, уменьшение цепочки
// 					if (evn.clientY > eventClient.Y2) { // тянем цепу вниз
// 						hIconLS = hIconLS + (evn.clientY - eventClient.Y2); // 0, .., 69, 70: увеличение
// 						if (hIconLS > 70) { // доступный диапазон с 0 до 70 включительно
// 							hIconLS = 70;
// 						}
// 					} else if (evn.clientY < eventClient.Y2) { // тянем цепу вверх
// 						hIconLS = hIconLS + (evn.clientY - eventClient.Y2); // 70, 69, .., 0: уменьшение
// 						if (hIconLS < 0) { // доступный диапазон с 70 до 0 включительно
// 							hIconLS = 0;
// 						}
// 					}
// 				}
// 				// .lightswitch-chain
// 				chainLength = chainLength + (evn.clientY - eventClient.Y2) + (iconLS.offsetHeight - hIconLS); // увеличение, а уменьшение за счет отрицат.знач.evn.clientY
// 				// *получаем угол в градусах и переводим в радианы
// 				// (i) угол в градусах - единица измерения углов, которая равна 1/360 полного оборота по окружности (1deg = π/180rad ≈ 0,01745rad)
// 				// (i) Math.atan2 возвращает угол в плоскости (в радианах) между положительной осью X и лучом от (0, 0) до точки (x, y) для Math.atan2(y, x)
// 				// angle = (Math.atan2(chainLength, evn.clientX - initX)) * (180 / Math.PI); // получаем угол в радианах и переводим в градусы
// 				angle = Math.atan2(chainLength + (wraperLS.offsetWidth / 2), evn.clientX - initX) * (180 / Math.PI); // получаем угол в радианах и переводим в градусы
// 				angle = angle - 90;
// 				// (i) теорема Пифагора: квадрат гипотенузы = сумме квадратов катетов
// 				// gip = Math.round(Math.sqrt(Math.pow((evn.clientX - initX), 2) + Math.pow((evn.clientY - originY), 2)));
// 				// gip = Math.round(Math.sqrt(Math.pow((evn.clientX - initX), 2) + Math.pow(chainLength, 2)));
// 				gip = Math.round(Math.sqrt(Math.pow(evn.clientX - initX, 2) + Math.pow(chainLength + (wraperLS.offsetWidth / 2), 2)));
// 				gip = gip - (wraperLS.offsetWidth / 2); // (?)'не понятно почему должна учитываться доп.target.offsetHeight/2 (заменена на ширину) без нее курсор будет на самом левом крае
// 				// обновляем переменные
// 				eventClient.X2 = evn.clientX;
// 				eventClient.Y2 = evn.clientY;
// 			}
// 		}
// 		function ball_onMove(eVent) {
// 			eVent.target.classList.replace('cursor-grab', 'cursor-grabbing');
// 			tooltipLS.classList.add('tooltip_lightswitch-hide');
// 			getBallDrag(eVent);
// 			iconLS.style.height = hIconLS + "px";
// 			msgText.style.overflow = "hidden";
// 			msgText.style.height = hIconLS + "px";
// 			iconFT.style.height = hIconLS + "px";
// 			wraperLS.style.top = hIconLS + "px"; // выс.иконки+margin-top: 70+6=76
// 			chainLS.style.height = gip + "px";
// 			// tooltipLS.style.transform = "rotateZ(" + (0 - angle) + "deg) translate(40px, -70px)";
// 			wraperLS.style.transform = "rotateZ(" + angle + "deg)";
// 			// (i) в прослушивателе установлен passive: false для возможности применения, НО похоже работает и так, проверено на yabrowser, chrome, firefox (кроме моб.вар.)
// 			// if (eVent.type === "mousemove") {
// 			// 	eVent.preventDefault();
// 			// }
// 			if (hIconLS > 10) {
// 				// 'удаляем css св-ва
// 				iconLS.style.removeProperty('margin');
// 				iconLS.style.removeProperty('padding');
// 				iconLS.style.removeProperty('border');

// 				msgText.style.removeProperty('overflow');
// 				msgText.style.removeProperty('margin');
// 				msgText.style.removeProperty('padding');
// 				msgText.style.removeProperty('border');

// 				iconFT.style.removeProperty('margin');
// 				iconFT.style.removeProperty('padding');
// 				iconFT.style.removeProperty('border');
// 			} else {
// 				iconLS.style.margin = 0;
// 				iconLS.style.padding = 0;
// 				iconLS.style.border = 0;

// 				msgText.style.margin = 0;
// 				msgText.style.padding = 0;
// 				msgText.style.border = 0;

// 				iconFT.style.margin = 0;
// 				iconFT.style.padding = 0;
// 				iconFT.style.border = 0;
// 			}
// 		}
// 		if (e.type === "touchstart") { // моя ф.isMobile() - проверить устройство на кот.исп.браузер // (!) для firefox не сработает нет поддержки
// 			document.addEventListener('touchmove', ball_onMove, {passive: false}); // passive - по умолчанию true для touchstart/touchmove - обработчик никогда не вызовет preventDefault(). Если вызов будет произведен, браузер его проигнорит и сгенерирует консольное предупреждение
// 		} else if (e.type === "mousedown") { // - desktop - Windows NT...
// 			document.addEventListener('mousemove', ball_onMove, false);
// 		}
// 		function setBallDrag(evn) {
// 			if (hIconLS <= 0) {
// 				btnFT.classList.replace('msg-show', 'msg-hide');
// 			} else {
// 				btnFT.classList.replace('msg-hide', 'msg-show');
// 			}
// 			wraperLS.style.transform = "rotateZ(0deg)";
// 			// tooltipLS.style.transform = "rotateZ(0deg)";
// 			if (angle > 0) {
// 				btnLS.classList.add('lightswitch-shake');
// 			} else {
// 				btnLS.classList.add('lightswitch-shake-reverse');
// 			}
// 			setTimeout(() => { // 'короткое разовое качание кн.переключателя
// 				btnLS.classList.remove('lightswitch-shake');
// 				btnLS.classList.remove('lightswitch-shake-reverse');
// 			}, 2500);
// 			iconLS.removeAttribute('style');
// 			msgText.removeAttribute('style');
// 			iconFT.removeAttribute('style');
// 			chainLS.removeAttribute('style');
// 			wraperLS.removeAttribute('style');
// 			// tooltipLS.removeAttribute('style');
// 		}
// 		function ball_onEndUp(eVent) {
// 			setBallDrag(eVent);
// 			eVent.target.classList.remove('cursor-grabbing');
// 			eVent.target.classList.remove('cursor-grab');
// 			tooltipLS.classList.remove('tooltip_lightswitch-hide');
// 			document.removeEventListener('touchmove', ball_onMove, {passive: false}); // passive - по умолчанию true для touchstart/touchmove - обработчик никогда не вызовет preventDefault(). Если вызов будет произведен, браузер его проигнорит и сгенерирует консольное предупреждение
// 			document.removeEventListener('touchend', ball_onEndUp, false);
// 			// '
// 			if (eVent.type === "touchend") { // моя ф.isMobile() - проверить устройство на кот.исп.браузер // (!) для firefox не сработает нет поддержки
// 				if ((touchClient.Y1 === eVent.changedTouches[0].clientY || touchClient.Y1 === touchClient.Y2) && (touchClient.X1 === eVent.changedTouches[0].clientX || touchClient.X1 === touchClient.X2)) {
// 					if (btnFT.classList.contains('msg-show')) {
// 						eVent.target.addEventListener('click', ball_onClick, false);
// 					}
// 				}
// 			} else if (eVent.type === "mouseup") { // - desktop - Windows NT...
// 				if ((eventClient.Y1 === eVent.clientY || eventClient.Y1 === eventClient.Y2) && (eventClient.X1 === eVent.clientX || eventClient.X1 === eventClient.X2)) {
// 					if (btnFT.classList.contains('msg-show')) {
// 						eVent.target.addEventListener('click', ball_onClick, false);
// 					}
// 				}
// 			}
// 		}
// 		function ball_onClick(eVent) {
// 			if (eVent.target.classList.contains('lightswitch-ball')) { // idBtnLightSwitch
// 				// *меняем иконку на соответствующий режим спецэфф
// 				setToggleMsgEffect(eVent.target); // переключение спецэффектов
// 				jumpLightswitch(eVent.target); // анимационный толчок светового переключателя
// 				eVent.target.removeEventListener('click', ball_onClick, false);
// 				// function ball_onAnimationend(evt) { // для прекращения воспроизведения анимации
// 				// 	evt.target.style.removeProperty('animation');
// 				// 	eVent.target.removeEventListener('animationend', ball_onAnimationend, false);
// 				// }
// 				// eVent.target.addEventListener('animationend', ball_onAnimationend, false);
// 			}
// 		}
// 		if (eVent.type === "touchstart") { // моя ф.isMobile() - проверить устройство на кот.исп.браузер // (!) для firefox не сработает нет поддержки
// 			document.addEventListener('touchend', ball_onEndUp, false);
// 		} else if (eVent.type === "mousedown") { // - desktop - Windows NT...
// 			document.addEventListener('mouseup', ball_onEndUp, false);
// 		}
// 	}
// }


// (!) анимационный толчок светового переключателя
function jumpLightswitch(elem) {
	// x // 'elem - idBtnLightSwitch>.lightswitch-ball
	// 'elem - .lightswitch-chain
	if (elem === null || typeof(elem) === "undefined" && typeof(elem) !== "object" || elem !== Object(elem)) {
		console.error(`(!) Косяк - не удалось осуществить анимационный толчок светового переключателя - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function jumpLightswitch(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк - не удалось осуществить анимационный толчок светового переключателя - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	elem.style.animation = "jump-lightswitch";
	elem.style.animationDuration = ".1s"; // продолжительность 1-го цикла анимации
	elem.style.animationTimingFunction = "cubic-bezier(0.18, 0.89, 0.32, 1.28)"; // временнАя функция - описывает, как будет развиваться анимация между каждой парой ключевых кадров. *Во время задержки анимации временные функции не применяются
	elem.style.animationIterationCount = 1; // кол-во повторов - ск-ко раз проигрывается цикл анимации
	elem.style.animationDelay = "0ms"; // задержка
	function jumpLS_onAnimationend(eVent) {
		eVent.target.style.removeProperty('animation');
		eVent.target.removeEventListener('animationend', jumpLS_onAnimationend, false);
	}
	elem.addEventListener('animationend', jumpLS_onAnimationend, false);
}
// (!) переключение спецэффектов освещения
function setToggleMsgEffect(elem) {
	// 'elem - idBtnLightSwitch>.lightswitch-ball
	if (elem === null || typeof(elem) === "undefined" && typeof(elem) !== "object" || elem !== Object(elem)) {
		console.error(`(!) Косяк - не удалось переключить эффект - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setToggleMsgEffect(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк - не удалось переключить эффект - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	}
	const lightOn = new Audio("audio/switch-on.mp3");
	const lightOff = new Audio("audio/switch-off.mp3");

	if (elem.hasAttribute('class')) {
		let info2 = null; // эл.отображения пункта спецэфф.
		let el = elem; // idMsgBox
		while (!el.parentElement.classList.contains('topic-box')) {
			el = el.parentElement;
			if (el.classList.contains('topic-box')) {
				break;
			} else if (el.classList.contains('lightswitch-wrapper')) {
				info2 = el.querySelector('.tooltip-lightswitch-info2');
			}
		}
		// '.tooltip-lightswitch-info2
		if (info2 !== null && info2 === Object(info2)) {
			function setMode(value = "") {
				for (let i = 0; i < info2.children.length; i++) {
					if (info2.children[i].hasAttribute('mode')) {
						if (info2.children[i].getAttribute('mode') === value) { // вкл.- на переднем плане
							info2.children[i].removeAttribute('style');
							if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
								let msg = {
									value: "msgBoxUpdate",
									msgEffect: info2.children[i].getAttribute('mode')
								};
								window.top.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
							} else {
								window.top.vrsTopic.msgEffect = info2.children[i].getAttribute('mode');
							}
						} else {
							info2.children[i].style.display = "none";
						}
					}
				}
			}
			// 'idIconLightSwitch
			let icon = el.querySelector('[id=idIconLightSwitch]');
			if (icon !== null && icon === Object(icon)) {
				if (icon.classList.contains('msg_icon-eff_on')) {
					if (getPlayback("allowPlayback")) { // получить разрешение на воспроизведение
						lightOff.play();
					}
					if (icon.parentElement.hasAttribute('class')) {
						if (icon.parentElement.classList.contains('msg-content')) {
							icon.parentElement.classList.add('msg-bgr-content');
						}
					} else { // 'в качестве подстраховки
						el.querySelector('.msg-content').classList.add('msg-bgr-content');
					}
					icon.classList.replace('msg_icon-eff_on', 'msg_icon-eff_bgr');
					setMode("bgr"); // .tooltip-lightswitch-info2
				} else if (icon.classList.contains('msg_icon-eff_bgr')) {
					if (getPlayback("allowPlayback")) { // получить разрешение на воспроизведение
						lightOff.play();
					}
					if (icon.parentElement.hasAttribute('class')) {
						if (icon.parentElement.classList.contains('msg-content')) {
							icon.parentElement.classList.remove('msg-bgr-content');
						}
					} else { // 'в качестве подстраховки
						el.querySelector('.msg-bgr-content').classList.remove('msg-bgr-content');
					}
					el.classList.remove('msg-effect');
					icon.classList.replace('msg_icon-eff_bgr', 'msg_icon-eff_off');
					setMode("off"); // .tooltip-lightswitch-info2
				} else if (icon.classList.contains('msg_icon-eff_off')) {
					if (getPlayback("allowPlayback")) { // получить разрешение на воспроизведение
						lightOn.play();
					}
					el.classList.add('msg-effect');
					icon.classList.replace('msg_icon-eff_off', 'msg_icon-eff_on');
					setMode("on"); // .tooltip-lightswitch-info2
				}
			} else {
				console.warn(`(i) Проверка - не удалось изменить текст всплывающей подсказки - не найден элемент:\n function setToggleMsgEffect(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n icon: typeof(${typeof(icon)}) / Object(${Object(icon)}) / ${icon}`);
				alert(`(i) Проверка - не удалось изменить текст всплывающей подсказки - не найден элемент, см.консоль.`);
			}
		} else {
			console.warn(`(i) Проверка - не удалось изменить текст всплывающей подсказки - не найден элемент:\n function setToggleMsgEffect(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n info2: typeof(${typeof(info2)}) / Object(${Object(info2)}) / ${info2}`);
			alert(`(i) Проверка - не удалось изменить текст всплывающей подсказки - не найден элемент, см.консоль.`);
		}
	}
}
// (!) скрыть/показать всплывающее окно сообщения
function toggleMsgBox(elem) {
	// 'elem: idBtnToggleMsgBox/(?)idMsgBox
	// (!) в ф.topic.js переделать ф.setMsgBox с посылом сюда
	if (elem === null || typeof(elem) === "undefined" && typeof(elem) !== "object" || elem !== Object(elem)) {
		console.error(`(!) Косяк - не удалось скрыть/показать всплывающее окно сообщения - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function toggleMsgBox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem})`);
		alert(`(!) Косяк - не удалось скрыть/показать всплывающее окно сообщения - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return;
	} else if (!elem.hasAttribute('class')) {
		console.error(`(!) Косяк - не удалось скрыть/показать всплывающее окно сообщения - у элемента отсутствует класс, либо класс не определен:\n function toggleMsgBox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}):\n elem: ${elem.tagName}, ${elem.id}\n elem.classList: ${JSON.stringify(elem.classList, null, 1)}`);
		alert(`(!) Косяк - не удалось скрыть/показать всплывающее окно сообщения - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
		return;
	}
	// let wraper = elem.parentElement.querySelector('.lightswitch-wrapper');
	// let chain = wraper.querySelector('.lightswitch-chain');
	if (elem.classList.contains('msg-show')) { // скрываем
		// elem.classList.replace('msg-show', 'msg-hide'); // x -
		setShowOrHide(elem, "", "msg-show", "msg-hide");
		// *обновление глобальной переменной в variables.js
		if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
			let msg = {
				value: "msgBoxUpdate",
				msgBtn: false
			};
			window.top.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
		} else {
			window.top.vrsTopic.msgBtn = false;
		}
	} else if (elem.classList.contains('msg-hide')) { // отображаем
		// elem.classList.replace('msg-hide', 'msg-show'); // или так
		setShowOrHide(elem, "", "msg-hide", "msg-show");
		// *обновление глобальной переменной в variables.js
		if (window.location.origin === "file://" || window.location.origin === "null") { // при локальном использовании // (i) в Firefox origin = "null"
			let msg = {
				value: "msgBoxUpdate",
				msgBtn: true
			};
			window.top.postMessage(msg, '*'); // когда звездочка - это плохое использование в целях безопасности от взлома страниц // (?)
		} else {
			window.top.vrsTopic.msgBtn = true;
		}
	} else {
		console.error(`(!) Косяк - не удалось изменить элементу класс:\n function toggleMsgBox(elem: ${elem.tagName}, ${elem.id}):\n elem.classList: ${JSON.stringify(elem.classList, null, 1)}`);
		alert(`(!) Косяк - не удалось изменить элементу класс, см.консоль.`);
		return;
	}
}
function msgbox_onClick(eVent) {
	if (eVent.target.id === "idBtnToggleMsgBox") {
		toggleMsgBox(eVent.target); // скрыть/показать всплывающее окно сообщения
	} else if (eVent.target.id === "idIconLightSwitch") { // - указатель на переключение спецэфф.фона
		const wraperLS = msgBox.querySelector('.lightswitch-wrapper');
		if (wraperLS !== null && wraperLS === Object(wraperLS)) {
			if (audioElements.objBellSound.bellSound === null && audioElements.objBellSound.rustleChain === null) {
				audioElements.objBellSound.bellSound = new Audio("audio/bell-sound.mp3");
				audioElements.objBellSound.bellSound.preload = "auto"; // подготавливаем звук, чтобы он сразу был готов к воспроизведению
				audioElements.objBellSound.rustleChain = new Audio("audio/rustle-chain.mp3");
				audioElements.objBellSound.rustleChain.loop = true; // автоповтор
				audioElements.objBellSound.rustleChain.preload = "auto"; // подготавливаем звук, чтобы он сразу был готов к воспроизведению
				let idInt = setInterval(() => {
					if (audioElements.objBellSound.bellSound.paused && audioElements.objBellSound.rustleChain.paused) {
						clearInterval(idInt);
						setSwing(wraperLS, audioElements.objBellSound.bellSound.duration * 1000, audioElements.objBellSound); // анимационное раскачивание // 'взамен css.lightswitch-shake на кн.idBtnLightSwitch
					}
				}, 100);
			} else {
				if (audioElements.objBellSound.bellSound.currentTime > 0 && audioElements.objBellSound.rustleChain.currentTime > 0) {
					RAF_RESET = true;
				}
				let idInt = setInterval(() => {
					if (RAF_RESET === false) {
						clearInterval(idInt);
						setSwing(wraperLS, audioElements.objBellSound.bellSound.duration * 1000, audioElements.objBellSound); // анимационное раскачивание // 'взамен css.lightswitch-shake на кн.idBtnLightSwitch
					}
				}, 100);
			}
		}
		setMsgBoxItemTooltip(eVent, "tooltip_lightswitch-show"); // установить всплывающую подсказку к элементу в MsgBox

		// if (btnLS !== null && btnLS === Object(btnLS)) { // при исп.css.lightswitch-shake на кн.idBtnLightSwitch
		// 	btnLS.classList.add('lightswitch-shake');
		// 	if (getPlayback("allowPlayback")) {
		// 		bellSound.play();
		// 	}
		// 	setMsgBoxItemTooltip(eVent, "tooltip_lightswitch-show"); // установить всплывающую подсказку к элементу в MsgBox
		// }
	} else if (eVent.target.id === "idIconFingerToggle") { // - указатель на закрытие окна инфо
		setMsgBoxItemTooltip(eVent, "tooltip_finger_toggle-popup"); // установить всплывающую подсказку к элементу в MsgBox
	}
}
// (!) создание/удаление обработчиков событий для узла MsgBox
function setEventHandlersMsgBox(elem, addOrRemove = "add") {
	// 'elem - MsgBox/дочерние элементы
	if (addOrRemove !== "add" && addOrRemove !== "remove") {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setEventHandlersMsgBox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	if (typeof(elem) === "undefined" || elem === null || elem === null && (elem === Object(elem) || typeof(elem) === "object")) {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setEventHandlersMsgBox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}")`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	} else if (elem.id !== "idMsgBox" && !elem.classList.contains('msg-box')) {
		console.error(`(!) Косяк: не удалось создать/удалить обработчик события - у элемента отсутствует класс, либо класс не определен:\n function setEventHandlersMsgBox(elem: typeof(${typeof(elem)}) / Object(${Object(elem)}) / ${elem}, addOrRemove: "${addOrRemove}"):\n elem.id = «${elem.id}»\n elem.classList: ${elem.classList}`);
		alert(`(!) Косяк: не удалось создать/удалить обработчик события - у элемента отсутствует класс, либо класс не определен, см.консоль.`);
		return false;
	}
	// *добавляем/удаляем обработчики событий
	if (addOrRemove === "add") {
		// elem.addEventListener('animationend', msgbox_onAnimationend, false); // отключено
		elem.addEventListener('mouseover', msgbox_onMouseover, false);
		// 'mouse or touch
		// if (isMobile()) { // проверить устройство на кот.исп.браузер // (!) для firefox не сработает нет поддержки
		// 	elem.addEventListener('touchstart', msgbox_onTouchstart, {passive: false}); // passive - по умолчанию true для touchstart/touchmove - обработчик никогда не вызовет preventDefault(). Если вызов будет произведен, браузер его проигнорит и сгенерирует консольное предупреждение
		// } else { // - desktop - Windows NT...
		// 	elem.addEventListener('mousedown', msgbox_onMousedown, false);
		// }
		elem.addEventListener('pointerdown', msgbox_onPointerdown, false); // 'mouse & touch
		elem.addEventListener('click', msgbox_onClick, false);
	} else if (addOrRemove === "remove") {
		// elem.removeEventListener('animationend', msgbox_onAnimationend, false); // отключено
		elem.removeEventListener('mouseover', msgbox_onMouseover, false);
		// 'mouse or touch
		// if (isMobile()) { // проверить устройство на кот.исп.браузер // (!) для firefox не сработает нет поддержки
		// 	elem.removeEventListener('touchstart', msgbox_onTouchstart, {passive: false}); // passive - по умолчанию true для touchstart/touchmove - обработчик никогда не вызовет preventDefault(). Если вызов будет произведен, браузер его проигнорит и сгенерирует консольное предупреждение
		// } else { // - desktop - Windows NT...
		// 	elem.removeEventListener('mousedown', msgbox_onMousedown, false);
		// }
		elem.removeEventListener('pointerdown', msgbox_onPointerdown, false); // 'mouse & touch
		elem.removeEventListener('click', msgbox_onClick, false);
	}
	return true;
}