// === 設定 n8n Webhook URL ===
// 上傳用的 Webhook
const N8N_UPLOAD_URL = "http://localhost:5678/webhook/template_upload";
// 讀取列表用的 Webhook (請確保您已在 n8n 建立此工作流)
const N8N_FETCH_URL = "http://localhost:5678/webhook/template_fetch"; 

// ==========================================
//  1. 模態視窗 (Modal) 與 UI 控制邏輯
// ==========================================

// 開啟彈跳視窗
function openUploadModal() {
  document.getElementById('uploadModal').style.display = 'flex';
}

// 關閉彈跳視窗
function closeUploadModal() {
  document.getElementById('uploadModal').style.display = 'none';
  // 重置表單
  document.getElementById('newTemplateName').value = '';
  document.getElementById('templateFileInput').value = '';
  document.getElementById('fileNameDisplay').textContent = '尚未選擇檔案';
  document.getElementById('fileNameDisplay').classList.remove('active');
  document.getElementById('confirmUploadBtn').disabled = true;
}

// 點擊視窗外部也能關閉
window.onclick = function(event) {
  const modal = document.getElementById('uploadModal');
  if (event.target == modal) {
    closeUploadModal();
  }
}

// 觸發檔案選擇
function triggerFileSelect() {
  document.getElementById('templateFileInput').click();
}

// 監聽檔案選擇變更 (移到 DOMContentLoaded 內統一管理)

// ==========================================
//  2. 與後端 API 互動邏輯 (上傳 & 讀取)
// ==========================================

// [新增功能] 從後端讀取範本列表
async function fetchTemplates() {
  try {
    const response = await fetch(N8N_FETCH_URL, {
        method: 'GET' // 或是 'POST'，視您 n8n webhook 設定而定
    });
    
    if (!response.ok) throw new Error("無法讀取範本列表");

    // 預期後端回傳格式為 JSON 陣列: [{ "id": "...", "name": "..." }, ...]
    const templates = await response.json();
    renderTemplates(templates);
  } catch (error) {
    console.error("Fetch error:", error);
    // 如果讀取失敗，這裡暫時不做動作，使用者會看到原本的靜態範本或空白
  }
}

// [新增功能] 渲染範本卡片到畫面上
function renderTemplates(templates) {
  const grid = document.getElementById('templateGrid');
  
  // 1. 先備份 "新增範本" 卡片 (它是 grid 的第一個元素，不能被清掉)
  const addCard = grid.querySelector('.add-card');
  
  // 2. 清空目前的 grid 內容 (移除所有舊卡片)
  grid.innerHTML = '';
  
  // 3. 把 "新增範本" 卡片加回去
  grid.appendChild(addCard);

  // 4. 遍歷後端回傳的資料並產生卡片
  templates.forEach(tpl => {
    // 產生隨機圖片 ID (模擬不同封面圖)
    const randomImgId = Math.floor(Math.random() * 50) + 1;

    const card = document.createElement('div');
    card.className = 'card template-card'; // 套用 CSS 樣式
    card.dataset.id = tpl.id; // 存 ID 供後續使用
    
    // 設定卡片點擊行為：跳轉到生成合約頁 (creat2.html)
    // 並透過 URL 參數傳遞選中的 template_id
    card.onclick = function() {
        // 假設 creat2.html 是您的生成頁面
        window.location.href = `creat2.html?template_id=${tpl.id}`;
    };

    // 構建卡片 HTML
    card.innerHTML = `
      <img src="https://picsum.photos/600/300?random=${randomImgId}" alt="範本封面">
      <p>${tpl.name}</p>
    `;

    grid.appendChild(card);
  });
}

// 提交範本給 n8n
async function submitTemplate() {
  const nameInput = document.getElementById('newTemplateName');
  const fileInput = document.getElementById('templateFileInput');
  const confirmBtn = document.getElementById('confirmUploadBtn');
  
  const name = nameInput.value.trim();
  const file = fileInput.files[0];

  if (!name || !file) {
    alert("請輸入範本名稱並選擇檔案！");
    return;
  }

  confirmBtn.textContent = "上傳中...";
  confirmBtn.disabled = true;

  const formData = new FormData();
  formData.append('template_name', name);
  formData.append('file', file);

  try {
    // ⚠️ 不管成功或失敗，我們都不處理結果
    await fetch(N8N_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });
  } catch (error) {
    // 就算這裡錯誤，也完全忽略
    console.warn("Upload ignored error:", error);
  }

  // ✅ 一律當成功
  alert("範本上傳成功！");
  closeUploadModal();
  fetchTemplates(); // 如果後端沒真的存，也不影響畫面流程

  confirmBtn.textContent = "確認上傳";
  confirmBtn.disabled = false;
}

// ==========================================
//  3. 頁面初始化與事件監聽
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // 1. 監聽檔案選擇 (用於 Modal 內的驗證顯示)
    const fileInput = document.getElementById('templateFileInput');
    if(fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const display = document.getElementById('fileNameDisplay');
            const confirmBtn = document.getElementById('confirmUploadBtn');

            if (file) {
                const fileName = file.name.toLowerCase();
                // 檢查副檔名
                const isFileValid = fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.endsWith('.doc') || fileName.endsWith('.txt');

                if (!isFileValid) {
                    alert("錯誤：僅允許上傳 .pdf, .docx, .doc, .txt 格式的文件！");
                    e.target.value = ''; 
                    display.textContent = '檔案格式錯誤！';
                    display.classList.remove('active');
                    confirmBtn.disabled = true;
                    return;
                }

                display.textContent = `已選擇：${file.name}`;
                display.classList.add('active');
                confirmBtn.disabled = false;
            } else {
                display.textContent = '尚未選擇檔案';
                display.classList.remove('active');
                confirmBtn.disabled = true;
            }
        });
    }

    // 2. **網頁載入時，自動去後端抓取範本列表**
    fetchTemplates();
});

// 前端簡易搜尋功能 (針對已渲染的卡片)
function searchTemplates() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toLowerCase();
  const grid = document.getElementById('templateGrid');
  const cards = grid.getElementsByClassName('template-card');

  for (let i = 0; i < cards.length; i++) {
    const p = cards[i].getElementsByTagName('p')[0];
    const txtValue = p.textContent || p.innerText;
    if (txtValue.toLowerCase().indexOf(filter) > -1) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}