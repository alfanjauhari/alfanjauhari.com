export interface OGImageProps {
  title: string
  description: string
  date?: Date
  tag?: string
}

export function GlobalOGImage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '1rem',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '1024px',
          flexGrow: 1,
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '6rem',
            lineHeight: 1,
            fontFamily: 'Anton, sans-serif',
            textAlign: 'center',
            color: 'rgb(68 64 60)',
            letterSpacing: '0.05em',
          }}
        >
          ALFAN JAUHARI
        </h1>
        <p
          style={{
            fontSize: '1.5rem',
            lineHeight: 1.5,
            fontFamily: 'Satoshi, sans-serif',
            textAlign: 'center',
            fontStyle: 'italic',
            maxWidth: '80%',
          }}
        >
          My home, my heaven and my personal digital sanctuary
        </p>
      </div>
    </div>
  )
}
