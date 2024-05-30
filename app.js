/*配置区域 */
var mysql = require('mysql2'); // Copyrigth by @miya0v0 
var pool = mysql.createPool({
    host: 'localhost',
    port: 3306, //mysql 端口
    user: 'root', //mysql 用户名
    password: '12345678', //mysql 密码
    database: 'test01', //mysql 数据库
    multipleStatements: true //不要改这个
});


var TelegramBot = require('node-telegram-bot-api'); // Copyrigth by @miya0v0 
var TronWeb = require('tronweb') // Copyrigth by @miya0v0 
var request = require('request-promise'); // Copyrigth by @miya0v0 
const axios = require('axios');
var moment = require('moment'); // Copyrigth by @miya0v0 
const express=require('express')
const {priceEnergydata,energData}=require('./price.js')
const config = require('./config.js');
const energyFnList=require('./energy.js');


var token = config.token; //机器人 token
var address =config.address;//收款地址
var centeraddress = config.centeraddress;//转账地址
var cunbiaddress = "TC7P8CbcoqoLRfUjvg1ihvNpkL7AwFMWDQ" //存币地址 (不识别这个地址的转账)
var energyaddress=config.energyaddress//能量收款地址
var minCount_USDT =config.minCount_USDT;//usdt 起兑金额
var minCount_TRX = config.minCount_TRX;//trx 起兑金额
var adminid = config.adminid //管理员的 id
var successqunid = config.successqunid; //兑换成功播报的群 id
var yuzhimenkan = config.yuzhimenkan; //单位 TRX
var yuzhiamount = config.yuzhiamount; //预支的 TRX 数量
var lirun = config.lirun //百分比


/*配置区域 */


newordertimestamp_trx = Math.round(new Date()); // Copyrigth by @miya0v0 
apiURL = [
    {
       
        usdt: `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?limit=20&contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`, //这里没有加入 APIKEY，如果需要加入 APIKEY，请自行修改
        trx: `https://api.trongrid.io/v1/accounts/${energyaddress}/transactions?limit=20`,// TRX 兑换 USDT 才需要配置
        energUSDT:`https://api.trongrid.io/v1/accounts/${energyaddress}/transactions/trc20?limit=20&contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`
    },
],
keyboard = [
    [{ text: "🌐兑换TRX" }, { text: "✳️租赁能量" }],
    [{ text: "💰预支TRX" },{ text: "💹U币行情" }],
    [{ text: "📢绑定地址便以接收兑换通知" },{ text: "🏠个人中心" }]
],
start_inline_keyboard = [
    [{ text: "💁在线客服", url: 'https://t.me/Dreamboat21' }, { text: "🌐代开会员", callback_data:'daikaihuiyuan' }],
    [{ text: "💁美工制作", url: 'https://t.me/xiaojia6'  },{text:'笔数套餐', callback_data: 'noTime'}]
    // https://t.me/BuyEnergysBot https://t.me/BuySvipBot
],
sendad_inline_keyboard = [
    [{ text: "🌐兑换TRX",callback_data:'trxdhstart'}, { text: "✳️租赁能量" ,callback_data:'nlzlstart'}],
    [{ text: "💰预支TRX",callback_data:'trxyzstart'}, { text: "💹U币行情" ,callback_data:'bjhqstart'}],
    [{ text: "👁监听地址", callback_data:'jtdzstart' }, { text: "🏠个人中心",callback_data:'grzxstart'}],
    [{ text: "💁在线客服", url: 'https://t.me/Dreamboat21' }, { text: "🌐代开会员", callback_data:'daikaihuiyuan' }],
    [{ text: "💁美工制作", url: 'https://t.me/xiaojia6'  }]
],

