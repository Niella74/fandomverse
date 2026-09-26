import { useState } from 'react';
import PosterArt from './PosterArt';
import { useManifest, imageSrc } from '../lib/images';

/* Shows a real image when one has been added for this record, and falls
   back to the procedural artwork otherwise — including if the file is present in
   the manifest but fails to decode. Drop-in replacement for PosterArt. */

const RATIO_CLASS = {
  tall: 'object-cover',
  wide: 'object-cover',
  square: 'object-cover',
};

export default function Artwork({ id, seed, ratio = 'tall', label = '', className = '', priority = false }) {
  const manifest = useManifest();
  const [failed, setFailed] = useState(false);
  const src = failed ? null : imageSrc(manifest, id);

  if (src) {
    return (
      <img
        src={src}
        alt={label ? `Artwork for ${label}` : ''}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onError={() => setFailed(true)}
        className={`size-full ${RATIO_CLASS[ratio] || 'object-cover'} ${className}`}
      />
    );
  }

  return <PosterArt seed={seed} ratio={ratio} label={label} className={className} />;
}
