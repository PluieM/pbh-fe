import { MockMethod } from 'vite-plugin-mock'
import mockjs from 'mockjs'
const { Random } = mockjs

const banlogsMockAPI: MockMethod[] = [
  {
    url: '/api/banlogs',
    method: 'get',
    response: () => {
      return {
        pageIndex: 0,
        pageSize: 100,
        result: Array.from({ length: 100 })
          .fill(0)
          .map(() => {
            return {
              banAt: Number(Random.datetime('T')),
              unbanAt: Number(Random.datetime('T')),
              peerIp: Random.ip(),
              peerPort: Random.natural(1024, 65535),
              peerId: Random.string(10),
              peerClientName: Random.string(20),
              peerUploaded: Random.natural(),
              peerDownloaded: Random.natural(),
              peerProgress: Random.float(0, 1),
              torrentInfoHash: Random.guid().replace(/-/g, ''),
              torrentName: Random.title(5, 15),
              torrentSize: Random.natural(),
              module: Random.title(5, 10).replace(/\s/g, '.').toLowerCase(),
              description: Random.sentence()
            }
          }),
        total: 4
      }
    }
  },
  {
    url: '/api/maxbans',
    method: 'get',
    response: () => {
      return Array.from({ length: 4 })
        .fill(0)
        .map(() => {
          return {
            address: Random.ip(),
            count: Random.natural()
          }
        })
        .sort((a, b) => b.count - a.count)
    }
  }
]

export default banlogsMockAPI
