var sticky = new Sticky('.sticky')
var scroll = new SmoothScroll('a[href*="#"]', {
  speed: 500,
	offset: 96
})
var $ = function (query) {
  return Array.prototype.concat.apply([], document.querySelectorAll(query))
}
$('.features .feature').forEach(function (feature) {
  var waypoint = new Waypoint({
    element: feature,
    offset: '50%',
    handler: function() {
      $('.navigation li').forEach(function (li) {
        li.classList.remove('active')
      })
      $('.navigation [data-waypoint=' + feature.dataset.waypoint + ']').forEach(function (li) {
        li.classList.add('active')
      })
    }
  })
})
