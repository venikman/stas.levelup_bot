require('dotenv').config();
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TOKEN);

const consultation = {
    title: 'Онлайн консультация',
    description: 'Онлайн консультация со Стасом.',
    payload: 'payload',
    about: "*Консультация* \n\n _Длительность_ \: 1\.5 часа\n\n Что входит в консультацию\:\n1\.  Опрос перед консультацией \n2\.  Полуторачасовой созвон\, где обсуждается ваша ситуация на основе заполненной до консультации формы\n\nДо консультации вам высылается форма\, которую необходимо заполнить\. В этой форме вы рассказываете о себе\, своём опыте работы\, а также как вы бы хотели\, чтобы Стас вам помог\. Чем детальнее и конкретнее вы опишите ситуацию\, тем Стасу будет проще понять вашу проблему и тем продуктивнее пройдёт консультация\."
};

const tutoring = {
    title: 'Менторский курс',
    description: '4-х недельный менторский курс со Стасом',
    payload: 'payload',
    about: "*Менторский курс*\n\n _Длительность_: 4 недели\n\n Что входит в менторский курс:\n1.  Опрос перед менторским курсом\n2.  4 созвона по 1.5 часа\n3.  4-х недельное сопровождение через ежедневное отслеживание вашего прогресса\n4.  Постоянная связь со Стасом \n5.  Дополнительные полезные материалы, подбираемые в зависимости от ваших потребностей\n\nДо начала менторского курса вам высылается форма, которую необходимо заполнить\. В этой форме вы рассказываете о себе, своём опыте работы, а также как вы бы хотели, чтобы Стас вам помог\. Чем подробнее и конкретнее вы расскажите о своей ситуации, тем Стасу проще будет понять вашу проблему и тем продуктивнее будет проходить менторский курс."
};

let t = {}

const qSurname = 'Ваша фамилия:';
const qName = 'Ваше имя:';
const qChannelUsability = 'От 1 до 10, где 1 = ужасно, а 10 = идеально, оцените удобство канала.';
const qContentRelevance = 'От 1 до 10, где 1 = Бесполезно, а 10 = всё актуально, оцените актуальность контента.';
const qFeedback = 'Оставьте свой отзыв по каналу: что вам не нравится или нравится. Что бы вы хотели изменить. Я изучаю каждый отзыв и тем самым стараюсь улучшать себя и свои каналы.';

function mainMenu(ctx) {
    ctx.telegram.sendMessage(ctx.chat.id, 'Привет, чем я могу помочь?',
        {
            reply_markup: {
                keyboard: [
                    [
                        { text: 'Скачать гайд' }
                    ],
                    [
                        { text: 'Запись на бесплатную консультацию'}
                    ],
                    [
                        { text: 'Услуги'}
                    ],
                    [
                        { text: "Оставить отзыв" }
                    ]
                ],
                one_time_keyboard: true,
                resize_keyboard: true
            }
        })
}

function consultationMenu(ctx){
    bot.telegram.sendMessage(ctx.chat.id, "Что бы вы хотели сделать?",
    {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Узнать о консультации", callback_data: "aboutConsultation" }],
                [{ text: "Приобрести консультацию", callback_data: "payForConsultation" }],
                [{ text: "Вернуться назад", callback_data: "goBackMainMenu" }]
            ]
        }
    })
};

function tutoringMenu(ctx){
    bot.telegram.sendMessage(ctx.chat.id, "Что бы вы хотели сделать?",
    {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Узнать о Менторском курсе", callback_data: "aboutTutoring" }],
                [{ text: "Приобрести Менторский курс", callback_data: "payForTutoring" }],
                [{ text: "Вернуться назад", callback_data: "goBackMainMenu" }]
            ]
        }
    })
};

function getFeedback(ctx) {
    bot.telegram.sendMessage(ctx.chat.id, "Спасибо, что согласились оставить отзыв. Я читаю каждый из них и стараюсь прислушиваться, чтобы сделать свои каналы лучше. Чтобы начать, нажмите 'Продолжить'", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Продолжить", callback_data: 'fbcontinue' }],
                [{ text: "Вернуться назад", callback_data: 'goBackChannelsList' }]
            ]
        }
    });

}

function meetingSignUp(ctx){
    bot.telegram.sendMessage(ctx.chat.id, "Куда вы хотите записаться?",
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Консультация", callback_data: "consultation_sign" }],
                    [{ text: "Менторство", callback_data: "mentor_sign" }],
                    [{ text: "Вернуться назад", callback_data: "goBackMainMenu" }]
                ]
            }
        })
};

