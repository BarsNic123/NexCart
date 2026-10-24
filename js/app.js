const CART_KEY = "nexcart_cart";
const USER_KEY = "nexcart_user";
const USERS_KEY = "nexcart_users";
//inventory is stored in local storage for now
const INVENTORY_KEY = "nexcart_inventory"

const store = {
  getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; }
  },
  setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  },
  getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch { return null; }
  },
  setUser(user) {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  },
  getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
  },
  setUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  getInventory() {
    try { return JSON.parse(localStorage.getItem(INVENTORY_KEY) || "[]"); } catch { return []; }
  },
  setInventory(products) {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(products));
  }
}

store.setUsers(nexcart_users) //sets premade user accounts listed in data.js
store.setInventory(PRODUCTS) //sets nexcart inventory, defined in data.js in local storage

function money(n) {
  return "₱" + Number(n).toLocaleString("en-PH");
}

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

function updateCartCount() {
  const count = store.getCart().reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll(".cart-count").forEach((n) => { n.textContent = count; });
}

function addToCart(id) {
  const product = store.getInventory().find((p) => p.id === id);
  if (!product || !product.qty) {
    toast("This item is currently out of stock");
    return;
  }
  const cart = store.getCart();
  const existing = cart.find((i) => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, qty: 1 });
  store.setCart(cart);
  toast(product.name + " added to cart");
}

function parseHash() {
  const raw = location.hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart] = raw.split("?");
  const params = new URLSearchParams(queryPart || "");
  return { path: pathPart || "/", params };
}

function setActiveNav(page) {
  document.querySelectorAll(".main-nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === page);
  });
}

function productCard(p) {
  return `
    <article class="card">
      <div class="thumb">${p.emoji}</div>
      <div class="card-body">
        <span class="badge">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="meta">${p.specs} · ${p.grade} · ${p.warranty} warranty</div>
        <div class="price">${money(p.price)}</div>
        <div class="actions">
          <a class="btn-ghost" href="#/product/${p.id}" data-link>View</a>
          ${p.qty
            ? `<button class="btn" data-add="${p.id}">Add to cart</button>`
            : `<button class="btn-ghost" disabled>Out of stock</button>`}
        </div>
      </div>
    </article>
  `;
}

function renderHome() {
  setActiveNav("home");
  return `
    <section class="hero-slider">
      <div class="slide" id="hero-slide"></div>
      <div class="dots" id="hero-dots"></div>
    </section>
    <div class="wrap">
      <h2 class="section-title">Best Seller</h2>
      <div class="grid">${store.getInventory().slice(0, 4).map(productCard).join("")}</div>
      <h2 class="section-title">Gaming Laptops</h2>
      <div class="grid">${store.getInventory().filter((p) => p.category === "Gaming Laptops").map(productCard).join("")}</div>
      <div class="stats">
        <div><strong>50+</strong>Quality Checks</div>
        <div><strong>3 year+</strong>Full Warranty</div>
      </div>
      <h2 class="section-title">The New Standard for Refurbished Tech</h2>
      <div class="quotes">
        <div class="quote">“Sold my laptop easily. Pickup was smooth and payment was instant.”<br><br><b>Rahul Verma</b> · Cebu</div>
        <div class="quote">“Great staff and fast service. Amazing experience with Nexcart!”<br><br><b>Suman Roy</b> · Cebu</div>
        <div class="quote">“Got the best price for my old laptop. Pickup was on time.”<br><br><b>Amit Sharma</b> · Cebu</div>
        <div class="quote">“Very professional and smooth process. Highly recommended!”<br><br><b>Neha Gupta</b> · Cebu</div>
      </div>
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div class="faq">${FAQS.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("")}</div>
    </div>
  `;
}

