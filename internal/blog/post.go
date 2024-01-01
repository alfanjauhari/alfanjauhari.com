package blog

import (
	"html/template"

	"github.com/alfanjauhari/alfanjauhari.com/pkg/helpers"
	"github.com/alfanjauhari/alfanjauhari.com/web/contents"
)

func GetPost(fileName string) (FrontMatter, template.HTML) {
	data, err := contents.FS.ReadFile("blogs/" + fileName)
	helpers.Check(err)

	frontMatter, content := FormatFrontMatter(data)

	return *frontMatter, template.HTML(MdToHTML(content))
}

func GetPosts(page int, offset int) ([]FrontMatter, int) {
	files, err := contents.FS.ReadDir("blogs")

	helpers.Check(err)

	var posts []FrontMatter

	for _, file := range files {
		fm, _ := GetPost(file.Name())

		fm.Slug = file.Name()[:len(file.Name())-3]
		posts = append(posts, fm)
	}

	if page > 0 {
		start := (page - 1) * offset
		end := start + offset

		if end > len(posts) {
			end = len(posts)
		}

		return posts[:end], len(posts)
	}

	return posts, len(posts)
}
