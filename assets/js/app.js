$('[data-navigate-to]').each((index, element) => {
  const jElement = $(element)
  jElement.on('change', () => {
    window.location.href = jElement.attr('data-navigate-to').replace(/thisValue/, jElement.val())
  })
})
