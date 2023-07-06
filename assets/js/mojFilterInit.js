$(function () {
  $('#filter-bar').each(function (index, element) {
    // eslint-disable-next-line no-new
    new MOJFrontend.FilterToggleButton({
      startHidden: true,
      toggleButton: {
        container: $(element),
        showText: 'Show filter',
        hideText: 'Hide filter',
        classes: 'govuk-button--primary filter-summary-show-filter-button',
      },
      filter: {
        container: $('.moj-filter'),
      },
    })
  })

  $('[data-apply-form-to-querystring=true]').on('click', function () {
    const formSelector = $(this).data('apply-form-selector')
    let url = $(this).data('apply-base-url')

    if (url.indexOf('?') === -1) {
      url += '?'
    } else {
      url += '&'
    }

    url += $(formSelector).serialize()
    url = url.replaceAll('?&', '?').replaceAll('&&', '&')

    window.location.href = url
  })
})
