

$(function() {

  /********************
  all pages
  ********************/

  var form = $('.sidebar .nav-search');
  var input = $('.searchInput');

  $('#navSearchLink').on('click touchend', function(event) {
    event.preventDefault();

    if(form.hasClass('hiddenSearch')){
      form.removeClass('hiddenSearch');
      input.focus();
     }
    else{
      form.addClass('hiddenSearch');
    }
  });

  var sidebar = $('.sidebar');
  var mainContent = $('.main-content');

  $('#mobileMenButton').click(function(event) {
    event.preventDefault();
    sidebar.toggleClass('sidebar-mobileMenu');
    /*
    toggling main content because viewport height doesn't work properly
    on ios 7.1 (http://caniuse.com/#feat=viewport-units),
    and when click on text input and the keyboard comes up,
    there seems to be a small space under the menu where you can see
    the content below (http://imgur.com/eMuVd3D), so hide the
    content below while the menu is displayed
    */
    mainContent.toggleClass('main-content-toggle');
    $(this).toggleClass('mobileMenButton-position');
  });

  /********************
  home page
  ********************/

  $('.post-link-header, .full-article-link').hover(

    function(){
      var parentUp2 = $(this).parent().parent();

      if( $(this).hasClass('post-link-header') ){
        parentUp2.parent().addClass('article-hovered');
      }
      else{
        parentUp2.addClass('article-hovered');
      }
    },
    function(){
      var parentUp2 = $(this).parent().parent();

      if( $(this).hasClass('post-link-header') ){
        parentUp2.parent().removeClass('article-hovered');
      }
      else{
        parentUp2.removeClass('article-hovered');
      }
    }
  );

  $('.tag-item a').hover(
    function() {
      $(this).next().css( "display", "block" );
    }, function() {
      $(this).next().css( "display", "none" );
    }
  );

  /********************
  Project page
  ********************/

  var verHistory = $('.version-history');

  $('.link-more').click(function(event){
    event.preventDefault();
    verHistory.toggleClass('version-history-more');

    if( $(this).text().indexOf('more') >-1 ){
      $(this).text('Show less');
    }
    else{
      $(this).text('Show more');
    }
  });

  /********************
  Project page & Blog Post page
  ********************/
  //https://github.com/davatron5000/FitVids.js
  /*we only load it on blog post pages, so check if the
  plugin is available, if it is, it's a blog post page*/
  if($.fn.fitVids){
    $('.post-body, .project-body').fitVids();
  }


});

/********************
Google search
********************/
// (function() {
//     var cx = '017656873701660410302:dlj9xkst79m';
//     var gcse = document.createElement('script');
//     gcse.type = 'text/javascript';
//     gcse.async = true;
//     gcse.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') +
//         '//www.google.com/cse/cse.js?cx=' + cx;
//     var s = document.getElementsByTagName('script')[0];
//     s.parentNode.insertBefore(gcse, s);
// })();