bot = new TelegramBot(token, { polling: true });
var urlArray = apiURL[0];
var tronWeb = new TronWeb("https://api.trongrid.io", "https://api.trongrid.io", "https://api.trongrid.io", config.trxPrivateKey);
//var enerytronWeb=new TronWeb("https://api.trongrid.io", "https://api.trongrid.io", "https://api.trongrid.io", config.energytrxPrivateKey);
// 设置定时器，每隔 3 秒执行一次
setInterval(function () {
    listenUSDT(urlArray['usdt']);
    listenTrx(urlArray['trx'])
    listenEngryUSDT(urlArray['energUSDT'])
    //calculateDuihuanbili_TRX()
}, 5000)


  
bot.on('text', (msg) => {
    pool.getConnection(function (err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM users where telegramid = "${msg.from.id}"`, (error, result) => {
            
            if (error) return console.log(error,'5555');
            if (!result[0]) {
                // var inviter_telegramid = msg.text.split(" ")[1];
                // if (!inviter_telegramid || parseInt(inviter_telegramid) % 1 != 0) {
                //     inviter_telegramid = "无邀请人"
                // }
                var inviter_telegramid ="无邀请人"
                connection.query(`Insert into users (username,nickname,telegramid,register_time,inviter_telegramid) values ("${(msg.from.username ? msg.from.username : "")}","${utf16toEntities((msg.from.first_name ? msg.from.first_name : "") + (msg.from.last_name ? msg.from.last_name : ""))}","${msg.from.id}",now(),"${inviter_telegramid}");`, (error, _result) => {
                    connection.destroy();
                    if (error) return console.log(error,'666');
                    main(msg);
                });
            } else {
                connection.query(`update users set username =  "${(msg.from.username ? msg.from.username : "")}",nickname = "${utf16toEntities((msg.from.first_name ? msg.from.first_name : "") + (msg.from.last_name ? msg.from.last_name : ""))}" where telegramid =  "${msg.from.id}";`, (error, _result) => {
                    connection.destroy();
                    if (error) return error;
                    main(msg);
                });
            }
        })
    })
});

// 设置自定义命令
bot.setMyCommands([
    { command: 'start', description: '开始使用' },
  ]);

async function main(msg) {
    if (msg.text.search("/start") == 0) {
        start(msg)
    } else if (msg.text == "🌐兑换TRX") {
        duihuan(msg)
    } else if (msg.text == "💹U币行情") {
        huilv(msg)
    } else if (msg.text == "💰预支TRX") {
        yuzhi(msg)
    }else if (msg.text == "📢绑定地址便以接收兑换通知") {
        bondingAddress(msg)
    } else if (msg.text == "🏠个人中心") {
        usercenter(msg)
    } else if (msg.text == "✳️租赁能量") {
        energyPens(msg)
       // energyRental(msg)
        // bot.sendMessage(msg.chat.id, `租赁能量能够节省 <b>70%</b> 日常 USDT 转账的手续费\n\n点击下方链接立即租赁：\nhttps://t.me/BuyEnergysBot`, {
        //     parse_mode: 'HTML',
        //     reply_to_message_id: msg.message_id
        // });
    }else if (msg.text == "🌐实时汇率") {
        let duihuanbili_TRX = await calculateDuihuanbili_TRX();
        bot.sendMessage(msg.chat.id, `<b>实时汇率：</b>\n100 USDT = ${(duihuanbili_TRX * 100).toFixed(2)} TRX\n\n自动兑换地址：\n<code>${address}</code> (点击地址自动复制)`, {
            parse_mode: 'HTML',
            reply_to_message_id: msg.message_id
        });
    } else if (msg.text == "/admin" && msg.chat.id == adminid) {
        admin(msg)
    } else if (msg.text.search("预支") == 0) {
        bangdingaddress(msg)
    } else if (msg.text.search("绑定") == 0) {
        bindaddress(msg)
    }else if (tronWeb.isAddress(msg.text)) {
        bot.sendMessage(msg.chat.id, '请稍等，正在查询中', {

        })
            .then(res => {
                request(`https://apilist.tronscanapi.com/api/new/token_trc20/transfers?limit=20&start=0&sort=-timestamp&count=true&filterTokenValue=1&relatedAddress=${msg.text}`)
                    .then((body) => {
                        tornPayList = JSON.parse(body).token_transfers;
                        var usdtlist = ""
                        for (let a = 0; a < tornPayList.length; a++) {
                            usdtlist += `${moment(tornPayList[a].block_ts).format("MM-DD HH:mm:ss")} | ${(tornPayList[a].from_address == msg.text) ? "转出" : "转入"} |  ${tornPayList[a].quant / 1000000} USDT\n`
                        }

                        request(`https://apilist.tronscanapi.com/api/accountv2?address=${msg.text}`)
                            .then((body) => {
                                var userList = JSON.parse(body).withPriceTokens;
                                var trxbalance = 0;
                                var usdtbalance = 0;
                                for (let index = 0; index < userList.length; index++) {
                                    if (userList[index].tokenAbbr == "trx") {
                                        trxbalance = userList[index].amount;
                                    }
                                    if (userList[index].tokenId == "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t") {
                                        usdtbalance = userList[index].balance / 1000000;
                                    }

                                }
                                bot.editMessageText(`|            时间            |   类型   |      金额\n<code>${usdtlist}</code>\n\nTRX(可用) :  <code>${trxbalance}</code>\nUSDT :  <code>${usdtbalance}</code>`, {
                                    chat_id: res.chat.id,
                                    message_id: res.message_id,
                                    parse_mode: 'HTML',
                                    reply_markup: {
                                        inline_keyboard: [
                                            [{ text: "🔗 查看链上详细数据", url: `https://tronscan.org/#/address/${msg.text}` }],
                                        ]
                                    }
                                });
                            })
                    })
                    .catch(err => {
                        console.log(err)
                        bot.editMessageText(`请求失败，请稍后尝试！`, {
                            chat_id: res.chat.id,
                            message_id: res.message_id,
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: "🔗 查看链上详细数据", url: `https://tronscan.org/#/address/${msg.text}` }],
                                ]
                            }
                        });
                    })
            })
    }

}

//租赁能量不限时笔数
function energyPens(msg){
    let keyboardData = [
        [{text:'笔数套餐', callback_data: 'noTime'},{text:'限时套餐', callback_data: 'limitTime'}]
    ]
        bot.sendMessage(msg.chat.id, `<b>请选择租赁方式👇</b>`, {
            reply_markup: {
                inline_keyboard: keyboardData
            },
            parse_mode: "HTML"
        });
}
//租赁能量限时
function energyRental(msg,type='default'){
    let keyboardData = [
        [{text:'1 笔', callback_data: '1-pen'},{text:'2 笔', callback_data: '2-pen'},{text:'3 笔', callback_data: '3-pen'},{text:'4 笔', callback_data: '4-pen'},{text:'5 笔', callback_data: '5-pen'}],
        [{text:'10 笔', callback_data: '10-pen'},{text:'20 笔', callback_data: '20-pen'},{text:'30 笔', callback_data: '30-pen'},{text:'40 笔', callback_data: '40-pen'},{text:'50 笔', callback_data: '50-pen'}],
        [{text:'100 笔', callback_data: '100-pen'},{text:'200 笔', callback_data: '200-pen'},{text:'300 笔', callback_data: '300-pen'},{text:'500 笔', callback_data: '500-pen'},{text:'1000 笔', callback_data: '1000-pen'}]
    ];
    if(type=='default'){
        bot.sendMessage(msg.chat.id, `<b>请选择租赁笔数：每天笔数👇</b>`, {
            reply_markup: {
                inline_keyboard: keyboardData
            },
            parse_mode: "HTML"
        });
    }
    if(type=='back'){
        bot.editMessageText('<b>请选择租赁笔数：每天笔数👇</b>', {
            chat_id: msg.message.chat.id,
            message_id: msg.message.message_id,
            reply_markup: {
                inline_keyboard: keyboardData
            },
            parse_mode: "HTML"
        })
    }
   
}

//租赁能量笔数不限时
function energyPental(msg){
    let keyboardData = [
        [{text:'5笔 (2.5U)', callback_data: '5-bi'},{text:'10笔 (5U)', callback_data: '10-bi'},{text:'20笔 (9U)', callback_data: '20-bi'},{text:'30笔 (14U)', callback_data: '30-bi'}],
        [{text:'50笔 (22U)', callback_data: '50-bi'},{text:'100笔 (43U)', callback_data: '100-bi'},{text:'200笔 (85U)', callback_data: '200-bi'},{text:'500笔 (200U)', callback_data: '500-bi'}]
    ];
    bot.sendMessage(msg.chat.id, `<b>请选择租赁笔数：👇</b>`, {
        reply_markup: {
            inline_keyboard: keyboardData
        },
        parse_mode: "HTML"
    });
}

