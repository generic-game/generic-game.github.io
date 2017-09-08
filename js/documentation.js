var searchInput = document.querySelector('.search--input')
var searchData = []
var searchResults = {
  container: document.querySelector('.search--result'),
  cache: null,
  ploted: false
}
var debounce = false
var getJson = function (url, callback) {
  var request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.onload = function() {
    var data = JSON.parse(request.responseText)
    callback(data)
  }
  request.send()
}
var plotResults = function (json) {
  searchResults.container.innerHTML = '<ul>' + json.map(function (line) {
    return '<li>' + line.title + '</li>'
  }).join('') + '</ul>'
}
var mobileNavigation = function () {
  var el = {
    container: document.querySelector('.reference-mobile-menu'),
    menuButton: document.querySelectorAll('[data-toggle-mobile-nav]')
  }
  el.menuButton.forEach(function (element) {
    element.addEventListener('click', function () {
      if (el.container.classList.contains('opened-nav')) {
        el.container.classList.remove('opened-nav')
      } else {
        el.container.classList.add('opened-nav')
      }
    })
  })

}

searchInput.addEventListener('keyup', function () {
  if (debounce) clearTimeout(debounce)
  var query = searchInput.value.toLowerCase()
  if (!query) {
    if (searchResults.ploted) {
      searchResults.container.innerHTML = searchResults.cache
    }
    return true
  }

  debounce = setTimeout(function () {
    getJson('/feed.json', function(data) {
      if (!searchResults.ploted) {
        searchResults.ploted = true
        searchResults.cache = searchResults.container.innerHTML
      }
      plotResults(data.filter(function (line) {
        return line.title.toLowerCase().indexOf(query) > -1 || line.excerpt.toLowerCase().indexOf(query) > -1
      }))
    })
  }, 250)
})

mobileNavigation()
