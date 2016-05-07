import JSZIP from 'jszip'
import {saveAs} from 'FileSaver/index'
import {NpmConfigurator, WebpackConfigurator, EntrifyConfigurator} from 'configurator'

export default function BlobifyConfigurator(state) {
  let zip = new JSZIP()
  let entries = EntrifyConfigurator(state)

  zip.file('package.json', JSON.stringify(NpmConfigurator(state), null, 2))
  zip.file('webpack.config.js', WebpackConfigurator(state))

  if (state.js.enabled === true) {
    let babelrc = {
      presets: []
    }
    if (state.js.transpiller.babel === true && state.js.transpiller.react === false) {
      babelrc.presets = ['es2015']
    }
    if (state.js.transpiller.react === true) {
      babelrc.presets = ['es2015', 'react']
    }

    zip.file('.babelrc', JSON.stringify(babelrc, null, 2))
  }

  /* EntryPoint */
  if (entries.idx !== null) {
    zip.file('index.js', entries.idx)
  }

  /* Application example */
  let appFolder = zip
  if (state.config.jsdir.length > 0 && state.config.jsdir !== '/') {
    appFolder = zip.folder(state.config.jsdir)
  }

  if (entries.app !== null) {
    appFolder.file('index.js', entries.app)
  }

  zip.generateAsync({type:'blob'}).then(function(content) {
    saveAs(content, 'config.zip')
  })
}
