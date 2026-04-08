// Safe TikTok Pixel base loader (no eval, no new Function)
!function(w,d,t){
  w.TiktokAnalyticsObject = t;
  var ttq = w[t] = w[t] || [];
  ttq.methods = ["page","track","identify","instances","load","ready","pageView","time","event","conversion","user_properties","set","callback"];
  ttq.setAndDefer = function(t, e) {
    t[e] = function() {
      t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };
  for(var i = 0; i < ttq.methods.length; i++) {
    ttq.setAndDefer(ttq, ttq.methods[i]);
  }
  // Instance method (no eval)
  ttq.instance = function(t) {
    // Create a plain object with a push that proxies to ttq
    var n = {
      push: function() {
        ttq.push.apply(ttq, arguments);
      }
    };
    // Attach methods that push to n (which forwards to ttq)
    for (let e = ttq.methods.length - 1; e >= 0; e--) {
      let m = ttq.methods[e]; // block-scoped to capture correct method
      n[m] = function() {
        n.push([m].concat(Array.prototype.slice.call(arguments, 0)));
      };
    }
    // Custom load/page/track that also call global ttq methods
    n.load = function(e) {
      n.push(["load", e]);
      ttq.load(e);
      return n;
    };
    n.page = function() {
      n.push(["page"]);
      ttq.page();
      return n;
    };
    n.track = function(e) {
      n.push(["track", e]);
      ttq.track(e);
      return n;
    };
    return n;
  };
  // Async load the TikTok SDK
  var s = d.createElement(t);
  s.type = "text/javascript";
  s.async = !0;
  s.src = "https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=" + t.toLowerCase();
  var sn = d.getElementsByTagName(t)[0];
  sn.parentNode.insertBefore(s, sn);
}(window, document, 'ttq');
