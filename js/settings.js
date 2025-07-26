// (!)*не 100% вариант
// (!) получить имя браузера
// (i) нет поддержки: Firefox/Firefox для Android/Safari/Safari на iOS/WebView Android
const getBrowser = function () {
	// (i) что вернет ф.:
	// 'string: "yabrowser" === getBrowser().toString().toLowerCase()
	// ''string: "yabrowser" === getBrowser().toString().toLowerCase().match(/yabrowser/i).toString()
	// '''Array.isArray(true): getBrowser()[2] / "yabrowser" === getBrowser()[2]: true
	// ''''typeof(object)...
	if (typeof(window.navigator.userAgentData) === "undefined"|| window.navigator.userAgentData === undefined) {
		return window.navigator.userAgent.match(/edge|edg|opr|yabrowser|chrome|trident|firefox|safari/i).toString(); // (i) match/matchAll - регулярные выражения - флаг i - регистр будет игнорироваться/глоб.флаг g - будут возвращены все перечисленные результаты, соответствующие полному регулярному выражению, но группы захвата не включаются. Если флаг не используется, возвращаются только первое полное совпадение и связанные с ним группы захвата
	} else { // т.к.не понятно, что из брендов яв-ся непосредственным наименованием браузера (имя юзер агента), вытягиваем инфу в виде объекта/массива
		let brands = [];
		window.navigator.userAgentData.brands.forEach(item => {
			for (const key in item) {
				if (key === "brand") {
					brands.push(item[key]);
				}
			}
		});
		return brands;
	}
}
// console.log(`getBrowser(${getBrowser().toString().toLowerCase()})\n "yabrowser" === getBrowser().toString().toLowerCase().match(/yabrowser/i).toString(): ${"yabrowser" === getBrowser().toString().toLowerCase().match(/yabrowser/i).toString()}\n getBrowser()[2]: ${getBrowser()[2]}\n "yabrowser" === getBrowser()[2]: ${"yabrowser" === getBrowser()[2].toLowerCase()}\n---\n getBrowser(typeof(${typeof(getBrowser())})):\n 1) Array.isArray(${Array.isArray(getBrowser())})\n 2) getBrowser() === Object(getBrowser()): ${getBrowser() === Object(getBrowser())}\n 3) Object(${Object(getBrowser())})\n Object(getBrowser()) === "function": ${Object(getBrowser()) === "function"}`); // x -

// const agent = window.navigator.userAgent.toLowerCase();
// const browser = agent.indexOf('edge') > -1 ? 'edge'
// 	: agent.indexOf('edg') > -1 ? 'chromium based edge'
// 	: agent.indexOf('opr') > -1 && window.opr ? 'opera'
// 	: agent.indexOf('yabrowser') > -1 ? 'yandex'
// 	: agent.indexOf('chrome') > -1 && window.chrome ? 'chrome'
// 	: agent.indexOf('trident') > -1 ? 'ie'
// 	: agent.indexOf('firefox') > -1 ? 'firefox'
// 	: agent.indexOf('safari') > -1 ? 'safari'
// 	: 'other';
// (!) определить устройство: desktop/mobile
// (i) нет поддержки: Firefox/Firefox для Android/Safari/Safari на iOS/WebView Android
// const device = agent.indexOf('mobile') > -1 ? 'mobile'
// 	: agent.indexOf('windows nt') > -1 ? 'Windows NT'
// 	: 'other';
// const device = window.navigator.userAgent.toLowerCase().match(/mobile/i); // mobile/null
// const device = window.navigator.userAgent.match(/mobile/i) || window.navigator.userAgent.match(/windows nt/i);
const getPlatform = function () {
	if (typeof(window.navigator.userAgentData) === "undefined"|| window.navigator.userAgentData === undefined) {
		return window.navigator.userAgent.match(/mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i) || window.navigator.userAgent.match(/windows nt/i) || window.navigator.platform;
	} else { // для chrome(yabrowser)/opera/edge
		return window.navigator.userAgentData.platform;
	}
}
// (!) проверить устройство на кот.исп.браузер
// (i) нет поддержки: Firefox/Firefox для Android/Safari/Safari на iOS/WebView Android
// const isMobile = (typeof(window.navigator.userAgentData) === "undefined"|| window.navigator.userAgentData === undefined) ?
// 	window.navigator.userAgent.indexOf('mobile') > -1 : navigator.userAgentData.mobile; // true/false

