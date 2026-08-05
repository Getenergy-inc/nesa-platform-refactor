import { Link } from "react-router-dom";
import { getFeaturedImages } from "@/data/gallery";

export function GallerySection() {
  const images = getFeaturedImages().slice(0, 3);
  if (images.length === 0) return null;

  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-gallery-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">Moments from NESA-Africa 2025</div>
          <h2 id="ed-gallery-heading" className="ed-section-title">
            A Continent in Recognition
          </h2>
          <p className="ed-section-sub">
            The stages, stories and standing ovations that set the scene for the Blue-Garnet Awards
            Gala on 14 December 2026 in Lagos.
          </p>
        </div>

        <div className="ed-gallery-grid">
          {images.map((img) => (
            <Link key={img.id} to={`/gallery/${img.collection}`} className="ed-gallery-item">
              <img src={img.src} alt={img.alt} loading="lazy" />
              <div className="ed-gallery-caption">
                <div className="ed-gallery-year">2025</div>
                <div className="ed-gallery-title">{img.title}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <Link to="/gallery" className="ed-btn-small">
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
