import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The published brandsync-tokens package ships dist/css/tokens.css with a
// `//`-style line comment on line 1, which is invalid CSS and breaks strict
// minifiers (lightningcss). This patches just that one line at load time so
// the app can import the package's file directly instead of vendoring a copy.
function fixBrandsyncTokensComment() {
  return {
    name: 'fix-brandsync-tokens-comment',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('brandsync-tokens') && id.endsWith('tokens.css')) {
        return code.replace(/^\/\/.*$/m, '/* Brandsync design tokens */')
      }
      return null
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fixBrandsyncTokensComment()],
})
