//modulos externos
const ytdl = require('@distube/ytdl-core')
const ffmpeg = require('ffmpeg-static');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

// Garantir que o diretório de downloads existe
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

const Downloading = async (url, quality, format, res) => {
  try {
    // Validação da URL
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'URL inválida' });
    }
    
    // Validação da qualidade
    if (quality !== 'lowest' && quality !== 'highest') {
      return res.status(400).json({ error: 'Qualidade inválida. Use "lowest" ou "highest"' });
    }

    // Obtendo informações do vídeo
    const info = await ytdl.getBasicInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    const outputFileName = `${title}.${format === 'mp3' ? 'mp3' : 'mp4'}`;
    const outputPath = path.join(downloadsDir, outputFileName);

    // Download de áudio (MP3)
    if (format === 'mp3') {
      console.log(`Baixando áudio: ${title}`);
      res.header('Content-Disposition', `attachment; filename="${outputFileName}.mp3"`);
      ytdl(url, { 
        filter: 'audioonly', 
        quality: quality 
      }).pipe(res);
      return;
    }

    // Download de vídeo (MP4)
    console.log(`Baixando vídeo: ${title}`);
    
    // Configurações para áudio e vídeo
    const audioOptions = { quality: quality === 'highest' ? 'highestaudio' : 'lowestaudio' };
    const videoOptions = { quality: quality === 'highest' ? 'highestvideo' : 'lowestvideo' };
    
    // Streams de áudio e vídeo
    const audioStream = ytdl(url, { ...audioOptions, filter: 'audioonly' });
    const videoStream = ytdl(url, { ...videoOptions, filter: 'videoonly' });
    
    // Configuração do ffmpeg com flags adequadas
    const ffmpegProcess = cp.spawn(ffmpeg, [
      '-i', 'pipe:3',  // vídeo
      '-i', 'pipe:4',  // áudio
      '-map', '0:v',   // use o stream de vídeo do primeiro input
      '-map', '1:a',   // use o stream de áudio do segundo input
      '-c:v', 'copy',  // só copie o vídeo, sem recodificar
      '-c:a', 'aac',   // codifique o áudio para AAC
      '-f', 'mp4',     // formato de saída MP4
      '-movflags', 'frag_keyframe+empty_moov',  // para streaming
      'pipe:1'         // saída para stdout
    ], {
      stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe']
    });
    
    // Manipulação de erros do ffmpeg
    ffmpegProcess.stderr.on('data', (data) => {
      console.log(`ffmpeg: ${data.toString()}`);
    });
    
    // Conectando os streams
    videoStream.pipe(ffmpegProcess.stdio[3]);
    audioStream.pipe(ffmpegProcess.stdio[4]);
    
    // Configurando a resposta HTTP
    res.header('Content-Disposition', `attachment; filename="${outputFileName}"`);
    ffmpegProcess.stdout.pipe(res);
    
    // Manipulação de erros nos streams
    videoStream.on('error', (err) => {
      console.error('Erro no stream de vídeo:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erro no stream de vídeo' });
      }
    });
    
    audioStream.on('error', (err) => {
      console.error('Erro no stream de áudio:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erro no stream de áudio' });
      }
    });
    
  } catch (error) {
    console.error('Erro:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erro ao processar o download: ' + error.message });
    }
  }
};

module.exports = { Downloading };


  //receber o nome do video
async function getVideoName(url){
  const info = await ytdl.getBasicInfo(url);
  const videoname = info.videoDetails.title
  return videoname
}
  //receber o nome do video
const getVideoInfo = (url, callback) => {
  if (!ytdl.validateURL(url)) {
      return callback(new Error('URL inválida'), null);
  }

  ytdl.getBasicInfo(url)
      .then((info) => callback(null, info))
      .catch((error) => callback(error, null));
};









module.exports = { Downloading, getVideoInfo };