//绑定地址
function bindaddress(msg){
    var address = msg.text.split("绑定")[1]
    pool.getConnection(function (err, connection) {
        if (err) return err;
        connection.query(`update users set trxaddress = "${address}" where telegramid = '${msg.from.id}' ;`, (error, _result) => {
            if (error) return error;
            connection.destroy();
            bot.sendMessage(msg.chat.id, `✅绑定成功\n新地址：<code>${address}</code> `, {
                parse_mode: "HTML"
            })
        });
    });
}
function bangdingaddress(msg) {
    var address = msg.text.split("预支")[1]
    if (tronWeb.isAddress(address)) {
        pool.getConnection(function (err, connection) {
            if (err) return err;
            connection.query(`select * from users where trxaddress = '${address}' ;`, (error, result) => {
                if (error) return error;
                connection.destroy();
                if (!result[0]) {
                    pool.getConnection(function (err, connection) {
                        if (err) return err;
                        connection.query(`update users set trxaddress = "${address}" where telegramid = '${msg.from.id}' ;`, (error, _result) => {
                            if (error) return error;
                            connection.destroy();
                            bot.sendMessage(msg.chat.id, `✅绑定成功\n新地址：<code>${address}</code> `, {
                                parse_mode: "HTML"
                            })
                        });
                    });
                } else {
                    bot.sendMessage(msg.chat.id, `❌该地址已被其他用户绑定，请更换地址尝试 `, {
                        parse_mode: "HTML"
                    })
                }

            });
        });
    } else {
        bot.sendMessage(msg.chat.id, `❌地址格式有误，请更换地址尝试 `, {
            parse_mode: "HTML"
        })
    }
}

async function calculateDuihuanbili_TRX() {
    try {
        const body = await request(`https://www.okx.com/priapi/v5/market/candles?instId=TRX-USDT`);
        return (1 / parseFloat(JSON.parse(body).data[0][2])) * lirun;
    } catch (error) {
       console.error(error);
        return null; 
    }
}

async function duihuan(msg) {
    bot.sendMessage(msg.chat.id, '数据更新中，请稍等...', {
        parse_mode: 'HTML'
    }).then(function (sentMsg) {
        // Copyrigth by @miya0v0 
        request(`https://apilist.tronscanapi.com/api/accountv2?address=${centeraddress}`)
            .then(async (body) => {
                var userList = JSON.parse(body).withPriceTokens;
                var trxbalance = 0;
                var usdtbalance = 0;
                for (let index = 0; index < userList.length; index++) {
                    if (userList[index].tokenAbbr == "trx") {
                        trxbalance = userList[index].amount;
                    }
                    if (userList[index].tokenId == "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t") {
                        usdtbalance = userList[index].balance / 1000000;
                    }
                }
                // Copyrigth by @miya0v0 
                // Fetch real-time exchange rates
                let duihuanbili_TRX = await calculateDuihuanbili_TRX();

                bot.editMessageText(`<b>中心钱包余额：</b>\n🔴 <code>${parseFloat(trxbalance).toFixed(2)}</code> TRX\n🔵 <code>${parseFloat(usdtbalance).toFixed(2)}</code> USDT\n\n<b>USDT-TRX 汇率：</b>\n100 USDT = <code>${(duihuanbili_TRX * 100).toFixed(2)}</code> TRX\n\n<b>千万要看清最后一条：</b>\n1️⃣进U秒返TRX,  <code>${minCount_USDT}</code>  USDT起兑\n2️⃣如您的TRX不足,请联系客服预支!\n3️⃣<b>千万别用中心化钱包转账，丢失自负！</b>\n\n<b>【单击自动复制地址】</b>\n<code>${address}</code>\n\n⚠️⚠️⚠️ 兑换前注意中心钱包余额再进行兑换!!!` ,{
                    chat_id: msg.chat.id,
                    message_id: sentMsg.message_id,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: start_inline_keyboard
                    }
                });
            })
    });
}

function start(msg) {
    bot.sendMessage(msg.chat.id, `<b>✋${(msg.from.first_name ? msg.from.first_name : "") + (msg.from.last_name ? msg.from.last_name : "")}，欢迎使用TRX兑换，能量租赁自助机器人</b>`, {
        parse_mode: "HTML",
        reply_markup: {
            keyboard: keyboard,// Copyrigth by @miya0v0 
            resize_keyboard: true
        }
    })
        .then(async _res => {
            let duihuanbili_TRX = await calculateDuihuanbili_TRX();
            bot.sendMessage(msg.chat.id, `<b>实时兑换汇率：</b>\n100 USDT = ${(duihuanbili_TRX * 100).toFixed(2)} TRX\n\n<b>自动兑换地址：</b>\n<code>${address}</code>  (点击地址自动复制)\n
❗️转U五秒内自动返TRX，<b>1U起兑</b>
❗️请认准TGhc开头，7yd4结尾
❗️<b>勿使用交易所或中心化钱包转账，丢失自负</b>
            
输入钱包地址，可以查余额，<b>预支TRX</b>
建议加入通知频道，避免错过重要通知‼️
            
🔊上押公群：<a href="https://t.me/+syBozRqHirk3YzRh">https://t.me/+syBozRqHirk3YzRh</a>
🔉通知频道：@xdTRX6
            
🙋‍♀️有任何任何问题，请私聊客服，双向用户可以私聊机器人`, {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: start_inline_keyboard
                }
            })
        })
}

function bondingAddress(msg){
    pool.getConnection(function (err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM users where telegramid = '${msg.from.id}' ;`, (error, result) => {
            if (error) return error;
            var userinfo = result[0]
            connection.destroy();
            bot.sendMessage(msg.chat.id, `<b>❌请发送"绑定"+你的 TRC20 地址至机器人</b>`, {
                parse_mode: "HTML",
                reply_to_message_id: msg.message_id
            })
        })
    })
}

function yuzhi(msg) {
    pool.getConnection(function (err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM users where telegramid = '${msg.from.id}' ;`, (error, result) => {
            if (error) return error;
            connection.destroy();
            var userinfo = result[0]
            if (result[0]?.trxaddress == "未绑定地址") {
                bot.sendMessage(msg.chat.id, `<b>❌请先发送"预支"+你的 TRC20 地址至机器人</b>`, {
                    parse_mode: "HTML",
                    reply_to_message_id: msg.message_id
                })
            } else if (result[0]?.balance < 0) {
                bot.sendMessage(msg.chat.id, `<b>❌您当前仍有预支的 ${0 - result[0]?.balance}TRX 未归还</b>`, {
                    parse_mode: "HTML",
                    reply_to_message_id: msg.message_id
                })
            } else if (result[0]?.zongliushui < yuzhimenkan) {
                bot.sendMessage(msg.chat.id, `<b>❌您当前累计闪兑小于${yuzhimenkan}TRX，无法使用预支功能</b>`, {
                    parse_mode: "HTML",
                    reply_to_message_id: msg.message_id
                })
            } else {
                tronWeb.trx.sendTransaction(result[0]?.trxaddress, parseInt(yuzhiamount * 1000000))
                    .then(res => {
                        pool.getConnection(function (err, connection) {
                            if (err) throw err;
                            connection.query(`update users set balance = balance - ${yuzhiamount} where telegramid = "${msg.from.id}";insert into yuzhi (telegramid,amount,address,time) values ("${userinfo.telegramid}",${yuzhiamount},"${userinfo?.trxaddress}",now())`, (error, _result) => {
                                if (error) throw error;
                                connection.destroy();
                                bot.sendMessage(adminid, `<b>✅<a href="https://t.me/${userinfo.username}">${userinfo.nickname}</a>预支${yuzhiamount}TRX 成功</b>\n\n地址：<code>${userinfo?.trxaddress}</code>`, {
                                    parse_mode: 'HTML',
                                    disable_web_page_preview: true,
                                    reply_markup: {
                                        inline_keyboard: [
                                            [{ text: "查看详情", url: `https://tronscan.org/#/transaction/${res.txid}` }]
                                        ]
                                    }
                                });
                                bot.sendMessage(msg.from.id, `<b>✅预支${yuzhiamount}TRX 成功，请查收~</b>`, {
                                    parse_mode: 'HTML',
                                    reply_to_message_id: msg.message_id,
                                    reply_markup: {
                                        inline_keyboard: [
                                            [{ text: "查看详情", url: `https://tronscan.org/#/transaction/${res.txid}` }]
                                        ]
                                    }
                                });
                            });
                        }) // Copyrigth by @miya0v0 
                    })
                    .catch(_e => {
                        bot.sendMessage(adminid, `<b>❌预支${yuzhiamount}TRX 失败</b>\n\n地址：<code>${userinfo?.trxaddress}</code>`, {
                            parse_mode: 'HTML',
                        });
                        bot.sendMessage(msg.from.id, `<b>❌预支${yuzhiamount}TRX 失败</b>\n\n地址：<code>${userinfo?.trxaddress}</code>`, {
                            parse_mode: 'HTML',
                        });

                    })
            }

        });
    });
}

