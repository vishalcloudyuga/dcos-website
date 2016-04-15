(function(){

  class Typer {
    constructor(element, otherWords) {
      this.element          = element;
      this.otherWords       = otherWords;
      this.currentWordIndex = 1;
      this.currentWord      = element.innerText;
      this.displayedString  = element.innerText;
      this.typing           = false;

      // start it off
      setTimeout(this.run.bind(this), 200)
    }

    run() {
      // configure default timeout
      var timeout = 200;

      if(!this.typing && this.displayedString.length > 0){
        // we're backspacing
        this.removeLastCharacter();
      } else if(this.typing && this.displayedString.length < this.currentWord.length) {
        // we're typing
        let newChar = this.currentWord[this.displayedString.length]
        this.addCharacter(newChar)
      } else if(this.typing && this.displayedString.length === this.currentWord.length) {
        // done typing, wait a bit and start removing..
        this.typing = false

        // override timeout
        timeout = 500;
      } else if(!this.typing && this.displayedString.length === 0){
        // done backspacing, pick new word and start over
        // increment and loop around
        if( this.currentWordIndex < this.otherWords.length -1) {
          this.currentWordIndex++;
        } else {
          this.currentWordIndex = 0;
        }

        // set new word and start typing again
        this.currentWord = this.otherWords[this.currentWordIndex];
        this.typing = true;
      }

      // recursively call itself with given timeout
      setTimeout(this.run.bind(this), timeout);
    }

    removeLastCharacter(){
      this.displayedString = this.displayedString.substring(0, this.displayedString.length-1)
      this.updateLabel()
    }

    addCharacter(char){
      this.displayedString += char
      this.updateLabel()
    }

    updateLabel() {
      this.element.innerText = this.displayedString + " ";
    }
  }

  new Typer($('.typer'), ['containers', 'big data','Spark','Kafka','Cassandra','microservices']);
})();
