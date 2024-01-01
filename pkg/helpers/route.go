package helpers

import "net/http"

func GetCanonical(r *http.Request) string {
	return "https://" + r.Host + r.URL.Path
}
