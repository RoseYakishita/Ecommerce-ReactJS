import { useState } from 'react';

const DEFAULT_FALLBACK = 'https://picsum.photos/seed/furniture-fallback/1200/800';

export default function ImageWithFallback({ src, alt, className = '', fallbackSrc = DEFAULT_FALLBACK, ...rest }) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
      {...rest}
    />
  );
}
