const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// Mobile menu
$('#nav-icon').addEventListener('click', function (e) {
  e.preventDefault();
  $('#nav-icon').hasClassName('open') ? $('#nav-icon').removeClassName('open') : $('#nav-icon').addClassName('open')
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
