// (!) Получить имя браузера (взято из интернета)
const agent = window.navigator.userAgent.toLowerCase();
const browser = agent.indexOf('edge') > -1 ? 'edge'
	: agent.indexOf('edg') > -1 ? 'chromium based edge'
	: agent.indexOf('opr') > -1 && window.opr ? 'opera'
	: agent.indexOf('chrome') > -1 && window.chrome ? 'chrome'
	: agent.indexOf('trident') > -1 ? 'ie'
	: agent.indexOf('firefox') > -1 ? 'firefox'
	: agent.indexOf('safari') > -1 ? 'safari'
	: 'other';
// (!) Принудительная переадрессация
let forceReDirect = function () {
	if (window === top || window.name === "") {
		// *при локальном использовании или http://127.0.0.1
		if (location.origin === "file://" || location.origin === "http://127.0.0.1") return;
		let htmlPage = location.href.slice(location.href.lastIndexOf("/") + 1);
		if (htmlPage === "navigation.html") {
			location.href = location.href.replace(htmlPage, "index.html");
			// window.history.pushState('', '', pageName);
		} else {
			location.href = location.href.replace(htmlPage, "index.html") + "?" + htmlPage;
		}
	}
}