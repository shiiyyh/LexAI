// 會員資料頁面的JavaScript代碼

document.addEventListener("DOMContentLoaded", () => {
    console.log("頁面加載完成");
    loadMemberData();
    setupEventListeners();
    setupModalClosers();
    console.log("事件監聽設置完成");
});

// 加載會員資料
function loadMemberData() {
    const user = localStorage.getItem("loggedInUser");
    
    if (user) {
        try {
            const userData = JSON.parse(user);
            document.getElementById("memberName").textContent = userData.name || "使用者";
            document.getElementById("memberEmail").textContent = userData.email || "未設置";
            document.getElementById("memberRole").textContent = userData.role || "普通會員";
            console.log("會員資料已加載:", userData.name);
        } catch (e) {
            // 如果是無效 JSON，可能是舊格式的 email 字符串，建立新用戶
            console.warn("JSON 解析失敗，建立新用戶:", e);
            const testUser = {
                name: user.includes("@") ? user.split("@")[0] : "使用者",
                email: user.includes("@") ? user : "test@example.com",
                role: "普通會員"
            };
            localStorage.setItem("loggedInUser", JSON.stringify(testUser));
            document.getElementById("memberName").textContent = testUser.name;
            document.getElementById("memberEmail").textContent = testUser.email;
            document.getElementById("memberRole").textContent = testUser.role;
        }
    } else {
        // 如果沒有登入用戶，建立示例用戶以供測試
        const testUser = {
            name: "測試使用者",
            email: "test@example.com",
            role: "普通會員"
        };
        localStorage.setItem("loggedInUser", JSON.stringify(testUser));
        document.getElementById("memberName").textContent = testUser.name;
        document.getElementById("memberEmail").textContent = testUser.email;
        document.getElementById("memberRole").textContent = testUser.role;
        console.log("使用示例用戶");
    }
}
// 設置事件監聽
function setupEventListeners() {
    console.log("開始設置事件監聽");
    
    // 短延遲以確保 DOM 完全加載
    setTimeout(() => {
        const editMemberBtn = document.getElementById("editMemberBtn");
        if (editMemberBtn) {
            editMemberBtn.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("✓ 編輯按鈕被點擊");
                openModal("editModal");
            });
            console.log("✓ 編輯按鈕事件已綁定");
        } else {
            console.warn("❌ 找不到編輯按鈕");
        }

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("✓ 登出按鈕被點擊");
                handleLogout();
            });
            console.log("✓ 登出按鈕事件已綁定");
        } else {
            console.warn("❌ 找不到登出按鈕");
        }

        const queryBtn = document.getElementById("queryBtn");
        if (queryBtn) {
            queryBtn.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("✓ 查詢按鈕被點擊");
                handleCounterpartyQuery();
            });
            console.log("✓ 查詢按鈕事件已綁定");
        }

        const counterpartyId = document.getElementById("counterpartyId");
        if (counterpartyId) {
            counterpartyId.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    handleCounterpartyQuery();
                }
            });
        }

        const useCounterpartyBtn = document.getElementById("useCounterpartyBtn");
        if (useCounterpartyBtn) {
            useCounterpartyBtn.addEventListener("click", (e) => {
                e.preventDefault();
                handleUseCounterparty();
            });
        }

        // 知識庫按鈕
        const kbButtons = document.querySelectorAll(".kb-btn");
        console.log(`找到 ${kbButtons.length} 個知識庫按鈕`);
        if (kbButtons.length === 0) {
            console.warn("❌ 沒有找到任何知識庫按鈕");
        }
        kbButtons.forEach((btn, idx) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const type = btn.dataset.kb;
                console.log(`✓ 知識庫按鈕 ${idx} 被點擊，type=${type}`);
                openKBModal(type);
            });
            console.log(`✓ 已為知識庫按鈕 ${idx} 綁定事件`);
        });

        // 設定項目
        const settingItems = document.querySelectorAll(".setting-item");
        console.log(`找到 ${settingItems.length} 個設定項目`);
        if (settingItems.length === 0) {
            console.warn("❌ 沒有找到任何設定項目");
        }
        settingItems.forEach((item, idx) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                console.log(`✓ 設定項目 ${idx} 被點擊`);
                openSettingModal(item);
            });
            console.log(`✓ 已為設定項目 ${idx} 綁定事件`);
        });
        
        console.log("=== 所有事件監聽設置完成 ===");
    }, 100);
}

