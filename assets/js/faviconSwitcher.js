(function (window, document) {
    var lightHref = 'https://hipacloud.com/favicons/favicon-32x32.png'
    var darkHref = 'https://hipacloud.com/favicons/favicon-32-dark.png'
    if (typeof window === 'undefined') {
        return;
    }
    // Exit if media queries aren't supported
    if (typeof window.matchMedia !== "function") {
        return;
    }

    const matchResult = window.matchMedia("(prefers-color-scheme: dark)");
    if (matchResult && typeof matchResult.addEventListener === "function") {
        var Links = Array.from(document.head.querySelectorAll("link[rel='icon']"));
        if (matchResult.matches) {
            //dark mode
            Links[0].setAttribute("href", darkHref);
        } else {
            //light mode
            Links[0].setAttribute("href", lightHref);
        }
        matchResult.addEventListener("change", event => {
            if (event.matches) {
                //dark mode
                Links[0].setAttribute("href", darkHref);
            } else {
                //light mode
                Links[0].setAttribute("href", lightHref);
            }
        });
    }
}
)(window, document);