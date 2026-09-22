(function(){
  function inject(slot, type){
    if(!slot || slot.dataset.loaded) return;
    slot.dataset.loaded='1';
    var opts=document.createElement('script');
    if(type==='desktop'){
      opts.type='text/javascript';
      opts.text="atOptions = { 'key' : '868b4c8c4ebdbfe51d6251096e84b3c1', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };";
      var src=document.createElement('script'); src.type='text/javascript'; src.src='//inefficientinherent.com/868b4c8c4ebdbfe51d6251096e84b3c1/invoke.js';
      slot.appendChild(opts); slot.appendChild(src);
    } else {
      opts.text="atOptions = { 'key' : 'b5d41c22f9f42b8c22a854697d3be912', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };";
      var msrc=document.createElement('script'); msrc.src='https://inefficientinherent.com/b5d41c22f9f42b8c22a854697d3be912/invoke.js';
      slot.appendChild(opts); slot.appendChild(msrc);
    }
  }
  function loadAds(){
    var mobile=window.matchMedia('(max-width: 760px)').matches;
    document.querySelectorAll(mobile?'.adsterra-mobile':'.adsterra-desktop').forEach(function(slot){ inject(slot, mobile?'mobile':'desktop'); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', loadAds); else loadAds();
})();
