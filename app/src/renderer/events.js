module.exports = function (app, that) {
  const shell = require('electron').shell
  const dialog = app.dialog
  const $ = require('jquery')
  const ipc = require('electron').ipcRenderer
  const functions = {
    confirm: function (message) {
      var obj = {
        type: 'question',
        buttons: ['Confirm', 'Cancel'],
        title: 'Confirm',
        message: message
      }
      return dialog.showMessageBox(obj) === 0
    }
  }

  ipc.on(':open', function () {
    that.open()
  })
  ipc.on(':save-as', function () {
    that.save_as()
  })
  ipc.on(':save', function () {
    that.save()
  })
  $(document).on('click', 'a[href^="http"]', function (event) {
    event.preventDefault()
    shell.openExternal(this.href)
  })
  return functions
}
