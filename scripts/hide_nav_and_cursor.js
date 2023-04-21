function resetHideTimeout(timeout, nav, body) {
    clearTimeout(timeout);

    body.css("cursor", "auto");
    nav.css("visibility", "visible");

    timeout = setTimeout(() => {
        body.css("cursor", "none");
        nav.css("visibility", "hidden");
    }, 3000);
    return timeout;
}

$(document).ready(function () {
    const body = $("body");
    const nav = $(".include-nav-snippet");
    let timeout;

    timeout = setTimeout(() => {
        body.css("cursor", "none");
        nav.css("visibility", "hidden");
    }, 3000);

    document.addEventListener("mousemove", (event) => {
        timeout = resetHideTimeout(timeout, nav, body);
    });
    document.addEventListener("touchstart", (event) => {
        timeout = resetHideTimeout(timeout, nav, body);
    });
})