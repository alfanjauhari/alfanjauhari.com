import type { APIContext } from 'astro'

export const prerender = false

export async function POST({ request }: APIContext) {
  const buildGreeting = (text: string) => {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Form</title>
        <link
          href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <h1>${text}</h1>
      </body>
    </html>`
  }

  try {
    let text = 'Hello World!'

    const contentType = request.headers.get('Content-Type')

    if (contentType === 'application/json') {
      const data = await request.json()

      return new Response(
        JSON.stringify({
          ...data,
          message: 'Retrieved from json data',
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    if (contentType !== 'application/json') {
      const formData = await request.formData()

      text = `Hello ${formData.get('name')} from form data`
    }

    return new Response(buildGreeting(text), {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    return new Response(buildGreeting(String(error)), {
      headers: {
        'Content-Type': 'text/html',
      },
      status: 500,
    })
  }
}
