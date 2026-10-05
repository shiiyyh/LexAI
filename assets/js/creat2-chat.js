// creat2.html 聊天邏輯

// 養殖生產設備買賣合約範本
const AQUACULTURE_CONTRACT = `
====================================================================
                  養殖生產設備買賣合約
====================================================================

立契日期：115 年 01 月 09 日

買方：全興國際水產股份有限公司 (以下稱「買方」)
賣方：百川水產養殖有限公司 (以下稱「賣方」)

前言：
  買賣雙方依平等互利原則，就養殖生產設備買賣事項，經協商議定，
  特立此契約，共同遵守。

第一章 標的物
────────────────────────────────────

第一條 標的物說明
  本合約標的物為以下養殖生產設備：

  設備名稱：自動化循環水過濾系統
  型號/規格：GB-RAS-2026 專業型
  數量：1 套
  單價：新台幣 1,500,000 元

第二章 價款及付款方式
────────────────────────────────────

第三條 合約價款
  本合約標的物之總價款為新台幣：1,500,000 元（含稅）

第四條 付款方式
  一、定金：簽約時支付合約價款之 30%，金額為 450,000 元。
  二、尾款：驗收合格後七日內支付 70%，金額為 1,050,000 元。
  三、付款方式：☑ 匯款至指定帳戶

第三章 交付及運送
────────────────────────────────────

第六條 交付地點
  標的物交付地點：桃園市桃園區中正路 1071 號 14 樓之 1
  由 ☑ 賣方 負責運送，運送費用由 ☑ 賣方 承擔。

第四章 保固及責任
────────────────────────────────────

第八條 保固期限
  賣方對標的物提供自交付日起 24 個月之保固期限。

第五章 違約責任
────────────────────────────────────

（按原條款執行）

第七章 其他約定
────────────────────────────────────

第十五條 爭議解決
  本合約發生爭議時，雙方應本誠信原則協商解決。協商不成時，
  同意提交 臺灣桃園地方法院 審理。

第十七條 補充條款（王小明針對風險的加強）

主體適格擔保：
  賣方聲明其雖處於解散清算期間，但本交易所涉設備之處分係為清算
  目的所必需。賣方保證清算人已獲合法授權簽署本合約。

權利無瑕疵：
  賣方保證標的物無任何抵押或查封情事，若有第三人主張權利，由
  賣方負損害賠償之責。

第八章 簽署
────────────────────────────────────

買方簽署：全興國際水產股份有限公司
          （公司章）
代表人：陳烱芳
聯絡電話：03-316-XXXX

賣方簽署：百川水產養殖有限公司（清算中）
          （公司章）
清算人/代表人：[請填寫名字]
聯絡電話：[請填寫]


====================================================================
                    合約終畢
====================================================================
`;

// 初始化聊天
function initializeChat() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
}

// 發送訊息
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const chatSection = document.getElementById('chatSection');
    
    if (!messageInput) return;
    
    const message = messageInput.value.trim();
    if (!message) return;
    
    // 顯示使用者訊息
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user-message';
    userMessageDiv.innerHTML = `<p>${escapeHtml(message)}</p>`;
    chatSection.appendChild(userMessageDiv);
    
    // 清空輸入框
    messageInput.value = '';
    
    // 顯示加載動畫
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message system-message';
    loadingDiv.id = 'loadingMessage';
    loadingDiv.innerHTML = `
        <div class="loading-animation">
            <div class="spinner"></div>
            <p>正在生成合約...</p>
        </div>
    `;
    chatSection.appendChild(loadingDiv);
    chatSection.scrollTop = chatSection.scrollHeight;
    
    // 模擬 AI 回復延遲
    setTimeout(() => {
        respondToMessage(message, loadingDiv, chatSection);
    }, 1500);
}

// 回應訊息
function respondToMessage(message, loadingDiv, chatSection) {
    let response = '';
    
    // 根據輸入內容決定回應
    if (message.includes('養殖') || message.includes('水產') || message.includes('飼料') || 
        message.includes('設備') || message.includes('買賣') || message.includes('合約')) {
        response = `
            <p>好的！我已為您生成 <strong>養殖生產設備買賣合約</strong>。</p>
            <p>這份合約涵蓋以下主要內容：</p>
            <ul style="margin: 15px 0; padding-left: 30px; color: #bdc3c7;">
                <li>標的物說明與規格</li>
                <li>價款及付款方式</li>
                <li>交付地點及運送責任</li>
                <li>保固期限及保固範圍</li>
                <li>違約責任條款</li>
                <li>爭議解決機制</li>
            </ul>
            <p>合約範本如下所示，您可根據實際情況填寫相關資訊。</p>
        `;
    } else {
        response = `
            <p>感謝您的詢問！我已為您準備了 <strong>養殖生產設備買賣合約</strong> 範本。</p>
            <p>此範本適用於水產養殖、飼料生產等相關設備的買賣交易。</p>
            <p>合約內容詳見下方。</p>
        `;
    }
    
    // 移除加載動畫
    loadingDiv.innerHTML = response;
    loadingDiv.removeAttribute('id');
    chatSection.scrollTop = chatSection.scrollHeight;
    
    // 短暫延遲後顯示合約範本
    setTimeout(() => {
        displayContractTemplate(chatSection);
    }, 500);
}

// 顯示合約範本
function displayContractTemplate(chatSection) {
    const contractDiv = document.createElement('div');
    contractDiv.className = 'chat-message system-message contract-template';
    contractDiv.innerHTML = `
        <pre style="background: #2c3e50; padding: 20px; border-radius: 8px; overflow-x: auto; color: #ecf0f1; font-size: 12px; line-height: 1.6;">
${AQUACULTURE_CONTRACT}
        </pre>
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #34495e;">
            <button onclick="downloadContract()" style="
                padding: 10px 20px;
                background: #27ae60;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
            ">
                <i class="fas fa-download"></i> 下載 Word 版本
            </button>
            <button onclick="printContract()" style="
                padding: 10px 20px;
                background: #3498db;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-left: 10px;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
            ">
                <i class="fas fa-print"></i> 列印
            </button>
        </div>
    `;
    chatSection.appendChild(contractDiv);
    chatSection.scrollTop = chatSection.scrollHeight;
}

// HTML 轉義
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 下載合約
function downloadContract() {
    // 產生 HTML 格式的 Word 文檔
    const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
    <head>
        <meta charset="UTF-8">
        <title>養殖生產設備買賣合約</title>
        <style>
            body {
                font-family: "Microsoft JhengHei", Arial, sans-serif;
                margin: 20px;
                line-height: 1.8;
            }
            pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                font-family: "Microsoft JhengHei", Arial, sans-serif;
            }
        </style>
    </head>
    <body>
        <pre>${AQUACULTURE_CONTRACT}</pre>
    </body>
    </html>
    `;
    
    const element = document.createElement('a');
    const file = new Blob([htmlContent], {type: 'application/msword'});
    element.href = URL.createObjectURL(file);
    element.download = '養殖生產設備買賣合約.doc';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// 列印合約
function printContract() {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>養殖生產設備買賣合約</title>
            <style>
                body { font-family: "Microsoft JhengHei", Arial; margin: 20px; }
                pre { white-space: pre-wrap; word-wrap: break-word; }
            </style>
        </head>
        <body>
            <pre>${AQUACULTURE_CONTRACT}</pre>
        </body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}
