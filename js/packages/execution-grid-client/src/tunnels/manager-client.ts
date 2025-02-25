import {type TunnelManager, type TunnelManagerSettings} from './manager'
import {makeTunnelManagerServerProcess} from './manager-server'
import {makeSocket} from '@applitools/socket'
import {createConnection} from 'net'

export async function makeTunnelManagerClient({
  settings,
}: {settings?: TunnelManagerSettings} = {}): Promise<TunnelManager> {
  const path =
    process.env.APPLITOOLS_TUNNEL_MANAGER_SOCK ||
    (process.platform === 'win32' ? '\\\\.\\pipe\\applitools-tunnel-manager' : '/tmp/applitools-tunnel-manager.sock')
  const socket = makeSocket(createConnection({path}), {transport: 'ipc'})
  socket.once('error', async (error: Error & {code: string}) => {
    if (['ECONNREFUSED', 'ENOENT'].includes(error.code)) {
      await makeTunnelManagerServerProcess({settings, path, unlink: error.code === 'ECONNREFUSED'})
      socket.use(createConnection({path}))
    }
  })
  socket.once('ready', () => socket.target.unref())

  return {
    create: (options: any) => socket.request('Tunnel.create', options),
    destroy: (options: any) => socket.request('Tunnel.destroy', options),
    acquire: (options: any) => socket.request('Tunnel.acquire', options),
    release: (options: any) => socket.request('Tunnel.release', options),
  }
}
