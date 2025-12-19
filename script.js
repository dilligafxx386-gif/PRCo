// sound on/off
const keySound   = document.getElementById('keySound');
const returnSound= document.getElementById('returnSound');
const soundToggle= document.getElementById('soundToggle');

document.addEventListener('keydown', e => {
  if(soundToggle.checked) keySound.currentTime=0, keySound.play();
});

document.getElementById('loginBtn').addEventListener('click', () => {
  if(soundToggle.checked) returnSound.play();
  alert('Login placeholder – Firebase coming next chapter.');
});

// settings panel
const panel = document.getElementById('settingsPanel');
document.getElementById('settingsBtn').onclick = () => panel.classList.add('show');
document.getElementById('closeSettings').onclick = () => panel.classList.remove('show');

// theme swap
document.getElementById('themeSelect').addEventListener('change', e => {
  const colors = { gold:'#ffb000', amber:'#ffbf00', green:'#00ff00' };
  document.documentElement.style.setProperty('--phosphor', colors[e.target.value]);
});