function renderShop(params) {
  setActiveNav("shop");
  const category = params.get("category") || "All";
  const q = (params.get("q") || "").toLowerCase();
  const sort = params.get("sort") || "menu";
  let items = store.getInventory().filter((p) => { //originally PRODUCTS.filter, but changed for functionality demonstration purposes
    const catOk = category === "All" || p.category === category;
    const qOk = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return catOk && qOk;
  });
  if (sort === "price") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
  if (sort === "latest") items = [...items].reverse();
  const cats = ["All", ...new Set(store.getInventory().map((p) => p.category))];
  return `
    <div class="wrap">
      <h1>Shop</h1>
      <div class="shop-bar">
        <div class="filters">
          ${cats.map((c) => `<button data-filter="${c}" class="${c === category ? "on" : ""}">${c}</button>`).join("")}
        </div>
        <select id="sort">
          <option value="menu" ${sort === "menu" ? "selected" : ""}>Default sorting</option>
          <option value="latest" ${sort === "latest" ? "selected" : ""}>Sort by latest</option>
          <option value="price" ${sort === "price" ? "selected" : ""}>Sort by price: low to high</option>
          <option value="price-desc" ${sort === "price-desc" ? "selected" : ""}>Sort by price: high to low</option>
        </select>
      </div>
      ${q ? `<p>Showing results for “${q}”</p>` : ""}
      <div class="grid">${items.map(productCard).join("") || '<p class="empty">No products found.</p>'}</div>
    </div>
  `;
}

function renderProduct(id) {
  setActiveNav("shop");
  const p = store.getInventory().find((x) => x.id === id);
  if (!p) return `<div class="wrap"><p class="empty">Product not found.</p></div>`;
  return `
    <div class="wrap sell-hero">
      <div>
        <div class="thumb" style="height:280px;border-radius:16px">${p.emoji}</div>
      </div>
      <div>
        <span class="badge">${p.category}</span>
        <h1 style="text-align:left;font-size:36px">${p.name}</h1>
        <p>${p.specs}</p>
        <p>Grade: ${p.grade} · Warranty: ${p.warranty}</p>
        <p class="price" style="font-size:28px">${money(p.price)}</p>
        ${p.qty
          ? `<button class="btn" data-add="${p.id}">Add to cart</button>`
          : `<button class="btn-ghost" disabled>Out of stock</button>`}
      </div>
    </div>
  `;
}

function renderSell() {
  setActiveNav("sell");
  return `
    <div class="wrap">
      <section class="sell-hero">
        <div>
          <h1>Sell Old Laptop in Cebu</h1>
          <p class="perk">⚡ Free Same-Day Pickup</p>
          <p class="perk">💰 Instant Cash Payment</p>
          <p class="perk">🔒 100% Secure Data Wipe</p>
          <div class="cta-row">
            <a class="btn" href="#quote">Get instant quote</a>
          </div>
        </div>
        <div class="hero-art">Get a fair price<br>for your used laptop</div>
      </section>
      <h2 class="section-title">How Nexcart Works</h2>
      <div class="steps">
        <div class="step"><div class="num">1</div><h3>Get a quick quote</h3><p>Select your laptop or MacBook and share its condition to receive a fair price instantly.</p></div>
        <div class="step"><div class="num">2</div><h3>Schedule a free pickup</h3><p>Choose a convenient time and our trained executive will collect the device from your doorstep.</p></div>
        <div class="step"><div class="num">3</div><h3>Receive instant payment</h3><p>After quick verification, get paid immediately via cash or bank transfer with no hidden charges.</p></div>
      </div>
      <h2 class="section-title" id="quote">Instant valuation</h2>
      <form class="form" id="sell-form">
        <label>Model</label>
        <select name="model">${Object.keys(SELL_BASE).map((m) => `<option>${m}</option>`).join("")}</select>
        <label>RAM</label>
        <select name="ram"><option>8GB</option><option>16GB</option><option>32GB</option></select>
        <label>Condition</label>
        <select name="condition"><option>Excellent</option><option>Good</option><option>Fair</option></select>
        <label>Your name</label>
        <input name="name" required placeholder="Full name" />
        <label>Phone</label>
        <input name="phone" required placeholder="10-digit mobile" />
        <button class="btn" type="submit">Get my quote</button>
        <div id="quote-result"></div>
      </form>
    </div>
  `;
}

