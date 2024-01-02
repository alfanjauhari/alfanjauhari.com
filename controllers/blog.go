package controllers

import (
	"html/template"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/alfanjauhari/alfanjauhari.com/internal/blog"
	"github.com/alfanjauhari/alfanjauhari.com/pkg/helpers"
	"github.com/alfanjauhari/alfanjauhari.com/templates"
	"github.com/alfanjauhari/alfanjauhari.com/web/contents"
	"github.com/gorilla/mux"
)

type Blog struct {
	Template *template.Template
}

func (b Blog) ArticlePage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	slug := mux.Vars(r)["slug"]

	file, err := contents.FS.ReadFile("blogs/" + slug + ".md")

	if err != nil {
		if err.Error() == "open blogs/"+slug+".md: file does not exist" {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}

	fm, _ := blog.FormatFrontMatter(file)

	var data struct {
		Title        string
		Description  string
		FrontMatter  blog.FrontMatter
		Content      template.HTML
		IsProduction bool
		Canonical    string
	}

	date, err := time.Parse("2006-01-02 15:04:05", fm.Date)
	helpers.Check(err)

	fm.Date = date.Format("02 January 2006")

	data.Title = fm.Title
	data.Description = fm.Description
	data.FrontMatter = *fm
	data.Content = template.HTML(blog.MdToHTML(file))
	data.IsProduction = os.Getenv("APP_ENV") == "production"
	data.Canonical = helpers.GetCanonical(r)

	b.Template = template.Must(template.ParseFS(templates.FS, "article.html", "layouts/base.html"))

	helpers.Check(b.Template.Execute(w, data))
}

func (b Blog) BlogPage(w http.ResponseWriter, r *http.Request) {
	page := r.URL.Query().Get("page")
	if page == "" {
		page = "1"
	}
	pageInt, err := strconv.ParseInt(page, 10, 64)
	helpers.Check(err)

	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	var data struct {
		Title        string
		Description  string
		IsProduction bool
		Posts        []blog.FrontMatter
		TotalPosts   int
		NextPage     int
		Canonical    string
	}

	posts, totalPosts := blog.GetPosts(int(pageInt), 4)
	data.Title = "Blog"
	data.Description = "Some of my writings are about of technology, programming, and random things."
	data.IsProduction = os.Getenv("APP_ENV") == "production"
	data.TotalPosts = totalPosts
	data.NextPage = int(pageInt) + 1
	data.Canonical = helpers.GetCanonical(r)

	if totalPosts == 0 || len(posts) == 0 || totalPosts <= len(posts) {
		data.NextPage = 0
	}

	for _, post := range posts {
		date, err := time.Parse("2006-01-02 15:04:05", post.Date)
		helpers.Check(err)

		post.Date = date.Format("02 January 2006")

		data.Posts = append(data.Posts, post)
	}

	b.Template = template.Must(template.ParseFS(templates.FS, "blog.html", "layouts/base.html", "partials/postcard.html"))

	helpers.Check(b.Template.Execute(w, data))
}
