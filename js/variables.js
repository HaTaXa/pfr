// (i) Configuration Variables - Конфигурации переменных
// (!) General topic variables
var hmtopicvars = {
	indexP: "index.html",
	homeP: "about.html",
	prevP: "",
	currP: "about.html",
	nextP: "intro.html",
	titleP: "Проект «Мониторинг заявок ФГИС ФРИ в АСТП»",
	btnExpand: "idExpandOn",
	keys: "HaTaXa",
	msgBox: "enable", // "disable",
	msgBtn: true,
	msgText: "<p>Уважаемый посетитель!</p><p>Сайт находится в разработке и поэтому некоторый функционал может пока что отсутствовать.</p>",
}
// (!) Navigation pages
var hmnavpages = {
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
var hmpermalink = {
	url: "https://sfri.ru/",
	copyInfo: "(i) Ссылка успешно скопирована в буфер обмена.",
	copyError: "(!) Не удалось скопировать ссылку в буфер обмена. Скопируйте ссылку стандартным способом вручную. Чтобы скопировать ссылку, выделите ее и нажмите сочетание клавиш Ctrl+C или Ctrl+Insert.",
	bookmarkInfo: "(i) Закладка создана успешно.",
	bookmarkError: "(!) Не удалось создать закладку. Сделайте это стандартным способом вручную. Для добавления страницы в закладки нажмите сочетание клавиш Ctrl+D.",
}
// (!) Feedback addresses
var hmfb = {
	mailrecipient: "user231082@gmail.com",
	simplerecipient: "solanina@yandex.ru",
}
// (!) Weblinks
var hmweblinks = {
	website: "https://sfri.ru",
	websitecompany: "http://www.pfrf.ru/",
	email: "user231082@gmail.com",
}
var lastSearch = ""; // (!) Storage variable for last search arg - Переменная памяти для последнего поиска