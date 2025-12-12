const initialIframeContent = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Preview</title>
<style>
  *{box-sizing:border-box}
  body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial;color:#222;margin:0;background:#f6f7fb}
  nav{background:#007bff;color:#fff;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}
  .hero{background:#eaf2ff;padding:2rem;border-radius:10px;margin:1.2rem;text-align:center}
  .container{display:flex;gap:1rem;padding:1.2rem;flex-wrap:wrap}
  .main{flex:3 1 600px;background:white;padding:1rem;border-radius:8px}
  .sidebar{flex:1 1 260px;background:white;padding:1rem;border-radius:8px}
  footer{padding:1rem;text-align:center;background:#007bff;color:#fff;margin:1.2rem;border-radius:8px}
</style>
</head>
<body>
  <nav><h1 style="margin:0;font-size:1.1rem">My Blog</h1><div><a href="#" style="color:white;margin-left:1rem">Home</a></div></nav>
  <section class="hero"><h2 style="color:#007bff">Welcome</h2><p>Example blog preview</p></section>
  <div class="container">
    <main class="main">
      <article style="margin-bottom:12px"><h3>Post Title</h3><p>Published on Dec 1, 2025</p></article>
      <article><h3>Post Title 2</h3><p>Published on Nov 28, 2025</p></article>
    </main>
    <aside class="sidebar"><h4>About</h4><p>Author info</p></aside>
  </div>
  <footer>&copy; 2025</footer>
</body>
</html>`;

export default initialIframeContent;
