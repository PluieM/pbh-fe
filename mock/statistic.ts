import { MockMethod } from 'vite-plugin-mock'
import mockjs from 'mockjs'
const { Random } = mockjs

const StatisticMockAPi: MockMethod[] = [
  {
    url: '/api/statistic',
    method: 'get',
    response: () => {
      return {
        peerUnbanCounter: Random.natural(0, 1000),
        peerBanCounter: Random.natural(0, 1000),
        checkCounter: Random.natural(0, 1000)
      }
    }
  },
  {
    url: '/api/banlist',
    method: 'get',
    response: () => {
      return Array.from({ length: 4 })
        .fill(0)
        .map(() => {
          return {
            address: Random.ip(),
            banMetadata: {
              peer: {
                address: {
                  ip: Random.ip(),
                  port: Random.natural(1024, 65536)
                },
                clientName: Random.pick([null, undefined, Random.name()]),
                id: Random.guid().replace(/-/g, ''),
                uploaded: Random.natural(),
                downloaded: Random.natural(),
                progress: Random.float(0, 1)
              },
              reverseLookup: Random.domain(),
              banAt: Number(Random.datetime('T')),
              unbanAt: Number(Random.datetime('T')),
              torrent: {
                name: Random.name(),
                hash: Random.guid().replace(/-/g, '')
              },
              description: Random.sentence()
            }
          }
        })
    }
  },
  {
    url: '/api/clientStatus',
    method: 'get',
    response: () => {
      return Array.from({ length: 4 })
        .fill(0)
        .map(() => {
          return {
            name: 'qbittorrent',
            peers: 34,
            torrents: 5,
            endpoint: 'https://nas.gaojianli.me:8443/qbt/api/v2',
            status: 'HEALTHY'
          }
        })
    }
  },
  {
    url: '/api/version',
    method: 'get',
    response: () => {
      return {
        version: '3.1.4',
        nativeImage: true,
        os: 'Linux',
        branch: 'master',
        commit: 'e2979757fa793695eadce3354a579a71840fc7a5',
        abbrev: 'e297975'
      }
    }
  }
]

export default StatisticMockAPi
