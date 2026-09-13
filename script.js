/* =========================================================
   ZENVORA
   Sistema principal
   ========================================================= */


/* =========================================================
   UTILIDADES
   ========================================================= */

function getUser() {
    try {
        return JSON.parse(
            localStorage.getItem("zenvora_user")
        );
    } catch {
        return null;
    }
}


function saveUser(user) {
    localStorage.setItem(
        "zenvora_user",
        JSON.stringify(user)
    );
}


function getSavedItems() {
    try {
        return JSON.parse(
            localStorage.getItem("zenvora_saved")
        ) || [];
    } catch {
        return [];
    }
}


function saveSavedItems(items) {
    localStorage.setItem(
        "zenvora_saved",
        JSON.stringify(items)
    );
}


function showMessage(message) {

    let toast =
        document.querySelector(".zenvora-toast");

    if (!toast) {

        toast =
            document.createElement("div");

        toast.className =
            "zenvora-toast";

        document.body.appendChild(toast);

        toast.style.position = "fixed";
        toast.style.bottom = "25px";
        toast.style.left = "50%";
        toast.style.transform =
            "translateX(-50%) translateY(20px)";
        toast.style.padding =
            "13px 20px";
        toast.style.borderRadius =
            "14px";
        toast.style.background =
            "rgba(20,20,30,.95)";
        toast.style.color =
            "#fff";
        toast.style.border =
            "1px solid rgba(255,255,255,.12)";
        toast.style.boxShadow =
            "0 15px 40px rgba(0,0,0,.35)";
        toast.style.zIndex =
            "9999";
        toast.style.opacity =
            "0";
        toast.style.transition =
            "all .3s ease";
        toast.style.fontSize =
            "14px";
    }

    toast.textContent = message;

    requestAnimationFrame(() => {

        toast.style.opacity = "1";

        toast.style.transform =
            "translateX(-50%) translateY(0)";

    });

    clearTimeout(
        window.zenvoraToastTimeout
    );

    window.zenvoraToastTimeout =
        setTimeout(() => {

            toast.style.opacity = "0";

            toast.style.transform =
                "translateX(-50%) translateY(20px)";

        }, 2500);
}


/* =========================================================
   PROTEÇÃO DA PÁGINA DO APP
   ========================================================= */

function protectApp() {

    if (!document.body.classList.contains("app-page")) {
        return;
    }

    const user = getUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    return user;
}


/* =========================================================
   DADOS DA ZENVORA
   ========================================================= */

const discoveries = [

    {
        id: 1,
        category: "Tecnologia",
        title: "O futuro da inteligência artificial",
        description:
            "Descubra tecnologias que estão mudando a forma como criamos, trabalhamos e aprendemos.",
        score: 94
    },

    {
        id: 2,
        category: "Games",
        title: "Jogos que você deveria conhecer",
        description:
            "Novos mundos, experiências diferentes e jogos que podem virar seus próximos favoritos.",
        score: 91
    },

    {
        id: 3,
        category: "Negócios",
        title: "Ideias para começar algo novo",
        description:
            "Projetos, oportunidades e ideias para quem quer construir alguma coisa própria.",
        score: 88
    },

    {
        id: 4,
        category: "Música",
        title: "Sons que podem virar seus favoritos",
        description:
            "Artistas, músicas e estilos diferentes para você descobrir algo novo.",
        score: 86
    },

    {
        id: 5,
        category: "Moda",
        title: "Tendências que estão chegando",
        description:
            "Estilos, peças e tendências que estão ganhando espaço.",
        score: 82
    },

    {
        id: 6,
        category: "Tecnologia",
        title: "Aplicativos que facilitam sua vida",
        description:
            "Ferramentas úteis que podem economizar seu tempo todos os dias.",
        score: 79
    }

];


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const user =
            protectApp();

        setupGlobalFeatures();

        setupLogin();

        setupRegister();

        setupApp(user);

    }
);


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin() {

    const form =
        document.getElementById(
            "loginForm"
        );

    if (!form) {
        return;
    }

    const emailInput =
        document.getElementById(
            "email"
        );

    const passwordInput =
        document.getElementById(
            "password"
        );

    const togglePassword =
        document.getElementById(
            "togglePassword"
        );


    /* Mostrar senha */

    if (
        togglePassword &&
        passwordInput
    ) {

        togglePassword.addEventListener(
            "click",
            () => {

                if (
                    passwordInput.type ===
                    "password"
                ) {

                    passwordInput.type =
                        "text";

                    togglePassword.textContent =
                        "◌";

                } else {

                    passwordInput.type =
                        "password";

                    togglePassword.textContent =
                        "◉";

                }

            }
        );

    }


    /* Login */

    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;


            if (!email || !password) {

                showMessage(
                    "Preencha todos os campos."
                );

                return;

            }


            /*
                MODO DEMO LOCAL

                Como o projeto está hospedado
                somente no GitHub Pages,
                ainda não existe um servidor
                seguro para autenticação.

                Por enquanto usamos os dados
                armazenados no navegador.
            */

            const storedUser =
                getUser();


            if (
                storedUser &&
                storedUser.email === email
            ) {

                const button =
                    form.querySelector(
                        ".auth-submit"
                    );

                if (button) {

                    button.disabled =
                        true;

                    button.innerHTML =
                        "<span>Entrando...</span>";

                }

                setTimeout(
                    () => {

                        window.location.href =
                            "app.html";

                    },
                    700
                );

                return;
            }


            showMessage(
                "Conta não encontrada. Crie sua conta primeiro."
            );

        }
    );

}


