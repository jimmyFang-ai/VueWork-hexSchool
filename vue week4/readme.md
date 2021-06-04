
## 開發流程
   w3
- 準備模板 v
- 登入功能 v
- 產品列表 v
  -  js: 串接 get api 取得資料   html: 使用 "vue指令"將綁定資料到畫面上 
- 新增產品
  - 開啟 Modal V
  - 新增品項 V
- 更新產品  V
- 刪除產品    
  
-------------

w4 元件化 component
   component定義: 掛載在createApp後， app.mount前


  
- 拆分步驟 pagination : pagination註冊元件 → 透過props 傳遞資料 → $emit 將 資料送出 → 封裝js → 匯入 pagination.js，並註冊在app(父層)

pagination 分頁功能 
(資料傳遞方法: 先定義外部元件資料，再傳入內部元件，最後做接收橋梁)【口訣:前內元件後外元件】
    1. js(方法): 先註冊 pagination 元件 app.componet (pagination)  , html(畫面): 用div包覆樣板(boostrap 分頁模板)
    2. 使用prosp( 接收app(父層) 的資料傳入 pagination(子層) 並儲存):   將"外部data的 pagination 資料" ，傳入"內部 pagination元件"
    3. 使用 $emit( 做換頁功能): 將內部元件資料(pagination)利用methods 傳遞至外部元件(app)
    4. 利用boostrap套件使用 :class={'active': item === page.current_page} 做樣式， 提升使用者體驗
    5. 切換往前、往後頁的功能:  利用$emit做功能換頁，並做邏輯判斷(避免點擊到最前或最後頁還能點擊的bug)
    6. 封裝 pagination的元件， 透過esmodule，預設匯出pagination.js進行,並在app(父層)，註冊"pagination的區域元件"再匯入


- 拆分步驟 productModal :  product Modal 註冊元件 →透過props傳遞資料→ $emit 將 資料送出→ 封裝productModal.js→ 匯入 product Modal js，並註冊在app(父層)

  <!-- 1.(資料) 註冊 productModal 全域元件  ， (畫面) html : 用 <product-modal></product-modal> 標籤渲染元件資料-->
  2. props: js: 傳遞app(父層)的tempProduct的資料→傳遞→ productModal(子層)的 tempProduct的資料
            html: 綁定資料在product-modal 的html標籤上，建立資料傳遞橋梁  :tem-product="tempProduct"
     $emit:  js: 透過  productModal(子層) 內的 updateProduct方法把 tempProduct資料 → 傳遞→ app(父層)  
                 js: @click="$emit('update-product', tempProduct)" , 每個tempProduct 資料都是獨立，必須再傳送至app(父層)
                 html: @update-product="updateProduct"
  
  3. 修正bug: imageUrl讀取不到:  建立methods: 把app(父層)的createImages方法,
              帶到productModal(子層)的methods
             
              