function renderCart() {
  setActiveNav("cart");
  const cart = store.getCart();
  if (!cart.length) {
    return `<div class="wrap"><h1>Cart</h1><p class="empty">Your cart is empty. <a href="#/shop" data-link>Continue shopping</a></p></div>`;
  }
  const rows = cart.map((item) => { 
    const p = store.getInventory().find((x) => x.id === item.id);
    return `
      <tr>
        <td>${p.name}</td>
        <td>${money(p.price)}</td>
        <td>
          <div class="qty">
            <button data-qty="${p.id}" data-delta="-1" ${item.qty <= 1 ? "disabled" : ""}>−</button>
            <span>${item.qty}</span>
            <button data-qty="${p.id}" data-delta="1" ${!p || item.qty >= p.qty ? "disabled" : ""}>+</button>
          </div>
        </td>
        <td>${money(p.price * item.qty)}</td>
        <td><button class="btn-ghost" data-remove="${p.id}">Remove</button></td>
      </tr>`;
  }).join("");
  const total = cart.reduce((sum, item) => {
    const p = store.getInventory().find((x) => x.id === item.id);
    return sum + p.price * item.qty;
  }, 0);
  return `
    <div class="wrap">
      <h1>Cart</h1>
      <table class="cart-table">
        <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="totals">
        <p><b>Total: ${money(total)}</b></p>
        <button class="btn" id="checkout">Checkout</button>
      </div>
    </div>
  `;
}

function renderInventory() {
  /*
  setActiveNav("inventory");
  const user = store.getUser() //get user data
  if (user && user.role == "admin") {

    const rows = store.getInventory().map((item) => { //for every item in PRODUCTS
      //const p = PRODUCTS.find((x) => x.id === item.id);
      return `
        <tr>
          <td>${item.name}</td>
          <td>${money(item.price)}</td>
          <td>
            <div class="qty">
              <button data-qty="${item.id}" data-delta="-1">-</button>
              <span>${item.qty}</span>
              <button data-qty="${item.id}" data-delta="1">+</button>
            </div>
          </td>
        </tr>
      `;
    }).join(""); //append as STRING

    return `
    <div class="wrap">
      <h2 class="section-title" id="quote">Product Inventory</h2>
      <table class="cart-table">
        <thead> <tr> <th>Product</th> <th>Price</th> <th>Qty</th> </tr> </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    `;
  }
  else {
    return `
    <div class="wrap">
      <h1> Access denied </h1>
      <p> You must be an administrator to view this page. </p>
    </div>
    `;   
  }
 */
}

function renderAccount() {
  setActiveNav("account");
  const user = store.getUser();
  if (user) {
    if (user && user.role == "admin") {
       return `
        <div class="wrap">
          <div class="auth-card">
            <h1>My Admin Account</h1>
            <p>Signed in as <b>${user.name}</b></p>
            <p>${user.email}</p>
            <button class="btn" id="logout">Log out</button>
       
          </div>
        </div>
      `;       
    }
    else if (user && user.role == "user") {
       return `
        <div class="wrap">
          <div class="auth-card">
            <h2>My User Account</h2>
            <p>Signed in as <b>${user.name}</b></p>
            <p>${user.email}</p>
            <p>My orders: ${user.orders}</b></p>
            <button class="btn" id="logout">Log out</button>
          </div>
        </div>
      `;       
    }    

  }
  return `
    <div class="wrap">
      <div class="auth-card">
        <div class="tabs">
          <button class="btn" id="tab-login">Login</button>
          <button class="btn-ghost" id="tab-register">Register</button>
        </div>
        <form class="form" id="auth-form">
          <input type="hidden" name="mode" value="login" />
          <label>Name</label>
          <input name="name" placeholder="Your name" />
          <label>Email</label>
          <input name="email" type="email" required placeholder="you@email.com" />
          <label>Password</label>
          <input name="password" type="password" required minlength="4" />
          <button class="btn" type="submit">Continue</button>
        </form>
      </div>
    </div>
  `;
}

function startHero() {
  const slide = document.getElementById("hero-slide");
  const dots = document.getElementById("hero-dots");
  if (!slide || !dots) return;
  let i = 0;
  const paint = () => {
    const s = SLIDES[i];
    slide.innerHTML = `<div><h2>${s.title}</h2><p>${s.text}</p><a class="cta" href="${s.href}" data-link>${s.cta}</a></div>`;
    dots.innerHTML = SLIDES.map((_, idx) => `<button class="${idx === i ? "on" : ""}" data-slide="${idx}"></button>`).join("");
  };
  paint();
  const timer = setInterval(() => { i = (i + 1) % SLIDES.length; paint(); }, 4500);
  dots.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-slide]");
    if (!btn) return;
    i = Number(btn.dataset.slide);
    paint();
  });
  return () => clearInterval(timer);
}


