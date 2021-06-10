//  導入 productModal 元件 
import productModal from'./productModal.js';

//  api
const  apiUrl = 'https://vue3-course-api.hexschool.io';
const  apiPath = 'jimmytest';
          

const app = Vue.createApp({
  data() {
    return {
      // 讀取效果
      loadingStatus:{
        loadingItem: '',
      },
      // 產品列表
      products: [],
      //  props 傳遞到內層的暫存資料夾
      product: {},
      // 表單結構
      form:{
        user: {
           email: '',
           name: '',
           address: '',
           tel: '',
      },
           message: '',
    },
    // 購物車列表
     cart: {},
    };
  },
  methods: {
    // 取得產品列表
    getProducts(){
        const api = `${apiUrl}/api/${apiPath}/products`;
        axios.get(api)
          .then( res => {
            if(res.data.success) {
                console.log(res.data.products);
                this.products = res.data.products;
            }else{
                 alert(res.data.message);
            };
          })
          .catch(err => {
              console.log( err );
          })
    },
    // 取得單一產品內容
    openModal(item) {
      this.loadingStatus.loadingItem = item.id;  
      const api = `${apiUrl}/api/${apiPath}/product/${item.id}`;
      axios.get(api)
       .then( res => {
           console.log( res );
           if(res.data.success) {
            this.product = res.data.product;
            this.loadingStatus.loadingItem = ''; // 解除 關閉讀取效果
            this.$refs.userProductModal.openModal();
           }else{
               alert(res.data.message);
           }
       })
       .catch(err => {
           console.log(err);
       })
    },
    // 加入購物車 (傳入產品id，數量qty)
    addCart(id, qty = 1) {
    this.loadingStatus.loadingItem = id;  
    //  定義購物車變數 把 product_id , qty 存放在一起
     const cart = {
       product_id: id,
       qty
     };

     const api = `${apiUrl}/api/${apiPath}/cart`;
     axios.post(api , { data: cart })
      .then( res => {
        if( res.data.success){
          // console.log(res);
          this.loadingStatus.loadingItem = ''; 
          this.$refs.userProductModal.hideModal();
          alert(res.data.message);
          this.getCart();
        }else{
          alert(res.data.message);
        }
      })
      .catch( err => {
         console.log( err);
      })
    },
    // 取得購物車列表
    getCart() {
     const api = `${apiUrl}/api/${apiPath}/cart`;
     axios.get(api)
      .then( res => {
         if ( res.data.success) {
            this.cart = res.data.data;
         }else{
            alert(res.data.message);
         }
      })
      .catch( err => {
         console.log(err);
      })
    },
    // 更新購物車品項 put 要帶入 {data: { product_id: , qty: }}
    updateCart(item) {
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`
      const cart = {
        product_id: item.product.id,
        qty: item.qty
      };
      axios.put(api, {data: cart}) 
       .then(res => {
        //  console.log(res);
           if(res.data.success) {
            this.loadingStatus.loadingItem = '';
            alert(res.data.message);
            this.getCart();
           }else{
            alert(res.data.message);
           }
       })
       .catch( err => {
           console.log(err);
       })
    },
    // 清空購物車
    deleteAllCarts() {
      const api = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(api)
       .then( res => {
          if(res.data.success) {
            alert(res.data.message);
            this.getCart();
          }else{
            alert(res.data.message);
          }
       })
       .catch(err => {
         console.log(err);
       })
    },
    // 刪除特定購物車產品
    removeCartItem(id) {
      const api = ` ${apiUrl}/api/${apiPath}/cart/${id}`;
      axios.delete(api)
       .then( res => {
            if(res.data.success) {
               alert(res.data.message);
               this.getCart();
            }else{
               alert(res.data.message);
            }
       })
       .catch( err => {
         console.log( err );
       }) 
    },
    // 送出表單
    createOrder() {
      const api = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios.post(api,{data: order})
       .then( res => {
         if(res.data.success) {
            alert(res.data.message);
            this.$refs.form.resetForm();
            this.getCart();
         }else{
           alert(res.data.message);
         }
       })
    }
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});


// 驗證規則
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);


// userProductModal 元件註冊
app.component('userProductModal',productModal);
app.mount('#app');