import { CheckIcon, ClipboardIcon } from "lucide-react";
import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export default function Pre({
  children,
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleClickCopy = async () => {
    const code = preRef.current?.textContent;

    if (code) {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <pre ref={preRef} {...props} className={cn("relative", className)}>
      <Button
        disabled={isCopied}
        onClick={handleClickCopy}
        className="absolute right-4 size-8 flex justify-center items-center rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-100"
        type="button"
      >
        {isCopied ? (
          <CheckIcon className="size-5" />
        ) : (
          <ClipboardIcon className="size-5" />
        )}
      </Button>
      {children}
    </pre>
  );
}