function route() {
  const { path, params } = parseHash();
  const app = document.getElementById("app");
  if (path.startsWith("/product/")) app.innerHTML = renderProduct(path.split("/")[2]);
  else if (path === "/shop") app.innerHTML = renderShop(params);
  else if (path === "/sell") app.innerHTML = renderSell();
  else if (path === "/cart") app.innerHTML = renderCart();
  else if (path === "/account") app.innerHTML = renderAccount();
  else if (path === "/inventory") {
    const user = store.getUser();
    if (user && user.role === "admin") {
      app.innerHTML = renderInventory();
    }
    else {
      app.innerHTML = `
      <div class="wrap">
        <h1> Access denied </h1>
        <p> You must be an administrator to view this page. </p>
      </div>
      `;
    }
  }
  else app.innerHTML = renderHome();

  if (path === "/" || path === "") startHero();
  updateCartCount();
}

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    productId = add.dataset.add; // declares variable to store the html element's respective product id
    inventoryItem = store.getInventory().find((i) => i.id === productId); // retrieve the product from store inventory that MATCHES the current product's ID
    productInventoryQty = Number(inventoryItem.qty); // take qty value of the corresponding item in inventory

    if (productInventoryQty <= 0) { //check if inventory stock > 0 AKA is there anything to add?
      toast("Product is unavailable");
      return;
    }
    else { //if stock is available...
      cartProduct = store.getCart().find((i) => i.id === productId) //check cart if the corresponding product has already been added.
      if (cartProduct) { //if product found in cart,
        newQty = productInventoryQty - Number(cartProduct.qty); //declare new variable and find the result of subtracting current cart quantity from available stock.
        if (newQty <= 0) { // if the result exceeds the current stock in inventory, return an error.
          toast("Cannot exceed current stock.");
          return; 
        }
        else { //otherwise, if it doesn't exceed current stock...
          addToCart(add.dataset.add); //add to cart.
        }
      }
      else {  //otherwise, if not in cart yet (and stock is available)...
        addToCart(add.dataset.add); //add to cart.
      }
    }
  }

  const filter = e.target.closest("[data-filter]");
  if (filter) location.hash = `#/shop?category=${encodeURIComponent(filter.dataset.filter)}`;

  const qty = e.target.closest("[data-qty]");

  if (qty) { //if element with CSS selector [data-qty] is there
    const productId = qty.dataset.qty; //declare product Id variable and store product Id there (data-qty stores product id)
    const delta = Number(qty.dataset.delta); // declare delta variable and stores delta from same element

    const cart = store.getCart(); //retrieves cart 
    const inventory = store.getInventory(); //retrieves inventory

    const item = cart.find(x => x.id === productId); //retrieves the corresponding element (item) from the cart
    const product = inventory.find(x => x.id === productId); //retrieves corresponding item in inventory

    if (!item || !product) return; //if item does not exist in cart or inventory do nothing (error handling)

    const newQty = item.qty + delta;  //declare newqty variable, assign to it the sum of the quantity of the respective item in the cart and the difference

    if (delta < 0 && newQty < 1) { //if delta is NEGATIVE (AKA using the - button to subtract units) AND the resulting quantity is lesser than 1, do nothing (error handling)
      return;
    }

    if (delta > 0 && newQty > product.qty) { //if delta is POSITIVE (AKA using the + button to add more units) AND the resulting quantity exceeds the current stock, do nothing and return a toast error message
      toast("Not enough stock available");
      return;
    }

    item.qty = newQty; // assign value of new qty to cart item's qty. This change is saved in the cart array itself as find() retrieves the element itself and not a copy

    store.setCart(cart); // save changes of temporary cart to main cart
    route(); //"refresh" page to reflect changes
  }

  const remove = e.target.closest("[data-remove]");
  if (remove) {
    store.setCart(store.getCart().filter((i) => i.id !== remove.dataset.remove)); //retrieves cart, looks for the corresponding item, removes it and sets cart)
    route();
  }

  if (e.target.id === "checkout") {
    const user = store.getUser(); //retrieves the current user
    if (!user) { // if there is no user (not logged in), redirected to the account page
      toast("Please log in to checkout");
      location.hash = "#/account";
      return;
    }
    const cart = store.getCart(); //declares cart variable and copies the cart array to store temporarily
    const inventory = store.getInventory(); //declares inventory variable and copies the inventory array to store temporarily

    //validation check if inventory still have stock for selected products AT time of checkout
    for (const p of cart) { //for every entry in the cart array...
      const matchingProduct = inventory.find((i) => i.id === p.id); //retrieve product FROM inventory whose id matches product FROM cart
      if (matchingProduct.qty < p.qty) { //if stock is less than specified amount of product in cart...
        toast(`Not enough stock for ${matchingProduct.name}`);
        return;
      }
    }

    for (const p of cart) { //for every entry in the cart array...
      const matchingProduct = inventory.find((i) => i.id === p.id); //retrieve product FROM inventory whose id matches product FROM cart
      matchingProduct.qty -= p.qty //deduct qty of product FROM cart from qty of product FROM inventory
    }

    user.orders = (user.orders || 0) + 1;
    store.setUser(user); //updates User
    store.setInventory(inventory); //updates the current inventory
    store.setCart([]); //empties the cart

    toast("Order placed. Thank you!");
    location.hash = "#/"; //return to homepage
  }

  if (e.target.id === "logout") {
    store.setUser(null);
    toast("Logged out");
    route();
  }

  if (e.target.id === "tab-login" || e.target.id === "tab-register") {
    const form = document.getElementById("auth-form");
    const login = e.target.id === "tab-login";
    form.mode.value = login ? "login" : "register";
    document.getElementById("tab-login").className = login ? "btn" : "btn-ghost";
    document.getElementById("tab-register").className = login ? "btn-ghost" : "btn";
  }

  if (e.target.id === "menu-toggle") {
    document.querySelector(".main-nav").classList.toggle("open");
  }
});

