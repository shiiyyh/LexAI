// 對方公司資訊查詢共用模塊

// 模擬商工登記查詢
async function queryCounterpartyInfo(id, pageSuffix = '') {
    const suffix = pageSuffix ? pageSuffix : '';
    const loadingDiv = document.getElementById(`counterpartyLoading${suffix}`);
    const loadingText = document.getElementById(`counterpartyLoadingText${suffix}`);
    const results = document.getElementById(`counterpartyResults${suffix}`);
    
    if (!loadingDiv || !results) {
        console.warn(`找不到 ID 為 counterpartyLoading${suffix} 或 counterpartyResults${suffix} 的元素`);
        return;
    }
    
    // 顯示加載動畫
    loadingDiv.style.display = "block";
    results.style.display = "none";
    loadingText.textContent = "正在連線商工登記資料庫...";
    
    await sleep(1200);
    
    // 模擬檢測特許行業
    if (id === "12345678" || id.includes("全興")) {
        loadingText.textContent = "偵測到特許行業：水產飼料，加載《飼料管理法》...";
        await sleep(800);
    }
    
    loadingDiv.style.display = "none";
    
    // 取得模擬數據
    const mockData = getMockCounterpartyData(id);
    
    // 顯示結果
    displayCounterpartyResults(mockData, pageSuffix);
    results.style.display = "block";
}

// 獲取模擬的對方公司數據
function getMockCounterpartyData(id) {
    // 模擬數據庫
    const mockDatabase = {
        "54588421": {
            "統一編號": "54588421",
            "公司名稱": "百川水產養殖有限公司",
            "公司所在地": "臺中市石岡區豐勢路1巷4號1樓",
            "公司狀況": "解散(109年05月08日府授經商字 第1090725546號)",
            "資本總額(元)": "1,000,000",
            "登記機關": "臺中市政府",
            "核准設立日期": "102年08月16日",
            "最後核准變更日期": "109年05月07日",
            "停業日期(起)": "108年03月19日",
            "停業日期(迄)": "109年03月18日",
            "所營事業資料": "A301030水產養殖業、A302020漁業服務業、F101050水產品批發業、F201030水產品零售業、F401010國際貿易業、I101070農﹑林﹑漁﹑畜牧顧問業、ZZ99999除許可業務外,得經營法令非禁止或限制之業務"
        },
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
function displayCounterpartyResults(data, pageSuffix = '') {
    const resultContent = document.getElementById(`counterpartyContent${pageSuffix}`);
    if (!resultContent) {
        console.warn(`找不到 ID 為 counterpartyContent${pageSuffix} 的元素`);
        return;
    }
    
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

// 處理對方公司查詢
function handleCounterpartyQuery(pageSuffix = '') {
    const suffix = pageSuffix ? pageSuffix : '';
    const input = document.getElementById(`counterpartyId${suffix}`);
    if (!input) {
        console.warn(`找不到 ID 為 counterpartyId${suffix} 的元素`);
        return;
    }
    
    const id = input.value.trim();
    if (!id) {
        alert("請輸入統一編號");
        return;
    }
    
    queryCounterpartyInfo(id, suffix);
}

// 使用查詢結果
function useCounterpartyInfo(pageSuffix = '') {
    const suffix = pageSuffix ? pageSuffix : '';
    const resultContent = document.getElementById(`counterpartyContent${suffix}`);
    
    if (!resultContent) {
        console.warn(`找不到 ID 為 counterpartyContent${suffix} 的元素`);
        return;
    }
    
    // 提取公司名稱
    let companyName = "未知公司";
    const resultItems = resultContent.querySelectorAll(".result-item");
    resultItems.forEach(item => {
        const label = item.querySelector(".result-label").textContent;
        if (label === "公司名稱") {
            companyName = item.querySelector(".result-value").textContent;
        }
    });
    
    // 儲存對方公司資訊到 localStorage
    const counterpartyData = {};
    resultItems.forEach(item => {
        const label = item.querySelector(".result-label").textContent;
        const value = item.querySelector(".result-value").textContent;
        counterpartyData[label] = value;
    });
    
    localStorage.setItem("selectedCounterparty", JSON.stringify(counterpartyData));
    console.log("✓ 已選擇對方公司:", companyName);
    alert(`已選擇對方公司：${companyName}`);
}

// 延遲函式
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 為頁面設置事件監聽器
function setupCounterpartyListeners(pageSuffix = '') {
    const suffix = pageSuffix ? pageSuffix : '';
    const queryBtn = document.getElementById(`queryBtn${suffix}`);
    const useBtn = document.getElementById(`useCounterpartyBtn${suffix}`);
    const input = document.getElementById(`counterpartyId${suffix}`);
    
    if (queryBtn) {
        queryBtn.addEventListener("click", () => {
            handleCounterpartyQuery(suffix);
        });
        console.log(`✓ 查詢按鈕事件已綁定 (${suffix})`);
    }
    
    if (useBtn) {
        useBtn.addEventListener("click", () => {
            useCounterpartyInfo(suffix);
        });
        console.log(`✓ 使用按鈕事件已綁定 (${suffix})`);
    }
    
    if (input) {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                handleCounterpartyQuery(suffix);
            }
        });
        console.log(`✓ 輸入框 Enter 鍵已綁定 (${suffix})`);
    }
}
