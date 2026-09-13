/* =========================================================
   ZENVORA — SCRIPT PRINCIPAL
   ========================================================= */


/* =========================================================
   UTILITÁRIOS
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


/* =========================================================
   TOAST
   ========================================================= */

function showMessage(message) {

    const oldMessage =
        document.querySelector(
            ".zenvora-toast"
        );

    if (oldMessage) {
        oldMessage.remove();
    }


    const toast =
        document.createElement("div");

    toast.className =
        "zenvora-toast";

    toast.textContent =
        message;


    toast.style.position =
        "fixed";

    toast.style.bottom =
        "25px";

    toast.style.right =
        "25px";

    toast.style.zIndex =
        "99999";

    toast.style.padding =
        "13px 18px";

    toast.style.borderRadius =
        "14px";

    toast.style.background =
        "rgba(20,20,28,.92)";

    toast.style.border =
        "1px solid rgba(255,255,255,.12)";

    toast.style.color =
        "#fff";

    toast.style.fontSize =
        "13px";

    toast.style.boxShadow =
        "0 15px 40px rgba(0,0,0,.35)";

    toast.style.backdropFilter =
        "blur(15px)";

    toast.style.opacity =
        "0";

    toast.style.transform =
        "translateY(10px)";

    toast.style.transition =
        "all .25s ease";


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(() => {

        toast.style.opacity =
            "1";

        toast.style.transform =
            "translateY(0)";

    });


    setTimeout(() => {

        toast.style.opacity =
            "0";

        toast.style.transform =
            "translateY(10px)";

        setTimeout(
            () => toast.remove(),
            300
        );

    }, 2500);
}


/* =========================================================
   PROTEÇÃO DAS PÁGINAS
   ========================================================= */

function protectApp() {

    const user =
        getUser();

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    if (
        currentPage === "app.html" &&
        !user
    ) {

        window.location.href =
            "login.html";

        return false;
    }


    return true;
}


/* =========================================================
   DADOS DE DESCOBERTA
   ========================================================= */

const discoveries = [

    {
        id: 1,
        title: "Ferramentas de IA que estão mudando a internet",
        category: "Tecnologia",
        description:
            "Descubra novas ferramentas de inteligência artificial.",
        score: 91
    },

    {
        id: 2,
        title: "Os games que estão bombando agora",
        category: "Games",
        description:
            "Confira jogos que estão ganhando cada vez mais atenção.",
        score: 87
    },

    {
        id: 3,
        title: "Músicas para colocar na sua playlist",
        category: "Música",
        description:
            "Novos sons e artistas para você descobrir.",
        score: 84
    },

    {
        id: 4,
        title: "Tendências de moda para ficar de olho",
        category: "Moda",
        description:
            "Estilos e tendências que estão aparecendo agora.",
        score: 82
    },

    {
        id: 5,
        title: "Ideias de negócios para começar pequeno",
        category: "Negócios",
        description:
            "Ideias, oportunidades e projetos para explorar.",
        score: 89
    },

    {
        id: 6,
        title: "Designs que podem inspirar seu próximo projeto",
        category: "Design",
        description:
            "Referências criativas para novos projetos.",
        score: 86
    },

    {
        id: 7,
        title: "Esportes e histórias que merecem atenção",
        category: "Esportes",
        description:
            "Notícias, histórias e conteúdos esportivos.",
        score: 80
    },

    {
        id: 8,
        title: "Filmes e séries para descobrir",
        category: "Filmes & Séries",
        description:
            "Produções que podem entrar na sua próxima lista.",
        score: 88
    }
];


/* =========================================================
   PERSONALIZAÇÃO
   ========================================================= */

function registerInterest(category) {

    if (!category) {
        return;
    }


    const preferences =
        getPreferences();


    if (!preferences[category]) {
        preferences[category] = 0;
    }


    preferences[category] += 1;


    savePreferences(
        preferences
    );
}


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
        (a, b) =>
            b[1] - a[1]
    );


    return entries[0][0];
}


function getPersonalizedScore(item) {

    const preferences =
        getPreferences();


    const interest =
        preferences[
            item.category
        ] || 0;


    /*
     * Cada interesse aumenta
     * a relevância daquela categoria.
     */

    const bonus =
        Math.min(
            interest * 3,
            18
        );


    return Math.min(
        99,
        item.score + bonus
    );
}


