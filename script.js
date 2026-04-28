document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements selection
    const cyclistSelect = document.getElementById('cdv-cyclist');
    const rateInput = document.getElementById('cdv-rate');
    const totalDisplay = document.getElementById('cdv-total-amount');
    const hmDisplay = document.getElementById('cdv-hm');
    const hmOfDisplay = document.getElementById('cdv-hm-of');
    const btnPlus = document.getElementById('cdv-btn-plus');
    const btnMin = document.getElementById('cdv-btn-min');
    const btnFull = document.getElementById('cdv-btn-full');
    const btnSubmit = document.getElementById('cdv-submit');
    const sponsorName = document.getElementById('cdv-sponsor');
    const customWrapper = document.getElementById('cdv-custom-wrapper');
    const amountButtons = document.querySelectorAll('.cdv-amount-btn');
    const donationInput = document.getElementById('donation-amount');
    
    // Elements for movement and effects
    const bike = document.getElementById('cdv-bike');
    const fireworks = document.getElementById('cdv-fw');

    // 2. State variables
    let currentUnits = 0; 
    let maxUnits = 0;
    const increment = 500;

    // 3. Update total calculation and form
    function updateTotal() {
        const rate = parseFloat(rateInput.value) || 0;
        const total = rate * currentUnits;
        totalDisplay.innerText = total.toFixed(2).replace('.', ',');
        
        if (donationInput) {
            donationInput.value = total.toFixed(2);
        }
        
        const isNameValid = sponsorName.value.trim() !== "";
        const isCyclistValid = cyclistSelect.value !== "";
        btnSubmit.disabled = !(isNameValid && isCyclistValid && total > 0);
    }

    // 4. Bike Movement and Fireworks Logic
    function updateBikePosition() {
        const percentage = maxUnits > 0 ? (currentUnits / maxUnits) * 100 : 0;
        bike.style.offsetDistance = percentage + '%';

        // Fix 3: Show fireworks only at the top (100%)
        if (currentUnits === maxUnits && maxUnits > 0) {
            fireworks.classList.add('visible');
        } else {
            fireworks.classList.remove('visible');
        }
    }

    // 5. Stepper display update
    function updateStepperDisplay() {
        hmDisplay.innerText = (currentUnits * increment).toLocaleString();
        btnMin.disabled = currentUnits <= 0;
        btnPlus.disabled = currentUnits >= maxUnits;
        updateTotal();
        updateBikePosition(); // Trigger movement
    }

    // 6. Event Listeners
    amountButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            amountButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const amount = btn.getAttribute('data-amount');
            if (amount === 'custom') {
                customWrapper.style.display = 'block';
                rateInput.focus();
            } else {
                customWrapper.style.display = 'none';
                rateInput.value = amount;
            }
            updateTotal();
        });
    });

    cyclistSelect.addEventListener('change', () => {
        const selectedOption = cyclistSelect.options[cyclistSelect.selectedIndex];
        const maxHm = parseInt(selectedOption.getAttribute('data-max')) || 0;
        maxUnits = maxHm / increment;
        currentUnits = 0;
        updateStepperDisplay();
        btnPlus.disabled = false;
        btnMin.disabled = true;
        btnFull.disabled = false;
        btnFull.style.opacity = "1";
        hmOfDisplay.innerText = `Max: ${maxHm.toLocaleString()} hm`;
    });

    btnPlus.addEventListener('click', () => {
        if (currentUnits < maxUnits) {
            currentUnits++;
            updateStepperDisplay();
        }
    });

    btnMin.addEventListener('click', () => {
        if (currentUnits > 0) {
            currentUnits--;
            updateStepperDisplay();
        }
    });

    btnFull.addEventListener('click', () => {
        currentUnits = maxUnits;
        updateStepperDisplay();
    });

    // Fix 2: Redirect to KUL Donation Page
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault(); 
        window.location.href = "https://donate.kuleuven.cloud/Coduvelo-76/"; 
    });

    sponsorName.addEventListener('input', updateTotal);
    rateInput.addEventListener('input', updateTotal);
});
