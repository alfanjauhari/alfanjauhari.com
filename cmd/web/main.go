package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/alfanjauhari/alfanjauhari.com/controllers"
	"github.com/alfanjauhari/alfanjauhari.com/pkg/helpers"
	"github.com/alfanjauhari/alfanjauhari.com/public"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("APP_ENV") != "production" {
		helpers.Check(godotenv.Load())
	}

	r := mux.NewRouter()

	//	#region Home
	homeController := controllers.Home{}

	r.HandleFunc("/", homeController.HomePage)
	//	#endregion

	//	#region Blog
	blogController := controllers.Blog{}

	r.HandleFunc("/blog", blogController.BlogPage)
	r.HandleFunc("/blog/{slug}", blogController.ArticlePage)
	//	#endregion

	//	#region Page
	pageController := controllers.Page{}

	r.HandleFunc("/robots.txt", func(w http.ResponseWriter, r *http.Request) {
		r.URL.Path = "/robots.txt"
		http.FileServer(http.FS(public.FS)).ServeHTTP(w, r)
	})

	r.HandleFunc("/{slug}", pageController.RenderPage)
	//	#endregion

	r.PathPrefix("/").Handler(http.FileServer(http.FS(public.FS)))

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	fmt.Println("Starting the server on port :" + port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
