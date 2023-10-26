// write or paste code here
"use strict";

var sdp = function () {
  function isNodeList(a) {
    return /^\[object (HTMLCollection|NodeList)\]$/.test(Object.prototype.toString.call(a));
  }

  function isElement(a) {
    return !!a && !!a.nodeName;
  }

  function parseUrl(a) {
    var url = a;
    if (isIE) {
      ieAnchor.setAttribute("href", url);
      url = ieAnchor.href;
    }
    otherAnchor.setAttribute("href", url);

    return {
      href: otherAnchor.href,
      protocol: otherAnchor.protocol ? otherAnchor.protocol.replace(/:$/, "") : "",
      host: otherAnchor.host,
      search: otherAnchor.search ? otherAnchor.search.replace(/^\?/, "") : "",
      hash: otherAnchor.hash ? otherAnchor.hash.replace(/^#/, "") : "",
      hostname: otherAnchor.hostname,
      port: parseInt(otherAnchor.port) ? parseInt(otherAnchor.port) : "",
      pathname: "/" === otherAnchor.pathname.charAt(0) ? otherAnchor.pathname : "/" + otherAnchor.pathname,
    };
  }

  function htmlEntitiesDecode(str) {
    return String(str)
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  }

  function encodeURIComponentCustom(str) {
    str += "";
    return encodeURIComponent(str)
      .replace(/!/g, "%21")
      .replace(/'/g, "%27")
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")
      .replace(/\*/g, "%2A");
  }

  var isIE, toolbarId, host, whitelist, isPanelHostSet;

  function createSDP(a) {
    isIE = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1], 10);
    isNaN(isIE) && (isIE = parseInt((/trident\/.*; rv:(\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1], 10));
    toolbarId = a || "AA000015";
    host = "sur.ly";
    whitelist = ["sur.ly", "surdotly.com"];
    isPanelHostSet = false;

    function setPanelHost(panelHost) {
      if (panelHost && typeof panelHost === "string") {
        host = panelHost.toLowerCase().replace(/^(https?:\/\/)?(www\d{0,3}\.)?/, "");
        whiteList(host);
        isPanelHostSet = true;
      }
      return this;
    }

    function whiteList(domain) {
      if (domain && typeof domain === "string") {
        whiteList.push(domain.toLowerCase().replace(/^(https?:\/\/)?(www\d{0,3}\.)?/, ""));
      }
      return this;
    }

    function processElement(element) {
      if (!isElement(element)) return null;

      var links = element.getElementsByTagName("A");

      for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute("href");
        if (href) {
          href = processUrl(href);
          if (isIE) {
            var innerHTML = links[i].innerHTML;
            links[i].setAttribute("href", href);
            if (links[i].innerHTML !== innerHTML) {
              links[i].innerHTML = innerHTML;
            }
          } else {
            links[i].setAttribute("href", href);
          }
        }
      }
    }

    function process(elements) {
      if (elements && elements.length) {
        for (var i = 0; i <= elements.length; i++) {
          processElement(elements[i]);
        }
      } else {
        processElement(elements);
      }
    }

    function processUrl(url) {
      if (!/^(https?:\/\/)([^\s\.]+\..+)$/i.test(url)) return url;

      var parsedUrl = parseUrl(htmlEntitiesDecode(url));

      if (isInWhitelist(parsedUrl.hostname)) return url;

      if (parsedUrl.pathname === "/" && !parsedUrl.search && !parsedUrl.hash) {
        parsedUrl.trailingSlash = true;
      }

      return composeUrl(parsedUrl);
    }

    function processMultipleUrls(urls) {
      urls = Array.isArray(urls) ? urls : [];
      for (var i = 0; i < urls.length; i++) {
        urls[i] = processUrl(urls[i]);
      }
      return urls;
    }

    function composeUrl(parsedUrl) {
      var protocol = isPanelHostSet ? "http" : parsedUrl.protocol;
         return (
          (isPanelHostSet ? "http" : parsedUrl.protocol) +
          "://" +
          host +
          (isPanelHostSet ? "/s/" : "/") +
          parsedUrl.hostname +
          (parsedUrl.port ? (e[parsedUrl.protocol] === parsedUrl.port ? "" : ":" + parsedUrl.port) : "") +
          ("/" !== parsedUrl.pathname || parsedUrl.search || parsedUrl.hash ? "/" : "") +
          ("/" !== parsedUrl.pathname ? encodeURIComponentCustom(parsedUrl.pathname.replace(/^\//, "")) : "") +
          (parsedUrl.search ? encodeURIComponentCustom("?" + parsedUrl.search) : "") +
          (parsedUrl.hash ? encodeURIComponentCustom("#" + parsedUrl.hash) : "") +
          (isPanelHostSet ? (parsedUrl.trailingSlash ? "/" : "") : "/") +
          this.toolbarId
        );
      }

      return {
        setPanelHost: setPanelHost,
        whiteList: whiteList,
        processElement: processElement,
        process: process,
        processUrl: processUrl,
        processMultipleUrls: processMultipleUrls,
      };
    }

    return createSDP(a);
  };

  window.sdp = sdp;
})();


