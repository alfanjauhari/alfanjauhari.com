import type { ShikiHighlighterHighlightOptions } from '@astrojs/markdown-remark'
import { h } from 'hastscript'

export function copyButtonTransformer(): NonNullable<
  ShikiHighlighterHighlightOptions['transformers']
>[number] {
  return {
    name: 'copy-button',
    pre(node) {
      const button = h(
        'button',
        {
          class: 'cursor-pointer',
          onclick: `
            navigator.clipboard.writeText(this.parentElement.innerText);
            this.classList.add('copied');
            setTimeout(() => this.classList.remove('copied'), 1000)
          `,
        },
        [h('span', { class: 'ready' }), h('span', { class: 'success' })],
      )

      node.children.push(button)
    },
  }
}
