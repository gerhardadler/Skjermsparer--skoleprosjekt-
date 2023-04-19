$(document).ready(function () {

    const body = $("body");
    const nav = $(".include-nav-snippet");
    let timeout;

    document.addEventListener("mousemove", (event) => {
        clearTimeout(timeout)

        body.css("cursor", "auto")
        nav.css("visibility", "visible")

        timeout = setTimeout(() => {
            body.css("cursor", "none")
            nav.css("visibility", "hidden")
        }, 1000)
    })
})