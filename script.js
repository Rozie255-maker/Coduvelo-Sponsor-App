document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements selection with helper to catch errors
    const getEl = (id) => {
        const el = document.getElementById(id);
        if (!el) console.warn(`Element with id "${id}" not found. Check your HTML.`);
        return el;
    };

    const cyclistSelect = getEl('cdv-cyclist');
    const rateInput = getEl('cdv-rate');
    const totalDisplay = getEl('cdv-total-amount');
    const hmDisplay = getEl('cdv-hm');
    const hmOfDisplay = getEl('cdv-hm-of');
    const btnPlus = getEl('cdv-btn-plus');
    const btnMin = getEl('cdv-btn-min');
    const btnFull = getEl('cdv-btn-full');
    const btnSubmit = getEl('cdv-submit');
    const sponsorName = getEl('cdv-sponsor');
    const customWrapper = getEl('cdv-custom-wrapper');
    const donationInput = getEl('donation-amount');
    const bike = getEl('cdv-bike');
    const fireworks = getEl('cdv-fw');
    const amountButtons = document.querySelectorAll('.cdv-amount-btn');

    // 2. State variables
    let currentUnits = 0; 
    let maxUnits = 0;
    const increment = 500;

    // 3. Update total calculation
    function updateTotal() {
        if (!rateInput || !totalDisplay) return;
        const rate = parseFloat(rateInput.value) || 0;
        const total = rate * currentUnits;
        totalDisplay.innerText = total.toFixed(2).replace('.', ',');
        
        if (donationInput) donationInput.value = total.toFixed(2);
        
        if (btnSubmit && sponsorName && cyclistSelect) {
            const isNameValid = sponsorName.value.trim() !== "";
            const isCyclistValid = cyclistSelect.value !== "";
            btnSubmit.disabled = !(isNameValid && isCyclistValid && total > 0);
        }
    }

    // 4. Bike Movement and Fireworks Logic
    function updateBikePosition() {
        if (!bike) return;
        const percentage = maxUnits > 0 ? (currentUnits / maxUnits) * 100 : 0;
        bike.style.offsetDistance = percentage + '%';

        if (fireworks) {
            if (currentUnits === maxUnits && maxUnits > 0) {
                fireworks.classList.add('visible');
            } else {
                fireworks.classList.remove('visible');
            }
        }
    }

    // 5. Stepper display update
    function updateStepperDisplay() {
        if (hmDisplay) hmDisplay.innerText = (currentUnits * increment).toLocaleString();
        if (btnMin) btnMin.disabled = currentUnits <= 0;
        if (btnPlus) btnPlus.disabled = currentUnits >= maxUnits;
        updateTotal();
        updateBikePosition();
    }

    // 6. Event Listeners
    amountButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            amountButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const amount = btn.getAttribute('data-amount');
            if (amount === 'custom') {
                if(customWrapper) customWrapper.style.display = 'block';
                if(rateInput) rateInput.focus();
            } else {
                if(customWrapper) customWrapper.style.display = 'none';
                if(rateInput) rateInput.value = amount;
            }
            updateTotal();
        });
    });

    if (cyclistSelect) {
        cyclistSelect.addEventListener('change', () => {
            const selectedOption = cyclistSelect.options[cyclistSelect.selectedIndex];
            const maxHm = parseInt(selectedOption.getAttribute('data-max')) || 0;
            maxUnits = maxHm / increment;
            currentUnits = 0;
            updateStepperDisplay();
            if (btnPlus) btnPlus.disabled = false;
            if (btnMin) btnMin.disabled = true;
            if (btnFull) {
                btnFull.disabled = false;
                btnFull.style.opacity = "1";
            }
            if (hmOfDisplay) hmOfDisplay.innerText = `Max: ${maxHm.toLocaleString()} hm`;
        });
    }

    if (btnPlus) btnPlus.addEventListener('click', () => {
        if (currentUnits < maxUnits) {
            currentUnits++;
            updateStepperDisplay();
        }
    });

    if (btnMin) btnMin.addEventListener('click', () => {
        if (currentUnits > 0) {
            currentUnits--;
            updateStepperDisplay();
        }
    });

    if (btnFull) btnFull.addEventListener('click', () => {
        currentUnits = maxUnits;
        updateStepperDisplay();
    });

    if (btnSubmit) {
        btnSubmit.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.location.href = "https://donate.kuleuven.cloud/Coduvelo-76/"; 
        });
    }

    if (sponsorName) sponsorName.addEventListener('input', updateTotal);
    if (rateInput) rateInput.addEventListener('input', updateTotal);
});
