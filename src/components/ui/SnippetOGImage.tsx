export interface SnippetOGImageProps {
  title: string
  description: string
  date?: Date
}

export function SnippetOGImage({
  title,
  description,
  date,
}: SnippetOGImageProps) {
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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            lineHeight: 0.1,
            color: 'rgb(68 64 60)',
          }}
        >
          A.
        </h1>
        <p
          style={{
            fontSize: '2rem',
            lineHeight: 0.1,
            color: 'rgb(68 64 60)',
          }}
        >
          {'</>'}
        </p>
      </div>
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
        {date && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <p
              style={{
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              {Intl.DateTimeFormat('en-ID', {
                dateStyle: 'medium',
              }).format(date)}
            </p>
          </div>
        )}
        <h1
          style={{
            fontSize: '4.5rem',
            lineHeight: 1,
            fontFamily: 'Anton, sans-serif',
            textAlign: 'center',
            color: 'rgb(68 64 60)',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            lineHeight: 1.5,
            fontFamily: 'Satoshi, sans-serif',
            textAlign: 'center',
            fontStyle: 'italic',
            maxWidth: '80%',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
