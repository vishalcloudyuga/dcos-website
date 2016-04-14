const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// Mobile menu
const snapper = new Snap({
  element: $('.snap-content'),
  hyperextensible: false,
  disable: 'right'
});

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

Element.prototype.addClassName = addClassName;
Node.prototype.addClassName = addClassName;

Element.prototype.removeClassName = removeClassName;
Node.prototype.removeClassName = removeClassName;
