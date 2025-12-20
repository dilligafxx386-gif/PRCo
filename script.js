// theme & sound stay as-is
const colors = {
  gold:'#ffb000', amber:'#ffbf00', green:'#00ff00',
  pink:'#ff66cc', lightblue:'#66ccff', purple:'#cc66ff', red:'#ff6666'
};
document.getElementById('themeSelect').addEventListener('change', e => {
  document.documentElement.style.setProperty('--phosphor', colors[e.target.value]);
});
document.querySelectorAll('button').forEach(b=>b.style.fontFamily='Courier New,Courier,monospace');

// ----- Firebase Auth -----
const email  = document.getElementById('email');
const pass   = document.getElementById('pass');


login.addEventListener('click', () => {
  firebase.auth().signInWithEmailAndPassword(email.value, pass.value)
    .then(u => alert('Logged in: '+u.user.email))
    .catch(e => {
      // auto-create account if user doesn’t exist
      firebase.auth().createUserWithEmailAndPassword(email.value, pass.value)
        .then(u => alert('New account created for '+u.user.email))
        .catch(err => alert(err.message));
    });
});