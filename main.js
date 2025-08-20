// Importa as funções de animação da biblioteca Motion One.
import { scroll, animate } from "https://esm.sh/motion";

// Garante que todo o script só será executado após o carregamento completo da página.
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Animação de entrada para as seções ao rolar a página.
     * Isso resolve o problema do "texto invisível", fazendo o conteúdo aparecer suavemente.
     */
    document.querySelectorAll('.secao-conteudo:not(#home)').forEach((section) => {
        scroll(
            animate(section, {
                opacity: [0, 1],
                transform: ["translateY(50px)", "translateY(0px)"]
            }), {
                target: section,
                offset: ["start end", "center center"]
            }
        );
    });

    /**
     * Lógica para destacar o link de navegação da seção ativa (Scroll Spy).
     */
    function setupActiveSectionObserver() {
        // O seletor foi atualizado para incluir a seção #home, que está fora do container principal.
        const sections = document.querySelectorAll('#home, .secao-conteudo');
        const navLinks = document.querySelectorAll('.botoes-laterais__link');

        const observerOptions = {
            root: null,
            // A margem define uma "linha de ativação" a 40% do topo da tela.
            // Isso torna a troca de botão ativo mais precisa e natural.
            rootMargin: "-40% 0px -60% 0px",
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id; // Ex: "sobre-mim"
                    // Converte o ID da seção para o formato do href do link.
                    // Ex: "sobre-mim" -> "sobre_min_a"
                    const anchorId = `${sectionId.replace(/-/g, '_')}_a`;
                    const activeLink = document.querySelector(`.botoes-laterais__link[href="#${anchorId}"]`);

                    // Remove a classe ativa de todos os links para garantir que apenas um esteja ativo.
                    navLinks.forEach(link => link.classList.remove('botoes-laterais__link--active'));

                    // Adiciona a classe ativa ao link correto.
                    if (activeLink) {
                        activeLink.classList.add('botoes-laterais__link--active');
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => observer.observe(section));

        // Garante que o botão "Home" comece ativo no carregamento da página.
        const homeLink = document.querySelector('.botoes-laterais__link[href="#home_a"]');
        if (homeLink) {
            homeLink.classList.add('botoes-laterais__link--active');
        }

        // Adiciona um evento de clique para feedback instantâneo na navegação.
        // Isso resolve o delay percebido ao clicar em um botão.
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Remove a classe ativa de todos os outros links imediatamente.
                navLinks.forEach(otherLink => otherLink.classList.remove('botoes-laterais__link--active'));
                // Adiciona a classe ativa ao link clicado.
                this.classList.add('botoes-laterais__link--active');
            });
        });
    }

    /**
     * Lógica para a animação de digitação do nome na seção Home.
     */
    function setupTypingAnimation() {
        const spanTexto = document.querySelector(".texto-dinamico");
        // Se o elemento não existir, sai da função para evitar erros.
        if (!spanTexto) return;

        const nomes = ["Antonio Wildson", "Tony Brito"];
        const velocidadeEscrita = 120;
        const velocidadeApagar = 80;
        const tempoEspera = 2000;

        let indexNome = 0;
        let indexCaractere = 0;
        let apagando = false;

        function animarTexto() {
            // Garante que a função pare se o elemento for removido da página.
            if (!document.body.contains(spanTexto)) return;

            const nomeAtual = nomes[indexNome];

            if (!apagando) {
                spanTexto.textContent += nomeAtual.charAt(indexCaractere);
                indexCaractere++;

                if (indexCaractere === nomeAtual.length) {
                    apagando = true;
                    setTimeout(animarTexto, tempoEspera);
                    return;
                }
            } else {
                spanTexto.textContent = nomeAtual.substring(0, indexCaractere - 1);
                indexCaractere--;

                if (indexCaractere === 0) {
                    apagando = false;
                    indexNome = (indexNome + 1) % nomes.length; // Volta ao início da lista
                }
            }
            
            const velocidade = apagando ? velocidadeApagar : velocidadeEscrita;
            setTimeout(animarTexto, velocidade);
        }

        // Inicia a animação após um pequeno atraso.
        setTimeout(animarTexto, 500);
    }

    /**
     * Inicializa uma animação de partículas interativa com o mouse usando tsParticles.
     */
    function setupInteractiveParticles() {
        if (window.tsParticles) {
            tsParticles.load("tsparticles", {
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "grab", // Cria linhas entre o mouse e as partículas
                        },
                        onClick: {
                            enable: true,
                            mode: "push", // Adiciona novas partículas ao clicar
                        },
                        resize: true,
                    },
                    modes: {
                        grab: {
                            distance: 200,
                            links: {
                                opacity: 0.8, // Deixa a linha do "grab" bem visível
                                color: "#62ff00" // Cor de destaque para a linha
                            },
                        },
                        push: {
                            quantity: 4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#f6f6f6", // Partículas brancas para bom contraste
                    },
                    links: {
                        color: "#252d40", // Cor sutil para as ligações entre partículas
                        distance: 150,
                        enable: true,
                        opacity: 0.2,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: { default: "bounce" },
                        random: false,
                        speed: 1, // Movimento lento e sutil
                        straight: false,
                    },
                    number: { density: { enable: true, area: 800 }, value: 80 },
                    opacity: { value: 0.4 },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 3 } },
                },
                detectRetina: true,
            });
        }
    }

    /**
     * Lógica para o Carrossel de Certificados.
     */
    function setupCertificateCarousel() {
        const carousel = document.querySelector('.certificados-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.certificados-track');
        const cards = Array.from(track.children);
        const nextButton = carousel.querySelector('.next');
        const prevButton = carousel.querySelector('.prev');

        if (track.scrollWidth <= carousel.clientWidth) {
            if (nextButton) nextButton.style.display = 'none';
            if (prevButton) prevButton.style.display = 'none';
            return;
        }

        const originalCardCount = cards.length / 2;
        let currentIndex = 0;
        let isTransitioning = false;

        const getMoveDistance = () => {
            if (cards.length === 0) return 0;
            const cardWidth = cards[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(track).gap) || 20;
            return cardWidth + gap;
        };

        const moveTrack = () => {
            track.style.transform = `translateX(-${currentIndex * getMoveDistance()}px)`;
        };

        nextButton.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            track.style.transition = 'transform 0.5s ease-in-out';
            moveTrack();
        });

        prevButton.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;

            if (currentIndex === 0) {
                track.style.transition = 'none';
                currentIndex = originalCardCount;
                moveTrack();
                track.offsetHeight;
            }

            currentIndex--;
            track.style.transition = 'transform 0.5s ease-in-out';
            moveTrack();
        });

        track.addEventListener('transitionend', () => {
            isTransitioning = false;
            if (currentIndex >= originalCardCount) {
                track.style.transition = 'none';
                currentIndex = 0;
                moveTrack();
            }
        });

        const handleResize = () => {
            track.style.transition = 'none';
            currentIndex = 0;
            moveTrack();
        };

        setTimeout(handleResize, 100);
        window.addEventListener('resize', handleResize);
    }

    /**
     * Lógica para o Formulário de Contato.
     */
    function setupContactForm() {
        const form = document.getElementById('contact-form');
        const toast = document.getElementById('toast');

        if (!form || !toast) return;

        const showToast = (message) => {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        };

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const action = form.getAttribute('action');

            fetch(action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                showToast(response.ok ? 'Mensagem enviada com sucesso!' : 'Ocorreu um erro ao enviar.');
                if (response.ok) form.reset();
            }).catch(() => showToast('Ocorreu um erro ao enviar.'));
        });
    }

    // Inicializa todas as funcionalidades da página.
    setupTypingAnimation();
    setupInteractiveParticles();
    setupActiveSectionObserver();
    setupCertificateCarousel();
    setupContactForm();
});