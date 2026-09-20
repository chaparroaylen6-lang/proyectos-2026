document.addEventListener('DOMContentLoaded', () => {
    // Selección de elementos del DOM
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const snapBtn = document.getElementById('snap');
    const toggleCameraBtn = document.getElementById('toggleCamera');
    const clearGalleryBtn = document.getElementById('clearGallery');
    
    const photo = document.getElementById('photo');
    const photoPreview = document.getElementById('photo-preview');
    const gallery = document.getElementById('gallery');

    let cameraStream = null;
    let facingMode = 'user'; 
    let isCameraOn = false;

    function startCamera() {
        stopCamera(); 

        const constraints = {
            video: {
                facingMode: facingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                cameraStream = stream;
                video.srcObject = stream;
                isCameraOn = true;
                
                if(facingMode === 'user') {
                    video.style.transform = 'scaleX(-1)';
                } else {
                    video.style.transform = 'scaleX(1)';
                }
            })
            .catch(error => {
                console.error('Error al acceder a la cámara:', error);
                alert('No se pudo acceder a la cámara. Revisa los permisos.');
            });
    }

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            cameraStream = null;
            isCameraOn = false;
        }
    }

    function switchCamera() {
        facingMode = facingMode === 'user' ? 'environment' : 'user';
        startCamera();
    }

    
    function capturePhoto() {
        if (!isCameraOn) {
            alert('Cargando cámara...');
            return;
        }


        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        if(facingMode === 'user') {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
        }
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        
        context.setTransform(1, 0, 0, 1, 0, 0);

       
        const dataURL = canvas.toDataURL('image/jpeg', 0.9);
        photo.src = dataURL;
        photoPreview.style.display = 'block';

        
        document.body.classList.add('flash-effect');
        setTimeout(() => {
            document.body.classList.remove('flash-effect');
        }, 300);

        
        savePhoto(dataURL);
    }

    
    function savePhoto(dataURL) {
        let photos = JSON.parse(localStorage.getItem('y2k_photos')) || [];
        photos.unshift(dataURL); 
        localStorage.setItem('y2k_photos', JSON.stringify(photos));
        displayPhotos();
    }

    
    function displayPhotos() {
        const photos = JSON.parse(localStorage.getItem('y2k_photos')) || [];
        gallery.innerHTML = '';

        if (photos.length === 0) {
            gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--dark-color);">Aún no hay fotos</p>';
            return;
        }

        photos.forEach((photoURL, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = photoURL;
            img.className = 'gallery-photo';
            img.loading = 'lazy';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deletePhoto(index);
            };

            galleryItem.appendChild(img);
            galleryItem.appendChild(deleteBtn);
            gallery.appendChild(galleryItem);
        });
    }

    
    function deletePhoto(index) {
        const photos = JSON.parse(localStorage.getItem('y2k_photos')) || [];
        photos.splice(index, 1);
        localStorage.setItem('y2k_photos', JSON.stringify(photos));
        displayPhotos();
    }

    
    function clearGallery() {
        if (confirm('¿Segura/o que quieres borrar toda tu galería? 🥺')) {
            localStorage.removeItem('y2k_photos');
            displayPhotos();
            photoPreview.style.display = 'none';
        }
    }

    
    let mediaRecorder;
    let recordedChunks = [];
    let isRecording = false;

    function toggleRecording() {
        if (!isCameraOn) {
            alert('Cargando cámara...');
            return;
        }

        if (!isRecording) {
            
            recordedChunks = [];
            mediaRecorder = new MediaRecorder(cameraStream);
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'Y2K_Video.webm'; 
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            };

            mediaRecorder.start();
            isRecording = true;
            
            
            document.querySelector('.video-container').style.border = '4px solid red';
            document.querySelector('.video-container').style.boxShadow = '0 0 20px red';

        } else {
            
            mediaRecorder.stop();
            isRecording = false;
            
            
            document.querySelector('.video-container').style.border = 'none';
            document.querySelector('.video-container').style.boxShadow = 'none';
        }
    }

    
    
    
    toggleCameraBtn.addEventListener('click', capturePhoto);
    

    snapBtn.addEventListener('click', toggleRecording);
    clearGalleryBtn.addEventListener('click', clearGallery);
    startCamera();
    displayPhotos();
}); 