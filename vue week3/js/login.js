
//外部載入 vue cdn 掛載至 createApp
import { createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';



//先建立 Vue環境
createApp({
    data() {
      return {
        // 身分資訊
        user: {
          "username": '',
          "password": ''
        },
      }
    },
methods: {
    //串接登入api  用 post 
    login() {
       const apiUrl  = "https://vue3-course-api.hexschool.io/admin/signin";
        axios.post(apiUrl,this.user)
         .then( res => {
              if( res.data.success) {
                //登入成功，把 rse.data 內 token、expired 的值 回傳至 const { token, expired } 變數中
                const { token, expired} = res.data; 
                // 寫入 cookie token
                // expired 設置有效時間
                document.cookie = `token=${token};expires=${new Date(expired)};`
                window.location = 'products.html';
                alert(res.data.message);
              }else{
                alert(res.data.message);
              }
         })
         .catch(err =>{
             console.log(err);
         });
    },
},
}).mount('#app');