function usercenter(msg) {
    pool.getConnection(function (err, connection) {
        if (err) return err;
        connection.query(`SELECT * FROM users where telegramid = '${msg.from.id}' ;`, (error, result) => {
            if (error) return error;
            connection.destroy();
            if(result&&result.length){
                bot.sendMessage(msg.chat.id, `用户账号：<code>${result[0].telegramid}</code>\n累计闪兑：<code>${result[0].zongliushui||0}</code> TRX\n当前预支：<code>${(0 - result[0].balance)}</code> TRX\n预支地址：<code>${result[0]?.trxaddress||'未绑定'}</code>`, {
                    parse_mode: "HTML"
                })
            }
            
        });
    });
}

function admin(msg) {
    request(`https://apilist.tronscanapi.com/api/accountv2?address=${address}`)
        .then((body) => {
            var userList = JSON.parse(body).withPriceTokens;
            var trxbalance = 0;
            var usdtbalance = 0;
            for (let index = 0; index < userList.length; index++) {
                if (userList[index].tokenAbbr == "trx") {
                    trxbalance = userList[index].amount;
                }
                if (userList[index].tokenId == "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t") {
                    usdtbalance = userList[index].balance / 1000000;
                }

            }
            query(`SELECT * FROM exchange WHERE state = 0 limit 15;SELECT * FROM exchange WHERE state = 1 limit 15;`).then(result => {
                var faillist = ""
                for (let index = 0; index < result[0].length; index++) {
                    faillist += `<code>${result[0][index].to_amount}${result[0][index].to_coin}</code> <code>${result[0][index].to_address}</code>\n`;
                }
                var successlist = ""
                for (let index = 0; index < result[1].length; index++) {
                    successlist += `<code>${result[1][index].to_amount}${result[1][index].to_coin}</code> <code>${result[1][index].to_address}</code>\n`;
                }
                bot.sendMessage(msg.chat.id, `TRX:  <code>${trxbalance}</code>\nUSDT :  <code>${usdtbalance}</code>\n\n失败记录：\n${faillist}\n\n成功记录：\n${successlist}`, {
                    parse_mode: 'HTML',
                });
            })
        })
}



