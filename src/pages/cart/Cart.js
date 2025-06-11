import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import axios from 'axios';
import Cookies from "js-cookie";

const Cart =  ({items}) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.count, 0);
  const navigate = useNavigate();
  const [basket_items, setbasket_items] = useState('');
  let adding_good = false;
  useEffect(() => {
    if (adding_good){
      return;
    }
    else{
      adding_good = true;
    }
    items.length = 0;
    // React advises to declare the async function directly inside useEffect
    async function getbasket_items() {
      const headers = {
        "Content-Type": "application/json"
      };
      const user_id = Cookies.get('api_key');
      let url = "https://projectprakticum-production.up.railway.app/api/v1/basket?user_id=" + user_id;
      const basket = await axios.get(url, {headers});
      url = "https://projectprakticum-production.up.railway.app/api/v1/basketItem/?basket_id=" + basket.data.id;
      const basketItems = await axios.get(url, {headers});
      const items_basket = basketItems.data;
      for (const item of items_basket) {
        url = "https://projectprakticum-production.up.railway.app/api/v1/goods/" + item.goodId;
        const good = await axios.get(url, {headers});
        if (items.filter(obj => { return obj.id === item.goodId; }).length > 0)
        {
          const cartItems = items.filter(obj => { return obj.id === item.goodId; })[0];
          cartItems.count = cartItems.count + 1;
        }
        else {
          const element_data = good.data;
          element_data.count = 1;
          element_data.image = `data:image/jpg;base64,${[element_data.image]}`;
          items.push(element_data);
        }
      }
      adding_good = false;
    };

    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (!basket_items) {
      getbasket_items();
    }
  }, []);

  const handleOrder = () => {
    navigate('/payment', {state: {totalPrice, cartItems: items}});
  };
  async function onRemove(id) {
    const headers = {
      "Content-Type": "application/json"
    };
    const user_id = Cookies.get('api_key');
    let url = "https://projectprakticum-production.up.railway.app/api/v1/basket?user_id=" + user_id;
    const basket = await axios.get(url, {headers});
    url = "https://projectprakticum-production.up.railway.app/api/v1/basketItem?good_id=" + id + "&basket_id=" + basket.data.id;
    const delete_basket = await axios.delete(url, {headers});
    window.location.reload();
  }
  return (
      <div style={styles.container}>
        <h2 style={styles.title}>Корзина</h2>
        {items.length === 0 ? (
            <p style={styles.emptyMessage}>Корзина пуста</p>
        ) : (
            <div style={styles.grid}>
              {items.map((item) => (
                  <div key={item.id} style={styles.card}>
                    <button                                                                 // кнопка удаления
                        style={styles.removeButton}                                           // кнопка удаления
                        onClick={() => onRemove(item.id)}                                     // кнопка удаления
                        aria-label="Удалить товар"                                            // кнопка удаления
                    >
                      ×
                    </button>
                    <div style={styles.imageWrapper}>
                      <img
                          src={item.image ? item.image : ''}
                          alt={item.name}
                          style={styles.image}
                      />
                    </div>
                    <div style={styles.info}>
                      <div style={styles.name}>{item.name}</div>
                      <div style={styles.price}>{item.price} ₽</div>
                      <div style={styles.count}>Количество: {item.count}</div>
                    </div>
                  </div>
              ))}
            </div>
        )}
        {items.length > 0 && (
            <>
              <h3 style={styles.total}>Общая сумма: {totalPrice} ₽</h3>
              <Button style={{...styles.button, marginTop: '20px'}} onClick={handleOrder}>
                Оформить заказ
              </Button>
            </>
        )}
      </div>
  );
};
const styles = {
  container: {
    maxWidth: '1600px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor:'#f0f2f5', // фон из Add.js
    fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // шрифт из Add.js
    boxSizing:'border-box'
  },
  title: {
    marginBottom:'20px',
    fontSize:'28px',
    textAlign:'center',
    color:'#333'
  },
  emptyMessage:{
    fontSize:'18px',
    color:'#555',
    textAlign:'center'
  },
  grid: {
    display:'grid',
    gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',
    gap:'20px',
    marginTop:'60px',
    justifyContent:'center'
  },
  card: {
    backgroundColor:'#fff',
    borderRadius:'12px',
    boxShadow:'0 6px 16px rgba(0,0,0,0.15)',
    overflow:'hidden',
    cursor:'pointer',
    display:'flex', 
    flexDirection:'column',
    width:'100%',
    maxWidth:'375px',
    height:'450px',
    boxSizing:'border-box'
  },
  // removeButton: {
  //   position: 'absolute',
  //   top: '10px',
  //   right: '10px',
  //   background: 'transparent',
  //   border: 'none',
  //   fontSize: '24px',
  //   color: '#999',
  //   cursor: 'pointer',
  //   zIndex: 1,
  //   lineHeight: '1',
  //   transition: 'color 0.2s ease',
  // },
  imageWrapper:{
    width:'100%',
    height:'300px',
    display:'flex', 
    alignItems:'center', 
    justifyContent:'center'
},
image:{
width:'100%',
height:'100%',
objectFit:'cover'
},
info:{
padding:'20px', 
flexGrow:'1'
},
name:{
fontSize:'20px', 
fontWeight:'600', 
marginBottom:'12px'
},
price:{
fontSize:'20px', 
fontWeight:'bold', 
marginRight:'15px', 
color:'#111'
},
quantity:{
marginTop:'8px', 
fontSize:'16px', 
color:'#555'
},
total:{
marginTop:'30px', 
fontSize:'24px', 
fontWeight:'600'
},
button:{
 backgroundColor:'#4CAF50', // цвет кнопки из Add.js
 color:'#fff', // цвет текста кнопки
 borderRadius:'8px',
 cursor:'pointer',
 transition:'background-color 0.3s ease'
}
};

export default Cart;
