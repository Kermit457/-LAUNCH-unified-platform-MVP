import React from 'react'
import { IconProps } from '../types'

export const IconVerified: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill="none"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.625 0C9.92133 0 8.4328 0.921163 7.63032 2.29259C7.42423 2.26451 7.21381 2.25 7 2.25C4.44568 2.25 2.375 4.32068 2.375 6.875C2.375 7.30578 2.43389 7.7228 2.54407 8.11846C1.03495 8.88005 0 10.4442 0 12.25C0 13.9109 0.875514 15.3674 2.19022 16.183C2.06645 16.6004 2 17.0424 2 17.5C2 20.0543 4.07068 22.125 6.625 22.125C7.15971 22.125 7.67321 22.0343 8.15097 21.8673C8.95817 23.2195 10.4358 24.125 12.125 24.125C13.7732 24.125 15.2201 23.2628 16.0391 21.9649C16.4251 22.0693 16.831 22.125 17.25 22.125C19.8043 22.125 21.875 20.0543 21.875 17.5C21.875 17.0658 21.8152 16.6456 21.7033 16.2471C23.077 15.4452 24 13.9554 24 12.25C24 10.5317 23.0629 9.03219 21.6719 8.23475C21.8039 7.80482 21.875 7.34821 21.875 6.875C21.875 4.32068 19.8043 2.25 17.25 2.25C16.7197 2.25 16.2102 2.33925 15.7358 2.50355C14.9669 1.01646 13.4146 0 11.625 0Z"
        fill="#543990"
      />
      <g filter="url(#filter0_d_verified)">
        <path
          d="M7.8125 10.875L6.125 12.5625L10.4375 17.0625L17.75 9.0625L16.0625 7.375L10.4375 13.5L7.8125 10.875Z"
          fill="#1C1C1C"
          stroke="#1C1C1C"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_verified"
          x="3.42529"
          y="4.65253"
          width="17.0164"
          height="15.1416"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_verified" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_verified" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}