document.addEventListener("change", (e) => {
  if (e.target.id === "sort") {
    const { params } = parseHash();
    params.set("sort", e.target.value);
    const category = params.get("category");
    location.hash = `#/shop?${params.toString()}`;
    void category;
  }
});

document.addEventListener("submit", (e) => {
  if (e.target.id === "search-form") {
    e.preventDefault();
    const q = document.getElementById("search-input").value.trim();
    document.getElementById("search-dropdown").hidden = true;
    location.hash = `#/shop?q=${encodeURIComponent(q)}`;
  }
  if (e.target.id === "sell-form") {
    e.preventDefault();
    const data = new FormData(e.target);
    const model = data.get("model");
    let quote = SELL_BASE[model];
    if (data.get("ram") === "16GB") quote += 2500;
    if (data.get("ram") === "32GB") quote += 5000;
    if (data.get("condition") === "Good") quote = Math.round(quote * 0.88);
    if (data.get("condition") === "Fair") quote = Math.round(quote * 0.72);
    document.getElementById("quote-result").innerHTML = `
      <div class="quote-box">
        Estimated offer for ${data.get("name")}
        <strong>${money(quote)}</strong>
        Free pickup in Cebu · Instant cash after verification
      </div>`;
  }
  if (e.target.id === "auth-form") {
    e.preventDefault();
    const data = new FormData(e.target);
    const email = String(data.get("email")).toLowerCase();
    const password = String(data.get("password"));
    const name = String(data.get("name") || "Nexcart user");
    const users = store.getUsers();
    if (data.get("mode") === "register") {
      if (users.some((u) => u.email === email)) {
        toast("Account already exists");
        return;
      }
      const user = { name, email, password, role, orders: 0 };
      users.push(user);
      store.setUsers(users);
      store.setUser({ name, email, role:"user", orders: 0 });
      toast("Account created");
      route();
      return;
    }
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      toast("Invalid email or password");
      return;
    }
    store.setUser({ name: found.name, email: found.email, role: found.role, orders: found.orders || 0 });
    toast("Welcome back");
    route();
  }
});

document.getElementById("search-input").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  const box = document.getElementById("search-dropdown");
  if (!q) { box.hidden = true; return; }
  const hits = store.getInventory().filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5);
  box.hidden = !hits.length;
  box.innerHTML = hits.map((p) => `<div class="search-item" data-goto="${p.id}"><span>${p.name}</span><span>${money(p.price)}</span></div>`).join("");
});

document.getElementById("search-dropdown").addEventListener("click", (e) => {
  const item = e.target.closest("[data-goto]");
  if (!item) return;
  document.getElementById("search-dropdown").hidden = true;
  location.hash = `#/product/${item.dataset.goto}`;
});

window.addEventListener("hashchange", route);
route();