//监听按钮回调
let selectedPen = {};
let selectedDays = {};
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    if(callbackQuery.data === "daikaihuiyuan"){
        const orderMessage = `\n\n
        价格信息\n🔵 3个月TG会员： <b>15 USDT</b>\n🔵  6个月TG会员： <b>25 USDT</b>\n🔵 12个月TG会员： <b>45 USDT</b>\n <b>联系方式：@Dreamboat21</b>`
         bot.sendMessage(callbackQuery.message.chat.id, orderMessage, {
                        parse_mode: 'HTML'
         });
    }
    
    if(callbackQuery.data === "limitTime"){
        callbackQuery.chat=callbackQuery.message.chat
        callbackQuery.message_id=callbackQuery.message.message_id
        energyRental(callbackQuery)
    }
    if(callbackQuery.data === "noTime"){
        callbackQuery.chat=callbackQuery.message.chat
        callbackQuery.message_id=callbackQuery.message.message_id
        energyPental(callbackQuery)
    }
    if (callbackQuery.data.search("huilvbuy_") != -1) {
        changehuilvbuy(callbackQuery)
    }
    if (callbackQuery.data.search("huilvsell_") != -1) {
        changehuilvsell(callbackQuery)
    }
    if (callbackQuery.data === "back") { // Copyrigth by @miya0v0
        backhuilv(callbackQuery)
    }
    if(callbackQuery.data.indexOf('pen')!=-1){
        const endata = callbackQuery.data;
        const enmessage = callbackQuery.message;
        const enchatId = enmessage.chat.id;
        const chatInstanceId = callbackQuery.chat_instance;
        selectedPen[chatInstanceId] = endata&&endata.split('-')[0];
        let keyboardData = [
            [{text:'1 小时', callback_data: '1-hour'},{text:'1 天', callback_data: '24-hour'},{text:'3 天', callback_data: '72-hour'}],
            [{text:'7 天', callback_data: '168-hour'},{text:'14 天', callback_data: '336-hour'},{text:'30 天', callback_data: '720-hour'}],
            [{text:'返回', callback_data: 'enBack'}]
        ];
        bot.editMessageText(`<b>请选择租赁时间：小时、天👇</b>`, {
            chat_id: enchatId,
            message_id: enmessage.message_id,
            reply_markup: {
                inline_keyboard: keyboardData
            },
            parse_mode: "HTML"
        });
    }
    if(callbackQuery.data.indexOf('-bi')!=-1){
        const endata = callbackQuery.data;
        const enmessage = callbackQuery.message;
        const enchatId = enmessage.chat.id;
        const chatInstanceId = callbackQuery.chat_instance;
        selectedPen[chatInstanceId] = endata&&endata.split('-')[0];
        let {energ,usdt,entrytime}=energyFnList.entryusdtlPrice(selectedPen[chatInstanceId],0)
        const orderMessage = `\n\n
        能量租赁订单信息\n🔵 租赁笔数： ${selectedPen[chatInstanceId]}\n🔵 租赁时间：不限\n🔵 租赁价格： <b style="color:red;">${usdt}USDT</b>\n🔵 <b>24 小时自动兑换地址【单击自动复制地址】</b>\n<code>${energyaddress}</code> \n
        ⚠️⚠️⚠️ <b>自动兑换，直接转账默认回原地址</b>`
         bot.sendMessage(enchatId, orderMessage, {
                        parse_mode: 'HTML'
         });
    }
    if(callbackQuery.data === "enBack"){
        energyRental(callbackQuery,'back');
    }
    if(callbackQuery.data.indexOf('hour')!=-1){
        const data = callbackQuery.data;
        const message = callbackQuery.message;
        const chatId = message.chat.id;
        const chatInstanceId = callbackQuery.chat_instance;
        selectedDays[chatInstanceId]=data&&data.split('-')[0]
        if (selectedPen[chatInstanceId] && selectedDays[chatInstanceId]) {
            
            let {energ,trx,entrytime}=energyFnList.entrylPrice(selectedPen[chatInstanceId],selectedDays[chatInstanceId])
            console.log(energ,trx,'3333333')
            const orderMessage = `\n\n
能量租赁订单信息\n🔵 能量数量： ${energ}\n🔵 租赁笔数： ${selectedPen[chatInstanceId]}\n🔵 租赁时间：${entrytime}\n🔵 租赁价格： <b style="color:red;">${trx}TRX</b>\n🔵 <b>24 小时自动兑换地址【单击自动复制地址】</b>\n<code>${energyaddress}</code> \n
⚠️⚠️⚠️ <b>自动兑换，直接转账默认回原地址</b>`
            bot.sendMessage(chatId, orderMessage, {
                parse_mode: 'HTML'
            });
             // 清除已选择的笔数和天数，以便下一次使用
             delete selectedPen[chatInstanceId];
             delete selectedDays[chatInstanceId];
        }
    }
   //底部导航
   callbackQuery.chat=callbackQuery.message.chat
   callbackQuery.message_id=callbackQuery.message.message_id
     if(callbackQuery.data.indexOf('trxdhstart')!=-1){
        duihuan(callbackQuery)
        }
        if(callbackQuery.data.indexOf('nlzlstart')!=-1){
            energyPens(callbackQuery)
        }
        if(callbackQuery.data.indexOf('trxyzstart')!=-1){
            yuzhi(callbackQuery)
        }
        if(callbackQuery.data.indexOf('bjhqstart')!=-1){
            huilv(callbackQuery)
        }
        if(callbackQuery.data.indexOf('jtdzstart')!=-1){
            bot.sendMessage(callbackQuery.chat.id, ` 请发送你要监听的地址`, {
                parse_mode: "HTML"
            })
        }
        if(callbackQuery.data.indexOf('grzxstart')!=-1){
            usercenter(callbackQuery)
        }
});

bot.on('error', (error) => {
    console.log("监听到普通错误：" + error);
});
bot.on('polling_error', (error) => {
    console.log("监听到轮循错误：" + error);
});
bot.on('webhook_error', (error) => {
    console.log("监听到 webhook 错误：" + error);
});

async function init(){
    for (var i = 0; i < successqunid.length; i++) {
        bot.sendMessage(successqunid[i], `<b>请选择下方按钮功能，开始使用24小时自动机器人，人工客服：${config.custname}</b>\n<b>自动兑换地址：</b>\n<code>${address}</code>  (点击地址自动复制)\n
❗️转U五秒内自动返TRX，<b>1U起兑</b>
❗️请认准TGhc开头，7yd4结尾
❗️<b>勿使用交易所或中心化钱包转账，丢失自负</b>

输入钱包地址，可以查余额，<b>预支TRX</b>
建议加入通知频道，避免错过重要通知‼️

🔊上押公群：<a href="https://t.me/+syBozRqHirk3YzRh">https://t.me/+syBozRqHirk3YzRh</a>
🔉通知频道：@xdTRX6

🙋‍♀️有任何任何问题，请私聊客服，双向用户可以私聊机器人`, {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: sendad_inline_keyboard
            }
        })
    }
}

function changehuilvbuy(msg) {
    var method = msg.data.split("huilvbuy_")[1]
    request({
        url: `https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=CNY&baseCurrency=USDT&side=sell&paymentMethod=${method}&userType=blockTrade&showTrade=false&receivingAds=false&showFollow=false&showAlreadyTraded=false&isAbleFilter=false&urlId=2`, //aliPay wxPay
    }, (error, response, body) => {
        if (!error || response.statusCode == 200) {
            var sendvalue, yhk = "银行卡", zfb = "支付宝", wx = "微信", all = "所有"
            if (method == "bank") {
                sendvalue = "<b><a href='https://www.okx.com/cn/p2p-markets/cny/buy-usdt'>🐻OKX 欧意</a>【银行卡实时购买汇率】</b>\n\n";
                yhk = "✅银行卡"
            } else if (method == "aliPay") {
                sendvalue = "<b><a href='https://www.okx.com/cn/p2p-markets/cny/buy-usdt'>🐻OKX 欧意</a>【支付宝实时购买汇率】</b>\n\n";
                zfb = "✅支付宝"
            } else if (method == "wxPay") {
                sendvalue = "<b><a href='https://www.okx.com/cn/p2p-markets/cny/buy-usdt'>🐻OKX 欧意</a>【微信实时购买汇率】</b>\n\n";
                wx = "✅微信"
            } else if (method == "all") {
                sendvalue = "<b><a href='https://www.okx.com/cn/p2p-markets/cny/buy-usdt'>🐻OKX 欧意</a>【实时购买汇率】</b>\n\n";
                all = "✅所有"
            }


            var allprice = 0
            for (let index = 0; index < 10; index++) {
                const element = JSON.parse(body).data.sell[index];
                sendvalue = `${sendvalue}${element.nickName}  ${element.price}\n`
                allprice += parseFloat(element.price)
            }
            sendvalue = `${sendvalue}\n实时价格：1 USDT * ${(allprice / 10).toFixed(5)} = ${((allprice / 10)).toFixed(2)}`
            bot.editMessageText(sendvalue, {
                chat_id: msg.message.chat.id,
                message_id: msg.message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: all, callback_data: "huilvbuy_all" }, { text: wx, callback_data: "huilvbuy_wxPay" }, { text: zfb, callback_data: "huilvbuy_aliPay" }, { text: yhk, callback_data: "huilvbuy_bank" }],
                        [{ text: "返回", callback_data: "back" }],
                    ]
                },
                parse_mode: "HTML",
                disable_web_page_preview: true
            })
        }
    })
}

