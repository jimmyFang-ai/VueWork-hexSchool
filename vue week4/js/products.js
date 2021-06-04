import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

// 預設匯入 pagination.js
import pagination from './pagination.js';


// 宣告 productModal 為接近全域變數
let productModal = '';
let delProductModal = '';

//  建立vue環境
//  利用 es module 方式 導入 vue cdn 至 createApp 並將 應用程式 掛載至 app 物件中 ，
const app = createApp({
  // 註冊區域元件 pagination
   components: {
     pagination
    },
    data() {
        return {
           apiUrl: 'https://vue3-course-api.hexschool.io/api',
           apiPath: 'jimmytest',
           products: [],
           pagination: {},
           isNew: false,
           tempProduct: {
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
                      this.pagination = res.data.pagination;  
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
            this.tempProduct = {};
            this.isNew = true;
        // 透過 html標籤 @click="openModal" 方法觸發 productModal.show();
            productModal.show();
          }else if( isNew === 'edit') {           // 編輯產品
            this.tempProduct = {...item};
            this.isNew = false;
            productModal.show();
          }else if( isNew === 'delete') {
            this.tempProduct = {...item};
            delProductModal.show();
          };
          
        },
        // 刪除產品
        delProduct(tempProduct) {
            const url = `${this.apiUrl}/${this.apiPath}/admin/product/${tempProduct.id}`;

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
        // 更新狀態
        updateProduct(tempProduct) {
            let url = `${this.apiUrl}/${this.apiPath}/admin/product`;
            let method = 'post';
           
            // 如果isNew 不是新增產品 isNew(true)，則用 put~
            if(!this.isNew) {
                url =`${this.apiUrl}/${this.apiPath}/admin/product/${tempProduct.id}`;
                method = 'put';
            };

             
            axios[method](url,{data: tempProduct})
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

// 註冊productmodal 元件
app.component('productModal',{
  props: ['tempProduct'], //內 、外層元件都是 "tempProduct"
  template:` <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
  aria-hidden="true">
<div class="modal-dialog modal-xl">
 <div class="modal-content border-0">
   <div class="modal-header bg-dark text-white">
     <h5 id="productModalLabel" class="modal-title">
       <span>新增產品</span>
     </h5>
     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
   </div>
   <div class="modal-body">
     <div class="row">
       <div class="col-sm-4">
           <div class="form-group">
             <label for="imageUrl">主要圖片</label>
             <input  v-model="tempProduct.imageUrl" type="text" class="form-control" placeholder="請輸入圖片連結">
             <img :src="tempProduct.imageUrl" class="img-fluid" >
           </div>
           <div class="mb-1">多圖新增</div>
            <!-- 判斷 多圖新增區塊內的tempProduct.imagesUrl 是否為陣列  -->
            <div v-if="Array.isArray(tempProduct.imagesUrl)">
             <div class="mb-1" v-for="(image,key) in tempProduct.imagesUrl" :key="key">
                <div class="form-group">
                  <label for="imageUrl">圖片網址</label>
                  <input  type="text"  class="form-control" placeholder="請輸入圖片連結" v-model="tempProduct.imagesUrl[key]">
                </div>
               <img class="img-fluid" :src="image">
             </div> 
              <!-- 判斷 新增圖片按鈕邏輯，tempProduct.imageUrl.length陣列不能為0 !(falese)  或是 tempProduct.imageUrl.length最後一筆資料  -->
            <div  v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length-1]">
             <!-- 點擊新增圖片按鈕 新增'' 到tempProduct.imagesUrl陣列中 -->
             <button class="btn btn-outline-primary btn-sm d-block w-100" @click="tempProduct.imagesUrl.push('')"> 
               新增圖片
             </button>
           </div> 
           <!-- 如果tempProduct.imageUrl.length陣列 有資料就顯示按鈕 -->
            <div v-else>
              <!-- 點擊刪除圖片按鈕 刪除tempProduct.imagesUrl陣列中 的 最後一筆資料 -->
              <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imagesUrl.pop('')">
               刪除圖片
             </button>
           </div>
          </div> 
          <!-- "空陣列的話 顯示 新增陣列圖片按鈕"，並透過 @click="createImages" 觸發方法，切換為"新增圖片網址即刪除區塊" -->
          <div v-else >
             <button class="btn btn-outline-primary btn-sm d-block w-100"  @click="createImages"
             >新增陣列圖片
             </button>
          </div>
       </div>
       <div class="col-sm-8">
         <div class="form-group">
           <label for="title">標題</label>
           <input id="title" v-model="tempProduct.title" type="text" class="form-control" placeholder="請輸入標題">
         </div>

         <div class="row">
           <div class="form-group col-md-6">
             <label for="category">分類</label>
             <input id="category"  v-model="tempProduct.category" type="text" class="form-control"
                    placeholder="請輸入分類">
           </div>
           <div class="form-group col-md-6">
             <label for="price">單位</label>
             <input id="unit" v-model="tempProduct.unit" type="text" class="form-control" placeholder="請輸入單位">
           </div>
         </div>

         <div class="row">
           <div class="form-group col-md-6">
             <label for="origin_price">原價</label>
             <input id="origin_price" v-model.number="tempProduct.origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價">
           </div>
           <div class="form-group col-md-6">
             <label for="price">售價</label>
             <input id="price"  v-model.number="tempProduct.price" type="number" min="0" class="form-control"
                    placeholder="請輸入售價">
           </div>
         </div>
         <hr>

         <div class="form-group">
           <label for="description">產品描述</label>
           <textarea id="description"  v-model="tempProduct.description" type="text" class="form-control"
                     placeholder="請輸入產品描述">
           </textarea>
         </div>
         <div class="form-group">
           <label for="content">說明內容</label>
           <textarea id="description" v-model="tempProduct.content" type="text" class="form-control"
                     placeholder="請輸入說明內容">
           </textarea>
         </div>
         <div class="form-group">
           <div class="form-check">
             <input id="is_enabled" v-model="tempProduct.is_enabled" class="form-check-input" type="checkbox"
                    :true-value="1" :false-value="0">
             <label class="form-check-label" for="is_enabled">是否啟用</label>
           </div>
         </div>
       </div>
     </div>
   </div>
   <div class="modal-footer">
     <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
       取消
     </button>
     <button type="button" class="btn btn-primary" @click="$emit('update-product', tempProduct)">
       確認
     </button>
   </div>
 </div>
</div>
</div> `,
  methods: {
    // 新增圖片
    createImages() {
      this.tempProduct.imagesUrl = [];
  },
  },
})


app.component('delProductModal',{
  props: ['tempProduct'],
  template:`<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
  aria-labelledby="delProductModalLabel" aria-hidden="true">
<div class="modal-dialog">
 <div class="modal-content border-0">
   <div class="modal-header bg-danger text-white">
     <h5 id="delProductModalLabel" class="modal-title">
       <span>刪除產品</span>
     </h5>
     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
   </div>
   <div class="modal-body">
     是否刪除
     <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
   </div>
   <div class="modal-footer">
     <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
       取消
     </button>
     <button type="button" class="btn btn-danger"  @click="$emit('del-product',tempProduct)">
       確認刪除
     </button>
   </div>
 </div>
</div>
</div>`,
})
app.mount('#app');  // 將寫好的app vue.js 掛載至 html  id的app標籤上進行載入