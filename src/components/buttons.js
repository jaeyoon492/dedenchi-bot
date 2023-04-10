import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";

export const firstButtons = new ActionRowBuilder()
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

export const defaultButtons = new ActionRowBuilder()
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

export const blockAddButtons = new ActionRowBuilder()
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
      .setLabel("팀원 수 설정")
      .setStyle(ButtonStyle.Primary)
  );

export const blockStartButtons = new ActionRowBuilder()
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
      .setDisabled(true)
  );

export const winDefaultButtons = new ActionRowBuilder()
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

export const blockJoinButtons = new ActionRowBuilder()
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

export const joinButtons = new ActionRowBuilder()
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

export const defaultTeamSetupButtons = new ActionRowBuilder()
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
      .setDisabled(true)
  );

export const minUserJoinedButtons = new ActionRowBuilder()
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
      .setDisabled(true)
      .setStyle(ButtonStyle.Success)
  )
  .addComponents(
    new ButtonBuilder()
      .setCustomId("ladder_start")
      .setLabel("팀 나누기 ✨")
      .setStyle(ButtonStyle.Primary)
  );

// export const userJoinFulledButtons = new ActionRowBuilder()
//   .addComponents(
//     new ButtonBuilder()
//       .setCustomId("win_del")
//       .setLabel("-")
//       .setStyle(ButtonStyle.Danger)
//       .setDisabled(true)
//   )
//   .addComponents(
//     new ButtonBuilder()
//       .setCustomId("win_add")
//       .setLabel("+")
//       .setStyle(ButtonStyle.Success)
//       .setDisabled(true)
//   )
//   .addComponents(
//     new ButtonBuilder()
//       .setCustomId("ladder_start")
//       .setLabel("팀 나누기 ✨")
//       .setStyle(ButtonStyle.Primary)
//   );

// export const blockDelButtons = new ActionRowBuilder()
//   .addComponents(
//     new ButtonBuilder()
//       .setCustomId("del")
//       .setLabel("-")
//       .setStyle(ButtonStyle.Danger)
//       .setDisabled(true)
//   )
//   .addComponents(
//     new ButtonBuilder()
//       .setCustomId("add")
//       .setLabel("+")
//       .setStyle(ButtonStyle.Success)
//   )
//   .addComponents(
//     new ButtonBuilder()
//       .setCustomId("start")
//       .setLabel("팀 나누기")
//       .setStyle(ButtonStyle.Primary)
//   );

export const blockWinAddButtons = new ActionRowBuilder()
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

// export const blockWinDelButtons = new ActionRowBuilder()
//   .addComponents(
//     new ButtonBuilder()
//       .setCustomId("win_del")
//       .setLabel("-")
//       .setStyle(ButtonStyle.Danger)
//       .setDisabled(true)
//   )
//   .addComponents(
//     new ButtonBuilder()
//       .setCustomId("win_add")
//       .setLabel("+")
//       .setStyle(ButtonStyle.Success)
//   )
//   .addComponents(
//     new ButtonBuilder()
//       .setCustomId("join")
//       .setLabel("참석 투표 🤚")
//       .setStyle(ButtonStyle.Primary)
//   );

export const winJoinButtons = new ActionRowBuilder()
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
