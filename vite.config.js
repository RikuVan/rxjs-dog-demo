import { defineConfig } from 'vite'
import fs from 'fs'
import prettier from 'prettier'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const prod = mode === 'production'
  return {
    plugins: [svelte(), createAssetManifest(mode === 'production')],
  }
})

function createAssetManifest() {
  return {
    name: 'create-asset-manifest',
    enforce: 'post',
    apply: 'build',
    writeBundle() {
      fs.readdir('dist/assets', (err, files) => {
        const paths = [...files.map((f) => `'/assets/${f}'`), '"/index.html"']
        const output = `const manifest = [
           ${paths.join(',\n')}
        ]`
        fs.writeFile(
          './public/asset-manifest.js',
          prettier.format(output, { parser: 'typescript' }),
          (err) => {
            if (err) console.error('failed to create asset manifest ', err)
            console.log('assets > /public/asset-manifest')
          }
        )
      })
    },
  }
}
