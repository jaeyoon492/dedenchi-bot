import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  Colors,
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

let player = new Map();
let playerList = [];
let playerCount = 0;

let joinCount = 0;
let winCount = 0;

let CommandOwner = "";

const MainEmbed = new EmbedBuilder()
  .setColor("DarkNavy")
  .setTitle("🙌 팀 나누기");

const SecondEmbed = new EmbedBuilder()
  .setColor("Blurple")
  .setTitle("🤝 인원 정하기");

const setDescriptionJoinCount = () => {
  return MainEmbed.setDescription(
    `참여인원 수를 정해주세요.\n최대 12명까지 참여할 수 있습니다.\n\n게임 생성자만 설정이 가능합니다.\n\n**총 참여자 수**: ${joinCount}`
  );
};

const setDescriptionTeamCount = () => {
  return SecondEmbed.setDescription(
    `한 팀에 들어갈 인원수를 정해주세요.\n최대 ${
      joinCount - 1
    }명 까지만 설정할 수 있습니다.\n\n게임 생성자만 설정이 가능합니다.\n\n**참여자 수**: ${joinCount}\n**팀당 인원 수**: ${winCount}`
  );
};

const setDescriptionJoinedPlayer = () => {
  return MainEmbed.setDescription(
    `참석 여부를 결정 해주세요.\n최대 ${Math.floor(
      joinCount
    )}명 까지만 참가할 수 있습니다.\n
    \n**현재 참여자 수**: ${playerList.length}
    \n**현재 참여자**: ${playerList.map((item) => item, ", ")}
    \n**팀당 인원 수**: ${winCount}`
  );
};

const setPlayer = (userId, userName) => {
  player.set(userId, userName);
  playerCount++;
  playerList.push(userName);
};

