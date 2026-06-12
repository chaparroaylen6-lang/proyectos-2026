const countries = [
    { name: "Argentina", code: "54", flag: "ar", digits: 10 },
    { name: "Brasil", code: "55", flag: "br", digits: 11 },
    { name: "Chile", code: "56", flag: "cl", digits: 9 },
    { name: "Colombia", code: "57", flag: "co", digits: 10 },
    { name: "Costa Rica", code: "506", flag: "cr", digits: 8 },
    { name: "Ecuador", code: "593", flag: "ec", digits: 9 },
    { name: "El Salvador", code: "503", flag: "sv", digits: 8 },
    { name: "España", code: "34", flag: "es", digits: 9 },
    { name: "Estados Unidos", code: "1", flag: "us", digits: 10 },
    { name: "Guatemala", code: "502", flag: "gt", digits: 8 },
    { name: "Honduras", code: "504", flag: "hn", digits: 8 },
    { name: "México", code: "52", flag: "mx", digits: 10 },
    { name: "Nicaragua", code: "505", flag: "ni", digits: 8 },
    { name: "Panamá", code: "507", flag: "pa", digits: 8 },
    { name: "Paraguay", code: "595", flag: "py", digits: 9 },
    { name: "Perú", code: "51", flag: "pe", digits: 9 },
    { name: "República Dominicana", code: "1", flag: "do", digits: 10 },
    { name: "Uruguay", code: "598", flag: "uy", digits: 8 },
    { name: "Venezuela", code: "58", flag: "ve", digits: 10 }
];

const countrySelect = document.getElementById('country');
countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.code;
    option.setAttribute('data-flag', country.flag);
    option.setAttribute('data-digits', country.digits);
    option.textContent = `${country.name} (+${country.code})`;
    countrySelect.appendChild(option);
});

countrySelect.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const flagCode = selectedOption.getAttribute('data-flag');
    const flagElement = document.getElementById('flag');
    
    flagElement.className = 'flag-icon';
    flagElement.classList.add(`flag-icon-${flagCode}`);
    
    validatePhoneNumber();
});

const phoneInput = document.getElementById('phone');
const generateBtn = document.getElementById('generate');
const generateNewBtn = document.getElementById('generate-new');
const copyBtn = document.getElementById('copy');
const downloadBtn = document.getElementById('download');
const phoneError = document.getElementById('phone-error');
const outputDiv = document.getElementById('output');
const whatsappLink = document.getElementById('whatsapp-link');
const qrContainer = document.getElementById('qr-container');
const qrPlaceholder = document.getElementById('qr-placeholder');

phoneInput.addEventListener('input', validatePhoneNumber);

function validatePhoneNumber() {
    const phoneNumber = phoneInput.value.trim();
    const selectedOption = countrySelect.options[countrySelect.selectedIndex];
    const requiredDigits = parseInt(selectedOption.getAttribute('data-digits'));

    if (!phoneNumber) {
        generateBtn.disabled = true;
        phoneError.style.display = 'none';
        return false;
    }

    if (!/^\d+$/.test(phoneNumber)) {
        phoneError.textContent = 'El número solo debe contener dígitos';
        phoneError.style.display = 'block';
        generateBtn.disabled = true;
        return false;
    }

    if (phoneNumber.length !== requiredDigits) {
        phoneError.textContent = `El número para este país debe tener ${requiredDigits} dígitos`;
        phoneError.style.display = 'block';
        generateBtn.disabled = true;
        return false;
    }

    phoneError.style.display = 'none';
    generateBtn.disabled = false;
    return true;
}

generateBtn.addEventListener('click', function() {
    if (!validatePhoneNumber()) return;

    const countryCode = countrySelect.value;
    const phoneNumber = phoneInput.value.trim();
    const message = encodeURIComponent(document.getElementById('message').value.trim());

    let whatsappLinkValue = `https://wa.me/${countryCode}${phoneNumber}`;
    if (message) {
        whatsappLinkValue += `?text=${message}`;
    }

    whatsappLink.value = whatsappLinkValue;
    copyBtn.disabled = false;
    generateNewBtn.style.display = 'block';
    generateBtn.style.display = 'none';

    generateQRCode(whatsappLinkValue);
});

function generateQRCode(url) {
    qrContainer.innerHTML = '';
    qrPlaceholder.style.display = 'none';
    qrContainer.style.display = 'block';

    new QRCode(qrContainer, {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    downloadBtn.disabled = false;
}

downloadBtn.addEventListener('click', function() {
    const canvas = qrContainer.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'whatsapp-qr.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

generateNewBtn.addEventListener('click', function() {
    phoneInput.value = '';
    document.getElementById('message').value = '';
    whatsappLink.value = '';
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
    generateBtn.style.display = 'block';
    generateNewBtn.style.display = 'none';
    generateBtn.disabled = true;

    qrContainer.innerHTML = '';
    qrContainer.style.display = 'none';
    qrPlaceholder.style.display = 'block';

    phoneInput.focus();
});

copyBtn.addEventListener('click', function() {
    whatsappLink.select();
    document.execCommand('copy');
    
    const originalText = this.innerHTML;
    this.innerHTML = '<i class="fas fa-check"></i> Copiado!';
    setTimeout(() => {
        this.innerHTML = originalText;
    }, 2000);
});

if (countrySelect.options.length > 0) {
    countrySelect.dispatchEvent(new Event('change'));
}