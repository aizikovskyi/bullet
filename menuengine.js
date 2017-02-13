/* eslint-env browser */

class MenuEngine {
  constructor(parentElement) {
    this.parentElement = parentElement;
  }

  showMessage(text, duration) {
    const popupDiv = document.createElement('div');
    popupDiv.style.width = `${this.parentElement.offsetWidth}px`;
    popupDiv.style.height = '200px';
    popupDiv.style.position = 'absolute';
    popupDiv.style.left = '0px';
    popupDiv.style.top = '100px';
    popupDiv.style['pointer-events'] = 'none';
    popupDiv.innerHTML = `<p style='text-align:center; color:white; text-shadow:-1px -1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, 1px 1px 0 #000'>${text}</p>`;
    this.parentElement.appendChild(popupDiv);
    window.setTimeout(() => {
      this.parentElement.removeChild(popupDiv);
    }, duration * 1000);
  }

  showPopup(text, callback) {
    const popupDiv = document.createElement('div');
    popupDiv.style.width = `${this.parentElement.offsetWidth}px`;
    popupDiv.style.height = '200px';
    popupDiv.style.position = 'absolute';
    popupDiv.style.left = '0px';
    popupDiv.style.top = '100px';
    popupDiv.style['background-color'] = '#555555';
    popupDiv.innerHTML = `<p style='text-align:center; color:white'>${text}</p>`;
    this.parentElement.appendChild(popupDiv);
    const dismissHandler = (evt) => {
      this.parentElement.removeChild(popupDiv);
      callback();
    };
    popupDiv.addEventListener('mousedown', dismissHandler);
    popupDiv.addEventListener('touchstart', dismissHandler);
  }
}
