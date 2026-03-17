window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    // Navbar burger toggle for mobile
    $(".navbar-burger").click(function() {
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
    });

    // Carousel options
    var options = {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
    }

    // Initialize all carousels
    bulmaCarousel.attach('.carousel', options);

    bulmaSlider.attach();

    // Tab switching for VLM examples
    $('#example-tabs li').on('click', function() {
      var tabId = $(this).data('tab');
      // Update active tab
      $('#example-tabs li').removeClass('is-active');
      $(this).addClass('is-active');
      // Show/hide content
      $('.tab-content').removeClass('is-active').hide();
      $('#' + tabId).addClass('is-active').show();
    });
})
