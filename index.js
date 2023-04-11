import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  Colors,
  User,
} from "discord.js";
import { token } from "./config.js";
import {
  blockAddButtons,
  blockJoinButtons,
  blockStartButtons,
  blockWinAddButtons,
  defaultTeamSetupButtons,
  defaultButtons,
  firstButtons,
  joinButtons,
  minUserJoinedButtons,
  winDefaultButtons,
  winJoinButtons,
} from "./src/components/buttons.js";
import { shuffle } from "./src/utils/index.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ],
});

const owners = new Map();
const interactions = new Map();
const game = new Map();

client.once("ready", async () => {
  client.application.commands
    .set([
      {
        name: "데덴찌",
        type: ApplicationCommandType.ChatInput,
        description: "팀 정하기를 시작합니다.",
        options: [
          {
            name: "주제",
            type: ApplicationCommandOptionType.String,
            description: "팀 나누기 주제를 정해주세요.",
          },
        ],
      },
      {
        name: "정보",
        type: ApplicationCommandType.ChatInput,
        description: "봇 정보를 확인합니다.",
      },
      {
        name: "버그",
        type: ApplicationCommandType.ChatInput,
        description: "버그를 말해줘요!",
        options: [
          {
            name: "문제요약",
            type: ApplicationCommandOptionType.String,
            description: "어떤게 안되는지 적어주세요.",
          },
        ],
      },
    ])
    .catch(console.error);

  console.log("팀짜기 봇이 실행되었습니다.");
});

const MainEmbed = new EmbedBuilder()
  .setColor("DarkNavy")
  .setTitle("🙌 팀 나누기");

const SecondEmbed = new EmbedBuilder()
  .setColor("Blurple")
  .setTitle("🤝 인원 정하기");

const setDescriptionJoinCount = (joinCount) => {
  return MainEmbed.setDescription(
    `참여인원 수를 정해주세요.\n최대 12명까지 참여할 수 있습니다.\n\n게임 생성자만 설정이 가능합니다.\n\n**총 참여자 수**: ${joinCount}`
  );
};

const setDescriptionTeamCount = (joinCount, winCount) => {
  return SecondEmbed.setDescription(
    `한 팀에 들어갈 인원수를 정해주세요.\n최대 ${
      joinCount - 1
    }명 까지만 설정할 수 있습니다.\n\n게임 생성자만 설정이 가능합니다.\n\n**참여자 수**: ${joinCount}\n**팀당 인원 수**: ${winCount}`
  );
};

const setDescriptionJoinedPlayer = (playerList, winCount, joinCount) => {
  return MainEmbed.setDescription(
    `참석 여부를 결정 해주세요.\n최대 ${Math.floor(
      joinCount
    )}명 까지만 참가할 수 있습니다.\n
    \n**현재 참여자 수**: ${playerList.length}
    \n**현재 참여자**: ${playerList.map((item) => item, ", ")}
    \n**팀당 인원 수**: ${winCount}`
  );
};

const setPlayer = (interactionId, playerId, userName) => {
  const selectedGame = game.get(interactionId);

  if (!selectedGame.player.get(playerId)) {
    selectedGame.player.set(playerId, userName);
    selectedGame.playerCount++;
    selectedGame.playerList.push(userName);
    return true;
  } else {
    return false;
  }
};

const deletePlayer = (interactionId, playerId, userName) => {
  const selectedGame = game.get(interactionId);

  selectedGame.player.delete(playerId);
  selectedGame.playerCount--;
  selectedGame.playerList = selectedGame.playerList.filter(
    (item) => item !== userName
  );
};

