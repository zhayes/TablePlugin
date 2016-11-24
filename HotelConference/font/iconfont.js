;(function(window) {

var svgSprite = '<svg>' +
  ''+
    '<symbol id="icon-shijian" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M511.998465 0.023536C229.227934 0.023536 0.004093 229.242078 0.004093 512c0 282.758945 229.224864 511.975441 511.994372 511.975441 282.769508 0 511.997442-229.216495 511.997442-511.975441C1023.995907 229.242078 794.767973 0.023536 511.998465 0.023536zM511.998465 977.433428c-257.066073 0-465.451475-208.398354-465.451475-465.432405 0-257.0801 208.385402-465.432405 465.451475-465.432405 257.066073 0 465.451475 208.354352 465.451475 465.432405C977.44994 769.033028 769.064538 977.433428 511.998465 977.433428zM767.997186 512.002047 535.269401 512.002047 535.269401 209.469756c0-12.861936-10.428941-23.271006-23.270936-23.271006-12.839949 0-23.272983 10.408047-23.272983 23.271006L488.725482 535.271006c0 12.841469 10.433034 23.27203 23.272983 23.27203l255.998721 0c12.839949 0 23.272983-10.43056 23.272983-23.27203C791.268122 522.411117 780.837135 512.002047 767.997186 512.002047z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-didian" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M512.421614 0C281.83153 0.628328 94.356588 184.357863 94.356588 410.209908c0 132.458414 155.248081 314.794168 172.957913 335.152391 34.756544 39.979645 40.329626 48.702551 51.571982 66.140177 15.133076 23.473254 37.840875 58.956366 133.788749 181.431126 15.611996 19.244835 37.003788 29.858864 59.746381 30.403278 22.74464-0.544414 44.136431-11.164583 59.750474-30.403278 95.943781-122.470666 118.649534-157.955825 133.788749-181.431126 11.244403-17.433532 16.813391-26.160532 51.571982-66.140177 17.709833-20.358223 172.957913-202.693977 172.957913-335.152391C930.490733 184.357863 743.013745 0.628328 512.421614 0L512.421614 0zM707.737347 703.962265c-37.740589 43.432377-44.625585 54.064826-57.106177 73.424274-13.634913 21.148238-36.475747 56.502409-130.286898 176.263285-2.472377 3.057724-5.231288 3.952119-7.922658 4.742134-2.693417-0.787968-5.452328-1.682362-7.924705-4.742134-93.805011-119.760875-116.645844-155.115047-130.280758-176.263285-12.480592-19.359448-19.371728-29.989851-57.112317-73.424274-75.851624-87.181988-157.454391-216.269537-157.454391-293.752357 0-190.651373 158.152305-345.72958 352.770123-346.355861 194.615772 0.626281 352.768077 155.704488 352.768077 346.355861C865.189691 487.692728 783.586924 616.780277 707.737347 703.962265L707.737347 703.962265zM512.421614 255.888968c-88.338356 0-159.951328 71.615018-159.951328 159.951328 0 88.342449 71.615018 159.955421 159.951328 159.955421 88.342449 0 159.955421-71.612972 159.955421-159.955421C672.377035 327.50194 600.762017 255.888968 512.421614 255.888968L512.421614 255.888968zM512.421614 511.814776c-53.010791 0-95.970387-42.971876-95.970387-95.976527 0-52.998511 42.961643-95.970387 95.970387-95.970387 53.004651 0 95.974481 42.971876 95.974481 95.970387C608.396095 468.8429 565.426265 511.814776 512.421614 511.814776L512.421614 511.814776zM512.421614 511.814776"  ></path>'+
      ''+
    '</symbol>'+
  ''+
'</svg>'
var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
var shouldInjectCss = script.getAttribute("data-injectcss")

/**
 * document ready
 */
var ready = function(fn){
  if(document.addEventListener){
      document.addEventListener("DOMContentLoaded",function(){
          document.removeEventListener("DOMContentLoaded",arguments.callee,false)
          fn()
      },false)
  }else if(document.attachEvent){
     IEContentLoaded (window, fn)
  }

  function IEContentLoaded (w, fn) {
      var d = w.document, done = false,
      // only fire once
      init = function () {
          if (!done) {
              done = true
              fn()
          }
      }
      // polling for no errors
      ;(function () {
          try {
              // throws errors until after ondocumentready
              d.documentElement.doScroll('left')
          } catch (e) {
              setTimeout(arguments.callee, 50)
              return
          }
          // no errors, fire

          init()
      })()
      // trying to always fire before onload
      d.onreadystatechange = function() {
          if (d.readyState == 'complete') {
              d.onreadystatechange = null
              init()
          }
      }
  }
}

/**
 * Insert el before target
 *
 * @param {Element} el
 * @param {Element} target
 */

var before = function (el, target) {
  target.parentNode.insertBefore(el, target)
}

/**
 * Prepend el to target
 *
 * @param {Element} el
 * @param {Element} target
 */

var prepend = function (el, target) {
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

function appendSvg(){
  var div,svg

  div = document.createElement('div')
  div.innerHTML = svgSprite
  svg = div.getElementsByTagName('svg')[0]
  if (svg) {
    svg.setAttribute('aria-hidden', 'true')
    svg.style.position = 'absolute'
    svg.style.width = 0
    svg.style.height = 0
    svg.style.overflow = 'hidden'
    prepend(svg,document.body)
  }
}

if(shouldInjectCss && !window.__iconfont__svg__cssinject__){
  window.__iconfont__svg__cssinject__ = true
  try{
    document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
  }catch(e){
    console && console.log(e)
  }
}

ready(appendSvg)


})(window)