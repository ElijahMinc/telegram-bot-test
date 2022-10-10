const COMMANDS = Object.freeze({
  START: "/start",
  INFO: "/info",
  GAME: "/game",
  GAME_AGAIN: "/again",
})

const customCommands = [
  {
    command: COMMANDS.START,
    description: "Звичайне привітання",
  },
  {
    command: COMMANDS.INFO,
    description: "Отримати інформацію про користувача",
  },
  {
    command: COMMANDS.GAME,
    description: "Грай у гру: відгадай число",
  },
]

module.exports = {
  customCommands,
  COMMANDS,
}
