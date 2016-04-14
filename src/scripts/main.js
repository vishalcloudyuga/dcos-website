const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const hasClassName = function(name) {
  return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
};

const addClassName = function(name) {
  if (!this.hasClassName(name)) {
    this.className = this.className ? [this.className, name].join(' ') : name;
  }
};

const removeClassName = function(name) {
  if (this.hasClassName(name)) {
    var c = this.className;
    this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
  }
};

Element.prototype.hasClassName = hasClassName;
Node.prototype.hasClassName = hasClassName;

Element.prototype.addClassName = addClassName;
Node.prototype.addClassName = addClassName;

Element.prototype.removeClassName = removeClassName;
Node.prototype.removeClassName = removeClassName;
