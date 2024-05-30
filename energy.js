const axios = require('axios');
const config = require('./config.js');
const {priceEnergydata,energData,propertyOrder}=require('./price.js')
//查询能量余额
function getbalance(trxnum=0,callback){
    axios.get('https://web.apitrx.com/balance', {
        params: {
            apikey: config.energyKey
        }
      })
      .then(function (response) {
        const balance=response.data.data.balance
        if(Number(balance)<trxnum){
            console.log('余额不足')
            bot.sendMessage(config.adminid, `能量余额不足`, {
                parse_mode: "HTML"
            })
            return false
        }else{
            callback()
        }
      })
}

//计算能量价格
function entrylPrice(pen,time){
    let orderData={}
    pen=Number(pen)
    time=Number(time)
   
    for(var key in priceEnergydata) {
        if(priceEnergydata[key].pen===pen&&priceEnergydata[key].time===time){
            orderData.energ=priceEnergydata[key].value
            orderData.trx=key
        }
    }
if(time===0){
    orderData.entrytime=0
}else{
    orderData.entrytime=time/24>=1?`${time/24}天`:'1 小时'
}

return orderData
}

//计算能量usdt价格
function entryusdtlPrice(pen,time){
    let orderData={}
    pen=Number(pen)
    time=Number(time)
    for(var key in energData) {
        if(energData[key].pen===pen&&energData[key].time===time){
            orderData.energ=energData[key].value
            orderData.usdt=key
        }
    }
    orderData.entrytime=0

return orderData
}

module.exports = {
    getbalance,
    entrylPrice,
    entryusdtlPrice
  };