(function styleguide(){

  var categories = [];

  [].forEach.call( document.querySelectorAll('[data-markdown]'), function(elem, i){

    // modified from https://gist.github.com/paulirish/1343518
    // strip leading whitespace so it isn't evaluated as code
    var text      = elem.innerHTML.replace(/\n\s*\n/g,'\n'),
        // set indentation level so your markdown can be indented within your HTML
        leadingws = text.match(/^\n?(\s*)/)[1].length,
        regex     = new RegExp('\\n?\\s{' + leadingws + '}','g'),
        md        = text.replace(regex,'\n'),
        html      = marked(md);

    elem.innerHTML = html;

    // add in the example code using jQuery
    var codeElem = $(elem).find('code');
    var code = $.parseHTML(codeElem.text());
    codeElem.parent().before(code);
    codeElem.attr('id', 'code-block-' + i);

    // add copy button
    codeElem.before('<button class="copy" role="presentation" data-clipboard-target="#code-block-' + i + '" title="Copy">✄</button>');

    // add the category to the sections index
    var category = $(elem).data('category');

    if ($.inArray(category, categories) === -1) {
        categories.push(category);
    }

    // hide this section if it isn't part of the first category in the array
    if (category !== categories[0]) {
        $(elem).hide();
    }
  });

  // init copy to clipboard buttons
  new Clipboard('.copy');

  // build section tabs
  $.each(categories, function(i, category) {
      var readableName = category.replace(/-/g, " ");
      if (i === 0) {
          $('#category-tabs').append('<li class="active"><a href="#" data-category="' + category + '">' + readableName + '</a></li>');
      } else {
          $('#category-tabs').append('<li><a href="#" data-category="' + category + '">' + readableName + '</a></li>');
      }
  });

  // handle tab click
  $('#category-tabs a').click(function(event) {
      var category = $(this).data('category');
      event.preventDefault();
      $(this).parent().siblings().removeClass('active');
      $(this).parent().addClass('active');

      $('[data-markdown]').each(function(){
          if ($(this).data('category') !== category) {
              $(this).hide();
          } else {
              $(this).show();
          }
      });

  });

  // prevent example clicks going elsewhere
  $('[data-markdown] a').click(function(event) {
      event.preventDefault();
  });

  // scroll to top button position
  $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll < 100) {
          $('#scroll-to-top').removeClass('fixed');
      } else {
          $('#scroll-to-top').addClass('fixed');
      }
  });

  $('#scroll-to-top a').click(function(event) {
      event.preventDefault();
      $(window).scrollTop(0);
  });

}());
