import { Emotion } from '@/types'

export const analysisAdviceConfig: {
  [key in Emotion]: {
    title: string
    content: string
  }[]
} = {
  [Emotion.NULL]: [],
  [Emotion.中性]: [
    {
      title: '保持现状',
      content: '中性情绪不需要特别的调节，只需保持现状即可。'
    },
    {
      title: '适当活动',
      content: '进行一些轻松的活动，如散步或阅读，保持心情平稳。'
    },
    {
      title: '观察自我',
      content: '通过自我反思和观察，了解自己在中性情绪下的表现和状态。'
    }
  ],
  [Emotion.平静]: [
    {
      title: '冥想与呼吸练习',
      content: '通过冥想和深呼吸保持平静状态。'
    },
    {
      title: '听音乐',
      content: '听一些舒缓的音乐，可以进一步巩固平静情绪。'
    },
    {
      title: '温和运动',
      content: '进行瑜伽或太极等温和的运动，有助于保持心情平和。'
    }
  ],
  [Emotion.快乐]: [
    {
      title: '分享快乐',
      content: '与朋友或家人分享你的快乐，可以增强幸福感。'
    },
    {
      title: '保持适度',
      content: '避免过度兴奋，保持适度的开心状态。'
    },
    {
      title: '记录美好时刻',
      content: '写日记或拍照记录下快乐的时刻，有助于长久保持好心情。'
    }
  ],
  [Emotion.悲伤]: [
    {
      title: '倾诉与交流',
      content: '找信任的人倾诉，表达自己的情感。'
    },
    {
      title: '转移注意力',
      content: '通过阅读、看电影或参与兴趣活动，转移注意力。'
    },
    {
      title: '适度表达',
      content: '允许自己适度表达悲伤情绪，如哭泣，这有助于情绪的释放和缓解。'
    }
  ],
  [Emotion.愤怒]: [
    {
      title: '深呼吸',
      content: '愤怒时先深呼吸，冷静下来再处理问题。'
    },
    {
      title: '运动发泄',
      content: '通过跑步、打拳等运动，释放多余的愤怒情绪。'
    },
    {
      title: '理性思考',
      content: '尝试从不同角度看待问题，理性分析，引导自己从愤怒中走出来。'
    }
  ],
  [Emotion.恐惧]: [
    {
      title: '认知重建',
      content: '通过理性分析，重新评估引起恐惧的事物，减少不必要的恐惧感。'
    },
    {
      title: '逐步面对',
      content: '逐步面对恐惧源，从小步骤开始，逐步适应。'
    },
    {
      title: '放松技巧',
      content: '学习和练习放松技巧，如冥想和渐进性肌肉放松。'
    }
  ],
  [Emotion.厌恶]: [
    {
      title: '避开厌恶源',
      content: '尽量避免接触引起厌恶的事物或环境。'
    },
    {
      title: '心理调整',
      content: '通过心理调整，减少对厌恶事物的负面反应。'
    },
    {
      title: '转移注意力',
      content: '将注意力转移到其他有兴趣的事情上，减轻厌恶感。'
    }
  ],
  [Emotion.惊讶]: [
    {
      title: '保持冷静',
      content: '遇到令人惊讶的事情时，先保持冷静，理性分析情况。'
    },
    {
      title: '接受变化',
      content: '接受生活中的意外和变化，培养适应能力。'
    },
    {
      title: '记录感受',
      content: '将惊讶的经历记录下来，作为生活中的有趣回忆。'
    }
  ]
}
