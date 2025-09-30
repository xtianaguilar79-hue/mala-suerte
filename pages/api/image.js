// pages/api/image.js
import { createReadStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import fetch from 'node-fetch';

const pump = promisify(pipeline);

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await fetch(decodeURIComponent(url));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    // Copiar los headers de la imagen original
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 día

    // Enviar el stream de la imagen
    await pump(response.body, res);
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
}
