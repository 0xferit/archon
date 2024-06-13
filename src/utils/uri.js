/* eslint-disable no-fallthrough */
export const getURISuffix = uri => uri.split('/').pop()

export const getURIProtocol = uri => {
  const uriParts = uri.replace(':', '').split('/')
  switch (uri.substr(0, 1)) {
    case '/':
      return uriParts[1]
    default:
      return uriParts[0]
  }
}

export const getHttpUri = (uri, ipfsGateway) => {
  const protocol = getURIProtocol(uri)
  let preValidated = false
  switch (protocol) {
    case 'http':
      break
    case 'https': {
      if (ipfsGateway === 'https://ipfs.kleros.io') preValidated = true
      break
    } case 'fs':
      // check to see if fs is appended by /ipfs/
      if (uri.includes('/ipfs/')) uri = uri.split(':/').pop()
      else throw new Error(`Unrecognized protocol ${protocol}`)
    case 'ipfs':
      uri = uri.replace('://', ':/')
      if (uri.startsWith('/ipfs/') || uri.startsWith('ipfs/')) {
        if (uri.startsWith('/')) uri = uri.substring(1)
        uri = `${ipfsGateway}/${uri}`
      } else if (uri.startsWith('ipfs:/')) {
        uri = `${ipfsGateway}/ipfs/${uri.split(':/').pop()}`
      } else {
        throw new Error(`Unrecognized protocol ${protocol}`)
      }

      preValidated = true
      break
    case 'ipns':
      // TODO we cannot validate these right now
      break
    default:
      throw new Error(`Unrecognized protocol ${protocol}`)
  }

  return {
    uri,
    preValidated
  }
}
