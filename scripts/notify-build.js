import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

// Get build information
const getBuildInfo = () => {
  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  const commit = execSync('git rev-parse HEAD').toString().trim();
  const author = execSync('git log -1 --pretty=format:"%an"').toString().trim();
  const message = execSync('git log -1 --pretty=format:"%s"').toString().trim();
  const timestamp = new Date().toISOString();

  return {
    branch,
    commit,
    author,
    message,
    timestamp,
  };
};

// Send notification to Microsoft Teams
const notifyTeams = async (buildInfo, status) => {
  if (!TEAMS_WEBHOOK_URL) return;

  const color = status === 'success' ? '00ff00' : 'ff0000';
  const emoji = status === 'success' ? '✅' : '❌';

  const card = {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          type: 'AdaptiveCard',
          version: '1.0',
          body: [
            {
              type: 'TextBlock',
              text: `${emoji} Build ${status.toUpperCase()}`,
              size: 'large',
              weight: 'bolder',
            },
            {
              type: 'FactSet',
              facts: [
                { title: 'Branch', value: buildInfo.branch },
                { title: 'Commit', value: buildInfo.commit },
                { title: 'Author', value: buildInfo.author },
                { title: 'Message', value: buildInfo.message },
                { title: 'Time', value: buildInfo.timestamp },
              ],
            },
          ],
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
        },
      },
    ],
  };

  try {
    await fetch(TEAMS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
    console.log('✅ Notification sent to Teams');
  } catch (error) {
    console.error('❌ Failed to send notification to Teams:', error.message);
  }
};

// Send notification to Discord
const notifyDiscord = async (buildInfo, status) => {
  if (!DISCORD_WEBHOOK_URL) return;

  const color = status === 'success' ? 0x00ff00 : 0xff0000;
  const emoji = status === 'success' ? '✅' : '❌';

  const embed = {
    title: `${emoji} Build ${status.toUpperCase()}`,
    color,
    fields: [
      { name: 'Branch', value: buildInfo.branch, inline: true },
      { name: 'Commit', value: buildInfo.commit, inline: true },
      { name: 'Author', value: buildInfo.author, inline: true },
      { name: 'Message', value: buildInfo.message },
      { name: 'Time', value: buildInfo.timestamp },
    ],
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });
    console.log('✅ Notification sent to Discord');
  } catch (error) {
    console.error('❌ Failed to send notification to Discord:', error.message);
  }
};

// Send notification to Slack
const notifySlack = async (buildInfo, status) => {
  if (!SLACK_WEBHOOK_URL) return;

  const color = status === 'success' ? '#00ff00' : '#ff0000';
  const emoji = status === 'success' ? '✅' : '❌';

  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${emoji} Build ${status.toUpperCase()}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Branch:*\n${buildInfo.branch}` },
        { type: 'mrkdwn', text: `*Commit:*\n${buildInfo.commit}` },
        { type: 'mrkdwn', text: `*Author:*\n${buildInfo.author}` },
        { type: 'mrkdwn', text: `*Time:*\n${buildInfo.timestamp}` },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Message:*\n${buildInfo.message}`,
      },
    },
  ];

  try {
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    });
    console.log('✅ Notification sent to Slack');
  } catch (error) {
    console.error('❌ Failed to send notification to Slack:', error.message);
  }
};

// Main function to send notifications
const sendNotifications = async status => {
  const buildInfo = getBuildInfo();

  console.log('Sending build notifications...');
  await Promise.all([
    notifyTeams(buildInfo, status),
    notifyDiscord(buildInfo, status),
    notifySlack(buildInfo, status),
  ]);
  console.log('All notifications sent!');
};

// Export the function
export default sendNotifications;
