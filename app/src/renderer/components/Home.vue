<template>
  <div id="template">
    <div id="a" class="split split-horizontal">
      <div  id="markdown"></div>
    </div>
    <div id="b" class="split split-horizontal">
      <div v-html="compiledMarkdown" id="wrapper"></div>
    </div>
  </div>
</template>

<script>
  var hljs = require('highlight.js')
  const $ = require('jquery')
  const markdown = require('markdown-it')({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
        } catch (__) {}
      }
      return ''
    }
  })
  const app = require('electron').remote
  const dialog = app.dialog
  const fs = require('fs')
  const Split = window.split
  const CodeMirror = window.CodeMirror
  var editor
  var sniddl
  var that
  // const hl = require('highlight')

  export default {
    data () {
      return {
        input: '',
        current_file: ''
      }
    },
    mounted () {
      that = this
      sniddl = require('../events')(app, that)
      console.log(sniddl)
      window.addEventListener('keydown', this.focus)
      // $(document).on('ready', function () {
      Split(['#a', '#b'], {
        gutterSize: 10,
        cursor: 'col-resize'
      })

      editor = CodeMirror($('#markdown')[0], {
        mode: 'markdown'
      })
      editor.on('change', this.update)
    },
    computed: {
      compiledMarkdown: function () {
        return markdown.render(this.input)
      }
    },
    methods: {
      update: function (e) {
        console.log(this.current_file)
        this.input = editor.getValue()
      },
      focus: function () {
        editor.focus()
      },
      save_as: function () {
        dialog.showSaveDialog({ filters: [
          { name: 'Markdown', extensions: ['md'] }
        ]}, function (fileName) {
          if (fileName === undefined) return
          that.current_file = fileName
          fs.writeFile(fileName, editor.getValue(), function (err) {
            if (err) throw err
          })
        })
      },
      open: function () {
        dialog.showOpenDialog(function (fileNames) {
          if (fileNames === undefined) return
          var fileName = fileNames[0]
          that.current_file = fileName
          fs.readFile(fileName, 'utf-8', function (er, data) {
            editor.setValue(data)
          })
        })
      },
      save: function () {
        if (that.current_file === '') {
          that.save_as()
        } else {
          fs.writeFile(that.current_file, editor.getValue(), function (err) {
            if (err) throw err
          })
        }
      }
    },
    name: 'Home'
  }
</script>

<style scoped>


  @import "/css/code.css";
  textarea#markdown {
    resize: none;
    border: none;
    width: 100%;
    height: 100%;
    outline: none;
    padding: 20px;
}


</style>

<style>
  html, body, #editor {
  margin: 0;
  height: 100%;
  padding: 0 !important;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  }
  div#template {
    width: 100vw;
    height: 100vh;
  }
</style>
<link rel="stylesheet" href="/css/code.css">
