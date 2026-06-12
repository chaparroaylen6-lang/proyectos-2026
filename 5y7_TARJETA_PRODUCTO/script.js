
const cards = document.querySelectorAll('.product-card');

cards.forEach(card => {
    const colorOptions = card.querySelectorAll('.color-option input');
    const productImages = card.querySelectorAll('.product-images img');

    colorOptions.forEach(option => {
        option.addEventListener('change', (event) => {
            const selectedColor = event.target.value;
            productImages.forEach((image) => {
                image.classList.remove('active');
            });

            const selectedImage = card.querySelector(`.product-images img.${selectedColor}`);
            
            if(selectedImage) {
                selectedImage.classList.add('active');
            }
        });
    });
});


const heroOptions = document.querySelectorAll('.hero-color-option');

heroOptions.forEach(option => {
    option.addEventListener('click', () => {
        const container = option.closest('.hero-container');
        const heroImg = container.querySelector('.hero-product-image img');
        const heroCircle = container.querySelector('.hero-product-image');

        heroImg.src = option.dataset.img;

        if (option.dataset.color !== 'gradient') {
            heroCircle.style.setProperty('--after-bg', option.dataset.color);
        } else {
            heroCircle.style.setProperty('--after-bg', '#1a64c5');
        }

        // Reiniciar animación al hacer clic
        heroCircle.style.setProperty('--anim', 'scale');
        heroImg.style.setProperty('--anim', 'scale');

        setTimeout(() => {
            heroCircle.style.removeProperty('--anim');
            heroImg.style.removeProperty('--anim');
        }, 500);
    });
});


window.addEventListener('load', () => {
    const allHeroProducts = document.querySelectorAll('.hero-product-image');
    
    allHeroProducts.forEach(product => {
        const img = product.querySelector('img');
        
        // Aplicamos la animación a cada círculo e imagen encontrada
        product.style.setProperty('--anim', 'scale');
        if(img) img.style.setProperty('--anim', 'scale');

        // Quitamos la propiedad después de que termine la animación
        setTimeout(() => {
            product.style.removeProperty('--anim');
            if(img) img.style.removeProperty('--anim');
        }, 500);
    });
});