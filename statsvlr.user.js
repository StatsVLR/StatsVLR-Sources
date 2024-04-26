(function bettervlrJS() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://raw.githubusercontent.com/StatsVLR/StatsVLR-Sources/main/browser.js";
    var head = document.getElementsByTagName("head")[0];
    if (!head) return;
    head.appendChild(script);
})();

(function bettervlrCSS() {
    var style = document.createElement("link");
    style.rel = "stylesheet"
    style.href = "https://raw.githubusercontent.com/StatsVLR/StatsVLR-Sources/main/browser.js/browser.css";
    var head = document.getElementsByTagName("head")[0];
    if (!head) return;
    head.appendChild(style);
})();
