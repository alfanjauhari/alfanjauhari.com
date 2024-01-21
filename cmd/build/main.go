package main

import (
	"fmt"

	"github.com/evanw/esbuild/pkg/api"
)

func main() {
	result := api.Build(api.BuildOptions{
		EntryPointsAdvanced: []api.EntryPoint{{
			OutputPath: "scripts/app.min",
			InputPath:  "public/scripts/app.js",
		}, {
			OutputPath: "styles/app.min",
			InputPath:  "public/styles/app.css",
		}},
		Bundle:            true,
		MinifyWhitespace:  true,
		MinifyIdentifiers: true,
		MinifySyntax:      true,
		Engines: []api.Engine{
			{Name: api.EngineChrome, Version: "58"},
			{Name: api.EngineFirefox, Version: "57"},
			{Name: api.EngineSafari, Version: "11"},
			{Name: api.EngineEdge, Version: "16"},
		},
		Loader: map[string]api.Loader{
			".png":   api.LoaderDataURL,
			".svg":   api.LoaderText,
			".woff2": api.LoaderFile,
		},
		AllowOverwrite: true,
		Write:          true,
		Outdir:         "public",
	})

	if len(result.Errors) > 0 {
		fmt.Print(result.Errors)
	}
}
