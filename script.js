// Configuração para habilitar o dark mode via classe no HTML e definir cores
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Paleta CMYK como cores principais
                'cyan-print': '#00AEEF', 
                'magenta-print': '#EC008C',
                'yellow-print': '#FFF200',
                'black-print': '#231F20', // Um preto suave
            }
        }
    }
};

// Script JavaScript embutido (extraído)
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO TEMA (DARK MODE) ---
    const themeToggleBtns = [ document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile') ];
    const themeToggleDarkIcons = [ document.getElementById('theme-toggle-dark-icon'), document.getElementById('theme-toggle-dark-icon-mobile') ];
    const themeToggleLightIcons = [ document.getElementById('theme-toggle-light-icon'), document.getElementById('theme-toggle-light-icon-mobile') ];

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            themeToggleLightIcons.forEach(icon => icon.classList.remove('hidden'));
            themeToggleDarkIcons.forEach(icon => icon.classList.add('hidden'));
        } else {
            document.documentElement.classList.remove('dark');
            themeToggleDarkIcons.forEach(icon => icon.classList.remove('hidden'));
            themeToggleLightIcons.forEach(icon => icon.classList.add('hidden'));
        }
    };
    
    // Alterado para verificar se prefere claro, senão, default é dark
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
         applyTheme('light');
    } else {
         applyTheme('dark');
    }


    themeToggleBtns.forEach(btn => {
        if(btn) {
            btn.addEventListener('click', () => {
                const isDark = document.documentElement.classList.contains('dark');
                if (isDark) {
                    applyTheme('light');
                    localStorage.setItem('theme', 'light');
                } else {
                    applyTheme('dark');
                    localStorage.setItem('theme', 'dark');
                }
            });
        }
    });
    
    // --- LÓGICA DA NAVEGAÇÃO ATIVA ---
    const allNavLinks = document.querySelectorAll('header a'); 
    const navLinksForObserver = document.querySelectorAll('nav a.nav-link');
    const sections = document.querySelectorAll('main section');

    function updateActiveLink(targetId) {
        navLinksForObserver.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                updateActiveLink(targetId); // CORRIGIDO: Removido o delay
            }
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = '#' + entry.target.getAttribute('id');
                updateActiveLink(id);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
    
    // --- LÓGICA DO MENU MOBILE ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.nav-mobile-link');

    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    mobileLinks.forEach(link => link.addEventListener('click', () => mobileMenu.classList.add('hidden')));

    // --- LÓGICA DA MÁSCARA DE TELEFONE ---
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
            value = value.substring(0, 11); // Limita a 11 dígitos (DDD + 9 dígitos)

            if (value.length > 10) {
                // Formato (XX) XXXXX-XXXX para celulares com 9 dígitos
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (value.length > 6) {
                // Formato (XX) XXXX-XXXX para telefones fixos ou celulares antigos
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                // Formato (XX) XXXX...
                value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
            } else if (value.length > 0) {
                // Formato (XX...
                value = value.replace(/^(\d{0,2}).*/, '($1');
            }
            e.target.value = value;
        });
    }

    // --- LÓGICA DO MODAL DO PORTFÓLIO (Removida) ---
    /*
    const portfolioModal = document.getElementById('portfolio-modal');
    if (portfolioModal) {
        const portfolioItems = document.querySelectorAll('.group[data-src]'); // Seleciona os divs com data-src
        const modalImg = document.getElementById('modal-img');
        const closeModalBtn = document.getElementById('modal-close-btn');

        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.getAttribute('data-src'); // Pega o link do data-src
                modalImg.setAttribute('src', imgSrc);
                portfolioModal.classList.remove('hidden');
                portfolioModal.classList.add('flex'); // Usa flex para centralizar
            });
        });

        const closeModal = () => {
            portfolioModal.classList.add('hidden');
            portfolioModal.classList.remove('flex');
        };

        closeModalBtn.addEventListener('click', closeModal);
        portfolioModal.addEventListener('click', (e) => {
            if (e.target === portfolioModal) {
                closeModal();
            }
        });
    }
    */

    // --- LÓGICA DO FORMULÁRIO DE ORÇAMENTO ---
    const formOrcamento = document.getElementById('form-orcamento');
    const formFeedback = document.getElementById('form-feedback');
    const submitButton = document.getElementById('submit-button');
    const btnText = submitButton.querySelector('.btn-text');
    const btnSpinner = submitButton.querySelector('.btn-spinner');
    const fileInput = document.getElementById('arquivo');
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzO268ANkoglpWxJbE_-EzVPn41PoYHah__5K4W1qui3slhpO2wEfC9tGVCZlgfDKhT/exec';

    formOrcamento.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        formOrcamento.querySelectorAll('.error-message').forEach(el => el.classList.add('hidden'));
        formOrcamento.querySelectorAll('.form-input').forEach(el => el.classList.remove('invalid-input'));
        formFeedback.innerHTML = '';

        // A 'descricao' foi removida dos campos obrigatórios
        const requiredFields = ['nome', 'email', 'telefone', 'servico'];
        requiredFields.forEach(id => {
            const input = document.getElementById(id);
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid-input');
                errorMsg.textContent = "Este campo é obrigatório.";
                errorMsg.classList.remove('hidden');
            }
        });
        
        const emailInput = document.getElementById('email');
        if (emailInput.value && !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
            isValid = false;
            const errorMsg = emailInput.parentElement.querySelector('.error-message');
            emailInput.classList.add('invalid-input');
            errorMsg.textContent = "Por favor, insira um e-mail válido.";
            errorMsg.classList.remove('hidden');
        }

        if (!isValid) {
             formFeedback.innerHTML = '<p class="text-red-500">Por favor, corrija os campos marcados em vermelho.</p>';
             return;
        }
        
        submitButton.disabled = true;
        btnText.classList.add('hidden'); // Esconde o texto
        btnSpinner.classList.remove('hidden'); // Mostra SÓ o spinner
        
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => sendData({ base64: e.target.result.split(',')[1], type: file.type, name: file.name });
            reader.readAsDataURL(file);
        } else {
            sendData(null);
        }
    });
    
    function resetButton(success = true) {
         submitButton.disabled = false;
        btnText.textContent = 'Enviar Solicitação';
        btnSpinner.classList.add('hidden');
        btnText.classList.remove('hidden');
        
        if (success) {
            submitButton.classList.remove('bg-green-500');
        } else {
            submitButton.classList.remove('bg-red-500');
        }
        submitButton.classList.add('bg-gradient-to-r', 'from-cyan-print', 'via-magenta-print', 'to-yellow-print');
    }

    function sendData(fileData) {
        const formData = new FormData(formOrcamento);
        const data = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            servico: formData.get('servico'),
            descricao: formData.get('descricao'),
            arquivo: fileData
        };

        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            body: JSON.stringify(data)
        })
        .then(() => {
            formFeedback.innerHTML = '<p class="text-green-600">Obrigado! Sua solicitação foi enviada com sucesso.</p>';
            formOrcamento.reset();
            fileInfo.classList.add('hidden');
            
            // Estado de Sucesso no Botão
            submitButton.classList.add('bg-green-500');
            submitButton.classList.remove('bg-gradient-to-r', 'from-cyan-print', 'via-magenta-print', 'to-yellow-print');
            btnSpinner.classList.add('hidden');
            btnText.textContent = 'Enviado!';
            btnText.classList.remove('hidden');
            setTimeout(() => resetButton(true), 3000); // Reseta após 3 seg
        })
        .catch(error => {
             formFeedback.innerHTML = `<p class="text-red-500">Ocorreu um erro ao enviar. Tente novamente.</p>`;
             // Estado de Erro no Botão
             submitButton.classList.add('bg-red-500');
             submitButton.classList.remove('bg-gradient-to-r', 'from-cyan-print', 'via-magenta-print', 'to-yellow-print');
             btnSpinner.classList.add('hidden');
             btnText.textContent = 'Erro ao Enviar';
             btnText.classList.remove('hidden');
             setTimeout(() => resetButton(false), 3000); // Reseta após 3 seg
        });
    }

    // --- LÓGICA DO BOTÃO DE REMOVER ARQUIVO ---
    const fileInfo = document.getElementById('file-info');
    const fileNameSpan = document.getElementById('file-name');
    const removeFileBtn = document.getElementById('remove-file-btn');

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileNameSpan.textContent = `Arquivo: ${fileInput.files[0].name}`;
            fileInfo.classList.remove('hidden');
        } else {
            fileInfo.classList.add('hidden');
        }
    });

    removeFileBtn.addEventListener('click', () => {
        fileInput.value = '';
        fileInfo.classList.add('hidden');
    });
    
    // --- LÓGICA DE ANIMAÇÃO AO ROLAR ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
    
    // --- LÓGICA DE ANIMAÇÃO DE FUNDO ---
    const canvas = document.getElementById('background-canvas');
    if (canvas) { 
        const ctx = canvas.getContext('2d');
        if (ctx) { // Garante que o contexto 2D foi pego com sucesso
            let particlesArray;

            function setupCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            setupCanvas();

            class Particle {
                constructor(x, y, directionX, directionY, size, color) {
                    this.x = x;
                    this.y = y;
                    this.directionX = directionX;
                    this.directionY = directionY;
                    this.size = size;
                    this.color = color;
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                }

                update() {
                    if (this.x > canvas.width || this.x < 0) { this.directionX = -this.directionX; }
                    if (this.y > canvas.height || this.y < 0) { this.directionY = -this.directionY; }
                    this.x += this.directionX;
                    this.y += this.directionY;
                }
            }

            function init() {
                particlesArray = [];
                const colors = ['#00AEEF', '#EC008C', '#FFF200']; // Cores CMY
                const numberOfParticles = (canvas.height * canvas.width) / 11000;
                for (let i = 0; i < numberOfParticles; i++) {
                    const size = (Math.random() * 1.5) + 1;
                    const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                    const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                    const directionX = (Math.random() * 0.4) - 0.2;
                    const directionY = (Math.random() * 0.4) - 0.2;
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
                }
            }

            function connect() {
                let opacityValue = 1;
                for (let a = 0; a < particlesArray.length; a++) {
                    for (let b = a; b < particlesArray.length; b++) {
                        const distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                        if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                            opacityValue = 1 - (distance / 20000);
                            
                            const isDark = document.documentElement.classList.contains('dark');
                            ctx.globalAlpha = isDark ? opacityValue * 0.25 : opacityValue * 0.4;
                            
                            ctx.strokeStyle = isDark ? `rgba(200, 200, 200, ${opacityValue * 0.5})` : `rgba(100, 100, 100, ${opacityValue * 0.5})`;

                            if(a % 3 === 0) { 
                                ctx.strokeStyle = particlesArray[a].color;
                                ctx.globalAlpha = isDark ? opacityValue * 0.4 : opacityValue * 0.6;
                            }

                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                            ctx.stroke();
                        }
                    }
                }
                 ctx.globalAlpha = 1;
            }


            function animate() {
                requestAnimationFrame(animate);
                ctx.clearRect(0, 0, innerWidth, innerHeight);

                for (let i = 0; i < particlesArray.length; i++) {
                    particlesArray[i].update();
                }
                connect();
            }

            init();
            animate();

            window.addEventListener('resize', () => {
                setupCanvas();
                init();
            });
        }
    } 

});