function personalizeRecommendations(
    items
) {

    const preferences =
        getPreferences();


    return [...items].sort(
        (a, b) => {

            const scoreA =
                getPersonalizedScore(a);

            const scoreB =
                getPersonalizedScore(b);


            /*
             * Se os scores forem diferentes,
             * mostra primeiro o mais relevante.
             */

            if (
                scoreA !== scoreB
            ) {

                return (
                    scoreB -
                    scoreA
                );

            }


            /*
             * Caso contrário,
             * usa a preferência como
             * segundo critério.
             */

            const interestA =
                preferences[
                    a.category
                ] || 0;

            const interestB =
                preferences[
                    b.category
                ] || 0;


            return (
                interestB -
                interestA
            );
        }
    );
}


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


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    ?.value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("password")
                    ?.value;


            if (
                !email ||
                !password
            ) {

                showMessage(
                    "Preencha todos os campos."
                );

                return;
            }


            const user =
                getUser();


            if (!user) {

                showMessage(
                    "Nenhuma conta encontrada. Crie sua conta primeiro."
                );

                return;
            }


            if (
                user.email !== email
            ) {

                showMessage(
                    "E-mail não encontrado."
                );

                return;
            }


            /*
             * DEMO:
             * O GitHub Pages não possui backend.
             * A senha não é validada por servidor.
             */

            const submitButton =
                form.querySelector(
                    ".auth-submit"
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Entrando...";
            }


            setTimeout(() => {

                window.location.href =
                    "app.html";

            }, 500);

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


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    ?.value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    ?.value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("password")
                    ?.value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    ?.value;


            const terms =
                document.getElementById(
                    "terms"
                );


            if (
                !name ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                showMessage(
                    "Preencha todos os campos."
                );

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "As senhas não coincidem."
                );

                return;
            }


            if (
                password.length < 6
            ) {

                showMessage(
                    "A senha precisa ter pelo menos 6 caracteres."
                );

                return;
            }


            if (
                terms &&
                !terms.checked
            ) {

                showMessage(
                    "Aceite os termos para continuar."
                );

                return;
            }


            const user = {

                name: name,

                email: email,

                createdAt:
                    new Date()
                        .toISOString(),

                interests: [],

                saved: []

            };


            saveUser(user);


            /*
             * Limpa preferências antigas
             * para uma nova conta.
             */

            localStorage.removeItem(
                "zenvora_preferences"
            );

            localStorage.removeItem(
                "zenvora_onboarding"
            );


            const submitButton =
                form.querySelector(
                    ".register-submit"
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Criando sua conta...";

            }


            /*
             * AQUI está a mudança:
             * cadastro → interesses
             */

            setTimeout(() => {

                window.location.href =
                    "interesses.html";

            }, 500);

        }
    );
}


/* =========================================================
   APP
   ========================================================= */

function setupApp(user) {

    if (!user) {
        return;
    }


    setupUserInterface(
        user
    );

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

function setupUserInterface(
    user
) {

    const nameElements =
        document.querySelectorAll(
            ".user-name, .welcome-name"
        );


    nameElements.forEach(
        element => {

            element.textContent =
                user.name;

        }
    );


    const avatar =
        document.querySelector(
            ".user-avatar"
        );


    if (avatar) {

        avatar.textContent =
            user.name
                .charAt(0)
                .toUpperCase();

    }


    const profileName =
        document.querySelector(
            ".profile-name"
        );


    if (profileName) {

        profileName.textContent =
            user.name;

    }


    const profileEmail =
        document.querySelector(
            ".profile-email"
        );


    if (profileEmail) {

        profileEmail.textContent =
            user.email;

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
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    const category =
                        button.dataset.category;


                    filterDiscoveries(
                        category
                    );

                }
            );

        }
    );

}


/* =========================================================
   FILTRO
   ========================================================= */

function filterDiscoveries(
    category
) {

    const items =
        document.querySelectorAll(
            ".discovery-item"
        );


    items.forEach(
        item => {

            const itemCategory =
                item.dataset.category;


            if (
                category === "Todos" ||
                category === itemCategory
            ) {

                item.style.display =
                    "";

            } else {

                item.style.display =
                    "none";

            }

        }
    );

}


/* =========================================================
   BUSCA
   ========================================================= */