/* =========================================================
   CADASTRO
   ========================================================= */

function setupRegister() {

    const form =
        document.getElementById(
            "registerForm"
        );

    if (!form) {
        return;
    }


    const nameInput =
        document.getElementById(
            "name"
        );

    const emailInput =
        document.getElementById(
            "email"
        );

    const passwordInput =
        document.getElementById(
            "password"
        );

    const confirmPasswordInput =
        document.getElementById(
            "confirmPassword"
        );

    const togglePassword =
        document.getElementById(
            "togglePassword"
        );

    const toggleConfirmPassword =
        document.getElementById(
            "toggleConfirmPassword"
        );


    /* Mostrar senha */

    if (
        togglePassword &&
        passwordInput
    ) {

        togglePassword.addEventListener(
            "click",
            () => {

                if (
                    passwordInput.type ===
                    "password"
                ) {

                    passwordInput.type =
                        "text";

                    togglePassword.textContent =
                        "◌";

                } else {

                    passwordInput.type =
                        "password";

                    togglePassword.textContent =
                        "◉";

                }

            }
        );

    }


    /* Mostrar confirmação */

    if (
        toggleConfirmPassword &&
        confirmPasswordInput
    ) {

        toggleConfirmPassword.addEventListener(
            "click",
            () => {

                if (
                    confirmPasswordInput.type ===
                    "password"
                ) {

                    confirmPasswordInput.type =
                        "text";

                    toggleConfirmPassword.textContent =
                        "◌";

                } else {

                    confirmPasswordInput.type =
                        "password";

                    toggleConfirmPassword.textContent =
                        "◉";

                }

            }
        );

    }


    /* Cadastro */

    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const name =
                nameInput.value.trim();

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            if (name.length < 2) {

                showMessage(
                    "Digite um nome válido."
                );

                nameInput.focus();

                return;

            }


            if (password.length < 6) {

                showMessage(
                    "A senha precisa ter pelo menos 6 caracteres."
                );

                passwordInput.focus();

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "As senhas não são iguais."
                );

                confirmPasswordInput.focus();

                return;

            }


            const user = {

                name: name,

                email: email,

                createdAt:
                    new Date().toISOString(),

                interests: [],

                saved: []

            };


            saveUser(user);


            const button =
                form.querySelector(
                    ".auth-submit"
                );


            if (button) {

                button.disabled =
                    true;

                button.innerHTML =
                    "<span>Conta criada ✓</span>";

            }


            setTimeout(
                () => {

                    window.location.href =
                        "app.html";

                },
                700
            );

        }
    );

}


/* =========================================================
   APP
   ========================================================= */

function setupApp(user) {

    if (
        !user ||
        !document.body.classList.contains(
            "app-page"
        )
    ) {
        return;
    }


    setupUserInterface(user);

    setupCategories();

    setupSearch();

    setupDiscovery();

    setupSidebar();

    setupLogout();

    setupKeyboardShortcuts();

    setupNotifications();

    renderSaved();

}


/* =========================================================
   INTERFACE DO USUÁRIO
   ========================================================= */

