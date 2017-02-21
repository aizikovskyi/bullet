/* eslint-env browser */

class MenuEngine {
  static menuItem(text, shouldCloseMenu, callback) {
    return { text, callback, shouldCloseMenu };
  }

  constructor(videoEngine, parentElement) {
    this.videoEngine = videoEngine;
    this.parentElement = parentElement;
    this.menuItemWidth = 90; // game units
    this.menuItemHeight = 20; // game units
    this.menuItemSpacing = 5; // game units
    this.topOffset = 5; // game units
    this.leftOffset = 5; // game units
  }

  menuItemRectWithItemOffset(itemOffset) {
    const gameUnitsLeftTop = {
      x: this.leftOffset,
      y: this.topOffset + itemOffset * (this.menuItemHeight + this.menuItemSpacing),
    };
    const leftTop = this.videoEngine.gamePointToWindowCoords(gameUnitsLeftTop.x, gameUnitsLeftTop.y);
    const rightBottom = this.videoEngine.gamePointToWindowCoords(gameUnitsLeftTop.x + this.menuItemWidth,
      gameUnitsLeftTop.y + this.menuItemHeight);
    return {
      left: leftTop.x,
      top: leftTop.y,
      width: rightBottom.x - leftTop.x,
      height: rightBottom.y - leftTop.y,
    };
  }

  showMessage(text, duration) {
    const rect = this.menuItemRectWithItemOffset(0);
    const popupDiv = document.createElement('div');
    popupDiv.style.width = `${rect.width}px`;
    popupDiv.style.height = `${rect.height}px`;
    popupDiv.style.position = 'absolute';
    popupDiv.style.left = `${rect.left}px`;
    popupDiv.style.top = `${rect.top}px`;
    popupDiv.style['pointer-events'] = 'none';
    popupDiv.innerHTML = `<p style='text-align:center; color:white; text-shadow:-1px -1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, 1px 1px 0 #000'>${text}</p>`;
    this.parentElement.appendChild(popupDiv);
    window.setTimeout(() => {
      this.parentElement.removeChild(popupDiv);
    }, duration * 1000);
  }

  showPopup(text, callback) {
    const rect = this.menuItemRectWithItemOffset(0);
    const popupDiv = document.createElement('div');
    popupDiv.style.width = `${rect.width}px`;
    popupDiv.style.height = `${rect.height}px`;
    popupDiv.style.position = 'absolute';
    popupDiv.style.left = `${rect.left}px`;
    popupDiv.style.top = `${rect.top}px`;
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

  showMenu(menuItems) {
    const menuDivs = [];
    for (let i = 0; i < menuItems.length; i++) {
      const popupDiv = document.createElement('div');
      const rect = this.menuItemRectWithItemOffset(i);
      const menuItem = menuItems[i];
      popupDiv.style.width = `${rect.width}px`;
      popupDiv.style.height = `${rect.height}px`;
      popupDiv.style.position = 'absolute';
      popupDiv.style.left = `${rect.left}px`;
      popupDiv.style.top = `${rect.top}px`;
      popupDiv.style['background-color'] = '#555555';
      popupDiv.innerHTML = `<p style='text-align:center; color:white'>${menuItem.text}</p>`;
      this.parentElement.appendChild(popupDiv);
      const dismissHandler = (evt) => {
        if (menuItem.shouldCloseMenu) {
          menuDivs.forEach(div => this.parentElement.removeChild(div));
        }
        menuItem.callback();
      };
      popupDiv.addEventListener('mousedown', dismissHandler);
      popupDiv.addEventListener('touchstart', dismissHandler);
      menuDivs.push(popupDiv);
    }
  }
}
