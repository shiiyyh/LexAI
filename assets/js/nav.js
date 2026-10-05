document.addEventListener("DOMContentLoaded", () => {
    fetch('nav.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('nav-placeholder').innerHTML = data;
        initNav();
        initAuth();
        highlightCurrent();
    });

    function initNav() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const toggleBtn = document.querySelector('.toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('collapsed');
            });
        }
    }

    function initAuth() {
        const sidebarAuth = document.getElementById("sidebarAuth");
        if (!sidebarAuth) return;

        function renderAuthContent(user) {
            if (user) {
                let userName = "使用者";
                try {
                    const userData = JSON.parse(user);
                    userName = userData.name || "使用者";
                } catch (e) {
                    userName = user;
                }
                return `
                    <div class="user-info">
                        <i class="fas fa-user-circle"></i>
                        <div class="sidebar-footer-name">${userName}</div>
                        <button id="logoutBtn" class="btn-logout">登出</button>
                    </div>
                `;
            }
            return `
                <div class="auth-links">
                    <button class="auth-toggle">
                        <i class="fas fa-user"></i>
                        <span>登入/註冊</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="auth-dropdown" id="authDropdown">
                        <a href="../pages/login.html" class="auth-option">登入</a>
                        <a href="../pages/register.html" class="auth-option">註冊</a>
                    </div>
                </div>
            `;
        }

        function setupAuthDropdown() {
            const authToggle = sidebarAuth.querySelector('.auth-toggle');
            const authDropdown = document.getElementById('authDropdown');
            
            if (authToggle && authDropdown) {
                // 移除舊的事件監聽器
                const newAuthToggle = authToggle.cloneNode(true);
                authToggle.parentNode.replaceChild(newAuthToggle, authToggle);
                
                newAuthToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    authDropdown.classList.toggle('show');
                });
            }
        }

        function updateAuthUI() {
            const user = localStorage.getItem("loggedInUser");
            sidebarAuth.innerHTML = renderAuthContent(user);

            if (user) {
                const logoutBtn = document.getElementById("logoutBtn");
                if (logoutBtn) {
                    logoutBtn.addEventListener("click", async () => {
                        localStorage.removeItem("loggedInUser");
                        
                        // 先顯示登出成功提示
                        alert("您已成功登出！");
                        
                        // 重定向到首頁
                        window.location.href = "../pages/index.html";
                    });
                }
            } else {
                setupAuthDropdown(); // 未登入時設置下拉選單
            }

            // 設置全域點擊事件來關閉下拉選單
            document.addEventListener('click', () => {
                const dropdown = document.getElementById('authDropdown');
                if (dropdown) {
                    dropdown.classList.remove('show');
                }
            });
        }

        // 初始化 UI
        updateAuthUI();

        // 監聽登入狀態變更
        window.addEventListener('storage', (e) => {
            if (e.key === 'loggedInUser') {
                updateAuthUI();
            }
        });
    }

    function highlightCurrent() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname.split("/").pop();
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split("/").pop();
            link.classList.toggle('active', linkPath === currentPath);
        });
    }
});