// 設置模態視窗關閉功能
function setupModalClosers() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("show");
            }
        });
    });
}

// 打開模態視窗
function openModal(modalId) {
    console.log("openModal 被調用，ID:", modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        console.log("找到模態視窗，添加 show 類別");
        modal.classList.add("show");
        modal.style.display = "flex"; // 確保可見
    } else {
        console.error("❌ 找不到模態視窗:", modalId);
    }
}

// 關閉模態視窗
function closeModal(modalId) {
    console.log("closeModal 被調用，ID:", modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
    }
}

// 打開知識庫模態視窗
function openKBModal(type) {
    const titles = {
        company: "公司基本資料管理",
        history: "過去合約案例查詢"
    };
    const descs = {
        company: "上傳和管理公司營運的基本資訊文件",
        history: "查看和參考過往簽訂的合約案例"
    };
    
    document.getElementById("modalTitle").textContent = titles[type] || "企業知識庫";
    document.getElementById("modalDesc").textContent = descs[type] || "管理企業文件";
    openModal("kbModal");
}

// 打開設定模態視窗
function openSettingModal(item) {
    const settingText = item.querySelector("span").textContent;
    const modal = document.getElementById("settingModal");
    const title = document.getElementById("settingTitle");
    const content = document.getElementById("settingContent");
    
    title.textContent = settingText;
    
    const settings = {
        "隱私設定": `
            <label style="color: white; display: block; margin-bottom: 15px;">
                <input type="checkbox" style="margin-right: 8px;"> 允許他人查看我的個人資料
            </label>
            <label style="color: white; display: block; margin-bottom: 15px;">
                <input type="checkbox" style="margin-right: 8px;"> 允許搜索引擎索引我的檔案
            </label>
        `,
        "通知設定": `
            <label style="color: white; display: block; margin-bottom: 15px;">
                <input type="checkbox" checked style="margin-right: 8px;"> 電子郵件通知
            </label>
            <label style="color: white; display: block; margin-bottom: 15px;">
                <input type="checkbox" checked style="margin-right: 8px;"> 合約更新通知
            </label>
            <label style="color: white; display: block;">
                <input type="checkbox" style="margin-right: 8px;"> 行銷郵件
            </label>
        `,
        "更改密碼": `
            <input type="password" placeholder="目前密碼" style="width: 100%; padding: 10px; margin-bottom: 12px; background: #2c3e50; border: 2px solid #34495e; border-radius: 6px; color: white;">
            <input type="password" placeholder="新密碼" style="width: 100%; padding: 10px; margin-bottom: 12px; background: #2c3e50; border: 2px solid #34495e; border-radius: 6px; color: white;">
            <input type="password" placeholder="確認新密碼" style="width: 100%; padding: 10px; background: #2c3e50; border: 2px solid #34495e; border-radius: 6px; color: white;">
        `
    };
    
    content.innerHTML = settings[settingText] || `<p style="color: #bdc3c7;">${settingText} 功能開發中...</p>`;
    openModal("settingModal");
}

// 上傳知識庫文件
function uploadKB() {
    const file = document.getElementById("kbFile").files[0];
    if (file) {
        showNotification(`已上傳: ${file.name}`, "success");
        closeModal("kbModal");
        document.getElementById("kbFile").value = "";
    } else {
        alert("請選擇文件");
    }
}

// 保存個人資料
function saveProfile() {
    const name = document.getElementById("editName").value || document.getElementById("memberName").textContent;
    const email = document.getElementById("editEmail").value || document.getElementById("memberEmail").textContent;
    
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    user.name = name;
    user.email = email;
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    
    document.getElementById("memberName").textContent = name;
    document.getElementById("memberEmail").textContent = email;
    
    showNotification("個人資料已保存", "success");
    closeModal("editModal");
}

// 處理登出
function handleLogout() {
    if (confirm("確定要登出嗎？")) {
        localStorage.removeItem("loggedInUser");
        window.location.href = "./login.html";
    }
}

// 處理對方公司查詢
async function handleCounterpartyQuery() {
    const counterpartyId = document.getElementById("counterpartyId").value.trim();
    if (!counterpartyId) {
        alert("請輸入統一編號");
        return;
    }
    await queryCounterpartyInfo(counterpartyId);
}

