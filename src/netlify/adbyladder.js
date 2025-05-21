(function() {
    const adIns = document.querySelectorAll("ins.ladder-ad-inside");
    
    adIns.forEach((ins) => {
        const url = ins.getAttribute('data-ad-url');
        if (!url) return;

        const iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.style.border = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.loading = 'lazy';

        ins.appendChild(iframe);
    });
})();