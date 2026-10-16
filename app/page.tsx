"use client"; // 1. Казваме на Next.js, че това е Client Component

import React, { useState, useEffect } from "react";
import Script from "next/script";
import emailjs from "@emailjs/browser";

// Премахнахме отделната async функция getCurrentYear, за да не чупим пререндеринга

export default function BookLandingPage() {
  // 2. ПРЕМАХНАТО е "async" оттук!

  // Състояние за годината на копирайта
  const [currentYear, setCurrentYear] = useState(2026); // базова стойност

  // Състояние за формата
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    courier: "",
    office_name: "",
    office_code: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Инициализация на EmailJS и безопасно взимане на текущата година в браузъра
  useEffect(() => {
    // Инициализираме EmailJS
    emailjs.init("ВАШИЯ_EMAILJS_PUBLIC_KEY");

    // Взимаме годината безопасно на клиента, без да застрашаваме Prerendering-а на Next.js
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Слушател за уиджета на Спиди (извлича данните от iframe)
  useEffect(() => {
    const handleSpeedyMessage = (event: MessageEvent) => {
      if (event.origin.includes("speedy.bg") && event.data) {
        try {
          const officeData =
            typeof event.data === "string"
              ? JSON.parse(event.data)
              : event.data;
          if (officeData && officeData.id) {
            setFormData((prev) => ({
              ...prev,
              office_name: `Офис Спиди: ${officeData.name || officeData.address?.fullAddress}`,
              office_code: officeData.id.toString(),
            }));
            setStatusMsg("Успешно избран офис на Спиди!");
          }
        } catch (e) {
          // Игнорираме грешни съобщения
        }
      }
    };

    window.addEventListener("message", handleSpeedyMessage);
    return () => window.removeEventListener("message", handleSpeedyMessage);
  }, []);

  // Функция за отваряне на уиджета на Еконт
  const openEcontMap = () => {
    if (typeof window !== "undefined" && (window as any).EcontDeliveryWizard) {
      (window as any).EcontDeliveryWizard.open({
        clientCode: "",
        onSelect: (responseData: any) => {
          if (responseData && responseData.office) {
            setFormData((prev) => ({
              ...prev,
              office_name: `Офис Еконт: ${responseData.office.name}, ${responseData.office.city.name}`,
              office_code: responseData.office.code.toString(),
            }));
            setStatusMsg("Успешно избран офис на Еконт!");
          }
        },
      });
    } else {
      alert("Уиджети на Еконт се зарежда... Моля, опитайте пак след секунда.");
    }
  };

  // Изпращане на формата през EmailJS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.office_name) {
      alert("Моля, изберете офис на Еконт или Спиди от бутоните!");
      return;
    }

    setLoading(true);
    try {
      await emailjs.send("ВАШИЯ_SERVICE_ID", "ВАШИЯ_TEMPLATE_ID", formData);
      setStatusMsg(
        "Поръчката ви е приета успешно! Ще се свържем с вас за потвърждение.",
      );
      setFormData({
        name: "",
        phone: "",
        courier: "",
        office_name: "",
        office_code: "",
      });
    } catch (error) {
      console.error(error);
      setStatusMsg(
        "Възникна грешка при изпращането. Моля, опитайте по телефона.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-light min-vh-screen">
      {/* 1. НАВИГАЦИЯ */}
      <header className="navbar navbar-expand-md navbar-dark bg-dark bg-opacity-75 border-bottom border-secondary sticky-top backdrop-blur">
        <div className="container py-2">
          <a
            className="navbar-brand fw-bold text-danger tracking-wider text-uppercase"
            href="#"
          >
            Мариян Маринов
          </a>
          <div className="d-flex align-items-center gap-3">
            <nav className="d-none d-md-flex gap-4 me-3">
              <a
                href="#about-book"
                className="text-decoration-none text-secondary hover-text-white transition"
              >
                За книгата
              </a>
              <a
                href="#about-author"
                className="text-decoration-none text-secondary hover-text-white transition"
              >
                За автора
              </a>
              <a
                href="#quotes"
                className="text-decoration-none text-secondary hover-text-white transition"
              >
                Цитати
              </a>
            </nav>
            <a
              href="#buy-now"
              className="btn btn-danger btn-sm fw-bold px-4 py-2 text-uppercase"
            >
              Купи Сега
            </a>
          </div>
        </div>
      </header>

      {/* 2. ГЛАВНА СЕКЦИЯ (HERO) */}
      <section className="container py-5 my-5">
        <div className="row align-items-center g-5">
          {/* Текст */}
          <div className="col-lg-7 text-center text-lg-start">
            <span className="badge bg-danger text-uppercase mb-3 px-3 py-2 tracking-wider">
              Автобиографичен роман
            </span>
            <h1 className="display-3 fw-black text-white text-uppercase tracking-tight mb-3">
              КЕЛЕШ
            </h1>
            <p
              className="lead text-secondary mb-4 fs-4"
              style={{ maxWidth: "600px" }}
            >
              „Мислиш, че животът ти е труден? Прочети моята история.“ 一 Една
              брутално откровена изповед за паданията, поуките и новото начало.
            </p>
            <div className="d-flex flex-col flex-sm-row justify-content-center justify-content-lg-start gap-3 pt-2">
              <a
                href="#buy-now"
                className="btn btn-danger btn-lg fw-bold px-5 py-3 text-uppercase shadow"
              >
                Поръчай книгата
              </a>
              <a
                href="#about-book"
                className="btn btn-outline-light btn-lg px-5 py-3 text-uppercase"
              >
                Запознай се с историята
              </a>
            </div>
          </div>

          {/* Визуализация на Корицата */}
          <div className="col-lg-5 d-flex justify-content-center">
            <div
              className="card bg-dark border-secondary shadow-lg overflow-hidden"
              style={{ maxWidth: "360px", borderRadius: "12px" }}
            >
              {/* Понеже все още нямате файл, тук слагаме временен контейнер с цвят, напомнящ корицата */}
              <div
                className="bg-gradient text-center d-flex flex-column justify-content-center align-items-center text-muted border-start border-dark"
                style={{
                  aspectRatio: "3/4",
                  width: "340px",
                  background:
                    "linear-gradient(135deg, #1c0505 0%, #080808 100%)",
                  boxShadow: "inset -10px 0px 30px rgba(0,0,0,0.8)",
                }}
              >
                <span className="text-white-50 fw-bold tracking-widest text-uppercase">
                  Корица: КЕЛЕШ
                </span>
                <small className="text-danger mt-2">
                  <img
                    src="/assets/cover-jivota-na-edin-kelesh.png"
                    alt="Корица на книгата"
                    className="img-fluid"
                  />
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ОКОЛО КНИГАТА / АКЦЕНТИ */}
      <section
        id="about-book"
        className="bg-dark bg-opacity-50 border-top border-bottom border-secondary py-5"
      >
        <div className="container py-4">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <h2 className="fw-bold text-white text-uppercase">
              Падането не е краят
            </h2>
            <p className="text-secondary">
              Някои хора пишат книги, за да разкажат история. Аз написах своята,
              защото имах нужда да я оставя някъде.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                title: "Реалност",
                desc: "Без спестени истини и без фалшив героизъм. Историята на един човек, преминал през истинските предизвикателства на живота.",
              },
              {
                title: "Поука",
                desc: "Ако книгата ми вече е в ръцете ти и имаш какво да добавиш – давай. Продължаваме напред заедно.",
              },
              {
                title: "Трансформация",
                desc: "Няма да ти казвам, че тази книга ще ти промени живота. Прочети я и реши сам за себе си.",
              },
            ].map((item, i) => (
              <div key={i} className="col-md-4">
                <div className="card bg-dark border-secondary h-100 p-4">
                  <div className="text-danger fw-bold fs-3 mb-2">0{i + 1}</div>
                  <h4 className="text-white fw-bold mb-3">{item.title}</h4>
                  <p className="text-secondary small lh-base mb-0">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ЦИТАТИ ОТ КНИГАТА (ОТ ГЪРБА НА КОРИЦАТА) */}
      <section id="quotes" className="container py-5 my-5">
        <h2 className="text-center fw-bold text-white text-uppercase mb-5 tracking-wide">
          Мисли от книгата
        </h2>
        <div className="row g-4 justify-content-center">
          <div className="col-md-8">
            <div className="border-start border-danger border-4 ps-4 py-2 mb-4 bg-dark bg-opacity-20 rounded-end">
              <p className="fst-italic text-light fs-5 mb-0">
                „Някои истории е по-добре да останат забравени. Аз реших да не
                забравям своята.“
              </p>
            </div>
            <div className="border-start border-danger border-4 ps-4 py-2 bg-dark bg-opacity-20 rounded-end">
              <p className="fst-italic text-light fs-5 mb-0">
                „Не търси герой в тази книга. Ще намериш един келеш.“
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ФОРМА ЗА ПОКУПКА */}
      <section
        id="buy-now"
        className="bg-dark bg-opacity-50 border-top border-secondary py-5 text-center"
      >
        <div className="container py-4">
          <h2 className="fw-extrabold text-white text-uppercase mb-3">
            Вземи своето копие
          </h2>
          <p
            className="text-secondary mx-auto mb-5"
            style={{ maxWidth: "500px" }}
          >
            Поръчайте директно от автора чрез Еконт или Спиди с преглед преди
            плащане.
          </p>

          <div
            className="card bg-black border-danger mx-auto p-4 p-sm-5 shadow-lg"
            style={{ maxWidth: "550px", borderRadius: "16px" }}
          >
            <div className="text-muted text-decoration-through small mb-1">
              Стара цена: 25.00 лв.
            </div>
            <div className="display-6 fw-black text-danger mb-4">19.90 лв.</div>

            <form onSubmit={handleSubmit} className="text-start">
              <div className="mb-3">
                <label className="form-label text-secondary small">
                  Име и Фамилия
                </label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="Иван Иванов"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">
                  Телефон за връзка
                </label>
                <input
                  type="tel"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="0888 XXXXXX"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small">
                  Изберете начин на доставка
                </label>
                <div className="d-flex gap-2 mb-3">
                  <button
                    type="button"
                    className={`btn flex-fill fw-bold py-2 ${formData.courier === "Econt" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        courier: "Econt",
                        office_name: "",
                        office_code: "",
                      });
                      openEcontMap();
                    }}
                  >
                    🔵 Избери офис на Еконт
                  </button>
                  <button
                    type="button"
                    className={`btn flex-fill fw-bold py-2 ${formData.courier === "Speedy" ? "btn-light" : "btn-outline-light"}`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        courier: "Speedy",
                        office_name: "",
                        office_code: "",
                      })
                    }
                  >
                    🟢 Избери офис на Спиди
                  </button>
                </div>

                {/* Интерактивно вграждане на картата на Спиди, само ако е избрана */}
                {formData.courier === "Speedy" && !formData.office_name && (
                  <div
                    className="border border-secondary rounded overflow-hidden mb-3"
                    style={{ height: "400px" }}
                  >
                    <iframe
                      id="frameOfficeLocator"
                      name="frameOfficeLocator"
                      src="https://speedy.bg този офис&mapControl=1"
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                    ></iframe>
                  </div>
                )}

                {/* Поле, показващо избрания офис */}
                {formData.office_name && (
                  <div className="alert alert-success border-0 bg-success bg-opacity-20 text-success p-3 rounded mb-3">
                    <strong className="d-block text-white">
                      Място за доставка:
                    </strong>
                    {formData.office_name}{" "}
                    <span className="badge bg-dark text-success ms-1">
                      ID: {formData.office_code}
                    </span>
                  </div>
                )}
              </div>

              {statusMsg && (
                <div className="alert alert-info bg-dark border-secondary text-info text-center small py-2 mb-3">
                  {statusMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-danger btn-lg w-100 fw-bold text-uppercase py-3"
              >
                {loading ? "Изпраща се..." : "Потвърди поръчката"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-4 text-center text-secondary small border-top border-secondary bg-black">
        <p className="mb-0">
          © {currentYear} КЕЛЕШ - Мариян Маринов. Всички права запазени.
        </p>
      </footer>
    </div>
  );
}
