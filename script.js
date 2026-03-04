const plans = [
  { id: '15-users', name: 'Gemini Ultra Shared Accounts', credits: '45k Credits', inr: 3000, usd: 33 },
  { id: '10-users', name: '10 Users Ultra Shared', credits: '135k Credits', inr: 4200, usd: 46 }
];

const countryStateMap = {
  India: ['Maharashtra', 'Delhi', 'Karnataka', 'Uttar Pradesh', 'Gujarat'],
  USA: ['California', 'Texas', 'Florida', 'New York', 'Illinois'],
  UAE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
  UK: ['England', 'Scotland', 'Wales', 'Northern Ireland']
};


function setupChatGptBuy() {
  const chatBtn = document.getElementById('chatgpt-buy');
  if (!chatBtn) return;

  chatBtn.addEventListener('click', () => {
    const chatPlan = { id: 'chatgpt-plus', name: 'ChatGPT Plus', credits: 'N/A', inr: 499, usd: 0 };
    localStorage.setItem('currency', 'INR');
    localStorage.setItem('selectedPlan', JSON.stringify(chatPlan));
    localStorage.setItem('selectedPrice', '₹499');
  });
}

function getCurrency() {
  return localStorage.getItem('currency') || 'INR';
}

function setCurrency(currency) {
  localStorage.setItem('currency', currency);
}

function formatPrice(plan, currency) {
  return currency === 'INR' ? `₹${plan.inr.toLocaleString('en-IN')}` : `$${plan.usd}`;
}

function renderPlansPage() {
  const grid = document.getElementById('plans-grid');
  const toggle = document.getElementById('currency-toggle');
  const label = document.getElementById('currency-label');
  if (!grid || !toggle || !label) return;

  const paint = () => {
    const currency = getCurrency();
    label.textContent = `Selected: ${currency}`;
    toggle.checked = currency === 'USD';
    grid.innerHTML = '';

    plans.forEach((plan) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <h2 class="text-xl font-bold">${plan.name}</h2>
        <p class="mt-2 text-slate-300">${plan.credits}</p>
        <p class="mt-3 text-3xl font-semibold text-blue-400">${formatPrice(plan, currency)} <span class="text-base text-slate-400">per month</span></p>
        <button class="btn-primary mt-5 w-full" data-plan-id="${plan.id}">Buy Now</button>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll('button[data-plan-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const selected = plans.find((p) => p.id === btn.dataset.planId);
        localStorage.setItem('selectedPlan', JSON.stringify(selected));
        localStorage.setItem('selectedPrice', formatPrice(selected, currency));
        window.location.href = 'plan-details.html';
      });
    });
  };

  toggle.addEventListener('change', (e) => {
    setCurrency(e.target.checked ? 'USD' : 'INR');
    paint();
  });

  paint();
}

function renderPlanDetailsPage() {
  const title = document.getElementById('selected-plan-title');
  const list = document.getElementById('features-list');
  if (!title || !list) return;

  const selected = JSON.parse(localStorage.getItem('selectedPlan') || 'null') || plans[0];
  title.textContent = selected.name;

  const features = [
    selected.credits,
    '30 Days Warranty',
    'All users within this shared group will create their own separate projects',
    'The assets (images & videos etc..) that you create will be licensed only by you, no other group member can use them',
    'No Log Out Problem',
    'No Account Suspension Problem',
    'Google Gemini',
    'Google AI Studio',
    'Google Whisk',
    'Google Flow',
    'Notebook LM Ultra',
    'Nano Banana Pro',
    'Veo 3.1',
    'Google Mixboard',
    'Music FX'
  ];

  list.innerHTML = features.map((f) => `<li class="flex gap-2"><span class="text-green-400">✔</span><span>${f}</span></li>`).join('');
}

function renderCheckoutPage() {
  const form = document.getElementById('checkout-form');
  const country = document.getElementById('country');
  const state = document.getElementById('state');
  if (!form || !country || !state) return;

  country.innerHTML = '<option value="">Select Country</option>';
  Object.keys(countryStateMap).forEach((c) => {
    country.innerHTML += `<option value="${c}">${c}</option>`;
  });

  const fillStates = (selectedCountry) => {
    state.innerHTML = '<option value="">Select State</option>';
    (countryStateMap[selectedCountry] || []).forEach((s) => {
      state.innerHTML += `<option value="${s}">${s}</option>`;
    });
  };

  country.addEventListener('change', () => fillStates(country.value));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('name').value.trim(),
      country: country.value,
      state: state.value,
      city: document.getElementById('city').value.trim(),
      whatsappNo: `${document.getElementById('country-code').value}${document.getElementById('whatsapp').value.trim()}`,
      email: document.getElementById('email').value.trim()
    };

    if (Object.values(data).some((v) => !v)) {
      alert('Please fill all fields before submission.');
      return;
    }

    localStorage.setItem('userDetails', JSON.stringify(data));
    window.location.href = 'payment.html';
  });
}

function renderPaymentPage() {
  const content = document.getElementById('payment-content');
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (!content || !whatsappBtn) return;

  const currency = getCurrency();
  const selected = JSON.parse(localStorage.getItem('selectedPlan') || 'null') || plans[0];
  const selectedPrice = localStorage.getItem('selectedPrice') || formatPrice(selected, currency);

  if (currency === 'INR') {
    content.innerHTML = `
      <div class="space-y-3 text-center">
        <img src="upi-qr.jpg" alt="UPI QR" class="mx-auto h-56 w-56 rounded-xl border border-slate-600 object-cover" />
        <p class="text-lg font-semibold">UPI ID: gauravverma.otp@oksbi</p>
        <p class="text-slate-300">Gaurav ai service provider</p>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div class="space-y-3 text-center">
        <img src="binance-qr.jpg" alt="Binance QR" class="mx-auto h-56 w-56 rounded-xl border border-slate-600 object-cover" />
        <p class="text-slate-300">Scan the Binance QR to complete the crypto payment.</p>
      </div>
    `;
  }

  whatsappBtn.addEventListener('click', () => {
    const user = JSON.parse(localStorage.getItem('userDetails') || 'null');
    if (!user) {
      alert('Missing checkout details. Please fill the checkout form first.');
      window.location.href = 'checkout.html';
      return;
    }

    const msg = [
      'Hello Gaurav AI Services,',
      '',
      'I want to confirm my order details:',
      `- Name: ${user.name}`,
      `- Plan: ${selected.name}`,
      `- Price: ${selectedPrice} (${currency})`,
      `- Country: ${user.country}`,
      `- State: ${user.state}`,
      `- City: ${user.city}`,
      `- WhatsApp No: ${user.whatsappNo}`,
      `- Email: ${user.email}`,
      '',
      'I have completed payment. Kindly verify and activate my account.',
      'I will manually attach my payment screenshot in this chat.'
    ].join('\n');

    const url = `https://wa.me/918989925852?text=${encodeURIComponent(msg)}`;
    window.location.href = url;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPlansPage();
  renderPlanDetailsPage();
  renderCheckoutPage();
  renderPaymentPage();
  setupChatGptBuy();
});
