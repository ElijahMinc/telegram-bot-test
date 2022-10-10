require("dotenv").config()

const getInfoUser = require("./helpers/getInfoUser.js")
const generateRandomNumber = require("./helpers/generateRandomNumber.js")
const { gameOptions, gameAgainOptions } = require("./utils/gameOptions.js")
const { COMMANDS, customCommands } = require("./constant.js")
const TelegramBot = require("node-telegram-bot-api")
const sequelize = require("./db/storage.js")
const UserModel = require("./db/models/User.js")

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })

const chats = {}

const startGame = async (
  bot,
  options = {
    chats,
    chatId,
    gameOptions,
  }
) => {
  const { chats, chatId, gameOptions } = options
  await bot.sendMessage(
    chatId,
    "Зараз я загадаю число від 0 до 9, а Ви повинні відгадати!"
  )
  const randomNumber = generateRandomNumber()

  chats[chatId] = randomNumber

  await bot.sendMessage(chatId, "Загадав. Спробуй відгадай!", gameOptions)
}

const start = async () => {
  try {
    await sequelize.authenticate() // подключение к бд
    await sequelize.sync() // сверяем состояние бд со схемой данных, которые описаны тут
  } catch (error) {
    console.log("error", error)
  }

  await bot.setMyCommands(customCommands)

  bot.on("message", async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id
    try {
      switch (text) {
        case COMMANDS.START:
          await UserModel.create({
            chatId,
          })

          await bot.sendSticker(
            chatId,
            "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp"
          )
          await bot.sendMessage(
            chatId,
            `Ти написав мені "${text}"? Чи мені здалося?`
          )
          console.log("msg", msg)
          break
        case COMMANDS.INFO:
          const user = await UserModel.findOne({ chatId })

          const { firstName, lastName, userName } = getInfoUser(msg)

          await bot.sendMessage(
            chatId,
            `Інформація: Ім'я: ${firstName}; Прізвище: ${lastName}; username: ${userName}. У грі в тебе правильних відподівей: ${user.rightAnswers}, неправильних: ${user.wrongAnswers}`
          )

          break
        case COMMANDS.GAME:
          await startGame(bot, {
            chats,
            chatId,
            gameOptions,
          })
          break
        default:
          return await bot.sendMessage(chatId, "Це що такє??")
      }
    } catch (error) {
      return bot.sendMessage(chatId, "Уууупс... щось пішло не так..")
    }
  })

  bot.on("callback_query", async (msg) => {
    const chosenData = msg.data
    const chatId = msg.message.chat.id
    const user = await UserModel.findOne({ chatId })

    if (chosenData === COMMANDS.GAME_AGAIN) {
      return await startGame(bot, {
        chats,
        chatId,
        gameOptions,
      })
    }

    await bot.sendMessage(chatId, `Ти обрав цифру ${chosenData}`)

    if (Number(chats[chatId]) !== Number(chosenData)) {
      user.wrongAnswers += 1

      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/10.webp"
      )

      await bot.sendMessage(
        chatId,
        `Нажаль, ви не вгадали. Цифра була: ${chats[chatId]}`,
        gameAgainOptions
      )
    } else {
      user.rightAnswers += 1

      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/3.jpg"
      )
      await bot.sendMessage(
        chatId,
        `Вітаю! Ви вгадали! Була цифра: ${chats[chatId]}`,
        gameAgainOptions
      )
    }

    await user.save()
  })
}

start()
