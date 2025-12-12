export const initialIframeContent = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>Nexus - Creative Studio</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header & Navigation */
        header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 0;
        }
        
        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-decoration: none;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: #667eea;
        }
        
        .cta-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.8rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        
        /* Hero Section */
        .hero {
            padding: 180px 0 120px;
            text-align: center;
            color: white;
        }
        
        .hero h1 {
            font-size: 4rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }
        
        .hero p {
            font-size: 1.25rem;
            max-width: 600px;
            margin: 0 auto 3rem;
            opacity: 0.9;
        }
        
        /* Features Section */
        .features {
            padding: 100px 0;
            background: white;
            border-radius: 30px 30px 0 0;
        }
        
        .section-title {
            text-align: center;
            margin-bottom: 4rem;
        }
        
        .section-title h2 {
            font-size: 2.5rem;
            color: #333;
            margin-bottom: 1rem;
        }
        
        .section-title p {
            color: #666;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .feature-card {
            background: #f8f9fa;
            padding: 2.5rem;
            border-radius: 20px;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
            color: white;
        }
        
        .feature-card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #333;
        }
        
        .feature-card p {
            color: #666;
        }
        
        /* Portfolio Section */
        .portfolio {
            padding: 100px 0;
            background: #f8f9fa;
        }
        
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .portfolio-item {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }
        
        .portfolio-item:hover {
            transform: translateY(-5px);
        }
        
        .portfolio-image {
            height: 250px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
        }
        
        .portfolio-content {
            padding: 1.5rem;
        }
        
        .portfolio-content h3 {
            margin-bottom: 0.5rem;
            color: #333;
        }
        
        /* Testimonials */
        .testimonials {
            padding: 100px 0;
            background: white;
        }
        
        .testimonial-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .testimonial-card {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 20px;
            border-left: 4px solid #667eea;
        }
        
        .testimonial-text {
            font-style: italic;
            margin-bottom: 1.5rem;
            color: #555;
        }
        
        .testimonial-author {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .author-avatar {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
        }
        
        /* CTA Section */
        .cta-section {
            padding: 100px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            border-radius: 0 0 30px 30px;
        }
        
        .cta-section h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        /* Footer */
        footer {
            background: #1a1a2e;
            color: white;
            padding: 4rem 0 2rem;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
            margin-bottom: 3rem;
        }
        
        .footer-column h4 {
            margin-bottom: 1.5rem;
            font-size: 1.2rem;
        }
        
        .footer-links {
            list-style: none;
        }
        
        .footer-links li {
            margin-bottom: 0.8rem;
        }
        
        .footer-links a {
            color: #b0b0b0;
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .footer-links a:hover {
            color: white;
        }
        
        .copyright {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #b0b0b0;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .nav-links {
                display: none;
            }
            
            .features-grid,
            .portfolio-grid,
            .testimonial-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <nav>
                <a href="#" class="logo">NEXUS</a>
                <ul class="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#portfolio">Portfolio</a></li>
                    <li><a href="#testimonials">Testimonials</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <a href="#contact" class="cta-button">Get Started</a>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="container">
            <h1>Create Digital Experiences That Inspire</h1>
            <p>We design and develop beautiful, functional websites that drive results and elevate your brand's digital presence.</p>
            <a href="#portfolio" class="cta-button">View Our Work</a>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
        <div class="container">
            <div class="section-title">
                <h2>Our Core Services</h2>
                <p>We combine creativity with technology to deliver exceptional digital solutions</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3>UI/UX Design</h3>
                    <p>Creating intuitive and beautiful interfaces that enhance user experience and drive engagement.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💻</div>
                    <h3>Web Development</h3>
                    <p>Building responsive, high-performance websites with modern frameworks and best practices.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>Mobile Apps</h3>
                    <p>Developing cross-platform mobile applications that provide seamless user experiences.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Portfolio Section -->
    <section id="portfolio" class="portfolio">
        <div class="container">
            <div class="section-title">
                <h2>Recent Projects</h2>
                <p>Take a look at some of our latest work and success stories</p>
            </div>
            <div class="portfolio-grid">
                <div class="portfolio-item">
                   <img class="portfolio-image" src="https://picsum.photos/id/1015/350/250" alt="Modern Online Store">
                    <div class="portfolio-content">
                        <h3>Modern Online Store</h3>
                        <p>Complete e-commerce solution with custom features and seamless checkout experience.</p>
                    </div>
                </div>
                <div class="portfolio-item">
                    <div class="portfolio-image" style="background-image: url('https://picsum.photos/id/1016/350/250'); background-size: cover; background-position: center;">
                </div>
                    <div class="portfolio-content">
                        <h3>Analytics Platform</h3>
                        <p>Data visualization dashboard with real-time metrics and interactive charts.</p>
                    </div>
                </div>
                <div class="portfolio-item">
                    <div class="portfolio-image" style="background-image: url('https://picsum.photos/id/1018/350/250'); background-size: cover; background-position: center;">
                </div>
                    <div class="portfolio-content">
                        <h3>Fitness Tracking App</h3>
                        <p>Health and fitness application with personalized workout plans and progress tracking.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="testimonials">
        <div class="container">
            <div class="section-title">
                <h2>Client Testimonials</h2>
                <p>What our clients say about working with us</p>
            </div>
            <div class="testimonial-grid">
                <div class="testimonial-card">
                    <p class="testimonial-text">"The team at Nexus transformed our online presence completely. Our website now converts 40% better!"</p>
                    <div class="testimonial-author">
                        <div class="author-avatar"></div>
                        <div>
                            <h4>Sarah Johnson</h4>
                            <p>CEO, TechStart Inc.</p>
                        </div>
                    </div>
                </div>
                <div class="testimonial-card">
                    <p class="testimonial-text">"Professional, creative, and delivered on time. Couldn't ask for a better partner for our digital transformation."</p>
                    <div class="testimonial-author">
                        <div class="author-avatar"></div>
                        <div>
                            <h4>Michael Chen</h4>
                            <p>Marketing Director, InnovateCo</p>
                        </div>
                    </div>
                </div>
                <div class="testimonial-card">
                    <p class="testimonial-text">"Outstanding attention to detail and exceptional communication throughout the entire project."</p>
                    <div class="testimonial-author">
                        <div class="author-avatar"></div>
                        <div>
                            <h4>Emma Rodriguez</h4>
                            <p>Founder, CreativeMinds</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section id="contact" class="cta-section">
        <div class="container">
            <h2>Ready to Start Your Project?</h2>
            <p>Let's create something amazing together. Contact us today for a free consultation.</p>
            <a href="#contact" class="cta-button" style="background: white; color: #667eea; margin-top: 2rem;">Schedule a Call</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-column">
                    <h4>NEXUS</h4>
                    <p>Creating beautiful digital experiences that drive business growth and user engagement.</p>
                </div>
                <div class="footer-column">
                    <h4>Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#features">Services</a></li>
                        <li><a href="#portfolio">Portfolio</a></li>
                        <li><a href="#testimonials">Testimonials</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Contact</h4>
                    <ul class="footer-links">
                        <li>hello@nexusstudio.com</li>
                        <li>+1 (555) 123-4567</li>
                        <li>123 Creative St, San Francisco</li>
                    </ul>
                </div>
            </div>
            <div class="copyright">
                <p>&copy; 2024 Nexus Creative Studio. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;