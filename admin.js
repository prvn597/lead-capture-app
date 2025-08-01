window.onload = function() {
  document.getElementById('products').value = (localStorage.getItem('products') || '');
  document.getElementById('salespeople').value = (localStorage.getItem('salespeople') || '');
  document.getElementById('endpoint').value = (localStorage.getItem('endpoint') || '');
  renderKeys();
};

document.getElementById('fields-form').onsubmit = function(e) {
  e.preventDefault();
  localStorage.setItem('products', document.getElementById('products').value);
  localStorage.setItem('salespeople', document.getElementById('salespeople').value);
  localStorage.setItem('endpoint', document.getElementById('endpoint').value);
  alert('Settings saved!');
};

function exportSettings() {
  const settings = {
    products: localStorage.getItem('products') || '',
    salespeople: localStorage.getItem('salespeople') || '',
    endpoint: localStorage.getItem('endpoint') || '',
    user_keys: JSON.parse(localStorage.getItem('user_keys') || '[]')
  };
  const blob = new Blob([JSON.stringify(settings)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'settings.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
document.getElementById('import-settings-file').addEventListener('change', function(e){
  if(e.target.files.length) importSettings(e.target.files[0]);
});
function importSettings(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const settings = JSON.parse(e.target.result);
    localStorage.setItem('products', settings.products || '');
    localStorage.setItem('salespeople', settings.salespeople || '');
    localStorage.setItem('endpoint', settings.endpoint || '');
    localStorage.setItem('user_keys', JSON.stringify(settings.user_keys || []));
    renderKeys();
    alert('Settings imported!');
  };
  reader.readAsText(file);
}

function getKeys() {
  return JSON.parse(localStorage.getItem('user_keys') || '[]');
}
function saveKeys(keys) {
  localStorage.setItem('user_keys', JSON.stringify(keys));
}
function renderKeys() {
  const keys = getKeys();
  const keysList = document.getElementById('keys-list');
  if (!keys.length) {
    keysList.innerHTML = '<em>No user keys generated yet.</em>';
    return;
  }
  keysList.innerHTML = keys.map((k, i) =>
    `<div class="key-row">
      <span>${k}</span>
      <button onclick="deleteKey(${i})">Delete</button>
    </div>`
  ).join('');
}
function deleteKey(idx) {
  const keys = getKeys();
  keys.splice(idx, 1);
  saveKeys(keys);
  renderKeys();
}
document.getElementById('key-add-form').onsubmit = function(e) {
  e.preventDefault();
  const newKey = document.getElementById('new-key').value.trim();
  if (!newKey) return;
  const keys = getKeys();
  if (!keys.includes(newKey)) {
    keys.push(newKey);
    saveKeys(keys);
    renderKeys();
    document.getElementById('new-key').value = '';
  } else {
    alert('That key already exists!');
  }
};

// --- Sync from GitHub (example: adjust the URL to your repo)
function syncFromGithub() {
  const url = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/settings.json';
  document.getElementById('sync-status').innerText = "Syncing from GitHub...";
  fetch(url)
    .then(r => r.json())
    .then(settings => {
      localStorage.setItem('products', settings.products || '');
      localStorage.setItem('salespeople', settings.salespeople || '');
      localStorage.setItem('endpoint', settings.endpoint || '');
      localStorage.setItem('user_keys', JSON.stringify(settings.user_keys || []));
      renderKeys();
      document.getElementById('sync-status').innerText = "Synced successfully!";
    })
    .catch(e => {
      document.getElementById('sync-status').innerText = "Sync failed.";
    });
}