// 處理使用此資訊
function handleUseCounterparty() {
    const companyName = document.querySelector(".result-value")?.textContent;
    if (companyName) {
        const counterpartyData = {
            name: companyName,
            id: document.getElementById("counterpartyId").value,
            queryTime: new Date().toLocaleString("zh-TW")
        };
        localStorage.setItem("selectedCounterparty", JSON.stringify(counterpartyData));
        showNotification("對方公司資訊已保存，可用於生成合約", "success");
    }
}

// 顯示通知
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === "success" ? "#27ae60" : "#3498db"};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 睡眠函數（延遲執行）
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 模擬商工登記查詢
async function queryCounterpartyInfo(id) {
    const loadingDiv = document.getElementById("counterpartyLoading");
    const loadingText = document.getElementById("counterpartyLoadingText");
    const results = document.getElementById("counterpartyResults");
    
    loadingDiv.style.display = "block";
    results.style.display = "none";
    loadingText.textContent = "正在連線商工登記資料庫...";
    
    await sleep(1200);
    
    if (id === "12345678" || id.includes("全興")) {
        loadingText.textContent = "偵測到特許行業：水產飼料，加載《飼料管理法》...";
        await sleep(800);
    }
    
    loadingDiv.style.display = "none";
    
    const mockData = getMockCounterpartyData(id);
    displayCounterpartyResults(mockData);
    results.style.display = "block";
}

// 獲取模擬的對方公司數據
function getMockCounterpartyData(id) {
    const mockDatabase = {
        "12345678": {
            "公司名稱": "全興水產飼料股份有限公司",
            "統一編號": "12345678",
            "公司位址": "台灣高雄市前鎮區中山二路100號",
            "營業項目": "水產飼料製造及銷售",
            "負責人": "王小明",
            "資本額": "新台幣50,000,000元",
            "成立日期": "2010年3月15日",
            "營業狀態": "正常營業",
            "特許行業": "水產飼料（適用《飼料管理法》）"
        },
        "87654321": {
            "公司名稱": "科技創新股份有限公司",
            "統一編號": "87654321",
            "公司位址": "台灣台北市信義區光復路100號",
            "營業項目": "軟體開發及資訊服務",
            "負責人": "李美麗",
            "資本額": "新台幣30,000,000元",
            "成立日期": "2015年6月20日",
            "營業狀態": "正常營業",
            "信用評等": "AA"
        }
    };
    
    return mockDatabase[id] || {
        "查詢結果": "未找到該統編",
        "統一編號": id,
        "提示": "請確認統一編號是否正確"
    };
}

// 顯示對方公司結果
function displayCounterpartyResults(data) {
    const resultContent = document.getElementById("counterpartyContent");
    let html = "";
    
    Object.entries(data).forEach(([key, value]) => {
        html += `
            <div class="result-item">
                <span class="result-label">${key}</span>
                <span class="result-value">${value}</span>
            </div>
        `;
    });
    
    resultContent.innerHTML = html;
}

// 加載模擬數據（保留原有函數）
function loadMockData(dataType) {
    const mockData = {
        "Grobest_Profile": {
            "公司名稱": "全興水產飼料股份有限公司",
            "統一編號": "12345678",
            "公司位址": "台灣高雄市前鎮區中山二路100號",
            "營業項目": "水產飼料製造及銷售",
            "負責人": "王小明",
            "資本額": "新台幣50,000,000元",
            "成立日期": "2010年3月15日",
            "營業狀態": "正常營業",
            "特許行業": "水產飼料（適用《飼料管理法》）"
        }
    };
    
    return mockData[dataType] || null;
}

// 搜索公司信息的主要函數（保留供其他頁面使用）
async function onSearch(companyName) {
    if (!companyName) return;
    
    const loadingDiv = document.getElementById("loadingAnimation");
    const loadingText = document.getElementById("loadingText");
    
    if (!loadingDiv) return;
    
    loadingDiv.style.display = "block";
    loadingText.textContent = "正在連線至政府商工登記 API...";
    
    await sleep(1500);
    
    if (companyName.includes("全興")) {
        loadingText.textContent = "偵測到特許行業：水產飼料，加載《飼料管理法》...";
        await sleep(1000);
        const mockData = loadMockData("Grobest_Profile");
        
        if (loadingDiv) loadingDiv.style.display = "none";
    } else {
        if (loadingDiv) loadingDiv.style.display = "none";
    }
}

// 添加滑動動畫
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
