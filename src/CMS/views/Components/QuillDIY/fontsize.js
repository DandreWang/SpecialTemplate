import { Quill } from 'vue-quill-editor'

const Parchment = Quill.import('parchment')

class FontSizeAttributor extends Parchment.Attributor.Style {
}

const fontSizeStyle = new FontSizeAttributor('fontSize', 'font-size', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['0.2rem', '0.24rem', '0.28rem', '0.32rem', '0.36rem', '0.4rem']
})

export default fontSizeStyle