function setupUserInterface(user) {

    const firstName =
        user.name
            ? user.name.split(" ")[0]
            : "Usuário";


    const welcomeElements =
        document.querySelectorAll(
            "[data-user-name]"
        );


    welcomeElements.forEach(
        element => {

            element.textContent =
                firstName;

        }
    );


    const nameElements =
        document.querySelectorAll(
            "[data-user-full-name]"
        );


    nameElements.forEach(
        element => {

            element.textContent =
                user.name;

        }
    );


    const emailElements =
        document.querySelectorAll(
            "[data-user-email]"
        );


    emailElements.forEach(
        element => {

            element.textContent =
                user.email;

        }
    );


    const avatarElements =
        document.querySelectorAll(
            "[data-user-avatar]"
        );


    avatarElements.forEach(
        element => {

            element.textContent =
                firstName
                    .charAt(0)
                    .toUpperCase();

        }
    );


    const welcomeTitle =
        document.querySelector(
            ".welcome-title"
        );


    if (welcomeTitle) {

        welcomeTitle.innerHTML =
            `Olá, <span>${firstName}</span>.`;

    }

}


/* =========================================================
   CATEGORIAS
   ========================================================= */

function setupCategories() {

    const buttons =
        document.querySelectorAll(
            ".category-button"
        );

    if (!buttons.length) {
        return;
    }


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const category =
                        button.dataset.category ||
                        button.textContent.trim();


                    filterDiscoveries(
                        category
                    );

                }
            );

        }
    );

}


/* =========================================================
   PESQUISA
   ========================================================= */

function setupSearch() {

    const searchInput =
        document.querySelector(
            ".search-input"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            searchDiscoveries(
                query
            );

        }
    );

}


/* =========================================================
   FILTRO POR CATEGORIA
   ========================================================= */

function filterDiscoveries(category) {

    const cards =
        document.querySelectorAll(
            ".discovery-item"
        );


    cards.forEach(
        card => {

            const cardCategory =
                card.dataset.category ||
                card.querySelector(
                    ".card-category"
                )?.textContent.trim();


            if (
                category === "Todos" ||
                category === "todos" ||
                !category
            ) {

                card.style.display =
                    "";

                return;

            }


            if (
                cardCategory &&
                cardCategory
                    .toLowerCase() ===
                category.toLowerCase()
            ) {

                card.style.display =
                    "";

            } else {

                card.style.display =
                    "none";

            }

        }
    );

}


/* =========================================================
   PESQUISA NOS CARDS
   ========================================================= */

function searchDiscoveries(query) {

    const cards =
        document.querySelectorAll(
            ".discovery-item"
        );


    let found = 0;


    cards.forEach(
        card => {

            const text =
                card.textContent
                    .toLowerCase();


            if (
                !query ||
                text.includes(query)
            ) {

                card.style.display =
                    "";

                found++;

            } else {

                card.style.display =
                    "none";

            }

        }
    );


    const empty =
        document.querySelector(
            ".search-empty"
        );


    if (empty) {

        if (
            query &&
            found === 0
        ) {

            empty.style.display =
                "flex";

        } else {

            empty.style.display =
                "none";

        }

    }

}


/* =========================================================
   DISCOVERY
   ========================================================= */

function setupDiscovery() {

    const cards =
        document.querySelectorAll(
            ".discovery-item"
        );


    cards.forEach(
        card => {

            const saveButton =
                card.querySelector(
                    ".save-button"
                );


            if (!saveButton) {
                return;
            }


            const id =
                card.dataset.id ||
                getCardId(card);


            if (
                getSavedItems()
                    .includes(String(id))
            ) {

                saveButton.classList.add(
                    "saved"
                );

                saveButton.textContent =
                    "✓";

            }


            saveButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    toggleSaved(
                        String(id),
                        card,
                        saveButton
                    );

                }
            );

        }
    );

}


function getCardId(card) {

    const cards =
        Array.from(
            document.querySelectorAll(
                ".discovery-item"
            )
        );

    return cards.indexOf(card) + 1;

}


/* =========================================================
   SALVAR DESCOBERTA
   ========================================================= */

function toggleSaved(
    id,
    card,
    button
) {

    let saved =
        getSavedItems();


    if (
        saved.includes(id)
    ) {

        saved =
            saved.filter(
                item => item !== id
            );


        button.classList.remove(
            "saved"
        );

        button.textContent =
            "♡";


        showMessage(
            "Removido dos salvos."
        );

    } else {

        saved.push(id);


        button.classList.add(
            "saved"
        );

        button.textContent =
            "✓";


        showMessage(
            "Salvo na sua Zenvora."
        );

    }


    saveSavedItems(
        saved
    );


    renderSaved();

}


