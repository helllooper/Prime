// $(window).on('load', function () {
//     $("#preload").fadeOut(3000);
// });

var aboutlist = $(".about-list");
var tl4 = new TimelineLite();
tl4.staggerFrom(aboutlist, 2, {x:-200, autoAlpha:0}, 0.5);

$(window).scroll(function(){
    $(".navbar").addClass("white");
    $("#wHours").removeClass("wDisplay");
    $("#first-nav").removeClass("first-nav-scroll")   
	if ($(window).scrollTop()== 0){
        $(".navbar").removeClass("white");
        $("#wHours").addClass("wDisplay");
        $("#first-nav").addClass("first-nav-scroll")   
        
    }
});

var controller = new ScrollMagic.Controller();

var ourScene = new ScrollMagic.Scene({
    triggerElement:"#portion2",
    triggerHook:"0.9",
    reverse:false
})
.on("enter", function(){
    var list = $(".list");
    var tl3 = new TimelineLite();
    tl3.staggerFrom(list, 2, {x:-200, autoAlpha:0}, 0.5);
 })
.addTo(controller)

var ourScene2 = new ScrollMagic.Scene({
    triggerElement:"#portion3",
    triggerHook:"0.9",
    reverse:false
})
.on("enter", function(){
    var equip = $(".equip");
    var tl3 = new TimelineLite();
    tl3.staggerFrom(equip, 2, {x:-200, autoAlpha:0}, 0.5);
 })
.addTo(controller)

var ourScene3 = new ScrollMagic.Scene({
    triggerElement:"#portion4",
    triggerHook:"0.5",
    reverse:false
})
.on("enter", function(){
    var overlay2 = $("#overlay2");
    TweenLite.to(overlay2, 2, {opacity:0.5})
    var list3 = $(".list3")
    var tl3 = new TimelineLite();
    tl3.staggerTo(list3, 2, {y:0, opacity:1}, 0.5);
 })
.addTo(controller)

var ourScene4 = new ScrollMagic.Scene({
    triggerElement:"#portion5",
    triggerHook:"0.9",
    reverse:false
})
.on("enter", function(){
    var docs = $(".docs");
    var tl3 = new TimelineLite();
    tl3.staggerFrom(docs, 2, {x:-200, autoAlpha:0}, 0.5);
 })
.addTo(controller)

$(".person").each(function(){
    var ourScene5 = new ScrollMagic.Scene({
        triggerElement:this,
        triggerHook:"0.9",
        reverse:false
    })
    .setClassToggle(this, "fade-in")
    .addTo(controller)
})


