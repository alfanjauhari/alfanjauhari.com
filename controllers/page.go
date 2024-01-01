package controllers

import (
	"html/template"
	"net/http"
	"os"

	"github.com/alfanjauhari/alfanjauhari.com/internal/blog"
	"github.com/alfanjauhari/alfanjauhari.com/pkg/helpers"
	"github.com/alfanjauhari/alfanjauhari.com/templates"
	"github.com/alfanjauhari/alfanjauhari.com/web/contents"
	"github.com/gorilla/mux"
)

type Page struct {
	Template *template.Template
}

func (p Page) RenderPage(w http.ResponseWriter, r *http.Request) {
	slug := mux.Vars(r)["slug"]

	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	file, err := contents.FS.ReadFile("pages/" + slug + ".md")

	if err != nil {
		if err.Error() == "open blogs/"+slug+".md: file does not exist" {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}

	fm, _ := blog.FormatFrontMatter(file)

	var data struct {
		Styles       []string
		Title        string
		Description  string
		Content      template.HTML
		IsProduction bool
		Canonical    string
	}

	data.Title = fm.Title
	data.Description = fm.Description
	data.Content = template.HTML(blog.MdToHTML(file))
	data.Styles = []string{
		"/styles/pages/article.css",
	}
	data.IsProduction = os.Getenv("APP_ENV") == "production"
	data.Canonical = helpers.GetCanonical(r)

	p.Template = template.Must(template.ParseFS(templates.FS, "page.html", "layouts/base.html"))

	helpers.Check(p.Template.Execute(w, data))
}