function setupSearch() {

    const input =
        document.querySelector(
            ".search-input"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        () => {

            const query =
                input.value
                    .trim()
                    .toLowerCase();


            const items =
                document.querySelectorAll(
                    ".discovery-item"
                );


            let visible =
                0;


            items.forEach(
                item => {

                    const text =
                        item.textContent
                            .toLowerCase();


                    if (
                        text.includes(
                            query
                        )
                    ) {

                        item.style.display =
                            "";

                        visible++;

                    } else {

                        item.style.display =
                            "none";

                    }

                }
            );


            const empty =
                document.querySelector(
                    ".search-empty"
                );


            if (empty) {

                empty.style.display =
                    visible === 0
                        ? "block"
                        : "none";

            }

        }
    );

}


/* =========================================================
   DESCOBERTA
   ========================================================= */

function setupDiscovery() {

    const container =
        document.querySelector(
            ".discovery-grid"
        );


    if (!container) {
        return;
    }


    /*
     * Se os cards já existem no HTML,
     * não recriaremos eles.
     */

    const cards =
        container.querySelectorAll(
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


            saveButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    const id =
                        card.dataset.id;


                    if (!id) {
                        return;
                    }


                    let saved =
                        getSavedItems();


                    const alreadySaved =
                        saved.includes(
                            id
                        );


                    if (
                        alreadySaved
                    ) {

                        saved =
                            saved.filter(
                                savedId =>
                                    savedId !== id
                            );


                        saveButton.classList.remove(
                            "saved"
                        );


                        showMessage(
                            "Removido dos salvos."
                        );

                    } else {

                        saved.push(
                            id
                        );


                        saveButton.classList.add(
                            "saved"
                        );


                        const category =
                            card.dataset.category;


                        registerInterest(
                            category
                        );


                        showMessage(
                            "Salvo na sua Zenvora."
                        );

                    }


                    saveSavedItems(
                        saved
                    );


                    renderSaved();

                }
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


    const sections =
        document.querySelectorAll(
            "[data-section-content]"
        );


    if (!links.length) {
        return;
    }


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const section =
                        link.dataset.section;


                    links.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    link.classList.add(
                        "active"
                    );


                    sections.forEach(
                        content => {

                            content.style.display =
                                content.dataset.sectionContent ===
                                section
                                    ? ""
                                    : "none";

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   SALVOS
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


    cards.forEach(
        card => {

            const id =
                card.dataset.id;


            const button =
                card.querySelector(
                    ".save-button"
                );


            if (
                button &&
                saved.includes(id)
            ) {

                button.classList.add(
                    "saved"
                );

            }

        }
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {

    const button =
        document.querySelector(
            ".logout-button"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


            localStorage.removeItem(
                "zenvora_user"
            );


            window.location.href =
                "index.html";

        }
    );

}


/* =========================================================
   ATALHOS
   ========================================================= */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            /*
             * /
             * Foca na pesquisa
             */

            if (
                event.key === "/" &&
                !["INPUT", "TEXTAREA"].includes(
                    document.activeElement.tagName
                )
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
                "Você está em dia. Novas descobertas aparecerão aqui."
            );

        }
    );

}


/* =========================================================
   PERSONALIZAÇÃO DOS CARDS
   ========================================================= */

function setupPersonalization() {

    const cards =
        document.querySelectorAll(
            ".discovery-item"
        );


    if (!cards.length) {
        return;
    }


    const preferences =
        getPreferences();


    cards.forEach(
        card => {

            const category =
                card.dataset.category;


            const scoreElement =
                card.querySelector(
                    ".match-score"
                );


            if (
                !scoreElement
            ) {
                return;
            }


            const baseScore =
                Number(
                    scoreElement.dataset.baseScore ||
                    scoreElement.textContent
                        .replace(/\D/g, "")
                );


            const interest =
                preferences[
                    category
                ] || 0;


            const bonus =
                Math.min(
                    interest * 3,
                    18
                );


            const finalScore =
                Math.min(
                    99,
                    baseScore + bonus
                );


            scoreElement.textContent =
                `${finalScore}% match`;


            scoreElement.dataset.baseScore =
                baseScore;

        }
    );

}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        protectApp();

        setupLogin();

        setupRegister();


        const user =
            getUser();


        /*
         * Só configura o aplicativo
         * quando estamos dentro dele.
         */

        if (
            document.body.classList.contains(
                "app-page"
            )
        ) {

            setupApp(user);

            setTimeout(
                () => {

                    setupPersonalization();

                },
                100
            );

        }

    }
);
