interface OGProps {
  type: "home" | "update" | "project" | "snippet" | "page" | 'work';
  title?: string;
  category?: string | string[];
  date?: string;
  meta?: string;
}

const OGTemplate: React.FC<OGProps> = ({
  type = "home",
  title,
  category,
  date,
  meta,
}) => {
  return (
    <div tw="overflow-hidden bg-[#050505] text-[#ededed] flex flex-col justify-between p-16 font-[Inter] size-full">
      {/* Header */}
      <div tw="flex justify-between items-start relative z-10">
        <div tw="flex flex-col">
          <span tw="font-[Playfair_Display] text-3xl font-bold tracking-tight">
            AJ.
          </span>
          <span tw="text-sm font-[JetBrains_Mono] uppercase tracking-[0.2em] text-foreground/50 mt-2">
            Alfan Jauhari
          </span>
        </div>
        {type !== "page" && (
          <div tw="flex items-center gap-3 border border-white/20 rounded-full px-4 py-2 bg-white/5 backdrop-blur-sm">
            <div tw="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span tw="text-xs font-[JetBrains_Mono] uppercase tracking-widest text-gray-300">
              {type === "home" ? "Portfolio v4.0" : type}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div tw="relative z-10 flex-1 flex flex-col justify-center">
        {type === "home" ? (
          <div tw="space-y-6 block">
            <h1 tw="font-[Playfair_Display] text-9xl leading-[0.8] tracking-tighter">
              Alfan Jauhari
            </h1>
            <p tw="text-2xl text-foreground/40 font-light max-w-2xl font-[JetBrains_Mono] mt-8 flex justify-start gap-1">
              A passionate Product Engineer. I build pixel-perfect interfaces
              and scalable systems for everyone.
            </p>
          </div>
        ) : (
          <div tw="space-y-8 block">
            <h1 tw="text-8xl leading-[0.9] tracking-tight max-w-4xl text-balance font-[Playfair_Display]">
              {title}
            </h1>
            <div tw="flex items-center gap-4">
              {category ? (
                typeof category === "string" ? (
                  <span tw="text-sm font-[JetBrains_Mono] uppercase tracking-[0.2em] text-foreground/50 border border-white/20 px-3 py-1 rounded">
                    {category}
                  </span>
                ) : (
                  category.map((c) => (
                    <span
                      tw="text-sm font-[JetBrains_Mono] uppercase tracking-[0.2em] text-foreground/50 border border-white/20 px-3 py-1 rounded"
                      key={c}
                    >
                      {c}
                    </span>
                  ))
                )
              ) : null}
              <span tw="text-sm font-[JetBrains_Mono] uppercase tracking-widest text-gray-600">
                {date}
              </span>
            </div>
            <p tw="text-2xl text-foreground/40 font-[Playfair_Display] italic max-w-2xl border-l-2 border-white/20 pl-6 line-clamp-3">
              {meta}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div tw="flex justify-between items-end relative z-10 border-t border-white/10 pt-8">
        <div tw="flex gap-8">
          <div tw="flex flex-col">
            <span tw="text-xxs font-[JetBrains_Mono] text-foreground/50 uppercase tracking-widest mb-1">
              Website
            </span>
            <span tw="text-lg font-medium">alfanjauhari.com</span>
          </div>
          <div tw="flex flex-col">
            <span tw="text-xxs font-[JetBrains_Mono] text-foreground/50 uppercase tracking-widest mb-1">
              Twitter
            </span>
            <span tw="text-lg font-medium">@alfanjauhari_</span>
          </div>
        </div>

        <div tw="flex items-center gap-2 text-foreground/50">
          <span tw="text-xs font-[JetBrains_Mono] uppercase tracking-widest">
            Tulungagung, ID
          </span>
        </div>
      </div>
    </div>
  );
};

export default OGTemplate;
