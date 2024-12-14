import { FC } from 'react'

export const ZmkStudio: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 135.47 135.47"
    width={32}
    height={32}
    className="rounded-md"
  >
    <defs>
      <linearGradient
        id="a"
        x2={135.5}
        y1={-0.19}
        y2={135.32}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} stopColor="#026fc5" />
        <stop offset={1} stopColor="#7829d1" />
      </linearGradient>
    </defs>
    <g strokeLinecap="round">
      <path
        fill="url(#a)"
        stroke="url(#a)"
        strokeLinejoin="round"
        strokeWidth={0.15}
        d="M0-.19h135.5v135.5H0z"
        paintOrder="stroke markers fill"
        style={{
          mixBlendMode: 'normal',
        }}
      />
      <g fill="none" stroke="#fff" strokeWidth={8.76}>
        <path
          strokeLinejoin="round"
          d="M53.52 85.45V48.48l14.24 18.16 14.19-18.1v37.59M15.49 48.89h22.14l-21.31 36.9h20.53m61.71-37.4V87"
        />
        <path
          strokeLinejoin="bevel"
          strokeMiterlimit={0}
          d="m119.86 48.5-18.32 18.14 18.44 20.44"
        />
      </g>
    </g>
  </svg>
)
