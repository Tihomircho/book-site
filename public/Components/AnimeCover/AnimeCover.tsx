<div className="col-lg-5 d-flex justify-content-center">
  {/* Главен контейнер за книгата */}
  <div
    className="position-relative shadow-lg overflow-hidden"
    style={{
      maxWidth: "360px",
      borderRadius: "12px",
      aspectRatio: "3/4",
      width: "100%",
      backgroundColor: "#000", // Черна основа при зареждане
    }}
  >
    {/* 1. БАЗОВО ИЗОБРАЖЕНИЕ: Чистото лице (зарежда се веднага) */}
    <img
      src="/clean-face.png"
      alt="Келеш - Лице"
      className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
      style={{ zIndex: 1 }}
    />

    {/* 2. АНИМИРАНО ИЗОБРАЖЕНИЕ: Оригиналната корица с черепа */}
    <img
      src="/full-cover.png"
      alt="Келеш - Череп"
      className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
      style={{
        zIndex: 2,
        animation: "revealSkull 2.5s ease-in-out forwards",
        animationDelay: "0.5s", // Изчаква половин секунда преди да започне
      }}
    />

    {/* Специфичен CSS за анимацията (вграден за улеснение) */}
    <style jsx>{`
      @keyframes revealSkull {
        from {
          opacity: 0;
          filter: brightness(1.2); /* Леко светване в началото за драматизъм */
        }
        to {
          opacity: 1;
          filter: brightness(1);
        }
      }
    `}</style>
  </div>
</div>;
