import styles from './App.module.css'

export default function App() {
  const ACTION_URL =
    document.referrer +
    'api/blog/web-development-with-progressive-enhancement/form.html'

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // @ts-ignore
    // You can comment this line out if you want to see the form submission without fetch
    delete window.fetch

    if ('fetch' in window) {
      event.preventDefault()

      const formData = new FormData(event.currentTarget)
      const name = formData.get('name') as string
      const email = formData.get('email') as string

      const data = await fetch(ACTION_URL, {
        method: 'POST',
        body: JSON.stringify({ name, email }),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json())

      alert(JSON.stringify(data, null, 2))
    }
  }

  return (
    <form
      action={ACTION_URL}
      className={styles.form}
      method="POST"
      encType="multipart/form-data"
      onSubmit={onSubmit}
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input
          className={styles.input}
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          className={styles.input}
          type="email"
          id="email"
          name="email"
          placeholder="Email"
        />
      </div>

      <button type="submit" className={styles.button}>
        Submit
      </button>
    </form>
  )
}
