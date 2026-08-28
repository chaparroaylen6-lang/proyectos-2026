let progress = 0;

const progressCircle = document.querySelector('.circle-progress');
const percentageText = document.querySelector('.percentage');
const statusText = document.querySelector('.status');

const loaderSection = document.getElementById('loader-section');
const mainApp = document.getElementById('main-app');

const interval = setInterval(() => {
    if (progress < 100) {
        progress += 1;
        const offset = 339.292 - (339.292 * progress) / 100;
        progressCircle.style.strokeDashoffset = offset;
        percentageText.textContent = `${progress}%`;
    } else {
        clearInterval(interval);
        statusText.textContent = 'Carga completa';
        
        setTimeout(() => {
            loaderSection.classList.add('hidden');
            mainApp.classList.remove('hidden');
        }, 800);
    }
}, 40);