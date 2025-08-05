document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    fetchJSON("carta.json").then(renderData).catch(console.error);
});

/* ============================
   Inicialización de AOS
============================ */
const initAOS = () => {
    AOS.init();
    if (window.innerWidth < 1024) {
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.removeAttribute('data-aos');
            el.removeAttribute('data-aos-duration');
        });
    }
};

/* ============================
   Fetch genérico
============================ */
const fetchJSON = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
};

/* ============================
   Render de datos
============================ */
const renderData = ({ project, course_taken, course_taught, titles, conferences }) => {
    appendElements('.tarjetas-container-projects', project, createTarjeta);
    appendElements('.tarjetas-container-coursetaken', course_taken, createFlipCard);
    appendElements('.tarjetas-container-coursetaught', course_taught, createFlipCard);
    appendElements('.tarjetas-container-titles', titles, ({ image_url }) => {
        const img = createEl('img', { loading: 'lazy', src: image_url });
        return img;
    });
    renderConferences(conferences, '.tarjetas-container-conferences');
    initSlickSliders();
};

/* ============================
   Helpers DOM
============================ */
const createEl = (tag, attrs = {}, ...children) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
        if (key in el) el[key] = value;
        else el.setAttribute(key, value);
    });
    el.append(...children.filter(Boolean));
    return el;
};

const appendElements = (selector, data, creator) => {
    const container = document.querySelector(selector);
    if (container && data?.length) {
        data.forEach(item => container.appendChild(creator(item)));
    }
};

/* ============================
   Tarjetas y Flip Cards
============================ */
const createTarjeta = ({ url, ruta, nombre }) => createEl(
    'div',
    { className: 'tarjeta', dataset: { url } },
    createEl('div', { className: 'tarjeta-luz' }),
    createEl('div', { className: 'tarjeta-punto' }),
    createEl('img', { src: ruta, alt: nombre }),
    createEl('button', { className: 'tarjeta-nombre', textContent: nombre, onclick: () => window.location.href = url })
);

const createFlipCard = ({ imagen, id, description, url }) => {
    const flipCard = createEl('div', { className: 'flip-card' });

    const cardFront = createEl('div', { className: 'flip-card-front' },
        createEl('img', { loading: 'lazy', src: imagen })
    );

    const flipCardLeft = createEl('div', { className: 'flip-card-left' },
        createEl('h3', { textContent: id })
    );

    const descHTML = `${sanitizeHTML(description)}${url?.trim() ? ` <a href="${url}" target="_blank">here</a>.` : ''}`;
    const flipCardRight = createEl('div', { className: 'flip-card-right' },
        createEl('p', { innerHTML: descHTML })
    );

    const cardBack = createEl('div', { className: 'flip-card-back' }, flipCardLeft, flipCardRight);

    const cardInner = createEl('div', { className: 'flip-card-inner' }, cardFront, cardBack);
    flipCard.appendChild(cardInner);

    if (window.matchMedia('(hover: none)').matches) {
        flipCard.addEventListener('click', () => flipCard.classList.toggle('flipped'));
    }
    return flipCard;
};

/* ============================
   Conferencias
============================ */
const renderConferences = (conferences, selector) => {
    const container = document.querySelector(selector);
    if (!container || !conferences?.length) return;

    const years = [...new Set(conferences.map(c => c.year))].sort();

    const timeline = createEl('div', { className: 'timeline-line' });
    const conferencesContainer = createEl('div', { className: 'conferences-container' });

    container.append(timeline, conferencesContainer);

    years.forEach(year => {
        const pointContainer = createTimelinePoint(year, () => {
            setActiveYear(year);
            showConferenceCarousel(year, conferences, conferencesContainer);
        });
        timeline.appendChild(pointContainer);
    });
};

const createTimelinePoint = (year, onClick) => createEl(
    'div', { className: 'timeline-item' },
    createEl('div', { className: 'timeline-point', onclick: onClick }),
    createEl('div', { className: 'timeline-label', textContent: year, onclick: onClick })
);

const showConferenceCarousel = (year, conferences, container) => {
    const carouselContainer = createEl('div', { className: 'conference-carousel-container' });
    container.innerHTML = '';

    conferences.filter(c => c.year === year).forEach(({ name, place, issue, participation, url }) => {
        const detailsHTML = `
            <strong>Place:</strong> ${place}<br>
            <strong>Category:</strong> ${issue}<br>
            <strong>Participation:</strong> ${participation}<br>
        `;
        const details = createEl('p', { className: 'conference-details', innerHTML: detailsHTML });

        if (url) {
            details.appendChild(createEl('a', { href: url, target: '_blank', className: 'conference-link', textContent: 'View my participation' }));
        }

        const item = createEl('div', { className: 'conference-item' },
            createEl('h3', { className: 'conference-title', textContent: name }),
            details
        );

        carouselContainer.appendChild(createEl('div', { className: 'slide-container' }, item));
    });

    container.appendChild(carouselContainer);
    $(carouselContainer).slick({ slidesToShow: 1, arrows: true });
    adjustGlobalSlideHeights();
};

/* ============================
   Utilidades
============================ */
const sanitizeHTML = (str) => {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

const adjustGlobalSlideHeights = () => {
    let maxHeight = 0;
    $('.conference-carousel-container .conference-item').each(function () {
        maxHeight = Math.max(maxHeight, $(this).outerHeight(true));
    });
    $('.conference-carousel-container .conference-item').css('min-height', `${maxHeight}px`);
};

const setActiveYear = (year) => {
    document.querySelectorAll('.timeline-point, .timeline-label').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.timeline-label')
        .forEach(label => label.textContent === String(year) && label.classList.add('active'));
};

/* ============================
   Sliders
============================ */
const initSlickSliders = () => {
    imagesLoaded(
        document.querySelectorAll(
            '.tarjetas-container-projects, .tarjetas-container-coursetaken, .tarjetas-container-coursetaught, .tarjetas-container-titles'
        ),
        () => $('.tarjetas-container-projects, .tarjetas-container-coursetaken, .tarjetas-container-coursetaught, .tarjetas-container-titles').slick('setPosition')
    );

    $('.tarjetas-container-projects').slick({
        slidesToShow: 3, slidesToScroll: 3, arrows: true, dots: true, infinite: false,
        responsive: [
            { breakpoint: 1050, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    });

    $('.tarjetas-container-coursetaken, .tarjetas-container-coursetaught').slick({
        vertical: true, slidesToShow: 1, slidesToScroll: 1, arrows: false, infinite: false, verticalSwiping: true, adaptiveHeight: true
    }).on('afterChange', (_, slick, currentSlide) => {
        slick.$slider.slick('setPosition');
        slick.$list.height(slick.$slides.eq(currentSlide).outerHeight(true));
    });

    $('.tarjetas-container-titles').slick({ slidesToShow: 1, arrows: true, dots: false });
};
