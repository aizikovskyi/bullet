/* eslint-env browser */

class MenuEngine {
  static menuItem(text, shouldCloseMenu, callback) {
    return { text, callback, shouldCloseMenu };
  }

  constructor(videoEngine, parentElement) {
    this.videoEngine = videoEngine;
    this.parentElement = parentElement;
  }

  menuItemRectWithItemOffset(itemOffset) {
    const menuItemWidth = 90; // game units
    const menuItemHeight = 15; // game units
    const menuItemSpacing = 5; // game units
    const topOffset = 5; // game units
    const leftOffset = 5; // game units
    const gameUnitsLeftTop = {
      x: leftOffset,
      y: topOffset + itemOffset * (menuItemHeight + menuItemSpacing),
    };
    const leftTop = this.videoEngine.gamePointToWindowCoords(gameUnitsLeftTop.x, gameUnitsLeftTop.y);
    const rightBottom = this.videoEngine.gamePointToWindowCoords(gameUnitsLeftTop.x + menuItemWidth,
      gameUnitsLeftTop.y + menuItemHeight);
    return {
      left: leftTop.x,
      top: leftTop.y,
      width: rightBottom.x - leftTop.x,
      height: rightBottom.y - leftTop.y,
    };
  }


  showMessage(text, duration) {
    const popupDiv = document.createElement('div');
    popupDiv.innerHTML = `<p style='text-align:center; color:white; text-shadow:-1px -1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, 1px 1px 0 #000'>${text}</p>`;
    popupDiv.style.position = 'absolute';
    popupDiv.style['pointer-events'] = 'none';
    const resizeCallback = () => {
      const rect = this.menuItemRectWithItemOffset(0);
      popupDiv.style.width = `${rect.width}px`;
      popupDiv.style.height = `${rect.height}px`;
      popupDiv.style.left = `${rect.left}px`;
      popupDiv.style.top = `${rect.top}px`;
      popupDiv.children[0].style['font-size'] = this.videoEngine.fontSizeForLabelHeight(rect.height);
    };
    resizeCallback();
    this.videoEngine.addResizeObserver(resizeCallback);
    this.parentElement.appendChild(popupDiv);
    window.setTimeout(() => {
      this.parentElement.removeChild(popupDiv);
      this.videoEngine.removeResizeObserver(resizeCallback);
    }, duration * 1000);
  }

  showPopup(text, callback) {
    const popupDiv = document.createElement('div');
    popupDiv.innerHTML = `<p style='text-align:center; color:white'>${text}</p>`;
    popupDiv.style.position = 'absolute';
    popupDiv.style['background-color'] = '#555555';
    const resizeCallback = () => {
      const rect = this.menuItemRectWithItemOffset(0);
      popupDiv.style.width = `${rect.width}px`;
      popupDiv.style.height = `${rect.height}px`;
      popupDiv.style.left = `${rect.left}px`;
      popupDiv.style.top = `${rect.top}px`;
      popupDiv.children[0].style['font-size'] = this.videoEngine.fontSizeForLabelHeight(rect.height);
    };
    resizeCallback();
    this.videoEngine.addResizeObserver(resizeCallback);
    this.parentElement.appendChild(popupDiv);
    const dismissHandler = (evt) => {
      this.parentElement.removeChild(popupDiv);
      this.videoEngine.removeResizeObserver(resizeCallback);
      callback();
    };
    popupDiv.addEventListener('mousedown', dismissHandler);
    popupDiv.addEventListener('touchstart', dismissHandler);
  }

  showMenu(menuItems) {
    const menuDivs = [];
    const resizeCallbacks = [];
    for (let i = 0; i < menuItems.length; i++) {
      const popupDiv = document.createElement('div');
      popupDiv.style.position = 'absolute';
      popupDiv.style['background-color'] = '#555555';
      const menuItem = menuItems[i];
      popupDiv.innerHTML = `<p style='text-align:center; color:white'>${menuItem.text}</p>`;
      const resizeCallback = () => {
        const rect = this.menuItemRectWithItemOffset(i);
        popupDiv.style.width = `${rect.width}px`;
        popupDiv.style.height = `${rect.height}px`;
        popupDiv.style.left = `${rect.left}px`;
        popupDiv.style.top = `${rect.top}px`;
        popupDiv.children[0].style['font-size'] = this.videoEngine.fontSizeForLabelHeight(rect.height);
      };
      resizeCallbacks.push(resizeCallback);
      resizeCallback();
      this.videoEngine.addResizeObserver(resizeCallback);
      this.parentElement.appendChild(popupDiv);
      const dismissHandler = (evt) => {
        if (menuItem.shouldCloseMenu) {
          menuDivs.forEach(div => this.parentElement.removeChild(div));
          resizeCallbacks.forEach(callback => this.videoEngine.removeResizeObserver(callback));
        }
        menuItem.callback();
      };
      popupDiv.addEventListener('mousedown', dismissHandler);
      popupDiv.addEventListener('touchstart', dismissHandler);
      menuDivs.push(popupDiv);
    }
  }
}
