const title = document.querySelector('title')
const textarea = document.querySelector('textarea')

window.electronAPI.ReceiveFromElectron('set:file', (event, args) => {
  textarea.value = args.content
  title.innerText = `${args.name} | Editor de Texto`
})

textarea.addEventListener('keyup', (ev) => {
  window.electronAPI.SendToElectron('update-content', textarea.value)
})