/* =========================================================
   RENDERIZAR SALVOS
   ========================================================= */

function renderSaved() {

    const container =
        document.querySelector(
            ".saved-items"
        );


    if (!container) {
        return;
    }


    const saved =
        getSavedItems();


    const cards =
        document.querySelectorAll(
            ".discovery-item"
        );


    container.innerHTML = "";


    if (!saved.length) {

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">♡</div>
                <h3>Nada salvo ainda</h3>
                <p>
                    Salve descobertas que você quiser
                    encontrar novamente.
                </p>
            </div>
        `;

        return;

    }


    cards.forEach(
        card => {

            const id =
                String(
                    card.dataset.id ||
                    getCardId(card)
                );


            if (
                !saved.includes(id)
            ) {
                return;
            }


            const clone =
                card.cloneNode(true);


            const saveButton =
                clone.querySelector(
                    ".save-button"
                );


            if (saveButton) {

                saveButton.textContent =
                    "✓";

                saveButton.classList.add(
                    "saved"
                );

            }


            container.appendChild(
                clone
            );

        }
    );

}


/* =========================================================
   SIDEBAR
   ========================================================= */

function setupSidebar() {

    const links =
        document.querySelectorAll(
            ".sidebar-link"
        );


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const target =
                        link.dataset.section;


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    links.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    link.classList.add(
                        "active"
                    );


                    showSection(
                        target
                    );

                }
            );

        }
    );

}


function showSection(section) {

    const sections =
        document.querySelectorAll(
            "[data-section-content]"
        );


    sections.forEach(
        element => {

            if (
                element.dataset.sectionContent ===
                section
            ) {

                element.style.display =
                    "";

            } else {

                element.style.display =
                    "none";

            }

        }
    );


    if (
        section === "inicio"
    ) {

        document
            .querySelector(
                ".app-content"
            )
            ?.scrollTo({
                top: 0,
                behavior: "smooth"
            });

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {

    const logoutButtons =
        document.querySelectorAll(
            ".logout-button, [data-logout]"
        );


    logoutButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    localStorage.removeItem(
                        "zenvora_user"
                    );


                    showMessage(
                        "Saindo da Zenvora..."
                    );


                    setTimeout(
                        () => {

                            window.location.href =
                                "login.html";

                        },
                        500
                    );

                }
            );

        }
    );

}


/* =========================================================
   NOTIFICAÇÕES
   ========================================================= */

function setupNotifications() {

    const button =
        document.querySelector(
            ".notification-button"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            showMessage(
                "Você não possui novas notificações."
            );

        }
    );

}


/* =========================================================
   ATALHOS DO TECLADO
   ========================================================= */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            /*
                Pressionar "/" abre a pesquisa.
            */

            if (
                event.key === "/" &&
                !isTyping(event.target)
            ) {

                event.preventDefault();


                const search =
                    document.querySelector(
                        ".search-input"
                    );


                if (search) {

                    search.focus();

                }

            }


            /*
                ESC tira o foco da pesquisa.
            */

            if (
                event.key === "Escape"
            ) {

                const search =
                    document.querySelector(
                        ".search-input"
                    );


                if (search) {

                    search.blur();

                }

            }

        }
    );

}


function isTyping(element) {

    if (!element) {
        return false;
    }


    const tag =
        element.tagName.toLowerCase();


    return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select"
    );

}


/* =========================================================
   HOME
   ========================================================= */

function setupGlobalFeatures() {

    const user =
        getUser();


    /*
        Se o usuário já estiver logado
        e tentar abrir o cadastro/login,
        podemos manter a página normal.
    */


    const homeButtons =
        document.querySelectorAll(
            "[data-start]"
        );


    homeButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    if (user) {

                        window.location.href =
                            "app.html";

                    }

                }
            );

        }
    );

}


/* =========================================================
   ANIMAÇÃO DOS CARDS
   ========================================================= */

document.addEventListener(
    "mousemove",
    event => {

        const cards =
            document.querySelectorAll(
                ".discovery-item"
            );


        cards.forEach(
            card => {

                if (
                    card.style.display ===
                    "none"
                ) {
                    return;
                }


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                if (
                    x < 0 ||
                    y < 0 ||
                    x > rect.width ||
                    y > rect.height
                ) {

                    return;

                }


                const rotateX =
                    ((y / rect.height) - 0.5) *
                    -3;


                const rotateY =
                    ((x / rect.width) - 0.5) *
                    3;


                card.style.transform =
                    `perspective(800px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-2px)`;

            }
        );

    }
);


/* =========================================================
   RESET DA ANIMAÇÃO DOS CARDS
   ========================================================= */

document.addEventListener(
    "mouseleave",
    () => {

        document
            .querySelectorAll(
                ".discovery-item"
            )
            .forEach(
                card => {

                    card.style.transform =
                        "";

                }
            );

    }
);

/* =========================================================
   ZENVORA — PERSONALIZAÇÃO
   Adicionado sem alterar o layout existente
   ========================================================= */

function getPreferences() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "zenvora_preferences"
            )
        ) || {};

    } catch {

        return {};

    }

}


function savePreferences(preferences) {

    localStorage.setItem(
        "zenvora_preferences",
        JSON.stringify(preferences)
    );

}


/* ---------------------------------------------------------
   Registrar interesse
--------------------------------------------------------- */

function registerInterest(category) {

    if (!category) {
        return;
    }

    const preferences =
        getPreferences();

    if (!preferences[category]) {

        preferences[category] = 0;

    }

    preferences[category]++;

    savePreferences(
        preferences
    );

}


/* ---------------------------------------------------------
   Descobrir categoria mais forte
--------------------------------------------------------- */

function getFavoriteCategory() {

    const preferences =
        getPreferences();

    const entries =
        Object.entries(
            preferences
        );

    if (!entries.length) {
        return null;
    }

    entries.sort(
        (a, b) => b[1] - a[1]
    );

    return entries[0][0];

}


/* ---------------------------------------------------------
   Personalizar porcentagens
--------------------------------------------------------- */

function personalizeRecommendations() {

    const preferences =
        getPreferences();

    const cards =
        document.querySelectorAll(
            ".discovery-item"
        );

    cards.forEach(
        card => {

            const category =
                card.dataset.category ||
                card.querySelector(
                    ".card-category"
                )?.textContent.trim();


            if (!category) {
                return;
            }


            const originalScore =
                parseInt(
                    card.dataset.originalScore ||
                    card.querySelector(
                        ".match-score"
                    )?.textContent ||
                    "70"
                );


            if (!card.dataset.originalScore) {

                card.dataset.originalScore =
                    originalScore;

            }


            const interest =
                preferences[category] || 0;


            /*
             * Cada interação aumenta a relevância.
             * Existe um limite para não deixar
             * todas as recomendações em 100%.
             */

            const bonus =
                Math.min(
                    interest * 2,
                    10
                );


            let score =
                originalScore + bonus;


            score =
                Math.min(
                    score,
                    99
                );


            const scoreElement =
                card.querySelector(
                    ".match-score"
                );


            if (scoreElement) {

                scoreElement.textContent =
                    `${score}% combina`;

            }

        }
    );

}


/* ---------------------------------------------------------
   Registrar quando salvar
--------------------------------------------------------- */

function setupPersonalization() {

    const cards =
        document.querySelectorAll(
            ".discovery-item"
        );


    if (!cards.length) {
        return;
    }


    cards.forEach(
        card => {

            const saveButton =
                card.querySelector(
                    ".save-button"
                );


            if (!saveButton) {
                return;
            }


            /*
             * Evita adicionar o mesmo
             * evento duas vezes.
             */

            if (
                saveButton.dataset
                    .personalizationReady ===
                "true"
            ) {

                return;

            }


            saveButton.dataset
                .personalizationReady =
                "true";


            saveButton.addEventListener(
                "click",
                () => {

                    const category =
                        card.dataset.category ||
                        card.querySelector(
                            ".card-category"
                        )?.textContent.trim();


                    /*
                     * Só registra como interesse
                     * quando o usuário salva.
                     */

                    if (
                        saveButton.classList
                            .contains("saved")
                    ) {

                        registerInterest(
                            category
                        );

                        personalizeRecommendations();

                    }

                }
            );

        }
    );


    personalizeRecommendations();

}


/* ---------------------------------------------------------
   Inicializar depois que a página carregar
--------------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            () => {

                setupPersonalization();

            },
            100
        );

    }
);
