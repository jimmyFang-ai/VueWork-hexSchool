export default {
template: `<div class="modal fade" id="productModal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
     <div class="modal-dialog modal-xl" role="document">
       <div class="modal-content border-0">
         <div class="modal-header bg-dark text-white">
           <h5 class="modal-title" id="exampleModalLabel">
             <span>{{ temprodcut.title }}</span>
           </h5>
           <button type="button" class="btn-close"
                   data-bs-dismiss="modal" aria-label="close"></button>
         </div>
         <div class="modal-body">
           <div class="row">
             <div class="col-sm-6">
               <img class="img-fluid" :src="temprodcut.imagesUrl" alt="">
             </div>
             <div class="col-sm-6">
               <span class="badge bg-primary rounded-pill">{{ temprodcut.category }}</span>
               <p>商品描述：{{ temprodcut.description }}</p>
               <p>商品內容：{{ temprodcut.content }}</p>
               <div class="h5">{{ temprodcut.origin_price }} 元</div>
               <div>
                 <div class="input-group">
                   <input type="number" class="form-control"
                         v-model.number="qty" min="1">
                   <button type="button" class="btn btn-primary"
                           @click="$emit('add-to-cart', temprodcut.id, qty)">加入購物車</button>
                 </div>
               </div>
             </div>
             <!-- col-sm-6 end -->
           </div>
         </div>
       </div>
     </div>
   </div>`,
// 傳遞資料 product
props: ['product'],
data() {
    return {
        status: {},
        temprodcut: {},
        modal: '',
        qty:  1
    };
},
// 監聽  product (透過props傳進來的變數) 
watch: {
    product(){
        // 監聽 product 變數得值有更動時，並把傳進來的變數 存取到 temprodcut 
        this.temprodcut = this.product; // 避免單向數據流
    },
},
mounted() {
    // 把 modal 實體化
    this.modal =  new bootstrap.Modal(this.$refs.modal);
},
methods: {
    openModal() {
        this.modal.show();
    },
    hideModal() {
        this.modal.hide();
    },
  },
};

