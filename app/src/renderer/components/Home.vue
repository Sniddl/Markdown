<template>
  <div>


    <div id="editor-0" >
      <!-- <textarea :value="input" @input="update" ref="inputText"></textarea> -->
      <div v-html="compiledMarkdown"  contenteditable="true" v-on:keydown='update' id="editor-1"></div>
      <iframe ref="frame" width="100" height="100"></iframe>
    </div>
    <div id="stats">
      input       = {{ input }}
      current_el  = {{ current_el }}
      current_par = {{ current_par }}
      current_id  = {{ current_id }}
    </div>




  </div>
</template>

<script>
  var marked = require('marked')
  function isInArray (value, array) {
    return array.indexOf(value) > -1
  }
  export default {
    data () {
      return {
        input: '# helsdflo',
        current_el: null,
        current_par: 'editor-1',
        current_id: 0,
        carret_pos: 0,
        prohibitedKeys: [
          'Backspace',
          'ArrowUp',
          'ArrowLeft',
          'ArrowRight',
          'ArrowDown',
          'Enter',
          'Shift'
        ]
      }
    },
    mounted () {
      // var editor = document.getElementById('editor-1')
      // if (editor.innerHTML === '') {
      //
      // }
    },
    computed: {
      compiledMarkdown: function () {
        return marked(this.input, { sanitize: false })
      }
    },
    methods: {
      placeCaretAtEnd: function (el) {
        el.focus()
        if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
          var range = document.createRange()
          range.selectNodeContents(el)
          range.collapse(false)
          var sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(range)
        } else if (typeof document.body.createTextRange !== 'undefined') {
          var textRange = document.body.createTextRange()
          textRange.moveToElementText(el)
          textRange.collapse(false)
          textRange.select()
        }
      },
      moveCaret: function (win, charCount) {
        var sel, range
        if (win.getSelection) {
          sel = win.getSelection()
          if (sel.rangeCount > 0) {
            var textNode = sel.focusNode
            var newOffset = sel.focusOffset + charCount
            sel.collapse(textNode, Math.min(textNode.length, newOffset))
          }
        } else if ((sel = win.document.selection)) {
          if (sel.type !== 'Control') {
            range = sel.createRange()
            range.move('character', charCount)
            range.select()
          }
        }
      },
      replaceSelectedText: function (replacementText) {
        var sel, range
        if (window.getSelection) {
          sel = window.getSelection()
          if (sel.rangeCount) {
            range = sel.getRangeAt(0)
            window.rrange = range
            range.deleteContents()
            range.insertNode(document.createTextNode(replacementText))
          }
        } else if (document.selection && document.selection.createRange) {
          range = document.selection.createRange()
          range.text = replacementText
        }
      },
      execIf: function (e, key, func) {
        if (e.key === key) {
          this.removeIf(e, key)
          func(this)
        }
      },
      removeIf: function (e, key) {
        if (e.key === key) {
          var el = document.getElementById(this.current_par)
          var h = el.innerHTML
          el.innerHTML = h.substr(0, h.length - key.length)
        }
      },
      createIf: function (obj) {
        if (obj.e.key === obj.key) {
          this.removeIf(obj.e, obj.key)
          var elid = this.createEl(obj.type, obj.name, obj.parent)
          if (obj.make_parent === true) {
            this.current_par = elid
          }
        }
      },
      createEl: function (type, name, parent) {
        var el = document.createElement(type)
        el.id = name + '-' + this.current_id
        el.className = name
        this.current_id += 1
        this.current_el = el.id
        el.contentEditable
        // if parent != current par then change current par
        var par = document.getElementById(parent)
        // console.log(par)
        par.appendChild(el)
        return el.id
      },
      update: function (e) {
        if (!isInArray(e.key, this.prohibitedKeys)) {
          console.log(e.key)
          e.preventDefault()
          this.input += e.key
          // var par = document.getElementById(this.current_par)
          //
          // try {
          //   par.innerHTML += e.key
          // } catch (e) {
          //   this.current_par = 'editor-1'
          //   par.innerHTML += e.key
          // }
          //
          // this.removeIf(e, 'Shift')
          //
          // this.execIf(e, ' ', function (that) {
          //   var el = document.getElementById(that.current_par)
          //   el.innerHTML += '&nbsp;'
          // })
          //
          // this.carret_pos += 1
          //
          this.placeCaretAtEnd(document.getElementById('editor-1'))
          //
          // this.createIf({
          //   e: e,
          //   key: '#',
          //   type: 'h1',
          //   name: 'header1',
          //   parent: this.current_par,
          //   make_parent: true
          // })
        }
      }
    },
    name: 'Home'
  }
</script>

<style scoped>
  html, body, #editor {
  margin: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  }

  textarea, #editor div {
  display: inline-block;
  width: 50vw;
  height: 100vh;
  vertical-align: top;
  box-sizing: border-box;
  padding: 5px 20px;
  background: white;
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
  }

</style>

<style>
  .header1 {
    display: inline;
  }
</style>
