function getKeys() {
  let keys = [];
  try {
    keys = JSON.parse(localStorage.getItem('user_keys') || '[]');
  } catch (e) {}
  return keys;
}
document.getElementById('user-login-form').onsubmit = function(e) {
  e.preventDefault();
  const key = document.getElementById('user-key').value.trim();
  const keys = getKeys();
  if (keys.includes(key)) {
    sessionStorage.setItem('user_key', key);
    document.getElementById('user-login-form').style.display = "none";
    document.getElementById('user-login-error').textContent = "";
    document.getElementById('user-name-modal').style.display = "";
  } else {
    document.getElementById('user-login-error').textContent = 'Invalid key. Please check with admin.';
  }
};
document.getElementById('user-name-form').onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('user-name').value.trim();
  if (name.length) {
    sessionStorage.setItem('user_name', name);
    window.location.href = 'index.html';
  }
};