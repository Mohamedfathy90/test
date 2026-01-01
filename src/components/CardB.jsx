import React from 'react';

const brands = [
  {
    id: "65c8fd5190e8294d49e7164b",
    name: "de Marly",
    slug: "de-marly",
    image: "brand-22184013-f7df-409b-8795-cce7eaf220ab-1743063081443.jpeg"
  },
  {
    id: "65d2317204b09b66c6116ef7",
    name: "Dior",
    slug: "dior",
    image: "brand-54a040e3-ef49-46a0-8ac1-f5ffba29c157-1743310290105.jpeg"
  },
];

const CardB = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        {brands.map((brand) => (
          <div className="col-md-4 mb-4" key={brand.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={`path-to-images/${brand.image}`}
                className="card-img-top"
                alt={brand.name}
                style={{ objectFit: 'cover', height: '250px' }}
              />
              <div className="card-body">
                <h5 className="card-title">{brand.name}</h5>
                <p className="card-text text-muted">Slug: {brand.slug}</p>
                <a href={`/brand/${brand.slug}`} className="btn btn-primary">عرض التفاصيل</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardB;
