import { cn } from '@/lib/utils'

interface BrandLogoProps {
  compact?: boolean
  inverse?: boolean
  className?: string
  tagline?: boolean
}

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span
      className={cn(
        'brand-mark-new',
        inverse && 'brand-mark-new-inverse',
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="size-full" fill="none">
        {/* Medical cross: blue + mint clinical identity */}
        <path
          d="M25 4.5h14c3.04 0 5.5 2.46 5.5 5.5v9.5H54c3.04 0 5.5 2.46 5.5 5.5v14c0 3.04-2.46 5.5-5.5 5.5h-9.5V54c0 3.04-2.46 5.5-5.5 5.5H25A5.5 5.5 0 0 1 19.5 54v-9.5H10A5.5 5.5 0 0 1 4.5 39V25c0-3.04 2.46-5.5 5.5-5.5h9.5V10A5.5 5.5 0 0 1 25 4.5Z"
          fill="#2563EB"
        />
        <path
          d="M39 4.5c3.04 0 5.5 2.46 5.5 5.5v9.5H54c3.04 0 5.5 2.46 5.5 5.5v14c0 3.04-2.46 5.5-5.5 5.5h-9.5V54c0 3.04-2.46 5.5-5.5 5.5H32V4.5h7Z"
          fill="#14B8A6"
          opacity=".92"
        />

        {/* Analytics bars */}
        <path d="M19 43V35.5" stroke="white" strokeWidth="3.4" strokeLinecap="round" opacity=".72" />
        <path d="M28.5 43V30" stroke="white" strokeWidth="3.4" strokeLinecap="round" opacity=".84" />
        <path d="M38 43V24.5" stroke="white" strokeWidth="3.4" strokeLinecap="round" opacity=".96" />

        {/* Growth trajectory */}
        <path
          d="M14.5 39.5 24 31l8 3.8 13.5-14"
          stroke="white"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m39.6 20.8 7.3-1.7-1.7 7.3"
          stroke="white"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14.5" cy="39.5" r="3" fill="#CFFAFE" stroke="white" strokeWidth="1.6" />
        <circle cx="24" cy="31" r="3" fill="#CFFAFE" stroke="white" strokeWidth="1.6" />
        <circle cx="32" cy="34.8" r="3" fill="#CFFAFE" stroke="white" strokeWidth="1.6" />
      </svg>
    </span>
  )
}

export function BrandLogo({
  compact = false,
  inverse = false,
  className,
  tagline = true,
}: BrandLogoProps) {
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-3', className)}>
      <BrandMark inverse={inverse} />
      {!compact && (
        <span className="min-w-0 leading-none">
          <span className="block truncate whitespace-nowrap text-[18px] font-extrabold tracking-[-0.055em] sm:text-[19px]">
            <span className={cn(inverse ? 'text-white' : 'text-[#123C78] dark:text-white')}>Stunt</span>
            <span className="brand-wordmark-accent">Lytics</span>
          </span>
          {tagline && (
            <span
              className={cn(
                'mt-1.5 block truncate whitespace-nowrap text-[8.5px] font-bold uppercase tracking-[0.15em] sm:text-[9px]',
                inverse ? 'text-white/60' : 'text-slate-500 dark:text-slate-400',
              )}
            >
              Child Growth Intelligence
            </span>
          )}
        </span>
      )}
    </span>
  )
}
