/* ===================================================
   LANDIFY — LISTING FORMS — SHARED JS
   State/District data + shared utilities
=================================================== */

// ─── ALL INDIA STATES + DISTRICTS ───────────────────────────────
const INDIA_DISTRICTS = {
  "Andhra Pradesh": ["Anakapalli","Anantapur","Annamayya","Bapatla","Chittoor","Dr. B.R. Ambedkar Konaseema","East Godavari","Eluru","Guntur","Kakinada","Krishna","Kurnool","Nandyal","NTR","Palnadu","Parvathipuram Manyam","Prakasam","Srikakulam","Sri Sathya Sai","Tirupati","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"],
  "Arunachal Pradesh": ["Anjaw","Capital Complex","Changlang","Dibang Valley","East Kameng","East Siang","Kamle","Kra Daadi","Kurung Kumey","Lepa Rada","Lohit","Longding","Lower Dibang Valley","Lower Siang","Lower Subansiri","Namsai","Pakke Kessang","Papum Pare","Shi Yomi","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri","West Kameng","West Siang"],
  "Assam": ["Baksa","Bajali","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Sivasagar","Sonitpur","South Salmara-Mankachar","Tamulpur","Tinsukia","Udalguri","West Karbi Anglong"],
  "Bihar": ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"],
  "Chhattisgarh": ["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Gaurela-Pendra-Marwahi","Janjgir-Champa","Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya","Mahasamund","Manendragarh-Chirmiri-Bharatpur","Mohla-Manpur-Ambagarh Chowki","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sakti","Sarangarh-Bilaigarh","Sukma","Surajpur","Surguja"],
  "Goa": ["North Goa","South Goa"],
  "Gujarat": ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"],
  "Haryana": ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul-Spiti","Mandi","Shimla","Sirmaur","Solan","Una"],
  "Jharkhand": ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj","Seraikela-Kharsawan","Simdega","West Singhbhum"],
  "Karnataka": ["Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chamarajanagar","Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir"],
  "Kerala": ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"],
  "Madhya Pradesh": ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"],
  "Maharashtra": ["Ahmednagar","Akola","Amravati","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"],
  "Manipur": ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"],
  "Meghalaya": ["East Garo Hills","East Jaintia Hills","East Khasi Hills","North Garo Hills","Ri-Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"],
  "Mizoram": ["Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Saitual","Serchhip"],
  "Nagaland": ["Chümoukedima","Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Niuland","Noklak","Peren","Phek","Shamator","Tseminyü","Tuensang","Wokha","Zünheboto"],
  "Odisha": ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundargarh"],
  "Punjab": ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Malerkotla","Mansa","Moga","Pathankot","Patiala","Rupnagar","Sangrur","SAS Nagar","SBS Nagar","Sri Muktsar Sahib","Tarn Taran"],
  "Rajasthan": ["Ajmer","Alwar","Anupgarh","Balotra","Banswara","Baran","Barmer","Beawar","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Deeg","Didwana-Kuchaman","Dholpur","Dudu","Dungarpur","Gangapur City","Hanumangarh","Jaipur North","Jaipur South","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur East","Jodhpur West","Karauli","Kekri","Khairthal-Tijara","Kota","Kotputli-Behror","Nagaur","Neem Ka Thana","Pali","Phalodi","Pratapgarh","Rajsamand","Salumbar","Sawai Madhopur","Shahpura","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur"],
  "Sikkim": ["East Sikkim","North Sikkim","South Sikkim","West Sikkim","Pakyong","Soreng"],
  "Tamil Nadu": ["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thiruvallur","Thiruvarur","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvannamalai","Vellore","Viluppuram","Virudhunagar"],
  "Telangana": ["Adilabad","Bhadradri Kothagudem","Hanumakonda","Hyderabad","Jagtial","Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam","Kumuram Bheem","Mahabubabad","Mahbubnagar","Mancherial","Medak","Medchal–Malkajgiri","Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal","Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"],
  "Uttar Pradesh": ["Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kushinagar","Lakhimpur Kheri","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Prayagraj","Rae Bareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],
  "Uttarakhand": ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"],
  "West Bengal": ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"]
};

// ─── POPULATE STATE DROPDOWN ─────────────────────────────────────
function populateStateSelect(stateSelectId) {
  const sel = document.getElementById(stateSelectId);
  if (!sel) return;
  const states = Object.keys(INDIA_DISTRICTS).sort();
  states.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    sel.appendChild(opt);
  });
}