function feedbackChannels(ctx){
    bot.telegram.sendMessage(ctx.chat.id, "По какому бы каналу вы хотели оставить отзыв?", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Instagram", callback_data: "instagramFeedback" }],
                [{ text: "Telegram bot", callback_data: "telegramBotFeedback" }],
                [{ text: "Консультация", callback_data: "consultationFeedback" }],
                [{ text: "Менторский курс", callback_data: "tutoringFeedback" }],
                [{ text: "Другое", callback_data: "otherFeedback" }],
                [{ text: "Вернуться назад", callback_data: "goBackMainMenu" }]
            ]
        }
    })
}

function payForConsultation(ctx){
    try {
    bot.telegram.sendInvoice(ctx.chat.id,
        {
            title:consultation.title,
            description:consultation.description,
            payload:consultation.payload,
            provider_token: process.env.STOKEN,
            currency:'RUB',
            prices:[{label:'Онлайн консультация', amount:500000}],

        });
    } catch (error) {
    console.log('here errod: ', error)
    }
};

function payForTutoring(ctx){
    try {
    bot.telegram.sendInvoice(ctx.chat.id,
        {
            title:tutoring.title,
            description:tutoring.description,
            payload:tutoring.payload,
            provider_token:process.env.STOKEN,
            currency:'RUB',
            prices:[{label:'Менторский онлайн курс', amount:2000000}]

        });
    } catch (error) {
    console.log('here error: ', error)
    }
};

function itemToPayFor(ctx){
    bot.telegram.sendMessage(ctx.chat.id, "Что бы вы хотели оплатить?",
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Консультация", callback_data: "payForConsultation" }],
                    [{ text: "Менторство", callback_data: "payForTutoring" }],
                    [{ text: "Вернуться назад", callback_data: "goBackMainMenu" }]
                ]
            }
        })
};

function sendGuide(ctx){
    bot.telegram.sendMessage(ctx.chat.id, 'Жми "Получить гайд"',
    {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Получить гайд", url: "https://drive.google.com/file/d/1q7Qwqx7sUVTufWKorSnJpCpmijzv05MN/view?usp=sharing" }],
            ]
        }
    })
}

function getDateTime(){
    let today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
}



bot.command('start', ctx => {
    mainMenu(ctx);
    let userName = ctx.update.message.from.username;
    let userFirstName = ctx.update.message.from.first_name;
    bot.telegram.sendMessage(process.env.ADMIN_CHAT, `@${userName} ${userFirstName} зашёл в бота с Инсты`)
})


bot.hears('Запись на бесплатную консультацию', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, "Бесплатная консультация длится 15-20 минут. В течении этого времени вы сможете пообщаться со Стасом: понять, нужна ли вам консультация или менторский курс, является ли Стас нужным для этого человеком, может ли он вам дать то, что вы хотите и помочь в вашем вопросе.",
    {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Записаться", url: 'https://calendly.com/nedbailov/15min' }]
            ]
        }
    })
})

bot.hears('Услуги', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, "Список услуг:",
    {
        reply_markup: {
            inline_keyboard: [
                [{ text: "О консультации", callback_data: "aboutConsultation" }],
                [{ text: "Приобрести консультацию", callback_data: "payForConsultation" }],
                [{ text: "О менторском курсе", callback_data: "aboutTutoring" }],
                [{ text: "Приобрести менторский курс", callback_data: "payForTutoring" }],
                [{ text: "Вернуться назад", callback_data: "goBackMainMenu" }]
            ]
        }
    })
})

bot.hears('Скачать гайд', ctx => {
    let userName = ctx.update.message.from.username;
    let userFirstName = ctx.update.message.from.first_name;
    bot.telegram.sendMessage(ctx.chat.id, "Жми на кнопку и качай гайд!",
    {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Получить гайд", url: 'https://drive.google.com/file/d/1q7Qwqx7sUVTufWKorSnJpCpmijzv05MN/view?usp=sharing' }]
            ]
        }
    })
    bot.telegram.sendMessage(process.env.ADMIN_CHAT, `@${userName} ${userFirstName} нажал "скачать гайд`)
})

