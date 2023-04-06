const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ButtonStyle,
} = require("discord.js");
const { token } = require("./config.json");

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
    ])
    .catch(console.error);

  console.log("팀짜기 봇이 실행되었습니다.");
});

// 당첨값 무작위 배열 알고리즘
function shuffle(array) {
  for (let index = array.length - 1; index > 0; index--) {
    const randomPosition = Math.floor(Math.random() * (index + 1));
    const temporary = array[index];

    array[index] = array[randomPosition];
    array[randomPosition] = temporary;
  }
}

let player = new Map();
let playerList = [];

let joinCount = 0;
let winCount = 0;
let UserNumCount = 0;
let UserWinCount = 0;
let PlayerNumCount = 0;

let CommandOwner = "";

const MainEmbed = new EmbedBuilder()
  .setColor("DarkNavy")
  .setTitle("🙌 팀 나누기");

const defaultButtons = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId("del")
      .setLabel("-")
      .setStyle(ButtonStyle.Danger)
  )
  .addComponents(
    new ButtonBuilder()
      .setCustomId("add")
      .setLabel("+")
      .setStyle(ButtonStyle.Success)
  )
  .addComponents(
    new ButtonBuilder()
      .setCustomId("start")
      .setLabel("팀원 수 설정")
      .setStyle(ButtonStyle.Primary)
  );

const windefaultButtons = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId("win_del")
      .setLabel("-")
      .setStyle(ButtonStyle.Danger)
  )
  .addComponents(
    new ButtonBuilder()
      .setCustomId("win_add")
      .setLabel("+")
      .setStyle(ButtonStyle.Success)
  )
  .addComponents(
    new ButtonBuilder()
      .setCustomId("join")
      .setLabel("참석 투표 🤚")
      .setStyle(ButtonStyle.Primary)
  );

const blockJoinButtons = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId("join_del")
      .setLabel("불참")
      .setStyle(ButtonStyle.Danger)
  )
  .addComponents(
    new ButtonBuilder()
      .setCustomId("join_add")
      .setLabel("참석")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true)
  )
  .addComponents(
    new ButtonBuilder()
      .setCustomId("ladder_start")
      .setLabel("팀 나누기 ✨")
      .setStyle(ButtonStyle.Primary)
  );

