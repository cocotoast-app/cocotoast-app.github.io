/* 法律条款页的语言切换。
   设计前提：HTML 默认输出英文（data-lang="en"），即使脚本被禁用或被爬虫忽略，
   页面主体内容依然完整可读 —— 这对支付平台的合规审核很重要。
   脚本只负责在检测到中文环境时切到中文。 */
(function () {
  var STORAGE_KEY = 'coco-toast-legal-lang';
  var DEFAULT_LANG = 'en';

  function detect() {
    try {
      var params = new URLSearchParams(window.location.search);
      var qs = params.get('lang');
      if (qs === 'zh' || qs === 'zh-CN') return 'zh';
      if (qs === 'en' || qs === 'en-US') return 'en';

      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'zh' || stored === 'en') return stored;
    } catch (e) {
      /* localStorage / URLSearchParams 不可用时走浏览器语言 */
    }

    var nav = window.navigator || {};
    var lang = nav.language || nav.userLanguage || '';
    return String(lang).toLowerCase().indexOf('zh') === 0 ? 'zh' : DEFAULT_LANG;
  }

  function apply(lang) {
    var root = document.documentElement;
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');

    var buttons = document.querySelectorAll('[data-lang-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].textContent = lang === 'zh' ? 'English' : '中文';
      buttons[i].setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换为中文');
    }
  }

  function set(lang) {
    apply(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore quota / privacy mode errors */
    }
  }

  var current = detect();
  apply(current);

  document.addEventListener('click', function (event) {
    var target = event.target;
    while (target && target !== document) {
      if (target.hasAttribute && target.hasAttribute('data-lang-toggle')) {
        event.preventDefault();
        set(document.documentElement.getAttribute('data-lang') === 'zh' ? 'en' : 'zh');
        return;
      }
      target = target.parentNode;
    }
  });
})();
