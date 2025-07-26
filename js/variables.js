// (i) Configuration Variables - Конфигурации переменных
// (!) исключение элементов, например контролы в пан.инстр.
var setElemExclude = function (e) {
	if (isMobile()) { // проверить устройство на кот.исп.браузер
		if (e.type === "load") {
			// кн.на пан.инстр.
			let list = document.querySelectorAll('.toolbar_box-left');
			if (list.length > 0) {
				list.forEach(elem => {
					if (elem.id === "idUndockTabTool" || elem.id === "idNewTabTool") {
						elem.classList.add('exclude-elem');
					}
				});
			}
		} else if (e.type === "resize") {
			// console.log(`window.matchMedia("(orientation: portrait)").matches: ${window.matchMedia("(orientation: portrait)").matches}\n window.matchMedia("(orientation: landscape)").matches: ${window.matchMedia("(orientation: landscape)").matches}`); // x -
			if (document.documentElement.clientWidth < 500) {
				// кн.на пан.инстр.
				let list = document.querySelectorAll('.toolbar_box-left');
				if (list.length > 0) {
					list.forEach(elem => {
						if (elem.id === "idUndockTabTool" || elem.id === "idNewTabTool") {
							elem.classList.add('exclude-elem');
						}
					});
				}
			} else {
				let list = document.querySelectorAll('.exclude-elem');
				if (list.length > 0) {
					list.forEach(elem => {
						if (elem.id === "idUndockTabTool" || elem.id === "idNewTabTool") {
							elem.classList.remove('exclude-elem');
						}
					});
				}
			}
		}
	} else { // desktop - Windows NT...
		let list = document.querySelectorAll('.exclude-elem');
		if (list.length > 0) {
			list.forEach(elem => {
				if (elem.id === "idUndockTabTool" || elem.id === "idNewTabTool") {
					elem.classList.remove('exclude-elem');
				}
			});
		}
	}
}
// (!) General topic variables
var vrsTopic = {
	homeP: "about.html",
	prevP: "",
	currP: "about.html",
	nextP: "intro.html",
	titleP: "Проект «Мониторинг заявок ФГИС ФРИ в АСТП»",
	keys: "HaTaXa",
	msgBox: "enable", // "disable",
	msgBtn: true,
	msgText: `<p>Уважаемый посетитель!<br>Сайт находится в разработке и поэтому некоторый функционал может пока что отсутствовать.</p>`,
	msgEffect: "on", // "on"/"bgr"/"off"
}
// (!) Navigation pages
var vrsNavigation = {
	toc: "navigation.html",
	kwd: "keywords.html",
	sch: "search.html",
	top: "index.html",
	def: "about.html",
	breadCrumbs: [],
	query: window.location.search.substring(1).replace(/:/g, ""),
	hash: window.location.hash,
	cachefix: 30,
	userReload: false && window.location.search == "" && window.location.hash == "",
}
// (!) Permalink function
var vrsPermalink = {
	url: "https://hataxa.github.io/pfr/",
	copyInfo: "(i) Ссылка успешно скопирована в буфер обмена.",
	copyError: "(!) Не удалось скопировать ссылку в буфер обмена. Скопируйте ссылку стандартным способом вручную. Чтобы скопировать ссылку, выделите ее и нажмите сочетание клавиш Ctrl+C или Ctrl+Insert.",
	bookmarkInfo: "(i) Закладка создана успешно.",
	bookmarkError: "(!) Не удалось создать закладку. Сделайте это стандартным способом вручную. Для добавления страницы в закладки нажмите сочетание клавиш Ctrl+D.",
}
// (!) Feedback
var vrsFeedBack = {
	email: "solanina@yandex.ru",
	support: "user231082@gmail.com",
}
// (!) Weblinks
var vrsWeblinks = {
	website: "https://sfri.ru",
	websitecompany: "http://www.pfrf.ru/",
	email: "solanina@yandex.ru",
	support: "user231082@gmail.com",
}
var lastSearch = ""; // (!) Storage variable for last search arg - Переменная памяти для последнего поиска