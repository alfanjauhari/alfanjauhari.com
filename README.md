# Alfan Jauhari - Personal Website

## Requirements

- Go v1.21.5
- Air [https://github.com/cosmtrek/air](https://github.com/cosmtrek/air)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/alfanjauhari/alfanjauhari.com.git
   ```

2. Navigate to the project directory:

   ```sh
   cd alfanjauhari.com
   ```

3. Install the dependencies:

   ```sh
   go mod tidy
   ```

4. Build the project:
   ```sh
   go build -o tmp/main ./cmd/web
   ```

## Usage

### Website

- Create your page markdown file by running `web/contents/pages/{pagename}.md`
- Create your blog article markdown file by running `web/contents/blogs/{postname}.md`
- The markdown file supports frontmatter with this format:
  ```markdown
  ---fm
  title: "Blabla"
  description: 'blabla'
  date: 2022-09-07 12:00:00
  --endfm
  ```
  Make sure you are using `---fm` and `---endfm` for the frontmatter!
- You can get the bundled of the style and the scripts files with these commands

  ```sh
  go run ./cmd/build
  ```

### Docker

1. Run docker build

```sh
docker build -t blog .
```

2. Create a docker container

```sh
docker container create --name blog -e APP_ENV=production -p 8080:8080 blog
```

3. Run docker container

```sh
docker container start blog
```

## Deployment

You can easily deploy this app using [fly.io](https://fly.io). Just run the `fly launch` (for the first launch) and `fly deploy` for the sequential run.

## LICENSE

[GNU General Public License v3.0](https://github.com/alfanjauhari/alfanjauhari.com/blob/main/LICENSE)