const joinButtons = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId("join_del")
      .setLabel("불참")
      .setStyle(ButtonStyle.Danger)
  )
  .addComponents(
    new ButtonBuilder()
      .setCustomId("join_add")
      .setLabel("참석")
      .setStyle(ButtonStyle.Success)
  )
  .addComponents(
    new ButtonBuilder()
      .setCustomId("ladder_start")
      .setLabel("팀 나누기 ✨")
      .setStyle(ButtonStyle.Primary)
  );

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

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

    const FirstButtons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("del")
          .setLabel("-")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("add")
          .setLabel("+")
          .setStyle(ButtonStyle.Success)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("start")
          .setLabel("팀원 수 설정")
          .setDisabled(true)
          .setStyle(ButtonStyle.Primary)
      );

    await interaction.reply({
      embeds: [
        MainEmbed.setDescription(
          `참여인원 수를 정해주세요.\n최대 12명까지 참여할 수 있습니다.\n\n게임 생성자만 설정이 가능합니다.\n\n**총 참여자 수**: 0`
        ),
      ],
      components: [FirstButtons],
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  const UserId = interaction.user.id;
  const userName = interaction.user.username;

  if (!interaction.isButton()) return;

  UserNumCount = joinCount;
  UserWinCount = winCount;

  const SecondEmbed = new EmbedBuilder()
    .setColor("Blurple")
    .setTitle("🤝 팀나누기")
    .setDescription(
      `한 팀에 들어갈 인원수를 정해주세요.\n최대 ${
        UserNumCount - 1
      }명 까지만 설정할 수 있습니다.\n\n게임 생성자만 설정이 가능합니다.\n\n**참여자 수**: ${UserNumCount}\n**팀당 인원 수**: ${UserWinCount}`
    );

  if (interaction.customId === "add") {
    if (UserId != CommandOwner) return;
    if (UserNumCount == 11) {
      const delAddButtons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("del")
            .setLabel("-")
            .setStyle(ButtonStyle.Danger)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("add")
            .setLabel("+")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("start")
            .setLabel("시작")
            .setStyle(ButtonStyle.Primary)
        );

      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `참여인원 수를 정해주세요.\n최대 12명까지 참여할 수 있습니다.\n\n게임 생성자만 설정이 가능합니다.\n\n**총 참여자 수**: ${joinCount}`
          ),
        ],
        components: [delAddButtons],
      });
    }
    if (UserNumCount >= 0) {
      joinCount++;
      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `참여인원 수를 정해주세요.\n최대 12명까지 참여할 수 있습니다.\n\n게임 생성자만 설정이 가능합니다.\n\n**총 참여자 수**: ${joinCount}`
          ),
        ],
        components: [defaultButtons],
      });
    }
  }
  if (interaction.customId === "del") {
    if (UserId != CommandOwner) return;
    if (UserNumCount == 3) {
      joinCount--;
      const delAddButtons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("del")
            .setLabel("-")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("add")
            .setLabel("+")
            .setStyle(ButtonStyle.Success)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("start")
            .setLabel("시작")
            .setStyle(ButtonStyle.Primary)
        );
      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `참여인원 수를 정해주세요.\n최대 12명까지 참여할 수 있습니다.\n\n게임 생성자만 설정이 가능합니다.\n\n**총 참여자 수**: ${joinCount}`
          ),
        ],
        components: [delAddButtons],
      });
    }
    if (UserNumCount <= 12) {
      joinCount--;
      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `참여인원 수를 정해주세요.\n최대 12명까지 참여할 수 있습니다.\n\n게임 생성자만 설정이 가능합니다.\n\n**총 참여자 수**: ${joinCount}`
          ),
        ],
        components: [defaultButtons],
      });
    }
  }

  if (interaction.customId === "start") {
    if (UserId != CommandOwner) return;
    if (UserNumCount <= 2) {
      const nothingButtons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("win_del")
            .setLabel("-")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("win_add")
            .setLabel("+")
            .setStyle(ButtonStyle.Success)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("ladder_start")
            .setLabel("팀 나누기 ✨")
            .setStyle(ButtonStyle.Primary)
        );
      return interaction.update({
        embeds: [SecondEmbed],
        components: [nothingButtons],
      });
    } else {
      const winFristButtons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("win_del")
            .setLabel("-")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("win_add")
            .setLabel("+")
            .setStyle(ButtonStyle.Success)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("join")
            .setLabel("참석 투표 🤚")
            .setStyle(ButtonStyle.Primary)
        );
      interaction.update({
        embeds: [SecondEmbed],
        components: [winFristButtons],
      });
    }
  }

  if (interaction.customId === "win_add") {
    if (UserId != CommandOwner) return;
    if (UserWinCount == UserNumCount - 1) {
      const delAddButtons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("win_del")
            .setLabel("-")
            .setStyle(ButtonStyle.Danger)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("win_add")
            .setLabel("+")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("join")
            .setLabel("참석 투표 🤚")
            .setStyle(ButtonStyle.Primary)
        );

      return await interaction.update({
        embeds: [
          SecondEmbed.setDescription(
            `한 팀에 들어갈 인원수를 정해주세요.\n최대 ${
              UserNumCount - 1
            }명 까지만 설정할 수 있습니다.\n\n**참여자 수**: ${UserNumCount}\n**팀당 인원 수**: ${winCount}`
          ),
        ],
        components: [delAddButtons],
      });
    }
    if (UserWinCount >= 0) {
      winCount++;
      // winCount.set(UserId, UserWinCount + 1);
      return await interaction.update({
        embeds: [
          SecondEmbed.setDescription(
            `한 팀에 들어갈 인원수를 정해주세요.\n최대 ${
              UserNumCount - 1
            }명 까지만 설정할 수 있습니다.\n\n**참여자 수**: ${UserNumCount}\n**팀당 인원 수**: ${winCount}`
          ),
        ],
        components: [windefaultButtons],
      });
    }
  }

  if (interaction.customId === "win_del") {
    if (UserId != CommandOwner) return;
    if (UserWinCount == 2) {
      // winCount--;
      const deldelButtons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("win_del")
            .setLabel("-")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("win_add")
            .setLabel("+")
            .setStyle(ButtonStyle.Success)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("join")
            .setLabel("참석 투표 🤚")
            .setStyle(ButtonStyle.Primary)
        );
      return await interaction.update({
        embeds: [
          SecondEmbed.setDescription(
            `한 팀에 들어갈 인원수를 정해주세요.\n최대 ${
              UserNumCount - 1
            }명 까지만 설정할 수 있습니다.\n\n**참여자 수**: ${UserNumCount}\n**팀당 인원 수**: ${winCount}`
          ),
        ],
        components: [deldelButtons],
      });
    }
    if (UserWinCount <= UserNumCount) {
      winCount--;
      return await interaction.update({
        embeds: [
          SecondEmbed.setDescription(
            `한 팀에 들어갈 인원수를 정해주세요.\n최대 ${
              UserNumCount - 1
            }명 까지만 설정할 수 있습니다.\n\n**참여자 수**: ${UserNumCount}\n**팀당 인원 수**: ${winCount}`
          ),
        ],
        components: [windefaultButtons],
      });
    }
  }

  if (interaction.customId === "join") {
    const winJoinButtons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("join_del")
          .setLabel("불참")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("join_add")
          .setLabel("참석")
          .setStyle(ButtonStyle.Success)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("ladder_start")
          .setLabel("팀 나누기 ✨")
          .setStyle(ButtonStyle.Primary)
      );
    interaction.update({
      embeds: [SecondEmbed],
      components: [winJoinButtons],
    });
  }

  // pin
  if (interaction.customId === "join_add") {
    console.log("UserNumCount", UserNumCount);
    console.log("PlayerNumCount", PlayerNumCount);
    if (PlayerNumCount >= 0 && UserNumCount >= PlayerNumCount) {
      if (!player.get(UserId)) {
        player.set(UserId, userName);
        PlayerNumCount++;
        playerList.push(userName);
      } else {
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
    }

    if (PlayerNumCount == 11) {
      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `참여인원 수를 정해주세요.\n최대 12명까지 참여할 수 있습니다.\n\n게임 생성자만 설정이 가능합니다.\n\n**참여자 수**: ${joinCount}`
          ),
        ],
        components: [blockJoinButtons],
      });
    }

    // pin
    return await interaction.update({
      embeds: [
        MainEmbed.setDescription(
          `참석 여부를 결정 해주세요.\n최대 ${Math.floor(
            UserNumCount
          )}명 까지만 참가할 수 있습니다.\n
          \n**현재 참여자 수**: ${playerList.length}
          \n**현재 참여자**: ${playerList.map((item) => item, ", ")}
          \n**팀당 인원 수**: ${UserWinCount}`
        ),
      ],
      components: [joinButtons],
    });
  }

  if (interaction.customId === "join_del") {
    if (PlayerNumCount >= 0 && UserNumCount >= PlayerNumCount) {
      if (player.get(UserId)) {
        player.delete(UserId);
        PlayerNumCount--;
        playerList = playerList.filter((item) => item !== userName);
      } else {
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
    }

    return await interaction.update({
      embeds: [
        MainEmbed.setDescription(
          `참석 여부를 결정 해주세요.\n최대 ${Math.floor(
            UserNumCount
          )}명 까지만 참가할 수 있습니다.\n
          \n**현재 참여자 수**: ${playerList.length}
          \n**현재 참여자**: ${playerList.map((item) => item, ", ")}
          \n**팀당 인원 수**: ${UserWinCount}`
        ),
      ],
      components: [joinButtons],
    });
  }

  if (interaction.customId === "ladder_start") {
    if (UserId != CommandOwner) return;
    if (UserNumCount !== playerList.length) {
      return await interaction.update({
        embeds: [
          MainEmbed.setDescription(
            `참여자 수가 부족합니다.\n${Math.floor(
              UserNumCount - playerList.length
            )}명이 참석 여부를 결정해야 합니다.\n
            \n**현재 참여자 수**: ${playerList.length}
            \n**현재 참여자**: ${playerList.map((item) => item, ", ")}
            \n**팀당 인원 수**: ${UserWinCount}`
          ),
        ],
        components: [joinButtons],
      });
    } else {
      const arr = new Array();

      for (let count = 0; count < UserNumCount; ++count) {
        if (count < UserWinCount) {
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
  PlayerNumCount = 0;
  UserNumCount = 0;
};

// 봇과 서버를 연결해주는 부분
client.login(token);