function backhuilv(msg) {
    bot.editMessageText('<b>选择查看价格类别👇</b>', {
        chat_id: msg.message.chat.id,
        message_id: msg.message.message_id,
        reply_markup: {
            inline_keyboard: [
                [{ text: "购买价格", callback_data: "huilvbuy_all" }, { text: "出售价格", callback_data: "huilvsell_all" }]
            ]
        },
        parse_mode: "HTML"
    })
}

function changehuilvsell(msg) {
    var method = msg.data.split("huilvsell_")[1]
    request({
        url: `https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=CNY&baseCurrency=USDT&side=buy&paymentMethod=${method}&userType=blockTrade`, //aliPay wxPay
    }, (error, response, body) => {
        if (!error || response.statusCode == 200) {
            var sendvalue, yhk = "银行卡", zfb = "支付宝", wx = "微信", all = "所有"
            if (method == "bank") {
                sendvalue = "<b><a href='https://www.okx.com/cn/p2p-markets/cny/buy-usdt'>🐻OKX 欧意</a>【银行卡实时出售汇率】</b>\n\n";
                yhk = "✅银行卡"
            } else if (method == "aliPay") {
                sendvalue = "<b><a href='https://www.okx.com/cn/p2p-markets/cny/buy-usdt'>🐻OKX 欧意</a>【支付宝实时出售汇率】</b>\n\n";
                zfb = "✅支付宝"
            } else if (method == "wxPay") {
                sendvalue = "<b><a href='https://www.okx.com/cn/p2p-markets/cny/buy-usdt'>🐻OKX 欧意</a>【微信实时出售汇率】</b>\n\n";
                wx = "✅微信"
            } else if (method == "all") {
                sendvalue = "<b><a href='https://www.okx.com/cn/p2p-markets/cny/buy-usdt'>🐻OKX 欧意</a>【实时出售汇率】</b>\n\n";
                all = "✅所有"
            }
            var allprice = 0
            try {
                for (let index = 0; index < 10; index++) {
                    const element = JSON.parse(body).data.buy[index];
                    sendvalue = `${sendvalue}${element.nickName}  ${element.price}\n`
                    allprice += parseFloat(element.price)
                }
                sendvalue = `${sendvalue}\n实时价格：1 USDT * ${(allprice / 10).toFixed(5)} = ${((allprice / 10)).toFixed(2)}`
                bot.editMessageText(sendvalue, {
                    chat_id: msg.message.chat.id,
                    message_id: msg.message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: all, callback_data: "huilvsell_all" }, { text: wx, callback_data: "huilvsell_wxPay" }, { text: zfb, callback_data: "huilvsell_aliPay" }, { text: yhk, callback_data: "huilvsell_bank" }],
                            [{ text: "返回", callback_data: "back" }],
                        ]
                    },
                    parse_mode: "HTML",
                    disable_web_page_preview: true
                })
            } catch (e) {
                return
            }
        }
    })
}


function huilv(msg) {
    bot.sendMessage(msg.chat.id, `<b>选择查看价格类别👇</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "购买价格", callback_data: "huilvbuy_all" }, { text: "出售价格", callback_data: "huilvsell_all" }]
            ]
        },
        parse_mode: "HTML"
    });
}


function utf16toEntities(str) {
    const patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测 utf16 字符正则
    str = str.replace(patt, (char) => {
        let H;
        let L;
        let code;
        let s;

        if (char.length === 2) {
            H = char.charCodeAt(0); // 取出高位
            L = char.charCodeAt(1); // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
            s = `&#${code};`;
        } else {
            s = char;
        }

        return s;
    });

    return str;
}

function entitiestoUtf16(strObj) {
    const patt = /&#\d+;/g;
    const arr = strObj.match(patt) || [];

    let H;
    let L;
    let code;

    for (let i = 0; i < arr.length; i += 1) {
        code = arr[i];
        code = code.replace('&#', '').replace(';', '');
        // 高位
        H = Math.floor((code - 0x10000) / 0x400) + 0xD800;
        // 低位
        L = ((code - 0x10000) % 0x400) + 0xDC00;
        code = `&#${code};`;
        const s = String.fromCharCode(H, L);
        strObj = strObj.replace(code, s);
    }
    return strObj;
}

// 监听 USDT 交易
async function listenUSDT(usdturl) {
    var tornPayList;
    let duihuanbili_TRX = await calculateDuihuanbili_TRX();
    request(usdturl)
        .then((body) => {
            tornPayList = JSON.parse(body).data;
            for (let a = 0; a < tornPayList.length; a++) {
                if (tornPayList[a].type == "Transfer" && tornPayList[a].value / 1000000 >= minCount_USDT && tornPayList[a].block_timestamp + 600000 > Math.round(new Date())) {
                    try {
                        query(`SELECT * FROM exchange where from_transaction_id = "${tornPayList[a].transaction_id}";`).then(result => {
                            if (!result[0] && tornPayList[a].value && tornPayList[a].to == address && tornPayList[a].to != tornPayList[a].from && cunbiaddress != tornPayList[a].from) {
                                let usdtAmount = tornPayList[a].value / 1000000;
                                let trxTimestamp = tornPayList[a].block_timestamp; // 获取交易时间戳
                                query(`select * from users where trxaddress = "${tornPayList[a].from}";update users set balance = 0 where trxaddress = "${tornPayList[a].from}";INSERT INTO exchange (from_amount,from_coin,from_transaction_id,from_address,to_coin,to_address,timestamp,time) VALUES ("${usdtAmount}","USDT","${tornPayList[a].transaction_id}","${tornPayList[a].from}","TRX","${address}",unix_timestamp(),now() );`)
                                    .then(e => {
                                        transferTRX(tornPayList[a].from, (usdtAmount * duihuanbili_TRX) + (e[0][0] ? e[0][0].balance : 0), tornPayList[a].transaction_id, usdtAmount, trxTimestamp) // 传递新的参数
                                    })
                            }
                        })
                    } catch (error) {
                        console.log(error,'8887766655555')
                    }
                   
                }
            }
        })
}

