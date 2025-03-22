# YouTube Downloader

Uma aplicação Node.js que permite baixar vídeos do YouTube em formato MP3 (áudio) ou MP4 (vídeo) com diferentes opções de qualidade.
![image](https://github.com/user-attachments/assets/966a9d11-97a6-4032-a28d-2d5ad5472728)
![image](https://github.com/user-attachments/assets/b0e7a783-10d1-4844-a9f9-88e24fde5289)



## Descrição

Este projeto consiste em uma API RESTful que possibilita:
- Obter informações de vídeos do YouTube (título, canal, thumbnail, duração, visualizações)
- Fazer download de áudios em formato MP3
- Fazer download de vídeos em formato MP4, com opções de qualidade

## Estrutura do Projeto

```
Youtube_Download_Video-main/
├── node_modules/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── img/
│   │   └── downloadicon.png
│   ├── js/
│   │   └── app.js
│   └── index.html
├── src/
│   └── utils/
│       └── download.js
├── app.js
├── package-lock.json
└── package.json
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão recomendada: 14.x ou superior)
- [ffmpeg](https://ffmpeg.org/) (usado para processamento de áudio/vídeo)

## Dependências

- Express.js - Framework web para Node.js
- @distube/ytdl-core - Biblioteca para baixar mídia do YouTube
- ffmpeg-static - Versão estática do ffmpeg
- cors - Middleware para habilitar CORS (Cross-Origin Resource Sharing)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/youtube-downloader.git
cd Youtube_Download_Video-main
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
node app.js
```

O servidor será iniciado na porta 3000 por padrão.

## Uso

### Interface Web
Acesse `http://localhost:3000` em seu navegador para usar a interface web disponível em `public/index.html`.

### API Endpoints

#### 1. Obter informações do vídeo
```
GET /api/video-info?url={URL_DO_VIDEO}
```
Retorna informações básicas sobre o vídeo, como título, canal, thumbnail e duração.

**Parâmetros:**
- `url`: URL completa do vídeo do YouTube

**Exemplo de resposta:**
```json
{
"id": "aq-DH4iwviE",
"channelName": "30PRAUM",
"title": "Matuê - 333",
"thumbnail": "https://i.ytimg.com/vi/aq-DH4iwviE/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDCuMqle-MUG_NfWi7UzetqZDV5wQ",
"duration": "322",
"views": "13666580"
}
```

#### 2. Baixar vídeo/áudio
```
GET /api/download?url={URL_DO_VIDEO}&quality={QUALIDADE}&format={FORMATO}
```
Inicia o download do vídeo ou áudio conforme especificado.

**Parâmetros:**
- `url`: URL completa do vídeo do YouTube
- `quality`: Qualidade do download ("highest" ou "lowest")
- `format`: Formato de saída ("mp3" para áudio ou "mp4" para vídeo)

## Componentes Principais

- `app.js` - Arquivo principal que configura o servidor Express e define as rotas
- `src/utils/download.js` - Contém as funções para obter informações e baixar vídeos
- `public/index.html` - Interface web para o usuário
- `public/js/app.js` - JavaScript do lado cliente para a interface web
- `public/css/style.css` - Estilos para a interface web

## Funcionalidades

- Download de áudio em formato MP3
- Download de vídeo em formato MP4
- Escolha entre qualidade alta ou baixa
- Obtenção de metadados do vídeo (título, canal, visualizações, etc.)
- Interface web amigável com o ícone de download personalizado

## Notas

- Os downloads são processados em streaming, o que significa que os arquivos não são armazenados no servidor
- O módulo ffmpeg é usado para combinar streams de áudio e vídeo ao baixar vídeos MP4

## Licença

[MIT](LICENSE)
