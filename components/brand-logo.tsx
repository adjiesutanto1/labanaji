import React from 'react'
import Image from 'next/image'

interface BrandLogoProps {
  size?: number
  src?: string
  className?: string
  priority?: boolean
  noBg?: boolean
}

export function BrandLogo({
  size = 32,
  src = '/logo.png',
  className = '',
  priority = false,
  noBg = false,
}: BrandLogoProps) {
  return (
    <div
      className={`relative shrink-0 ${
        noBg
          ? 'overflow-visible bg-transparent'
          : 'rounded-[29%] overflow-hidden bg-[#F6F1E8] border border-[#DDD4C5]/80 shadow-2xs'
      } ${className}`}
      style={{
        width: size,
        height: size,
        ...(noBg ? {} : { borderRadius: '29%' }),
      }}
    >
      <Image
        src={src}
        alt="LABANAJI"
        fill
        sizes={`${size}px`}
        priority={priority}
        className={`object-contain ${noBg ? '' : 'p-0.5 rounded-[29%]'}`}
      />
    </div>
  )
}
