import {
  Image as ImageComponent,
  type ImageProps as ImageComponentProps,
} from "@unpic/react/base";
import {
  type IPXOperations,
  type IPXOptions,
  transform,
} from "unpic/providers/ipx";

export type ImageProps = ImageComponentProps<IPXOperations, IPXOptions> & {
  quality?: number;
};

export function Image({
  transformer: _,
  operations: __,
  quality,
  ...props
}: ImageProps) {
  return (
    <ImageComponent
      transformer={transform}
      operations={{
        f: "avif",
        quality: quality || 80,
      }}
      options={{
        baseURL: "/_images",
      }}
      {...props}
    />
  );
}
