const  express = require ('express');
const { Downloading, getVideoInfo }  = require ('C:/Users/lvy/Desktop/YoutubeDownload/src/utils/download.js');
const path = require('path');
const cors = require('cors');

const app = express()
app.use(cors());

//Definindo caminhos
const publicDirectoryPath = path.join(__dirname, '../public')


app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
  res.render('index')
})

//Buscar informações do vídeo
app.get('/api/video-info', (req, res) => {
  const url = req.query.url;

  if (!url) {
      return res.status(400).json({ error: 'URL não fornecida' });
  }

  getVideoInfo(url, (erro, info) => {
      if (erro) {
          return res.status(400).json({ error: erro.message });
      }
      res.json({id:info.videoDetails.videoId,
                channelName: info.videoDetails.author.name,
                title: info.videoDetails.title,
                thumbnail: info.videoDetails.thumbnails[2].url,
                duration: (info.videoDetails.lengthSeconds),
                views: info.videoDetails.viewCount


      });
  });
});

// Faz o download do Audio/Video
app.get('/api/download', async (req, res) => {
  try {
    const { url, quality, format } = req.query;

    if (!url || !quality || !format) {
      return res.status(400).json({ error: 'Parâmetros faltando (url, quality, format)' });
    }
   
    await Downloading(url, quality, format, res);
  } catch (erro) {
    console.error('Erro na rota:', erro);
    if (!res.headersSent) {
      return res.status(500).json({ error: erro.message });
    }
  }
});

app.listen(3000,()=>{
  console.log('Server is us on port 3000')
})