const isMobile = function () {
	if (typeof(window.navigator.userAgentData) === "undefined"|| window.navigator.userAgentData === undefined) {
		return /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(window.navigator.userAgent); // true/false
	} else { // для chrome(yabrowser)/opera/edge
		return window.navigator.userAgentData.mobile; // true/false
	}
}
// (i) test
// console.log(`getBrowser: ${getBrowser()}\n getPlatform(${getPlatform()})\n isMobile(${isMobile()})\n 1) window.navigator.userAgent.match(/mobile/i): ${window.navigator.userAgent.match(/mobile/i)}\n 2) window.navigator.userAgent.match(/windows nt/i): ${window.navigator.userAgent.match(/windows nt/i)}`); // x -
// (!) принудительная переадрессация
let forceReDirect = function () {
	if (window === top || window.name === "") {
		// *при локальном использовании или http://127.0.0.1
		// (i) в Firefox origin = "null"
		if (location.origin === "file://" || location.origin === "null" || location.origin === "http://127.0.0.1") return;
		let htmlPage = location.href.slice(location.href.lastIndexOf("/") + 1);
		if (htmlPage === "navigation.html") {
			location.href = location.href.replace(htmlPage, "index.html");
			// window.history.pushState('', '', pageName);
		} else {
			location.href = location.href.replace(htmlPage, "index.html") + "?" + htmlPage;
		}
	}
}
// (!) сохранить в sessionStorage
function setItemSessionStorage(keyName = "", keyValue) {
	if (keyName === "") {
		console.error(`(!) Косяк - не удалось сохранить в sessionStorage - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setItemSessionStorage(keyName: ${keyName}, keyValue: ${keyValue}): window.«${window.name}»:\n typeof(${typeof(keyName)})\n typeof(${typeof(keyValue)})`);
		alert(`(!) Косяк - Косяк - не удалось сохранить в sessionStorage - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	} else if (keyValue === undefined || typeof(keyValue) === "undefined") {
		console.error(`(!) Косяк - не удалось сохранить в sessionStorage - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки:\n function setItemSessionStorage(keyName: ${keyName}, keyValue: ${keyValue}): window.«${window.name}»:\n typeof(${typeof(keyName)})\n typeof(${typeof(keyValue)})`);
		alert(`(!) Косяк - Косяк - не удалось сохранить в sessionStorage - переменная аргумента не определена или значение переменной не соответствует условию(-ям) проверки, см.консоль.`);
		return false;
	}
	// '
	try {
		window.sessionStorage.setItem(keyName, keyValue);
		// console.log(keyName in window.sessionStorage);
		// console.log(window.sessionStorage.getItem(keyValue));

		return true;
	} catch (error) {
		// console.log(`error.name: ${error.name}`);
		if (error instanceof QuotaExceededError) { // превышен лимит хранилища сеансов
			console.error(`(!) Косяк - не удалось сохранить в sessionStorage - превышен лимит хранилища сеансов:\n function setItemSessionStorage(eVent: ${eVent.type}): window.«${window.name}»:\n ${error.name}`);
			alert(`(!) Косяк - Косяк - не удалось сохранить в sessionStorage - превышен лимит хранилища сеансов, см.консоль.`);
		// } else if (error instanceof SecurityError) { // операция не разрешена из-за ограничений безопасности
		}
		return false;
	}
}
// (!) создать ссылку на файл webmanifest
// function webManifestWriteLink() {
// 	// if (location.origin === "file://" || location.origin === "null") return; // (i) в Firefox origin = "null"
// 	if (document.head.querySelector('link[rel="manifest"]') === null) {
// 		let link = document.head.querySelector('link[rel="icon"]');
// 		if (link === null) {
// 			link = document.head.querySelector('link[rel="shortcut icon"]');
// 			if (link === null) {
// 				document.head.querySelector('title').insertAdjacentHTML('afterend', '<link rel="manifest" href="icons_manifest.webmanifest">');
// 			} else {
// 				link.insertAdjacentHTML('afterend', '<link rel="manifest" href="icons_manifest.webmanifest">');
// 			}
// 		} else {
// 			link.insertAdjacentHTML('afterend', '<link rel="manifest" href="icons_manifest.webmanifest">');
// 		}
// 	}
// }
// webManifestWriteLink();