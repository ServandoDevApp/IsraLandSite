document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // CONFIGURACION DE GOOGLE FORMS
    // ============================================
    // INSTRUCCIONES PARA CONECTAR CON GOOGLE FORMS:
    //
    // 1. Crea un Google Forms con estos campos (en orden recomendado):
    //    - Nombre completo (Respuesta corta)
    //    - Correo electronico (Respuesta corta)
    //    - Telefono (Respuesta corta)
    //    - Tipo de propiedad (Opcion multiple: Casa, Apartamento, Oficina, Edificio, Local Comercial)
    //    - Fecha tentativa de entrega (Fecha)
    //    - Mensaje adicional (Parrafo)
    //
    // 2. En tu Google Forms, haz clic en los 3 puntos (⋯) arriba a la derecha
    // 3. Selecciona "Obtener enlace prellenado"
    // 4. Llena los campos con datos de ejemplo y haz clic en "Obtener enlace"
    // 5. Copia la URL. Tendra este formato:
    //    https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.123456789=Ejemplo&entry.987654321=Otro
    //
    // 6. Extrae los numeros despues de "entry." para cada campo y pegalos abajo
    //
    // ============================================
    // EJEMPLO (reemplaza con tus valores reales):
    // ============================================
    // const GOOGLE_FORM_BASE_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSxxxxxx/viewform';
    // const GOOGLE_FORM_ENTRIES = {
    //     nombre: 'entry.1234567890',
    //     email: 'entry.0987654321',
    //     telefono: 'entry.1122334455',
    //     tipo: 'entry.5566778899',
    //     fecha: 'entry.9988776655',
    //     mensaje: 'entry.1029384756'
    // };
    // ============================================

    const GOOGLE_FORM_CONFIG = {
        // PEGA AQUI LA URL BASE DE TU GOOGLE FORM (sin parametros)
        // Ejemplo: 'https://docs.google.com/forms/d/e/1FAIpQLSdXXXXXXXXX/viewform'
        baseUrl: '',

        // PEGA AQUI LOS ENTRY IDs DE CADA CAMPO (los numeros despues de "entry.")
        entries: {
            nombre: '',
            email: '',
            telefono: '',
            tipo: '',
            fecha: '',
            mensaje: ''
        }
    };

    // ============================================
    // FIN CONFIGURACION
    // ============================================

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = navLinks.querySelectorAll('a');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            };

            updateCount();
        });

        statsAnimated = true;
    }

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.info-card, .contacto-form-wrapper, .nosotros-text, .nosotros-image');
    
    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('active');
            }
        });

        // Check if stats are visible
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            const statsTop = statsSection.getBoundingClientRect().top;
            if (statsTop < triggerBottom) {
                animateStats();
            }
        }

        const procesoSection = document.querySelector('.proceso');
        if (procesoSection && procesoSection.getBoundingClientRect().top < triggerBottom) {
            procesoSection.classList.add('process-active');
        }
    }

    // Add reveal class to elements
    revealElements.forEach(element => {
        element.classList.add('reveal');
    });

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Check on load

    // Form submission - Integracion con Google Forms
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener datos del formulario
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Verificar si Google Forms esta configurado
        const isConfigured = GOOGLE_FORM_CONFIG.baseUrl && GOOGLE_FORM_CONFIG.entries.nombre;

        if (!isConfigured) {
            // Si no esta configurado, mostrar instrucciones
            alert('ATENCION: El formulario de Google Forms aun no esta configurado.\n\n' +
                  'Sigue las instrucciones en el archivo js/main.js (lineas 1-40) ' +
                  'para conectar tu Google Forms.');
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Requiere Configuracion';
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
            }, 3000);
            return;
        }

        // Construir URL prellenada de Google Forms
        const params = new URLSearchParams();
        params.append('usp', 'pp_url');

        // Mapear cada campo al entry ID correspondiente
        if (data.nombre && GOOGLE_FORM_CONFIG.entries.nombre) {
            params.append(GOOGLE_FORM_CONFIG.entries.nombre, data.nombre);
        }
        if (data.email && GOOGLE_FORM_CONFIG.entries.email) {
            params.append(GOOGLE_FORM_CONFIG.entries.email, data.email);
        }
        if (data.telefono && GOOGLE_FORM_CONFIG.entries.telefono) {
            params.append(GOOGLE_FORM_CONFIG.entries.telefono, data.telefono);
        }
        if (data.tipo && GOOGLE_FORM_CONFIG.entries.tipo) {
            params.append(GOOGLE_FORM_CONFIG.entries.tipo, data.tipo);
        }
        if (data.fecha && GOOGLE_FORM_CONFIG.entries.fecha) {
            params.append(GOOGLE_FORM_CONFIG.entries.fecha, data.fecha);
        }
        if (data.mensaje && GOOGLE_FORM_CONFIG.entries.mensaje) {
            params.append(GOOGLE_FORM_CONFIG.entries.mensaje, data.mensaje);
        }

        const finalUrl = GOOGLE_FORM_CONFIG.baseUrl + '?' + params.toString();

        // Animacion de carga
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Abriendo Google Forms...';
        submitBtn.disabled = true;

        // Pequena pausa para que se vea la animacion
        setTimeout(() => {
            // Abrir Google Forms en nueva pestana con los datos prellenados
            window.open(finalUrl, '_blank');

            // Mostrar mensaje de exito
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Google Forms Abierto';
            submitBtn.style.background = 'var(--color-success)';

            // Restaurar boton despues de unos segundos
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 4000);
        }, 800);
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Parallax effect for hero shapes
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
});