bot.hears('Консультация', ctx => {
    consultationMenu(ctx);
    let userName = ctx.update.message.from.username;
    let userFirstName = ctx.update.message.from.first_name;
    bot.telegram.sendMessage(process.env.ADMIN_CHAT, `@${userName} ${userFirstName} нажал Консультация`)
})

bot.hears('Менторство', ctx => {
    tutoringMenu(ctx);
    let userName = ctx.update.message.from.username;
    let userFirstName = ctx.update.message.from.first_name;
    bot.telegram.sendMessage(process.env.ADMIN_CHAT, `@${userName} ${userFirstName} нажал Менторство`)
})

bot.hears('Записаться к Стасу', ctx => {
    meetingSignUp(ctx);
    let userName = ctx.update.message.from.username;
    let userFirstName = ctx.update.message.from.first_name;
    bot.telegram.sendMessage(process.env.ADMIN_CHAT, `@${userName} ${userFirstName} нажал Записаться к Стасу`)
})

bot.hears('Оставить отзыв', ctx => {
    feedbackChannels(ctx);
    let userName = ctx.update.message.from.username;
    let userFirstName = ctx.update.message.from.first_name;
    bot.telegram.sendMessage(process.env.ADMIN_CHAT, `@${userName} ${userFirstName} нажал Оставить отзыв`)
});

bot.hears('Оплата услуг', ctx => {
    itemToPayFor(ctx);
    let userName = ctx.update.message.from.username;
    let userFirstName = ctx.update.message.from.first_name;
    bot.telegram.sendMessage(process.env.ADMIN_CHAT, `@${userName} ${userFirstName} нажал Оплата услуг`)
})



bot.action('aboutConsultation', ctx=> {
    ctx.answerCbQuery();
    bot.telegram.sendMessage(ctx.chat.id, consultation.about, {parse_mode:'Markdown'})
})

bot.action('aboutTutoring', ctx => {
    ctx.answerCbQuery();
    bot.telegram.sendMessage(ctx.chat.id, tutoring.about, {parse_mode:'Markdown'})
    let userName = ctx.update.message.from.username;
    let userFirstName = ctx.update.message.from.first_name;
    bot.telegram.sendMessage(process.env.ADMIN_CHAT, `@${userName} ${userFirstName} нажал О Менторстве`)
})

bot.action('payForConsultation', ctx => {
    ctx.answerCbQuery();
    payForConsultation(ctx);
    let userName = ctx.update.message.from.username;
    let userFirstName = ctx.update.message.from.first_name;
    bot.telegram.sendMessage(process.env.ADMIN_CHAT, `@${userName} ${userFirstName} нажал Оплатить Консультацию`)
})

bot.action('payForTutoring', ctx => {
    ctx.answerCbQuery();
    payForTutoring(ctx);

    let userName = ctx.update.message.from.username;
    let userFirstName = ctx.update.message.from.first_name;
    bot.telegram.sendMessage(process.env.ADMIN_CHAT, `@${userName} ${userFirstName} нажал Оплатить Менторство`)
})

bot.action(['instagramFeedback', "telegramBotFeedback", "consultationFeedback", "tutoringFeedback", "otherFeedback"], ctx => {
    ctx.deleteMessage();
    t.feedbackChannel = ctx.update.callback_query.data;
    getFeedback(ctx);
})

bot.action('fbcontinue', ctx => {
    ctx.answerCbQuery();
    bot.telegram.sendMessage(ctx.chat.id, qSurname, {
        reply_markup: { force_reply: true }
    })
})

bot.action('consultation_sign', ctx => {
    ctx.deleteMessage();
    ctx.reply('Чтобы записаться на консультацию вам нужно для начала оплатить её. В инстаграме в актуальных есть видео-обучение, как оплатить через бота.',
    {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Оплатить", callback_data: "payForConsultation" }],
                [{ text: "Вернуться назад", callback_data: "goBackMainMenu" }]
            ]
        }
    });
})

bot.action('mentor_sign', ctx => {
    ctx.deleteMessage();
    ctx.reply('Чтобы записаться на менторский курс вам нужно сначала его оплатить. В инстаграме Стаса в актуальных есть инструкция, как оплатить через бота.',
    {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Оплатить", callback_data: "payForTutoring" }],
                [{ text: "Вернуться назад", callback_data: "goBackMainMenu" }]
            ]
        }
    });
})

bot.action('goBackMeetingSignUp', ctx => {
    ctx.deleteMessage();
    meetingSignUp(ctx);
})

