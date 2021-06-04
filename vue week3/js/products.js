import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

// 宣告 productModal 為接近全域變數
let productModal = '';
let delProductModal = '';
//  建立vue環境
//  利用 es module 方式 導入 vue cdn 至 createApp 並將 應用程式 掛載至 app 物件中 ，
const app = createApp({
    data() {
        return {
           apiUrl: 'https://vue3-course-api.hexschool.io/api',
           apiPath: 'jimmytest',
           products: [],
           isNew: false,
           temProduct: {
                         imagesUrl: [],
                       },
        } 
    },
    mounted() {
        // 取出登入畫面存取在資料庫的 token 值
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

        //針對網頁載入驗證token
        if (token === '') {
            alert('您尚未登入請重新登入');
            window.location = 'login.html';
        }
 
       // 把token存取在header.Authorization 並發送請求給伺服器驗證
       axios.defaults.headers.common.Authorization = token;

       // bootstrap 實體化 , 把 productModal元件在載入畫面時，回傳至全域變數 productModal
       // 產品視窗
       productModal = new bootstrap.Modal(document.getElementById('productModal'));
       // 刪除產品視窗
       delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
       this.getProducts();
    },
    methods: {
        // 取得產品列表
        getProducts(page=1) {
             const url = `${this.apiUrl}/${this.apiPath}/admin/products?page=${page}`;
             axios.get(url)
              .then( res => {
                  console.log(res);  // 測試 串接資訊
                if( res.data.success) {
                      this.products = res.data.products;   
                }else{
                   alert(res.data.message);
                };
              })
             .catch( err=>{
                 console.log(err);
             })
        },
        // 開啟功能視窗
        openModal(isNew, item) {
          //判斷是否點擊到按鈕
          if( isNew === 'new') {  // 新增產品
         // 打開  建立新的產品，把原先 temProduct 清空
            this.temProduct = {};
            this.isNew = true;
        // 透過 html標籤 @click="openModal" 方法觸發 productModal.show();
            productModal.show();
          }else if( isNew === 'edit') {           // 編輯產品
            this.temProduct = {...item};
            this.isNew = false;
            productModal.show();
          }else if( isNew === 'delete') {
            this.temProduct = {...item};
            delProductModal.show();
          };
          
        },
        // 刪除產品
        delProduct() {
            const url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.temProduct.id}`;

            axios.delete(url)
             .then(res => {
               if(res.data.success) {
                   alert(res.data.message);
                   delProductModal.hide();
                   this.getProducts();                   
               }else{
                   alert(res.data.message)
               }
             })
             .catch(err => {
                 console.log(err);
             })
        },
        // 新增圖片
        createImages() {
            this.temProduct.imagesUrl = [];
        },
        // 更新狀態
        updateProduct() {
            let url = `${this.apiUrl}/${this.apiPath}/admin/product`;
            let method = 'post';
           
            // 如果isNew 不是新增產品 isNew(true)，則用 put~
            if(!this.isNew) {
                url =`${this.apiUrl}/${this.apiPath}/admin/product/${this.temProduct.id}`;
                method = 'put';
            };

             
            axios[method](url,{data: this.temProduct})
             .then(res => {
                 if( res.data.success){
                    console.log(res);
                    alert(res.data.message);
                    this.getProducts();
                    productModal.hide();
                 }else{
                     alert(res.data.message);
                 }
             })
             .catch( err => {
                 console.log(err);
             })
        },
    },
});

app.mount('#app');  // 將寫好的app vue.js 掛載至 html  id的app標籤上進行載入