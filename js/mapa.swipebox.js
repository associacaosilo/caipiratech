;(function($) {      
    $('.swipebox').swipebox({
      hideBarsDelay : 5000,
      hideCloseButtonOnMobile : false, // true will hide the close button on mobile devices
      removeBarsOnMobile : false // false will show top bar on mobile devices
    });      

    function handleClick(e) {
      var current = document.querySelector('#swipebox-slider .current');
      var closeBtn = document.querySelector('#swipebox-close');
      
      if (e.target === current) {
        e.preventDefault();
        closeBtn.click();
      }
    }

    document.body.addEventListener('click', handleClick, { passive: false });
    document.body.addEventListener('touchstart', handleClick, { passive: false });
  } )(jQuery);



  // $(function(){
  //   function handleClick(e) {
  //     // var currentImg = document.querySelector('#swipebox-slider .current img');
  //     var current = document.querySelector('#swipebox-slider .current');
  //     var closeBtn = document.querySelector('#swipebox-close');
      
  //     // if (e.target === currentImg || e.target === closeBtn) {
  //     //   // return false;
  //     //   // e.preventDefault();
  //     // } else if (e.target === current) {
  //     //   e.preventDefault();
  //     //   closeBtn.click();
  //     // }
  //     if (e.target === current) {
  //       e.preventDefault();
  //       closeBtn.click();
  //     }
  //   }

  //   document.body.addEventListener('click', handleClick, { passive: false });
  //   document.body.addEventListener('touchstart', handleClick, { passive: false });
  //   // document.body.addEventListener('touchend', handleClick, { passive: false });
  // });

  // document.addEventListener('DOMContentLoaded', function() {
  //   document.body.addEventListener('touchstart click', function(e) {
  //     if (e.target.closest('#swipebox-slider .current img')) {
  //       // return false;
  //       e.preventDefault();
  //     }
  //     else if (e.target.closest('#swipebox-slider .current')) {
  //       e.preventDefault();
  //       document.querySelector('#swipebox-close').click();
  //     }
  //   }, { passive: false });        
  // });
  

  
  // $(function(){
  //   ['click', 'touchend'].forEach(function(event) { 
  //     document.body.addEventListener(event, function(e) {
  //       if (e.target.closest('#swipebox-slider .current img')) {
  //         // return false;
  //         e.preventDefault();
  //       }
  //       else if (e.target.closest('#swipebox-slider .current')) {
  //         e.preventDefault();
  //         document.querySelector('#swipebox-close').click();
  //       }
  //     }, { passive: false });
  //   });
  // });