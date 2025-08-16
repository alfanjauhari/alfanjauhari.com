'use client'

import { CheckIcon, ClipboardIcon } from 'lucide-react'
import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  useRef,
  useState,
} from 'react'

export default function Pre({
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  const [isCopied, setIsCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleClickCopy = async () => {
    const code = preRef.current?.textContent

    if (code) {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }
  }

  return (
    <pre ref={preRef} {...props} className="relative">
      <button
        disabled={isCopied}
        onClick={handleClickCopy}
        className="absolute right-4 size-8 flex justify-center items-center rounded cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed"
        type="button"
      >
        {isCopied ? (
          <CheckIcon className="size-5 text-green-500" />
        ) : (
          <ClipboardIcon className="size-5 text-gray-500" />
        )}
      </button>
      {children}
    </pre>
  )
}
