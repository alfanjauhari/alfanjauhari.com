package blog

import (
	"bytes"
	"encoding/json"
	"regexp"
	"strings"

	"github.com/alfanjauhari/alfanjauhari.com/pkg/helpers"
	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/html"
	"github.com/gomarkdown/markdown/parser"
)

func MdToHTML(data []byte) []byte {
	ei := bytes.Index([]byte(data), []byte("---endfm"))

	data = data[ei+8:]

	extensions := parser.CommonExtensions | parser.AutoHeadingIDs
	p := parser.NewWithExtensions(extensions)
	doc := p.Parse(data)

	htmlFlags := html.CommonFlags
	options := html.RendererOptions{Flags: htmlFlags}
	renderer := html.NewRenderer(options)

	return markdown.Render(doc, renderer)
}

type FrontMatter struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Excerpt     string `json:"excerpt"`
	Thumbnail   string `json:"thumbnail"`
	Category    string `json:"category"`
	Date        string `json:"date"`
	Slug        string `json:"slug"`
}

func FormatFrontMatter(data []byte) (*FrontMatter, []byte) {
	if !bytes.HasPrefix(data, []byte("---fm")) {
		return nil, nil
	}

	charLen := len([]byte("---fm"))
	i := bytes.Index([]byte(data), []byte("---fm"))
	ei := bytes.Index([]byte(data), []byte("---endfm"))

	splitted := strings.Split(string(data[i+charLen:ei]), "\n")
	dict := make(map[string]string)

	for _, str := range splitted {
		if str != "" {
			re := regexp.MustCompile(`(.*?):\s*(?:"([^"]*)"|'([^']*)'|([^"\n]*))`)
			match := re.FindStringSubmatch(str)
			if match != nil {
				key := match[1]
				var value string
				if match[2] != "" {
					value = match[2]
				} else if match[3] != "" {
					value = match[3]
				} else {
					value = match[4]
				}
				dict[key] = value
			}
		}
	}

	body, err := json.Marshal(dict)

	helpers.Check(err)

	var fm FrontMatter

	helpers.Check(json.Unmarshal(body, &fm))

	return &fm, data[ei+charLen:]
}
