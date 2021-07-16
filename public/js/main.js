$(".sidebar-dropdown > a").on("click", () => {
    $(".sidebar-submenu").slideUp(200);
    if ($(this).parent().hasClass("active")) {
        $(".sidebar-dropdown").removeClass("active");
        $(this).parent().removeClass("active");
    } else {
        $(".sidebar-dropdown").removeClass("active");
        $(this).next(".sidebar-submenu").slideDown(200);
        $(this).parent().addClass("active");
    }
});

$("#close-sidebar").on("click", () => {
    $(".page-wrapper").removeClass("toggled");
});
$("#show-sidebar").on("click", () => {
    $(".page-wrapper").addClass("toggled");
});
