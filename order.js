/* wrecker: on-site preorder form + photo fixes.
   Add ONE line to index.html just before </body>:
   <script src="order.js" defer></script>
   Then paste your Web3Forms access key below. */
(function () {
  var ACCESS_KEY = "PASTE_WEB3FORMS_ACCESS_KEY_HERE";

  var css = [
    /* photo fixes: show the whole image, no cropping */
    ".po-photo{height:auto !important;aspect-ratio:auto !important;overflow:visible !important}",
    ".po-photo img{width:100% !important;height:auto !important;aspect-ratio:auto !important;object-fit:contain !important;display:block}",
    /* order form */
    "#order-form{margin-top:20px;display:grid;gap:12px;max-width:460px}",
    "#order-form .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}",
    "#order-form label{display:grid;gap:6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase}",
    "#order-form input,#order-form textarea{font:inherit;font-size:15px;letter-spacing:normal;text-transform:none;padding:12px;border:1px solid #111;border-radius:0;background:transparent;color:inherit;width:100%;box-sizing:border-box}",
    "#order-form textarea{min-height:76px;resize:vertical}",
    "#order-form button{font:inherit;font-weight:700;letter-spacing:.14em;text-transform:uppercase;padding:16px;border:0;background:#111;color:#ece4d3;cursor:pointer}",
    "#order-form button[disabled]{opacity:.5;cursor:not-allowed}",
    "#order-summary{font-size:14px;margin:0}",
    "#order-msg{font-size:14px;margin:0}",
    "#order-msg.err{color:#a11}",
    "#order-done{margin-top:20px;padding:18px;border:1px solid #111;max-width:460px}",
    "@media(max-width:480px){#order-form .row{grid-template-columns:1fr}}"
  ].join("\n");
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.getElementById("po-btn");
  var note = document.getElementById("po-note");
  if (!btn) return;
  btn.style.display = "none";
  if (note) note.style.display = "none";

  var form = document.createElement("form");
  form.id = "order-form";
  form.innerHTML =
    '<p id="order-summary">Pick your size above to start your preorder.</p>' +
    '<div class="row">' +
      '<label>First name<input name="first_name" required autocomplete="given-name"></label>' +
      '<label>Last name<input name="last_name" required autocomplete="family-name"></label>' +
    '</div>' +
    '<label>Email<input type="email" name="email" required autocomplete="email"></label>' +
    '<label>Phone number<input type="tel" name="phone" required autocomplete="tel"></label>' +
    '<label>Delivery address<textarea name="address" required autocomplete="street-address"></textarea></label>' +
    '<input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" style="display:none">' +
    '<button type="submit" id="order-submit" disabled>Place preorder</button>' +
    '<p id="order-msg" role="status"></p>';
  btn.parentNode.insertBefore(form, btn.nextSibling);

  var summary = document.getElementById("order-summary");
  var submit = document.getElementById("order-submit");
  var msg = document.getElementById("order-msg");
  var size = "";

  function setSize(v) {
    size = v;
    summary.textContent = size
      ? 'Navy "Wreck" Hoodie, size ' + size + ", \u09F31,500"
      : "Pick your size above to start your preorder.";
    submit.disabled = !size;
  }
  Array.prototype.forEach.call(document.querySelectorAll('input[name="size"]'), function (r) {
    r.addEventListener("change", function () { setSize(r.value); });
    if (r.checked) setSize(r.value);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!size) return;
    var f = new FormData(form);
    var data = {
      access_key: ACCESS_KEY,
      subject: "New preorder: Navy WRECK Hoodie, size " + size,
      from_name: "wrecker website",
      product: 'Navy "WRECK" Hoodie',
      size: size,
      price: "BDT 1,500",
      first_name: f.get("first_name"),
      last_name: f.get("last_name"),
      email: f.get("email"),
      phone: f.get("phone"),
      address: f.get("address"),
      botcheck: f.get("botcheck") ? "yes" : ""
    };
    submit.disabled = true;
    submit.textContent = "Sending...";
    msg.className = "";
    msg.textContent = "";
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.success) throw new Error(j.message || "failed");
        var done = document.createElement("div");
        done.id = "order-done";
        done.innerHTML =
          "<strong>Your preorder is in.</strong><p>Thank you! We have your order for size " + size +
          ' and will contact you to confirm. Questions? Message us on <a href="https://www.instagram.com/wrecker.co/" target="_blank" rel="noopener">Instagram</a>.</p>';
        form.parentNode.replaceChild(done, form);
      })
      .catch(function () {
        submit.disabled = false;
        submit.textContent = "Place preorder";
        msg.className = "err";
        msg.innerHTML = 'Something went wrong, so your order was not sent. Please try again, or message us on <a href="https://ig.me/m/wrecker.co" target="_blank" rel="noopener">Instagram</a>.';
      });
  });
})();
