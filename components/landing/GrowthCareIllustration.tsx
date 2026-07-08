'use client'

export function GrowthCareIllustration() {
  return (
    <svg
      viewBox="0 0 760 720"
      className="h-full w-full"
      role="img"
      aria-label="Illustration of a child health worker reviewing growth monitoring data"
    >
      <defs>
        <linearGradient id="coat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbe9f3" />
        </linearGradient>
        <linearGradient id="mintPanel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22c7bc" />
          <stop offset="1" stopColor="#0b8f98" />
        </linearGradient>
        <linearGradient id="bluePanel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b78ff" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <radialGradient id="skin" cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#f1c5a7" />
          <stop offset="1" stopColor="#bd7657" />
        </radialGradient>
        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#263b5f" floodOpacity=".16" />
        </filter>
        <filter id="cardShadow" x="-40%" y="-40%" width="180%" height="200%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#183052" floodOpacity=".14" />
        </filter>
        <clipPath id="portraitClip">
          <rect x="166" y="104" width="430" height="570" rx="210" />
        </clipPath>
      </defs>

      <ellipse cx="383" cy="660" rx="222" ry="30" fill="#dfe7ec" opacity=".75" />
      <rect x="166" y="104" width="430" height="570" rx="210" fill="#eef2f4" />

      <g clipPath="url(#portraitClip)">
        <rect x="140" y="80" width="500" height="620" fill="#eef2f4" />
        <circle cx="560" cy="205" r="138" fill="#d8f2ef" />
        <circle cx="205" cy="510" r="170" fill="#dfe9ff" />

        <path d="M250 710C263 563 314 475 391 449C473 421 565 505 598 710Z" fill="url(#coat)" />
        <path d="M380 454C399 420 416 398 439 394C459 401 471 423 478 454C454 487 409 489 380 454Z" fill="#ad6b50" />
        <ellipse cx="424" cy="321" rx="112" ry="137" fill="url(#skin)" />
        <path d="M314 320C306 237 331 177 402 162C489 143 550 195 553 277C532 239 507 221 469 216C417 209 382 242 353 269C339 282 325 300 314 320Z" fill="#182333" />
        <path d="M329 265C347 193 414 165 480 187C521 201 548 234 551 275C522 239 484 227 447 231C397 236 367 265 329 265Z" fill="#202e3e" />
        <path d="M327 299C312 292 297 305 298 329C299 351 314 368 332 366Z" fill="#c27b5d" />
        <path d="M526 297C546 289 560 303 557 330C555 351 541 366 524 364Z" fill="#c27b5d" />
        <ellipse cx="386" cy="320" rx="9" ry="6" fill="#27303a" />
        <ellipse cx="467" cy="320" rx="9" ry="6" fill="#27303a" />
        <path d="M412 350C423 358 438 358 449 350" fill="none" stroke="#9f5d45" strokeWidth="5" strokeLinecap="round" />
        <path d="M385 384C410 401 445 402 469 383" fill="none" stroke="#8d4e40" strokeWidth="7" strokeLinecap="round" />
        <path d="M318 535C348 518 368 531 386 575L410 665H274L291 581C298 555 306 542 318 535Z" fill="#ffffff" />
        <path d="M536 530C505 511 482 528 463 574L438 665H584L562 575C555 549 547 537 536 530Z" fill="#ffffff" />
        <path d="M391 466L422 505L455 466L483 491L441 570H404L364 491Z" fill="#172033" />
        <path d="M422 505L435 542L426 640L407 640L410 542Z" fill="#2b6cf6" />
        <path d="M352 485C337 547 329 608 329 675" fill="none" stroke="#8fb4cd" strokeWidth="7" strokeLinecap="round" />
        <path d="M495 487C514 552 522 611 521 675" fill="none" stroke="#8fb4cd" strokeWidth="7" strokeLinecap="round" />
        <circle cx="338" cy="650" r="25" fill="none" stroke="#8fb4cd" strokeWidth="7" />
      </g>

      <g filter="url(#cardShadow)">
        <rect x="64" y="174" width="212" height="132" rx="24" fill="#ffffff" />
        <circle cx="102" cy="215" r="20" fill="#edf9f7" />
        <path d="M94 215h16M102 207v16" stroke="#0ea5a0" strokeWidth="3" strokeLinecap="round" />
        <text x="132" y="208" fontSize="15" fontWeight="700" fill="#172033">Growth review</text>
        <text x="132" y="230" fontSize="11" fill="#6b7890">Monthly monitoring cycle</text>
        <rect x="92" y="258" width="150" height="9" rx="4.5" fill="#eef2f6" />
        <rect x="92" y="258" width="119" height="9" rx="4.5" fill="#2b6cf6" />
        <text x="92" y="287" fontSize="10" fontWeight="700" fill="#2b6cf6">79% reviewed</text>
      </g>

      <g filter="url(#cardShadow)">
        <rect x="493" y="154" width="190" height="224" rx="28" fill="url(#mintPanel)" />
        <text x="519" y="190" fontSize="11" fontWeight="700" fill="#d8fffb">REGIONAL SIGNAL</text>
        <text x="519" y="229" fontSize="32" fontWeight="800" fill="#ffffff">25.2%</text>
        <text x="519" y="249" fontSize="11" fill="#d8fffb">current prevalence</text>
        <path d="M519 320C538 300 548 308 567 286C586 264 600 282 620 251C633 231 647 235 660 220" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="660" cy="220" r="6" fill="#ffffff" />
        <text x="519" y="348" fontSize="10" fill="#d8fffb">↓ 1.7 pts from prior cycle</text>
      </g>

      <g filter="url(#cardShadow)">
        <rect x="94" y="440" width="188" height="144" rx="26" fill="url(#bluePanel)" />
        <text x="120" y="477" fontSize="11" fontWeight="700" fill="#dce8ff">PRIORITY AREAS</text>
        <text x="120" y="522" fontSize="35" fontWeight="800" fill="#ffffff">06</text>
        <text x="120" y="547" fontSize="11" fill="#dce8ff">need coordinated review</text>
      </g>

      <g filter="url(#cardShadow)">
        <rect x="520" y="454" width="156" height="110" rx="24" fill="#ffffff" />
        <circle cx="553" cy="489" r="17" fill="#fff3df" />
        <path d="M553 478v12l8 5" fill="none" stroke="#d88716" strokeWidth="3" strokeLinecap="round" />
        <text x="580" y="485" fontSize="10" fill="#6b7890">FOLLOW-UP</text>
        <text x="580" y="507" fontSize="18" fontWeight="800" fill="#172033">84%</text>
        <text x="545" y="538" fontSize="10" fill="#6b7890">verified this cycle</text>
      </g>
    </svg>
  )
}