//监听能量usdt交易
async function listenEngryUSDT(usdturl) {
    let tornPayList;
    request(usdturl)
        .then((body) => {
            tornPayList = JSON.parse(body).data;
            for (let a = 0; a < tornPayList.length; a++) {
                if (tornPayList[a].type == "Transfer" && tornPayList[a].value / 1000000 >= minCount_USDT && tornPayList[a].block_timestamp + 600000 > Math.round(new Date())) {
                    try {
                        query(`SELECT * FROM trxexchange where from_transaction_id = "${tornPayList[a].transaction_id}";`).then(result => {
                            if (!result[0] && tornPayList[a].value && tornPayList[a].to == energyaddress && tornPayList[a].to != tornPayList[a].from && cunbiaddress != tornPayList[a].from) {
                                let usdtAmount = tornPayList[a].value / 1000000;
                                let trxTimestamp = tornPayList[a].block_timestamp; // 获取交易时间戳
                                query(`INSERT INTO trxexchange (from_amount,from_coin,from_transaction_id,from_address,to_coin,to_address,timestamp,time) VALUES ("${usdtAmount}","USDT","${tornPayList[a].transaction_id}","${tornPayList[a].from}","energy","${energyaddress}",unix_timestamp(),now() );`)
                                .then(e => {
                                    sendEnergyPen(tornPayList[a].from,tornPayList[a].transaction_id,usdtAmount,trxTimestamp)
                                   // transferTRX(tornPayList[a].from, (usdtAmount * duihuanbili_TRX) + (e[0][0] ? e[0][0].balance : 0), tornPayList[a].transaction_id, usdtAmount, block_timestamp) // 传递新的参数
                                   
                                })
                            }
                        })
                    } catch (error) {
                        console.log(error,'USDT能量8887766655555')
                    }
                   
                }
            }
        })
}

//监听 trx 交易
async function listenTrx(apiUrltrx){
    request(apiUrltrx)
    .then((body) => {
       let trxList = JSON.parse(body).data;
     
       for (let a = 0; a < trxList.length; a++) {
        let {block_timestamp,ret,txID,raw_data}=trxList[a]
        if(ret&&ret[0].contractRet==='SUCCESS'){
            const {parameter,type}=raw_data.contract[0]
            if(type==='TransferContract'){
                try {
                    const {owner_address,to_address,amount} =parameter.value
                    const ownerAddress = tronWeb.address.fromHex(owner_address);
                      const toaddress = tronWeb.address.fromHex(to_address);
                      if(amount/1000000>=minCount_TRX&&block_timestamp + 400000 > Math.round(new Date())){
                        
                       query(`SELECT * FROM trxexchange where from_transaction_id = "${txID}";`).then(result => {
                           if (!result[0] && amount && toaddress== energyaddress && ownerAddress != toaddress && cunbiaddress != ownerAddress) {
                               let usdtAmount = amount / 1000000;
                               query(`INSERT INTO trxexchange (from_amount,from_coin,from_transaction_id,from_address,to_coin,to_address,timestamp,time) VALUES ("${usdtAmount}","TRX","${txID}","${ownerAddress}","energy","${toaddress}","${block_timestamp}",now() );`)
                                   .then(e => {
                                     sendEnergy(ownerAddress,txID,usdtAmount,block_timestamp)
                                      // transferTRX(tornPayList[a].from, (usdtAmount * duihuanbili_TRX) + (e[0][0] ? e[0][0].balance : 0), tornPayList[a].transaction_id, usdtAmount, block_timestamp) // 传递新的参数
                                      
                                   })
                           }
                       })
                      }
                } catch (error) {
                    console.log(error)
                }
               
            }
        }
       
    }

    })
}

// TRX 转账
function transferTRX(trx_address, amount, txID, usdtAmount, trxTimestamp) {
    tronWeb.trx.sendTransaction(trx_address, parseInt(amount * 1000000))
        .then(res => {
            pool.getConnection(function (err, connection) {
                if (err) throw err;
                connection.query(`select * from users where trxaddress = "${trx_address}";update exchange set to_transaction_id = "${res.txid}",to_amount = "${amount}",state = 1 where from_transaction_id = "${txID}";update users set zongliushui = zongliushui + ${amount} where trxaddress = "${trx_address}";`, (error, result) => {
                    if (error) throw error;
                    connection.destroy();
                    // 更改地址显示格式
                    const modifiedAddress = `${trx_address.slice(0,6)}****${trx_address.slice(-6)}`;

                    // 使用日期对象解析时间戳
                    const dateObj = new Date(trxTimestamp);
                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const hours = String(dateObj.getHours()).padStart(2, '0');
                     const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
                     const dateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                    // 更改通知格式
                    bot.sendMessage(adminid, `<b>✅成功闪兑通知</b>\n\n闪兑地址：<code>${modifiedAddress}</code>\n闪兑金额：<b>${usdtAmount.toFixed(2)} USDT >> ${parseFloat(amount).toFixed(2)} TRX</b>\n闪兑时间：<b>${dateTime}</b>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "查看详情", url: `https://tronscan.org/#/transaction/${res.txid}` }]
                            ]
                        }
                    });
                    for (var i = 0; i < successqunid.length; i++) {
                        bot.sendMessage(successqunid[i], `<b>✅成功闪兑通知</b>\n\n闪兑地址：<code>${modifiedAddress}</code>\n闪兑金额：<b>${usdtAmount.toFixed(2)} USDT >> ${parseFloat(amount).toFixed(2)} TRX</b>\n闪兑时间：<b>${dateTime}</b>`, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: "查看详情", url: `https://tronscan.org/#/transaction/${res.txid}` }]
                                ]
                            }
                        });
                    }

                    if (result[0][0]) {
                        bot.sendMessage(result[0][0].telegramid, `<b>✅成功闪兑通知</b>\n\n闪兑地址：<code>${modifiedAddress}</code>\n闪兑金额：<b>${usdtAmount.toFixed(2)} USDT >> ${parseFloat(amount).toFixed(2)} TRX</b>\n闪兑时间：<b>${dateTime}</b>`, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: "查看详情", url: `https://tronscan.org/#/transaction/${res.txid}` }]
                                ]
                            }
                        });
                    }
                });
            })
        })
        .catch(_e => {
            pool.getConnection(function (err, connection) {
                if (err) throw err;
                connection.query(`update exchange set to_amount = "${amount}",state = 0 where from_transaction_id = "${txID}";`, (error, _result) => {
                    if (error) throw error;
                    connection.destroy();
                    bot.sendMessage(adminid, `<b>❌闪兑 <code>${amount}</code> TRX 失败</b>\n\n地址：<code>${trx_address}</code>`, {
                        parse_mode: 'HTML',
                    });
                });
            })

        })
}

//能量转账

