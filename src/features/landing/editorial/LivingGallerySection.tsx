import { Link } from "react-router-dom";

/** Approved-stage profiles only; never substitute unapproved legacy nominee records. */
export function LivingGallerySection() {
  return (
    <section className="ed-section" aria-labelledby="ed-living-gallery-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">Authorised profiles and controlled review status</div>
          <h2 id="ed-living-gallery-heading" className="ed-section-title">Meet Africa&apos;s Education Enablers</h2>
          <p className="ed-section-sub">Profiles appear only at the approved publication stage, subject to consent, evidence and publication controls.</p>
          <p className="ed-section-sub">No approved homepage profiles are currently published. Browse the directory for authorised information and review status.</p>
        </div>
        <div className="text-center"><Link to="/nominees" className="ed-btn-primary">Browse Nominees</Link></div>
      </div>
    </section>
  );
}

export default LivingGallerySection;
