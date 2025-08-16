import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload('/fonts/Anton400.woff2')
  ReactDOM.preload('/fonts/Satoshi-Variable.woff2')
  ReactDOM.preload('/fonts/Satoshi-VariableItalic.woff2')
}