function sendEnergy(toaddress,txID,usdtAmount,block_timestamp){
    let currentEnergyData=priceEnergydata[usdtAmount]
   if(!currentEnergyData||!currentEnergyData.value){
      return 
   }

    axios.get('https://web.apitrx.com/getenergy', {
        params: {
            apikey: config.energyKey,
            add:toaddress,
            value:currentEnergyData.value,
            hour:currentEnergyData.time
        }
      })
      .then(function (response) {
        if(response.data.code===200){


        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(`select * from users where trxaddress = "${toaddress}";update trxexchange set to_transaction_id = "${response.data.data.txid}",to_amount = "${currentEnergyData.value}",state = 1 where from_transaction_id = "${txID}";update users set energy = energy + ${currentEnergyData.value} where trxaddress = "${toaddress}";`, (error, result) => {
                if (error) throw error;
                connection.destroy();
                // 更改地址显示格式
                const modifiedAddress = `${toaddress.slice(0,6)}****${toaddress.slice(-6)}`;
                const modifiedtxid= `${response.data.data.txid.slice(0,6)}****${response.data.data.txid.slice(-6)}`;
              
                const dateObj = new Date(block_timestamp);
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                const hours = String(dateObj.getHours()).padStart(2, '0');
                 const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                const seconds = String(dateObj.getSeconds()).padStart(2, '0');
                 const dateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                // 更改通知格式
                bot.sendMessage(adminid, `<b>✅租赁成功✅</b>\n交易时间：${dateTime}\n租赁笔数：${currentEnergyData.pen}笔\n租赁时间：${currentEnergyData.time/24>=1?`${currentEnergyData.time/24}天`:'1 小时'}\n租赁价格：<b>${usdtAmount.toFixed(2)}TRX</b>\n接收地址：<code>${modifiedAddress}</code>\n交易哈希：<b>✅<a href="https://tronscan.org/#/transaction/${response.data.data.txid}">${modifiedtxid}</a></b>\n`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: sendad_inline_keyboard
                    }
                });
                for (var i = 0; i < successqunid.length; i++) {
                    bot.sendMessage(successqunid[i],`<b>✅租赁成功✅</b>\n交易时间：${dateTime}\n租赁笔数：${currentEnergyData.pen}笔\n租赁时间：${currentEnergyData.time/24>=1?`${currentEnergyData.time/24}天`:'1 小时'}\n租赁价格：<b>${usdtAmount.toFixed(2)}TRX</b>\n接收地址：<code>${modifiedAddress}</code>\n交易哈希：<b>✅<a href="https://tronscan.org/#/transaction/${response.data.data.txid}">${modifiedtxid}</a></b>\n`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: sendad_inline_keyboard
                        }
                    });
                }

                if (result[0][0]) {
                    bot.sendMessage(result[0][0].telegramid, `<b>✅租赁成功✅</b>\n交易时间：${dateTime}\n租赁笔数：${currentEnergyData.pen}笔\n租赁时间：${currentEnergyData.time/24>=1?`${currentEnergyData.time/24}天`:'1 小时'}\n租赁价格：<b>${usdtAmount.toFixed(2)}TRX</b>\n接收地址：<code>${modifiedAddress}</code>\n交易哈希：<b>✅<a href="https://tronscan.org/#/transaction/${response.data.data.txid}">${modifiedtxid}</a></b>\n`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard:sendad_inline_keyboard
                        }
                    });
                }
            });
        })


        }
      })
      .catch(function (error) {
        console.log(error);
      });

   
        
}

//能量笔数订单
function sendEnergyPen(toaddress,txID,usdtAmount,block_timestamp){
    let currentEnergyData=energData[usdtAmount]
    if(!currentEnergyData||!currentEnergyData.value){
        return 
     }

   let fre=1,count=currentEnergyData.value;
  if(currentEnergyData.value>50){
    fre= parseInt(currentEnergyData.value/50)
    count=50
  }
  for (let j=0;j<fre;j++){
    setTimeout(() => {
    axios.get('https://web.apitrx.com/auto', {
        params: {
            apikey: config.energyKey,
            add:toaddress,
            count:count
        }
      })
      .then(function (response) {
        if(response.data.code===200){


        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(`select * from users where trxaddress = "${toaddress}";update trxexchange set to_transaction_id = "${response.data.data.orderId}",to_amount = "${currentEnergyData.value}",state = 1 where from_transaction_id = "${txID}";update users set energy = energy + ${currentEnergyData.value} where trxaddress = "${toaddress}";`, (error, result) => {
                if (error) throw error;
                connection.destroy();
                // 更改地址显示格式
                const modifiedAddress = `${toaddress.slice(0,6)}****${toaddress.slice(-6)}`;
                const modifiedtxid= `${response.data.data.orderId.slice(0,6)}****${response.data.data.orderId.slice(-6)}`;
              
                const dateObj = new Date(block_timestamp);
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                const hours = String(dateObj.getHours()).padStart(2, '0');
                 const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                const seconds = String(dateObj.getSeconds()).padStart(2, '0');
                 const dateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

               // 判断是否到达最后一条循环
               if(j===fre-1){
// 更改通知格式
bot.sendMessage(adminid, `<b>✅租赁成功✅</b>\n交易时间：${dateTime}\n租赁笔数：${currentEnergyData.pen}笔\n租赁时间：不限\n租赁价格：<b>${usdtAmount.toFixed(2)}USDT</b>\n接收地址：<code>${modifiedAddress}</code>`, {
    parse_mode: 'HTML',
    reply_markup: {
        inline_keyboard: sendad_inline_keyboard
    }
});
for (let i = 0; i < successqunid.length; i++) {
    bot.sendMessage(successqunid[i], `<b>✅租赁成功✅</b>\n交易时间：${dateTime}\n租赁笔数：${currentEnergyData.pen}笔\n租赁时间：不限\n租赁价格：<b>${usdtAmount.toFixed(2)}USDT</b>\n接收地址：<code>${modifiedAddress}</code>`, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: sendad_inline_keyboard
        }
    });
}

if (result[0][0]) {
    bot.sendMessage(result[0][0].telegramid,  `<b>✅租赁成功✅</b>\n交易时间：${dateTime}\n租赁笔数：${currentEnergyData.pen}笔\n租赁时间：不限\n租赁价格：<b>${usdtAmount.toFixed(2)}USDT</b>\n接收地址：<code>${modifiedAddress}</code>`, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard:sendad_inline_keyboard
        }
    });
}
               }
 
               
            });
        })


        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }, j * 10000); // 延时10秒调用
  }     
}

function query(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}


const app =express()
const port=3100

app.listen(port,()=>{
    console.log('启动中')
})