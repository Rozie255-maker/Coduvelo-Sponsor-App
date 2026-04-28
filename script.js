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

    // 2. State variables
    let currentUnits = 0; // Number of 500hm blocks
    let maxUnits = 0;
    const increment = 500;

    // 3. Update total calculation
    function updateTotal() {
        const rate = parseFloat(rateInput.value) || 0;
        const total = rate * currentUnits;
        totalDisplay.innerText = total.toFixed(2).replace('.', ',');
        
        // Enable/Disable Submit button
        const isNameValid = sponsorName.value.trim() !== "";
        const isCyclistValid = cyclistSelect.value !== "";
        btnSubmit.disabled = !(isNameValid && isCyclistValid && total > 0);
    }

    // 4. Logic for donation rate buttons
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

    // 5. Logic for rate input
    rateInput.addEventListener('input', () => {
        updateTotal();
    });

    // 6. Logic for Cyclist Selection
    cyclistSelect.addEventListener('change', () => {
        const selectedOption = cyclistSelect.options[cyclistSelect.selectedIndex];
        const maxHm = parseInt(selectedOption.getAttribute('data-max')) || 0;
        maxUnits = maxHm / increment;
        
        // Reset and enable stepper
        currentUnits = 0;
        updateStepperDisplay();
        btnPlus.disabled = false;
        btnMin.disabled = true;
        btnFull.disabled = false;
        btnFull.style.opacity = "1";
        
        hmOfDisplay.innerText = `Max: ${maxHm.toLocaleString()} hm`;
        updateTotal();
    });

    // 7. Stepper logic
    function updateStepperDisplay() {
        hmDisplay.innerText = (currentUnits * increment).toLocaleString();
        btnMin.disabled = currentUnits <= 0;
        btnPlus.disabled = currentUnits >= maxUnits;
        updateTotal();
    }

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

    // 8. Name change listener
    sponsorName.addEventListener('input', updateTotal);
});