client.on("interactionCreate", async (interaction) => {
  console.log(interaction);
  if (!interaction.isCommand()) return;
  const userId = interaction.user.id;
  if (interaction.commandName === "버그") {
    const reason =
      interaction.options.getString("문제요약") ?? "No reason provided";

    const BugInfoEmbed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("내가 어디가 아프죠?")
      .addFields([{ name: "증상", value: reason }])
      .addFields([{ name: "만든 사람 🧑‍💻", value: "<@282477766920765440>" }])
      .addFields([{ name: "고치는 사람 😇", value: "<@314742079559434250>" }])
      .setFooter({
        text: `👾멋진 피드백 제공자👾: ${interaction.user.username} | ${interaction.user.id}`,
      });

    return await interaction.reply({
      embeds: [BugInfoEmbed],
      content: `고쳐줘요! <@282477766920765440> <@314742079559434250>`,
    });
  }

  if (interaction.commandName === "정보") {
    const BotInfoEmbed = new EmbedBuilder()
      .setColor("2F3136")
      .setTitle("봇 정보")
      .addFields([
        { name: "개발자", value: "<@282477766920765440>" },
        { name: "버전", value: "0.0.2" },
      ])
      .setFooter({
        text: `정보 요청자: ${interaction.user.username} | ${interaction.user.id}`,
      });

    return await interaction.reply({ embeds: [BotInfoEmbed] });
  }

  if (interaction.commandName === "데덴찌") {
    const initGame = {
      player: new Map(),
      playerList: [],
      playerCount: 0,
      joinCount: 0,
      winCount: 0,
    };

    game.set(interaction.id, initGame);
    owners.set(userId, interaction.id);
    interactions.set(interaction.id, userId);

    return await interaction.reply({
      embeds: [setDescriptionJoinCount(game.get(interaction.id).joinCount)],
      components: [firstButtons],
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const userId = interaction.user.id;
  const userName = interaction.user.username;
  const receivedInteractionId = interaction.message.interaction.id;

  if (interaction.customId === "add") {
    if (owners.get(userId) !== receivedInteractionId) return;
    if (game.get(receivedInteractionId).joinCount < 1) {
      game.get(receivedInteractionId).joinCount++;
      return await interaction.update({
        embeds: [
          setDescriptionJoinCount(game.get(receivedInteractionId).joinCount),
        ],
        components: [blockStartButtons],
      });
    }
    if (game.get(receivedInteractionId).joinCount == 11) {
      game.get(receivedInteractionId).joinCount++;
      return await interaction.update({
        embeds: [
          setDescriptionJoinCount(game.get(receivedInteractionId).joinCount),
        ],
        components: [blockAddButtons],
      });
    }
    if (game.get(receivedInteractionId).joinCount >= 0) {
      game.get(receivedInteractionId).joinCount++;
      return await interaction.update({
        embeds: [
          setDescriptionJoinCount(game.get(receivedInteractionId).joinCount),
        ],
        components: [defaultButtons],
      });
    }
  }

  if (interaction.customId === "del") {
    if (owners.get(userId) !== receivedInteractionId) return;

    if (game.get(receivedInteractionId).joinCount == 1) {
      game.get(receivedInteractionId).joinCount--;
      return await interaction.update({
        embeds: [
          setDescriptionJoinCount(game.get(receivedInteractionId).joinCount),
        ],
        components: [firstButtons],
      });
    }

    if (game.get(receivedInteractionId).joinCount < 3) {
      game.get(receivedInteractionId).joinCount--;
      return await interaction.update({
        embeds: [
          setDescriptionJoinCount(game.get(receivedInteractionId).joinCount),
        ],
        components: [blockStartButtons],
      });
    }

    if (game.get(receivedInteractionId).joinCount <= 12) {
      game.get(receivedInteractionId).joinCount--;
      return await interaction.update({
        embeds: [
          setDescriptionJoinCount(game.get(receivedInteractionId).joinCount),
        ],
        components: [defaultButtons],
      });
    }
  }

  if (interaction.customId === "start") {
    if (owners.get(userId) !== receivedInteractionId) return;
    if (
      game.get(receivedInteractionId).joinCount >= 1 &&
      game.get(receivedInteractionId).joinCount <= 2
    ) {
      game.get(receivedInteractionId).winCount++;
      return interaction.update({
        embeds: [
          setDescriptionTeamCount(
            game.get(receivedInteractionId).joinCount,
            game.get(receivedInteractionId).winCount
          ),
        ],
        components: [minUserJoinedButtons],
      });
    } else {
      interaction.update({
        embeds: [
          setDescriptionTeamCount(
            game.get(receivedInteractionId).joinCount,
            game.get(receivedInteractionId).winCount
          ),
        ],
        components: [defaultTeamSetupButtons],
      });
    }
  }

  if (interaction.customId === "win_add") {
    if (owners.get(userId) !== receivedInteractionId) return;
    if (
      game.get(receivedInteractionId).winCount ==
      game.get(receivedInteractionId).joinCount - 2
    ) {
      game.get(receivedInteractionId).winCount++;
      return await interaction.update({
        embeds: [
          setDescriptionTeamCount(
            game.get(receivedInteractionId).joinCount,
            game.get(receivedInteractionId).winCount
          ),
        ],
        components: [blockWinAddButtons],
      });
    }

    game.get(receivedInteractionId).winCount++;
    return await interaction.update({
      embeds: [
        setDescriptionTeamCount(
          game.get(receivedInteractionId).joinCount,
          game.get(receivedInteractionId).winCount
        ),
      ],
      components: [winDefaultButtons],
    });
  }

  if (interaction.customId === "win_del") {
    if (owners.get(userId) !== receivedInteractionId) return;
    if (game.get(receivedInteractionId).winCount == 1) {
      game.get(receivedInteractionId).winCount--;
      return await interaction.update({
        embeds: [
          setDescriptionTeamCount(
            game.get(receivedInteractionId).joinCount,
            game.get(receivedInteractionId).winCount
          ),
        ],
        components: [defaultTeamSetupButtons],
      });
    }

    game.get(receivedInteractionId).winCount--;
    return await interaction.update({
      embeds: [
        setDescriptionTeamCount(
          game.get(receivedInteractionId).joinCount,
          game.get(receivedInteractionId).winCount
        ),
      ],
      components: [winDefaultButtons],
    });
  }

  if (interaction.customId === "join") {
    interaction.update({
      embeds: [
        setDescriptionTeamCount(
          game.get(receivedInteractionId).joinCount,
          game.get(receivedInteractionId).winCount
        ),
      ],
      components: [winJoinButtons],
    });
  }

  // pin
  if (interaction.customId === "join_add") {
    const selectedGame = game.get(receivedInteractionId);
    if (selectedGame.player.get(userId)) {
      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `중복 참여가 불가 합니다.\n ${userName}님은 이미 참석 하셨습니다.\n\n**현재 참여자**: ${selectedGame.playerList.map(
              (item) => item,
              ", "
            )}`
          ),
        ],
        components: [joinButtons],
      });
    }

    if (selectedGame.playerCount == 11) {
      setPlayer(receivedInteractionId, userId, userName);
      return await interaction.update({
        embeds: [
          setDescriptionJoinedPlayer(
            selectedGame.playerList,
            selectedGame.winCount,
            selectedGame.joinCount
          ),
        ],
        components: [blockJoinButtons],
      });
    }

    if (
      selectedGame.playerCount >= 0 &&
      selectedGame.joinCount >= selectedGame.playerCount
    ) {
      setPlayer(receivedInteractionId, userId, userName);
      return await interaction.update({
        embeds: [
          setDescriptionJoinedPlayer(
            selectedGame.playerList,
            selectedGame.winCount,
            selectedGame.joinCount
          ),
        ],
        components: [joinButtons],
      });
    }
  }

  if (interaction.customId === "join_del") {
    if (!selectedGame.player.get(userId)) {
      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `${userName}님은 참석자가 아닙니다. \n**현재 참여자 수**: ${
              selectedGame.playerList.length
            } \n**현재 참여자**: ${selectedGame.playerList.map(
              (item) => item,
              ", "
            )}`
          ),
        ],
        components: [joinButtons],
      });
    }

    if (
      selectedGame.playerCount >= 0 &&
      selectedGame.joinCount >= selectedGame.playerCount
    ) {
      deletePlayer(userId, userName);

      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `참석 여부를 결정 해주세요.\n최대 ${Math.floor(
              selectedGame.joinCount
            )}명 까지만 참가할 수 있습니다.\n
            \n**현재 참여자 수**: ${selectedGame.playerList.length}
            \n**현재 참여자**: ${selectedGame.playerList.map(
              (item) => item,
              ", "
            )}
            \n**팀당 인원 수**: ${selectedGame.winCount}`
          ),
        ],
        components: [joinButtons],
      });
    }
  }

  if (interaction.customId === "ladder_start") {
    if (owners.get(userId) !== receivedInteractionId) return;
    const selectedGame = game.get(receivedInteractionId);

    if (selectedGame.joinCount !== selectedGame.playerList.length) {
      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `참여자 수가 부족합니다.\n${Math.floor(
              selectedGame.joinCount - selectedGame.playerList.length
            )}명이 참석 여부를 결정해야 합니다.\n
            \n**현재 참여자 수**: ${selectedGame.playerList.length}
            \n**현재 참여자**: ${selectedGame.playerList.map(
              (item) => item,
              ", "
            )}
            \n**팀당 인원 수**: ${selectedGame.winCount}`
          ),
        ],
        components: [joinButtons],
      });
    } else {
      const arr = new Array();

      for (let count = 0; count < selectedGame.joinCount; ++count) {
        if (count < selectedGame.winCount) {
          arr.push("1팀");
        } else {
          arr.push("2팀");
        }
      }

      shuffle(arr);

      let text = "";
      for (let count = 0; count < selectedGame.playerList.length; ++count) {
        text += `${selectedGame.playerList[count]} - ${arr.shift()}\n`;
      }

      const Embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("팀나누기 결과")
        .setDescription(`${text}`);

      return await interaction.update({ embeds: [Embed], components: [] });
    }
  }
});

// 봇과 서버를 연결해주는 부분
client.login(token);
