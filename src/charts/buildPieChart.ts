import fs from 'fs';
import fetch, { Response } from 'node-fetch';
import QuickChart from 'quickchart-js';

import { TopicDuration } from '../types';
import { wrapToOutputsDirectory } from '../utils/createOutputsDirectory';
import config from '../wrappers/config';
import input from '../wrappers/input';
import interviewStructure from '../wrappers/interviewStructure';

const getTopicDurations = (topics: string[]): TopicDuration[] =>
  topics.reduce((curr: TopicDuration[], prev) => {
    let topicDuration: TopicDuration;

    if (prev.split('.').length > 1) {
      const keys: string[] = prev.split('.');
      const topLevelTopic: string = keys[0];

      topicDuration = interviewStructure.topics[topLevelTopic];
    } else {
      topicDuration = interviewStructure.topics[prev];
    }

    return curr.includes(topicDuration) ? [...curr] : [...curr, topicDuration];
  }, []);

const buildPieChart = async () => {
  console.log(`buildPieChart()`);

  const topicDurations = getTopicDurations(input.includedTopics);
  const interviewDuration = topicDurations.reduce((prev, curr) => prev + curr.durationMin, 0);

  const pieChart = new QuickChart();

  pieChart.setWidth(config.pieChart.width);
  pieChart.setConfig({
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: topicDurations.map(topicDuration => topicDuration.durationMin),
          backgroundColor: config.pieChart.dataColors,
          label: 'Main Dataset',
        },
      ],
      labels: topicDurations.map(topicDuration => topicDuration.label),
    },
    options: {
      title: {
        display: false,
      },
      legend: {
        display: true,
        align: 'center',
        labels: {
          fontColor: config.pieChart.fontColor,
          fontSize: config.pieChart.fontSize,
          fontStyle: config.pieChart.fontStyle,
        },
      },
      plugins: {
        datalabels: {
          display: true,
          font: {
            size: config.pieChart.fontSize,
            weight: config.pieChart.fontStyle,
          },
          color: config.pieChart.dataFontColor,
        },
        doughnutlabel: {
          labels: [
            {
              text: interviewDuration,
              font: {
                size: config.pieChart.centerFontSize,
                weight: config.pieChart.fontStyle,
              },
              color: config.pieChart.fontColor,
            },
            {
              text: 'min',
              font: {
                size: config.pieChart.fontSize,
                weight: config.pieChart.fontStyle,
              },
              color: config.pieChart.fontColor,
            },
          ],
        },
      },
    },
  });

  const response: Response = await fetch(pieChart.getUrl());

  fs.writeFileSync(wrapToOutputsDirectory(config.pieChartFilename), await response.buffer());
};

export { buildPieChart };
