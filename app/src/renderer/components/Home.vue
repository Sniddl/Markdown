<template>
  <div id="template">
    <button type="button" v-on:click="save(input)">Save</button>
    <button type="button" v-on:click="open()">Open</button>
    <!--
    <div id="editor">
      <textarea :value="input" @input="update" id="markdown"></textarea>
      <div v-html="compiledMarkdown" id="compiled"></div>
    </div> -->

    <div id="a" class="split split-horizontal">
      <textarea :value="input" @input="update" id="markdown"></textarea>
    </div>
    <div id="b" class="split split-horizontal">
      <div v-html="compiledMarkdown" id="compiled"></div>
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
  const shell = require('electron').shell
  const Split = window.split
  // const hl = require('highlight')

  export default {
    data () {
      return {
        input: ''
      }
    },
    mounted () {
      window.addEventListener('keydown', this.focus)
      $(document).on('click', 'a[href^="http"]', function (event) {
        event.preventDefault()
        shell.openExternal(this.href)
      })
      // $(document).on('ready', function () {
      Split(['#a', '#b'], {
        gutterSize: 10,
        cursor: 'col-resize'
      })

      // Split(['#c', '#d'], {
      //   direction: 'vertical',
      //   sizes: [25, 75],
      //   gutterSize: 10,
      //   cursor: 'row-resize'
      // })
      //
      // Split(['#e', '#f'], {
      //   direction: 'vertical',
      //   sizes: [25, 75],
      //   gutterSize: 10,
      //   cursor: 'row-resize'
      // })
      // })
    },
    computed: {
      compiledMarkdown: function () {
        return markdown.render(this.input)
      }
    },
    methods: {
      update: function (e) {
        this.input = e.target.value
        // $('compiled').html(hl('for(var i=0;i<10;i++)alert(i);'))
        // $('a').on('click', function (e) {
        //   e.preventDefault()
        //   e.stopPropagation()
          // setTimeout(function () {
          //   var path = e.target.href
          //   ipcRenderer.sendToHost('element-clicked', path)
          // }, 100)
        //   return false
        // }, true)
        // var a = document.getElementsByTagName('a')
        // for (var i = 0; i < a.length; i++) {
        //   a[i].target = '_blank'
        //   a[i].onclick = function (e) {
        //     e.preventDefault()
        //   }
        // }
      },
      focus: function () {
        $('#markdown').focus()
      },
      save: function (content) {
        dialog.showSaveDialog({ filters: [
          { name: 'Markdown', extensions: ['md'] }
        ]}, function (fileName) {
          if (fileName === undefined) return
          fs.writeFile(fileName, content, function (err) {
            if (err) {
              console.log('Error when creating file' + err.message)
            }
            console.log('file successfully saved.')
          })
        })
      },
      open: function () {
        dialog.showOpenDialog(function (fileNames) {
          if (fileNames === undefined) return
          var fileName = fileNames[0]
          fs.readFile(fileName, 'utf-8', function (er, data) {
            $('#markdown').val(data)
            var ev = document.createEvent('Event')
            ev.initEvent('input', true, true)
            $('#markdown')[0].dispatchEvent(ev)
          })
        })
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
/*



  textarea, #editor div {
  display: inline-block;
  width: 40vw;
  height: 100vh;
  vertical-align: top;
  box-sizing: border-box;
  padding: 5px 20px;
  background: white;
  margin: 0;
  }

  textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: white;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
  }

  code {
  color: #f66;
  }*/

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
