import { forwardRef } from 'react'

type ButtonProps = {
  className?: string
  children: any
  variant?: string
  icon?: string
  iconSize?: number
  disabled?: boolean
  isWorking?: boolean
  type?: 'submit' | 'reset'
  onClick?: () => void
}

// eslint-disable-next-line react/display-name
const Button = forwardRef(
  (
    { children, variant, disabled, isWorking, type, onClick, ...buttonRests }: ButtonProps,
    ref: any
  ) => {
    const handleClick = () => {
      if (!disabled && !isWorking && onClick) {
        onClick()
      }
    }

    return (
      <button
        className="inline-flex justify-center items-center bg-blue-200 align-middle rounded px-3 py-2"
        onClick={handleClick}
        disabled={disabled || isWorking}
        ref={ref}
        type={type}
        {...buttonRests}
      >
        {isWorking && (
          <svg
            className="w-5 h-5 mr-3 -ml-1 text-black animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children && <div>{children}</div>}
      </button>
    )
  }
)

export default Button
