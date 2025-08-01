const userKey = sessionStorage.getItem('user_key');
const userName = sessionStorage.getItem('user_name');
if (!userKey || !userName) {
  window.location.href = 'login.html';
}
document.getElementById('greeting').innerText = `Hello, ${userName}!`;

function loadDefaults() {
  const products = (localStorage.getItem('products') || '').split(',').map(p=>p.trim()).filter(Boolean);
  const productSel = document.getElementById('interest');
  productSel.innerHTML = products.map(p => `<option value="${p}">${p}</option>`).join('');
  const salespeople = (localStorage.getItem('salespeople') || '').split(',').map(p=>p.trim()).filter(Boolean);
  const salesSel = document.getElementById('salesperson');
  salesSel.innerHTML = salespeople.map(s => `<option value="${s}">${s}</option>`).join('');
  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
  ];
  const locSel = document.getElementById('location');
  locSel.innerHTML = states.map(s => `<option value="${s}">${s}</option>`).join('');
}
loadDefaults();

document.getElementById('scan-btn').addEventListener('click', function() {
  document.getElementById('card-image').click();
});
document.getElementById('card-image').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const preview = document.getElementById('card-preview');
  preview.style.display = 'none';
  document.getElementById('ocr-status').textContent = "Scanning business card...";
  const reader = new FileReader();
  reader.onload = function(ev) {
    preview.src = ev.target.result;
    preview.style.display = '';
  };
  reader.readAsDataURL(file);

  Tesseract.recognize(
    file,
    'eng',
    { logger: m => {} }
  ).then(({ data: { text } }) => {
    document.getElementById('ocr-status').textContent = "Extracting details...";
    const lines = text.split('\n').map(l=>l.trim()).filter(Boolean);
    let name='', email='', phone='', company='';
    for (let line of lines) {
      if (!email && line.match(/@/)) email = line.match(/\S+@\S+\.\S+/)?.[0] || '';
      if (!phone && line.match(/(\+?\d{1,2}\s?)?(\(?\d{3,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4,}/)) phone = line.match(/(\+?\d{1,2}\s?)?(\(?\d{3,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4,}/)?.[0] || '';
    }
    for (let line of lines) {
      if (!name && line.length < 30 && !line.match(/(ltd|inc|corp|solutions|technologies|private|company|pvt|llc|group|co\.|limited)/i)) name = line;
      if (!company && line.match(/(ltd|inc|corp|solutions|technologies|private|company|pvt|llc|group|co\.|limited)/i)) company = line;
    }
    if(name) document.getElementById('name').value = name;
    if(company) document.getElementById('company').value = company;
    if(email) document.getElementById('email').value = email;
    if(phone) document.getElementById('phone').value = phone;
    document.getElementById('ocr-status').textContent = "Details filled! Please review/edit before saving.";
  }).catch(err => {
    document.getElementById('ocr-status').textContent = "Could not read card. Try again.";
  });
});

document.getElementById('phone').addEventListener('input', function(e) {
  let v = e.target.value.replace(/[^\d+]/g,'');
  if (v.length > 12 && v.startsWith('0')) v = v.slice(1);
  e.target.value = v;
});

document.getElementById('lead-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const cardImg = document.getElementById('card-image').files[0];
  const getBase64 = file => new Promise((resolve, reject) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  getBase64(cardImg).then(cardBase64 => {
    const lead = {
      entered_by: userName,
      name: document.getElementById('name').value.trim(),
      company: document.getElementById('company').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      interest: document.getElementById('interest').value,
      location: document.getElementById('location').value,
      priority: document.getElementById('priority').value,
      salesperson: document.getElementById('salesperson').value,
      notes: document.getElementById('notes').value.trim(),
      card_image: cardBase64
    };
    const endpoint = localStorage.getItem('endpoint') || '';
    if (!endpoint) return alert("No endpoint set. Please contact admin.");
    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(lead),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.text())
    .then(msg => {
      alert("Lead saved!");
      document.getElementById('lead-form').reset();
      document.getElementById('card-preview').style.display = 'none';
      document.getElementById('ocr-status').textContent = "";
    })
    .catch(err => alert("Error: " + err));
  });
});
