/* In-place EN <-> ZH switch for the homepage.
   Every switchable element carries data-zh (its Chinese innerHTML).
   The original English innerHTML is cached in data-en on first load. */
(function () {
    var KEY = 'site-lang';
    var btn = document.getElementById('lang-toggle');
    var isHome = document.body.hasAttribute('data-i18n-home');
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-zh]'));

    nodes.forEach(function (el) {
        if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML);
    });

    var q = null;
    try { q = new URLSearchParams(window.location.search); } catch (e) {}
    var queryLang = q ? q.get('lang') : null;
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}

    var initial = queryLang === 'zh' ? true
                : queryLang === 'en' ? false
                : saved === 'zh';

    function apply(zh, updateUrl) {
        nodes.forEach(function (el) {
            el.innerHTML = zh ? el.getAttribute('data-zh') : el.getAttribute('data-en');
        });
        document.documentElement.lang = zh ? 'zh-CN' : 'en';
        document.body.classList.toggle('lang-zh', zh);
        document.documentElement.classList.remove('lang-zh-pre');

        if (btn) {
            var label = btn.querySelector('.lang-label');
            if (label) label.textContent = zh ? 'English' : '中文';
            btn.classList.toggle('is-zh', zh);
            btn.setAttribute('aria-label', zh ? 'Switch to English' : '切换到中文');
        }

        try { localStorage.setItem(KEY, zh ? 'zh' : 'en'); } catch (e) {}

        if (updateUrl && q) {
            var url = new URL(window.location.href);
            if (zh) url.searchParams.set('lang', 'zh');
            else url.searchParams.delete('lang');
            try {
                history.replaceState(null, '', url.pathname + url.search + url.hash);
            } catch (e) {}
        }
    }

    apply(initial, false);

    if (btn) {
        btn.addEventListener('click', function () {
            var zh = !document.body.classList.contains('lang-zh');
            if (!isHome) {
                // Other pages have no translated body; bring the user back to the homepage.
                var home = btn.getAttribute('data-home-url') || '/';
                window.location.href = home + (zh ? '?lang=zh' : '');
                return;
            }
            apply(zh, true);
        });
    }
})();
