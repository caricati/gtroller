;(function(global){
  'use strict';

  var delayWrite = 100;
  var delayCursor = 1400;

  function writeInInput(input, str, done) {
    var strLeng = str.length;
    var counter = 0;

    var interval = setInterval(function(){
      counter++;
      input.value = str.substr(0, counter);
      if(counter === strLeng) {
        done();
        clearInterval(interval);
      }
    }, delayWrite);
  }

  function asyncSequence(list) {
    function sequence(arr, done) {
      if(arr.length === 0) return done();

      arr[0](function(){
        arr.shift();
        sequence(arr, done);
      })
    }

    return function(finish) {
      sequence(list, finish);
    }
  }

  function getPosition(element) {
    return {
      x: element.offsetLeft,
      y: element.offsetTop,
    }
  }

  function setElementPosition(element, position, margin) {
    if(!margin) margin = 10;
    element.style.top = position.y + margin + 'px';
    element.style.left = position.x + margin + 'px';
  }

  function getSearchText(search) {
    var match = search.match(/q=(.*)/);
    return match && match.index === 1 ? match[1] : null;
  }

  function decodeSeachText(text) {
    return text ? text.replace(/\+/g, ' ') : null;
  }

  global.addEventListener('load', function(){

    var cursor = document.getElementById('arrow-mouse');  
    var inputText = document.getElementById('text-input');
    var button = document.getElementById('search-button');
    var trollFace = document.getElementById('troll-face');
    var lockScreen = document.getElementById('lock-screen');

    var pureSearch = getSearchText(location.search);
    var trollText = decodeSeachText(pureSearch);

    function goToInputText(done) {
      console.log('1. go to input text.');
      var pos = getPosition(inputText);
      setElementPosition(cursor, pos);
      setTimeout(done, delayCursor);
    }

    function writeOnTextInput(done) {
      console.log('2. write on the input text.');
      cursor.classList.add('hide');
      inputText.focus();
      writeInInput(inputText, trollText, function(){
        setTimeout(done, 1000);
      });
    }

    function goToSearchButton(done) {
      console.log('3. go to search button.');
      var pos = getPosition(button);
      inputText.blur();
      cursor.classList.remove('hide');

      setElementPosition(cursor, pos);
      
      setTimeout(function() {
        button.classList.add('active-focus');
      }, delayCursor / 1.8)

      setTimeout(done, delayCursor)
    }

    function showTrollFace(done) {
      console.log('4. show troll face ;)');
      lockScreen.classList.add('opacity');
      trollFace.classList.add('animate');
      setTimeout(done, 4000)
    }

    function redirectToGoogle(search) {
      console.log('5. Done! Do something.');
      window.location.href = 'https://www.google.com/search?q=' + pureSearch;
    }

    if(trollText) {
      console.log(trollText);
      asyncSequence([
        goToInputText,
        writeOnTextInput,
        goToSearchButton,
        showTrollFace,
      ])(redirectToGoogle);
    }
  });
}(window));