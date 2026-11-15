import Image from "./image.astro";
import Playground from "./playground.astro";
import PlaygroundFile from "./playground-file.astro";
import Pre from "./pre.astro";
import Serif from "./serif.astro";

export const mdxComponents = {
	Image,
	Playground,
	PlaygroundFile,
	Sandpack: Playground,
	SandpackFile: PlaygroundFile,
	serif: Serif,
	pre: Pre,
};
