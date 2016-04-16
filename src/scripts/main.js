const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// Mobile menu
$('#nav-icon').addEventListener('click', function (e) {
  e.preventDefault();
  if($('#nav-icon').hasClassName('open')) {
    $('.navigation').removeClassName('mobile-menu--open');
    $('.menu-mobile').removeClassName('open');
    $('#nav-icon').removeClassName('open');
    $('body').removeAttribute('style');
    $('html').removeAttribute('style');
  } else {
    $('.navigation').addClassName('mobile-menu--open');
    $('.menu-mobile').addClassName('open');
    $('#nav-icon').addClassName('open');
    $('body').setAttribute('style', 'overflow: hidden;');
    $('html').setAttribute('style', 'overflow: hidden;');
  }
})

// Convenience methods
const hasClassName = function(name) {
  return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
};

const addClassName = function(name) {
  if (!this.hasClassName(name)) {
    this.className = this.className ? [this.className, name].join(' ') : name;
  }
  return this;
};

const removeClassName = function(name) {
  if (this.hasClassName(name)) {
    var c = this.className;
    this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
  }
  return this;
};

Element.prototype.hasClassName = hasClassName;
Node.prototype.hasClassName = hasClassName;
DocumentFragment.prototype.hasClassName = hasClassName;

Element.prototype.addClassName = addClassName;
Node.prototype.addClassName = addClassName;
DocumentFragment.prototype.addClassName = addClassName;

Element.prototype.removeClassName = removeClassName;
Node.prototype.removeClassName = removeClassName;
DocumentFragment.prototype.removeClassName = removeClassName;
