package controllers

import (
	"html/template"
	"net/http"
	"os"
	"time"

	"github.com/alfanjauhari/alfanjauhari.com/internal/blog"
	"github.com/alfanjauhari/alfanjauhari.com/pkg/helpers"
	"github.com/alfanjauhari/alfanjauhari.com/templates"
)

type Home struct {
	Template *template.Template
}

func (h Home) HomePage(w http.ResponseWriter, r *http.Request) {

	var data struct {
		Title       string
		Description string
		Profile     struct {
			Name     string
			JobTitle string
			Tagline  string
		}
		Posts        []blog.FrontMatter
		TotalPosts   int
		IsProduction bool
		Canonical    string
	}

	posts, totalPosts := blog.GetPosts(1, 4)

	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	tagline := "Realizing digital dreams come true as a product engineer"

	data.Profile.Name = "Alfan Jauhari"
	data.Profile.JobTitle = "Product Engineer"
	data.Profile.Tagline = tagline
	data.IsProduction = os.Getenv("APP_ENV") == "production"
	data.TotalPosts = totalPosts
	data.Canonical = helpers.GetCanonical(r)
	data.Description = tagline

	for _, post := range posts {
		date, err := time.Parse("2006-01-02 15:04:05", post.Date)
		helpers.Check(err)

		post.Date = date.Format("02 January 2006")

		data.Posts = append(data.Posts, post)
	}

	h.Template = template.Must(template.ParseFS(templates.FS, "index.html", "layouts/base.html", "partials/postcard.html"))
	helpers.Check(h.Template.Execute(w, data))
}
