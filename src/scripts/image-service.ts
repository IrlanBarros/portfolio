import sharpService from 'astro/assets/services/sharp';
import type { LocalImageService } from 'astro';

// O pipeline continua nativo do Astro. Apenas os retratos pixelados recebem
// reamostragem nearest-neighbor e WebP lossless; os originais não são alterados.
const service: LocalImageService = {
  ...sharpService,
  async transform(input, options, config, logger) {
    if (String(options.src).includes('avatar-pixel-art-')) {
      const pixelConfig = {
        ...config,
        service: { ...config.service, config: { ...config.service.config, kernel: 'nearest' as const, webp: { lossless: true } } },
      };
      return sharpService.transform(input, options, pixelConfig, logger);
    }
    return sharpService.transform(input, options, config, logger);
  },
};
export default service;