bot.action('goBackMainMenu', ctx => {
    ctx.deleteMessage();
    mainMenu(ctx);

})

bot.action('goBackChannelsList', ctx => {
    ctx.deleteMessage();
    feedbackChannels(ctx);
})

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));

bot.on('successful_payment', async (ctx, next) => { // ответ в случае положительной оплаты
    let userName = ctx.update.message.from.username;
    const amountPaid = ctx.update.message.successful_payment.total_amount
    await ctx.reply('Платёж успешно отправлен.');
    await bot.telegram.sendMessage(process.env.ADMIN_CHAT, `@${userName} оплатил ${amountPaid/100} руб ${getDateTime()}`)
    await ctx.reply('Запись на консультацию и менторский курс осуществляется через Стаса. (Он автоматически узнаёт, когда вы делаете оплату).')
  })

bot.on('text', (ctx) => {
    if (ctx.update.message.reply_to_message == null) {
        return;
    }
    t.username = ctx.update.message.from.username;
    let msg = ctx.update.message.reply_to_message.text;
    if (msg == qSurname) {
        if (isNaN(ctx.update.message.text) === true) {
            t.secondName = ctx.update.message.text;
            bot.telegram.sendMessage(ctx.chat.id, qName, {
                reply_markup: JSON.stringify({ force_reply: true })
            })
        } else {
            ctx.reply('Используйте только буквы и пробелы')
            bot.telegram.sendMessage(ctx.chat.id, qSurname, {
                reply_markup: JSON.stringify({ force_reply: true })
            })
        }

    } else if (msg === qName) {
        if (isNaN(ctx.update.message.text) === true) {
            t.firstName = ctx.update.message.text;
            bot.telegram.sendMessage(ctx.chat.id, qChannelUsability, {
                reply_markup: JSON.stringify({ force_reply: true })
            })
        } else {
            ctx.reply('Используйте только буквы и пробелы')
            bot.telegram.sendMessage(ctx.chat.id, qName, {
                reply_markup: JSON.stringify({ force_reply: true })
            })
        }
    } else if (msg == qChannelUsability){
        if (Number(ctx.update.message.text) >= 0 && Number(ctx.update.message.text) <= 10){
            t.qChannelUsability = ctx.update.message.text;
            bot.telegram.sendMessage(ctx.chat.id, qContentRelevance, {
                reply_markup: JSON.stringify({ force_reply: true })
            })
        } else {
            ctx.reply('Введите число от 1 до 10');
            bot.telegram.sendMessage(ctx.chat.id, qChannelUsability, {
                reply_markup: JSON.stringify({ force_reply: true })
            })
        }
    } else if (msg == qContentRelevance){
        if (Number(ctx.update.message.text) >= 0 && Number(ctx.update.message.text) <= 10){
            t.qContentRelevance = ctx.update.message.text;
            bot.telegram.sendMessage(ctx.chat.id, qFeedback, {
                reply_markup: JSON.stringify({ force_reply: true })
            })
        } else {
            ctx.reply('Введите число от 1 до 10');
            bot.telegram.sendMessage(ctx.chat.id, qContentRelevance, {
                reply_markup: JSON.stringify({ force_reply: true })
            })
        }
    } else if (msg == qFeedback) {
        if (isNaN(ctx.update.message.text) === true) {

            t.Feedback = ctx.update.message.text;
            let feedbackMsg = `
                Пользователь ${t.secondName} ${t.firstName} @${t.username} оставил отзыв! \n
                Канал: ${t.feedbackChannel}

                Удобство канала (1-10):     ${t.qChannelUsability}
                Актуальность канала (1-10): ${t.qContentRelevance}

                Отзыв:
                ${t.Feedback}

            `;
            mainMenu(ctx);
            ctx.reply("Спасибо за оставленный отзыв!");

            // console.log(t);

            bot.telegram.sendMessage(process.env.ADMIN_CHAT, feedbackMsg)
        } else {
            ctx.reply('Используйте только буквы и пробелы')
            bot.telegram.sendMessage(ctx.chat.id, qFeedback, {
                reply_markup: JSON.stringify({ force_reply: true })
            })
        }
    }
})

exports.handler = (event, context, callback) => {
    const tmp = JSON.parse(event.body); // get data passed to us
    bot.handleUpdate(tmp); // make Telegraf process that data
    return callback(null, { // return something for webhook, so it doesn't try to send same stuff again
      statusCode: 200,
      body: '',
    });
  };
