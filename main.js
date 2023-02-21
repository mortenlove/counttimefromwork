
const fs = require('fs');
let data = [{id: "", name: ""}]
fs.writeFileSync('data.json', JSON.stringify(data));
const dbData = JSON.parse(fs.readFileSync('data.json', (err, data) => (data)))
const TOKEN = process.env.TELEGRAM_TOKEN || '5662648503:AAGMtYem6FGCb-GFPANNwW71QFhhM0XU9Ds';
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const options = {
  polling: true
};
const bot = new TelegramBot(TOKEN, options);


function msToTime(duration) {
    var seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds;
  }

bot.onText(/\/start/, function onSetName(msg){
    if(dbData.id != msg.from.id & dbData.name != "") {
        bot.sendMessage(msg.from.id, 'Введите ФИО')
    }
})

bot.on('message', (msg) => {

        
        fs.writeFileSync('data.json', JSON.stringify(data));
        console.log(data)
})

// Matches /editable
bot.on('message', function onEditableText(msg) {
    if (msg.text === "Новая смена") {
  const opts = {
    reply_markup: {
        inline_keyboard: [
        [
          {
            text: 'Начать',
             // we shall check for this value when we listen
             // for "callback_query"
            callback_data: 'starttime'
          }
        ]
      ]
    }
  };
  bot.sendMessage(msg.from.id, 'Начать смену?', opts);
    }
});




// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Конец',
               // we shall check for this value when we listen
               // for "callback_query"
              callback_data: 'endtime'
            }
          ]
        ]
      }
  };
  let text;


  const optis = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    // reply_markup: JSON.stringify({
    //           keyboard: [
    //             ['Yes, you are the bot of my life ❤'],
    //             ['No, sorry there is another one...']
    //           ]
    //         })
  };

  const key = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [
            ['Новая смена'],

          ],
        })
      };

//   const key = {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: 'Конец',
//              // we shall check for this value when we listen
//              // for "callback_query"
//             callback_data: 'endtime'
//           }
//         ]
//       ]
//     }
//   };
  if (action === 'endtime') {
    end = new Date().getTime();
    timems = end - start;
    text = msToTime(timems);
    bot.editMessageText(text, optis);
    bot.sendMessage(msg.chat.id, "Ваш рабочий день окончен", key);
    

  }

  if (action === 'starttime') {
    text = 'Нажмите, для завершения смены',
    start = new Date().getTime();
    console.log(start);
    bot.editMessageText(text, opts);
  }
});