const deletePlayer = (userId, userName) => {
  player.delete(userId);
  playerCount--;
  playerList = playerList.filter((item) => item !== userName);
};

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === "버그") {
    const reason =
      interaction.options.getString("문제요약") ?? "No reason provided";

    const BugInfoEmbed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("내가 어디가 아프죠?")
      .addFields([{ name: "증상", value: reason }])
      .addFields([
        { name: "멋진 담당자 👩‍💻", value: `<@314742079559434250>` },
        { name: "그냥 지나가는 행인", value: "행복맨" },
      ])
      .setFooter({
        text: `👾멋진 피드백 제공자👾: ${interaction.user.username} | ${interaction.user.id}`,
      });

    return await interaction.reply({
      embeds: [BugInfoEmbed],
      content: `고쳐줘요! <@314742079559434250>`,
    });
  }

  if (interaction.commandName === "정보") {
    const BotInfoEmbed = new EmbedBuilder()
      .setColor("2F3136")
      .setTitle("봇 정보")
      .addFields([
        { name: "개발자", value: "재바리" },
        { name: "버전", value: "0.0.1" },
      ])
      .setFooter({
        text: `정보 요청자: ${interaction.user.username} | ${interaction.user.id}`,
      });

    return await interaction.reply({ embeds: [BotInfoEmbed] });
  }

  if (interaction.commandName === "데덴찌") {
    init();
    const UserId = interaction.user.id;
    CommandOwner = UserId;

    await interaction.reply({
      embeds: [setDescriptionJoinCount()],
      components: [firstButtons],
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  const UserId = interaction.user.id;
  const userName = interaction.user.username;

  if (!interaction.isButton()) return;

  if (interaction.customId === "add") {
    if (UserId != CommandOwner) return;
    if (joinCount < 1) {
      joinCount++;
      return await interaction.update({
        embeds: [setDescriptionJoinCount()],
        components: [blockStartButtons],
      });
    }
    if (joinCount == 11) {
      joinCount++;
      return await interaction.update({
        embeds: [setDescriptionJoinCount()],
        components: [blockAddButtons],
      });
    }
    if (joinCount >= 0) {
      joinCount++;
      return await interaction.update({
        embeds: [setDescriptionJoinCount()],
        components: [defaultButtons],
      });
    }
  }

  if (interaction.customId === "del") {
    if (UserId != CommandOwner) return;

    if (joinCount == 1) {
      joinCount--;
      return await interaction.update({
        embeds: [setDescriptionJoinCount()],
        components: [firstButtons],
      });
    }

    if (joinCount < 3) {
      joinCount--;
      return await interaction.update({
        embeds: [setDescriptionJoinCount()],
        components: [blockStartButtons],
      });
    }

    if (joinCount <= 12) {
      joinCount--;
      return await interaction.update({
        embeds: [setDescriptionJoinCount()],
        components: [defaultButtons],
      });
    }
  }

  if (interaction.customId === "start") {
    if (UserId != CommandOwner) return;
    if (joinCount >= 1 && joinCount <= 2) {
      winCount++;
      return interaction.update({
        embeds: [setDescriptionTeamCount()],
        components: [minUserJoinedButtons],
      });
    } else {
      interaction.update({
        embeds: [setDescriptionTeamCount()],
        components: [defaultTeamSetupButtons],
      });
    }
  }

  if (interaction.customId === "win_add") {
    if (UserId != CommandOwner) return;
    if (winCount == joinCount - 2) {
      winCount++;
      return await interaction.update({
        embeds: [setDescriptionTeamCount()],
        components: [blockWinAddButtons],
      });
    }

    winCount++;
    return await interaction.update({
      embeds: [setDescriptionTeamCount()],
      components: [winDefaultButtons],
    });
  }

  if (interaction.customId === "win_del") {
    if (UserId != CommandOwner) return;
    if (winCount == 1) {
      winCount--;
      return await interaction.update({
        embeds: [setDescriptionTeamCount()],
        components: [defaultTeamSetupButtons],
      });
    }

    winCount--;
    return await interaction.update({
      embeds: [setDescriptionTeamCount()],
      components: [winDefaultButtons],
    });
  }

  if (interaction.customId === "join") {
    interaction.update({
      embeds: [setDescriptionTeamCount()],
      components: [winJoinButtons],
    });
  }

  // pin
  if (interaction.customId === "join_add") {
    console.log("playerCount", playerCount);

    if (player.get(UserId)) {
      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `중복 참여가 불가 합니다.\n ${userName}님은 이미 참석 하셨습니다.\n\n**현재 참여자**: ${playerList.map(
              (item) => item,
              ", "
            )}`
          ),
        ],
        components: [joinButtons],
      });
    }

    if (playerCount == 11) {
      setPlayer(UserId, userName);
      return await interaction.update({
        embeds: [setDescriptionJoinedPlayer()],
        components: [blockJoinButtons],
      });
    }

    if (playerCount >= 0 && joinCount >= playerCount) {
      setPlayer(UserId, userName);
      return await interaction.update({
        embeds: [setDescriptionJoinedPlayer()],
        components: [joinButtons],
      });
    }
  }

  if (interaction.customId === "join_del") {
    if (!player.get(UserId)) {
      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `${userName}님은 참석자가 아닙니다. \n**현재 참여자 수**: ${
              playerList.length
            } \n**현재 참여자**: ${playerList.map((item) => item, ", ")}`
          ),
        ],
        components: [joinButtons],
      });
    }

    if (playerCount >= 0 && joinCount >= playerCount) {
      deletePlayer(UserId, userName);

      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `참석 여부를 결정 해주세요.\n최대 ${Math.floor(
              joinCount
            )}명 까지만 참가할 수 있습니다.\n
            \n**현재 참여자 수**: ${playerList.length}
            \n**현재 참여자**: ${playerList.map((item) => item, ", ")}
            \n**팀당 인원 수**: ${winCount}`
          ),
        ],
        components: [joinButtons],
      });
    }
  }

  if (interaction.customId === "ladder_start") {
    if (UserId != CommandOwner) return;
    if (joinCount !== playerList.length) {
      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `참여자 수가 부족합니다.\n${Math.floor(
              joinCount - playerList.length
            )}명이 참석 여부를 결정해야 합니다.\n
            \n**현재 참여자 수**: ${playerList.length}
            \n**현재 참여자**: ${playerList.map((item) => item, ", ")}
            \n**팀당 인원 수**: ${winCount}`
          ),
        ],
        components: [joinButtons],
      });
    } else {
      const arr = new Array();

      for (let count = 0; count < joinCount; ++count) {
        if (count < winCount) {
          arr.push("1팀");
        } else {
          arr.push("2팀");
        }
      }

      shuffle(arr);

      let text = "";
      for (let count = 0; count < playerList.length; ++count) {
        text += `${playerList[count]} - ${arr.shift()}\n`;
      }

      const Embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("팀나누기 결과")
        .setDescription(`${text}`);

      init();
      return await interaction.update({ embeds: [Embed], components: [] });
    }
  }
});

const init = () => {
  player.clear();
  playerList = [];
  winCount = 0;
  joinCount = 0;
  playerCount = 0;
};

// 봇과 서버를 연결해주는 부분
client.login(token);
