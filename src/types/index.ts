export {}

declare global {
  interface Window {
    umami: {
      track: (event?: string, data?: object) => void
      identify: (id: string, data?: object) => void
    }
  }
}
