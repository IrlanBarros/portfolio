import type { ImageMetadata } from 'astro';
import blue from '../../assets/images/profile/avatar-ilustracao-azul.webp';
import comic from '../../assets/images/profile/avatar-quadrinhos-retrato.webp';
import pixel from '../../assets/images/profile/avatar-pixel-art-retrato.webp';
import ghibli from '../../assets/images/profile/avatar-ghibli.webp';
import pixelBlazer from '../../assets/images/profile/avatar-pixel-art-blazer.webp';
import comicBlazer from '../../assets/images/profile/avatar-quadrinhos-blazer.webp';

export interface Avatar {
  id: string;
  name: string;
  image: ImageMetadata;
  alt: string;
  position: string;
  pixelated: boolean;
  order: number;
}

export const defaultAvatarId = 'ilustracao-azul';
export const avatars: Avatar[] = [
  { id: defaultAvatarId, name: 'Ilustração digital', image: blue, alt: 'Retrato ilustrado de Irlan, de camisa azul, em um fundo azul.', position: '50% 45%', pixelated: false, order: 0 },
  { id: 'quadrinhos-retrato', name: 'Quadrinhos — retrato', image: comic, alt: 'Irlan de camisa azul em estilo de quadrinhos, com fundo pontilhado em tons quentes.', position: '50% 45%', pixelated: false, order: 1 },
  { id: 'pixel-art-retrato', name: 'Pixel Art — retrato', image: pixel, alt: 'Retrato de Irlan de camisa azul em pixel art sobre fundo azul.', position: '50% 45%', pixelated: true, order: 2 },
  { id: 'ghibli', name: 'Estilo Ghibli', image: ghibli, alt: 'Irlan de camisa azul em ambiente externo coberto, com ilustração de iluminação suave.', position: '50% 52%', pixelated: false, order: 3 },
  { id: 'pixel-art-blazer', name: 'Pixel Art — blazer', image: pixelBlazer, alt: 'Irlan sorridente, de blazer preto e camiseta branca, em cenário urbano pixelado.', position: '50% 40%', pixelated: true, order: 4 },
  { id: 'quadrinhos-blazer', name: 'Quadrinhos — blazer', image: comicBlazer, alt: 'Irlan sorridente, de blazer preto e camiseta branca, em cenário urbano ilustrado em quadrinhos.', position: '50% 40%', pixelated: false, order: 5 },
];

// A fotografia original, sétima opção citada no briefing, não foi fornecida.
// O catálogo contém exclusivamente os seis arquivos existentes e inspecionados.
