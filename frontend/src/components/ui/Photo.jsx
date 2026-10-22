import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

/**
 * Photo with a shimmer placeholder that fades the image in once it has
 * loaded, so slow connections never see a half-painted picture.
 *
 * Pass `zoom` and wrap in an element carrying `group` for the slow hover zoom
 * used on cards.
 *
 * @param {Object} props
 * @param {string} props.src
 * @param {string} props.alt
 * @param {boolean} [props.priority] - eager + high fetch priority (heroes only)
 * @param {string} [props.position] - CSS object-position, e.g. '50% 30%'
 */
export default function Photo({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
  zoom = false,
  position,
  width,
  height,
}) {
  const imgRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  // A cached image can finish loading before React attaches onLoad.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <div className={cn('relative overflow-hidden', !loaded && 'skeleton', className)}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={position ? { objectPosition: position } : undefined}
        className={cn(
          'h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
          zoom && 'group-hover:scale-[1.045]',
          imgClassName
        )}
      />
    </div>
  )
}
