
document.addEventListener('DOMContentLoaded', function() {
    const downloadForm = document.getElementById('download-form');
    const videoUrlInput = document.getElementById('video-url');
    const loader = document.getElementById('loader');
    const videoInfo = document.getElementById('video-info');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoTitle = document.getElementById('video-title');
    const videoChannel = document.getElementById('video-channel');
    const videoDuration = document.getElementById('video-duration');
    const videoViews = document.getElementById('video-views');
    const qualityOptions = document.getElementById('quality-options');
    const downloadBtn = document.getElementById('download-btn');

    
    let videoData = null;
    let selectedQuality = null;
    
    // Formatar duração do vídeo (de segundos para MM:SS ou HH:MM:SS)
    function formatDuration(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    // Formatar número de visualizações
    function formatViews(views) {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M';
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        } else {
            return views.toString();
        }
    }
    
    downloadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const videoUrl = videoUrlInput.value.trim();
        if (!videoUrl) return;
        // Mostrar loader e esconder informações do vídeo
        videoInfo.classList.remove('active');
        loader.classList.add('active');
        
        setTimeout(() => {
            fetch(`/api/video-info?url=${encodeURIComponent(videoUrl)}`)
                .then(response => response.json())
                .then(data => { 
                    if (data.error) {
                        alert('Erro ao obter informações do vídeo: ' + data.error);
                        return;
                    }
                    videoData = data;
                    
                    updateVideoInfo(); // Atualizar as informações do vídeo aqui
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Erro ao obter informações do vídeo');
                })
                .finally(() => {
                    loader.classList.remove('active');
                });
        }, 3000);
        
    });
    
    function updateVideoInfo() {
        // Atualizar detalhes do vídeo
        videoThumbnail.src = videoData.thumbnail;
        videoThumbnail.alt = videoData.title;
        videoTitle.textContent = videoData.title;
        videoChannel.textContent = `Canal: ${videoData.channelName}`;
        videoDuration.textContent = `Duração: ${formatDuration(videoData.duration)}`;
        videoViews.textContent = `Visualizações: ${formatViews(videoData.views)}`;
                
        // Definir qualidades padrão desejadas e seus formatos
        const defaultQualities = [
            { quality: "lowest", format: "mp4" },
            { quality: "Highest", format: "mp4"  },
            { quality: "lowest", format: "mp3" },
            { quality: "Highest", format: "mp3"},
        ];

        // Limpar opções de qualidade antes de adicionar novas
        qualityOptions.innerHTML = '';

        defaultQualities.forEach(format => {
            const option = document.createElement('div');
            option.className = 'quality-option';
            option.dataset.quality = format.quality;
            option.dataset.format = format.format;

            option.innerHTML = `
                <strong>${format.quality}</strong>
                <div>${format.format.toUpperCase()}</div>
            `;

            option.addEventListener('click', function() {
                // Remover seleção anterior
                document.querySelectorAll('.quality-option.selected')
                    .forEach(el => el.classList.remove('selected'));

                //Qualidade e formato selecionado
                option.classList.add('selected');
                selectedQuality = {
                    quality: format.quality.toLowerCase(),
                    format: format.format.toLowerCase()
                };
            });

            qualityOptions.appendChild(option);
        });
        
        // Seleciona a opção Highest por padrão
        const defaultOption = document.querySelector('[data-quality="Highest"]') || 
                            document.querySelector('.quality-option');
        
        
        
        if (defaultOption) {
            defaultOption.click();
        }
        
        // Mostrar informações do vídeo
        videoInfo.classList.add('active');
    }
    
    downloadBtn.addEventListener('click', function() {
        const videoUrl = videoUrlInput.value.trim();
        const quality = selectedQuality.quality;
        const format = selectedQuality.format;
        
        if (!videoUrl || !quality || !format) return;
        
        alert(`Iniciando o download de "${videoData.title}" em ${quality} (${format})`);
        
        // Mostrar loader (assumindo que você tem esse elemento)
        loader.classList.add('active');
        
        // Construir a URL com os parâmetros
        const downloadUrl = `/api/download?url=${encodeURIComponent(videoUrl)}&quality=${quality}&format=${format}`;
        
        // Para arquivos, precisamos redirecionar a janela em vez de usar fetch
        // Isso permite ao navegador lidar com o download naturalmente
        window.location.href = downloadUrl;
        setTimeout(()=>{
            loader.classList.remove('active');

        },10000)
       
    });
});