// ─── WIRE STATE → DISTRICT ───────────────────────────────────────
function wireStateDistrict(stateId, districtId) {
  const stateSel = document.getElementById(stateId);
  const distSel  = document.getElementById(districtId);
  if (!stateSel || !distSel) return;

  stateSel.addEventListener('change', () => {
    const state = stateSel.value;
    distSel.innerHTML = '<option value="">Select district</option>';
    if (state && INDIA_DISTRICTS[state]) {
      INDIA_DISTRICTS[state].forEach(d => {
        const opt = document.createElement('option');
        opt.value = d; opt.textContent = d;
        distSel.appendChild(opt);
      });
      distSel.disabled = false;
    } else {
      distSel.disabled = true;
    }
  });
}

// ─── SECTION COLLAPSE TOGGLE ─────────────────────────────────────
function initSectionToggles() {
  document.querySelectorAll('.lf-section-head').forEach(head => {
    head.addEventListener('click', () => {
      const section = head.closest('.lf-section');
      section.classList.toggle('collapsed');
    });
  });
}

// ─── FILE UPLOAD PREVIEW ─────────────────────────────────────────
function initUploadZones() {
  document.querySelectorAll('.lf-upload').forEach(zone => {
    const input = zone.querySelector('input[type=file]');
    const preview = zone.querySelector('.lf-upload-preview');
    if (!input || !preview) return;

    input.addEventListener('change', () => {
      preview.innerHTML = '';
      Array.from(input.files).forEach(file => {
        const thumb = document.createElement('div');
        thumb.className = 'lf-preview-thumb';
        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          thumb.appendChild(img);
        } else {
          thumb.textContent = '📄';
        }
        preview.appendChild(thumb);
      });
      // Update drag text
      const title = zone.querySelector('.lf-upload-title');
      if (title) title.textContent = `${input.files.length} file(s) selected`;
    });

    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('dragover');
      input.files = e.dataTransfer.files;
      input.dispatchEvent(new Event('change'));
    });
  });
}

// ─── PROGRESS BAR UPDATE ─────────────────────────────────────────
function updateProgress() {
  const bar = document.querySelector('.lf-progress-fill');
  if (!bar) return;
  const required = document.querySelectorAll('[required]');
  let filled = 0;
  required.forEach(f => { if (f.value && f.value.trim()) filled++; });
  const pct = required.length ? Math.round((filled / required.length) * 100) : 0;
  bar.style.width = pct + '%';
}

// ─── TOAST ───────────────────────────────────────────────────────
function showToast(msg, emoji = '✓') {
  let toast = document.querySelector('.lf-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'lf-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${emoji}</span> ${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── FORM SUBMIT ─────────────────────────────────────────────────
function initFormSubmit() {
  const form = document.getElementById('listingForm');
  const btn  = document.getElementById('submitBtn');
  if (!form || !btn) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    // Basic validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(f => {
      f.classList.remove('error');
      const errEl = f.parentNode.querySelector('.lf-field-error');
      if (errEl) errEl.remove();
      if (!f.value || !f.value.trim()) {
        valid = false;
        f.classList.add('error');
        const err = document.createElement('div');
        err.className = 'lf-field-error';
        err.textContent = 'This field is required';
        f.parentNode.appendChild(err);
      }
    });

    if (!valid) {
      const firstErr = form.querySelector('.error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('Please fill all required fields', '⚠️');
      return;
    }

    // Simulate submit
    btn.disabled = true;
    btn.innerHTML = '<span>Submitting…</span> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/><path d="M9 12l2 2 4-4"/></svg>';
    setTimeout(() => {
      showToast('Listing submitted for admin review!', '🎉');
      btn.disabled = false;
      btn.innerHTML = 'Submit for Approval <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
    }, 2000);
  });

  // Live progress
  form.addEventListener('input', updateProgress);
  form.addEventListener('change', updateProgress);
}

// ─── SAVE DRAFT ──────────────────────────────────────────────────
function initSaveDraft() {
  const btn = document.querySelector('.lf-save-draft');
  if (!btn) return;
  btn.addEventListener('click', () => showToast('Draft saved successfully', '💾'));
}

// ─── INIT ALL ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateStateSelect('stateSelect');
  wireStateDistrict('stateSelect', 'districtSelect');
  initSectionToggles();
  initUploadZones();
  initFormSubmit();
  initSaveDraft();
  updateProgress();
});