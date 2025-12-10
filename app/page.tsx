const GOFUNDME_VIDEO = 'https://www.youtube.com/embed/Tuw8hxrFBH8'
const COOKING_VIDEO = 'https://www.youtube.com/embed/9QCKe-lQQOo'

export default function Home() {
  return (
    <main>
      <header className="hero" aria-labelledby="hero-title">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="pill">Dog food cooking show</span>
            <h1 id="hero-title">hotdogfatcat</h1>
            <p>
              Cozy recipes, wag-worthy broths, and heart-forward stories for pups
              and their humans. Tune in for comforting meals and help fund meals
              for refugee dogs along the way.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#gofundme">
                Support the dogs
              </a>
              <a className="btn btn-secondary" href="#episodes">
                Watch the kitchen
              </a>
            </div>
          </div>

          <div className="hero-image" aria-hidden>
            <img
              src="/logo_hotdogfatcat.svg"
              alt="hotdogfatcat logo"
            />
          </div>
        </div>
      </header>

      <section id="gofundme" className="card" aria-labelledby="gofundme-title">
        <div className="section-heading">
          <div>
            <span className="pill">Gofundme for refugee pups</span>
            <h2 id="gofundme-title">Every bowl helps a tail</h2>
          </div>
          <p>
            Join our mission to keep refugee dogs fed, safe, and loved. We cook,
            we share, and we channel every episode into direct support for pups
            who need a meal. Donations go to street dogs and shelters in Montenegro.
          </p>
        </div>
        <div className="video-shell" role="group" aria-label="Gofundme story video">
          <iframe
            src={GOFUNDME_VIDEO}
            title="Gofundme for dog refugee"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="feature-grid">
          <div className="feature">
            <span className="dot" aria-hidden />
            <div>Nutritious, chef-crafted broths made fresh on the show.</div>
          </div>
          <div className="feature">
            <span className="dot" aria-hidden />
            <div>100% of donations route to verified refugee dog shelters.</div>
          </div>
          <div className="feature">
            <span className="dot" aria-hidden />
            <div>Monthly transparency reports and behind-the-scenes kitchen cams.</div>
          </div>
        </div>
      </section>

      <section id="episodes" className="card" aria-labelledby="episodes-title">
        <div className="section-heading">
          <div>
            <span className="pill">Fresh from the kitchen</span>
            <h2 id="episodes-title">Cook along with the pack</h2>
          </div>
          <p>
            Slow simmers, crunchy toppers, and nutritionally balanced bowls. Bring
            your pup to the screen and cook together.
          </p>
        </div>
        <div className="video-shell" role="group" aria-label="Cooking episode video">
          <iframe
            src={COOKING_VIDEO}
            title="Cooking episode - hotdogfatcat"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="feature-grid">
          <div className="feature">
            <span className="dot" aria-hidden />
            <div>Step-by-step ingredients you already have in your pantry.</div>
          </div>
          <div className="feature">
            <span className="dot" aria-hidden />
            <div>Vet-advised portions for big dogs, small dogs, and seniors.</div>
          </div>
          <div className="feature">
            <span className="dot" aria-hidden />
            <div>Kid-and-cat friendly kitchen tips—because the whole crew helps.</div>
          </div>
        </div>
      </section>

      <footer className="footer">
        Questions or partnerships?{' '}
        <a href="mailto:contact@hotdogfatcat.com">contact@hotdogfatcat.com</a>
      </footer>
    </main>
  )
}

