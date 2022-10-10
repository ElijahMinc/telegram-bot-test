const getInfoUser = require("./helpers/getInfoUser.js")
const generateRandomNumber = require("./helpers/generateRandomNumber.js")
const { gameOptions, gameAgainOptions } = require("./utils/gameOptions.js")
const { COMMANDS, customCommands } = require("./constant.js")
const TelegramBot = require("node-telegram-bot-api")

const token = "5688500985:AAF8riWcvkWldXRz-WGQ_KvSNAtkqyFJpBA"

const bot = new TelegramBot(token, { polling: true })

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
  await bot.setMyCommands(customCommands)

  bot.on("message", async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id

    switch (text) {
      case COMMANDS.START:
        await bot.sendSticker(
          chatId,
          "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp"
        )
        await bot.sendMessage(chatId, `Ты написал мне ${text}`)
        console.log("msg", msg)
        break
      case COMMANDS.INFO:
        const { firstName, lastName, userName } = getInfoUser(msg)

        await bot.sendMessage(
          chatId,
          `Інформація: Ім'я: ${firstName}; Прізвище: ${lastName}; username: ${userName}`
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
  })

  bot.on("callback_query", async (msg) => {
    const chosenData = msg.data
    const chatId = msg.message.chat.id

    if (chosenData === COMMANDS.GAME_AGAIN) {
      return await startGame(bot, {
        chats,
        chatId,
        gameOptions,
      })
    }

    await bot.sendMessage(chatId, `Ти обрав цифру ${chosenData}`)

    if (Number(chats[chatId]) !== Number(chosenData)) {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/10.webp"
      )

      return await bot.sendMessage(
        chatId,
        `Нажаль, ви не вгадали. Цифра була: ${chats[chatId]}`,
        gameAgainOptions
      )
    }
    await bot.sendSticker(
      chatId,
      "https://tlgrm.eu/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/3.jpg"
    )
    return await bot.sendMessage(
      chatId,
      `Вітаю! Ви вгадали! Була цифра: ${chats[chatId]}`,
      gameAgainOptions
    )
  })
}

start()
