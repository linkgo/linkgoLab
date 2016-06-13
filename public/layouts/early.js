'use strict';

$(document).ready(function() {
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader('x-csrf-token', $.cookie('_csrfToken'));
    }
  });
});
