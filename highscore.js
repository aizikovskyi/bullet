class HighScoreLoader {
  constructor(version) {
    this.cname = `bullet_${version}_highscore`;
  }

  setHighScore(cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + (20*365*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = this.cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  getHighScore() {
      var name = this.cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return Number(c.substring(name.length, c.length));
          }
      }
      return 0;
  }
}
