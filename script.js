// ============================================================
// UX/IHC LAB — script compartilhado
// ============================================================

// Marca a aba ativa com base na página atual
(function markActiveTab(){
  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".tab").forEach(function(tab){
    var href = tab.getAttribute("href");
    if (href === path) tab.classList.add("active");
  });
})();

// --------------------------------------------------------------
// Ferramenta de contraste (usada na página WCAG / Paletas de Cores)
// --------------------------------------------------------------
(function contrastChecker(){
  var bgColor = document.getElementById("bgColor");
  var fgColor = document.getElementById("fgColor");
  var bgText  = document.getElementById("bgText");
  var fgText  = document.getElementById("fgText");
  var preview = document.getElementById("contrastPreview");
  var ratioBadge = document.getElementById("ratioBadge");
  var normalBadge = document.getElementById("normalBadge");
  var largeBadge = document.getElementById("largeBadge");

  if (!bgColor || !fgColor) return; // ferramenta não está nesta página

  function hexToRgb(hex){
    hex = hex.replace("#","");
    if (hex.length === 3) hex = hex.split("").map(function(c){ return c+c; }).join("");
    var num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function relLuminance(rgb){
    var channels = [rgb.r, rgb.g, rgb.b].map(function(v){
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  }

  function contrastRatio(hex1, hex2){
    var l1 = relLuminance(hexToRgb(hex1));
    var l2 = relLuminance(hexToRgb(hex2));
    var lighter = Math.max(l1, l2);
    var darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function isValidHex(v){ return /^#?[0-9a-fA-F]{3}$|^#?[0-9a-fA-F]{6}$/.test(v); }
  function normalizeHex(v){ return v.startsWith("#") ? v : "#" + v; }

  function update(){
    var bg = normalizeHex(bgText.value.trim());
    var fg = normalizeHex(fgText.value.trim());
    if (!isValidHex(bg) || !isValidHex(fg)) return;

    bgColor.value = bg;
    fgColor.value = fg;
    preview.style.background = bg;
    preview.style.color = fg;

    var ratio = contrastRatio(bg, fg);
    var rounded = Math.round(ratio * 100) / 100;
    ratioBadge.textContent = rounded + " : 1";

    setBadge(normalBadge, ratio >= 4.5, "AA — texto normal");
    setBadge(largeBadge, ratio >= 3, "AA — texto grande");
  }

  function setBadge(el, passed, label){
    el.textContent = (passed ? "✓ " : "✕ ") + label;
    el.className = "pass-badge " + (passed ? "pass" : "fail");
  }

  bgColor.addEventListener("input", function(){ bgText.value = bgColor.value; update(); });
  fgColor.addEventListener("input", function(){ fgText.value = fgColor.value; update(); });
  bgText.addEventListener("input", update);
  fgText.addEventListener("input", update);

  update();
})();
